/**
 * Reconocer a alguien de la lista de preregistro cuando **el correo no coincide**.
 *
 * Pasa a menudo y por dos motivos reales, los dos medidos en la lista que llegó:
 * once de las noventa y cinco invitaciones se mandaron a un buzón de la
 * organización (`info@`, `gerencia@`) y no a la persona, y mucha gente se
 * registra con su correo personal en vez del de trabajo.
 *
 * **Exige que coincidan el nombre y la organización a la vez.** No es rigor por
 * rigor: la pantalla que sale después le enseña a quien se registra el nombre y
 * la organización con los que ha encajado, así que exigir las dos cosas asegura
 * que no se le devuelve nada que no hubiera escrito ya. Con solo el nombre, un
 * desconocido podría teclear nombres hasta que el sitio le dijera dónde
 * trabajan. Y a cambio se pierde poco: quien cambió de organización cae en lista
 * de espera, que es lo que toca revisar a mano.
 *
 * Puro y sin dependencias: recibe la lista y los datos escritos, y devuelve a
 * quién se parece. Quien lo llama decide qué hacer.
 */

/** Lo que hace falta de cada fila de la lista para poder compararla. */
export type InviteeLike = {
  id: string;
  email: string;
  fullName: string;
  organization: string;
};

/** Lo que escribió quien se registra. */
export type Candidate = {
  email: string;
  name: string;
  surname: string;
  organization: string;
};

export type InviteeMatch = {
  invitee: InviteeLike;
  /** Cuánto se parecen, de 0 a 1. Para poder anotarlo y revisarlo después. */
  nameScore: number;
  orgScore: number;
};

/**
 * Deja un texto comparable: sin acentos, sin mayúsculas, sin puntuación y con
 * un solo espacio entre palabras.
 *
 * `NFD` separa la letra de su tilde y el rango `̀-ͯ` borra las tildes
 * sueltas, que es lo que hace que «Peñaherrera» y «Penaherrera» sean iguales.
 */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Distancia de edición entre dos cadenas.
 *
 * Con dos filas en vez de la matriz entera: son nombres cortos y la lista tiene
 * noventa y cinco filas, así que lo que importa es que sea simple de leer.
 */
function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j]! + 1,
        current[j - 1]! + 1,
        previous[j - 1]! + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[b.length]!;
}

/** Parecido de 0 a 1. Uno es idéntico. */
export function similarity(a: string, b: string): number {
  if (!a || !b) return 0;
  const largo = Math.max(a.length, b.length);
  return (largo - editDistance(a, b)) / largo;
}

/**
 * Parecido entre dos nombres **sin depender del orden ni de cuántas partes
 * tengan**.
 *
 * Hace falta porque el corte nombre/apellido del CSV no es fiable: en treinta y
 * cuatro de las noventa y cinco filas la columna «Apellido» trae dos palabras,
 * así que «Juan» + «Andrés Delgado» tiene que reconocer a quien escriba «Juan
 * Andrés» + «Delgado». Comparando palabra a palabra, ese reparto deja de
 * importar.
 *
 * Cada palabra del nombre escrito busca su mejor pareja en el de la lista, y el
 * resultado es la media. Las palabras de una sola letra —iniciales— no cuentan.
 */
export function nameSimilarity(a: string, b: string): number {
  const partes = (value: string) => normalize(value).split(' ').filter((w) => w.length > 1);
  const escritas = partes(a);
  const listadas = partes(b);
  if (!escritas.length || !listadas.length) return 0;

  const media = (fuente: string[], contra: string[]) =>
    fuente.reduce((suma, palabra) => {
      const mejor = contra.reduce((max, otra) => Math.max(max, similarity(palabra, otra)), 0);
      return suma + mejor;
    }, 0) / fuente.length;

  /**
   * Se mide en los dos sentidos y se toma el peor. Solo de ida, «Juan» contra
   * «Juan Carlos Jintiach» daría 1: cada palabra escrita encuentra pareja
   * aunque falten dos. El sentido contrario lo castiga.
   */
  return Math.min(media(escritas, listadas), media(listadas, escritas));
}

/**
 * Parecido entre dos organizaciones.
 *
 * Además del parecido letra a letra, cuenta que una contenga a la otra: en la
 * lista hay «AEBE - Asociación de Exportadores de Banano del Ecuador» y quien se
 * registra escribe «AEBE». Son la misma y la distancia de edición diría que no.
 */
export function orgSimilarity(a: string, b: string): number {
  const x = normalize(a);
  const y = normalize(b);
  if (!x || !y) return 0;
  if (x === y) return 1;
  // Contenida: se pide un mínimo de cuatro letras para que una sigla corta no
  // haga coincidir a media lista.
  const corta = x.length <= y.length ? x : y;
  const larga = x.length <= y.length ? y : x;
  if (corta.length >= 4 && larga.includes(corta)) return 0.95;
  return similarity(x, y);
}

/**
 * Umbrales.
 *
 * Altos a propósito: equivocarse hacia «no te reconozco» manda a alguien a lista
 * de espera, que el equipo revisa; equivocarse hacia «sí eres tú» le da el
 * lugar de otra persona.
 */
export const THRESHOLDS = { name: 0.86, organization: 0.8 } as const;

/**
 * Busca a quién de la lista se parece lo que se acaba de escribir.
 *
 * Devuelve **una sola** coincidencia, la mejor, y solo si pasa los dos
 * umbrales. Si empatan varias, gana la del nombre más parecido: la organización
 * la comparten muchas filas —cinco personas de FLACSO, dos de Acción
 * Ecológica— y es el nombre lo que distingue a la persona.
 *
 * Las invitaciones ya reclamadas se excluyen fuera de aquí, con `taken`: un
 * lugar no se puede dar dos veces.
 */
export function findInviteeMatch(
  candidate: Candidate,
  invitees: readonly InviteeLike[],
  taken: ReadonlySet<string> = new Set(),
): InviteeMatch | null {
  const escrito = `${candidate.name} ${candidate.surname}`;
  let mejor: InviteeMatch | null = null;

  for (const invitee of invitees) {
    if (taken.has(invitee.id)) continue;
    const nameScore = nameSimilarity(escrito, invitee.fullName);
    if (nameScore < THRESHOLDS.name) continue;
    const orgScore = orgSimilarity(candidate.organization, invitee.organization);
    if (orgScore < THRESHOLDS.organization) continue;
    if (!mejor || nameScore > mejor.nameScore) mejor = { invitee, nameScore, orgScore };
  }

  return mejor;
}
