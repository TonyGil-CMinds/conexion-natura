import 'server-only';
import { prisma } from '@/lib/prisma';
import { sendTemplate } from '@/lib/resend';
import { TANUSAS } from '@/config/tanusas';
import { SITE_URL } from '@/config/urls';

/**
 * Correo de confirmación del retiro.
 *
 * **Una plantilla por idioma** (`CEIBA_EMAIL_TEMPLATE_ID_TANUSAS_ES` y `…_EN`):
 * el correo es casi todo texto corrido, y traducirlo con variables habría dejado
 * el idioma repartido entre Resend y este archivo.
 *
 * **No lanza.** El registro ya está guardado cuando esto corre: un fallo del
 * proveedor se anota en el registro del servidor y no puede convertirse en un
 * «no te has registrado» en pantalla.
 *
 * La marca `confirmationSentAt` se escribe **solo si el envío salió**. Si falla,
 * la fila se queda sin marcar y el correo se puede recuperar después, que es la
 * misma regla del registro de Quito.
 */

type Input = {
  id: string;
  email: string;
  name: string;
  locale: 'es' | 'en';
};

/**
 * Variables que se le pasan a la plantilla.
 *
 * Van con los mismos nombres que usa la confirmación de Quito donde el dato es
 * el mismo (`username`, `sitio_web_url`), para no tener dos vocabularios en el
 * mismo panel de Resend. Las fechas y la sede son **datos**, así que salen de
 * `TANUSAS` y no de la copia traducida: la plantilla ya está en su idioma.
 */
function templateData({ name, locale }: Pick<Input, 'name' | 'locale'>) {
  const { start, end, venue } = TANUSAS;
  const month = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-ES', { month: 'long' })
    .format(new Date(start.year, start.month, start.day));

  return {
    username: name,
    retreat_dates:
      locale === 'en'
        ? `${month} ${start.day} – ${end.day}, ${start.year}`
        : `${start.day} – ${end.day} de ${month} de ${start.year}`,
    retreat_venue: `${venue.name} · ${venue.place}`,
    retreat_venue_url: venue.mapsUrl,
    retreat_url: `${SITE_URL}/${locale}/tanusas`,
    sitio_web_url: SITE_URL,
    n500_url: TANUSAS.siteUrl,
    contacto: TANUSAS.contactEmail,
  };
}

export async function sendRetreatConfirmation({ id, email, name, locale }: Input) {
  const result = await sendTemplate({
    to: email,
    data: templateData({ name, locale }),
    template: locale === 'en' ? 'tanusasEn' : 'tanusasEs',
  });

  if (result.status !== 'sent') {
    console.warn('[tanusas] no salió el correo de confirmación', { email, result });
    return result;
  }

  try {
    await prisma.tanusasRegistration.update({
      where: { id },
      data: { confirmationSentAt: new Date() },
    });
  } catch (error) {
    // El correo ya salió: perder la marca solo arriesga un duplicado, no el
    // registro. Se anota para poder verlo, y no se propaga.
    console.warn('[tanusas] no se pudo marcar el correo como enviado', { id, error });
  }

  return result;
}
