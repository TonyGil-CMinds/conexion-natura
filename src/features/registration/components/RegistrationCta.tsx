'use client';

import { CtaButton } from '@/components/ui/CtaButton';
import { useAttendance } from '../context/attendance';

type Props = {
  /** Rótulo mientras no hay confirmación. */
  label: string;
  /** Rótulo cuando ya se confirmó. Llega traducido desde el servidor. */
  confirmedLabel: string;
  href: string;
  size?: 'default' | 'compact' | 'mobile' | 'hero';
};

/**
 * Botón de registro que sabe si el visitante ya confirmó.
 *
 * Existe para que `CtaButton` siga siendo presentacional: aquí se resuelve el
 * rótulo según el estado y allí solo se pinta. El destino no cambia — quien ya
 * confirmó vuelve a la misma pantalla, ahora para revisar o editar su perfil.
 */
export function RegistrationCta({ label, confirmedLabel, href, size }: Props) {
  const { attendee } = useAttendance();

  return <CtaButton label={attendee ? confirmedLabel : label} href={href} size={size} />;
}
