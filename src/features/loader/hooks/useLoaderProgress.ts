'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { LOADER_CONFIG } from '../config/loader.config';

type Options = {
  /** Progreso real de precarga, 0 → 1. */
  targetRatio: number;
};

/** Constante de tiempo del suavizado (ms). Más alto = el número persigue más lento. */
const SMOOTHING_TAU = 170;

/**
 * Convierte el progreso real de descarga en un contador continuo 0 → 100.
 *
 * El objetivo es `min(descarga, tiempo)`: el contador va siempre al ritmo del
 * más lento de los dos, así que con assets ya en caché sube al ritmo de
 * `minDurationMs`, y con red lenta lo marca la descarga de verdad.
 *
 * Se recalcula en cada cuadro desde el ticker de GSAP, no una vez por cambio de
 * `targetRatio`: el componente temporal del objetivo avanza solo, y muestrearlo
 * únicamente cuando llega un asset deja el número congelado entre cargas.
 *
 * El valor mostrado persigue al objetivo con suavizado exponencial normalizado
 * por delta de tiempo, para que no dependa de los fps de la pantalla.
 */
export function useLoaderProgress({ targetRatio }: Options) {
  const [progress, setProgress] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // El ticker lee el ratio por referencia: así no hace falta reiniciar nada
  // cuando cambia, y no se pierde ninguna actualización entre cuadros.
  const ratioRef = useRef(targetRatio);
  ratioRef.current = targetRatio;

  useEffect(() => {
    const { minDurationMs, maxDurationMs } = LOADER_CONFIG;
    const startedAt = performance.now();
    let lastAt = startedAt;
    let value = 0;

    const tick = () => {
      const now = performance.now();
      const deltaMs = Math.max(now - lastAt, 0);
      lastAt = now;

      const elapsed = now - startedAt;
      const timeRatio = Math.min(elapsed / minDurationMs, 1);
      // Corte de seguridad: si un asset nunca resuelve, la carga no se eterniza.
      const timedOut = elapsed >= maxDurationMs;

      const canFinish = (ratioRef.current >= 1 && timeRatio >= 1) || timedOut;
      const desired = canFinish
        ? 100
        : Math.min(99, Math.min(ratioRef.current, timeRatio) * 100);

      // Suavizado independiente de los fps: con dt grande converge igual.
      value += (desired - value) * (1 - Math.exp(-deltaMs / SMOOTHING_TAU));

      if (canFinish && desired - value < 0.4) {
        value = 100;
        gsap.ticker.remove(tick);
        setProgress(100);
        setIsFinished(true);
        return;
      }

      setProgress(value);
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  return { progress, value: Math.round(progress), isFinished };
}
