import { LoaderGate } from '@/features/loader';
import { HOME_PRELOAD, HomeChrome, HomeHero } from '@/features/home';
import { getDictionary, isLocale } from '@/i18n';
import { notFound } from 'next/navigation';

/**
 * Portada. Desde que el acto pasó lleva la piel de `/quito` —paleta, barra y
 * rótulo— y su llamada es la galería, no el registro.
 *
 * Es solo el hero: cabe en una pantalla y no lleva pie.
 */
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <LoaderGate preload={HOME_PRELOAD}>
      <HomeChrome locale={locale} copy={t.home} nav={t.nav} header={t.header}>
        <HomeHero locale={locale} copy={t.home.hero} />
      </HomeChrome>
    </LoaderGate>
  );
}
