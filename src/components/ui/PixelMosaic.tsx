import { createRandom, weightedPick } from '@/lib/random';
import styles from './PixelMosaic.module.css';

type Props = {
  /** Semilla: fija el patrón para que no cambie entre renders ni entre servidor y cliente. */
  seed?: number;
  /**
   * Proporción de celdas con color, 0 a 1. Se baja cuando la portada lleva otro
   * elemento con peso —el bloque en degradado—, o el lado se satura.
   */
  density?: number;
  className?: string;
};

/**
 * Cuántas celdas se emiten. La retícula usa `auto-fill`, así que el número de
 * columnas lo decide el ancho: se emiten las suficientes para cubrir una pantalla
 * ancha y el resto se recorta.
 */
const CELL_COUNT = 220;

/**
 * Tonos de celda. El color de acento lo pone la portada con `--cover-accent`, así
 * que el mosaico no conoce la paleta de cada página.
 */
const TONES = ['transparent', 'var(--cover-accent, var(--color-yellow))', 'var(--bg)'] as const;

/** Proporción de celdas del color de fondo, que tapan la foto. */
const SHADE_RATIO = 0.12;

/**
 * Mosaico de píxeles sobre una imagen: unas celdas en amarillo, otras del color
 * de fondo, el resto transparentes.
 *
 * Va sin JavaScript. Las celdas se emiten en orden y la retícula las reparte con
 * `auto-fill`, así que el patrón se recompone al cambiar el ancho — al ser
 * aleatorio, eso no se nota. La alternativa (medir el viewport y calcular filas y
 * columnas) obligaría a un componente de cliente para algo puramente decorativo.
 *
 * El color sale de un PRNG con semilla y no de `Math.random()`: si no, servidor y
 * cliente generarían mosaicos distintos y React reportaría desajuste.
 */
export function PixelMosaic({ seed = 1005, density = 0.18, className }: Props) {
  const random = createRandom(seed);
  const weights = [1 - density - SHADE_RATIO, density, SHADE_RATIO];
  const cells = Array.from({ length: CELL_COUNT }, () =>
    weightedPick(TONES, weights, random()),
  );

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} aria-hidden>
      {cells.map((tone, index) => (
        <span
          key={index}
          className={styles.cell}
          style={tone === 'transparent' ? undefined : { backgroundColor: tone }}
        />
      ))}
    </div>
  );
}
