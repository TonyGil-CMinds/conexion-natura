import { SITE } from '@/config/site';
import type { CalendarWhen } from '../lib/calendar';
import type { EventChoice } from '../lib/attendee-input';

/**
 * Los dos actos del día: assets, sede y cuándo.
 *
 * `id` es la clave en el diccionario y `choice` el valor que entra en la columna
 * de la base: separados a propósito, porque la copia se traduce y el dato no.
 *
 * Aquí viven **los dos** juntos porque los usan dos pantallas: la de elección,
 * que los compara, y la de bienvenida, que enseña los que se eligieron. Antes la
 * bienvenida solo sabía del acto principal y la premiación no aparecía en
 * ninguna parte después de marcarla.
 *
 * `schedule: null` significa **horario por confirmar**: el rótulo que lo dice es
 * copia y vive en el diccionario, porque se traduce. La falta de hora se modela,
 * no se rellena con una inventada.
 *
 * Las medidas son las naturales de cada SVG. Van aquí y no en el componente para
 * que al cambiar un asset se cambien en el mismo sitio que su ruta.
 */
/**
 * La forma de un acto. Va como anotación y no como `satisfies`: con `satisfies`
 * cada acto conserva su tipo literal, y entonces la premiación —que no tiene
 * mapa— no comparte `mapsUrl` con la noche y quien recorre la lista no puede
 * preguntar por él.
 */
export type EventOption = {
  id: 'night' | 'award';
  choice: EventChoice;
  logo: { src: string; width: number; height: number };
  art: { src: string; width: number; height: number };
  venue: { name: string; mapsUrl?: string };
  /** Horas ya fijadas, o `null` si están por confirmar. */
  schedule: string | null;
  calendar: CalendarWhen;
  /** Estable de por vida: es lo que evita duplicados en el calendario. */
  uid: string;
};

export const EVENT_OPTIONS: readonly EventOption[] = [
  {
    id: 'night',
    choice: 'NIGHT',
    logo: { src: '/icons/logo-natura500night.svg', width: 121, height: 101 },
    art: { src: '/icons/asset-selection-natura500night.svg', width: 126, height: 182 },
    venue: SITE.event.venue,
    schedule: SITE.event.scheduleLabel,
    calendar: SITE.event.calendar,
    /** Estable de por vida: es lo que evita duplicados en el calendario. */
    uid: 'conexion500-night-2026-10-05@conexion500',
  },
  {
    id: 'award',
    choice: 'AWARD',
    /**
     * Variante con tinta oscura, generada del original: el que llega trae el
     * texto en el crema del tema oscuro y la tarjeta del premio es clara, así
     * que sobre ella no se veía. Si llega un original oscuro, sustituir.
     */
    logo: { src: '/icons/logo-premio3036-dark.svg', width: 150, height: 78 },
    art: { src: '/icons/asset-selection-premio2026.svg', width: 183, height: 182 },
    venue: SITE.award.venue,
    schedule: null,
    calendar: SITE.award.calendar,
    uid: 'conexion500-award-2026-10-05@conexion500',
  },
];

/** El acto de un valor de la columna. La bienvenida los busca por aquí. */
export function eventOption(choice: EventChoice) {
  return EVENT_OPTIONS.find((option) => option.choice === choice);
}


/** Marca circular con texto en el borde, que gira al lado del titular. */
export const CHOICE_MARQUEE = {
  src: '/icons/asset-circularmarquesee-step1.svg',
  /** Segundos por vuelta. Lento: es un adorno, no algo que pida atención. */
  spinSeconds: 22,
} as const;

/** La del paso de datos. Es la otra cara de la moneda, y por eso no gira sola. */
export const DETAILS_MARQUEE = {
  src: '/icons/asset-circularmarquesee-step2.svg',
} as const;

/** La del último paso, la de la fotografía. */
export const PHOTO_MARQUEE = {
  src: '/icons/asset-circularmarquesee-step3.svg',
} as const;
