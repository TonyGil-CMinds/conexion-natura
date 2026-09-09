/**
 * Convierte en URL lo que se escriba en el campo de LinkedIn.
 *
 * Nadie teclea `https://www.linkedin.com/in/...` a mano: se pega el enlace, se
 * escribe el usuario o se copia con arroba. El sistema se adapta a eso en vez de
 * pedir un formato, y además la columna guarda siempre una URL completa —que es
 * lo que la validación del servidor exige, y lo que hace que el enlace funcione
 * al pincharlo en la credencial—.
 *
 * Se fuerza `https`: la validación del servidor rechaza cualquier otro esquema, y
 * LinkedIn redirige a seguro de todas formas.
 *
 * Acepta:
 *   antoniogil                      → https://www.linkedin.com/in/antoniogil
 *   @antoniogil                     → https://www.linkedin.com/in/antoniogil
 *   in/antoniogil                   → https://www.linkedin.com/in/antoniogil
 *   company/cminds                  → https://www.linkedin.com/company/cminds
 *   linkedin.com/in/antoniogil      → https://linkedin.com/in/antoniogil
 *   http://linkedin.com/in/x        → https://linkedin.com/in/x
 *   https://www.linkedin.com/in/x   → tal cual
 */
export function normalizeLinkedIn(value: string): string {
  // Sin espacios: al pegar suele venir uno delante o detrás, y a veces dentro.
  const clean = value.trim().replace(/\s+/g, '');
  if (!clean) return '';

  // Ya viene con esquema: solo se asegura que sea seguro.
  if (/^https?:\/\//i.test(clean)) return clean.replace(/^http:\/\//i, 'https://');

  // Con dominio pero sin esquema.
  if (/^(www\.)?linkedin\.com\//i.test(clean)) return `https://${clean}`;

  // Una ruta del sitio: perfil o empresa.
  if (/^(in|company|school)\//i.test(clean)) return `https://www.linkedin.com/${clean}`;

  // Lo que queda es el usuario, con o sin arroba.
  return `https://www.linkedin.com/in/${clean.replace(/^@+/, '')}`;
}
