import localFont from 'next/font/local';
import { IBM_Plex_Mono } from 'next/font/google';

/**
 * Tipografía de texto: párrafos, preguntas, rótulos de lista. Sustituye a Host
 * Grotesk, que ya no se usa en ninguna parte.
 */
export const bodyFont = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
});

/** Tipografía de acento: hero, loader, rótulos de sección, datos. */
export const departureMono = localFont({
  src: './DepartureMono-Regular.otf',
  display: 'block',
  weight: '400',
  style: 'normal',
  variable: '--font-departure-mono',
});
