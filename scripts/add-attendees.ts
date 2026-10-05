/**
 * Da de alta a mano a un puñado de personas y les manda su confirmación.
 *
 *   npm run lista:alta              # solo enseña qué haría
 *   npm run lista:alta -- --aplicar
 *
 * **Por omisión no escribe ni envía nada.**
 *
 * Es para las altas que llegan por fuera del formulario: alguien del equipo
 * pasa cuatro nombres y hay que meterlos. La lista va escrita aquí abajo a
 * propósito y no en un CSV: son pocas, y así queda en el repositorio quién se
 * añadió y cuándo.
 *
 * Dos cuidados que no son evidentes:
 *
 * - **A quien ya está no se le pisan sus datos.** Si se registró ella misma, su
 *   cargo y su organización son los que escribió, no los de una lista pasada a
 *   mano. Solo se asegura que quede confirmada.
 * - **La confirmación sale una vez.** Se mira `confirmationSentAt`, igual que
 *   `mail:pending`, así que a quien ya la recibió no se le repite. Y la marca se
 *   escribe **después** del envío: al revés que en los avisos masivos, aquí
 *   repetir una confirmación es menos malo que no mandarla nunca.
 */
import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { confirmationTemplateData } from '../src/features/registration/lib/confirmation-email';
import { sendTemplate } from '../src/lib/resend';

/** Quiénes entran. El correo se compara en minúsculas. */
const GENTE = [
  {
    email: 'rossnaira@redimpacto.org',
    name: 'Rossnaira',
    surname: 'Martínez',
    organization: 'Red de Impacto Latam',
    role: 'Directora de Comunicación Estratégica',
  },
  {
    email: 'janeth@latimpacto.org',
    name: 'Janeth',
    surname: 'Londoño Becerra',
    organization: 'Latimpacto',
    role: 'Coordinadora Fondo Verde Catalítico',
  },
  {
    email: 'anagreta@startuplab.mx',
    name: 'Ana Greta',
    surname: 'Ibañez Díaz',
    organization: 'StartupLab MX',
    role: 'CEO',
  },
  {
    email: 'lapacely@universidadean.edu.co',
    name: 'Laura',
    surname: 'Cely Gómez',
    organization: 'Impacta - Emprendimiento Sostenible',
    role: 'Coordinadora de Aceleración',
  },
] as const;

async function main() {
  const aplicar = process.argv.includes('--aplicar');

  const correos = GENTE.map((p) => p.email.toLowerCase());
  const existentes = await prisma.attendee.findMany({
    where: { email: { in: correos } },
    select: { email: true, name: true, surname: true, status: true, events: true, confirmationSentAt: true },
  });
  const porCorreo = new Map(existentes.map((a) => [a.email, a]));

  console.log('qué pasaría con cada una:\n');
  for (const p of GENTE) {
    const ya = porCorreo.get(p.email.toLowerCase());
    const alta = ya ? (ya.status === 'CONFIRMED' ? 'ya estaba confirmada' : `${ya.status} → CONFIRMED`) : 'ALTA NUEVA';
    const correo = ya?.confirmationSentAt
      ? `ya recibió su confirmación el ${ya.confirmationSentAt.toISOString().slice(0, 10)}`
      : 'se le manda la confirmación';
    console.log(`  ${p.email.padEnd(32)} ${alta.padEnd(22)} ${correo}`);
  }

  const porEnviar = GENTE.filter((p) => !porCorreo.get(p.email.toLowerCase())?.confirmationSentAt);
  console.log(`\naltas nuevas: ${GENTE.length - existentes.length}   ·   confirmaciones a enviar: ${porEnviar.length}`);

  if (!aplicar) {
    console.log('\nNo se escribió ni se envió nada. Añade --aplicar para hacerlo.');
    return;
  }

  for (const p of GENTE) {
    const email = p.email.toLowerCase();
    await prisma.attendee.upsert({
      where: { email },
      /** A quien ya está solo se le asegura la plaza: sus datos son suyos. */
      update: {
        status: 'CONFIRMED',
        events: { set: Array.from(new Set([...(porCorreo.get(email)?.events ?? []), 'NIGHT'])) },
      },
      create: {
        email,
        name: p.name,
        surname: p.surname,
        organization: p.organization,
        role: p.role,
        events: ['NIGHT'],
        status: 'CONFIRMED',
      },
    });
  }
  console.log(`\n✅ ${GENTE.length} filas al día.`);

  if (!porEnviar.length) {
    console.log('Ninguna confirmación que mandar: todas la tenían ya.');
    return;
  }

  // La puerta se cierra sobre estas direcciones y nadie más.
  process.env.CEIBA_EMAIL_ALLOWLIST = porEnviar.map((p) => p.email.toLowerCase()).join(',');

  for (const p of porEnviar) {
    const email = p.email.toLowerCase();
    const fila = await prisma.attendee.findUniqueOrThrow({
      where: { email },
      select: { id: true, name: true, surname: true, events: true },
    });

    const { data, missing } = confirmationTemplateData({
      name: fila.name,
      surname: fila.surname,
      events: fila.events,
    });
    /** Resend entregaría el correo con la fecha en blanco, así que aquí se para. */
    if (missing.length) {
      console.error(`  ❌ ${email}: faltan datos del evento (${missing.join(', ')})`);
      continue;
    }

    const r = await sendTemplate({ to: email, data });
    if (r.status === 'sent') {
      await prisma.attendee.update({ where: { id: fila.id }, data: { confirmationSentAt: new Date() } });
      console.log(`  ✅ ${email} (${r.id ?? 'sin id'})`);
    } else {
      console.error(`  ❌ ${email}: ${JSON.stringify(r)}`);
      process.exitCode = 1;
    }
  }
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
