/**
 * Ida y vuelta completa contra R2: firma, sube, lee por la URL pública y borra.
 *
 *   npx tsx scripts/verify-r2.ts
 *
 * Comprueba las dos mitades por separado, que fallan por motivos distintos: la
 * escritura depende de las claves del token, y la lectura de que el bucket esté
 * expuesto en `R2_PUBLIC_BASE_URL`.
 */
import 'dotenv/config';
import { deleteObject, publicUrl, signPhotoUpload } from '../src/lib/r2';

// PNG de 1×1 píxel, para no depender de ningún archivo del proyecto.
const PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
  'base64',
);

async function main() {
  const id = `verificacion-${Date.now()}`;
  const { uploadUrl, key, url } = await signPhotoUpload({ contentType: 'image/png', id });
  console.log('· firma obtenida para', key);

  const put = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'content-type': 'image/png' },
    body: PIXEL,
  });
  if (!put.ok) throw new Error(`La subida falló: ${put.status} ${put.statusText}\n${await put.text()}`);
  console.log('· subida correcta');

  const get = await fetch(url);
  if (!get.ok) {
    throw new Error(
      `El objeto no se puede leer en ${url}: ${get.status} ${get.statusText}.\n` +
        'Revisa que el bucket tenga acceso público (r2.dev o dominio propio) y que R2_PUBLIC_BASE_URL apunte ahí.',
    );
  }
  const bytes = (await get.arrayBuffer()).byteLength;
  console.log(`· lectura pública correcta (${bytes} bytes, ${get.headers.get('content-type')})`);

  await deleteObject(key);
  console.log('· objeto de prueba borrado');

  console.log('✅ Connected');
  console.log(`   Bucket ${process.env.R2_BUCKET}, URLs bajo ${publicUrl('')}`);
}

main().catch((error) => {
  console.error('❌ R2 no responde como se espera:');
  console.error(error);
  process.exit(1);
});
