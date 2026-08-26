import styles from './CtaButton.module.css';

type Props = {
  label: string;
  href: string;
};

/**
 * Botón principal, con dos estados:
 *
 * - Reposo: verde plano, sin icono y sin sombra.
 * - Hover: el bloque se levanta hacia arriba y a la derecha, descubriendo la
 *   sombra amarilla; el degradado aparece por encima del plano y entra el icono.
 *
 * La sombra no se anima: es una capa del mismo tamaño y radio que vive detrás y
 * en reposo queda exactamente tapada por el botón. Se revela porque el botón se
 * aparta, así que un solo `transform` gobierna el efecto.
 *
 * Los estados van en CSS y no en variantes de Framer Motion a propósito: así
 * `:focus-visible` recibe el mismo tratamiento que `:hover` y el botón responde
 * igual con teclado, sin duplicar la definición del estado.
 */
export function CtaButton({ label, href }: Props) {
  return (
    <span className={styles.root}>
      <span className={styles.shadow} aria-hidden />
      <a href={href} className={styles.button}>
        <span className={styles.gradient} aria-hidden />
        <span className={styles.label}>{label}</span>
        {/* Máscara y no imagen: así el icono toma el color del rótulo. El SVG
            trae su relleno fijado, y aquí el texto va en oscuro. */}
        <span className={styles.icon} aria-hidden />
      </a>
    </span>
  );
}
