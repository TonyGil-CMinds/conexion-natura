/**
 * Comprobación de conexión: una lectura real contra la base de datos.
 *
 *   npx tsx scripts/verify-prisma.ts
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('Falta DATABASE_URL: revisa el archivo .env.');

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const attendees = await prisma.attendee.findMany({
    select: { name: true, surname: true, organization: true, invitation: { select: { code: true } } },
    orderBy: { createdAt: 'asc' },
  });
  const invitations = await prisma.invitation.count();

  console.log('✅ Connected');
  console.log(`   ${invitations} invitaciones, ${attendees.length} asistentes.`);
  for (const attendee of attendees) {
    console.log(`   · ${attendee.name} ${attendee.surname} — ${attendee.organization} (${attendee.invitation?.code ?? 'sin invitación'})`);
  }
}

main()
  .catch((error) => {
    // Se imprime el error tal cual: cualquier resumen esconde la causa real.
    console.error('❌ No se pudo conectar:');
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
