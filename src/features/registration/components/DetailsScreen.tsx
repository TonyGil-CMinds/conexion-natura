'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { CHOICE_MARQUEE, DETAILS_MARQUEE } from '../config/event-options';
import type { PersonDraft } from '../lib/join-draft';
import { normalizeLinkedIn } from '../lib/linkedin';
import styles from './DetailsScreen.module.css';

type Props = {
  copy: Dictionary['registration']['details'];
  /**
   * `self` son los datos de quien se registra; `companion`, los de su
   * acompañante en una segunda pasada por la misma pantalla. Cambia los rótulos,
   * el paso y quita la casilla —a un acompañante no se le pregunta si trae otro—.
   */
  mode?: 'self' | 'companion';
  initial?: Partial<PersonDraft>;
  /** Valor de partida de la casilla. Marcada por omisión: se espera compañía. */
  initialCompanion?: boolean;
  onContinue?: (person: PersonDraft, bringsCompanion: boolean) => void;
  /** Vuelve al paso anterior. Sin él, el botón no se pinta. */
  onBack?: () => void;
};

/** Campos del formulario, en el orden del diseño. `linkedin` es el único opcional. */
const FIELDS = ['name', 'surname', 'organization', 'role', 'linkedin'] as const;
type Field = (typeof FIELDS)[number];

/**
 * Qué le pide cada campo al navegador.
 *
 * Los nombres son los del estándar, así que el autorrelleno propone el dato que
 * toca en cada casilla —el nombre en el nombre, el cargo en el rol— y no el
 * primer texto que tenga guardado.
 *
 * En la pasada del **acompañante** van todos en `off` a propósito: los datos
 * guardados en el navegador son los de quien está sentado delante, así que
 * ofrecerlos ahí sugeriría rellenar al acompañante con su propia identidad.
 */
const AUTOCOMPLETE = {
  self: {
    name: 'given-name',
    surname: 'family-name',
    organization: 'organization',
    role: 'organization-title',
    linkedin: 'url',
  },
  companion: {
    name: 'off',
    surname: 'off',
    organization: 'off',
    role: 'off',
    linkedin: 'off',
  },
} as const satisfies Record<'self' | 'companion', Record<Field, string>>;

const EMPTY: PersonDraft = { name: '', surname: '', organization: '', role: '', linkedin: '' };

/**
 * Entrada y salida del panel.
 *
 * Los hijos van en cascada, y **al salir en el orden inverso**: si se fueran en
 * el mismo orden, el último campo se quedaría solo en pantalla un instante y el
 * paso parecía cortado. La salida es más rápida que la entrada porque es una
 * despedida, no una presentación.
 */
const PANEL = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07 } },
  gone: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
} as const;

const ITEM = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
  gone: { opacity: 0, y: 14, transition: { duration: 0.24, ease: EASE_OUT_EXPO } },
} as const;

/**
 * Paso de datos: los cinco campos de una persona.
 *
 * La misma pantalla sirve para quien se registra y para su acompañante: son los
 * mismos campos y el mismo tratamiento, así que duplicar el componente solo
 * habría duplicado el sitio donde corregir algo.
 *
 * Los campos **entran uno tras otro**. Va con Framer Motion y no con CSS porque
 * el disparo es una señal de JavaScript —el cambio de paso—, no la carga de la
 * página.
 *
 * Nada se envía aquí: los datos se devuelven por `onContinue` y siguen en el
 * borrador del navegador hasta que el registro esté completo.
 */
export function DetailsScreen({
  copy,
  mode = 'self',
  initial,
  initialCompanion = true,
  onContinue,
  onBack,
}: Props) {
  const [person, setPerson] = useState<PersonDraft>({ ...EMPTY, ...initial });
  const [bringsCompanion, setBringsCompanion] = useState(initialCompanion);
  const [missing, setMissing] = useState<readonly Field[]>([]);

  const isCompanion = mode === 'companion';
  const labels = isCompanion ? copy.companionFields : copy.fields;

  function submit(event: FormEvent) {
    event.preventDefault();
    // El enlace no es obligatorio; el resto sí.
    const empty = FIELDS.filter((field) => field !== 'linkedin' && !person[field].trim());
    if (empty.length) {
      setMissing(empty);
      return;
    }
    setMissing([]);
    const trimmed = Object.fromEntries(
      FIELDS.map((field) => [field, person[field].trim()]),
    ) as PersonDraft;
    trimmed.linkedin = normalizeLinkedIn(trimmed.linkedin);
    onContinue?.(trimmed, isCompanion ? false : bringsCompanion);
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
        {/* Volver y titular van juntos: así la columna izquierda sigue teniendo
            dos bloques, y en tablet —donde se ponen en fila con la moneda— el
            botón no se convierte en una tercera columna. */}
        <div className={styles.heading}>
          {onBack && (
            <button type="button" className={styles.back} onClick={onBack}>
              {/* La flecha va como máscara para tomar la tinta del rótulo. */}
              <span className={styles.backIcon} aria-hidden />
              {copy.back}
            </button>
          )}

          <h1 className={styles.headline}>
            <span>{isCompanion ? copy.companionHeadlineLine1 : copy.headlineLine1}</span>
            <span>{isCompanion ? copy.companionHeadlineLine2 : copy.headlineLine2}</span>
          </h1>
        </div>

        {/**
         * La marca gira sobre su eje vertical, como una moneda de canto: dos caras
         * en el mismo sitio, la de atrás ya volteada, y el contenedor rota media
         * vuelta. La cara oculta no se pinta (`backface-visibility`), así que en la
         * mitad del giro se ve entrar la nueva sin cortes.
         */}
        {/* Al salir vuelve a girar hasta la cara de partida, así que el paso
            anterior recupera su marca sin cortes. */}
        <motion.div
          className={styles.coin}
          initial={{ rotateY: 0 }}
          animate={{ rotateY: 180 }}
          exit={{ rotateY: 360 }}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
        >
          <Image
            src={CHOICE_MARQUEE.src}
            alt=""
            width={200}
            height={200}
            className={`${styles.face} ${styles.front}`}
            aria-hidden
          />
          <Image
            src={DETAILS_MARQUEE.src}
            alt=""
            width={200}
            height={200}
            className={`${styles.face} ${styles.faceBack}`}
            aria-hidden
          />
        </motion.div>
        <span className={styles.srOnly}>{copy.marquee}</span>
      </div>

      <motion.form className={styles.panel} onSubmit={submit} noValidate variants={PANEL}>
        <p className={styles.step}>{isCompanion ? copy.stepCompanion : copy.step}</p>

        {FIELDS.map((field) => (
          <motion.label
            key={field}
            className={styles.field}
            data-missing={missing.includes(field) || undefined}
            variants={ITEM}
          >
            <span className={styles.srOnly}>{labels[field]}</span>
            <input
              type="text"
              name={field}
              value={person[field]}
              onChange={(event) => {
                setPerson((current) => ({ ...current, [field]: event.target.value }));
                if (missing.includes(field)) setMissing((m) => m.filter((f) => f !== field));
              }}
              onBlur={
                field === 'linkedin'
                  ? () =>
                      setPerson((current) => ({
                        ...current,
                        linkedin: normalizeLinkedIn(current.linkedin),
                      }))
                  : undefined
              }
              placeholder={labels[field]}
              autoComplete={AUTOCOMPLETE[isCompanion ? 'companion' : 'self'][field]}
              /**
               * Teclado de URL sin `type="url"`: con ese tipo, «antoniogil» —que es
               * lo que la gente escribe— quedaba marcado como inválido por el
               * navegador. Se completa solo al salir del campo.
               */
              inputMode={field === 'linkedin' ? 'url' : undefined}
              className={styles.input}
            />
          </motion.label>
        ))}

        {!isCompanion && (
          <motion.label className={styles.companion} variants={ITEM}>
            <input
              type="checkbox"
              className={styles.srOnly}
              checked={bringsCompanion}
              onChange={(event) => setBringsCompanion(event.target.checked)}
            />
            <span className={styles.box} aria-hidden>
              <svg viewBox="0 0 16 16" width="16" height="16" focusable="false">
                <path
                  d="M2.5 8.5l3.5 3.5 7-7.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="square"
                />
              </svg>
            </span>
            <span className={styles.companionLabel}>{copy.withCompanion}</span>
          </motion.label>
        )}

        <motion.div className={styles.actions} variants={ITEM}>
          <button type="submit" className={styles.submit}>
            {copy.submit}
          </button>

          <AnimatePresence initial={false}>
            {missing.length > 0 && (
              <motion.p
                className={styles.error}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                role="alert"
              >
                {copy.required}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.form>
    </motion.section>
  );
}
