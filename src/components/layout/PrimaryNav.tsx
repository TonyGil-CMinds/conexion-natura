'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAttendance } from '@/features/registration';
import { NAV_LINKS } from '@/config/site';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import styles from './PrimaryNav.module.css';

type Props = {
  locale: Locale;
  labels: Dictionary['nav'];
};

/**
 * Navegación principal con indicador de zigzag.
 *
 * El estado seleccionado sale de la ruta, no de un clic: así el indicador acierta
 * también al entrar directo a una URL o al volver con el botón atrás. Se compara
 * contra la ruta con prefijo de idioma, que es la que devuelve `usePathname`.
 *
 * El enlace de registro cambia de rótulo cuando ya hay asistencia confirmada:
 * pasa a mostrar el nombre, y sigue llevando al perfil para poder editarlo.
 *
 * Solo los enlaces a rutas pueden estar seleccionados. Los que apuntan a secciones
 * de la portada (`/#agenda`) llevan ancla, y una ancla no es un destino que la
 * navegación pueda marcar como actual.
 */
export function PrimaryNav({ locale, labels }: Props) {
  const pathname = usePathname();
  const { attendee } = useAttendance();

  return (
    <nav className={styles.root} aria-label={labels.ariaLabel}>
      <ul className={styles.list}>
        {NAV_LINKS.map((link) => {
          const href = localePath(locale, link.href);
          const isRoute = !link.href.includes('#');
          const isSelected = isRoute && pathname === href;
          // El nombre sin apellido: la celda del menú no da para los dos.
          const label = link.key === 'register' && attendee ? attendee.name : labels[link.key];

          return (
            <li key={link.href}>
              <Link
                className={styles.link}
                href={href}
                data-selected={isSelected || undefined}
                data-highlight={'highlight' in link && link.highlight ? '' : undefined}
                aria-current={isSelected ? 'page' : undefined}
              >
                {label}
                <span className={styles.indicator} aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
