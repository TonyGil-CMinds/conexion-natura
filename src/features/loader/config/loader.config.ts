/** Configuración declarativa del loader. Cambiar aquí, no en los componentes. */

export const LOADER_SEQUENCES = {
  ballena: {
    dir: '/loader/ballena',
    prefix: 'w2',
    frameCount: 10,
    /** viewBox del set de SVGs: todos comparten el mismo encuadre. */
    width: 240,
    height: 200,
  },
} as const;

export type SequenceName = keyof typeof LOADER_SEQUENCES;

export const LOADER_CONFIG = {
  /** Secuencia activa del loader. */
  sequence: 'ballena' as SequenceName,
  /** Cuadros por segundo de la secuencia. */
  fps: 8,
  /** Duración mínima visible del loader (ms), aunque los assets ya estén listos. */
  minDurationMs: 2600,
  /** Duración máxima antes de forzar la salida (ms), por si un asset falla. */
  maxDurationMs: 9000,
} as const;

/** Rutas de los cuadros: /loader/ballena/w2-01.svg … w2-10.svg */
export function getSequenceFrames(name: SequenceName): string[] {
  const { dir, prefix, frameCount } = LOADER_SEQUENCES[name];
  return Array.from(
    { length: frameCount },
    (_, i) => `${dir}/${prefix}-${String(i + 1).padStart(2, '0')}.svg`,
  );
}
