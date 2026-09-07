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
 * Un asset a precargar. Con `media` solo se descarga si la consulta encaja: el
 * hero tiene una imagen del ave por tamaño de pantalla, y esperar por la que no
 * se va a ver retrasaría el revelado descargando medio megabyte de más.
 */
export type PreloadSource = string | { src: string; media: string };

/** Los que tocan en este viewport, en el orden dado. */
function resolve(sources: readonly PreloadSource[]): string[] {
  return sources
    .filter((entry) => typeof entry === 'string' || window.matchMedia(entry.media).matches)
    .map((entry) => (typeof entry === 'string' ? entry : entry.src));
}

/**
 * Precarga una lista de imágenes y reporta el avance real.
 * Un asset que falla cuenta como resuelto: el loader nunca debe quedar atascado.
 *
 * El recuento sale de las que **tocan** en este viewport, así que el porcentaje
 * no se queda corto por las descartadas.
 */
export function useImagePreloader(sources: readonly PreloadSource[]): PreloadState {
  // Se resuelve una vez por lista: si cambiara con un `resize` a mitad de la
  // carga, el total se movería y el contador podría retroceder.
  const [resolved] = useState(() => (typeof window === 'undefined' ? [] : resolve(sources)));
  const total = resolved.length;
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    if (total === 0) return;

    let cancelled = false;
    const images: HTMLImageElement[] = [];

    const settle = () => {
      if (!cancelled) setLoaded((n) => n + 1);
    };

    for (const src of resolved) {
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
  }, [resolved.join('|')]);

  return {
    ratio: total === 0 ? 1 : loaded / total,
    loaded,
    total,
    isComplete: loaded >= total,
  };
}
