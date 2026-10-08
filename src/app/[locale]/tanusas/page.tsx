import { notFound, redirect } from 'next/navigation';
import { isLocale } from '@/i18n';

type Props = { params: Promise<{ locale: string }> };

/**
 * `/tanusas` lleva ahora a la agenda.
 *
 * Mientras el taller ocurre, quien abre esta dirección no viene a leer la
 * invitación —ya la aceptó y está en Tanusas— sino a ver qué toca ahora. La
 * micropágina sigue en el repositorio y vuelve cambiando este redirigir por lo
 * que había: su componente, `TanusasPage`, no se ha tocado.
 *
 * Es temporal a propósito. Un 308 se queda cacheado en el navegador de quien lo
 * siga y la dirección quedaría quemada para siempre; `redirect()` manda un 307,
 * que no se guarda.
 */
export default async function TanusasRoute({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  redirect(`/${locale}/tanusas/agenda`);
}
