'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { JoinScreen } from '@/features/registration';
import type { Dictionary, Locale } from '@/i18n';
import { lookupEcuadorRegistration } from '../lib/lookup-registration';
import { EcuadorDetailsScreen, EMPTY_DETAILS, type DetailsDraft } from './EcuadorDetailsScreen';
import {
  EcuadorParticipationScreen,
  type ParticipationDraft,
} from './EcuadorParticipationScreen';
import { EcuadorDoneScreen } from './EcuadorDoneScreen';

type Props = {
  /** Decide en qué idioma sale el correo de confirmación. */
  locale: Locale;
  copy: Dictionary['ecuador'];
};

/** Los pasos, en orden, y el acuse al final. */
type Stage = 'join' | 'details' | 'participation' | 'done';

const EMPTY_PARTICIPATION: ParticipationDraft = { participation: null, tablePitch: '' };

/**
 * Registro de empresas e iniciativas de Ecuador a la Natura500 Night.
 *
 * Sigue el patrón del retiro: cada pantalla no sabe de las demás —avisa por
 * callback y aquí se decide qué se muestra— y **nada sale hacia el servidor
 * hasta el final**, así que quien cierra la pestaña a mitad no deja una fila
 * incompleta.
 *
 * Empieza pidiendo el correo, como `/registro`, y con esa respuesta decide:
 * quien ya se registró entra directo al acuse en vez de repetir el proceso. El
 * envío hace `upsert`, así que corregir no duplica.
 *
 * No hay paso de elección de acto: el acto es uno, la noche. Lo que se pregunta
 * en su lugar es **cómo** se quiere estar en ella.
 */
export function EcuadorRegistrationFlow({ locale, copy }: Props) {
  const [stage, setStage] = useState<Stage>('join');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState<DetailsDraft>(EMPTY_DETAILS);
  const [participation, setParticipation] = useState<ParticipationDraft>(EMPTY_PARTICIPATION);
  /**
   * Llega con el correo ya validado por la primera pantalla. La consulta corre
   * dentro de su animación de guardado, así que no añade espera.
   */
  const start = useCallback(async (value: string) => {
    setEmail(value);
    const found = await lookupEcuadorRegistration(value);

    if (found) {
      setDetails({
        fullName: found.fullName,
        organization: found.organization,
        bringsGuest: Boolean(found.guestName),
        guestName: found.guestName,
        guestEmail: found.guestEmail,
      });
      setParticipation({
        participation: found.participation,
        tablePitch: found.tablePitch,
      });
      setStage('done');
      return;
    }

    setStage('details');
  }, []);

  const handleDetails = useCallback((value: DetailsDraft) => {
    setDetails(value);
    setStage('participation');
  }, []);

  /**
   * Envío final: manda el registro entero y salta al acuse.
   *
   * Lo dispara la pantalla de participación, que desde que no se pide
   * fotografía es el último paso. Lanza si algo falla: esa pantalla lo recoge,
   * lo cuenta y deja reintentar, con lo escrito todavía en memoria.
   */
  const handleParticipation = useCallback(
    async (value: ParticipationDraft) => {
      setParticipation(value);

      const response = await fetch('/api/registro/ecuador', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, locale, ...details, ...value }),
      });

      if (!response.ok) throw new Error(copy.registration.failed);
      setStage('done');
    },
    [copy.registration.failed, details, email, locale],
  );
  return (
    <AnimatePresence mode="wait" initial={false}>
      {stage === 'join' && (
        <JoinScreen
          key="join"
          copy={copy.join}
          /* Sin borrador: este registro vive en el estado de React, y el del
             navegador es del registro del sitio —escribir aquí lo borraría—. */
          savesDraft={false}
          onSaved={start}
        />
      )}

      {stage === 'details' && (
        <EcuadorDetailsScreen
          key="details"
          copy={copy.registration.details}
          initial={details}
          onContinue={handleDetails}
        />
      )}

      {stage === 'participation' && (
        <EcuadorParticipationScreen
          key="participation"
          copy={copy.registration.participation}
          initial={participation}
          onContinue={handleParticipation}
          onBack={() => setStage('details')}
        />
      )}

      {stage === 'done' && (
        <EcuadorDoneScreen
          key="done"
          copy={copy.registration}
          email={email}
          fullName={details.fullName}
          participation={participation.participation}
          guestName={details.bringsGuest ? details.guestName : ''}
          /* Volver al primer paso: el envío hace `upsert`, así que corregir
             no duplica. */
          onEdit={() => setStage('details')}
        />
      )}
    </AnimatePresence>
  );
}
