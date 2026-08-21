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

## Ancho de página

El contenido va en `PageShell` (`--content-max`, 1600px, centrado). Lo que va a
pantalla completa queda fuera: loader y transición de píxeles. Acotar la
transición dejaría los laterales sin cubrir en el momento en que tapa el cambio
de contenido.

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

Los valores de la retícula (`--container-margin`, `--container-pad`,
`--header-height`, `--header-side`) y la escala del hero viven en tokens.css.
Los cuerpos del hero se despejaron de las métricas reales de Departure Mono
(avance/em 0.6364, capHeight/em 0.7273): si hay que ajustar tamaños, se calcula
con esas proporciones, no a ojo.

Host Grotesk para párrafos y textos corridos. Departure Mono para el hero, el
loader y datos: son los casos puntuales.

## Verificación visual

`node scripts/capture.js <url> <dir> <ms,ms,...> [WxH]` captura la página en
instantes concretos y volca la consola. Para revisar animaciones hay que usar
esto y no `chrome --screenshot --virtual-time-budget`: el tiempo virtual solo
avanza cuando la página está inactiva, y con GSAP corriendo nunca lo está.

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

## Assets

Los SVG de píxeles se convierten a mapas de celdas en build
(`node scripts/svg-to-pixels.js`), no se parsean en runtime.

Los originales quedan en `_assets-src/` (referencia, incluida la paleta en
`colores.txt`). Lo que se sirve va en `public/`, agrupado por uso.
