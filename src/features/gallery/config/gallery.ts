/**
 * La galería: qué álbumes hay, dónde vive cada foto y qué forma tiene el índice.
 *
 * Es código puro, sin nada de Next: lo leen la página y el script que sube las
 * fotos (`scripts/upload-gallery.ts`), y los dos tienen que nombrar igual cada
 * objeto del bucket.
 */

/** En el orden de los botones. El primero es el que se abre por omisión. */
export const GALLERY_ALBUMS = ['quito', 'tanusas'] as const;

export type GalleryAlbum = (typeof GALLERY_ALBUMS)[number];

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
   * `next.config.ts`). Las previews se leen por aquí y no por la URL pública de
   * R2 porque el visor las sube a WebGL: una textura de otro origen exige CORS
   * de lectura, y la regla del bucket solo abre el PUT de los retratos. Por el
   * mismo dominio no hay nada que pedir.
   */
  proxyPath: '/galeria-media',
  /**
   * De dónde salen las fotos en local, dentro de `public/img`: una carpeta por
   * álbum, con `Preview` (lo que se ve) y `Originals` (lo que se descarga).
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

/** Extensiones válidas de un original. Las `.webp` de `Originals` se ignoran a propósito. */
export const ORIGINAL_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' } as const;

export type ManifestImage = { key: string; width: number; height: number };

export type ManifestPhoto = {
  id: string;
  preview: ManifestImage;
  thumb: ManifestImage;
  original: ManifestImage & { bytes: number; filename: string };
};

/** El índice tal como se guarda en el bucket. */
export type GalleryManifest = {
  version: 1;
  updatedAt: string;
  albums: Record<GalleryAlbum, ManifestPhoto[]>;
};

/** Lo que recibe el visor: cada foto con sus direcciones ya resueltas. */
export type GalleryPhoto = {
  id: string;
  /** La que se ve, del mismo dominio: entra en WebGL. */
  preview: string;
  thumb: string;
  /** La que se descarga. */
  original: string;
  filename: string;
  /** Medidas de la preview. Solo hacen falta para la imagen de compartir. */
  width?: number;
  height?: number;
};

/**
 * El nombre de cámara hecho id de URL: `_MSC0102` → `msc0102`. Es lo que va en
 * el enlace que se comparte, así que tiene que ser estable entre subidas.
 */
export function photoId(basename: string) {
  return basename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Las tres claves de una foto en el bucket. */
export function photoKeys(album: GalleryAlbum, id: string, originalExt: string) {
  const base = `${GALLERY.prefix}/${album}`;
  return {
    preview: `${base}/preview/${id}.webp`,
    thumb: `${base}/thumb/${id}.webp`,
    original: `${base}/original/${id}.${originalExt}`,
  };
}

/** Con qué nombre se guarda al descargar: que diga de dónde es. */
export function downloadName(album: GalleryAlbum, id: string, ext: string) {
  return `ceiba-${album}-${id}.${ext}`;
}
