import Image from 'next/image';
import { QUITO } from '@/config/quito';
import type { Dictionary, Locale } from '@/i18n';
import type { CSSProperties } from 'react';
import { Reveal } from './Reveal';
import styles from './QuitoChrome.module.css';

/**
 * La excepción de tamaño de un logotipo, si la tiene, como variable CSS.
 */
function escala(logo: Logo): CSSProperties | undefined {
  return logo.scale === undefined ? undefined : ({ '--logo-scale': logo.scale } as CSSProperties);
}

/**
 * El logotipo que toca para este idioma.
 *
 * Casi todos son uno solo; el del banco tiene marca propia en cada idioma y
 * llega como mapa. Se resuelve aquí, antes de pintar, para que el resto del
 * componente no tenga que saber que existe la excepción.
 */
type Logo = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** La versión oficial para paletas oscuras, donde la hay. */
  onDark?: string;
  /** Su apartado de la medida común del grupo, donde lo hay. */
  scale?: number;
};

function delIdioma(entrada: Logo | { byLocale: Record<Locale, Logo> }, locale: Locale): Logo {
  return 'byLocale' in entrada ? entrada.byLocale[locale] : entrada;
}

export function QuitoHosts({ copy, locale }: { copy: Dictionary['quito']['footer']; locale: Locale }) {
  return (
    <section className={styles.hosts} aria-labelledby="quito-hosts-title">
      <div className={styles.partnersBlock}>
        <h2 id="quito-hosts-title" className={styles.hostsTitle}>{copy.hostsTitle}</h2>
      </div>
      <Reveal>
        <div className={styles.network}>
          {QUITO.partnerGroups.map((group) => (
            <div key={group.key} className={styles.networkGroup}>
              {/**
               * Los tres grupos llevan rótulo, también el de anfitrionas. Antes
               * se lo ahorraba porque lo nombraba el titular de la sección, pero
               * sin él los otros dos parecían apartados de una lista cuya
               * primera parte no se llamaba de ninguna manera.
               */}
              <h3 className={styles.networkGroupTitle}>
                {copy.partnerGroups[group.key as keyof typeof copy.partnerGroups]}
              </h3>
              <ul className={styles.networkRow} data-group={group.key}>
              {group.logos.map((entrada) => {
                const logo = delIdioma(entrada, locale);
                return (
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
                     * `scale` aparta a un logotipo de la medida común de su
                     * grupo. Va como variable y no como alto fijo para que siga
                     * obedeciendo los escalones por ancho de pantalla.
                     */
                    style={escala(logo)}
                    /**
                     * `light` solo cuando hay pareja que la sustituya en las
                     * paletas oscuras. Sin pareja va como `both` —se ve
                     * siempre— y se blanquea con el filtro: marcándola `light`
                     * se escondía en oscuro y no quedaba nada que pintar.
                     */
                    data-on={logo.onDark ? 'light' : 'both'}
                    data-filtered={logo.onDark ? undefined : true}
                  />
                  {logo.onDark && (
                    <Image
                      src={logo.onDark}
                      alt=""
                      width={logo.width}
                      height={logo.height}
                      className={styles.networkLogo}
                      /* La misma escala: si no, las dos versiones miden distinto. */
                      style={escala(logo)}
                      data-on="dark"
                      aria-hidden
                    />
                  )}
                </li>
                );
              })}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
