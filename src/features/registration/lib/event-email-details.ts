import { SITE } from '@/config/site';

/**
 * Datos **del evento** que pinta el correo de confirmación.
 *
 * Están aquí y no en variables de entorno a propósito: se corrigen a mano, y
 * editarlas en el panel de Vercel cuesta más que editar este archivo. En el
 * entorno solo queda lo que **no** puede ir en el repositorio: la clave de
 * Resend, el id de la plantilla y el remitente.
 *
 * Son datos del evento, no de quien se registra: el nombre y a qué actos va
 * llegan del registro y siempre están, mientras que esto se escribe a mano y
 * puede quedar a medias. Por eso van separados, con una puerta solo sobre esto.
 *
 * Desde que se puede elegir acto, la plantilla trae **un bloque por acto** y
 * cada uno con su fecha, su hora y su sede: la noche tiene horario confirmado y
 * la premiación no, así que ya no valía un solo juego de `event_*`.
 *
 * **Las claves son los nombres de las variables de la plantilla en Resend.** Se
 * escriben tal cual —minúsculas y guion bajo— aunque no sea el estilo del resto
 * del código, y solo admiten letras ASCII, dígitos y guion bajo. Si se cambia
 * una aquí hay que cambiarla en la plantilla: `npm run mail:verify` cruza las dos
 * listas y avisa.
 *
 * Los enlaces apuntan a la versión en español del sitio, que es la que trae el
 * texto de la plantilla.
 */
export const EVENT_EMAIL = {
  /** Natura500 Night: el acto principal, con horario y sede confirmados. */
  natura_date: '05 de Octubre de 2026',
  /**
   * **Del mismo sitio que el resto del sitio.** Aquí decía «16:30 — 21:00», que
   * es la hora en que abre el registro de asistentes y no la del acto: el
   * correo anunciaba media hora antes de lo que dicen la portada, el FAQ y la
   * agenda. Escrita a mano se volvía a separar, así que sale de `SITE`.
   */
  natura_time: SITE.event.scheduleLabel,
  /**
   * La sala, dentro del recinto que nombra el sitio («Jardín Botánico de
   * Quito»): en el correo se puede ser más preciso porque quien lo lee ya va.
   */
  natura_venue: 'Museo de Bonsái, Jardín Botánico',
  /** Enlace al mapa de la sede. */
  natura_venue_url: 'https://share.google/wt2Ayao7q2ObvggbQ',

  /**
   * Premio NaturaTech LAC 2026, el mismo día.
   *
   * La hora **está por confirmar** y así se dice: la plantilla imprime este
   * valor tal cual, así que aquí va la frase y no una hora inventada.
   */
  premio_date: '05 de Octubre de 2026',
  premio_time: 'Horario por confirmar',
  premio_venue: 'Main Stage GET Forum',
  /**
   * No hay mapa de esta sala todavía, y el rótulo de la plantilla es un enlace.
   * Apunta a la agenda —donde estará el detalle cuando se confirme— en vez de a
   * una ubicación inventada. **Sustituir por el mapa real al tenerlo.**
   */
  premio_venue_url: 'https://ceiba.naturatech.org/es/agenda',

  agenda_url: 'https://ceiba.naturatech.org/es/agenda',
  sitio_web_url: 'https://ceiba.naturatech.org',
  /** Convocatoria hermana. Es un dominio propio, no una ruta de este sitio. */
  n500_url: 'https://500.naturatech.org',
} as const;

export type EventEmailField = keyof typeof EVENT_EMAIL;

export type EventEmailDetails = Record<EventEmailField, string>;

/** Los nombres, para quien tenga que comprobarlos o listarlos. */
export const EVENT_EMAIL_FIELDS = Object.keys(EVENT_EMAIL) as readonly EventEmailField[];

/**
 * Reúne los datos del evento y dice **qué falta**.
 *
 * La puerta sigue aquí aunque los valores sean literales: lo que protege es el
 * correo, no el origen del dato. Vaciar una línea de arriba —o dejarla con
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
