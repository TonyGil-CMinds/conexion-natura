'use client';

import { CtaButton } from '@/components/ui/CtaButton';
import { useAttendance } from '../context/attendance';

type Props = {
  /** Rótulo mientras no hay confirmación. */
  label: string;
  href: string;
  size?: 'default' | 'compact';
};

/** Rótulo cuando ya se confirmó. Igual en el hero y en el pie. */
const CONFIRMED_LABEL = 'Asistencia confirmada';

/**
 * Botón de registro que sabe si el visitante ya confirmó.
 *
 * Existe para que `CtaButton` siga siendo presentacional: aquí se resuelve el
 * rótulo según el estado y allí solo se pinta. El destino no cambia — quien ya
 * confirmó vuelve a la misma pantalla, ahora para revisar o editar su perfil.
 */
export function RegistrationCta({ label, href, size }: Props) {
  const { attendee } = useAttendance();

  return (
    <CtaButton
      label={attendee ? CONFIRMED_LABEL : label}
      href={href}
      size={size}
    />
  );
}
