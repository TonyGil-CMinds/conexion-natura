/**
 * Forma de un momento de la agenda. El contenido está en los diccionarios: es
 * copia, y hay una versión por idioma.
 */

export type AgendaPerson = {
  name: string;
  /** Cargo y organización, tal como los da el programa. Falta si no consta. */
  role?: string;
};

export type AgendaItem = {
  /** Identificador estable: sirve de ancla y de clave de lista. */
  id: string;
  /** Franja, ya compuesta: el guion y el formato son decisión de diseño. */
  time: string;
  title: string;
  description?: string;
  /** Quien presenta el momento. */
  host?: AgendaPerson;
  /** Quienes intervienen. */
  people?: readonly AgendaPerson[];
};
