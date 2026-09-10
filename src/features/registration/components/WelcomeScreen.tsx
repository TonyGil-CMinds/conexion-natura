'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { PixelSprite } from '@/features/hero-creature';
import { Toast } from '@/components/ui/Toast';
import { SITE } from '@/config/site';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary, Locale } from '@/i18n';
import type { Attendee } from '../context/attendance';
import { EVENT_OPTIONS } from '../config/event-options';
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
 * Punta de flecha en escalera, dibujada aquí y no traída de un archivo: los
 * assets de flecha del sitio son diagonales, y lo que hace falta es un chevrón
 * de cuadros del mismo paso que el resto de la interfaz. Apunta a la derecha; la
 * de volver se voltea en el CSS.
 */
function PixelChevron() {
  return (
    <svg viewBox="0 0 9 15" width="9" height="15" focusable="false" aria-hidden>
      {[
        [0, 0],
        [3, 3],
        [6, 6],
        [3, 9],
        [0, 12],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="3" height="3" fill="currentColor" />
      ))}
    </svg>
  );
}

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
  /**
   * Los actos que se marcaron, en el orden del diseño.
   *
   * Un registro guardado antes de que existiera la elección no los trae, y
   * tampoco uno con un valor que ya no exista: en los dos casos se cae al acto
   * principal, que es a lo que va todo el mundo.
   */
  const events = useMemo(() => {
    const chosen = EVENT_OPTIONS.filter((option) => attendee.events?.includes(option.choice));
    return chosen.length ? chosen : [EVENT_OPTIONS[0]];
  }, [attendee.events]);

  /** Cuál se está mirando. Con un solo acto no se mueve nunca. */
  const [index, setIndex] = useState(0);
  const shown = events[Math.min(index, events.length - 1)];

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
      uid: shown.uid,
      // El título nombra el acto: quien va a los dos acaba con dos entradas en
      // su calendario, y «CEIBA Quito» en las dos no distinguiría nada.
      title: `${copy.calendarTitle} — ${copy.events[shown.id]}`,
      description: copy.calendarDescription,
      location: `${shown.venue.name}, ${SITE.event.place}`,
      when: shown.calendar,
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

        {/* El acto nombrado: quien va a los dos ve cuál está mirando. */}
        <motion.p className={styles.soon} variants={ITEM}>
          {copy.soonIn} <span>{copy.events[shown.id]}!</span>
        </motion.p>

        {/**
         * Fecha con el paso al otro acto a un lado. La flecha apunta a donde se
         * va: a la derecha para pasar al siguiente y a la izquierda para volver,
         * así que su sitio dice tanto como su dibujo. Con un solo acto no hay
         * ninguna: un mando que no lleva a ningún lado es ruido.
         */}
        <motion.div className={styles.dateRow} variants={ITEM}>
          {events.length > 1 && index > 0 && (
            <button
              type="button"
              className={`${styles.step} ${styles.stepPrev}`}
              onClick={() => setIndex(index - 1)}
              aria-label={copy.previousEvent}
            >
              <PixelChevron />
            </button>
          )}

          <time className={styles.date} dateTime={date.toISOString().slice(0, 10)} aria-label={copy.dateLabel}>
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
          </time>

          {events.length > 1 && index < events.length - 1 && (
            <button
              type="button"
              className={`${styles.step} ${styles.stepNext}`}
              onClick={() => setIndex(index + 1)}
              aria-label={copy.nextEvent}
            >
              <PixelChevron />
            </button>
          )}
        </motion.div>

        {/* La sede solo enlaza si hay a dónde: la del premio no tiene mapa. */}
        {shown.venue.mapsUrl ? (
          <motion.a
            className={styles.venue}
            href={shown.venue.mapsUrl}
            target="_blank"
            rel="noreferrer"
            variants={ITEM}
          >
            {shown.venue.name}
          </motion.a>
        ) : (
          <motion.p className={styles.venue} variants={ITEM}>
            {shown.venue.name}
          </motion.p>
        )}

        {/* Sin horas confirmadas se dice, no se inventa. */}
        <motion.p className={styles.schedule} variants={ITEM}>
          {shown.schedule ?? copy.scheduleTbc}
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
                  <PixelChevron />
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
