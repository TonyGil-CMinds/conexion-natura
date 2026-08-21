/**
 * Contenido del sitio. Vive fuera de los componentes para que copy y estructura
 * se editen sin tocar maquetación, y para tener un punto único cuando entre i18n.
 */

export const SITE = {
  name: 'Conexión Natura',
  event: {
    date: '05 octubre 2026',
    place: 'Quito, Ecuador',
    /** Una entrada por línea: el salto es decisión de diseño, no del navegador. */
    headline: ['El futuro', 'nace de la', 'biodiversidad'],
    format: 'En persona',
  },
  cta: {
    label: 'Registro abierto',
    href: '#registro',
  },
} as const;

export const NAV_LINKS = [
  { label: 'Acerca de', href: '#acerca' },
  { label: 'Mi agenda', href: '#agenda' },
  { label: 'Cómo llegar', href: '#llegar' },
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
