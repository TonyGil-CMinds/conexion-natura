import { randomUUID } from 'node:crypto';
import { prisma } from '@/lib/prisma';
import { sendConfirmation } from './confirmation-email';
import { inviteTemplateData } from './invite-email';
import { sendTemplate } from '@/lib/resend';

/**
 * Dar un lugar a quien estaba en lista de espera.
 *
 * Vive aquí y no dentro del script ni de la ruta porque lo usan los dos —la
 * consola y la app del equipo— y son exactamente el mismo acto: si cada uno lo
 * escribiera por su cuenta, tarde o temprano uno mandaría el correo y el otro no.
 *
 * El orden importa y no es casual:
 *
 * 1. La fila pasa a `CONFIRMED`. **Primero esto.** Si luego falla el correo, el
 *    lugar ya está dado y se recupera con `npm run mail:pending`; al revés, un
 *    fallo dejaría a alguien con un correo prometiendo un lugar que no tiene.
 * 2. Su acompañante sale de la espera y recibe **su** invitación, que hasta este
 *    momento habría sido prometerle sitio en nombre de alguien que no lo tenía.
 * 3. La confirmación a quien esperaba.
 *
 * **No lanza por un correo.** Devuelve qué pasó con cada uno para que quien
 * llame lo pueda enseñar.
 */

export type ApproveResult =
  | { ok: false; reason: 'notFound' }
  | { ok: false; reason: 'alreadyConfirmed' }
  | {
      ok: true;
      email: string;
      /** Qué pasó con la confirmación y con la invitación del acompañante. */
      confirmation: { status: string; reason?: string };
      guest: { email: string; status: string; invite: { status: string; reason?: string } } | null;
    };

export async function approveWaitlist(
  correo: string,
  options: { sendEmails?: boolean; locale?: 'es' | 'en' } = {},
): Promise<ApproveResult> {
  const { sendEmails = true, locale = 'es' } = options;
  const email = correo.trim().toLowerCase();

  const persona = await prisma.attendee.findUnique({
    where: { email },
    select: {
      id: true, email: true, name: true, surname: true, status: true, events: true,
      confirmationSentAt: true,
      guests: {
        select: { id: true, name: true, email: true, status: true, inviteToken: true, inviteSentAt: true },
      },
    },
  });

  if (!persona) return { ok: false, reason: 'notFound' };
  if (persona.status === 'CONFIRMED') return { ok: false, reason: 'alreadyConfirmed' };

  await prisma.attendee.update({ where: { id: persona.id }, data: { status: 'CONFIRMED' } });

  /** El acompañante que esperaba con él. Hoy el formulario solo deja uno. */
  let guest: ApproveResult extends { ok: true } ? never : never;
  let guestResult: (ApproveResult & { ok: true })['guest'] = null;

  for (const acompanante of persona.guests) {
    if (acompanante.status !== 'WAITLIST') continue;
    const token = acompanante.inviteToken ?? randomUUID();
    await prisma.attendee.update({
      where: { id: acompanante.id },
      data: { status: 'PENDING', inviteToken: token },
    });

    let invite: { status: string; reason?: string } = { status: 'skipped', reason: 'noEmails' };
    if (sendEmails && !acompanante.inviteSentAt) {
      const { data, missing } = inviteTemplateData({
        host: `${persona.name} ${persona.surname}`.trim(),
        guest: acompanante.name,
        token,
        locale,
      });
      if (missing.length) invite = { status: 'skipped', reason: `missing: ${missing.join(', ')}` };
      else {
        const envio = await sendTemplate({ to: acompanante.email, data, template: 'invite' });
        invite = { status: envio.status, reason: 'reason' in envio ? envio.reason : undefined };
        if (envio.status === 'sent') {
          await prisma.attendee.update({
            where: { id: acompanante.id },
            data: { inviteSentAt: new Date() },
          });
        }
      }
    } else if (acompanante.inviteSentAt) invite = { status: 'skipped', reason: 'alreadySent' };

    guestResult = { email: acompanante.email, status: 'PENDING', invite };
    break;
  }
  void guest;

  let confirmation: { status: string; reason?: string } = { status: 'skipped', reason: 'noEmails' };
  if (sendEmails && !persona.confirmationSentAt) {
    const envio = await sendConfirmation({
      id: persona.id,
      email: persona.email,
      name: persona.name,
      surname: persona.surname,
      events: persona.events,
    });
    confirmation = { status: envio.status, reason: envio.reason };
  } else if (persona.confirmationSentAt) {
    confirmation = { status: 'skipped', reason: 'alreadySent' };
  }

  return { ok: true, email: persona.email, confirmation, guest: guestResult };
}

/** Quién está esperando. Lo leen la consola y la app del equipo. */
export async function listWaitlist() {
  const filas = await prisma.attendee.findMany({
    where: { status: 'WAITLIST' },
    orderBy: { createdAt: 'asc' },
    select: {
      email: true, name: true, surname: true, organization: true, role: true,
      events: true, bringsGuest: true, waitlistSentAt: true, createdAt: true,
      invitedById: true,
      guests: { select: { name: true, email: true } },
    },
  });

  /** Quien entró como acompañante de otro no es una solicitud propia. */
  return filas.filter((f) => !f.invitedById);
}
