import Image from 'next/image';
import { cn } from '@/lib/cn';
import styles from './ThemedImage.module.css';

type Props = {
  /** Variante para fondo oscuro (el tema por defecto). */
  dark: string;
  /** Variante para fondo claro. */
  light: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

/**
 * Imagen con una variante por tema.
 *
 * Se pintan las dos y el CSS esconde la que no toca, en vez de elegir en
 * JavaScript: el tema se lee de `localStorage` después de montar, así que una
 * elección en el cliente mostraría un cuadro con el logotipo equivocado.
 *
 * No sirve una máscara con `currentColor` —que es lo que se hace con los iconos
 * de una tinta— porque estos logotipos llevan dos colores: la palabra cambia con
 * el tema y el rombo se queda lima en los dos.
 *
 * Solo se precarga la variante oscura: es el tema por defecto, y precargar las
 * dos pediría al navegador un archivo que casi nadie va a ver.
 */
export function ThemedImage({ dark, light, alt, width, height, className, priority }: Props) {
  return (
    <span className={cn(styles.root, className)}>
      <Image src={dark} alt={alt} width={width} height={height} priority={priority} className={styles.dark} />
      <Image src={light} alt="" width={width} height={height} aria-hidden className={styles.light} />
    </span>
  );
}
