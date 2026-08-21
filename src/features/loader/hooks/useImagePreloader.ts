'use client';

import { useEffect, useState } from 'react';

type PreloadState = {
  /** Progreso real de descarga, 0 → 1. */
  ratio: number;
  loaded: number;
  total: number;
  isComplete: boolean;
};

/**
 * Precarga una lista de imágenes y reporta el avance real.
 * Un asset que falla cuenta como resuelto: el loader nunca debe quedar atascado.
 */
export function useImagePreloader(sources: readonly string[]): PreloadState {
  const total = sources.length;
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    if (total === 0) return;

    let cancelled = false;
    const images: HTMLImageElement[] = [];

    const settle = () => {
      if (!cancelled) setLoaded((n) => n + 1);
    };

    for (const src of sources) {
      const img = new Image();
      img.onload = settle;
      img.onerror = settle;
      img.src = src;
      images.push(img);
    }

    return () => {
      cancelled = true;
      for (const img of images) {
        img.onload = null;
        img.onerror = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources.join('|')]);

  return {
    ratio: total === 0 ? 1 : loaded / total,
    loaded,
    total,
    isComplete: loaded >= total,
  };
}
