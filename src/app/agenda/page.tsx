import type { Metadata } from 'next';
import { PageFrame } from '@/components/layout/PageFrame';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { PageCover } from '@/components/sections/PageCover';
import { EmptyState } from '@/components/ui/EmptyState';
import { PAGES } from '@/config/pages';
import { SITE } from '@/config/site';

export const metadata: Metadata = {
  title: `${PAGES.agenda.title} — ${SITE.name}`,
  description: PAGES.agenda.description,
};

/**
 * Página de agenda. Por ahora solo la portada y el estado vacío: el programa
 * todavía no está cerrado.
 *
 * Sin `LoaderGate`, como el resto de las rutas: el loader es la entrada al sitio.
 */
export default function AgendaPage() {
  const { title, cover, coverSeed, empty } = PAGES.agenda;

  return (
    <PageFrame header={<SiteHeader />}>
      <PageCover title={title} image={cover} seed={coverSeed} />
      <EmptyState label={empty} />
    </PageFrame>
  );
}
