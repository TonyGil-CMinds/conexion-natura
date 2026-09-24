/**
 * Sin `server-only`: este módulo lo usan también los scripts —`npm run rsvp` al
 * aprobar un lugar y `npm run mail:pending` al recuperar un envío fallido— y ese
 * guardián solo existe dentro de Next, así que allí reventaría al importarlo.
 * Lo que de verdad no puede llegar al navegador es la clave de Resend, y eso lo
 * protege `src/lib/resend.ts`.
 */
import { prisma } from '@/lib/prisma';
import { sendTemplate } from '@/lib/resend';
import type { EventChoice } from './attendee-input';
import {
  eventEmailDetails,
  type EventEmailDetails,
  type EventEmailField,
} from './event-email-details';

/**
 * Variables de la plantilla de confirmación.
 *
 * Los nombres los fija la plantilla en Resend, así que se escriben tal cual —en
 * minúsculas y con guion bajo— aunque no sea el estilo del resto del código.
 *
 * El **nombre** y **a qué actos va** vienen del registro; el resto son datos del
 * evento y viven en `event-email-details.ts`, que es quien puede decir que falta
 * alguno.
 */
export type ConfirmationTemplateData = EventEmailDetails & {
  username: string;
  /** Condiciones de la plantilla: `'1'` si asiste, cadena vacía si no. */
  attends_natura_night: string;
  attends_premio_n500: string;
};

/**
 * Cómo se dice «sí» y «no» a la plantilla.
 *
 * La plantilla decide con `{{#if attends_natura_night}}`, y ahí lo que cuenta es
 * si el valor es vacío o no. Por eso el «no» es la **cadena vacía** y no la
 * palabra `false`: una cadena con texto —incluida `"false"`— es verdadera para
 * un condicional de plantilla, y el bloque se pintaría al revés. El «sí» es un
 * `'1'` y no el nombre del acto porque el valor no se imprime: solo se pregunta
 * por él.
 */
const YES = '1';
const NO = '';

/**
 * Datos para el correo de confirmación de una persona, y qué falta para poder
 * mandarlo.
 *
 * `missing` no es informativo: mientras tenga algo, **no se manda el correo**.
 * Resend acepta y **entrega** un envío al que le falten variables —queda un
 * hueco vacío en el texto, sin error y sin marcas que lo delaten—, así que este
 * es el único sitio donde se puede detener un correo que anunciaría el evento
 * sin fecha.
 *
 * Las dos condiciones **no entran en `missing`**: que alguien no vaya a un acto
 * es un dato legítimo, y su valor vacío significa justo eso. La puerta es solo
 * para los datos del evento, que se escriben a mano.
 *
 * Sin ningún acto se cae a la noche, que es el acto principal y a lo que va todo
 * el mundo: es lo mismo que hace la pantalla de bienvenida, y así un registro
 * anterior a la elección —o con un valor que ya no exista— no recibe un correo
 * que no anuncia nada.
 *
 * El nombre va en mayúsculas como en el ejemplo de la plantilla.
 */
export function confirmationTemplateData({
  name,
  surname,
  events = [],
}: {
  name: string;
  surname: string;
  events?: readonly EventChoice[];
}): {
  data: ConfirmationTemplateData;
  missing: readonly EventEmailField[];
} {
  const { details, missing } = eventEmailDetails();

  const night = events.includes('NIGHT');
  const award = events.includes('AWARD');
  const noneChosen = !night && !award;

  return {
    data: {
      username: `${name} ${surname}`.trim().toUpperCase(),
      attends_natura_night: night || noneChosen ? YES : NO,
      attends_premio_n500: award ? YES : NO,
      ...details,
    },
    missing,
  };
}

/**
 * Manda el correo de confirmación **una sola vez** por persona.
 *
 * La marca vive en la fila (`confirmationSentAt`) y no en memoria: reenviar el
 * formulario corrige los datos y no debe repetir el correo, y si el envío falla
 * la marca se queda nula, así que un intento posterior lo vuelve a probar.
 *
 * **Nunca lanza.** Devuelve qué pasó y ya. En este proyecto hubo un fallo caro
 * justo por lo contrario: el registro se guardaba, el correo fallaba, el cliente
 * lo leía como error y la gente se iba creyendo que no se había inscrito.
 *
 * Y **se omite si falta cualquier dato del evento**. Resend acepta y entrega un
 * envío con variables ausentes —queda un hueco vacío en el texto, sin error—, así
 * que esta puerta es lo único que impide anunciar el evento sin fecha.
 */
export async function sendConfirmation({
  id,
  email,
  name,
  surname,
  events,
}: {
  id: string;
  email: string;
  name: string;
  surname: string;
  /** A qué actos va: la plantilla pinta un bloque por cada uno. */
  events: readonly EventChoice[];
}): Promise<{ status: 'sent' | 'skipped' | 'failed'; reason?: string }> {
  const { data, missing } = confirmationTemplateData({ name, surname, events });

  if (missing.length) {
    console.error(
      `[confirmación] correo omitido: faltan datos del evento (${missing.join(', ')})`,
    );
    return { status: 'skipped', reason: 'missingEventDetails' };
  }

  const result = await sendTemplate({ to: email, data });

  if (result.status !== 'sent') {
    const reason = 'missing' in result ? `${result.reason}: ${result.missing.join(', ')}` : result.reason;
    console.error(`[confirmación] no se pudo enviar la confirmación — ${reason}`);
    return { status: result.status, reason: result.reason };
  }

  try {
    await prisma.attendee.update({ where: { id }, data: { confirmationSentAt: new Date() } });
  } catch (error) {
    // El correo salió; solo se perdió la marca, y eso se arregla reenviando
    // pendientes. No es motivo para decir que el envío falló.
    console.error('[confirmación] correo enviado pero no se pudo marcar', error);
  }
  return { status: 'sent' };
}

