'use client';

import { RegistrationFlow } from '@/features/registration';
import type { Dictionary, Locale } from '@/i18n';
import styles from './QuitoRegistration.module.css';

type Props = {
  locale: Locale;
  /** El correo que ya se escribió en el botón del hero. */
  email: string;
  copy: Dictionary['registration'];
};

/**
 * El registro de la sección, montado sobre el flujo del sitio.
 *
 * Tres cosas lo distinguen de `/registro`, y las tres entran por props para no
 * duplicar el formulario: **no pide el correo** —ya lo dio el botón—, **no hace
 * elegir acto** y **el correo de confirmación apunta a esta sección**.
 *
 * Lo demás es exactamente el mismo registro: la misma tabla, el mismo portero
 * contra la lista de preregistro y el mismo aviso de lista de espera.
 */
export function QuitoRegistration({ locale, email, copy }: Props) {
  return (
    <div className={styles.root}>
      <RegistrationFlow
        locale={locale}
        copy={copy}
        initialEmail={email}
        fixedEvents={['NIGHT']}
        origin="quito"
      />
    </div>
  );
}
