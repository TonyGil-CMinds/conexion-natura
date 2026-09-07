import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageFrame } from '@/components/layout/PageFrame';
import { Faq } from '@/components/sections/Faq';
import { getDictionary, isLocale } from '@/i18n';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, description } = getDictionary(locale).meta.faq;
  return { title, description };
}

/**
 * Página de preguntas frecuentes.
 *
 * Sin `LoaderGate`: el loader es la entrada al sitio, no un peaje en cada ruta.
 * Por eso el armazón se compone aquí y no en el layout raíz — solo la portada
 * necesita envolverlo en el loader.
 */
export default async function FaqPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <PageFrame locale={locale}>
      <Faq title={t.faq.title} items={t.faq.items} />
    </PageFrame>
  );
}
