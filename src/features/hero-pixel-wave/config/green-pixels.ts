/**
 * GENERADO — no editar a mano.
 * Origen: _assets-src/asset-green-pixels2.svg
 * Regenerar: node scripts/svg-to-pixels.js
 */

/** [columna, fila, tono] */
export type SpritePixel = readonly [number, number, number];

export const GREEN_PIXELS_SPRITE = {
  cols: 17,
  rows: 5,
  /** Distancia entre centros de celda, en unidades del SVG original. */
  pitch: 13.53,
  /** Lado del cuadro pintado. Deja hueco: 100.9 % del paso. */
  size: 13.646,
  /** Tamaño natural del SVG, para escalar la malla sin deformarla. */
  width: 232,
  height: 69,
  tones: ['var(--color-lime-mid)'] as const,
  pixels: [
  [0,0,0], [4,0,0], [8,0,0], [12,0,0], [16,0,0], [1,1,0], [3,1,0], [5,1,0],
  [7,1,0], [9,1,0], [11,1,0], [13,1,0], [15,1,0], [2,2,0], [6,2,0], [10,2,0],
  [14,2,0], [1,3,0], [3,3,0], [5,3,0], [7,3,0], [9,3,0], [11,3,0], [13,3,0],
  [15,3,0], [0,4,0], [4,4,0], [8,4,0], [12,4,0], [16,4,0],
  ] as readonly SpritePixel[],
} as const;
