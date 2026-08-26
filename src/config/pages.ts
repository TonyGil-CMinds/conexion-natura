/**
 * Copy de las páginas interiores. Fuera de los componentes, como el resto del
 * contenido, para que editar un rótulo no obligue a tocar maquetación.
 */
export const PAGES = {
  agenda: {
    title: 'Agenda',
    description:
      'Programa de Conexión500: plenarias, paneles y actividades del 5 de octubre de 2026 en Quito.',
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
    empty: 'Agenda en construcción',
  },

  speakers: {
    title: 'Ponentes',
    description:
      'Quienes dan forma a lo que viene: participantes y ponentes de alto nivel de Conexión500.',
    cover: {
      src: '/img/speakers-portada.png',
      width: 1280,
      height: 430,
    },
    /* Misma criba que en agenda: reparto equilibrado de celdas de color. */
    coverSeed: 214,
    /* Menos celdas que en agenda: el bloque en degradado ya carga el lado derecho. */
    coverDensity: 0.12,
    intro: {
      headline: ['Quienes dan forma', 'a lo que viene en', 'el futuro'],
      note: 'Conoce la lista de participantes y ponentes de alto nivel',
      icon: { src: '/icons/icon-green-rombo.svg', width: 50, height: 50 },
    },
  },
} as const;
