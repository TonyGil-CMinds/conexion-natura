/**
 * Sube las fotos de la galería a R2 y deja el índice que lee la página.
 *
 *   npm run galeria:subir        # solo lista lo que subiría
 *   npm run galeria:subir:send   # sube de verdad
 *
 * Son dos scripts y no un argumento porque npm 11 se come el `-- --send`.
 *
 * Lee `public/img/<Álbum>/Preview` (lo que se ve) y `.../Originals` (lo que se
 * descarga), los empareja por nombre (`pairSources`) y sube por cada foto la
 * preview, una miniatura que genera aquí y el original. Las `.webp` de
 * `Originals` se ignoran. Al final sube `galeria/manifest.json`, que es lo que
 * lee la página: añadir fotos es volver a ejecutar esto, sin desplegar.
 *
 * **Vídeos.** La preview es un `.mp4` ligero y el original, el que se descarga.
 * Hace falta además una **portada**: una imagen con el mismo nombre que el `.mp4`
 * de `Preview` (`Recap - 720p.mp4` → `Recap - 720p.jpg`). Es lo que se disuelve
 * en la galería y lo que sale al compartir el enlace.
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
  pairSources,
  photoKeys,
  type GalleryAlbum,
  type GalleryManifest,
  type ManifestPhoto,
  type OriginalExt,
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
  const previews = await readdir(path.join(folder, source.preview));
  const originals = await readdir(path.join(folder, source.originals));

  const photos: { manifest: ManifestPhoto; objects: Pending[] }[] = [];
  const skipped: string[] = [];

  for (const pair of pairSources(previews, originals)) {
    if (!pair.original || !pair.originalExt) {
      skipped.push(`${pair.preview}: sin original en ${source.originals}`);
      continue;
    }
    if (pair.kind === 'video' && !pair.poster) {
      skipped.push(`${pair.preview}: sin portada (una imagen con el mismo nombre en ${source.preview})`);
      continue;
    }

    const { id, originalExt } = pair;
    const keys = photoKeys(album, id, originalExt);
    const filename = downloadName(album, id, originalExt);
    const contentType = ORIGINAL_TYPES[originalExt as OriginalExt];

    const read = (dir: string, file: string) => readFile(path.join(folder, dir, file));
    const originalBody = await read(source.originals, pair.original);
    /**
     * La imagen que se ve. De una foto, su preview tal cual; de un vídeo, su
     * portada pasada a WebP, que es lo que espera la clave.
     */
    const previewBody =
      pair.kind === 'video'
        ? await sharp(await read(source.preview, pair.poster!)).webp({ quality: 85 }).toBuffer()
        : await read(source.preview, pair.preview);
    const thumbBody = await sharp(previewBody).resize({ width: GALLERY.thumbWidth }).webp({ quality: 72 }).toBuffer();
    const videoBody = pair.kind === 'video' ? await read(source.preview, pair.preview) : null;

    const size = async (body: Buffer) => {
      const meta = await sharp(body).metadata();
      return { width: meta.autoOrient?.width ?? meta.width ?? 0, height: meta.autoOrient?.height ?? meta.height ?? 0 };
    };
    const previewSize = await size(previewBody);
    // Las medidas de un vídeo no se leen sin ffprobe: valen las de su portada.
    const originalSize = pair.kind === 'video' ? previewSize : await size(originalBody);

    photos.push({
      manifest: {
        id,
        ...(pair.kind === 'video' ? { kind: 'video' as const } : {}),
        preview: { key: keys.preview, ...previewSize },
        thumb: { key: keys.thumb, ...(await size(thumbBody)) },
        ...(videoBody ? { video: { key: keys.video, bytes: videoBody.length } } : {}),
        original: { key: keys.original, ...originalSize, bytes: originalBody.length, filename },
      },
      objects: [
        { key: keys.preview, contentType: 'image/webp', cacheControl: CACHE_PHOTO, body: previewBody },
        { key: keys.thumb, contentType: 'image/webp', cacheControl: CACHE_PHOTO, body: thumbBody },
        ...(videoBody
          ? [{ key: keys.video, contentType: 'video/mp4', cacheControl: CACHE_PHOTO, body: videoBody }]
          : []),
        {
          key: keys.original,
          contentType,
          cacheControl: CACHE_PHOTO,
          contentDisposition: `attachment; filename="${filename}"`,
          body: originalBody,
        },
      ],
    });
  }

  return { photos, skipped };
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

  for (const [album, { photos, skipped }] of scanned) {
    const bytes = photos.flatMap((photo) => photo.objects).reduce((sum, object) => sum + object.body.length, 0);
    console.log(`\n${album}: ${photos.length} fotos, ${mb(bytes)}`);
    for (const reason of skipped) console.log(`  ⚠ ${reason}: no se sube`);
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
