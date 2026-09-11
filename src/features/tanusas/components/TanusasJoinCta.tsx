'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { useTanusasJoin } from './TanusasExperience';
import styles from './Tanusas.module.css';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Props = {
  copy: Dictionary['tanusas']['hero'];
  /**
   * Si atiende a la petición de abrir que llega de la barra. Solo lo hace **el
   * del hero**: la página lleva dos de estos —arriba y en el cierre— y sin esto
   * los dos se desplegaban, y el de abajo se llevaba el foco justo después de
   * subir la página hasta el de arriba.
   */
  autoOpen?: boolean;
};

/**
 * La llamada del hero: un botón que se convierte en el campo del correo.
 *
 * Es **la misma caja** la que cambia, no un botón que desaparece y un campo que
 * aparece: `layout` de Framer interpola la caja entre los dos tamaños y el
 * contenido se cruza dentro. Por eso el botón y el campo comparten clase de
 * contorno y solo cambian de relleno.
 *
 * El correo no se valida contra el servidor aquí: solo se comprueba que tenga
 * forma de correo y se pasa al registro, que es quien decide qué pantalla toca.
 */
export function TanusasJoinCta({ copy, autoOpen }: Props) {
  const { start, openCount } = useTanusasJoin();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  /** «Confirmar» de la barra pide abrir esto mismo. */
  useEffect(() => {
    if (!autoOpen || !openCount) return;
    setIsOpen(true);
    // Tras la animación de la caja: enfocar antes deja el cursor a medio camino.
    const timer = setTimeout(() => inputRef.current?.focus(), 420);
    return () => clearTimeout(timer);
  }, [autoOpen, openCount]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (isChecking) return;

    const value = email.trim().toLowerCase();
    if (!EMAIL.test(value)) {
      setError(true);
      inputRef.current?.focus();
      return;
    }

    /**
     * El botón se queda ocupado mientras se consulta si ese correo ya tiene
     * registro: la consulta decide si lo que viene es el formulario o su
     * información, y sin esto quedaba un hueco de pantalla quieta.
     */
    setIsChecking(true);
    try {
      await start(value);
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <motion.div layout className={styles.join} data-open={isOpen || undefined} transition={{ duration: 0.42, ease: EASE_OUT_EXPO }}>
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.form
            key="campo"
            className={styles.joinForm}
            onSubmit={submit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
          >
            <input
              ref={inputRef}
              type="email"
              name="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setError(false);
              }}
              placeholder={copy.emailPlaceholder}
              aria-label={copy.emailLabel}
              aria-invalid={error || undefined}
              data-missing={error || undefined}
              className={styles.joinInput}
              autoComplete="email"
            />
            <button
              type="submit"
              className={styles.joinGo}
              aria-label={isChecking ? copy.emailChecking : copy.emailSubmit}
              aria-busy={isChecking || undefined}
              data-busy={isChecking || undefined}
              disabled={isChecking}
            >
              <span className={styles.joinArrow} aria-hidden />
            </button>
          </motion.form>
        ) : (
          <motion.button
            key="boton"
            type="button"
            className={styles.joinButton}
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => inputRef.current?.focus(), 420);
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
          >
            {copy.cta}
          </motion.button>
        )}
      </AnimatePresence>

      {/* El aviso no cabe dentro de la caja: iría encima del campo. */}
      <span className={styles.srOnly} role="status">
        {error ? copy.emailInvalid : ''}
      </span>
    </motion.div>
  );
}
