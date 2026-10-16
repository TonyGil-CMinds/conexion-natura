/**
 * La galería: qué álbumes hay, dónde vive cada pieza y qué forma tiene el índice.
 *
 * Es código puro, sin nada de Next: lo leen la página y el script que sube las
 * fotos (`scripts/upload-gallery.ts`), y los dos tienen que nombrar igual cada
 * objeto del bucket.
 */

/** Todos los álbumes, en el orden de los botones. El script los sube todos. */
export const GALLERY_ALBUMS = ['quito', 'tanusas'] as const;

export type GalleryAlbum = (typeof GALLERY_ALBUMS)[number];

/**
 * Los que se enseñan. Tanusas está oculto: sigue en el bucket y en el índice,
 * pero la página no lo pinta ni lo abre por enlace. Volver a mostrarlo es
 * añadirlo aquí.
 */
export const VISIBLE_ALBUMS: readonly GalleryAlbum[] = ['quito'];

export function isGalleryAlbum(value: unknown): value is GalleryAlbum {
  return typeof value === 'string' && (GALLERY_ALBUMS as readonly string[]).includes(value);
}

export const GALLERY = {
  /** Carpeta del bucket: todo lo de la galería cuelga de aquí. */
  prefix: 'galeria',
  /** El índice que escribe el script al subir y lee la página. */
  manifestKey: 'galeria/manifest.json',
  /**
   * Ruta del mismo dominio que reenvía a la carpeta del bucket (ver
   * `next.config.ts`). Las imágenes se leen por aquí y no por la URL pública de
   * R2 porque el visor las sube a WebGL: una textura de otro origen exige CORS
   * de lectura, y la regla del bucket solo abre el PUT de los retratos. Por el
   * mismo dominio no hay nada que pedir.
   */
  proxyPath: '/galeria-media',
  /**
   * De dónde salen en local, dentro de `public/img`: una carpeta por álbum, con
   * `Preview` (lo que se ve) y `Originals` (lo que se descarga).
   */
  source: {
    dir: 'public/img',
    albums: { quito: 'Quito', tanusas: 'Tanusas' } satisfies Record<GalleryAlbum, string>,
    preview: 'Preview',
    originals: 'Originals',
  },
  /** Ancho de las miniaturas que genera el script: el doble de la tira, por la densidad. */
  thumbWidth: 240,
} as const;

/** Lo que vale como original, con su tipo. Las `.webp` de `Originals` se ignoran a propósito. */
export const ORIGINAL_TYPES = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  mp4: 'video/mp4',
} as const;

export type OriginalExt = keyof typeof ORIGINAL_TYPES;

/** Imágenes que valen como portada de un vídeo. */
const POSTER_EXTS = ['jpg', 'jpeg', 'png', 'webp'];

export type ManifestImage = { key: string; width: number; height: number };

export type ManifestPhoto = {
  id: string;
  /** Sin `kind`, foto: así siguen valiendo los índices de antes de los vídeos. */
  kind?: 'photo' | 'video';
  /** La imagen que se ve: la foto, o la portada del vídeo. */
  preview: ManifestImage;
  thumb: ManifestImage;
  /** Solo los vídeos: el que se reproduce, ligero. */
  video?: { key: string; bytes: number };
  original: ManifestImage & { bytes: number; filename: string };
};

/** El índice tal como se guarda en el bucket. */
export type GalleryManifest = {
  version: 1;
  updatedAt: string;
  albums: Record<GalleryAlbum, ManifestPhoto[]>;
};

/** Lo que recibe el visor: cada pieza con sus direcciones ya resueltas. */
export type GalleryPhoto = {
  id: string;
  /** La imagen que se ve, del mismo dominio: entra en WebGL. En un vídeo, su portada. */
  preview: string;
  thumb: string;
  /** Si es un vídeo, el que se reproduce. */
  video?: string;
  /** Lo que se descarga. */
  original: string;
  filename: string;
  /** Medidas de la preview. Solo hacen falta para la imagen de compartir. */
  width?: number;
  height?: number;
};

/** Sin tildes, en minúsculas y sin extensión: para comparar nombres de archivo. */
function normalize(name: string) {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

const extOf = (file: string) => file.slice(file.lastIndexOf('.') + 1).toLowerCase();
const baseOf = (file: string) => file.slice(0, file.lastIndexOf('.'));

/**
 * El nombre del archivo hecho id de URL: `_MSC0102` → `msc0102`,
 * `Recap Cóctel` → `recap-coctel`. Es lo que va en el enlace que se comparte,
 * así que tiene que ser estable entre subidas.
 */
export function photoId(basename: string) {
  return normalize(basename)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Las claves de una pieza en el bucket. */
export function photoKeys(album: GalleryAlbum, id: string, originalExt: string) {
  const base = `${GALLERY.prefix}/${album}`;
  return {
    preview: `${base}/preview/${id}.webp`,
    thumb: `${base}/thumb/${id}.webp`,
    video: `${base}/video/${id}.mp4`,
    original: `${base}/original/${id}.${originalExt}`,
  };
}

/** Con qué nombre se guarda al descargar: que diga de dónde es. */
export function downloadName(album: GalleryAlbum, id: string, ext: string) {
  return `ceiba-${album}-${id}.${ext}`;
}

export type SourcePair = {
  id: string;
  kind: 'photo' | 'video';
  /** En `Preview`: la foto (`.webp`) o el vídeo ligero (`.mp4`). */
  preview: string;
  /** En `Preview`, solo los vídeos: su portada, con el mismo nombre que el vídeo. */
  poster?: string;
  /** En `Originals`. Sin él no hay nada que descargar y la pieza no se sube. */
  original?: string;
  /** Extensión del original tal como se guarda (`jpeg` pasa a `jpg`). */
  originalExt?: string;
};

/**
 * Empareja lo de `Preview` con lo de `Originals`.
 *
 * El original se busca por nombre **aproximado**: sin tildes ni mayúsculas, y
 * vale que el nombre de la preview *empiece* por el del original. Las fotos se
 * llaman igual en las dos carpetas, pero un vídeo trae nombres como
 * `Recap Coctel - preview web 720p.mp4` frente a `Recap Cóctel.mp4`. Entre
 * varios candidatos gana el nombre más largo, que es el más parecido.
 *
 * Los vídeos van primero: son el resumen del álbum.
 */
export function pairSources(previews: string[], originals: string[]): SourcePair[] {
  const candidates = originals.filter((file) => extOf(file) in ORIGINAL_TYPES);
  const videoNames = new Set(previews.filter((file) => extOf(file) === 'mp4').map(baseOf));

  const pairs = previews
    // La portada de un vídeo no es una foto más, aunque sea `.webp`.
    .filter((file) => extOf(file) === 'mp4' || (extOf(file) === 'webp' && !videoNames.has(baseOf(file))))
    .map((file): SourcePair => {
      const kind = extOf(file) === 'mp4' ? 'video' : 'photo';
      const name = normalize(baseOf(file));
      const original = candidates
        .filter((candidate) => {
          const isVideo = extOf(candidate) === 'mp4';
          const candidateName = normalize(baseOf(candidate));
          return isVideo === (kind === 'video') && name.startsWith(candidateName);
        })
        .sort((a, b) => b.length - a.length)[0];
      const poster =
        kind === 'video'
          ? previews.find((other) => baseOf(other) === baseOf(file) && POSTER_EXTS.includes(extOf(other)) && other !== file)
          : undefined;
      const ext = original ? extOf(original) : undefined;

      return {
        id: photoId(original ? baseOf(original) : baseOf(file)),
        kind,
        preview: file,
        poster,
        original,
        originalExt: ext === 'jpeg' ? 'jpg' : ext,
      };
    });

  // Por código de carácter y no por idioma: es el orden que ya tenían las fotos.
  const byName = (a: SourcePair, b: SourcePair) => (a.preview < b.preview ? -1 : a.preview > b.preview ? 1 : 0);
  return pairs.sort((a, b) => (a.kind === b.kind ? byName(a, b) : a.kind === 'video' ? -1 : 1));
}
