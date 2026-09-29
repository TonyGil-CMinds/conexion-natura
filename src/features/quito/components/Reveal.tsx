'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Reveal.module.css';

type Props = {
  children: React.ReactNode;
  /** Retardo en segundos, para escalonar hermanos. */
  delay?: number;
  className?: string;
};

/**
 * Entrada al entrar en pantalla: sube un poco y aparece.
 *
 * Es la pieza que da el hilo a toda la sección —cada bloque entra cuando le
 * toca en vez de estar ya puesto—, y por eso es un envoltorio tonto: no sabe
 * qué envuelve.
 *
 * **Quien apaga el bloque es el cliente, no el CSS.** La hoja solo esconde lo
 * que lleva `data-ready`, y ese atributo lo escribe este componente ya montado:
 * si el JavaScript fallara, el bloque se queda visible en vez de invisible para
 * siempre. Ese es también el motivo de que el estado inicial no venga del
 * servidor.
 *
 * Se desconecta al entrar: es una entrada, no un estado que deba deshacerse al
 * salir de pantalla —eso haría que la página parpadeara al subir—.
 */
export function Reveal({ children, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Con movimiento reducido no hay entrada: el bloque está y ya está.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setIsReady(true);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsIn(true);
        observer.disconnect();
      },
      /* Un poco antes del canto: así el bloque acaba de entrar cuando se mira. */
      { rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={[styles.root, className].filter(Boolean).join(' ')}
      data-ready={isReady || undefined}
      data-in={isIn || undefined}
      style={delay ? ({ '--reveal-delay': `${delay}s` } as React.CSSProperties) : undefined}
    >
      {children}
    </div>
  );
}
