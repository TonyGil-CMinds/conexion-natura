import { after } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
/**
 * Del archivo de configuración y **no** del índice de la feature: el índice
 * exporta también el flujo, que es un componente de cliente, y por ahí se colaba
 * React entero en el paquete de esta ruta —medido: 1,3 MB contra 140 B—.
 */
import {
  PARTICIPATION_KEYS,
  needsPitch,
} from '@/features/ecuador/config/participation-options';
import { sendEcuadorConfirmation } from '@/features/ecuador/lib/confirmation-email';

/**
 * Registro de empresas e iniciativas de Ecuador a la Natura500 Night.
 *
 * `upsert` **por correo**, igual que el resto del sitio: un correo es un
 * registro, y quien reenvía el formulario está corrigiendo el suyo —una mesa que
 * ya no pide, un acompañante que se cayó— y no registrándose dos veces.
 *
 * Va a su propia tabla (`EcuadorRegistration`) y no a `Attendee`: no se elige
 * acto, se pide un espacio, y el acompañante aquí es un dato de aforo y no una
 * persona que complete su propio registro.
 *
 * La validación vive aquí y no solo en el formulario: el formulario es una
 * comodidad para quien rellena, no una garantía de nada.
 */

/** Tope por campo. Sobra para lo que se pide y frena un cuerpo absurdo. */
const MAX_LENGTH = 400;
/** Lo que se presentaría sí es texto largo. */
const MAX_TEXT = 2000;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(value: unknown, max = MAX_LENGTH) {
  return typeof value === 'string' ? value.trim().replace(/\s{2,}/g, ' ').slice(0, max) : '';
}

/** Campos obligatorios de texto, en el orden del formulario. */
const REQUIRED = ['fullName', 'organization'] as const;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido: se esperaba JSON.' }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const email = typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : '';

  const values = Object.fromEntries(REQUIRED.map((field) => [field, text(raw[field])])) as Record<
    (typeof REQUIRED)[number],
    string
  >;

  /**
   * Solo se acepta una clave del catálogo: lo que se guarda es el dato, y un
   * cliente manipulado no debe poder meter texto libre en esa columna.
   */
  const participation =
    typeof raw.participation === 'string' && PARTICIPATION_KEYS.includes(raw.participation)
      ? raw.participation
      : '';

  const wantsTable = participation !== '' && needsPitch(participation);
  const tablePitch = wantsTable ? text(raw.tablePitch, MAX_TEXT) : '';

  /**
   * El acompañante solo cuenta si se dijo que sí. Sin esa marca, lo que venga en
   * esos dos campos se descarta: lo que se guarda tiene que decir la verdad.
   */
  const bringsGuest = raw.bringsGuest === true;
  const guestName = bringsGuest ? text(raw.guestName) : '';
  const guestEmail = bringsGuest
    ? text(raw.guestEmail).toLowerCase()
    : '';

  const fields: Record<string, string> = {};
  if (!EMAIL.test(email)) fields.email = 'Escribe un correo válido.';
  for (const field of REQUIRED) if (!values[field]) fields[field] = 'Este dato es obligatorio.';
  if (!participation) fields.participation = 'Elige cómo quieres participar.';
  if (wantsTable && !tablePitch) fields.tablePitch = 'Cuéntanos qué presentarías.';
  if (bringsGuest && !guestName) fields.guestName = 'Falta el nombre de tu acompañante.';
  if (bringsGuest && !EMAIL.test(guestEmail)) {
    fields.guestEmail = 'Escribe un correo válido para tu acompañante.';
  }
  /**
   * La fotografía **ya no se pide**: el formulario la quitó y con ella la
   * credencial. La columna se queda —las filas de antes conservan su retrato y
   * borrarlas sería tirar algo que no molesta— pero nada la exige, y el cliente
   * ya no la manda.
   */
  const photoUrl = typeof raw.photoUrl === 'string' && raw.photoUrl ? raw.photoUrl : null;

  if (Object.keys(fields).length) {
    return NextResponse.json({ error: 'Revisa los datos marcados.', fields }, { status: 422 });
  }

  /** El idioma decide la plantilla del correo. Cualquier otra cosa, español. */
  const locale = raw.locale === 'en' ? 'en' : 'es';

  const data = {
    ...values,
    participation,
    tablePitch,
    guestName,
    guestEmail,
    locale,
  };

  try {
    const registration = await prisma.ecuadorRegistration.upsert({
      where: { email },
      /* Sin retrato nuevo no se toca el que hubiera: `undefined` no escribe. */
      update: { ...data, photoUrl: photoUrl ?? undefined },
      create: { email, ...data, photoUrl },
      select: {
        id: true,
        fullName: true,
        email: true,
        participation: true,
        photoUrl: true,
        confirmationSentAt: true,
      },
    });

    /**
     * El correo va en `after()`: la respuesta no lo espera, y un fallo del
     * proveedor se anota y no rompe el registro —la fila ya está guardada—.
     *
     * Se manda **una sola vez**, con la marca en `confirmationSentAt`: corregir
     * el registro no debe traer un segundo acuse.
     */
    if (!registration.confirmationSentAt) {
      after(() =>
        sendEcuadorConfirmation({
          id: registration.id,
          email,
          fullName: values.fullName,
          wantsTable,
          locale,
        }),
      );
    }

    return NextResponse.json({ registration }, { status: 201 });
  } catch (error) {
    console.error('[api/registro/ecuador] no se pudo guardar el registro', error);
    return NextResponse.json({ error: 'No se pudo guardar el registro.' }, { status: 500 });
  }
}

/**
 * Busca un registro por correo.
 *
 * Es lo que decide, al dar el correo en la primera pantalla, si hay que
 * registrar a alguien o si ya está y solo hay que enseñarle lo suyo. Devuelve
 * los mismos campos que pintan el acuse y los pasos, para que quien vuelve no
 * tenga que repetir el proceso.
 *
 * Con el correo a secas se ve el registro entero, y un 404 dice quién no está en
 * la lista. Es el mismo trato que el resto de los registros del sitio: la
 * alternativa —un enlace de un solo uso por correo— es otra pieza y otra
 * decisión.
 */
export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get('email')?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: 'Falta el correo.' }, { status: 400 });

  try {
    const registration = await prisma.ecuadorRegistration.findUnique({
      where: { email },
      select: {
        email: true,
        fullName: true,
        organization: true,
        participation: true,
        tablePitch: true,
        guestName: true,
        guestEmail: true,
        photoUrl: true,
      },
    });
    if (!registration) {
      return NextResponse.json({ error: 'No hay registro con ese correo.' }, { status: 404 });
    }
    return NextResponse.json({ registration });
  } catch (error) {
    console.error('[api/registro/ecuador] no se pudo leer', error);
    return NextResponse.json({ error: 'No se pudo consultar el registro.' }, { status: 500 });
  }
}
