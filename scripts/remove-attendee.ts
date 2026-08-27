/**
 * Borra un registro y su retrato en R2.
 *
 *   npm run db:remove -- correo@ejemplo.com
 *
 * Existe porque borrar solo la fila deja el archivo huérfano en el bucket: nadie
 * lo referencia y nada lo va a limpiar después.
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { deleteObject } from '../src/lib/r2';

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error('Uso: npm run db:remove -- correo@ejemplo.com');
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

async function main() {
  const attendee = await prisma.attendee.findUnique({ where: { email } });
  if (!attendee) {
    console.log(`No hay registro con ${email}.`);
    return;
  }

  if (attendee.photoUrl) {
    // La clave es lo que va después del host de la URL pública.
    const key = new URL(attendee.photoUrl).pathname.replace(/^\/+/, '');
    await deleteObject(key).then(
      () => console.log('· retrato borrado:', key),
      (error: Error) => console.log('· retrato NO borrado:', error.message),
    );
  }

  await prisma.attendee.delete({ where: { id: attendee.id } });
  console.log(`· registro borrado: ${attendee.name} ${attendee.surname} <${email}>`);
  console.log('Quedan', await prisma.attendee.count(), 'asistentes.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
