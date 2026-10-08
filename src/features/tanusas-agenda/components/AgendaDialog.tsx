'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { AgendaIcon } from './AgendaIcon';
import styles from './AgendaApp.module.css';

type Props = { title: string; closeLabel: string; onClose: () => void; children: ReactNode };

export function AgendaDialog({ title, closeLabel, onClose, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="agenda-dialog-title" data-lenis-prevent
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className={styles.dialogSurface}>
        <header className={styles.dialogHeader}>
          <h2 id="agenda-dialog-title">{title}</h2>
          <button type="button" className={styles.iconButton} aria-label={closeLabel} onClick={onClose} autoFocus><AgendaIcon name="close" /></button>
        </header>
        <div className={styles.dialogBody}>{children}</div>
      </div>
    </dialog>
  );
}
