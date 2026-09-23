'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StairsReveal } from '@/features/transitions/stairs-reveal';
import type { Dictionary, Locale } from '@/i18n';
import type { EventChoice } from '../lib/attendee-input';
import {
  readJoinDraft,
  saveJoinDraft,
  type GuestDraft,
  type JoinDraft,
  type PersonDraft,
} from '../lib/join-draft';
import { useAttendance } from '../context/attendance';
import { clearJoinDraft } from '../lib/join-draft';
import { lookupAttendee } from '../lib/lookup-attendee';
import { lookupInvitation } from '../lib/lookup-invitation';
import { DetailsScreen } from './DetailsScreen';
import { EventChoiceScreen } from './EventChoiceScreen';
import { JoinScreen } from './JoinScreen';
import { WelcomeScreen } from './WelcomeScreen';
import styles from './RegistrationFlow.module.css';

type Props = {
  /** Idioma de la ruta: la bienvenida abrevia el mes con él. */
  locale: Locale;
  copy: Dictionary['registration'];
};

/**
 * Los pasos, en orden. `guest` solo se visita si se dijo que sí, y `welcome`
 * es el final —y también la vista de reposo de quien ya confirmó—.
 */
type Stage = 'join' | 'choice' | 'details' | 'guest' | 'welcome';

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
   *
   * Y solo si no hay transición en marcha: al encontrar el registro por correo,
   * la confirmación llega estando todavía en el primer paso, y sin esta guarda
   * el cambio de pantalla se adelantaba a la escalera —se veía el salto y la
   * cortina pasaba después, sobre la pantalla ya cambiada—.
   */
  useEffect(() => {
    if (attendee && stage === 'join' && !pending) setStage('welcome');
  }, [attendee, stage, pending]);

  /**
   * Y al revés: si el registro **deja de existir**, se vuelve al principio.
   *
   * El proveedor comprueba contra la base el perfil que guardó el navegador,
   * y puede vaciarlo un instante después de montar. Sin esto, el resumen se
   * quedaba sin nada que pintar —solo se dibuja con `attendee`— y la pantalla
   * se iba en blanco, sin manera de registrarse otra vez.
   */
  useEffect(() => {
    if (!attendee && stage === 'welcome') setStage('join');
  }, [attendee, stage]);

  /**
   * Quien llega por el enlace de una invitación **no pasa por la pantalla del
   * correo**: su correo ya lo sabemos, y volver a pedírselo sería preguntar por
   * el dato que le trajo hasta aquí.
   *
   * Se comprueba contra el servidor en vez de creerse la URL: el testigo puede
   * estar caducado —o ya usado— y en ese caso lo que toca es el registro normal,
   * no una pantalla en blanco. Si vale, se guarda su correo y su nombre en el
   * borrador y se entra directo a la elección de acto.
   */
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('invitacion');
    if (!token || attendee) return;

    let cancelled = false;
    (async () => {
      const invited = await lookupInvitation(token);
      if (cancelled || !invited) return;
      draft.current = saveJoinDraft({
        email: invited.email,
        // El nombre llega de quien invitó; el apellido lo pondrá él mismo.
        person: { name: invited.name, surname: '', organization: '', role: '', linkedin: '' },
        fromInvitation: true,
      });
      setStage('choice');
    })();

    return () => {
      cancelled = true;
    };
  }, [attendee]);

  /**
   * Del correo salen dos caminos.
   *
   * Si ese correo **ya tiene registro**, no hay nada que volver a pedir: se
   * adopta lo que devuelve el servidor y se va directo a su información. Si no
   * lo tiene, empieza el registro por la elección de acto.
   *
   * La consulta se espera aquí —la pantalla del correo mantiene su cargador
   * hasta que esta función termina— y no lanza nunca: sin respuesta se sigue
   * como si no existiera, y el envío final hace `upsert` por correo, así que
   * quien sí estaba registrado se corrige en vez de duplicarse.
   */
  const handleSaved = useCallback(
    async (email: string) => {
      draft.current = readJoinDraft();

      const found = await lookupAttendee(email);
      if (found) {
        // El borrador ya no hace falta: no hay registro que completar.
        clearJoinDraft();
        confirm(found);
        setPending('welcome');
        return;
      }

      setPending('choice');
    },
    [confirm],
  );

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

  /**
   * Manda el registro entero y salta a la bienvenida.
   *
   * Se llama `sendRegistration` y no `handleConfirm` porque ya no lo dispara una
   * pantalla concreta: lo llama el **último paso que haya**, que es la pasada del
   * acompañante o la de los datos según se venga o no acompañado.
   *
   * Lanza si algo falla: la pantalla que llamó lo recoge, lo cuenta y deja
   * reintentar, y el borrador sigue en el navegador para no teclear otra vez.
   */
  const sendRegistration = useCallback(
    async () => {
      const current = readJoinDraft();
      if (!current?.person) throw new Error('Faltan datos del registro.');

      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: current.email,
          ...current.person,
          events: current.events ?? [],
          bringsGuest: current.bringsGuest === true,
          guest: current.guest ?? null,
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

  /**
   * Con acompañante queda una segunda pasada por la misma pantalla —sus dos
   * datos—; sin él, aquí se acaba y se confirma.
   *
   * Antes faltaba siempre la fotografía, que era la que confirmaba. Al quitarla
   * el envío sube al último paso que haya, y por eso este manejador espera:
   * la pantalla mantiene su cargador hasta que el servidor conteste.
   */
  const handleDetails = useCallback(
    async (person: PersonDraft, bringsGuest: boolean) => {
      const current = readJoinDraft();
      if (current) draft.current = saveJoinDraft({ ...current, person, bringsGuest });
      if (bringsGuest) {
        setStage('guest');
        return;
      }
      await sendRegistration();
    },
    [sendRegistration],
  );

  const handleGuest = useCallback(
    async (guest: GuestDraft) => {
      const current = readJoinDraft();
      if (current) draft.current = saveJoinDraft({ ...current, guest });
      await sendRegistration();
    },
    [sendRegistration],
  );

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
  /**
   * Vuelve al formulario para corregir los datos de un registro ya guardado.
   *
   * El borrador se **reconstruye** desde el perfil: al confirmar se borra, así
   * que a estas alturas no queda nada en el navegador y sin esto el formulario
   * saldría vacío —y al enviarlo borraría lo que había—.
   *
   * Se entra por los datos y no por la elección de acto: lo que se viene a
   * arreglar aquí es un nombre, un rol o un acompañante. Los actos ya elegidos
   * viajan en el borrador, así que el envío final no los toca.
   */
  const handleEditDetails = useCallback(() => {
    if (!attendee) return;
    draft.current = saveJoinDraft({
      email: attendee.email,
      events: attendee.events,
      person: {
        name: attendee.name,
        surname: attendee.surname,
        organization: attendee.organization,
        role: attendee.role,
        linkedin: attendee.linkedin ?? "",
      },
      bringsGuest: attendee.bringsGuest === true,
      // Solo el nombre y el correo: es lo único que quien invita rellenó.
      guest: attendee.guests?.[0]
        ? { name: attendee.guests[0].name, email: attendee.guests[0].email }
        : undefined,
    });
    setStage("details");
  }, [attendee]);
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
            initialBringsGuest={draft.current?.bringsGuest ?? true}
            /* Quien llega invitado completa su lugar; no reparte otro. */
            canInvite={!draft.current?.fromInvitation}
            onContinue={handleDetails}
            /* Quien está corrigiendo vuelve a su resumen, no a la elección de
               acto: no entró por ahí. */
            onBack={() => setStage(attendee ? 'welcome' : 'choice')}
          />
        )}

        {stage === 'guest' && (
          <DetailsScreen
            key="guest"
            copy={copy.details}
            mode="guest"
            initialGuest={draft.current?.guest}
            /* Para no dejar poner el correo propio como el del acompañante. */
            ownEmail={draft.current?.email}
            onGuest={handleGuest}
            onBack={() => setStage('details')}
          />
        )}

        {/* Sin `attendee` no hay nada que enseñar: el estado llega con la
            respuesta del servidor, o del almacenamiento al montar. */}
        {stage === 'welcome' && attendee && (
          <WelcomeScreen
            key="welcome"
            locale={locale}
            copy={copy.welcome}
            attendee={attendee}
            onEditDetails={handleEditDetails}
          />
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
