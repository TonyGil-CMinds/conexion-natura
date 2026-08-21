'use client';

import { useId } from 'react';
import { LOADER_MARK } from '../config/mark';
import styles from './LoaderMark.module.css';

type Props = {
  /** Progreso 0 → 100. */
  progress: number;
  size?: number;
};

/**
 * Glifo central del loader.
 *
 * Se dibuja dos veces: una silueta tenue de fondo y, recortado por la misma
 * geometría, un relleno que sube de abajo hacia arriba según el progreso.
 * El degradado difumina el borde superior para que el llenado no se lea como
 * una línea recta cortando la figura.
 */
export function LoaderMark({ progress, size = 181 }: Props) {
  const uid = useId().replace(/:/g, '');
  const clipId = `mark-clip-${uid}`;
  const gradientId = `mark-fill-${uid}`;

  const { width, height, path } = LOADER_MARK;
  const clamped = Math.max(0, Math.min(100, progress));
  const fillHeight = (clamped / 100) * height;

  return (
    <svg
      className={styles.root}
      width={size}
      height={(size * height) / width}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      role="img"
      aria-label={`Cargando ${Math.round(clamped)} por ciento`}
    >
      <defs>
        <clipPath id={clipId}>
          <path d={path} />
        </clipPath>
        <linearGradient id={gradientId} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="var(--color-green)" stopOpacity="1" />
          <stop offset="35%" stopColor="var(--color-green)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--color-green-base)" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Silueta de referencia: la figura completa siempre visible. */}
      <path d={path} fill="var(--color-light)" fillOpacity="0.14" />

      {/* Relleno de progreso, recortado por la silueta. */}
      <g clipPath={`url(#${clipId})`}>
        <rect
          x="0"
          y={height - fillHeight}
          width={width}
          height={fillHeight}
          fill={`url(#${gradientId})`}
        />
      </g>
    </svg>
  );
}
