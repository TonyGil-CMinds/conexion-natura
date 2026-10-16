import { readdir } from 'node:fs/promises';
import path from 'node:path';
import {
  GALLERY,
  GALLERY_ALBUMS,
  ORIGINAL_TYPES,
  downloadName,
  photoId,
  type GalleryAlbum,
  type GalleryManifest,
  type GalleryPhoto,
} from '../config/gallery';

export type GalleryData = Record<GalleryAlbum, GalleryPhoto[]>;

/**
 * Las fotos de la galería, por álbum.
 *
 * **Solo servidor**: lee el entorno y, en desarrollo, el disco.
 *
 * En producción salen del índice que el script de subida deja en el bucket, y
 * no de la lista de objetos: así añadir fotos es volver a subir, sin desplegar.
 * El índice se guarda en caché unos minutos.
 *
 * En desarrollo, sin R2 configurado —en local las claves no existen: en Vercel
 * son secretas—, se arma con las carpetas de `public/img`, para poder ver la
 * galería antes de subir nada.
 */
export async function loadGallery(): Promise<GalleryData | null> {
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, '');
  if (base) return fromManifest(base);
  if (process.env.NODE_ENV === 'development') return fromLocalFiles();
  return null;
}

/** La dirección del mismo dominio que reenvía a la clave del bucket. */
function proxied(key: string) {
  return `${GALLERY.proxyPath}/${key.slice(GALLERY.prefix.length + 1)}`;
}

async function fromManifest(base: string): Promise<GalleryData | null> {
  try {
    const response = await fetch(`${base}/${GALLERY.manifestKey}`, { next: { revalidate: 300 } });
    if (!response.ok) return null;
    const manifest = (await response.json()) as GalleryManifest;

    return Object.fromEntries(
      GALLERY_ALBUMS.map((album) => [
        album,
        (manifest.albums?.[album] ?? []).map((photo) => ({
          id: photo.id,
          preview: proxied(photo.preview.key),
          thumb: proxied(photo.thumb.key),
          /**
           * La descarga va **directa** al bucket y no por el reenvío: son
           * archivos de hasta 12 MB y no hace falta que pasen por Vercel. Se
           * descargan en vez de abrirse porque el script los sube con
           * `Content-Disposition: attachment`; el atributo `download` no
           * serviría, el navegador lo ignora en otro origen.
           */
          original: `${base}/${photo.original.key}`,
          filename: photo.original.filename,
          width: photo.preview.width,
          height: photo.preview.height,
        })),
      ]),
    ) as GalleryData;
  } catch {
    return null;
  }
}

async function fromLocalFiles(): Promise<GalleryData | null> {
  const { source } = GALLERY;
  const root = path.join(process.cwd(), source.dir);

  const albums = await Promise.all(
    GALLERY_ALBUMS.map(async (album) => {
      const folder = source.albums[album];
      const list = (dir: string) =>
        readdir(path.join(root, folder, dir)).catch(() => [] as string[]);
      const [previews, originals] = await Promise.all([list(source.preview), list(source.originals)]);

      const photos = previews
        .filter((file) => file.toLowerCase().endsWith('.webp'))
        .sort()
        .map((file): GalleryPhoto => {
          const name = file.replace(/\.webp$/i, '');
          const id = photoId(name);
          const original = originals.find((candidate) => {
            const [base, ext = ''] = candidate.split(/\.(?=[^.]+$)/);
            return base === name && ext.toLowerCase() in ORIGINAL_TYPES;
          });
          const preview = `/img/${folder}/${source.preview}/${file}`;
          const ext = original?.split('.').pop()?.toLowerCase() ?? 'webp';
          return {
            id,
            preview,
            thumb: preview,
            original: original ? `/img/${folder}/${source.originals}/${original}` : preview,
            filename: downloadName(album, id, ext),
          };
        });

      return [album, photos] as const;
    }),
  );

  return Object.fromEntries(albums) as GalleryData;
}
