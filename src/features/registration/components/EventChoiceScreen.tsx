'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { CHOICE_MARQUEE, EVENT_OPTIONS } from '../config/event-options';
import type { EventChoice } from '../lib/attendee-input';
import styles from './EventChoiceScreen.module.css';

/**
 * Entrada y salida, iguales que las del paso de datos para que los dos se
 * comporten igual: en cascada al entrar y en la inversa al salir. Sin la salida,
 * volver desde el paso siguiente cortaba en seco.
 */
const PANEL = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09 } },
  gone: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
} as const;

const ITEM = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT_EXPO } },
  gone: { opacity: 0, y: 16, transition: { duration: 0.24, ease: EASE_OUT_EXPO } },
} as const;

type Props = {
  copy: Dictionary['registration']['choice'];
  /** Elección de partida. La noche viene marcada, que es el acto principal. */
  initial?: readonly EventChoice[];
  onContinue?: (events: EventChoice[]) => void;
};

/**
 * Segundo paso del registro: a cuál de los dos actos del día se asiste.
 *
 * La elección es **múltiple**, así que las tarjetas son casillas de verificación
 * de verdad —no botones—: así el teclado y los lectores de pantalla anuncian que
 * se pueden marcar las dos, que es justo lo que unas tarjetas con una marca en la
 * esquina no dejan claro por sí solas.
 *
 * Nada se envía aquí: la elección se devuelve por `onContinue` y sigue viviendo
 * en el borrador del navegador hasta que el registro esté completo.
 */
export function EventChoiceScreen({ copy, initial = ['NIGHT'], onContinue }: Props) {
  const [chosen, setChosen] = useState<readonly EventChoice[]>(initial);
  const [error, setError] = useState<string | null>(null);

  function toggle(choice: EventChoice) {
    setError(null);
    setChosen((current) =>
      current.includes(choice) ? current.filter((c) => c !== choice) : [...current, choice],
    );
  }

  function submit() {
    if (!chosen.length) {
      setError(copy.needOne);
      return;
    }
    // En el orden del diseño, no en el que se fueron pulsando.
    onContinue?.(EVENT_OPTIONS.map((o) => o.choice).filter((c) => chosen.includes(c)));
  }

  return (
    /**
     * Entra y sale con el flujo: al volver desde el paso de datos, aparecer de
     * golpe se leía como un corte. La cascada la reparte a sus bloques.
     */
    <motion.section
      className={styles.root}
      initial="hidden"
      animate="shown"
      exit="gone"
      variants={PANEL}
    >
      <motion.div className={styles.intro} variants={ITEM}>
        <h1 className={styles.headline}>
          <span>{copy.headlineLine1}</span>
          <span>{copy.headlineLine2}</span>
        </h1>

        {/* Gira en CSS: el disparo es que aparezca, no una señal de JavaScript. */}
        <Image
          src={CHOICE_MARQUEE.src}
          alt=""
          width={200}
          height={200}
          className={styles.marquee}
          style={{ ['--spin' as string]: `${CHOICE_MARQUEE.spinSeconds}s` }}
          aria-hidden
        />
        <span className={styles.srOnly}>{copy.marquee}</span>
      </motion.div>

      <motion.div className={styles.panel} variants={PANEL}>
        <p className={styles.step}>{copy.step}</p>

        {EVENT_OPTIONS.map((option) => {
          const isChosen = chosen.includes(option.choice);
          return (
            <motion.div key={option.id} className={styles.slot} variants={ITEM}>
              {/* La nota explica de qué va la premiación, así que va antes de su
                  tarjeta y no dentro: es contexto, no parte del control. */}
              {option.id === 'award' && <p className={styles.note}>{copy.awardNote}</p>}

              <label className={styles.card} data-event={option.id} data-chosen={isChosen || undefined}>
                <input
                  type="checkbox"
                  className={styles.srOnly}
                  checked={isChosen}
                  onChange={() => toggle(option.choice)}
                />
                <span className={styles.srOnly}>{copy.events[option.id]}</span>

                <Image
                  src={option.logo.src}
                  alt=""
                  width={option.logo.width}
                  height={option.logo.height}
                  className={styles.logo}
                  aria-hidden
                />
                <Image
                  src={option.art.src}
                  alt=""
                  width={option.art.width}
                  height={option.art.height}
                  className={styles.art}
                  aria-hidden
                />

                {/* La marca solo aparece al elegir: es el estado, no un adorno. */}
                <AnimatePresence initial={false}>
                  {isChosen && (
                    <motion.span
                      className={styles.check}
                      title={copy.selected}
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.6 }}
                      transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                      aria-hidden
                    >
                      <svg viewBox="0 0 16 16" width="16" height="16" focusable="false">
                        <path
                          d="M2.5 8.5l3.5 3.5 7-7.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.4"
                          strokeLinecap="square"
                        />
                      </svg>
                    </motion.span>
                  )}
                </AnimatePresence>
              </label>
            </motion.div>
          );
        })}

        <motion.div className={styles.actions} variants={ITEM}>
          <button type="button" className={styles.submit} onClick={submit}>
            {copy.submit}
          </button>

          <AnimatePresence initial={false}>
            {error && (
              <motion.p
                className={styles.error}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                role="alert"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
