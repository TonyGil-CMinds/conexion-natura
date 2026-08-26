'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { createRandom } from '@/lib/random';

type Options = {
  /** Contenedor de los elementos que parpadean. */
  containerRef: RefObject<HTMLElement | null>;
  /** Selector de los elementos, dentro del contenedor. */
  selector: string;
  /** Arranca cuando pasa a `true`. */
  isActive?: boolean;
  /**
   * Retardo de cada elemento, en segundos. Recibe el elemento y su índice, así que
   * el orden lo decide quien usa el hook: una ola por filas, por columnas o al azar.
   */
  delayFor: (element: HTMLElement, index: number, total: number) => number;
  /** Duración de un destello (s). Corto: tiene que leerse como parpadeo. */
  flashDuration?: number;
  /** Destellos mínimos y máximos antes de quedarse encendido. */
  minFlashes?: number;
  maxFlashes?: number;
  /** Semilla del número de destellos. */
  seed?: number;
};

/**
 * Entrada estroboscópica: cada elemento parpadea un número aleatorio de veces
 * antes de quedarse encendido.
 *
 * El parpadeo usa `steps(1)` y no una interpolación: un fundido lo convertiría en
 * una aparición suave, que es justo lo contrario de un estroboscopio.
 *
 * Quien apaga los elementos antes de la entrada es este hook, ya en el cliente, y
 * no el CSS: si el CSS los apagara, un fallo de JavaScript los dejaría invisibles
 * para siempre.
 */
export function useStrobeEntrance({
  containerRef,
  selector,
  isActive = true,
  delayFor,
  flashDuration = 0.055,
  minFlashes = 2,
  maxFlashes = 6,
  seed = 0x0c01,
}: Options) {
  // Apagado al montar, no al activar: si esperara, los elementos aparecerían
  // encendidos y se apagarían de golpe justo antes de la entrada.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.set(gsap.utils.toArray<HTMLElement>(selector, container), { opacity: 0 });
  }, [containerRef, selector]);

  useEffect(() => {
    const container = containerRef.current;
    if (!isActive || !container) return;

    const elements = gsap.utils.toArray<HTMLElement>(selector, container);
    if (!elements.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Sin parpadeo: aparecer de golpe es preferible a un destello repetido.
      gsap.set(elements, { opacity: 1 });
      return;
    }

    const random = createRandom(seed);
    const tweens = elements.map((element, index) => {
      // Par: con yoyo, un número par de repeticiones deja un total impar de
      // pasadas, así que el elemento termina encendido.
      const flashes =
        2 * Math.round(minFlashes / 2 + random() * ((maxFlashes - minFlashes) / 2));

      return gsap.fromTo(
        element,
        { opacity: 0 },
        {
          opacity: 1,
          duration: flashDuration,
          delay: delayFor(element, index, elements.length),
          repeat: flashes,
          yoyo: true,
          ease: 'steps(1)',
        },
      );
    });

    return () => {
      for (const tween of tweens) tween.kill();
    };
    // `delayFor` se pasa en línea desde el componente; incluirlo reiniciaría la
    // animación en cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, selector, isActive, flashDuration, minFlashes, maxFlashes, seed]);
}
