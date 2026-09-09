/**
 * Datos **del evento** que pinta el correo de confirmación.
 *
 * Están aquí y no en variables de entorno a propósito: son doce y se corrigen a
 * mano, y editar doce variables en el panel de Vercel cuesta más que editar este
 * archivo. En el entorno solo queda lo que **no** puede ir en el repositorio: la
 * clave de Resend, el id de la plantilla y el remitente.
 *
 * Son datos del evento, no de quien se registra: el nombre llega del formulario
 * y siempre está, mientras que esto se escribe a mano y puede quedar a medias.
 * Por eso van separados, con una puerta solo sobre ellos.
 *
 * **Las claves son los nombres de las variables de la plantilla en Resend.** Se
 * escriben tal cual —minúsculas y guion bajo— aunque no sea el estilo del resto
 * del código, y solo admiten letras ASCII, dígitos y guion bajo. Si se cambia una
 * aquí hay que cambiarla en la plantilla: `npm run mail:verify` cruza las dos
 * listas y avisa.
 *
 * Los enlaces apuntan a la versión en español del sitio, que es la que trae el
 * texto de la plantilla.
 */
export const EVENT_EMAIL = {
  lugar: 'Quito, Ecuador',
  dia: '05 de Octubre de 2026',
  hora_ecuador: '16:30',
  event_date: '05 Octubre 2026',
  event_start_time: '16:30',
  event_end_time: '21:00',
  venue_name: 'Museo de Bonsái, Jardín Botánico',
  venue_city: 'Quito',
  venue_country: 'Ecuador',
  /** Enlace al mapa de la sede. */
  venue_url: 'https://share.google/wt2Ayao7q2ObvggbQ',
  agenda_url: 'https://ceiba.naturatech.org/es/agenda',
  sitio_web_url: 'https://ceiba.naturatech.org',
  /** Convocatoria hermana. Es un dominio propio, no una ruta de este sitio. */
  n500_url: 'https://500.naturatech.org',
} as const;

export type EventEmailField = keyof typeof EVENT_EMAIL;

export type EventEmailDetails = Record<EventEmailField, string>;

/** Los doce nombres, para quien tenga que comprobarlos o listarlos. */
export const EVENT_EMAIL_FIELDS = Object.keys(EVENT_EMAIL) as readonly EventEmailField[];

/**
 * Reúne los datos del evento y dice **qué falta**.
 *
 * La puerta sigue aquí aunque los valores ahora sean literales: lo que protege es
 * el correo, no el origen del dato. Vaciar una línea de arriba —o dejarla con
 * espacios— es igual de fácil que olvidar una variable de entorno, y Resend
 * entrega el correo con el hueco en blanco sin quejarse.
 */
export function eventEmailDetails(): {
  details: EventEmailDetails;
  missing: readonly EventEmailField[];
} {
  const details = {} as EventEmailDetails;
  const missing: EventEmailField[] = [];

  for (const field of EVENT_EMAIL_FIELDS) {
    const value = EVENT_EMAIL[field].trim();
    details[field] = value;
    if (!value) missing.push(field);
  }

  return { details, missing };
}
