'use client';

import { CtaButton } from '@/components/ui/CtaButton';
import { useAttendance } from '../context/attendance';

type Props = {
  /** Rótulo mientras no hay confirmación. */
  label: string;
  /** Rótulo cuando ya se confirmó. Llega traducido desde el servidor. */
  confirmedLabel: string;
  /**
   * Rótulo de quien está en lista de espera.
   *
   * Hace falta desde que el aforo va por invitación: decirle «asistencia
   * confirmada» a quien todavía no tiene lugar sería mentirle cada vez que entra
   * en el sitio.
   */
  waitlistLabel: string;
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
export function RegistrationCta({ label, confirmedLabel, waitlistLabel, href, size }: Props) {
  const { attendee } = useAttendance();

  const rotulo = !attendee
    ? label
    : attendee.status === 'WAITLIST'
      ? waitlistLabel
      : confirmedLabel;

  return <CtaButton label={rotulo} href={href} size={size} />;
}
