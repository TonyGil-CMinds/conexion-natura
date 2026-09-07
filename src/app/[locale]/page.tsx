import { LoaderGate } from '@/features/loader';
import { PageFrame } from '@/components/layout/PageFrame';
import { Hero } from '@/components/sections/Hero';
import { getDictionary, isLocale } from '@/i18n';
import { notFound } from 'next/navigation';

/**
 * Assets de la primera vista. El loader no da paso a la página hasta que están
 * decodificados, para que no se revele con imágenes a medio pintar.
 */
const HERO_ASSETS = [
  // El ave tiene un encuadre por tamaño de pantalla: solo se espera por el que
  // se va a ver. Las consultas cubren todo el rango, sin solaparse.
  { src: '/hero/heroBird.png', media: '(min-width: 641px)' },
  { src: '/hero/asset-hero-colobri-mobile.png', media: '(max-width: 640px)' },
  '/brand/logo-dark-ceibaquito.svg',
  '/icons/icon-arrow-white.svg',
  '/icons/icon-logo.svg',
] as const;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <LoaderGate preload={HERO_ASSETS}>
      {/* La portada es solo el hero: cabe en una pantalla y no continúa con el
          pie, que se reserva para las páginas por las que se navega. */}
      <PageFrame hideFooter locale={locale}>
        <Hero locale={locale} copy={t.hero} confirmedCta={t.registration.confirmedCta} />
      </PageFrame>
    </LoaderGate>
  );
}
