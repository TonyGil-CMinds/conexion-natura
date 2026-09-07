/**
 * Páginas interiores: lo que no depende del idioma. Los rótulos y las
 * descripciones están en `src/i18n/dictionaries`.
 */
export const PAGES = {
  agenda: {
    cover: {
      src: '/img/agenda-portada.png',
      width: 1280,
      height: 430,
    },
    /**
     * Semilla del mosaico, elegida barriendo las 400 primeras con tres criterios:
     * entre 12 y 18 celdas amarillas, repartidas entre las dos mitades, y ninguna
     * asomando junto al panel del rótulo — una amarilla en el borde del panel lo
     * convierte en una escalera y parece un error de maquetación.
     */
    coverSeed: 13,
  },

  speakers: {
    cover: {
      src: '/img/speakers-portada.png',
      width: 1280,
      height: 430,
    },
    /* Misma criba que en agenda: reparto equilibrado de celdas de color. */
    coverSeed: 214,
    /* Menos celdas que en agenda: el bloque en degradado ya carga el lado derecho. */
    coverDensity: 0.12,
    introIcon: { src: '/icons/icon-green-rombo.svg', width: 50, height: 50 },
  },
} as const;
