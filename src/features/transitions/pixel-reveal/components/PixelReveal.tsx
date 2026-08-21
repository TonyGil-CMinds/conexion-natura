'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { PIXEL_REVEAL_CONFIG } from '../config/pixelReveal.config';
import { usePixelGrid, type PixelCell } from '../hooks/usePixelGrid';
import styles from './PixelReveal.module.css';

type Props = {
  /** Al pasar a `true` arranca la secuencia cubrir → revelar. */
  isActive: boolean;
  /** La pantalla está totalmente cubierta: momento seguro para cambiar contenido. */
  onCovered?: () => void;
  /** La malla ya se retiró por completo. */
  onComplete?: () => void;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Transición de píxeles en dos fases.
 *
 * 1. Cubrir: cada píxel escala 0 → 1 en una ola que sube de abajo hacia arriba.
 * 2. Revelar: la misma ola, ahora 1 → 0, dejando ver lo que hay debajo.
 *
 * El desfase aleatorio por celda es lo que evita que se lea como un barrido
 * recto; sin él la ola parece una persiana. Solo se anima `scale`, así que el
 * trabajo por cuadro queda en el compositor.
 */
export function PixelReveal({ isActive, onCovered, onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  // Una vez arrancada, la malla no debe reconstruirse: cambiar el número de
  // celdas a mitad de la animación las devolvería a scale 0 y destaparía todo.
  const grid = usePixelGrid({ isLocked: isActive });
  const hasPlayed = useRef(false);

  useEffect(() => {
    if (!isActive || grid.cells.length === 0 || hasPlayed.current) return;
    hasPlayed.current = true;

    const root = rootRef.current;
    if (!root) return;

    const cells = gsap.utils.toArray<HTMLElement>(`.${styles.cell}`, root);
    const reduced = prefersReducedMotion();

    const { cellDuration, coverSpan, revealSpan, holdS, coverScale } = PIXEL_REVEAL_CONFIG;
    // Con movimiento reducido se conserva el corte (sigue haciendo falta tapar el
    // cambio de contenido) pero sin ola ni desorden: todo entra y sale a la vez.
    const duration = reduced ? 0.18 : cellDuration;
    const spans = reduced ? { cover: 0, reveal: 0 } : { cover: coverSpan, reveal: revealSpan };

    /** Retardo de una celda: su posición en la ola más su desorden propio. */
    const delayFor = (el: Element, span: number) => {
      if (span === 0) return 0;
      const { depth = '0', offset = '0' } = (el as HTMLElement).dataset;
      return (1 - Number(depth)) * span + Number(offset);
    };

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { display: 'none' });
        onComplete?.();
      },
    });

    timeline
      .to(cells, {
        // Cierra el hueco entre cuadros: a esta escala se tocan y la pantalla
        // queda tapada, pero durante el trayecto se leen como píxeles separados.
        scale: coverScale,
        duration,
        ease: 'power2.out',
        delay: (_i, el) => delayFor(el, spans.cover),
      })
      // GSAP absorbe el retardo máximo en la duración del tween, así que el final
      // de este paso es exactamente el instante en que no queda ningún hueco.
      .add(() => onCovered?.())
      .to(
        cells,
        {
          scale: 0,
          duration,
          ease: 'power2.in',
          delay: (_i, el) => delayFor(el, spans.reveal),
        },
        `+=${holdS}`,
      );

    return () => {
      timeline.kill();
    };
  }, [isActive, grid.cells.length, onCovered, onComplete]);

  if (grid.cells.length === 0) return null;

  return (
    <div
      ref={rootRef}
      className={styles.root}
      aria-hidden
      style={{
        gridTemplateColumns: `repeat(${grid.cols}, ${grid.pitch}px)`,
        gridAutoRows: `${grid.pitch}px`,
        // El hueco es la diferencia entre paso y cuadro; la celda de la retícula
        // mide el paso y el cuadro se centra dentro.
        ['--pixel-size' as string]: `${grid.cellSize}px`,
      }}
    >
      {grid.cells.map((cell: PixelCell) => (
        <span
          key={cell.key}
          className={styles.cell}
          data-depth={cell.depth}
          data-offset={cell.offset}
          style={{ backgroundColor: cell.color }}
        />
      ))}
    </div>
  );
}
