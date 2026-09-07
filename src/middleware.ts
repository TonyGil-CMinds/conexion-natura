import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/config';

/**
 * Manda al idioma por defecto lo que llegue sin prefijo.
 *
 * Hace falta porque el layout raíz vive bajo `[locale]` —es el único que puede
 * poner `<html lang>`—, así que `/` y `/agenda` no existen como rutas. En vez de
 * duplicar cada página, se redirige: `/agenda` → `/es/agenda`.
 *
 * No negocia por `Accept-Language` a propósito: el idioma queda en la URL, que es
 * lo que se comparte y lo que indexa el buscador. Adivinarlo haría que dos
 * personas vieran cosas distintas en el mismo enlace.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  /**
   * Todo menos la API, los recursos de Next y los archivos con extensión: un
   * `.svg` de `public/` no tiene idioma, y redirigirlo lo rompería.
   */
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
