'use client';

import { useEffect, useState } from 'react';
import { createRandom } from '@/lib/random';
import { PIXEL_REVEAL_CONFIG, cellColor } from '../config/pixelReveal.config';

export type PixelCell = {
  key: string;
  row: number;
  col: number;
  color: string;
  /** 0 arriba, 1 abajo. Define el orden de la ola. */
  depth: number;
  /** Desfase aleatorio dentro de la fila, en segundos. */
  offset: number;
};

export type PixelGrid = {
  cols: number;
  rows: number;
  /** Distancia entre centros de celda. */
  pitch: number;
  /** Lado del cuadro pintado, menor que el paso. */
  cellSize: number;
  cells: PixelCell[];
};

const EMPTY: PixelGrid = { cols: 0, rows: 0, pitch: 0, cellSize: 0, cells: [] };

function buildGrid(width: number, height: number, seed: number): PixelGrid {
  const { pitch, cellSize, mobilePitch, mobileBreakpoint, jitter } = PIXEL_REVEAL_CONFIG;
  const isNarrow = width <= mobileBreakpoint;
  const cellPitch = isNarrow ? mobilePitch : pitch;
  // El cuadro conserva la proporción respecto al paso en cualquier tamaño.
  const size = isNarrow ? mobilePitch * (cellSize / pitch) : cellSize;

  // Una celda de más por lado: la última fila y columna deben desbordar, no
  // dejar una franja sin cubrir.
  const cols = Math.ceil(width / cellPitch) + 1;
  const rows = Math.ceil(height / cellPitch) + 1;
  const random = createRandom(seed);
  const cells: PixelCell[] = [];

  for (let row = 0; row < rows; row += 1) {
    const depth = rows === 1 ? 1 : row / (rows - 1);

    for (let col = 0; col < cols; col += 1) {
      cells.push({
        key: `${row}-${col}`,
        row,
        col,
        depth,
        color: cellColor(depth, random()),
        offset: random() * jitter,
      });
    }
  }

  return { cols, rows, pitch: cellPitch, cellSize: size, cells };
}

/**
 * Genera la malla a partir del tamaño real del viewport.
 *
 * Se mide en el cliente (no hay tamaño fiable en el servidor), así que en el
 * primer render la malla está vacía; quien la use debe tolerarlo.
 */
export function usePixelGrid({
  seed = 20261005,
  isLocked = false,
}: { seed?: number; isLocked?: boolean } = {}): PixelGrid {
  const [grid, setGrid] = useState<PixelGrid>(EMPTY);

  useEffect(() => {
    if (isLocked) return;
    const measure = () =>
      setGrid(buildGrid(window.innerWidth, window.innerHeight, seed));

    measure();
    window.addEventListener('orientationchange', measure);
    return () => window.removeEventListener('orientationchange', measure);
  }, [seed, isLocked]);

  return grid;
}
