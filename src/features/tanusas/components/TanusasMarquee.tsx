'use client';

import { PixelMarquee } from '@/components/ui/PixelMarquee';

/** Los cuatro cuadros del desfile y el que cierra el grupo, en orden de diseño. */
const TILES = [
  '/tanusas/asset-square-green.svg',
  '/tanusas/asset-square-darkgreen.svg',
  '/tanusas/asset-square-blue.svg',
  '/tanusas/asset-square-yellow.svg',
] as const;

type Props = { text: string; pauseLabel: string; playLabel: string };

/**
 * La marquesina del retiro: los cuadros de Tanusas sobre la cinta compartida.
 *
 * La mecánica —desfile, aceleración con el scroll, pausa— vive en
 * `components/ui/PixelMarquee`, porque la sección de Quito usa la misma. Aquí
 * solo queda de qué color son los cuadros.
 */
export function TanusasMarquee({ text, pauseLabel, playLabel }: Props) {
  return (
    <PixelMarquee
      tiles={TILES}
      tailTile="/tanusas/asset-square-pink.svg"
      text={text}
      pauseLabel={pauseLabel}
      playLabel={playLabel}
    />
  );
}
