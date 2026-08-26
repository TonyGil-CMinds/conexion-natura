import Image from 'next/image';
import styles from './EmptyState.module.css';

type Props = {
  /** Qué falta y por qué. Va en mayúsculas por estilo, no en el texto. */
  label: string;
};

/**
 * Estado vacío de una página en preparación: un aviso y el separador de píxeles.
 *
 * El separador es decorativo; el aviso es el que informa, así que va como texto y
 * no como imagen.
 */
export function EmptyState({ label }: Props) {
  return (
    <div className={styles.root}>
      <p className={styles.label}>{label}</p>
      <Image
        src="/icons/icon-separator-inactive.svg"
        alt=""
        width={81}
        height={24}
        className={styles.separator}
      />
    </div>
  );
}
