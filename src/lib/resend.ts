/**
 * Envío de correo con Resend.
 *
 * **Solo servidor.** La clave da permiso para enviar correo en nombre del
 * dominio: si este módulo llegara al navegador, cualquiera podría usarla.
 *
 * Va contra la API por `fetch` y no con el SDK: lo único que se necesita es un
 * POST, el parámetro `template` es reciente —el SDK puede ir por detrás de la
 * API— y así no hay cliente que instanciar. Un cliente a nivel de módulo pediría
 * la clave en tiempo de importación y rompería el build en una máquina sin
 * credenciales; aquí la configuración se lee **al enviar**, y sin clave el módulo
 * se queda inerte en vez de fallar.
 *
 * **Nada de esto lanza.** El correo es un efecto secundario de un registro que ya
 * está guardado: quien llama recibe un resultado y decide, y así un fallo del
 * proveedor no puede convertirse en un «no te has registrado» en pantalla.
 */

const ENDPOINT = 'https://api.resend.com/emails';

export type SendResult =
  | { status: 'sent'; id?: string }
  /** No se intentó: la dirección no está permitida fuera del despliegue. */
  | { status: 'skipped'; reason: 'notAllowed'; to: string }
  /** No se intentó: falta configuración. No es un fallo del proveedor. */
  | { status: 'skipped'; reason: 'missingConfig'; missing: readonly string[] }
  | { status: 'failed'; reason: string };

/**
 * Las plantillas del sitio, con la variable de entorno de cada una.
 *
 * Cada correo es una plantilla: la **confirmación** la recibe quien acaba su
 * registro en Quito, la **invitación** quien ha sido apuntado por otra persona,
 * y el **retiro** tiene la suya en cada idioma. Quien envía elige por nombre, no
 * por id: los ids viven en el entorno y no en el código.
 */
export const TEMPLATES = {
  confirmation: 'CEIBA_EMAIL_TEMPLATE_ID',
  invite: 'CEIBA_EMAIL_INVITE_TEMPLATE_ID',
  /**
   * El retiro tiene **una plantilla por idioma** y no una con variables: su
   * correo es casi todo texto corrido, y traducirlo con variables habría dejado
   * el idioma repartido entre Resend y el código.
   */
  tanusasEs: 'CEIBA_EMAIL_TEMPLATE_ID_TANUSAS_ES',
  tanusasEn: 'CEIBA_EMAIL_TEMPLATE_ID_TANUSAS_EN',
  /**
   * El registro de empresas de Ecuador, también con una por idioma. Es otro
   * correo que el de `/registro` aunque el acto sea el mismo: este acusa una
   * solicitud —la mesa está sujeta a disponibilidad— y aquel confirma una plaza.
   */
  ecuadorEs: 'CEIBA_EMAIL_TEMPLATE_ID_ECUADOR_ES',
  ecuadorEn: 'CEIBA_EMAIL_TEMPLATE_ID_ECUADOR_EN',
  /**
   * Lista de espera: quien se registra y no está en el preregistro. Es otro
   * correo que la confirmación porque dice otra cosa —aquel promete un lugar
   * y este no puede—, y una misma persona puede recibir los dos.
   */
  waitlistEs: 'CEIBA_EMAIL_TEMPLATE_ID_WAITLIST_ES',
  waitlistEn: 'CEIBA_EMAIL_TEMPLATE_ID_WAITLIST_EN',
} as const;

export type TemplateName = keyof typeof TEMPLATES;

type Config = {
  apiKey: string;
  templateId: string;
  /** Remitente tal cual: admite «Nombre <correo@dominio>» o el correo solo. */
  from: string;
};

/**
 * Quién puede recibir correo **desde esta máquina**.
 *
 * Existe por un fallo que costó caro: probando el preregistro se mandaron
 * confirmaciones de verdad a dos personas de la lista de invitados, porque en
 * local la clave de Resend es la misma que en producción y nada lo impedía.
 * `NODE_ENV` no servía de aviso: `next start` vale `production` también aquí.
 *
 * La señal fiable es `VERCEL`, que solo existe en el despliegue. Fuera de él
 * **no se manda nada** salvo a las direcciones de `CEIBA_EMAIL_ALLOWLIST`.
 *
 * Se acepta una dirección entera (`yo@cminds.co`) o un sufijo (`@cminds.co`),
 * separadas por comas. `delivered@resend.dev` entra siempre: es el buzón de
 * pruebas del proveedor y no llega a ninguna persona.
 */
const ALWAYS_ALLOWED = ["delivered@resend.dev", "bounced@resend.dev", "complained@resend.dev"];

function recipientAllowed(to: string): boolean {
  // En el despliegue manda el sitio: ahí escribir a quien se registra es el fin.
  if (process.env.VERCEL) return true;

  const destino = to.trim().toLowerCase();
  if (ALWAYS_ALLOWED.includes(destino)) return true;

  const permitidos = (process.env.CEIBA_EMAIL_ALLOWLIST ?? "")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);

  return permitidos.some((permitido) =>
    permitido.startsWith("@") ? destino.endsWith(permitido) : destino === permitido,
  );
}

/**
 * Lee lo que hace falta para **esta** plantilla.
 *
 * Solo se pide el id de la que se va a enviar: sin la de invitación configurada,
 * las confirmaciones tienen que seguir saliendo.
 */
function readConfig(template: TemplateName): { config: Config } | { missing: readonly string[] } {
  const templateVar = TEMPLATES[template];
  const values: Record<string, string | undefined> = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    [templateVar]: process.env[templateVar],
    CEIBA_EMAIL_FROM: process.env.CEIBA_EMAIL_FROM,
  };
  const missing = Object.entries(values)
    .filter(([, value]) => !value?.trim())
    .map(([key]) => key);
  if (missing.length) return { missing };

  return {
    config: {
      apiKey: values.RESEND_API_KEY!,
      templateId: values[templateVar]!,
      from: values.CEIBA_EMAIL_FROM!,
    },
  };
}

/**
 * Manda la plantilla de Resend con sus variables.
 *
 * El contenido vive en Resend, no aquí, así que este módulo no sabe qué se
 * envía: solo a quién y con qué datos.
 *
 * **No manda `subject`.** En un envío con plantilla, el asunto del payload tiene
 * precedencia sobre el de la plantilla, así que mandarlo taparía el que trae
 * («¡Nos vemos en Quito!»). Lo mismo pasaría con `reply_to`. `from` sí va,
 * porque el envío lo exige y está configurado a propósito.
 */
export async function sendTemplate({
  to,
  data,
  template = 'confirmation',
}: {
  to: string;
  /** Variables de la plantilla, con las claves que la plantilla usa. */
  data: Record<string, string>;
  /** Cuál de las dos plantillas. Por omisión, la confirmación. */
  template?: TemplateName;
}): Promise<SendResult> {
  /**
   * Primero la puerta, antes incluso de mirar la configuración: lo que no se
   * puede mandar no se intenta.
   */
  if (!recipientAllowed(to)) {
    console.warn(
      `[resend] BLOQUEADO el envío a ${to}: fuera del despliegue solo se escribe a ` +
        'CEIBA_EMAIL_ALLOWLIST. Añade ahí tu dirección si quieres probar de verdad.',
    );
    return { status: 'skipped', reason: 'notAllowed', to };
  }

  const read = readConfig(template);
  if ('missing' in read) return { status: 'skipped', reason: 'missingConfig', missing: read.missing };
  const { apiKey, templateId, from } = read.config;

  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to, template: { id: templateId, variables: data } }),
    });

    if (!response.ok) {
      /**
       * El cuerpo de la respuesta es lo único que dice **qué** falló —dominio sin
       * verificar, plantilla que no existe—. Un error con solo el código repetiría
       * la lección que dio SendGrid: «Unauthorized» a secas cuando el problema era
       * que se habían agotado los créditos.
       */
      const detail = await response.text().catch(() => '');
      return { status: 'failed', reason: `HTTP ${response.status}: ${detail || 'sin cuerpo'}` };
    }

    const payload = (await response.json().catch(() => null)) as { id?: string } | null;
    return { status: 'sent', id: payload?.id };
  } catch (error) {
    // Red caída, DNS, timeout del propio fetch: sigue sin ser cosa del registro.
    return { status: 'failed', reason: error instanceof Error ? error.message : String(error) };
  }
}
