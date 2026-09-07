/**
 * Dominio del sitio, en un solo lugar.
 *
 * Lo necesitan los metadatos (para `canonical` y `hreflang`) y el correo de
 * confirmación (para los enlaces). Vercel pone el dominio de producción en el
 * entorno; en local queda el localhost, que no se indexa, así que no hay que
 * configurar nada para desarrollar.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');
