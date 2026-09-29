'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import styles from './PixelMarquee.module.css';

type Props = {
  /** Los cuadros que desfilan, en el orden del diseño. */
  tiles: readonly string[];
  /** El rótulo que va entre los cuadros y su repetición. */
  text: string;
  pauseLabel: string;
  playLabel: string;
  /** Un cuadro más al final de cada grupo, para que la costura no se note. */
  tailTile?: string;
};

/**
 * Cinta que desfila y acelera con el scroll.
 *
 * Vive en `components/ui` y no dentro de una feature porque la usan dos: el
 * retiro y la sección de Quito. Lo que cambia entre las dos son los cuadros y el
 * rótulo, así que entran por props y aquí no se nombra ningún asset.
 *
 * Se mueve con **GSAP** —es interpolación numérica continua— y se lee la
 * velocidad real del scroll en vez de un evento de rueda: así también acelera
 * con el teclado y con el dedo. El suavizado exponencial mantiene la aceleración
 * independiente de los cuadros por segundo.
 *
 * Fuera de pantalla o con la pestaña oculta no se mueve nada: es una decoración,
 * no puede estar gastando cuadros donde nadie la ve.
 */
export function PixelMarquee({ tiles, text, pauseLabel, playLabel, tailTile }: Props) {
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
      const resize = new ResizeObserver(() => {
        width = group.getBoundingClientRect().width;
      });
      resize.observe(group);
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
      });
      observer.observe(root);

      const tick = (_time: number, delta: number) => {
        const seconds = Math.min(delta / 1000, 0.064);
        const scroll = window.scrollY;
        const velocity = Math.abs(scroll - previousScroll) / Math.max(seconds, 0.001);
        previousScroll = scroll;
        if (!visible || document.hidden || !width) return;
        const target = 32 + Math.min(velocity * 0.22, 650);
        speed += (target - speed) * (1 - Math.exp(-seconds * 5));
        x = (((x - speed * seconds) % width) + width) % width - width;
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
        {/* Dos copias: cuando la primera se va del todo, la segunda ya ocupa su
            sitio y el salto de vuelta no se ve. */}
        {[0, 1].map((copy) => (
          <div key={copy} className={styles.group} aria-hidden={copy === 1 ? true : undefined}>
            {tiles.map((tile) => (
              <Image key={tile} src={tile} alt="" width={167} height={167} className={styles.asset} />
            ))}
            <span className={styles.text}>{text}</span>
            {tailTile && (
              <Image src={tailTile} alt="" width={167} height={167} className={styles.asset} />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        className={styles.pause}
        onClick={() => setPaused(!paused)}
        aria-label={paused ? playLabel : pauseLabel}
      >
        <span aria-hidden="true">{paused ? '▶' : 'Ⅱ'}</span>
      </button>
    </div>
  );
}
