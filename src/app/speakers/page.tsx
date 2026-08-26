import type { Metadata } from 'next';
import { PageFrame } from '@/components/layout/PageFrame';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { PageCover } from '@/components/sections/PageCover';
import { PageIntro } from '@/components/sections/PageIntro';
import { SpeakerList } from '@/components/sections/SpeakerList';
import { PAGES } from '@/config/pages';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: `${PAGES.speakers.title} — ${SITE.name}`,
  description: PAGES.speakers.description,
};

/**
 * Página de ponentes: portada, bloque de entrada y lista.
 *
 * La lista sale de datos de relleno (`src/config/speakers.ts`) hasta que exista el
 * endpoint.
 *
 * La ruta es `/speakers` y el rótulo del menú "Ponentes": el idioma del contenido
 * y el de la URL no tienen que coincidir.
 *
 * Sin filetes interiores: las fichas de la lista cruzan esas columnas, y las
 * verticales atravesarían cada fila en vez de estructurar la página.
 */
export default function SpeakersPage() {
  const { title, cover, coverSeed, coverDensity, intro } = PAGES.speakers;

  return (
    <PageFrame header={<SiteHeader />} hasColumnRules={false}>
      <PageCover
        title={title}
        image={cover}
        seed={coverSeed}
        density={coverDensity}
        tone="lime"
        hasGradientBlock
      />
      <PageIntro headline={intro.headline} note={intro.note} icon={intro.icon} />
      <SpeakerList />
    </PageFrame>
  );
}
