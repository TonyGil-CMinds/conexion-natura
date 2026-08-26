'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import styles from './PageTransition.module.css';

/** Duración de la salida (s). Corta: retrasa la navegación. */
const EXIT_DURATION = 0.22;
/** Duración de la entrada (s). */
const ENTER_DURATION = 0.5;

/**
 * Transición entre páginas: el contenido sale, se navega, y el contenido nuevo
 * entra.
 *
 * En el App Router, al cambiar de ruta el árbol viejo se desmonta antes de poder
 * animarlo, así que una salida de verdad exige retrasar la navegación. Eso es lo
 * que hace este componente: intercepta el clic en enlaces internos, anima la
 * salida y solo entonces llama al router. La alternativa —congelar el árbol
 * saliente— es frágil y se rompe con cada versión.
 *
 * Vive en el layout raíz, no en un `template`: tiene que sobrevivir al cambio de
 * ruta para poder animar la salida.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Al llegar la ruta nueva se cancela el estado de salida: lo que sigue es la
  // entrada, que la dispara el cambio de `key`.
  useEffect(() => {
    setIsExiting(false);
  }, [pathname]);

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const onClick = useCallback(
    (event: MouseEvent) => {
      // Solo clic principal y sin modificadores: con Ctrl, Cmd o Shift el
      // navegador abre en otra pestaña o ventana y no hay nada que animar.
      if (event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const target = anchor.getAttribute('target');
      // Externos, descargas y aperturas en otra pestaña siguen su camino.
      if (!href || !href.startsWith('/') || href.startsWith('//')) return;
      if (anchor.hasAttribute('download')) return;
      if (target && target !== '_self') return;

      const [path] = href.split('#');
      // Ancla dentro de la misma página: no hay cambio de ruta que animar.
      if (!path || path === pathname) return;

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      event.preventDefault();
      setIsExiting(true);
      // La navegación se dispara por temporizador y no desde el final de la
      // animación: si ese callback no llega —y no llegaba—, la salida deja la
      // página en blanco sin navegar. El reloj corre en paralelo a la animación,
      // con la misma duración.
      timerRef.current = setTimeout(() => router.push(href), EXIT_DURATION * 1000);
    },
    [pathname, router],
  );

  /**
   * El listener va en el documento, en fase de captura, y no en el contenedor: la
   * cabecera vive fuera de este árbol —para no animarse— y sus enlaces son la vía
   * principal de navegación. Escuchando solo aquí dentro, el navbar navegaba de
   * golpe y sin animación de salida.
   */
  useEffect(() => {
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, [onClick]);

  return (
    <div className={styles.root}>
      <motion.div
        // La clave cambia con la ruta, y eso es lo que dispara la entrada.
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={isExiting ? { opacity: 0, y: -8 } : { opacity: 1, y: 0 }}
        transition={{
          duration: isExiting ? EXIT_DURATION : ENTER_DURATION,
          ease: EASE_OUT_EXPO,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
