'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { HeroPixelWave } from '@/features/hero-pixel-wave';
import { useHasEntered } from '@/features/loader';
import { EASE_OUT_EXPO } from '@/lib/motion';
import styles from './HeroMedia.module.css';

/**
 * Lado derecho del hero: la foto del colibrí.
 *
 * Va en una capa propia, **por delante** del contenido: el ave cruza el rótulo, no
 * al revés. La capa hace falta porque se centra con `transform`, y un
 * `transform` crea contexto de apilamiento: metida en la capa del fondo, ningún
 * `z-index` del ave habría superado al del texto.
 *
 * La capa mide un viewport completo y se centra sobre el contenedor, así que la
 * foto se ancla al borde de la pantalla y no al del contenido: con el
 * ancho acotado a `--content-max`, un `right: 0` dentro del contenedor los dejaba
 * separados del borde en pantallas anchas.
 *
 * El campo de cuadros verdes que iba al fondo se retiró: el ave queda sobre el
 * fondo limpio de la interfaz.
 */
export function HeroMedia() {
  const hasEntered = useHasEntered();

  return (
    <div className={styles.root} aria-hidden>
      <div className={`${styles.layer} ${styles.front}`}>
        <motion.div
          className={styles.birdFrame}
          initial={{ opacity: 0, y: 48 }}
          animate={hasEntered ? { opacity: 1, y: 0 } : { opacity: 0, y: 48 }}
          transition={{ duration: 1.1, ease: EASE_OUT_EXPO }}
        >
          <Image
            src="/hero/heroBird.png"
            alt=""
            width={641}
            height={628}
            priority
            className={styles.bird}
          />

          {/* Va dentro del marco del ave, no del hero: así se mueve y escala con
              ella en vez de quedarse a la deriva al cambiar el alto del viewport. */}
          <HeroPixelWave className={styles.wave} />
        </motion.div>

        {/* Suelo: funde el bajo de la foto con el fondo para que el corte del
            encuadre no se vea. Va por delante del ave y a todo el ancho, porque
            un borde vertical se notaría al cruzar los cuadros del campo. */}
        <div className={styles.floor} />
      </div>
    </div>
  );
}
