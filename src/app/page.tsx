import { LoaderGate } from '@/features/loader';
import { PageFrame } from '@/components/layout/PageFrame';
import { Hero } from '@/components/sections/Hero';

/**
 * Assets de la primera vista. El loader no da paso a la página hasta que están
 * decodificados, para que no se revele con imágenes a medio pintar.
 */
const HERO_ASSETS = [
  '/hero/heroBird.png',
  '/brand/logo-horizontal-blanco.svg',
  '/icons/icon-arrow-white.svg',
  '/icons/icon-logo.svg',
  '/hero/hero-green-pixels-2.svg',
  '/hero/asset-riggle-red.svg',
] as const;

export default function HomePage() {
  return (
    <LoaderGate preload={HERO_ASSETS}>
      {/* La portada es solo el hero: cabe en una pantalla y no continúa con el
          pie, que se reserva para las páginas por las que se navega. */}
      <PageFrame hideFooter>
        <Hero />
      </PageFrame>
    </LoaderGate>
  );
}
