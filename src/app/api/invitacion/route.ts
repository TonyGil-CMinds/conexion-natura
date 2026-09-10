import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * Quién es el invitado detrás de un testigo.
 *
 * Es lo que abre el enlace del correo de invitación: con el testigo se sabe a
 * quién hay que completar el registro, sin que la dirección tenga que llevar el
 * correo —con el correo en la URL, cambiarlo a mano abriría el registro de otra
 * persona—.
 *
 * Devuelve **lo mínimo**: el nombre para saludar y el correo para no volver a
 * pedirlo. Nada más, aunque la fila tenga más columnas: esta ruta responde a
 * cualquiera que traiga un testigo válido.
 *
 * Un testigo que ya se usó no existe: se borra al completar el registro, así que
 * el enlace deja de servir en cuanto cumple su función.
 */
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get('token')?.trim();
  if (!token) return NextResponse.json({ error: 'Falta el testigo.' }, { status: 400 });

  try {
    const guest = await prisma.attendee.findUnique({
      where: { inviteToken: token },
      select: { name: true, email: true, status: true, invitedBy: { select: { name: true } } },
    });

    if (!guest || guest.status !== 'PENDING') {
      return NextResponse.json({ error: 'Esa invitación ya no es válida.' }, { status: 404 });
    }

    return NextResponse.json({
      guest: { name: guest.name, email: guest.email, host: guest.invitedBy?.name ?? null },
    });
  } catch (error) {
    console.error('[api/invitacion] no se pudo leer', error);
    return NextResponse.json({ error: 'No se pudo comprobar la invitación.' }, { status: 500 });
  }
}
