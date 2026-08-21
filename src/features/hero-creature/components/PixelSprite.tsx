'use client';

import { useRef } from 'react';
import { COLIBRI_SPRITE } from '../config/colibri';
import { useMagneticRepulsion } from '../hooks/useMagneticRepulsion';
import { useStrobeEntrance } from '../hooks/useStrobeEntrance';
import styles from './PixelSprite.module.css';

type Props = {
  /** Arranca la entrada; hasta entonces la malla está apagada. */
  isActive: boolean;
  /** Texto alternativo, o vacío si es decorativa. */
  label?: string;
  className?: string;
};

const SPRITE = COLIBRI_SPRITE;
/** Fracción del ancho natural: mantiene la malla proporcional al escalar. */
const CELL = (SPRITE.pitch / SPRITE.width) * 100;
const SIZE = (SPRITE.size / SPRITE.width) * 100;

/**
 * El colibrí, píxel a píxel.
 *
 * Se reconstruye desde el mapa generado del SVG (`config/colibri.ts`) en vez de
 * pintar el archivo: hacen falta 345 nodos independientes para poder darles
 * entrada por píxel y repulsión individual, cosa que una sola imagen no permite.
 *
 * Todo se posiciona en porcentaje del ancho del contenedor, así que la malla
 * escala con el hero sin perder el encaje ni los huecos entre píxeles.
 */
export function PixelSprite({ isActive, label, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useStrobeEntrance({
    containerRef,
    selector: `.${styles.pixel}`,
    isActive,
    rows: SPRITE.rows,
  });

  useMagneticRepulsion({
    containerRef,
    selector: `.${styles.pixel}`,
    isActive,
  });

  return (
    <div
      ref={containerRef}
      className={[styles.root, className].filter(Boolean).join(' ')}
      style={{ aspectRatio: `${SPRITE.width} / ${SPRITE.height}` }}
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      {SPRITE.pixels.map(([col, row, tone]) => (
        <span
          key={`${col}-${row}`}
          className={styles.pixel}
          data-row={row}
          style={{
            left: `${col * CELL}%`,
            top: `${((row * SPRITE.pitch) / SPRITE.height) * 100}%`,
            width: `${SIZE}%`,
            aspectRatio: '1',
            backgroundColor: SPRITE.tones[tone],
          }}
        />
      ))}
    </div>
  );
}
