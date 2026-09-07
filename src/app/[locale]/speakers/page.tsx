import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageFrame } from '@/components/layout/PageFrame';
import { PageCover } from '@/components/sections/PageCover';
import { PageIntro } from '@/components/sections/PageIntro';
import { SpeakerList } from '@/components/sections/SpeakerList';
import { PAGES } from '@/config/pages';
import { getDictionary, isLocale } from '@/i18n';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const { title, description } = getDictionary(locale).meta.speakers;
  return { title, description };
}

/**
 * Página de ponentes: portada, bloque de entrada y lista.
 *
 * La lista sale de datos de relleno (los diccionarios) hasta que exista el
 * endpoint.
 *
 * La ruta es `/speakers` y el rótulo del menú "Ponentes": el idioma del contenido
 * y el de la URL no tienen que coincidir.
 *
 * Sin filetes interiores: las fichas de la lista cruzan esas columnas, y las
 * verticales atravesarían cada fila en vez de estructurar la página.
 */
export default async function SpeakersPage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const { cover, coverSeed, coverDensity, introIcon } = PAGES.speakers;

  return (
    <PageFrame hasColumnRules={false} locale={locale}>
      <PageCover
        title={t.meta.speakers.title}
        image={cover}
        seed={coverSeed}
        density={coverDensity}
        tone="lime"
        hasGradientBlock
      />
      <PageIntro headline={t.speakers.introHeadline} note={t.speakers.introNote} icon={introIcon} />
      <SpeakerList
        title={t.speakers.listTitle}
        speakers={t.speakers.items}
        sessionsLabel={t.speakers.sessionsLabel}
      />
    </PageFrame>
  );
}
