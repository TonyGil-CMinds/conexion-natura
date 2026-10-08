import Link from 'next/link';
import type { Dictionary, Locale } from '@/i18n';
import styles from './Tanusas.module.css';

type Props = { copy: Dictionary['tanusas']['hero']; locale: Locale };

/** The retreat opens its interactive agenda in the current language. */
export function TanusasAgendaCta({ copy, locale }: Props) {
  return <Link className={styles.agendaCta} href={`/${locale}/tanusas/agenda`}>{copy.cta}</Link>;
}
