'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, LOCALE_LABELS, type Locale } from '@/i18n';
import styles from './LocaleSwitch.module.css';

type Props = {
  locale: Locale;
  /** Rótulo accesible del grupo: los botones solo dicen «ES» y «EN». */
  label: string;
  /**
   * Nombres largos —«Español», «Inglés»— para el selector del menú móvil. Sin
   * ellos se pintan las siglas, que es lo que cabe en la cabecera.
   */
  names?: Record<Locale, string>;
  /** Cambia el aspecto sin duplicar el componente. */
  variant?: 'header' | 'menu';
};

/**
 * Selector de idioma.
 *
 * Son **enlaces**, no botones: el idioma vive en la URL, así que cambiarlo es
 * navegar. Con un botón, la versión en inglés no tendría dirección propia y no se
 * podría compartir ni indexar.
 *
 * Conserva la ruta actual y solo cambia el prefijo, de modo que quien está en
 * `/es/faq` aterriza en `/en/faq` y no en la portada.
 */
export function LocaleSwitch({ locale, label, names, variant = 'header' }: Props) {
  const pathname = usePathname();
  // `/es/faq` → `/faq`; la portada (`/es`) se queda en `/`.
  const rest = pathname.replace(new RegExp(`^/(${LOCALES.join('|')})`), '') || '/';

  return (
    <div className={styles.root} data-variant={variant} role="group" aria-label={label}>
      {LOCALES.map((code, index) => (
        <span key={code} className={styles.item}>
          {index > 0 && <span className={styles.divider} aria-hidden />}
          <Link
            className={styles.button}
            href={`/${code}${rest === '/' ? '' : rest}`}
            hrefLang={code}
            data-active={code === locale || undefined}
            aria-current={code === locale ? 'true' : undefined}
          >
            {names?.[code] ?? LOCALE_LABELS[code]}
          </Link>
        </span>
      ))}
    </div>
  );
}
