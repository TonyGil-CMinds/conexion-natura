import Link from 'next/link';
import { ThemedImage } from '@/components/ui/ThemedImage';
import { PageShell } from './PageShell';
import { SITE } from '@/config/site';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import { LocaleSwitch } from './LocaleSwitch';
import { SiteNav } from './SiteNav';
import { ThemeToggle } from './ThemeToggle';
import { MobileMenu } from './MobileMenu';
import styles from './SiteHeader.module.css';

type Props = {
  locale: Locale;
  nav: Dictionary['nav'];
  header: Dictionary['header'];
  cta: { label: string; confirmedLabel: string; note: string };
};

/**
 * Cabecera dividida en tres celdas por las líneas de la retícula: logo, enlaces
 * centrados y controles. Las celdas laterales tienen ancho fijo para que los
 * enlaces queden centrados respecto al viewport, no respecto al espacio sobrante.
 *
 * El logotipo de la cabecera es el lockup de Ceiba; el rótulo de la ciudad vive
 * en el hero, a tamaño de titular.
 *
 * Trae su propia banda a sangre con el filete inferior, porque ya no la envuelve
 * `PageFrame`: la cabecera se compone en el layout raíz.
 */
export function SiteHeader({ locale, nav, header, cta }: Props) {
  return (
    // `data-site-header` es el asidero del estilo en línea del layout, que la
    // esconde mientras el loader está en pantalla.
    <div className={styles.band} data-site-header>
      <PageShell>
        <header className={styles.root}>
          <div className={styles.logoCell}>
            <Link
              href={localePath(locale, '/')}
              aria-label={`${SITE.name} — ${header.home}`}
              className={styles.logo}
            >
              <ThemedImage
                dark="/brand/icon-dark-ceibaquito.svg"
                light="/brand/icon-light-ceibaquito.svg"
                alt={SITE.name}
                width={123}
                height={27}
                priority
              />
            </Link>
          </div>

          <div className={styles.navCell}>
            <SiteNav locale={locale} labels={nav} />
          </div>

          <div className={styles.controlsCell}>
            <ThemeToggle toLight={header.themeToLight} toDark={header.themeToDark} />
            <LocaleSwitch locale={locale} label={header.language} />
            <MobileMenu locale={locale} labels={nav} header={header} cta={cta} />
          </div>
        </header>
      </PageShell>
    </div>
  );
}
