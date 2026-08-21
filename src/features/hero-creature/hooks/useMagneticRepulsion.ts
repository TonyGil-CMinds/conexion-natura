'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from '@/lib/gsap';
import { CREATURE_CONFIG } from '../config/creature.config';

type Options = {
  containerRef: RefObject<HTMLElement | null>;
  selector: string;
  /** Se desactiva mientras la criatura no esté visible. */
  isActive: boolean;
};

type Node = {
  el: HTMLElement;
  /** Centro del píxel relativo al contenedor, en px de pantalla. */
  cx: number;
  cy: number;
  /** Desplazamiento actual. */
  x: number;
  y: number;
};

/**
 * Repulsión magnética: los píxeles cercanos al puntero se apartan de él.
 *
 * El desplazamiento objetivo se calcula por píxel y el valor real lo persigue con
 * suavizado exponencial normalizado por delta de tiempo, así que el movimiento no
 * depende de los fps y al salir el puntero vuelven solos a su sitio.
 *
 * Solo se escribe en el DOM cuando el desplazamiento cambia de forma apreciable:
 * los píxeles lejos del puntero tienen objetivo cero y ya están en cero, así que
 * la gran mayoría no toca estilos en cada cuadro.
 *
 * Las posiciones se miden una vez y se recalculan al cambiar el tamaño, no en cada
 * movimiento: leer `getBoundingClientRect` por píxel y por evento fuerza al
 * navegador a recalcular la maquetación constantemente.
 */
export function useMagneticRepulsion({ containerRef, selector, isActive }: Options) {
  useEffect(() => {
    const container = containerRef.current;
    if (!isActive || !container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Sin puntero fino no hay hover que seguir: en táctil no se activa.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const { radius, strength, tau, epsilon } = CREATURE_CONFIG.magnet;
    const elements = gsap.utils.toArray<HTMLElement>(selector, container);
    if (!elements.length) return;

    let nodes: Node[] = [];
    const measure = () => {
      const base = container.getBoundingClientRect();
      nodes = elements.map((el) => {
        const rect = el.getBoundingClientRect();
        const prev = nodes.find((n) => n.el === el);
        return {
          el,
          // Se descuenta el desplazamiento vigente: si no, la posición de reposo
          // se contamina con el empuje que el píxel tenga en ese momento.
          cx: rect.left - base.left + rect.width / 2 - (prev?.x ?? 0),
          cy: rect.top - base.top + rect.height / 2 - (prev?.y ?? 0),
          x: prev?.x ?? 0,
          y: prev?.y ?? 0,
        };
      });
    };
    measure();

    /** Puntero relativo al contenedor; null = fuera. */
    let pointer: { x: number; y: number } | null = null;

    // Se escucha en la ventana y no en la malla: el titular se solapa con el
    // colibrí, y capturar el puntero en la malla obligaba a desactivar los
    // eventos del contenido, lo que impedía seleccionar el texto del titular.
    // Solo se mueven los píxeles dentro del radio, así que el efecto sigue
    // notándose únicamente al acercarse a la criatura.
    const onMove = (event: PointerEvent) => {
      const base = container.getBoundingClientRect();
      pointer = { x: event.clientX - base.left, y: event.clientY - base.top };
    };
    const onLeave = () => {
      pointer = null;
    };

    let lastAt = performance.now();
    const tick = () => {
      const now = performance.now();
      const smoothing = 1 - Math.exp(-Math.max(now - lastAt, 0) / tau);
      lastAt = now;

      for (const node of nodes) {
        let targetX = 0;
        let targetY = 0;

        if (pointer) {
          const dx = node.cx - pointer.x;
          const dy = node.cy - pointer.y;
          const distance = Math.hypot(dx, dy);

          if (distance < radius) {
            // Caída cuadrática: el empuje se concentra junto al puntero en vez
            // de mover el bloque entero por igual.
            const falloff = (1 - distance / radius) ** 2;
            // En el centro exacto la dirección es indefinida; se empuja hacia
            // arriba para que el píxel no se quede clavado bajo el cursor.
            const nx = distance > 0.01 ? dx / distance : 0;
            const ny = distance > 0.01 ? dy / distance : -1;
            targetX = nx * falloff * strength;
            targetY = ny * falloff * strength;
          }
        }

        const nextX = node.x + (targetX - node.x) * smoothing;
        const nextY = node.y + (targetY - node.y) * smoothing;

        if (Math.abs(nextX - node.x) > epsilon || Math.abs(nextY - node.y) > epsilon) {
          node.x = nextX;
          node.y = nextY;
          node.el.style.transform = `translate3d(${nextX.toFixed(2)}px, ${nextY.toFixed(2)}px, 0)`;
        } else if (targetX === 0 && targetY === 0 && (node.x !== 0 || node.y !== 0)) {
          // Cierre: deja el píxel exactamente en su sitio y libera el transform.
          node.x = 0;
          node.y = 0;
          node.el.style.transform = '';
        }
      }
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', measure);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', measure);
      gsap.ticker.remove(tick);
      for (const node of nodes) node.el.style.transform = '';
    };
  }, [containerRef, selector, isActive]);
}
