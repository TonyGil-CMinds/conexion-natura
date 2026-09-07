import Image from 'next/image';
import Link from 'next/link';
import { RegistrationCta } from '@/features/registration';
import { ThemedImage } from '@/components/ui/ThemedImage';
import { SOCIAL_MARKS, type SocialNetwork } from '@/components/ui/social-marks';
import { FOOTER, PARTNER_GROUPS, SITE } from '@/config/site';
import { getDictionary, localePath, type Locale } from '@/i18n';
import styles from './SiteFooter.module.css';

/**
 * Pie del sitio.
 *
 * Lo compone `PageFrame`, no cada página: es idéntico en todas las rutas, y
 * viviendo dentro del armazón los filetes verticales de la retícula lo cruzan como
 * cruzan el resto de la página.
 */
export function SiteFooter({ locale }: { locale: Locale }) {
  const { image, cta, legal, social } = FOOTER;
  const t = getDictionary(locale);
  const copy = t.footer;

  return (
    <footer className={styles.root}>
      <div className={styles.main}>
        <div className={styles.partners}>
          {PARTNER_GROUPS.map((group) => (
            <div key={group.key} className={styles.partnerGroup}>
              <p className={styles.partnerLabel}>{copy.partners[group.key]}</p>
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
          {copy.farewellLead} <strong className={styles.place}>{SITE.event.place}</strong>
        </p>

        <div className={styles.cta}>
          <RegistrationCta
            label={copy.ctaLabel}
            confirmedLabel={t.registration.confirmedCta}
            href={localePath(locale, cta.href)}
            size="compact"
          />
        </div>
      </div>

      <div className={styles.bottomBand}>
        <div className={styles.bottom}>
        <Link
          href={localePath(locale, '/')}
          className={styles.brand}
          aria-label={`${SITE.name} — ${t.header.home}`}
        >
          <ThemedImage
            dark="/brand/logo-dark-ceibaquito.svg"
            light="/brand/logo-light-ceibaquito.svg"
            alt={SITE.name}
            width={1109}
            height={249}
          />
        </Link>

        <div className={styles.texts}>
          <p className={styles.copyright}>
            © {SITE.event.date.year} {SITE.name}. {copy.copyright}
          </p>

          <ul className={styles.legal}>
            {legal.map((item) => (
              <li key={item.href}>
                <a className={styles.legalLink} href={item.href}>
                  {copy.legal[item.key]}
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
