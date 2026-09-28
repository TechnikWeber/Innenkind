import type { Path } from '../data/types';
import { phases, steps, type Block, type PhaseId, type Step } from '../data/steps';
import type { SessionData } from './session';

/** Gehört ein Schritt zum gewählten Weg und ist er gerade relevant? */
export function isVisible(step: Step, d: SessionData): boolean {
  if (step.paths && !step.paths.includes(d.path)) return false;
  return step.when ? step.when(d) : true;
}

export function visibleSteps(d: SessionData): Step[] {
  return steps.filter((s) => isVisible(s, d));
}

export function visibleBlocks(step: Step, d: SessionData): Block[] {
  return step.blocks.filter((b) => (b.when ? b.when(d) : true));
}

/**
 * Wo es nach einem Wegwechsel weitergeht.
 *
 * Fällt der aktuelle Schritt auf dem neuen Weg weg (etwa die Gefühlsbrücke
 * beim Wechsel auf „sanft“), geht es beim nächsten Schritt weiter, den es
 * dort gibt – nie zurück, damit niemand Beantwortetes noch einmal sieht.
 */
export function resolveStep(d: SessionData): Step {
  const list = visibleSteps(d);
  if (!d.stepId) return list[0];
  const current = list.find((s) => s.id === d.stepId);
  if (current) return current;
  const originalIndex = steps.findIndex((s) => s.id === d.stepId);
  return list.find((s) => steps.indexOf(s) > originalIndex) ?? list[list.length - 1];
}

/** Erster Schritt einer Phase auf dem aktuellen Weg. */
export function firstStepOfPhase(d: SessionData, phase: PhaseId): Step | undefined {
  return visibleSteps(d).find((s) => s.phase === phase);
}

/**
 * Geschätzte Dauer eines Wegs in Minuten.
 *
 * Für die Wegwahl zählen die Zugänge, die auf diesem Weg voreingestellt sind:
 * Gefühlsbrücke für „Begegnung“ und „Tiefe“, sicherer Ort für „Sanft“.
 */
export function estimateMinutes(path: Path, d?: SessionData): number {
  const probe: SessionData = {
    ...(d ?? ({ choices: {}, values: {}, texts: {}, done: [] } as unknown as SessionData)),
    path,
  };
  return visibleSteps(probe).reduce((sum, s) => sum + s.minutes, 0);
}

export function remainingMinutes(d: SessionData): number {
  const list = visibleSteps(d);
  const current = resolveStep(d);
  const idx = list.indexOf(current);
  return list.slice(idx).reduce((sum, s) => sum + s.minutes, 0);
}

export function phasesFor(d: SessionData) {
  const list = visibleSteps(d);
  return phases.filter((p) => list.some((s) => s.phase === p.id));
}
