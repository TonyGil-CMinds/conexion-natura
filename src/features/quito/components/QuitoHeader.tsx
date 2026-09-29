'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LocaleSwitch } from '@/components/layout/LocaleSwitch';
import { PageShell } from '@/components/layout/PageShell';
import { PrimaryNav, type NavItem } from '@/components/layout/PrimaryNav';
import { QUITO } from '@/config/quito';
import { SITE } from '@/config/site';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import { useQuitoJoin } from './QuitoExperience';
import styles from './QuitoChrome.module.css';

type Props = {
  locale: Locale;
  mobileMenu: React.ReactNode;
  copy: Dictionary['quito']['nav'];
  header: Dictionary['header'];
  /** La portada trae hero; las rutas de dentro no, y allí la barra va opaca. */
  hasHero?: boolean;
};

/**
 * Barra de la sección de Quito.
 *
 * Es la del sitio en funciones —enlaces con el indicador de zigzag e idioma—
 * pero con la navegación de esta sección y su propio glifo. La cabecera global
 * se retira aquí (`HeaderGate`): dos barras serían dos navegaciones compitiendo.
 *
 * **No lleva el cambio de tema.** La sección va siempre en claro, así que el
 * botón ofrecería algo que no se puede dar.
 *
 * Dos estados, como la del retiro: sobre el hero **transparente** con la tinta
 * clara fijada —debajo hay un cielo oscuro—, y pasado el hero **opaca** con la
 * tinta de la página. El cambio se lee con la posición del hero en el scroll y
 * no con un `IntersectionObserver`: no es una pregunta de visibilidad sino de
 * posición, y aterrizar con el canto del hero justo bajo la barra cae encima del
 * umbral del observador, que entonces no dispara.
 */
export function QuitoHeader({ locale, copy, header, mobileMenu, hasHero = false }: Props) {
  const pathname = usePathname();
  /** `null` en las rutas de dentro: allí no hay registro debajo que abrir. */
  const join = useQuitoJoin();
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

  const items: NavItem[] = QUITO.nav.map((link) => {
    /**
     * «Regístrate» **no es un destino cuando el registro está debajo**: en la
     * portada abre el campo del correo del hero, que es la puerta de esta
     * sección. Sale entonces como botón y no como enlace, porque desplegar un
     * campo no es navegar y anunciarlo como enlace mentiría.
     *
     * En las rutas de dentro no hay campo que abrir, así que vuelve a ser un
     * enlace a la portada.
     */
    const abre = link.key === 'register' && join !== null;

    return {
      key: link.key,
      href: localePath(locale, link.href),
      label: copy[link.key as keyof typeof copy],
      highlight: 'highlight' in link ? link.highlight : undefined,
      onSelect: abre ? join.open : undefined,
      /**
       * Lo actual es la ruta, y solo la ruta: «acerca de» es un ancla dentro de
       * la portada, y una ancla no es un destino que se pueda marcar. Estando ya
       * en el registro sí se marca: es donde se está.
       */
      selected: abre
        ? join.isRegistering
        : !('anchor' in link) && pathname === localePath(locale, link.href),
    };
  });

  return (
    <div ref={barRef} className={styles.bar} data-solid={isSolid || undefined} data-site-header>
      <PageShell>
        <div className={styles.barInner}>
          {/* Sigue llevando a la portada de la sección, no a la del sitio: es
              donde está el resto de esta pieza. */}
          <Link
            href={localePath(locale, QUITO.root)}
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
            <PrimaryNav items={items} ariaLabel={copy.label} />
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
