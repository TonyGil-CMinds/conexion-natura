/**
 * Forma de una pregunta frecuente. El contenido está en los diccionarios: es
 * copia, y hay una lista por idioma.
 */
export type FaqItem = {
  /** Identificador estable: sirve de ancla y de clave de estado. El mismo en los
   *  dos idiomas, para que el acordeón no se cierre al cambiar de lengua. */
  id: string;
  question: string;
  answer: string;
};
