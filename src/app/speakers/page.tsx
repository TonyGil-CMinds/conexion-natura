import type { Metadata } from 'next';
import { PageFrame } from '@/components/layout/PageFrame';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { PageCover } from '@/components/sections/PageCover';
import { PageIntro } from '@/components/sections/PageIntro';
import { PAGES } from '@/config/pages';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: `${PAGES.speakers.title} — ${SITE.name}`,
  description: PAGES.speakers.description,
};

/**
 * Página de ponentes. La lista todavía no está cerrada: por ahora, portada y
 * bloque de entrada.
 *
 * La ruta es `/speakers` y el rótulo del menú "Ponentes": el idioma del contenido
 * y el de la URL no tienen que coincidir.
 */
export default function SpeakersPage() {
  const { title, cover, coverSeed, coverDensity, intro } = PAGES.speakers;

  return (
    <PageFrame header={<SiteHeader />}>
      <PageCover
        title={title}
        image={cover}
        seed={coverSeed}
        density={coverDensity}
        tone="lime"
        hasGradientBlock
      />
      <PageIntro headline={intro.headline} note={intro.note} icon={intro.icon} />
    </PageFrame>
  );
}
