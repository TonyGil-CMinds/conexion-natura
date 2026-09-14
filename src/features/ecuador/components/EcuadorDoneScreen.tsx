'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import {
  CEIBA_BADGE,
  ProfileCard,
  addToCalendar,
  downloadBadge,
  renderBadge,
  shareBadge,
  type CalendarTarget,
  type CalendarWhen,
} from '@/features/registration';
import { ECUADOR } from '@/config/ecuador';
import { SITE } from '@/config/site';
import type { Dictionary } from '@/i18n';
import type { ParticipationKey } from '../config/participation-options';
import styles from '@/features/registration/components/StepShell.module.css';

/** Los tres destinos, en el orden en que se ofrecen. */
const TARGETS = ['google', 'outlook', 'ics'] as const satisfies readonly CalendarTarget[];

type Props = {
  copy: Dictionary['ecuador']['registration'];
  email: string;
  fullName: string;
  organization: string;
  participation: ParticipationKey | null;
  guestName: string;
  photoUrl: string | null;
  onEdit: () => void;
};

/**
 * Pantalla final del registro de empresas.
 *
 * Hace lo mismo que la del retiro y con las mismas piezas —la credencial se
 * compone en un lienzo, la tarjeta gira con el puntero, el calendario se elige y
 * no se impone— pero con el arte de la Natura500 Night, que es el acto al que se
 * viene: `CEIBA_BADGE`, el mismo que entrega `/registro`.
 *
 * La credencial se compone **al pedirla** y no al entrar: es una imagen de 1290
 * píxeles de lado que hay que descargar y dibujar, y quien solo viene a
 * comprobar su registro no tiene por qué pagarla.
 */
export function EcuadorDoneScreen({
  copy,
  email,
  fullName,
  organization,
  participation,
  guestName,
  photoUrl,
  onEdit,
}: Props) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [badge, setBadge] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  /** Cierra el menú del calendario al pulsar fuera o con Escape. */
  useEffect(() => {
    if (!isCalendarOpen) return;
    const onPointer = (event: MouseEvent) => {
      if (!calendarRef.current?.contains(event.target as Node)) setIsCalendarOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCalendarOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [isCalendarOpen]);

  /** El aviso se va solo: es un acuse, no un estado. */
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 3200);
    return () => clearTimeout(timer);
  }, [notice]);

  const openCard = useCallback(async () => {
    setIsCardOpen(true);
    if (badge) return;
    /**
     * El nombre va entero en `name` y `surname` queda vacío: el lienzo los
     * junta con un espacio y recorta, así que un nombre completo sale bien sin
     * partirlo por donde no toca.
     */
    setBadge(await renderBadge({ name: fullName, surname: '', organization, photoUrl }));
  }, [badge, fullName, organization, photoUrl]);

  function pickCalendar(target: CalendarTarget) {
    setIsCalendarOpen(false);
    addToCalendar(target, {
      uid: ECUADOR.calendarUid,
      title: copy.done.calendarTitle,
      description: copy.done.calendarDescription,
      location: `${SITE.event.venue.name}, ${SITE.event.place}`,
      when: SITE.event.calendar as CalendarWhen,
    });
  }

  async function share() {
    if (!badge) return;
    const result = await shareBadge(badge, {
      title: copy.done.shareTitle,
      text: copy.done.shareText,
    });
    if (result === 'shared') setNotice(copy.done.shared);
    else if (result === 'copied') setNotice(copy.done.copied);
    else setNotice(copy.done.shareFailed);
  }

  const firstName = fullName.trim().split(' ')[0];

  return (
    <motion.section
      className={styles.root}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.4, ease: EASE_OUT_EXPO }}
    >
      <div className={styles.intro}>
        <div className={styles.heading}>
          <h1 className={styles.headline}>
            <span>{copy.done.greeting}</span>
            <span>{firstName || copy.done.greetingFallback}</span>
          </h1>
          <p>{copy.done.body}</p>
          {/* Quien firma el acuse, como en el formulario original. */}
          <p>{copy.done.signature}</p>
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

      <div className={styles.panel}>
        <dl className={styles.rows}>
          <div className={styles.row}>
            <dt className={styles.rowLabel}>{copy.done.emailLabel}</dt>
            <dd className={styles.rowValue}>{email}</dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.rowLabel}>{copy.done.eventLabel}</dt>
            <dd className={styles.rowValue}>{copy.done.eventValue}</dd>
          </div>
          {participation && (
            <div className={styles.row}>
              <dt className={styles.rowLabel}>{copy.done.participationLabel}</dt>
              <dd className={styles.rowValue}>{copy.participation.options[participation]}</dd>
            </div>
          )}
          {guestName && (
            <div className={styles.row}>
              <dt className={styles.rowLabel}>{copy.done.guestLabel}</dt>
              <dd className={styles.rowValue}>{guestName}</dd>
            </div>
          )}
        </dl>

        <div className={styles.doneActions}>
          {/**
           * El calendario se elige, no se impone: el `.ics` vale para todos pero
           * en Google —que es la mayoría— obliga a descargar e importar a mano.
           */}
          <div className={styles.calendar} ref={calendarRef}>
            <button
              type="button"
              className={styles.submit}
              onClick={() => setIsCalendarOpen((open) => !open)}
              aria-expanded={isCalendarOpen}
              aria-haspopup="menu"
            >
              {copy.done.addToCalendar}
            </button>

            <AnimatePresence>
              {isCalendarOpen && (
                <motion.div
                  className={styles.menu}
                  role="menu"
                  aria-label={copy.done.calendarLabel}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
                >
                  {TARGETS.map((target) => (
                    <button
                      key={target}
                      type="button"
                      role="menuitem"
                      onClick={() => pickCalendar(target)}
                    >
                      {copy.done.calendars[target]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button type="button" className={styles.secondary} onClick={openCard}>
            {copy.done.card}
          </button>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.quiet} onClick={onEdit}>
            {copy.done.edit}
          </button>
          <a className={styles.quiet} href={`mailto:${ECUADOR.contactEmail}`}>
            {ECUADOR.contactEmail}
          </a>
        </div>
      </div>

      {/* La credencial, sobre la pantalla. */}
      <AnimatePresence>
        {isCardOpen && (
          <motion.div
            className={styles.cardLayer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
          >
            <motion.div
              className={styles.card}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.45, ease: EASE_OUT_EXPO }}
            >
              {badge ? (
                <ProfileCard
                  front={badge}
                  back={CEIBA_BADGE.back}
                  label={copy.done.cardTitle}
                  flipLabel={copy.done.cardFlip}
                />
              ) : (
                <p className={styles.preparing}>{copy.done.preparing}</p>
              )}

              <div className={styles.cardActions}>
                <button type="button" className={styles.submit} onClick={share} disabled={!badge}>
                  {copy.done.share}
                </button>
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={() => badge && downloadBadge(badge, fullName)}
                  disabled={!badge}
                >
                  {copy.done.download}
                </button>
                <button
                  type="button"
                  className={styles.quiet}
                  onClick={() => setIsCardOpen(false)}
                >
                  {copy.done.cardClose}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Acuse de compartir. Va fuera del flujo: no debe mover la columna. */}
      <AnimatePresence>
        {notice && (
          <motion.p
            className={styles.notice}
            role="status"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
          >
            {notice}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
