'use client';

import { useHasEntered } from '@/features/loader';
import { ScrambleText } from '@/components/ui/ScrambleText';
import styles from './HeroHeadline.module.css';

type Props = {
  /** Una entrada por línea. */
  lines: readonly string[];
};

/**
 * Titular del hero con entrada de revuelto por carácter.
 *
 * Espera a `useHasEntered`: el hero se monta oculto detrás del loader, así que
 * arrancar antes gastaría la animación mientras la malla de píxeles todavía
 * tapa la pantalla.
 *
 * El `aria-label` lleva el texto completo porque los caracteres van marcados como
 * decorativos: durante el revuelto, leerlos en voz alta daría basura.
 */
export function HeroHeadline({ lines }: Props) {
  const hasEntered = useHasEntered();
  const full = lines.join(' ');

  // Las líneas siguientes arrancan cuando la anterior va mediada, no al acabar:
  // encadenarlas del todo hace que el titular tarde demasiado en asentarse.
  let charOffset = 0;

  return (
    <h1 className={styles.root} aria-label={full}>
      {lines.map((line) => {
        const delay = charOffset * 0.028 * 0.55;
        charOffset += line.length;
        return (
          <ScrambleText
            key={line}
            text={line}
            isActive={hasEntered}
            delay={delay}
            className={styles.line}
          />
        );
      })}
    </h1>
  );
}
