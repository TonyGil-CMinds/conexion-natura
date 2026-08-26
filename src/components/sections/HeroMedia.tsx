'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useHasEntered } from '@/features/loader';
import { EASE_OUT_EXPO } from '@/lib/motion';
import styles from './HeroMedia.module.css';

/**
 * Lado derecho del hero: campo de píxeles al fondo y la foto del colibrí encima.
 *
 * La capa mide un viewport completo y se centra sobre el contenedor, así que la
 * foto y el campo se anclan al borde de la pantalla y no al del contenido: con el
 * ancho acotado a `--content-max`, un `right: 0` dentro del contenedor los dejaba
 * separados del borde en pantallas anchas.
 *
 * El campo va como imagen y no reconstruido celda a celda: su relleno es un
 * degradado continuo que cruza toda la figura, más una capa de ruido del propio
 * SVG. Partirlo en celdas obligaría a recomponer las dos cosas y perdería el ruido.
 */
export function HeroMedia() {
  const hasEntered = useHasEntered();

  return (
    <div className={styles.root} aria-hidden>
      <Image
        src="/hero/hero-green-pixels-2.svg"
        alt=""
        width={733}
        height={743}
        priority
        className={styles.field}
      />

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
      </motion.div>

      {/* Suelo: funde el bajo de la foto con el fondo para que el corte del
          encuadre no se vea. Va a todo el ancho y no solo sobre la foto, porque
          un borde vertical se notaría al cruzar los cuadros del campo. */}
      <div className={styles.floor} />
    </div>
  );
}
