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
├─ app/[locale]/             Rutas por idioma: `/es`, `/en` y sus interiores.
├─ app/api/                  Endpoints (fuera de `[locale]`: no tienen idioma).
├─ i18n/                     LOCALES, getDictionary y los diccionarios es/en.
├─ components/
│  ├─ layout/                PageFrame, PageShell, SiteHeader, SiteFooter, ThemeToggle…
│  ├─ sections/              Hero, Faq, PageCover, PageIntro, SpeakerList
│  └─ ui/                    CtaButton, ScrambleText, PixelMosaic, EmptyState, social-marks
├─ config/                   site.ts, faq.ts, pages.ts, speakers.ts: copy y datos
├─ features/
│  ├─ hero-creature/         Colibrí por píxeles: estroboscopio + magnetismo
│  ├─ transitions/stairs-reveal/ StairsReveal: columnas escalonadas
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

- **IBM Plex Mono** — texto corrido: preguntas y respuestas del FAQ, rótulos de
  lista, avisos. Variable CSS `--font-body`.
- **Departure Mono** — hero, loader, rótulos de sección y datos. `--font-mono`.

Host Grotesk se retiró: al pasar los párrafos a IBM Plex Mono se quedó sin ningún
uso, y una fuente cargada que nadie pinta es peso de descarga.

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

### Una vez por pestaña

El loader se ve una sola vez por sesión de pestaña: al volver a la portada desde
otra ruta no reaparece, y al cerrar la pestaña y abrirla de nuevo sí.
`sessionStorage`, no `localStorage`, precisamente por eso.

### La cabecera no asoma sobre el loader

La cabecera vive en el layout, **fuera** de `LoaderGate`, y va antes en el DOM.
En los primeros ~100 ms las hojas de los módulos CSS todavía no se han aplicado:
nada está posicionado y la cabecera se pintaba en flujo normal por encima del
loader. El `z-index` no arregla eso, porque en esa ventana tampoco se ha
aplicado.

Así que el script en línea marca `data-loader-pending` en `<html>` —solo en la
portada, comprobando el `pathname`, que es la única ruta con loader— y un
`<style>` **en el propio HTML** esconde la cabecera con ese atributo. Al ir en el
documento se aplica en el primer pintado, sin esperar ninguna descarga.

Quien retira el atributo es `LoaderGate` en `onCovered`: con la malla tapando la
pantalla, la cabecera vuelve sin que se vea aparecer y ya está en su sitio cuando
la malla se retira. Es `visibility` y no `display` para que no cambie de tamaño ni
se remonte.

Si el JavaScript no corre, el atributo no se pone y la cabecera se ve: el mismo
principio de siempre — quien apaga un elemento es el cliente, no el CSS.

La fase arranca siempre en `loading`, para que el árbol coincida con el del
servidor. Quien evita el parpadeo es el **CSS**: un script en línea marca
`data-loader-played` en `<html>` antes del primer pintado, y las hojas de estilo
ocultan el loader y descubren el contenido con ese atributo. El efecto de React
solo pone al día el estado. Leerlo desde React sin el script dejaba ver el loader
durante un cuadro.

Uso:

```tsx
<LoaderGate preload={['/hero/heroBird.png']}>
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

El rótulo `QUITO` va como imagen (`logo-*-ceibaquito.svg`, 1109×249) y no como
texto: es un logotipo, con formas propias que no se componen con la tipografía.
En la cabecera va el lockup de Ceiba (`icon-*-ceibaquito.svg`).

Los dos tienen **variante por tema** y las pinta `ThemedImage`: se montan las dos
y el CSS esconde la que no toca. Elegir en JavaScript enseñaría un cuadro con el
logotipo equivocado, porque el tema se resuelve después de montar. Y no sirve una
máscara con `currentColor` —lo que se hace con los iconos de una tinta— porque
estos llevan dos colores: la palabra cambia y el rombo se queda lima en las dos.

### Retícula y tipografía

Cuatro filetes verticales: los bordes del contenedor (`--container-margin`, 88px)
y dos interiores a `--header-side` (222px) de cada lado, que separan las columnas
de la cabecera y siguen bajando por toda la página. Los dibuja `PageFrame`.

El botón tiene ancho propio (`--cta-width`, 380px) y no hereda `--header-side`:
cruza el filete de la primera columna y necesita aire para el icono del hover.

El rótulo ocupa todo el ancho útil del hero, entre los dos filetes del contenedor.
No hay que reservarle sitio: **el ave pasa por delante** y su pico cruza el rótulo.

Pero no crece sin tope: `--hero-wordmark-max` lo acota **por alto**. El logotipo
de Ceiba es cuatro veces más alto en proporción que el `CONEXION500` anterior
(1109×249 frente a 1100×117), y a 720px de alto empujaba el enlace de invitación
por debajo de la cinta. El tope va en la imagen y no en el contenedor: recortar la
caja escondería parte del rótulo, mientras que `object-fit: contain` lo escala
entero, y `object-position: left` lo deja pegado al filete al sobrar ancho.

Orden de capas: contenido 1 · ave (con su retícula) 2 · degradado inferior 3 ·
cinta 4.

El ave va en una **capa propia** y no dentro de la de medios: la capa se centra
con `transform`, y un `transform` crea contexto de apilamiento — metida con el
fondo, ningún `z-index` del ave habría superado al del texto y el rótulo le
pasaba por encima al pico.

El degradado del suelo va con el ave, o sea **por delante del texto**, y de ahí
su máscara horizontal: a todo el ancho velaba el botón de registro y la nota del
cupo. La máscara lo apaga en la mitad del texto y lo deja entero sobre el ave; es
un degradado y no un corte porque un borde vertical se notaría al cruzar los
cuadros del campo.

**El navbar no lleva filetes verticales.** La capa de filetes arranca en
`--header-height`, y la cabecera no tiene divisores de celda propios.

Los cuerpos salen de las métricas reales del `.otf` (avance/em 0.6364,
capHeight/em 0.7273) despejadas contra la referencia a 1280px:

| Elemento | Cuerpo | Tracking |
|---|---|---|
| Subtítulo (2 líneas, IBM Plex Mono) | `--text-subtitle` 30px | 0 |
| Fecha y sede | `--text-nav` 15px | 0.05em |
| CTA | `--text-cta` 21px | 0.145em |
| Notas y cinta | `--text-note` 13px | 0.02em |

El subtítulo va en **IBM Plex Mono** y no en Departure Mono: es una frase, no un
rótulo. Por eso tiene cuerpo propio (`--text-subtitle`) y no comparte la escala
del hero: son 40 caracteres por línea, y a `--text-display` no cabrían entre los
filetes del contenedor.

El subtítulo admite **tramos** con resalte (`SITE.event.headline`) porque en
versiones anteriores el color cambiaba a mitad de línea. Ahora no se usa, pero la
estructura se mantiene: el resalte es decisión de diseño por tramo, no por línea.

### La foto

Hay **dos encuadres del ave**, uno por tamaño de pantalla: `heroBird.png`
(641×628) en escritorio y `asset-hero-colobri-mobile.png` (237×301, vertical y
con la rama) por debajo de 640px.

Va como `<picture>` con un `<source media>` y no como dos `<Image>` con CSS,
porque **el navegador descarga las imágenes aunque estén en `display: none`**:
así solo baja la que toca, y en móvil son 92 KB en vez de 496.

Sin `priority`: emitiría una precarga de la versión de escritorio también en
móvil, que es justo lo que se quiere evitar. Queda `loading="eager"`, y el loader
ya la calienta desde su lista.

Esa lista es **por viewport**: `HERO_ASSETS` pasa `{ src, media }` y
`useImagePreloader` descarta las que no encajan. Sin eso, en móvil el revelado
esperaba por medio megabyte de una imagen que no se va a ver. El total sale de
las que quedan, así que el porcentaje no se queda corto.


El campo de cuadros verdes del fondo (`hero-green-pixels-2.svg`) se retiró: el
ave queda sobre el fondo limpio de la interfaz. De paso arregló un problema del
tema claro, donde la fecha quedaba oscura sobre los cuadros oscuros del campo.

La foto sangra hasta el borde derecho del viewport.

El tamaño del ave se fija **por altura** (`clamp(480px, 68vh, 860px)`) y no por
ancho: lo que la limita es el hueco hasta el borde inferior, y eso depende del
alto del viewport. Midiéndola en `vw` crecía sin control en pantallas anchas.

### El hero en móvil

Por debajo de 640px cambian tres cosas del lado del ave:

- **Fecha, botón, nota y ave van anclados al fondo.** La holgura de las pantallas
  altas queda entre el subtítulo y la fecha, no debajo de la nota. El bloque de
  texto lo consigue con `margin-top: auto` en el primer elemento del grupo —los
  tres bajan juntos y conservan sus huecos— más un `padding-top` como hueco
  mínimo, porque el margen automático se anula cuando no sobra alto.
- El ave se ancla con `bottom: var(--mobile-hero-bird-bottom)`, calibrado para que
  el canto de la rama quede a la altura del bajo del botón. Medido: a 390×844 y a
  430×932 el bajo del ave coincide al píxel con el del botón, así que los dos
  siguen juntos al cambiar el alto de la pantalla.
- El pico queda por debajo del subtítulo y la rama cruza el extremo derecho del
  botón, que es lo que hace el diseño.
- **Velo del canto derecho**: oscuro pegado al borde y transparente antes de un
  tercio. Va en una capa aparte con `z-index: 4`, por delante del contenido (3 en
  móvil), porque tiene que oscurecer el extremo del botón. La cinta comparte el 4
  y va después en el DOM, así que se queda por encima.
  
  Y se desvanece por arriba con una máscara en vez de empezar en un canto recto:
  cortado a una altura fija, el corte se veía cruzando la cabeza del ave.
- **Sin filetes verticales**: las celdas de la cabecera que separaban ya no
  existen a ese ancho, así que las líneas no estructuraban nada.

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

El acento de la navegación es su propio token (`--accent-nav`, lima #D0FF00), más
brillante que el `--accent` del resto de la interfaz. El zigzag va como **máscara**
y no como imagen de fondo: el archivo trae su verde fijado (#A2E136) y así toma el
color del enlace.

El color (#A2E136) viene dentro del SVG y no de un token; es un verde que no está
en `colores.txt` (el más cercano es green-soft #9DE250). Si tiene que responder al
tema, hay que pasar el archivo a `mask-image` y pintarlo con una variable.

## Lista de ponentes

`src/components/sections/SpeakerList.tsx`, datos en `src/config/speakers.ts`.

**Los datos son de relleno.** Lo que importa es la forma del tipo `Speaker`:
cuando exista el endpoint, lo único que cambia es de dónde sale el array — pasa a
ser el resultado de un `fetch` en el componente de servidor y la lista no se
entera. El nombre va partido en `firstName` y `lastName` porque el diseño los
pinta con distinto peso.

Acordeón de una sola ficha abierta y **ninguna al entrar**: la lista se lee de un
vistazo y quien busca a alguien concreto despliega solo esa ficha. El cargo y la
empresa van alineados a la derecha, contra el control de apertura.

### La fila

Cada ficha es **una sola retícula** de cuatro columnas (retrato, nombre, cargo,
control) y dos filas, y el retrato abarca las dos. Con el retrato dentro de una
cabecera aparte, su altura empujaba las sesiones muy por debajo del nombre: 150px
de hueco vacío. Abarcando, el nombre y las sesiones quedan juntos y el retrato
sigue a su lado.

La alineación cambia con el estado: cerrada, el nombre se centra con el retrato;
abierta, sube al borde superior.

El retrato abarca las dos filas **solo cuando la ficha está abierta**. Abarcando
también cerrada se creaba una fila implícita vacía y el nombre quedaba pegado
arriba, con todo el hueco debajo.

El fondo del retrato alterna lima y azul **por posición, no por dato**: es ritmo
visual de la lista, no información del ponente.

El signo del control es una barra horizontal con una vertical encima que
desaparece al abrir: el más se convierte en menos sin cambiar de icono. El texto
de la acción va oculto pero presente, porque el signo es decorativo.

## Pie del sitio

`src/components/layout/SiteFooter.tsx`, contenido en `SITE.FOOTER`.

No sale en la **portada** ni en **registro**, que lo apagan con `hideFooter`: la
portada cabe en una pantalla y su CTA de registro ya está en el hero, así que el
pie solo lo repetiría; el registro es un flujo cerrado.

En el resto, lo compone **`PageFrame`**, no cada página, y
viviendo dentro del armazón los filetes verticales lo cruzan como cruzan el resto
de la página. (Ocupa el hueco del antiguo `bottomBar`, que se quedó sin usar al
rediseñar el hero.)

El bloque central ocupa la columna del medio de la retícula, la misma que acota el
FAQ. La ballena va a **tamaño natural (764px) aunque desborde esa columna**, como
en el diseño, donde es el elemento dominante y cruza los filetes.

Eso costó dos correcciones que no se ven en el código a simple vista:

- `flex-shrink: 0`. Es un ítem flex, y con el ancho por encima del contenedor el
  reparto por defecto lo comprimía de vuelta a la columna.
- `max-width: none`. El reset pone `max-width: 100%` a toda imagen, y ese 100 % es
  la columna.

El filete de la banda inferior va **en la banda**, a sangre, y no como borde del
contenido: es la regla del proyecto para las horizontales.

### Logos de socios sobre fondo oscuro

Los archivos vienen pensados para fondo claro: su texto va en el verde oscuro de
marca, que sobre el pie sería invisible. Cada logo lleva un `tone` en el config:

| `tone` | Tratamiento | Para |
|---|---|---|
| `mono` | `filter: brightness(0) invert(1)` | Los de un solo color: IDB Lab, C Minds, Amazonía, Climate Collective |
| `color` | `filter: invert(1) hue-rotate(180deg)` | Los que llevan bandera: Suecia y Francia — invierte la luminosidad conservando el tono de forma aproximada |

Es un apaño. Lo correcto es que diseño entregue variantes en claro.

### Marcas de redes

`src/components/ui/social-marks.tsx`: los cuatro glifos van como componentes en
línea y no como archivos en `public/`. Son de una sola ruta y tienen que tomar el
color del texto (`currentColor`); un SVG servido traería su relleno fijado. La
marca de LinkedIn se comparte con la lista de ponentes.

### Botón compacto

`CtaButton` admite `size="compact"` (414×65 frente a 380×90). Las medidas van en
variables locales del componente, así que la variante no duplica reglas.

## Transición entre páginas

`src/features/transitions/page-transition/`. El contenido sale, se navega, y el
contenido nuevo entra.

En el App Router el árbol viejo se desmonta antes de poder animarlo, así que una
salida de verdad exige **retrasar la navegación**. El componente intercepta el clic
en enlaces internos (`onClickCapture` en el contenedor, así vale para cualquier
enlace del árbol), anima la salida y solo entonces llama al router. La alternativa
—congelar el árbol saliente— es frágil y se rompe con cada versión.

Vive en el layout raíz, no en un `template`: tiene que sobrevivir al cambio de ruta.

**La cabecera queda fuera del envoltorio.** Se compone en el layout raíz, no en
cada página, por dos motivos: no debe animarse al navegar, y al sobrevivir al
cambio de ruta su indicador de activo puede animar el paso de una ruta a otra en
vez de aparecer ya pintado. Es la misma en todas las rutas, así que no había razón
para repetirla.

Como consecuencia, **el listener de clics va en el documento** y no en el
contenedor: los enlaces de la cabecera son la vía principal de navegación y viven
fuera de este árbol. Escuchando solo dentro, el navbar navegaba de golpe y sin
animación de salida.

**La navegación se dispara por temporizador, no desde el final de la animación.**
Con `onAnimationComplete` la salida corría pero el `router.push` no llegaba nunca:
la página quedaba en blanco sin navegar. El reloj corre en paralelo a la animación,
con la misma duración.

El interceptor deja pasar lo que no le corresponde: externos, `//`, `download`,
`target` distinto de `_self`, clic con Ctrl/Cmd/Shift/Alt o botón secundario,
anclas de la misma página, y `prefers-reduced-motion`.

## Páginas interiores (Agenda y Ponentes)

`/agenda` compone `PageCover` + `Schedule`; `/speakers`, `PageCover` +
`PageIntro`. El copy de las dos está en los diccionarios.

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

**La portada lleva fondo oscuro fijo, en los dos temas.** Las fotos vienen en
RGBA con la opacidad ya rebajada, así que lo que se ve depende de lo que haya
detrás: sobre el crema del tema claro quedaban lavadas. En oscuro es el mismo
color que el fondo de la interfaz, así que no cambia nada — y por eso va como una
sola declaración y no como una regla por tema, que podría quedarse a medias.

Las celdas del mosaico que **tapan** la foto van de ese mismo oscuro y no del
fondo del tema: la portada lo pasa en `--cover-surface`. Con el fondo del tema se
leían como agujeros crema recortados en la foto.

### El programa

`Schedule` pinta una fila por momento con su franja horaria a la izquierda, en
columna de ancho fijo para poder recorrer las horas sin leer los títulos. No es
un acordeón como el FAQ: el contenido de cada fila es corto y se lee de un tirón,
así que esconderlo detrás de un clic solo añadiría trabajo. En estrecho la hora
pasa arriba, porque 168px de columna dejan el título sin sitio.

El contenido sale del documento de la organización, transcrito a los
diccionarios. **Lo que estaba por decidir no se publica**: los momentos con
«Opciones:», «(tbd)» o un `xxxx` en el original van sin ese dato. Publicar una
opción como si estuviera confirmada es peor que no ponerla.

Si `items` se queda vacío vuelve el `EmptyState`, que es lo que estuvo mientras
la agenda no estaba cerrada.

**El programa usa el ancho entero**, de filete exterior a filete exterior, y no
la columna central como el FAQ: cada fila lleva hora, título, descripción y
créditos, y acotada a la columna central los créditos se apilaban. Por eso la
página apaga los filetes interiores (`hasColumnRules={false}`): ahí dentro no
estructuran nada, cruzan cada fila por la mitad.

Sobre la lista hay una barra con el **distintivo de la fecha** a la izquierda y
el **buscador** a la derecha. El distintivo va de contorno para no competir con
el CTA; en tema claro se rellena, porque el acento del tema claro como texto
sobre el crema del fondo apenas se distinguía.

`Schedule` es de cliente **por el buscador y solo por eso**: filtra la lista que
ya vino pintada del servidor, así que la agenda entera está en el HTML y se lee
sin JavaScript. La comparación va sin acentos ni mayúsculas —quien busca «Gómez»
puede escribir «gomez»— y palabra por palabra, para que «apertura ceiba»
encuentre el momento aunque las dos palabras no vayan seguidas. Busca en todo el
texto de la fila, créditos y hora incluidos. Sin resultados sale un aviso entre
los mismos dos filetes que ocupaba la lista, para que la página no salte.

El texto no llega a tocar los filetes: `.inner` declara un `--gutter` que gasta
cada bloque por su cuenta —la entradilla, la barra, cada fila—, y **no** como
`padding` de `.inner`. Puesto ahí, los filetes horizontales de las filas se
quedaban cortos por los dos lados en vez de cruzar de vertical a vertical. El
aire se recorta con el ancho (32px, 16px por debajo de 900 y ninguno en móvil,
donde ya no hay verticales que esquivar).

`.inner` no tiene escalones propios de margen: va siempre a
`--container-margin`, que es lo que mantiene las horizontales alineadas con las
verticales del contenedor —y ese token ya se encoge por debajo de 900px—.

El título del momento tiene su propio tamaño (`--text-schedule-title`, 22px a
1280 con suelo de 18): en la agenda es el primer nivel de lectura de la fila,
porque la lista se recorre por los títulos y no por las descripciones. El suelo
del `clamp` importa: sin él, a 1024px el término en `vw` lo devolvía a los 17px
del acordeón.

La entradilla tiene su propio tamaño (`--text-schedule-intro`, 18px a 1280): es
el único párrafo largo de la página y lo primero que se lee. Su medida va en
`ch`, así que la línea de lectura sigue al tamaño de la letra en vez de
quedarse fija en píxeles.

El buscador **crece un 10% al recibir el foco**. El ancho lo lleva el rótulo y
no el campo, y ahí estaba un fallo que venía de antes: con `width: min(305px,
100%)` en el campo, ese `100%` se medía contra un rótulo que se ajusta a su
contenido —o sea, contra el propio campo—, la referencia era circular y ganaba
siempre el ancho intrínseco del `input`, 194px. Los 305 no se aplicaban nunca.
Ahora el ancho está en el rótulo, el campo va al `100%` de él, y el foco
ensancha al rótulo. Solo de 641px arriba: en móvil el campo ya ocupa todo el
ancho, y como `:focus-within` gana en especificidad a la clase, sin acotarlo por
ancho la regla le habría quitado el 100% justo al tocarlo.

Los créditos van **en dos columnas**, quien presenta y quienes participan, con un
cuadro de color por función (`--credit-host`, `--credit-people`) que los
distingue sin volver a leer el rótulo; el cuadro es decorativo y va
`aria-hidden`, que el rótulo ya lo dice.

Quien **presenta** se acredita con su cargo; quienes **intervienen**, solo con su
organización: en un panel importa de dónde viene cada voz, y el cargo alargaba la
fila sin añadir nada. Son dos campos distintos de `AgendaPerson` (`role` y
`organization`) y no un recorte de la cadena al pintar: partirla por la primera
coma fallaría con «CEIBA», que ya es solo la organización, y con los cargos que
llevan comas dentro. En rejilla y no en fila: con un cargo
largo, el crédito empujaba al otro debajo aunque hubiera sitio de sobra. Y el
nombre y el cargo son **un** bloque de texto, no dos elementos flex hermanos del
cuadro —así el nombre rompía en dos líneas mientras el cargo se iba a su propia
columna—.

### Ponentes

La lista solo incluye a quienes constan **con cargo y organización**: inventarle
un título a una persona real es peor que no listarla. Quienes presentan un
momento pero no traen cargo aparecen en la agenda —donde el crédito es un nombre—
y no en la lista.

La ficha tiene un cargo y una organización, así que quien tiene dos afiliaciones
lleva la principal; la otra consta en el crédito de la agenda, donde cabe entera.

### Bloque en degradado (Ponentes)

`asset-escalera.svg` (429×435), apoyado en la esquina inferior derecha de la
portada con `background-size: auto 100%`: se ajusta a la altura y el ancho lo pone
la proporción del asset. A 1280×832 da los 428×432 del diseño.

Va como imagen de fondo y no como máscara sobre un degradado propio: el asset trae
su forma y su degradado ya resueltos (lima a azul, en diagonal), así que no hay
nada que recomponer.

### Mosaico

`PixelMosaic` reparte celdas: la mayoría transparentes (dejan ver la foto), unas
en el color de acento y otras del color de fondo. Va **sin JavaScript**: las celdas
se emiten en orden y la retícula las coloca con `auto-fill`. Medir el viewport para
calcular filas y columnas obligaría a un componente de cliente para algo decorativo.

### La entrada, en tres tiempos

La fotografía está desde el primer cuadro, las celdas del mosaico parpadean encima
con retardos salteados, y el rótulo entra al final.

El parpadeo es una animación **CSS**, no de JavaScript. Con JS había que apagar las
celdas en un efecto, después del primer pintado, y eso dejaba ver el mosaico
completo durante un cuadro antes de que desapareciera para entrar. En CSS arrancan
apagadas sin ese salto, y encender no depende de que el JavaScript llegue.

(En el hero el estroboscopio sí va en JS, porque allí el disparo es una señal de
JavaScript —`useHasEntered`— y no la carga de la página.)

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

## Transición de escaleras

`src/features/transitions/stairs-reveal/` — columnas que tapan la pantalla y la
vuelven a destapar, en dos fases:

1. **Cubrir**: cada columna crece desde los bordes hacia el centro, con un
   desfase de izquierda a derecha.
2. **Revelar**: la misma ola, ahora encogiendo, dejando ver el hero.

Claves de la implementación:

- El corte de loader → página ocurre **con la pantalla tapada** (`onCovered`).
  Por eso `LoaderGate` tiene fases separadas `covering` y `revealing`: si el
  loader se desmontara al llegar a 100, el salto se vería entre las columnas.
- **El desfase es el efecto.** En cualquier instante los cantos de las columnas
  forman una diagonal escalonada; sin desfase es una persiana.
- Cada columna son **dos paneles**, uno anclado arriba y otro abajo, que se
  encuentran en el centro. Con uno solo la pantalla se cubriría desde un borde;
  con dos, el movimiento entra por los dos cantos y el escalón se lee en
  simetría.
- Se anima `scaleY`, **no `height`**: la altura recalcula la maqueta en cada
  cuadro y la escala se queda en el compositor. Son veinte nodos, así que aquí sí
  llevan `will-change`.
- El degradado se reparte entre los dos paneles —verde oscuro arriba, lima
  abajo—, así que con la pantalla cubierta se lee como una sola superficie y no
  como dos bandas. Cada panel lleva un píxel de más en alto y ancho para cerrar
  las costuras de subpíxel.
- El recuento de columnas se mide **al montar**, no en cada `resize`: cambiarlo a
  mitad de la animación dejaría columnas nuevas en escala 0 y destaparía franjas.
- Va con **GSAP y no con Framer Motion** —aunque el efecto venga de un ejemplo en
  Framer— porque `onCovered` tiene que dispararse en el instante exacto en que no
  queda hueco, y una línea de tiempo lo dice sin depender de qué elemento termina
  último.
- `prefers-reduced-motion`: se conserva el corte, pero sin escalera.

Ajustes en `config/stairsReveal.config.ts`:

| Campo | Qué hace |
|---|---|
| `columns` / `mobileColumns` | 10 y 6: a 10 columnas en móvil el escalón no se lee |
| `panelDuration` | Recorrido de una columna (0.5 s) |
| `columnStagger` | Desfase entre columnas (0.05 s) |
| `holdS` | Pausa con la pantalla cubierta (0.06 s) |
| `ease` | `power1.inOut`, el equivalente de la curva del efecto original |

## Ancho de página y retícula

El contenido va dentro de `PageShell`, que lo acota a `--content-max` (1600px) y
lo centra: más allá de ese ancho la composición se estira y el titular se separa
demasiado de la foto. El loader y la transición de píxeles quedan fuera a
propósito, porque van a pantalla completa: acotar la transición dejaría los
laterales sin cubrir justo cuando tiene que tapar el cambio de contenido.

### La retícula de filetes

**En móvil no hay ninguna vertical**, ni las dos interiores ni las dos del
contenedor: a ese ancho las celdas de la cabecera que separaban ya no existen,
así que las líneas no estructuran nada y compiten con el contenido. Se apagan en
el armazón, así que vale para todas las rutas.

`PageFrame` es dueño de los filetes; ni la cabecera ni el hero los dibujan. La
razón es el ancho acotado: como bordes de un elemento, las horizontales se
cortaban donde acababa el contenido y dejaban de llegar al borde del viewport.

- **Horizontales**: viven en bandas a sangre (`.band`), de un borde del viewport
  al otro, con el contenido acotado por dentro.
- **Verticales**: una capa (`.rules`) que recorre toda la página, por detrás del
  contenido, así que llegan hasta el borde superior y cruzan las dos bandas. Van
  en su propio token (`--rule-vertical`, 7 % frente al 16 % de las horizontales):
  recorren toda la página y al mismo valor competían con el contenido.

Las dos verticales interiores se pueden apagar por página
(`hasColumnRules={false}`). En ponentes van apagadas: las fichas de la lista
cruzan esas columnas y las líneas atravesarían cada fila en vez de estructurar la
página.

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
tema.

Hay **dos oscuros** y no conviene confundirlos:

| Token | Valor | Para qué |
|---|---|---|
| `--color-surface` | #151D17 | Fondo de la interfaz (`--bg`), loader, extremo oscuro de la transición |
| `--color-dark` | #001D09 | Tinte de los textos sobre superficies claras: rótulo del botón, respuesta abierta del FAQ, rótulo de portada | Arranca en oscuro, que es el del diseño. El loader también es oscuro por sí
mismo: usa los colores de marca directamente, no los roles.

## Base de datos

Prisma ORM 7.10 contra **Prisma Postgres**. La versión importa: el `latest` de la
CLI es ya un 8.0.0-rc con otra arquitectura (contratos), así que las dos piezas
están fijadas a 7.10.0 —la estable— y no a `latest`.

- `prisma/schema.prisma` — modelos. El `datasource` **no lleva `url`**: en
  Prisma 7 la aporta `prisma.config.ts`, así que el esquema no toca secretos.
- `prisma.config.ts` — esquema, ruta de migraciones y comando de semilla. Importa
  `dotenv/config` porque la CLI no es Next.js y por sí sola no lee el `.env`.
- `src/lib/prisma.ts` — el cliente, uno por proceso, con el adaptador `PrismaPg`.
- `prisma/seed.ts` — semilla idempotente (`upsert` por clave única).
- `scripts/verify-prisma.ts` — una lectura real; imprime `✅ Connected`.

```bash
npm run db:verify   # comprueba la conexión
npm run db:seed     # invitaciones y un asistente de ejemplo
npm run db:studio   # explorador de datos
```

El **cliente generado no se versiona** (`/generated` en `.gitignore`): lo
reconstruye `postinstall`, así que un despliegue limpio lo tiene sin pasos extra.

`DATABASE_URL` vive solo en `.env`, que está ignorado. **El cliente es de
servidor**: importarlo desde un componente de cliente llevaría el driver de
Postgres —y la cadena de conexión— al navegador.

### Modelos

`Invitation` y `Attendee`, uno a uno. El cupo se controla en las invitaciones y
no contando asistentes: el sitio promete «uno de los 100 invitados», que es una
lista cerrada, y cada invitación admite un solo registro (`invitationId @unique`).

La fotografía no se guarda todavía: `Attendee.photoUrl` está listo, pero falta
decidir dónde se sube el archivo.

### Endpoint del registro

`POST /api/registro` crea o actualiza **por correo**: el correo identifica a la
persona, y quien vuelve a enviar el formulario está corrigiendo sus datos, no
apuntándose dos veces. De ahí el `upsert` en lugar de un `create` que fallaría
con «ya existe». `GET /api/registro?email=` devuelve un perfil; hoy nadie la
llama —el navegador se apoya en `localStorage`— y queda como la mitad que le
falta a ese apaño.

La validación vive en `features/registration/lib/attendee-input.ts`, pura y
aparte: el formulario valida para avisar mientras se escribe, pero eso es
comodidad, y al endpoint se le puede llamar sin pasar por la pantalla.

**`photoUrl` tiene que estar bajo `R2_PUBLIC_BASE_URL`.** Sin esa comprobación el
endpoint sería un sitio donde colgar cualquier enlace ajeno en la credencial de
otra persona.

Respuestas: `422` con `fields` (errores por campo, que el formulario pinta donde
están), `415` y `413` en la firma de subida, `500` con el detalle solo en el
registro del servidor.

El orden al guardar es imagen y luego datos, porque la URL forma parte del
registro. Si la subida falla no se envía nada: mejor repetir el paso que dejar
una fila sin retrato que nadie va a volver a completar. Al corregir sin imagen
nueva se conserva la anterior (`photoUrl: valor ?? undefined` en el `update`).

No hay invitaciones todavía: el registro está abierto y `invitationId` queda
nulo. Cuando las haya, el código entra como requisito en este endpoint.

## Correo de confirmación

Al registrarse sale un correo con la plantilla dinámica de SendGrid (Twilio).
El contenido vive en SendGrid; el sitio solo manda las variables.

- `src/lib/sendgrid.ts` — transporte. **Solo servidor**: la clave permite enviar
  correo en nombre del dominio. La configuración se lee al enviar y no al
  importar, así una variable que falte rompe el envío —recuperable— y no el
  arranque.
- `features/registration/lib/confirmation-email.ts` — las variables, sacadas de
  `SITE.event` y no de literales, para que corregir la hora del evento no deje el
  correo diciendo otra cosa. Los nombres de las claves los fija la plantilla.
- `scripts/verify-sendgrid.ts` (`npm run mail:verify`) — valida clave, remitente,
  plantilla y variables **sin entregar nada**, con el modo de prueba de SendGrid.
- `scripts/send-pending-confirmations.ts` — `npm run mail:pending` lista a quién le
  falta el correo y `npm run mail:pending:send` lo envía. Son **dos scripts** y no
  un argumento porque npm 11 se come el `-- --send`: lo trata como una config suya
  («Unknown cli config») y no lo reenvía.

### Se envía una sola vez

La marca es la columna `Attendee.confirmationSentAt`, no una variable en memoria:
reenviar el formulario corrige los datos y no debe repetir el correo, y si el
envío falla la marca se queda nula, así que `mail:pending` puede recuperarlo.

### Un fallo del correo no rompe el registro

La fila ya está guardada cuando se intenta el envío, y el correo es un efecto
secundario: se anota en el registro del servidor y la respuesta sale igual. Va
con `after()` de `next/server`, así que el formulario no espera al correo para
decir que la asistencia quedó confirmada.

Al registrar el error se imprime `error.response.body` y no el mensaje: SendGrid
manda «Maximum credits exceeded» con un **401**, cuyo mensaje suelto es solo
«Unauthorized» y hace pensar que la clave está mal.

### Autenticación del remitente

Que SendGrid acepte el envío no significa que el correo llegue **autenticado**.
Si el dominio del remitente no tiene publicados los CNAME de SendGrid, el mensaje
no lleva firma DKIM de ese dominio ni un return-path propio, así que nada se
alinea con el `From` y los clientes lo marcan como no autenticado — y Gmail, de
paso, bloquea las imágenes remotas.

`npm run mail:auth` lo comprueba **resolviendo el DNS de verdad**, y ahí está el
detalle que engaña: SendGrid guarda el resultado de la última validación, así que
su API sigue diciendo `valid: true` aunque los registros ya no existan. El script
consulta a un resolutor público para no leer una caché local, y además avisa si
faltan SPF y DMARC.

### El asunto lo pone el código

La versión activa de la plantilla **no trae asunto**, así que el correo llegaría
sin línea de asunto —media carpeta de spam—. Se manda a nivel de mensaje desde
`confirmationSubject(locale)`, que además resuelve el otro problema: una sola
plantilla sirve a los dos idiomas, y el asunto no puede ser una variable de
plantilla.

Consecuencia: si algún día se escribe un asunto en la plantilla, no se usará.
El asunto se edita en `confirmation-email.ts`.

### Idioma

El formulario manda su `locale` para que los enlaces del correo apunten a la
versión correcta. La fecha se escribe en dos formatos porque la plantilla pide
`dia` y `event_date` por separado.

## Imágenes en R2

Los retratos de las credenciales viven en un bucket de **Cloudflare R2**; en la
base de datos queda solo la URL (`Attendee.photoUrl`). Nunca el archivo: una
columna con bytes de imagen encarece cada consulta que ni los mira.

El navegador **sube directo a R2** con una URL firmada:

1. `POST /api/uploads/photo` con `{ contentType, size }` → `{ uploadUrl, key, url }`.
2. El navegador hace `PUT` a `uploadUrl` con el archivo.
3. Se guarda `url` en el registro.

El archivo no pasa por el servidor a propósito: ahorra una subida y esquiva el
límite de 4,5 MB de cuerpo de las funciones en Vercel, que un PNG sin fondo roza
sin esfuerzo. El tope propio está en 8 MB (`MAX_IMAGE_BYTES`).

**La clave del objeto la decide el servidor** (`attendees/<uuid>.<ext>`), no el
cliente: con un nombre elegido por quien sube se podría sobrescribir el retrato
de otra persona. La firma caduca en 10 minutos — es permiso para una subida, no
una llave del bucket.

El cliente de R2 lleva `requestChecksumCalculation: 'WHEN_REQUIRED'`. Por
defecto el SDK añade una suma CRC32 que entra en la firma pero que el navegador
no envía, y R2 responde 403.

```bash
npm run r2:verify   # firma, sube, lee por la URL pública y borra
npm run r2:cors     # regla CORS del bucket (necesita token de admin)
```

### CORS

Sin regla CORS el `PUT` firmado muere en la comprobación previa del navegador:
la URL está bien firmada, pero la petición no llega a salir. La regla admite solo
`PUT` y la cabecera `content-type`; la lectura va por la URL pública y no pasa
por CORS.

`r2:cors` requiere un token de R2 con permiso **Admin Read & Write**: la política
CORS es configuración del bucket, no un objeto. Con un token de solo objetos
—el que usa la aplicación— responde `AccessDenied`, y hay que poner la regla a
mano en el panel.

Al añadir un dominio (producción, previews) hay que sumarlo tanto a la regla CORS
del bucket como a `R2_CORS_ORIGINS`.

### El recorte va cocido en el archivo

Se sube la **zona recortada** (642×810, el hueco del retrato a 3×), no la imagen
entera. El encuadre se elige en el navegador y no viaja a ninguna columna: con la
imagen completa, al recargar la credencial se dibujaría con el encuadre por
defecto y la tarjeta cambiaría de aspecto sola. Recortando antes de subir, lo
guardado **es** lo que se ve, y pesa menos.

Al volver con un perfil guardado la credencial recupera su retrato desde R2. Eso
necesita dos cosas: `GET` en la regla CORS del bucket y `crossOrigin =
'anonymous'` al cargar la imagen. Sin ellas el lienzo queda «contaminado» y
`toDataURL()` lanza un error de seguridad: no es que la foto no se vea, es que
dejan de funcionar descargar y compartir.

```bash
npm run db:remove -- correo@ejemplo.com   # borra un registro y su retrato
```

Borrar solo la fila deja el archivo huérfano en el bucket: nadie lo referencia y
nada lo limpia después. De ahí el script.
### Variables

Las de `.env.example`. `R2_PUBLIC_BASE_URL` es hoy el subdominio `r2.dev` del
bucket; al pasar a un dominio propio basta cambiar esa variable, pero **las URL
ya guardadas en la base seguirán apuntando a `r2.dev`**: si se retira, hay que
migrarlas.

### Retícula sobre el ave

`src/features/hero-pixel-wave/`. El asset (`_assets-src/asset-green-pixels2.svg`)
se convierte a celdas en build y se reconstruye celda a celda, porque la
animación es **por píxel**: como imagen solo se podría hacer parpadear el
conjunto.

Va dentro del marco del ave y medida en porcentaje de él, no del hero: así se
queda en el mismo punto del animal cuando el alto del viewport cambia su tamaño.

La onda va en **CSS**, y el componente no lleva `'use client'`: el disparo es la
carga de la página y es un bucle ambiental, no una entrada que se pueda gastar
detrás del loader. El retardo de cada celda es negativo y proporcional a su
columna, así que en el primer cuadro la onda ya está a mitad de recorrido en vez
de arrancar con la retícula apagada.

El reposo está al 55 % y no apagado: la retícula es una pieza del diseño y tiene
que leerse siempre. Con el reposo al 20 % solo se veían las cuatro columnas
iluminadas y el asset parecía otro, más pequeño; la onda **aclara** lo que ya
está ahí. Con `prefers-reduced-motion` se queda quieta y entera.

`svg-to-pixels.js` convierte ya dos assets: la lista está en `ASSETS`, dentro del
propio script. Los rects se exportan con órdenes de comandos distintos (`M H V H
V Z` en uno, `M V H V H Z` en otro), así que en vez de reconocer un patrón se
recorre el trazo y se toman los extremos.

## Temas

El oscuro es el del diseño y no lleva atributo: los roles de `tokens.css` ya son
los suyos. `[data-theme="light"]` redefine solo los roles.

En claro los dos acentos son **#C0E619**, el verde del rombo de Ceiba: el lima del
tema oscuro se pierde sobre fondo crema y el verde base es demasiado apagado para
un botón. Lo toman el botón principal, el enlace activo del menú, el texto verde
en negrita y la pregunta abierta del FAQ.

Para que eso funcione, el botón y el FAQ pasaron de `--color-lime` (paleta) a
`--accent-nav` (rol): un token de paleta es una constante de marca y no cambia con
el tema, así que usarlo directamente dejaba el botón en lima también en claro.


## Idiomas y SEO

Dos idiomas, cada uno con su URL: `/es` y `/en`. El layout raíz vive bajo
`app/[locale]/` porque `<html lang>` cambia con el idioma y **solo el layout raíz
pinta `<html>`**: con un layout por encima, el atributo se quedaría fijo.

De ahí el `middleware.ts`: `/` y `/agenda` no existen como rutas, así que se
redirigen a `/es/…`. No negocia por `Accept-Language` a propósito — el idioma
queda en la URL, que es lo que se comparte y lo que indexa el buscador;
adivinarlo haría que dos personas vieran cosas distintas en el mismo enlace.

El conmutador de idioma son **enlaces**, no botones, y conservan la ruta: quien
está en `/es/faq` aterriza en `/en/faq`. Con un botón, la versión en inglés no
tendría dirección propia y no se podría compartir ni indexar.

Las rutas interiores **no se traducen** (`/en/registro`, no `/en/registration`):
el idioma del contenido y el de la URL no tienen que coincidir, y traducir slugs
pide un mapa de rutas que hoy no aporta nada.

### Los diccionarios

`src/i18n/dictionaries/es.ts` es la referencia y de él sale el tipo `Dictionary`,
así que **al añadir una clave en español el inglés deja de compilar** hasta
traducirla. El tipo ensancha los literales del `as const` (si no, el inglés
tendría que decir literalmente «Ponentes» para encajar) y deja las listas de solo
lectura, para que las dos puedan tener distinto número de elementos.

En los diccionarios vive **solo lo que depende del idioma**. Lo que no —fechas
numéricas, semillas del mosaico, rutas de imagen, enlaces, horas en UTC— se queda
en `src/config`: una fecha duplicada en dos diccionarios es una fecha que se
puede corregir a medias. `NAV_LINKS`, `FOOTER.legal` y `PARTNER_GROUPS` guardan
una `key` que entra en el diccionario y el `href` sin prefijo de idioma.

La copia llega a los componentes **por props**, desde el componente de servidor
que ya conoce el idioma. No hay contexto de traducción: eso obligaría a marcar
como cliente media aplicación para leer un rótulo.

Los ponentes están duplicados en los dos diccionarios porque son datos de
relleno. Cuando llegue el endpoint vendrán con su copia y ese bloque desaparece.

### Títulos

El layout pone `title.template` (`%s - CEIBA Quito`) y cada página solo dice su
nombre, así que el sufijo se escribe una vez:

| Ruta | es | en |
|---|---|---|
| `/` | CEIBA Quito - Noche de Innovación e Inversión… | CEIBA Quito - A Night of Innovation and Investment… |
| `/agenda` | Agenda - CEIBA Quito | Agenda - CEIBA Quito |
| `/speakers` | Ponentes - CEIBA Quito | Speakers - CEIBA Quito |
| `/faq` | Preguntas Frecuentes - CEIBA Quito | FAQ - CEIBA Quito |
| `/registro` | Registro - CEIBA Quito | Registration - CEIBA Quito |

`metadataBase` sale del entorno (`NEXT_PUBLIC_SITE_URL`, o el dominio que Vercel
pone en `VERCEL_PROJECT_PRODUCTION_URL`). Sin base, `canonical` y las
alternativas `hreflang` salen relativas y el buscador no puede resolverlas.

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

## Registro y asistencia

`src/features/registration/`. La pantalla `/registro` son dos paneles: el
formulario a la izquierda y la credencial en 3D a la derecha.

**La altura la marca el contenido, no la pantalla.** El primer montaje daba al
lienzo exactamente una pantalla y el formulario resolvía el sobrante con scroll
propio; en portátiles (726px de alto) eso dejaba la lista de campos en 150px —dos
campos y medio— con el botón de registro encima. Ahora `.root` usa
`min-height: calc(100dvh - var(--header-height))`, el formulario fluye y quien
desplaza es el documento: el botón de confirmar se **descubre bajando**, que es lo
que el usuario espera de una página larga.

El panel de la credencial es `position: sticky; top: 0`. Se ancla en 0 y no en la
altura de la cabecera porque la cabecera no es fija: se va con el scroll.

**Descargar y compartir van encima del lienzo, en posición absoluta.** Como
hermanos en la columna le robaban alto al canvas al aparecer y la tarjeta pegaba
un salto, además de quedar al fondo del panel, lejos de ella. En absoluto el
canvas ni se entera —medido: `top: 89, h: 815` idéntico antes y después de
confirmar—. La cota es `calc(60% + 16px)`: el 60% porque la credencial cuelga a
una fracción fija del alto (el campo de visión de la escena es vertical), y los
16px en píxeles y no en porcentaje para que el aire no crezca con la pantalla.

### Resumen del perfil

Quien ya confirmó no vuelve al formulario: entra al **resumen**, que es el estado
de reposo de la pantalla. Saluda por el nombre, lista los datos guardados, y
ofrece dos acciones — «editar mis datos», que devuelve el formulario, y el bloque
de información del evento con el enlace a Maps y «añadir a mi calendario».

El resumen ocupa la misma columna que el formulario y reutiliza su cabecera, así
que al pasar de uno a otro no se mueve nada más que el contenido del panel. Los
datos van en recuadros de trazo discontinuo, la misma familia de contenedor que
el cargador de imagen: uno para leer, otro para rellenar.

En el resumen el lima lo lleva «editar mis datos» y el calendario va en verde
apagado: dos bloques iguales no dejarían ver cuál es la acción principal.

Los rótulos de los datos (`dt`) van ocultos a la vista pero presentes en el
marcado. El diseño pide una lista limpia de valores, y sin ellos un lector de
pantalla leería una ristra de datos sin decir de qué son.

**Añadir al calendario descarga un `.ics`**, no abre Google Calendar: el archivo
lo entienden Google, Apple y Outlook por igual y no manda al usuario fuera del
sitio. Las horas viven en `SITE.event.calendar` en UTC, porque Ecuador
continental va a UTC-5 todo el año —no tiene horario de verano— y el evento
termina ya en el día siguiente en hora Z.

Al editar, la fotografía **no se vuelve a exigir**: no se guarda en el navegador,
así que tras recargar no está en memoria, y pedirla de nuevo bloquearía una
corrección de rol tras la que nadie quiere subir una foto.

### Recuperar un registro hecho antes

Debajo del botón de enviar hay un enlace —«¿Ya te has registrado? Haz click
aquí»— que cambia el panel por un **acceso**: un solo campo de correo. Existe
porque el estado de asistencia vive en `localStorage`, así que quien confirmó en
otro navegador, en el teléfono o tras borrar los datos del sitio volvía a ver el
formulario vacío sin manera de llegar a su credencial.

El panel de acceso, el resumen y el formulario son **tres vistas de la misma
columna** (`isLookup ? … : isSummary ? … : …`), no tres pantallas: comparten
cabecera y credencial, así que al alternar solo cambia el contenido del panel.
El enlace es de doble sentido —desde el acceso ofrece «¿Aún no te registras?»—
para que nadie quede encerrado en él.

El acceso consulta `GET /api/registro?email=`, el mismo endpoint que ya servía
para leer un registro:

- **Existe** → `confirm()` con lo que devolvió el servidor, y entra al resumen.
  La respuesta es la fuente de verdad, igual que al enviar el formulario: así el
  navegador nuevo queda con el mismo estado guardado que el original.
- **No existe** (404) → vuelve al formulario **con el correo ya escrito** en su
  campo, porque lo más probable es que esa persona sí quiera registrarse, y con
  un aviso que explica por qué se movió la pantalla.

El correo se normaliza al teclear (`trim`, minúsculas, sin espacios) y no al
enviar: el `upsert` del registro es por correo, y un espacio pegado desde el
correo de invitación bastaba para no encontrar a nadie.

**Nota de privacidad, sin resolver:** con solo el correo se ve el perfil entero
de esa persona —nombre, organización, rol, retrato—, así que cualquiera que
acierte un correo puede leerlo, y el 404 confirma quién está y quién no en la
lista. Lo que el propio rótulo del diseño insinuaba («enviar enlace de acceso»)
es un enlace de un solo uso por correo, que no tiene ninguno de los dos
problemas. Queda pendiente decidirlo.

### El aviso

`components/ui/Toast.tsx`: rojo, a escuadra, centrado abajo del viewport, seis
segundos.

La **capa** es la que centra, con flex, y el aviso solo anima lo suyo: con un
`translateX(-50%)` la animación de Framer —que escribe su propio `transform`—
lo habría pisado y el aviso saldría descentrado.

Va con Framer Motion y no con CSS porque lo que se anima es la entrada **y la
salida** de un elemento que se monta y desmonta; sin `AnimatePresence` el aviso
se iría de golpe.

El temporizador vive dentro del aviso, no en quien lo abre, para que se cierre
solo. Y la cuenta atrás depende del mensaje, **no de la identidad de
`onDismiss`**: quien lo usa pasa una función nueva en cada render, y con ella en
las dependencias del efecto el temporizador se reiniciaba en cada uno —medido,
el aviso duraba catorce segundos en vez de seis—. La referencia se guarda en un
`ref` y el efecto solo mira el mensaje.

### El arte de la credencial

`public/img/card-front.png` y `card-back.png`, 2162×3016 (43:60, la proporción de
la tarjeta). El código solo añade el retrato y los datos: el logotipo, las
escaleras y los racimos de píxeles vienen en el arte.

El arte nuevo entró **sin recolocar nada** porque su geometría es la misma que la
del provisional: se comprobó dibujando los dos en un lienzo y muestreando una
rejilla de 43×60 —una casilla por unidad de diseño—, y las escaleras y los
racimos caen en las mismas celdas. La ventana del retrato (108,174, 214×270)
sigue quedando entre las dos escaleras, que asoman por sus esquinas.

El fondo del arte es exactamente `#151d17`, igual que la banda opaca que el
código pinta detrás del nombre: por eso la banda no se ve como un recuadro. Si
llega un arte con otro oscuro, hay que igualar ese valor.

Y ya no lleva texto en español dentro del PNG, así que la credencial se traduce
entera desde los diccionarios.

### Estado de asistencia

`context/attendance.tsx` expone `AttendanceProvider` y `useAttendance()`, y se
monta en el layout raíz por encima de la cabecera y de la transición: cabecera,
hero y pie cuelgan de ramas distintas del árbol y necesitan el mismo dato.

Persiste en `localStorage` (`c500-attendee`) y no en `sessionStorage` como el
loader: confirmar asistencia es un compromiso que debe sobrevivir al cierre de la
pestaña; ver el loader otra vez, no.

Guarda el formulario entero y no solo el nombre, porque el resumen tiene que
poder mostrarlo al volver: con solo el nombre, tras recargar tendría que
inventarse la organización y el rol. La cabecera sigue usando únicamente `name`.

Se lee en un efecto tras montar y no en el estado inicial: en el servidor no hay
`localStorage`, y devolver algo distinto en el cliente rompe la hidratación. El
coste es que el rótulo confirmado aparece un cuadro después, que en un botón de
estado no se nota.

Quien lo consume es `RegistrationCta`, que resuelve el rótulo
(«Asistencia confirmada») y deja `CtaButton` presentacional; y `PrimaryNav`, que
cambia el enlace de registro por el **nombre** del asistente —sin apellido: la
celda del menú no da para los dos—. El destino no cambia: quien ya confirmó
vuelve a la misma pantalla, ahora para revisar su perfil.

**No hay base de datos todavía.** El envío es un `setTimeout` de 850ms y el dato
vive solo en el navegador. Al llegar el backend, el punto de enganche es
`confirm()` dentro del provider.

## Pendiente

- **La sede sale del mockup del resumen, no de una fuente confirmada.**
  `SITE.event.venue` dice «Jardín Botánico de Quito» y el enlace es una búsqueda
  en Maps, no un punto concreto: falta la dirección exacta. El horario del `.ics`
  se dedujo del FAQ (17:00–21:00, UTC-5).
- `public/brand/icon-darrk-ceibaquito.svg` (con la doble r) no es una copia de
  `icon-dark-ceibaquito.svg`: es el isotipo solo, sin la palabra, y su dibujo es
  el que está en `favicon.svg`. La cabecera usa el lockup completo. Conviene
  renombrarlo a algo como `isotipo-ceiba.svg` o retirarlo.
- `logo-500.svg`, `logo-horizontal-blanco.svg`, `logo-horizontal-dark.svg` y
  `hero/asset-riggle-red.svg` se quedaron sin uso al entrar el logotipo de Ceiba
  y al retirarse el enlace de invitación.
- `front_placeholder.png`, `front_placeholder-3x.png` y `back.png` quedaron sin
  uso al entrar el arte de Ceiba.
- El enlace **«¿No recibiste invitación?»** se retiró del hero y también del
  formulario de registro, donde además había quedado sin traducir. Si vuelve a
  haber flujo de invitación, vuelve con su clave en los diccionarios.
- En pantallas de **640px de alto o menos** la portada desborda unos 31px: el
  hero tiene un suelo de `min-height: 590px` y a esa altura el contenido no cabe.
  Bajar el suelo lo apretaría o lo cortaría, así que es una decisión de diseño
  pendiente.
- Queda **1px** de desbordamiento vertical en la portada por redondeo
  fraccionario de la cinta de la cuenta atrás. Antes eran dos.
- En **tema claro** los logos de socios del pie son invisibles: son las variantes
  de tinta clara (`*-light.svg`), pensadas para fondo oscuro, y en claro quedan
  crema sobre crema. Hacen falta las dos variantes y un `ThemedImage`, como el
  logotipo. El tema claro sigue sin repasarse entero.
- `features/transitions/pixel-reveal/` quedó **sin usar** al entrar la transición
  de escaleras. Se dejó en su sitio por si hay que volver a ella; si no, se
  borra la carpeta.
- **El dominio del remitente no está autenticado en el DNS.** `naturatech.org` no
  tiene publicados los tres CNAME que SendGrid espera (`em4373`, `s1._domainkey`,
  `s2._domainkey`), comprobado con 8.8.8.8 y 1.1.1.1, y tampoco tiene SPF ni
  DMARC. Por eso los correos llegan marcados como no autenticados y con las
  imágenes bloqueadas. `npm run mail:auth` imprime los registros que faltan.
- **Las imágenes de la plantilla están en el CDN de Mailchimp**
  (`mcusercontent.com`), de donde se copió el diseño. Cargan, pero dependen de esa
  cuenta ajena, y **la primera pesa 2,2 MB**, que para un correo es muchísimo.
- **Quedan tres registros sin su correo** (los que se hicieron mientras la cuenta
  no podía enviar). `npm run mail:pending` los lista y `npm run mail:pending:send`
  se lo manda; van en español, porque el idioma no se guarda por persona.
- Un fallo del correo **solo se ve en el registro del servidor** (en Vercel, en los
  logs de la función `/api/registro`). La línea es
  `[api/registro] no se pudo enviar la confirmación` seguida del cuerpo de SendGrid,
  que distingue entre falta de créditos y una variable de entorno sin poner.
- **El remitente es `no-reply@naturatech.org`**, el único verificado en la cuenta
  (con el dominio `naturatech.org` autenticado). Si se quiere otro hay que
  verificarlo en SendGrid primero, o el envío se rechaza.
- **El idioma no se guarda por asistente.** El correo del registro sí sale en el
  idioma de la ruta, pero un reenvío posterior (`mail:pending:send`) va en español.
  Si hace falta, es una columna más en `Attendee`.
- Los enlaces legales del pie apuntan a anclas de relleno (`#terminos`,
  `#privacidad`) y las redes a los dominios genéricos: faltan las URL reales.
- `hero/hero-green-pixels-2.svg` quedó sin uso al retirarse el campo del hero.
- **Faltan los retratos de los ponentes**: la lista usa la silueta de relleno.
- **Faltan datos de tres personas del programa**: Carlo Angeles y Regina Cervera
  constan solo con nombre, y Carolina Proaño con organización (CEIBA) pero sin
  cargo. Presentan momentos, así que están en la agenda pero no en la lista de
  ponentes.
- **La premiación Natura500 no está publicada.** El documento trae dos bloques: la
  Noche (17:00–21:00, que es este evento) y una premiación de 30 minutos en el
  main stage con audiencia del ecosistema GET, que parece ser del GET Forum del
  día siguiente. Solo se publicó la Noche.
- **Sin confirmar del programa**: quién abre la Premiación (hay tres opciones de
  gobierno e IDB), quién entrega los premios (María Fernanda Espinosa, marcada
  «tbd»), los tres innovadores de Historias Natura500 (hay propuestas) y el grupo
  de la demostración cultural (hay seis opciones).
- La referencia del FAQ abría con **"¿Qué es Conexión 500?"**, una pregunta que no
  está en la lista entregada, y ordenaba las demás de otra forma. Se usó la lista
  tal cual, en su orden. Si esa pregunta va, hay que añadirla a `faq.ts`.
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
