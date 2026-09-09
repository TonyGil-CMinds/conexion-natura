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
  /** No se intentó: falta configuración. No es un fallo del proveedor. */
  | { status: 'skipped'; reason: 'missingConfig'; missing: readonly string[] }
  | { status: 'failed'; reason: string };

type Config = {
  apiKey: string;
  templateId: string;
  /** Remitente tal cual: admite «Nombre <correo@dominio>» o el correo solo. */
  from: string;
};

function readConfig(): { config: Config } | { missing: readonly string[] } {
  const values = {
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    CEIBA_EMAIL_TEMPLATE_ID: process.env.CEIBA_EMAIL_TEMPLATE_ID,
    CEIBA_EMAIL_FROM: process.env.CEIBA_EMAIL_FROM,
  };
  const missing = Object.entries(values)
    .filter(([, value]) => !value?.trim())
    .map(([key]) => key);
  if (missing.length) return { missing };

  return {
    config: {
      apiKey: values.RESEND_API_KEY!,
      templateId: values.CEIBA_EMAIL_TEMPLATE_ID!,
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
}: {
  to: string;
  /** Variables de la plantilla, con las claves que la plantilla usa. */
  data: Record<string, string>;
}): Promise<SendResult> {
  const read = readConfig();
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
