import type { Dictionary } from '@/i18n';
import type { TanusasMomentoConFecha } from '@/config/tanusas-schedule';
import type { Notebook } from '../hooks/useAgendaNotebook';

function escapeIcs(value: string) {
  return value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}

/** RFC 5545 folding counts UTF-8 octets, not JavaScript characters. */
function fold(line: string) {
  const encoder = new TextEncoder();
  let result = ''; let size = 0;
  for (const character of line) {
    const length = encoder.encode(character).length;
    if (size + length > 75) { result += '\r\n '; size = 1; }
    result += character; size += length;
  }
  return result;
}
const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

export function createCalendar(moments: TanusasMomentoConFecha[], copy: Dictionary['tanusas']['agenda'], origin: string, locale: string, now = new Date()) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//CEIBA//Tanusas 2026//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  for (const moment of moments) {
    const text = copy.moments[moment.key as keyof typeof copy.moments];
    const place = moment.lugar ? copy.lugares[moment.lugar as keyof typeof copy.lugares] : 'Tanusas, Ecuador';
    lines.push('BEGIN:VEVENT', `UID:tanusas-2026-${moment.key}@ceiba`, `DTSTAMP:${stamp(now)}`,
      `DTSTART:${stamp(moment.desde)}`, `DTEND:${stamp(moment.hasta)}`,
      `SUMMARY:${escapeIcs(text.title)}`, `DESCRIPTION:${escapeIcs(`${text.text}\n${copy.live.ecuador} (UTC-5)`)}`,
      `LOCATION:${escapeIcs(place)}`, `URL:${origin}/${locale}/tanusas/agenda?s=${moment.key}`, 'END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function downloadText(text: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function exportNotebook(data: Notebook, copy: Dictionary['tanusas']['agendaApp'], agenda: Dictionary['tanusas']['agenda']) {
  const sections = [`Tanusas 2026 · ${copy.notes}`];
  for (const [key, note] of Object.entries(data.notes)) if (note.trim()) sections.push(`${agenda.moments[key as keyof typeof agenda.moments]?.title ?? key}\n${note}`);
  for (const [key, verdict] of Object.entries(data.votes)) sections.push(`${copy.hypothesis} ${key}: ${copy.votes[verdict]}`);
  sections.push(`${copy.nav.direction}\n${copy.success.map((item, i) => `${data.clarity.includes(i) ? '[x]' : '[ ]'} ${item}`).join('\n')}`);
  return sections.join('\n\n');
}
