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
  themeColor: '#001D09',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // El tema arranca en oscuro, que es el del diseño. Los roles semánticos de
    // tokens.css ya son los del tema oscuro, así que no hace falta atributo.
    <html
      lang="es"
      className={`${hostGrotesk.variable} ${departureMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
