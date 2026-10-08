export type AgendaIconName = 'agenda' | 'leaf' | 'compass' | 'bell' | 'settings' | 'arrow' | 'back' | 'close' | 'clock' | 'pin' | 'save' | 'check' | 'download' | 'link' | 'sun' | 'fire' | 'coffee' | 'move';
const paths: Record<AgendaIconName, string> = {
  agenda: 'M5 5h14v16H5z M8 2v6 M16 2v6 M5 10h14 M8 14h2 M14 14h2 M8 18h2',
  leaf: 'M5 19C1 9 9 4 20 4c0 11-5 19-15 15Z M5 19 15 9 M11 13v-4 M11 13h4',
  compass: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M16 8l-2 6-6 2 2-6z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10 M10 21h4',
  settings: 'M4 7h16 M4 17h16 M9 4v6 M15 14v6',
  arrow: 'M5 12h14 M13 6l6 6-6 6', back: 'M19 12H5 M11 6l-6 6 6 6',
  close: 'M6 6l12 12 M18 6 6 18', clock: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M12 6v6l4 2',
  pin: 'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z M14 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
  save: 'M6 3h12v18l-6-4-6 4z', check: 'M5 12l4 4L19 6',
  download: 'M12 3v12 M7 10l5 5 5-5 M4 16v5h16v-5', link: 'M10 14l4-4 M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0 M16 8l1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0',
  sun: 'M3 17h18 M6 17a6 6 0 0 1 12 0 M12 3v4 M3 8l3 3 M21 8l-3 3 M2 21h20',
  fire: 'M12 2c2 6-3 6-1 10 2-1 3-3 3-5 6 5 8 13-2 15C1 20 4 11 7 8c-1 4 1 5 2 5-1-5 3-6 3-11Z',
  coffee: 'M4 8h12v7a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z M16 9h2a3 3 0 0 1 0 6h-2 M7 3v2 M12 3v2',
  move: 'M4 7h15m-4-4 4 4-4 4 M20 17H5m4-4-4 4 4 4',
};
export function AgendaIcon({ name, className }: { name: AgendaIconName; className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
