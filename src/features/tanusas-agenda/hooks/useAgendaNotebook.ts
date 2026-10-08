'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { TANUSAS_SCHEDULE } from '@/config/tanusas-schedule';

export type Verdict = 'keep' | 'revise' | 'drop';
export type AgendaNotice = { id: string; session: string; kind: 'soon' | 'live' | 'test'; minutes: number; at: number; read: boolean };
export type Notebook = {
  notes: Record<string, string>;
  saved: string[];
  votes: Record<string, Verdict>;
  clarity: number[];
  settings: { reminders: boolean; minutes: number; sound: boolean; browser: boolean };
  inbox: AgendaNotice[];
};
export const NOTEBOOK_KEY = 'tanusas-agenda:2026:v1';
const keys = new Set<string>(TANUSAS_SCHEDULE.map((s) => s.key));
const defaults = (): Notebook => ({ notes: {}, saved: [], votes: {}, clarity: [], settings: { reminders: false, minutes: 5, sound: false, browser: false }, inbox: [] });

/** Local data is untrusted and may be from an older version. */
export function parseNotebook(raw: string | null): Notebook {
  const base = defaults();
  if (!raw) return base;
  try {
    const value = JSON.parse(raw);
    if (!value || typeof value !== 'object') return base;
    if (value.notes && typeof value.notes === 'object') base.notes = Object.fromEntries(Object.entries(value.notes).filter(([key, note]) => keys.has(key) && typeof note === 'string').map(([key, note]) => [key, (note as string).slice(0, 10000)]));
    if (Array.isArray(value.saved)) base.saved = [...new Set<string>(value.saved.filter((key: unknown) => typeof key === 'string' && keys.has(key)))];
    if (value.votes && typeof value.votes === 'object') base.votes = Object.fromEntries(Object.entries(value.votes).filter(([key, vote]) => Number.isInteger(Number(key)) && Number(key) >= 1 && Number(key) <= 16 && ['keep', 'revise', 'drop'].includes(String(vote)))) as Notebook['votes'];
    if (Array.isArray(value.clarity)) base.clarity = [...new Set<number>(value.clarity.filter((n: unknown) => Number.isInteger(n) && Number(n) >= 0 && Number(n) < 7))];
    if (value.settings && typeof value.settings === 'object') {
      for (const key of ['reminders', 'sound', 'browser'] as const) base.settings[key] = value.settings[key] === true;
      if ([5, 10, 15].includes(value.settings.minutes)) base.settings.minutes = value.settings.minutes;
    }
    if (Array.isArray(value.inbox)) base.inbox = value.inbox.filter((n: AgendaNotice) => n && typeof n.id === 'string' && ['soon', 'live', 'test'].includes(n.kind) && (keys.has(n.session) || n.kind === 'test') && Number.isFinite(n.at) && Number.isFinite(n.minutes) && typeof n.read === 'boolean').slice(0, 100);
    return base;
  } catch { return base; }
}

export function useAgendaNotebook() {
  const [data, setData] = useState<Notebook>(defaults);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const latest = useRef(data);
  const failed = useRef(false);
  useEffect(() => {
    try { latest.current = parseNotebook(localStorage.getItem(NOTEBOOK_KEY)); setData(latest.current); }
    catch { failed.current = true; setStorageError(true); }
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== NOTEBOOK_KEY || failed.current) return;
      latest.current = parseNotebook(event.newValue);
      setData(latest.current);
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const update = useCallback((change: (value: Notebook) => Notebook) => {
    let current = latest.current;
    try { const stored = !failed.current ? localStorage.getItem(NOTEBOOK_KEY) : null; if (stored) current = parseNotebook(stored); } catch { /* Keep the in-memory copy. */ }
    const next = change(current);
    latest.current = next;
    setData(next);
    try { localStorage.setItem(NOTEBOOK_KEY, JSON.stringify(next)); failed.current = false; setStorageError(false); }
    catch { failed.current = true; setStorageError(true); }
    return next;
  }, []);

  return { data, ready, storageError, update };
}
