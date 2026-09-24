'use client';

import type { EventChoice } from '../lib/attendee-input';
import { verifyAttendee } from '../lib/lookup-attendee';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

/**
 * El perfil de quien ya confirmó.
 *
 * Guarda el formulario entero y no solo el nombre porque `/registro` muestra el
 * resumen al volver: sin los demás campos, al recargar la página el resumen
 * tendría que inventarse los datos. La cabecera solo usa `name`.
 */
export type Attendee = {
  id: string;
  name: string;
  surname: string;
  email: string;
  organization: string;
  role: string;
  linkedin: string | null;
  /** URL en R2. El archivo no está aquí: solo el enlace. */
  photoUrl: string | null;
  /**
   * Los actos a los que va, en los valores de la columna.
   *
   * Opcional porque un registro guardado antes de que existiera la elección no
   * los trae: quien lo lea debe suponer el acto principal, no romperse.
   */
  events?: EventChoice[];
  /**
   * En qué situación está su registro.
   *
   * Desde que el aforo va por invitación, confirmarse no es automático: quien
   * no está en la lista de preregistro queda en `WAITLIST` y su lugar depende
   * de que el equipo revise si hay sitio. La pantalla final y el botón del
   * sitio dicen cosas distintas según esto.
   *
   * Opcional porque un perfil guardado antes de que existiera no lo trae:
   * quien lo lea debe suponer que está confirmado, que es como era entonces.
   */
  status?: 'PENDING' | 'CONFIRMED' | 'WAITLIST';
  /**
   * Si dijo que viene acompañado.
   *
   * Opcional porque un perfil guardado en el navegador antes de que se
   * devolviera este campo no lo trae: quien lo lea debe suponer que no.
   */
  bringsGuest?: boolean;
  /**
   * A quién invitó y si ya completó su registro.
   *
   * Es una lista porque así lo devuelve el servidor —la relación admite más de
   * uno—, aunque hoy el formulario solo deje invitar a una persona.
   */
  guests?: Guest[];
};

/** Un invitado, visto desde la pantalla de quien lo invitó. */
export type Guest = {
  name: string;
  email: string;
  /** `PENDING` mientras no complete su propio registro. */
  status: 'PENDING' | 'CONFIRMED';
};

type AttendanceState = {
  /** `null` mientras no haya confirmación en esta sesión. */
  attendee: Attendee | null;
  confirm: (attendee: Attendee) => void;
  clear: () => void;
};

/** Clave de almacenamiento. Provisional: sustituir al montar la base de datos. */
const STORAGE_KEY = 'c500-attendee-v3';

/**
 * Claves de flujos anteriores, que se borran al montar.
 *
 * El registro se rehízo y el formulario que escribía `c500-attendee` ya no
 * existe, así que quien lo probó se quedaba con una confirmación fantasma: la
 * cabecera enseñaba su nombre y el hero decía «asistencia confirmada» mientras
 * `/registro` volvía a pedirle el correo. Y no había manera de limpiarlo desde la
 * interfaz, porque el resumen que traía el botón de editar tampoco está.
 *
 * Versionar la clave lo resuelve de una vez y para todos, en vez de pedirle a
 * cada uno que vacíe el almacenamiento a mano.
 *
 * En la lista entra también el borrador del registro (`c500-join`): el paso de
 * la fotografía cambió —ahora quita el fondo y encuadra— y un borrador a medias
 * de la versión anterior arrancaría el flujo con datos que ya no encajan.
 */
const LEGACY_KEYS = ['c500-attendee', 'c500-attendee-v2', 'c500-join'];

const AttendanceContext = createContext<AttendanceState>({
  attendee: null,
  confirm: () => {},
  clear: () => {},
});

/**
 * Estado de asistencia, compartido por la cabecera, el hero y el pie.
 *
 * Vive en el layout raíz porque los tres consumidores están en ramas distintas
 * del árbol: pasarlo por props obligaría a atravesar componentes que no tienen
 * nada que ver con el registro.
 *
 * Guarda en `localStorage` —no en `sessionStorage`— porque confirmar asistencia
 * es un compromiso que debe sobrevivir al cierre de la pestaña, al contrario que
 * el loader.
 *
 * Pero lo guardado es una **copia**, no la verdad: la fila de la base manda, y
 * por eso al arrancar se comprueba contra ella (ver el efecto de abajo). Mientras
 * esto era solo almacenamiento local, un registro borrado dejaba al navegador
 * enseñando una confirmación que ya no existía.
 */
export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [attendee, setAttendee] = useState<Attendee | null>(null);

  /**
   * Se lee después de montar y no en el estado inicial: en el servidor no hay
   * `localStorage`, y devolver algo distinto en cliente rompería la hidratación.
   *
   * Y después de leerlo **se comprueba contra la base**. El navegador guarda una
   * copia, no la verdad: si esa fila ya no existe —se borró, se limpió la base
   * antes del evento— quien volvía seguía viendo su nombre en la cabecera y el
   * resumen en `/registro`, sin forma de registrarse otra vez. Pasó de verdad.
   *
   * El orden importa: primero se pinta lo guardado y luego se corrige. Esperar a
   * la red para enseñar el nombre haría parpadear «Regístrate» en cada carga a
   * quien sí está registrado, que es el caso normal.
   *
   * Solo se borra con un **404**, que es el servidor diciendo que no está. Un
   * fallo de red deja el perfil como estaba: nadie debe perder su confirmación
   * por pasar por un túnel.
   */
  useEffect(() => {
    let stored: Attendee | null = null;
    try {
      for (const key of LEGACY_KEYS) window.localStorage.removeItem(key);
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw) as Attendee;
    } catch {
      // Almacenamiento bloqueado o dato corrupto: se sigue sin confirmación.
    }
    if (!stored?.email) return;
    setAttendee(stored);

    let cancelled = false;
    void (async () => {
      const check = await verifyAttendee(stored.email);
      if (cancelled || check.status === 'unknown') return;

      if (check.status === 'missing') {
        setAttendee(null);
        try {
          window.localStorage.removeItem(STORAGE_KEY);
        } catch {}
        return;
      }

      /**
       * Sigue estando: se adopta la versión del servidor. Además de confirmar,
       * refresca lo que pudo cambiar sin pasar por aquí —que un invitado haya
       * completado su registro, por ejemplo—.
       */
      setAttendee(check.attendee);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(check.attendee));
      } catch {}
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const confirm = useCallback((next: Attendee) => {
    setAttendee(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const clear = useCallback(() => {
    setAttendee(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const value = useMemo(() => ({ attendee, confirm, clear }), [attendee, confirm, clear]);

  return <AttendanceContext.Provider value={value}>{children}</AttendanceContext.Provider>;
}

export function useAttendance(): AttendanceState {
  return useContext(AttendanceContext);
}
