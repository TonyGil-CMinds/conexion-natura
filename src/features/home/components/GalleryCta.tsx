import Link from 'next/link';
import { SITE } from '@/config/site';
import { localePath, type Locale } from '@/i18n';
import { cn } from '@/lib/cn';
import styles from './GalleryCta.module.css';

type Props = {
  locale: Locale;
  label: string;
  /** A todo el ancho de su columna: el del hero en móvil y el del menú. */
  block?: boolean;
  className?: string;
};

/**
 * La llamada de la portada: la galería.
 *
 * Mientras `SITE.gallery.href` no tenga destino, sale como `<a>` sin `href`,
 * que en HTML es un marcador: el sitio donde irá el enlace. Se ve igual pero no
 * se puede pulsar ni enfocar, y no levanta al pasar por encima —no promete lo
 * que todavía no hace—. Al tener destino, basta con escribirlo en la
 * configuración.
 */
export function GalleryCta({ locale, label, block, className }: Props) {
  const href = SITE.gallery.href;
  const props = { className: cn(styles.root, className), 'data-block': block || undefined };

  return href ? (
    <Link href={localePath(locale, href)} {...props}>
      {label}
    </Link>
  ) : (
    <a {...props}>{label}</a>
  );
}
