'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { STAIRS_REVEAL_CONFIG } from '../config/stairsReveal.config';
import styles from './StairsReveal.module.css';

type Props = {
  /** Al pasar a `true` arranca la secuencia cubrir → revelar. */
  isActive: boolean;
  /** La pantalla está totalmente cubierta: momento seguro para cambiar contenido. */
  onCovered?: () => void;
  /** Las columnas ya se retiraron por completo. */
  onComplete?: () => void;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Transición de escaleras en dos fases.
 *
 * 1. Cubrir: cada columna crece desde los bordes hacia el centro, con un desfase
 *    de izquierda a derecha. Ese desfase es lo que dibuja la escalera: en
 *    cualquier instante los cantos de las columnas forman una diagonal escalonada.
 * 2. Revelar: la misma ola, ahora encogiendo, dejando ver lo que hay debajo.
 *
 * Cada columna son **dos paneles**, uno anclado arriba y otro abajo, que se
 * encuentran en el centro. Con un solo panel la pantalla se cubriría como una
 * persiana; con dos, el movimiento entra por los dos cantos y el escalón se lee
 * en simetría.
 *
 * Se anima `scaleY` y no `height`: la altura recalcula la maqueta en cada cuadro,
 * mientras que la escala se queda en el compositor. Es el mismo criterio que traía
 * la transición de píxeles.
 *
 * Va con **GSAP y no con Framer Motion** aunque el efecto venga de un ejemplo en
 * Framer: `onCovered` tiene que dispararse en el instante exacto en que no queda
 * hueco, y una línea de tiempo con etiquetas lo dice sin depender de qué elemento
 * termina último.
 */
export function StairsReveal({ isActive, onCovered, onComplete }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hasPlayed = useRef(false);
  const [columns, setColumns] = useState<number>(STAIRS_REVEAL_CONFIG.columns);

  // El recuento se mide al montar, no en cada `resize`: a mitad de la animación,
  // cambiarlo dejaría columnas nuevas en escala 0 y destaparía franjas.
  useEffect(() => {
    const { columns: wide, mobileColumns, mobileBreakpoint } = STAIRS_REVEAL_CONFIG;
    setColumns(window.innerWidth <= mobileBreakpoint ? mobileColumns : wide);
  }, []);

  useEffect(() => {
    if (!isActive || hasPlayed.current) return;
    hasPlayed.current = true;

    const root = rootRef.current;
    if (!root) return;

    const panels = gsap.utils.toArray<HTMLElement>(`.${styles.panel}`, root);
    const reduced = prefersReducedMotion();
    const { panelDuration, columnStagger, holdS, ease } = STAIRS_REVEAL_CONFIG;

    // Con movimiento reducido se conserva el corte —sigue haciendo falta tapar el
    // cambio de contenido— pero sin escalera: todo entra y sale a la vez.
    const duration = reduced ? 0.18 : panelDuration;
    const stagger = reduced ? 0 : columnStagger;
    const delayFor = (_index: number, el: Element) =>
      Number((el as HTMLElement).dataset.column ?? 0) * stagger;

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { display: 'none' });
        onComplete?.();
      },
    });

    timeline
      .to(panels, { scaleY: 1, duration, ease, delay: delayFor })
      // GSAP absorbe el retardo máximo en la duración del tween, así que el final
      // de este paso es exactamente el instante en que la pantalla está cubierta.
      .add(() => onCovered?.())
      .to(panels, { scaleY: 0, duration, ease, delay: delayFor }, `+=${holdS}`);

    return () => {
      timeline.kill();
    };
  }, [isActive, onCovered, onComplete]);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      aria-hidden
      style={{ ['--columns' as string]: columns }}
    >
      {Array.from({ length: columns }, (_, index) => (
        <div key={index} className={styles.column} style={{ ['--index' as string]: index }}>
          <span className={`${styles.panel} ${styles.top}`} data-column={index} />
          <span className={`${styles.panel} ${styles.bottom}`} data-column={index} />
        </div>
      ))}
    </div>
  );
}
