/**
 * Manda el aviso de **cambio de hora** a quien va al acto.
 *
 *   npm run mail:hora              # solo enseña qué haría
 *   npm run mail:hora:send         # lo hace
 *
 * **Por omisión no escribe ni envía nada.** Cambia estados en la base y escribe
 * a personas reales: las dos cosas son irreversibles, así que la marcha en seco
 * es lo primero y hacerlo de verdad hay que pedirlo.
 *
 * Hace dos cosas, en este orden:
 *
 * 1. **Confirma a quien estaba en lista de espera.** Se pidió así: ya no hay
 *    espera, entran todos. Se escribe antes de enviar para que nadie reciba un
 *    correo que le trata de asistente mientras su fila dice lo contrario.
 * 2. **Manda el aviso** a todo el que queda confirmado.
 *
 * Quien está **pendiente** no entra: son invitaciones que nadie completó, y
 * decirle a alguien que «su registro sigue siendo válido» cuando no llegó a
 * registrarse es prometer una plaza que no pidió.
 *
 * La marca de enviado vive en el fichero de al lado y no en `confirmationSentAt`:
 * esa columna dice si se mandó **la confirmación del registro**, que es otro
 * correo. Usarla aquí dejaría a esa gente fuera de `mail:pending` para siempre.
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

function escribirRegistro(valor: Record<string, string>): void {
  writeFileSync(REGISTRO, `${JSON.stringify(valor, null, 2)}\n`);
}

/**
 * El nombre de pila, con la inicial en mayúscula.
 *
 * Hay filas escritas en minúscula por quien llenó el formulario. En pantalla da
 * igual; encabezando un correo, «doris» se lee como un descuido. Solo se toca
 * la primera letra: el resto es como esa persona escribió su nombre.
 */
function tratamiento(name: string): string {
  const pila = name.trim().split(/\s+/)[0] ?? '';
  return pila ? pila[0]!.toUpperCase() + pila.slice(1) : pila;
}

async function main() {
  const hacerlo = process.argv.includes('--enviar');

  const espera = await prisma.attendee.findMany({
    where: { status: 'WAITLIST' },
    select: { email: true, name: true, surname: true },
    orderBy: { name: 'asc' },
  });

  console.log(`en lista de espera: ${espera.length}`);
  for (const a of espera) console.log(`  → confirmar  ${a.email}  (${`${a.name} ${a.surname}`.trim()})`);

  if (hacerlo && espera.length) {
    await prisma.attendee.updateMany({
      where: { status: 'WAITLIST' },
      data: { status: 'CONFIRMED' },
    });
    console.log(`\n✅ ${espera.length} pasados a CONFIRMED.`);
  }

  const confirmados = await prisma.attendee.findMany({
    where: { status: 'CONFIRMED' },
    select: { email: true, name: true, surname: true },
    orderBy: { name: 'asc' },
  });

  const enviado = leerRegistro();
  const destinatarios = confirmados.filter((a) => !enviado[a.email]);

  const pendientes = await prisma.attendee.count({ where: { status: 'PENDING' } });

  console.log(`\nconfirmados en total: ${confirmados.length}`);
  console.log(`  ya avisados antes:  ${confirmados.length - destinatarios.length}`);
  console.log(`  se les escribiría:  ${destinatarios.length}`);
  console.log(`fuera, por pendientes de completar su registro: ${pendientes}`);

  if (!hacerlo) {
    console.log('\nPrimeros diez destinatarios:');
    for (const a of destinatarios.slice(0, 10)) console.log(`  · ${tratamiento(a.name)} <${a.email}>`);
    if (destinatarios.length > 10) console.log(`  · … y ${destinatarios.length - 10} más`);
    console.log('\nNo se escribió ni se envió nada. Añade --enviar para hacerlo.');
    return;
  }

  /**
   * La lista permitida se estrecha a **estos** destinatarios y a nadie más. La
   * guarda de `resend.ts` no se abre: se cierra sobre la lista que este script
   * acaba de contar, así que un fallo de programación no puede sacar un correo
   * a una dirección que no salga de la consulta de arriba.
   */
  process.env.CEIBA_EMAIL_ALLOWLIST = destinatarios.map((a) => a.email).join(',');

  let bien = 0;
  const mal: string[] = [];

  for (const a of destinatarios) {
    // La marca primero: si esto se cae, nadie lo recibe dos veces.
    const registro = leerRegistro();
    registro[a.email] = new Date().toISOString();
    escribirRegistro(registro);

    const { subject, html, text } = timeChangeEmail({ name: tratamiento(a.name), locale: 'es' });
    const r = await sendHtml({ to: a.email, subject, html, text });

    if (r.status === 'sent') {
      bien += 1;
      console.log(`  ✅ ${a.email}`);
    } else {
      // Se vuelve atrás: quien no lo recibió tiene que poder reintentarlo.
      const vuelta = leerRegistro();
      delete vuelta[a.email];
      escribirRegistro(vuelta);
      mal.push(`${a.email}: ${JSON.stringify(r)}`);
      console.log(`  ❌ ${a.email}: ${JSON.stringify(r)}`);
    }
  }

  console.log(`\nenviados: ${bien} de ${destinatarios.length}`);
  if (mal.length) {
    console.log(`fallaron ${mal.length}; vuelve a correr el script y solo se reintentan esos.`);
    process.exitCode = 1;
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
