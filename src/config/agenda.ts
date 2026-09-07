/**
 * Forma de un momento de la agenda. El contenido está en los diccionarios: es
 * copia, y hay una versión por idioma.
 */

export type AgendaPerson = {
  name: string;
  /**
   * Cargo y organización, tal como los da el programa. Falta si no consta.
   * Lo llevan quienes **presentan**: ahí el crédito es la función.
   */
  role?: string;
  /**
   * Solo la organización. Es lo que se acredita a quienes **intervienen**: en un
   * panel importa de dónde viene cada voz, y el cargo alargaba la fila sin
   * añadir nada. Se guarda como dato aparte y no recortando el cargo al pintar:
   * partir la cadena por la coma fallaría con «CEIBA», que ya es solo la
   * organización, y con los cargos que llevan comas dentro.
   */
  organization?: string;
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
