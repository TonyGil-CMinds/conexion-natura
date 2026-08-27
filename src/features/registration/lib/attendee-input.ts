/**
 * Normalización y validación de un registro, del lado del servidor.
 *
 * El formulario valida por su cuenta para avisar mientras se escribe, pero eso
 * es comodidad: cualquiera puede llamar al endpoint sin pasar por la pantalla,
 * así que aquí se vuelve a comprobar todo. Este módulo es puro —sin acceso a la
 * base ni a la red— para poder probarlo solo.
 */

export type AttendeeInput = {
  name: string;
  surname: string;
  email: string;
  organization: string;
  role: string;
  linkedin: string | null;
  photoUrl: string | null;
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
    },
  };
}
