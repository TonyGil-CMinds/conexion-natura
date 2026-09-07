import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageFrame } from '@/components/layout/PageFrame';
import { PageCover } from '@/components/sections/PageCover';
import { Schedule } from '@/components/sections/Schedule';
import { EmptyState } from '@/components/ui/EmptyState';
import { PAGES } from '@/config/pages';
import { getDictionary, isLocale } from '@/i18n';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, description } = getDictionary(locale).meta.agenda;
  return { title, description };
}

/**
 * Página de agenda: portada y programa.
 *
 * Si el programa se queda sin momentos vuelve el estado vacío, que es el que
 * estuvo mientras la agenda no estaba cerrada.
 *
 * Sin `LoaderGate`, como el resto de las rutas: el loader es la entrada al sitio.
 */
export default async function AgendaPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { cover, coverSeed } = PAGES.agenda;
  const { items, intro, hostLabel, peopleLabel, empty } = t.agenda;

  return (
    <PageFrame locale={locale}>
      <PageCover title={t.meta.agenda.title} image={cover} seed={coverSeed} />

      {items.length > 0 ? (
        <Schedule items={items} intro={intro} hostLabel={hostLabel} peopleLabel={peopleLabel} />
      ) : (
        <EmptyState label={empty} />
      )}
    </PageFrame>
  );
}
