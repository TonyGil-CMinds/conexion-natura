import localFont from 'next/font/local';
import { IBM_Plex_Mono } from 'next/font/google';

/**
 * Tipografía de texto: párrafos, preguntas, rótulos de lista. Sustituye a Host
 * Grotesk, que ya no se usa en ninguna parte.
 */
export const bodyFont = IBM_Plex_Mono({
  subsets: ['latin'],
  /* El 700 lo pide la negrita real de los nombres, antes sintetizada. */
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
});

/** Display face used by the full-screen mobile navigation. */
export const cubao = localFont({
  src: '../../public/font/Cubao_Free_Regular.otf',
  display: 'swap',
  weight: '400',
  style: 'normal',
  variable: '--font-cubao',
});
