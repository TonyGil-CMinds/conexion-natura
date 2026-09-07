import { NextResponse, after } from 'next/server';
import { parseAttendeeInput } from '@/features/registration/lib/attendee-input';
import { confirmationTemplateData } from '@/features/registration/lib/confirmation-email';
import { isLocale, DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { prisma } from '@/lib/prisma';
import { sendTemplate } from '@/lib/sendgrid';

/**
 * Registro de asistentes.
 *
 * `POST` crea o actualiza por **correo**: el correo identifica a la persona, y
 * quien vuelve a enviar el formulario está corrigiendo sus datos, no
 * apuntándose dos veces. De ahí el `upsert` en vez de un `create` que fallaría
 * con «ya existe».
 *
 * Todavía no hay invitaciones: el registro está abierto. Cuando las haya, el
 * código entra aquí como requisito y se ata en `invitationId`.
 */

/** Lo que se devuelve al navegador. La fila tiene más columnas de las que hacen falta. */
const SELECT = {
  id: true,
  name: true,
  surname: true,
  email: true,
  organization: true,
  role: true,
  linkedin: true,
  photoUrl: true,
} as const;

/**
 * Manda el correo de confirmación **una sola vez** por persona.
 *
 * La marca vive en la fila (`confirmationSentAt`) y no en memoria: reenviar el
 * formulario corrige los datos y no debe repetir el correo, y si el envío falla
 * la marca se queda nula, así que un intento posterior lo vuelve a probar.
 *
 * Un fallo de SendGrid **no** rompe el registro: la fila ya está guardada y el
 * correo es un efecto secundario. Se anota en el registro del servidor y se sigue.
 */
async function sendConfirmation({
  id,
  email,
  name,
  surname,
  locale,
}: {
  id: string;
  email: string;
  name: string;
  surname: string;
  locale: Locale;
}) {
  try {
    await sendTemplate({
      to: email,
      data: confirmationTemplateData({ name, surname, locale }),
    });
    await prisma.attendee.update({
      where: { id },
      data: { confirmationSentAt: new Date() },
    });
  } catch (error) {
    /**
     * El cuerpo de la respuesta es lo que dice el motivo real: SendGrid manda
     * «Maximum credits exceeded» con un 401, cuyo mensaje suelto es solo
     * «Unauthorized» y hace pensar en la clave.
     */
    const body = (error as { response?: { body?: unknown } })?.response?.body;
    console.error('[api/registro] no se pudo enviar la confirmación', body ?? error);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido: se esperaba JSON.' }, { status: 400 });
  }

  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
  if (!publicBaseUrl) {
    console.error('[api/registro] falta R2_PUBLIC_BASE_URL');
    return NextResponse.json({ error: 'El servidor no está configurado.' }, { status: 500 });
  }

  const parsed = parseAttendeeInput(body, { publicBaseUrl });
  if (parsed.errors) {
    return NextResponse.json({ error: 'Revisa los datos marcados.', fields: parsed.errors }, { status: 422 });
  }

  const { email, ...rest } = parsed.data;
  // El idioma solo decide a qué versión del sitio apuntan los enlaces del correo.
  const rawLocale = (body as { locale?: unknown }).locale;
  const locale = typeof rawLocale === 'string' && isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;

  try {
    const attendee = await prisma.attendee.upsert({
      where: { email },
      // Al corregir no se borra la foto anterior si esta vez no viene ninguna.
      update: { ...rest, photoUrl: rest.photoUrl ?? undefined },
      create: { email, ...rest },
      select: { ...SELECT, confirmationSentAt: true },
    });

    if (!attendee.confirmationSentAt) {
      // `after` lo deja para cuando la respuesta ya salió: el formulario no tiene
      // que esperar al correo para decir que quedó confirmado.
      after(() => sendConfirmation({ id: attendee.id, email, name: attendee.name, surname: attendee.surname, locale }));
    }

    const { confirmationSentAt: _sent, ...payload } = attendee;
    return NextResponse.json({ attendee: payload });
  } catch (error) {
    console.error('[api/registro] no se pudo guardar', error);
    return NextResponse.json({ error: 'No se pudo guardar el registro.' }, { status: 500 });
  }
}

/**
 * Consulta un registro por correo, para que quien vuelva al sitio en otro
 * dispositivo pueda recuperar su perfil. Hoy nadie la llama: el navegador se
 * apoya en `localStorage`. Queda como la mitad que le falta a ese apaño.
 */
export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get('email')?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: 'Falta el correo.' }, { status: 400 });

  try {
    const attendee = await prisma.attendee.findUnique({ where: { email }, select: SELECT });
    if (!attendee) return NextResponse.json({ error: 'No hay registro con ese correo.' }, { status: 404 });
    return NextResponse.json({ attendee });
  } catch (error) {
    console.error('[api/registro] no se pudo leer', error);
    return NextResponse.json({ error: 'No se pudo consultar el registro.' }, { status: 500 });
  }
}
