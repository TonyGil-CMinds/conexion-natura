/**
 * La lista de espera: verla y resolverla.
 *
 *   npm run rsvp                          # quién espera, en la consola
 *   npm run rsvp -- --csv                 # lo mismo en CSV, para una hoja
 *   npm run rsvp -- --aprobar correo@x    # le da lugar y le manda la confirmación
 *   npm run rsvp -- --aprobar correo@x --sin-correo
 *
 * Aprobar hace tres cosas, en este orden: pasa la fila a `CONFIRMED`, saca a su
 * acompañante de la espera y le manda **su** invitación para que complete el
 * registro, y por último manda la confirmación a quien esperaba. El orden
 * importa: si el correo falla, el lugar ya está dado y `npm run mail:pending` lo
 * recupera; al revés, un fallo dejaría a alguien con un correo que promete un
 * lugar que no tiene.
 */
import 'dotenv/config';
import { randomUUID } from 'node:crypto';
import { prisma } from '../src/lib/prisma';
import { sendConfirmation } from '../src/features/registration/lib/confirmation-email';
import { inviteTemplateData } from '../src/features/registration/lib/invite-email';
import { sendTemplate } from '../src/lib/resend';

/** Una celda de CSV: comillas si trae coma, comilla o salto de línea. */
function celda(valor: string): string {
  return /[",\n]/.test(valor) ? `"${valor.replace(/"/g, '""')}"` : valor;
}

async function listar(comoCsv: boolean) {
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
  const anfitriones = filas.filter((f) => !f.invitedById);

  if (comoCsv) {
    const cabecera = ['Correo', 'Nombre', 'Apellido', 'Organización', 'Cargo', 'Actos', 'Acompañante', 'Correo acompañante', 'Avisado', 'Fecha'];
    console.log(cabecera.join(','));
    for (const f of anfitriones) {
      console.log([
        f.email, f.name, f.surname, f.organization, f.role,
        f.events.join(' + '),
        f.guests[0]?.name ?? '', f.guests[0]?.email ?? '',
        f.waitlistSentAt ? 'sí' : 'no',
        f.createdAt.toISOString().slice(0, 10),
      ].map(celda).join(','));
    }
    return;
  }

  console.log(`en lista de espera: ${anfitriones.length}` +
    (filas.length !== anfitriones.length ? ` (+${filas.length - anfitriones.length} acompañantes)` : ''));
  for (const f of anfitriones) {
    const guest = f.guests[0];
    console.log(
      `  ${f.email}\n    ${f.name} ${f.surname} — ${f.organization || 'sin organización'}` +
        `\n    actos: ${f.events.join(' + ') || 'ninguno'}` +
        (guest ? `\n    acompañante: ${guest.name} <${guest.email}>` : '') +
        `\n    aviso enviado: ${f.waitlistSentAt ? 'sí' : 'NO'}`,
    );
  }
  if (anfitriones.length) {
    console.log('\nPara dar lugar a alguien:\n  npm run rsvp -- --aprobar ' + anfitriones[0]!.email);
  }
}

async function aprobar(correo: string, mandarCorreo: boolean) {
  const email = correo.trim().toLowerCase();
  const persona = await prisma.attendee.findUnique({
    where: { email },
    select: {
      id: true, email: true, name: true, surname: true, status: true, events: true,
      confirmationSentAt: true,
      guests: { select: { id: true, name: true, email: true, status: true, inviteToken: true, inviteSentAt: true } },
    },
  });

  if (!persona) {
    console.error(`No hay ningún registro con ${email}.`);
    process.exitCode = 1;
    return;
  }
  if (persona.status === 'CONFIRMED') {
    console.log(`${email} ya estaba confirmado. No se hace nada.`);
    return;
  }

  await prisma.attendee.update({ where: { id: persona.id }, data: { status: 'CONFIRMED' } });
  console.log(`✅ ${email} pasa a confirmado.`);

  /**
   * Su acompañante esperaba con él. Ahora sí puede recibir su invitación: hasta
   * este momento habría sido prometerle un lugar que su anfitrión no tenía.
   */
  for (const guest of persona.guests) {
    if (guest.status !== 'WAITLIST') continue;
    const token = guest.inviteToken ?? randomUUID();
    await prisma.attendee.update({
      where: { id: guest.id },
      data: { status: 'PENDING', inviteToken: token },
    });
    console.log(`   su acompañante ${guest.email} pasa a pendiente de completar.`);

    if (!mandarCorreo || guest.inviteSentAt) continue;
    const { data, missing } = inviteTemplateData({
      host: `${persona.name} ${persona.surname}`,
      guest: guest.name,
      token,
      locale: 'es',
    });
    if (missing.length) {
      console.warn(`   ⚠ no se le pudo invitar: faltan ${missing.join(', ')}`);
      continue;
    }
    const envio = await sendTemplate({ to: guest.email, data, template: 'invite' });
    if (envio.status === 'sent') {
      await prisma.attendee.update({ where: { id: guest.id }, data: { inviteSentAt: new Date() } });
      console.log('   invitación enviada a su acompañante.');
    } else {
      console.warn(`   ⚠ la invitación no salió: ${JSON.stringify(envio)}`);
    }
  }

  if (!mandarCorreo) {
    console.log('   (--sin-correo: no se manda la confirmación)');
    return;
  }
  if (persona.confirmationSentAt) {
    console.log('   ya se le había mandado la confirmación; no se repite.');
    return;
  }

  const envio = await sendConfirmation({
    id: persona.id,
    email: persona.email,
    name: persona.name,
    surname: persona.surname,
    events: persona.events,
  });
  console.log(`   confirmación: ${envio.status}${'reason' in envio && envio.reason ? ` (${envio.reason})` : ''}`);
}

async function main() {
  const args = process.argv.slice(2);
  const i = args.indexOf('--aprobar');
  if (i >= 0) {
    const correo = args[i + 1];
    if (!correo) {
      console.error('Falta el correo.\n  npm run rsvp -- --aprobar alguien@dominio.com');
      process.exitCode = 1;
      return;
    }
    await aprobar(correo, !args.includes('--sin-correo'));
    return;
  }
  await listar(args.includes('--csv'));
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
