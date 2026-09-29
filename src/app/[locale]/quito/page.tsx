import type { Metadata } from 'next';
import { LoaderGate } from '@/features/loader';
import { QUITO } from '@/config/quito';
import { notFound } from 'next/navigation';
import { QuitoAbout, QuitoChrome, QuitoForum, QuitoHero } from '@/features/quito';
import { getDictionary, isLocale } from '@/i18n';
import { OG_IMAGES, socialMeta } from '@/config/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const { title, description } = t.meta.quito;
  return {
    title,
    description,
    ...socialMeta({
      // Al compartir no hay plantilla que ponga el sufijo: va escrito.
      title: `${title} - ${t.meta.siteName}`,
      description,
      locale,
      siteName: t.meta.siteName,
      // La suya: la sección tiene identidad propia dentro del sitio, y al
      // compartirla la portada del sitio enseñaría otra cosa.
      image: OG_IMAGES.quito,
    }),
  };
}

/**
 * Portada de la sección de Quito.
 *
 * No usa `PageFrame`: aquí no hay retícula de filetes que alinear, sino una
 * columna que se lee de arriba abajo, y el pie es el suyo y no el del sitio. Lo
 * que sí comparte es el armazón de la sección (`QuitoChrome`), que es lo que
 * fija el tema claro y pone barra y pie.
 *
 * Comparte el loader de la portada, una vez por pestaña.
 */
export default async function QuitoPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <LoaderGate preload={Object.values(QUITO.hero).map((asset) => asset.src)}>
      <QuitoChrome locale={locale} copy={t.quito} header={t.header} hasHero hasJoin>
        <QuitoHero locale={locale} copy={t.quito.hero} joinCopy={t.quito.join} />
        <QuitoAbout copy={t.quito.about} />
        <QuitoForum locale={locale} copy={t.quito.forum} />
      </QuitoChrome>
    </LoaderGate>
  );
}
