# Conexión Natura — notas para Claude

Stack: Next.js 15 App Router, TypeScript estricto, CSS Modules + tokens (sin
Tailwind), GSAP, Framer Motion, react-three-fiber.

## Convenciones

- Alias de importación: `@/*` → `src/*`.
- Colores, tipografía y espaciado **solo** desde `src/styles/tokens.css`. Nada de
  hex sueltos en componentes.
- Dos oscuros distintos: `--color-surface` (#151D17) es el fondo de la interfaz;
  `--color-dark` (#001D09) es el tinte de los textos sobre superficies claras.
- Cada feature vive en `src/features/<nombre>/` con `components/ hooks/ config/`
  y un `index.ts` que es su única API pública.
- Estilos: un `.module.css` junto a su componente.
- `'use client'` solo donde hace falta (animación, estado, efectos).
- Reparto de animación: **GSAP** para valores continuos e interpolación numérica
  (contadores, progreso, scroll); **Framer Motion** para entrada/salida de
  componentes y variantes declarativas.
- Fuentes vía `next/font` en `src/fonts/index.ts`. IBM Plex Mono para texto
  corrido (`--font-body`), Departure Mono para hero, loader y rótulos
  (`--font-mono`).

## Rutas

Dos idiomas con URL propia: `/es` y `/en`, y dentro `/agenda`, `/speakers`,
`/faq` y `/registro`. Los slugs no se traducen.

El layout raíz vive en `app/[locale]/` porque solo él pinta `<html lang>`. Por
eso `/` no existe como ruta y `middleware.ts` la redirige a `/es`. La API va
fuera de `[locale]`: no tiene idioma.

La copia está en `src/i18n/dictionaries/`; el español es la referencia y de él
sale el tipo, así que una clave nueva rompe el inglés hasta traducirla. En
`src/config` se queda lo que no depende del idioma (fechas, semillas, enlaces,
medidas), con una `key` que entra en el diccionario.

La copia baja **por props** desde el componente de servidor que conoce el
idioma. No hay contexto de traducción: marcaría como cliente media aplicación.

Los títulos salen de `title.template` en el layout: cada página solo dice su
nombre.

La **cabecera** se compone en el layout raíz: es idéntica en todas las rutas, no
debe animarse al navegar, y al sobrevivir al cambio de ruta su indicador puede
animar el paso de una a otra. El **armazón** (`PageFrame`) sí va en cada página,
porque los filetes de columna se activan por página. El **pie** lo compone el
armazón, y así los filetes verticales lo cruzan. No sale en la portada ni en
registro (`hideFooter`): la portada cabe en una pantalla y el pie repetiría su
CTA.

Solo la portada va envuelta en `LoaderGate`: el loader es la entrada al sitio, no
un peaje en cada ruta, y se ve una sola vez por sesión de pestaña.

El acento de la navegación es su propio token (`--accent-nav`, lima), distinto del
`--accent` del resto. Los iconos que deben tomar el color del texto van como
máscara y no como imagen: el archivo trae su relleno fijado.

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

Los logotipos con variante por tema van con `ThemedImage`: se montan los dos y el
CSS esconde el que no toca. Elegir en JavaScript enseñaría un cuadro con el
equivocado. La máscara con `currentColor` no vale aquí: llevan dos colores.

El rótulo del hero se acota por alto (`--hero-wordmark-max`), no solo por ancho:
el logotipo es alto en proporción y a 720px de viewport echaba el contenido fuera
de la pantalla.

El hero reparte sus medios en **dos capas**, una detrás del texto y otra delante:
cada capa se centra con `transform`, que crea contexto de apilamiento, así que en
una sola capa el ave no podía ponerse por delante del rótulo. El degradado del
suelo viaja con el ave y lleva máscara horizontal para no velar el CTA.

Al quitar un elemento del hero hay que mirar quién daba el hueco de abajo: el
enlace de invitación lo daba de hecho, y `--hero-bottom` estaba sin usar.

## Transiciones

Los hooks compartidos entre features viven en `src/hooks/` (p. ej.
`useStrobeEntrance`). Si solo lo usa una feature, se queda dentro de ella.

La del loader al hero es `stairs-reveal`: columnas que crecen desde los dos
cantos hacia el centro con desfase de izquierda a derecha —el desfase es lo que
dibuja la escalera—. Se anima `scaleY`, no `height`.

Cada transición es una feature en `src/features/transitions/`. Regla: quien
transiciona no decide *qué* se muestra — expone `onCovered` (pantalla tapada,
momento seguro para cambiar contenido) y `onComplete`; el orquestador decide.

Toda aleatoriedad visual usa `createRandom(seed)` de `src/lib/random.ts`, nunca
`Math.random()`: si no, servidor y cliente difieren y React reporta desajuste
de hidratación.

La **cabecera no debe asomar sobre el loader**. Vive en el layout, fuera de la
puerta, y en los primeros cuadros las hojas de los módulos aún no se aplican: sin
posicionar, se pintaba encima. Lo resuelve un `<style>` en el propio HTML con
`data-loader-pending`, que pone el script en línea y retira `LoaderGate` al tapar
la pantalla. Un `z-index` no vale: en esa ventana tampoco está aplicado.

Cuidado con los escapes en los scripts en línea: dentro de una plantilla de
JavaScript, `/` es solo `/`, y una expresión regular llega rota al HTML.

En **tema claro** los acentos son `#C0E619` (el rombo de Ceiba). Quien pinta con
el verde tiene que usar el rol (`--accent`, `--accent-nav`), no el token de
paleta: la paleta es constante de marca y no cambia con el tema.

## Retícula y tipografía

Los valores de la retícula (`--container-margin` 88px, `--header-height` 88px,
`--header-side` 222px, `--cta-width` 328px) y la escala del hero viven en
tokens.css. Hay cuatro
filetes verticales: los dos bordes del contenedor y dos interiores a
`--header-side` de cada lado.
Los cuerpos del hero se despejaron de las métricas reales de Departure Mono
(avance/em 0.6364, capHeight/em 0.7273): si hay que ajustar tamaños, se calcula
con esas proporciones, no a ojo.

IBM Plex Mono para párrafos y textos corridos (FAQ, cuerpos de texto). Departure
Mono para el hero, el loader, rótulos de sección y datos.

La agenda es la única página interior que usa el ancho entero entre los filetes
exteriores: por eso va con `hasColumnRules={false}`, porque los interiores
cruzarían cada fila por la mitad. `Schedule` es de cliente solo por el buscador,
que filtra sin acentos y palabra por palabra la lista que ya vino del servidor.
Los cuadros de color de los créditos son roles (`--credit-host`,
`--credit-people`), no paleta suelta.

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

## Correo

El registro dispara una plantilla dinámica de SendGrid. `src/lib/sendgrid.ts` es
de servidor. El envío va en `after()`: la respuesta no espera al correo, y un
fallo se anota y no rompe el registro —la fila ya está guardada—.

Se manda una sola vez, con la marca en la columna `confirmationSentAt`. Si falla,
la marca queda nula y `npm run mail:pending` lo recupera.

Que SendGrid acepte el envío no significa que llegue **autenticado**: eso depende
de que el dominio del remitente tenga publicados sus CNAME. `npm run mail:auth`
lo comprueba resolviendo el DNS, porque la API de SendGrid devuelve el resultado
de la última validación y sigue diciendo `valid: true` aunque ya no existan.

El **asunto lo pone el mensaje**, no la plantilla: la plantilla no trae ninguno y
una sola sirve a los dos idiomas. Se edita en `confirmation-email.ts`.

Al depurar SendGrid hay que mirar `error.response.body`: manda «Maximum credits
exceeded» con un 401, cuyo mensaje suelto es «Unauthorized».

## Imágenes por viewport

Cuando hay dos encuadres de la misma imagen, van en un `<picture>` con
`<source media>`, **no** en dos `<Image>` con CSS: el navegador descarga las
imágenes aunque estén en `display: none`. Y sin `priority`, que precargaría la
que no toca.

La lista de precarga del loader admite `{ src, media }` y descarta las que no
encajan, para no esperar por una imagen que este viewport no va a ver.

## Animaciones de entrada

Si el disparo es la carga de la página, la animación va en **CSS**: en JavaScript
hay que apagar el elemento en un efecto, después del primer pintado, y se ve un
cuadro con el estado final antes de que arranque. Si el disparo es una señal de
JavaScript (`useHasEntered`), va en GSAP o Framer Motion.

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

La portada lleva **fondo oscuro fijo en los dos temas**: las fotos vienen en RGBA
con la opacidad rebajada y sobre el crema del tema claro quedaban lavadas. Las
celdas del mosaico que tapan la foto van de ese mismo oscuro (`--cover-surface`),
no del fondo del tema.

Al añadir una portada, elegir la semilla comprobando que ninguna celda de color
asome junto al panel del rótulo: convierte el panel en una escalera.

## Registro

La altura de `/registro` la marca el contenido: desplaza el documento y el panel
de la credencial se queda `sticky`. Nada de scroll interno en el formulario —en
portátiles dejaba dos campos y medio a la vista.

Lo que aparece sobre el lienzo de la credencial (los botones de descargar y
compartir) va en posición absoluta: como hermano en la columna le roba alto al
canvas y la tarjeta salta.

El estado de asistencia es `useAttendance()` (`src/features/registration`),
montado en el layout raíz porque cabecera, hero y pie cuelgan de ramas distintas.
Vive en `localStorage` —sobrevive al cierre de la pestaña, al revés que el
loader— y se lee en un efecto tras montar, no en el estado inicial: en el
servidor no hay `localStorage`. Quien resuelve el rótulo es `RegistrationCta`;
`CtaButton` sigue siendo presentacional.

Quien ya confirmó ve el **resumen**, no el formulario: es el estado de reposo de
la pantalla, y el formulario vuelve solo con «editar mis datos». Por eso el estado
guarda el perfil entero y no solo el nombre.

«Añadir a mi calendario» descarga un `.ics` generado en el cliente, no abre un
calendario concreto. Sus horas están en `SITE.event.calendar` en UTC: Ecuador va a
UTC-5 todo el año.

Quien confirmó en otro navegador recupera su registro con el enlace de debajo del
botón: un campo de correo contra `GET /api/registro?email=`. Si existe, `confirm()`
con la respuesta del servidor y al resumen; si no, vuelve al formulario con el
correo ya puesto y un aviso. Acceso, resumen y formulario son tres vistas de la
misma columna, no tres pantallas. Pendiente de decidir: con solo el correo se ve el
perfil entero, y el 404 delata quién está en la lista; el enlace de un solo uso por
correo evitaría las dos cosas.

El aviso es `components/ui/Toast.tsx`. Su temporizador depende del mensaje y no de
la identidad de `onDismiss` —una función nueva por render reiniciaba la cuenta—, y
centra con flex en la capa, no con `translateX(-50%)`: Framer escribe el `transform`.

El envío va a `POST /api/registro`, que hace `upsert` **por correo**: reenviar el
formulario corrige, no duplica. La validación de servidor está en
`features/registration/lib/attendee-input.ts`, pura y aparte de la del formulario.
La respuesta del servidor es la fuente de verdad de `confirm()`.

Al editar no se vuelve a exigir la foto: si ya está en R2 se reutiliza su URL, y
una imagen nueva invalida la anterior y se sube otra vez.

El arte de la credencial es `public/img/card-front.png` y `card-back.png`. El
código solo añade el retrato y los datos, sobre coordenadas del lienzo de
430×600: la ventana del retrato y la banda del nombre están fijadas ahí. Si llega
un arte nuevo, comprobar su geometría muestreando una rejilla de 43×60 —una
casilla por unidad de diseño— antes de tocar coordenadas, y que su fondo siga
siendo `#151d17`, que es el color de la banda opaca del nombre.

## Base de datos

Prisma ORM **7.10.0** contra Prisma Postgres, fijado y no `latest`: el `latest` de
la CLI es ya un 8.0.0-rc con otra arquitectura.

Modelos en `prisma/schema.prisma` (`Invitation` 1—1 `Attendee`). El `datasource`
no lleva `url`: la aporta `prisma.config.ts`, que también declara la semilla.

El cliente es `src/lib/prisma.ts`, uno por proceso, con el adaptador `PrismaPg`.
**Solo servidor**: importarlo desde un componente de cliente llevaría el driver de
Postgres y la cadena de conexión al navegador.

`DATABASE_URL` vive solo en `.env` (ignorado). El cliente generado va en
`/generated`, tampoco versionado: lo rehace `postinstall`.

## Imágenes

Los retratos van a **Cloudflare R2** y en la base queda solo la URL. El navegador
sube directo con una URL firmada por `POST /api/uploads/photo`; el archivo no pasa
por el servidor (límite de 4,5 MB de cuerpo en Vercel). La clave del objeto la
decide el servidor, no el cliente.

`src/lib/r2.ts` es de servidor: las claves dan escritura sobre el bucket.

Al añadir un dominio hay que sumarlo a la regla CORS del bucket **y** a
`R2_CORS_ORIGINS`. La regla solo se puede poner con un token de admin de R2 o a
mano en el panel: con el token de objetos da `AccessDenied`.

## Assets

Los SVG de píxeles se convierten a mapas de celdas en build, no se parsean en
runtime: `scripts/svg-to-pixels.js` para los que traen un rect por cuadro y
`scripts/svg-polygons-to-pixels.js` para los que vienen como polígonos en
escalera (recupera las celdas muestreando el centro de cada casilla).

Los originales quedan en `_assets-src/` (referencia, incluida la paleta en
`colores.txt`). Lo que se sirve va en `public/`, agrupado por uso.
