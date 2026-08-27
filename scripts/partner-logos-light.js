/**
 * Genera variantes en claro de los logos de socios.
 *
 *   node scripts/partner-logos-light.js
 *
 * Los archivos vienen pensados para fondo claro: su tinta es el verde oscuro de
 * marca (#001D09), que sobre el fondo del sitio sería invisible. Lo único que hay
 * que cambiar es ese color — el resto (banderas de Suecia y Francia) ya está bien
 * y hay que conservarlo tal cual.
 *
 * Antes esto se hacía con filtros CSS (`invert` + `hue-rotate`), que levantaban la
 * tinta pero desviaban los colores de las banderas. Sustituir el color en el
 * archivo es exacto y no toca nada más.
 */
const fs = require('fs');
const path = require('path');

const SOURCE_DIR = '_assets-src';
const OUTPUT_DIR = 'public/partners';
/** Tinta original y su equivalente en claro (tokens: --color-dark → --color-light). */
const INK = /#001D09/gi;
const LIGHT_INK = '#F7FFD2';

const sources = fs
  .readdirSync(SOURCE_DIR)
  .filter((name) => /^logo-socios-.*\.svg$/.test(name));

if (!sources.length) throw new Error(`no hay logos de socios en ${SOURCE_DIR}`);

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

for (const name of sources) {
  const svg = fs.readFileSync(path.join(SOURCE_DIR, name), 'utf8');
  const matches = svg.match(INK);

  if (!matches) {
    throw new Error(
      `${name} no usa la tinta ${INK.source}: revisa el archivo antes de generar su variante`,
    );
  }

  const light = svg.replace(INK, LIGHT_INK);
  const output = name.replace(/\.svg$/, '-light.svg');
  fs.writeFileSync(path.join(OUTPUT_DIR, output), light);

  // Los demás colores que quedan, para poder comprobar de un vistazo que las
  // banderas siguen intactas.
  const kept = [...new Set(light.match(/#[0-9A-Fa-f]{6}/g) ?? [])].filter(
    (color) => color.toUpperCase() !== LIGHT_INK,
  );
  console.log(
    `${name} -> ${output}  (${matches.length} tinta${matches.length === 1 ? '' : 's'}` +
      `${kept.length ? `, conserva ${kept.join(' ')}` : ''})`,
  );
}
