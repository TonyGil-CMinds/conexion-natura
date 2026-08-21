import styles from './ProgressCounter.module.css';

type Props = {
  /** Progreso ya redondeado, 0 → 100. */
  value: number;
};

/** Contador del loader en la tipografía de acento (Departure Mono). */
export function ProgressCounter({ value }: Props) {
  return (
    <p className={styles.root} aria-live="polite" aria-atomic>
      <span className={styles.value}>{value}</span>
      <span className={styles.unit}>%</span>
    </p>
  );
}
