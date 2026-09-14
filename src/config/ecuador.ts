import { SITE } from './site';

/**
 * Datos del registro de empresas e iniciativas de Ecuador a la Natura500 Night.
 *
 * Es un registro al **mismo acto** que `/registro`, no a otro: la fecha, la hora,
 * la sede y la entrada de calendario salen de `SITE.event` y no se copian aquí.
 * Copiarlas habría sido crear un segundo sitio donde corregir la hora.
 *
 * Lo que sí es suyo: a qué assets tira y a quién se escribe si hay dudas.
 */
export const ECUADOR = {
  /**
   * Las monedas giratorias de cada paso. Son las del registro del sitio: los
   * pasos son los mismos —datos, elección, fotografía— y dibujar otras tres
   * solo para esta ruta habría sido repetir el mismo objeto con otro trazo.
   */
  marquee: {
    details: '/icons/asset-circularmarquesee-step2.svg',
    participation: '/icons/asset-circularmarquesee-step1.svg',
  },

  /**
   * Identificador de la entrada de calendario. Estable de por vida: es lo que
   * evita que quien la añada dos veces acabe con dos.
   *
   * Es **distinto** del de `/registro` aunque el acto sea el mismo: quien se
   * registró por los dos sitios tendría dos entradas idénticas, y da menos
   * problemas eso que una entrada que se sobrescribe sola.
   */
  calendarUid: 'conexion500-ecuador-2026-10-05@conexion500',

  /** A quién se escribe. El mismo buzón que atiende el retiro. */
  contactEmail: 'hola@naturatech.org',

  /** Cuándo y dónde, sin duplicar: es la Natura500 Night. */
  event: SITE.event,
} as const;
