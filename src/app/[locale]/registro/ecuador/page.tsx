import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageFrame } from '@/components/layout/PageFrame';
import { EcuadorRegistrationFlow } from '@/features/ecuador';
import { getDictionary, isLocale } from '@/i18n';
import { socialMeta } from '@/config/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const { title, description } = t.meta.ecuador;
  return {
    title,
    description,
    ...socialMeta({
      // Al compartir no hay plantilla que ponga el sufijo: va escrito.
      title: `${title} - ${t.meta.siteName}`,
      description,
      locale,
      siteName: t.meta.siteName,
    }),
  };
}

/**
 * Registro de empresas e iniciativas de Ecuador a la Natura500 Night.
 *
 * Cuelga de `/registro` y no de la raíz porque es eso: otro registro al mismo
 * acto, con otras preguntas. Va con el mismo armazón que `/registro` —sin
 * filetes y sin pie— para que las dos pantallas se sientan la misma pieza.
 */
export default async function EcuadorRegistrationPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <PageFrame hasColumnRules={false} hasEdgeRules={false} hideFooter locale={locale}>
      <EcuadorRegistrationFlow locale={locale} copy={t.ecuador} />
    </PageFrame>
  );
}
