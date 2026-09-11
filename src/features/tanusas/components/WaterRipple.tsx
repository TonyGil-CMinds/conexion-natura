'use client';

/**
 * Imagen con superficie de agua, el fondo del hero del retiro.
 *
 * Es WebGL a pelo —dos shaders y un cuadrilátero— y no `react-three-fiber`: no
 * hay escena, ni cámara, ni malla que gestionar, así que traer un motor 3D para
 * esto sería cargar mucho para pintar un plano. Los shaders vienen tal cual del
 * documento de diseño: son el efecto, y reescribirlos solo introduciría erratas.
 *
 * Tres cosas que hacen que no cueste lo que parece:
 *
 * - **No dibuja si no se ve.** Un `IntersectionObserver` para el bucle cuando el
 *   hero sale de pantalla, que en una página larga es casi todo el tiempo.
 * - **Se rinde bien.** Sin contexto WebGL, con el shader roto o si la imagen no
 *   carga, cae a la misma imagen en un `<img>` y nadie se queda con un hueco.
 * - **Respeta a quien pide menos movimiento**: con `prefers-reduced-motion` no
 *   arranca el bucle y deja la imagen quieta.
 */
import { useEffect, useRef, useState } from 'react';
import styles from './Tanusas.module.css';

const VERT = `
precision mediump float;
varying vec2 vUv;
attribute vec2 a_position;
void main() {
  vUv = .5 * (a_position + 1.);
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG = `
precision mediump float;

varying vec2 vUv;
uniform sampler2D u_image_texture;
uniform float u_time;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_blueish;
uniform float u_scale;
uniform float u_illumination;
uniform float u_surface_distortion;
uniform float u_water_distortion;

vec3 mod289(vec3 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec2 mod289(vec2 x) { return x - floor(x * (1. / 289.)) * 289.; }
vec3 permute(vec3 x) { return mod289(((x*34.)+1.)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0., i1.y, 1.)) + i.x + vec3(0., i1.x, 1.));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.);
  m = m*m;
  m = m*m;
  vec3 x = 2. * fract(p * C.www) - 1.;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130. * dot(m, g);
}

mat2 rotate2D(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

float surface_noise(vec2 uv, float t, float scale) {
  vec2 n = vec2(.1);
  vec2 N = vec2(.1);
  mat2 m = rotate2D(.5);
  for (int j = 0; j < 10; j++) {
    uv *= m;
    n *= m;
    vec2 q = uv * scale + float(j) + n + (.5 + .5 * float(j)) * (mod(float(j), 2.) - 1.) * t;
    n += sin(q);
    N += cos(q) / scale;
    scale *= 1.2;
  }
  return (N.x + N.y + .1);
}

void main() {
  vec2 uv = vUv;
  uv.y = 1. - uv.y;
  uv.x *= u_ratio;

  float t = .002 * u_time;
  vec3 color = vec3(0.);
  float opacity = 0.;

  float outer_noise = snoise((.3 + .1 * sin(t)) * uv + vec2(0., .2 * t));
  vec2 surface_noise_uv = 2. * uv + (outer_noise * .2);

  float surf = surface_noise(surface_noise_uv, t, u_scale);
  surf *= pow(uv.y, .3);
  surf = pow(surf, 2.);

  /**
   * Encuadre al modo "cover": se recorta el eje que sobra, sin dejar franjas.
   *
   * El cociente va al revés de como parece: para recortar hay que **estrechar**
   * la ventana de muestreo, así que el factor tiene que ser menor que uno. Al
   * contrario —como venía— la ventana se sale de [0,1] y el clamp de abajo
   * embadurna la columna del borde a lo ancho de toda la franja.
   */
  vec2 img_uv = vUv;
  img_uv -= .5;
  if (u_ratio > u_img_ratio) {
    img_uv.y = img_uv.y * u_img_ratio / u_ratio;
  } else {
    img_uv.x = img_uv.x * u_ratio / u_img_ratio;
  }
  img_uv += .5;
  img_uv.y = 1. - img_uv.y;

  img_uv += (u_water_distortion * outer_noise);
  img_uv += (u_surface_distortion * surf);

  img_uv = clamp(img_uv, 0.001, 0.999);
  vec4 img = texture2D(u_image_texture, img_uv);
  img *= (1. + u_illumination * surf);

  color += img.rgb;
  color += u_illumination * vec3(1. - u_blueish, 1., 1.) * surf;
  opacity += img.a;

  gl_FragColor = vec4(color, opacity);
}
`;


type Props = {
  src: string;
  /** Cuánto azulea la lámina de agua. */
  blueish?: number;
  /** Tamaño del oleaje: más alto, ondas más pequeñas. */
  scale?: number;
  illumination?: number;
  surfaceDistortion?: number;
  waterDistortion?: number;
};

function compileShader(gl: WebGLRenderingContext, source: string, type: number) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('No se pudo crear el shader.');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader: ${info || 'error desconocido'}`);
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = compileShader(gl, VERT, gl.VERTEX_SHADER);
  const fragment = compileShader(gl, FRAG, gl.FRAGMENT_SHADER);
  const program = gl.createProgram();
  if (!program) throw new Error('No se pudo crear el programa.');
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Programa: ${info || 'error desconocido'}`);
  }
  return program;
}

export function WaterRipple({
  src,
  blueish = 0.45,
  scale = 7,
  illumination = 0.14,
  surfaceDistortion = 0.028,
  waterDistortion = 0.018,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /** Con `true` se pinta la imagen tal cual: aquí no hay nada que salvar. */
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setFailed(true);
      return;
    }

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) {
      setFailed(true);
      return;
    }

    let program: WebGLProgram;
    try {
      program = createProgram(gl);
    } catch (error) {
      console.warn('[tanusas] sin lámina de agua:', error);
      setFailed(true);
      return;
    }
    gl.useProgram(program);

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < count; i += 1) {
      const info = gl.getActiveUniform(program, i);
      if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
    }

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    gl.uniform1f(uniforms['u_blueish'], blueish);
    gl.uniform1f(uniforms['u_scale'], scale);
    gl.uniform1f(uniforms['u_illumination'], illumination);
    gl.uniform1f(uniforms['u_surface_distortion'], surfaceDistortion);
    gl.uniform1f(uniforms['u_water_distortion'], waterDistortion);

    let imageRatio = 1;
    let texture: WebGLTexture | null = null;
    /** Se topa a 2: por encima solo se gastan píxeles que nadie distingue. */
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const width = Math.max(1, Math.floor(wrap.clientWidth * dpr));
      const height = Math.max(1, Math.floor(wrap.clientHeight * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uniforms['u_ratio'], canvas.width / canvas.height);
      gl.uniform1f(uniforms['u_img_ratio'], imageRatio);
    };

    const image = new Image();
    image.onload = () => {
      imageRatio = image.naturalWidth / image.naturalHeight;
      texture = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 0);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.uniform1i(uniforms['u_image_texture'], 0);
      resize();
    };
    image.onerror = () => setFailed(true);
    image.src = src;

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);

    let frame = 0;
    let visible = true;
    // Fuera de pantalla no se dibuja: la página es larga y el hero se va pronto.
    const inView = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
    }, { rootMargin: '80px' });
    inView.observe(wrap);

    const render = () => {
      if (visible && texture) {
        gl.uniform1f(uniforms['u_time'], performance.now());
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      inView.disconnect();
      if (texture) gl.deleteTexture(texture);
      gl.deleteBuffer(buffer);
      gl.useProgram(null);
      gl.deleteProgram(program);
    };
  }, [src, blueish, scale, illumination, surfaceDistortion, waterDistortion]);

  return (
    <div ref={wrapRef} className={styles.ripple}>
      {/* Sin `next/image`: es una textura para WebGL y el respaldo de sí misma,
          así que no gana nada pasando por el optimizador con dos tamaños. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {failed && <img src={src} alt="" className={styles.rippleFallback} />}
      <canvas ref={canvasRef} className={styles.rippleCanvas} data-hidden={failed || undefined} />
    </div>
  );
}
