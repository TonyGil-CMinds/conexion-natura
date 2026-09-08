'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { StairsReveal } from '@/features/transitions/stairs-reveal';
import styles from './ThemeToggle.module.css';

type Theme = 'light' | 'dark';

/**
 * Cambia el tema escribiendo `data-theme` en <html>; los colores salen de los
 * roles semánticos de tokens.css, así que ningún componente conoce el tema.
 *
 * El cambio va **detrás de la escalera**, la misma transición que trae el loader
 * al hero: las columnas entran con el fondo del tema al que se va, y con la
 * pantalla cubierta —en `onCovered`— se escribe el atributo. Así el salto de
 * colores no se ve nunca, que es lo que chirriaba al cambiarlo en seco.
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
  /** Tema al que se está yendo mientras la escalera corre. */
  const [pending, setPending] = useState<Theme | null>(null);
  // La capa va a `body` por portal, así que hay que esperar al montaje.
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggle = useCallback(() => {
    // A mitad de la transición no se admite otro cambio: con dos escaleras
    // encima, la segunda destaparía la pantalla antes de que la primera acabe.
    if (pending) return;
    const next: Theme = theme === 'light' ? 'dark' : 'light';
    // Con movimiento reducido el tema cambia en seco: no hay nada que tapar.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTheme(next);
      return;
    }
    setPending(next);
  }, [pending, theme]);

  return (
    <>
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

      {/**
       * Al `body` y no aquí dentro: la capa es `fixed` y tiene que quedar por
       * encima de todo, y colgada de la cabecera dependería de su contexto de
       * apilamiento.
       */}
      {isMounted &&
        pending &&
        createPortal(
          <StairsReveal
            isActive
            tone="theme"
            surface={pending}
            onCovered={() => setTheme(pending)}
            onComplete={() => setPending(null)}
          />,
          document.body,
        )}
    </>
  );
}
