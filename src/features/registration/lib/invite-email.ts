import { EVENT_EMAIL } from './event-email-details';

/**
 * Variables de la plantilla de **invitación**: el correo que recibe quien ha
 * sido apuntado por otra persona y todavía tiene que completar su registro.
 *
 * Los nombres los fija la plantilla en Resend, así que se escriben tal cual —en
 * minúsculas y con guion bajo— aunque no sea el estilo del resto del código.
 *
 * Ojo con los dos nombres, que es fácil cruzarlos: `username` es **quien
 * invita** —«{{username}} te ha registrado como su invitado»— y `guest` es
 * **quien recibe** el correo, en el saludo. Cambiarlos de sitio manda un correo
 * que se lee perfectamente y dice justo lo contrario.
 */
export type InviteTemplateData = {
  /** Quien registra al invitado. */
  username: string;
  /** Quien recibe el correo. */
  guest: string;
  /** Enlace para completar el registro. Lleva el testigo de la invitación. */
  confirmation_url: string;
  sitio_web_url: string;
  n500_url: string;
};

/** Lo que puede faltar y dejar el correo a medias. */
export type InviteEmailField = keyof InviteTemplateData;

/**
 * Datos para el correo de invitación, y qué falta para poder mandarlo.
 *
 * La misma puerta que la confirmación: Resend acepta y **entrega** un envío al
 * que le falten variables, y aquí el hueco vacío sería el del enlace —un correo
 * que pide completar el registro con un botón que no lleva a ninguna parte—.
 *
 * Los nombres van en mayúsculas porque la plantilla los pinta así.
 */
export function inviteTemplateData({
  host,
  guest,
  token,
  locale,
}: {
  /** Nombre de quien invita, tal y como se registró. */
  host: string;
  /** Nombre del invitado. Es lo único que se le pide a quien invita. */
  guest: string;
  /** Testigo de la invitación: es lo que identifica al invitado en el enlace. */
  token: string;
  /** Idioma del enlace. El correo está en español, así que por omisión `es`. */
  locale?: string;
}): {
  data: InviteTemplateData;
  missing: readonly InviteEmailField[];
} {
  const site = EVENT_EMAIL.sitio_web_url.replace(/\/+$/, '');

  const data: InviteTemplateData = {
    username: host.trim().toUpperCase(),
    guest: guest.trim().toUpperCase(),
    /**
     * El enlace lleva el testigo en la URL y no el correo: con el correo, quien
     * cambiara la dirección a mano completaría el registro de otra persona.
     */
    confirmation_url: token ? `${site}/${locale ?? 'es'}/registro?invitacion=${token}` : '',
    sitio_web_url: EVENT_EMAIL.sitio_web_url,
    n500_url: EVENT_EMAIL.n500_url,
  };

  const missing = (Object.keys(data) as InviteEmailField[]).filter((field) => !data[field].trim());

  return { data, missing };
}
