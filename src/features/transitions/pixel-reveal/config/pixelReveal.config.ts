import { COLIBRI_SPRITE } from '@/features/hero-creature';

/** Configuración de la transición de píxeles. */

/**
 * Múltiplo del paso de la malla del colibrí.
 *
 * La transición usa la misma malla que la criatura del hero para que los píxeles
 * de una y otra se lean como el mismo material. A 1× el paso sería de 18.5px, que
 * a pantalla completa da unas 3.100 celdas: demasiadas para animar por DOM. A 2×
 * el ritmo sigue siendo conmensurable con el colibrí (una celda de la transición
 * cubre 2×2 del colibrí) y el recuento baja a unas 800.
 */
const PITCH_MULTIPLIER = 2;

/** Proporción cuadro/paso heredada del sprite: es la que deja los huecos. */
const FILL_RATIO = COLIBRI_SPRITE.size / COLIBRI_SPRITE.pitch;

export const PIXEL_REVEAL_CONFIG = {
  /** Distancia entre centros de celda (px). */
  pitch: +(COLIBRI_SPRITE.pitch * PITCH_MULTIPLIER).toFixed(3),
  /** Lado del cuadro pintado (px). Menor que el paso: de ahí los huecos. */
  cellSize: +(COLIBRI_SPRITE.pitch * PITCH_MULTIPLIER * FILL_RATIO).toFixed(3),
  /** En móvil se reduce el paso para no dejar cuadros enormes. */
  mobilePitch: +(COLIBRI_SPRITE.pitch * 1.5).toFixed(3),
  /** Punto de corte para el paso reducido. */
  mobileBreakpoint: 640,

  /**
   * Escala a la que un cuadro cierra su hueco y toca a sus vecinos.
   * El 4 % extra evita costuras de subpíxel cuando el paso no es entero.
   */
  coverScale: +((1 / FILL_RATIO) * 1.04).toFixed(4),

  /** Duración del escalado de un píxel individual (s). */
  cellDuration: 0.34,
  /** Tiempo que tarda la ola en recorrer la pantalla al cubrir (s). */
  coverSpan: 0.85,
  /** Ídem al revelar (s). */
  revealSpan: 0.95,
  /** Desorden temporal dentro de cada fila (s). Es lo que rompe la línea recta. */
  jitter: 0.22,
  /** Pausa con la pantalla cubierta, para cambiar de contenido sin que se vea (s). */
  holdS: 0.12,
} as const;

/**
 * Paleta de la malla. Los pesos varían con la altura: el verde manda en toda la
 * pantalla, mientras que el azul y el crema solo aparecen en la zona baja, que es
 * donde la ola lleva más recorrido acumulado.
 */
export const PIXEL_PALETTE = [
  'var(--color-green-soft)',
  'var(--color-blue)',
  'var(--color-light)',
] as const;

/**
 * @param depth 0 en la fila superior, 1 en la inferior.
 * @returns pesos alineados con `PIXEL_PALETTE`.
 */
export function paletteWeights(depth: number): number[] {
  const ramp = depth ** 2.4; // curva: el azul/crema entra tarde y de golpe
  return [1, ramp * 0.85, ramp * 0.5];
}
