'use client';

import type { Dictionary } from '@/i18n';
import type { Notebook } from '../hooks/useAgendaNotebook';
import type { useAgendaAlerts } from '../hooks/useAgendaAlerts';
import { AgendaIcon } from './AgendaIcon';
import styles from './AgendaApp.module.css';

type Props = {
  copy: Dictionary['tanusas']['agendaApp'];
  data: Notebook;
  update: (change: (value: Notebook) => Notebook) => Notebook;
  alerts: Pick<ReturnType<typeof useAgendaAlerts>, 'permission' | 'requestPermission' | 'previewSound' | 'unlockAudio'>;
  onComplete: (silent?: boolean) => void;
  storageError: boolean;
};

export function AgendaWelcome({ copy, data, update, alerts, onComplete, storageError }: Props) {
  function change(settings: Partial<Notebook['settings']>) {
    if (settings.sound) void alerts.unlockAudio();
    update((value) => ({ ...value, settings: { ...value.settings, ...settings } }));
  }

  return <div className={styles.welcome}>
    <p className={styles.lede}>{copy.welcomeIntro}</p>
    <label className={styles.setting}><span><strong>{copy.sound}</strong><small>{copy.soundHint}</small></span><input type="checkbox" role="switch" checked={data.settings.sound} onChange={(event) => change({ sound: event.target.checked })} /></label>
    <button type="button" className={styles.textButton} disabled={!data.settings.sound} onClick={alerts.previewSound}><AgendaIcon name="bell" />{copy.welcomePreview}</button>
    <label className={styles.setting}><span><strong>{copy.reminders}</strong><small>{copy.reminderHint}</small></span><input type="checkbox" role="switch" checked={data.settings.reminders} onChange={(event) => change({ reminders: event.target.checked })} /></label>
    <label className={styles.setting}><span>{copy.advance}</span><select disabled={!data.settings.reminders} value={data.settings.minutes} onChange={(event) => change({ minutes: Number(event.target.value) })}>{[5, 10, 15].map((minutes) => <option key={minutes} value={minutes}>{minutes} min</option>)}</select></label>
    <details className={styles.welcomeBrowser}>
      <summary>{copy.welcomeBrowser}</summary>
      <p className={styles.muted}>{copy.browserHint}</p>
      {alerts.permission === 'granted'
        ? <label className={styles.setting}><span>{copy.browser}</span><input type="checkbox" role="switch" checked={data.settings.browser} onChange={(event) => change({ browser: event.target.checked })} /></label>
        : <button type="button" className={styles.secondaryButton} disabled={alerts.permission === 'unsupported' || alerts.permission === 'denied'} onClick={() => void alerts.requestPermission()}>{copy.enableBrowser}</button>}
      {(alerts.permission === 'denied' || alerts.permission === 'unsupported') && <p className={styles.muted}>{alerts.permission === 'denied' ? copy.browserDenied : copy.browserUnsupported}</p>}
    </details>
    <p className={styles.muted}>{copy.welcomeScope}</p>
    {storageError && <p className={styles.feedback} role="status">{copy.welcomeStorageError}</p>}
    <div className={styles.welcomeActions}>
      <button type="button" className={styles.primaryButton} onClick={() => onComplete()}>{copy.welcomeContinue}<AgendaIcon name="arrow" /></button>
      <button type="button" className={styles.secondaryButton} onClick={() => onComplete(true)}>{copy.welcomeSkip}</button>
    </div>
    <p className={styles.muted}>{copy.welcomeHint}</p>
  </div>;
}
