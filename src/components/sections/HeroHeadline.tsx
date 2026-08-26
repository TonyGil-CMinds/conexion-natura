'use client';

import { useHasEntered } from '@/features/loader';
import { ScrambleText } from '@/components/ui/ScrambleText';
import type { HeadlineSegment } from '@/config/site';
import styles from './HeroHeadline.module.css';

type Props = {
  /** Una entrada por línea; cada línea, una lista de tramos. */
  lines: readonly (readonly HeadlineSegment[])[];
};

/** Separación entre caracteres del revuelto (s). Debe coincidir con ScrambleText. */
const CHAR_STAGGER = 0.028;
/** Las líneas se solapan: encadenarlas del todo alarga demasiado la entrada. */
const OVERLAP = 0.55;

/**
 * Titular del hero, con entrada de revuelto por carácter.
 *
 * El titular se parte en tramos porque el resalte cae a mitad de línea
 * ("biodiversidad y las"): el color es decisión de diseño por tramo, no por línea.
 *
 * Espera a `useHasEntered`: el hero se monta oculto detrás del loader, así que
 * arrancar antes gastaría la animación mientras la malla todavía tapa la pantalla.
 *
 * El `aria-label` lleva el texto completo porque los caracteres van marcados como
 * decorativos: durante el revuelto, leerlos en voz alta daría basura.
 */
export function HeroHeadline({ lines }: Props) {
  const hasEntered = useHasEntered();
  const full = lines.map((line) => line.map((s) => s.text).join('')).join(' ');

  // Recorrido acumulado de caracteres: el retardo de cada tramo continúa donde
  // acabó el anterior, así que el revuelto avanza como una sola pasada.
  let charOffset = 0;

  return (
    <h1 className={styles.root} aria-label={full}>
      {lines.map((line, lineIndex) => (
        <span key={lineIndex} className={styles.line}>
          {line.map((segment) => {
            const delay = charOffset * CHAR_STAGGER * OVERLAP;
            charOffset += segment.text.length;
            return (
              <ScrambleText
                key={segment.text}
                text={segment.text}
                isActive={hasEntered}
                delay={delay}
                className={segment.accent ? styles.accent : undefined}
              />
            );
          })}
        </span>
      ))}
    </h1>
  );
}
