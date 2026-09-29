'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { useQuitoJoin } from './QuitoExperience';
import styles from './QuitoJoinCta.module.css';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Props = {
  copy: Dictionary['quito']['join'];
  /**
   * Si atiende a la petición de abrir que llega de la barra. Solo lo hace **el
   * del hero**: la portada lleva dos de estos —arriba y en el cierre— y sin esto
   * los dos se desplegaban, y el de abajo se llevaba el foco justo después de
   * subir la página hasta el de arriba.
   */
  autoOpen?: boolean;
  /** `hero` es la caja grande sobre la fotografía; `closing`, la del cierre. */
  variant?: 'hero' | 'closing';
};

/**
 * La llamada de la sección: un botón que se convierte en el campo del correo.
 *
 * Es **la misma caja** la que cambia, no un botón que se va y un campo que
 * llega: `layout` de Framer interpola la caja entre los dos tamaños y el
 * contenido se cruza dentro.
 *
 * El correo no se valida contra el servidor aquí: solo se comprueba que tenga
 * forma de correo y se pasa al registro, que es quien decide qué pantalla toca
 * —el resumen si ya existe, el formulario si no—.
 */
export function QuitoJoinCta({ copy, autoOpen, variant = 'hero' }: Props) {
  const join = useQuitoJoin();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const openCount = join?.openCount ?? 0;

  /** «Regístrate» de la barra pide abrir esto mismo. */
  useEffect(() => {
    if (!autoOpen || !openCount) return;
    setIsOpen(true);
    // Tras la animación de la caja: enfocar antes deja el cursor a medio camino.
    const timer = setTimeout(() => inputRef.current?.focus(), 420);
    return () => clearTimeout(timer);
  }, [autoOpen, openCount]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (isChecking || !join) return;

    const value = email.trim().toLowerCase();
    if (!EMAIL.test(value)) {
      setError(true);
      inputRef.current?.focus();
      return;
    }

    /**
     * La caja se queda ocupada mientras se consulta si ese correo ya tiene
     * registro: esa consulta decide si lo que viene es el formulario o el
     * resumen, y sin esto quedaba un hueco de pantalla quieta.
     */
    setIsChecking(true);
    try {
      await join.start(value);
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <motion.div
      layout
      className={styles.root}
      data-variant={variant}
      data-open={isOpen || undefined}
      transition={{ duration: 0.42, ease: EASE_OUT_EXPO }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          <motion.form
            key="campo"
            className={styles.form}
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
              className={styles.input}
              autoComplete="email"
            />
            <button
              type="submit"
              className={styles.go}
              aria-label={isChecking ? copy.emailChecking : copy.emailSubmit}
              aria-busy={isChecking || undefined}
              data-busy={isChecking || undefined}
              disabled={isChecking}
            >
              <span className={styles.arrow} aria-hidden />
            </button>
          </motion.form>
        ) : (
          <motion.button
            key="boton"
            type="button"
            className={styles.button}
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
