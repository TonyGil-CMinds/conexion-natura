'use client';

import { usePathname } from 'next/navigation';

/**
 * Rutas que traen **su propia** barra de navegación.
 *
 * Se comparan por el final del camino para no repetir el prefijo de idioma: la
 * micropágina existe en `/es/tanusas` y en `/en/tanusas`.
 */
const OWN_HEADER = ['/tanusas'];

/**
 * Deja pasar la cabecera del sitio salvo en las rutas que traen la suya.
 *
 * La cabecera se sigue componiendo en el layout raíz —es la regla del proyecto:
 * así no se anima al navegar y su indicador sobrevive al cambio de ruta—, pero
 * una micropágina cuya navegación es interna no puede llevar dos barras, una
 * para salir del sitio y otra para recorrerla.
 *
 * Va de cliente porque el layout no recibe la ruta. `usePathname` sí la tiene ya
 * en el render del servidor, así que la cabecera **no llega** al HTML de estas
 * rutas: no hay un cuadro en el que se vea y luego desaparezca.
 *
 * La cabecera entra como `children` y no como importación para que siga siendo
 * un componente de servidor: si se importara aquí, se iría entera al cliente.
 */
export function HeaderGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hasOwn = OWN_HEADER.some((route) => pathname.endsWith(route));

  return hasOwn ? null : <>{children}</>;
}
