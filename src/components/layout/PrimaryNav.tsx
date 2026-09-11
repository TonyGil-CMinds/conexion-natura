'use client';

import Link from 'next/link';
import styles from './PrimaryNav.module.css';

/** Un enlace de la navegación, ya resuelto: aquí no se consulta ni ruta ni copia. */
export type NavItem = {
  key: string;
  /** Ruta con prefijo de idioma, o ancla (`#seccion`) de la propia página. */
  href: string;
  label: string;
  /** Lo actual: es lo que dibuja el zigzag. */
  selected?: boolean;
  /** La acción, no un destino más: va en el color de acento. */
  highlight?: boolean;
  /**
   * Si lo que hace no es ir a ningún sitio, sino algo en esta misma pantalla.
   * Con esto el elemento sale como `<button>` y no como enlace: abrir un
   * formulario no es navegar, y un enlace lo anunciaría como si lo fuera.
   */
  onSelect?: () => void;
};

type Props = {
  items: readonly NavItem[];
  ariaLabel: string;
  /**
   * En estrecho, en vez de esconderse deja los enlaces en una tira desplazable.
   * Lo usa la barra de una micropágina, donde los enlaces son anclas de la
   * propia página: no hay a dónde navegar, así que tampoco hay menú que abrir.
   */
  compact?: boolean;
};

/**
 * Navegación con indicador de zigzag. Es **presentacional**: recibe los enlaces
 * ya resueltos y no sabe de dónde salen, así que sirve igual a la cabecera del
 * sitio —donde lo actual es la ruta— y a la barra de una micropágina, donde lo
 * actual es la sección que se está leyendo. Quien decide eso es quien la usa
 * (`SiteNav`, `TanusasHeader`), y así el zigzag se implementa una sola vez.
 *
 * Las anclas van como `<a>` y no como `Link`: no hay cambio de ruta, y el salto
 * dentro de la página es cosa del navegador. Su estado actual es
 * `aria-current="location"` y no `"page"`: la página no ha cambiado.
 */
export function PrimaryNav({ items, ariaLabel, compact }: Props) {
  return (
    <nav className={styles.root} aria-label={ariaLabel} data-compact={compact || undefined}>
      <ul className={styles.list}>
        {items.map((item) => {
          const isAnchor = item.href.startsWith('#');
          /**
           * Lo actual de una ancla es `location` y no `page`: la página no ha
           * cambiado, solo el sitio de ella donde está el lector.
           */
          const current: 'location' | 'page' | undefined = item.selected
            ? isAnchor
              ? 'location'
              : 'page'
            : undefined;
          const attrs = {
            className: styles.link,
            'data-selected': item.selected || undefined,
            'data-highlight': item.highlight ? '' : undefined,
            'aria-current': current,
          };
          const content = (
            <>
              {item.label}
              <span className={styles.indicator} aria-hidden />
            </>
          );

          return (
            <li key={item.key}>
              {item.onSelect ? (
                <button type="button" onClick={item.onSelect} {...attrs}>
                  {content}
                </button>
              ) : isAnchor ? (
                <a href={item.href} {...attrs}>
                  {content}
                </a>
              ) : (
                <Link href={item.href} {...attrs}>
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
