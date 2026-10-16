'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Toast } from '@/components/ui/Toast';
import { QUITO } from '@/config/quito';
import { SITE } from '@/config/site';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import type { GalleryAlbum, GalleryPhoto } from '../config/gallery';
import { MorphGallery } from './MorphGallery';
import styles from './GalleryViewer.module.css';

type Album = { key: GalleryAlbum; photos: GalleryPhoto[] };

type Props = {
  locale: Locale;
  copy: Dictionary['gallery'];
  header: Dictionary['header'];
  /** Solo los álbumes con fotos, en su orden. */
  albums: Album[];
  /** Lo que pide la URL: el enlace compartido abre en esa foto. */
  initial: { album: GalleryAlbum; index: number };
};

/** Rellena los huecos `{nombre}` de una plantilla del diccionario. */
function fill(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, name: string) => String(values[name] ?? match));
}

/**
 * La galería: la foto a pantalla completa, el álbum arriba y las acciones a un
 * lado, como en el diseño.
 *
 * La foto actual **vive en la URL** (`?album=…&foto=…`): compartir una foto es
 * compartir ese enlace, y quien lo abre aterriza en ella —con la propia foto
 * como imagen de la tarjeta—.
 *
 * Compartir manda **el archivo** donde se puede (móvil, sobre todo): es lo que
 * se quiere para mandarla por un chat o subirla a una historia. Si no, el
 * enlace; y si tampoco, se copia.
 */
export function GalleryViewer({ locale, copy, header, albums, initial }: Props) {
  const [albumKey, setAlbumKey] = useState(initial.album);
  const [index, setIndex] = useState(initial.index);
  const [notice, setNotice] = useState<{ message: string; tone: 'info' | 'error' } | null>(null);

  const album = albums.find((candidate) => candidate.key === albumKey) ?? albums[0];
  const photos = useMemo(() => album?.photos ?? [], [album]);
  const photo = photos[index] ?? photos[0];
  const albumLabel = album ? copy.albums[album.key] : '';

  const items = useMemo(
    () =>
      photos.map((item, i) => ({
        src: item.preview,
        thumb: item.thumb,
        alt: fill(copy.photoAlt, { album: albumLabel, n: i + 1, total: photos.length }),
      })),
    [photos, albumLabel, copy.photoAlt],
  );

  const labels = useMemo(
    () => ({
      region: copy.region,
      previous: copy.previous,
      next: copy.next,
      show: (alt: string) => fill(copy.show, { photo: alt }),
      position: (n: number, total: number) => fill(copy.position, { n, total }),
    }),
    [copy],
  );

  // Estable: la galería escucha el teclado con ella.
  const onIndexChange = useCallback((next: number) => setIndex(next), []);

  /**
   * La URL sigue a la foto. `replaceState` y no `push`: pasar fotos no son
   * páginas, y llenar el historial haría que «atrás» recorriera la galería
   * entera antes de salir de ella.
   */
  useEffect(() => {
    if (!album || !photo) return;
    const url = new URL(window.location.href);
    url.searchParams.set('album', album.key);
    url.searchParams.set('foto', photo.id);
    window.history.replaceState(null, '', url);
  }, [album, photo]);

  /**
   * El archivo para compartir se prepara **antes** de pulsar: en Safari,
   * `navigator.share` tiene que llamarse en el mismo gesto, y una descarga en
   * medio lo rompe. Sale de la preview, que ya está en la caché por la galería.
   *
   * Se comparte en **JPEG** y no en el WebP de la preview: WhatsApp manda un
   * `.webp` como sticker, y hay apps que ni lo aceptan.
   */
  const shareFile = useRef<{ id: string; file: File } | null>(null);
  useEffect(() => {
    if (!photo || typeof navigator.canShare !== 'function') return;
    let cancelled = false;
    (async () => {
      const blob = await (await fetch(photo.preview)).blob();
      const bitmap = await createImageBitmap(blob);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      canvas.getContext('2d')?.drawImage(bitmap, 0, 0);
      bitmap.close();
      const jpeg = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.9));
      if (cancelled || !jpeg) return;
      const file = new File([jpeg], photo.filename.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' });
      if (navigator.canShare({ files: [file] })) shareFile.current = { id: photo.id, file };
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [photo]);

  const share = async () => {
    if (!album || !photo) return;
    const url = window.location.href;
    const title = fill(copy.shareTitle, { album: albumLabel });
    const ready = shareFile.current?.id === photo.id ? shareFile.current.file : null;

    try {
      if (ready && navigator.canShare?.({ files: [ready] })) {
        await navigator.share({ files: [ready], title, text: `${title} ${url}` });
      } else if (typeof navigator.share === 'function') {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setNotice({ message: copy.linkCopied, tone: 'info' });
      }
    } catch (error) {
      // Cerrar la hoja de compartir no es un fallo.
      if (error instanceof DOMException && error.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(url);
        setNotice({ message: copy.linkCopied, tone: 'info' });
      } catch {
        setNotice({ message: copy.shareFailed, tone: 'error' });
      }
    }
  };

  const brand = (
    <Link href={localePath(locale, '/')} aria-label={`${SITE.name} — ${header.home}`} className={styles.brand}>
      <Image src={QUITO.brand.src} alt={SITE.name} width={QUITO.brand.width} height={QUITO.brand.height} priority />
    </Link>
  );

  if (!album || !photo) {
    return (
      <div className={styles.root} data-quito>
        <div className={styles.top}>{brand}</div>
        <div className={styles.empty}>
          <p>{copy.empty}</p>
          <Link href={localePath(locale, '/')} className={styles.chip} data-tone="light">
            {copy.home}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root} data-quito>
      <MorphGallery
        // Otro álbum es otra lista: la galería se monta de nuevo y no intenta
        // disolverse entre fotos que no son vecinas.
        key={album.key}
        items={items}
        index={index}
        onIndexChange={onIndexChange}
        labels={labels}
        className={styles.stage}
      />

      <div className={styles.top}>
        {brand}

        {albums.length > 1 && (
          <div className={styles.albums} role="group" aria-label={copy.albumsLabel}>
            {albums.map((candidate) => (
              <button
                key={candidate.key}
                type="button"
                className={styles.chip}
                data-tone={candidate.key === album.key ? 'light' : 'glass'}
                aria-pressed={candidate.key === album.key}
                onClick={() => {
                  if (candidate.key === album.key) return;
                  setAlbumKey(candidate.key);
                  setIndex(0);
                }}
              >
                {copy.albums[candidate.key]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <p className={styles.counter} aria-hidden>
          {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
        </p>
        <button type="button" className={styles.chip} data-tone="glass" onClick={share}>
          {copy.share}
        </button>
        {/* En otro origen el navegador ignora `download`: lo que hace que se
            descargue es la cabecera con la que se subió el archivo. */}
        <a href={photo.original} download={photo.filename} className={styles.chip} data-tone="accent">
          {copy.download}
        </a>
      </div>

      <Toast message={notice?.message ?? null} tone={notice?.tone} duration={2800} onDismiss={() => setNotice(null)} />
    </div>
  );
}
