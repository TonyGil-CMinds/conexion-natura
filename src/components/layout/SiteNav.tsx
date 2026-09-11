'use client';

import { usePathname } from 'next/navigation';
import { useAttendance } from '@/features/registration';
import { NAV_LINKS } from '@/config/site';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import { PrimaryNav, type NavItem } from './PrimaryNav';

type Props = {
  locale: Locale;
  labels: Dictionary['nav'];
};

/**
 * Los enlaces de la cabecera del sitio, resueltos para `PrimaryNav`.
 *
 * El estado seleccionado sale de la ruta, no de un clic: así el indicador acierta
 * también al entrar directo a una URL o al volver con el botón atrás. Se compara
 * contra la ruta con prefijo de idioma, que es la que devuelve `usePathname`.
 *
 * El enlace de registro cambia de rótulo cuando ya hay asistencia confirmada:
 * pasa a mostrar el nombre, y sigue llevando al perfil para poder editarlo.
 *
 * Solo los enlaces a rutas pueden estar seleccionados. Los que apuntan a secciones
 * de la portada (`/#agenda`) llevan ancla, y una ancla de **otra** página no es un
 * destino que esta navegación pueda marcar como actual.
 */
export function SiteNav({ locale, labels }: Props) {
  const pathname = usePathname();
  const { attendee } = useAttendance();

  const items: NavItem[] = NAV_LINKS.map((link) => {
    const href = localePath(locale, link.href);
    const isRoute = !link.href.includes('#');

    return {
      key: link.href,
      href,
      // El nombre sin apellido: la celda del menú no da para los dos.
      label: link.key === 'register' && attendee ? attendee.name : labels[link.key],
      selected: isRoute && pathname === href,
      highlight: 'highlight' in link && link.highlight ? true : undefined,
    };
  });

  return <PrimaryNav items={items} ariaLabel={labels.ariaLabel} />;
}
