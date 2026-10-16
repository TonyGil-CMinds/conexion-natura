/**
 * La galería del acto: las fotos de Quito y de Tanusas, para ver, descargar y
 * compartir una a una.
 *
 * Única API pública: la ruta carga las fotos, decide cuál abrir y monta el
 * visor. `loadGallery` es de servidor.
 */
export { GalleryViewer } from './components/GalleryViewer';
export { loadGallery, type GalleryData } from './lib/load-gallery';
export { resolveSelection } from './lib/selection';
export { VISIBLE_ALBUMS } from './config/gallery';
