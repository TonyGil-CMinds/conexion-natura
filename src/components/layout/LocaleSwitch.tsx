'use client';

import { useState } from 'react';
import { LOCALES, type LocaleCode } from '@/config/site';
import styles from './LocaleSwitch.module.css';

/**
 * Selector de idioma.
 *
 * Solo mantiene el estado visual: todavía no hay traducciones ni enrutado por
 * idioma, así que cambiarlo no altera el contenido.
 */
export function LocaleSwitch() {
  const [active, setActive] = useState<LocaleCode>('es');

  return (
    <div className={styles.root}>
      {LOCALES.map((locale, index) => (
        <span key={locale.code} className={styles.item}>
          {index > 0 && <span className={styles.divider} aria-hidden />}
          <button
            type="button"
            className={styles.button}
            data-active={locale.code === active || undefined}
            aria-current={locale.code === active ? 'true' : undefined}
            onClick={() => setActive(locale.code)}
          >
            {locale.label}
          </button>
        </span>
      ))}
    </div>
  );
}
