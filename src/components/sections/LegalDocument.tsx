import { LEGAL } from '@/config/legal';
import type { Dictionary, Locale } from '@/i18n';
import styles from './LegalDocument.module.css';

type Props = {
  locale: Locale;
  copy: Dictionary['legal']['privacy'];
  /** Rótulos comunes a los dos documentos. */
  common: Dictionary['legal']['common'];
};

/**
 * Un documento legal: título, fecha de revisión y apartados numerados.
 *
 * Los dos —aviso de privacidad y términos— comparten componente porque
 * comparten forma; lo único que cambia es el texto, que viene del diccionario.
 * Así el día que haya un tercero no hay nada que copiar.
 *
 * El texto va en párrafos y listas de datos, no en un bloque suelto: un
 * documento legal se lee a saltos, buscando el apartado que hace falta, y los
 * encabezados son lo que permite ese salto —también con lector de pantalla—.
 *
 * Los huecos sin rellenar (`LEGAL.controller`, el correo) salen marcados en vez
 * de omitidos: un apartado que desaparece en silencio no se echa de menos.
 */
export function LegalDocument({ locale, copy, common }: Props) {
  const updated = new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${LEGAL.updatedAt}T00:00:00Z`));

  return (
    <article className={styles.root}>
      <header className={styles.header}>
        <h1 className={styles.title}>{copy.title}</h1>
        <p className={styles.updated}>
          {common.updated} {updated}
        </p>
        <p className={styles.intro}>{copy.intro}</p>
      </header>

      <ol className={styles.sections}>
        {copy.sections.map((section, index) => (
          <li key={section.id} className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.number} aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
              {section.title}
            </h2>

            {section.body.map((paragraph) => (
              <p key={paragraph} className={styles.paragraph}>
                {paragraph}
              </p>
            ))}

            {section.list && (
              <ul className={styles.list}>
                {section.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      <footer className={styles.contact}>
        <h2 className={styles.sectionTitle}>{common.contactTitle}</h2>
        <p className={styles.paragraph}>{copy.contact}</p>
        <dl className={styles.data}>
          <div>
            <dt>{common.controllerLabel}</dt>
            <dd>{LEGAL.controller || <em className={styles.pending}>{common.pending}</em>}</dd>
          </div>
          <div>
            <dt>{common.emailLabel}</dt>
            <dd>
              {LEGAL.contactEmail ? (
                <a href={`mailto:${LEGAL.contactEmail}`}>{LEGAL.contactEmail}</a>
              ) : (
                <em className={styles.pending}>{common.pending}</em>
              )}
            </dd>
          </div>
          {/* La ley aplicable sale como dato y no dentro de una frase: así el
              apartado se lee igual esté puesta o pendiente. */}
          <div>
            <dt>{common.jurisdictionLabel}</dt>
            <dd>{LEGAL.jurisdiction || <em className={styles.pending}>{common.pending}</em>}</dd>
          </div>
        </dl>
      </footer>
    </article>
  );
}
