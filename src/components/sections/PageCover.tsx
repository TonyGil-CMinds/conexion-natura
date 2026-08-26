import Image from 'next/image';
import { PixelMosaic } from '@/components/ui/PixelMosaic';
import styles from './PageCover.module.css';

type Props = {
  /** Rótulo de la página, dentro del panel de color. */
  title: string;
  image: { src: string; width: number; height: number; alt?: string };
  /** Semilla del mosaico: cambiarla da otro patrón a la misma portada. */
  seed?: number;
  /** Color de acento: celdas del mosaico y panel del rótulo. */
  tone?: 'yellow' | 'lime';
  /** Bloque en escalera con degradado, pegado al borde derecho. */
  hasGradientBlock?: boolean;
  /** Proporción de celdas con color en el mosaico. */
  density?: number;
};

const TONE_VARS = {
  yellow: 'var(--color-yellow)',
  lime: 'var(--color-lime)',
} as const;

/**
 * Portada de página: fotografía a sangre, mosaico de píxeles encima y el rótulo
 * dentro de un panel de color alineado al filete de la retícula.
 *
 * La foto es decorativa —el rótulo ya dice de qué va la página—, así que va con
 * `alt` vacío salvo que quien la use pase uno.
 */
export function PageCover({
  title,
  image,
  seed,
  tone = 'yellow',
  hasGradientBlock,
  density,
}: Props) {
  return (
    <div
      className={styles.root}
      style={{ ['--cover-accent' as string]: TONE_VARS[tone] }}
    >
      <Image
        src={image.src}
        alt={image.alt ?? ''}
        width={image.width}
        height={image.height}
        priority
        className={styles.photo}
      />

      <PixelMosaic seed={seed} density={density} />

      {/* Bloque en escalera, con su degradado dentro del propio asset. */}
      {hasGradientBlock && <div className={styles.gradientBlock} aria-hidden />}

      <div className={styles.panel}>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </div>
  );
}
