'use client';

import { useHasEntered } from '@/features/loader';
import { PixelSprite } from '@/features/hero-creature';
import styles from './HeroCreature.module.css';

/**
 * Coloca el colibrí en el hero y le da entrada cuando la página se descubre.
 *
 * Separa el "dónde va" del "cómo se comporta": `PixelSprite` no sabe nada del
 * hero, y este componente no sabe nada de estroboscopios ni de magnetismo.
 */
export function HeroCreature() {
  const hasEntered = useHasEntered();

  return (
    <div className={styles.root}>
      <PixelSprite isActive={hasEntered} />
    </div>
  );
}
