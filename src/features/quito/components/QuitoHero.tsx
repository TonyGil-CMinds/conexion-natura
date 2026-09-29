'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

import { useHasEntered } from '@/features/loader';
import { QUITO } from '@/config/quito';
import type { Dictionary, Locale } from '@/i18n';
import { QuitoJoinCta } from './QuitoJoinCta';
import styles from './QuitoHero.module.css';

type Props = {
  locale: Locale;
  copy: Dictionary['quito']['hero'];
  /** Copia del botón que se convierte en campo: es la puerta al registro. */
  joinCopy: Dictionary['quito']['join'];
};

export function QuitoHero({ locale, copy, joinCopy }: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const hasEntered = useHasEntered();
  const { year, month, day } = QUITO.event.date;
  const date = new Date(Date.UTC(year, month, day));
  const monthLabel = new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' })
    .format(date).replace('.', '').toUpperCase();
  const dateLabel = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(date);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const characters = root.querySelectorAll('[data-claim-character]');
      const bird = root.querySelector('[data-hero-bird]');
      if (!hasEntered) {
        gsap.set(characters, { yPercent: 120 });
        return;
      }
      /**
       * Entrada del rótulo, letra a letra y **en orden de lectura**.
       *
       * Cada letra sube desde debajo de su propia caja, que la recorta: no
       * aparece, **asoma**. Por eso no lleva opacidad —el recorte ya hace la
       * revelación— y por eso el orden es de izquierda a derecha y no sorteado:
       * el sorteo se leía como ruido, y lo que se está leyendo es una frase.
       *
       * `expo.out` arranca de golpe y frena largo: es lo que da una entrada
       * rápida que aun así aterriza suave. El desfase es corto a propósito —la
       * frase entera cabe en menos de un segundo— para que no se convierta en
       * una espera antes de poder leer.
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
      gsap.fromTo(bird, { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: 0.2,
      });
    }, root);
    return () => media.revert();
  }, [hasEntered]);

  return (
    <section ref={rootRef} className={styles.root} data-quito-hero>
      <div className={styles.inner}>
        <div className={styles.lockup}>
          <h1 className={styles.wordmark} aria-label={copy.wordmarkAlt}>
            <span className={styles.wordmarkShape} aria-hidden />
          </h1>
          <p className={styles.claim} aria-label={copy.claimAlt}>
            <span aria-hidden>
              {/**
               * Dos capas por letra: la de fuera recorta y la de dentro se
               * mueve. Es el recorte el que revela, as\u00ed que la letra puede
               * empezar **fuera** de su caja en vez de transparente.
               */}
              {Array.from(copy.claimAlt.toUpperCase()).map((character, index) => (
                <span key={index} className={styles.character}>
                  <span className={styles.characterInner} data-claim-character>
                    {character === ' ' ? '\u00a0' : character}
                  </span>
                </span>
              ))}
            </span>
          </p>
        </div>

        <div className={styles.pixels} aria-hidden />
        <div className={styles.bird} data-hero-bird aria-hidden>
          <Image src={QUITO.hero.bird.src} alt="" width={QUITO.hero.bird.width}
            height={QUITO.hero.bird.height} sizes="(max-width: 640px) 90vw, 650px" priority />
        </div>

        <div className={styles.action}>
          <p className={styles.note}>{copy.ctaNote}</p>
          {/* El botón se convierte en el campo del correo: aquí no hay pantalla
            que lo pida, así que esta es la puerta al registro. */}
        <QuitoJoinCta copy={joinCopy} autoOpen />
        </div>
        <div className={styles.eventDetails}>
          <p className={styles.eventMeta}>
            <span>17:30</span><span aria-hidden> | </span><span>{QUITO.event.venue.name}</span>
          </p>
        <time className={styles.date} dateTime={date.toISOString().slice(0, 10)} aria-label={dateLabel}>
          <span aria-hidden>{String(day).padStart(2, '0')}<br />{monthLabel}</span>
          <span className={styles.dateDivider} aria-hidden />
          <span aria-hidden>{String(year).slice(0, 2)}<br />{String(year).slice(2)}</span>
        </time>
        </div>
      </div>
    </section>
  );
}
