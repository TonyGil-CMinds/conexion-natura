/**
 * Sube las fotos de la galería a R2 y deja el índice que lee la página.
 *
 *   npm run galeria:subir        # solo lista lo que subiría
 *   npm run galeria:subir:send   # sube de verdad
 *
 * Son dos scripts y no un argumento porque npm 11 se come el `-- --send`.
 *
 * Lee `public/img/<Álbum>/Preview` (lo que se ve) y `.../Originals` (lo que se
 * descarga), los empareja por nombre y sube tres objetos por foto: la preview,
 * una miniatura que genera aquí y el original. Las `.webp` de `Originals` se
 * ignoran. Al final sube `galeria/manifest.json`, que es lo que lee la página:
 * añadir fotos es volver a ejecutar esto, sin desplegar.
 *
 * **Quién firma.** Con las claves de R2 en `.env.local`, este mismo script. Sin
 * ellas —lo normal: en Vercel son secretas y `vercel env pull` las trae vacías—
 * las firma producción en `/api/galeria/firmar`, con `CEIBA_GALLERY_TOKEN`. En
 * los dos casos los archivos van directos de aquí al bucket.
 *
 * Lo que ya está subido con el mismo tamaño se salta: repetir es barato.
 */
import { config } from 'dotenv';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {
  GALLERY,
  GALLERY_ALBUMS,
  ORIGINAL_TYPES,
  downloadName,
  photoId,
  photoKeys,
  type GalleryAlbum,
  type GalleryManifest,
  type ManifestPhoto,
} from '../src/features/gallery/config/gallery';

config({ path: ['.env.local', '.env'], quiet: true });

const shouldSend = process.argv.includes('--send');

/** Un día: lo bastante para no volver a pedirlas y poco para corregir una foto. */
const CACHE_PHOTO = 'public, max-age=86400';
/** El índice cambia al subir: casi sin caché. */
const CACHE_MANIFEST = 'public, max-age=60';

type Pending = {
  key: string;
  contentType: string;
  cacheControl: string;
  contentDisposition?: string;
  body: Buffer;
};

type Signed = { key: string; uploadUrl: string; headers: Record<string, string> };

const mb = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

async function scanAlbum(album: GalleryAlbum) {
  const { source } = GALLERY;
  const folder = path.join(source.dir, source.albums[album]);
  const previews = (await readdir(path.join(folder, source.preview)))
    .filter((file) => file.toLowerCase().endsWith('.webp'))
    .sort();
  const originals = await readdir(path.join(folder, source.originals));

  const photos: { manifest: ManifestPhoto; objects: Pending[] }[] = [];
  const missing: string[] = [];

  for (const file of previews) {
    const name = file.replace(/\.webp$/i, '');
    const original = originals.find((candidate) => {
      const dot = candidate.lastIndexOf('.');
      return candidate.slice(0, dot) === name && candidate.slice(dot + 1).toLowerCase() in ORIGINAL_TYPES;
    });
    if (!original) {
      missing.push(file);
      continue;
    }

    const id = photoId(name);
    const ext = original.slice(original.lastIndexOf('.') + 1).toLowerCase() as keyof typeof ORIGINAL_TYPES;
    const keys = photoKeys(album, id, ext === 'jpeg' ? 'jpg' : ext);
    const filename = downloadName(album, id, ext === 'jpeg' ? 'jpg' : ext);

    const previewBody = await readFile(path.join(folder, source.preview, file));
    const originalBody = await readFile(path.join(folder, source.originals, original));
    const thumbBody = await sharp(previewBody).resize({ width: GALLERY.thumbWidth }).webp({ quality: 72 }).toBuffer();
    const [previewMeta, originalMeta, thumbMeta] = await Promise.all([
      sharp(previewBody).metadata(),
      sharp(originalBody).metadata(),
      sharp(thumbBody).metadata(),
    ]);
    const size = (meta: sharp.Metadata) => ({
      width: meta.autoOrient?.width ?? meta.width ?? 0,
      height: meta.autoOrient?.height ?? meta.height ?? 0,
    });

    photos.push({
      manifest: {
        id,
        preview: { key: keys.preview, ...size(previewMeta) },
        thumb: { key: keys.thumb, ...size(thumbMeta) },
        original: { key: keys.original, ...size(originalMeta), bytes: originalBody.length, filename },
      },
      objects: [
        { key: keys.preview, contentType: 'image/webp', cacheControl: CACHE_PHOTO, body: previewBody },
        { key: keys.thumb, contentType: 'image/webp', cacheControl: CACHE_PHOTO, body: thumbBody },
        {
          key: keys.original,
          contentType: ORIGINAL_TYPES[ext],
          cacheControl: CACHE_PHOTO,
          contentDisposition: `attachment; filename="${filename}"`,
          body: originalBody,
        },
      ],
    });
  }

  return { photos, missing };
}

/** Firma con las claves locales si las hay; si no, pide la firma a producción. */
async function sign(objects: Pending[]): Promise<{ publicBaseUrl: string; uploads: Signed[] }> {
  const requested = objects.map(({ key, contentType, cacheControl, contentDisposition }) => ({
    key,
    contentType,
    cacheControl,
    contentDisposition,
  }));

  if (process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
    const { signGalleryUpload, publicBaseUrl } = await import('../src/lib/r2');
    return {
      publicBaseUrl: publicBaseUrl(),
      uploads: await Promise.all(requested.map((object) => signGalleryUpload(object))),
    };
  }

  const token = process.env.CEIBA_GALLERY_TOKEN;
  const site = process.env.GALLERY_SIGNER_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
  if (!token || !site) {
    throw new Error(
      'Sin claves de R2 en .env.local hace falta CEIBA_GALLERY_TOKEN y NEXT_PUBLIC_SITE_URL (o GALLERY_SIGNER_URL) para que firme producción.',
    );
  }
  const endpoint = site.includes('/api/') ? site : `${site.replace(/\/+$/, '')}/api/galeria/firmar`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    body: JSON.stringify({ objects: requested }),
  });
  if (!response.ok) {
    throw new Error(`La firma falló en ${endpoint}: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

/** Sube con la URL firmada, salvo que ya esté arriba con el mismo tamaño. */
async function put(object: Pending, signed: Signed, publicBaseUrl: string) {
  const head = await fetch(`${publicBaseUrl}/${object.key}`, { method: 'HEAD' }).catch(() => null);
  if (head?.ok && Number(head.headers.get('content-length')) === object.body.length) {
    return 'skipped' as const;
  }
  const response = await fetch(signed.uploadUrl, {
    method: 'PUT',
    headers: signed.headers,
    body: new Uint8Array(object.body),
  });
  if (!response.ok) throw new Error(`${object.key}: ${response.status} ${await response.text()}`);
  return 'uploaded' as const;
}

/** De cuatro en cuatro: los originales de Tanusas pesan 10 MB cada uno. */
async function pool<T>(items: T[], size: number, run: (item: T) => Promise<void>) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: Math.min(size, queue.length) }, async () => {
      for (let item = queue.shift(); item !== undefined; item = queue.shift()) await run(item);
    }),
  );
}

async function main() {
  const manifest: GalleryManifest = {
    version: 1,
    updatedAt: new Date().toISOString(),
    albums: { quito: [], tanusas: [] },
  };
  const scanned = await Promise.all(GALLERY_ALBUMS.map(async (album) => [album, await scanAlbum(album)] as const));

  for (const [album, { photos, missing }] of scanned) {
    const bytes = photos.flatMap((photo) => photo.objects).reduce((sum, object) => sum + object.body.length, 0);
    console.log(`\n${album}: ${photos.length} fotos, ${mb(bytes)}`);
    for (const file of missing) console.log(`  ⚠ ${file}: sin original en ${GALLERY.source.originals}, no se sube`);
    manifest.albums[album] = photos.map((photo) => photo.manifest);
  }

  if (!shouldSend) {
    console.log('\nNo se subió nada. Usa `npm run galeria:subir:send` para subirlas.');
    return;
  }

  let uploaded = 0;
  let skipped = 0;
  let publicBase = '';

  for (const [album, { photos }] of scanned) {
    const objects = photos.flatMap((photo) => photo.objects);
    if (!objects.length) continue;
    // Se firma por álbum y justo antes de subir: las firmas caducan a los 15 min.
    const { publicBaseUrl, uploads } = await sign(objects);
    publicBase = publicBaseUrl;
    const byKey = new Map(uploads.map((upload) => [upload.key, upload]));

    console.log(`\nSubiendo ${album}…`);
    await pool(objects, 4, async (object) => {
      const result = await put(object, byKey.get(object.key)!, publicBaseUrl);
      if (result === 'skipped') skipped += 1;
      else {
        uploaded += 1;
        console.log(`  ↑ ${object.key} (${mb(object.body.length)})`);
      }
    });
  }

  // El índice va el último: hasta que no está todo arriba, la página no lo ve.
  const body = Buffer.from(JSON.stringify(manifest, null, 2));
  const index: Pending = { key: GALLERY.manifestKey, contentType: 'application/json', cacheControl: CACHE_MANIFEST, body };
  const { uploads } = await sign([index]);
  await fetch(uploads[0].uploadUrl, { method: 'PUT', headers: uploads[0].headers, body: new Uint8Array(body) }).then(
    async (response) => {
      if (!response.ok) throw new Error(`${index.key}: ${response.status} ${await response.text()}`);
    },
  );

  console.log(`\n✅ ${uploaded} subidos, ${skipped} ya estaban. Índice: ${publicBase}/${GALLERY.manifestKey}`);
}

main().catch((error) => {
  console.error('\n❌', error instanceof Error ? error.message : error);
  process.exit(1);
});
