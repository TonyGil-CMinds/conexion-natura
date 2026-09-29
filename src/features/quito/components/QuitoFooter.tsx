import Image from 'next/image';
import Link from 'next/link';
import { SOCIAL_MARKS, type SocialNetwork } from '@/components/ui/social-marks';
import { QUITO } from '@/config/quito';
import { FOOTER, SITE } from '@/config/site';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import { QuitoJoinCta } from './QuitoJoinCta';
import { Reveal } from './Reveal';
import styles from './QuitoChrome.module.css';
import closing from './QuitoClosing.module.css';

type Props = {
  locale: Locale;
  copy: Dictionary['quito'];
};

/**
 * Pie de la sección de Quito.
 *
 * Es más largo que el del sitio y lleva otro orden: la ballena y la despedida,
 * la foto de sala a sangre, la llamada a los socios y solo entonces los
 * logotipos y la banda legal. Va aquí entero —y no repartido entre la página y
 * el pie— para que las rutas de dentro acaben igual que la portada.
 *
 * Es **de servidor**: son imágenes y enlaces. Lo único que necesita cliente son
 * las entradas por scroll, y eso lo aporta `Reveal` envolviendo cada bloque.
 */
export function QuitoFooter({ locale, copy }: Props) {
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

      <Reveal>
        <div className={styles.partnersBlock}>
          <h2 className={styles.partnersTitle}>
            <span className={styles.partnersLine}>{t.partnersTitleLine1}</span>
            {/**
             * El glifo cae **entre** las dos palabras de la segunda línea, que es
             * donde lo pide el diseño, así que la línea se compone a mano en vez
             * de dejar que el texto reflote.
             */}
            <span className={styles.partnersLine}>
              {t.partnersTitleLine2a}
              <Image
                src={QUITO.footer.divider.src}
                alt=""
                width={QUITO.footer.divider.width}
                height={QUITO.footer.divider.height}
                className={styles.partnersDivider}
                aria-hidden
              />
              {t.partnersTitleLine2b}
            </span>
          </h2>

        </div>
      </Reveal>

      {/**
       * El muro de socios: la red de la convocatoria y, en la última fila,
       * quien lidera y quien financia. **Sin rótulos de grupo**, que es como lo
       * pide el diseño: se lee como un conjunto.
       */}
      <Reveal>
        <div className={styles.network}>
          {QUITO.partnerRows.map((row, index) => (
            <ul key={index} className={styles.networkRow}>
              {row.map((logo) => (
                <li key={logo.alt}>
                  {/**
                   * Donde hay versión oficial para fondo oscuro se montan las
                   * **dos** y el CSS esconde la que no toca. Elegir en
                   * JavaScript enseñaría un cuadro con la equivocada: la paleta
                   * se decide en el propio HTML, antes de hidratar.
                   */}
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    className={styles.networkLogo}
                    /**
                     * `light` solo cuando hay pareja que la sustituya en las
                     * paletas oscuras. Sin pareja va como `both` —se ve
                     * siempre— y se blanquea con el filtro: marcándola `light`
                     * se escondía en oscuro y no quedaba nada que pintar.
                     */
                    data-on={'onDark' in logo ? 'light' : 'both'}
                    data-filtered={'onDark' in logo ? undefined : true}
                  />
                  {'onDark' in logo && (
                    <Image
                      src={logo.onDark}
                      alt=""
                      width={logo.width}
                      height={logo.height}
                      className={styles.networkLogo}
                      data-on="dark"
                      aria-hidden
                    />
                  )}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </Reveal>

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
