import type { AgendaItem } from '@/config/agenda';
import styles from './Schedule.module.css';

type Props = {
  items: readonly AgendaItem[];
  /** Párrafo de entrada del programa. */
  intro?: string;
  hostLabel: string;
  peopleLabel: string;
};

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
 * Componente de servidor: no hay estado ni animación, solo contenido.
 */
export function Schedule({ items, intro, hostLabel, peopleLabel }: Props) {
  return (
    <section className={styles.root}>
      <div className={styles.inner}>
        {intro && <p className={styles.intro}>{intro}</p>}

        <ol className={styles.list}>
          {items.map((item) => (
            <li key={item.id} className={styles.item} id={item.id}>
              <p className={styles.time}>{item.time}</p>

              <div className={styles.body}>
                <h2 className={styles.title}>{item.title}</h2>
                {item.description && <p className={styles.description}>{item.description}</p>}

                {item.host && (
                  <p className={styles.credit}>
                    <span className={styles.creditLabel}>{hostLabel}</span>
                    <span className={styles.name}>{item.host.name}</span>
                    {item.host.role && <span className={styles.role}>{item.host.role}</span>}
                  </p>
                )}

                {item.people && item.people.length > 0 && (
                  <div className={styles.credit}>
                    <span className={styles.creditLabel}>{peopleLabel}</span>
                    <ul className={styles.people}>
                      {item.people.map((person) => (
                        <li key={person.name}>
                          <span className={styles.name}>{person.name}</span>
                          {person.role && <span className={styles.role}>{person.role}</span>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
