'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { QUITO } from '@/config/quito';
import { useAttendance } from '@/features/registration';
import { lookupAttendee } from '@/features/registration/lib/lookup-attendee';
import type { Dictionary, Locale } from '@/i18n';
import { quitoRegistrationCopy } from '../lib/registration-copy';
import { QuitoRegistration } from './QuitoRegistration';

type JoinApi = {
  /**
   * Arranca el registro con el correo dado. Se espera: quien ya está registrado
   * no vuelve a rellenar nada, va directo a su resumen.
   */
  start: (email: string) => Promise<void>;
  /**
   * Pide a la llamada del hero que despliegue su campo y lo enfoque. Es lo que
   * hace «Regístrate» de la barra: no es un sitio al que ir, es la misma acción
   * del hero pedida desde otro punto de la página.
   */
  open: () => void;
  /** Cambia cada vez que alguien pide abrir: la llamada del hero lo observa. */
  openCount: number;
  /** Si la página ha dado paso al registro. Lo necesita la barra. */
  isRegistering: boolean;
};

const JoinContext = createContext<JoinApi | null>(null);

/**
 * Acceso a la acción de registrarse desde cualquier punto de la sección.
 *
 * Es contexto y no props porque quienes la disparan cuelgan de ramas distintas
 * —la barra, el hero y el cierre del pie— y por props habría que atravesar toda
 * la página. La copia sigue bajando por props, que es la regla del proyecto:
 * aquí solo viaja estado.
 *
 * Devuelve `null` fuera de la portada: las rutas de dentro (`/quito/agenda`,
 * `/quito/speakers`) llevan la misma barra pero no tienen registro debajo, y
 * allí «Regístrate» vuelve a ser un enlace.
 */
export function useQuitoJoin(): JoinApi | null {
  return useContext(JoinContext);
}

type Props = {
  locale: Locale;
  copy: Dictionary['quito'];
  registration: Dictionary['registration'];
  /**
   * La barra. Entra como nodo y **por dentro del proveedor**: su «Regístrate»
   * no navega, abre el campo del hero, y para eso tiene que poder leer esto.
   * Se queda en las dos caras: se sigue estando en la misma página.
   */
  header: React.ReactNode;
  /** La portada entera con su pie, ya pintada en el servidor. */
  children: React.ReactNode;
};

/**
 * Las dos caras de la portada de Quito: la página y el registro.
 *
 * La página llega como `children` —pintada en el servidor— y esto solo decide
 * cuál de las dos se ve. Al entrar un correo, la página se retira y entra el
 * registro, como en el retiro: **no hay pantalla que pida el correo**, porque el
 * correo ya lo dio el botón que se convirtió en campo.
 *
 * La consulta de si ese correo ya tiene registro se hace **aquí y antes** de
 * montar el formulario: así el flujo no parpadea por una pantalla intermedia
 * que iba a saltarse igual.
 */
export function QuitoExperience({ locale, copy, registration, header, children }: Props) {
  const { confirm } = useAttendance();
  const [email, setEmail] = useState<string | null>(null);
  const [openCount, setOpenCount] = useState(0);

  const start = useCallback(
    async (value: string) => {
      /**
       * No lanza: sin respuesta se sigue como si no hubiera registro, y el envío
       * final hace `upsert` por correo, así que quien sí existía se corrige en
       * vez de duplicarse.
       */
      const found = await lookupAttendee(value);
      if (found) confirm(found);
      setEmail(value);
      // El registro empieza arriba: si se pidió desde media página, se sube.
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    [confirm],
  );

  const open = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpenCount((count) => count + 1);
  }, []);

  /**
   * Quien llega con la marca en la URL —desde «Regístrate» de una ruta de
   * dentro, o desde el enlace viejo de `/quito/registro`— encuentra el campo ya
   * desplegado: aterriza en la acción y no en un botón que volver a pulsar.
   *
   * Se lee de `window` y no con `useSearchParams` para no obligar a esta rama a
   * renderizarse bajo demanda: la portada es estática, y leer la URL desde un
   * efecto la deja estática.
   */
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has(QUITO.joinParam)) return;
    setOpenCount((count) => count + 1);
  }, []);

  const api = useMemo<JoinApi>(
    () => ({ start, open, openCount, isRegistering: email !== null }),
    [start, open, openCount, email],
  );

  return (
    <JoinContext.Provider value={api}>
      {header}

      {email ? (
        <QuitoRegistration
          locale={locale}
          email={email}
          copy={quitoRegistrationCopy(registration, copy.registration)}
        />
      ) : (
        children
      )}
    </JoinContext.Provider>
  );
}
