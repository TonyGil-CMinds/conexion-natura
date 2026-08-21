import { LoaderGate } from '@/features/loader';
import { PageFrame } from '@/components/layout/PageFrame';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { Hero } from '@/components/sections/Hero';
import { HeroMeta } from '@/components/sections/HeroMeta';

/**
 * Assets de la primera vista. El loader no da paso a la página hasta que están
 * decodificados, para que no se revele con imágenes a medio pintar.
 */
const HERO_ASSETS = [
  '/hero/asset-hero-colibri.svg',
  '/brand/logo-dark-green.svg',
  '/icons/icon-arrow-white.svg',
  '/icons/icon-dark-lightmode.svg',
  '/hero/asset-riggle-green.svg',
] as const;

export default function HomePage() {
  return (
    <LoaderGate preload={HERO_ASSETS}>
      <PageFrame header={<SiteHeader />} bottomBar={<HeroMeta />}>
        <Hero />
      </PageFrame>
    </LoaderGate>
  );
}
