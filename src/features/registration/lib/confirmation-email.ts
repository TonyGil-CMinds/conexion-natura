import { SITE } from '@/config/site';
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config';
import { SITE_URL } from '@/config/urls';

/**
 * Variables de la plantilla de confirmación.
 *
 * Los nombres los fija la plantilla en SendGrid, así que se escriben tal cual
 * —en minúsculas y con guion bajo— aunque no sea el estilo del resto del código.
 *
 * Van en mayúsculas porque la plantilla los pinta tal como llegan.
 */
export type ConfirmationTemplateData = {
  username: string;
  lugar: string;
  dia: string;
  hora_ecuador: string;
  event_date: string;
  event_start_time: string;
  event_end_time: string;
  venue_name: string;
  venue_city: string;
  venue_country: string;
  agenda_url: string;
  sitio_web_url: string;
  n500_url: string;
};

/** Convocatoria hermana. Es un dominio propio, no una ruta de este sitio. */
const N500_URL = 'https://500.naturatech.org';

/**
 * Fechas y horas del correo.
 *
 * Salen de `SITE.event` y no de literales, para que corregir la hora del evento
 * no deje el correo diciendo otra cosa. Cada plantilla pide su propio formato, de
 * ahí que la misma fecha aparezca escrita de dos maneras.
 */
const FORMATS = {
  es: {
    dia: '5 DE OCTUBRE DE 2026',
    eventDate: '5 OCTUBRE, 2026',
  },
  en: {
    dia: 'OCTOBER 5, 2026',
    eventDate: 'OCTOBER 5, 2026',
  },
} as const;

/** «5:00 pm — 9:00 pm» → las dos horas por separado, en mayúsculas. */
function scheduleParts() {
  const [start = '', end = ''] = SITE.event.scheduleLabel.split('—').map((part) => part.trim());
  return { start: start.toUpperCase(), end: end.toUpperCase() };
}

/**
 * Datos para el correo de confirmación de una persona.
 *
 * El nombre va en mayúsculas como en el ejemplo de la plantilla; los enlaces
 * llevan el prefijo de idioma para que quien se registró en inglés no aterrice
 * en la versión en español.
 */
export function confirmationTemplateData({
  name,
  surname,
  locale = DEFAULT_LOCALE,
}: {
  name: string;
  surname: string;
  locale?: Locale;
}): ConfirmationTemplateData {
  const { venue, place } = SITE.event;
  const { start, end } = scheduleParts();
  const formats = FORMATS[locale];

  return {
    username: `${name} ${surname}`.trim().toUpperCase(),
    lugar: place.toUpperCase(),
    dia: formats.dia,
    hora_ecuador: start,
    event_date: formats.eventDate,
    event_start_time: start,
    event_end_time: end,
    venue_name: venue.name.toUpperCase(),
    // La sede está en Quito, Ecuador; `place` trae las dos separadas por coma.
    venue_city: place.split(',')[0]!.trim().toUpperCase(),
    venue_country: (place.split(',')[1] ?? '').trim().toUpperCase(),
    agenda_url: `${SITE_URL}/${locale}/agenda`,
    sitio_web_url: `${SITE_URL}/${locale}`,
    n500_url: N500_URL,
  };
}
