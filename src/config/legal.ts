/**
 * Datos de las páginas legales que **no** dependen del idioma: quién responde,
 * cómo contactar y desde cuándo rige el texto. La redacción vive en los
 * diccionarios.
 *
 * Lo que está vacío sale marcado en la página como pendiente, a la vista y en
 * los dos idiomas. Es a propósito: un aviso de privacidad sin responsable ni
 * canal de contacto no sirve, y prefiero que se note antes de publicar a que
 * pase inadvertido —o, peor, que aquí figure una dirección inventada a la que
 * nadie contesta—.
 */

export const LEGAL = {
  /**
   * Quién trata los datos. Nombre de la entidad tal y como debe constar, no la
   * marca del evento.
   *
   * TODO(equipo): poner la razón social que corresponda.
   */
  controller: '',
  /** Dirección de contacto para ejercer derechos y para dudas legales. */
  contactEmail: '',
  /**
   * Jurisdicción que rige los términos. El acto es en Quito, pero quién
   * organiza y desde dónde decide esto, así que se deja para confirmar.
   *
   * TODO(equipo): confirmar con asesoría legal.
   */
  jurisdiction: '',
  /**
   * Última revisión, en ISO. Se pinta con el formato de cada idioma, así que va
   * aquí y no en la copia: una fecha escrita dos veces se corrige a medias.
   */
  updatedAt: '2026-09-09',
  /**
   * Cuánto se conservan los datos del registro tras el acto, en meses. Sale en
   * el texto, así que cambiarlo aquí lo cambia en los dos idiomas.
   */
  retentionMonths: 12,
} as const;
