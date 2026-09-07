/**
 * Datos del sitio que **no** dependen del idioma: fechas, enlaces, medidas y
 * nombres propios. La copia vive en `src/i18n/dictionaries`.
 *
 * El reparto importa: una fecha duplicada en dos diccionarios es una fecha que se
 * puede corregir a medias.
 */

export const SITE = {
  name: 'CEIBA Quito',
  event: {
    /** Fecha del evento, para la cuenta atrás. Mes en base 0 como en Date. */
    date: { year: 2026, month: 9, day: 5 },
    /** Igual en los dos idiomas. */
    place: 'Quito, Ecuador',
    /** Las horas se escriben igual; la nota del registro previo va traducida. */
    scheduleLabel: '5:00 pm — 9:00 pm',
    venue: {
      name: 'Jardín Botánico de Quito',
      /** Búsqueda y no coordenada: sin la dirección exacta, el buscador de Maps
       *  resuelve mejor que un punto inventado. */
      mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Jard%C3%ADn+Bot%C3%A1nico+de+Quito',
    },
    /**
     * Para el archivo de calendario. En UTC porque Ecuador continental va a
     * UTC-5 todo el año —no tiene horario de verano—, así que 17:00 locales son
     * las 22:00 Z y el evento termina ya en el día siguiente en UTC.
     */
    calendar: { startUtc: '20261005T220000Z', endUtc: '20261006T020000Z' },
  },
  /** Destino del botón principal. El rótulo sale del diccionario. */
  cta: { href: '/registro' },
} as const;

/**
 * Menú. `key` entra en `dictionary.nav` y `href` es la ruta sin prefijo de
 * idioma: quien pinta el enlace le añade el suyo.
 *
 * `highlight` pinta el enlace con el color de acento: es una llamada a la acción
 * dentro del menú, no un estado de selección.
 */
export const NAV_LINKS = [
  { key: 'agenda', href: '/agenda' },
  { key: 'speakers', href: '/speakers' },
  { key: 'faq', href: '/faq' },
  { key: 'register', href: '/registro', highlight: true },
] as const;

/** Estructura del pie. Los rótulos salen del diccionario. */
export const FOOTER = {
  image: { src: '/img/footer-image.png', width: 764, height: 356 },
  cta: { href: '/registro' },
  legal: [
    { key: 'terms', href: '#terminos' },
    { key: 'privacy', href: '#privacidad' },
  ],
  /** El orden es el del diseño. `network` selecciona la marca del glifo. */
  social: [
    { network: 'facebook', label: 'Facebook', href: 'https://www.facebook.com' },
    { network: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com' },
    { network: 'instagram', label: 'Instagram', href: 'https://www.instagram.com' },
    { network: 'youtube', label: 'YouTube', href: 'https://www.youtube.com' },
  ],
} as const;

/**
 * Logos de socios, agrupados como en el diseño. Tamaños = tamaño natural del SVG.
 * `key` entra en `dictionary.footer.partners`.
 *
 * Se usan las variantes en claro que genera
 * `node scripts/partner-logos-light.js`: los originales llevan la tinta en el
 * verde oscuro de marca, invisible sobre el fondo del sitio. La variante solo
 * cambia ese color, así que las banderas de Suecia y Francia quedan intactas.
 */
export const PARTNER_GROUPS = [
  {
    key: 'led',
    logos: [
      { src: '/partners/logo-socios-bid-light.svg', alt: 'IDB Lab', width: 123, height: 25 },
      { src: '/partners/logo-socios-cminds-light.svg', alt: 'C Minds', width: 118, height: 28 },
    ],
  },
  {
    key: 'funding',
    logos: [
      { src: '/partners/logo-socios-suecia-light.svg', alt: 'Sweden Sverige', width: 62, height: 19 },
      { src: '/partners/logo-socios-francia-light.svg', alt: 'Gouvernement français', width: 57, height: 30 },
      { src: '/partners/logo-socios-amazonia-light.svg', alt: 'Amazonía', width: 31, height: 26 },
      { src: '/partners/logo-socios-cc-light.svg', alt: 'Climate Collective', width: 58, height: 19 },
    ],
  },
] as const;
