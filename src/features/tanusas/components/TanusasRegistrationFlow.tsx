'use client';

import { useCallback, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PhotoScreen, uploadPhoto } from '@/features/registration';
import type { Dictionary, Locale } from '@/i18n';
import type { TanusasRegistrationRecord } from '../lib/lookup-registration';
import { EMPTY_DETAILS, TanusasDetailsScreen, type DetailsDraft } from './TanusasDetailsScreen';
import { TanusasDietScreen, type DietDraft } from './TanusasDietScreen';
import { TanusasDoneScreen } from './TanusasDoneScreen';

type Props = {
  /** Lo dio el hero: aquí ya no se vuelve a pedir. */
  email: string;
  /**
   * Lo que ya había guardado con ese correo, si había algo. Con esto el flujo
   * abre en el acuse en vez de en el primer paso: quien ya se registró no tiene
   * que repetir el proceso, solo verlo —y corregirlo si quiere, con los campos
   * ya rellenos—.
   */
  existing: TanusasRegistrationRecord | null;
  /** Decide en qué idioma sale el correo de confirmación. */
  locale: Locale;
  copy: Dictionary['tanusas']['registration'];
  /** La pantalla de la fotografía es la del registro del sitio, con su copia. */
  photoCopy: Dictionary['registration']['photo'];
};

/** Los tres pasos, en orden, y el acuse al final. */
type Stage = 'details' | 'diet' | 'photo' | 'done';

/**
 * Registro del retiro, en tres pasos.
 *
 * Sigue el patrón del registro del sitio: cada pantalla no sabe de las demás
 * —avisa por callback y aquí se decide qué se muestra— y **nada sale hacia el
 * servidor hasta el final**, así que quien cierra la pestaña a mitad no deja una
 * fila incompleta.
 *
 * Empieza en los datos porque el correo lo dio el hero, igual que en
 * `/registro` lo da su primera pantalla. El envío hace `upsert`, así que
 * reenviar corrige en vez de duplicar.
 *
 * No hay paso de invitado: el aforo es de doce a quince personas y cada lugar se
 * asigna por nombre.
 */
export function TanusasRegistrationFlow({ email, existing, locale, copy, photoCopy }: Props) {
  const [stage, setStage] = useState<Stage>(existing ? 'done' : 'details');
  const [details, setDetails] = useState<DetailsDraft>(
    existing
      ? {
          name: existing.name,
          surname: existing.surname,
          organization: existing.organization,
          role: existing.role,
          city: existing.city,
          question: existing.question,
        }
      : EMPTY_DETAILS,
  );
  /** La del registro guardado: la credencial la necesita para el retrato. */
  const [photoUrl, setPhotoUrl] = useState<string | null>(existing?.photoUrl ?? null);
  const [diet, setDiet] = useState<DietDraft>(
    existing ? { diet: existing.diet, dietNotes: existing.dietNotes } : { diet: [], dietNotes: '' },
  );

  const handleDetails = useCallback((value: DetailsDraft) => {
    setDetails(value);
    setStage('diet');
  }, []);

  const handleDiet = useCallback((value: DietDraft) => {
    setDiet(value);
    setStage('photo');
  }, []);

  /**
   * Envío final: sube el retrato y manda el registro entero.
   *
   * La subida va aquí y no al elegir el archivo, igual que en el registro del
   * sitio: quien cambia de imagen tres veces no deja tres archivos huérfanos en
   * el bucket. Y va antes del envío porque la fila guarda la URL, no el archivo.
   *
   * Si algo falla se propaga: `PhotoScreen` lo cuenta y deja reintentar, y lo
   * escrito sigue en memoria para no teclearlo otra vez.
   */
  const handleConfirm = useCallback(
    async (photo: Blob | null) => {
      /**
       * Quien está corrigiendo un registro que ya existe y no toca la imagen
       * conserva la que subió: la fila guarda una URL, y volver a exigir el
       * archivo solo para cambiar una ciudad sería pedir dos veces lo mismo.
       */
      const photoUrl = photo ? await uploadPhoto(photo) : existing?.photoUrl;
      if (!photoUrl) throw new Error(photoCopy.required);

      const response = await fetch('/api/tanusas/registro', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, locale, ...details, ...diet, photoUrl }),
      });

      if (!response.ok) throw new Error(copy.failed);
      setPhotoUrl(photoUrl);
      setStage('done');
    },
    [copy.failed, details, diet, email, existing?.photoUrl, locale, photoCopy.required],
  );


  return (
    <AnimatePresence mode="wait" initial={false}>
      {stage === 'details' && (
        <TanusasDetailsScreen
          key="details"
          copy={copy.details}
          initial={details}
          onContinue={handleDetails}
        />
      )}

      {stage === 'diet' && (
        <TanusasDietScreen
          key="diet"
          copy={copy.diet}
          initial={diet}
          onContinue={handleDiet}
          onBack={() => setStage('details')}
        />
      )}

      {stage === 'photo' && (
        <PhotoScreen
          key="photo"
          copy={photoCopy}
          onConfirm={handleConfirm}
          onBack={() => setStage('diet')}
        />
      )}

      {stage === 'done' && (
        <TanusasDoneScreen
          key="done"
          copy={copy}
          email={email}
          name={details.name}
          surname={details.surname}
          organization={details.organization}
          photoUrl={photoUrl}
          diet={diet.diet}
          /* Volver al primer paso: el envío hace `upsert`, así que corregir
             no duplica. */
          onEdit={() => setStage('details')}
        />
      )}
    </AnimatePresence>
  );
}
