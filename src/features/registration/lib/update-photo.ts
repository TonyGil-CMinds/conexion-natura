/**
 * Cambia la fotografía de un registro que ya existe.
 *
 * Sube el retrato a R2 y le pasa la URL al servidor, que solo toca esa columna.
 * Devuelve el registro tal y como quedó: la respuesta del servidor es la fuente
 * de verdad, igual que en el envío del formulario.
 *
 * Lanza si algo falla —la pantalla lo cuenta y deja reintentar—: aquí un fallo
 * silencioso dejaría a alguien creyendo que ya tiene su credencial con foto.
 */

import type { Attendee } from '../context/attendance';
import { uploadPhoto } from './upload-photo';

export async function updatePhoto(email: string, photo: Blob): Promise<Attendee> {
  const photoUrl = await uploadPhoto(photo);

  const response = await fetch('/api/registro', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, photoUrl }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    attendee?: Attendee;
    error?: string;
  };
  if (!response.ok || !payload.attendee) {
    throw new Error(payload.error ?? 'No se pudo guardar la imagen.');
  }

  return payload.attendee;
}
