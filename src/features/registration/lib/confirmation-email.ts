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
