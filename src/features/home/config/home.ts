import { QUITO } from '@/config/quito';
import { SITE } from '@/config/site';

/**
 * Lo que la portada no toma del idioma.
 *
 * La portada viste la piel de `/quito` —paleta, barra, rótulo—, pero con su
 * propio hero y su propia navegación.
 */
export const HOME = {
  /**
   * La barra. Las tres primeras llevan a la sección de Quito, que es donde
   * están el «acerca de», la agenda y los ponentes del acto; la portada no
   * tiene sección propia para ninguno. `key` entra en `dictionary.home.nav`.
   */
  nav: [
    { key: 'about', href: `${QUITO.root}#acerca-de` },
    { key: 'agenda', href: `${QUITO.root}/agenda` },
    { key: 'speakers', href: `${QUITO.root}/speakers` },
    { key: 'gallery', href: SITE.gallery.href, highlight: true },
  ],

  hero: {
    /** Recortada sobre transparente: el fondo es el de la paleta que toque. */
    turtle: { src: '/img/turtle-hero-desktop.png', width: 1254, height: 889 },
    /** El mismo rótulo que el hero de Quito, como máscara. */
    wordmark: { src: '/hero/logo-ceiba.svg', width: 915, height: 254 },
  },
} as const;

/**
 * Lo que el loader espera antes de dar paso a la portada: lo que se ve en el
 * primer cuadro, para que no se revele a medio pintar.
 */
export const HOME_PRELOAD = [HOME.hero.turtle.src, HOME.hero.wordmark.src, QUITO.brand.src];
