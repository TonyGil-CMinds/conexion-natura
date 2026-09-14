import 'server-only';
import { prisma } from '@/lib/prisma';
import { sendTemplate } from '@/lib/resend';
import { ECUADOR } from '@/config/ecuador';
import { SITE } from '@/config/site';
import { SITE_URL } from '@/config/urls';

/**
 * Correo de confirmación del registro de empresas de Ecuador.
 *
 * **Una plantilla por idioma** (`CEIBA_EMAIL_TEMPLATE_ID_ECUADOR_ES` y `…_EN`),
 * por lo mismo que el retiro: el correo es casi todo texto corrido, y traducirlo
 * con variables habría dejado el idioma repartido entre Resend y este archivo.
 *
 * **No lanza.** El registro ya está guardado cuando esto corre: un fallo del
 * proveedor se anota en el registro del servidor y no puede convertirse en un
 * «no te has registrado» en pantalla.
 *
 * La marca `confirmationSentAt` se escribe **solo si el envío salió**. Si falla,
 * la fila se queda sin marcar y el correo se puede recuperar después, que es la
 * misma regla del resto del sitio.
 */

type Input = {
  id: string;
  email: string;
  fullName: string;
  /** Si pidió mesa. La plantilla lo usa para decir que está sujeta a revisión. */
  wantsTable: boolean;
  locale: 'es' | 'en';
};

/**
 * Variables que se le pasan a la plantilla.
 *
 * Van con los mismos nombres que la confirmación de Quito donde el dato es el
 * mismo (`username`, `sitio_web_url`), para no tener dos vocabularios en el
 * mismo panel de Resend. La fecha, la hora y la sede son **datos** y salen de
 * `SITE`: la plantilla ya viene en su idioma.
 *
 * `solicito_mesa` se manda como «1» o cadena vacía porque es lo que entienden
 * los bloques condicionales de la plantilla, igual que `attends_*` en el correo
 * del registro del sitio.
 */
function templateData({ fullName, wantsTable, locale }: Omit<Input, 'id' | 'email'>) {
  const { date, venue, scheduleLabel, place } = SITE.event;
  const month = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-ES', { month: 'long' })
    .format(new Date(date.year, date.month, date.day));

  return {
    username: fullName,
    solicito_mesa: wantsTable ? '1' : '',
    natura_date:
      locale === 'en'
        ? `${month} ${date.day}, ${date.year}`
        : `${date.day} de ${month} de ${date.year}`,
    natura_time: scheduleLabel,
    natura_venue: `${venue.name} · ${place}`,
    natura_venue_url: venue.mapsUrl,
    registro_url: `${SITE_URL}/${locale}/registro/ecuador`,
    agenda_url: `${SITE_URL}/${locale}/agenda`,
    sitio_web_url: SITE_URL,
    /** Convocatoria hermana. Es un dominio propio, no una ruta de este sitio. */
    n500_url: 'https://500.naturatech.org',
    contacto: ECUADOR.contactEmail,
  };
}

export async function sendEcuadorConfirmation({ id, email, fullName, wantsTable, locale }: Input) {
  const result = await sendTemplate({
    to: email,
    data: templateData({ fullName, wantsTable, locale }),
    template: locale === 'en' ? 'ecuadorEn' : 'ecuadorEs',
  });

  if (result.status !== 'sent') {
    console.warn('[ecuador] no salió el correo de confirmación', { email, result });
    return result;
  }

  try {
    await prisma.ecuadorRegistration.update({
      where: { id },
      data: { confirmationSentAt: new Date() },
    });
  } catch (error) {
    // El correo ya salió: perder la marca solo arriesga un duplicado, no el
    // registro. Se anota para poder verlo, y no se propaga.
    console.warn('[ecuador] no se pudo marcar el correo como enviado', { id, error });
  }

  return result;
}
