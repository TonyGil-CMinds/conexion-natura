/**
 * El **recordatorio** del día del acto: horario, cómo llegar y qué se van a
 * encontrar.
 *
 * Como el aviso de cambio de hora, su HTML vive aquí y no en una plantilla de
 * Resend. Comparte con aquel el hero, el pie y la paleta —son el mismo acto y
 * la misma campaña— y de ahí salen importados en vez de copiados: si cambia el
 * logotipo del pie, cambia en los dos.
 *
 * Las reglas del correo mandan sobre las de la web: tablas, estilos en línea,
 * anchos en píxeles, `bgcolor` repetido en cada celda y ningún SVG, que Gmail
 * borra sin dejar hueco. Los dos rótulos dibujados —la hora y la pregunta—
 * llegaron como PNG y viven en R2, no en `public/`, para no depender de que el
 * sitio esté desplegado.
 */
import { SITE } from '@/config/site';
import { COLOR, FUENTE, IMG, esc, type EmailLocale } from './email-shell';

/** Los dos rótulos propios de este correo. */
const ROTULO = {
  hora: 'https://pub-afc673f5a0d34c36ac2107c949e8a854.r2.dev/email/recordatorio-hora.png',
  pregunta: 'https://pub-afc673f5a0d34c36ac2107c949e8a854.r2.dev/email/recordatorio-pregunta.png',
} as const;

/** El ámbar del aviso. Es el del glifo que ya separa secciones en estos correos. */
const AVISO = '#fecc0c';

const COPY = {
  es: {
    subject: 'Nos vemos hoy — CEIBA | Welcome to Quito',
    preheader: 'Hoy a las 18:30 en la Rotonda del Jardín Botánico, junto al orquideario.',
    heroAlt: 'CEIBA Welcome to Quito',
    saludo: '¡Hola!',
    entrada: {
      antes: 'Nos entusiasma mucho recibirles en ',
      fuerte: 'CEIBA | Welcome to Quito este lunes 5 de octubre en el marco del GET Forum.',
    },
    detalles: 'Les compartimos algunos detalles importantes para tener a la mano:',
    rotuloHora: 'Horario',
    aviso: 'Importante: hemos realizado un ajuste en el horario de inicio.',
    sede: 'Rotonda del Jardín Botánico de Quito, junto al orquideario',
    llegada: [
      'Consideren aproximadamente 3-5 minutos caminando desde la entrada principal del Jardín Botánico.',
      'Se permitirá el ingreso a automóviles hasta la boletería. Si van en Uber, indiquen a sus conductores que entren y no los dejen en la avenida. Una vez dentro verán la señalética del evento. ¡Tendremos sombrillas por si son necesarias!',
    ],
    cta: 'Ver agenda completa',
    ctaUrl: 'https://ceiba.naturatech.org/es/quito/agenda',
    preguntaAlt: '¿Qué encontrarán en CEIBA | Welcome to Quito?',
    /**
     * Los tramos con resalte van partidos a mano y no con marcas dentro del
     * texto: el resalte cae a mitad de frase y en un correo no hay dónde
     * interpretarlo. Cada pareja es «lo normal» y «lo que va en lima».
     */
    cuerpo: [
      [
        'Una noche para encontrarnos con ',
        'bioemprendedores, inversionistas, financiadores y líderes de distintos sectores',
        ' que están impulsando nuevas industrias verdes y azules regenerativas en América Latina y el Caribe.',
      ],
      [
        'Queremos crear un espacio relajado para ',
        'descubrir qué viene, conocer a quienes lo están construyendo y explorar qué podemos desbloquear juntos,',
        ' conectando capital, mercados, tecnología y naturaleza.',
      ],
      [
        'CEIBA Welcome to Quito es convocado por ',
        'NaturaTech LAC – Natura500 (BID Lab y C Minds), Red de Impacto Latam, Latimpacto e IMPAQTO, a través del Fondo Verde Catalítico.',
        '',
      ],
    ],
    despedida: 'Nos vemos en el Jardín Botánico.',
    sitio: 'Visita nuestro sitio web',
    sitioUrl: 'https://ceiba.naturatech.org/es/quito',
    legal: '2026 CEIBA Quito. Todos los derechos reservados.',
  },
  en: {
    subject: 'See you today — CEIBA | Welcome to Quito',
    preheader: 'Today at 18:30 at the Jardín Botánico rotunda, next to the orchid house.',
    heroAlt: 'CEIBA Welcome to Quito',
    saludo: 'Hello!',
    entrada: {
      antes: 'We are delighted to welcome you to ',
      fuerte: 'CEIBA | Welcome to Quito this Monday 5 October, as part of the GET Forum.',
    },
    detalles: 'Here are a few details worth keeping to hand:',
    rotuloHora: 'Schedule',
    aviso: 'Important: we have adjusted the start time.',
    sede: 'Rotunda of the Jardín Botánico de Quito, next to the orchid house',
    llegada: [
      'Allow roughly 3-5 minutes on foot from the main entrance of the Jardín Botánico.',
      'Cars may drive in as far as the ticket office. If you come by Uber, ask your driver to go in rather than drop you on the avenue. Once inside you will see the event signage. We will have umbrellas on hand if they are needed.',
    ],
    cta: 'See the full agenda',
    ctaUrl: 'https://ceiba.naturatech.org/en/quito/agenda',
    preguntaAlt: 'What will you find at CEIBA | Welcome to Quito?',
    cuerpo: [
      [
        'An evening to meet ',
        'bio-entrepreneurs, investors, funders and leaders from many sectors',
        ' who are building new regenerative green and blue industries across Latin America and the Caribbean.',
      ],
      [
        'We want to make a relaxed space to ',
        'discover what is coming, meet the people building it and explore what we can unlock together,',
        ' connecting capital, markets, technology and nature.',
      ],
      [
        'CEIBA Welcome to Quito is convened by ',
        'NaturaTech LAC – Natura500 (BID Lab and C Minds), Red de Impacto Latam, Latimpacto and IMPAQTO, through the Fondo Verde Catalítico.',
        '',
      ],
    ],
    despedida: 'See you at the Jardín Botánico.',
    sitio: 'Visit our website',
    sitioUrl: 'https://ceiba.naturatech.org/en/quito',
    legal: '2026 CEIBA Quito. All rights reserved.',
  },
} as const;

/** Una celda de texto del cuerpo, con la medida que comparten todas. */
function parrafo(contenido: string, extra = ''): string {
  return `<tr><td align="left" bgcolor="${COLOR.fondo}" style="padding:0 40px 20px;font-family:${FUENTE};font-size:13px;line-height:22px;letter-spacing:0.06em;color:${COLOR.crema};text-transform:uppercase;${extra}">${contenido}</td></tr>`;
}

/** Lo mismo, con una parte en lima: el resalte cae a mitad de frase. */
function parrafoConResalte([antes, fuerte, despues]: readonly string[]): string {
  return parrafo(
    `${esc(antes ?? '')}<strong style="color:${COLOR.lima};">${esc(fuerte ?? '')}</strong>${esc(despues ?? '')}`,
  );
}

export function reminderEmail({
  name,
  locale = 'es',
}: {
  name: string;
  locale?: EmailLocale;
}): { subject: string; html: string; text: string } {
  const t = COPY[locale];
  const hero = locale === 'es' ? IMG.heroEs : IMG.heroEn;
  const nombre = esc(name.trim());
  const horario = SITE.event.scheduleLabel;

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
<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">${esc(t.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.fondo}" style="background-color:${COLOR.fondo};">
<tr><td align="center" style="padding:0;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLOR.fondo}" style="width:600px;max-width:600px;background-color:${COLOR.fondo};">

  <tr><td align="center" style="padding:0;font-size:0;line-height:0;">
    <img src="${hero}" width="600" alt="${esc(t.heroAlt)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;text-decoration:none;">
  </td></tr>

  ${parrafo(`${esc(t.saludo)} <span style="color:${COLOR.lima};">${nombre}</span>`, 'padding-top:36px;')}
  ${parrafo(`${esc(t.entrada.antes)}<strong style="color:${COLOR.lima};">${esc(t.entrada.fuerte)}</strong>`)}
  ${parrafo(esc(t.detalles), 'padding-bottom:30px;')}

  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:0 40px 10px;font-family:${FUENTE};font-size:13px;line-height:20px;letter-spacing:0.14em;color:${COLOR.lima};text-transform:uppercase;">${esc(t.rotuloHora)}</td></tr>

  <!-- La hora, dibujada: el rótulo es tipografía de marca y no se puede pedir por CSS. -->
  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:0 40px 26px;font-size:0;line-height:0;">
    <img src="${ROTULO.hora}" width="324" alt="${esc(horario)}" style="display:block;width:324px;max-width:100%;height:auto;border:0;outline:none;">
  </td></tr>

  <!-- El aviso del cambio, enmarcado: es lo único que alguien podría no saber ya. -->
  <tr><td bgcolor="${COLOR.fondo}" style="padding:0 40px 30px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td align="center" style="border:1px solid ${AVISO};padding:16px 20px;font-family:${FUENTE};font-size:12px;line-height:20px;letter-spacing:0.06em;color:${COLOR.crema};text-transform:uppercase;">
        <span style="color:${AVISO};">&#9888;</span> ${esc(t.aviso)}
      </td></tr>
    </table>
  </td></tr>

  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:0 40px 22px;font-family:${FUENTE};font-size:13px;line-height:22px;letter-spacing:0.14em;color:${COLOR.lima};text-transform:uppercase;font-weight:bold;">${esc(t.sede)}</td></tr>

  ${t.llegada.map((linea) => parrafo(`<em>${esc(linea)}</em>`)).join('\n  ')}

  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:14px 40px 44px;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;">
      <tr><td align="center" bgcolor="${COLOR.lima}" style="background-color:${COLOR.lima};padding:18px 24px;">
        <a href="${t.ctaUrl}" style="font-family:${FUENTE};font-size:15px;line-height:20px;letter-spacing:0.14em;color:${COLOR.tinta};text-transform:uppercase;text-decoration:none;font-weight:bold;display:block;">${esc(t.cta)}</a>
      </td></tr>
    </table>
  </td></tr>

  <tr><td align="center" bgcolor="${COLOR.fondo}" style="padding:0 40px 30px;font-size:0;line-height:0;">
    <img src="${ROTULO.pregunta}" width="420" alt="${esc(t.preguntaAlt)}" style="display:block;width:420px;max-width:100%;height:auto;border:0;outline:none;">
  </td></tr>

  ${t.cuerpo.map((tramos) => parrafoConResalte(tramos)).join('\n  ')}

  ${parrafo(`<strong>${esc(t.despedida)}</strong>`, 'padding-bottom:40px;')}

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

  const text = [
    `${t.saludo} ${name.trim()}`,
    '',
    `${t.entrada.antes}${t.entrada.fuerte}`,
    '',
    t.detalles,
    '',
    `${t.rotuloHora}: ${horario}`,
    t.aviso,
    '',
    t.sede,
    ...t.llegada,
    '',
    `${t.cta}: ${t.ctaUrl}`,
    '',
    ...t.cuerpo.map((tramos) => tramos.join('')),
    '',
    t.despedida,
    '',
    t.legal,
  ].join('\n');

  return { subject: t.subject, html, text };
}
