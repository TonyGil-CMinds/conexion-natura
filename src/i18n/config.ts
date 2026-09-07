/**
 * Idiomas del sitio.
 *
 * El español no lleva prefijo propio en el pensamiento del diseño, pero sí en la
 * URL (`/es`): así las dos versiones se tratan igual y no hay una ruta canónica
 * ambigua. `/` redirige al idioma por defecto desde el middleware.
 */
export const LOCALES = ['es', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'es';

/** Rótulo de cada idioma en el conmutador. */
export const LOCALE_LABELS: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
