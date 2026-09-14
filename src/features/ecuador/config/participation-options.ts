/**
 * Cómo se puede participar en la Natura500 Night.
 *
 * Lo que se guarda es la **clave**, no el rótulo: la copia se traduce y el dato
 * no, así que una fila sigue queriendo decir lo mismo en los dos idiomas.
 *
 * A diferencia de las restricciones del retiro, esta elección es **única**: o se
 * viene de público, o se viene pidiendo una mesa —que incluye venir de público—.
 * Por eso las tarjetas son botones de radio y no casillas.
 *
 * `needsPitch` marca la que no se explica sola: una mesa sin decir qué se
 * enseña no se puede valorar, y el aforo se asigna revisando justamente eso.
 */
export type ParticipationKey = 'attendee' | 'table';

export type ParticipationOption = {
  key: ParticipationKey;
  /** Pide el detalle libre de qué se presentaría. */
  needsPitch?: boolean;
};

export const PARTICIPATION_OPTIONS: readonly ParticipationOption[] = [
  { key: 'attendee' },
  { key: 'table', needsPitch: true },
];

/** Las claves válidas, para que el servidor no acepte cualquier cosa. */
export const PARTICIPATION_KEYS: readonly string[] = PARTICIPATION_OPTIONS.map(
  (option) => option.key,
);

/** Si esa forma de participar exige contar qué se presentaría. */
export function needsPitch(key: string): boolean {
  return PARTICIPATION_OPTIONS.some((option) => option.key === key && option.needsPitch);
}
