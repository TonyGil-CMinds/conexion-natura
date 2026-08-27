/**
 * Contenido del sitio. Vive fuera de los componentes para que copy y estructura
 * se editen sin tocar maquetación, y para tener un punto único cuando entre i18n.
 */

/** Un tramo de titular. `accent` lo pinta con el color de acento del tema. */
export type HeadlineSegment = { text: string; accent?: boolean };

export const SITE = {
  name: 'Conexión500',
  event: {
    /** Fecha del evento, para la cuenta atrás. Mes en base 0 como en Date. */
    date: { year: 2026, month: 9, day: 5 },
    dateLabel: '05 octubre 2026',
    place: 'Quito, Ecuador',
    /**
     * Titular por líneas y por tramos: el salto de línea y el resalte son
     * decisiones de diseño, no del navegador.
     */
    headline: [
      [{ text: 'Noche por la' }],
      [{ text: 'biodiversidad' }],
      [{ text: 'y el futuro' }],
    ] as HeadlineSegment[][],
  },
  cta: {
    label: 'Registro abierto',
    href: '/registro',
    note: 'Cupo limitado*',
  },
  invite: {
    label: '¿No recibiste invitación?',
    href: '#invitacion',
  },
  countdown: {
    label: 'Días para Conexión500',
  },
} as const;


/** Contenido del pie. */
export const FOOTER = {
  image: { src: '/img/footer-image.png', width: 764, height: 356 },
  farewell: { lead: 'Nos vemos en', place: 'Quito, Ecuador' },
  cta: { label: 'Regístrate ahora', href: '/registro' },
  copyright: 'Todos los derechos reservados.',
  legal: [
    { label: 'Términos y condiciones', href: '#terminos' },
    { label: 'Aviso de privacidad', href: '#privacidad' },
  ],
  /** El orden es el del diseño. `network` selecciona la marca del glifo. */
  social: [
    { network: 'facebook', label: 'Facebook', href: 'https://www.facebook.com' },
    { network: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com' },
    { network: 'instagram', label: 'Instagram', href: 'https://www.instagram.com' },
    { network: 'youtube', label: 'YouTube', href: 'https://www.youtube.com' },
  ],
} as const;

/** `highlight` pinta el enlace con el color de acento: es una llamada a la acción
 *  dentro del menú, no un estado de selección. */
export const NAV_LINKS = [
  { label: 'Agenda', href: '/agenda' },
  { label: 'Ponentes', href: '/speakers' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Regístrate', href: '/registro', highlight: true },
] as const;

export const LOCALES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
] as const;

export type LocaleCode = (typeof LOCALES)[number]['code'];

/**
 * Logos de socios, agrupados como en el diseño. Tamaños = tamaño natural del SVG.
 *
 * Se usan las variantes en claro que genera
 * `node scripts/partner-logos-light.js`: los originales llevan la tinta en el
 * verde oscuro de marca, invisible sobre el fondo del sitio. La variante solo
 * cambia ese color, así que las banderas de Suecia y Francia quedan intactas.
 */
export const PARTNER_GROUPS = [
  {
    label: 'Initiative led by',
    logos: [
      { src: '/partners/logo-socios-bid-light.svg', alt: 'IDB Lab', width: 123, height: 25 },
      { src: '/partners/logo-socios-cminds-light.svg', alt: 'C Minds', width: 118, height: 28 },
    ],
  },
  {
    label: 'Funding partners',
    logos: [
      { src: '/partners/logo-socios-suecia-light.svg', alt: 'Sweden Sverige', width: 62, height: 19 },
      { src: '/partners/logo-socios-francia-light.svg', alt: 'Gouvernement français', width: 57, height: 30 },
      { src: '/partners/logo-socios-amazonia-light.svg', alt: 'Amazonía', width: 31, height: 26 },
      { src: '/partners/logo-socios-cc-light.svg', alt: 'Climate Collective', width: 58, height: 19 },
    ],
  },
] as const;
