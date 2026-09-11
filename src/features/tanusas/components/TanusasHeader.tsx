'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ThemedImage } from '@/components/ui/ThemedImage';
import { LocaleSwitch } from '@/components/layout/LocaleSwitch';
import { PageShell } from '@/components/layout/PageShell';
import { PrimaryNav, type NavItem } from '@/components/layout/PrimaryNav';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { SITE } from '@/config/site';
import { TANUSAS } from '@/config/tanusas';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import { useTanusasJoin } from './TanusasExperience';
import styles from './Tanusas.module.css';

type Props = {
  locale: Locale;
  copy: Dictionary['tanusas']['nav'];
  header: Dictionary['header'];
};

/**
 * Línea de lectura: la sección que cruza este punto de la pantalla es la que se
 * está leyendo. Va como una franja fina —el 1% a un tercio de la altura— y no
 * como una banda ancha: con una banda, dos secciones contiguas la cruzan a la
 * vez y se marcaba la de arriba cuando ya solo quedaba de ella el último
 * renglón.
 *
 * No depende del alto de la barra a propósito: lo que se está leyendo es lo que
 * ocupa la pantalla, no lo que asoma justo debajo de la barra.
 */
const READING_LINE = { top: '-33%', bottom: '-66%' };

/**
 * Barra de navegación de la micropágina.
 *
 * Es la del sitio en estilo y en funciones —logotipo, enlaces con el indicador de
 * zigzag, cambio de tema, cambio de idioma— pero **navega dentro de la página**:
 * sus enlaces son las anclas de las secciones, y lo actual no es la ruta sino la
 * sección que se está leyendo. Por eso la cabecera global se retira en esta ruta
 * (`HeaderGate`): dos barras serían dos navegaciones compitiendo.
 *
 * Tiene dos estados. Sobre el hero va **transparente**, con la tinta fijada en
 * clara en los dos temas porque debajo hay una fotografía oscura. Pasado el hero
 * se vuelve **opaca**, con el fondo y el filete de la página, y ahí la tinta
 * vuelve a ser la del tema: sobre el crema del tema claro, una tinta clara no se
 * vería.
 *
 * Las dos señales se leen por caminos distintos a propósito: la sección actual
 * con un `IntersectionObserver` —es una pregunta de visibilidad— y el paso a
 * opaca con la posición del hero en el scroll, que es lo que de verdad se está
 * preguntando. Y en el registro no hay hero: ahí va opaca sin más.
 */
export function TanusasHeader({ locale, copy, header }: Props) {
  const { open, isRegistering, exitTo } = useTanusasJoin();
  const barRef = useRef<HTMLDivElement>(null);
  const [barPx, setBarPx] = useState(0);
  const [current, setCurrent] = useState<string | null>(null);
  const [isSolid, setIsSolid] = useState(false);

  /**
   * Alto real de la barra. Se mide en vez de leer el token porque en estrecho la
   * barra pasa a dos filas, y de ese alto dependen los dos observadores.
   */
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const measure = () => setBarPx(bar.getBoundingClientRect().height);
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(bar);
    return () => resize.disconnect();
  }, []);

  useEffect(() => {
    if (!barPx) return;
    const observers: IntersectionObserver[] = [];

    const sections = TANUSAS.sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length) {
      /**
       * Hace falta llevar el conjunto a mano: el observador solo avisa de las
       * secciones que cambian, no de todas, así que de una entrada suelta no se
       * puede deducir cuál es la primera del documento.
       */
      const visible = new Set<string>();
      const spy = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.add(entry.target.id);
            else visible.delete(entry.target.id);
          }
          const first = TANUSAS.sections.find((section) => visible.has(section.id));
          setCurrent(first ? first.id : null);
        },
        { rootMargin: `${READING_LINE.top} 0px ${READING_LINE.bottom} 0px` },
      );
      sections.forEach((element) => spy.observe(element));
      observers.push(spy);
    }

    return () => observers.forEach((observer) => observer.disconnect());
  }, [barPx]);

  /**
   * Cuándo se vuelve opaca: cuando el hero ha pasado por completo bajo la barra.
   *
   * Esto va con el scroll y **no** con un `IntersectionObserver`, al revés que
   * la sección actual. Un observador solo avisa al cruzar un umbral, y el caso
   * que importa —aterrizar en un ancla, con el canto del hero justo en el canto
   * de la barra— cae exactamente encima de ese umbral: Chrome lo cuenta como
   * «intersecando», no hay cambio de estado, no dispara, y la barra se quedaba
   * transparente con la cola del hero por detrás. Esto no es una pregunta de
   * visibilidad sino de posición, y así se responde.
   *
   * El trabajo por evento es leer un rectángulo, y va limitado a uno por cuadro.
   */
  useEffect(() => {
    // En el registro no hay hero: la barra va opaca y no hay nada que seguir.
    if (!barPx || isRegistering) return;
    const hero = document.querySelector('[data-tanusas-hero]');
    if (!hero) return;

    let frame = 0;
    const read = () => {
      frame = 0;
      setIsSolid(hero.getBoundingClientRect().bottom <= barPx);
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
  }, [barPx, isRegistering]);

  const items: NavItem[] = [
    ...TANUSAS.sections.map((section) => ({
      key: section.id,
      href: `#${section.id}`,
      label: copy[section.key],
      selected: !isRegistering && current === section.id,
      /**
       * Durante el registro la invitación no está en el documento, así que un
       * ancla no lleva a ninguna parte: el enlace pasa a ser la acción de
       * volver a ella y, ya de vuelta, ir a su sección.
       */
      onSelect: isRegistering ? () => exitTo(section.id) : undefined,
    })),
    /**
     * La confirmación cierra la fila pero no es un destino: abre el campo del
     * correo en el hero. Va como acción —y por eso en el color de acento— y no
     * como ancla a una sección que ya no existe.
     */
    {
      key: 'confirmar',
      href: '#',
      label: copy.rsvp,
      highlight: true,
      // Estando ya en el registro es donde se está: se marca como lo actual.
      selected: isRegistering,
      onSelect: open,
    },
  ];

  return (
    <div ref={barRef} className={styles.bar} data-solid={isSolid || isRegistering || undefined}>
      <PageShell>
        <div className={styles.barInner}>
          <div className={styles.barLogo}>
            {/* Sigue llevando al sitio: la micropágina es parte de él. */}
            <Link
              href={localePath(locale, '/')}
              aria-label={`${SITE.name} — ${header.home}`}
              className={styles.logo}
            >
              {/* El de esta página es el lockup del retiro, no el del sitio. */}
              <ThemedImage
                dark={TANUSAS.media.logo.onDark}
                light={TANUSAS.media.logo.onLight}
                alt={SITE.name}
                width={TANUSAS.media.logo.width}
                height={TANUSAS.media.logo.height}
                priority
              />
            </Link>
          </div>

          <div className={styles.barNav}>
            <PrimaryNav items={items} ariaLabel={copy.label} compact />
          </div>

          <div className={styles.barControls}>
            <ThemeToggle toLight={header.themeToLight} toDark={header.themeToDark} />
            <LocaleSwitch locale={locale} label={header.language} />
          </div>
        </div>
      </PageShell>
    </div>
  );
}
