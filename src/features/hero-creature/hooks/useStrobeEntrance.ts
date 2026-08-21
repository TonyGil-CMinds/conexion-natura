'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { createRandom } from '@/lib/random';
import { CREATURE_CONFIG } from '../config/creature.config';

type Options = {
  /** Contenedor de los píxeles. */
  containerRef: RefObject<HTMLElement | null>;
  /** Selector de los píxeles dentro del contenedor. */
  selector: string;
  /** Arranca cuando pasa a `true` (p. ej. al terminar la transición de entrada). */
  isActive: boolean;
  /** Filas de la malla, para ordenar la ola. */
  rows: number;
};

/**
 * Entrada estroboscópica: cada píxel parpadea un número aleatorio de veces antes
 * de quedarse encendido, en una ola que sube de abajo hacia arriba.
 *
 * El parpadeo usa `steps(1)` y no una interpolación: un fundido lo convertiría en
 * una aparición suave, que es justo lo contrario de un estroboscopio.
 */
export function useStrobeEntrance({ containerRef, selector, isActive, rows }: Options) {
  // Apagar la malla es trabajo del cliente, no del CSS: así, sin JavaScript, el
  // colibrí se ve igualmente. Y hay que hacerlo al montar y no al activar, o
  // aparecería entero mientras la transición se retira y luego se apagaría de
  // golpe para volver a encenderse.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.set(gsap.utils.toArray<HTMLElement>(selector, container), { opacity: 0 });
  }, [containerRef, selector]);

  useEffect(() => {
    const container = containerRef.current;
    if (!isActive || !container) return;

    const pixels = gsap.utils.toArray<HTMLElement>(selector, container);
    if (!pixels.length) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // Sin parpadeo: aparecer de golpe es preferible a un destello repetido.
      gsap.set(pixels, { opacity: 1 });
      return;
    }

    const { flashDuration, minFlashes, maxFlashes, span, jitter } = CREATURE_CONFIG.strobe;
    const random = createRandom(0x0c01);
    const tweens = pixels.map((pixel) => {
      const row = Number(pixel.dataset.row ?? 0);
      // Abajo primero, igual que la ola de la transición de píxeles.
      const depth = rows > 1 ? row / (rows - 1) : 1;
      const delay = (1 - depth) * span + random() * jitter;
      // Par: con yoyo, un número par de repeticiones deja un total impar de
      // pasadas, así que el píxel termina encendido.
      const flashes = 2 * Math.round(minFlashes / 2 + random() * ((maxFlashes - minFlashes) / 2));

      return gsap.fromTo(
        pixel,
        { opacity: 0 },
        {
          opacity: 1,
          duration: flashDuration,
          delay,
          repeat: flashes,
          yoyo: true,
          ease: 'steps(1)',
        },
      );
    });

    return () => {
      for (const tween of tweens) tween.kill();
    };
  }, [containerRef, selector, isActive, rows]);
}
