'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FAQ_ITEMS, FAQ_TITLE } from '@/config/faq';
import { EASE_OUT_EXPO } from '@/lib/motion';
import styles from './Faq.module.css';

/** Duración de apertura y cierre del panel (s). */
const PANEL_DURATION = 0.42;

/**
 * Acordeón de preguntas frecuentes.
 *
 * Se abre una sola a la vez: con catorce preguntas, permitir varias abiertas deja
 * la lista imposible de recorrer. La primera arranca abierta porque da el contexto
 * del resto.
 *
 * Cada pregunta es un `<button>` con `aria-expanded` y su panel va enlazado por
 * `aria-controls`, que es lo que hace navegable el acordeón con teclado y lector
 * de pantalla. Los encabezados envuelven al botón para que el índice de la página
 * siga teniendo sentido.
 */
export function Faq() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);

  return (
    <section className={styles.root} id="faq" aria-labelledby="faq-title">
      <div className={styles.inner}>
        <h2 className={styles.title} id="faq-title">
          {FAQ_TITLE}
        </h2>

        <ul className={styles.list}>
          {FAQ_ITEMS.map((item) => {
            const isOpen = item.id === openId;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-button-${item.id}`;

            return (
              <li key={item.id} className={styles.item} data-open={isOpen || undefined}>
                <h3 className={styles.heading}>
                  <button
                    type="button"
                    id={buttonId}
                    className={styles.question}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    // Volver a pulsar la abierta la cierra: si no, no hay forma de
                    // dejar la lista entera plegada.
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    {item.question}
                  </button>
                </h3>

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
                      <p className={styles.answer}>{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
