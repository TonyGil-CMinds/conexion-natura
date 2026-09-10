/**
 * Borrador del registro, en el navegador.
 *
 * La primera pantalla solo pide el correo y lo guarda aquí: nada sale hacia el
 * servidor todavía, porque el registro no está completo hasta que se elige el
 * evento. Así quien cierra la pestaña a mitad no deja una fila a medias, y al
 * volver no tiene que teclear el correo otra vez.
 *
 * Va en `localStorage` y no en `sessionStorage` por lo mismo que el estado de
 * asistencia: sobrevive al cierre de la pestaña.
 *
 * Se lee siempre dentro de un efecto o de un manejador, nunca en el estado
 * inicial de un componente: en el servidor no hay `localStorage`.
 */

import { EVENT_CHOICES, type EventChoice } from './attendee-input';

const KEY = 'c500-join-v2';

/** Se filtra al leer: en el almacenamiento pudo quedar un valor de otra versión. */
function readEvents(value: unknown): EventChoice[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const events = value.filter((item): item is EventChoice =>
    (EVENT_CHOICES as readonly string[]).includes(String(item)),
  );
  return events.length ? events : undefined;
}

/** Los cinco campos de una persona. Los mismos para el titular y su acompañante. */
export type PersonDraft = {
  name: string;
  surname: string;
  organization: string;
  role: string;
  linkedin: string;
};

/** De un invitado solo se piden dos datos, y son los que quien invita sabe. */
export type GuestDraft = { name: string; email: string };

export type JoinDraft = {
  email: string;
  /** Datos de quien se registra, del tercer paso. */
  person?: PersonDraft;
  /** Si dijo que viene acompañado. */
  bringsGuest?: boolean;
  /**
   * El invitado: solo nombre y correo. Lo demás lo rellena él desde el enlace
   * que recibe, así que aquí no hay más que guardar.
   */
  guest?: GuestDraft;
  /**
   * Si llegó por el enlace de una invitación.
   *
   * Cambia lo que se le pide: quien viene invitado completa **sus** datos y sube
   * su fotografía, y no se le ofrece traer a nadie —invitar es de quien tiene su
   * lugar, no de quien lo está consiguiendo—.
   */
  fromInvitation?: boolean;
  /**
   * Eventos elegidos en el segundo paso. Ausente mientras no se llegue a él, y
   * son los valores del enum de la base para que el envío final no traduzca nada.
   */
  events?: EventChoice[];
  /** ISO. Sirve para caducar el borrador si algún día hace falta. */
  savedAt: string;
};

export function readJoinDraft(): JoinDraft | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<JoinDraft>;
    if (typeof parsed.email !== 'string' || !parsed.email) return null;
    return {
      email: parsed.email,
      events: readEvents(parsed.events),
      person: parsed.person,
      bringsGuest: parsed.bringsGuest,
      guest: parsed.guest,
      fromInvitation: parsed.fromInvitation === true,
      savedAt: parsed.savedAt ?? new Date().toISOString(),
    };
  } catch {
    // Almacenamiento bloqueado o JSON corrupto: se empieza de cero, sin ruido.
    return null;
  }
}

export function saveJoinDraft(draft: Omit<JoinDraft, 'savedAt'>): JoinDraft {
  const complete: JoinDraft = { ...draft, savedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(complete));
  } catch {
    // Sin almacenamiento el flujo sigue igual: el correo vive en el estado de
    // React hasta que se envíe. Solo se pierde al recargar.
  }
  return complete;
}

export function clearJoinDraft(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nada que hacer */
  }
}
