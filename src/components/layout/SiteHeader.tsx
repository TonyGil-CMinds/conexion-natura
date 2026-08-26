import Image from 'next/image';
import Link from 'next/link';
import { SITE } from '@/config/site';
import { LocaleSwitch } from './LocaleSwitch';
import { PrimaryNav } from './PrimaryNav';
import { ThemeToggle } from './ThemeToggle';
import styles from './SiteHeader.module.css';

/**
 * Cabecera dividida en tres celdas por las líneas de la retícula: logo, enlaces
 * centrados y controles. Las celdas laterales tienen ancho fijo para que los
 * enlaces queden centrados respecto al viewport, no respecto al espacio sobrante.
 *
 * El logotipo de la cabecera es la marca corta (500): el rótulo completo vive en
 * el hero, a tamaño de titular.
 */
export function SiteHeader() {
  return (
    <header className={styles.root}>
      <div className={styles.logoCell}>
        <Link href="/" aria-label={`${SITE.name} — inicio`} className={styles.logo}>
          <Image src="/brand/logo-500.svg" alt={SITE.name} width={69} height={25} priority />
        </Link>
      </div>

      <div className={styles.navCell}>
        <PrimaryNav />
      </div>

      <div className={styles.controlsCell}>
        <ThemeToggle />
        <LocaleSwitch />
      </div>
    </header>
  );
}
