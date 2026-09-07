'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import styles from './Toast.module.css';

type Props = {
  /** Mensaje visible. Con `null` no hay aviso. */
  message: string | null;
  /** Se llama al agotarse el tiempo o al cerrarlo. */
  onDismiss: () => void;
  /** Milisegundos en pantalla. */
  duration?: number;
  tone?: 'error';
};

/**
 * Aviso pasajero, centrado abajo del viewport.
 *
 * Va con Framer Motion y no con CSS porque lo que se anima es la **entrada y la
 * salida** de un elemento que se monta y desmonta: sin `AnimatePresence` el aviso
 * desaparecería de golpe.
 *
 * El temporizador vive aquí y no en quien lo usa: así el aviso se cierra solo
 * aunque quien lo abrió se haya olvidado de él. Se reinicia con cada mensaje
 * nuevo, para que dos avisos seguidos no compartan la cuenta atrás.
 *
 * `role="status"` y no `alert`: interrumpe menos y el aviso no exige actuar.
 */
export function Toast({ message, onDismiss, duration = 6000, tone = 'error' }: Props) {
  // La cuenta atrás depende del mensaje, no de la identidad de `onDismiss`: quien
  // usa el aviso pasa una función nueva en cada render, y si estuviera en las
  // dependencias el temporizador se reiniciaría con cada uno —el aviso se
  // quedaba en pantalla mucho más de lo pedido.
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => dismissRef.current(), duration);
    return () => window.clearTimeout(timer);
  }, [message, duration]);

  return (
    <div className={styles.layer} aria-live="polite" role="status">
      <AnimatePresence>
        {message && (
          <motion.p
            key={message}
            className={styles.toast}
            data-tone={tone}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
          >
            {message}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
