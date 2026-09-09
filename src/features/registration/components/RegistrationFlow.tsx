'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StairsReveal } from '@/features/transitions/stairs-reveal';
import type { Dictionary, Locale } from '@/i18n';
import type { EventChoice } from '../lib/attendee-input';
import { readJoinDraft, saveJoinDraft, type JoinDraft, type PersonDraft } from '../lib/join-draft';
import { useAttendance } from '../context/attendance';
import { clearJoinDraft } from '../lib/join-draft';
import { uploadPhoto } from '../lib/upload-photo';
import { DetailsScreen } from './DetailsScreen';
import { EventChoiceScreen } from './EventChoiceScreen';
import { JoinScreen } from './JoinScreen';
import { PhotoScreen } from './PhotoScreen';
import { WelcomeScreen } from './WelcomeScreen';
import styles from './RegistrationFlow.module.css';

type Props = {
  /** Idioma de la ruta: la bienvenida abrevia el mes con él. */
  locale: Locale;
  copy: Dictionary['registration'];
};

/**
 * Los pasos, en orden. `companion` solo se visita si se dijo que sí, y `welcome`
 * es el final —y también la vista de reposo de quien ya confirmó—.
 */
type Stage = 'join' | 'choice' | 'details' | 'companion' | 'photo' | 'welcome';

/**
 * Orquesta los pasos del registro.
 *
 * Cada pantalla es un componente que no sabe de las demás: avisa por callback y
 * aquí se decide qué se muestra. Es la misma regla que las transiciones —quien
 * transiciona no elige el contenido—, aplicada al flujo.
 *
 * Los cambios de pantalla van **detrás de la escalera**: `onCovered` es el
 * instante en que no queda hueco, así que el salto no se ve.
 *
 * El borrador del navegador es lo único que persiste entre pasos. Nada sale
 * hacia el servidor hasta que el registro esté completo: quien cierra la pestaña
 * a mitad no deja una fila a medias.
 */
export function RegistrationFlow({ locale, copy }: Props) {
  const { attendee, confirm } = useAttendance();
  const [stage, setStage] = useState<Stage>('join');
  /** Pantalla a la que se va mientras la escalera está en marcha. */
  const [pending, setPending] = useState<Stage | null>(null);
  /**
   * Lo que se ha ido guardando, para poder rellenar una pantalla a la que se
   * vuelve. Va en una referencia y no en estado: nada de lo que se pinta depende
   * de esto, así que guardarlo en estado solo provocaría renders de más.
   */
  const draft = useRef<JoinDraft | null>(null);

  /**
   * Quien ya confirmó no vuelve a rellenar nada: entra directo a la bienvenida,
   * que es la vista de reposo de la pantalla.
   *
   * El salto va en un efecto y no en el estado inicial porque la confirmación se
   * lee de `localStorage` después de montar —en el servidor no existe—, y solo
   * ocurre desde el primer paso: al confirmar aquí mismo, el estado cambia
   * cuando ya se está en la fotografía, y ahí manda la transición.
   */
  useEffect(() => {
    if (attendee && stage === 'join') setStage('welcome');
  }, [attendee, stage]);

  const handleSaved = useCallback(() => {
    draft.current = readJoinDraft();
    setPending('choice');
  }, []);

  /**
   * De aquí en adelante los pasos cambian **sin escalera**.
   *
   * La transición se reserva para el salto del correo al primer paso, que es
   * donde cambia la pantalla entera; entre pasos, la retícula es la misma —mismo
   * titular a la izquierda, mismo panel a la derecha— y taparla con una cortina
   * escondía justo el cambio que hay que ver.
   */
  const handleEvents = useCallback((events: EventChoice[]) => {
    const current = readJoinDraft();
    if (current) draft.current = saveJoinDraft({ ...current, events });
    setStage('details');
  }, []);

  const handleDetails = useCallback((person: PersonDraft, bringsCompanion: boolean) => {
    const current = readJoinDraft();
    if (current) draft.current = saveJoinDraft({ ...current, person, bringsCompanion });
    // Con acompañante hay una segunda pasada por la misma pantalla; sin él, la
    // fotografía es lo único que falta.
    setStage(bringsCompanion ? 'companion' : 'photo');
  }, []);

  const handleCompanion = useCallback((companion: PersonDraft) => {
    const current = readJoinDraft();
    if (current) draft.current = saveJoinDraft({ ...current, companion });
    setStage('photo');
  }, []);

  /**
   * Confirmación final: sube la fotografía, si hay, y manda el registro entero.
   *
   * La subida va **aquí y no al elegir el archivo**: quien cambia de imagen tres
   * veces no deja tres archivos huérfanos en el bucket. Y va antes del envío
   * porque lo que la fila guarda es la URL, no el archivo.
   *
   * Si algo falla, se propaga: la pantalla lo cuenta y deja reintentar, y el
   * borrador sigue en el navegador para que no haya que teclear otra vez.
   */
  const handleConfirm = useCallback(
    async (photo: Blob | null) => {
      const current = readJoinDraft();
      if (!current?.person) throw new Error('Faltan datos del registro.');

      const photoUrl = photo ? await uploadPhoto(photo) : null;

      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: current.email,
          ...current.person,
          photoUrl,
          events: current.events ?? [],
          bringsCompanion: current.bringsCompanion === true,
          companion: current.companion ?? null,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as {
        attendee?: Parameters<typeof confirm>[0];
      };
      if (!response.ok || !payload.attendee) throw new Error('No se pudo guardar el registro.');

      // La respuesta del servidor es la fuente de verdad, igual que antes.
      confirm(payload.attendee);
      clearJoinDraft();
      /**
       * Aquí sí vuelve la escalera: no es un paso más del formulario sino un
       * cambio de pantalla completo —se va la retícula de dos columnas con el
       * panel y llega el ave—, que es el mismo caso del salto del correo.
       */
      setPending('welcome');
    },
    [confirm],
  );

  return (
    <div className={styles.root}>
      {/**
       * `mode="wait"` es lo que hace que la salida se vea: el paso que se va
       * termina su animación antes de que entre el siguiente. Sin esto, el
       * cambio de pantalla cortaba en seco —los campos desaparecían de golpe y
       * la medalla no volvía a girar—.
       *
       * La clave es el paso, así que volver atrás también anima.
       */}
      <AnimatePresence mode="wait">
        {stage === 'join' && (
          <JoinScreen key="join" copy={copy.join} onSaved={handleSaved} />
        )}

        {stage === 'choice' && (
          <EventChoiceScreen
            key="choice"
            copy={copy.choice}
            initial={draft.current?.events}
            onContinue={handleEvents}
          />
        )}

        {stage === 'details' && (
          <DetailsScreen
            key="details"
            copy={copy.details}
            initial={draft.current?.person}
            initialCompanion={draft.current?.bringsCompanion ?? true}
            onContinue={handleDetails}
            onBack={() => setStage('choice')}
          />
        )}

        {stage === 'companion' && (
          <DetailsScreen
            key="companion"
            copy={copy.details}
            mode="companion"
            initial={draft.current?.companion}
            onContinue={handleCompanion}
            onBack={() => setStage('details')}
          />
        )}

        {stage === 'photo' && (
          <PhotoScreen
            key="photo"
            copy={copy.photo}
            onConfirm={handleConfirm}
            onBack={() =>
              setStage(draft.current?.bringsCompanion ? 'companion' : 'details')
            }
          />
        )}

        {/* Sin `attendee` no hay nada que enseñar: el estado llega con la
            respuesta del servidor, o del almacenamiento al montar. */}
        {stage === 'welcome' && attendee && (
          <WelcomeScreen key="welcome" locale={locale} copy={copy.welcome} attendee={attendee} />
        )}
      </AnimatePresence>

      {pending && (
        <StairsReveal
          /**
           * Una instancia por transición: con la misma, un `pending` nuevo solo
           * cambia props y el efecto que anima —que depende de `isActive`, que no
           * cambia— no vuelve a correr, así que la segunda transición no ocurría.
           */
          key={pending}
          isActive
          onCovered={() => setStage(pending)}
          onComplete={() => setPending(null)}
        />
      )}
    </div>
  );
}
