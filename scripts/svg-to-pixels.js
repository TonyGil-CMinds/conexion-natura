/**
 * Convierte SVG de píxeles (una malla de rects) en mapas de celdas.
 *
 *   node scripts/svg-to-pixels.js
 *
 * Los SVG vienen de diseño con irregularidades de exportación: los rects miden
 * entre 15.243 y 16.336 px y sus posiciones se desvían hasta 3px de la malla.
 * Encajarlos a la malla no pierde información — no hay dos rects que caigan en
 * la misma celda — y a cambio deja una estructura discreta con la que se puede
 * animar por píxel, ordenar por fila o columna y calcular vecindades.
 *
 * La salida se versiona: no hay que parsear SVG en tiempo de ejecución.
 *
 * Para los SVG que llegan como polígonos en escalera, en vez de un rect por
 * cuadro, está `svg-polygons-to-pixels.js`.
 */
const fs = require('fs');
const path = require('path');

/** Un SVG por entrada. `tones` fija el índice que se guarda por píxel. */
const ASSETS = [
  {
    source: '_assets-src/asset-hero-colibri.svg',
    output: 'src/features/hero-creature/config/colibri.ts',
    name: 'COLIBRI_SPRITE',
    tones: ['#00B000', '#8FE200'],
    toneVars: ['var(--color-green-base)', 'var(--color-green)'],
  },
  {
    source: '_assets-src/asset-green-pixels2.svg',
    output: 'src/features/hero-pixel-wave/config/green-pixels.ts',
    name: 'GREEN_PIXELS_SPRITE',
    tones: ['#C8F01A'],
    toneVars: ['var(--color-lime-mid)'],
  },
];

/**
 * Caja de un `d` hecho solo de trazos rectos. Los rects se exportan con órdenes
 * distintos (`M H V H V Z` en un asset, `M V H V H Z` en otro), así que en vez
 * de reconocer un patrón se recorren los comandos y se toman los extremos.
 */
function pathBox(d) {
  const tokens = d.match(/[A-Za-z]|-?[\d.]+/g) ?? [];
  const xs = [];
  const ys = [];
  let x = 0;
  let y = 0;
  let command = '';

  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i];
    if (/[A-Za-z]/.test(token)) {
      command = token;
      continue;
    }
    const value = Number(token);
    if (command === 'M' || command === 'L') {
      x = value;
      y = Number(tokens[(i += 1)]);
    } else if (command === 'H') {
      x = value;
    } else if (command === 'V') {
      y = value;
    } else {
      throw new Error(`comando "${command}" no soportado: el trazo no es un rectángulo`);
    }
    xs.push(x);
    ys.push(y);
  }

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return { x: minX, y: minY, w: Math.max(...xs) - minX, h: Math.max(...ys) - minY };
}

const median = (values) => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const spacings = (values) => {
  const sorted = [...new Set(values.map((v) => +v.toFixed(2)))].sort((a, b) => a - b);
  return sorted.slice(1).map((v, i) => v - sorted[i]).filter((d) => d > 1);
};

function convert({ source, output, name, tones, toneVars }) {
  const svg = fs.readFileSync(source, 'utf8');
  const [, svgW, svgH] = svg.match(/width="(\d+)" height="(\d+)"/).map(Number);

  const pathRe = /<path d="([^"]+)"\s+fill="(#[0-9A-Fa-f]{6})"/g;
  const rects = [];
  let m;
  while ((m = pathRe.exec(svg))) {
    rects.push({ ...pathBox(m[1]), fill: m[2].toUpperCase() });
  }
  if (!rects.length) throw new Error(`no se encontró ningún rect en ${source}`);

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
    const tone = tones.indexOf(r.fill);
    if (tone < 0) throw new Error(`color inesperado ${r.fill} en ${source}; añádelo a tones`);
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
 * Origen: ${source}
 * Regenerar: node scripts/svg-to-pixels.js
 */

/** [columna, fila, tono] */
export type SpritePixel = readonly [number, number, number];

export const ${name} = {
  cols: ${cols},
  rows: ${rows},
  /** Distancia entre centros de celda, en unidades del SVG original. */
  pitch: ${pitch},
  /** Lado del cuadro pintado. Deja hueco: ${((size / pitch) * 100).toFixed(1)} % del paso. */
  size: ${size},
  /** Tamaño natural del SVG, para escalar la malla sin deformarla. */
  width: ${svgW},
  height: ${svgH},
  tones: [${toneVars.map((v) => `'${v}'`).join(', ')}] as const,
  pixels: [
${lines.join('\n')}
  ] as readonly SpritePixel[],
} as const;
`;

  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, out);

  console.log(`${source} -> ${output}`);
  console.log(`  malla ${cols}x${rows}, paso ${pitch}, cuadro ${size} (${((size / pitch) * 100).toFixed(1)} %)`);
  console.log(`  ${cells.length} píxeles, ${new Set(cells.map((c) => c.tone)).size} tonos`);
}

ASSETS.forEach(convert);
