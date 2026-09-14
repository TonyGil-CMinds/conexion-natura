/**
 * Tallas de playera que se pueden elegir en el registro del retiro.
 *
 * A diferencia de las restricciones alimentarias, **no hay copia que traducir**:
 * «S», «M» o «XXL» se escriben igual en los dos idiomas, así que el rótulo de
 * cada ficha es el propio valor y en el diccionario solo vive el rótulo del
 * grupo. Un mapa de claves a etiquetas aquí sería un mapa de cada cosa a sí
 * misma, mantenido por duplicado.
 *
 * El orden es el del catálogo y es el de la talla, de menor a mayor: así sale
 * pintado y así se guarda.
 */
export const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;

export type ShirtSize = (typeof SHIRT_SIZES)[number];

/** Las tallas válidas, para que el servidor no acepte cualquier cosa. */
export const SHIRT_SIZE_KEYS: readonly string[] = SHIRT_SIZES;

/** Si el valor es una talla del catálogo. Lo usa la validación del servidor. */
export function isShirtSize(value: unknown): value is ShirtSize {
  return typeof value === 'string' && SHIRT_SIZE_KEYS.includes(value);
}
