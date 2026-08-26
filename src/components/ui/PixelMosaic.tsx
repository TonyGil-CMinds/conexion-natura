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
  /** Recorrido de la entrada: de la primera celda a la última (s). */
  entranceSpan?: number;
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
 * Mosaico de píxeles sobre una imagen: unas celdas en color de acento, otras del
 * color de fondo, el resto transparentes.
 *
 * Las celdas entran parpadeando, salteadas: la portada se lee primero como
 * fotografía y el mosaico aparece encima.
 *
 * El parpadeo es una animación **CSS** y no de JavaScript. Con JS había que
 * apagar las celdas en un efecto, después del primer pintado, y eso dejaba ver el
 * mosaico completo durante un cuadro antes de que desapareciera para entrar. En
 * CSS arrancan apagadas sin ese salto, y la animación no depende de que el
 * JavaScript llegue: es la propia hoja de estilos la que enciende.
 *
 * El patrón y los retardos salen de un PRNG con semilla y no de `Math.random()`:
 * si no, servidor y cliente generarían mosaicos distintos y React reportaría
 * desajuste.
 */
export function PixelMosaic({
  seed = 1005,
  density = 0.18,
  entranceSpan = 0.85,
  className,
}: Props) {
  const random = createRandom(seed);
  const weights = [1 - density - SHADE_RATIO, density, SHADE_RATIO];

  const cells = Array.from({ length: CELL_COUNT }, () => ({
    tone: weightedPick(TONES, weights, random()),
    /** Retardo propio: en desorden, para que no se lea como un barrido. */
    delay: random() * entranceSpan,
  }));

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')} aria-hidden>
      {cells.map((cell, index) =>
        cell.tone === 'transparent' ? (
          <span key={index} className={styles.cell} />
        ) : (
          <span
            key={index}
            className={`${styles.cell} ${styles.painted}`}
            style={{
              backgroundColor: cell.tone,
              animationDelay: `${cell.delay.toFixed(3)}s`,
            }}
          />
        ),
      )}
    </div>
  );
}
