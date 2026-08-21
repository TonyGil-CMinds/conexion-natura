import styles from './PageShell.module.css';

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Acota el ancho del contenido y lo centra.
 *
 * Solo envuelve al contenido de página. El loader y la transición de píxeles se
 * quedan fuera a propósito: van a pantalla completa, y recortarlos dejaría ver
 * los bordes sin cubrir justo en el momento en que tapan el cambio de contenido.
 */
export function PageShell({ children, className }: Props) {
  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>{children}</div>
  );
}
