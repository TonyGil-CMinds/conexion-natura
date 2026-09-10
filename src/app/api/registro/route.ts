import { NextResponse } from 'next/server';
import { parseAttendeeInput, type EventChoice } from '@/features/registration/lib/attendee-input';
import { confirmationTemplateData } from '@/features/registration/lib/confirmation-email';
import { inviteTemplateData } from '@/features/registration/lib/invite-email';
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
  /** Los actos elegidos: la bienvenida enseña los que se marcaron. */
  events: true,
  /**
   * El invitado y en qué punto está. La pantalla final de quien invita dice si
   * su invitado ya completó su registro o sigue pendiente, y sin eso quien
   * invita no tiene forma de saberlo.
   */
  guests: { select: { name: true, email: true, status: true }, orderBy: { createdAt: 'asc' } },
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
  events,
}: {
  id: string;
  email: string;
  name: string;
  surname: string;
  /** A qué actos va: la plantilla pinta un bloque por cada uno. */
  events: readonly EventChoice[];
}): Promise<{ status: 'sent' | 'skipped' | 'failed'; reason?: string }> {
  const { data, missing } = confirmationTemplateData({ name, surname, events });

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

/**
 * Deja lista la invitación del acompañante y le manda su correo.
 *
 * El invitado entra en la lista como un asistente **pendiente**: de él solo se
 * sabe el nombre y el correo, y el resto lo rellenará él desde el enlace. Por
 * eso no es un modelo aparte —necesita lo mismo que cualquier asistente: sus
 * actos, su fotografía, su credencial—.
 *
 * Tres casos, y los tres importan:
 *
 * - **Ya está confirmado**: no se toca nada. Quien ya completó su registro no
 *   puede volver a pendiente porque otra persona lo haya apuntado, y menos
 *   perder sus datos.
 * - **Ya estaba pendiente**: se actualiza el nombre y se conserva su testigo,
 *   así que el enlace que ya recibió sigue funcionando. El correo solo se
 *   reenvía si no había salido.
 * - **No existe**: se crea con su testigo y se le manda la invitación.
 *
 * **Nunca lanza.** El registro de quien invita ya está guardado, y un fallo aquí
 * no puede convertirse en un «no te has registrado» en pantalla.
 */
async function inviteGuest({
  host,
  guest,
}: {
  host: { id: string; name: string; surname: string };
  guest: { name: string; email: string };
}): Promise<{ status: 'sent' | 'skipped' | 'failed'; reason?: string }> {
  try {
    const existing = await prisma.attendee.findUnique({
      where: { email: guest.email },
      select: { id: true, status: true, inviteToken: true, inviteSentAt: true },
    });

    if (existing?.status === 'CONFIRMED') {
      return { status: 'skipped', reason: 'guestAlreadyRegistered' };
    }

    /**
     * El testigo se genera aquí y no en el cliente: es la llave del registro de
     * otra persona. `randomUUID` viene del módulo de criptografía del entorno,
     * no de `Math.random`.
     */
    const token = existing?.inviteToken ?? crypto.randomUUID();

    const row = await prisma.attendee.upsert({
      where: { email: guest.email },
      update: { name: guest.name, invitedById: host.id, inviteToken: token },
      create: {
        email: guest.email,
        name: guest.name,
        status: 'PENDING',
        inviteToken: token,
        invitedById: host.id,
      },
      select: { id: true, inviteSentAt: true },
    });

    // Ya se le había mandado: no se repite el correo por reenviar el formulario.
    if (row.inviteSentAt) return { status: 'skipped', reason: 'inviteAlreadySent' };

    const { data, missing } = inviteTemplateData({
      host: `${host.name} ${host.surname}`,
      guest: guest.name,
      token,
    });
    if (missing.length) {
      console.error(`[api/registro] invitación omitida: faltan datos (${missing.join(', ')})`);
      return { status: 'skipped', reason: 'missingInviteDetails' };
    }

    const result = await sendTemplate({ to: guest.email, data, template: 'invite' });
    if (result.status !== 'sent') {
      const reason =
        'missing' in result ? `${result.reason}: ${result.missing.join(', ')}` : result.reason;
      console.error(`[api/registro] no se pudo invitar a ${guest.email} — ${reason}`);
      return { status: result.status, reason: result.reason };
    }

    try {
      await prisma.attendee.update({ where: { id: row.id }, data: { inviteSentAt: new Date() } });
    } catch (error) {
      // El correo salió; solo se perdió la marca. Peor sería decir que falló.
      console.error('[api/registro] invitación enviada pero no se pudo marcar', error);
    }
    return { status: 'sent' };
  } catch (error) {
    console.error('[api/registro] no se pudo preparar la invitación', error);
    return { status: 'failed', reason: 'inviteFailed' };
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

  const { email, guest, ...rest } = parsed.data;
  try {
    const attendee = await prisma.attendee.upsert({
      where: { email },
      /**
       * Al corregir no se borra la foto anterior si esta vez no viene ninguna, y
       * una lista de actos vacía no borra la ya elegida: el formulario puede
       * reenviarse desde un paso que no pregunta por eso.
       *
       * Y aquí es donde una invitación **deja de estar pendiente**: quien llega
       * por el enlace completa este mismo formulario, así que confirmar es lo
       * mismo para todos. El testigo se borra al usarlo, de modo que el enlace
       * del correo no vuelve a abrir el registro de nadie.
       */
      update: {
        ...rest,
        photoUrl: rest.photoUrl ?? undefined,
        events: rest.events.length ? rest.events : undefined,
        status: 'CONFIRMED',
        inviteToken: null,
      },
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
          events: attendee.events,
        }),
        new Promise<{ status: 'failed'; reason: string }>((resolve) =>
          setTimeout(() => resolve({ status: 'failed', reason: 'timeout' }), EMAIL_TIMEOUT_MS),
        ),
      ]);
    }

    /**
     * La invitación va **después** del `upsert` porque hasta entonces no se
     * conoce el id de quien invita, y se espera con el mismo tope que la
     * confirmación: en serverless la instancia se congela al responder, así que
     * una promesa suelta se quedaría a medias y el invitado nunca sabría nada.
     */
    let invited: { status: 'sent' | 'skipped' | 'failed'; reason?: string } = {
      status: 'skipped',
      reason: 'noGuest',
    };
    if (rest.bringsGuest && guest) {
      invited = await Promise.race([
        inviteGuest({
          host: { id: attendee.id, name: attendee.name, surname: attendee.surname },
          guest,
        }),
        new Promise<{ status: 'failed'; reason: string }>((resolve) =>
          setTimeout(() => resolve({ status: 'failed', reason: 'timeout' }), EMAIL_TIMEOUT_MS),
        ),
      ]);
    }

    /**
     * Si dijo que no trae invitado, se retira la invitación que hubiera hecho
     * antes —pero **solo si sigue pendiente y la hizo esta persona**: a alguien
     * que ya completó su registro no se le borra la fila porque quien lo invitó
     * cambie de idea—.
     */
    if (!rest.bringsGuest) {
      await prisma.attendee.deleteMany({
        where: { invitedById: attendee.id, status: 'PENDING' },
      });
    }

    /** Se relee: la invitación pudo añadir o quitar filas del listado. */
    const fresh = await prisma.attendee.findUnique({ where: { id: attendee.id }, select: SELECT });
    const { confirmationSentAt: _sent, ...upserted } = attendee;
    const payload = fresh ?? upserted;
    /**
     * `emailed` e `invited` son **diagnóstico**, no resultado del registro: el 201 dice que la
     * fila está guardada, y eso ya no depende del correo. El cliente no debe
     * leerlo como fallo ni enseñar un error por él.
     */
    return NextResponse.json({ attendee: payload, emailed, invited }, { status: 201 });
  } catch (error) {
    console.error('[api/registro] no se pudo guardar', error);
    return NextResponse.json({ error: 'No se pudo guardar el registro.' }, { status: 500 });
  }
}

/**
 * Cambia **solo la fotografía** de un registro que ya existe.
 *
 * Va aparte del `POST` y no reenviando el formulario entero porque cambiar el
 * retrato no es volver a registrarse: por el `POST` habría que mandar de nuevo
 * todos los campos, y los que no se conocen desde la pantalla de bienvenida
 * —si viene acompañante y con qué datos— se perderían por el camino. Aquí solo
 * se toca una columna.
 *
 * La URL tiene que estar bajo la base pública del bucket, igual que en el
 * registro: si no, esto sería un sitio donde colgar la imagen que uno quiera en
 * la credencial de otra persona.
 */
export async function PATCH(request: Request) {
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

  const raw = (body ?? {}) as Record<string, unknown>;
  const email = typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : '';
  const photoUrl = typeof raw.photoUrl === 'string' ? raw.photoUrl.trim() : '';

  if (!email) return NextResponse.json({ error: 'Falta el correo.' }, { status: 400 });
  if (!photoUrl.startsWith(`${publicBaseUrl.replace(/\/+$/, '')}/`)) {
    return NextResponse.json(
      { error: 'La imagen no proviene del almacenamiento del sitio.' },
      { status: 422 },
    );
  }

  try {
    const attendee = await prisma.attendee.update({
      where: { email },
      data: { photoUrl },
      select: SELECT,
    });
    return NextResponse.json({ attendee });
  } catch (error) {
    // `update` sin fila lanza; para quien llama es un «no existe», no un fallo.
    if ((error as { code?: string }).code === 'P2025') {
      return NextResponse.json({ error: 'No hay registro con ese correo.' }, { status: 404 });
    }
    console.error('[api/registro] no se pudo cambiar la imagen', error);
    return NextResponse.json({ error: 'No se pudo guardar la imagen.' }, { status: 500 });
  }
}

/**
 * Consulta un registro por correo, para que quien vuelva al sitio en otro
 * dispositivo pueda recuperar su perfil. Es lo que decide, en el primer paso,
 * si hay que registrar a alguien o si ya está.
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
