'use client';

import { useCallback, useState } from 'react';
import { PixelReveal } from '@/features/transitions/pixel-reveal';
import { RevealProvider } from '../context/reveal';
import { Loader } from './Loader';
import styles from './LoaderGate.module.css';

type Props = {
  children: React.ReactNode;
  /** Assets de la página que deben estar listos antes de revelarla. */
  preload?: readonly string[];
};

/**
 * Fases: `loading` → `covering` → `revealing` → `done`.
 *
 * `covering` y `revealing` existen por separado porque el cambio de loader a
 * página tiene que ocurrir con la pantalla tapada. Si se desmontara el loader al
 * llegar a 100 se vería el salto por los huecos de la malla.
 */
type Phase = 'loading' | 'covering' | 'revealing' | 'done';

export function LoaderGate({ children, preload }: Props) {
  const [phase, setPhase] = useState<Phase>('loading');

  const handleLoaded = useCallback(() => setPhase('covering'), []);
  const handleCovered = useCallback(() => setPhase('revealing'), []);
  const handleRevealed = useCallback(() => setPhase('done'), []);

  const isLoaderMounted = phase === 'loading' || phase === 'covering';
  const isContentVisible = phase === 'revealing' || phase === 'done';

  return (
    <>
      <div
        className={styles.content}
        data-visible={isContentVisible || undefined}
        aria-hidden={!isContentVisible}
        inert={!isContentVisible}
      >
        <RevealProvider isVisible={isContentVisible} hasEntered={phase === 'done'}>
          {children}
        </RevealProvider>
      </div>

      {isLoaderMounted && <Loader preload={preload} onComplete={handleLoaded} />}

      {phase !== 'done' && (
        <PixelReveal
          isActive={phase !== 'loading'}
          onCovered={handleCovered}
          onComplete={handleRevealed}
        />
      )}
    </>
  );
}
