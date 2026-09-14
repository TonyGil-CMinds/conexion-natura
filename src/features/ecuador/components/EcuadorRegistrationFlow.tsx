'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { JoinScreen, PhotoScreen, uploadPhoto } from '@/features/registration';
import type { Dictionary, Locale } from '@/i18n';
import { lookupEcuadorRegistration } from '../lib/lookup-registration';
import type { EcuadorRegistrationRecord } from '../lib/lookup-registration';
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
  /** La pantalla de la fotografía es la del registro del sitio, con su copia. */
  photoCopy: Dictionary['registration']['photo'];
};

/** Los pasos, en orden, y el acuse al final. */
type Stage = 'join' | 'details' | 'participation' | 'photo' | 'done';

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
export function EcuadorRegistrationFlow({ locale, copy, photoCopy }: Props) {
  const [stage, setStage] = useState<Stage>('join');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState<DetailsDraft>(EMPTY_DETAILS);
  const [participation, setParticipation] = useState<ParticipationDraft>(EMPTY_PARTICIPATION);
  /** La del registro guardado: la credencial la necesita para el retrato. */
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  /**
   * El registro que ya había con ese correo, si lo había. Se guarda entero
   * porque al corregir hay que poder reutilizar su fotografía: la fila guarda
   * una URL, y volver a exigir el archivo solo para cambiar una palabra sería
   * pedir dos veces lo mismo.
   */
  const [existing, setExisting] = useState<EcuadorRegistrationRecord | null>(null);

  /**
   * Llega con el correo ya validado por la primera pantalla. La consulta corre
   * dentro de su animación de guardado, así que no añade espera.
   */
  const start = useCallback(async (value: string) => {
    setEmail(value);
    const found = await lookupEcuadorRegistration(value);

    if (found) {
      setExisting(found);
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
      setPhotoUrl(found.photoUrl);
      setStage('done');
      return;
    }

    setStage('details');
  }, []);

  const handleDetails = useCallback((value: DetailsDraft) => {
    setDetails(value);
    setStage('participation');
  }, []);

  const handleParticipation = useCallback((value: ParticipationDraft) => {
    setParticipation(value);
    setStage('photo');
  }, []);

  /**
   * Envío final: sube el retrato y manda el registro entero.
   *
   * La subida va aquí y no al elegir el archivo, igual que en el resto del
   * sitio: quien cambia de imagen tres veces no deja tres archivos huérfanos en
   * el bucket. Y va antes del envío porque la fila guarda la URL, no el archivo.
   *
   * Si algo falla se propaga: `PhotoScreen` lo cuenta y deja reintentar, y lo
   * escrito sigue en memoria para no teclearlo otra vez.
   */
  const handleConfirm = useCallback(
    async (photo: Blob | null) => {
      const uploaded = photo ? await uploadPhoto(photo) : existing?.photoUrl;
      if (!uploaded) throw new Error(photoCopy.required);

      const response = await fetch('/api/registro/ecuador', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, locale, ...details, ...participation, photoUrl: uploaded }),
      });

      if (!response.ok) throw new Error(copy.registration.failed);
      setPhotoUrl(uploaded);
      setStage('done');
    },
    [copy.registration.failed, details, email, existing?.photoUrl, locale, participation, photoCopy.required],
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {stage === 'join' && <JoinScreen key="join" copy={copy.join} onSaved={start} />}

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

      {stage === 'photo' && (
        <PhotoScreen
          key="photo"
          copy={photoCopy}
          onConfirm={handleConfirm}
          onBack={() => setStage('participation')}
        />
      )}

      {stage === 'done' && (
        <EcuadorDoneScreen
          key="done"
          copy={copy.registration}
          email={email}
          fullName={details.fullName}
          organization={details.organization}
          participation={participation.participation}
          guestName={details.bringsGuest ? details.guestName : ''}
          photoUrl={photoUrl}
          /* Volver al primer paso: el envío hace `upsert`, así que corregir
             no duplica. */
          onEdit={() => setStage('details')}
        />
      )}
    </AnimatePresence>
  );
}
