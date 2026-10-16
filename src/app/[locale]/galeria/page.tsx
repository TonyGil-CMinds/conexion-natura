import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { GalleryViewer, VISIBLE_ALBUMS, loadGallery, resolveSelection } from '@/features/gallery';
import { getDictionary, isLocale } from '@/i18n';
import { socialMeta } from '@/config/seo';

type SearchParams = { album?: string | string[]; foto?: string | string[] };
type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<SearchParams>;
};

/**
 * Al compartir una foto, la tarjeta del enlace es **esa foto**: quien lo recibe
 * ve lo que va a abrir. Sin foto en la URL, la imagen del sitio.
 */
export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const { title, description } = t.meta.gallery;

  const query = await searchParams;
  const gallery = query.foto ? await loadGallery() : null;
  const selection = gallery ? resolveSelection(gallery, query) : null;
  const photo = gallery && selection ? gallery[selection.album][selection.index] : null;

  return {
    title,
    description,
    ...socialMeta({
      title: `${title} - ${t.meta.siteName}`,
      description,
      locale,
      siteName: t.meta.siteName,
      image: photo ? { url: photo.preview, width: photo.width, height: photo.height } : undefined,
    }),
  };
}

/**
 * La galería. Va sin la barra del sitio (`HeaderGate`): la foto ocupa la
 * pantalla y la fila de arriba es la suya —glifo, álbumes y acciones—.
 *
 * Sin loader: es la entrada de las portadas, no de cada ruta.
 */
export default async function GalleryPage({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  const gallery = await loadGallery();
  const selection = gallery ? resolveSelection(gallery, await searchParams) : null;
  const albums = gallery
    ? VISIBLE_ALBUMS.filter((album) => gallery[album].length > 0).map((album) => ({
        key: album,
        photos: gallery[album],
      }))
    : [];

  return (
    <GalleryViewer
      locale={locale}
      copy={t.gallery}
      header={t.header}
      albums={albums}
      initial={selection ?? { album: VISIBLE_ALBUMS[0], index: 0 }}
    />
  );
}
