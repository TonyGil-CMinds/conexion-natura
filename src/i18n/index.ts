import { es } from './dictionaries/es';
import { en } from './dictionaries/en';
import type { Locale } from './config';

export { DEFAULT_LOCALE, LOCALES, LOCALE_LABELS, isLocale } from './config';
export type { Locale } from './config';

/**
 * Forma del diccionario, tomada del español.
 *
 * `Loosen` hace dos cosas sobre el tipo que deja `as const`: quita los
 * `readonly` —si el tipo llegara como tupla de longitud fija, el inglés tendría
 * que repetir exactamente el mismo número de ponentes o de preguntas— y ensancha
 * los literales a `string`, porque si no el inglés tendría que decir
 * literalmente «Ponentes» para encajar en el tipo.
 */
type Loosen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends readonly (infer U)[]
        ? readonly Loosen<U>[]
        : T extends object
          ? { -readonly [K in keyof T]: Loosen<T[K]> }
          : T;

export type Dictionary = Loosen<typeof es>;

const DICTIONARIES: Record<Locale, Dictionary> = {
  es,
  en,
};

/**
 * Diccionario de un idioma. Es síncrono a propósito: las dos copias son parte del
 * paquete, y partirlas en `import()` por idioma solo ahorraría unos kilobytes de
 * texto a cambio de volver asíncrono cada componente de servidor que los use.
 */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** Prefija una ruta con el idioma: `/agenda` → `/en/agenda`. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === '/' ? '' : path;
  return `/${locale}${clean}`;
}
