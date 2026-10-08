import type { TanusasMomentKey } from './tanusas-schedule';

export type AgendaHypothesis = {
  n: number;
  title?: string;
  body?: string;
  items?: readonly { name: string; body: string }[];
  groups?: readonly { name: string; items: readonly string[] }[];
  listLabel?: string;
  list?: readonly string[];
};

export type AgendaDetail = {
  objective?: string;
  hypotheses?: AgendaHypothesis[];
  questions?: string[];
  prompts?: string[];
  notes?: string[];
  round?: string;
  steps?: { title: string; body?: string }[];
  matrix?: { head: string[]; rows: string[][] };
};

export type AgendaDetails = Partial<Record<TanusasMomentKey, AgendaDetail>>;

/** Links from the supplied prototype remain valid; hours come from tanusas-schedule. */
export const SESSION_ALIASES: Record<string, TanusasMomentKey> = {
  b1: 'bloque1', b2: 'bloque2', b3: 'bloque3', b4: 'bloque4',
  b5: 'bloque5', b6: 'bloque6', b7: 'bloque7', b8: 'bloque8',
  'cena-jue': 'cenaJueves', 'desayuno-vie': 'desayunoViernes',
  traslado: 'trasladoSalon', 'comida-vie': 'comida',
  'libre-vie-1': 'libreViernes', 'libre-vie-2': 'libreTarde',
  'cena-vie': 'cenaChef', 'desayuno-sab': 'desayunoSabado',
};
