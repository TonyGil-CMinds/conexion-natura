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
 * Dos cosas:
 *
 * 1. El correo de la titular pasa a `gerenciaproyecto@aei.network`. **Es la
 *    clave del registro**, así que esto no es editar un campo: es mover la fila
 *    a otra identidad. Por eso se comprueba antes que la dirección nueva no
 *    exista ya, o el cambio chocaría contra el índice único.
 * 2. Sofía va con **tres acompañantes**: sale Emilio Erráez y entran Mauricio
 *    Pujupat, Javier Dias y Guillermina Anaguachi.
 *
 * **Los tres caben en un solo campo porque el acompañante es texto, no una
 * fila.** El modelo guarda `guestName` y `guestEmail` sueltos a propósito: aquí
 * nadie completa un registro propio ni lleva credencial, es un dato de aforo. Lo
 * que no cabe es un correo por cabeza, y por eso `guestEmail` se queda vacío en
 * vez de llevar el de uno de los tres y dar a entender que es de todos.
 *
 * **Las cédulas no se guardan.** El modelo no tiene dónde ponerlas y no hacen
 * falta para el registro: son para el control de acceso de la sede, que es otro
 * sistema. Inventar una columna para un dato que el sitio no usa sería guardar
 * identificación personal sin motivo.
 *
 * **No manda ningún correo.** Avisar es otro acto y va por su cuenta.
 */
import 'dotenv/config';
import { prisma } from '../src/lib/prisma';

/** Los correos con los que la fila pudo quedarse, de más viejo a más nuevo. */
const POSIBLES = ['gerenciaproyecto@aei.network', 'consultor1@aei.network'] as const;

const TITULAR = {
  email: 'gerenciaproyecto@aei.network',
  fullName: 'Sofía Villacís',
  /** Los tres, en el orden en que los pidió la organización. */
  guestName: 'Mauricio Pujupat, Javier Dias, Guillermina Anaguachi',
  /** Vacío a propósito: son tres personas y el campo es uno. */
  guestEmail: '',
} as const;

/**
 * Una fila que se creó por leer la petición como dos registros y que no lo era:
 * los dos cupos de más son acompañantes de Sofía, no una inscripción aparte. Se
 * borra si está.
 */
const SOBRA = 'amazonia@aei.network';

async function main() {
  const aplicar = process.argv.includes('--aplicar');

  let fila = null;
  for (const email of POSIBLES) {
    fila = await prisma.ecuadorRegistration.findUnique({ where: { email } });
    if (fila) break;
  }
  if (!fila) {
    console.error(`No hay registro de AEI con ninguno de: ${POSIBLES.join(', ')}.`);
    process.exitCode = 1;
    return;
  }

  // El correo es único: si el nuevo ya lo tiene otra fila, el cambio lo rompería.
  const choque = await prisma.ecuadorRegistration.findUnique({ where: { email: TITULAR.email } });
  const dobleta = await prisma.ecuadorRegistration.findUnique({ where: { email: SOBRA } });

  console.log('fila actual:');
  console.log(`  ${fila.email}  ${fila.fullName}  (${fila.organization})`);
  console.log(`  acompañantes: ${fila.guestName || '(ninguno)'}`);

  console.log('\nquedaría así:');
  console.log(`  ${TITULAR.email}  ${TITULAR.fullName}`);
  console.log(`  acompañantes: ${TITULAR.guestName}`);
  console.log(`  participación: ${fila.participation} · 4 personas en total`);

  if (dobleta) console.log(`\nse borraría la fila de más: ${SOBRA} (${dobleta.fullName})`);

  if (choque && choque.id !== fila.id) {
    console.error(`\n❌ ${TITULAR.email} ya está usado por otro registro (${choque.fullName}). No se toca nada.`);
    process.exitCode = 1;
    return;
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

  if (dobleta) await prisma.ecuadorRegistration.delete({ where: { email: SOBRA } });

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
