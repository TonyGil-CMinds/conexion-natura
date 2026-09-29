'use client';

import { useEffect, useMemo, useRef } from 'react';
import { createRandom } from '@/lib/random';
import styles from './PixelCurtain.module.css';

type Props = {
  /** La imagen que queda debajo. */
  children: React.ReactNode;
  /** Semilla del reparto de celdas: misma semilla, mismo dibujo al construirse. */
  seed: number;
};

/** Celdas de la malla. Fijas, no medidas: ver la nota sobre hidratación. */
const COLS = 14;
const ROWS = 10;

/**
 * Cortina de píxeles sobre una imagen, atada al scroll.
 *
 * Al bajar, las celdas se van cayendo y la imagen se descubre; al subir vuelven
 * a taparla. No es una entrada que ocurre una vez: es **reversible**, porque lo
 * que la manda es dónde está la imagen respecto al viewport y eso va y viene.
 *
 * El recuento de celdas es fijo y no medido. Si dependiera del ancho, el
 * servidor y el cliente pintarían mallas distintas y React reportaría desajuste
 * de hidratación; con una malla fija la proporción la pone el `grid`, que se
 * estira con la imagen.
 *
 * El orden de caída sale de `createRandom(seed)` y nunca de `Math.random()`, por
 * lo mismo: con `Math.random()` cada lado sortearía un orden distinto.
 *
 * Durante el scroll **no se vuelve a pintar en React**: se escribe un atributo
 * por celda desde el rAF. Con 140 celdas, un `setState` por cuadro habría sido
 * un árbol entero por cuadro.
 */
export function PixelCurtain({ children, seed }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cellsRef = useRef<HTMLSpanElement[]>([]);

  /**
   * A qué altura del recorrido cae cada celda. Se sortea una vez y se ordena
   * con una pizca de sesgo por fila: así la cortina se deshace de arriba abajo
   * en vez de disolverse en un ruido uniforme, que se leía como suciedad.
   */
  const thresholds = useMemo(() => {
    const random = createRandom(seed);
    return Array.from({ length: COLS * ROWS }, (_, index) => {
      const row = Math.floor(index / COLS);
      const bias = row / ROWS;
      return Math.min(1, bias * 0.55 + random() * 0.62);
    });
  }, [seed]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cells = cellsRef.current;
    /* Con movimiento reducido no hay cortina: la imagen se ve y ya está. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      for (const cell of cells) cell.dataset.gone = 'true';
      return;
    }

    let frame = 0;
    let visible = true;

    const read = () => {
      frame = 0;
      if (!visible) return;
      const box = root.getBoundingClientRect();
      const viewport = window.innerHeight;
      /**
       * 0 cuando la imagen asoma por abajo y 1 cuando ha subido su propio alto
       * por encima de ese punto. Se acota a ese tramo para que la cortina acabe
       * de abrirse con la imagen ya centrada y no a mitad de pantalla.
       */
      const travel = viewport * 0.72;
      const progress = Math.min(1, Math.max(0, (viewport - box.top) / travel));

      for (let i = 0; i < cells.length; i += 1) {
        const gone = progress > thresholds[i]!;
        const cell = cells[i]!;
        /* Solo se escribe cuando cambia: tocar el DOM sin necesidad invalida
           estilo aunque el valor sea el mismo. */
        if (gone === (cell.dataset.gone === 'true')) continue;
        cell.dataset.gone = gone ? 'true' : 'false';
      }
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) onScroll();
      },
      { rootMargin: '10% 0px 10% 0px' },
    );
    observer.observe(root);

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [thresholds]);

  return (
    <div ref={rootRef} className={styles.root}>
      {children}

      {/**
       * La malla va por encima de la imagen y no recibe puntero: es una
       * decoración, no una capa con la que se pueda interactuar.
       */}
      <div className={styles.grid} aria-hidden>
        {thresholds.map((_, index) => (
          <span
            key={index}
            ref={(node) => {
              if (node) cellsRef.current[index] = node;
            }}
            className={styles.cell}
          />
        ))}
      </div>
    </div>
  );
}
