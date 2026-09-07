/**
 * Comprueba el correo de confirmación.
 *
 *   npx tsx scripts/verify-sendgrid.ts [correo]           # no entrega nada
 *   npx tsx scripts/verify-sendgrid.ts correo@x.com --send  # envía de verdad
 *
 * Sin `--send` va en modo de prueba de SendGrid: valida la clave, el remitente,
 * la plantilla y las variables, y responde sin escribirle a nadie. Imprime los
 * datos que recibiría la plantilla, que es donde se ven los errores de contenido.
 *
 * Con `--send` manda un correo de verdad a **una** dirección, para poder mirar
 * cómo queda la plantilla antes de escribirle a la lista entera.
 */
import 'dotenv/config';
import { confirmationSubject, confirmationTemplateData } from '../src/features/registration/lib/confirmation-email';
import { sendTemplate } from '../src/lib/sendgrid';

const shouldSend = process.argv.includes('--send');
if (!shouldSend) process.env.SENDGRID_SANDBOX = '1';

const to = process.argv.find((arg) => arg.includes('@')) ?? 'prueba@example.com';

async function main() {
  const data = confirmationTemplateData({ name: 'Antonio', surname: 'Gil', locale: 'es' });
  console.log('variables de la plantilla:');
  for (const [key, value] of Object.entries(data)) console.log(`  ${key}: ${value}`);

  await sendTemplate({ to, data, subject: confirmationSubject('es') });
  console.log(
    shouldSend
      ? `\n✅ Enviado de verdad a ${to}.`
      : `\n✅ SendGrid aceptó el envío (modo de prueba: no se entregó nada a ${to}).`,
  );
}

main().catch((error) => {
  console.error('❌ SendGrid rechazó el envío:');
  // El cuerpo del error trae el motivo real; el mensaje suele ser genérico.
  console.error(error?.response?.body ?? error);
  process.exit(1);
});
