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
├─ app/                      Rutas: `/`, `/agenda`, `/speakers`, `/faq`.
├─ components/
│  ├─ layout/                PageFrame, PageShell, SiteHeader, ThemeToggle, LocaleSwitch
│  ├─ sections/              Hero, Faq, PageCover, PageIntro
│  └─ ui/                    CtaButton, ScrambleText, PixelMosaic, EmptyState
├─ config/                   site.ts, faq.ts, pages.ts: copy fuera de los componentes
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

## Hero

`src/components/sections/`: `Hero` compone, y cada pieza se ocupa de lo suyo —
`HeroHeadline` (titular), `HeroMedia` (campo de píxeles + foto), `HeroCountdown`
(cinta de cuenta atrás).

El hero ocupa todo el ancho del contenedor y **no** lleva márgenes de retícula
propios: los necesita la columna de texto, pero la capa de medios y la cinta de
la cuenta atrás miden **un viewport completo**.

Esas dos capas escapan del ancho acotado con `width: 100vw; left: 50%;
transform: translateX(-50%)`, que funciona porque `PageShell` está centrado. Y el
recorte de lo que sobresale vive en `PageFrame`, no en el hero: dentro del hero
cortaba a la altura del contenido y dejaba el ave separada del borde de la
pantalla. Se usa `overflow-x: clip` y no `hidden` para no crear un contenedor de
scroll que rompería un `position: sticky` más adelante.

El rótulo `CONEXION500` va como imagen (`logo-horizontal-blanco.svg`, 1100×117) y
no como texto: es un logotipo, con formas propias que no se componen con la
tipografía. En la cabecera solo va la X (`icon-logo.svg`).

### Retícula y tipografía

Cuatro filetes verticales: los bordes del contenedor (`--container-margin`, 88px)
y dos interiores a `--header-side` (222px) de cada lado, que separan las columnas
de la cabecera y siguen bajando por toda la página. Los dibuja `PageFrame`.

El botón tiene ancho propio (`--cta-width`, 380px) y no hereda `--header-side`:
cruza el filete de la primera columna y necesita aire para el icono del hover.

El rótulo ocupa todo el ancho útil del hero, entre los dos filetes del contenedor,
así que crece con la pantalla sin tope. No hay que reservarle sitio: **el ave pasa
por delante** y su pico cruza el rótulo.

Orden de capas: campo 0 · contenido 1 · ave 2 · degradado inferior 3 · cinta 4.

**El navbar no lleva filetes verticales.** La capa de filetes arranca en
`--header-height`, y la cabecera no tiene divisores de celda propios.

Los cuerpos salen de las métricas reales del `.otf` (avance/em 0.6364,
capHeight/em 0.7273) despejadas contra la referencia a 1280px:

| Elemento | Cuerpo | Tracking |
|---|---|---|
| Titular (3 líneas) | `--text-display` 38px | 0 |
| Fecha y sede | `--text-nav` 15px | 0.05em |
| CTA | `--text-cta` 21px | 0.145em |
| Notas y cinta | `--text-note` 13px | 0.02em |

El titular admite **tramos** con resalte (`SITE.event.headline`) porque en
versiones anteriores el color cambiaba a mitad de línea. Ahora no se usa, pero la
estructura se mantiene: el resalte es decisión de diseño por tramo, no por línea.

### Campo de píxeles y foto

`hero-green-pixels-2.svg` va como imagen, no reconstruido celda a celda: su
relleno es un degradado continuo que cruza toda la figura más una capa de ruido
del propio SVG. Partirlo en celdas obligaría a recomponer las dos cosas y
perdería el ruido.

Las dos sangran hasta el borde derecho del viewport.

El tamaño del ave se fija **por altura** (`clamp(480px, 68vh, 860px)`) y no por
ancho: lo que la limita es el hueco hasta el borde inferior, y eso depende del
alto del viewport. Midiéndola en `vw` crecía sin control en pantallas anchas.

### Ritmo vertical

Los huecos del hero son tokens (`--hero-pad-top`, `--hero-gap-wordmark`,
`--hero-gap-headline`, `--hero-gap-cta`, `--hero-gap-note`, `--hero-gap-invite`,
`--hero-bottom`) con dos escalones por **altura** de viewport (860px y 720px). El
hero tiene que caber en una pantalla: en portátiles se aprieta en lugar de dejar
crecer la página. A 1192×672 sin los escalones el contenido desbordaba 146px.

El bloque de registro se empuja al fondo con `margin-top: auto`, pero lleva
`padding-top` además: el margen automático se anula cuando no sobra alto, y sin el
relleno el botón se pegaba al titular.

Contrapartida conocida: a alturas grandes (1200px y más) todo el sobrante se
acumula en ese hueco, porque el bloque queda anclado abajo junto a la cinta. No
hay referencia de diseño para esas alturas.

Entra con un fundido y un desplazamiento vertical (Framer Motion, disparado por
`useHasEntered`).

El bajo de la capa lleva un degradado del color de fondo a transparente para que
el corte del encuadre de la foto no se vea. Va a todo el ancho y no solo sobre la
foto: un borde vertical se notaría al cruzar los cuadros del campo.

### Cuenta atrás

Cinta métrica a todo el ancho de la pantalla, con el marcador fijo en el centro:
64px por día, marcas menores
cada 8px dibujadas con un degradado repetido (no un nodo por marca), y una lupa
que agranda las cifras cercanas al marcador.

El cálculo va en el cliente y después del montaje: el número depende del día en
que se mire, y hacerlo en el servidor lo dejaría congelado en la fecha de
compilación y provocaría desajuste de hidratación. La fecha del evento está en
`SITE.event.date`.

### Entrada estroboscópica y repulsión magnética

> **Sin destino ahora mismo.** Los dos efectos se hicieron para mallas de píxeles
> reconstruidas celda a celda; el hero actual usa una foto y un SVG con degradado,
> así que `PixelSprite`, `PixelField` y sus hooks están sin uso. El código sigue en
> `src/features/hero-creature/` a la espera de decidir dónde van.

Cada píxel parpadea entre 2 y 6 veces antes de quedarse encendido, en una ola
que sube de abajo hacia arriba (la misma dirección que la transición). Usa
`steps(1)`: un fundido lo convertiría en una aparición suave, lo contrario de un
estroboscopio. El número de destellos es par porque con `yoyo` eso deja un total
impar de pasadas, y el píxel termina encendido.

Quien apaga la malla antes de la entrada es el hook, ya en el cliente, no el CSS:
si el CSS la apagara, un fallo de JavaScript dejaría el colibrí invisible.

Con la repulsión magnética, al acercar el puntero, los píxeles cercanos se apartan de él: caída cuadrática
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

### Indicador del navbar

`src/components/layout/PrimaryNav.tsx`. El zigzag
(`public/selected-indicator.svg`) se pinta de izquierda a derecha al seleccionar
un enlace y se despinta por donde vino al dejar de estarlo. Es una sola
transición de `clip-path`, así que los dos sentidos salen gratis: al cambiar de
enlace, uno se despinta y el otro se pinta a la vez.

- Tiene que ser `clip-path` y no `width`: el ancho recalcularía el mosaico y el
  zigzag se vería comprimirse en vez de dibujarse.
- El motivo tiene periodo 24px y el archivo mide 48, así que `repeat-x` encaja
  sin costura a cualquier ancho de enlace.
- Va en posición absoluta para que aparecer y desaparecer no mueva la fila de
  enlaces.
- Ritmo constante (`--ease-paint: linear`). Con la curva de salida del proyecto
  el trazo se adelantaba —90 % del recorrido en el primer tercio del tiempo— y no
  se leía como algo que se dibuja.

El estado seleccionado sale de la ruta (`usePathname()`), no de un clic: así el
indicador acierta también al entrar directo a una URL o al volver con el botón
atrás. Solo los enlaces a rutas pueden estar seleccionados; los que apuntan a
secciones de la portada (`/#agenda`) llevan ancla, y una ancla no es un destino
que la navegación pueda marcar como actual.

El ítem de la ruta actual va además en color de acento, acompañando al zigzag.

El color (#A2E136) viene dentro del SVG y no de un token; es un verde que no está
en `colores.txt` (el más cercano es green-soft #9DE250). Si tiene que responder al
tema, hay que pasar el archivo a `mask-image` y pintarlo con una variable.

## Páginas interiores (Agenda y Ponentes)

`/agenda` compone `PageCover` + `EmptyState`; `/speakers`, `PageCover` +
`PageIntro`. El copy de las dos está en `src/config/pages.ts`.

La ruta de ponentes es `/speakers` y su rótulo en el menú "Ponentes": el idioma de
la URL y el del contenido no tienen que coincidir.

### Portada

`PageCover` monta la fotografía a sangre (`100vw`, recortada con
`object-fit: cover`), el mosaico de píxeles encima, y el rótulo dentro de un panel
de color alineado al filete de la retícula.

| Prop | Qué hace |
|---|---|
| `tone` | Color de acento: `yellow` (agenda) o `lime` (ponentes) |
| `seed` | Patrón del mosaico |
| `density` | Proporción de celdas con color |
| `hasGradientBlock` | Bloque en escalera con degradado, al borde derecho |

El tono viaja como variable CSS (`--cover-accent`), así que el mosaico no conoce
la paleta de cada página: le basta el color que le pasa la portada.

### Bloque en degradado (Ponentes)

`asset-escalera.svg` (429×435), apoyado en la esquina inferior derecha de la
portada con `background-size: auto 100%`: se ajusta a la altura y el ancho lo pone
la proporción del asset. A 1280×832 da los 428×432 del diseño.

Va como imagen de fondo y no como máscara sobre un degradado propio: el asset trae
su forma y su degradado ya resueltos (lima a azul, en diagonal), así que no hay
nada que recomponer.

### Mosaico

`PixelMosaic` reparte celdas: la mayoría transparentes (dejan ver la foto), unas
en amarillo y otras del color de fondo. Va **sin JavaScript**: las celdas se emiten
en orden y la retícula las coloca con `auto-fill`. Medir el viewport para calcular
filas y columnas obligaría a un componente de cliente para algo decorativo.

Dos detalles que costaron una vuelta:

- Las columnas van con `minmax(var(--mosaic-cell), 1fr)`, no con pista fija. Con
  pista fija, `auto-fill` cabe un número entero de celdas y deja el resto del
  ancho sin cubrir — hasta 85px de foto sin mosaico en el borde derecho.
- `--mosaic-cell` **escala con el ancho** (`clamp(52px, 6.7vw, 130px)`). Con lado
  fijo, el número de columnas crece con la pantalla, el mosaico se densifica y el
  patrón deja de ser el elegido. Con 6.7vw el recuento se mantiene en 14 columnas
  de 1280 a 1920, y a 1280 la celda mide los 86px del diseño.

### La semilla

El patrón sale de `createRandom(seed)`, nunca de `Math.random()`: si no, servidor y
cliente generarían mosaicos distintos y React reportaría desajuste.

La semilla (13) se eligió barriendo las 400 primeras con tres criterios: entre 12 y
18 celdas amarillas, repartidas entre las dos mitades, y **ninguna asomando junto
al panel del rótulo** — una celda amarilla en el borde del panel lo convierte en
una escalera y parece un error de maquetación. Solo 4 de 400 semillas cumplían las
tres. El barrido se hizo simulando el reparto en texto, no a base de capturas.

### Estado vacío

`EmptyState` (agenda) centra el aviso y el separador en el hueco que queda bajo la
portada. El separador es decorativo (`alt=""`); el aviso informa, así que va como
texto.

`PageIntro` (ponentes) reparte titular y apoyo en dos columnas `1.4fr 1fr`,
alineadas **por arriba**: el titular tiene tres líneas y el apoyo dos, y centrarlas
dejaría el icono flotando a media altura.

## FAQ

Página propia en `/faq` (`src/app/faq/page.tsx`), componente en
`src/components/sections/Faq.tsx`, contenido en `src/config/faq.ts` (14 preguntas).

La ruta **no** lleva `LoaderGate`: el loader es la entrada al sitio, no un peaje en
cada ruta. Por eso el armazón se compone en cada página en vez de en el layout
raíz — solo la portada necesita envolverlo en el loader.

El bloque ocupa **exactamente la columna central** de la retícula: desde el filete
interior izquierdo hasta el derecho, con
`margin-inline: calc(var(--container-margin) + var(--header-side))`. Por debajo de
1100px pasa a ocupar el ancho del contenido, o la columna se queda sin medida.

### Tipografía

| Elemento | Fuente | Cuerpo |
|---|---|---|
| Rótulo `FAQ` | Departure Mono | `--text-section` 86px |
| Pregunta | Host Grotesk | `--text-question` 16px |
| Respuesta | Host Grotesk | `--text-answer` 13px |

Es el primer bloque donde Host Grotesk hace el trabajo principal: son textos
corridos, y el mono se queda para el rótulo.

La respuesta lleva `max-width: none` para anular el tope de medida que
`globals.css` pone a todo `<p>`: aquí la columna de la retícula ya acota la línea,
y con 62ch la respuesta rompía antes de tiempo.

### Comportamiento

Acordeón de una sola abierta. Con catorce preguntas, permitir varias deja la lista
imposible de recorrer. La primera arranca abierta porque da contexto al resto, y
volver a pulsar la abierta la cierra — si no, no hay forma de plegar la lista.

El panel se anima en alto (`height: 0` ↔ `auto`, Framer Motion). El elemento que
se anima **no puede llevar relleno propio**: el relleno lucharía contra el
`height: 0` y dejaría un resto visible al cerrarse, así que va en el párrafo de
dentro.

### Accesibilidad

Cada pregunta es un `<button>` con `aria-expanded`, enlazado a su panel por
`aria-controls`; el panel es un `role="region"` con `aria-labelledby` al botón. Los
`<h3>` envuelven al botón en vez de sustituirlo, así que el índice de la página
sigue teniendo sentido y el acordeón se maneja con teclado.

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
- La malla habla el lenguaje del campo de píxeles del hero: cuadros grandes y
  contiguos (media celda del asset, 74.25px) en lugar de la malla fina con huecos
  de versiones anteriores, que venía del colibrí de píxeles y ya no está en la
  página. A celda completa salen 54 cuadros en pantalla y la ola no tiene
  resolución para leerse; a la mitad, unas 216.
- El color reproduce el degradado del campo: verde oscuro arriba, lima abajo, con
  un 16 % de celdas en lima como las brillantes del campo. Que la fila superior
  sea casi del color del fondo no impide tapar el cambio de contenido —las celdas
  siguen siendo opacas— y a cambio la malla se lee como el campo materializándose.
- La aleatoriedad va con semilla (`src/lib/random.ts`) para que servidor y
  cliente generen la misma malla y no haya desajuste de hidratación.
- `prefers-reduced-motion`: se conserva el corte, pero sin ola ni desorden.

Ajustes en `config/pixelReveal.config.ts`:

| Campo | Qué hace |
|---|---|
| `pitch` / `cellSize` | Paso 37.04 y cuadro 30.5 (de ahí los huecos) |
| `cellDuration` | Escalado de un píxel (0.2 s) |
| `coverSpan` / `revealSpan` | Recorrido de la ola (0.45 / 0.5 s) |
| `jitter` | Desorden dentro de cada fila (0.12 s) |
| `holdS` | Pausa con la pantalla cubierta (0.06 s) |

## Ancho de página y retícula

El contenido va dentro de `PageShell`, que lo acota a `--content-max` (1600px) y
lo centra: más allá de ese ancho la composición se estira y el titular se separa
demasiado de la foto. El loader y la transición de píxeles quedan fuera a
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

### Botón principal

`src/components/ui/CtaButton.tsx` — dos estados:

| | Fondo | Icono | Sombra |
|---|---|---|---|
| Reposo | lima plano | oculto | ninguna |
| Hover / foco | degradado en movimiento | entra deslizando | amarilla, abajo-izquierda |

La sombra no se anima. Es una capa del mismo tamaño y radio que vive detrás del
botón y en reposo queda exactamente tapada por él; se revela porque el botón se
desplaza 7px arriba-derecha. Así un solo `transform` gobierna el efecto, y el
botón tiene que mantener un fondo opaco para que la sombra siga oculta.

El degradado es una capa aparte con `opacity`, no un cambio de `background`: CSS
no interpola entre un color plano y un degradado.

Con el botón a 328px, el rótulo a 21px no dejaba hueco para el icono del hover y
se solapaban: el icono está fuera del flujo y mide 20px.

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
tema. Arranca en oscuro, que es el del diseño. El loader también es oscuro por sí
mismo: usa los colores de marca directamente, no los roles.

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

- La referencia del FAQ abría con **"¿Qué es Conexión 500?"**, una pregunta que no
  está en la lista entregada, y ordenaba las demás de otra forma. Se usó la lista
  tal cual, en su orden. Si esa pregunta va, hay que añadirla a `faq.ts`.
- **El rótulo no tiene variante clara.** `logo-horizontal-blanco.svg` se
  actualizó a 1100×117 pero `logo-horizontal-dark.svg` sigue en 171×30, la
  medida antigua. Con el tema claro activado el rótulo queda ilegible: hace
  falta reexportar la variante oscura al tamaño nuevo.
- **Estroboscopio y repulsión magnética están sin destino** (ver la sección).
  Reconstruir el campo nuevo celda a celda recuperaría el estroboscopio a costa
  del ruido del SVG; el magnetismo sobre cuadros de 148px probablemente no
  funcione visualmente.
- `loader-sequences/colibri` y `loader-sequences/jaguar` llegaron vacías. Al
  añadir los cuadros, registrarlas en `LOADER_SEQUENCES` con el mismo patrón.
- `asset-hero-jaguar.svg` parece una exportación fallida: mide 21×40 px y usa
  ámbar y negro, no la paleta.
- `LocaleSwitch` solo guarda el estado visual: no hay traducciones ni enrutado
  por idioma.
- **El mosaico de las portadas está generado**, no es el asset del diseño: las
  referencias muestran patrones concretos que no se entregaron. Si llegan los SVG,
  se colocan tal cual y las semillas dejan de hacer falta.
- `speakers-portada.png` también mide 1280×430: mismo problema de nitidez por
  encima de ese ancho.
- La semilla está afinada para desktop (14 columnas). En móvil el recuento cambia,
  el patrón se recompone y una celda puede volver a caer junto al panel.
- `agenda-portada.png` mide 1280×430: por encima de ese ancho se amplía y pierde
  nitidez. Convendría una versión a 2x.
- El tema claro funciona a nivel de tokens, pero el diseño es el oscuro.
- `ThemeToggle` no persiste la elección. Hacerlo pide un script en línea que
  aplique el tema antes del primer pintado, o la página parpadea al recargar.
- Menú compacto: por debajo de 900px los enlaces de la cabecera se ocultan y las
  verticales interiores desaparecen. Falta diseñar esa versión.
- La cinta de la cuenta atrás es estática: no se sabe si debe desplazarse.
- Three.js está instalado y listo, pero todavía no hay escena 3D.
