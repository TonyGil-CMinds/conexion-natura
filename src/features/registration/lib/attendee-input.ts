/**
 * Normalización y validación de un registro, del lado del servidor.
 *
 * El formulario valida por su cuenta para avisar mientras se escribe, pero eso
 * es comodidad: cualquiera puede llamar al endpoint sin pasar por la pantalla,
 * así que aquí se vuelve a comprobar todo. Este módulo es puro —sin acceso a la
 * base ni a la red— para poder probarlo solo.
 */

/**
 * Los dos actos del mismo día. Son los valores del enum `EventChoice` de Prisma,
 * en mayúsculas, para que lo que llega del navegador entre tal cual en la fila.
 */
export const EVENT_CHOICES = ['NIGHT', 'AWARD'] as const;
export type EventChoice = (typeof EVENT_CHOICES)[number];

export type AttendeeInput = {
  name: string;
  surname: string;
  email: string;
  organization: string;
  role: string;
  linkedin: string | null;
  photoUrl: string | null;
  /**
   * Eventos elegidos. Lista porque la elección es múltiple, y sin duplicados:
   * la columna es un array y repetir un valor no significa nada.
   */
  events: EventChoice[];
  /** Si dijo que viene acompañado. */
  bringsGuest: boolean;
  /**
   * El invitado. `null` si no trae, y también si dijo que sí pero no llegó a
   * darlo: media invitación vale menos que ninguna.
   */
  guest: GuestInput | null;
};

/**
 * Del invitado solo se piden **dos datos**, y son los dos que quien invita
 * puede saber de memoria: cómo se llama y dónde escribirle. Lo demás —su
 * organización, su cargo, su fotografía, a qué actos va— lo pone él mismo desde
 * el enlace que recibe, que es quien lo sabe de verdad.
 */
export type GuestInput = {
  name: string;
  email: string;
};

export type FieldErrors = Partial<Record<keyof AttendeeInput, string>>;

/** Tope por campo. Sobra para un nombre y frena un cuerpo de petición absurdo. */
const MAX_LENGTH = 160;

function text(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/\s{2,}/g, ' ') : '';
}

/**
 * Convierte lo que llegue en un registro válido, o devuelve los errores por
 * campo. Nunca lanza: quien llama decide qué hacer con los errores.
 *
 * `photoUrl` tiene que estar bajo la base pública del bucket. Sin esa
 * comprobación el endpoint sería un sitio donde guardar cualquier enlace ajeno
 * a costa de la credencial de otra persona.
 */
export function parseAttendeeInput(
  body: unknown,
  { publicBaseUrl }: { publicBaseUrl: string },
): { data: AttendeeInput; errors?: undefined } | { data?: undefined; errors: FieldErrors } {
  const raw = (body ?? {}) as Record<string, unknown>;
  const errors: FieldErrors = {};

  const name = text(raw.name);
  const surname = text(raw.surname);
  const email = typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : '';
  const organization = text(raw.organization);
  const role = text(raw.role);
  const linkedin = text(raw.linkedin);
  const photoUrl = text(raw.photoUrl);

  /**
   * Los eventos se filtran contra la lista conocida en vez de rechazarse: lo que
   * no reconocemos no puede entrar en la columna, y un valor de más no es motivo
   * para tirar un registro entero. Que no venga ninguno tampoco es un error —el
   * formulario puede llegar antes de ese paso—, pero un array con solo basura sí,
   * porque significa que quien llama cree haber elegido algo.
   */
  const rawEvents = Array.isArray(raw.events) ? raw.events : [];
  const events = [...new Set(rawEvents.map((value) => String(value).trim().toUpperCase()))].filter(
    (value): value is EventChoice => (EVENT_CHOICES as readonly string[]).includes(value),
  );
  if (rawEvents.length && !events.length) {
    errors.events = 'Ninguno de los eventos elegidos existe.';
  }

  const required = { name, surname, email, organization, role };
  for (const [field, value] of Object.entries(required)) {
    if (!value) errors[field as keyof AttendeeInput] = 'Este dato es obligatorio.';
    else if (value.length > MAX_LENGTH) errors[field as keyof AttendeeInput] = `Máximo ${MAX_LENGTH} caracteres.`;
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Escribe un correo válido.';
  }

  if (linkedin) {
    let url: URL | undefined;
    try {
      url = new URL(linkedin);
    } catch {
      errors.linkedin = 'El enlace de LinkedIn no es una URL válida.';
    }
    if (url && url.protocol !== 'https:') errors.linkedin = 'El enlace debe empezar por https.';
  }

  if (photoUrl && !photoUrl.startsWith(`${publicBaseUrl.replace(/\/+$/, '')}/`)) {
    errors.photoUrl = 'La imagen no proviene del almacenamiento del sitio.';
  }

  /**
   * El invitado se acepta solo **completo**: nombre y correo válido. Si falta
   * uno se descarta en silencio en vez de tirar el registro, porque el dato
   * principal —quien se inscribe— ya es válido y perderlo por el invitado sería
   * peor.
   *
   * Y su correo **no puede ser el de quien invita**: un correo es un registro,
   * así que invitarse a uno mismo dejaría la fila propia en pendiente y borraría
   * los datos que se acaban de escribir.
   */
  const rawGuest = (raw.guest ?? {}) as Record<string, unknown>;
  const guestName = text(rawGuest.name);
  const guestEmail = typeof rawGuest.email === 'string' ? rawGuest.email.trim().toLowerCase() : '';
  const guestValid =
    Boolean(guestName) &&
    guestName.length <= MAX_LENGTH &&
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(guestEmail) &&
    guestEmail !== email;
  const guest: GuestInput | null = guestValid ? { name: guestName, email: guestEmail } : null;

  if (Object.keys(errors).length) return { errors };

  return {
    data: {
      name,
      surname,
      email,
      organization,
      role,
      // Vacío y ausente son lo mismo para un campo opcional.
      linkedin: linkedin || null,
      photoUrl: photoUrl || null,
      events,
      bringsGuest: raw.bringsGuest === true,
      guest,
    },
  };
}
