'use client';

import { usePathname } from 'next/navigation';
import type { NavItem } from '@/components/layout/PrimaryNav';
import { QUITO } from '@/config/quito';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import { QuitoBar } from './QuitoBar';
import { useQuitoJoin } from './QuitoExperience';

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
 * Lo único suyo es **qué enlaces lleva y cuál es el actual**; el resto lo pinta
 * `QuitoBar`, que es la misma pieza que lleva la portada del sitio.
 */
export function QuitoHeader({ locale, copy, header, mobileMenu, hasHero = false }: Props) {
  const pathname = usePathname();
  /** `null` en las rutas de dentro: allí no hay registro debajo que abrir. */
  const join = useQuitoJoin();

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
    <QuitoBar
      locale={locale}
      header={header}
      items={items}
      ariaLabel={copy.label}
      // Sigue llevando a la portada de la sección, no a la del sitio: es donde
      // está el resto de esta pieza.
      homeHref={QUITO.root}
      mobileMenu={mobileMenu}
      hasHero={hasHero}
    />
  );
}
