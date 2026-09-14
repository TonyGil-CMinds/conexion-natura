import type { ParticipationKey } from '../config/participation-options';

/**
 * Lo que devuelve la consulta por correo: el registro tal y como se guardó.
 *
 * Sirve para dos cosas: pintar el acuse de quien ya está registrado, y rellenar
 * los pasos si decide corregir algo.
 */
export type EcuadorRegistrationRecord = {
  email: string;
  fullName: string;
  organization: string;
  participation: ParticipationKey;
  tablePitch: string;
  guestName: string;
  guestEmail: string;
  photoUrl: string | null;
};

/**
 * Busca un registro de empresa por correo.
 *
 * Es lo que decide, al dar el correo en la primera pantalla, si hay que
 * registrar a alguien o si ya está y solo hay que enseñarle lo suyo.
 *
 * **Nunca lanza.** Un fallo de red no puede dejar a nadie atascado en el campo
 * del correo: sin respuesta se sigue como si no hubiera registro, y el envío
 * final hace `upsert` por correo, así que uno que sí existía se corrige en vez
 * de duplicarse.
 */
export async function lookupEcuadorRegistration(
  email: string,
): Promise<EcuadorRegistrationRecord | null> {
  try {
    const response = await fetch(`/api/registro/ecuador?email=${encodeURIComponent(email)}`);
    // 404 es la respuesta normal de «no está», no un error.
    if (!response.ok) return null;
    const payload = (await response.json()) as { registration?: EcuadorRegistrationRecord };
    return payload.registration ?? null;
  } catch {
    return null;
  }
}
