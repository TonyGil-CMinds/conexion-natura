/**
 * Quién es el invitado detrás del testigo del enlace.
 *
 * **Nunca lanza.** Un testigo caducado, ya usado o inventado devuelve `null`, y
 * quien llega con él acaba en el registro normal en vez de en una pantalla
 * muerta: escribirá su correo a mano y llegará al mismo sitio.
 */

export type Invitation = {
  name: string;
  email: string;
  /** Quién le invitó, si consta. */
  host: string | null;
};

export async function lookupInvitation(token: string): Promise<Invitation | null> {
  try {
    const response = await fetch(`/api/invitacion?token=${encodeURIComponent(token)}`);
    if (!response.ok) return null;
    const payload = (await response.json()) as { guest?: Invitation };
    return payload.guest ?? null;
  } catch {
    return null;
  }
}
