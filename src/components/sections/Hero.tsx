import Image from 'next/image';
import { PARTNER_GROUPS, SITE } from '@/config/site';
import { CtaButton } from '@/components/ui/CtaButton';
import { HeroCreature } from './HeroCreature';
import { HeroHeadline } from './HeroHeadline';
import styles from './Hero.module.css';

/**
 * Hero de portada.
 *
 * Las entradas (revuelto del titular, estroboscopio del colibrí) las disparan sus
 * propios componentes cuando la página se descubre, no este: el hero solo compone.
 *
 * Los filetes de la retícula los dibuja `PageFrame`, no este componente: como
 * bordes propios se cortaban donde acaba el contenido acotado.
 */
export function Hero() {
  const { event, cta } = SITE;

  return (
    <section className={styles.root}>
      <div className={styles.content}>
        <HeroHeadline lines={event.headline} />

        <div className={styles.cta}>
          <CtaButton label={cta.label} href={cta.href} />
        </div>

        <footer className={styles.partners}>
          {PARTNER_GROUPS.map((group) => (
            <div key={group.label} className={styles.partnerGroup}>
              <p className={styles.partnerLabel}>{group.label}</p>
              <ul className={styles.partnerList}>
                {group.logos.map((logo) => (
                  <li key={logo.src}>
                    <Image
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </footer>
      </div>

      <HeroCreature />
    </section>
  );
}
