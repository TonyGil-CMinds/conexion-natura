'use client';

import { useRef } from 'react';
import { PIXEL_FIELD } from '../config/pixelField';
import { CREATURE_CONFIG } from '../config/creature.config';
import { useMagneticRepulsion } from '../hooks/useMagneticRepulsion';
import { useStrobeEntrance } from '@/hooks/useStrobeEntrance';
import styles from './PixelField.module.css';

type Props = {
  /** Arranca la entrada; hasta entonces el campo está apagado. */
  isActive: boolean;
  className?: string;
};

const FIELD = PIXEL_FIELD;
/** Filas aproximadas, solo para ordenar la ola de entrada. */
const ROWS = Math.round(FIELD.height / FIELD.size);

/**
 * Campo de píxeles del hero.
 *
 * Se reconstruye celda a celda desde el mapa generado (`config/pixelField.ts`) en
 * vez de pintar el SVG, porque las celdas tienen que poder animarse por separado:
 * entrada estroboscópica y repulsión al puntero.
 *
 * Las posiciones van en porcentaje del lienzo original, así que el campo escala
 * sin perder el encaje entre celdas.
 */
export function PixelField({ isActive, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useStrobeEntrance({
    containerRef,
    selector: `.${styles.pixel}`,
    isActive,
    // Ola de abajo hacia arriba, con desorden por celda.
    delayFor: (element) => {
      const row = Number(element.dataset.row ?? 0);
      const depth = ROWS > 1 ? row / (ROWS - 1) : 1;
      return (1 - depth) * CREATURE_CONFIG.strobe.span;
    },
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
      style={{ aspectRatio: `${FIELD.width} / ${FIELD.height}` }}
      aria-hidden
    >
      {FIELD.pixels.map(([x, y]) => (
        <span
          key={`${x}-${y}`}
          className={styles.pixel}
          data-row={Math.round(y / FIELD.size)}
          style={{
            left: `${(x / FIELD.width) * 100}%`,
            top: `${(y / FIELD.height) * 100}%`,
            width: `${(FIELD.size / FIELD.width) * 100}%`,
            aspectRatio: '1',
          }}
        />
      ))}
    </div>
  );
}
