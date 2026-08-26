import type { Metadata } from 'next';
import { PageFrame } from '@/components/layout/PageFrame';
import { Faq } from '@/components/sections/Faq';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: `Preguntas frecuentes — ${SITE.name}`,
  description: `Preguntas frecuentes sobre ${SITE.name}: fecha, sede, formato, aforo e idiomas.`,
};

/**
 * Página de preguntas frecuentes.
 *
 * Sin `LoaderGate`: el loader es la entrada al sitio, no un peaje en cada ruta.
 * Por eso el armazón se compone aquí y no en el layout raíz — solo la portada
 * necesita envolverlo en el loader.
 */
export default function FaqPage() {
  return (
    <PageFrame>
      <Faq />
    </PageFrame>
  );
}
