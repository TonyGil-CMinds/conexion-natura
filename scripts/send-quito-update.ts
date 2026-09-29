/**
 * Manda el aviso de **cambio de sede** de Quito a la lista dada de alta a mano.
 *
 *   npm run mail:quito              # solo enseña a quién escribiría
 *   npm run mail:quito:send         # manda de verdad
 *
 * **Por omisión no envía nada.** Es un envío a personas reales y no hay forma de
 * retirarlo, así que la marcha en seco es lo primero y escribir hay que pedirlo.
 *
 * No es la confirmación de `/registro`: aquella la dispara el propio formulario
 * al completarse y esta va a una lista que entró por fuera. Por eso tiene su
 * propia plantilla (`quitoEs`) y su propia marca de envío, en el fichero de al
 * lado: usar `confirmationSentAt` diría que estas personas ya recibieron la
 * confirmación, que no es verdad, y las dejaría fuera de `mail:pending`.
 *
 * La marca se escribe **antes** de cada envío, no después: si el proceso se cae
 * a medias, lo peor que pasa es que alguien se quede sin correo —y se ve en la
 * lista— y no que le lleguen dos.
 */
import 'dotenv/config';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { prisma } from '../src/lib/prisma';
import { sendTemplate } from '../src/lib/resend';

/** Quiénes entran: el alta a mano del 29 de septiembre. */
const LOTE = { desde: new Date('2026-09-29T20:43:00.000Z'), hasta: new Date('2026-09-29T20:44:00.000Z') };

/**
 * Quién queda fuera, con su motivo.
 *
 * Catalina se había registrado ella misma y quedó en lista de espera, así que el
 * alta a mano no la confirmó. Decirle «nos vemos» a quien no tiene plaza sería
 * prometer lo que no está dado; su caso se resuelve aparte.
 */
const FUERA = new Map([['catamejia04@gmail.com', 'está en lista de espera']]);

const REGISTRO = 'scripts/data/quito-update-sent.json';

function leerRegistro(): Record<string, string> {
  return existsSync(REGISTRO) ? JSON.parse(readFileSync(REGISTRO, 'utf8')) : {};
}

async function main() {
  const enviar = process.argv.includes('--enviar');

  const filas = await prisma.attendee.findMany({
    where: { createdAt: { gte: LOTE.desde, lt: LOTE.hasta } },
    select: { email: true, name: true, surname: true, status: true },
    orderBy: { name: 'asc' },
  });

  const enviado = leerRegistro();
  const destinatarios = filas.filter((f) => !FUERA.has(f.email) && !enviado[f.email]);

  console.log(`plantilla: quitoEs (${process.env.CEIBA_EMAIL_TEMPLATE_ID_QUITO_ES ?? 'SIN ID'})`);
  console.log(`en el lote: ${filas.length}`);
  for (const [email, motivo] of FUERA) console.log(`  – fuera: ${email} (${motivo})`);
  const yaHecho = filas.filter((f) => enviado[f.email]).length;
  if (yaHecho) console.log(`  – ya enviados antes: ${yaHecho}`);
  console.log(`\nse escribiría a ${destinatarios.length}:`);
  for (const f of destinatarios) console.log(`  · ${f.name} <${f.email}>`);

  if (!enviar) {
    console.log('\nNo se envió nada. Añade --enviar para hacerlo.');
    return;
  }

  /**
   * La lista permitida se estrecha a **estos** destinatarios y a nadie más.
   *
   * La guarda de `resend.ts` existe porque una prueba en local escribió a dos
   * personas de verdad. Aquí no se abre: se cierra sobre la lista que este
   * script acaba de imprimir, así que un fallo de programación no puede sacar
   * un correo a una dirección que no salga arriba.
   */
  process.env.CEIBA_EMAIL_ALLOWLIST = destinatarios.map((f) => f.email).join(',');

  let bien = 0;
  const mal: { email: string; motivo: string }[] = [];

  for (const f of destinatarios) {
    // La marca primero: si esto se cae, nadie recibe el correo dos veces.
    const registro = leerRegistro();
    registro[f.email] = new Date().toISOString();
    writeFileSync(REGISTRO, `${JSON.stringify(registro, null, 2)}\n`);

    const r = await sendTemplate({ to: f.email, template: 'quitoEs', data: { username: f.name } });
    if (r.status === 'sent') {
      bien += 1;
      console.log(`  ✅ ${f.email} (${r.id ?? 'sin id'})`);
    } else {
      // Se vuelve atrás la marca: quien no lo recibió tiene que poder reintentarlo.
      const vuelta = leerRegistro();
      delete vuelta[f.email];
      writeFileSync(REGISTRO, `${JSON.stringify(vuelta, null, 2)}\n`);
      mal.push({ email: f.email, motivo: JSON.stringify(r) });
      console.log(`  ❌ ${f.email}: ${JSON.stringify(r)}`);
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
