'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LocaleSwitch } from '@/components/layout/LocaleSwitch';
import { PageShell } from '@/components/layout/PageShell';
import { PrimaryNav, type NavItem } from '@/components/layout/PrimaryNav';
import { QUITO } from '@/config/quito';
import { SITE } from '@/config/site';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import styles from './QuitoChrome.module.css';

type Props = {
  locale: Locale;
  header: Dictionary['header'];
  /** Los enlaces ya resueltos: con idioma, rótulo y cuál es el actual. */
  items: NavItem[];
  /** Nombre accesible de la navegación. */
  ariaLabel: string;
  /** Adónde lleva el glifo, sin prefijo de idioma. */
  homeHref: string;
  mobileMenu: React.ReactNode;
  /** Con hero debajo, la barra arranca transparente; sin él, opaca. */
  hasHero?: boolean;
};

/**
 * La barra con la piel de Quito: glifo, enlaces con el zigzag e idioma.
 *
 * Es **presentacional**: no sabe qué enlaces lleva ni cuál es el actual. Lo
 * decide quien la usa —`QuitoHeader` en la sección, la portada del sitio con
 * los suyos—, y así las dos barras son la misma pieza y no dos copias.
 *
 * **No lleva el cambio de tema.** La piel fija los colores con su paleta, así
 * que el botón ofrecería algo que no se puede dar.
 *
 * Dos estados: sobre el hero **transparente** con la tinta de la paleta, y
 * pasado el hero **opaca**. El cambio se lee con la posición del hero en el
 * scroll y no con un `IntersectionObserver`: no es una pregunta de visibilidad
 * sino de posición, y aterrizar con el canto del hero justo bajo la barra cae
 * encima del umbral del observador, que entonces no dispara.
 */
export function QuitoBar({ locale, header, items, ariaLabel, homeHref, mobileMenu, hasHero = false }: Props) {
  const barRef = useRef<HTMLDivElement>(null);
  const [isSolid, setIsSolid] = useState(!hasHero);

  useEffect(() => {
    if (!hasHero) {
      setIsSolid(true);
      return;
    }
    const bar = barRef.current;
    const hero = document.querySelector('[data-quito-hero]');
    if (!bar || !hero) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      setIsSolid(hero.getBoundingClientRect().bottom <= bar.getBoundingClientRect().height);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [hasHero]);

  return (
    <div ref={barRef} className={styles.bar} data-solid={isSolid || undefined} data-site-header>
      <PageShell>
        <div className={styles.barInner}>
          <Link
            href={localePath(locale, homeHref)}
            aria-label={`${SITE.name} — ${header.home}`}
            className={styles.logo}
          >
            <Image
              src={QUITO.brand.src}
              alt={SITE.name}
              width={QUITO.brand.width}
              height={QUITO.brand.height}
              className={styles.logoMark}
              priority
            />
          </Link>

          <div className={styles.barNav}>
            <PrimaryNav items={items} ariaLabel={ariaLabel} />
          </div>

          <div className={styles.barControls}>
            <div className={styles.desktopLocale}><LocaleSwitch locale={locale} label={header.language} /></div>
            {mobileMenu}
          </div>
        </div>
      </PageShell>
    </div>
  );
}
