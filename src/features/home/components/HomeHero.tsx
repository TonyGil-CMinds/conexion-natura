'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useHasEntered } from '@/features/loader';
import { SITE } from '@/config/site';
import type { Dictionary, Locale } from '@/i18n';
import { gsap } from '@/lib/gsap';
import { HOME } from '../config/home';
import { GalleryCta } from './GalleryCta';
import { PixelChain } from './PixelChain';
import styles from './HomeHero.module.css';

type Props = {
  locale: Locale;
  copy: Dictionary['home']['hero'];
};

/**
 * Hero de la portada desde que el acto pasó: el rótulo con el año, la tortuga
 * y la llamada a la galería, sobre la paleta de Quito.
 *
 * Todo se mide **desde el rótulo** (`--wordmark-width` en el CSS): el año, la
 * tortuga y la llamada guardan con él las proporciones del diseño, y el rótulo
 * se acota por ancho y por alto para que el hero quepa en una pantalla.
 *
 * La banda de píxeles va dos veces —33 columnas a sangre en escritorio, 17
 * detrás de la tortuga en móvil— porque en cada uno cuelga de un sitio distinto.
 */
export function HomeHero({ locale, copy }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const hasEntered = useHasEntered();
  const year = String(SITE.event.date.year);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const characters = root.querySelectorAll('[data-note-character]');
      const turtle = root.querySelector('[data-hero-turtle]');
      if (!hasEntered) {
        gsap.set(characters, { yPercent: 120 });
        gsap.set(turtle, { opacity: 0, y: 50 });
        return;
      }
      /**
       * La misma entrada que el rótulo de Quito: cada letra asoma desde debajo
       * de su caja, que la recorta, en orden de lectura. La tortuga sube con un
       * poco de retraso, como el ave de allí.
       */
      gsap.fromTo(
        characters,
        { yPercent: 120 },
        {
          yPercent: 0,
          duration: 0.55,
          ease: 'expo.out',
          stagger: { each: 0.022, from: 'start' },
        },
      );
      gsap.fromTo(turtle, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.2,
      });
    }, root);
    return () => media.revert();
  }, [hasEntered]);

  return (
    <section ref={rootRef} className={styles.root} data-quito-hero>
      <PixelChain columns={33} className={styles.pixelsWide} />

      <div className={styles.inner}>
        <h1 className={styles.lockup}>
          <span className={styles.srOnly}>{`${copy.wordmarkAlt} ${year}`}</span>
          <span className={styles.wordmark} aria-hidden />
          <span className={styles.year} aria-hidden>
            {year.slice(0, 2)}
            <br />
            {year.slice(2)}
          </span>
        </h1>

        <div className={styles.turtle} aria-hidden>
          <PixelChain columns={17} className={styles.pixelsNarrow} />
          <div className={styles.turtleImage} data-hero-turtle>
            <Image
              src={HOME.hero.turtle.src}
              alt=""
              width={HOME.hero.turtle.width}
              height={HOME.hero.turtle.height}
              // Las mismas consultas que pasan el hero a columna (ver el CSS).
              sizes="(max-width: 640px) 116vw, (max-aspect-ratio: 4/5) 116vw, 62vw"
              priority
            />
          </div>
        </div>

        <div className={styles.action}>
          <p className={styles.note}>
            <span className={styles.srOnly}>{copy.note.join(' ')}</span>
            <span aria-hidden>
              {/**
               * Dos capas por letra, como en Quito: la de fuera recorta y la de
               * dentro se mueve, así que la letra puede empezar **fuera** de su
               * caja en vez de transparente.
               */}
              {copy.note.map((line, lineIndex) => (
                <span key={lineIndex} className={styles.line}>
                  {Array.from(line).map((character, index) => (
                    <span key={index} className={styles.character}>
                      <span className={styles.characterInner} data-note-character>
                        {character === ' ' ? ' ' : character}
                      </span>
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </p>
          <GalleryCta locale={locale} label={copy.cta} className={styles.cta} />
        </div>
      </div>
    </section>
  );
}
