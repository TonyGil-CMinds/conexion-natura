'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './Slideshow.module.css';

/**
 * El visor de una foto a pantalla completa: se pasa con flechas, teclado,
 * deslizando o desde la tira de miniaturas, y entre una y otra hay un fundido.
 *
 * Empezó como «Morph Gallery» (21st.dev), con una disolución por ruido en WebGL.
 * Se quitó: el fundido es más sobrio y no exige texturas ni CORS.
 *
 * Solo se montan la foto actual y sus vecinas: así la siguiente ya está cargada
 * al pasar, y una galería de decenas de fotos no las baja todas de golpe.
 */

export type SlideItem = {
  /** La imagen que se ve: la foto, o la portada si es un vídeo. */
  src: string;
  /** Miniatura de la tira. */
  thumb?: string;
  /** Si es un vídeo, el que se reproduce, encima de su portada. */
  video?: string;
  alt: string;
};

type Labels = {
  region: string;
  previous: string;
  next: string;
  /** Rótulo de cada miniatura. */
  show: (alt: string) => string;
  /** «3 de 22», para el anuncio a lectores de pantalla. */
  position: (current: number, total: number) => string;
};

type Props = {
  items: SlideItem[];
  /** Controlado: la página decide cuál se ve, porque va en la URL. */
  index: number;
  onIndexChange: (index: number) => void;
  labels: Labels;
  className?: string;
};

export const wrapIndex = (i: number, n: number) => (n <= 0 ? 0 : ((i % n) + n) % n);

/** Cuántos pasos separan dos fotos, contando por el lado más corto del círculo. */
const distance = (a: number, b: number, n: number) => {
  const d = Math.abs(a - b);
  return Math.min(d, n - d);
};

/** Cuántas fotos a cada lado de la actual se dejan montadas. */
const NEIGHBOURS = 1;

/**
 * Marca la foto vertical para enseñarla entera. Se mira al cargar **y** al
 * montar: si la imagen ya estaba en caché, termina antes de que React se
 * enganche y `onLoad` no llega a dispararse.
 */
function markPortrait(img: HTMLImageElement | null) {
  if (!img?.complete || !img.naturalWidth) return;
  img.toggleAttribute('data-portrait', img.naturalHeight > img.naturalWidth);
}

export function Slideshow({ items, index, onIndexChange, labels, className }: Props) {
  const thumbsRef = useRef<HTMLUListElement>(null);
  const [playing, setPlaying] = useState(false);

  const count = items.length;
  const active = wrapIndex(index, count);
  const go = (next: number) => onIndexChange(wrapIndex(next, count));

  // Al cambiar de pieza el vídeo se desmonta sin avisar con `pause`.
  useEffect(() => {
    setPlaying(false);
  }, [active]);

  // La miniatura actual, siempre a la vista en la tira.
  useEffect(() => {
    const current = thumbsRef.current?.querySelector<HTMLElement>('[aria-current="true"]');
    current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  // Flechas del teclado en toda la página: la galería es la página. Salvo con
  // el foco en el vídeo, donde las flechas avanzan y retroceden en él.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof HTMLMediaElement) return;
      if (event.key === 'ArrowLeft') onIndexChange(wrapIndex(active - 1, count));
      else if (event.key === 'ArrowRight') onIndexChange(wrapIndex(active + 1, count));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, count, onIndexChange]);

  // Deslizar con el dedo o el ratón.
  const swipe = useRef<number | null>(null);
  const onPointerDown = (event: React.PointerEvent) => {
    // Arrastrar la barra del vídeo no es pasar de foto.
    swipe.current = (event.target as HTMLElement).closest('video') ? null : event.clientX;
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (start === null) return;
    const dx = event.clientX - start;
    if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1));
  };

  const current = items[active];

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-roledescription="carousel"
      aria-label={labels.region}
      // Mientras suena el vídeo, la tira se aparta: tapaba sus controles.
      data-playing={current?.video && playing ? '' : undefined}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {items.map((item, i) =>
        distance(i, active, count) <= NEIGHBOURS ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={item.src}
            src={item.src}
            alt={i === active ? item.alt : ''}
            className={styles.photo}
            data-active={i === active || undefined}
            data-video={item.video ? '' : undefined}
            aria-hidden={i !== active}
            // Una vertical va entera: recortada a lo ancho perdía dos tercios.
            ref={markPortrait}
            onLoad={(event) => markPortrait(event.currentTarget)}
          />
        ) : null,
      )}

      {/**
       * El reproductor, encima de su portada y entero como ella. No arranca
       * solo: tiene sonido.
       */}
      {current?.video && (
        <video
          key={current.video}
          className={styles.video}
          src={current.video}
          poster={current.src}
          controls
          playsInline
          preload="metadata"
          aria-label={current.alt}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
      )}

      <div className={styles.shade} aria-hidden="true" />

      {count > 1 && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.previous}`}
            onClick={() => go(active - 1)}
            aria-label={labels.previous}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => go(active + 1)}
            aria-label={labels.next}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <ul ref={thumbsRef} className={styles.thumbs}>
            {items.map((item, i) => (
              <li key={item.src}>
                <button
                  type="button"
                  className={styles.thumb}
                  data-video={item.video ? '' : undefined}
                  onClick={() => go(i)}
                  aria-current={i === active}
                  aria-label={labels.show(item.alt)}
                >
                  {/* Miniaturas generadas al subir: el optimizador de Next
                      volvería a codificar lo que ya viene a su medida. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.thumb ?? item.src} alt="" width={80} height={50} loading="lazy" decoding="async" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <span className={styles.srOnly} aria-live="polite">
        {current ? `${current.alt} — ${labels.position(active + 1, count)}` : ''}
      </span>
    </section>
  );
}
