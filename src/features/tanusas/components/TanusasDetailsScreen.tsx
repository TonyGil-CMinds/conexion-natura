'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { TANUSAS } from '@/config/tanusas';
import styles from './TanusasRegistration.module.css';

/**
 * Los campos de texto, en el orden del diseño. El correo no está: lo dio el
 * hero, y volver a pedirlo sería preguntar por el dato que trajo hasta aquí.
 * `question` va aparte porque es texto largo.
 */
const FIELDS = ['name', 'surname', 'organization', 'role', 'city'] as const;
type Field = (typeof FIELDS)[number];

export type DetailsDraft = Record<Field | 'question', string>;

export const EMPTY_DETAILS: DetailsDraft = {
  name: '',
  surname: '',
  organization: '',
  role: '',
  city: '',
  question: '',
};

/**
 * Qué le pide cada campo al navegador. Son los nombres del estándar, así que el
 * autorrelleno propone el dato que toca en cada casilla.
 *
 * `city` va en `off`: no es la ciudad de quien rellena sino la de su vuelo, y
 * las dos no tienen por qué coincidir.
 */
const AUTOCOMPLETE = {
  name: 'given-name',
  surname: 'family-name',
  organization: 'organization',
  role: 'organization-title',
  city: 'off',
} as const satisfies Record<Field, string>;

/** Entrada y salida en cascada, como los pasos del registro del sitio. */
const PANEL = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.06 } },
  gone: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
} as const;

const ITEM = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
  gone: { opacity: 0, y: 14, transition: { duration: 0.22, ease: EASE_OUT_EXPO } },
} as const;

type Props = {
  copy: Dictionary['tanusas']['registration']['details'];
  initial?: DetailsDraft;
  onContinue: (details: DetailsDraft) => void;
};

/**
 * Primer paso del registro del retiro: quién eres y desde dónde vienes.
 *
 * Reproduce el paso de datos de `/registro` —titular y moneda a la izquierda,
 * campos a la derecha, cascada de entrada— pero no reutiliza su componente:
 * allí son cinco campos fijos de una persona y una casilla de acompañante, y
 * aquí hay ciudad de vuelo, una pregunta abierta y ningún invitado.
 *
 * Nada se envía todavía: los datos suben por `onContinue` y el envío ocurre al
 * final, cuando ya hay fotografía.
 */
export function TanusasDetailsScreen({ copy, initial, onContinue }: Props) {
  const [values, setValues] = useState<DetailsDraft>(initial ?? EMPTY_DETAILS);
  const [missing, setMissing] = useState<readonly string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function change(field: keyof DetailsDraft, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (missing.includes(field)) setMissing((m) => m.filter((f) => f !== field));
  }

  function submit(event: FormEvent) {
    event.preventDefault();

    // La pregunta es opcional; los cinco datos de arriba no.
    const empty = FIELDS.filter((field) => !values[field].trim());
    if (empty.length) {
      setMissing(empty);
      setError(copy.required);
      return;
    }

    setMissing([]);
    setError(null);
    onContinue(
      Object.fromEntries(
        Object.entries(values).map(([field, value]) => [field, value.trim()]),
      ) as DetailsDraft,
    );
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

      <motion.form className={styles.panel} onSubmit={submit} noValidate variants={PANEL}>
        <motion.p className={styles.step} variants={ITEM}>
          {copy.step}
        </motion.p>

        {/* Nombre y apellido comparten fila: son dos mitades del mismo dato. */}
        <motion.div className={styles.fieldPair} variants={ITEM}>
          {(['name', 'surname'] as const).map((field) => (
            <label key={field} className={styles.field}>
              <span className={styles.fieldLabel}>{copy.fields[field]}</span>
              <input
                type="text"
                name={field}
                value={values[field]}
                onChange={(event) => change(field, event.target.value)}
                placeholder={copy.placeholders[field]}
                data-missing={missing.includes(field) || undefined}
                className={styles.input}
                autoComplete={AUTOCOMPLETE[field]}
              />
            </label>
          ))}
        </motion.div>

        {FIELDS.filter((field) => field !== 'name' && field !== 'surname').map((field) => (
          <motion.label key={field} className={styles.field} variants={ITEM}>
            <span className={styles.fieldLabel}>{copy.fields[field]}</span>
            <input
              type="text"
              name={field}
              value={values[field]}
              onChange={(event) => change(field, event.target.value)}
              placeholder={copy.placeholders[field]}
              data-missing={missing.includes(field) || undefined}
              className={styles.input}
              autoComplete={AUTOCOMPLETE[field]}
            />
            {field === 'city' && <span className={styles.hint}>{copy.hints.city}</span>}
          </motion.label>
        ))}

        <motion.label className={styles.field} variants={ITEM}>
          <span className={styles.fieldLabel}>{copy.fields.question}</span>
          <textarea
            name="question"
            value={values.question}
            onChange={(event) => change('question', event.target.value)}
            placeholder={copy.placeholders.question}
            className={styles.textarea}
          />
          <span className={styles.hint}>{copy.hints.question}</span>
        </motion.label>

        <motion.div className={styles.actions} variants={ITEM}>
          <button type="submit" className={styles.submit}>
            {copy.submit}
          </button>
        </motion.div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </motion.form>
    </motion.section>
  );
}
