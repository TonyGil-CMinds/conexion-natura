import type { EventChoice } from '../lib/attendee-input';

/**
 * Los dos actos del día, con sus assets.
 *
 * `id` es la clave en el diccionario y `choice` el valor que entra en la columna
 * de la base: separados a propósito, porque la copia se traduce y el dato no.
 *
 * Las medidas son las naturales de cada SVG. Van aquí y no en el componente para
 * que al cambiar un asset se cambien en el mismo sitio que su ruta.
 */
export const EVENT_OPTIONS = [
  {
    id: 'night',
    choice: 'NIGHT',
    logo: { src: '/icons/logo-natura500night.svg', width: 121, height: 101 },
    art: { src: '/icons/asset-selection-natura500night.svg', width: 126, height: 182 },
  },
  {
    id: 'award',
    choice: 'AWARD',
    /**
     * Variante con tinta oscura, generada del original: el que llega trae el
     * texto en el crema del tema oscuro y la tarjeta del premio es clara, así
     * que sobre ella no se veía. Si llega un original oscuro, sustituir.
     */
    logo: { src: '/icons/logo-premio3036-dark.svg', width: 150, height: 78 },
    art: { src: '/icons/asset-selection-premio2026.svg', width: 183, height: 182 },
  },
] as const satisfies readonly {
  id: 'night' | 'award';
  choice: EventChoice;
  logo: { src: string; width: number; height: number };
  art: { src: string; width: number; height: number };
}[];

export type EventOption = (typeof EVENT_OPTIONS)[number];

/** Marca circular con texto en el borde, que gira al lado del titular. */
export const CHOICE_MARQUEE = {
  src: '/icons/asset-circularmarquesee-step1.svg',
  /** Segundos por vuelta. Lento: es un adorno, no algo que pida atención. */
  spinSeconds: 22,
} as const;

/** La del paso de datos. Es la otra cara de la moneda, y por eso no gira sola. */
export const DETAILS_MARQUEE = {
  src: '/icons/asset-circularmarquesee-step2.svg',
} as const;

/** La del último paso, la de la fotografía. */
export const PHOTO_MARQUEE = {
  src: '/icons/asset-circularmarquesee-step3.svg',
} as const;
