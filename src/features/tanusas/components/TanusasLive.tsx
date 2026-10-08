'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { AVISO_MINUTOS, useAvisoPrevio, useLiveAgenda } from '../hooks/useLiveAgenda';
import { useNotificador } from '../hooks/useNotificador';
import styles from './TanusasLive.module.css';

type Props = { copy: Dictionary['tanusas']['agenda'] };

type Momentos = Dictionary['tanusas']['agenda']['moments'];

/**
 * La tira de «en directo» del principio de la página.
 *
 * Dice tres cosas y nada más: qué pasa ahora, qué viene después y cuánto falta.
 * Es lo que alguien mira de reojo entre una conversación y otra, así que no
 * puede pedir que se lea.
 *
 * **No se pinta hasta que el reloj del navegador habla.** El HTML de esta página
 * se genera una vez y se sirve a todo el mundo: si la tira saliera del servidor,
 * enseñaría una hora congelada. Mientras tanto no deja hueco, que es mejor que
 * un salto cuando aparece.
 */
export function TanusasLive({ copy }: Props) {
  const directo = useLiveAgenda();
  const caja = useRef<HTMLDivElement>(null);

  /**
   * Publica su alto en `--tanusas-live-h`.
   *
   * Las dos barras se pegan arriba, y sin esto se montarían una sobre otra:
   * la tira tapaba los rótulos de la navegación y solo asomaba el zigzag.
   * Se mide en vez de escribir el número porque el alto cambia —en estrecho
   * la tira pierde una línea— y un valor fijo dejaría un hueco o un solape.
   */
  useEffect(() => {
    const el = caja.current;
    const raiz = document.documentElement;
    if (!el) {
      raiz.style.setProperty('--tanusas-live-h', '0px');
      return;
    }
    const medir = () => {
      raiz.style.setProperty('--tanusas-live-h', `${Math.round(el.getBoundingClientRect().height)}px`);
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => {
      observador.disconnect();
      raiz.style.setProperty('--tanusas-live-h', '0px');
    };
  }, [directo]);
  const { activos, alternar, avisar } = useNotificador();

  useAvisoPrevio(directo, (momento) => {
    const texto = copy.moments[momento.key as keyof Momentos];
    avisar(texto.title, copy.live.soon.replace('{min}', String(AVISO_MINUTOS)));
  });

  if (!directo) return null;

  const t = copy.live;
  const actual = directo.actual ? copy.moments[directo.actual.key as keyof Momentos] : null;
  const siguiente = directo.siguiente ? copy.moments[directo.siguiente.key as keyof Momentos] : null;
  const inminente = directo.faltan !== null && directo.faltan <= AVISO_MINUTOS;

  return (
    <div ref={caja} className={styles.bar} data-state={directo.estado} data-soon={inminente || undefined}>
      <div className={styles.inner}>
        {/* El punto que late: es lo que dice «esto es ahora» sin leerlo. */}
        <span className={styles.badge}>
          <span className={styles.dot} aria-hidden />
          {directo.estado === 'enCurso' ? t.badge : t.next}
        </span>

        <AnimatePresence mode="wait">
          <motion.div
            key={directo.actual?.key ?? directo.siguiente?.key ?? directo.estado}
            className={styles.body}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28, ease: EASE_OUT_EXPO }}
          >
            {directo.estado === 'antes' && <p className={styles.title}>{t.before}</p>}
            {directo.estado === 'despues' && <p className={styles.title}>{t.after}</p>}

            {directo.estado === 'enCurso' && actual && (
              <>
                <p className={styles.title}>{actual.title}</p>
                <p className={styles.meta}>
                  {directo.actual!.start}–{directo.actual!.end}
                  {siguiente && (
                    <>
                      <span className={styles.sep}>·</span>
                      {t.next}: {siguiente.title}
                    </>
                  )}
                </p>
              </>
            )}

            {directo.estado === 'entre' && siguiente && (
              <>
                <p className={styles.title}>{siguiente.title}</p>
                <p className={styles.meta}>
                  {t.between}
                  <span className={styles.sep}>·</span>
                  {directo.faltan === 0
                    ? t.startsNow
                    : t.startsIn.replace('{min}', String(directo.faltan))}
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Cuánto falta, en grande, solo cuando ya está cerca. */}
        {directo.estado === 'enCurso' && directo.faltan !== null && inminente && siguiente && (
          <span className={styles.countdown}>{t.startsIn.replace('{min}', String(directo.faltan))}</span>
        )}

        <button
          type="button"
          className={styles.sound}
          onClick={alternar}
          aria-pressed={activos}
          title={t.soundHint}
        >
          <span className={styles.soundIcon} aria-hidden>
            {activos ? '🔔' : '🔕'}
          </span>
          {activos ? t.soundOn : t.soundOff}
        </button>
      </div>

      {/* La barra de avance del momento en curso. */}
      {directo.estado === 'enCurso' && (
        <div className={styles.track} aria-hidden>
          <div className={styles.fill} style={{ transform: `scaleX(${directo.avance})` }} />
        </div>
      )}
    </div>
  );
}
