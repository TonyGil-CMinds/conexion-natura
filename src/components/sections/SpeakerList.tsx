'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { LinkedInMark } from '@/components/ui/social-marks';
import type { Speaker } from '@/config/speakers';
import { EASE_OUT_EXPO } from '@/lib/motion';
import styles from './SpeakerList.module.css';

/** Duración de apertura y cierre de una sesión (s). */
const SESSION_DURATION = 0.28;

type Props = {
  title: string;
  speakers: readonly Speaker[];
  sessionsLabel: string;
  /**
   * Franja horaria de cada momento, por `id`. Sale de la agenda: las sesiones de
   * un ponente llevan el mismo `id` que el momento, así que la hora no se copia
   * a la ficha —una hora duplicada es una hora que se corrige a medias—.
   */
  sessionTimes: Readonly<Record<string, string>>;
};

/**
 * Lista de ponentes.
 *
 * **Sin acordeón.** La ficha entera está a la vista: retrato, nombre, cargo,
 * enlace y sesiones. Antes había un control de apertura que escondía el enlace y
 * las sesiones, y con una ficha abierta a la vez comparar dos ponentes pedía
 * abrir, cerrar y volver a abrir. Todo el contenido de una fila es corto y cabe
 * sin desplegarse.
 *
 * Lo único que se abre es la **sesión**, porque su título va recortado en la
 * fila: al abrirla sale entero y con su hora.
 *
 * El fondo del retrato alterna entre lima y azul por posición, no por dato: es
 * ritmo visual de la lista, no información del ponente.
 */
export function SpeakerList({ title, speakers, sessionsLabel, sessionTimes }: Props) {
  return (
    <section className={styles.root} id="ponentes" aria-labelledby="speakers-title">
      <h2 className={styles.title} id="speakers-title">
        {title}
      </h2>

      <ul className={styles.list}>
        {speakers.map((speaker, index) => (
          <SpeakerRow
            key={speaker.id}
            speaker={speaker}
            sessionsLabel={sessionsLabel}
            sessionTimes={sessionTimes}
            tone={index % 2 === 0 ? 'lime' : 'blue'}
          />
        ))}
      </ul>
    </section>
  );
}

type RowProps = {
  speaker: Speaker;
  sessionsLabel: string;
  sessionTimes: Readonly<Record<string, string>>;
  tone: 'lime' | 'blue';
};

function SpeakerRow({ speaker, sessionsLabel, sessionTimes, tone }: RowProps) {
  // Una sesión abierta por ficha: son dos como máximo y el título abierto ocupa
  // varias líneas, así que con las dos abiertas la fila se estiraba de más.
  const [openSession, setOpenSession] = useState<string | null>(null);

  return (
    <li className={styles.item} data-tone={tone}>
      <div className={styles.portrait}>
        <Image
          src={speaker.photo ?? '/img/speaker-placeholder.svg'}
          alt=""
          width={220}
          height={280}
          className={styles.photo}
        />
      </div>

      <div className={styles.identity}>
        <h3 className={styles.name}>
          <span className={styles.firstName}>{speaker.firstName}</span>{' '}
          <span className={styles.lastName}>{speaker.lastName}</span>
        </h3>

        <p className={styles.role}>
          {speaker.role},{' '}
          {speaker.organizationUrl ? (
            <a
              className={styles.organization}
              href={speaker.organizationUrl}
              target="_blank"
              rel="noreferrer"
            >
              {speaker.organization}
            </a>
          ) : (
            <span className={styles.organization}>{speaker.organization}</span>
          )}
        </p>

        {speaker.linkedinUrl && (
          <a
            className={styles.linkedin}
            href={speaker.linkedinUrl}
            target="_blank"
            rel="noreferrer"
          >
            <span>LinkedIn</span>
            <LinkedInMark className={styles.linkedinMark} />
          </a>
        )}
      </div>

      <div className={styles.sessions}>
        <p className={styles.sessionsLabel}>{sessionsLabel}</p>
        <ul className={styles.sessionList}>
          {speaker.sessions.map((session) => {
            const isOpen = session.id === openSession;
            const time = sessionTimes[session.id];

            return (
              <li key={session.id}>
                <button
                  type="button"
                  className={styles.session}
                  data-open={isOpen || undefined}
                  aria-expanded={isOpen}
                  onClick={() => setOpenSession(isOpen ? null : session.id)}
                >
                  {/* La hora entra y sale, así que va con AnimatePresence; el
                      título no se desmonta, solo deja de recortarse. */}
                  <AnimatePresence initial={false}>
                    {isOpen && time && (
                      <motion.span
                        className={styles.sessionTime}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: SESSION_DURATION, ease: EASE_OUT_EXPO }}
                      >
                        {time}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  <span className={styles.sessionTitle}>{session.title}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}
