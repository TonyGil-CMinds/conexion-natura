import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { approveWaitlist, listWaitlist } from '@/features/registration/lib/approve-waitlist';

/**
 * La lista de espera, para la app del equipo.
 *
 * `GET`  devuelve quién espera.
 * `POST` con `{ "email": "..." }` le da el lugar: pasa la fila a confirmada,
 *        saca a su acompañante de la espera con su invitación, y manda los
 *        correos. Es **el mismo acto** que `npm run rsvp -- --aprobar`, porque
 *        los dos llaman al mismo módulo.
 *
 * **Con llave.** Esto reparte lugares y manda correos en nombre del evento, así
 * que no puede quedar abierto: hace falta `Authorization: Bearer <token>` con el
 * valor de `CEIBA_RSVP_TOKEN`. Sin la variable configurada la ruta responde 503
 * y no hace nada: preferible a quedarse abierta por un despiste de despliegue.
 */

/** Compara en tiempo constante: una comparación normal filtra el token a tientas. */
function tokenOk(header: string | null): boolean {
  const esperado = process.env.CEIBA_RSVP_TOKEN;
  if (!esperado) return false;

  const recibido = header?.startsWith('Bearer ') ? header.slice(7).trim() : '';
  if (!recibido) return false;

  const a = Buffer.from(recibido);
  const b = Buffer.from(esperado);
  // `timingSafeEqual` exige el mismo largo, y el largo en sí ya es una pista
  // menor; se iguala comparando primero la longitud y siempre haciendo el resto.
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function guard(request: Request): NextResponse | null {
  if (!process.env.CEIBA_RSVP_TOKEN) {
    console.error('[api/rsvp] falta CEIBA_RSVP_TOKEN: la ruta queda cerrada');
    return NextResponse.json({ error: 'El servidor no está configurado.' }, { status: 503 });
  }
  if (!tokenOk(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  return null;
}

export async function GET(request: Request) {
  const cerrado = guard(request);
  if (cerrado) return cerrado;

  try {
    const filas = await listWaitlist();
    return NextResponse.json({
      count: filas.length,
      waitlist: filas.map((f) => ({
        email: f.email,
        name: f.name,
        surname: f.surname,
        organization: f.organization,
        role: f.role,
        events: f.events,
        guest: f.guests[0] ? { name: f.guests[0].name, email: f.guests[0].email } : null,
        noticeSent: Boolean(f.waitlistSentAt),
        registeredAt: f.createdAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('[api/rsvp] no se pudo leer la lista de espera', error);
    return NextResponse.json({ error: 'No se pudo leer la lista.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cerrado = guard(request);
  if (cerrado) return cerrado;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido: se esperaba JSON.' }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const email = typeof raw.email === 'string' ? raw.email.trim() : '';
  if (!email) return NextResponse.json({ error: 'Falta el correo.' }, { status: 400 });

  /** Para probar desde la app sin que salga ningún correo. */
  const sendEmails = raw.sendEmails !== false;

  try {
    const result = await approveWaitlist(email, {
      sendEmails,
      locale: raw.locale === 'en' ? 'en' : 'es',
    });

    if (!result.ok) {
      const status = result.reason === 'notFound' ? 404 : 409;
      return NextResponse.json({ error: result.reason }, { status });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('[api/rsvp] no se pudo aprobar', error);
    return NextResponse.json({ error: 'No se pudo aprobar.' }, { status: 500 });
  }
}
