import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageFrame } from '@/components/layout/PageFrame';
import { TanusasPage } from '@/features/tanusas';
import { getDictionary, isLocale } from '@/i18n';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, description } = getDictionary(locale).meta.tanusas;
  return { title, description };
}

/**
 * Micropágina del retiro del Consejo CEIBA en Tanusas.
 *
 * Sin filetes de retícula —ni interiores ni de contenedor— y **sin pie**: es una
 * invitación que se lee de arriba abajo y acaba en su propio cierre, así que el
 * pie del sitio repetiría una llamada a la acción que no es la de esta página.
 * La cabecera del sitio **se retira** aquí (`HeaderGate`) y la sustituye la barra
 * propia de la micropágina: su navegación es interna, y dos barras serían dos
 * navegaciones compitiendo. El logotipo de la suya sigue llevando al sitio.
 */
export default async function TanusasRoute({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <PageFrame hasColumnRules={false} hasEdgeRules={false} hideFooter locale={locale}>
      <TanusasPage copy={t.tanusas} locale={locale} header={t.header} photo={t.registration.photo} />
    </PageFrame>
  );
}
