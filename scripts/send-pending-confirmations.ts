/**
 * Manda la confirmación a quien se registró y no la recibió.
 *
 *   npm run mail:pending        # solo lista a quién le tocaría
 *   npm run mail:pending:send   # envía de verdad
 *
 * Son dos scripts y no un argumento porque npm 11 se come el `-- --send`: lo
 * trata como una config suya («Unknown cli config») y no lo reenvía.
 *
 * Hace falta porque el correo puede fallar por causas ajenas al registro —la
 * cuenta de SendGrid sin créditos, por ejemplo— y esas filas quedan con
 * `confirmationSentAt` nulo. Este script las recupera sin pedirle a nadie que
 * vuelva a llenar el formulario.
 *
 * **No envía por defecto**: escribirle a personas reales no debería ser el
 * comportamiento de un comando que se teclea por error.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { confirmationSubject, confirmationTemplateData } from '../src/features/registration/lib/confirmation-email';
import { sendTemplate } from '../src/lib/sendgrid';

const shouldSend = process.argv.includes('--send');

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  const pending = await prisma.attendee.findMany({
    where: { confirmationSentAt: null },
    select: { id: true, name: true, surname: true, email: true },
    orderBy: { createdAt: 'asc' },
  });

  if (pending.length === 0) {
    console.log('No hay confirmaciones pendientes.');
    return;
  }

  console.log(`${pending.length} confirmación(es) pendiente(s):`);
  for (const person of pending) {
    console.log(`  · ${person.name} ${person.surname} <${person.email}>`);
  }

  if (!shouldSend) {
    console.log('\nNo se envió nada. Añade `-- --send` para enviarlas.');
    return;
  }

  let enviadas = 0;
  for (const person of pending) {
    try {
      await sendTemplate({
        to: person.email,
        // Sin idioma guardado por persona, se manda en español, que es el
        // idioma por defecto del sitio.
        subject: confirmationSubject(),
        data: confirmationTemplateData({ name: person.name, surname: person.surname }),
      });
      await prisma.attendee.update({
        where: { id: person.id },
        data: { confirmationSentAt: new Date() },
      });
      enviadas += 1;
      console.log(`· enviada a ${person.email}`);
    } catch (error) {
      const body = (error as { response?: { body?: unknown } })?.response?.body;
      console.error(`· falló ${person.email}:`, body ?? error);
    }
  }
  console.log(`\n${enviadas} de ${pending.length} enviadas.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
