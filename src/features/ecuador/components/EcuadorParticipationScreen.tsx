'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { ECUADOR } from '@/config/ecuador';
import styles from '@/features/registration/components/StepShell.module.css';
import {
  PARTICIPATION_OPTIONS,
  needsPitch,
  type ParticipationKey,
} from '../config/participation-options';
import { ParticipationIcon } from './ParticipationIcon';
import local from './EcuadorRegistration.module.css';

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

export type ParticipationDraft = {
  participation: ParticipationKey | null;
  tablePitch: string;
};

type Props = {
  copy: Dictionary['ecuador']['registration']['participation'];
  initial?: ParticipationDraft;
  /**
   * Puede devolver una promesa: desde que no hay paso de fotografía, **esta**
   * es la pantalla que confirma el registro, así que tiene que poder esperar
   * al servidor y contar si algo falla.
   */
  onContinue: (value: ParticipationDraft) => void | Promise<void>;
  onBack: () => void;
};

/**
 * Segundo paso: cómo se quiere participar.
 *
 * Es la elección de acto del registro de Quito dada la vuelta. Allí se marcan
 * casillas —se puede ir a los dos actos—; aquí son **radios**, porque las dos
 * opciones no se suman: pedir mesa ya incluye asistir.
 *
 * El detalle de qué se presentaría aparece solo al pedir mesa: preguntárselo a
 * quien viene de público sería preguntar por nada, y es justo el texto con el
 * que el equipo decide a quién le asigna un espacio.
 */
export function EcuadorParticipationScreen({ copy, initial, onContinue, onBack }: Props) {
  const [chosen, setChosen] = useState<ParticipationKey | null>(initial?.participation ?? null);
  const [pitch, setPitch] = useState(initial?.tablePitch ?? '');
  const [error, setError] = useState<string | null>(null);
  /** Mientras el registro viaja al servidor. */
  const [isSending, setIsSending] = useState(false);

  const wantsTable = chosen !== null && needsPitch(chosen);

  async function submit() {
    if (isSending) return;
    if (!chosen) {
      setError(copy.needOne);
      return;
    }
    if (wantsTable && !pitch.trim()) {
      setError(copy.pitchRequired);
      return;
    }
    setError(null);
    setIsSending(true);
    try {
      // Sin mesa no se arrastra lo que se llegó a escribir antes de cambiar de
      // idea: lo que se guarda tiene que decir la verdad.
      await onContinue({ participation: chosen, tablePitch: wantsTable ? pitch.trim() : '' });
    } catch {
      setError(copy.failed);
    } finally {
      setIsSending(false);
    }
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
          src={ECUADOR.marquee.participation}
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

        <motion.div
          className={local.grid}
          role="radiogroup"
          aria-label={copy.groupLabel}
          variants={PANEL}
        >
          {PARTICIPATION_OPTIONS.map((option) => {
            const isChosen = chosen === option.key;
            return (
              <motion.label
                key={option.key}
                className={local.card}
                data-chosen={isChosen || undefined}
                variants={ITEM}
              >
                <input
                  type="radio"
                  name="participation"
                  className={styles.srOnly}
                  checked={isChosen}
                  onChange={() => {
                    setChosen(option.key);
                    setError(null);
                  }}
                />
                <span className={local.icon} aria-hidden>
                  <ParticipationIcon name={option.key} />
                </span>
                <span className={local.text}>
                  <span className={local.name}>{copy.options[option.key]}</span>
                  <span className={local.note}>{copy.descriptions[option.key]}</span>
                </span>

                {/* La marca solo aparece al elegir: es el estado, no un adorno. */}
                <AnimatePresence initial={false}>
                  {isChosen && (
                    <motion.span
                      className={local.check}
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
          {wantsTable && (
            <motion.label
              className={styles.field}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
            >
              <span className={styles.fieldLabel}>{copy.pitchLabel}</span>
              <textarea
                name="tablePitch"
                value={pitch}
                onChange={(event) => {
                  setPitch(event.target.value);
                  setError(null);
                }}
                placeholder={copy.pitchPlaceholder}
                className={styles.textarea}
              />
              <span className={styles.hint}>{copy.pitchHint}</span>
            </motion.label>
          )}
        </AnimatePresence>

        <motion.div className={styles.actions} variants={ITEM}>
          <button
            type="button"
            className={styles.submit}
            onClick={() => void submit()}
            disabled={isSending}
          >
            {isSending ? copy.confirming : copy.submit}
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
