import { TANUSAS } from '@/config/tanusas';
import type { Dictionary } from '@/i18n';
import styles from './Tanusas.module.css';

type Props = { copy: Dictionary['tanusas']['hero'] };

/**
 * El botón del hero y del cierre, ahora que el retiro está ocurriendo.
 *
 * Antes era «Confirmar asistencia» y abría el campo del correo. Ya no hay nada
 * que confirmar —quien lee esto está en Tanusas— así que lleva a la agenda, que
 * es lo único que alguien necesita de esta página durante los tres días.
 *
 * Es un ancla y no un botón con `onClick`: así funciona con el teclado, se
 * puede abrir en otra pestaña y sobrevive a que falle el JavaScript.
 */
export function TanusasAgendaCta({ copy }: Props) {
  return (
    <a className={styles.agendaCta} href={`#${TANUSAS.sections.find((s) => s.key === 'agenda')!.id}`}>
      {copy.cta}
    </a>
  );
}
