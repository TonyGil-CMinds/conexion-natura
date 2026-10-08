'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { AGENDA_PHOTO_SCENES, type AgendaPhoto, type AgendaPhotoScene } from '@/config/tanusas-photos';
import styles from './AgendaApp.module.css';

export function AgendaBackdrop({ scene, credit }: { scene: AgendaPhotoScene; credit: string }) {
  const [photo, setPhoto] = useState<AgendaPhoto | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/tanusas/agenda-photo?scene=${scene}`, { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (!controller.signal.aborted && data?.photo) setPhoto(data.photo); })
      .catch(() => { /* The local photo stays visible when Pexels is unavailable. */ });
    return () => controller.abort();
  }, [scene]);

  return <>
    <div className={styles.nowBackdrop} aria-hidden="true">
      <Image src={AGENDA_PHOTO_SCENES[scene].fallback} alt="" fill sizes="(max-width: 760px) 100vw, 500px" className={styles.nowPhoto} />
      {photo && <Image src={photo.src} alt="" fill sizes="(max-width: 760px) 100vw, 500px" className={`${styles.nowPhoto} ${styles.pexelsPhoto}`} data-loaded={loaded || undefined} onLoad={() => setLoaded(true)} onError={() => { setPhoto(null); setLoaded(false); }} />}
    </div>
    <p className={styles.photoCredit}>{photo && loaded && <>{credit} <a href={photo.url} target="_blank" rel="noopener noreferrer">{photo.photographer}</a> · <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">Pexels</a></>}</p>
  </>;
}
