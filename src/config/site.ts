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
     * Para el calendario: **hora local de Quito**, con su zona al lado.
     *
     * Antes iba en UTC, que es el mismo instante pero no la misma lectura: cada
     * calendario lo traducía a la zona de quien lo abría, y a alguien en Ciudad
     * de México la invitación le decía «4:00 pm». Correcto y confuso a la vez.
     * Con la zona explícita, la entrada dice 5:00 pm de Quito para todo el
     * mundo, que es la hora a la que hay que estar en la puerta.
     *
     * Ecuador continental no tiene horario de verano, así que el desplazamiento
     * es -05:00 todo el año y no hace falta calcular nada por fecha.
     */
    calendar: {
      kind: 'time',
      start: '20261005T170000',
      end: '20261005T210000',
      timeZone: 'America/Guayaquil',
      offset: '-0500',
    },
  },
  /**
   * El otro acto del día: la premiación del Premio NaturaTech LAC 2026.
   *
   * Hora y sede **ya confirmadas**. Antes no las había —la entrada de calendario
   * era de día completo y el horario un rótulo de «por confirmar»—, y el dato
   * vive aquí para que la agenda, la tarjeta de elección del registro y el
   * correo lo cuenten igual: cuando estaba en tres sitios, se corrigió a medias.
   */
  award: {
    /** Se escribe igual en los dos idiomas, como el de la noche. */
    scheduleLabel: '4:00 pm — 4:45 pm',
    venue: {
      name: 'UDLA Arena',
      mapsUrl: 'https://share.google/7YkJTo3HMDfjwDg4N',
    },
    /** Tramo de horas en hora local de Quito, igual que el de la noche. */
    calendar: {
      kind: 'time',
      start: '20261005T160000',
      end: '20261005T164500',
      timeZone: 'America/Guayaquil',
      offset: '-0500',
    },
  },
  /**
   * Si la lista de ponentes ya se puede enseñar.
   *
   * Va aquí y no en cada página porque lo miran **dos**: la lista de ponentes y
   * los créditos de la agenda. Con un interruptor por sitio, revelar habría
   * sido acordarse de los dos.
   *
   * Los datos siguen en los diccionarios: esto no los borra, solo no los pinta.
   */
  speakersRevealed: false,

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
  /** Rutas de verdad, sin prefijo de idioma: quien pinta el enlace le añade el suyo. */
  legal: [
    { key: 'terms', href: '/terminos' },
    { key: 'privacy', href: '/privacidad' },
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
