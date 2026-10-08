'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Dictionary } from '@/i18n';
import { momentosOrdenados, type TanusasDayKey } from '@/config/tanusas-schedule';
import { useLiveAgenda } from '../hooks/useLiveAgenda';
import styles from './TanusasAgenda.module.css';

type Props = { copy: Dictionary['tanusas']['agenda'] };
type IconName = 'bloque' | 'pausa' | 'traslado' | 'libre' | 'pin' | 'clock' | 'fire' | 'sun';

function AgendaIcon({ name }: { name: IconName }) {
  const paths: Record<IconName, string> = {
    bloque: 'M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h6v6h-6z',
    pausa: 'M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z M16 9h2a3 3 0 0 1 0 6h-2 M7 3v2 M12 3v2',
    traslado: 'M4 7h15m-4-4 4 4-4 4 M20 17H5m4-4-4 4 4 4',
    libre: 'M5 19C1 9 9 4 20 4c0 11-5 19-15 15Z M5 19 15 9 M11 13v-4 M11 13h4',
    pin: 'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
    clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 6v6l4 2',
    fire: 'M12 2c2 6-3 6-1 10 2-1 3-3 3-5 6 5 8 13-2 15C1 20 4 11 7 8c-1 4 1 5 2 5-1-5 3-6 3-11Z',
    sun: 'M3 17h18 M6 17a6 6 0 0 1 12 0 M12 3v4 M3 8l3 3 M21 8l-3 3 M2 21h20',
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

const momentos = momentosOrdenados();

export function TanusasAgenda({ copy }: Props) {
  const directo = useLiveAgenda();
  const reducedMotion = useReducedMotion();
  const [elegido, setElegido] = useState<TanusasDayKey | null>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const dia = elegido ?? directo?.diaVisible ?? copy.days[0]!.key;
  const index = Math.max(0, copy.days.findIndex((d) => d.key === dia));
  const current = copy.days[index]!;
  const delDia = momentos.filter((m) => m.day === dia);

  function navigateTabs(event: KeyboardEvent<HTMLButtonElement>, from: number) {
    const next = event.key === 'ArrowRight' ? (from + 1) % copy.days.length
      : event.key === 'ArrowLeft' ? (from + copy.days.length - 1) % copy.days.length
      : event.key === 'Home' ? 0 : event.key === 'End' ? copy.days.length - 1 : null;
    if (next === null) return;
    event.preventDefault();
    setElegido(copy.days[next]!.key as TanusasDayKey);
    tabs.current[next]?.focus();
  }

  return (
    <div className={styles.agenda}>
      <div className={styles.tabs} role="tablist" aria-label={copy.title}>
        {copy.days.map((item, i) => (
          <button key={item.key} type="button" role="tab" id={`tanusas-dia-${i}`}
            ref={(node) => { tabs.current[i] = node; }}
            className={styles.tab} aria-selected={i === index} tabIndex={i === index ? 0 : -1}
            aria-controls={`tanusas-panel-${i}`} onKeyDown={(event) => navigateTabs(event, i)}
            onClick={() => setElegido(item.key as TanusasDayKey)}>
            <span className={styles.tabNumber}>{copy.ui.day} 0{i + 1}</span>
            <span className={styles.tabLabel}>{item.tab}<span className={styles.tabArrow} aria-hidden="true">↗</span></span>
            <span className={styles.tabTheme}>{copy.ui.themes[i]}</span>
          </button>
        ))}
      </div>

      {copy.days.map((item, i) => (
        <div key={item.key} id={`tanusas-panel-${i}`} role="tabpanel" hidden={i !== index}
          aria-labelledby={`tanusas-dia-${i}`} tabIndex={0} className={styles.panel}>
          {i === index && <motion.div initial={reducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.22 }}>
            <div className={styles.dayHead}>
              <div>
                <p className={styles.eyebrow}>{copy.ui.month} 2026 · {delDia.length} {copy.ui.activities}</p>
                <h3 className={styles.dayTitle}>{current.title}</h3>
              </div>
              <span className={styles.timezone}><AgendaIcon name="clock" />{copy.live.ecuador} · UTC−5</span>
            </div>

            <ol className={styles.timeline}>
              {delDia.map((m) => {
                const texto = copy.moments[m.key as keyof typeof copy.moments];
                const enCurso = directo?.actual?.key === m.key;
                const siguiente = directo?.siguiente?.key === m.key;
                const lugar = m.lugar ? copy.lugares[m.lugar as keyof typeof copy.lugares] : null;
                const outcome = copy.ui.outcomes[m.key as keyof typeof copy.ui.outcomes];
                const duration = (m.hasta.getTime() - m.desde.getTime()) / 60_000;
                const icon = m.key === 'raices' ? 'fire' : m.key === 'amanecer' || m.key === 'bloque6' ? 'sun' : m.tono;
                return (
                  <li key={m.key} className={styles.moment} data-tone={m.tono} data-live={enCurso || undefined} aria-current={enCurso ? 'step' : undefined}>
                    <div className={styles.time}>
                      <time dateTime={m.desde.toISOString()}>{m.start}</time>
                      <span className={styles.timeEnd}>— {m.end}</span>
                    </div>
                    <span className={styles.marker}><AgendaIcon name={icon} /></span>
                    <div className={styles.card}>
                      <div className={styles.meta}>
                        <span className={styles.chip}>{copy.ui.categories[m.tono]}</span>
                        {m.key === 'amanecer' && <span className={styles.optional}>{copy.ui.optional}</span>}
                        <span className={styles.duration}>{duration} min</span>
                        {enCurso && <span className={styles.live}><span />{copy.live.badge}</span>}
                        {siguiente && !enCurso && <span className={styles.next}>{copy.live.next}</span>}
                      </div>
                      <h4 className={styles.momentTitle}>{texto.title}</h4>
                      <p className={styles.description}>{texto.text}</p>
                      {outcome && <p className={styles.outcome}><span>{copy.ui.outcome}</span>{outcome}</p>}
                      {lugar && <span className={styles.place}><AgendaIcon name="pin" />{lugar}</span>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </motion.div>}
        </div>
      ))}
    </div>
  );
}
