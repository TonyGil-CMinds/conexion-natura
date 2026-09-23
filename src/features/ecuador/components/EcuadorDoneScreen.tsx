'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import {
  addToCalendar,
  shareLink,
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
  participation: ParticipationKey | null;
  guestName: string;
  onEdit: () => void;
};

/**
 * Pantalla final del registro de empresas.
 *
 * Enseña lo que quedó guardado, deja corregirlo y da dos cosas que llevarse: la
 * fecha al calendario y el enlace del registro para pasárselo a alguien.
 *
 * Ya no hay credencial: al quitarse la fotografía no queda retrato con el que
 * componerla, así que lo que se comparte es el enlace y no una imagen.
 */
export function EcuadorDoneScreen({
  copy,
  email,
  fullName,
  participation,
  guestName,
  onEdit,
}: Props) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
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

  /**
   * Comparte **el enlace de este registro**, no una imagen: desde que no se
   * pide fotografía no hay credencial, y lo que sirve repartir es la puerta
   * para que otra empresa se inscriba.
   */
  /**
   * El enlace sale de la **propia página** y no de `SITE_URL`.
   *
   * Dos razones, las dos medidas: `SITE_URL` resuelve en el cliente a
   * `http://localhost:3000` porque la variable de Vercel no llega al navegador
   * —solo se inlinean las `NEXT_PUBLIC_`—, así que en producción se habría
   * compartido un enlace a localhost. Y se toma `pathname` sin la cadena de
   * consulta: quien llegó por una invitación la lleva en la URL, y compartirla
   * sería repartir el testigo que abre el registro de otra persona.
   */
  function registrationUrl() {
    return `${window.location.origin}${window.location.pathname}`;
  }
  async function share() {
    const result = await shareLink(registrationUrl(), {
      title: copy.done.shareTitle,
      text: copy.done.shareText,
    });
    if (result === 'copied') setNotice(copy.done.copied);
    else if (result === 'failed') setNotice(copy.done.shareFailed);
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

          <button type="button" className={styles.secondary} onClick={share}>
            {copy.done.share}
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
