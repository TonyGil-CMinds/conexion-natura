'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { AGENDA_FEATURE, type AgendaItem } from '@/config/agenda';
import styles from './Schedule.module.css';

type Props = {
  items: readonly AgendaItem[];
  /** Párrafo de entrada del programa. */
  intro?: string;
  hostLabel: string;
  peopleLabel: string;
  /** Fecha abreviada del distintivo, ya traducida. */
  dateLabel: string;
  /** La fila que abre el programa: el Premio, antes de la noche y en otra sede. */
  feature: { name: string; time: string; venue: string };
  searchLabel: string;
  searchPlaceholder: string;
  searchEmpty: string;
};

/**
 * Compara sin acentos ni mayúsculas: quien busca «apertura» escribe
 * «apertura», y quien busca «Gómez» puede escribir «gomez».
 */
function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '');
}

/** Todo el texto de un momento en una sola cadena, para buscar dentro. */
function haystack(item: AgendaItem) {
  /**
   * Los créditos entran en la búsqueda **si están**. Cuando los ponentes aún no
   * se revelan no llegan hasta aquí: la página los quita antes de pasar la
   * lista, así que ni se pintan ni se pueden encontrar.
   */
  const credits = [
    item.host?.name,
    item.host?.role,
    ...(item.people ?? []).flatMap((person) => [person.name, person.role, person.organization]),
  ];
  return normalize([item.time, item.title, item.description, ...credits].filter(Boolean).join(' '));
}

/**
 * Programa del evento: una fila por momento, con su franja horaria.
 *
 * No es un acordeón como el FAQ ni la lista de ponentes: aquí todo el contenido
 * es corto y se lee de un tirón, así que esconderlo detrás de un clic solo
 * añadiría trabajo. El filete separa una fila de la siguiente.
 *
 * La hora va en su propia columna a la izquierda para que el ojo pueda recorrer
 * las franjas sin leer los títulos.
 *
 * Es de cliente por el buscador, y solo por eso: el filtrado ocurre sobre la
 * lista que ya vino pintada del servidor, así que la agenda entera está en el
 * HTML y se lee sin JavaScript.
 */
export function Schedule({
  items,
  intro,
  hostLabel,
  peopleLabel,
  dateLabel,
  feature,
  searchLabel,
  searchPlaceholder,
  searchEmpty,
}: Props) {
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return items;
    // Cada palabra por separado: «apertura ceiba» encuentra el momento aunque
    // las dos palabras no vayan seguidas en el texto.
    const words = needle.split(/\s+/);
    return items.filter((item) => {
      const text = haystack(item);
      return words.every((word) => text.includes(word));
    });
  }, [items, query]);

  /** La fila destacada se busca igual que las demás: por su texto. */
  const showsFeature = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return true;
    const text = normalize([feature.name, feature.time, feature.venue].join(' '));
    return needle.split(/\s+/).every((word) => text.includes(word));
  }, [feature, query]);

  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        {intro && <p className={styles.intro}>{intro}</p>}

        {/* Fecha a la izquierda y buscador a la derecha, como en el diseño. */}
        <div className={styles.toolbar}>
          <p className={styles.badge}>{dateLabel}</p>

          <label className={styles.search}>
            <span className={styles.searchLabel}>{searchLabel}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={searchPlaceholder}
              className={styles.searchInput}
            />
          </label>
        </div>

        {visible.length > 0 || showsFeature ? (
          <ol className={styles.list}>
            {/**
             * El Premio abre el programa. Es un momento del día como los demás
             * —tiene hora y sede— pero con su propio rótulo, así que va como
             * fila destacada y no como una fila más con un título de texto.
             */}
            {showsFeature && (
              <li className={`${styles.item} ${styles.feature}`} id={AGENDA_FEATURE.id}>
                <p className={styles.time}>{feature.time}</p>

                <h2 className={styles.featureName}>
                  {/* El rótulo se compone de trozos, así que el nombre legible
                      va aparte: lo que se lee en voz alta es «Premio 2026». */}
                  <span className={styles.srOnly}>{feature.name}</span>
                  <span className={styles.wordmark} aria-hidden>
                    PREMI
                    <Image
                      src={AGENDA_FEATURE.letterO.src}
                      alt=""
                      width={AGENDA_FEATURE.letterO.width}
                      height={AGENDA_FEATURE.letterO.height}
                      className={styles.glyph}
                    />
                    <span className={styles.wordmarkGap} />2
                    <Image
                      src={AGENDA_FEATURE.numberZero.src}
                      alt=""
                      width={AGENDA_FEATURE.numberZero.width}
                      height={AGENDA_FEATURE.numberZero.height}
                      className={styles.glyph}
                    />
                    26
                  </span>
                </h2>

                <p className={styles.featureVenue}>{feature.venue}</p>
              </li>
            )}

            {visible.map((item) => (
              <li key={item.id} className={styles.item} id={item.id}>
                <p className={styles.time}>{item.time}</p>

                <div className={styles.body}>
                  <h2 className={styles.title}>{item.title}</h2>
                  {item.description && <p className={styles.description}>{item.description}</p>}

                  {(item.host || (item.people && item.people.length > 0)) && (
                    <div className={styles.credits}>
                      {item.host && (
                        <div className={styles.credit}>
                          <span className={styles.creditLabel}>{hostLabel}</span>
                          <p className={styles.person}>
                            <span className={styles.swatch} data-role="host" aria-hidden />
                            <span className={styles.who}>
                              <span className={styles.name}>{item.host.name}</span>
                              {item.host.role && (
                                <span className={styles.role}>{item.host.role}</span>
                              )}
                            </span>
                          </p>
                        </div>
                      )}

                      {item.people && item.people.length > 0 && (
                        <div className={styles.credit}>
                          <span className={styles.creditLabel}>{peopleLabel}</span>
                          <ul className={styles.people}>
                            {item.people.map((person) => (
                              <li key={person.name} className={styles.person}>
                                <span className={styles.swatch} data-role="people" aria-hidden />
                                <span className={styles.who}>
                                  <span className={styles.name}>{person.name}</span>
                                  {person.organization && (
                                    <span className={styles.role}>{person.organization}</span>
                                  )}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className={styles.searchEmpty} role="status">
            {searchEmpty}
          </p>
        )}
      </div>
    </section>
  );
}
