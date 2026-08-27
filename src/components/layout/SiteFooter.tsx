import Image from 'next/image';
import Link from 'next/link';
import { CtaButton } from '@/components/ui/CtaButton';
import { SOCIAL_MARKS, type SocialNetwork } from '@/components/ui/social-marks';
import { FOOTER, PARTNER_GROUPS, SITE } from '@/config/site';
import styles from './SiteFooter.module.css';

/**
 * Pie del sitio.
 *
 * Lo compone `PageFrame`, no cada página: es idéntico en todas las rutas, y
 * viviendo dentro del armazón los filetes verticales de la retícula lo cruzan como
 * cruzan el resto de la página.
 */
export function SiteFooter() {
  const { image, farewell, cta, copyright, legal, social } = FOOTER;

  return (
    <footer className={styles.root}>
      <div className={styles.main}>
        <div className={styles.partners}>
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
                      className={styles.partnerLogo}
                                         />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Image
          src={image.src}
          alt=""
          width={image.width}
          height={image.height}
          className={styles.image}
        />

        <p className={styles.farewell}>
          {farewell.lead} <strong className={styles.place}>{farewell.place}</strong>
        </p>

        <div className={styles.cta}>
          <CtaButton label={cta.label} href={cta.href} size="compact" />
        </div>
      </div>

      <div className={styles.bottomBand}>
        <div className={styles.bottom}>
        <Link href="/" className={styles.brand} aria-label={`${SITE.name} — inicio`}>
          <Image
            src="/brand/logo-horizontal-blanco.svg"
            alt={SITE.name}
            width={1100}
            height={117}
          />
        </Link>

        <div className={styles.texts}>
          <p className={styles.copyright}>
            © {SITE.event.date.year} {SITE.name}. {copyright}
          </p>

          <ul className={styles.legal}>
            {legal.map((item: { label: string; href: string }) => (
              <li key={item.href}>
                <a className={styles.legalLink} href={item.href}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <ul className={styles.social}>
          {social.map((item: { network: string; label: string; href: string }) => {
            const Mark = SOCIAL_MARKS[item.network as SocialNetwork];
            return (
              <li key={item.network}>
                <a
                  className={styles.socialLink}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                >
                  <Mark className={styles.socialMark} />
                </a>
              </li>
            );
          })}
          </ul>
        </div>
      </div>
    </footer>
  );
}
