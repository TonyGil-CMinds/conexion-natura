import type { ParticipationKey } from '../config/participation-options';

/**
 * Iconos de las dos formas de participar, dibujados a rejilla.
 *
 * Mismo lenguaje que los del retiro y que el resto del sitio —el ave del hero,
 * el mosaico de las portadas—: píxeles, no trazo fino. A este tamaño una
 * rejilla de 12×12 se lee, y una línea de medio píxel no.
 *
 * Van en línea y no como archivo para que tomen la tinta de la tarjeta con
 * `currentColor`: la tarjeta elegida invierte sus colores, y un `<img>` no
 * seguiría ese cambio.
 *
 * Los dos dibujan personas para que se lean como dos maneras de estar en la
 * misma sala, no como dos cosas distintas. Lo que las separa es la mesa.
 */

/** Lado de la celda en el sistema de coordenadas del SVG (24 = 12 celdas). */
const CELL = 2;

/** `#` pinta, `.` deja pasar. Doce filas de doce, ni una más. */
const GLYPHS: Record<ParticipationKey, readonly string[]> = {
  /** Dos personas de frente: se viene a la sala, a escuchar y a encontrarse. */
  attendee: [
    '............',
    '..##....##..',
    '..##....##..',
    '............',
    '.####..####.',
    '######.#####',
    '######.#####',
    '..##....##..',
    '..##....##..',
    '..##....##..',
    '.##......##.',
    '.##......##.',
  ],
  /**
   * Alguien detrás de una mesa con dos cosas encima: es la diferencia con la
   * tarjeta de al lado —se viene además a enseñar algo—, así que la mesa ocupa
   * el centro del dibujo y la persona queda detrás.
   */
  table: [
    '....##......',
    '....##......',
    '............',
    '...####.....',
    '..######....',
    '..######....',
    '.##......##.',
    '############',
    '############',
    '..##....##..',
    '..##....##..',
    '..##....##..',
  ],
};

/**
 * Las celdas seguidas de una fila salen como un solo rectángulo.
 *
 * No es una optimización prematura: sin unirlas, los iconos dejan más de cien
 * nodos en el DOM de una pantalla que además anima su entrada.
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
) as Record<ParticipationKey, ReturnType<typeof runs>>;

export function ParticipationIcon({ name }: { name: ParticipationKey }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden focusable="false">
      {SHAPES[name].map((run) => (
        <rect key={`${run.x}-${run.y}`} x={run.x} y={run.y} width={run.width} height={CELL} />
      ))}
    </svg>
  );
}
