'use client';

import { useEffect, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from 'framer-motion';
import { AgendaTransition } from './AgendaTransition';
import { AgendaIcon } from './AgendaIcon';
import styles from './AgendaApp.module.css';

type Props = { title: string; closeLabel: string; onClose: () => void; children: ReactNode };

export function AgendaDialog({ title, closeLabel, onClose, children }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const present = useIsPresent();
  const reduced = useReducedMotion();
  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return;
    const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(
      'button, a[href], input, select, textarea, summary, [tabindex]',
    )).filter((element) => element.tabIndex >= 0 && !element.matches(':disabled') && !element.closest('[inert]') && element.getClientRects().length > 0);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }
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
    <motion.dialog ref={dialog} className={styles.dialog} aria-labelledby="agenda-dialog-title" data-lenis-prevent
      data-closing={!present || undefined}
      onKeyDown={trapFocus}
      initial={{ y: reduced ? 0 : '100%', opacity: reduced ? 1 : 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: reduced ? 0 : '100%', opacity: 0 }}
      transition={reduced ? { duration: 0 } : present
        ? { y: { type: 'spring', stiffness: 300, damping: 26, mass: 0.9 }, opacity: { duration: 0.18 } }
        : { duration: 0.22, ease: [0.4, 0, 1, 1] }}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className={styles.dialogSurface}>
        <header className={styles.dialogHeader}>
          <h2 id="agenda-dialog-title">{title}</h2>
          <button type="button" className={styles.iconButton} aria-label={closeLabel} onClick={onClose} autoFocus><AgendaIcon name="close" /></button>
        </header>
        <div className={styles.dialogBody}><AnimatePresence mode="wait" initial={false}>
          <AgendaTransition key={title}><div className={styles.dialogContent}>{children}</div></AgendaTransition>
        </AnimatePresence></div>
      </div>
    </motion.dialog>
  );
}
