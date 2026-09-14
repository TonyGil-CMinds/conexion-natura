'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { ECUADOR } from '@/config/ecuador';
import styles from '@/features/registration/components/StepShell.module.css';
import local from './EcuadorRegistration.module.css';

/**
 * Los dos datos obligatorios. El correo no está: lo dio la primera pantalla, y
 * volver a pedirlo sería preguntar por el dato que trajo hasta aquí.
 */
const FIELDS = ['fullName', 'organization'] as const;
type Field = (typeof FIELDS)[number];

export type DetailsDraft = {
  fullName: string;
  organization: string;
  /** Si viene acompañado. Los dos campos de abajo solo cuentan si es `true`. */
  bringsGuest: boolean;
  guestName: string;
  guestEmail: string;
};

export const EMPTY_DETAILS: DetailsDraft = {
  fullName: '',
  organization: '',
  bringsGuest: false,
  guestName: '',
  guestEmail: '',
};

/**
 * Qué le pide cada campo al navegador, con los nombres del estándar: así el
 * autorrelleno propone el dato que toca en cada casilla.
 */
const AUTOCOMPLETE = {
  fullName: 'name',
  organization: 'organization',
} as const satisfies Record<Field, string>;

/**
 * Lo mínimo para no dejar pasar un correo sin arroba ni dominio. La validación
 * de verdad la hace el servidor.
 */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
  copy: Dictionary['ecuador']['registration']['details'];
  initial?: DetailsDraft;
  onContinue: (details: DetailsDraft) => void;
};

/**
 * Primer paso: quién se apunta y con qué organización.
 *
 * Es el paso de datos del retiro con otros campos: un solo nombre —el
 * formulario original pide «nombre completo», y partirlo al guardar sería
 * inventar dónde acaba— y la pregunta del acompañante, que aquí es un dato de
 * aforo y no una persona con registro propio.
 *
 * Nada se envía todavía: los datos suben por `onContinue` y el envío ocurre al
 * final, cuando ya hay fotografía.
 */
export function EcuadorDetailsScreen({ copy, initial, onContinue }: Props) {
  const [values, setValues] = useState<DetailsDraft>(initial ?? EMPTY_DETAILS);
  const [missing, setMissing] = useState<readonly string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function change(field: keyof DetailsDraft, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    if (missing.includes(field)) setMissing((m) => m.filter((f) => f !== field));
    if (error) setError(null);
  }

  function submit(event: FormEvent) {
    event.preventDefault();

    const empty: string[] = FIELDS.filter((field) => !values[field].trim());

    /**
     * Si dice que viene acompañado, el nombre y el correo dejan de ser
     * opcionales: la pregunta es «confirma su nombre y correo», así que un «sí»
     * a secas no sirve para reservar la plaza de nadie.
     */
    if (values.bringsGuest) {
      if (!values.guestName.trim()) empty.push('guestName');
      if (!EMAIL.test(values.guestEmail.trim())) empty.push('guestEmail');
    }

    if (empty.length) {
      setMissing(empty);
      setError(values.bringsGuest && empty.includes('guestEmail') ? copy.guestInvalid : copy.required);
      return;
    }

    setMissing([]);
    setError(null);
    onContinue({
      fullName: values.fullName.trim(),
      organization: values.organization.trim(),
      bringsGuest: values.bringsGuest,
      // Sin acompañante no se arrastra lo que se llegó a teclear antes de
      // cambiar de idea: lo que se guarda tiene que decir la verdad.
      guestName: values.bringsGuest ? values.guestName.trim() : '',
      guestEmail: values.bringsGuest ? values.guestEmail.trim().toLowerCase() : '',
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
          <h1 className={styles.headline}>
            <span>{copy.headlineLine1}</span>
            <span>{copy.headlineLine2}</span>
          </h1>
          <p>{copy.intro}</p>
        </div>

        <Image
          src={ECUADOR.marquee.details}
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

        {FIELDS.map((field) => (
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
          </motion.label>
        ))}

        <motion.div className={styles.group} variants={ITEM}>
          <span className={styles.groupLabel} id="guest-question">
            {copy.guestQuestion}
          </span>

          {/**
           * Sí y No son dos radios de un mismo grupo, no dos botones: es una
           * pregunta con dos respuestas excluyentes, y el teclado y el lector de
           * pantalla tienen que poder recorrerla como tal.
           */}
          <div className={styles.choices} role="radiogroup" aria-labelledby="guest-question">
            {[true, false].map((value) => (
              <label
                key={String(value)}
                className={styles.choice}
                data-chosen={values.bringsGuest === value || undefined}
              >
                <input
                  type="radio"
                  name="bringsGuest"
                  className={styles.srOnly}
                  checked={values.bringsGuest === value}
                  onChange={() => change('bringsGuest', value)}
                />
                {value ? copy.guestYes : copy.guestNo}
              </label>
            ))}
          </div>

          <AnimatePresence initial={false}>
            {values.bringsGuest && (
              <motion.div
                className={local.guestFields}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
              >
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{copy.fields.guestName}</span>
                  <input
                    type="text"
                    name="guestName"
                    value={values.guestName}
                    onChange={(event) => change('guestName', event.target.value)}
                    placeholder={copy.placeholders.guestName}
                    data-missing={missing.includes('guestName') || undefined}
                    className={styles.input}
                    autoComplete="off"
                  />
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabel}>{copy.fields.guestEmail}</span>
                  <input
                    type="email"
                    name="guestEmail"
                    value={values.guestEmail}
                    onChange={(event) => change('guestEmail', event.target.value)}
                    placeholder={copy.placeholders.guestEmail}
                    data-missing={missing.includes('guestEmail') || undefined}
                    className={styles.input}
                    autoComplete="off"
                    inputMode="email"
                  />
                </label>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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
