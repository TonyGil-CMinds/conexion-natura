import type { DietKey } from '../config/diet-options';

/**
 * Iconos de las restricciones, dibujados a rejilla.
 *
 * Son **de píxeles** porque es el lenguaje del sitio —el ave del hero, el
 * mosaico de las portadas, el indicador del navbar— y porque a este tamaño una
 * rejilla de 12×12 se lee mejor que un trazo fino.
 *
 * Van en línea y no como archivo: así toman la tinta de la tarjeta con
 * `currentColor`, que es lo que necesitan al cambiar de estado —la tarjeta
 * elegida invierte sus colores— y lo que un `<img>` no permite.
 *
 * Ninguno lleva la barra de «prohibido»: el rótulo ya dice «Sin gluten», y una
 * diagonal encima de una espiga de doce píxeles solo la vuelve ilegible.
 */

/** Lado de la celda en el sistema de coordenadas del SVG (24 = 12 celdas). */
const CELL = 2;

/** `#` pinta, `.` deja pasar. Doce filas de doce, ni una más. */
const GLYPHS: Record<DietKey, readonly string[]> = {
  /** Un visto: no hay nada que evitar. */
  none: [
    '............',
    '..........#.',
    '.........##.',
    '........##..',
    '.......##...',
    '.#....##....',
    '.##..##.....',
    '..####......',
    '...##.......',
    '............',
    '............',
    '............',
  ],
  /** Hoja con nervio y tallo. */
  vegetarian: [
    '............',
    '.....#####..',
    '...#######..',
    '..###...##..',
    '.###...###..',
    '.##...###...',
    '.##..###....',
    '.##.###.....',
    '..####......',
    '..###.......',
    '.##.........',
    '.#..........',
  ],
  /** Brote de dos hojas sobre la tierra. */
  vegan: [
    '............',
    '.###.....###',
    '.####...####',
    '..####.####.',
    '...########.',
    '.....###....',
    '.....###....',
    '.....###....',
    '.....###....',
    '...#######..',
    '............',
    '............',
  ],
  /** Espiga. */
  glutenFree: [
    '.....##.....',
    '....####....',
    '...##..##...',
    '..###..###..',
    '...##..##...',
    '..###..###..',
    '...##..##...',
    '..###..###..',
    '.....##.....',
    '.....##.....',
    '.....##.....',
    '............',
  ],
  /** Envase de leche. */
  lactoseFree: [
    '....####....',
    '...######...',
    '..########..',
    '..##....##..',
    '..##....##..',
    '..########..',
    '..##....##..',
    '..##.##.##..',
    '..##.##.##..',
    '..##....##..',
    '..########..',
    '............',
  ],
  /** Triángulo de aviso. */
  allergy: [
    '.....##.....',
    '....####....',
    '....#..#....',
    '...##..##...',
    '...#.##.#...',
    '..##.##.##..',
    '..#..##..#..',
    '.##......##.',
    '.#...##...#.',
    '.##########.',
    '............',
    '............',
  ],
  /** Corazón: lo que no es comida sino salud. */
  health: [
    '............',
    '..##....##..',
    '.####..####.',
    '.##########.',
    '.##########.',
    '..########..',
    '..########..',
    '...######...',
    '....####....',
    '.....##.....',
    '............',
    '............',
  ],
};

/**
 * Las celdas seguidas de una fila salen como un solo rectángulo.
 *
 * No es una optimización prematura: sin unirlas, siete iconos dejan varios
 * cientos de nodos en el DOM de una pantalla que además anima su entrada.
 */
function runs(rows: readonly string[]) {
  const out: { x: number; y: number; width: number }[] = [];
  rows.forEach((row, y) => {
    let start = -1;
    for (let x = 0; x <= row.length; x++) {
      const filled = row[x] === '#';
      if (filled && start < 0) start = x;
      if (!filled && start >= 0) {
        out.push({ x: start * CELL, y: y * CELL, width: (x - start) * CELL });
        start = -1;
      }
    }
  });
  return out;
}

/** Las rejillas no cambian, así que se recorren una vez y no en cada render. */
const SHAPES = Object.fromEntries(
  Object.entries(GLYPHS).map(([key, rows]) => [key, runs(rows)]),
) as Record<DietKey, ReturnType<typeof runs>>;

export function DietIcon({ name }: { name: DietKey }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden focusable="false">
      {SHAPES[name].map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.width} height={CELL} />
      ))}
    </svg>
  );
}
