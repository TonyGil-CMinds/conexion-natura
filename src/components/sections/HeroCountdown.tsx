'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/config/site';
import styles from './HeroCountdown.module.css';

/** Píxeles por día en la cinta. */
const DAY_WIDTH = 64;
/** Días dibujados a cada lado del marcador. Sobra para cubrir pantallas anchas. */
const SPAN_DAYS = 22;
/** Radio de la lupa: dentro de esta distancia al marcador, la cifra crece. */
const FOCUS_PX = 90;
/** Aumento máximo en el marcador. */
const FOCUS_SCALE = 1.9;

function daysUntil(target: { year: number; month: number; day: number }): number {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const event = Date.UTC(target.year, target.month, target.day);
  return Math.max(0, Math.round((event - today) / 86400000));
}

/**
 * Cuenta atrás en forma de cinta métrica.
 *
 * El marcador está fijo en el centro y la escala se numera desde ahí: a la
 * izquierda quedan los días que faltan por descontar y a la derecha los que
 * vendrán. Las cifras cercanas al marcador crecen, como una lupa sobre la regla.
 *
 * El cálculo va en el cliente y después del montaje: el número depende del día en
 * que se mire, y hacerlo en el servidor lo dejaría congelado en la fecha de
 * compilación y provocaría un desajuste de hidratación.
 */
export function HeroCountdown() {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    setRemaining(daysUntil(SITE.event.date));
  }, []);

  const days =
    remaining === null
      ? []
      : Array.from({ length: SPAN_DAYS * 2 + 1 }, (_, i) => {
          const offset = i - SPAN_DAYS;
          return { offset, value: remaining - offset };
        }).filter((day) => day.value >= 0);

  return (
    <div className={styles.root}>
      <p className={styles.label}>{SITE.countdown.label}</p>

      <div className={styles.scale}>
        {/* Marcas menores: ocho por día, dibujadas con un degradado repetido en
            vez de un nodo por marca. */}
        <div className={styles.ticks} aria-hidden />

        {days.map(({ offset, value }) => {
          const distance = Math.abs(offset * DAY_WIDTH);
          const focus = Math.max(0, 1 - distance / FOCUS_PX);
          return (
            <span
              key={value}
              className={styles.day}
              data-current={offset === 0 || undefined}
              style={{
                left: `calc(50% + ${offset * DAY_WIDTH}px)`,
                // La lupa escala desde la base: si escalara desde el centro, las
                // cifras grandes se saldrían por arriba de la línea de la regla.
                transform: `translateX(-50%) scale(${(1 + focus * (FOCUS_SCALE - 1)).toFixed(3)})`,
              }}
            >
              {value}
            </span>
          );
        })}

        <span className={styles.marker} aria-hidden />
      </div>

      {remaining !== null && (
        <p className={styles.readout}>
          {remaining} {remaining === 1 ? 'día' : 'días'}
        </p>
      )}
    </div>
  );
}
