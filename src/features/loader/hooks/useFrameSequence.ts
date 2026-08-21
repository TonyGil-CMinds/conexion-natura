'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Avanza un índice de cuadro en bucle a los fps indicados, sobre requestAnimationFrame
 * (un setInterval se desincroniza del refresco de pantalla y produce saltos).
 */
export function useFrameSequence(frameCount: number, fps: number, isPlaying = true) {
  const [index, setIndex] = useState(0);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying || frameCount <= 1) return;

    const step = 1000 / fps;

    const tick = (now: number) => {
      if (now - lastRef.current >= step) {
        lastRef.current = now;
        setIndex((i) => (i + 1) % frameCount);
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [frameCount, fps, isPlaying]);

  return index;
}
