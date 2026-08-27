/**
 * Configuración de la CLI de Prisma.
 *
 * `dotenv/config` va primero: sin él, `env()` no ve el `.env` donde vive la
 * cadena de conexión (Next.js sí lo carga solo, pero la CLI no es Next.js).
 */
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    // La semilla se declara aquí y no en `package.json#prisma.seed`: en Prisma 7
    // este archivo es la única fuente de configuración de la CLI.
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
