import { getDictionary, localePath, type Dictionary, type Locale } from '@/i18n';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { QUITO } from '@/config/quito';
import { QuitoExperience } from './QuitoExperience';
import { QuitoFooter } from './QuitoFooter';
import { QuitoHeader } from './QuitoHeader';
import styles from './QuitoChrome.module.css';

type Props = {
  locale: Locale;
  copy: Dictionary['quito'];
  header: Dictionary['header'];
  /** La portada trae hero; las rutas de dentro, no. Lo necesita la barra. */
  hasHero?: boolean;
  /**
   * Si esta ruta **lleva el registro debajo**. Solo la portada: allí el botón se
   * convierte en el campo del correo y, al entrar uno, la página da paso al
   * formulario. En las rutas de dentro «Regístrate» vuelve a ser un enlace a la
   * portada, que es donde está la puerta.
   */
  hasJoin?: boolean;
  children: React.ReactNode;
};

/**
 * Piel común de la sección `/quito`: barra arriba, pie abajo y el tema claro
 * fijado para todo lo de en medio.
 *
 * El tema se fija con `data-quito` y no escribiendo `data-theme` en `<html>`:
 * eso habría que hacerlo en un efecto, después del primer pintado, y la página
 * se vería un cuadro en oscuro antes de corregirse. El atributo redefine los
 * mismos roles de color (tokens.css), así que nada de dentro se entera de que
 * está en una sección con tema propio.
 *
 * Es **de servidor**: solo compone. Lo que necesita cliente —la barra, las
 * entradas, la cortina— lo pide cada pieza por su cuenta.
 */
export function QuitoChrome({
  locale,
  copy,
  header,
  hasHero = false,
  hasJoin = false,
  children,
}: Props) {
  const t = getDictionary(locale);
  /**
   * La barra es la misma en las dos caras, así que se compone una vez. Lleva
   * clave porque se pinta junto a otro nodo dinámico —la cara que toque— y React
   * lee esa pareja como una lista.
   */
  const barra = (
      <QuitoHeader
        key="barra"
        locale={locale}
        copy={copy.nav}
        header={header}
        hasHero={hasHero}
        mobileMenu={
          <MobileMenu
            locale={locale}
            labels={{ ...t.nav, ariaLabel: copy.nav.label }}
            header={header}
            light
            homeHref={QUITO.root}
            registrationHref={QUITO.root + '?' + QUITO.joinParam + '=1'}
            items={QUITO.nav.map((item) => ({
              key: item.key,
              href: localePath(locale, item.href),
              label: copy.nav[item.key],
            }))}
            cta={{
              label: copy.hero.ctaLabel,
              confirmedLabel: t.registration.confirmedCta,
              waitlistLabel: t.registration.waitlistCta,
              note: copy.hero.ctaNote,
            }}
          />
        }
      />
  );

  return (
    <div className={styles.root} data-quito>
      {hasJoin ? (
        <QuitoExperience
          locale={locale}
          copy={copy}
          registration={t.registration}
          header={barra}
        >
          {/**
           * Los dos van dentro de un solo nodo y no sueltos: como hermanos
           * llegan al proveedor en una lista, y React pide clave para cada
           * elemento de una lista que recibe por `children`.
           */}
          <>
            <main>{children}</main>
            <QuitoFooter locale={locale} copy={copy} />
          </>
        </QuitoExperience>
      ) : (
        <>
          {barra}
          <main>{children}</main>
          <QuitoFooter locale={locale} copy={copy} />
        </>
      )}
    </div>
  );
}
