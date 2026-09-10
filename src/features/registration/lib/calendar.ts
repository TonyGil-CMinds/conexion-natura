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
 * confirmadas (`time`) y la premiación todavía no (`day`, de día completo). Un
 * tramo de horas inventado metería a la gente en una sala a la hora equivocada,
 * así que la falta de hora se modela, no se rellena.
 *
 * Las horas van en **hora local del evento** y con su zona al lado, no en UTC.
 * El instante sería el mismo, pero la lectura no: cada calendario traduce el UTC
 * a la zona de quien lo abre, y a alguien en Ciudad de México la invitación le
 * decía «4:00 pm». Lo que hay que leer en la invitación es la hora de la puerta.
 */
export type CalendarWhen =
  | {
      kind: 'time';
      /** `AAAAMMDDTHHMMSS`, sin `Z`: es hora local de `timeZone`. */
      start: string;
      end: string;
      /** Nombre IANA, el que entienden Google y los archivos `.ics`. */
      timeZone: string;
      /** Desplazamiento fijo, en `±HHMM`. Para pasar a UTC donde haga falta. */
      offset: string;
    }
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

/** `20261005T170000` → `2026-10-05T17:00:00`, con `Z` si se le pasa. */
function toIso(compact: string, suffix = '') {
  const [date, time] = compact.replace('Z', '').split('T');
  const day = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
  if (!time) return day;
  return `${day}T${time.slice(0, 2)}:${time.slice(2, 4)}:${time.slice(4, 6)}${suffix}`;
}

/**
 * Hora local + desplazamiento → el mismo instante en UTC.
 *
 * Hace falta para Outlook, cuyo enlace de «nuevo evento» no admite decirle en
 * qué zona están las horas que se le pasan: si se le dan sueltas, las entiende
 * en la zona de quien abre el enlace y el evento se va de sitio. Mandándole el
 * instante exacto lo coloca bien, aunque lo muestre en la hora de esa persona.
 */
function toUtc(local: string, offset: string) {
  const iso = toIso(local);
  const signed = `${offset.slice(0, 3)}:${offset.slice(3)}`;
  return new Date(`${iso}${signed}`).toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/**
 * Bloque de zona horaria del archivo `.ics`.
 *
 * Un `TZID` sin este bloque es inválido según la norma y hay clientes que lo
 * descartan —y entonces vuelven a interpretar la hora en la zona del lector, que
 * es justo lo que se quiere evitar—. Ecuador continental no tiene horario de
 * verano, así que basta una regla estándar constante.
 */
function timeZoneBlock(timeZone: string, offset: string) {
  return [
    'BEGIN:VTIMEZONE',
    `TZID:${timeZone}`,
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    `TZOFFSETFROM:${offset}`,
    `TZOFFSETTO:${offset}`,
    `TZNAME:${offset.slice(0, 3)}`,
    'END:STANDARD',
    'END:VTIMEZONE',
  ];
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
      ? [
          // Con `TZID` la hora es la de Quito y el cliente la convierte a la de
          // quien lee, en vez de reinterpretarla.
          `DTSTART;TZID=${event.when.timeZone}:${event.when.start}`,
          `DTEND;TZID=${event.when.timeZone}:${event.when.end}`,
        ]
      : [`DTSTART;VALUE=DATE:${event.when.start}`, `DTEND;VALUE=DATE:${event.when.end}`];

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Conexion500//registro//ES',
    ...(event.when.kind === 'time'
      ? timeZoneBlock(event.when.timeZone, event.when.offset)
      : []),
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
    url.searchParams.set('dates', `${when.start}/${when.end}`);
    /**
     * `ctz` dice en qué zona están esas horas. Sin él, Google las entiende en la
     * zona del calendario de quien abre el enlace, que es de dónde venía el
     * «4:00 pm».
     */
    if (when.kind === 'time') url.searchParams.set('ctz', when.timeZone);
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
      /**
       * A Outlook se le manda el instante en UTC porque su enlace no admite
       * zona: lo colocará bien en el calendario, aunque lo enseñe en la hora de
       * quien lo abra. El sitio y el correo son los que dicen la de Quito.
       */
      url.searchParams.set('startdt', toUtc(when.start, when.offset));
      url.searchParams.set('enddt', toUtc(when.end, when.offset));
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
