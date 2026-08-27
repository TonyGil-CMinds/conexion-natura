import { NextResponse } from 'next/server';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, isAllowedImageType, signPhotoUpload } from '@/lib/r2';

/**
 * Firma la subida del retrato de la credencial.
 *
 * El navegador pide permiso aquí, sube el archivo directamente a R2 y se queda
 * con la URL pública para mandarla luego en el registro. Así el archivo no pasa
 * por el servidor: solo la firma.
 *
 * La clave del objeto la decide el servidor. Si la eligiera el cliente, un
 * nombre repetido sobrescribiría el retrato de otra persona.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido: se esperaba JSON.' }, { status: 400 });
  }

  const { contentType, size } = (body ?? {}) as { contentType?: unknown; size?: unknown };

  if (typeof contentType !== 'string' || !isAllowedImageType(contentType)) {
    return NextResponse.json(
      { error: `Formato no admitido. Usa ${Object.keys(ALLOWED_IMAGE_TYPES).join(', ')}.` },
      { status: 415 },
    );
  }

  // El tamaño se comprueba aquí para no firmar una subida que va a sobrar, pero
  // el número lo dice el cliente: no es una garantía. El límite de verdad hay
  // que ponerlo en el bucket (regla de tamaño máximo de objeto).
  if (typeof size !== 'number' || !Number.isFinite(size) || size <= 0) {
    return NextResponse.json({ error: 'Falta el tamaño del archivo.' }, { status: 400 });
  }
  if (size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: `La imagen supera ${Math.round(MAX_IMAGE_BYTES / (1024 * 1024))} MB.` },
      { status: 413 },
    );
  }

  try {
    const upload = await signPhotoUpload({ contentType, id: crypto.randomUUID() });
    return NextResponse.json(upload);
  } catch (error) {
    // El detalle va al registro del servidor, no a la respuesta: el mensaje de
    // configuración nombra las variables de entorno.
    console.error('[uploads/photo] no se pudo firmar la subida', error);
    return NextResponse.json({ error: 'No se pudo preparar la subida.' }, { status: 500 });
  }
}
