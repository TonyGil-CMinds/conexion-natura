'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PixelSprite } from '@/features/hero-creature';
import { Toast } from '@/components/ui/Toast';
import { SITE } from '@/config/site';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary, Locale } from '@/i18n';
import type { Attendee } from '../context/attendance';
import { addToCalendar, type CalendarTarget } from '../lib/calendar';
import { downloadBadge, renderBadge, shareBadge } from '../lib/badge';
import { ProfileCard } from './ProfileCard';
import styles from './WelcomeScreen.module.css';

type Props = {
  locale: Locale;
  copy: Dictionary['registration']['welcome'];
  attendee: Attendee;
};

const PANEL = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
} as const;

const ITEM = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
} as const;

/** Los tres destinos, en el orden de uso real. */
const TARGETS = ['google', 'outlook', 'ics'] as const satisfies readonly CalendarTarget[];

/**
 * Pantalla de bienvenida: lo que se ve cuando el registro ya está guardado.
 *
 * Es la vista de reposo de `/registro`, no un acuse de recibo que se cierre:
 * quien vuelve más tarde llega aquí, porque lo que necesita —la fecha, el sitio,
 * el calendario y su tarjeta— es justo lo mismo.
 *
 * El ave de píxeles es la del hero, con su misma entrada y su misma repulsión al
 * puntero: cierra el recorrido donde empezó.
 */
export function WelcomeScreen({ locale, copy, attendee }: Props) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [badge, setBadge] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  /**
   * El campo de píxeles se apaga hasta que alguien lo arranca. Aquí no hay
   * loader del que esperar, así que arranca en el primer efecto tras montar: en
   * el mismo render sería antes del primer pintado y se vería el estado final.
   */
  const [isFieldActive, setIsFieldActive] = useState(false);
  useEffect(() => setIsFieldActive(true), []);

  /**
   * La tarjeta se cuelga del `body`, y eso solo puede hacerse ya en el cliente.
   *
   * Va ahí porque esta pantalla crea contexto de apilamiento —tiene `position` y
   * `z-index` propios—, así que aquí dentro ningún `z-index` supera a la
   * cabecera y la capa salía por debajo de ella.
   */
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const { year, month, day } = SITE.event.date;
  const date = new Date(Date.UTC(year, month, day));
  const shortMonth = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' })
    .format(date)
    .replace('.', '');
  const yearLabel = String(year);

  /** Cierra el menú del calendario al pulsar fuera o con Escape. */
  useEffect(() => {
    if (!isCalendarOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!calendarRef.current?.contains(event.target as Node)) setIsCalendarOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCalendarOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isCalendarOpen]);

  useEffect(() => {
    if (!isCardOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsCardOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isCardOpen]);

  /**
   * La tarjeta se compone al abrirla y una sola vez: dibujarla al montar sería
   * trabajo tirado para quien solo viene a mirar la fecha.
   */
  const openCard = useCallback(async () => {
    setIsCardOpen(true);
    if (badge) return;
    const image = await renderBadge({
      name: attendee.name,
      surname: attendee.surname,
      organization: attendee.organization,
      photoUrl: attendee.photoUrl,
    });
    setBadge(image);
  }, [attendee, badge]);

  function pickCalendar(target: CalendarTarget) {
    setIsCalendarOpen(false);
    addToCalendar(target, {
      title: copy.calendarTitle,
      description: copy.calendarDescription,
      location: `${SITE.event.venue.name}, ${SITE.event.place}`,
    });
  }

  async function share() {
    if (!badge) return;
    const result = await shareBadge(badge, { title: copy.shareTitle, text: copy.shareText });
    if (result === 'copied') setToast(copy.copied);
  }

  return (
    <motion.section className={styles.root} initial="hidden" animate="shown" variants={PANEL}>
      {/* El ave llega hasta el borde: es fondo, no una ilustración enmarcada. */}
      <motion.div
        className={styles.creature}
        variants={ITEM}
        // El campo tiene su propia entrada por celda, así que aquí solo se
        // desvanece el bloque: dos animaciones sobre lo mismo se estorbarían.
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      >
        <PixelSprite isActive={isFieldActive} className={styles.field} />
      </motion.div>

      <div className={styles.panel}>
        <motion.p className={styles.greeting} variants={ITEM}>
          {copy.greeting} {attendee.name}
        </motion.p>

        <motion.p className={styles.invited} variants={ITEM}>
          {copy.invitedLead} <span>{copy.invitedCount}</span> {copy.invitedTail}
        </motion.p>

        <motion.p className={styles.soon} variants={ITEM}>
          {copy.soon}
        </motion.p>

        <motion.time
          className={styles.date}
          dateTime={date.toISOString().slice(0, 10)}
          aria-label={copy.dateLabel}
          variants={ITEM}
        >
          <span aria-hidden>
            {String(day).padStart(2, '0')}
            <br />
            {shortMonth}
          </span>
          <span className={styles.dateMark} aria-hidden />
          <span aria-hidden>
            {yearLabel.slice(0, 2)}
            <br />
            {yearLabel.slice(2)}
          </span>
        </motion.time>

        <motion.a
          className={styles.venue}
          href={SITE.event.venue.mapsUrl}
          target="_blank"
          rel="noreferrer"
          variants={ITEM}
        >
          {SITE.event.venue.name}
        </motion.a>

        <motion.p className={styles.schedule} variants={ITEM}>
          {SITE.event.scheduleLabel}
        </motion.p>

        <motion.div className={styles.actions} variants={ITEM}>
          {/**
           * El calendario se elige, no se impone: el `.ics` vale para todos pero
           * en Google —que es la mayoría— obliga a descargar e importar a mano.
           */}
          <div className={styles.calendar} ref={calendarRef}>
            <button
              type="button"
              className={styles.primary}
              onClick={() => setIsCalendarOpen((open) => !open)}
              aria-expanded={isCalendarOpen}
              aria-haspopup="menu"
            >
              {copy.addToCalendar}
            </button>

            <AnimatePresence>
              {isCalendarOpen && (
                <motion.div
                  className={styles.menu}
                  role="menu"
                  aria-label={copy.calendarLabel}
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
                      {copy.calendars[target]}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button type="button" className={styles.secondary} onClick={openCard}>
            {copy.share}
          </button>
        </motion.div>
      </div>

      {isMounted && createPortal(
      <AnimatePresence>
        {isCardOpen && (
          <motion.div
            className={styles.overlay}
            role="dialog"
            aria-modal="true"
            aria-label={copy.cardTitle}
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
                  back="/img/card-back.png"
                  label={copy.cardTitle}
                  flipLabel={copy.cardFlip}
                />
              ) : (
                <p className={styles.preparing}>
                  {copy.preparing}
                  <span className={styles.loader} aria-hidden>
                    {Array.from({ length: 9 }, (_, index) => (
                      <span key={index} style={{ ['--cell' as string]: index }} />
                    ))}
                  </span>
                </p>
              )}

              <div className={styles.cardActions}>
                <button type="button" className={styles.primary} onClick={share} disabled={!badge}>
                  {copy.shareCard}
                </button>
                <button
                  type="button"
                  className={styles.secondary}
                  onClick={() => badge && downloadBadge(badge, `${attendee.name}-${attendee.surname}`)}
                  disabled={!badge}
                >
                  {copy.download}
                </button>
                <button
                  type="button"
                  className={styles.close}
                  onClick={() => setIsCardOpen(false)}
                  aria-label={copy.close}
                >
                  <span aria-hidden />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body,
      )}

      <Toast message={toast} onDismiss={() => setToast(null)} />
    </motion.section>
  );
}
