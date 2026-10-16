'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './MorphGallery.module.css';

/**
 * Galería cuyas fotos se disuelven unas en otras a través de ruido, en vez de
 * cortar o fundirse.
 *
 * Adaptada de «Morph Gallery» (21st.dev): el sombreador es el suyo; lo demás
 * está rehecho para este sitio —CSS Modules en vez de Tailwind, esquinas a
 * escuadra, textos traducidos— y con tres cambios de fondo:
 *
 * - **Texturas bajo demanda.** El original sube todas las fotos a la GPU al
 *   montar. Con decenas de fotos de 1920 px son cientos de MB de vídeo; aquí
 *   solo viven la actual y sus vecinas, y una transición espera a que su
 *   destino esté cargado en vez de disolverse hacia otra foto.
 * - **Encaje.** El original siempre recorta (`cover`). En una pantalla vertical
 *   eso deja un tercio de una foto apaisada, así que en vertical la foto va
 *   entera (`contain`) y lo que sobra es transparente: se ve el fondo del CSS.
 * - **Solo pinta cuando algo cambia.** El original redibuja el ruido a 60 fps
 *   aunque la foto esté quieta.
 *
 * Una textura de otro origen exige CORS. Si ninguna carga —sin WebGL o sin
 * CORS—, la galería sigue con un fundido normal en el DOM.
 */

export type MorphItem = {
  /** La foto. Del mismo dominio o servida con CORS, o no se podrá disolver. */
  src: string;
  /** Miniatura de la tira. */
  thumb?: string;
  alt: string;
};

type Labels = {
  region: string;
  previous: string;
  next: string;
  /** Rótulo de cada miniatura. */
  show: (alt: string) => string;
  /** «3 de 22», para el anuncio a lectores de pantalla. */
  position: (current: number, total: number) => string;
};

type Props = {
  items: MorphItem[];
  /** Controlado: la página decide cuál se ve, porque va en la URL. */
  index: number;
  onIndexChange: (index: number) => void;
  labels: Labels;
  /** Milisegundos de disolución. */
  duration?: number;
  /** Frecuencia del ruido: más alto, jirones más finos. */
  noiseScale?: number;
  /** Ancho del frente de disolución. */
  edge?: number;
  /** Cuánto se deslizan las dos fotos una contra otra al disolverse. */
  drift?: number;
  /** `auto` recorta en apaisado y enseña la foto entera en vertical. */
  fit?: 'cover' | 'contain' | 'auto';
  className?: string;
};

export const wrapIndex = (i: number, n: number) => (n <= 0 ? 0 : ((i % n) + n) % n);

/** Cuántos pasos separan dos fotos, contando por el lado más corto del círculo. */
const distance = (a: number, b: number, n: number) => {
  const d = Math.abs(a - b);
  return Math.min(d, n - d);
};

/** Quíntica de entrada y salida: arranca y acaba quieta y corre en medio. */
export const easeInOutQuint = (t: number) => {
  const x = Math.min(Math.max(t, 0), 1);
  return x < 0.5 ? 16 * x ** 5 : 1 - (-2 * x + 2) ** 5 / 2;
};

/** Cuántas fotos a cada lado de la actual se dejan cargadas. */
const NEIGHBOURS = 1;

const VERT = `
attribute vec2 a_position;
varying vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform sampler2D u_from;
uniform sampler2D u_to;
uniform float u_progress;
uniform vec2 u_resolution;
uniform float u_fromAspect;
uniform float u_toAspect;
uniform float u_scale;
uniform float u_direction;
uniform float u_edge;
uniform float u_drift;
uniform float u_contain;

varying vec2 v_uv;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
   -0.577350269189626,
    0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(
    permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0)
  );
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x  = 2.0 * fract(p * C.www) - 1.0;
  vec3 h  = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 v) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(v);
    v *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Reflejar en vez de estirar el último píxel: el deslizamiento saca las UV del
// borde, y CLAMP_TO_EDGE lo convertía en rayas. MIRRORED_REPEAT no vale con
// texturas que no son potencia de dos, así que se hace aquí.
vec2 mirror(vec2 uv) {
  return 1.0 - abs(1.0 - mod(uv, 2.0));
}

// Recortar (cover) o encajar entera (contain), como object-fit.
vec2 fitUV(vec2 uv, float imgAspect) {
  float canvasAspect = u_resolution.x / u_resolution.y;
  vec2 cover = (canvasAspect > imgAspect)
    ? vec2(1.0, imgAspect / canvasAspect)
    : vec2(canvasAspect / imgAspect, 1.0);
  vec2 contain = (canvasAspect > imgAspect)
    ? vec2(canvasAspect / imgAspect, 1.0)
    : vec2(1.0, imgAspect / canvasAspect);
  return (uv - 0.5) * mix(cover, contain, u_contain) + 0.5;
}

// 1 dentro de la foto y 0 fuera: en contain, lo de fuera es transparente.
float inside(vec2 uv) {
  vec2 s = step(0.0, uv) * step(uv, vec2(1.0));
  return s.x * s.y;
}

void main() {
  // El barrido se ensancha un frente por cada lado, para que 0 y 1 sean una foto
  // u otra del todo y no medio disueltas.
  float adjusted = u_progress * (1.0 + 2.0 * u_edge) - u_edge;

  vec2 fromFrame = fitUV(v_uv, u_fromAspect);
  vec2 toFrame = fitUV(v_uv, u_toAspect);

  float noise = fbm(v_uv * u_scale + vec2(0.0, u_progress * u_direction)) * 0.5 + 0.5;
  // El umbral se inclina con el brillo de la foto que entra: sus zonas claras
  // cruzan primero, y la nueva parece quemar la vieja.
  noise = smoothstep(0.0, 2.0, length(texture2D(u_to, mirror(toFrame)).rgb) + noise);

  float mixFactor = 1.0 - smoothstep(adjusted - u_edge, adjusted + u_edge, noise);

  // Las dos se deslizan, distinto y en sentidos opuestos: los jirones tienen
  // paralaje entre sí en vez de estar en un mismo plano.
  vec2 fromUV = fitUV(v_uv + vec2(0.0, noise * u_progress * u_drift * u_direction), u_fromAspect);
  vec2 toUV = fitUV(v_uv + vec2(0.0, noise * (1.0 - u_progress) * -0.5 * u_drift * u_direction), u_toAspect);

  // El marco se mide sin deslizar: el borde de la foto se queda quieto y lo que
  // se mueve es lo de dentro. Color premultiplicado por el marco.
  vec4 fromColor = texture2D(u_from, mirror(fromUV)) * inside(fromFrame);
  vec4 toColor = texture2D(u_to, mirror(toUV)) * inside(toFrame);

  gl_FragColor = mix(fromColor, toColor, mixFactor);
}
`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('could not create shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('shader compile failed: ' + log);
  }
  return shader;
}

function link(gl: WebGLRenderingContext) {
  const vert = compile(gl, gl.VERTEX_SHADER, VERT);
  const frag = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  const program = gl.createProgram();
  if (!program) throw new Error('could not create program');
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  // Ya son del programa: soltarlos aquí los libera con él.
  gl.deleteShader(vert);
  gl.deleteShader(frag);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error('program link failed: ' + log);
  }
  return program;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    // Sin esto la subida a WebGL lanza. Con esto, un origen sin CORS falla
    // aquí, donde se ve y se puede caer al fundido.
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('could not load ' + src));
    img.src = src;
  });
}

type Engine = {
  /** Deja cargadas estas fotos y suelta las demás. */
  keep: (indices: number[]) => void;
  /** Disolver hacia esta foto en cuanto esté cargada. */
  show: (index: number) => void;
};

export function MorphGallery({
  items,
  index,
  onIndexChange,
  labels,
  duration = 1500,
  noiseScale = 3.5,
  edge = 0.15,
  drift = 0.5,
  fit = 'auto',
  className,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine | null>(null);
  const thumbsRef = useRef<HTMLUListElement>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [generation, setGeneration] = useState(0);

  const count = items.length;
  const active = wrapIndex(index, count);
  const go = (next: number) => onIndexChange(wrapIndex(next, count));

  // El bucle lee los ajustes por referencia: retocarlos no reconstruye WebGL.
  const tuning = useRef({ duration, noiseScale, edge, drift, fit });
  const initial = useRef(active);
  useEffect(() => {
    tuning.current = { duration, noiseScale, edge, drift, fit };
  }, [duration, noiseScale, edge, drift, fit]);

  // Reconstruir con la lista es lo que toca: fotos nuevas, texturas nuevas.
  const sources = items.map((item) => item.src).join('\n');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || count === 0) return;

    const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!gl) {
      setFailed(true);
      return;
    }

    let program: WebGLProgram;
    let buffer: WebGLBuffer | null = null;
    try {
      program = link(gl);
    } catch {
      setFailed(true);
      return;
    }
    gl.useProgram(program);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
    const uniform = (name: string) => gl.getUniformLocation(program, 'u_' + name);
    const u = {
      from: uniform('from'),
      to: uniform('to'),
      progress: uniform('progress'),
      resolution: uniform('resolution'),
      fromAspect: uniform('fromAspect'),
      toAspect: uniform('toAspect'),
      scale: uniform('scale'),
      direction: uniform('direction'),
      edge: uniform('edge'),
      drift: uniform('drift'),
      contain: uniform('contain'),
    };
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.clearColor(0, 0, 0, 0);

    const textures: (WebGLTexture | null)[] = items.map(() => null);
    const aspects = items.map(() => 1);
    const loading = new Set<number>();
    let wanted = new Set<number>();
    let loadedOnce = false;
    let failures = 0;
    let disposed = false;
    let raf = 0;
    let dirty = true;
    let shown = false;

    // Estado de la disolución, en el bucle y no en React: cambia cada cuadro.
    let from = initial.current;
    let to = from;
    let progress = 1;
    let startedAt = 0;
    let direction = 1;
    let pending: number | null = null;

    const onLost = (event: Event) => {
      event.preventDefault();
      cancelAnimationFrame(raf);
    };
    // Un contexto restaurado viene vacío: lo honrado es reconstruirlo entero.
    const onRestored = () => setGeneration((value) => value + 1);
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.round(canvas.clientWidth * ratio);
      const height = Math.round(canvas.clientHeight * ratio);
      if (width === 0 || height === 0 || (canvas.width === width && canvas.height === height)) return;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      dirty = true;
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    resize();

    const load = (i: number) => {
      if (textures[i] || loading.has(i)) return;
      loading.add(i);
      loadImage(items[i].src).then(
        (img) => {
          loading.delete(i);
          // Se pudo dejar de querer mientras llegaba.
          if (disposed || !wanted.has(i)) return;
          const texture = gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          // Las fotos no son potencia de dos: en WebGL1 la única pareja legal es
          // clamp y lineal, y la equivocada pinta negro sin avisar.
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          textures[i] = texture;
          aspects[i] = img.naturalWidth / Math.max(img.naturalHeight, 1);
          loadedOnce = true;
          dirty = true;
        },
        () => {
          loading.delete(i);
          // Una URL rota cuesta una foto, no el efecto. Si las primeras que se
          // piden fallan todas, es que no hay forma de subirlas: al fundido.
          failures += 1;
          if (!loadedOnce && !disposed && failures >= Math.min(2, count)) setFailed(true);
        },
      );
    };

    const keep = (indices: number[]) => {
      wanted = new Set(indices);
      indices.forEach(load);
      textures.forEach((texture, i) => {
        // Las dos de la disolución en curso se quedan aunque ya no se pidan.
        if (texture && !wanted.has(i) && i !== from && i !== to) {
          gl.deleteTexture(texture);
          textures[i] = null;
        }
      });
    };

    const show = (next: number) => {
      pending = next;
      dirty = true;
    };

    engineRef.current = { keep, show };

    const draw = () => {
      const t = tuning.current;

      // Una transición pedida arranca cuando su destino está cargado; mientras,
      // sigue la foto de antes.
      if (pending !== null && textures[pending]) {
        if (pending !== to) {
          // Se sale de la última foto pedida. A mitad de una disolución eso es
          // saltar a su destino: es la que ya se estaba viendo llegar.
          from = to;
          // El sentido sigue el camino corto: de la última a la primera también
          // avanza, como cualquier otro paso.
          direction = ((pending - from + count) % count) * 2 <= count ? 1 : -1;
          to = pending;
          startedAt = performance.now();
          // Antes del primer cuadro no hay nada de lo que disolverse.
          progress = shown ? 0 : 1;
          if (!shown) from = to;
        }
        pending = null;
      }

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (progress < 1) {
        const span = reduced ? 0 : Math.max(t.duration, 1);
        const elapsed = performance.now() - startedAt;
        progress = span === 0 ? 1 : easeInOutQuint(Math.min(elapsed / span, 1));
        dirty = true;
      }

      if (!dirty) return;
      const fromTexture = textures[from];
      const toTexture = textures[to];
      if (!fromTexture || !toTexture) return;
      dirty = false;

      const contain =
        t.fit === 'contain' || (t.fit === 'auto' && canvas.width < canvas.height) ? 1 : 0;

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, fromTexture);
      gl.uniform1i(u.from, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, toTexture);
      gl.uniform1i(u.to, 1);
      gl.uniform1f(u.progress, progress);
      gl.uniform2f(u.resolution, canvas.width, canvas.height);
      gl.uniform1f(u.fromAspect, aspects[from]);
      gl.uniform1f(u.toAspect, aspects[to]);
      gl.uniform1f(u.scale, t.noiseScale);
      gl.uniform1f(u.direction, direction);
      gl.uniform1f(u.edge, Math.max(t.edge, 0.001));
      gl.uniform1f(u.drift, t.drift);
      gl.uniform1f(u.contain, contain);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!shown) {
        shown = true;
        setReady(true);
      }
    };

    const frame = () => {
      draw();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      disposed = true;
      engineRef.current = null;
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      canvas.removeEventListener('webglcontextrestored', onRestored);
      for (const texture of textures) if (texture) gl.deleteTexture(texture);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
    // La foto activa se lee una vez para el primer cuadro; los cambios llegan
    // por `show`. Por eso no es dependencia, y `items` va dentro de `sources`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sources, generation, count]);

  // Cada cambio de foto: pedir la disolución y dejar cargadas sus vecinas.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    const around = [active];
    for (let step = 1; step <= NEIGHBOURS; step++) {
      around.push(wrapIndex(active + step, count), wrapIndex(active - step, count));
    }
    engine.keep(around);
    engine.show(active);
  }, [active, count, sources, generation]);

  // La miniatura actual, siempre a la vista en la tira.
  useEffect(() => {
    const current = thumbsRef.current?.querySelector<HTMLElement>('[aria-current="true"]');
    current?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [active]);

  // Flechas del teclado en toda la página: la galería es la página.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft') onIndexChange(wrapIndex(active - 1, count));
      else if (event.key === 'ArrowRight') onIndexChange(wrapIndex(active + 1, count));
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active, count, onIndexChange]);

  // Deslizar con el dedo o el ratón.
  const swipe = useRef<number | null>(null);
  const onPointerDown = (event: React.PointerEvent) => {
    swipe.current = event.clientX;
  };
  const onPointerUp = (event: React.PointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (start === null) return;
    const dx = event.clientX - start;
    if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1));
  };

  const current = items[active];

  return (
    <section
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-roledescription="carousel"
      aria-label={labels.region}
      data-fit={fit}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {failed ? (
        // La misma galería sin sombreador: solo la actual y sus vecinas, con un
        // fundido de opacidad.
        items.map((item, i) =>
          distance(i, active, count) <= NEIGHBOURS ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={item.src}
              src={item.src}
              alt={i === active ? item.alt : ''}
              className={styles.fallback}
              data-active={i === active || undefined}
              aria-hidden={i !== active}
            />
          ) : null,
        )
      ) : (
        <canvas
          ref={canvasRef}
          className={styles.canvas}
          data-ready={ready || undefined}
          aria-hidden="true"
        />
      )}

      <div className={styles.shade} aria-hidden="true" />

      {count > 1 && (
        <>
          <button
            type="button"
            className={`${styles.arrow} ${styles.previous}`}
            onClick={() => go(active - 1)}
            aria-label={labels.previous}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            className={`${styles.arrow} ${styles.next}`}
            onClick={() => go(active + 1)}
            aria-label={labels.next}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <ul ref={thumbsRef} className={styles.thumbs}>
            {items.map((item, i) => (
              <li key={item.src}>
                <button
                  type="button"
                  className={styles.thumb}
                  onClick={() => go(i)}
                  aria-current={i === active}
                  aria-label={labels.show(item.alt)}
                >
                  {/* Miniaturas generadas al subir: el optimizador de Next
                      volvería a codificar lo que ya viene a su medida. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.thumb ?? item.src} alt="" width={80} height={50} loading="lazy" decoding="async" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      <span className={styles.srOnly} aria-live="polite">
        {current ? `${current.alt} — ${labels.position(active + 1, count)}` : ''}
      </span>
    </section>
  );
}
