import Image from 'next/image';
import Link from 'next/link';
import { NAV_LINKS, SITE } from '@/config/site';
import { LocaleSwitch } from './LocaleSwitch';
import { ThemeToggle } from './ThemeToggle';
import styles from './SiteHeader.module.css';

/**
 * Cabecera dividida en tres celdas por las líneas de la retícula: logo, enlaces
 * centrados y controles. Las celdas laterales tienen ancho fijo para que los
 * enlaces queden centrados respecto al viewport, no respecto al espacio sobrante.
 */
export function SiteHeader() {
  return (
    <header className={styles.root}>
      <div className={styles.logoCell}>
        <Link href="/" aria-label={`${SITE.name} — inicio`}>
          <Image
            src="/brand/logo-dark-green.svg"
            alt={SITE.name}
            width={122}
            height={42}
            priority
          />
        </Link>
      </div>

      <nav className={styles.navCell} aria-label="Navegación principal">
        <ul className={styles.navList}>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a className={styles.navLink} href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.controlsCell}>
        <ThemeToggle />
        <LocaleSwitch />
      </div>
    </header>
  );
}
