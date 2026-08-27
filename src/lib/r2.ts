import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

/**
 * Cliente de Cloudflare R2 (API compatible con S3).
 *
 * **Solo servidor.** Las claves de R2 dan permiso de escritura sobre el bucket:
 * si este módulo llegara al navegador, cualquiera podría subir lo que quisiera.
 *
 * El reparto es: el navegador sube el archivo **directamente** a R2 con una URL
 * firmada, y el servidor solo firma. Si el archivo pasara por el servidor,
 * tendríamos que subirlo dos veces y chocaríamos con el límite de tamaño de
 * cuerpo de las funciones (4,5 MB en Vercel), que un retrato en PNG sin fondo
 * roza sin esfuerzo.
 */

/** Lo que hace falta en el entorno. Se lee al usarse, no al importar el módulo. */
function config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;

  const missing = Object.entries({ R2_ACCOUNT_ID: accountId, R2_ACCESS_KEY_ID: accessKeyId, R2_SECRET_ACCESS_KEY: secretAccessKey, R2_BUCKET: bucket, R2_PUBLIC_BASE_URL: publicBaseUrl })
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length) {
    throw new Error(`Falta configuración de R2 en .env: ${missing.join(', ')}.`);
  }

  return {
    accountId: accountId!,
    accessKeyId: accessKeyId!,
    secretAccessKey: secretAccessKey!,
    bucket: bucket!,
    // Sin barra final: la clave del objeto ya la aporta.
    publicBaseUrl: publicBaseUrl!.replace(/\/+$/, ''),
  };
}

let client: S3Client | undefined;

function r2() {
  if (client) return client;
  const { accountId, accessKeyId, secretAccessKey } = config();
  client = new S3Client({
    // R2 no usa regiones, pero el SDK exige una.
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
    /**
     * Las versiones recientes del SDK añaden por defecto una suma CRC32 al
     * cuerpo. En una URL firmada esa cabecera entra en la firma pero el
     * navegador no la envía, y R2 responde 403. Con `WHEN_REQUIRED` solo se
     * calcula donde el protocolo la exige.
     */
    requestChecksumCalculation: 'WHEN_REQUIRED',
    responseChecksumValidation: 'WHEN_REQUIRED',
  });
  return client;
}

/** Tipos admitidos y su extensión. La lista es el contrato con el navegador. */
export const ALLOWED_IMAGE_TYPES = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
} as const;

export type AllowedImageType = keyof typeof ALLOWED_IMAGE_TYPES;

export function isAllowedImageType(value: string): value is AllowedImageType {
  return value in ALLOWED_IMAGE_TYPES;
}

/** Tope de tamaño, en bytes. El retrato de una credencial no necesita más. */
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/**
 * URL pública de un objeto ya subido. Es lo único que se guarda en la base de
 * datos: el archivo vive en R2 y la fila solo apunta a él.
 */
export function publicUrl(key: string) {
  return `${config().publicBaseUrl}/${key}`;
}

/**
 * Firma una subida y devuelve a dónde escribir y con qué URL quedará el archivo.
 *
 * La clave la decide el servidor y no el cliente: con un nombre de archivo
 * elegido por quien sube se podría sobrescribir el retrato de otra persona.
 */
export async function signPhotoUpload({ contentType, id }: { contentType: AllowedImageType; id: string }) {
  const { bucket } = config();
  const key = `attendees/${id}.${ALLOWED_IMAGE_TYPES[contentType]}`;

  const uploadUrl = await getSignedUrl(
    r2(),
    new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType }),
    // Lo justo para subir el archivo; no es un permiso duradero.
    { expiresIn: 600 },
  );

  return { uploadUrl, key, url: publicUrl(key) };
}

/** Borra un objeto. Para reemplazos, cuando la extensión cambia. */
export async function deleteObject(key: string) {
  const { bucket } = config();
  await r2().send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
}
