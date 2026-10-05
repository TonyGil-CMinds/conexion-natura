/**
 * Deja programado el **recordatorio** a toda la lista de confirmados.
 *
 *   npm run mail:recordatorio                 # solo enseña qué haría
 *   npm run mail:recordatorio:send            # lo programa
 *   npm run mail:recordatorio:cancel          # lo retira, si aún no ha salido
 *
 * **Por omisión no programa nada.**
 *
 * Lo guarda **Resend**, no esta máquina. Un correo que tiene que salir a las
 * siete de la mañana no puede depender de que un portátil siga encendido, ni de
 * que a nadie se le olvide: se entrega la cola entera al proveedor y él la
 * suelta a la hora.
 *
 * De cada envío se guarda su identificador, y por eso existe `--cancelar`:
 * dejar programados ciento y pico correos sin manera de pararlos sería dejar
 * una bala en el aire. Lo que ya salió no se puede retirar, y eso está bien.
 *
 * La hora se escribe en hora de Quito y se convierte aquí. Ecuador continental
 * no tiene horario de verano, así que el desplazamiento es -05:00 todo el año y
 * no hay que calcular nada por fecha.
 */
import 'dotenv/config';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { prisma } from '../src/lib/prisma';
import { cancelScheduled, sendHtml } from '../src/lib/resend';
import { reminderEmail } from '../src/features/registration/lib/reminder-email';

/** Cuándo sale, en hora de Quito. */
const CUANDO_QUITO = '2026-10-05T07:00:00';
const DESFASE_QUITO = '-05:00';
const CUANDO = new Date(`${CUANDO_QUITO}${DESFASE_QUITO}`);

const REGISTRO = 'scripts/data/reminder-scheduled.json';

type Apunte = { id: string; cuando: string };

function leerRegistro(): Record<string, Apunte> {
  return existsSync(REGISTRO) ? JSON.parse(readFileSync(REGISTRO, 'utf8')) : {};
}

function escribirRegistro(valor: Record<string, Apunte>): void {
  writeFileSync(REGISTRO, `${JSON.stringify(valor, null, 2)}\n`);
}

/** El nombre de pila, con la inicial en mayúscula. */
function tratamiento(name: string): string {
  const pila = name.trim().split(/\s+/)[0] ?? '';
  return pila ? pila[0]!.toUpperCase() + pila.slice(1) : pila;
}

async function cancelar() {
  const registro = leerRegistro();
  const apuntes = Object.entries(registro);
  if (!apuntes.length) {
    console.log('No hay nada programado.');
    return;
  }
  console.log(`retirando ${apuntes.length} envíos programados…`);
  let bien = 0;
  const quedan: Record<string, Apunte> = {};
  for (const [email, apunte] of apuntes) {
    const r = await cancelScheduled(apunte.id);
    if (r.ok) {
      bien += 1;
    } else {
      // Lo que no se pudo retirar se queda apuntado: o ya salió, o hay que mirarlo.
      quedan[email] = apunte;
      console.error(`  ❌ ${email}: ${r.reason}`);
    }
  }
  escribirRegistro(quedan);
  console.log(`\nretirados: ${bien} de ${apuntes.length}`);
  if (Object.keys(quedan).length) {
    console.log(`${Object.keys(quedan).length} siguen apuntados: o ya habían salido, o fallaron.`);
    process.exitCode = 1;
  }
}

async function main() {
  if (process.argv.includes('--cancelar')) return cancelar();
  const programar = process.argv.includes('--programar');

  const ahora = new Date();
  const faltan = (CUANDO.getTime() - ahora.getTime()) / 3600e3;

  const confirmados = await prisma.attendee.findMany({
    where: { status: 'CONFIRMED' },
    select: { email: true, name: true, surname: true },
    orderBy: { name: 'asc' },
  });

  const registro = leerRegistro();
  const destinatarios = confirmados.filter((a) => !registro[a.email]);

  console.log(`sale el  : ${CUANDO_QUITO.replace('T', ' ')} hora de Quito  (${CUANDO.toISOString()})`);
  console.log(`ahora son: ${new Date(ahora.getTime() - 5 * 3600e3).toISOString().slice(0, 16).replace('T', ' ')} en Quito`);
  console.log(faltan > 0 ? `faltan   : ${faltan.toFixed(1)} h` : `⚠ esa hora YA PASÓ hace ${(-faltan).toFixed(1)} h`);
  console.log(`\nconfirmados        : ${confirmados.length}`);
  console.log(`ya programados     : ${confirmados.length - destinatarios.length}`);
  console.log(`se programarían    : ${destinatarios.length}`);

  if (faltan <= 0) {
    console.error('\n❌ La hora de salida ya pasó. Cambia CUANDO_QUITO o manda el correo ya.');
    process.exitCode = 1;
    return;
  }

  if (!programar) {
    console.log('\nPrimeros diez:');
    for (const a of destinatarios.slice(0, 10)) console.log(`  · ${tratamiento(a.name)} <${a.email}>`);
    if (destinatarios.length > 10) console.log(`  · … y ${destinatarios.length - 10} más`);
    console.log('\nNo se programó nada. Añade --programar para hacerlo.');
    return;
  }

  /**
   * La lista permitida se cierra sobre **estos** destinatarios. La guarda de
   * `resend.ts` no se abre: se estrecha a la lista que este script acaba de
   * contar, así que un fallo de programación no puede colar a nadie que no
   * salga de la consulta de arriba.
   */
  process.env.CEIBA_EMAIL_ALLOWLIST = destinatarios.map((a) => a.email).join(',');

  let bien = 0;
  for (const a of destinatarios) {
    const { subject, html, text } = reminderEmail({ name: tratamiento(a.name), locale: 'es' });
    const r = await sendHtml({ to: a.email, subject, html, text, scheduledAt: CUANDO.toISOString() });

    if (r.status === 'sent' && r.id) {
      /**
       * El apunte se escribe **después** y con el identificador que devuelve el
       * proveedor: sin ese identificador no se podría retirar, y un apunte sin
       * él sería peor que no tenerlo.
       */
      const actual = leerRegistro();
      actual[a.email] = { id: r.id, cuando: CUANDO.toISOString() };
      escribirRegistro(actual);
      bien += 1;
      console.log(`  ✅ ${a.email}`);
    } else {
      console.error(`  ❌ ${a.email}: ${JSON.stringify(r)}`);
    }
  }

  console.log(`\nprogramados: ${bien} de ${destinatarios.length}`);
  console.log(`saldrán el ${CUANDO_QUITO.replace('T', ' ')} hora de Quito.`);
  console.log('Para retirarlos: npm run mail:recordatorio:cancel');
  if (bien < destinatarios.length) process.exitCode = 1;
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
