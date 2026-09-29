import { permanentRedirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import { QUITO } from '@/config/quito';
import { isLocale, localePath } from '@/i18n';

type Props = { params: Promise<{ locale: string }> };

/**
 * El registro **ya no es una pantalla propia**: se hace en la portada, donde el
 * botón se convierte en el campo del correo.
 *
 * La ruta se queda como redirección y no se borra: los correos de confirmación
 * ya enviados y cualquier enlace repartido apuntan aquí, y un 404 dejaría a
 * quien lo abra sin saber qué pasó. Lleva a la portada con la marca que hace
 * que el campo se despliegue solo, así que aterriza en la acción y no en una
 * página donde volver a buscar el botón.
 */
export default async function QuitoRegistrationRedirect({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  permanentRedirect(`${localePath(locale, QUITO.root)}?${QUITO.joinParam}=1`);
}
