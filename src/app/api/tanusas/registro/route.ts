import { after } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { DIET_KEYS } from '@/features/tanusas/config/diet-options';
import { sendRetreatConfirmation } from '@/features/tanusas/lib/confirmation-email';

/**
 * Registro al retiro de Tanusas.
 *
 * `upsert` **por correo**, igual que el registro de Quito: la invitación es
 * personal, así que un correo es un registro, y quien reenvía el formulario está
 * corrigiendo el suyo —una ciudad de vuelo distinta, una alergia que olvidó— y
 * no registrándose dos veces.
 *
 * Va a su propia tabla (`TanusasRegistration`) y no a `Attendee`: es otro acto,
 * con otros campos y sin los de aquel.
 *
 * La validación vive aquí y no solo en el formulario: el formulario es una
 * comodidad para quien rellena, no una garantía de nada.
 */

/** Tope por campo. Sobra para lo que se pide y frena un cuerpo absurdo. */
const MAX_LENGTH = 400;
/** La pregunta y el detalle de la restricción sí son texto largo. */
const MAX_TEXT = 2000;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function text(value: unknown, max = MAX_LENGTH) {
  return typeof value === 'string' ? value.trim().replace(/\s{2,}/g, ' ').slice(0, max) : '';
}

/** Campos obligatorios, en el orden del formulario. */
const REQUIRED = ['name', 'surname', 'organization', 'role', 'city'] as const;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido: se esperaba JSON.' }, { status: 400 });
  }

  const raw = (body ?? {}) as Record<string, unknown>;
  const email = typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : '';

  const values = Object.fromEntries(
    REQUIRED.map((field) => [field, text(raw[field])]),
  ) as Record<(typeof REQUIRED)[number], string>;

  /**
   * Solo se aceptan claves del catálogo: lo que se guarda es el dato, y un
   * cliente manipulado no debe poder meter texto libre en esa columna.
   */
  const diet = Array.isArray(raw.diet)
    ? [...new Set(raw.diet.filter((key): key is string => typeof key === 'string' && DIET_KEYS.includes(key)))]
    : [];

  const fields: Record<string, string> = {};
  if (!EMAIL.test(email)) fields.email = 'Escribe un correo válido.';
  for (const field of REQUIRED) if (!values[field]) fields[field] = 'Este dato es obligatorio.';
  // La fotografía es obligatoria: es la cara de la credencial del retiro.
  const photoUrl = typeof raw.photoUrl === 'string' && raw.photoUrl ? raw.photoUrl : null;
  if (!photoUrl) fields.photoUrl = 'Falta la fotografía.';
  if (!diet.length) fields.diet = 'Elige al menos una opción.';

  if (Object.keys(fields).length) {
    return NextResponse.json({ error: 'Revisa los datos marcados.', fields }, { status: 422 });
  }

  /** El idioma decide la plantilla del correo. Cualquier otra cosa, español. */
  const locale = raw.locale === 'en' ? 'en' : 'es';

  const data = {
    ...values,
    locale,
    question: text(raw.question, MAX_TEXT),
    diet,
    dietNotes: text(raw.dietNotes, MAX_TEXT),
    photoUrl,
  };

  try {
    const registration = await prisma.tanusasRegistration.upsert({
      where: { email },
      update: data,
      create: { email, ...data },
      select: {
        id: true,
        name: true,
        surname: true,
        email: true,
        diet: true,
        photoUrl: true,
        confirmationSentAt: true,
      },
    });

    /**
     * El correo va en `after()`: la respuesta no lo espera, y un fallo del
     * proveedor se anota y no rompe el registro —la fila ya está guardada—.
     *
     * Se manda **una sola vez**, con la marca en `confirmationSentAt`: corregir
     * el registro no debe traer un segundo correo de bienvenida.
     */
    if (!registration.confirmationSentAt) {
      after(() => sendRetreatConfirmation({ id: registration.id, email, name: values.name, locale }));
    }

    return NextResponse.json({ registration }, { status: 201 });
  } catch (error) {
    console.error('[api/tanusas/registro] no se pudo guardar el registro', error);
    return NextResponse.json({ error: 'No se pudo guardar el registro.' }, { status: 500 });
  }
}

/**
 * Busca un registro por correo.
 *
 * Es lo que decide, al dar el correo en el hero, si hay que registrar a alguien
 * o si ya está y solo hay que enseñarle lo suyo. Devuelve los mismos campos que
 * pinta el acuse, para que quien vuelve no tenga que repetir el proceso.
 *
 * Con el correo a secas se ve el registro entero, y un 404 dice quién no está en
 * la lista. Es el mismo trato que el registro de Quito: la alternativa —un
 * enlace de un solo uso por correo— es otra pieza y otra decisión.
 */
export async function GET(request: Request) {
  const email = new URL(request.url).searchParams.get('email')?.trim().toLowerCase();
  if (!email) return NextResponse.json({ error: 'Falta el correo.' }, { status: 400 });

  try {
    const registration = await prisma.tanusasRegistration.findUnique({
      where: { email },
      select: {
        email: true,
        name: true,
        surname: true,
        organization: true,
        role: true,
        city: true,
        question: true,
        diet: true,
        dietNotes: true,
        photoUrl: true,
      },
    });
    if (!registration) {
      return NextResponse.json({ error: 'No hay registro con ese correo.' }, { status: 404 });
    }
    return NextResponse.json({ registration });
  } catch (error) {
    console.error('[api/tanusas/registro] no se pudo leer', error);
    return NextResponse.json({ error: 'No se pudo consultar el registro.' }, { status: 500 });
  }
}
