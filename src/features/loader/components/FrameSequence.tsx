'use client';

import { useFrameSequence } from '../hooks/useFrameSequence';
import styles from './FrameSequence.module.css';

type Props = {
  /** Rutas de los cuadros, en orden. */
  frames: readonly string[];
  fps: number;
  isPlaying?: boolean;
  width: number;
  height: number;
  alt: string;
  className?: string;
};

/**
 * Reproductor de secuencias SVG.
 *
 * Todos los cuadros se montan a la vez y solo se alterna la opacidad: cambiar el
 * `src` de una sola imagen provoca un parpadeo en el primer ciclo, porque el
 * navegador decodifica cada archivo cuando ya debía estar en pantalla.
 */
export function FrameSequence({
  frames,
  fps,
  isPlaying = true,
  width,
  height,
  alt,
  className,
}: Props) {
  const active = useFrameSequence(frames.length, fps, isPlaying);

  return (
    <div
      className={className}
      style={{ position: 'relative', width, height }}
      role="img"
      aria-label={alt}
    >
      {frames.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          width={width}
          height={height}
          aria-hidden
          draggable={false}
          className={styles.frame}
          style={{ opacity: i === active ? 1 : 0 }}
        />
      ))}
    </div>
  );
}
