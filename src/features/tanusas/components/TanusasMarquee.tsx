'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import styles from './TanusasMarquee.module.css';

const colors = ['green', 'darkgreen', 'blue', 'yellow', 'pink'];

type Props = { text: string; pauseLabel: string; playLabel: string };

export function TanusasMarquee({ text, pauseLabel, playLabel }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track || paused) return;

    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const group = track.firstElementChild as HTMLElement;
      const setX = gsap.quickSetter(track, 'x', 'px');
      let width = group.getBoundingClientRect().width;
      let x = Number(gsap.getProperty(track, 'x')) || 0;
      let previousScroll = window.scrollY;
      let speed = 32;
      let visible = false;
      const resize = new ResizeObserver(() => { width = group.getBoundingClientRect().width; });
      resize.observe(group);
      const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
      observer.observe(root);

      // Sample actual scroll displacement, including keyboard and touch scroll.
      // Exponential smoothing keeps the acceleration independent of frame rate.
      const tick = (_time: number, delta: number) => {
        const seconds = Math.min(delta / 1000, 0.064);
        const scroll = window.scrollY;
        const velocity = Math.abs(scroll - previousScroll) / Math.max(seconds, 0.001);
        previousScroll = scroll;
        if (!visible || document.hidden || !width) return;
        const target = 32 + Math.min(velocity * 0.22, 650);
        speed += (target - speed) * (1 - Math.exp(-seconds * 5));
        x = ((x - speed * seconds) % width + width) % width - width;
        setX(x);
      };
      gsap.ticker.add(tick);
      return () => {
        gsap.ticker.remove(tick);
        resize.disconnect();
        observer.disconnect();
      };
    });
    return () => media.revert();
  }, [paused]);

  return (
    <div ref={rootRef} className={styles.marquee}>
      <div ref={trackRef} className={styles.track}>
        {[0, 1].map((copy) => (
          <div key={copy} className={styles.group} aria-hidden={copy === 1 ? true : undefined}>
            {colors.slice(0, 4).map((color) => (
              <Image key={color} src={`/tanusas/asset-square-${color}.svg`} alt="" width={167} height={167} className={styles.asset} />
            ))}
            <span className={styles.text}>{text}</span>
            <Image src="/tanusas/asset-square-pink.svg" alt="" width={167} height={167} className={styles.asset} />
          </div>
        ))}
      </div>
      <button type="button" className={styles.pause} onClick={() => setPaused(!paused)} aria-label={paused ? playLabel : pauseLabel}>
        <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
      </button>
    </div>
  );
}
