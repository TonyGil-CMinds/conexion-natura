'use client';

import { useState, type FormEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { CHOICE_MARQUEE, DETAILS_MARQUEE } from '../config/event-options';
import type { GuestDraft, PersonDraft } from '../lib/join-draft';
import { normalizeLinkedIn } from '../lib/linkedin';
import styles from './DetailsScreen.module.css';

type Props = {
  copy: Dictionary['registration']['details'];
  /**
   * `self` son los datos de quien se registra; `guest`, la segunda pasada por la
   * misma pantalla para invitar a alguien.
   *
   * En `guest` solo se piden **dos** campos —nombre y correo— porque el resto lo
   * rellenará esa persona desde el enlace que recibe: nadie sabe mejor que ella
   * cuál es su cargo. Y no lleva casilla: a un invitado no se le pregunta si
   * trae a otro.
   */
  mode?: 'self' | 'guest';
  initial?: Partial<PersonDraft>;
  initialGuest?: Partial<GuestDraft>;
  /** Valor de partida de la casilla. Marcada por omisión: se espera compañía. */
  initialBringsGuest?: boolean;
  onContinue?: (person: PersonDraft, bringsGuest: boolean) => void;
  /** Se llama en la pasada del invitado, con sus dos datos. */
  onGuest?: (guest: GuestDraft) => void;
  /** Vuelve al paso anterior. Sin él, el botón no se pinta. */
  onBack?: () => void;
};

/** Campos del formulario, en el orden del diseño. `linkedin` es el único opcional. */
const FIELDS = ['name', 'surname', 'organization', 'role', 'linkedin'] as const;
type Field = (typeof FIELDS)[number];

/** Del invitado, solo lo que quien invita puede saber de memoria. */
const GUEST_FIELDS = ['name', 'email'] as const;
type GuestField = (typeof GUEST_FIELDS)[number];

/** Lo mínimo para no mandar una invitación a una dirección imposible. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Qué le pide cada campo al navegador.
 *
 * Los nombres son los del estándar, así que el autorrelleno propone el dato que
 * toca en cada casilla —el nombre en el nombre, el cargo en el rol— y no el
 * primer texto que tenga guardado.
 *
 * En la pasada del **invitado** van en `off` a propósito: los datos guardados en
 * el navegador son los de quien está sentado delante, así que ofrecerlos ahí
 * sugeriría invitarse a uno mismo —y con el correo eso además fallaría, porque
 * un correo es un registro—.
 */
const AUTOCOMPLETE = {
  name: 'given-name',
  surname: 'family-name',
  organization: 'organization',
  role: 'organization-title',
  linkedin: 'url',
} as const satisfies Record<Field, string>;

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
  initialGuest,
  initialBringsGuest = true,
  onContinue,
  onGuest,
  onBack,
}: Props) {
  const [person, setPerson] = useState<PersonDraft>({ ...EMPTY, ...initial });
  const [guest, setGuest] = useState<GuestDraft>({ name: '', email: '', ...initialGuest });
  const [bringsGuest, setBringsGuest] = useState(initialBringsGuest);
  const [missing, setMissing] = useState<readonly string[]>([]);

  const isGuest = mode === 'guest';
  /** Los campos de esta pasada. Cinco para uno mismo, dos para el invitado. */
  const fields: readonly string[] = isGuest ? GUEST_FIELDS : FIELDS;
  const labels = isGuest ? copy.guestFields : copy.fields;
  const values: Record<string, string> = isGuest ? guest : person;

  function change(field: string, value: string) {
    if (isGuest) setGuest((current) => ({ ...current, [field]: value }));
    else setPerson((current) => ({ ...current, [field]: value }));
    if (missing.includes(field)) setMissing((m) => m.filter((f) => f !== field));
  }

  function submit(event: FormEvent) {
    event.preventDefault();

    if (isGuest) {
      /**
       * El correo del invitado se comprueba aquí y no solo en el servidor: si
       * está mal escrito, la invitación se manda a una dirección que no existe y
       * nadie se enteraría —el rebote no llega a esta pantalla—.
       */
      const empty = GUEST_FIELDS.filter((field) => !guest[field].trim());
      const badEmail = !empty.includes('email') && !EMAIL.test(guest.email.trim());
      if (empty.length || badEmail) {
        setMissing(badEmail ? [...empty, 'email'] : empty);
        return;
      }
      setMissing([]);
      onGuest?.({ name: guest.name.trim(), email: guest.email.trim().toLowerCase() });
      return;
    }

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
    onContinue?.(trimmed, bringsGuest);
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
            <span>{isGuest ? copy.guestHeadlineLine1 : copy.headlineLine1}</span>
            <span>{isGuest ? copy.guestHeadlineLine2 : copy.headlineLine2}</span>
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
        <p className={styles.step}>{isGuest ? copy.stepGuest : copy.step}</p>

        {/* La nota solo en la pasada del invitado: explica por qué se le piden
            dos datos y no los cinco. Sin ella parece un formulario a medias. */}
        {isGuest && (
          <motion.p className={styles.note} variants={ITEM}>
            {copy.guestNote}
          </motion.p>
        )}

        {fields.map((field) => (
          <motion.label
            key={field}
            className={styles.field}
            data-missing={missing.includes(field) || undefined}
            variants={ITEM}
          >
            <span className={styles.srOnly}>{labels[field as keyof typeof labels]}</span>
            <input
              /**
               * El correo va como `email` para que el móvil saque el teclado con
               * arroba, pero sin la validación del navegador —que la hace el
               * componente— para que el aviso sea el del diseño.
               */
              type={field === 'email' ? 'email' : 'text'}
              name={field}
              value={values[field] ?? ''}
              onChange={(event) => change(field, event.target.value)}
              onBlur={
                field === 'linkedin'
                  ? () =>
                      setPerson((current) => ({
                        ...current,
                        linkedin: normalizeLinkedIn(current.linkedin),
                      }))
                  : undefined
              }
              placeholder={labels[field as keyof typeof labels]}
              /**
               * En la pasada del invitado no se propone nada: lo guardado en el
               * navegador es de quien está delante, no de a quien invita.
               */
              autoComplete={isGuest ? 'off' : AUTOCOMPLETE[field as Field]}
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

        {!isGuest && (
          <motion.label className={styles.companion} variants={ITEM}>
            <input
              type="checkbox"
              className={styles.srOnly}
              checked={bringsGuest}
              onChange={(event) => setBringsGuest(event.target.checked)}
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
