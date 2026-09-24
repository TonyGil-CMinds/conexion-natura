import 'server-only';
import { prisma } from '@/lib/prisma';
import { findInviteeMatch, type Candidate, type InviteeMatch } from './invitee-match';

/**
 * Quién entra confirmado y quién a lista de espera.
 *
 * El aforo es por invitación, así que el registro ya no confirma a cualquiera:
 * decide contra la lista de preregistro. Tres caminos, de más a menos seguro:
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
