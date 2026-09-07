import { cn } from '@/lib/cn';
import { GREEN_PIXELS_SPRITE as SPRITE } from '../config/green-pixels';
import styles from './HeroPixelWave.module.css';

type Props = { className?: string };

/** Duración de una pasada de la onda, en segundos. */
const CYCLE = 2.4;

/**
 * Retícula de píxeles que va sobre el ave, con una onda que la recorre.
 *
 * Se reconstruye celda a celda en vez de servir el SVG porque la animación es
 * por píxel: como imagen solo se podría hacer parpadear el conjunto.
 *
 * **La onda va en CSS y el componente no lleva `'use client'`.** El disparo es
 * la carga de la página, no una señal de JavaScript, y es un bucle ambiental:
 * no hay entrada que gastar detrás del loader —cuando la malla se retira, la
 * onda ya está dando vueltas—, así que no necesita esperar a `useHasEntered`.
 *
 * El retardo de cada celda es **negativo** y proporcional a su columna: así la
 * onda ya está a mitad de recorrido en el primer cuadro, en vez de arrancar con
 * toda la retícula apagada.
 */
export function HeroPixelWave({ className }: Props) {
  return (
    <div
      className={cn(styles.root, className)}
      aria-hidden
      style={{
        aspectRatio: `${SPRITE.width} / ${SPRITE.height}`,
        // La geometría sale del mapa generado: si el asset cambia, esto le sigue.
        ['--cell-width' as string]: `${(SPRITE.size / SPRITE.width) * 100}%`,
        ['--cell-height' as string]: `${(SPRITE.size / SPRITE.height) * 100}%`,
        ['--wave-cycle' as string]: `${CYCLE}s`,
      }}
    >
      {SPRITE.pixels.map(([col, row, tone]) => (
        <span
          key={`${col}-${row}`}
          className={styles.cell}
          style={{
            left: `${((col * SPRITE.pitch) / SPRITE.width) * 100}%`,
            top: `${((row * SPRITE.pitch) / SPRITE.height) * 100}%`,
            background: SPRITE.tones[tone],
            animationDelay: `${(-(col / SPRITE.cols) * CYCLE).toFixed(3)}s`,
          }}
        />
      ))}
    </div>
  );
}
