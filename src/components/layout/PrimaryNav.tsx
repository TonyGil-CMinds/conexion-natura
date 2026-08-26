'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/config/site';
import styles from './PrimaryNav.module.css';

/**
 * Navegación principal con indicador de zigzag.
 *
 * El estado seleccionado sale de la ruta, no de un clic: así el indicador acierta
 * también al entrar directo a una URL o al volver con el botón atrás.
 *
 * Solo los enlaces a rutas pueden estar seleccionados. Los que apuntan a secciones
 * de la portada (`/#agenda`) llevan ancla, y una ancla no es un destino que la
 * navegación pueda marcar como actual.
 */
export function PrimaryNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.root} aria-label="Navegación principal">
      <ul className={styles.list}>
        {NAV_LINKS.map((link) => {
          const isRoute = !link.href.includes('#');
          const isSelected = isRoute && pathname === link.href;

          return (
            <li key={link.href}>
              <Link
                className={styles.link}
                href={link.href}
                data-selected={isSelected || undefined}
                data-highlight={'highlight' in link && link.highlight ? '' : undefined}
                aria-current={isSelected ? 'page' : undefined}
              >
                {link.label}
                <span className={styles.indicator} aria-hidden />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
