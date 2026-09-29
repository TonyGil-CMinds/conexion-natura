import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageCover } from '@/components/sections/PageCover';
import { PageIntro } from '@/components/sections/PageIntro';
import { SpeakerList } from '@/components/sections/SpeakerList';
import { QuitoChrome } from '@/features/quito';
import { PAGES } from '@/config/pages';
import { SITE } from '@/config/site';
import { getDictionary, isLocale } from '@/i18n';
import { socialMeta } from '@/config/seo';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const { title, description } = t.meta.speakers;
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
 * Ponentes dentro de la sección de Quito: la misma lista que `/speakers`, con la
 * piel de esta sección. Las horas de cada sesión se cruzan con la agenda por
 * `id`, como allí: no se copian.
 */
export default async function QuitoSpeakersPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { cover, coverSeed, coverDensity, introIcon } = PAGES.speakers;

  const sessionTimes = Object.fromEntries(t.agenda.items.map((item) => [item.id, item.time]));

  return (
    <QuitoChrome locale={locale} copy={t.quito} header={t.header}>
      <PageCover
        title={t.meta.speakers.title}
        image={cover}
        seed={coverSeed}
        density={coverDensity}
        tone="lime"
        hasGradientBlock
      />
      <PageIntro
        headline={t.speakers.introHeadline}
        note={SITE.speakersRevealed ? t.speakers.introNote : t.speakers.introNotePending}
        icon={introIcon}
      />
      {SITE.speakersRevealed && (
        <SpeakerList
          title={t.speakers.listTitle}
          speakers={t.speakers.items}
          sessionsLabel={t.speakers.sessionsLabel}
          sessionTimes={sessionTimes}
        />
      )}
    </QuitoChrome>
  );
}
