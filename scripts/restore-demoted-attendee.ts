/**
 * Devuelve a CONFIRMED a quien perdió ese estado sin que nadie lo decidiera, y
 * le pone al día del cambio de hora.
 *
 *   npm run asistente:restaurar -- correo@ejemplo.com
 *   npm run asistente:restaurar -- correo@ejemplo.com --aplicar
 *
 * **Por omisión no escribe ni envía nada.**
 *
 * Existe por un fallo del flujo de invitaciones: cuando alguien que **ya estaba
 * confirmado** es invitado como acompañante por otra persona, su fila se
 * reescribe como PENDING. Nadie lo echó de la lista, pero deja de contar como
 * asistente —y por tanto deja de recibir los avisos que se mandan a quien va—.
 *
 * Esto repara el caso; la causa sigue en pie y es lo que habría que arreglar
 * después, porque puede volver a pasar con cualquiera.
 *
 * Solo toca a quien cumple las dos condiciones: está en PENDING **y** quien le
 * invitó está confirmado. Sin la segunda, confirmar sería inventar una plaza en
 * vez de devolver la que ya tenía.
 *
 * El aviso de hora se apunta en el mismo registro que el envío masivo, así que
 * no puede duplicarse ni quedar fuera de la cuenta.
 */
import 'dotenv/config';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { prisma } from '../src/lib/prisma';
import { sendHtml } from '../src/lib/resend';
import { timeChangeEmail } from '../src/features/registration/lib/time-change-email';

const REGISTRO = 'scripts/data/time-change-sent.json';

function leerRegistro(): Record<string, string> {
  return existsSync(REGISTRO) ? JSON.parse(readFileSync(REGISTRO, 'utf8')) : {};
}

/** El nombre de pila, con la inicial en mayúscula. */
function tratamiento(name: string): string {
  const pila = name.trim().split(/\s+/)[0] ?? '';
  return pila ? pila[0]!.toUpperCase() + pila.slice(1) : pila;
}

async function main() {
  const email = process.argv.find((a) => a.includes('@'))?.trim().toLowerCase();
  const aplicar = process.argv.includes('--aplicar');

  if (!email) {
    console.error('Falta el correo.\n  npm run asistente:restaurar -- correo@ejemplo.com [--aplicar]');
    process.exitCode = 1;
    return;
  }

  const persona = await prisma.attendee.findUnique({
    where: { email },
    select: {
      email: true, name: true, surname: true, status: true, events: true,
      createdAt: true, updatedAt: true,
      invitedBy: { select: { email: true, name: true, status: true } },
    },
  });

  if (!persona) {
    console.error(`No hay ningún registro con ${email}.`);
    process.exitCode = 1;
    return;
  }

  const yaAvisada = Boolean(leerRegistro()[persona.email]);

  console.log(`${persona.name} ${persona.surname}`.trim());
  console.log(`  correo    : ${persona.email}`);
  console.log(`  estado    : ${persona.status}`);
  console.log(`  actos     : ${persona.events.join(', ') || '(ninguno)'}`);
  console.log(`  alta      : ${persona.createdAt.toISOString().slice(0, 16)}`);
  console.log(`  último cambio: ${persona.updatedAt.toISOString().slice(0, 16)}`);
  console.log(`  le invitó : ${persona.invitedBy ? `${persona.invitedBy.name} <${persona.invitedBy.email}> (${persona.invitedBy.status})` : 'nadie'}`);
  console.log(`  aviso de hora: ${yaAvisada ? 'ya lo tiene' : 'le falta'}`);

  if (persona.status === 'CONFIRMED' && yaAvisada) {
    console.log('\nNada que hacer: está confirmada y ya recibió el aviso.');
    return;
  }

  if (persona.status !== 'CONFIRMED' && persona.invitedBy?.status !== 'CONFIRMED') {
    console.error('\n❌ No está en PENDING por una invitación de alguien confirmado.');
    console.error('   Confirmarla sería darle una plaza, no devolverle la suya. No se toca.');
    process.exitCode = 1;
    return;
  }

  console.log('\nse haría:');
  if (persona.status !== 'CONFIRMED') console.log(`  · ${persona.status} → CONFIRMED`);
  if (!yaAvisada) console.log(`  · mandarle el aviso de cambio de hora`);

  if (!aplicar) {
    console.log('\nNo se escribió ni se envió nada. Añade --aplicar para hacerlo.');
    return;
  }

  if (persona.status !== 'CONFIRMED') {
    await prisma.attendee.update({ where: { email: persona.email }, data: { status: 'CONFIRMED' } });
    console.log(`\n✅ ${persona.email}: ${persona.status} → CONFIRMED`);
  }

  if (!yaAvisada) {
    // La lista permitida se cierra sobre esta única dirección.
    process.env.CEIBA_EMAIL_ALLOWLIST = persona.email;

    // La marca primero: si esto se cae, no lo recibe dos veces.
    const registro = leerRegistro();
    registro[persona.email] = new Date().toISOString();
    writeFileSync(REGISTRO, `${JSON.stringify(registro, null, 2)}\n`);

    const { subject, html, text } = timeChangeEmail({ name: tratamiento(persona.name), locale: 'es' });
    const r = await sendHtml({ to: persona.email, subject, html, text });

    if (r.status === 'sent') {
      console.log(`✅ aviso enviado (${r.id ?? 'sin id'}).`);
    } else {
      const vuelta = leerRegistro();
      delete vuelta[persona.email];
      writeFileSync(REGISTRO, `${JSON.stringify(vuelta, null, 2)}\n`);
      console.error(`❌ no se envió: ${JSON.stringify(r)}`);
      process.exitCode = 1;
    }
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
