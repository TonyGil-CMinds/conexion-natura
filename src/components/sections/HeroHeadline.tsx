'use client';

import { useHasEntered } from '@/features/loader';
import { ScrambleText } from '@/components/ui/ScrambleText';
import styles from './HeroHeadline.module.css';

type Props = {
  /** Una entrada por línea. El salto es decisión de diseño, no del navegador. */
  lines: readonly string[];
};

/** Separación entre caracteres del revuelto (s). Debe coincidir con ScrambleText. */
const CHAR_STAGGER = 0.028;
/** Las líneas se solapan: encadenarlas del todo alarga demasiado la entrada. */
const OVERLAP = 0.55;

/**
 * Subtítulo del hero, con entrada de revuelto por carácter.
 *
 * Espera a `useHasEntered`: el hero se monta oculto detrás del loader, así que
 * arrancar antes gastaría la animación mientras la malla todavía tapa la pantalla.
 *
 * El `aria-label` lleva el texto completo porque los caracteres van marcados como
 * decorativos: durante el revuelto, leerlos en voz alta daría basura.
 */
export function HeroHeadline({ lines }: Props) {
  const hasEntered = useHasEntered();

  // Recorrido acumulado de caracteres: el retardo de cada línea continúa donde
  // acabó la anterior, así que el revuelto avanza como una sola pasada.
  let charOffset = 0;

  return (
    <h1 className={styles.root} aria-label={lines.join(' ')}>
      {lines.map((line) => {
        const delay = charOffset * CHAR_STAGGER * OVERLAP;
        charOffset += line.length;
        return (
          <span key={line} className={styles.line}>
            <ScrambleText text={line} isActive={hasEntered} delay={delay} />
          </span>
        );
      })}
    </h1>
  );
}
