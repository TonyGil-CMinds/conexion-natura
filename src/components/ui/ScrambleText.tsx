'use client';

import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { createRandom } from '@/lib/random';
import styles from './ScrambleText.module.css';

type Props = {
  /** Texto final. Se renderiza tal cual en el servidor. */
  text: string;
  /** Arranca el revuelto cuando pasa a `true`. */
  isActive: boolean;
  /** Retardo antes del primer carácter (s). */
  delay?: number;
  className?: string;
};

/** Alfabeto del revuelto: mismo repertorio que el título, para que no cambie de ancho. */
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=/<>';
/** Duración del revuelto de un carácter (s). */
const CHAR_DURATION = 0.42;
/** Separación entre caracteres consecutivos (s). */
const CHAR_STAGGER = 0.028;
/** Cambios de glifo por carácter: pocos, o se lee como ruido. */
const SWAPS = 7;
/**
 * Si la señal de arranque no llega en este tiempo (ms), el texto se asienta solo:
 * un titular revuelto para siempre es peor que uno sin animación.
 *
 * Holgado a propósito. Es un seguro contra una señal que no llega nunca, no un
 * competidor de la secuencia normal: el loader puede tardar hasta 9s en su corte
 * de seguridad y la transición añade cerca de 3s más, así que un valor ajustado
 * se dispararía antes que el arranque real y se comería la animación.
 */
const FALLBACK_MS = 15000;

/**
 * Revuelve el texto carácter a carácter hasta asentarlo.
 *
 * El texto real se renderiza en el servidor y solo se sustituye una vez montado,
 * así que sin JavaScript el título se lee igual. Al montar, si todavía no toca
 * animar, los caracteres se congelan en glifos aleatorios: si se quedaran con el
 * texto final, al descubrirse la página se vería el titular ya resuelto y después
 * revolviéndose, que es el orden contrario al que se busca.
 *
 * El `aria-label` del elemento padre es el que anuncia el texto: los caracteres
 * van marcados como decorativos, porque mientras se revuelven un lector de
 * pantalla leería basura.
 *
 * Los espacios no se revuelven; si lo hicieran, las palabras perderían su forma.
 */
export function ScrambleText({ text, isActive, delay = 0, className }: Props) {
  const rootRef = useRef<HTMLSpanElement>(null);
  const settledRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || settledRef.current) return;

    const chars = gsap.utils
      .toArray<HTMLElement>(`.${styles.char}`, root)
      .filter((char) => char.dataset.char?.trim());

    const settle = () => {
      settledRef.current = true;
      for (const char of chars) {
        char.textContent = char.dataset.char ?? '';
        delete char.dataset.scrambling;
      }
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      settle();
      return;
    }

    const random = createRandom(text.length * 7919);

    if (!isActive) {
      // Estado de espera: revuelto y quieto.
      for (const char of chars) {
        char.textContent = GLYPHS[Math.floor(random() * GLYPHS.length)];
        char.dataset.scrambling = 'true';
      }
      const fallback = setTimeout(settle, FALLBACK_MS);
      return () => clearTimeout(fallback);
    }

    const tweens = chars.map((char, index) => {
      const finalChar = char.dataset.char ?? '';
      const state = { progress: 0 };
      let lastSwap = -1;

      return gsap.to(state, {
        progress: 1,
        duration: CHAR_DURATION,
        delay: delay + index * CHAR_STAGGER,
        ease: 'none',
        onStart: () => {
          char.dataset.scrambling = 'true';
        },
        onUpdate: () => {
          // Se cambia de glifo por pasos, no en cada cuadro: a 60fps el texto
          // se convertiría en una mancha ilegible.
          const swap = Math.floor(state.progress * SWAPS);
          if (swap === lastSwap) return;
          lastSwap = swap;
          char.textContent = GLYPHS[Math.floor(random() * GLYPHS.length)];
        },
        onComplete: () => {
          char.textContent = finalChar;
          delete char.dataset.scrambling;
        },
      });
    });

    return () => {
      for (const tween of tweens) tween.kill();
    };
  }, [isActive, delay, text]);

  return (
    <span ref={rootRef} className={className} aria-hidden>
      {[...text].map((char, index) => (
        <span
          // El índice es la identidad correcta aquí: la posición dentro de la
          // línea es lo que define a cada carácter, no su contenido.
          key={index}
          className={styles.char}
          data-char={char}
        >
          {char}
        </span>
      ))}
    </span>
  );
}
