'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { LinkedInMark } from '@/components/ui/social-marks';
import type { Speaker } from '@/config/speakers';
import { EASE_OUT_EXPO } from '@/lib/motion';
import styles from './SpeakerList.module.css';

/** Duración de apertura y cierre de una ficha (s). */
const PANEL_DURATION = 0.38;

/**
 * Lista de ponentes en acordeón.
 *
 * Una ficha abierta a la vez, y ninguna al entrar: la ficha desplegada añade
 * sesiones y enlace, y con varias abiertas la lista deja de poder recorrerse.
 *
 * La fila es una sola retícula y el retrato abarca sus dos filas. Con el retrato
 * dentro de la cabecera, su altura empujaba las sesiones muy por debajo del nombre;
 * abarcando, el nombre y las sesiones quedan juntos y el retrato sigue a su lado.
 *
 * La alineación cambia con el estado: cerrada, el nombre se centra con el retrato;
 * abierta, sube al borde superior para que las sesiones queden debajo.
 *
 * El fondo del retrato alterna entre lima y azul por posición, no por dato: es
 * ritmo visual de la lista, no información del ponente.
 */
type Props = {
  title: string;
  speakers: readonly Speaker[];
  sessionsLabel: string;
};

export function SpeakerList({ title, speakers, sessionsLabel }: Props) {
  // Todas cerradas al entrar: la lista se lee de un vistazo y quien busque a
  // alguien concreto despliega solo esa ficha.
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className={styles.root} id="ponentes" aria-labelledby="speakers-title">
      <h2 className={styles.title} id="speakers-title">
        {title}
      </h2>

      <ul className={styles.list}>
        {speakers.map((speaker, index) => (
          <SpeakerRow
            sessionsLabel={sessionsLabel}
            key={speaker.id}
            speaker={speaker}
            tone={index % 2 === 0 ? 'lime' : 'blue'}
            isOpen={speaker.id === openId}
            onToggle={() => setOpenId(speaker.id === openId ? null : speaker.id)}
          />
        ))}
      </ul>
    </section>
  );
}

type RowProps = {
  sessionsLabel: string;
  speaker: Speaker;
  tone: 'lime' | 'blue';
  isOpen: boolean;
  onToggle: () => void;
};

function SpeakerRow({ speaker, tone, isOpen, onToggle, sessionsLabel }: RowProps) {
  const panelId = `speaker-panel-${speaker.id}`;
  const buttonId = `speaker-button-${speaker.id}`;
  const fullName = `${speaker.firstName} ${speaker.lastName}`;

  return (
    <li className={styles.item} data-open={isOpen || undefined} data-tone={tone}>
      <div className={styles.portrait}>
          <Image
            src={speaker.photo ?? '/img/speaker-placeholder.svg'}
            alt=""
            width={220}
            height={280}
          className={styles.photo}
        />
      </div>

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

      <button
        type="button"
        id={buttonId}
        className={styles.toggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
      >
        {/* El signo se dibuja con dos barras: la vertical desaparece al abrir, así
            que el más se convierte en menos sin cambiar de icono. */}
        <span className={styles.sign} aria-hidden />
        <span className={styles.toggleLabel}>
          {isOpen ? `Ocultar detalles de ${fullName}` : `Ver detalles de ${fullName}`}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            className={styles.panel}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: PANEL_DURATION, ease: EASE_OUT_EXPO }}
          >
            <div className={styles.panelInner}>
              <div className={styles.sessions}>
                <p className={styles.sessionsLabel}>{sessionsLabel}</p>
                <ul className={styles.sessionList}>
                  {speaker.sessions.map((session) => (
                    <li key={session.id} className={styles.session} title={session.title}>
                      {session.title}
                    </li>
                  ))}
                </ul>
              </div>

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
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
