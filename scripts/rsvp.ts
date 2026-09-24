/**
 * La lista de espera: verla y resolverla.
 *
 *   npm run rsvp                          # quién espera, en la consola
 *   npm run rsvp -- --csv                 # lo mismo en CSV, para una hoja
 *   npm run rsvp -- --aprobar correo@x    # le da lugar y le manda la confirmación
 *   npm run rsvp -- --aprobar correo@x --sin-correo
 *
 * Aprobar y listar viven en `features/registration/lib/approve-waitlist`, no
 * aquí: lo mismo lo hace la ruta `POST /api/rsvp` que llama la app del equipo, y
 * si cada uno lo escribiera por su cuenta, tarde o temprano uno mandaría el
 * correo y el otro no. Este archivo solo pregunta y lo cuenta en la consola.
 */
import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { approveWaitlist, listWaitlist } from '../src/features/registration/lib/approve-waitlist';

/** Una celda de CSV: comillas si trae coma, comilla o salto de línea. */
function celda(valor: string): string {
  return /[",\n]/.test(valor) ? `"${valor.replace(/"/g, '""')}"` : valor;
}

async function listar(comoCsv: boolean) {
  const filas = await listWaitlist();

  if (comoCsv) {
    const cabecera = ['Correo', 'Nombre', 'Apellido', 'Organización', 'Cargo', 'Actos', 'Acompañante', 'Correo acompañante', 'Avisado', 'Fecha'];
    console.log(cabecera.join(','));
    for (const f of filas) {
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

  console.log(`en lista de espera: ${filas.length}`);
  for (const f of filas) {
    const guest = f.guests[0];
    console.log(
      `  ${f.email}\n    ${f.name} ${f.surname} — ${f.organization || 'sin organización'}` +
        `\n    actos: ${f.events.join(' + ') || 'ninguno'}` +
        (guest ? `\n    acompañante: ${guest.name} <${guest.email}>` : '') +
        `\n    aviso enviado: ${f.waitlistSentAt ? 'sí' : 'NO'}`,
    );
  }
  if (filas.length) {
    console.log('\nPara dar lugar a alguien:\n  npm run rsvp -- --aprobar ' + filas[0]!.email);
  }
}

async function aprobar(correo: string, mandarCorreo: boolean) {
  const r = await approveWaitlist(correo, { sendEmails: mandarCorreo });

  if (!r.ok) {
    if (r.reason === 'notFound') {
      console.error(`No hay ningún registro con ${correo.trim().toLowerCase()}.`);
      process.exitCode = 1;
    } else {
      console.log(`${correo.trim().toLowerCase()} ya estaba confirmado. No se hace nada.`);
    }
    return;
  }

  console.log(`✅ ${r.email} pasa a confirmado.`);
  if (r.guest) {
    console.log(`   su acompañante ${r.guest.email} pasa a pendiente de completar.`);
    console.log(`   invitación: ${r.guest.invite.status}${r.guest.invite.reason ? ` (${r.guest.invite.reason})` : ''}`);
  }
  console.log(`   confirmación: ${r.confirmation.status}${r.confirmation.reason ? ` (${r.confirmation.reason})` : ''}`);
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
