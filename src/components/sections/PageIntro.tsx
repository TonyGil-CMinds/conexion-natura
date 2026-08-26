import Image from 'next/image';
import styles from './PageIntro.module.css';

type Props = {
  /** Una entrada por línea: el salto es decisión de diseño. */
  headline: readonly string[];
  /** Texto de apoyo, a la derecha del icono. */
  note: string;
  icon: { src: string; width: number; height: number };
};

/**
 * Bloque de entrada de una página interior: titular a la izquierda, icono y texto
 * de apoyo a la derecha.
 *
 * Las dos columnas se alinean por arriba, no por el centro: el titular tiene tres
 * líneas y el apoyo dos, y centrarlos dejaría el icono flotando a media altura.
 */
export function PageIntro({ headline, note, icon }: Props) {
  return (
    <section className={styles.root}>
      <h2 className={styles.headline}>
        {headline.map((line) => (
          <span key={line} className={styles.line}>
            {line}
          </span>
        ))}
      </h2>

      <div className={styles.aside}>
        <Image src={icon.src} alt="" width={icon.width} height={icon.height} />
        <p className={styles.note}>{note}</p>
      </div>
    </section>
  );
}
