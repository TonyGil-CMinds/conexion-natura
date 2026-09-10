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
  try {
    const response = await fetch(`/api/registro?email=${encodeURIComponent(email)}`);
    // 404 es la respuesta normal de «no está», no un error.
    if (!response.ok) return null;
    const payload = (await response.json()) as { attendee?: Attendee };
    return payload.attendee ?? null;
  } catch {
    return null;
  }
}
