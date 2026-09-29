import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageCover } from '@/components/sections/PageCover';
import { Schedule } from '@/components/sections/Schedule';
import { EmptyState } from '@/components/ui/EmptyState';
import { QuitoChrome } from '@/features/quito';
import { PAGES } from '@/config/pages';
import type { AgendaItem } from '@/config/agenda';
import { SITE } from '@/config/site';
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
      title: `${title} - ${t.meta.siteName}`,
      description,
      locale,
      siteName: t.meta.siteName,
    }),
  };
}

/**
 * Agenda dentro de la sección de Quito.
 *
 * **Es el mismo programa**: los momentos salen del mismo diccionario que
 * `/agenda`, así que no hay dos sitios donde corregir una hora. Lo único suyo es
 * la piel —barra, pie y tema claro— que aporta `QuitoChrome`.
 */
export default async function QuitoAgendaPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { cover, coverSeed } = PAGES.agenda;
  const {
    items, intro, hostLabel, peopleLabel, empty, dateLabel, feature,
    searchLabel, searchPlaceholder, searchEmpty,
  } = t.agenda;

  /* Mientras los ponentes no se revelan, los créditos se quitan aquí y no al
     pintar: `Schedule` es de cliente, así que lo que reciba viaja en el HTML. */
  const programme: readonly AgendaItem[] = SITE.speakersRevealed
    ? items
    : (items as readonly AgendaItem[]).map(({ id, time, title, description }) => ({
        id,
        time,
        title,
        description,
      }));

  return (
    <QuitoChrome locale={locale} copy={t.quito} header={t.header}>
      <PageCover title={t.meta.agenda.title} image={cover} seed={coverSeed} />

      {programme.length > 0 ? (
        <Schedule
          items={programme}
          intro={intro}
          hostLabel={hostLabel}
          peopleLabel={peopleLabel}
          dateLabel={dateLabel}
          feature={feature}
          venue={SITE.event.venue.name}
          searchLabel={searchLabel}
          searchPlaceholder={searchPlaceholder}
          searchEmpty={searchEmpty}
        />
      ) : (
        <EmptyState label={empty} />
      )}
    </QuitoChrome>
  );
}
