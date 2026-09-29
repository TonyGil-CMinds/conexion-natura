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


  /**
   * El muro de socios del pie, **en filas explícitas** y sin rótulo de grupo.
   *
   * Las filas van declaradas y no al azar del reflujo porque el diseño las
   * agrupa por sentido —la red de la convocatoria arriba, quien lidera y
   * financia abajo— y dejándolo al ancho disponible se mezclaban. Cada fila
   * sigue envolviendo por su cuenta en pantalla estrecha.
   *
   * `onDark` es la versión para las paletas oscuras (azul y rosa). Donde la hay
   * se monta el archivo oficial en vez de blanquear el otro con un filtro: el
   * filtro aplana los dos colores de NaturaTech y convierte las banderas de
   * Suecia y Francia en un rectángulo blanco. Donde no la hay, sigue el filtro.
   *
   * Las medidas son las naturales de cada SVG: el alto lo iguala el CSS y el
   * ancho tiene que salir de la proporción real o el logotipo se deforma.
   */
  /**
   * Los grupos no son filas: son **papeles**, y cada uno dice el suyo encima.
   *
   * Antes eran tres filas sin nombre y el reparto se leía como un orden de
   * importancia. Nombrarlos cambia lo que significan: quién recibe en su casa,
   * a través de quién llega el acto y quién lo acompaña. Por eso la clave entra
   * en el diccionario en vez de escribirse aquí: el rótulo se traduce, el
   * reparto no.
   *
   * El primero no lleva rótulo propio: lo nombra el titular de la sección
   * («Conoce a las organizaciones anfitrionas»), y repetirlo sería decirlo dos
   * veces seguidas.
   */
  partnerGroups: [
    {
      key: 'hosts',
      logos: [
      { src: '/partners/logo-socios-quito-ntl.svg', onDark: '/partners/logo-socios-light-ntl.svg', alt: 'NaturaTech LAC', width: 141, height: 52 },
      { src: '/partners/logo-socios-quito-redimpacto.svg', onDark: '/partners/logo-socios-light-redimpacto.svg', alt: 'Red de Impacto', width: 303, height: 81 },
      /* El archivo se llama «impaquito» pero el logotipo es el de Latimpacto. */
      { src: '/partners/logo-socios-quito-impaquito.svg', alt: 'Latimpacto', width: 189, height: 51 },
      /**
       * IMPAQTO, el que sí lleva ese nombre. El original solo vino en blanco, así
       * que la versión clara es ese archivo tal cual y la oscura se sacó de él
       * cambiando el relleno a la tinta de los demás logotipos (`#171717`): con
       * el blanco como `src` no quedaba nada que ver sobre la paleta clara.
       */
      { src: '/partners/logo-socios-quito-impaqto.svg', onDark: '/partners/logo-socios-light-impaqto.svg', alt: 'IMPAQTO', width: 59, height: 56 },
      ],
    },
    /** «A través de»: por cuya vía llega el acto. */
    {
      key: 'through',
      logos: [
        { src: '/partners/logo-socios-quito-natura500.svg', alt: 'natura500', width: 113, height: 66 },
        { src: '/partners/logo-socios-quito-fondoverde.svg', onDark: '/partners/logo-socios-light-fondoverde.svg', alt: 'Fondo Verde Catalítico', width: 231, height: 58 },
        { src: '/partners/logo-socios-cminds.svg', onDark: '/partners/logo-socios-cminds-light.svg', alt: 'C Minds', width: 118, height: 28 },
        { src: '/partners/logo-socios-bid.svg', onDark: '/partners/logo-socios-bid-light.svg', alt: 'IDB Lab', width: 123, height: 25 },
      ],
    },
    /** «Con el apoyo de»: quienes acompañan. Es el grupo largo y va más pequeño. */
    {
      key: 'support',
      logos: [
        { src: '/partners/logo-socios-quito-startuplab.svg', alt: 'StartupLab.mx', width: 185, height: 46 },
        { src: '/partners/logo-socios-quito-trulab.svg', alt: 'truLab', width: 116, height: 50 },
        { src: '/partners/logo-socios-quito-tangara.svg', alt: 'Tàngara', width: 145, height: 56 },
        { src: '/partners/logo-socios-suecia.svg', onDark: '/partners/logo-socios-light-suecia.svg', alt: 'Sweden Sverige', width: 62, height: 19 },
        { src: '/partners/logo-socios-francia.svg', onDark: '/partners/logo-socios-light-france.svg', alt: 'Gouvernement français', width: 57, height: 30 },
        { src: '/partners/logo-socios-amazonia.svg', onDark: '/partners/logo-socios-amazonia-light.svg', alt: 'Amazónia', width: 31, height: 26 },
        { src: '/partners/logo-socios-cc.svg', onDark: '/partners/logo-socios-cc-light.svg', alt: 'Climate Collective', width: 58, height: 19 },
      ],
    },
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
