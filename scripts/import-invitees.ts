/**
 * Carga la lista de preregistro desde el CSV del equipo.
 *
 *   npm run lista:importar -- "ruta/al/archivo.csv"      # solo enseña qué haría
 *   npm run lista:importar -- "ruta/al/archivo.csv" --aplicar
 *
 * **Por omisión no escribe nada.** Enseña cuántas filas entrarían, cuáles
 * cambian y, sobre todo, **quién sobra**: la lista manda, así que reimportar un
 * archivo al que alguien ya no pertenece tiene que poder quitarlo. Borrar sin
 * enseñar antes qué se borra es la forma más rápida de perder invitaciones.
 *
 * A quien ya reclamó su invitación —hay un registro colgado de ella— no se le
 * borra aunque desaparezca del archivo: eso dejaría a alguien confirmado sin
 * rastro de por qué. Se avisa y se deja para decidir a mano.
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { prisma } from '../src/lib/prisma';
import { readInvitees } from '../src/features/registration/lib/invitees-csv';

async function main() {
  const ruta = process.argv[2];
  const aplicar = process.argv.includes('--aplicar');

  if (!ruta) {
    console.error('Falta la ruta del CSV.\n  npm run lista:importar -- "archivo.csv" [--aplicar]');
    process.exitCode = 1;
    return;
  }

  const { rows, skipped } = readInvitees(readFileSync(ruta, 'utf8'));
  console.log(`archivo: ${ruta}`);
  console.log(`filas válidas: ${rows.length}`);

  if (skipped.length) {
    console.log(`\nfilas descartadas (${skipped.length}):`);
    for (const s of skipped) console.log(`  línea ${s.line}: ${s.reason}`);
  }
  if (!rows.length) return;

  const actuales = await prisma.invitee.findMany({
    select: { id: true, email: true, fullName: true, organization: true, attendee: { select: { email: true } } },
  });
  const porCorreo = new Map(actuales.map((i) => [i.email, i]));
  const enArchivo = new Set(rows.map((r) => r.email));

  const nuevas = rows.filter((r) => !porCorreo.has(r.email));
  const cambian = rows.filter((r) => {
    const actual = porCorreo.get(r.email);
    return actual && (actual.fullName !== r.fullName || actual.organization !== r.organization);
  });
  const sobran = actuales.filter((i) => !enArchivo.has(i.email));
  const sobranReclamadas = sobran.filter((i) => i.attendee);
  const sobranLibres = sobran.filter((i) => !i.attendee);

  console.log(`\nen la base ahora: ${actuales.length}`);
  console.log(`  nuevas:        ${nuevas.length}`);
  console.log(`  actualizadas:  ${cambian.length}`);
  console.log(`  sobran:        ${sobran.length} (${sobranLibres.length} se borrarían, ${sobranReclamadas.length} no)`);

  for (const i of nuevas.slice(0, 8)) console.log(`    + ${i.email} — ${i.fullName}`);
  if (nuevas.length > 8) console.log(`    + … y ${nuevas.length - 8} más`);
  for (const i of cambian.slice(0, 8)) console.log(`    ~ ${i.email} — ${i.fullName}`);
  for (const i of sobranLibres.slice(0, 8)) console.log(`    - ${i.email} — ${i.fullName}`);

  if (sobranReclamadas.length) {
    console.log('\n⚠ estas ya no están en el archivo pero **alguien las reclamó**, así que se conservan:');
    for (const i of sobranReclamadas) console.log(`    ! ${i.email} — ${i.fullName} (registrado: ${i.attendee!.email})`);
  }

  if (!aplicar) {
    console.log('\nNo se escribió nada. Añade --aplicar para hacerlo.');
    return;
  }

  for (const fila of rows) {
    await prisma.invitee.upsert({ where: { email: fila.email }, update: fila, create: fila });
  }
  const { count } = await prisma.invitee.deleteMany({
    where: { id: { in: sobranLibres.map((i) => i.id) } },
  });

  console.log(`\n✅ lista actualizada: ${rows.length} filas escritas, ${count} borradas.`);
  console.log(`   total en la base: ${await prisma.invitee.count()}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
