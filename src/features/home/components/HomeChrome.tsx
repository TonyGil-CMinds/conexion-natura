import { MobileMenu } from '@/components/layout/MobileMenu';
import type { NavItem } from '@/components/layout/PrimaryNav';
import { QuitoBar } from '@/features/quito';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import { HOME } from '../config/home';
import { GalleryCta } from './GalleryCta';
import styles from './HomeChrome.module.css';

type Props = {
  locale: Locale;
  copy: Dictionary['home'];
  /** Del menú del sitio solo se usan sus rótulos de apoyo. */
  nav: Dictionary['nav'];
  header: Dictionary['header'];
  children: React.ReactNode;
};

/**
 * La piel de la portada: la de `/quito`, con su paleta y su barra.
 *
 * `data-quito` es lo que trae la paleta —azul, rosa o blanca, una por visita—
 * y fija los colores, como en la sección. Por eso no hay cambio de tema y la
 * cabecera del sitio se retira (`HeaderGate`).
 *
 * No usa `PageFrame`: la portada es una pantalla, sin filetes que alinear ni
 * pie. Y conserva el ancho máximo del sitio, no el de la sección.
 *
 * Es **de servidor**: los enlaces se resuelven aquí, porque ninguno puede ser
 * el actual —uno es un ancla, dos son rutas de otra sección y la galería aún
 * no tiene destino—.
 */
export function HomeChrome({ locale, copy, nav, header, children }: Props) {
  const items: NavItem[] = HOME.nav.map((link) => ({
    key: link.key,
    href: link.href ? localePath(locale, link.href) : '',
    label: copy.nav[link.key],
    highlight: 'highlight' in link ? link.highlight : undefined,
  }));

  return (
    <div className={styles.root} data-quito>
      <QuitoBar
        locale={locale}
        header={header}
        items={items}
        ariaLabel={copy.nav.label}
        homeHref="/"
        hasHero
        mobileMenu={
          /**
           * Con clave, como la barra en `QuitoChrome`: llega de un componente de
           * servidor y la barra lo pinta junto a otro nodo, y React lee esa
           * pareja como una lista.
           */
          <MobileMenu
            key="menu"
            locale={locale}
            labels={{ ...nav, ariaLabel: copy.nav.label }}
            header={header}
            light
            // La galería no va en la lista: es la llamada de abajo.
            items={items.filter((item) => !item.highlight)}
            action={<GalleryCta locale={locale} label={copy.hero.cta} block />}
          />
        }
      />
      <main>{children}</main>
    </div>
  );
}
