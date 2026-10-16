import { createHash, timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';
import { publicBaseUrl, signGalleryUpload } from '@/lib/r2';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const headers = { 'Cache-Control': 'private, no-store', Vary: 'Authorization' };
const digest = (value: string) => createHash('sha256').update(value).digest();

/** Lo que se puede subir a la galería. Nada fuera de su carpeta ni de estos tipos. */
const KEY = /^galeria\/[a-z0-9][a-z0-9/_.-]*$/;
const TYPES = new Set(['image/webp', 'image/jpeg', 'image/png', 'video/mp4', 'application/json']);
const MAX_OBJECTS = 300;

type Requested = {
  key: string;
  contentType: string;
  cacheControl: string;
  contentDisposition?: string;
};

function valid(item: unknown): item is Requested {
  if (!item || typeof item !== 'object') return false;
  const { key, contentType, cacheControl, contentDisposition } = item as Record<string, unknown>;
  return (
    typeof key === 'string' &&
    KEY.test(key) &&
    !key.includes('..') &&
    typeof contentType === 'string' &&
    TYPES.has(contentType) &&
    typeof cacheControl === 'string' &&
    cacheControl.length < 200 &&
    (contentDisposition === undefined ||
      (typeof contentDisposition === 'string' && contentDisposition.length < 200))
  );
}

/**
 * Firma las subidas de la galería.
 *
 * Existe porque las claves de R2 son **secretas en Vercel** y solo viven en
 * producción: ni `vercel env pull` las trae. El script de subida
 * (`npm run galeria:subir`) pide aquí las URLs firmadas y sube los archivos
 * directo al bucket, sin que las claves ni las fotos pasen por otro sitio.
 *
 * Sin `CEIBA_GALLERY_TOKEN` en el entorno la ruta no existe: borrar esa
 * variable la apaga.
 */
export async function POST(request: Request) {
  const secret = process.env.CEIBA_GALLERY_TOKEN;
  if (!secret) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404, headers });
  }
  const token = request.headers.get('authorization')?.match(/^Bearer (\S+)$/i)?.[1];
  if (!token || !timingSafeEqual(digest(token), digest(secret))) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401, headers });
  }

  const body = (await request.json().catch(() => null)) as { objects?: unknown } | null;
  const objects = Array.isArray(body?.objects) ? body.objects : null;
  if (!objects || objects.length === 0 || objects.length > MAX_OBJECTS || !objects.every(valid)) {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400, headers });
  }

  try {
    const uploads = await Promise.all(objects.map((object) => signGalleryUpload(object)));
    return NextResponse.json({ publicBaseUrl: publicBaseUrl(), uploads }, { headers });
  } catch {
    console.error('[api/galeria/firmar] Signing failed.');
    return NextResponse.json({ error: 'Signing unavailable.' }, { status: 500, headers });
  }
}
