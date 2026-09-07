/**
 * Comprueba que el correo saldrá **autenticado**.
 *
 *   npm run mail:auth
 *
 * Sin esto, un correo que SendGrid acepta sin queja puede llegar marcado como no
 * autenticado y con las imágenes bloqueadas. El motivo suele ser el DNS, y hay un
 * detalle que engaña: SendGrid guarda el resultado de la última validación, así
 * que su API sigue diciendo `valid: true` aunque los registros ya no existan. Por
 * eso aquí se resuelve el DNS de verdad.
 *
 * Se consulta a un resolutor público y no al del sistema para no leer una caché
 * local.
 */
import 'dotenv/config';
import dns from 'node:dns/promises';

dns.setServers(['8.8.8.8', '1.1.1.1']);

type DnsRecord = { host: string; data: string; type: string; valid: boolean };
type Domain = {
  id: number;
  domain: string;
  subdomain: string;
  valid: boolean;
  default: boolean;
  dns: Record<string, DnsRecord>;
};

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;
if (!apiKey) throw new Error('Falta SENDGRID_API_KEY en .env.');

async function sendgrid<T>(path: string): Promise<T> {
  const response = await fetch(`https://api.sendgrid.com/v3${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) throw new Error(`${path}: ${response.status} ${await response.text()}`);
  return response.json() as Promise<T>;
}

/** ¿Existe el CNAME y apunta a donde SendGrid espera? */
async function checkCname(host: string, expected: string) {
  try {
    const targets = await dns.resolveCname(host);
    const found = targets.some((t) => t.replace(/\.$/, '') === expected.replace(/\.$/, ''));
    return { ok: found, detail: targets.join(', ') };
  } catch {
    return { ok: false, detail: 'no existe' };
  }
}

async function txt(host: string) {
  try {
    return (await dns.resolveTxt(host)).map((parts) => parts.join(''));
  } catch {
    return [];
  }
}

async function main() {
  const domains = await sendgrid<Domain[]>('/whitelabel/domains');
  const fromDomain = fromEmail?.split('@')[1];
  console.log(`Remitente: ${fromEmail ?? '(sin SENDGRID_FROM_EMAIL)'}\n`);

  let allGood = true;

  for (const domain of domains) {
    const isSender = domain.domain === fromDomain;
    console.log(
      `${domain.domain}${isSender ? '  ← el del remitente' : ''}` +
        `\n  SendGrid dice: válido ${domain.valid}, por defecto ${domain.default}`,
    );

    for (const [name, record] of Object.entries(domain.dns)) {
      const { ok, detail } = await checkCname(record.host, record.data);
      if (isSender && !ok) allGood = false;
      console.log(`  ${ok ? '✅' : '❌'} ${name}: ${record.host} → ${ok ? detail : detail}`);
      if (!ok) console.log(`     debería apuntar a ${record.data}`);
    }
    console.log();
  }

  if (fromDomain) {
    const spf = (await txt(fromDomain)).filter((value) => value.startsWith('v=spf1'));
    const dmarc = await txt(`_dmarc.${fromDomain}`);
    console.log(`SPF en ${fromDomain}: ${spf.length ? spf.join(' | ') : '(ninguno)'}`);
    console.log(`DMARC en ${fromDomain}: ${dmarc.length ? dmarc.join(' | ') : '(ninguno)'}`);
  }

  console.log(
    allGood
      ? '\n✅ El dominio del remitente tiene sus registros publicados: el correo puede firmarse con él.'
      : '\n❌ Faltan registros del dominio del remitente. Hasta publicarlos, el correo sale sin firmar con tu dominio y los clientes lo marcan como no autenticado.',
  );
  if (!allGood) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
