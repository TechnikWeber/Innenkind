import type { BeliefId, Flag, NeedId, Path } from '../data/types';
import { questionById } from '../data/questions';

/**
 * Alles, was während einer Sitzung entsteht.
 *
 * Bewusst drei flache Tabellen statt eines verschachtelten Modells:
 * Auswahl (`choices`), Zahlen (`values`) und Texte (`texts`), jeweils unter
 * der ID des Bausteins, der sie erfragt. So kann jeder Baustein seine Daten
 * selbst lesen und schreiben, und die Speicherung bleibt trivial.
 */
export interface SessionData {
  v: 1;
  path: Path;
  pathChosen: boolean;
  stepId: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  choices: Record<string, string[]>;
  values: Record<string, number>;
  texts: Record<string, string>;
  /** Abgehakte Einträge im Wochenplan. */
  done: string[];
  /** Wurde unterwegs auf den sanften Weg gewechselt? */
  softened: boolean;
}

export const emptySession = (): SessionData => ({
  v: 1,
  path: 'standard',
  pathChosen: false,
  stepId: null,
  startedAt: null,
  finishedAt: null,
  choices: {},
  values: {},
  texts: {},
  done: [],
  softened: false,
});

/** Schlüssel, die eine neue Sitzung aus der vorigen übernehmen darf. */
export const RESOURCE_TEXT_KEYS = ['childName', 'placeWhat', 'placeDetails', 'helperName', 'happyMemory'];
export const RESOURCE_CHOICE_KEYS = ['helperType', 'loved', 'strengths', 'goodPerson'];

export function choice(d: SessionData, id: string): string | undefined {
  return d.choices[id]?.[0];
}

export function has(d: SessionData, id: string, option: string): boolean {
  return d.choices[id]?.includes(option) ?? false;
}

/** Alle Markierungen, die sich aus den bisherigen Antworten ergeben. */
export function flags(d: SessionData): Set<Flag> {
  const out = new Set<Flag>();
  for (const [qid, picked] of Object.entries(d.choices)) {
    const q = questionById.get(qid);
    if (!q) continue;
    for (const opt of q.options) {
      if (picked.includes(opt.id)) opt.flags?.forEach((f) => out.add(f));
    }
  }
  if (choice(d, 'placeWorked') === 'schwer') out.add('fragile');
  return out;
}

export function isAcute(d: SessionData): boolean {
  return choice(d, 'safety') === 'akut';
}

/**
 * Zugang zur Begegnung. Auf dem sanften Weg gibt es keine Gefühlsbrücke –
 * wer unterwegs wechselt, landet deshalb am sicheren Ort.
 */
export type Entry = 'bridge' | 'photo' | 'safeplace';

export function entry(d: SessionData): Entry {
  const raw = choice(d, d.path === 'gentle' ? 'entryGentle' : 'entry') ?? choice(d, 'entry');
  if (raw === 'photo') return 'photo';
  if (raw === 'bridge' && d.path !== 'gentle') return 'bridge';
  if (raw === 'safeplace') return 'safeplace';
  return d.path === 'gentle' ? 'safeplace' : 'bridge';
}

/** Was das Kind in der Szene braucht → Bedürfnis. */
export const CHILD_NEED_MAP: Record<string, NeedId | null> = {
  schutz: 'sicherheit',
  trost: 'naehe',
  gesehen: 'wert',
  gefuehle: 'ausdruck',
  zutrauen: 'autonomie',
  spielen: 'spiel',
  verantwortung: 'grenzen',
  weg: null,
};

export function selectedBeliefs(d: SessionData): BeliefId[] {
  return (d.choices.beliefs ?? []) as BeliefId[];
}

/** Belastung: Zahl oder undefined, wenn noch nicht gefragt. */
export function value(d: SessionData, id: string): number | undefined {
  const v = d.values[id];
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}
