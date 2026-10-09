'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './AgendaApp.module.css';

/** Decorative motion follows the live elements' mount/unmount lifecycle. */
export function AgendaLiveBorder() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(ref.current, { '--live-angle': '360deg', duration: 6, repeat: -1, ease: 'none' });
    });
    return () => media.revert();
  }, []);

  return <span ref={ref} className={styles.liveBorder} aria-hidden="true" />;
}

export function AgendaLiveBadge({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(ref.current, { backgroundPosition: '100% 50%', duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.fromTo(ref.current!.querySelectorAll('[data-live-wave]'),
        { scale: 0.65, opacity: 0.7 },
        { scale: 1.15, opacity: 0, duration: 2, stagger: 0.5, repeat: -1, ease: 'power1.out' });
    });
    return () => media.revert();
  }, []);

  return <b ref={ref} className={styles.liveChip}>
    <span className={styles.liveSignal} aria-hidden="true">
      <i /><i data-live-wave /><i data-live-wave />
    </span>
    {children}
  </b>;
}
