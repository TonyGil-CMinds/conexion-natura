/**
 * Abre el bucket de R2 a las subidas desde el navegador.
 *
 *   npx tsx scripts/r2-cors.ts
 *
 * Sin esta regla el `PUT` firmado se cae en la comprobación previa (CORS): la
 * URL está bien firmada, pero el navegador ni llega a enviarla.
 *
 * Los orígenes salen de `R2_CORS_ORIGINS` (separados por comas). En local basta
 * `http://localhost:3000`; al desplegar hay que volver a ejecutarlo con el
 * dominio de producción añadido.
 */
import 'dotenv/config';
import { GetBucketCorsCommand, PutBucketCorsCommand, S3Client } from '@aws-sdk/client-s3';

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
const missing = Object.entries({ R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET })
  .filter(([, value]) => !value)
  .map(([key]) => key);
if (missing.length) throw new Error(`Falta en .env: ${missing.join(', ')}.`);

const origins = (process.env.R2_CORS_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID!, secretAccessKey: R2_SECRET_ACCESS_KEY! },
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

async function main() {
  await client.send(
    new PutBucketCorsCommand({
      Bucket: R2_BUCKET,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedOrigins: origins,
            // Solo subir. La lectura va por la URL pública, que no pasa por aquí.
            AllowedMethods: ['PUT'],
            AllowedHeaders: ['content-type'],
            MaxAgeSeconds: 3600,
          },
        ],
      },
    }),
  );

  const current = await client.send(new GetBucketCorsCommand({ Bucket: R2_BUCKET }));
  console.log('✅ CORS configurado en', R2_BUCKET);
  console.log(JSON.stringify(current.CORSRules, null, 2));
}

main().catch((error) => {
  console.error('❌ No se pudo configurar CORS:');
  console.error(error);
  process.exit(1);
});
