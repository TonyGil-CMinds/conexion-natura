import type { Metadata, Viewport } from 'next';
import { bodyFont, departureMono } from '@/fonts';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { PageTransition } from '@/features/transitions/page-transition';
import { SITE } from '@/config/site';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.event.headline.map((line) => line.map((s) => s.text).join('')).join(' ')}`,
  description: `${SITE.event.dateLabel} · ${SITE.event.place}`,
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#151D17',
};

/**
 * Marca en <html> si el loader ya se vio en esta pestaña, antes del primer
 * pintado. Va como script en línea porque leerlo desde React llega tarde: el
 * loader habría aparecido durante un cuadro.
 */
const LOADER_FLAG_SCRIPT = `try{if(sessionStorage.getItem('c500-loader-played')){document.documentElement.setAttribute('data-loader-played','1')}}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // El tema arranca en oscuro, que es el del diseño. Los roles semánticos de
    // tokens.css ya son los del tema oscuro, así que no hace falta atributo.
    <html
      lang="es"
      className={`${bodyFont.variable} ${departureMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: LOADER_FLAG_SCRIPT }} />

        {/*
          La cabecera vive aquí y no dentro de cada página, por dos razones: no
          debe animarse al cambiar de ruta —queda fuera de `PageTransition`— y al
          sobrevivir a la navegación su indicador puede animar el paso de una ruta
          a otra en vez de aparecer ya pintado.
        */}
        <SiteHeader />

        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
