/**
 * Dibuja la credencial en un lienzo, en el navegador.
 *
 * El arte viene de `public/img/card-front.png` y el código solo añade el retrato
 * y los datos, sobre coordenadas del lienzo de diseño de 430×600: la ventana del
 * retrato y la banda del nombre están fijadas ahí.
 *
 * Vive aparte del componente porque no toca la interfaz —solo pinta píxeles— y
 * porque el resultado se usa para tres cosas: verlo, descargarlo y compartirlo.
 */

import { PORTRAIT } from './portrait';

/**
 * Arte y tintas de una credencial.
 *
 * Va como dato y no fijado en el código porque hay **dos** actos con la misma
 * geometría y distinta paleta: comprobé casilla a casilla que el arte del retiro
 * repite los mismos escalones en los mismos sitios, así que lo único que cambia
 * son los archivos y los colores de la banda.
 */
export type BadgeArt = {
  front: string;
  back: string;
  /** Fondo de la banda del nombre: el mismo del arte, para que no se note. */
  band: string;
  /** Tinta de los datos sobre esa banda. */
  ink: string;
  /** Viñeta junto a la organización, o `null` donde su color no se vería. */
  glyph: string | null;
  /** Raíz del nombre del archivo al descargar o compartir. */
  fileName: string;
};

/** La del acto de Quito, que es la de omisión. */
export const CEIBA_BADGE: BadgeArt = {
  front: '/img/card-front.png',
  back: '/img/card-back.png',
  band: '#151d17',
  ink: '#f7ffd2',
  glyph: '/icons/icon-logo.svg',
  fileName: 'ceiba-quito',
};

/** Datos que salen impresos en la tarjeta. */
export type BadgeFields = {
  name: string;
  surname: string;
  organization: string;
  /** URL del retrato en R2, o `null` si no subió ninguno. */
  photoUrl: string | null;
};

/** El lienzo se pinta a triple resolución: la tarjeta se descarga y se comparte. */
const SCALE = 3;

/**
 * Los retratos viven en R2, en otro dominio, y una imagen de otro dominio
 * dibujada en el lienzo lo deja «contaminado»: `toDataURL()` lanza y se caen
 * descargar y compartir. La salida habitual es `crossOrigin`, pero entonces
 * pintar la credencial depende de que ese dominio esté en la regla CORS del
 * bucket —y esa regla se edita a mano—.
 *
 * Así que el retrato se pide **por nuestro propio origen**, que reenvía los
 * bytes: misma imagen, sin CORS de por medio y sin lienzo contaminado en ningún
 * dominio. Lo que no venga de R2 —el arte de la tarjeta, el glifo— se carga tal
 * cual, porque ya es del sitio.
 */
function sameOrigin(source: string) {
  return /^https?:/i.test(source) ? `/api/photo?url=${encodeURIComponent(source)}` : source;
}

function loadImage(source: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`No se pudo cargar la imagen: ${source}`));
    image.src = sameOrigin(source);
  });
}

/**
 * Compone la credencial y la devuelve como URL de datos.
 *
 * Si el retrato no se puede cargar —bucket sin CORS, imagen borrada— se sigue
 * sin él: una tarjeta con el hueco vacío es mejor que ninguna tarjeta.
 */
export async function renderBadge(fields: BadgeFields, art: BadgeArt = CEIBA_BADGE): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 430 * SCALE;
  canvas.height = 600 * SCALE;
  const context = canvas.getContext('2d');
  if (!context) return art.front;
  context.scale(SCALE, SCALE);

  const template = await loadImage(art.front);
  context.drawImage(template, 0, 0, 430, 600);

  if (fields.photoUrl) {
    try {
      const portrait = await loadImage(fields.photoUrl);
      // `cover` centrado: el retrato llena la ventana sin deformarse.
      const scale = Math.max(
        PORTRAIT.width / portrait.width,
        PORTRAIT.height / portrait.height,
      );
      const drawWidth = portrait.width * scale;
      const drawHeight = portrait.height * scale;
      context.save();
      // El retrato solo puede vivir dentro del hueco central: no debe invadir
      // los escalones verdes que lo enmarcan en el arte.
      context.beginPath();
      context.rect(PORTRAIT.x, PORTRAIT.y, PORTRAIT.width, PORTRAIT.height);
      context.clip();
      context.drawImage(
        portrait,
        PORTRAIT.x + (PORTRAIT.width - drawWidth) / 2,
        PORTRAIT.y + (PORTRAIT.height - drawHeight) / 2,
        drawWidth,
        drawHeight,
      );
      context.restore();
    } catch (error) {
      /**
       * Sin retrato: el arte ya trae su propio hueco, y una tarjeta con el hueco
       * vacío es mejor que ninguna tarjeta. Pero se anota: el fallo era
       * invisible, y una credencial sin foto por un error de carga se confunde
       * con una credencial de alguien que no subió ninguna.
       */
      console.warn('[credencial] no se pudo dibujar el retrato', error);
    }
  }

  // Banda opaca del nombre, del mismo color que el fondo del arte.
  context.fillStyle = art.band;
  context.fillRect(32, 482, 310, 62);
  context.fillStyle = art.ink;
  context.font = '600 15px ui-monospace, monospace';
  context.fillText(`${fields.name} ${fields.surname}`.trim().toUpperCase(), 32, 508);
  context.font = '10px ui-monospace, monospace';

  /**
   * La viñeta es de una tinta fija, así que solo se pinta donde se ve: sobre el
   * crema del retiro desaparecería, y la organización empieza en su sitio en
   * lugar de quedar sangrada contra un hueco vacío.
   */
  let textX = 32;
  if (art.glyph) {
    try {
      const icon = await loadImage(art.glyph);
      context.drawImage(icon, 32, 520, 13, 13);
      textX = 55;
    } catch {
      // Sin el glifo, la organización se pinta igual: solo pierde su viñeta.
    }
  }
  context.fillText(fields.organization.toUpperCase(), textX, 532);

  return canvas.toDataURL('image/png');
}

/** Descarga la tarjeta ya compuesta. */
export function downloadBadge(image: string, name: string, art: BadgeArt = CEIBA_BADGE): void {
  const link = document.createElement('a');
  link.href = image;
  link.download = `credencial-${name.trim().toLowerCase().replace(/\s+/g, '-') || art.fileName}.png`;
  link.click();
}

/**
 * Comparte la tarjeta como archivo.
 *
 * Con la hoja de compartir del sistema —móviles— va la imagen; sin ella no hay
 * nada que abrir, así que se copia el enlace del sitio, que es lo único que se
 * puede pegar en otro sitio. Devuelve qué de las dos cosas ocurrió para que la
 * pantalla lo pueda contar.
 */
export async function shareBadge(
  image: string,
  copy: { title: string; text: string },
  art: BadgeArt = CEIBA_BADGE,
): Promise<'shared' | 'copied' | 'unavailable'> {
  const blob = await (await fetch(image)).blob();
  const file = new File([blob], `mi-credencial-${art.fileName}.png`, { type: 'image/png' });

  if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
    try {
      await navigator.share({ title: copy.title, text: copy.text, files: [file] });
      return 'shared';
    } catch {
      // Cancelar la hoja de compartir no es un fallo: no se cuenta nada.
      return 'unavailable';
    }
  }

  try {
    await navigator.clipboard.writeText(window.location.href);
    return 'copied';
  } catch {
    return 'unavailable';
  }
}
