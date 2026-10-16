import { VISIBLE_ALBUMS, isGalleryAlbum, type GalleryAlbum } from '../config/gallery';
import type { GalleryData } from './load-gallery';

/**
 * Qué pieza abrir según la URL (`?album=…&foto=…`).
 *
 * Lo que no encaje cae al primer álbum visible con fotos y a su primera pieza,
 * en vez de a una página vacía: un enlace viejo a una foto retirada —o a un
 * álbum oculto— abre la galería igual.
 */
export function resolveSelection(
  gallery: GalleryData,
  params: { album?: string | string[]; foto?: string | string[] },
): { album: GalleryAlbum; index: number } | null {
  const first = (value?: string | string[]) => (Array.isArray(value) ? value[0] : value);
  const wanted = first(params.album);
  const withPhotos = VISIBLE_ALBUMS.filter((album) => gallery[album].length > 0);
  if (!withPhotos.length) return null;

  const album = isGalleryAlbum(wanted) && withPhotos.includes(wanted) ? wanted : withPhotos[0];
  const index = gallery[album].findIndex((photo) => photo.id === first(params.foto));
  return { album, index: Math.max(index, 0) };
}
