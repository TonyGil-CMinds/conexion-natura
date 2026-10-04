import 'server-only';
import { prisma } from '@/lib/prisma';
import { findInviteeMatch, type Candidate, type InviteeMatch } from './invitee-match';

/**
 * Quién entra confirmado y quién a lista de espera.
 *
 * **Mientras falte gente para llenar la sala, entra todo el que llega.** La
 * lista de preregistro no desaparece: sigue diciendo de quién es cada
 * invitación, pero deja de ser la puerta. Al llegar al aforo vuelve a serlo.
 *
 * Con la sala llena, decide contra la lista. Tres caminos, de más a menos
 * seguro:
 *
 * 1. **Su correo está en la lista.** Confirmado, sin más preguntas.
 * 2. **No está, pero el nombre y la organización coinciden** con alguien de la
 *    lista. No se decide aquí: se devuelve la coincidencia para que la propia
 *    persona diga si es ella, y solo entonces cuenta como invitación reclamada.
 * 3. **Ni una cosa ni otra.** Lista de espera.
 *
 * Vive aparte de la ruta porque es la regla del negocio, y así se puede
 * comprobar sin levantar un servidor.
 */

export type Admission =
  /** Entra: su correo está en la lista, o reconoció su invitación. */
  | { kind: 'confirmed'; inviteeId: string | null }
  /** Hay que preguntarle si es quien parece. Nada se ha guardado. */
  | { kind: 'identityCheck'; match: InviteeMatch }
  /** A la espera de que el equipo revise si hay sitio. */
  | { kind: 'waitlist' };

/** Lo que el formulario puede mandar sobre la pregunta de identidad. */
export type IdentityAnswer =
  /** Dijo que sí a la invitación que se le enseñó. */
  | { claimInviteeId: string }
  /** Dijo que no, o ya se le preguntó: no hay que volver a preguntar. */
  | { identityChecked: true }
  | undefined;

/**
 * Cuánta gente entra sin preguntar nada.
 *
 * Mientras haya menos de este número con plaza, **el registro confirma a todo
 * el que llegue**: la lista de preregistro deja de decidir y pasa a ser solo lo
 * que ata a cada quien su invitación. Al alcanzarlo, la puerta vuelve a ser la
 * de antes y quien no esté en la lista va a la espera.
 *
 * Es una decisión de aforo y no una regla del código, así que vive aquí arriba
 * y se cambia con un número.
 */
const AFORO_ABIERTO = 170;

/**
 * Cuántas personas tienen plaza ahora mismo.
 *
 * Cuenta **filas de asistente**, no registros: quien trae acompañante ocupa dos
 * sitios en la sala, y el aforo es de sillas. Los pendientes no cuentan —todavía
 * no han completado su registro— pero cuando lo completen heredan el estado de
 * quien les invitó y entran a sumar, que es lo correcto: su sitio ya estaba
 * reservado por el anfitrión.
 */
async function conPlaza(): Promise<number> {
  return prisma.attendee.count({ where: { status: 'CONFIRMED' } });
}

/**
 * Decide el estado de un registro.
 *
 * `currentInviteeId` es la invitación que esta persona ya tuviera atada: quien
 * corrige sus datos no debe perderla ni volver a pasar por la pregunta.
 */
export async function admit(
  candidate: Candidate,
  answer: IdentityAnswer,
  currentInviteeId: string | null,
): Promise<Admission> {
  const email = candidate.email.trim().toLowerCase();

  /** 1. El camino corto: su correo está en la lista. */
  const porCorreo = await prisma.invitee.findUnique({
    where: { email },
    select: { id: true, attendee: { select: { email: true } } },
  });
  if (porCorreo) {
    /**
     * Si esa invitación ya la reclamó **otra** persona —se reconoció por nombre
     * desde otro correo— se confirma igual pero sin atarla: el correo de la
     * lista es la prueba más fuerte que hay y no se le puede negar la entrada,
     * y quitarle la invitación a quien ya la tiene sería decidir a ciegas. Queda
     * anotado para que el equipo lo mire.
     */
    const reclamadaPorOtro = porCorreo.attendee && porCorreo.attendee.email !== email;
    if (reclamadaPorOtro) {
      console.warn(
        `[registro] ${email} está en la lista pero su invitación ya la reclamó ${porCorreo.attendee!.email}; se confirma sin atarla`,
      );
      return { kind: 'confirmed', inviteeId: null };
    }
    return { kind: 'confirmed', inviteeId: porCorreo.id };
  }

  /** Ya tenía invitación atada de un registro anterior: se respeta. */
  if (currentInviteeId) return { kind: 'confirmed', inviteeId: currentInviteeId };

  /**
   * Mientras sobre sitio, entra todo el mundo.
   *
   * Va **después** de mirar la lista para que quien esté en ella siga saliendo
   * con su invitación atada: el aforo cambia quién entra, no a quién pertenece
   * cada invitación.
   *
   * Y va **antes** de la pregunta de identidad porque esa pregunta solo existía
   * para decidir la entrada. Con la puerta abierta, preguntarle a alguien si es
   * quien parece sería hacerle justificar algo que ya no se le pide.
   *
   * La cuenta se hace al vuelo y no se cachea: dos registros a la vez podrían
   * colarse en el 169 y dejar 171. A esta escala eso es un asiento de más, no un
   * problema; una reserva atómica costaría una transacción por registro.
   */
  if ((await conPlaza()) < AFORO_ABIERTO) return { kind: 'confirmed', inviteeId: null };

  /** 2. Dijo «sí, soy yo». Se vuelve a comprobar aquí: el cliente no decide. */
  if (answer && 'claimInviteeId' in answer) {
    const match = await matchFor(candidate);
    if (match && match.invitee.id === answer.claimInviteeId) {
      return { kind: 'confirmed', inviteeId: match.invitee.id };
    }
    /**
     * Lo que mandó no encaja con lo escrito: puede ser un formulario editado a
     * mano, o que haya cambiado el nombre después de ver la pregunta. No se
     * discute, se manda a la espera.
     */
    return { kind: 'waitlist' };
  }

  /** 3. Todavía no se le ha preguntado y hay a quién parecerse. */
  if (!(answer && 'identityChecked' in answer)) {
    const match = await matchFor(candidate);
    if (match) return { kind: 'identityCheck', match };
  }

  return { kind: 'waitlist' };
}

/** Busca coincidencia contra la lista, saltándose las ya reclamadas. */
async function matchFor(candidate: Candidate): Promise<InviteeMatch | null> {
  const invitees = await prisma.invitee.findMany({
    select: {
      id: true,
      email: true,
      fullName: true,
      organization: true,
      attendee: { select: { id: true } },
    },
  });
  const reclamadas = new Set(invitees.filter((i) => i.attendee).map((i) => i.id));
  return findInviteeMatch(candidate, invitees, reclamadas);
}
