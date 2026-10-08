'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Dictionary, Locale } from '@/i18n';
import { momentosOrdenados } from '@/config/tanusas-schedule';
import { useLiveAgenda } from '@/features/tanusas';
import { NOTEBOOK_KEY, parseNotebook, type AgendaNotice, type Notebook } from './useAgendaNotebook';

type Copy = Dictionary['tanusas']['agendaApp'];
type Props = { data: Notebook; ready: boolean; update: (change: (value: Notebook) => Notebook) => Notebook; copy: Copy; titles: Dictionary['tanusas']['agenda']['moments']; locale: Locale };
const moments = momentosOrdenados();

export function noticeText(notice: AgendaNotice, copy: Copy, titles: Props['titles']) {
  return {
    title: notice.kind === 'test' ? copy.testTitle : notice.kind === 'live' ? copy.starting : copy.soon.replace('{min}', String(notice.minutes)),
    body: notice.kind === 'test' ? copy.testBody : titles[notice.session as keyof typeof titles]?.title ?? '',
  };
}

export function useAgendaAlerts({ data, ready, update, copy, titles, locale }: Props) {
  const live = useLiveAgenda();
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [toast, setToast] = useState<AgendaNotice | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const seen = useRef(new Set<string>());

  const unlockAudio = useCallback(async () => {
    try {
      audio.current ??= new AudioContext();
      if (audio.current.state === 'suspended') await audio.current.resume();
    } catch { /* In-app alerts still work if audio is unavailable. */ }
  }, []);

  const play = useCallback(() => {
    const ctx = audio.current;
    if (!ctx || ctx.state !== 'running') return;
    [880, 1320].forEach((frequency, i) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + i * 0.2;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.12, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);
      oscillator.connect(gain).connect(ctx.destination);
      oscillator.start(start); oscillator.stop(start + 0.2);
    });
  }, []);

  useEffect(() => {
    const refresh = () => setPermission(typeof Notification === 'undefined' ? 'unsupported' : Notification.permission);
    refresh();
    window.addEventListener('focus', refresh);
    return () => { window.removeEventListener('focus', refresh); void audio.current?.close(); audio.current = null; };
  }, []);

  useEffect(() => {
    if (!data.settings.sound) return;
    const unlock = () => { void unlockAudio(); };
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => { window.removeEventListener('pointerdown', unlock); window.removeEventListener('keydown', unlock); };
  }, [data.settings.sound, unlockAudio]);

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') { setPermission('unsupported'); return; }
    try {
      // The permission request starts directly in the click gesture.
      const requested = Notification.requestPermission();
      if ('serviceWorker' in navigator) void navigator.serviceWorker.register('/tanusas/agenda-sw.js', { scope: '/tanusas/' }).catch(() => undefined);
      const result = await requested;
      setPermission(result);
      update((value) => ({ ...value, settings: { ...value.settings, browser: result === 'granted' } }));
    } catch { setPermission('unsupported'); }
  }, [update]);

  useEffect(() => {
    if (data.settings.browser && permission === 'granted' && 'serviceWorker' in navigator) {
      void navigator.serviceWorker.register('/tanusas/agenda-sw.js', { scope: '/tanusas/' }).catch(() => undefined);
    }
  }, [data.settings.browser, permission]);

  const notify = useCallback((notice: AgendaNotice) => {
    setToast(notice);
    if (data.settings.sound) play();
    if (!data.settings.browser || typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
    const text = noticeText(notice, copy, titles);
    const url = `/${locale}/tanusas/agenda${notice.session ? `?s=${notice.session}` : ''}`;
    void (async () => {
      try {
        const worker = 'serviceWorker' in navigator ? await navigator.serviceWorker.getRegistration('/tanusas/') : undefined;
        if (worker?.active) await worker.showNotification(text.title, { body: text.body, icon: '/favicon.svg', tag: notice.id, data: { url } });
        else {
          const notification = new Notification(text.title, { body: text.body, icon: '/favicon.svg', tag: notice.id });
          notification.onclick = () => { window.focus(); window.location.assign(url); notification.close(); };
        }
      } catch { /* The persisted inbox and toast remain available. */ }
    })();
  }, [copy, data.settings.browser, data.settings.sound, locale, play, titles]);

  useEffect(() => {
    if (!ready || !live || !data.settings.reminders) return;
    const now = Date.now();
    const candidate = live.actual && now - live.actual.desde.getTime() < 60_000
      ? { session: live.actual.key, kind: 'live' as const, minutes: 0 }
      : live.siguiente && live.faltan !== null && live.faltan <= data.settings.minutes
        ? { session: live.siguiente.key, kind: 'soon' as const, minutes: live.faltan }
        : null;
    if (!candidate) return;
    const id = `2026:${candidate.session}:${candidate.kind}`;
    if (seen.current.has(id) || data.inbox.some((n) => n.id === id)) return;
    seen.current.add(id);
    const deliver = () => {
      try { if (parseNotebook(localStorage.getItem(NOTEBOOK_KEY)).inbox.some((n) => n.id === id)) return; } catch { /* Memory dedupe remains active. */ }
      const notice: AgendaNotice = { ...candidate, id, at: now, read: false };
      update((value) => ({ ...value, inbox: [notice, ...value.inbox].slice(0, 100) }));
      notify(notice);
    };
    if (navigator.locks) void navigator.locks.request('tanusas-agenda-alert', deliver);
    else deliver();
  }, [data.inbox, data.settings.minutes, data.settings.reminders, live, notify, ready, update]);

  const test = useCallback(() => {
    const notice: AgendaNotice = { id: `test:${Date.now()}`, kind: 'test', session: '', minutes: 0, at: Date.now(), read: false };
    update((value) => ({ ...value, inbox: [notice, ...value.inbox].slice(0, 100) }));
    void unlockAudio().then(() => notify(notice));
  }, [notify, unlockAudio, update]);

  const active = live?.actual ?? live?.siguiente ?? null;
  const currentIndex = active ? moments.findIndex((m) => m.key === active.key) : moments.length;
  return { live, active, currentIndex, permission, requestPermission, toast, dismiss: () => setToast(null), test, unlockAudio };
}
