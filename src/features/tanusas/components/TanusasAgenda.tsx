'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import { momentosOrdenados, type TanusasDayKey } from '@/config/tanusas-schedule';
import { useLiveAgenda } from '../hooks/useLiveAgenda';
import styles from './Tanusas.module.css';

type Props = { copy: Dictionary['tanusas']['agenda'] };

type Momentos = Dictionary['tanusas']['agenda']['moments'];
type Lugares = Dictionary['tanusas']['agenda']['lugares'];

/**
 * Los tres días del taller, uno a la vez, con el momento en curso marcado.
 *
 * En pestañas y no en una lista continua porque el programa es largo y lo que
 * hace falta es comparar días, no leerlos del tirón.
 *
 * **La pestaña que se abre la decide el reloj**, no el orden: quien entra el
 * viernes por la mañana quiere ver el viernes. Pero en cuanto alguien toca una
 * pestaña, manda esa persona: el reloj deja de mover la vista bajo sus pies.
 */
export function TanusasAgenda({ copy }: Props) {
  const directo = useLiveAgenda();
  const momentos = momentosOrdenados();

  const [elegido, setElegido] = useState<TanusasDayKey | null>(null);
  const dia = elegido ?? directo?.diaVisible ?? copy.days[0]!.key;
  const index = Math.max(0, copy.days.findIndex((d) => d.key === dia));
  const current = copy.days[index]!;

  const delDia = momentos.filter((m) => m.day === dia);

  /** Lleva a la vista el momento en curso, pero solo la primera vez. */
  const filaActual = useRef<HTMLDivElement | null>(null);
  const yaCentrado = useRef(false);
  useEffect(() => {
    if (yaCentrado.current || !filaActual.current || elegido) return;
    yaCentrado.current = true;
    filaActual.current.scrollIntoView({ block: 'nearest' });
  }, [elegido, directo?.actual?.key]);

  return (
    <>
      <div className={styles.dayTabs} role="tablist" aria-label={copy.title}>
        {copy.days.map((item, i) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            id={`tanusas-dia-${i}`}
            className={styles.dayTab}
            aria-selected={i === index}
            aria-controls={`tanusas-panel-${i}`}
            data-live={directo?.actual?.day === item.key || undefined}
            onClick={() => setElegido(item.key as TanusasDayKey)}
          >
            {item.tab}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.key}
          id={`tanusas-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`tanusas-dia-${index}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
        >
          <p className={styles.dayTitle}>{current.title}</p>

          <dl className={styles.rows}>
            {delDia.map((m) => {
              const texto = copy.moments[m.key as keyof Momentos];
              const enCurso = directo?.actual?.key === m.key;
              const pasado = directo ? m.hasta <= new Date() : false;
              const lugar = m.lugar ? copy.lugares[m.lugar as keyof Lugares] : null;

              return (
                <div
                  key={m.key}
                  ref={enCurso ? filaActual : undefined}
                  className={styles.row}
                  data-live={enCurso || undefined}
                  data-past={pasado && !enCurso ? true : undefined}
                  data-tone={m.tono}
                >
                  <dt className={styles.rowLabel}>
                    {m.start}
                    <span className={styles.rowDash}>–</span>
                    {m.end}
                  </dt>
                  <dd className={styles.rowValue}>
                    <span className={styles.rowTitle}>
                      {texto.title}
                      {enCurso && <span className={styles.rowLive}>{copy.live.badge}</span>}
                    </span>
                    <span className={styles.rowText}>{texto.text}</span>
                    {lugar && <span className={styles.rowPlace}>{lugar}</span>}
                  </dd>
                </div>
              );
            })}
          </dl>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
