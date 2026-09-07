/**
 * Forma de un ponente. Los datos están en los diccionarios mientras sean de
 * relleno; cuando llegue el endpoint, lo único que cambia es de dónde sale el
 * array — la lista no se entera.
 */
export type SpeakerSession = {
  id: string;
  title: string;
};

export type Speaker = {
  id: string;
  /** Nombre y apellidos por separado: el diseño los pinta con distinto peso. */
  firstName: string;
  lastName: string;
  role: string;
  organization: string;
  /** Enlace a la organización; si falta, el nombre se muestra sin enlazar. */
  organizationUrl?: string;
  linkedinUrl?: string;
  sessions: readonly SpeakerSession[];
  /** Retrato recortado sobre fondo de color. Falta mientras sean datos de relleno. */
  photo?: string;
};
