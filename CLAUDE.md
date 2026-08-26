# Conexión Natura — notas para Claude

Stack: Next.js 15 App Router, TypeScript estricto, CSS Modules + tokens (sin
Tailwind), GSAP, Framer Motion, react-three-fiber.

## Convenciones

- Alias de importación: `@/*` → `src/*`.
- Colores, tipografía y espaciado **solo** desde `src/styles/tokens.css`. Nada de
  hex sueltos en componentes.
- Cada feature vive en `src/features/<nombre>/` con `components/ hooks/ config/`
  y un `index.ts` que es su única API pública.
- Estilos: un `.module.css` junto a su componente.
- `'use client'` solo donde hace falta (animación, estado, efectos).
- Reparto de animación: **GSAP** para valores continuos e interpolación numérica
  (contadores, progreso, scroll); **Framer Motion** para entrada/salida de
  componentes y variantes declarativas.
- Fuentes vía `next/font` en `src/fonts/index.ts`. Host Grotesk para texto,
  Departure Mono solo para acentos tipo loader.

## Rutas

`/` (portada), `/agenda`, `/speakers` y `/faq`. El armazón (`PageFrame` + `SiteHeader`) se compone en cada
página, no en el layout raíz: solo la portada va envuelta en `LoaderGate`, porque
el loader es la entrada al sitio y no un peaje en cada ruta.

El indicador del navbar sale de `usePathname()`. Los enlaces con ancla
(`/#agenda`) no pueden estar seleccionados: una ancla no es un destino.

## Ancho de página

El contenido va en `PageShell` (`--content-max`, 1600px, centrado). Lo que va a
pantalla completa queda fuera: loader y transición de píxeles. Acotar la
transición dejaría los laterales sin cubrir en el momento en que tapa el cambio
de contenido.

La capa de filetes arranca bajo la cabecera: el navbar va sin verticales.

Lo que tiene que sangrar a pantalla completa desde dentro del contenido acotado
(capa de medios, cinta de la cuenta atrás) usa `width: 100vw; left: 50%;
transform: translateX(-50%)`, y el recorte lo pone `PageFrame` con `overflow-x:
clip`. Un `overflow: hidden` en la sección cortaría al ancho del contenido.

Los filetes de la retícula los dibuja `PageFrame`, no los componentes: como
bordes propios se cortan donde acaba el contenido acotado. Las horizontales van
en bandas a sangre y las verticales en una capa que recorre toda la página. Al
añadir secciones, el filete que las separe va como banda, no como `border-top`.

## Transiciones

Cada transición es una feature en `src/features/transitions/`. Regla: quien
transiciona no decide *qué* se muestra — expone `onCovered` (pantalla tapada,
momento seguro para cambiar contenido) y `onComplete`; el orquestador decide.

Toda aleatoriedad visual usa `createRandom(seed)` de `src/lib/random.ts`, nunca
`Math.random()`: si no, servidor y cliente difieren y React reporta desajuste
de hidratación.

## Retícula y tipografía

Los valores de la retícula (`--container-margin` 88px, `--header-height` 88px,
`--header-side` 222px, `--cta-width` 328px) y la escala del hero viven en
tokens.css. Hay cuatro
filetes verticales: los dos bordes del contenedor y dos interiores a
`--header-side` de cada lado.
Los cuerpos del hero se despejaron de las métricas reales de Departure Mono
(avance/em 0.6364, capHeight/em 0.7273): si hay que ajustar tamaños, se calcula
con esas proporciones, no a ojo.

Host Grotesk para párrafos y textos corridos (FAQ, cuerpos de texto). Departure
Mono para el hero, el loader, rótulos de sección y datos: son los casos puntuales.

El titular se define por **tramos**, no por líneas (`SITE.event.headline`): el
resalte cae a mitad de línea, así que el color es decisión de diseño por tramo.

## Verificación visual

`node scripts/capture.js <url> <dir> <ms,ms,...> [WxH]` captura la página en
instantes concretos y volca la consola. Para revisar animaciones hay que usar
esto y no `chrome --screenshot --virtual-time-budget`: el tiempo virtual solo
avanza cuando la página está inactiva, y con GSAP corriendo nunca lo está.

## Ritmo vertical del hero

Los huecos del hero son tokens (`--hero-*`) con escalones por **altura** de
viewport: el hero tiene que caber en una pantalla, así que en portátiles se
aprieta en vez de dejar crecer la página. Al añadir elementos al hero, su hueco
va como token y entra en esos escalones.

## Animaciones de entrada

El contenido se monta oculto detrás del loader, así que una animación que
arranque al montar se ejecuta sin que nadie la vea. Los componentes que animan al
entrar esperan `useHasEntered()` (la malla ya se retiró), no `useIsRevealed()`
(contenido montado pero todavía tapado).

Corolario: el estado inicial visible tiene que ser el estado "antes" de la
animación, no el final. Si no, al descubrirse la página se ve el resultado y
después la animación, en orden invertido.

Quien apaga un elemento antes de su entrada es el cliente, no el CSS: si el CSS lo
apagara, un fallo de JavaScript lo dejaría invisible para siempre.

## Portadas de página

`PageCover` + `PixelMosaic` + `EmptyState` / `PageIntro` son la base de las páginas
interiores. El color de acento viaja como variable CSS (`--cover-accent`): el
mosaico no conoce la paleta de cada página.
El mosaico no mide el viewport: emite celdas y las coloca con `auto-fill` sobre
columnas `minmax(--mosaic-cell, 1fr)`. La celda escala con el ancho para que el
recuento de columnas —y por tanto el patrón— no cambie entre 1280 y 1920.

Al añadir una portada, elegir la semilla comprobando que ninguna celda de color
asome junto al panel del rótulo: convierte el panel en una escalera.

## Assets

Los SVG de píxeles se convierten a mapas de celdas en build, no se parsean en
runtime: `scripts/svg-to-pixels.js` para los que traen un rect por cuadro y
`scripts/svg-polygons-to-pixels.js` para los que vienen como polígonos en
escalera (recupera las celdas muestreando el centro de cada casilla).

Los originales quedan en `_assets-src/` (referencia, incluida la paleta en
`colores.txt`). Lo que se sirve va en `public/`, agrupado por uso.
