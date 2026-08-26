/** Configuración de la transición de píxeles. */

/**
 * Malla de la transición.
 *
 * Hereda el lenguaje del campo de píxeles del hero: cuadros grandes y contiguos
 * (148.5px de celda en el asset) en lugar de la malla fina con huecos de la
 * versión anterior, que venía del colibrí de píxeles y ya no está en la página.
 *
 * Se usa la mitad de la celda del campo: a tamaño completo salen 54 celdas en
 * pantalla y la ola no tiene resolución para leerse; a la mitad, unas 216.
 */
const FIELD_CELL = 148.5;
const CELL_DIVISOR = 2;

export const PIXEL_REVEAL_CONFIG = {
  /** Distancia entre centros de celda (px). */
  pitch: FIELD_CELL / CELL_DIVISOR,
  /** Lado del cuadro. Igual al paso: el campo del hero es contiguo, sin huecos. */
  cellSize: FIELD_CELL / CELL_DIVISOR,
  /** En móvil se reduce el paso para no dejar cuadros enormes. */
  mobilePitch: +(FIELD_CELL / CELL_DIVISOR * 0.6).toFixed(2),
  /** Punto de corte para el paso reducido. */
  mobileBreakpoint: 640,

  /** Solo el solape de subpíxel: sin huecos que cerrar, no hace falta más. */
  coverScale: 1.04,

  /** Duración del escalado de un píxel individual (s). */
  cellDuration: 0.2,
  /** Tiempo que tarda la ola en recorrer la pantalla al cubrir (s). */
  coverSpan: 0.45,
  /** Ídem al revelar (s). */
  revealSpan: 0.5,
  /** Desorden temporal dentro de cada fila (s). Es lo que rompe la línea recta. */
  jitter: 0.12,
  /** Pausa con la pantalla cubierta, para cambiar de contenido sin que se vea (s). */
  holdS: 0.06,
} as const;

/** Proporción de celdas que se encienden en lima, como los cuadros brillantes. */
const SPARKLE_RATIO = 0.16;

/**
 * Color de una celda.
 *
 * Reproduce el degradado del campo del hero: verde oscuro arriba, lima abajo. Que
 * las celdas de la fila superior sean casi del color del fondo no es un problema
 * para tapar el cambio de contenido — siguen siendo opacas — y a cambio la malla
 * se lee como el propio campo materializándose.
 *
 * @param depth 0 en la fila superior, 1 en la inferior.
 * @param random Valor 0..1 estable para esa celda.
 */
export function cellColor(depth: number, random: number): string {
  if (random < SPARKLE_RATIO) return 'var(--color-lime)';
  const mix = Math.round(depth * 100);
  return `color-mix(in srgb, var(--color-lime-soft) ${mix}%, var(--color-surface))`;
}
