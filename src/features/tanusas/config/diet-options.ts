/**
 * Restricciones alimentarias o de salud que se pueden marcar en el registro.
 *
 * Lo que se guarda es la **clave**, no el rótulo: la copia se traduce y el dato
 * no, así que una fila sigue queriendo decir lo mismo en los dos idiomas.
 *
 * `none` es excluyente: quien dice que no tiene ninguna no puede tener además
 * una. Lo resuelve la pantalla al marcar, no la validación, porque es una regla
 * de la elección y no de los datos.
 *
 * `needsNotes` marca las que no se explican solas: una alergia sin decir a qué
 * no sirve para encargar la comida.
 */
export type DietKey =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'glutenFree'
  | 'lactoseFree'
  | 'allergy'
  | 'health';

export type DietOption = {
  key: DietKey;
  /** Excluyente con todas las demás. */
  exclusive?: boolean;
  /** Pide el detalle libre para poder actuar sobre ella. */
  needsNotes?: boolean;
};

export const DIET_OPTIONS: readonly DietOption[] = [
  { key: 'none', exclusive: true },
  { key: 'vegetarian' },
  { key: 'vegan' },
  { key: 'glutenFree' },
  { key: 'lactoseFree' },
  { key: 'allergy', needsNotes: true },
  { key: 'health', needsNotes: true },
];

/** Las claves válidas, para que el servidor no acepte cualquier cosa. */
export const DIET_KEYS: readonly string[] = DIET_OPTIONS.map((option) => option.key);
