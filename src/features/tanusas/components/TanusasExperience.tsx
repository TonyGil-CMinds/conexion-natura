'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Dictionary, Locale } from '@/i18n';
import {
  lookupTanusasRegistration,
  type TanusasRegistrationRecord,
} from '../lib/lookup-registration';
import { TanusasHeader } from './TanusasHeader';
import { TanusasRegistrationFlow } from './TanusasRegistrationFlow';
import styles from './Tanusas.module.css';

type JoinApi = {
  /**
   * Arranca el registro con el correo dado. Se espera: quien ya está registrado
   * no vuelve a rellenar nada, va directo a su información.
   */
  start: (email: string) => Promise<void>;
  /**
   * Pide al hero que despliegue su campo de correo y lo enfoque. Es lo que hace
   * «Confirmar» de la barra: no es un sitio al que ir, es la misma acción del
   * hero pedida desde otro punto de la página.
   */
  open: () => void;
  /** Cambia cada vez que alguien pide abrir: el hero lo observa. */
  openCount: number;
  /**
   * Si la invitación ha dado paso al registro. Lo necesita la barra: sin hero
   * debajo no hay fotografía sobre la que ir transparente, así que pasa a
   * opaca y sus enlaces dejan de marcar sección.
   */
  isRegistering: boolean;
  /**
   * Sale del registro y vuelve a la invitación, en la sección que se pida. Es lo
   * que hacen los enlaces de la barra mientras se está registrando: sus anclas
   * apuntan a secciones que en ese momento no están en el documento, así que
   * como enlaces no llevaban a ninguna parte.
   */
  exitTo: (sectionId: string) => void;
};

const JoinContext = createContext<JoinApi | null>(null);

/**
 * Acceso a la acción de registrarse desde cualquier punto de la página.
 *
 * Es contexto y no props porque quienes la disparan cuelgan de ramas distintas
 * —la barra y el hero— y la copia sigue bajando por props, que es la regla del
 * proyecto: aquí solo viaja estado.
 */
export function useTanusasJoin() {
  const api = useContext(JoinContext);
  if (!api) throw new Error('useTanusasJoin fuera de TanusasExperience');
  return api;
}

type Props = {
  locale: Locale;
  copy: Dictionary['tanusas'];
  header: Dictionary['header'];
  photoCopy: Dictionary['registration']['photo'];
  /** La invitación entera, ya pintada en el servidor. */
  children: React.ReactNode;
};

/**
 * Las dos caras de la micropágina: la invitación y el registro.
 *
 * La invitación llega como `children` —pintada en el servidor, que es lo que
 * importa cuando alguien abre esto desde el correo— y este componente solo
 * decide cuál de las dos se ve. Al entrar un correo, la invitación se retira y
 * entra el registro, como en `/registro`: es un cambio de pantalla completo, no
 * un formulario que aparece al final de la página.
 *
 * La barra se queda en las dos: se sigue estando en la misma página, y desde el
 * registro sus enlaces devuelven a la invitación.
 */
export function TanusasExperience({ locale, copy, header, photoCopy, children }: Props) {
  const [email, setEmail] = useState<string | null>(null);
  /** Lo que ya hubiera guardado con ese correo, si había algo. */
  const [existing, setExisting] = useState<TanusasRegistrationRecord | null>(null);
  const [openCount, setOpenCount] = useState(0);
  /** Sección a la que ir en cuanto la invitación vuelva al documento. */
  const pendingSection = useRef<string | null>(null);

  const start = useCallback(async (value: string) => {
    /**
     * La consulta se espera aquí —el campo del hero mantiene su cargador hasta
     * que esta función termina— y no lanza: sin respuesta se sigue como si no
     * hubiera registro, y el envío final hace `upsert`, así que uno que sí
     * existía se corrige en vez de duplicarse.
     */
    setExisting(await lookupTanusasRegistration(value));
    setEmail(value);
    // El registro empieza arriba: si se pidió desde media página, se sube.
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const open = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setOpenCount((count) => count + 1);
  }, []);

  const exitTo = useCallback((sectionId: string) => {
    pendingSection.current = sectionId;
    setEmail(null);
    setExisting(null);
  }, []);

  /**
   * El salto a la sección va **después** de volver a pintar la invitación: al
   * pulsar, la sección todavía no está en el documento y no habría a qué ir.
   */
  useEffect(() => {
    if (email || !pendingSection.current) return;
    const target = document.getElementById(pendingSection.current);
    pendingSection.current = null;
    target?.scrollIntoView();
  }, [email]);

  const api = useMemo<JoinApi>(
    () => ({ start, open, openCount, isRegistering: email !== null, exitTo }),
    [start, open, openCount, email, exitTo],
  );

  return (
    <JoinContext.Provider value={api}>
      {/* El armazón de la página vive aquí: la barra y lo que haya debajo son
          las dos partes de la misma pantalla. */}
      <div className={styles.root}>
        <TanusasHeader locale={locale} copy={copy.nav} header={header} />

        {/* Sin `AnimatePresence`: la invitación es un árbol del servidor sin
            clave, así que no hay salida que animar. Quien anima es el registro,
            que entra con la cascada de sus propias pantallas. */}
        {email ? (
          <TanusasRegistrationFlow
            email={email}
            existing={existing}
            locale={locale}
            copy={copy.registration}
            photoCopy={photoCopy}
          />
        ) : (
          children
        )}
      </div>
    </JoinContext.Provider>
  );
}
