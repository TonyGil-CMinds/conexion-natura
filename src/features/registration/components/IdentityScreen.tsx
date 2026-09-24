'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { PHOTO_MARQUEE } from '../config/event-options';
import styles from './DetailsScreen.module.css';

/** La invitación con la que se ha encajado. */
export type IdentityCheck = {
  inviteeId: string;
  fullName: string;
  organization: string;
};

const PANEL = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.07 } },
  gone: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
} as const;

const ITEM = {
  hidden: { opacity: 0, y: 14 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE_OUT_EXPO } },
  gone: { opacity: 0, y: 14, transition: { duration: 0.22, ease: EASE_OUT_EXPO } },
} as const;

type Props = {
  copy: Dictionary['registration']['identity'];
  check: IdentityCheck;
  /** Dijo que sí: se reclama esa invitación. Puede tardar: espera al servidor. */
  onClaim: () => void | Promise<void>;
  /** Dijo que no: sigue como cualquiera, a lista de espera. */
  onReject: () => void | Promise<void>;
};

/**
 * «¿Eres tú?».
 *
 * Sale cuando el correo con el que alguien se registra **no está** en la lista
 * de preregistro pero su nombre y su organización coinciden con una invitación.
 * Pasa constantemente y por dos motivos reales: once de las noventa y cinco
 * invitaciones se mandaron a un buzón de la organización y no a la persona, y
 * mucha gente se registra con su correo personal.
 *
 * Solo se llega aquí si **las dos cosas** coinciden, nombre y organización, así
 * que esta pantalla no enseña nada que quien la ve no acabe de escribir: es una
 * confirmación, no una pista.
 *
 * Decir que no no es un callejón: sigue el registro y queda en lista de espera,
 * que es lo mismo que le pasaría a cualquiera que no esté invitado.
 */
export function IdentityScreen({ copy, check, onClaim, onReject }: Props) {
  const [sending, setSending] = useState<'claim' | 'reject' | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function responder(cual: 'claim' | 'reject', accion: () => void | Promise<void>) {
    if (sending) return;
    setSending(cual);
    setError(null);
    try {
      await accion();
    } catch {
      setError(copy.failed);
    } finally {
      setSending(null);
    }
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
        </div>

        <Image
          src={PHOTO_MARQUEE.src}
          alt=""
          width={200}
          height={200}
          className={styles.coin}
          aria-hidden
        />
      </div>

      <motion.div className={styles.panel} variants={PANEL}>
        <motion.p className={styles.step} variants={ITEM}>
          {copy.step}
        </motion.p>

        <motion.p className={styles.note} variants={ITEM}>
          {copy.intro}
        </motion.p>

        {/* La invitación con la que ha encajado, para que la reconozca. */}
        <motion.div className={styles.identity} variants={ITEM}>
          <p className={styles.identityName}>{check.fullName}</p>
          <p className={styles.identityOrg}>{check.organization}</p>
        </motion.div>

        <motion.div className={styles.actions} variants={ITEM}>
          <button
            type="button"
            className={styles.submit}
            onClick={() => void responder('claim', onClaim)}
            disabled={sending !== null}
          >
            {sending === 'claim' ? copy.confirming : copy.yes}
            {sending === 'claim' && (
              <span className={styles.loader} aria-hidden>
                {Array.from({ length: 9 }, (_, index) => (
                  <span key={index} style={{ ['--cell' as string]: index }} />
                ))}
              </span>
            )}
          </button>

          <button
            type="button"
            className={styles.quiet}
            onClick={() => void responder('reject', onReject)}
            disabled={sending !== null}
          >
            {sending === 'reject' ? copy.confirming : copy.no}
          </button>
        </motion.div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </motion.div>
    </motion.section>
  );
}
