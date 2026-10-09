import type { AgendaHypothesis } from '@/config/tanusas-agenda';
import type { Dictionary } from '@/i18n';
import type { TanusasMomentoConFecha } from '@/config/tanusas-schedule';
import type { Notebook, Verdict } from '../hooks/useAgendaNotebook';
import { AgendaIcon } from './AgendaIcon';
import styles from './AgendaApp.module.css';

type Copy = Dictionary['tanusas']['agendaApp'];
type Agenda = Dictionary['tanusas']['agenda'];

export function HypothesisBody({ item }: { item: AgendaHypothesis }) {
  return <div className={styles.richText}>
    {item.body && <p>{item.body}</p>}
    {item.items?.map((part) => <div key={part.name}><h4>{part.name}</h4><p>{part.body}</p></div>)}
    {item.groups?.map((group) => <div key={group.name}><h4>{group.name}</h4><ul>{group.items.map((entry) => <li key={entry}>{entry}</li>)}</ul></div>)}
    {item.list && <div>{item.listLabel && <h4>{item.listLabel}</h4>}<ul>{item.list.map((entry) => <li key={entry}>{entry}</li>)}</ul></div>}
  </div>;
}

export function VoteControl({ item, copy, value, onVote }: { item: AgendaHypothesis; copy: Copy; value?: Verdict; onVote: (vote: Verdict) => void }) {
  return <div className={styles.votes} role="group" aria-label={`${copy.verdict} · ${copy.hypothesis} ${item.n}`}>
    {(['keep', 'revise', 'drop'] as const).map((vote) => <button type="button" key={vote} aria-pressed={value === vote} onClick={() => onVote(vote)}>{copy.votes[vote]}</button>)}
  </div>;
}

export function WorkshopViews({ view, copy, agenda, data, update, openSession }: {
  view: 'hypotheses' | 'direction'; copy: Copy; agenda: Agenda; data: Notebook;
  update: (change: (data: Notebook) => Notebook) => Notebook; openSession: (key: string) => void;
}) {
  const hypotheses = Object.entries(copy.detailsContent).flatMap(([key, detail]) => (detail?.hypotheses ?? []).map((hypothesis) => ({ key, hypothesis })));
  const progress = view === 'hypotheses' ? Object.keys(data.votes).length : data.clarity.length;
  const total = view === 'hypotheses' ? hypotheses.length : copy.success.length;
  return <section className={styles.workshop} aria-labelledby="workshop-title">
    <header className={styles.workshopHead}>
      <p className={styles.eyebrow}>{copy.eyebrow} / 2026</p>
      <h1 id="workshop-title">{copy.nav[view]}</h1>
      <p className={styles.lede}>{view === 'hypotheses' ? copy.hypothesisIntro : copy.directionIntro}</p>
      <div className={styles.workshopProgress}><span>{progress.toString().padStart(2, '0')} <small>/ {total} {view === 'hypotheses' ? copy.reviewed : copy.clarity}</small></span><progress max={total} value={progress} aria-label={copy.nav[view]} /></div>
      <p className={styles.muted}>{view === 'hypotheses' ? copy.personal : copy.directionHint}</p>
    </header>
    {view === 'hypotheses' ? <div className={styles.hypothesisGrid}>
      {hypotheses.map(({ key, hypothesis }) => <article className={styles.hypothesisCard} key={hypothesis.n}>
        <div className={styles.hypothesisTop}><span className={styles.eyebrow}>{copy.hypothesis} {String(hypothesis.n).padStart(2, '0')}</span><button type="button" className={styles.textButton} onClick={() => openSession(key)}>{agenda.moments[key as keyof typeof agenda.moments].title.split(' · ')[0]} <AgendaIcon name="arrow" /></button></div>
        <details><summary>{hypothesis.title ?? hypothesis.body}<span aria-hidden="true">+</span></summary><HypothesisBody item={hypothesis} /></details>
        <VoteControl item={hypothesis} copy={copy} value={data.votes[hypothesis.n]} onVote={(vote) => update((value) => { const votes = { ...value.votes }; if (votes[hypothesis.n] === vote) delete votes[hypothesis.n]; else votes[hypothesis.n] = vote; return { ...value, votes }; })} />
      </article>)}
    </div> : <div className={styles.directionGrid}>
      <div className={styles.clarityList}>{copy.success.map((item, i) => <label key={item} className={styles.clarityItem}>
        <input type="checkbox" checked={data.clarity.includes(i)} onChange={() => update((value) => ({ ...value, clarity: value.clarity.includes(i) ? value.clarity.filter((n) => n !== i) : [...value.clarity, i] }))} />
        <span className={styles.clarityNumber}>{String(i + 1).padStart(2, '0')}</span><span>{item}</span>
      </label>)}</div>
      <aside className={styles.directionAside}><AgendaIcon name="leaf" /><p>{copy.guidingQuestion}</p><button className={styles.primaryButton} type="button" onClick={() => openSession('bloque8')}>{agenda.moments.bloque8.title}<AgendaIcon name="arrow" /></button></aside>
    </div>}
  </section>;
}

export function SessionContent({ moment, copy, agenda, data, update, storageError, onCalendar, onShare }: {
  moment: TanusasMomentoConFecha; copy: Copy; agenda: Agenda; data: Notebook;
  update: (change: (data: Notebook) => Notebook) => Notebook; storageError: boolean; onCalendar: () => void; onShare: () => void;
}) {
  const text = agenda.moments[moment.key as keyof typeof agenda.moments];
  const detail = copy.detailsContent[moment.key as keyof typeof copy.detailsContent];
  const saved = data.saved.includes(moment.key);
  const place = moment.lugar ? agenda.lugares[moment.lugar as keyof typeof agenda.lugares] : null;
  return <>
    <div className={styles.sessionMeta}><span><AgendaIcon name="clock" />{moment.start} — {moment.end} · {(moment.hasta.getTime() - moment.desde.getTime()) / 60000} min</span>{place && <span><AgendaIcon name="pin" />{place}</span>}<span>{copy.clock}</span></div>
    <p className={styles.lede}>{text.text}</p>
    <div className={styles.sessionActions}>
      <button type="button" className={styles.secondaryButton} aria-pressed={saved} onClick={() => update((value) => ({ ...value, saved: saved ? value.saved.filter((key) => key !== moment.key) : [...value.saved, moment.key] }))}><AgendaIcon name="save" />{saved ? copy.unsave : copy.save}</button>
      <button type="button" className={styles.secondaryButton} onClick={onCalendar}><AgendaIcon name="agenda" />{copy.calendar}</button>
      <button type="button" className={styles.secondaryButton} onClick={onShare}><AgendaIcon name="link" />{copy.copyLink}</button>
    </div>
    {detail?.objective && <div className={styles.objective}><p className={styles.eyebrow}>{copy.objective}</p><p>{detail.objective}</p></div>}
    {detail?.steps?.map((step) => <section key={step.title} className={styles.richText}><h3>{step.title}</h3>{step.body && <p>{step.body}</p>}</section>)}
    {detail?.hypotheses?.map((item) => <section className={styles.detailHypothesis} key={item.n}>
      <p className={styles.eyebrow}>{copy.hypothesis} {item.n}</p>{item.title && <h3>{item.title}</h3>}<HypothesisBody item={item} />
      <VoteControl item={item} copy={copy} value={data.votes[item.n]} onVote={(vote) => update((value) => { const votes = { ...value.votes }; if (votes[item.n] === vote) delete votes[item.n]; else votes[item.n] = vote; return { ...value, votes }; })} />
    </section>)}
    {(['questions', 'prompts'] as const).map((field) => detail?.[field] && <section className={styles.richText} key={field}><h3>{copy[field]}</h3><ul>{detail[field]!.map((question) => <li key={question}>{question}</li>)}</ul></section>)}
    {detail?.round && <p className={styles.objective}>{detail.round}</p>}
    {detail?.matrix && <section><h3>{copy.horizon}</h3><div className={styles.matrix} tabIndex={0} role="region" aria-label={copy.horizon}><table><thead><tr><th scope="col">{copy.dimension}</th>{detail.matrix.head.map((title) => <th scope="col" key={title}>{title}</th>)}</tr></thead><tbody>{detail.matrix.rows.map(([label, first, second]) => <tr key={label}><th scope="row">{label}</th><td>{first}</td><td>{second}</td></tr>)}</tbody></table></div></section>}
    {detail?.notes?.map((note) => <p className={styles.muted} key={note}>{note}</p>)}
    {detail?.links?.map((link) => <p className={styles.detailLink} key={link.href}><a href={link.href} target="_blank" rel="noreferrer"><AgendaIcon name="link" />{link.label}</a></p>)}
    <section className={styles.personalNotes}><label htmlFor="session-notes">{copy.notes}</label><p id="notes-hint" className={styles.muted}>{copy.notesHint}</p>
      <textarea id="session-notes" value={data.notes[moment.key] ?? ''} maxLength={10000} rows={6} placeholder={copy.notesPlaceholder} aria-describedby="notes-hint notes-storage"
        onChange={(event) => { const note = event.target.value; update((value) => ({ ...value, notes: { ...value.notes, [moment.key]: note } })); }} />
      <p id="notes-storage" className={styles.muted}>{storageError ? copy.storageError : copy.savedLocal}</p>
    </section>
  </>;
}
