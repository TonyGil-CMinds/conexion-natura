import { SITE } from './site';

/**
 * Datos de la sección `/quito`, lo que no depende del idioma.
 *
 * `/quito` es **otra puerta al mismo acto**, como `/tanusas` lo es al retiro: la
 * fecha, la sede y los socios salen de `SITE` y no se copian aquí. Lo suyo es la
 * piel —su hero, su barra, su pie— y las rutas que cuelgan de ella.
 */
export const QUITO = {
  /** Raíz de la sección, sin prefijo de idioma. Lo pone quien pinta el enlace. */
  root: '/quito',

  /**
   * Marca en la URL que pide desplegar el campo del correo al llegar.
   *
   * Hace falta porque desde las rutas de dentro «Regístrate» sí navega —allí no
   * hay campo que abrir— y al aterrizar en la portada tiene que abrirse solo: sin
   * esto, quien viene de la agenda aterrizaba arriba y tenía que volver a buscar
   * el botón que acababa de pulsar.
   */
  joinParam: 'registro',

  /**
   * La barra de esta sección.
   *
   * «Acerca de» es un ancla de la portada; las otras tres son rutas propias bajo
   * `/quito`, con el mismo contenido que las del sitio pero con esta piel. Por
   * eso el ancla lleva la ruta delante y no solo `#`: desde `/quito/agenda` un
   * `#acerca-de` suelto no llevaría a ninguna parte.
   */
  nav: [
    { key: 'about', href: '/quito#acerca-de', anchor: 'acerca-de' },
    { key: 'agenda', href: '/quito/agenda' },
    { key: 'speakers', href: '/quito/speakers' },
    { key: 'register', href: '/quito?registro=1', highlight: true },
  ],

  /** Assets del hero; el subtitulo se compone con Cubao. */
  hero: {
    bird: { src: '/hero/hero-image-bird-quito.png', width: 919, height: 1186 },
    wordmark: { src: '/hero/logo-ceiba.svg', width: 915, height: 254 },
  },

  /** El glifo de la barra: el rombo de Ceiba, ya en su verde. */
  brand: { src: '/hero/navbar-brand.svg', width: 41, height: 40 },

  /**
   * Los cuatro cuadros de la marquesina, en el orden del diseño. Son los mismos
   * de la marquesina del retiro: la pieza se comparte, y dibujar otros cuatro
   * solo para esta ruta habría sido repetir el mismo objeto con otro trazo.
   */
  marquee: [
    '/tanusas/asset-square-green.svg',
    '/tanusas/asset-square-darkgreen.svg',
    '/tanusas/asset-square-blue.svg',
    '/tanusas/asset-square-yellow.svg',
  ],

  /**
   * Las tres imágenes de «después del GET Forum». El rótulo de cada una vive en
   * el diccionario; aquí solo qué archivo es y de qué lado cae.
   */
  forum: [
    { key: 'stories', src: '/hero/img-historias.png', width: 1080, height: 1080, side: 'start' },
    { key: 'ventures', src: '/hero/img-bioemprendimientos.png', width: 1080, height: 1080, side: 'end' },
    { key: 'flavors', src: '/hero/img-saboreslocales.png', width: 1080, height: 1080, side: 'start' },
  ],

  /** El pie: la ballena del cierre, la foto de sala y el lockup pequeño. */
  footer: {
    whale: { src: '/img/footer-image.png', width: 764, height: 356 },
    room: { src: '/hero/Footer.png', width: 1280, height: 426 },
    brand: { src: '/hero/footer-brand.svg', width: 78, height: 33 },
    /** El glifo que parte el rótulo entre «nuestros» y «socios». */
    divider: { src: '/hero/devider-socios.svg', width: 78, height: 76 },
  },

  /** Cuándo y dónde: sin duplicar, es el mismo acto que el resto del sitio. */
  event: SITE.event,
} as const;
