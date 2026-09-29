import Image from 'next/image';
import { QUITO } from '@/config/quito';
import type { Dictionary } from '@/i18n';
import { Reveal } from './Reveal';
import styles from './QuitoChrome.module.css';

export function QuitoHosts({ copy }: { copy: Dictionary['quito']['footer'] }) {
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
               * El grupo de anfitrionas no repite rótulo: lo nombra el titular
               * de la sección, que está justo encima.
               */}
              {group.key !== 'hosts' && (
                <h3 className={styles.networkGroupTitle}>
                  {copy.partnerGroups[group.key as keyof typeof copy.partnerGroups]}
                </h3>
              )}
              <ul className={styles.networkRow} data-group={group.key}>
              {group.logos.map((logo) => (
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
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
