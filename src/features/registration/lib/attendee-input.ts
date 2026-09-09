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
  bringsCompanion: boolean;
  /**
   * Datos del acompañante. `null` si no trae, y también si dijo que sí pero no
   * llegó a rellenarlos: una fila a medias vale menos que ninguna.
   */
  companion: CompanionInput | null;
};

/** El acompañante lleva los mismos datos menos el correo, que no se le pide. */
export type CompanionInput = {
  name: string;
  surname: string;
  organization: string;
  role: string;
  linkedin: string | null;
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
   * El acompañante se acepta solo **completo**: nombre, apellido, organización y
   * rol. Si falta alguno se descarta en silencio en vez de tirar el registro,
   * porque el dato principal —quien se inscribe— ya es válido y perderlo por el
   * acompañante sería peor.
   */
  const rawCompanion = (raw.companion ?? {}) as Record<string, unknown>;
  const companionFields = {
    name: text(rawCompanion.name),
    surname: text(rawCompanion.surname),
    organization: text(rawCompanion.organization),
    role: text(rawCompanion.role),
  };
  const companionLinkedin = text(rawCompanion.linkedin);
  const companionComplete = Object.values(companionFields).every(
    (value) => value && value.length <= MAX_LENGTH,
  );
  const companion: CompanionInput | null = companionComplete
    ? { ...companionFields, linkedin: companionLinkedin || null }
    : null;

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
      bringsCompanion: raw.bringsCompanion === true,
      companion,
    },
  };
}
