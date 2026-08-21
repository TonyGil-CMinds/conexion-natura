'use client';

import { useEffect, useMemo } from 'react';
import {
  LOADER_CONFIG,
  LOADER_SEQUENCES,
  getSequenceFrames,
} from '../config/loader.config';
import { useImagePreloader } from '../hooks/useImagePreloader';
import { useLoaderProgress } from '../hooks/useLoaderProgress';
import { FrameSequence } from './FrameSequence';
import { LoaderMark } from './LoaderMark';
import { ProgressCounter } from './ProgressCounter';
import styles from './Loader.module.css';

type Props = {
  /** Assets adicionales que deben estar listos antes de dejar pasar a la página. */
  preload?: readonly string[];
  /** Se llama cuando el contador llegó a 100 y pasó la pausa de lectura. */
  onComplete?: () => void;
  /** Pausa en 100 % antes de avisar, para que el número se alcance a leer (ms). */
  holdMs?: number;
};

/**
 * Pantalla de carga: glifo de progreso al centro, contador abajo a la izquierda
 * y la secuencia de la ballena abajo a la derecha.
 *
 * Mide la precarga real y anima 0 → 100. No se desmonta solo: avisa con
 * `onComplete` y quien lo usa decide cuándo retirarlo (aquí lo tapa la malla de
 * píxeles antes de quitarlo).
 */
export function Loader({ preload = [], onComplete, holdMs = 420 }: Props) {
  const sequence = LOADER_SEQUENCES[LOADER_CONFIG.sequence];
  const frames = useMemo(() => getSequenceFrames(LOADER_CONFIG.sequence), []);
  const sources = useMemo(() => [...frames, ...preload], [frames, preload]);

  const { ratio } = useImagePreloader(sources);
  const { progress, value, isFinished } = useLoaderProgress({ targetRatio: ratio });

  useEffect(() => {
    if (!isFinished) return;
    const timer = setTimeout(() => onComplete?.(), holdMs);
    return () => clearTimeout(timer);
  }, [isFinished, holdMs, onComplete]);

  return (
    <div className={styles.root}>
      <div className={styles.mark}>
        <LoaderMark progress={progress} />
      </div>

      <div className={styles.counter}>
        <ProgressCounter value={value} />
      </div>

      <div className={styles.sequence}>
        <FrameSequence
          frames={frames}
          fps={LOADER_CONFIG.fps}
          width={sequence.width}
          height={sequence.height}
          alt="Ballena animada"
        />
      </div>
    </div>
  );
}
