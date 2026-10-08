'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { LocaleSwitch } from '@/components/layout/LocaleSwitch';
import { momentosOrdenados, TANUSAS_DAYS, type TanusasDayKey } from '@/config/tanusas-schedule';
import { SESSION_ALIASES } from '@/config/tanusas-agenda';
import { agendaPhotoScene } from '@/config/tanusas-photos';
import type { Dictionary, Locale } from '@/i18n';
import { useAgendaNotebook } from '../hooks/useAgendaNotebook';
import { noticeText, useAgendaAlerts } from '../hooks/useAgendaAlerts';
import { createCalendar, downloadText, exportNotebook } from '../lib/export';
import { AgendaTransition } from './AgendaTransition';
import { AgendaBackdrop } from './AgendaBackdrop';
import { AgendaDialog } from './AgendaDialog';
import { AgendaWelcome } from './AgendaWelcome';
import { AgendaIcon, type AgendaIconName } from './AgendaIcon';
import { SessionContent, WorkshopViews } from './WorkshopContent';
import styles from './AgendaApp.module.css';

type Props = { copy: Dictionary['tanusas']['agendaApp']; agenda: Dictionary['tanusas']['agenda']; header: Dictionary['header']; locale: Locale };
type View = 'agenda' | 'hypotheses' | 'direction';
type Filter = 'all' | 'work' | 'saved';
const moments = momentosOrdenados();
const icons: Record<string, AgendaIconName> = { bloque: 'compass', pausa: 'coffee', traslado: 'move', libre: 'leaf' };
const dayColors: Record<string, string> = { jueves: '#D0FF00', viernes: '#F62FA2', sabado: '#005BE8' };
const viewIcons: Record<View, AgendaIconName> = { agenda: 'agenda', hypotheses: 'leaf', direction: 'compass' };

function resolveSession(value: string | null) {
  const key = value ? SESSION_ALIASES[value] ?? value : null;
  return moments.some((moment) => moment.key === key) ? key : null;
}

export function AgendaApp({ copy, agenda, header, locale }: Props) {
  const notebook = useAgendaNotebook();
  const { data, update, ready, storageError } = notebook;
  const welcome = ready && !data.onboardingComplete;
  const alerts = useAgendaAlerts({ data, update, ready, copy, titles: agenda.moments, locale });
  const { live, active } = alerts;
  const reducedMotion = useReducedMotion();
  const [view, setView] = useState<View>('agenda');
  const [chosenDay, setChosenDay] = useState<TanusasDayKey | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [sessionKey, setSessionKey] = useState<string | null>(null);
  const [sheet, setSheet] = useState<'inbox' | 'settings' | null>(null);
  const [feedback, setFeedback] = useState('');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pendingScroll = useRef(false);
  const today = live ? new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Guayaquil', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()) : null;
  const calendarDay = TANUSAS_DAYS.find((item) => item.date === today)?.key;
  const day = chosenDay ?? calendarDay ?? live?.diaVisible ?? 'jueves';
  const dayIndex = agenda.days.findIndex((item) => item.key === day);
  const currentDay = agenda.days[dayIndex]!;
  const allDay = moments.filter((moment) => moment.day === day);
  const visible = allDay.filter((moment) => filter === 'all' || (filter === 'saved' ? data.saved.includes(moment.key) : moment.tono === 'bloque'));
  const session = moments.find((moment) => moment.key === sessionKey);
  const unread = data.inbox.filter((notice) => !notice.read).length;
  const activeText = active ? agenda.moments[active.key as keyof typeof agenda.moments] : null;
  const remaining = live?.actual ? Math.ceil((1 - live.avance) * (live.actual.hasta.getTime() - live.actual.desde.getTime()) / 60000) : live?.faltan ?? 0;
  const count = remaining >= 1440 ? Math.ceil(remaining / 1440) : remaining >= 120 ? Math.ceil(remaining / 60) : remaining;
  const unit = remaining >= 1440 ? copy.days : remaining >= 120 ? copy.hours : copy.minutes;
  const status = live?.estado === 'despues' ? copy.ended : live?.actual ? copy.live : live?.estado === 'antes' ? copy.before : copy.next;
  const progress = live?.actual ? live.avance : live?.estado === 'despues' ? 1 : 0;
  const next = live?.actual ? live.siguiente : null;
  const photoScene = agendaPhotoScene(active);

  useEffect(() => {
    const readUrl = () => {
      const key = resolveSession(new URL(window.location.href).searchParams.get('s'));
      setSessionKey(key);
      if (key) setChosenDay(moments.find((moment) => moment.key === key)!.day);
    };
    readUrl();
    window.addEventListener('popstate', readUrl);
    return () => window.removeEventListener('popstate', readUrl);
  }, []);

  useEffect(() => {
    if (!pendingScroll.current || view !== 'agenda') return;
    const target = document.querySelector<HTMLElement>(`[data-session="${active?.key ?? 'cierre'}"]`);
    if (target) pendingScroll.current = false;
    target?.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'instant' : 'smooth' });
    target?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
  }, [active?.key, day, filter, reducedMotion, view, chosenDay]);

  function openSession(key: string | null) {
    setFeedback('');
    setSheet(null);
    setSessionKey(key);
    const url = new URL(window.location.href);
    if (key) url.searchParams.set('s', key); else url.searchParams.delete('s');
    window.history.replaceState(window.history.state, '', url);
  }

  function openSheet(value: 'settings' | 'inbox') {
    openSession(null);
    setSheet(value);
  }

  function finishWelcome(silent = false) {
    if (!silent && data.settings.sound) void alerts.unlockAudio();
    update((value) => ({ ...value, onboardingComplete: true, settings: silent
      ? { ...value.settings, reminders: false, sound: false, browser: false }
      : value.settings }));
  }

  function goNow() {
    pendingScroll.current = true;
    setView('agenda'); setFilter('all'); setChosenDay(active?.day ?? 'sabado');
    // If the requested day is already visible, no state change is necessary.
    requestAnimationFrame(() => {
      if (!pendingScroll.current) return;
      const target = document.querySelector<HTMLElement>(`[data-session="${active?.key ?? 'cierre'}"]`);
      if (target) pendingScroll.current = false;
      target?.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'instant' : 'smooth' });
      target?.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
    });
  }

  function changeView(value: View) {
    if (value === view) return;
    pendingScroll.current = false;
    setView(value);
  }

  function navigateDay(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const to = event.key === 'ArrowRight' ? (index + 1) % 3 : event.key === 'ArrowLeft' ? (index + 2) % 3 : event.key === 'Home' ? 0 : event.key === 'End' ? 2 : null;
    if (to === null) return;
    event.preventDefault(); setChosenDay(agenda.days[to]!.key as TanusasDayKey); tabRefs.current[to]?.focus();
  }

  function calendar(key?: string) {
    downloadText(createCalendar(key ? moments.filter((moment) => moment.key === key) : moments, agenda, window.location.origin, locale), `tanusas-${key ?? '2026'}.ics`, 'text/calendar;charset=utf-8');
    setFeedback(copy.calendarDone);
  }

  const exportNotes = () => {
    downloadText(exportNotebook(data, copy, agenda), 'tanusas-mis-notas.txt', 'text/plain;charset=utf-8');
    setFeedback(copy.notesDone);
  };

  return <LayoutGroup id="tanusas-agenda"><div className={styles.root} data-agenda-day={day}>
    <header className={styles.header}>
      {/**
        * El logotipo lleva al sitio y ya no a la micropágina: esa dirección
        * redirige aquí, así que pulsarlo no habría movido nada.
        */}
      <Link className={styles.brand} href={`/${locale}`} aria-label={copy.home}>
        <span className={styles.brandLogo} role="img" aria-label="CEIBA · Tanusas" />
      </Link>
      <span className={styles.headerTitle}>TANUSAS <span>/</span> 2026</span>
      <div className={styles.headerActions}>
        <LocaleSwitch locale={locale} label={header.language} />
        <button type="button" className={styles.iconButton} onClick={() => openSheet('inbox')} aria-label={`${copy.inbox}${unread ? ` · ${unread} ${copy.unread}` : ''}`}><AgendaIcon name="bell" />{unread > 0 && <span className={styles.badge}>{unread}</span>}</button>
      </div>
    </header>

    <main className={styles.main}>
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => { if (!pendingScroll.current) window.scrollTo({ top: 0, behavior: 'instant' }); }}>
      <AgendaTransition key={view} onEntered={() => {
        if (!pendingScroll.current) return;
        const target = document.querySelector<HTMLElement>(`[data-session="${active?.key ?? 'cierre'}"]`);
        if (!target) return;
        pendingScroll.current = false;
        target.scrollIntoView({ block: 'center', behavior: reducedMotion ? 'instant' : 'smooth' });
        target.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true });
      }}>
      {view === 'agenda' ? <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.intro}><h1>{copy.title}</h1><p>{copy.subtitle}</p></div>
          <div className={styles.dayTabs} role="tablist" aria-label={copy.dayAgenda}>
            {agenda.days.map((item, i) => <button type="button" key={item.key} id={`app-day-${i}`} role="tab" data-day={item.key} aria-selected={dayIndex === i} aria-controls={`app-panel-${i}`} tabIndex={dayIndex === i ? 0 : -1}
              ref={(element) => { tabRefs.current[i] = element; }} onKeyDown={(event) => navigateDay(event, i)} onClick={() => setChosenDay(item.key as TanusasDayKey)}>
              <>{dayIndex === i && <motion.span className={styles.dayActive} layoutId={reducedMotion ? undefined : 'active-day'} style={{ backgroundColor: dayColors[item.key] }} transition={{ type: 'spring', stiffness: 380, damping: 32 }} aria-hidden="true" />}</><span className={styles.dayLabel}>{item.tab.replace(/\s\d+$/, '')}</span><strong>{String(8 + i).padStart(2, '0')}</strong><span className={styles.dayIndicator} aria-hidden="true">{dayIndex === i ? '↗' : '·'}</span>
            </button>)}
          </div>
          <section className={styles.nowCard} aria-label={copy.nav.now} data-live={!!live?.actual}>
            <div className={styles.nowTop}><span><i />{status}</span><AgendaIcon name="sun" /></div>
            <div className={styles.nowBody}>
              <div className={styles.ring}>
                <svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" /><circle className={styles.ringProgress} cx="60" cy="60" r="52" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress * 100} /></svg>
                <div>{live?.estado === 'despues' ? <AgendaIcon name="check" /> : <><strong>{live ? String(count).padStart(2, '0') : '—'}</strong><span>{unit}</span></>}</div>
              </div>
              <div className={styles.nowContent}><p className={styles.eyebrow}>{live?.estado === 'despues' ? copy.ended : live?.actual ? copy.remaining : copy.until}</p><h2>{activeText?.title ?? (live ? copy.after : copy.title)}</h2>{active && <p>{live?.actual ? copy.ends : copy.starts} <b>{live?.actual ? active.end : active.start}</b></p>}</div>
            </div>
            {active ? <button type="button" className={styles.nowAction} onClick={() => openSession(active.key)}>{copy.details}<AgendaIcon name="arrow" /></button> : <p className={styles.muted}>{live?.estado === 'despues' ? copy.afterBody : copy.clock}</p>}
            <AgendaBackdrop key={photoScene} scene={photoScene} credit={copy.photoCredit} />
          </section>
          {next && <button type="button" className={styles.upNext} onClick={() => openSession(next.key)}><span><small>{copy.next} · {next.start}</small><strong>{agenda.moments[next.key as keyof typeof agenda.moments].title}</strong></span><AgendaIcon name="arrow" /></button>}
          <div className={styles.sidebarFooter}><span><AgendaIcon name="clock" />{copy.clock}</span><button type="button" className={styles.textButton} onClick={() => calendar()}><AgendaIcon name="download" />{copy.exportCalendar}</button></div>
          <p className={styles.desktopNote}>{copy.subjectToChange}</p>
        </aside>

        <section className={styles.program} aria-label={copy.dayAgenda}>
          <div className={styles.programHead}><div><p className={styles.eyebrow}>{copy.dayAgenda} / {String(dayIndex + 1).padStart(2, '0')}</p><h2>{currentDay.title}</h2></div><span className={styles.count}>{allDay.length} {copy.sessions}</span></div>
          <div className={styles.filters} role="group" aria-label={copy.fullProgram}>{(['all', 'work', 'saved'] as const).map((item) => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item === 'saved' && <AgendaIcon name="save" />}{copy[item]}{item === 'saved' && <span>{allDay.filter((moment) => data.saved.includes(moment.key)).length}</span>}</button>)}</div>
          {agenda.days.map((item, i) => <div key={item.key} role="tabpanel" id={`app-panel-${i}`} aria-labelledby={`app-day-${i}`} hidden={dayIndex !== i} tabIndex={0}>
            {dayIndex === i && <motion.div key={`${day}-${filter}`} initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.38, ease: [0.16, 1, 0.3, 1] }}>
              {visible.length ? <ol className={styles.timeline}>{visible.map((moment) => {
                const text = agenda.moments[moment.key as keyof typeof agenda.moments];
                const isLive = live?.actual?.key === moment.key;
                const isPast = live ? moment.hasta.getTime() <= Date.now() : false;
                const place = moment.lugar ? agenda.lugares[moment.lugar as keyof typeof agenda.lugares] : null;
                const icon = moment.key === 'raices' ? 'fire' : moment.key === 'amanecer' || moment.key === 'bloque6' ? 'sun' : icons[moment.tono];
                return <li key={moment.key} data-session={moment.key} data-live={isLive || undefined} data-past={isPast || undefined} data-kind={moment.tono} className={styles.timelineItem} aria-current={isLive ? 'step' : undefined}>
                  <div className={styles.timeColumn}><time dateTime={moment.desde.toISOString()}>{moment.start}</time><span>{moment.end}</span></div>
                  <span className={styles.timelineMarker}><AgendaIcon name={icon} /></span>
                  <button type="button" className={styles.sessionCard} onClick={() => openSession(moment.key)} aria-haspopup="dialog">
                    <span className={styles.cardMeta}><span className={styles.kindChip}>{agenda.ui.categories[moment.tono]}</span><span>{(moment.hasta.getTime() - moment.desde.getTime()) / 60000} min</span>{isLive && <b className={styles.liveChip}>{copy.live}</b>}{isPast && <span>{copy.done}</span>}{data.saved.includes(moment.key) && <AgendaIcon name="save" />}</span>
                    <span className={styles.cardTitle}>{text.title}<AgendaIcon name="arrow" /></span>
                    <span className={styles.cardSummary}>{text.text}</span>
                    {place && <span className={styles.cardPlace}><AgendaIcon name="pin" />{place}</span>}
                  </button>
                </li>;
              })}</ol> : <div className={styles.empty}><AgendaIcon name="save" /><h3>{copy.empty}</h3><p>{copy.emptyHelp}</p><button className={styles.textButton} type="button" onClick={() => setFilter('all')}>{copy.fullProgram}<AgendaIcon name="arrow" /></button></div>}
            </motion.div>}
          </div>)}
        </section>
      </div> : <WorkshopViews view={view} copy={copy} agenda={agenda} data={data} update={update} openSession={openSession} />}
      </AgendaTransition></AnimatePresence>
      {storageError && <p className={styles.storageWarning} role="status">{copy.storageError}</p>}
    </main>

    <nav className={styles.dock} aria-label={copy.title}>
      {(['agenda', 'hypotheses'] as const).map((item) => <button type="button" key={item} onClick={() => changeView(item)} aria-current={view === item ? 'page' : undefined}><>{view === item && <motion.span className={styles.dockActive} layoutId={reducedMotion ? undefined : 'active-view'} transition={{ type: 'spring', stiffness: 380, damping: 32 }} aria-hidden="true" />}</><AgendaIcon name={viewIcons[item]} /><span>{copy.nav[item]}</span></button>)}
      <button type="button" className={styles.nowButton} onClick={goNow}><span><AgendaIcon name="sun" /></span><small>{copy.nav.now}</small></button>
      <button type="button" onClick={() => changeView('direction')} aria-current={view === 'direction' ? 'page' : undefined}><>{view === 'direction' && <motion.span className={styles.dockActive} layoutId={reducedMotion ? undefined : 'active-view'} transition={{ type: 'spring', stiffness: 380, damping: 32 }} aria-hidden="true" />}</><AgendaIcon name="compass" /><span>{copy.nav.direction}</span></button>
      <button type="button" onClick={() => openSheet('settings')} aria-haspopup="dialog"><AgendaIcon name="settings" /><span>{copy.nav.settings}</span></button>
    </nav>

    <AnimatePresence>
    {ready && (welcome || session || sheet) && <AgendaDialog key="agenda-dialog" title={welcome ? copy.welcomeTitle : session ? agenda.moments[session.key as keyof typeof agenda.moments].title : sheet === 'settings' ? copy.settingsTitle : copy.inbox} closeLabel={welcome ? copy.welcomeSkip : copy.close} onClose={() => { if (welcome) finishWelcome(true); else openSession(null); }}>
    {welcome && <AgendaWelcome copy={copy} data={data} update={update} alerts={alerts} onComplete={finishWelcome} storageError={storageError} />}
    {!welcome && session && <>
      <SessionContent moment={session} copy={copy} agenda={agenda} data={data} update={update} storageError={storageError} onCalendar={() => calendar(session.key)} onShare={() => { void navigator.clipboard?.writeText(window.location.href).then(() => setFeedback(copy.copied)).catch(() => setFeedback(copy.copyError)); if (!navigator.clipboard) setFeedback(copy.copyError); }} />
      <p className={styles.feedback} role="status">{feedback}</p>
    </>}
    {!welcome && sheet === 'settings' && <>
      <p className={styles.lede}>{copy.settingsIntro}</p>
      <label className={styles.setting}><span><strong>{copy.reminders}</strong><small>{copy.reminderHint}</small></span><input type="checkbox" role="switch" checked={data.settings.reminders} onChange={(event) => { const checked = event.target.checked; update((value) => ({ ...value, settings: { ...value.settings, reminders: checked } })); }} /></label>
      <label className={styles.setting}><span>{copy.advance}</span><select value={data.settings.minutes} onChange={(event) => { const minutes = Number(event.target.value); update((value) => ({ ...value, settings: { ...value.settings, minutes } })); }}>{[5, 10, 15].map((minutes) => <option value={minutes} key={minutes}>{minutes} min</option>)}</select></label>
      <label className={styles.setting}><span><strong>{copy.sound}</strong><small>{copy.soundHint}</small></span><input type="checkbox" role="switch" checked={data.settings.sound} onChange={(event) => { const checked = event.target.checked; if (checked) void alerts.unlockAudio(); update((value) => ({ ...value, settings: { ...value.settings, sound: checked } })); }} /></label>
      <div className={styles.setting}><span><strong>{copy.browser}</strong><small>{copy.browserHint}</small></span>{alerts.permission === 'granted' ? <input type="checkbox" role="switch" aria-label={copy.browser} checked={data.settings.browser} onChange={(event) => { const checked = event.target.checked; update((value) => ({ ...value, settings: { ...value.settings, browser: checked } })); }} /> : <button type="button" className={styles.secondaryButton} disabled={alerts.permission === 'unsupported' || alerts.permission === 'denied'} onClick={() => void alerts.requestPermission()}>{copy.enableBrowser}</button>}</div>
      <p className={styles.muted}>{alerts.permission === 'granted' ? copy.browserGranted : alerts.permission === 'denied' ? copy.browserDenied : alerts.permission === 'unsupported' ? copy.browserUnsupported : ''}</p>
      <p className={styles.objective}>{copy.notificationScope}</p>
      <button className={styles.primaryButton} type="button" onClick={alerts.test}><AgendaIcon name="bell" />{copy.test}</button>
      {alerts.toast?.kind === 'test' && <p role="status" className={styles.feedback}>{copy.testBody}</p>}
      <hr /><p className={styles.muted}>{copy.privacy}</p>
      <button className={styles.secondaryButton} type="button" onClick={exportNotes}><AgendaIcon name="download" />{copy.exportNotes}</button>
      <p className={styles.feedback} role="status">{feedback}</p>
    </>}
    {!welcome && sheet === 'inbox' && <>
      {data.inbox.length ? <><button type="button" className={styles.textButton} onClick={() => update((value) => ({ ...value, inbox: value.inbox.map((notice) => ({ ...notice, read: true })) }))}>{copy.readAll}<AgendaIcon name="check" /></button><ol className={styles.inbox}>{data.inbox.map((notice) => { const text = noticeText(notice, copy, agenda.moments); return <li key={notice.id} data-unread={!notice.read || undefined}><span className={styles.eyebrow}>{new Date(notice.at).toLocaleString(locale, { timeZone: 'America/Guayaquil', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })}</span><h3>{text.title}</h3><p>{text.body}</p>{notice.session && <button type="button" className={styles.textButton} onClick={() => { update((value) => ({ ...value, inbox: value.inbox.map((entry) => entry.id === notice.id ? { ...entry, read: true } : entry) })); openSession(notice.session); }}>{copy.details}<AgendaIcon name="arrow" /></button>}</li>; })}</ol></> : <div className={styles.empty}><AgendaIcon name="bell" /><h3>{copy.inboxEmpty}</h3><p>{copy.inboxHint}</p><button type="button" className={styles.primaryButton} onClick={() => setSheet('settings')}>{copy.nav.settings}<AgendaIcon name="arrow" /></button></div>}
    </>}
    </AgendaDialog>}
    </AnimatePresence>
    {alerts.toast && !sheet && !session && <aside className={styles.toast} role="status"><AgendaIcon name="bell" /><div><strong>{noticeText(alerts.toast, copy, agenda.moments).title}</strong><p>{noticeText(alerts.toast, copy, agenda.moments).body}</p>{alerts.toast.session && <button type="button" className={styles.textButton} onClick={() => { openSession(alerts.toast!.session); alerts.dismiss(); }}>{copy.details}<AgendaIcon name="arrow" /></button>}</div><button className={styles.iconButton} type="button" aria-label={copy.close} onClick={alerts.dismiss}><AgendaIcon name="close" /></button></aside>}
    {!session && !sheet && feedback && <p className={styles.downloadFeedback} role="status">{feedback}<button type="button" aria-label={copy.close} onClick={() => setFeedback('')}><AgendaIcon name="close" /></button></p>}
  </div></LayoutGroup>;
}
