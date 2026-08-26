/**
 * Descompone un SVG de escaleras poligonales en las celdas que las forman.
 *
 *   node scripts/svg-polygons-to-pixels.js
 *
 * `hero-green-pixels.svg` no trae un rect por cuadro: cada grupo es un único
 * polígono en escalera. Para poder animar píxel a píxel hay que recuperar las
 * celdas, y se hace muestreando el centro de cada casilla contra el polígono.
 *
 * Cada grupo lleva su propio origen: en el archivo están desalineados entre sí
 * unos 6px, así que forzar una malla común los movería. Se emiten posiciones
 * absolutas y el resultado es idéntico al original.
 */
const fs = require('fs');
const path = require('path');

const SOURCE = 'public/hero/hero-green-pixels.svg';
const OUTPUT = 'src/features/hero-creature/config/pixelField.ts';
/** Lado de la casilla, leído de los saltos del propio archivo. */
const STEP = 59.46;

const svg = fs.readFileSync(SOURCE, 'utf8');
const [, svgW, svgH] = svg.match(/width="(\d+)" height="(\d+)"/).map(Number);
const fill = (svg.match(/fill="(#[0-9A-Fa-f]{6})"/) || [])[1];

const polygons = [...svg.matchAll(/<path d="([^"]+)"/g)].map((m) =>
  [...m[1].matchAll(/[ML]\s*([\d.-]+)\s+([\d.-]+)/g)].map((v) => [Number(v[1]), Number(v[2])]),
);

/** Cruces de rayo: par = fuera, impar = dentro. */
function isInside(polygon, x, y) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i];
    const [xj, yj] = polygon[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

const cells = [];
for (const polygon of polygons) {
  const xs = polygon.map((p) => p[0]);
  const ys = polygon.map((p) => p[1]);
  const originX = Math.min(...xs);
  const originY = Math.min(...ys);
  const cols = Math.round((Math.max(...xs) - originX) / STEP);
  const rows = Math.round((Math.max(...ys) - originY) / STEP);

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = originX + col * STEP;
      const y = originY + row * STEP;
      if (!isInside(polygon, x + STEP / 2, y + STEP / 2)) continue;
      // Fuera del lienzo: el último grupo desborda el viewBox y se recorta.
      if (y > svgH) continue;
      cells.push({ x: +x.toFixed(2), y: +y.toFixed(2) });
    }
  }
}

cells.sort((a, b) => a.y - b.y || a.x - b.x);

const lines = [];
for (let i = 0; i < cells.length; i += 6) {
  lines.push('  ' + cells.slice(i, i + 6).map((c) => `[${c.x},${c.y}]`).join(', ') + ',');
}

const out = `/**
 * GENERADO — no editar a mano.
 * Origen: ${SOURCE}
 * Regenerar: node scripts/svg-polygons-to-pixels.js
 */

/** [x, y] en unidades del SVG original, esquina superior izquierda de la celda. */
export type FieldPixel = readonly [number, number];

export const PIXEL_FIELD = {
  width: ${svgW},
  height: ${svgH},
  /** Lado de la casilla. */
  size: ${STEP},
  color: '${fill}',
  pixels: [
${lines.join('\n')}
  ] as readonly FieldPixel[],
} as const;
`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, out);
console.log(`${SOURCE} -> ${OUTPUT}`);
console.log(`  lienzo ${svgW}x${svgH}, casilla ${STEP}, color ${fill}`);
console.log(`  ${cells.length} celdas en ${polygons.length} grupos`);
