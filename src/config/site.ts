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
    href: '#registro',
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

/** `highlight` pinta el enlace con el color de acento: es una llamada a la acción
 *  dentro del menú, no un estado de selección. */
export const NAV_LINKS = [
  { label: 'Agenda', href: '/#agenda' },
  { label: 'Ponentes', href: '/#ponentes' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Regístrate', href: '/#registro', highlight: true },
] as const;

export const LOCALES = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
] as const;

export type LocaleCode = (typeof LOCALES)[number]['code'];

/** Logos de socios, agrupados como en el diseño. Tamaños = tamaño natural del SVG. */
export const PARTNER_GROUPS = [
  {
    label: 'Initiative led by',
    logos: [
      { src: '/partners/logo-socios-bid.svg', alt: 'IDB Lab', width: 123, height: 25 },
      { src: '/partners/logo-socios-cminds.svg', alt: 'C Minds', width: 118, height: 28 },
    ],
  },
  {
    label: 'Funding partners',
    logos: [
      { src: '/partners/logo-socios-suecia.svg', alt: 'Sweden Sverige', width: 62, height: 19 },
      { src: '/partners/logo-socios-francia.svg', alt: 'Gouvernement français', width: 57, height: 30 },
      { src: '/partners/logo-socios-amazonia.svg', alt: 'Amazonía', width: 31, height: 26 },
      { src: '/partners/logo-socios-cc.svg', alt: 'Climate Collective', width: 58, height: 19 },
    ],
  },
] as const;
