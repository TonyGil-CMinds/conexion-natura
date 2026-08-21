import localFont from 'next/font/local';
import { Host_Grotesk } from 'next/font/google';

/** Tipografía de sistema: títulos y párrafos. */
export const hostGrotesk = Host_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-host-grotesk',
});

/** Tipografía de acento: usos puntuales (loader, contadores, datos). */
export const departureMono = localFont({
  src: './DepartureMono-Regular.otf',
  display: 'block',
  weight: '400',
  style: 'normal',
  variable: '--font-departure-mono',
});
