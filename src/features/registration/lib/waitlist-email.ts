import 'server-only';
import { prisma } from '@/lib/prisma';
import { sendTemplate } from '@/lib/resend';
import { eventEmailDetails } from './event-email-details';

/**
 * Aviso de lista de espera.
 *
 * Lo recibe quien se registra y **no está en la lista de preregistro**: su
 * lugar depende de que haya sitio, y el equipo lo revisa. Es otro correo que el
 * de confirmación y por eso tiene su propia plantilla: aquel dice «nos vemos» y
 * este no puede prometer nada.
 *
 * **Una plantilla por idioma** (`CEIBA_EMAIL_TEMPLATE_ID_WAITLIST_ES` y `…_EN`),
 * como el retiro y el registro de empresas: es casi todo texto corrido, y
 * traducirlo con variables dejaría el idioma repartido entre Resend y el código.
 *
 * **No lanza.** El registro ya está guardado cuando esto corre: un fallo del
 * proveedor se anota y no puede convertirse en un «no te has registrado» en
 * pantalla.
 *
 * La marca `waitlistSentAt` se escribe **solo si el envío salió**, y va aparte
 * de `confirmationSentAt` porque una misma persona puede recibir los dos: este
 * al registrarse y el otro si después se le aprueba el lugar.
 */

type Input = {
  id: string;
  email: string;
  name: string;
  surname: string;
  /** Si trae acompañante: también queda en espera, y el correo lo dice. */
  hasGuest: boolean;
  locale: 'es' | 'en';
};

export function waitlistTemplateData({ name, surname, hasGuest }: Omit<Input, 'id' | 'email' | 'locale'>) {
  const { details } = eventEmailDetails();
  return {
    username: `${name} ${surname}`.trim(),
    /**
     * Condición de la plantilla: `'1'` o cadena vacía. Una cadena con texto
     * —incluida `"false"`— es verdadera para un condicional, así que el «no»
     * tiene que ser el vacío.
     */
    con_acompanante: hasGuest ? '1' : '',
    natura_date: details.natura_date,
    natura_time: details.natura_time,
    natura_venue: details.natura_venue,
    agenda_url: details.agenda_url,
    sitio_web_url: details.sitio_web_url,
    n500_url: details.n500_url,
  };
}

export async function sendWaitlistNotice({ id, email, name, surname, hasGuest, locale }: Input) {
  const result = await sendTemplate({
    to: email,
    data: waitlistTemplateData({ name, surname, hasGuest }),
    template: locale === 'en' ? 'waitlistEn' : 'waitlistEs',
  });

  if (result.status !== 'sent') {
    console.warn('[registro] no salió el aviso de lista de espera', { email, result });
    return result;
  }

  try {
    await prisma.attendee.update({ where: { id }, data: { waitlistSentAt: new Date() } });
  } catch (error) {
    // El correo ya salió; perder la marca solo arriesga un duplicado.
    console.warn('[registro] aviso enviado pero no se pudo marcar', { id, error });
  }

  return result;
}
