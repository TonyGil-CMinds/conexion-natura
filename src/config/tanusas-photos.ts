import type { TanusasMoment } from './tanusas-schedule';

export const AGENDA_PHOTO_SCENES = {
  coast: { query: 'tropical beach aerial', fallback: '/tanusas/hero-tanusas.jpg' },
  workshop: { query: 'team workshop discussion table', fallback: '/tanusas/mesa-trabajo.jpg' },
  dining: { query: 'outdoor dinner table', fallback: '/tanusas/hero-noche.jpg' },
  forest: { query: 'tropical forest walking trail', fallback: '/tanusas/tanusas-poblado.jpg' },
  fire: { query: 'campfire evening', fallback: '/tanusas/hero-noche.jpg' },
} as const;

export type AgendaPhotoScene = keyof typeof AGENDA_PHOTO_SCENES;
export type AgendaPhoto = { src: string; photographer: string; url: string };

export function agendaPhotoScene(moment?: TanusasMoment | null): AgendaPhotoScene {
  if (!moment || moment.key === 'llegada' || moment.key === 'amanecer' || moment.lugar === 'playa') return 'coast';
  if (moment.key === 'raices') return 'fire';
  if (moment.tono === 'pausa') return 'dining';
  if (moment.tono === 'libre' || moment.key === 'caminar') return 'forest';
  return 'workshop';
}
