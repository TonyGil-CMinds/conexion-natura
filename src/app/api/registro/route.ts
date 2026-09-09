import { NextResponse } from 'next/server';
import { parseAttendeeInput } from '@/features/registration/lib/attendee-input';
import { confirmationTemplateData } from '@/features/registration/lib/confirmation-email';
import { prisma } from '@/lib/prisma';
import { sendTemplate } from '@/lib/resend';

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

/** Tope de espera del correo. Pasado esto, el registro responde igual. */
const EMAIL_TIMEOUT_MS = 8000;

/**
 * Manda el correo de confirmación **una sola vez** por persona.
 *
 * La marca vive en la fila (`confirmationSentAt`) y no en memoria: reenviar el
 * formulario corrige los datos y no debe repetir el correo, y si el envío falla
 * la marca se queda nula, así que un intento posterior lo vuelve a probar.
 *
 * **Nunca lanza.** Devuelve qué pasó y ya. En este proyecto hubo un fallo caro
 * justo por lo contrario: el registro se guardaba, el correo fallaba, el cliente
 * lo leía como error y la gente se iba creyendo que no se había inscrito.
 *
 * Y **se omite si falta cualquier dato del evento**. Resend acepta y entrega un
 * envío con variables ausentes —queda un hueco vacío en el texto, sin error—, así
 * que esta puerta es lo único que impide anunciar el evento sin fecha.
 */
async function sendConfirmation({
  id,
  email,
  name,
  surname,
}: {
  id: string;
  email: string;
  name: string;
  surname: string;
}): Promise<{ status: 'sent' | 'skipped' | 'failed'; reason?: string }> {
  const { data, missing } = confirmationTemplateData({ name, surname });

  if (missing.length) {
    console.error(
      `[api/registro] correo omitido: faltan datos del evento (${missing.join(', ')})`,
    );
    return { status: 'skipped', reason: 'missingEventDetails' };
  }

  const result = await sendTemplate({ to: email, data });

  if (result.status !== 'sent') {
    const reason = 'missing' in result ? `${result.reason}: ${result.missing.join(', ')}` : result.reason;
    console.error(`[api/registro] no se pudo enviar la confirmación — ${reason}`);
    return { status: result.status, reason: result.reason };
  }

  try {
    await prisma.attendee.update({ where: { id }, data: { confirmationSentAt: new Date() } });
  } catch (error) {
    // El correo salió; solo se perdió la marca, y eso se arregla reenviando
    // pendientes. No es motivo para decir que el envío falló.
    console.error('[api/registro] correo enviado pero no se pudo marcar', error);
  }
  return { status: 'sent' };
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
  try {
    const attendee = await prisma.attendee.upsert({
      where: { email },
      // Al corregir no se borra la foto anterior si esta vez no viene ninguna.
      update: { ...rest, photoUrl: rest.photoUrl ?? undefined },
      create: { email, ...rest },
      select: { ...SELECT, confirmationSentAt: true },
    });

    /**
     * El correo **se espera**, pero con tope.
     *
     * Sin esperarlo no hay garantía de que salga: en serverless la instancia se
     * congela en cuanto se devuelve la respuesta, y una promesa suelta se queda a
     * medias. Y con tope porque el registro no puede depender de lo que tarde un
     * tercero: pasados los 8s se responde igual y la marca se queda nula, así que
     * `npm run mail:pending` lo recupera.
     */
    let emailed: { status: 'sent' | 'skipped' | 'failed'; reason?: string } = {
      status: 'skipped',
      reason: 'alreadySent',
    };
    if (!attendee.confirmationSentAt) {
      emailed = await Promise.race([
        sendConfirmation({
          id: attendee.id,
          email,
          name: attendee.name,
          surname: attendee.surname,
        }),
        new Promise<{ status: 'failed'; reason: string }>((resolve) =>
          setTimeout(() => resolve({ status: 'failed', reason: 'timeout' }), EMAIL_TIMEOUT_MS),
        ),
      ]);
    }

    const { confirmationSentAt: _sent, ...payload } = attendee;
    /**
     * `emailed` es **diagnóstico**, no resultado del registro: el 201 dice que la
     * fila está guardada, y eso ya no depende del correo. El cliente no debe
     * leerlo como fallo ni enseñar un error por él.
     */
    return NextResponse.json({ attendee: payload, emailed }, { status: 201 });
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
