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
  /**
   * Tinta de las columnas. `brand` es el degradado del loader —verde a lima—, y
   * `theme` pinta un fondo plano que quien lo usa elige con `surface`.
   */
  tone?: 'brand' | 'theme';
  /** Con `tone="theme"`: el tema cuyo fondo pintan las columnas. */
  surface?: 'light' | 'dark';
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
 *
 * Se puede **repetir**: la usa una vez el paso del loader al hero y otra cada vez
 * que se cambia de tema. Cada arranque devuelve los paneles a escala 0.
 */
export function StairsReveal({
  isActive,
  onCovered,
  onComplete,
  tone = 'brand',
  surface,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState<number>(STAIRS_REVEAL_CONFIG.columns);

  /**
   * Las llamadas van por referencia y fuera de las dependencias: si entraran,
   * una función nueva en cada render de quien la usa reiniciaría la animación a
   * mitad de camino.
   */
  const coveredRef = useRef(onCovered);
  const completeRef = useRef(onComplete);
  useEffect(() => {
    coveredRef.current = onCovered;
    completeRef.current = onComplete;
  }, [onCovered, onComplete]);

  // El recuento se mide al montar, no en cada `resize`: a mitad de la animación,
  // cambiarlo dejaría columnas nuevas en escala 0 y destaparía franjas.
  useEffect(() => {
    const { columns: wide, mobileColumns, mobileBreakpoint } = STAIRS_REVEAL_CONFIG;
    setColumns(window.innerWidth <= mobileBreakpoint ? mobileColumns : wide);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    const root = rootRef.current;
    if (!root) return;

    const panels = gsap.utils.toArray<HTMLElement>(`.${styles.panel}`, root);
    const reduced = prefersReducedMotion();
    const { panelDuration, columnStagger, holdS, ease } = STAIRS_REVEAL_CONFIG;

    // Con movimiento reducido se conserva el corte —sigue haciendo falta tapar el
    // cambio de contenido— pero sin escalera: todo entra y sale a la vez.
    const duration = reduced ? 0.18 : panelDuration;
    const stagger = reduced ? 0 : columnStagger;

    /**
     * Los dos paneles de cada columna, agrupados: se mueven juntos, así que el
     * desfase es por columna y no por panel.
     */
    const byColumn = new Map<number, HTMLElement[]>();
    for (const panel of panels) {
      const column = Number(panel.dataset.column ?? 0);
      byColumn.set(column, [...(byColumn.get(column) ?? []), panel]);
    }
    const lastColumn = Math.max(0, ...byColumn.keys());

    // Estado de partida en cada pasada: la capa a la vista y los paneles plegados.
    gsap.set(root, { display: 'block' });
    gsap.set(panels, { scaleY: 0 });

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(root, { display: 'none' });
        completeRef.current?.();
      },
    });

    /**
     * Cada columna entra en su **posición** de la línea de tiempo, no con un
     * `delay` calculado por función.
     *
     * Con el retardo como función, la duración total de la línea de tiempo queda
     * indeterminada y `onComplete` no llegaba a dispararse en la segunda pasada:
     * la capa se quedaba montada y el flujo no avanzaba. Con posiciones
     * explícitas, el final es una suma que se puede calcular aquí mismo.
     */
    const coveredAt = duration + lastColumn * stagger;
    for (const [column, group] of byColumn) {
      timeline.to(group, { scaleY: 1, duration, ease }, column * stagger);
    }
    // Justo cuando no queda hueco: es el momento seguro para cambiar contenido.
    timeline.add(() => coveredRef.current?.(), coveredAt);
    for (const [column, group] of byColumn) {
      timeline.to(group, { scaleY: 0, duration, ease }, coveredAt + holdS + column * stagger);
    }

    return () => {
      timeline.kill();
    };
  }, [isActive]);

  return (
    <div
      ref={rootRef}
      className={styles.root}
      aria-hidden
      data-tone={tone}
      style={{
        ['--columns' as string]: columns,
        ...(surface ? { ['--stairs-surface' as string]: `var(--theme-surface-${surface})` } : null),
      }}
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
