import sgMail from '@sendgrid/mail';

/**
 * Envío de correo con SendGrid (Twilio).
 *
 * **Solo servidor.** La clave da permiso para enviar correo en nombre del
 * dominio: si este módulo llegara al navegador, cualquiera podría usarla.
 *
 * La configuración se lee al enviar y no al importar: así una variable que falte
 * rompe el envío —que se puede recuperar— y no el arranque de la aplicación.
 */

type Config = {
  apiKey: string;
  templateId: string;
  fromEmail: string;
  fromName: string;
};

function config(): Config {
  const apiKey = process.env.SENDGRID_API_KEY;
  const templateId = process.env.SENDGRID_CEIBA_TEMPLATE_ID;
  const fromEmail = process.env.SENDGRID_FROM_EMAIL;

  const missing = Object.entries({
    SENDGRID_API_KEY: apiKey,
    SENDGRID_CEIBA_TEMPLATE_ID: templateId,
    SENDGRID_FROM_EMAIL: fromEmail,
  })
    .filter(([, value]) => !value)
    .map(([key]) => key);
  if (missing.length) {
    throw new Error(`Falta configuración de SendGrid en .env: ${missing.join(', ')}.`);
  }

  return {
    apiKey: apiKey!,
    templateId: templateId!,
    fromEmail: fromEmail!,
    // El remitente que se ve en la bandeja. No es un secreto, así que trae valor.
    fromName: process.env.SENDGRID_FROM_NAME ?? 'CEIBA Quito',
  };
}

/**
 * Manda una plantilla dinámica.
 *
 * `dynamicTemplateData` son las variables que la plantilla espera; el contenido
 * vive en SendGrid, no aquí, así que este módulo no sabe qué se envía.
 */
export async function sendTemplate({
  to,
  data,
}: {
  to: string;
  data: Record<string, string>;
}): Promise<void> {
  const { apiKey, templateId, fromEmail, fromName } = config();
  sgMail.setApiKey(apiKey);

  /**
   * Modo de prueba: SendGrid valida la petición entera —remitente, plantilla,
   * variables— y responde sin entregar nada. Es lo que permite comprobar el
   * cableado sin escribirle a nadie, y sirve igual para un entorno de pruebas.
   */
  const sandbox = process.env.SENDGRID_SANDBOX === '1';

  await sgMail.send({
    to,
    from: { email: fromEmail, name: fromName },
    templateId,
    dynamicTemplateData: data,
    ...(sandbox ? { mailSettings: { sandboxMode: { enable: true } } } : {}),
  });
}
