/**
 * Corrige el registro de Ecuador del Proyecto Amazónico Shuar – AEI.
 *
 *   npm run ecuador:aei              # solo enseña qué haría
 *   npm run ecuador:aei -- --aplicar
 *
 * Lo pidió la propia organización: cambia quién va, no cómo funciona nada. Va
 * como script y no a mano contra la base para que quede qué se tocó y por qué,
 * y para poder verlo antes de escribir.
 *
 * Tres cosas:
 *
 * 1. El correo de la titular pasa a `gerenciaproyecto@aei.network`. **Es la
 *    clave del registro**, así que esto no es editar un campo: es mover la fila
 *    a otra identidad. Por eso se comprueba antes que la dirección nueva no
 *    exista ya, o el cambio chocaría contra el índice único.
 * 2. El acompañante deja de ser Emilio Erráez y pasa a ser Mauricio Pujupat.
 * 3. Se añade una segunda fila para los dos cupos que pidieron: Javier Dias con
 *    Guillermina Anaguachi de acompañante.
 *
 * **Las cédulas no se guardan.** El modelo no tiene dónde ponerlas y no hacen
 * falta para el registro: son para el control de acceso de la sede, que es otro
 * sistema. Inventar una columna para un dato que el sitio no usa sería guardar
 * identificación personal sin motivo.
 *
 * **No manda ningún correo.** La fila nueva nace sin marca de confirmación, que
 * es la verdad: nadie le ha escrito. Avisar es otro acto y va por su cuenta.
 */
import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

/** La fila que ya existe, por el correo con el que se registró. */
const ACTUAL = 'consultor1@aei.network';

const TITULAR = {
  email: 'gerenciaproyecto@aei.network',
  fullName: 'Sofía Villacís',
  guestName: 'Mauricio Pujupat',
  /**
   * Vacío a propósito: la petición no trae el correo de Mauricio. Mejor el hueco
   * que una dirección inventada, y el acompañante no completa registro propio
   * —es un dato de aforo—, así que la fila es válida sin él.
   */
  guestEmail: '',
} as const;

const SEGUNDA = {
  email: 'amazonia@aei.network',
  fullName: 'Javier Dias',
  guestName: 'Guillermina Anaguachi',
  /** Lo mismo: la captura de la petición se corta antes de su correo. */
  guestEmail: '',
} as const;

async function main() {
  const aplicar = process.argv.includes('--aplicar');

  const fila = await prisma.ecuadorRegistration.findUnique({ where: { email: ACTUAL } });
  if (!fila) {
    console.error(`No hay registro con ${ACTUAL}. Nada que corregir.`);
    process.exitCode = 1;
    return;
  }

  // El correo es único: si el nuevo ya existe, el cambio rompería el índice.
  const choque = await prisma.ecuadorRegistration.findUnique({ where: { email: TITULAR.email } });
  const yaSegunda = await prisma.ecuadorRegistration.findUnique({ where: { email: SEGUNDA.email } });

  console.log('fila actual:');
  console.log(`  ${fila.email}  ${fila.fullName}  (${fila.organization})`);
  console.log(`  acompañante: ${fila.guestName || '(ninguno)'} <${fila.guestEmail || 'sin correo'}>`);

  console.log('\nquedaría así:');
  console.log(`  ${TITULAR.email}  ${TITULAR.fullName}`);
  console.log(`  acompañante: ${TITULAR.guestName} <${TITULAR.guestEmail || 'SIN CORREO — falta el dato'}>`);

  console.log('\nfila nueva:');
  console.log(`  ${SEGUNDA.email}  ${SEGUNDA.fullName}  (${fila.organization})`);
  console.log(`  acompañante: ${SEGUNDA.guestName} <${SEGUNDA.guestEmail || 'SIN CORREO — falta el dato'}>`);
  console.log(`  participación: ${fila.participation} · sin marca de confirmación`);

  if (choque && choque.id !== fila.id) {
    console.error(`\n❌ ${TITULAR.email} ya está usado por otro registro (${choque.fullName}). No se toca nada.`);
    process.exitCode = 1;
    return;
  }
  if (yaSegunda) {
    console.log(`\n⚠️  ${SEGUNDA.email} ya existe (${yaSegunda.fullName}): se actualizaría en vez de crearse.`);
  }

  if (!aplicar) {
    console.log('\nNo se escribió nada. Añade --aplicar para hacerlo.');
    return;
  }

  await prisma.ecuadorRegistration.update({
    where: { id: fila.id },
    data: {
      email: TITULAR.email,
      fullName: TITULAR.fullName,
      guestName: TITULAR.guestName,
      guestEmail: TITULAR.guestEmail,
    },
  });

  await prisma.ecuadorRegistration.upsert({
    where: { email: SEGUNDA.email },
    update: { fullName: SEGUNDA.fullName, guestName: SEGUNDA.guestName, guestEmail: SEGUNDA.guestEmail },
    create: {
      email: SEGUNDA.email,
      fullName: SEGUNDA.fullName,
      /** Los mismos que la fila de la que salen: es la misma mesa. */
      organization: fila.organization,
      participation: fila.participation,
      tablePitch: fila.tablePitch,
      guestName: SEGUNDA.guestName,
      guestEmail: SEGUNDA.guestEmail,
      locale: fila.locale,
    },
  });

  console.log('\n✅ hecho.');
  console.log(`   registros de Ecuador: ${await prisma.ecuadorRegistration.count()}`);
  console.log('   Sin correos: avisar es otro acto y va por su cuenta.');
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
