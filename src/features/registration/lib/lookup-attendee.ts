/**
 * Busca un registro por correo.
 *
 * Es lo que decide, en el primer paso, si hay que registrar a alguien o si ya
 * está y solo hay que enseñarle su información.
 *
 * **Nunca lanza.** Un fallo de red no puede dejar a nadie atascado en la
 * pantalla del correo: sin respuesta se sigue como si no existiera el registro,
 * y el envío final hace `upsert` por correo, así que un registro que sí existía
 * se corrige en vez de duplicarse.
 */

import type { Attendee } from '../context/attendance';

export async function lookupAttendee(email: string): Promise<Attendee | null> {
  const result = await verifyAttendee(email);
  return result.status === 'found' ? result.attendee : null;
}

/**
 * Lo mismo, pero distinguiendo **«no está»** de **«no se pudo preguntar»**.
 *
 * `lookupAttendee` mezcla los dos en `null`, que para el primer paso del
 * registro da igual: en ambos casos toca registrar. Pero quien revalida un
 * perfil guardado en el navegador necesita separarlos, porque las consecuencias
 * son opuestas: si el registro ya no existe hay que borrar el perfil, y si solo
 * falló la red hay que **conservarlo** —tirarlo dejaría a alguien sin su
 * confirmación por haber pasado por un túnel—.
 */
export type AttendeeCheck =
  | { status: 'found'; attendee: Attendee }
  /** El servidor contestó que no hay registro con ese correo. */
  | { status: 'missing' }
  /** No se pudo saber: red caída, servidor con un 500, respuesta ilegible. */
  | { status: 'unknown' };

export async function verifyAttendee(email: string): Promise<AttendeeCheck> {
  try {
    const response = await fetch(`/api/registro?email=${encodeURIComponent(email)}`);
    // 404 es la respuesta normal de «no está», no un error.
    if (response.status === 404) return { status: 'missing' };
    if (!response.ok) return { status: 'unknown' };
    const payload = (await response.json()) as { attendee?: Attendee };
    return payload.attendee ? { status: 'found', attendee: payload.attendee } : { status: 'missing' };
  } catch {
    return { status: 'unknown' };
  }
}
