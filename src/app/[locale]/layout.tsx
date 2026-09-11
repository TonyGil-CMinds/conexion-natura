import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { bodyFont, cubao } from '@/fonts';
import { HeaderGate } from '@/components/layout/HeaderGate';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { AttendanceProvider } from '@/features/registration';
import { PageTransition } from '@/features/transitions/page-transition';
import { LOCALES, getDictionary, isLocale, type Locale } from '@/i18n';
import { socialMeta } from '@/config/seo';
import { SITE_URL } from '@/config/urls';
import '@/styles/globals.css';

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/**
 * Las dos versiones se generan en build. Sin esto, cada idioma se renderizaría a
 * demanda y perderíamos el prerenderizado de la portada.
 */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

/**
 * El título de cada página se compone con `template`, así que las páginas solo
 * dicen su nombre («Agenda») y el sufijo se pone una vez.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);

  return {
    /**
     * Sin base, `canonical` y las alternativas salen relativas y el buscador no
     * puede resolverlas. En Vercel el dominio de producción llega en el entorno;
     * en local queda el localhost, que no se indexa.
     */
    metadataBase: new URL(SITE_URL),
    title: {
      default: t.meta.home.title,
      template: `%s - ${t.meta.siteName}`,
    },
    description: t.meta.home.description,
    icons: { icon: '/favicon.svg' },
    // Le dice al buscador que las dos versiones son la misma página en otro
    // idioma, en vez de contenido duplicado.
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(LOCALES.map((code) => [code, `/${code}`])),
    },
    /**
     * Lo que se ve al pegar un enlace. Va en el layout para que valga de
     * omisión en todas las rutas; cada página lo vuelve a componer con su
     * título, y el retiro además con su propia imagen.
     */
    ...socialMeta({
      title: t.meta.home.title,
      description: t.meta.home.description,
      locale: locale as Locale,
      siteName: t.meta.siteName,
    }),
  };
}

export const viewport: Viewport = {
  themeColor: '#151D17',
};

/**
 * Marca en <html>, antes del primer pintado, si el loader ya se vio en esta
 * pestaña y —si no— que está a punto de verse. Va como script en línea porque
 * leerlo desde React llega tarde: el loader habría aparecido durante un cuadro.
 *
 * `data-loader-pending` solo se pone en la portada, que es la única ruta con
 * loader: comprobarlo por `pathname` evita esconder la cabecera en las demás.
 * Quien lo quita es `LoaderGate` cuando la malla ya tapa la pantalla.
 */
const LOADER_FLAG_SCRIPT = [
  'try{',
  "var h=document.documentElement;",
  "if(sessionStorage.getItem('c500-loader-played')){h.setAttribute('data-loader-played','1')}",
  // Sin expresión regular a propósito: dentro de una plantilla de JavaScript,
  // `\/` es solo `/`, y el patrón llegaba roto al HTML. Un `split` no tiene
  // escapes que perder. La portada es el único segmento y mide dos letras.
  "else{var s=location.pathname.split('/').filter(Boolean);",
  "if(s.length===1&&s[0].length===2){h.setAttribute('data-loader-pending','1')}}",
  '}catch(e){}',
].join('');

/**
 * Esconde la cabecera mientras el loader está en pantalla.
 *
 * Va **en línea** y no en un módulo CSS porque el problema es de tiempos: en los
 * primeros cuadros las hojas de los módulos todavía no se han aplicado, todo está
 * sin posicionar, y la cabecera —que va antes en el DOM— se pintaba en flujo
 * normal por encima del loader. Un estilo en el propio HTML se aplica en el
 * primer pintado, sin esperar a ninguna descarga.
 *
 * `visibility` y no `display`: no queremos que la cabecera cambie de tamaño ni
 * se remonte al aparecer, solo que no se vea.
 */
const HEADER_HIDDEN_STYLE = 'html[data-loader-pending] [data-site-header]{visibility:hidden}';

/**
 * Armazón del documento. Vive bajo `[locale]` porque `<html lang>` cambia con el
 * idioma y solo el layout raíz pinta `<html>`: con un layout por encima, el
 * atributo se quedaría fijo en español.
 */
export default async function RootLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    // El tema arranca en oscuro, que es el del diseño. Los roles semánticos de
    // tokens.css ya son los del tema oscuro, así que no hace falta atributo.
    <html
      lang={locale}
      className={`${bodyFont.variable} ${cubao.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: LOADER_FLAG_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: HEADER_HIDDEN_STYLE }} />

        {/*
          La cabecera vive aquí y no dentro de cada página, por dos razones: no
          debe animarse al cambiar de ruta —queda fuera de `PageTransition`— y al
          sobrevivir a la navegación su indicador puede animar el paso de una ruta
          a otra en vez de aparecer ya pintado.
        */}
        {/* El estado de asistencia lo consultan la cabecera, el hero y el pie:
            tres ramas distintas del árbol, así que vive por encima de las tres. */}
        <AttendanceProvider>
          {/* Salvo en las rutas que traen su propia barra: ver `HeaderGate`. */}
          <HeaderGate>
            <SiteHeader
              locale={locale as Locale}
              nav={t.nav}
              header={t.header}
              cta={{ label: t.hero.ctaLabel, confirmedLabel: t.registration.confirmedCta, note: t.hero.ctaNote }}
            />
          </HeaderGate>

          <PageTransition>{children}</PageTransition>
        </AttendanceProvider>
      </body>
    </html>
  );
}
