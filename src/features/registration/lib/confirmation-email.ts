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
 * El **nombre** viene del formulario; el resto son datos del evento y viven en
 * `event-email-details.ts`, que es quien puede decir que falta alguno.
 */
export type ConfirmationTemplateData = EventEmailDetails & {
  username: string;
};

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
 * El nombre va en mayúsculas como en el ejemplo de la plantilla.
 */
export function confirmationTemplateData({
  name,
  surname,
}: {
  name: string;
  surname: string;
}): {
  data: ConfirmationTemplateData;
  missing: readonly EventEmailField[];
} {
  const { details, missing } = eventEmailDetails();

  return {
    data: {
      username: `${name} ${surname}`.trim().toUpperCase(),
      ...details,
    },
    missing,
  };
}
