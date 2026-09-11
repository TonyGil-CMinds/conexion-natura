'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { EASE_OUT_EXPO } from '@/lib/motion';
import styles from './Tanusas.module.css';

type Item = { question: string; answer: string };

type Props = {
  items: readonly Item[];
  /** Rótulo de la lista para lectores de pantalla. */
  label: string;
};

/**
 * Lista desplegable de la invitación: las cinco dimensiones, las funciones del
 * capital y los tres tiempos del portafolio.
 *
 * Se abre **una a la vez**, como el FAQ del sitio: son bloques de texto denso y
 * con varios abiertos la lista deja de poder recorrerse. A diferencia del FAQ,
 * aquí todas arrancan cerradas: el documento las presenta como algo que se
 * abre, no como una lectura obligada.
 *
 * El panel se anima con Framer Motion porque el disparo es un clic —una señal de
 * JavaScript—, y `height: auto` no es interpolable en CSS.
 */
/**
 * Prefijo de los identificadores, a partir del rótulo de la lista.
 *
 * Sale del rótulo y no de `useId()` porque el rótulo es copia: idéntico en el
 * servidor y en el cliente, mientras `useId` codifica la posición en el árbol y
 * cambiaba entre uno y otro. Y va sin espacios ni acentos a propósito:
 * `aria-controls` es una **lista** de identificadores, así que un espacio
 * dentro partiría la referencia en dos que no existen.
 */
function slug(label: string) {
  return label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function TanusasAccordion({ items, label }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const base = useMemo(() => slug(label), [label]);

  return (
    <div className={styles.accordion} role="list" aria-label={label}>
      {items.map((item, index) => {
        const isOpen = item.question === open;
        const panelId = `${base}-panel-${index}`;

        return (
          <div key={item.question} className={styles.accordionItem} role="listitem">
            <h3 className={styles.srOnly}>{item.question}</h3>
            <button
              type="button"
              className={styles.accordionButton}
              aria-expanded={isOpen}
              aria-controls={panelId}
              // Volver a pulsar cierra: si no, no hay forma de plegar la lista.
              onClick={() => setOpen(isOpen ? null : item.question)}
            >
              {item.question}
              <span className={styles.accordionMark} aria-hidden />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  className={styles.accordionPanel}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: EASE_OUT_EXPO }}
                >
                  <p>{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
