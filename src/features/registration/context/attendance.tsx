'use client';

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
};

type AttendanceState = {
  /** `null` mientras no haya confirmación en esta sesión. */
  attendee: Attendee | null;
  confirm: (attendee: Attendee) => void;
  clear: () => void;
};

/** Clave de almacenamiento. Provisional: sustituir al montar la base de datos. */
const STORAGE_KEY = 'c500-attendee';

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
 * **Es almacenamiento local, no una base de datos.** Guarda en `localStorage`
 * —no en `sessionStorage`— porque confirmar asistencia es un compromiso que debe
 * sobrevivir al cierre de la pestaña, al contrario que el loader. Cuando exista
 * el backend, este proveedor pasa a recibir el dato del servidor y lo único que
 * cambia es de dónde sale el estado inicial.
 */
export function AttendanceProvider({ children }: { children: React.ReactNode }) {
  const [attendee, setAttendee] = useState<Attendee | null>(null);

  // Se lee después de montar y no en el estado inicial: en el servidor no hay
  // `localStorage`, y devolver algo distinto en cliente rompería la hidratación.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setAttendee(JSON.parse(stored) as Attendee);
    } catch {
      // Almacenamiento bloqueado o dato corrupto: se sigue sin confirmación.
    }
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
