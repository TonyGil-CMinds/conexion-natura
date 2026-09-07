'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

/**
 * Cambia el tema escribiendo `data-theme` en <html>; los colores salen de los
 * roles semánticos de tokens.css, así que ningún componente conoce el tema.
 *
 * Sin persistencia todavía: guardarlo en localStorage exige un script en línea
 * que lo aplique antes del primer pintado, o la página parpadea al recargar.
 */
type Props = {
  /** Rótulo cuando el tema vigente es el oscuro: anuncia a dónde se cambia. */
  toLight: string;
  toDark: string;
};

export function ThemeToggle({ toLight, toDark }: Props) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = useCallback(
    () => setTheme((current) => (current === 'light' ? 'dark' : 'light')),
    [],
  );

  return (
    <button
      type="button"
      className={styles.root}
      onClick={toggle}
      aria-label={theme === 'dark' ? toLight : toDark}
      aria-pressed={theme === 'dark'}
    >
      <Image
        // El icono anuncia el tema al que se cambia, no el vigente.
        src={
          theme === 'dark'
            ? '/icons/icon-light-lightmode.svg'
            : '/icons/icon-dark-lightmode.svg'
        }
        alt=""
        width={20}
        height={20}
      />
    </button>
  );
}
