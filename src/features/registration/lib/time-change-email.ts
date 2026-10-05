/**
 * El aviso de **cambio de hora** de CEIBA Welcome to Quito.
 *
 * A diferencia del resto de los correos del sitio, este **no es una plantilla de
 * Resend**: su HTML vive aquí. La razón es lo que costó el anterior: la hora
 * estaba escrita a mano dentro de la plantilla, se quedó desfasada cuando el
 * acto se movió, y corregirla por API tropezaba con una validación que obliga a
 * declarar las variables en un formato que la propia API no devuelve.
 *
 * Aquí la hora sale de `SITE.event`, igual que en el sitio, así que el correo y
 * la página no se pueden desincronizar: si una cambia, cambian las dos.
 *
 * **Las reglas del correo no son las de la web.** Gmail y Outlook recortan el
 * CSS, así que esto va con tablas, estilos en línea, anchos en píxeles y
 * `bgcolor` repetido en cada celda —el fondo oscuro se pierde en los clientes
 * que ignoran el CSS—. Nada de hojas externas, tipografías remotas ni flexbox.
 *
 * **Ningún SVG.** Gmail no los pinta: los borra sin dejar hueco. El rótulo de
 * la hora llegó en SVG y se rasterizó a PNG al doble de tamaño; vive en R2 y no
 * en `public/`, para que no dependa de que el sitio esté desplegado.
 */
import { SITE } from '@/config/site';
import { COLOR, FUENTE, IMG, esc, type EmailLocale } from './email-shell';

export type { EmailLocale };

/**
 * El rótulo de la hora, propio de este correo: llegó en SVG y se rasterizó al
 * doble de tamaño porque Gmail no pinta SVG. Vive en R2 y no en `public/` para
 * no depender de que el sitio esté desplegado.
 */
const HORA = 'https://pub-afc673f5a0d34c36ac2107c949e8a854.r2.dev/email/hora-1830.png';

const COPY = {
  es: {
    subject: 'Cambio de hora — CEIBA Welcome to Quito',
    preheader: 'El evento comenzará a las 18:30 ECT, no a las 17:30. Tu registro sigue siendo válido.',
    heroAlt: 'CEIBA Welcome to Quito — Cambio de hora',
    kicker: '¡Tenemos novedades!',
    parrafos: [
      'Queremos contarte que hemos realizado un pequeño ajuste en el horario de CEIBA Welcome to Quito.',
      null, // el del resalte: se arma aparte porque lleva una parte en lima
      '¡Nos vemos en CEIBA!',
    ],
    /** `%INICIO%` lo rellena `SITE.event`: la hora nueva no se escribe dos veces. */
    ajusteFuerte: 'El evento comenzará a las %INICIO% ECT',
    ajusteResto: ', en lugar de las 17:30 ECT. Tu registro sigue siendo válido y no necesitas realizar ninguna acción adicional.',
    rotuloHora: 'Nuevo horario',
    fecha: '5 de octubre, 2026',
    sede: 'Jardín Botánico de Quito, Ecuador',
    cta: 'Ver agenda completa',
    ctaUrl: 'https://ceiba.naturatech.org/es/quito/agenda',
    sitio: 'Visita nuestro sitio web',
    sitioUrl: 'https://ceiba.naturatech.org/es/quito',
    legal: '2026 CEIBA Quito. Todos los derechos reservados.',
  },
  en: {
    subject: 'Time change — CEIBA Welcome to Quito',
    preheader: 'The event now starts at 18:30 ECT, not 17:30. Your registration stands.',
    heroAlt: 'CEIBA Welcome to Quito — Time change',
    kicker: 'We have news!',
    parrafos: [
      'We want to let you know we have made a small adjustment to the schedule for CEIBA Welcome to Quito.',
      null,
      'See you at CEIBA!',
    ],
    ajusteFuerte: 'The event will begin at %INICIO% ECT',
    ajusteResto: ', instead of 17:30 ECT. Your registration remains valid and you do not need to do anything else.',
    rotuloHora: 'New time',
    fecha: 'October 5, 2026',
    sede: 'Jardín Botánico de Quito, Ecuador',
    cta: 'See the full agenda',
    ctaUrl: 'https://ceiba.naturatech.org/en/quito/agenda',
    sitio: 'Visit our website',
    sitioUrl: 'https://ceiba.naturatech.org/en/quito',
    legal: '2026 CEIBA Quito. All rights reserved.',
  },
} as const;

/** Una celda de texto del cuerpo, con la medida y el color que comparten todas. */
function parrafo(contenido: string, extra = ''): string {
  return `<tr><td align="left" bgcolor="${COLOR.fondo}" style="padding:0 40px 18px;font-family:${FUENTE};font-size:13px;line-height:22px;letter-spacing:0.08em;color:${COLOR.crema};text-transform:uppercase;${extra}">${contenido}</td></tr>`;
}

export function timeChangeEmail({
  name,
  locale = 'es',
}: {
  /** El nombre de pila de quien lo recibe. */
  name: string;
  locale?: EmailLocale;
}): { subject: string; html: string; text: string } {
  const t = COPY[locale];
  const hero = locale === 'es' ? IMG.heroEs : IMG.heroEn;
  const nombre = esc(name.trim());
  const horario = SITE.event.scheduleLabel;
  /**
   * La hora de comienzo sale del rótulo del acto y no se escribe aparte. Es lo
   * que falló en el correo anterior: la hora vivía en dos sitios y uno se
   * quedó atrás.
   */
  const inicio = horario.split('—')[0]!.trim();
  const ajuste = t.ajusteFuerte.replace('%INICIO%', inicio);

  const html = `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(t.subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${COLOR.fondo};">
<!-- La línea que el cliente enseña junto al asunto, antes de abrir. -->
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(t.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.fondo}" style="background-color:${COLOR.fondo};">
<tr><td align="center" style="padding:0;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.fondo}" style="width:600px;max-width:600px;background-color:${COLOR.fondo};">

  <!-- Hero: trae dentro la cabecera de marca y el titular. -->
  <tr><td align="center" style="padding:0;font-size:0;line-height:0;">
    <img src="${hero}" width="600" alt="${esc(t.heroAlt)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;">
  </td></tr>

  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:36px 40px 10px;font-family:${FUENTE};font-size:13px;line-height:20px;letter-spacing:0.14em;color:${COLOR.lima};text-transform:uppercase;">${esc(t.kicker)}</td></tr>

  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:0 40px 28px;font-family:${FUENTE};font-size:20px;line-height:28px;letter-spacing:0.08em;color:${COLOR.crema};text-transform:uppercase;font-weight:bold;">${nombre}</td></tr>

  ${parrafo(esc(t.parrafos[0]!))}
  ${parrafo(`<strong style="color:${COLOR.lima};">${esc(ajuste)}</strong>${esc(t.ajusteResto)}`)}
  ${parrafo(esc(t.parrafos[2]!), 'padding-bottom:34px;')}

  <!-- El glifo que separa el aviso del dato. -->
  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:0 40px 24px;font-size:0;line-height:0;">
    <img src="${IMG.divider}" width="40" alt="" style="display:block;width:40px;height:auto;border:0;outline:none;">
  </td></tr>

  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:0 40px 14px;font-family:${FUENTE};font-size:13px;line-height:20px;letter-spacing:0.14em;color:${COLOR.lima};text-transform:uppercase;">${esc(t.rotuloHora)}</td></tr>

  <!-- La hora, rasterizada: el original venía en SVG y Gmail no lo pinta. -->
  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:0 40px 18px;font-size:0;line-height:0;">
    <img src="${HORA}" width="183" alt="18:30" style="display:block;width:183px;height:auto;border:0;outline:none;">
  </td></tr>

  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:0 40px 8px;font-family:${FUENTE};font-size:13px;line-height:20px;letter-spacing:0.1em;color:${COLOR.crema};text-transform:uppercase;font-weight:bold;">${esc(t.fecha)}. ${esc(horario)} ECT</td></tr>

  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:0 40px 34px;font-family:${FUENTE};font-size:13px;line-height:20px;letter-spacing:0.1em;color:${COLOR.lima};text-transform:uppercase;">${esc(t.sede)}</td></tr>

  <!-- Botón de tabla y no de enlace con relleno: Outlook ignora el padding de un <a>. -->
  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:0 40px 48px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
      <tr><td align="center" bgcolor="${COLOR.lima}" style="background-color:${COLOR.lima};padding:18px 24px;">
        <a href="${t.ctaUrl}" style="font-family:${FUENTE};font-size:15px;line-height:20px;letter-spacing:0.14em;color:${COLOR.tinta};text-transform:uppercase;text-decoration:none;font-weight:bold;display:block;">${esc(t.cta)}</a>
      </td></tr>
    </table>
  </td></tr>

  <!-- Pie: el logotipo a la izquierda y el enlace al sitio a la derecha. -->
  <tr><td bgcolor="${COLOR.fondo}" style="padding:0 40px 36px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="left" valign="middle" style="font-size:0;line-height:0;">
          <img src="${IMG.footer}" width="160" alt="CEIBA Welcome to Quito" style="display:block;width:160px;height:auto;border:0;outline:none;">
        </td>
        <td align="right" valign="middle" style="font-family:${FUENTE};font-size:12px;line-height:18px;letter-spacing:0.1em;text-transform:uppercase;">
          <a href="${t.sitioUrl}" style="color:${COLOR.crema};text-decoration:none;font-weight:bold;">${esc(t.sitio)}</a>
        </td>
      </tr>
    </table>
  </td></tr>

  <tr><td align="center" bgcolor="${COLOR.fondo}" style="border-top:1px solid #2a332c;padding:22px 40px 34px;font-family:${FUENTE};font-size:11px;line-height:18px;letter-spacing:0.06em;color:#7f8a81;">${esc(t.legal)}</td></tr>

</table>

</td></tr>
</table>
</body>
</html>`;

  /**
   * La versión en texto plano. No es un adorno: sin ella, los filtros puntúan
   * peor el mensaje y quien lee en un cliente sin HTML se queda sin el aviso.
   */
  const text = [
    t.kicker.toUpperCase(),
    '',
    name.trim(),
    '',
    t.parrafos[0],
    '',
    `${ajuste}${t.ajusteResto}`,
    '',
    `${t.rotuloHora}: ${t.fecha}, ${horario} ECT`,
    t.sede,
    '',
    `${t.cta}: ${t.ctaUrl}`,
    '',
    t.parrafos[2],
    '',
    t.legal,
  ].join('\n');

  return { subject: t.subject, html, text };
}
