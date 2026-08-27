/**
 * Semilla: unas invitaciones y un asistente de ejemplo.
 *
 * Es idempotente (`upsert` por clave única) para poder ejecutarla dos veces sin
 * duplicar nada. No usa el singleton de `src/lib/prisma.ts` porque ese vive
 * pensado para el servidor de Next.js; aquí interesa cerrar la conexión al
 * terminar el script.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('Falta DATABASE_URL: revisa el archivo .env.');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

const INVITATIONS = [
  { code: 'C500-0001', email: 'kathrin.mendoza@example.com' },
  { code: 'C500-0002', email: 'regina.cervera@example.com' },
  { code: 'C500-0003', email: null },
  { code: 'C500-0004', email: null },
] as const;

async function main() {
  for (const invitation of INVITATIONS) {
    await prisma.invitation.upsert({
      where: { code: invitation.code },
      update: { email: invitation.email },
      create: { code: invitation.code, email: invitation.email },
    });
  }

  // Un registro ya confirmado, atado a su invitación: sirve para probar la
  // pantalla de resumen sin pasar por el formulario.
  const claimed = await prisma.invitation.findUniqueOrThrow({ where: { code: 'C500-0002' } });
  await prisma.attendee.upsert({
    where: { email: 'regina.cervera@example.com' },
    update: {},
    create: {
      email: 'regina.cervera@example.com',
      name: 'Regina',
      surname: 'Cervera',
      organization: 'Natura TechLAC',
      role: 'Directora de inversión',
      linkedin: 'https://www.linkedin.com/in/regina-cervera',
      invitationId: claimed.id,
    },
  });

  const [invitations, attendees] = await Promise.all([
    prisma.invitation.count(),
    prisma.attendee.count(),
  ]);
  console.log(`Semilla lista: ${invitations} invitaciones, ${attendees} asistentes.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
