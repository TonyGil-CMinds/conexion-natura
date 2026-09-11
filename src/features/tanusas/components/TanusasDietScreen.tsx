'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import Image from 'next/image';
import type { Dictionary } from '@/i18n';
import { TANUSAS } from '@/config/tanusas';
import { DIET_OPTIONS, type DietKey } from '../config/diet-options';
import { DietIcon } from './DietIcon';
import styles from './TanusasRegistration.module.css';

const PANEL = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.05 } },
  gone: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
} as const;

const ITEM = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.38, ease: EASE_OUT_EXPO } },
  gone: { opacity: 0, y: 14, transition: { duration: 0.22, ease: EASE_OUT_EXPO } },
} as const;

export type DietDraft = { diet: readonly DietKey[]; dietNotes: string };

type Props = {
  copy: Dictionary['tanusas']['registration']['diet'];
  initial?: DietDraft;
  onContinue: (value: DietDraft) => void;
  onBack: () => void;
};

/**
 * Segundo paso: restricciones alimentarias o de salud.
 *
 * Las tarjetas son **casillas de verificación de verdad**, como las de la
 * elección de acto del registro de Quito: la elección es múltiple, y unos
 * botones con una marca en la esquina no se lo dicen ni al teclado ni a un
 * lector de pantalla.
 *
 * «Sin restricciones» es excluyente: marcarla borra el resto, y marcar
 * cualquier otra la quita. Es una regla de la elección —no se puede no tener
 * ninguna y tener una—, así que vive aquí y no en la validación.
 *
 * El detalle libre aparece solo cuando hace falta: una alergia sin decir a qué
 * no sirve para encargar la comida, y pedírselo a quien marcó «vegetariana»
 * sería preguntar por nada.
 */
export function TanusasDietScreen({ copy, initial, onContinue, onBack }: Props) {
  const [chosen, setChosen] = useState<readonly DietKey[]>(initial?.diet ?? []);
  const [notes, setNotes] = useState(initial?.dietNotes ?? '');
  const [error, setError] = useState<string | null>(null);

  /** Si alguna de las marcadas pide detalle, el detalle es obligatorio. */
  const needsNotes = DIET_OPTIONS.some(
    (option) => option.needsNotes && chosen.includes(option.key),
  );

  function toggle(option: (typeof DIET_OPTIONS)[number]) {
    setError(null);
    setChosen((current) => {
      if (current.includes(option.key)) return current.filter((key) => key !== option.key);
      if (option.exclusive) return [option.key];
      return [...current.filter((key) => !DIET_OPTIONS.find((o) => o.key === key)?.exclusive), option.key];
    });
  }

  function submit() {
    if (!chosen.length) {
      setError(copy.needOne);
      return;
    }
    if (needsNotes && !notes.trim()) {
      setError(copy.notesRequired);
      return;
    }
    setError(null);
    onContinue({
      // En el orden del catálogo, no en el que se fueron pulsando.
      diet: DIET_OPTIONS.map((option) => option.key).filter((key) => chosen.includes(key)),
      dietNotes: needsNotes ? notes.trim() : '',
    });
  }

  return (
    <motion.section
      className={styles.root}
      initial="hidden"
      animate="shown"
      exit="gone"
      variants={PANEL}
    >
      <div className={styles.intro}>
        <div className={styles.heading}>
          <button type="button" className={styles.back} onClick={onBack}>
            <span className={styles.backIcon} aria-hidden />
            {copy.back}
          </button>

          <h1 className={styles.headline}>
            <span>{copy.headlineLine1}</span>
            <span>{copy.headlineLine2}</span>
          </h1>
          <p>{copy.intro}</p>
        </div>

        <Image
          src={TANUSAS.media.marquee}
          alt=""
          width={150}
          height={150}
          className={styles.marquee}
          aria-hidden
        />
      </div>

      <motion.div className={styles.panel} variants={PANEL}>
        <motion.p className={styles.step} variants={ITEM}>
          {copy.step}
        </motion.p>

      <motion.div className={styles.dietGrid} variants={PANEL}>
        {DIET_OPTIONS.map((option) => {
          const isChosen = chosen.includes(option.key);
          return (
            <motion.label
              key={option.key}
              className={styles.dietCard}
              data-chosen={isChosen || undefined}
              variants={ITEM}
            >
              <input
                type="checkbox"
                className={styles.srOnly}
                checked={isChosen}
                onChange={() => toggle(option)}
              />
              <span className={styles.dietIcon} aria-hidden>
                <DietIcon name={option.key} />
              </span>
              <span className={styles.dietText}>
                <span className={styles.dietName}>{copy.options[option.key]}</span>
                <span className={styles.dietNote}>{copy.descriptions[option.key]}</span>
              </span>

              {/* La marca solo aparece al elegir: es el estado, no un adorno. */}
              <AnimatePresence initial={false}>
                {isChosen && (
                  <motion.span
                    className={styles.dietCheck}
                    title={copy.selected}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
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
            </motion.label>
          );
        })}
      </motion.div>

      <AnimatePresence initial={false}>
        {needsNotes && (
          <motion.label
            className={styles.field}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
          >
            <span className={styles.fieldLabel}>{copy.notesLabel}</span>
            <textarea
              name="dietNotes"
              value={notes}
              onChange={(event) => {
                setNotes(event.target.value);
                setError(null);
              }}
              placeholder={copy.notesPlaceholder}
              className={styles.textarea}
            />
          </motion.label>
        )}
      </AnimatePresence>

      <motion.div className={styles.actions} variants={ITEM}>
        <button type="button" className={styles.submit} onClick={submit}>
          {copy.submit}
        </button>
      </motion.div>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
      </motion.div>
    </motion.section>
  );
}
