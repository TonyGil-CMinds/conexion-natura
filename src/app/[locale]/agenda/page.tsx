import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageFrame } from '@/components/layout/PageFrame';
import { PageCover } from '@/components/sections/PageCover';
import { Schedule } from '@/components/sections/Schedule';
import { EmptyState } from '@/components/ui/EmptyState';
import { PAGES } from '@/config/pages';
import { getDictionary, isLocale } from '@/i18n';
import { socialMeta } from '@/config/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const { title, description } = t.meta.agenda;
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
 * Página de agenda: portada y programa.
 *
 * Si el programa se queda sin momentos vuelve el estado vacío, que es el que
 * estuvo mientras la agenda no estaba cerrada.
 *
 * Va sin filetes interiores: el programa usa el ancho entero entre los filetes
 * exteriores, y los interiores cruzarían cada fila por la mitad.
 *
 * Sin `LoaderGate`, como el resto de las rutas: el loader es la entrada al sitio.
 */
export default async function AgendaPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { cover, coverSeed } = PAGES.agenda;
  const { items, intro, hostLabel, peopleLabel, empty, dateLabel, searchLabel, searchPlaceholder, searchEmpty } =
    t.agenda;

  return (
    <PageFrame locale={locale} hasColumnRules={false}>
      <PageCover title={t.meta.agenda.title} image={cover} seed={coverSeed} />

      {items.length > 0 ? (
        <Schedule
          items={items}
          intro={intro}
          hostLabel={hostLabel}
          peopleLabel={peopleLabel}
          dateLabel={dateLabel}
          searchLabel={searchLabel}
          searchPlaceholder={searchPlaceholder}
          searchEmpty={searchEmpty}
        />
      ) : (
        <EmptyState label={empty} />
      )}
    </PageFrame>
  );
}
