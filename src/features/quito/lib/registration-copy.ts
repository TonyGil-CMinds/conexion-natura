import type { Dictionary } from '@/i18n';

/**
 * La copia del registro, con el acto renombrado para esta sección.
 *
 * Dentro de `/quito` la noche se anuncia como «CEIBA - Welcome to Quito». Fuera
 * sigue siendo «Natura500 Night»: es el mismo acto y la misma fila en la base,
 * pero cada puerta lo nombra a su manera, y eso lo decidió el equipo.
 *
 * Las claves se enumeran **una a una** en vez de recorrer el diccionario
 * sustituyendo cadenas. Un reemplazo a ciegas habría tocado también la
 * premiación —que se llama «Premiación Natura500»— y cualquier texto futuro que
 * mencione la marca sin referirse al acto.
 *
 * No hay copia de estas cadenas en el diccionario de Quito: se derivan de la del
 * registro, así que arreglar una errata en `registration` la arregla en las dos
 * puertas.
 */
export function quitoRegistrationCopy(
  copy: Dictionary['registration'],
  quito: Dictionary['quito']['registration'],
): Dictionary['registration'] {
  return {
    ...copy,
    /**
     * El número de paso cambia porque aquí hay un paso menos: sin elección de
     * acto, los datos son el primero y no el segundo. Dejarlo en «paso 2» habría
     * hecho contar a quien rellena un paso que nunca vio.
     */
    details: {
      ...copy.details,
      step: quito.step,
      stepGuest: quito.stepGuest,
    },
    welcome: {
      ...copy.welcome,
      events: { ...copy.welcome.events, night: quito.eventName },
      shareTitle: quito.shareTitle,
      shareText: quito.shareText,
    },
  };
}
