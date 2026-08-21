import type { Metadata, Viewport } from 'next';
import { departureMono, hostGrotesk } from '@/fonts';
import { SITE } from '@/config/site';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.event.headline.join(" ")}`,
  description: `${SITE.event.date} · ${SITE.event.place}`,
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#F7FFD2',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // El tema arranca en claro, que es el del diseño. El loader es oscuro por
    // sí mismo: usa los colores de marca directamente, no los roles del tema.
    <html
      lang="es"
      data-theme="light"
      className={`${hostGrotesk.variable} ${departureMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
