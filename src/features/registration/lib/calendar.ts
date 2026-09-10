/**
 * Alta del evento en el calendario de quien se registra.
 *
 * Se ofrecen **las tres formas** en vez de una: Google y Outlook abren su propia
 * pantalla de «nuevo evento» con todo relleno, y el archivo `.ics` sirve para
 * Apple, Thunderbird y cualquier otro. Un solo `.ics` era más limpio de
 * implementar, pero en Google —que es la mayoría— obliga a descargar un archivo
 * e importarlo a mano, y ahí se pierde a la gente.
 *
 * Las fechas viven en `src/config/site.ts` y de ahí salen los tres formatos: así
 * no hay una fecha escrita dos veces.
 */

/**
 * Cuándo ocurre.
 *
 * Dos formas porque los dos actos del día son distintos: la noche tiene horas
 * confirmadas (`time`, en UTC) y la premiación todavía no (`day`, de día
 * completo). Un tramo de horas inventado metería a la gente en una sala a la
 * hora equivocada, así que la falta de hora se modela, no se rellena.
 */
export type CalendarWhen =
  | { kind: 'time'; startUtc: string; endUtc: string }
  | { kind: 'day'; start: string; end: string };

/** Lo que las tres variantes necesitan saber del acto. */
export type CalendarEvent = {
  /** Identificador estable: es lo que evita duplicados al añadirlo dos veces. */
  uid: string;
  title: string;
  description: string;
  location: string;
  when: CalendarWhen;
};

export type CalendarTarget = 'google' | 'outlook' | 'ics';

/** `20261005T220000Z` → `2026-10-05T22:00:00Z`, que es lo que pide Outlook. */
function toIso(compact: string) {
  const [date, time] = compact.replace('Z', '').split('T');
  const day = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  if (!time) return day;
  return `${day}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}Z`;
}

function escapeICS(value: string) {
  return value.replace(/([,;\\])/g, '\\$1');
}

function icsFile(event: CalendarEvent) {
  /**
   * En un evento de día completo la fecha va **sin hora y con `VALUE=DATE`**: sin
   * eso, los clientes lo colocan a medianoche en la zona de quien lo importa, y
   * en América cae el día anterior.
   */
  const when =
    event.when.kind === 'time'
      ? [`DTSTART:${event.when.startUtc}`, `DTEND:${event.when.endUtc}`]
      : [`DTSTART;VALUE=DATE:${event.when.start}`, `DTEND;VALUE=DATE:${event.when.end}`];

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Conexion500//registro//ES',
    'BEGIN:VEVENT',
    // El identificador no cambia aunque cambie la marca: es lo que reconoce el
    // calendario de quien ya añadió el evento, y otro crearía un duplicado.
    `UID:${event.uid}`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`,
    ...when,
    `SUMMARY:${escapeICS(event.title)}`,
    `LOCATION:${escapeICS(event.location)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  // CRLF por especificación: algunos clientes de escritorio rechazan el archivo
  // si las líneas acaban solo en salto de línea.
  return new Blob([`${lines.join('\r\n')}\r\n`], { type: 'text/calendar;charset=utf-8' });
}

/**
 * Añade el evento al calendario elegido.
 *
 * Google y Outlook se abren en otra pestaña —no se navega fuera del sitio, que
 * es donde está la credencial recién creada—; el `.ics` se descarga.
 */
export function addToCalendar(target: CalendarTarget, event: CalendarEvent): void {
  const { when } = event;

  if (target === 'google') {
    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.set('action', 'TEMPLATE');
    url.searchParams.set('text', event.title);
    // El mismo parámetro sirve para las dos formas: con fechas sueltas —sin
    // hora— Google lo crea de día completo.
    url.searchParams.set(
      'dates',
      when.kind === 'time' ? `${when.startUtc}/${when.endUtc}` : `${when.start}/${when.end}`,
    );
    url.searchParams.set('location', event.location);
    url.searchParams.set('details', event.description);
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
    return;
  }

  if (target === 'outlook') {
    const url = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
    url.searchParams.set('path', '/calendar/action/compose');
    url.searchParams.set('rru', 'addevent');
    url.searchParams.set('subject', event.title);
    if (when.kind === 'time') {
      url.searchParams.set('startdt', toIso(when.startUtc));
      url.searchParams.set('enddt', toIso(when.endUtc));
    } else {
      url.searchParams.set('startdt', toIso(when.start));
      url.searchParams.set('enddt', toIso(when.end));
      url.searchParams.set('allday', 'true');
    }
    url.searchParams.set('location', event.location);
    url.searchParams.set('body', event.description);
    window.open(url.toString(), '_blank', 'noopener,noreferrer');
    return;
  }

  const href = URL.createObjectURL(icsFile(event));
  const link = document.createElement('a');
  link.href = href;
  link.download = `${event.uid.split('@')[0]}.ics`;
  link.click();
  // El objeto se libera tras el clic: si se revoca antes, la descarga se cae.
  window.setTimeout(() => URL.revokeObjectURL(href), 1000);
}
