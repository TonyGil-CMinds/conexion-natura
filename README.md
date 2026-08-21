# Conexión Natura

Next.js 15 (App Router) · TypeScript · GSAP · Framer Motion · Three.js (react-three-fiber)

## Comandos

```bash
npm run dev        # desarrollo
npm run build      # build de producción
npm run typecheck  # tsc --noEmit
npm run lint
```

## Organización

```
src/
├─ app/                      Rutas (App Router). Solo composición, sin lógica.
├─ components/
│  ├─ layout/                PageFrame, PageShell, SiteHeader, ThemeToggle, LocaleSwitch
│  ├─ sections/              Hero, HeroHeadline, HeroCreature, HeroMeta
│  └─ ui/                    CtaButton, ScrambleText
├─ config/                   site.ts: copy, nav, socios (fuera de los componentes)
├─ features/
│  ├─ hero-creature/         Colibrí por píxeles: estroboscopio + magnetismo
│  ├─ transitions/pixel-reveal/  PixelReveal + usePixelGrid
│  └─ loader/                Feature autocontenida
│     ├─ components/         Loader, LoaderGate, LoaderMark, FrameSequence, ProgressCounter
│     ├─ hooks/              useImagePreloader, useLoaderProgress, useFrameSequence
│     ├─ config/             loader.config.ts (fps, duraciones), mark.ts (geometría)
│     └─ index.ts            API pública de la feature
├─ fonts/                    next/font: Host Grotesk (Google) + Departure Mono (local)
├─ lib/                      gsap, motion (presets), random (PRNG con semilla), cn
└─ styles/                   tokens.css → globals.css → reset.css

public/
├─ brand/ partners/ icons/ hero/
└─ loader/  mask.svg + ballena/w2-01…10.svg

_assets-src/                 Assets originales sin procesar (no se publican)
```

Regla: cada feature expone solo lo que hay en su `index.ts`. Nada importa
archivos internos de otra feature.

## Tipografía

- **Host Grotesk** — títulos y párrafos. Variable CSS `--font-sans`.
- **Departure Mono** — usos puntuales (contador del loader, datos). `--font-mono`.

`-webkit-font-smoothing: antialiased` está aplicado en `html` (globals.css) y
reforzado en el contador del loader, para el trazo fino de la referencia.

## Loader

Fases: precarga real de assets → contador 0 → 100 interpolado con GSAP → salida
con Framer Motion → revelado de la página.

- El contador **nunca retrocede ni salta**: `useLoaderProgress` mezcla el avance
  real de descarga con el tiempo mínimo y tensa hacia el objetivo con GSAP.
- Se queda en 99 hasta que la precarga termina *y* se cumple `minDurationMs`, para
  que el 100 signifique algo. `maxDurationMs` fuerza la salida si un asset falla.
- La secuencia de la ballena monta los 10 cuadros a la vez y alterna opacidad
  (cambiar el `src` de una sola imagen parpadea en el primer ciclo).
- El glifo central usa la misma geometría dos veces: silueta al 14 % y relleno
  recortado que sube con el progreso.

Ajustes en `src/features/loader/config/loader.config.ts`:

| Campo | Qué hace |
|---|---|
| `sequence` | Secuencia activa (`ballena`) |
| `fps` | Velocidad del flipbook (8) |
| `minDurationMs` | Tiempo mínimo en pantalla (2600) |
| `maxDurationMs` | Corte de seguridad (9000) |
| `exitDurationS` | Fundido de salida (0.8) |

Uso:

```tsx
<LoaderGate preload={['/hero/asset-hero-whale.svg']}>
  <Hero />
</LoaderGate>
```

## Hero: criatura de píxeles y titular

### Mapa de píxeles

`node scripts/svg-to-pixels.js` convierte `asset-hero-colibri.svg` en
`src/features/hero-creature/config/colibri.ts` (versionado, no se parsea SVG en
runtime). Resultado: malla 26×39, paso 18.52, cuadro 15.243 (82.3 % del paso),
345 píxeles en 2 tonos.

El SVG viene con irregularidades de exportación — los rects miden entre 15.243 y
16.336 px y se desvían hasta 3px de la malla. Encajarlos no pierde información
(el script falla si dos rects caen en la misma celda) y a cambio deja una
estructura discreta con la que se puede animar por píxel y calcular vecindades.

Se reconstruye con 345 nodos en vez de pintar el SVG porque hacen falta píxeles
independientes: una sola imagen no admite entrada por píxel ni repulsión
individual. Todo se posiciona en porcentaje del ancho, así que la malla escala
con el hero sin perder el encaje ni los huecos.

### Entrada estroboscópica

Cada píxel parpadea entre 2 y 6 veces antes de quedarse encendido, en una ola
que sube de abajo hacia arriba (la misma dirección que la transición). Usa
`steps(1)`: un fundido lo convertiría en una aparición suave, lo contrario de un
estroboscopio. El número de destellos es par porque con `yoyo` eso deja un total
impar de pasadas, y el píxel termina encendido.

Quien apaga la malla antes de la entrada es el hook, ya en el cliente, no el CSS:
si el CSS la apagara, un fallo de JavaScript dejaría el colibrí invisible.

### Repulsión magnética

Al acercar el puntero, los píxeles cercanos se apartan de él: caída cuadrática
sobre un radio de 130px y hasta 26px de desplazamiento, con suavizado
exponencial normalizado por delta de tiempo (`tau` 130ms) para que vuelvan solos
al soltar y el movimiento no dependa de los fps.

Dos decisiones que importan:

- Las posiciones de reposo se miden una vez y se recalculan al cambiar el tamaño,
  no en cada movimiento: leer `getBoundingClientRect` por píxel y por evento
  fuerza recálculo de maquetación constante.
- Escucha en `window`, no en la malla. El titular se solapa con el colibrí, y
  capturar el puntero en la malla obligaba a desactivar los eventos del
  contenido, lo que impedía seleccionar el texto del titular.

Solo se escribe en el DOM cuando el desplazamiento cambia de forma apreciable, y
no se activa sin puntero fino (`hover: hover and pointer: fine`).

### Revuelto del titular

`src/components/ui/ScrambleText.tsx` revuelve carácter a carácter. El texto real
se renderiza en el servidor, así que sin JavaScript el título se lee igual. Al
montar, si todavía no toca animar, los caracteres se congelan en glifos
aleatorios: dejarlos con el texto final haría que al descubrirse la página se
viera el titular ya resuelto y después revolviéndose.

Los espacios no se revuelven (las palabras perderían su forma) y el glifo cambia
por pasos, no en cada cuadro: a 60fps el texto sería una mancha. El `aria-label`
del padre lleva el texto completo porque los caracteres van como decorativos —
mientras se revuelven, un lector de pantalla leería basura.

El temporizador de seguridad que asienta el texto si la señal no llega va holgado
(15s) a propósito: con 6s se disparaba antes que el arranque real y se comía la
animación.

### Las dos señales de descubrimiento

`src/features/loader/context/reveal.tsx` expone dos booleanos, y la distinción
es la clave de que las entradas se vean:

| Señal | Cuándo | Para qué |
|---|---|---|
| `isVisible` | pantalla ya tapada por la malla | montar contenido sin que se vea el cambio |
| `hasEntered` | la malla ya se retiró | disparar animaciones de entrada |

Con `isVisible` las entradas se ejecutaban detrás de la cortina de píxeles y el
usuario no veía ni el revuelto ni el estroboscopio.

## Transición de píxeles

`src/features/transitions/pixel-reveal/` — malla de cuadros que tapa la pantalla
y la vuelve a destapar, en dos fases:

1. **Cubrir**: cada píxel escala 0 → 1 en una ola que sube de abajo hacia arriba.
2. **Revelar**: la misma ola, ahora 1 → 0, dejando ver el hero.

Claves de la implementación:

- El corte de loader → página ocurre **con la pantalla tapada** (`onCovered`).
  Por eso `LoaderGate` tiene fases separadas `covering` y `revealing`: si el
  loader se desmontara al llegar a 100, el salto se vería por los huecos.
- El desfase aleatorio por celda (`jitter`) es lo que evita que se lea como una
  persiana. Sin él la ola es una línea recta.
- Los colores se reparten por altura: verde en toda la pantalla, azul y crema
  solo en la zona baja (`paletteWeights`), como en la referencia.
- Solo se anima `scale`, sin `will-change`: son cientos de nodos y promoverlos
  todos a capa propia agota memoria de GPU.
- La malla hereda el paso y la proporción cuadro/hueco del colibrí, para que los
  píxeles de la transición y los de la criatura se lean como el mismo material.
  El paso es 2× el del sprite: a 1× (18.52px) serían unas 3.100 celdas a pantalla
  completa, y medido da p95 de 24.8ms con 19 cuadros sobre 32ms y picos de 176ms.
  A 2× son unas 800 celdas, p95 de 18ms y ni un cuadro lento. Al ser múltiplo
  entero, una celda de la transición cubre 2×2 del colibrí.
- Los cuadros escalan hasta `coverScale` (paso/cuadro, más un 4 %) para cerrar el
  hueco justo al tapar: durante el trayecto se leen como píxeles separados y en el
  pico no dejan ver nada.
- La aleatoriedad va con semilla (`src/lib/random.ts`) para que servidor y
  cliente generen la misma malla y no haya desajuste de hidratación.
- `prefers-reduced-motion`: se conserva el corte, pero sin ola ni desorden.

Ajustes en `config/pixelReveal.config.ts`:

| Campo | Qué hace |
|---|---|
| `pitch` / `cellSize` | Paso 37.04 y cuadro 30.5 (de ahí los huecos) |
| `cellDuration` | Escalado de un píxel (0.34 s) |
| `coverSpan` / `revealSpan` | Recorrido de la ola (0.85 / 0.95 s) |
| `jitter` | Desorden dentro de cada fila (0.22 s) |
| `holdS` | Pausa con la pantalla cubierta (0.12 s) |

## Hero

`src/components/sections/Hero.tsx` + `src/components/layout/SiteHeader.tsx`.

El contenido va dentro de `PageShell`, que lo acota a `--content-max` (1600px) y
lo centra: más allá de ese ancho la composición se estira y el titular se separa
demasiado de la criatura. El loader y la transición de píxeles quedan fuera a
propósito, porque van a pantalla completa: acotar la transición dejaría los
laterales sin cubrir justo cuando tiene que tapar el cambio de contenido.

### La retícula de filetes

`PageFrame` es dueño de los filetes; ni la cabecera ni el hero los dibujan. La
razón es el ancho acotado: como bordes de un elemento, las horizontales se
cortaban donde acababa el contenido y dejaban de llegar al borde del viewport.

- **Horizontales**: viven en bandas a sangre (`.band`), de un borde del viewport
  al otro, con el contenido acotado por dentro.
- **Verticales**: una capa (`.rules`) que recorre toda la página, por detrás del
  contenido, así que llegan hasta el borde superior y cruzan las dos bandas.

Por eso la cabecera no tiene fondo propio: era del mismo color que la página y
solo servía para tapar las verticales en su franja. Si pasa a ser fija habrá que
devolvérselo y subir la capa de filetes por encima.

La altura se reparte con flex, no con `calc(100dvh - cabecera - barra)`: no hay
fórmulas que mantener sincronizadas con la altura de cada banda.

La retícula del diseño está en tokens, no repartida por los componentes:
`--container-margin` (44px, los filetes verticales), `--container-pad` (51px),
`--header-height` (94px) y `--header-side` (187px, las celdas laterales de la
cabecera). Los enlaces quedan centrados respecto al viewport porque las celdas
laterales son de ancho fijo, no `auto`.

### Tipografía del hero

Todo el hero va en **Departure Mono**: es un caso de uso puntual, como el loader.
Host Grotesk queda para párrafos y textos corridos.

Los cuerpos salen de las métricas reales del `.otf` (avance/em 0.6364,
capHeight/em 0.7273 sobre 550 unidades), despejadas contra la referencia a
1280px de ancho:

| Elemento | Cuerpo | Tracking |
|---|---|---|
| H1 (3 líneas) | `--text-display` 76px | 0.03em |
| CTA | `--text-cta` 25px | 0.145em |
| Nav | `--text-nav` 15px | 0.05em |
| Antetítulo | `--text-eyebrow` 14px | 0.02em |
| Créditos | `--text-caption` 9px | 0.06em |

El H1 lleva `margin-left: -0.05em` de alineación óptica: a 85px de cuerpo el
lateral izquierdo del glifo deja unos 4px de aire que descuadran el título
respecto al borde del botón.

### Botón principal

`src/components/ui/CtaButton.tsx` — dos estados:

| | Fondo | Icono | Sombra |
|---|---|---|---|
| Reposo | verde plano | oculto | ninguna |
| Hover / foco | degradado verde | entra deslizando | amarilla, abajo-izquierda |

La sombra no se anima. Es una capa del mismo tamaño y radio que vive detrás del
botón y en reposo queda exactamente tapada por él; se revela porque el botón se
desplaza 7px arriba-derecha. Así un solo `transform` gobierna el efecto, y el
botón tiene que mantener un fondo opaco para que la sombra siga oculta.

El degradado es una capa aparte con `opacity`, no un cambio de `background`: CSS
no interpola entre un color plano y un degradado.

**El degradado se mueve** (`--duration-flow`, 12s por ciclo). Los topes van
A → B → A y el mosaico mide el doble del botón, así que al desplazar
`background-position` un mosaico completo el patrón coincide consigo mismo y el
bucle no da salto; con dos topes (A → B) el reinicio se vería como un corte. En
reposo del hover la ventana visible muestra la primera mitad del mosaico, o sea
el degradado del diseño.

Consecuencia a tener en cuenta: a mitad de ciclo el degradado queda espejado
(verde claro a la izquierda). Es inseparable de un barrido con bucle limpio. Para
fijar la dirección a costa de recorrer menos rango, el cambio es en `.gradient`:
dos topes en vez de tres, `background-repeat: no-repeat`, `background-size: 140%`
y `animation-direction: alternate` — la ventana desliza sobre la rampa sin llegar
a invertirla nunca.

La animación está pausada mientras la capa no se ve: animar algo invisible solo
gasta repintado. Pausada y no retirada, para que un segundo hover la retome donde
iba en lugar de volver al principio.

Los estados van en CSS (`:hover, :focus-visible`) y no en variantes de Framer
Motion, para que el teclado reciba el mismo tratamiento que el ratón sin
duplicar la definición.

### Tema

El tema sale de roles semánticos (`--bg`, `--fg`, `--accent`, `--rule`), y
`ThemeToggle` solo escribe `data-theme` en `<html>`: ningún componente conoce el
tema. Arranca en claro, que es el del diseño. El loader es oscuro por sí mismo,
porque usa los colores de marca directamente y no los roles.

## Verificación visual

```bash
npm run dev
node scripts/capture.js http://localhost:3000 ./tmp 800,3000,4400,6500 1280x832

# con un quinto argumento captura además el estado :hover de ese selector
node scripts/capture.js http://localhost:3000 ./tmp 10000 1280x832 "a[href='#registro']"
```

Captura la página en los instantes indicados y volca la consola. Va por CDP y
espera en tiempo real a propósito: el modo simple de Chrome
(`--screenshot --virtual-time-budget`) no sirve para esto, porque el tiempo
virtual solo avanza cuando la página está inactiva y aquí nunca lo está.

## Pendiente

- `loader-sequences/colibri` y `loader-sequences/jaguar` llegaron vacías. Al
  añadir los cuadros, registrarlas en `LOADER_SEQUENCES` con el mismo patrón.
- `asset-hero-jaguar.svg` parece una exportación fallida: mide 21×40 px y usa
  ámbar y negro, no la paleta. El colibrí (476×716) y la ballena (542×616) sí
  están bien.
- `LocaleSwitch` solo guarda el estado visual: no hay traducciones ni enrutado
  por idioma.
- El tema oscuro funciona a nivel de tokens, pero no está diseñado: el toggle
  invierte fondo y texto y poco más.
- `ThemeToggle` no persiste la elección. Hacerlo pide un script en línea que
  aplique el tema antes del primer pintado, o la página parpadea al recargar.
- Menú compacto: por debajo de 900px los enlaces de la cabecera se ocultan y el
  colibrí se retira. Falta diseñar esa versión.
- Three.js está instalado y listo, pero todavía no hay escena 3D.
#   c o n e x i o n - n a t u r a  
 