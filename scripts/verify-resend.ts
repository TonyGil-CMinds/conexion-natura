/**
 * Comprueba el correo de confirmación con Resend, sin mirar la bandeja.
 *
 *   npm run mail:verify                       # solo comprueba, no envía nada
 *   npm run mail:verify:send -- correo@x.com  # además manda uno de verdad
 *
 * Hace tres cosas, de menos a más invasiva:
 *
 * 1. **Cruza los nombres de las variables** con el HTML de la plantilla. Es la
 *    única comprobación que sirve: Resend acepta **y entrega** un envío al que le
 *    falten variables, dejando el hueco en blanco sin error ni `{{...}}` que
 *    delate nada, así que un nombre mal escrito no se ve en ningún log.
 *    Las variables se sacan del HTML y no del campo `variables` que devuelve la
 *    API: ese viene vacío aunque la plantilla use trece —en Resend no se
 *    declaran—.
 * 2. **Mira el estado de los dominios** (`GET /domains`): un dominio sin
 *    verificar acepta la llamada y no entrega.
 * 3. Con una dirección por argumento, manda un correo de verdad. Sin ella no
 *    envía nada: Resend no tiene modo de prueba.
 */
import 'dotenv/config';
import { confirmationTemplateData } from '../src/features/registration/lib/confirmation-email';
import { sendTemplate } from '../src/lib/resend';

const API = 'https://api.resend.com';

async function api<T>(path: string): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
  });
  if (!response.ok) {
    throw new Error(`GET ${path} → ${response.status}: ${await response.text().catch(() => '')}`);
  }
  return response.json() as Promise<T>;
}

/** Los `{{ nombre }}` que la plantilla usa de verdad, leídos de su HTML. */
function templateVariables(html: string): readonly string[] {
  const found = new Set<string>();
  for (const match of html.matchAll(/\{\{\s*([A-Za-z0-9_]+)/g)) found.add(match[1]!);
  return [...found].sort();
}

async function main() {
  const to = process.argv.find((arg) => arg.includes('@'));
  const templateId = process.env.CEIBA_EMAIL_TEMPLATE_ID;

  console.log(`remitente: ${process.env.CEIBA_EMAIL_FROM ?? '(sin CEIBA_EMAIL_FROM)'}`);
  console.log(`plantilla: ${templateId ?? '(sin CEIBA_EMAIL_TEMPLATE_ID)'}`);

  const { data, missing } = confirmationTemplateData({ name: 'Antonio', surname: 'Gil' });

  // 1. Datos del evento que faltan en el entorno.
  console.log('\ndatos del evento:');
  for (const [key, value] of Object.entries(data)) {
    console.log(`  ${value ? '·' : '✗'} ${key}: ${value || '(vacío — rellénalo en event-email-details.ts)'}`);
  }
  if (missing.length) {
    console.log(`\n⚠️  Faltan ${missing.length}: el correo se OMITE hasta que estén.`);
  }

  // 2. Nombres de las variables, contra el HTML de la plantilla.
  if (templateId) {
    try {
      const template = await api<{ html?: string }>(`/templates/${templateId}`);
      const usadas = templateVariables(template.html ?? '');
      const enviadas = Object.keys(data).sort();
      const sinDato = usadas.filter((name) => !enviadas.includes(name));
      const deMas = enviadas.filter((name) => !usadas.includes(name));

      console.log(`\nvariables que usa la plantilla (${usadas.length}): ${usadas.join(', ')}`);
      if (sinDato.length) console.log(`❌ la plantilla espera y no mandamos: ${sinDato.join(', ')}`);
      if (deMas.length) console.log(`⚠️  mandamos y la plantilla no usa: ${deMas.join(', ')}`);
      if (!sinDato.length && !deMas.length) console.log('✅ los nombres coinciden exactamente.');
    } catch (error) {
      console.log(`\n⚠️  no se pudo leer la plantilla: ${error instanceof Error ? error.message : error}`);
    }
  }

  // 3. Dominios verificados.
  try {
    const { data: domains = [] } = await api<{ data?: { name: string; status: string }[] }>('/domains');
    console.log('\ndominios:');
    for (const domain of domains) {
      console.log(`  ${domain.status === 'verified' ? '✅' : '❌'} ${domain.name}: ${domain.status}`);
    }
    if (!domains.length) console.log('  (ninguno: sin dominio verificado solo se puede enviar a tu propia cuenta)');
  } catch (error) {
    console.log(`\n⚠️  no se pudieron leer los dominios: ${error instanceof Error ? error.message : error}`);
  }

  if (!to) {
    console.log('\nNo se envió nada. Pasa una dirección para mandar uno de verdad.');
    return;
  }

  if (missing.length) {
    console.log(`\nNo se envía a ${to}: faltan datos del evento.`);
    process.exitCode = 1;
    return;
  }

  const result = await sendTemplate({ to, data });
  console.log(
    result.status === 'sent'
      ? `\n✅ Enviado a ${to} (id ${result.id ?? 'sin id'}).`
      : `\n❌ No se envió a ${to}: ${JSON.stringify(result)}`,
  );
  if (result.status !== 'sent') process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
