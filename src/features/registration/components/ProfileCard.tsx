'use client';
/* eslint-disable @next/next/no-img-element */

import { useRef, useState, type PointerEvent } from 'react';
import styles from './ProfileCard.module.css';

type Props = {
  /** Credencial ya compuesta (URL de datos del lienzo). */
  front: string;
  back: string;
  label: string;
  /** Rótulo del gesto: se anuncia y se pinta debajo. */
  flipLabel: string;
};

/**
 * La credencial como tarjeta que responde al puntero.
 *
 * Sustituye al cordón en tres dimensiones: el cordón necesitaba WebGL —y una
 * red de seguridad por si el contexto no arrancaba— para enseñar una imagen
 * plana. Aquí el relieve lo hace la perspectiva de CSS, así que funciona en
 * cualquier navegador, no compite por la GPU con el resto de la página y la
 * imagen que se ve es exactamente la que se descarga.
 *
 * El seguimiento del puntero se escribe en variables CSS y el suavizado lo pone
 * una transición corta: sin ella el giro es inmediato y se siente rígido, y con
 * un bucle de animación propio sería el mismo efecto con más código.
 */
export function ProfileCard({ front, back, label, flipLabel }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  function track(event: PointerEvent<HTMLDivElement>) {
    const root = rootRef.current;
    if (!root) return;
    const box = root.getBoundingClientRect();
    // −1…1 desde el centro de la tarjeta.
    const x = (event.clientX - box.left) / box.width * 2 - 1;
    const y = (event.clientY - box.top) / box.height * 2 - 1;
    root.style.setProperty('--tilt-x', `${(-y * 9).toFixed(2)}deg`);
    root.style.setProperty('--tilt-y', `${(x * 12).toFixed(2)}deg`);
    // Posición del brillo, en porcentaje de la tarjeta.
    root.style.setProperty('--shine-x', `${(((x + 1) / 2) * 100).toFixed(1)}%`);
    root.style.setProperty('--shine-y', `${(((y + 1) / 2) * 100).toFixed(1)}%`);
  }

  function rest() {
    const root = rootRef.current;
    if (!root) return;
    root.style.setProperty('--tilt-x', '0deg');
    root.style.setProperty('--tilt-y', '0deg');
    root.style.setProperty('--shine-x', '50%');
    root.style.setProperty('--shine-y', '50%');
  }

  return (
    <div className={styles.root}>
      <div
        ref={rootRef}
        className={styles.scene}
        onPointerMove={track}
        onPointerLeave={rest}
      >
        {/* Botón y no `div` con `onClick`: girar la tarjeta es una acción, y así
            responde también al teclado sin inventar nada. */}
        <button
          type="button"
          className={styles.card}
          data-flipped={isFlipped || undefined}
          onClick={() => setIsFlipped((current) => !current)}
          aria-label={`${label} — ${flipLabel}`}
        >
          <span className={styles.faces}>
            {/* La cara delantera no necesita regla propia: llega derecha. */}
            <img src={front} alt="" className={styles.face} />
            <img src={back} alt="" className={`${styles.face} ${styles.faceBack}`} />
          </span>
          <span className={styles.shine} aria-hidden />
        </button>
      </div>

      <p className={styles.hint}>{flipLabel}</p>
    </div>
  );
}
