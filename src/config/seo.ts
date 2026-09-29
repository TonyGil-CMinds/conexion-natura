import type { Metadata } from 'next';
import type { Locale } from '@/i18n';

/**
 * Imágenes de compartir, una por identidad: la del sitio, la de la micropágina
 * del retiro y la de la sección de Quito. Cada una se comparte por su cuenta, y
 * repartirlas todas con la portada del sitio enseñaría algo que no es lo que se
 * abre al pulsar.
 *
 * Van como ruta relativa: `metadataBase` —que el layout raíz fija en `SITE_URL`—
 * las convierte en absolutas, que es lo que exigen las redes.
 */
export const OG_IMAGES = {
  site: '/og-image.png',
  tanusas: '/og-image-tanusas.png',
  quito: '/og-image.ceibaquito.png',
} as const;

/** Medida real de los tres archivos. Va aquí para no leerla en cada página. */
const OG_SIZE = { width: 1280, height: 720 };

/** El idioma, en la forma que espera Open Graph. */
const OG_LOCALE: Record<Locale, string> = { es: 'es_ES', en: 'en_US' };

type Input = {
  /** El título tal cual debe salir al compartir, ya con el sufijo del sitio. */
  title: string;
  description: string;
  locale: Locale;
  siteName: string;
  /** Por omisión la del sitio; el retiro pasa la suya. */
  image?: string;
};

/**
 * Bloque de compartir de una página: Open Graph y Twitter.
 *
 * Existe porque en los metadatos de Next **el hijo reemplaza al padre clave a
 * clave**: una página que solo declara `title` hereda el `openGraph` entero del
 * layout, título incluido, y todas se compartirían con el titular de la
 * portada. Componiéndolo aquí, cada página dice el suyo sin repetir el resto.
 *
 * El título va completo y no por plantilla: `title.template` es cosa de la
 * etiqueta `<title>`, y no alcanza a `og:title`.
 */
export function socialMeta({ title, description, locale, siteName, image }: Input): Metadata {
  const url = image ?? OG_IMAGES.site;

  return {
    openGraph: {
      type: 'website',
      siteName,
      locale: OG_LOCALE[locale],
      title,
      description,
      images: [{ url, ...OG_SIZE, alt: title }],
    },
    twitter: {
      // La grande: estas imágenes son apaisadas y con una tarjeta pequeña se
      // recortarían a un cuadro.
      card: 'summary_large_image',
      title,
      description,
      images: [url],
    },
  };
}
