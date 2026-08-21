import Image from 'next/image';
import { SITE } from '@/config/site';
import styles from './HeroMeta.module.css';

/**
 * Barra inferior: fecha y sede a la izquierda, formato a la derecha.
 *
 * El filete superior lo dibuja la banda de `PageFrame`, que va a sangre; como
 * borde de este componente se cortaría al acotar el contenido.
 */
export function HeroMeta() {
  const { date, place, format } = SITE.event;

  return (
    <div className={styles.root}>
      <p className={styles.when}>
        <span>{date}</span>
        <span className={styles.separator} aria-hidden>
          /
        </span>
        <span className={styles.place}>{place}</span>
      </p>

      <p className={styles.format}>
        <Image
          src="/hero/asset-riggle-green.svg"
          alt=""
          width={23}
          height={19}
          className={styles.icon}
        />
        <span>{format}</span>
      </p>
    </div>
  );
}
