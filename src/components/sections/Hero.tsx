import Image from 'next/image';
import { SITE } from '@/config/site';
import { RegistrationCta } from '@/features/registration';
import { HeroCountdown } from './HeroCountdown';
import { HeroHeadline } from './HeroHeadline';
import { HeroMedia } from './HeroMedia';
import styles from './Hero.module.css';

/**
 * Hero de portada.
 *
 * Ocupa todo el ancho del contenedor y no lleva márgenes de retícula propios: los
 * necesita el contenido, pero el campo de píxeles llega hasta el borde del
 * viewport y la cinta de la cuenta atrás también.
 *
 * El rótulo va como imagen y no como texto: es un logotipo, con formas propias
 * que no se pueden componer con la tipografía.
 *
 * Los filetes de la retícula los dibuja `PageFrame`.
 */
export function Hero() {
  const { event, cta, invite } = SITE;

  return (
    <section className={styles.root}>
      <HeroMedia />

      <div className={styles.content}>
        <p className={styles.when}>
          <span>{event.dateLabel}</span>
          <span className={styles.separator} aria-hidden>
            /
          </span>
          <span className={styles.place}>{event.place}</span>
        </p>

        <Image
          src="/brand/logo-horizontal-blanco.svg"
          alt={SITE.name}
          width={1100}
          height={117}
          priority
          className={styles.wordmark}
        />

        <HeroHeadline lines={event.headline} />

        <div className={styles.cta}>
          <RegistrationCta label={cta.label} href={cta.href} />
          <p className={styles.note}>{cta.note}</p>
        </div>

        <a className={styles.invite} href={invite.href}>
          <Image
            src="/hero/asset-riggle-red.svg"
            alt=""
            width={23}
            height={19}
            className={styles.inviteIcon}
          />
          <span>{invite.label}</span>
        </a>
      </div>

      <HeroCountdown />
    </section>
  );
}
