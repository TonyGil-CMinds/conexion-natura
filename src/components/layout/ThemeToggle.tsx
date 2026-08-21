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
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

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
      aria-label={theme === 'light' ? 'Activar tema oscuro' : 'Activar tema claro'}
      aria-pressed={theme === 'dark'}
    >
      <Image
        // El icono no cambia de forma, solo de color, para seguir contrastando
        // con el fondo de cada tema.
        src={
          theme === 'light'
            ? '/icons/icon-dark-lightmode.svg'
            : '/icons/icon-light-lightmode.svg'
        }
        alt=""
        width={20}
        height={20}
      />
    </button>
  );
}
