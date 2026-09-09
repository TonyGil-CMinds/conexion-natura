/**
 * Preparación del retrato: quitar el fondo y dejar el encuadre elegido cocido en
 * el archivo que se sube.
 *
 * Las dos cosas ocurren en el navegador y ninguna toca la interfaz, así que
 * viven aquí y no en la pantalla que las usa.
 */

/** Encuadre elegido: zoom y desplazamiento dentro de la ventana del retrato. */
export type Crop = { zoom: number; x: number; y: number };

/** Encuadre de partida: la imagen entera, centrada. */
export const CROP_RESET: Crop = { zoom: 1, x: 0, y: 0 };

/**
 * Zona del retrato dentro del arte de la credencial, en puntos de diseño.
 *
 * La proporción del editor sale de aquí: se recorta mirando la misma ventana en
 * la que después se pinta.
 */
export const PORTRAIT = { x: 108, y: 174, width: 214, height: 270 } as const;

/** Topes de los mandos del editor. Los mismos que valida el recorte. */
export const CROP_LIMITS = {
  zoom: { min: 0.8, max: 2.8, step: 0.05 },
  x: { min: -70, max: 70 },
  y: { min: -90, max: 90 },
} as const;

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    if (/^https?:/i.test(source)) image.crossOrigin = 'anonymous';
    image.src = source;
  });
}

/**
 * Quita el fondo de la fotografía.
 *
 * El modelo se carga **a demanda** (`import()` dentro de la función): son varios
 * megas de red y de memoria, y quien no sube una foto no debería pagarlos.
 *
 * Si no se puede cargar —sin conexión, o un navegador que no lo soporta— se
 * devuelve la imagen original: una credencial con fondo es mejor que un registro
 * bloqueado.
 */
export async function removePhotoBackground(file: Blob): Promise<Blob> {
  try {
    const { removeBackground } = await import('@imgly/background-removal');
    return await removeBackground(file);
  } catch {
    return file;
  }
}

/**
 * Encaja el retrato en la ventana: `cover` con el zoom y el desplazamiento
 * elegidos. La misma cuenta sirve para el editor y para el archivo que se sube,
 * y por eso vive aparte.
 */
export function portraitPlacement(
  portrait: HTMLImageElement,
  crop: Crop,
  scaleFactor = 1,
) {
  const width = PORTRAIT.width * scaleFactor;
  const height = PORTRAIT.height * scaleFactor;
  const scale = Math.max(width / portrait.width, height / portrait.height) * crop.zoom;
  const drawWidth = portrait.width * scale;
  const drawHeight = portrait.height * scale;
  return {
    width,
    height,
    drawWidth,
    drawHeight,
    x: (width - drawWidth) / 2 + crop.x * scaleFactor,
    y: (height - drawHeight) / 2 + crop.y * scaleFactor,
  };
}

/**
 * Deja el recorte **cocido** en el archivo que se sube.
 *
 * El encuadre se elige en el navegador y no se guarda en ninguna columna, así
 * que si se subiera la imagen entera, al recargar la credencial se dibujaría con
 * el encuadre por defecto y la tarjeta cambiaría de aspecto sola. Recortando
 * antes de subir, la imagen guardada **es** lo que se ve, y además pesa menos.
 */
export async function renderPortrait(source: string, crop: Crop): Promise<Blob> {
  const scaleFactor = 3;
  const portrait = await loadImage(source);
  const place = portraitPlacement(portrait, crop, scaleFactor);
  const canvas = document.createElement('canvas');
  canvas.width = place.width;
  canvas.height = place.height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('No se pudo preparar la imagen.');
  context.drawImage(portrait, place.x, place.y, place.drawWidth, place.drawHeight);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('No se pudo preparar la imagen.'))),
      'image/png',
    );
  });
}
