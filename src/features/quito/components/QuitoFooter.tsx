import Image from 'next/image';
import Link from 'next/link';
import { SOCIAL_MARKS, type SocialNetwork } from '@/components/ui/social-marks';
import { QUITO } from '@/config/quito';
import { FOOTER, SITE } from '@/config/site';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import { QuitoJoinCta } from './QuitoJoinCta';
import { Reveal } from './Reveal';
import { QuitoHosts } from './QuitoHosts';
import styles from './QuitoChrome.module.css';
import closing from './QuitoClosing.module.css';

type Props = {
  locale: Locale;
  copy: Dictionary['quito'];
  showHosts?: boolean;
};

/** Cierre de Quito; las organizaciones se muestran arriba en la portada. */
export function QuitoFooter({ locale, copy, showHosts = true }: Props) {
  const t = copy.footer;

  return (
    <footer className={styles.footer}>
      {/* Cierre: la ballena, la despedida y la última llamada. */}
      <section className={closing.root}>
        <Reveal>
          <Image
            src={QUITO.footer.whale.src}
            alt=""
            width={QUITO.footer.whale.width}
            height={QUITO.footer.whale.height}
            className={closing.whale}
          />
        </Reveal>

        <Reveal delay={0.1}>
          <p className={closing.farewell}>
            {t.farewellLead} <strong className={closing.place}>{SITE.event.place}</strong>
          </p>
        </Reveal>

        <Reveal delay={0.16}>
          {/* El mismo botón del hero: se convierte en el campo del correo. Va
              sin `autoOpen` porque esa petición la atiende el de arriba, y con
              los dos abriéndose el de abajo se llevaba el foco justo después de
              haber subido la página hasta el otro. */}
          <QuitoJoinCta copy={copy.join} variant="closing" />
        </Reveal>
      </section>

      <Reveal>
        <div className={styles.room}>
          <Image
            src={QUITO.footer.room.src}
            alt=""
            width={QUITO.footer.room.width}
            height={QUITO.footer.room.height}
            className={styles.roomImage}
          />
        </div>
      </Reveal>

      {showHosts && <QuitoHosts copy={t} locale={locale} />}

      <div className={styles.bottomBand}>
        <div className={styles.bottom}>
          <Link
            href={localePath(locale, QUITO.root)}
            className={styles.bottomBrand}
            aria-label={SITE.name}
          >
            <Image
              src={QUITO.footer.brand.src}
              alt={SITE.name}
              width={QUITO.footer.brand.width}
              height={QUITO.footer.brand.height}
              className={styles.bottomBrandMark}
            />
          </Link>

          <ul className={styles.legal}>
            {FOOTER.legal.map((item) => (
              <li key={item.href}>
                <Link className={styles.legalLink} href={localePath(locale, item.href)}>
                  {t.legal[item.key]}
                </Link>
              </li>
            ))}
          </ul>

          <ul className={styles.social}>
            {FOOTER.social.map((item) => {
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
