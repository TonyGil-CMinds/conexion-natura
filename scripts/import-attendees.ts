/**
 * Carga una lista de personas **ya confirmadas** desde un CSV del equipo.
 *
 *   npm run lista:asistentes -- "ruta/al/archivo.csv"      # solo enseña qué haría
 *   npm run lista:asistentes -- "ruta/al/archivo.csv" --aplicar
 *
 * **Por omisión no escribe nada.** Enseña quién entra nuevo, a quién le cambia
 * algo y a quién no toca. Es un alta a mano en la lista de asistentes, así que
 * conviene mirarla antes: aquí no hay formulario que valide del otro lado.
 *
 * **No manda ningún correo.** Lo que hace es escribir la fila; avisar a la gente
 * es otro acto y va por su cuenta. Por eso `confirmationSentAt` se queda como
 * esté: nulo en quien entra nuevo, intacto en quien ya estaba.
 *
 * Columnas que lee: `name`, `first_name`, `last_name`, `email`. Si vienen el
 * nombre y el apellido por separado, manda esa pareja; si solo viene `name`, se
 * parte por el primer espacio. Lo demás del CSV se ignora.
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { prisma } from '../src/lib/prisma';
import { parseCsv } from '../src/features/registration/lib/invitees-csv';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Fila = { email: string; name: string; surname: string };

/** Primera en mayúscula, resto como venga: no se toca lo que la gente escribió. */
function capitalizar(valor: string): string {
  return valor ? valor[0]!.toUpperCase() + valor.slice(1) : valor;
}

/**
 * Nombre y apellido de una fila.
 *
 * Tres casos, y los tres salen del archivo real:
 *
 * - Vienen `first_name` y `last_name`: mandan ellos.
 * - Solo viene `name`: se parte por el primer espacio. El apellido puede llevar
 *   dos palabras —«Morán Carofilis»— así que el corte va por el primero y no
 *   por el último.
 * - `name` **es el correo**, porque quien llenó la hoja lo pegó ahí. Se arma
 *   desde la parte local del correo, que es lo único que hay: dejar la dirección
 *   entera como nombre saldría así en el panel y en la credencial.
 */
function partirNombre(name: string, first: string, last: string, email: string): { name: string; surname: string } {
  if (first || last) return { name: first, surname: last };

  const limpio = name.trim();
  if (limpio && limpio !== email && !EMAIL.test(limpio)) {
    const [primero, ...resto] = limpio.split(/\s+/);
    return { name: primero!, surname: resto.join(' ') };
  }

  const local = email.split('@')[0]!;
  const partes = local.split(/[._-]+/).filter(Boolean).map(capitalizar);
  return { name: partes[0] ?? local, surname: partes.slice(1).join(' ') };
}

function leer(csv: string): { filas: Fila[]; descartadas: { linea: number; motivo: string }[] } {
  const bruto = parseCsv(csv);
  if (!bruto.length) return { filas: [], descartadas: [] };

  const cabecera = bruto[0]!.map((c) => c.trim().toLowerCase());
  const col = (nombre: string) => cabecera.indexOf(nombre);
  if (col('email') < 0) throw new Error(`El CSV no tiene columna «email». Se encontró: ${cabecera.join(', ')}.`);

  const filas: Fila[] = [];
  const descartadas: { linea: number; motivo: string }[] = [];
  const vistos = new Set<string>();

  bruto.slice(1).forEach((fila, i) => {
    const linea = i + 2;
    const campo = (nombre: string) => {
      const j = col(nombre);
      return j < 0 ? '' : (fila[j] ?? '').replace(/\s+/g, ' ').trim();
    };

    const email = campo('email').toLowerCase();
    if (!EMAIL.test(email)) {
      descartadas.push({ linea, motivo: 'correo vacío o mal formado' });
      return;
    }
    if (vistos.has(email)) {
      descartadas.push({ linea, motivo: `correo repetido (${email})` });
      return;
    }
    vistos.add(email);

    const { name, surname } = partirNombre(campo('name'), campo('first_name'), campo('last_name'), email);
    if (!name) {
      descartadas.push({ linea, motivo: 'sin nombre' });
      return;
    }
    filas.push({ email, name, surname });
  });

  return { filas, descartadas };
}

async function main() {
  const ruta = process.argv[2];
  const aplicar = process.argv.includes('--aplicar');

  if (!ruta) {
    console.error('Falta la ruta del CSV.\n  npm run lista:asistentes -- "archivo.csv" [--aplicar]');
    process.exitCode = 1;
    return;
  }

  const { filas, descartadas } = leer(readFileSync(ruta, 'utf8'));
  console.log(`archivo: ${ruta}`);
  console.log(`filas válidas: ${filas.length}`);
  if (descartadas.length) {
    console.log(`\ndescartadas (${descartadas.length}):`);
    for (const d of descartadas) console.log(`  línea ${d.linea}: ${d.motivo}`);
  }
  if (!filas.length) return;

  const existentes = await prisma.attendee.findMany({
    where: { email: { in: filas.map((f) => f.email) } },
    select: { email: true, name: true, surname: true, status: true, events: true },
  });
  const porCorreo = new Map(existentes.map((a) => [a.email, a]));

  const nuevas = filas.filter((f) => !porCorreo.has(f.email));
  const cambian = filas.filter((f) => {
    const a = porCorreo.get(f.email);
    return a && (a.status !== 'CONFIRMED' || !a.events.includes('NIGHT'));
  });
  const igual = filas.length - nuevas.length - cambian.length;

  console.log(`\nen la base ahora: ${existentes.length} de las ${filas.length}`);
  console.log(`  nuevas:        ${nuevas.length}`);
  console.log(`  se confirman:  ${cambian.length}`);
  console.log(`  ya estaban:    ${igual}`);
  for (const f of nuevas.slice(0, 10)) console.log(`    + ${f.email} — ${f.name} ${f.surname}`.trimEnd());
  if (nuevas.length > 10) console.log(`    + … y ${nuevas.length - 10} más`);
  for (const f of cambian) {
    const a = porCorreo.get(f.email)!;
    console.log(`    ~ ${f.email} — ${a.status} → CONFIRMED`);
  }

  if (!aplicar) {
    console.log('\nNo se escribió nada. Añade --aplicar para hacerlo.');
    return;
  }

  for (const f of filas) {
    await prisma.attendee.upsert({
      where: { email: f.email },
      /**
       * Al actualizar **no se pisan los datos que la persona puso ella misma**:
       * si ya se había registrado, su nombre y su organización valen más que los
       * de una hoja de cálculo. Lo único que se asegura es que quede confirmada
       * y con la noche entre sus actos.
       */
      update: {
        status: 'CONFIRMED',
        events: { set: Array.from(new Set([...(porCorreo.get(f.email)?.events ?? []), 'NIGHT'])) },
      },
      create: {
        email: f.email,
        name: f.name,
        surname: f.surname,
        events: ['NIGHT'],
        status: 'CONFIRMED',
      },
    });
  }

  console.log(`\n✅ ${filas.length} filas escritas (${nuevas.length} nuevas).`);
  console.log('   Sin correos: avisar es otro acto y va por su cuenta.');
  console.log(`   total de asistentes: ${await prisma.attendee.count()}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
