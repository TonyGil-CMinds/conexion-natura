/**
 * Retiro del Consejo CEIBA en Tanusas: lo que **no** depende del idioma.
 *
 * Es un acto distinto del de Quito —otra fecha, otra sede, otro formato— así que
 * tiene su propio bloque en vez de colgar de `SITE.event`: mezclarlos habría
 * puesto dos eventos en el mismo sitio, con el riesgo de corregir uno y creer
 * que se corrigieron los dos.
 *
 * La copia vive en `src/i18n/dictionaries`, con la clave `tanusas`.
 */

export const TANUSAS = {
  /** Fechas del retiro. Mes en base 0, como en `Date`. */
  start: { year: 2026, month: 9, day: 8 },
  end: { year: 2026, month: 9, day: 10 },
  /** Cierre de confirmaciones. */
  rsvpDeadline: { year: 2026, month: 8, day: 15 },
  /** Aforo del retiro: es un grupo pequeño a propósito. */
  capacity: { min: 12, max: 15 },
  venue: {
    name: 'Tanusas',
    place: 'Puerto Cayo · Manabí, Ecuador',
    /** Búsqueda y no coordenada, igual que la sede de Quito. */
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Tanusas+Puerto+Cayo+Manab%C3%AD',
  },
  /** Correo de contacto del retiro, tal y como aparece en la invitación. */
  contactEmail: 'hola@naturatech.org',
  siteUrl: 'https://naturatech.org',

  /**
   * Imágenes y tramas. Los nombres son los del proyecto y no los del archivo de
   * origen: la carpeta de diseño trae rutas propias que aquí no existen.
   */
  media: {
    /** Fondo del hero. Lo anima el lienzo de agua, con esta imagen de textura. */
    hero: { src: '/tanusas/hero-tanusas.jpg', width: 1112, height: 833 },
    /**
     * Rótulo del retiro, a sangre de lado a lado del hero.
     *
     * Va como imagen y no como máscara de `currentColor`: trae dos colores
     * fijados —el crema de las letras y la lima de la «A»— y una máscara los
     * aplanaría en uno. No necesita variante por tema porque el hero es oscuro
     * en los dos.
     */
    wordmark: { src: '/brand/logo-tanusas.svg', width: 1114, height: 162 },
    /** Quién impulsa el retiro, al pie del hero. `key` entra en el diccionario. */
    partners: [
      { key: 'initiative', src: '/brand/logo-ntl.svg', width: 171, height: 23 },
      { key: 'coled', src: '/brand/logo-cminds.svg', width: 143, height: 52 },
    ],
    /** Poblado visto desde el aire: acompaña a la sección del lugar. */
    village: { src: '/tanusas/tanusas-poblado.jpg', width: 1654, height: 900 },
    /** Noche del acto anterior: acompaña a la sección del lugar. */
    night: { src: '/tanusas/hero-noche.jpg', width: 1600, height: 2000 },
    /** Mesa de trabajo: acompaña a lo que se busca del retiro. */
    table: { src: '/tanusas/mesa-trabajo.jpg', width: 1600, height: 1066 },
    logo: { src: '/tanusas/logo-ceiba-tanusas.svg', width: 220, height: 44 },
    /**
     * Rótulo circular que gira junto al titular de los pasos del registro. Es el
     * del registro del sitio: la pieza es de CEIBA, no del acto de Quito.
     */
    marquee: '/icons/asset-circularmarquesee-step2.svg',
    lattice: '/tanusas/trama-ambar.svg',
    staircase: '/tanusas/trama-escalera.svg',
  },

  /**
   * Anclas de la navegación de la propia página, en orden. `key` entra en el
   * diccionario; el `id` es el del `<section>`.
   *
   * La confirmación **no** está aquí: dejó de ser una sección de la página para
   * ser la acción que abre el registro, así que la barra la añade aparte.
   */
  sections: [
    { key: 'invitation', id: 'invitacion' },
    { key: 'concept', id: 'concepto' },
    { key: 'architecture', id: 'arquitectura' },
    { key: 'place', id: 'lugar' },
    { key: 'agenda', id: 'agenda' },
  ],
} as const;

export type TanusasSectionKey = (typeof TANUSAS.sections)[number]['key'];
