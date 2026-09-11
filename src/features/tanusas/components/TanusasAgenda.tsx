'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import type { Dictionary } from '@/i18n';
import styles from './Tanusas.module.css';

type Props = { copy: Dictionary['tanusas']['agenda'] };

/**
 * Los tres días del retiro, uno a la vez.
 *
 * En pestañas y no en una lista continua porque el programa es largo y lo que
 * hace falta es comparar días, no leerlos del tirado: quien mira quiere saber
 * qué pasa el viernes, no recorrer treinta filas.
 *
 * Son `tab` / `tabpanel` de verdad, así que las flechas del teclado y los
 * lectores de pantalla anuncian que hay tres y cuál está abierta.
 */
export function TanusasAgenda({ copy }: Props) {
  const [day, setDay] = useState(0);
  const current = copy.days[Math.min(day, copy.days.length - 1)]!;

  return (
    <>
      <div className={styles.dayTabs} role="tablist" aria-label={copy.title}>
        {copy.days.map((item, index) => (
          <button
            key={item.tab}
            type="button"
            role="tab"
            id={`tanusas-dia-${index}`}
            className={styles.dayTab}
            aria-selected={index === day}
            aria-controls={`tanusas-panel-${index}`}
            onClick={() => setDay(index)}
          >
            {item.tab}
          </button>
        ))}
      </div>

      {/**
       * `mode="wait"` para que el día que se va termine antes de que entre el
       * siguiente: con los dos a la vez, la lista daba un salto de alto.
       */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.tab}
          id={`tanusas-panel-${day}`}
          role="tabpanel"
          aria-labelledby={`tanusas-dia-${day}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
        >
          <p className={styles.dayTitle}>{current.title}</p>

          <dl className={styles.rows}>
            {current.rows.map((row) => (
              <div key={row.time + row.text} className={styles.row}>
                <dt className={styles.rowLabel}>{row.time}</dt>
                <dd className={styles.rowValue}>{row.text}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
