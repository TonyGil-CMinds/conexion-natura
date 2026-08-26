import { PageShell } from './PageShell';
import styles from './PageFrame.module.css';

type Props = {
  /** Cabecera: queda sobre el filete horizontal superior. */
  header: React.ReactNode;
  /** Barra inferior: queda bajo el filete horizontal inferior. */
  bottomBar?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Armazón de página: aporta la retícula de filetes y reparte la altura.
 *
 * Los filetes no son bordes de la cabecera ni del hero, y esa es la clave: al
 * acotar el contenido a `--content-max`, un borde se corta donde acaba su
 * elemento, y las horizontales dejaban de llegar al borde del viewport. Aquí las
 * horizontales viven en bandas a sangre y las verticales en una capa que recorre
 * toda la página, así que la retícula se lee continua a cualquier ancho.
 *
 * La altura se reparte con flex y no con `calc(100dvh - cabecera - barra)`: así no
 * hay que mantener sincronizadas las alturas de cada banda con una fórmula.
 */
export function PageFrame({ header, bottomBar, children }: Props) {
  return (
    <div className={styles.root}>
      {/* Verticales: recorren la página entera, por detrás del contenido. */}
      <div className={styles.rules} aria-hidden>
        <PageShell>
          <div className={styles.rulesInner}>
            {/* Las dos verticales interiores: separan las columnas de la
                cabecera y siguen bajando por toda la página. */}
            <span className={styles.columnRule} data-side="start" />
            <span className={styles.columnRule} data-side="end" />
          </div>
        </PageShell>
      </div>

      <div className={styles.band} data-rule="bottom">
        <PageShell>{header}</PageShell>
      </div>

      <PageShell className={styles.main}>{children}</PageShell>

      {bottomBar && (
        <div className={styles.band} data-rule="top">
          <PageShell>{bottomBar}</PageShell>
        </div>
      )}
    </div>
  );
}
