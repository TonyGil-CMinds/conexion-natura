import { NextResponse } from 'next/server';

/**
 * Sirve un retrato de R2 **desde nuestro propio origen**.
 *
 * La credencial se dibuja en un lienzo, y para leer los píxeles de una imagen de
 * otro dominio el navegador exige que ese dominio devuelva cabeceras CORS. El
 * bucket solo las devuelve para los orígenes que estén en su regla, y esa regla
 * se edita a mano en el panel de Cloudflare: cualquier dominio nuevo —una vista
 * previa, otro puerto de desarrollo, un dominio que cambie— se queda con la
 * credencial sin retrato, en silencio y sin que nada lo avise.
 *
 * Pasando por aquí la imagen es del mismo origen que la página: no hay CORS que
 * cumplir, el lienzo no queda «contaminado» y descargar y compartir siguen
 * funcionando en cualquier dominio.
 *
 * Solo repite lo que ya es público —la URL del bucket es pública— y solo desde
 * él: el parámetro se comprueba contra la base pública, así que esto no sirve
 * para traer imágenes de terceros a costa de nuestro servidor.
 */
export async function GET(request: Request) {
  const source = new URL(request.url).searchParams.get('url')?.trim();
  if (!source) return NextResponse.json({ error: 'Falta la imagen.' }, { status: 400 });

  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
  if (!publicBaseUrl) {
    console.error('[api/photo] falta R2_PUBLIC_BASE_URL');
    return NextResponse.json({ error: 'El servidor no está configurado.' }, { status: 500 });
  }

  if (!source.startsWith(`${publicBaseUrl.replace(/\/+$/, '')}/`)) {
    return NextResponse.json({ error: 'Esa imagen no es del sitio.' }, { status: 400 });
  }

  try {
    const upstream = await fetch(source, { cache: 'no-store' });
    if (!upstream.ok || !upstream.body) {
      return NextResponse.json({ error: 'No se pudo leer la imagen.' }, { status: 502 });
    }

    return new NextResponse(upstream.body, {
      headers: {
        'content-type': upstream.headers.get('content-type') ?? 'image/png',
        /**
         * Un objeto de R2 no cambia: su clave la decide el servidor y una imagen
         * nueva es una clave nueva. Así que se puede cachear sin miedo, y la
         * credencial no vuelve a pedir bytes cada vez que se abre.
         */
        'cache-control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('[api/photo] no se pudo traer la imagen', error);
    return NextResponse.json({ error: 'No se pudo leer la imagen.' }, { status: 502 });
  }
}
