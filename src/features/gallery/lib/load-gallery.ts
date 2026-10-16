import { readdir } from 'node:fs/promises';
import path from 'node:path';
import {
  GALLERY,
  GALLERY_ALBUMS,
  downloadName,
  pairSources,
  type GalleryAlbum,
  type GalleryManifest,
  type GalleryPhoto,
} from '../config/gallery';

export type GalleryData = Record<GalleryAlbum, GalleryPhoto[]>;

/**
 * Las piezas de la galería, por álbum: fotos y vídeos.
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
 *
 * Devuelve todos los álbumes, también los ocultos: cuáles se enseñan lo decide
 * quien pinta (`VISIBLE_ALBUMS`).
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
           * El vídeo se reproduce **directo** del bucket: un `<video>` no pide
           * CORS —solo una textura lo pide— y así sus megas no pasan por Vercel.
           */
          video: photo.video ? `${base}/${photo.video.key}` : undefined,
          /**
           * La descarga también va directa: son archivos de hasta cientos de MB.
           * Se descargan en vez de abrirse porque el script los sube con
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
      const list = (dir: string) => readdir(path.join(root, folder, dir)).catch(() => [] as string[]);
      const [previews, originals] = await Promise.all([list(source.preview), list(source.originals)]);
      const url = (dir: string, file: string) => encodeURI(`/img/${folder}/${dir}/${file}`);

      const photos = pairSources(previews, originals)
        // Sin original no hay qué descargar, y un vídeo sin portada no tiene qué disolver.
        .filter((pair) => pair.original && (pair.kind === 'photo' || pair.poster))
        .map((pair): GalleryPhoto => {
          const image = url(source.preview, pair.kind === 'video' ? pair.poster! : pair.preview);
          return {
            id: pair.id,
            preview: image,
            thumb: image,
            video: pair.kind === 'video' ? url(source.preview, pair.preview) : undefined,
            original: url(source.originals, pair.original!),
            filename: downloadName(album, pair.id, pair.originalExt!),
          };
        });

      return [album, photos] as const;
    }),
  );

  return Object.fromEntries(albums) as GalleryData;
}
