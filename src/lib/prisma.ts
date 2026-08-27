import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

/**
 * Cliente de Prisma, uno por proceso.
 *
 * **Solo servidor.** No debe importarse desde un componente de cliente: llevaría
 * el driver de Postgres —y la cadena de conexión— al navegador.
 *
 * Se guarda en `globalThis` porque en desarrollo Next.js recarga los módulos en
 * cada cambio: sin el caché, cada recarga abriría un pool nuevo y la base de
 * datos acabaría rechazando conexiones. En producción el módulo se evalúa una
 * vez y la rama del caché no se usa.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Falta DATABASE_URL: revisa el archivo .env.');
  }
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
