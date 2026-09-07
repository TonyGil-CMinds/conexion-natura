import { ThemedImage } from '@/components/ui/ThemedImage';
import { RegistrationCta } from '@/features/registration';
import { SITE } from '@/config/site';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import { HeroCountdown } from './HeroCountdown';
import { HeroHeadline } from './HeroHeadline';
import { HeroMedia } from './HeroMedia';
import styles from './Hero.module.css';

type Props = {
  locale: Locale;
  copy: Dictionary['hero'];
  /** Rótulo del botón cuando ya hay asistencia confirmada. */
  confirmedCta: string;
};

/**
 * Hero de portada.
 *
 * Ocupa todo el ancho del contenedor y no lleva márgenes de retícula propios: los
 * necesita el contenido, pero el campo de píxeles llega hasta el borde del
 * viewport y la cinta de la cuenta atrás también.
 *
 * El rótulo va como imagen y no como texto: es un logotipo, con formas propias
 * que no se pueden componer con la tipografía. Tiene una variante por tema: la
 * palabra cambia de tinta y el rombo se queda lima en las dos.
 *
 * Los filetes de la retícula los dibuja `PageFrame`.
 */
export function Hero({ locale, copy, confirmedCta }: Props) {
  return (
    <section className={styles.root}>
      <HeroMedia />

      <div className={styles.content}>
        <p className={styles.when}>
          <span>{copy.dateLabel}</span>
          <span className={styles.separator} aria-hidden>
            /
          </span>
          <span className={styles.place}>{SITE.event.place}</span>
        </p>

        <ThemedImage
          dark="/brand/logo-dark-ceibaquito.svg"
          light="/brand/logo-light-ceibaquito.svg"
          alt={SITE.name}
          width={1109}
          height={249}
          priority
          className={styles.wordmark}
        />

        <HeroHeadline lines={copy.subtitle} />

        <div className={styles.cta}>
          <RegistrationCta
            label={copy.ctaLabel}
            confirmedLabel={confirmedCta}
            href={localePath(locale, SITE.cta.href)}
          />
          <p className={styles.note}>{copy.ctaNote}</p>
        </div>
      </div>

      <HeroCountdown label={copy.countdownLabel} />
    </section>
  );
}
