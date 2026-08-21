/**
 * Convierte un SVG de píxeles (una malla de rects) en un mapa de celdas.
 *
 *   node scripts/svg-to-pixels.js
 *
 * El SVG viene de diseño con irregularidades de exportación: los rects miden
 * entre 15.243 y 16.336 px y sus posiciones se desvían hasta 3px de la malla.
 * Encajarlos a la malla no pierde información — no hay dos rects que caigan en
 * la misma celda — y a cambio deja una estructura discreta con la que se puede
 * animar por píxel, ordenar por fila o columna y calcular vecindades.
 *
 * La salida se versiona: no hay que parsear SVG en tiempo de ejecución.
 */
const fs = require('fs');
const path = require('path');

const SOURCE = '_assets-src/asset-hero-colibri.svg';
const OUTPUT = 'src/features/hero-creature/config/colibri.ts';
/** Orden de tonos: el índice es lo que se guarda por píxel. */
const TONES = ['#00B000', '#8FE200'];
const TONE_VARS = ['var(--color-green-base)', 'var(--color-green)'];

const svg = fs.readFileSync(SOURCE, 'utf8');
const viewBox = svg.match(/width="(\d+)" height="(\d+)"/);
const [, svgW, svgH] = viewBox.map(Number);

const rectRe = /<path d="M([\d.]+) ([\d.]+)H([\d.]+)V([\d.]+)H[\d.]+V[\d.]+Z" fill="(#[0-9A-Fa-f]{6})"/g;
const rects = [];
let m;
while ((m = rectRe.exec(svg))) {
  const xr = Number(m[1]);
  const yt = Number(m[2]);
  const xl = Number(m[3]);
  const yb = Number(m[4]);
  rects.push({
    x: Math.min(xl, xr),
    y: yt,
    w: Math.abs(xr - xl),
    h: yb - yt,
    fill: m[5].toUpperCase(),
  });
}

if (!rects.length) throw new Error(`no se encontró ningún rect en ${SOURCE}`);

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const spacings = (values) => {
  const sorted = [...new Set(values.map((v) => +v.toFixed(2)))].sort((a, b) => a - b);
  return sorted.slice(1).map((v, i) => v - sorted[i]).filter((d) => d > 1);
};

const pitch = +median([...spacings(rects.map((r) => r.x)), ...spacings(rects.map((r) => r.y))]).toFixed(3);
const size = +median(rects.map((r) => r.w)).toFixed(3);
const originX = Math.min(...rects.map((r) => r.x));
const originY = Math.min(...rects.map((r) => r.y));

const seen = new Map();
for (const r of rects) {
  const col = Math.round((r.x - originX) / pitch);
  const row = Math.round((r.y - originY) / pitch);
  const key = `${col},${row}`;
  if (seen.has(key)) {
    throw new Error(`dos rects encajan en la celda ${key}: el paso ${pitch} no describe esta malla`);
  }
  const tone = TONES.indexOf(r.fill);
  if (tone < 0) throw new Error(`color inesperado ${r.fill}; añádelo a TONES`);
  seen.set(key, { col, row, tone });
}

const cells = [...seen.values()].sort((a, b) => a.row - b.row || a.col - b.col);
const cols = Math.max(...cells.map((c) => c.col)) + 1;
const rows = Math.max(...cells.map((c) => c.row)) + 1;

const lines = [];
for (let i = 0; i < cells.length; i += 8) {
  lines.push(
    '  ' + cells.slice(i, i + 8).map((c) => `[${c.col},${c.row},${c.tone}]`).join(', ') + ',',
  );
}

const out = `/**
 * GENERADO — no editar a mano.
 * Origen: ${SOURCE}
 * Regenerar: node scripts/svg-to-pixels.js
 */

/** [columna, fila, tono] */
export type SpritePixel = readonly [number, number, number];

export const COLIBRI_SPRITE = {
  cols: ${cols},
  rows: ${rows},
  /** Distancia entre centros de celda, en unidades del SVG original. */
  pitch: ${pitch},
  /** Lado del cuadro pintado. Deja hueco: ${((size / pitch) * 100).toFixed(1)} % del paso. */
  size: ${size},
  /** Tamaño natural del SVG, para escalar la malla sin deformarla. */
  width: ${svgW},
  height: ${svgH},
  tones: [${TONE_VARS.map((v) => `'${v}'`).join(', ')}] as const,
  pixels: [
${lines.join('\n')}
  ] as readonly SpritePixel[],
} as const;
`;

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, out);

console.log(`${SOURCE} -> ${OUTPUT}`);
console.log(`  malla ${cols}x${rows}, paso ${pitch}, cuadro ${size} (${((size / pitch) * 100).toFixed(1)} %)`);
console.log(`  ${cells.length} píxeles, ${new Set(cells.map((c) => c.tone)).size} tonos`);
