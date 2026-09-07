'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ThemedImage } from '@/components/ui/ThemedImage';
import { RegistrationCta } from '@/features/registration';
import { NAV_LINKS, SITE } from '@/config/site';
import { localePath, type Dictionary, type Locale } from '@/i18n';
import { gsap } from '@/lib/gsap';
import styles from './MobileMenu.module.css';

type Props = {
  locale: Locale;
  labels: Dictionary['nav'];
  header: Dictionary['header'];
  cta: { label: string; confirmedLabel: string; note: string };
};

export function MobileMenu({ locale, labels, header, cta }: Props) {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const unlockRef = useRef<(() => void) | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const finishClose = useCallback(() => {
    dialogRef.current?.close();
    unlockRef.current?.();
    unlockRef.current = null;
    setIsOpen(false);
    if (triggerRef.current?.getClientRects().length) triggerRef.current.focus({ preventScroll: true });
  }, []);

  const close = useCallback(() => {
    if (!dialogRef.current?.open) return;
    const timeline = timelineRef.current;
    if (!timeline || window.matchMedia('(prefers-reduced-motion: reduce)').matches || timeline.progress() === 0) {
      timeline?.pause(0);
      finishClose();
    } else {
      timeline.timeScale(1.4).reverse();
    }
  }, [finishClose]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ paused: true, onReverseComplete: finishClose });
      // The right edge leads; five masks form one continuous staircase.
      for (let step = 0; step < 5; step++) {
        timeline.fromTo(dialog, { [`--step-${step}`]: '0%' }, {
          [`--step-${step}`]: '100%', duration: 0.55, ease: 'power2.inOut',
        }, (4 - step) * 0.07);
      }
      timeline.fromTo('[data-menu-label]', { yPercent: 115 }, {
        yPercent: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out',
      }, 0.22);
      timeline.fromTo('[data-menu-cta]', { opacity: 0, y: 16 }, {
        opacity: 1, y: 0, duration: 0.3,
      }, 0.5);
      timelineRef.current = timeline;
    }, dialog);

    const desktop = window.matchMedia('(min-width: 901px)');
    const onResize = () => {
      if (desktop.matches && dialog.open) {
        timelineRef.current?.pause(0);
        finishClose();
      }
    };
    desktop.addEventListener('change', onResize);
    return () => {
      desktop.removeEventListener('change', onResize);
      context.revert();
      timelineRef.current = null;
      dialog.close();
      unlockRef.current?.();
      unlockRef.current = null;
    };
  }, [finishClose]);

  // Also handles browser history and navigation triggered outside this menu.
  useEffect(() => { close(); }, [pathname, close]);

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    const body = document.body;
    const scrollY = window.scrollY;
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    unlockRef.current = () => {
      Object.assign(body.style, previous);
      window.scrollTo({ top: scrollY, behavior: 'instant' });
    };
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });
    setIsOpen(true);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      timelineRef.current?.progress(1).pause();
    } else {
      timelineRef.current?.timeScale(1).restart();
    }
  };

  return (
    <>
      <button ref={triggerRef} type="button" className={styles.trigger} onClick={open}
        aria-label={header.openMenu} aria-expanded={isOpen} aria-controls="mobile-navigation" aria-haspopup="dialog">
        <span className={styles.burgerIcon} aria-hidden />
      </button>
      <dialog ref={dialogRef} id="mobile-navigation" className={styles.dialog} aria-label={labels.ariaLabel}
        onCancel={(event) => { event.preventDefault(); close(); }}
        onClick={(event) => {
          const anchor = (event.target as HTMLElement).closest('a');
          if (anchor && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) close();
        }}>
        <div className={styles.topbar}>
          <Link href={localePath(locale, '/')} aria-label={`${SITE.name} — ${header.home}`}>
            <ThemedImage dark="/brand/icon-dark-ceibaquito.svg" light="/brand/icon-light-ceibaquito.svg"
              alt={SITE.name} width={123} height={27} />
          </Link>
          <button ref={closeRef} type="button" className={styles.close} onClick={close} aria-label={header.closeMenu}>
            <span className={styles.closeIcon} aria-hidden />
          </button>
        </div>
        <div className={styles.content}>
          <nav aria-label={labels.ariaLabel}>
            <ul className={styles.links}>
              {NAV_LINKS.filter((link) => link.key !== 'register').map((link) => {
                const href = localePath(locale, link.href);
                return (
                  <li key={link.key} className={styles.mask}>
                    <Link href={href} className={styles.link} aria-current={pathname === href ? 'page' : undefined}>
                      <span data-menu-label>{labels[link.key]}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className={styles.cta} data-menu-cta>
            <RegistrationCta label={cta.label} confirmedLabel={cta.confirmedLabel}
              href={localePath(locale, SITE.cta.href)} size="mobile" />
            <p className={styles.note}>{cta.note}</p>
          </div>
        </div>
      </dialog>
    </>
  );
}
