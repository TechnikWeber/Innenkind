import type { BeliefId, NeedId, ProtectorId } from '../data/types';
import { profileQuestions } from '../data/questions';
import { NEED_IDS } from '../data/needs';
import { BELIEF_IDS } from '../data/beliefs';
import { PROTECTOR_IDS } from '../data/protectors';
import type { SessionData } from './session';

/** Eine Antwort, die zu einem Wert beigetragen hat – für „weil du angegeben hast …“. */
export interface Reason {
  questionId: string;
  optionId: string;
  points: number;
}

export interface Scored<T extends string> {
  id: T;
  score: number;
  reasons: Reason[];
}

export interface Profile {
  needs: Scored<NeedId>[];
  beliefs: Scored<BeliefId>[];
  protectors: Scored<ProtectorId>[];
  /** Wie viele Profilfragen überhaupt beantwortet wurden. */
  answered: number;
}

/** Ab dieser Punktzahl gilt ein Bedürfnis als „zu kurz gekommen“. */
export const NEED_THRESHOLD = 3;
/** Ab dieser Punktzahl wird ein Glaubenssatz vorgeschlagen. */
export const BELIEF_THRESHOLD = 2;
/** Ab dieser Lautstärke zählt der innere Kritiker als Schutzstrategie mit. */
export const CRITIC_LOUD = 7;

function tally<T extends string>(ids: T[]): Map<T, Scored<T>> {
  return new Map(ids.map((id) => [id, { id, score: 0, reasons: [] }]));
}

function sorted<T extends string>(map: Map<T, Scored<T>>, ids: T[]): Scored<T>[] {
  // Gleichstand: Reihenfolge der Datendatei, damit das Ergebnis stabil ist.
  return [...map.values()]
    .map((s) => ({ ...s, score: Math.max(0, s.score) }))
    .sort((a, b) => b.score - a.score || ids.indexOf(a.id) - ids.indexOf(b.id));
}

export function computeProfile(d: SessionData): Profile {
  const needs = tally(NEED_IDS);
  const beliefs = tally(BELIEF_IDS);
  const protectors = tally(PROTECTOR_IDS);
  let answered = 0;

  for (const q of profileQuestions) {
    const picked = d.choices[q.id];
    if (!picked || picked.length === 0) continue;
    answered += 1;
    for (const opt of q.options) {
      if (!picked.includes(opt.id) || !opt.weights) continue;
      const add = <T extends string>(map: Map<T, Scored<T>>, w?: Partial<Record<T, number>>) => {
        if (!w) return;
        for (const [id, points] of Object.entries(w) as [T, number][]) {
          const entry = map.get(id);
          if (!entry) continue;
          entry.score += points;
          entry.reasons.push({ questionId: q.id, optionId: opt.id, points });
        }
      };
      add(needs, opt.weights.needs);
      add(beliefs, opt.weights.beliefs);
      add(protectors, opt.weights.protectors);
    }
  }

  const critic = d.values.critic;
  if (typeof critic === 'number' && critic >= CRITIC_LOUD) {
    const entry = protectors.get('kritiker')!;
    entry.score += 2;
    entry.reasons.push({ questionId: 'critic', optionId: String(critic), points: 2 });
  }

  return {
    needs: sorted(needs, NEED_IDS),
    beliefs: sorted(beliefs, BELIEF_IDS),
    protectors: sorted(protectors, PROTECTOR_IDS),
    answered,
  };
}

export function topNeeds(p: Profile, max = 3): NeedId[] {
  const strong = p.needs.filter((n) => n.score >= NEED_THRESHOLD).slice(0, max);
  // Wer kaum Mangel angibt, bekommt trotzdem die zwei relativ stärksten –
  // sofern überhaupt etwas zusammenkam. Sonst bleibt die Liste leer.
  if (strong.length > 0) return strong.map((n) => n.id);
  return p.needs.filter((n) => n.score > 0).slice(0, 2).map((n) => n.id);
}

export function suggestedBeliefs(p: Profile, max = 5): BeliefId[] {
  return p.beliefs.filter((b) => b.score >= BELIEF_THRESHOLD).slice(0, max).map((b) => b.id);
}

export function topProtectors(p: Profile, max = 3): ProtectorId[] {
  return p.protectors.filter((x) => x.score > 0).slice(0, max).map((x) => x.id);
}
