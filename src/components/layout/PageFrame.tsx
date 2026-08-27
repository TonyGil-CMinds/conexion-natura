import { PageShell } from './PageShell';
import { SiteFooter } from './SiteFooter';
import styles from './PageFrame.module.css';

type Props = {
  /**
   * Filetes verticales interiores, los que separan las columnas de la cabecera.
   * Se apagan en páginas cuyo contenido cruza esas columnas, donde las líneas
   * atravesarían las filas en vez de estructurarlas.
   */
  hasColumnRules?: boolean;
  /**
   * La portada y las pantallas de flujo cerrado (registro) no continúan con el
   * pie global: la primera cabe en una pantalla y el pie repetiría su CTA.
   */
  hideFooter?: boolean;
  children: React.ReactNode;
};

/**
 * Armazón de página: aporta la retícula de filetes y reparte la altura.
 *
 * La cabecera no está aquí, sino en el layout raíz: es idéntica en todas las rutas
 * y no debe animarse al navegar.
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
export function PageFrame({ children, hasColumnRules = true, hideFooter = false }: Props) {
  return (
    <div className={styles.root}>
      {/* Verticales: recorren la página entera, por detrás del contenido. */}
      <div className={styles.rules} aria-hidden>
        <PageShell>
          <div className={styles.rulesInner}>
            {/* Las dos verticales interiores: separan las columnas de la
                cabecera y siguen bajando por toda la página. */}
            {hasColumnRules && (
              <>
                <span className={styles.columnRule} data-side="start" />
                <span className={styles.columnRule} data-side="end" />
              </>
            )}
          </div>
        </PageShell>
      </div>

      <PageShell className={styles.main}>{children}</PageShell>

      {/* El pie va dentro del armazón para que los filetes verticales lo
          crucen como cruzan el resto de la página. */}
      {!hideFooter && <SiteFooter />}
    </div>
  );
}
