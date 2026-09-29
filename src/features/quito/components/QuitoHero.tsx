'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';
import { createRandom } from '@/lib/random';
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
        gsap.set(characters, { opacity: 0, yPercent: 110 });
        return;
      }
      const random = createRandom(Number(document.documentElement.dataset.quitoSeed) || 5105);
      const order = Array.from({ length: characters.length }, (_, index) => index);
      for (let i = order.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
      gsap.fromTo(characters, { opacity: 0, yPercent: 110 }, {
        opacity: 1, yPercent: 0, duration: 0.7, ease: 'power3.out',
        stagger: (index: number) => order[index] * 0.035,
      });
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
              {Array.from(copy.claimAlt.toUpperCase()).map((character, index) => (
                <span key={index} className={styles.character} data-claim-character>
                  {character === ' ' ? '\u00a0' : character}
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
        <time className={styles.date} dateTime={date.toISOString().slice(0, 10)} aria-label={dateLabel}>
          <span aria-hidden>{String(day).padStart(2, '0')}<br />{monthLabel}</span>
          <span className={styles.dateDivider} aria-hidden />
          <span aria-hidden>{String(year).slice(0, 2)}<br />{String(year).slice(2)}</span>
        </time>
      </div>
    </section>
  );
}
