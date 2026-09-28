/**
 * Grundtypen für alle Inhalte.
 *
 * Jeder Text, den jemand liest, liegt zweisprachig vor. Platzhalter in
 * geschweiften Klammern werden erst beim Anzeigen eingesetzt (siehe
 * `engine/text.ts`), damit die Datendateien reiner Text bleiben.
 */

export type Lang = 'de' | 'en';

export interface L10n {
  de: string;
  en: string;
}

/** Die drei Wege durch die Sitzung, sortiert von sanft nach tief. */
export type Path = 'gentle' | 'standard' | 'deep';
export const PATHS: Path[] = ['gentle', 'standard', 'deep'];

// ---------------------------------------------------------------------------
// Fachliche Bausteine
// ---------------------------------------------------------------------------

export type NeedId = 'sicherheit' | 'naehe' | 'wert' | 'ausdruck' | 'autonomie' | 'spiel' | 'grenzen';

export type BeliefId =
  | 'nichtGenug'
  | 'nichtLiebenswert'
  | 'zuViel'
  | 'unwichtig'
  | 'allein'
  | 'fehler'
  | 'schuld'
  | 'unsicher'
  | 'hilflos'
  | 'gefuehle'
  | 'anpassen'
  | 'nichtWehren'
  | 'verlassen'
  | 'kontrolle'
  | 'leistung';

export type ProtectorId =
  | 'perfektion'
  | 'anpassung'
  | 'kuemmern'
  | 'rueckzug'
  | 'kontrolle'
  | 'angriff'
  | 'betaeuben'
  | 'leisten'
  | 'kritiker'
  | 'vermeiden'
  | 'fassade'
  | 'gruebeln';

export interface Need {
  id: NeedId;
  name: L10n;
  /** Ein Satz, wie ihn ein Kind sagen würde. */
  childVoice: L10n;
  description: L10n;
  /** Woran man heute merkt, dass es damals zu kurz kam. */
  signs: L10n;
  /** Was das Kind hätte hören müssen – Vorschläge für die Nachnähr-Sätze. */
  sentences: L10n[];
  /** Was der Erwachsene in der Imagination tut, wenn dieses Bedürfnis dran ist. */
  rescript: L10n[];
  /** Kleine Handlungen für den Alltag. */
  actions: L10n[];
}

export interface Belief {
  id: BeliefId;
  text: L10n;
  /** Wie es sich anfühlt, wenn der Satz anspringt. */
  feels: L10n;
  /** Typische Herkunft, vorsichtig formuliert. */
  origin: L10n;
  needs: NeedId[];
  sentences: L10n[];
  /** Realistische neue Sätze – bewusst keine Affirmationen. */
  counters: L10n[];
}

export interface Protector {
  id: ProtectorId;
  name: L10n;
  /** Was die Strategie tut, in der Ich-Form. */
  voice: L10n;
  protects: L10n;
  cost: L10n;
  thanks: L10n;
  offer: L10n;
  alternative: L10n;
}

// ---------------------------------------------------------------------------
// Gewichte: Wie eine Antwort in die Auswertung eingeht
// ---------------------------------------------------------------------------

export interface Weights {
  needs?: Partial<Record<NeedId, number>>;
  beliefs?: Partial<Record<BeliefId, number>>;
  protectors?: Partial<Record<ProtectorId, number>>;
}

/** Markierungen, die den Ablauf steuern statt die Auswertung. */
export type Flag = 'trauma' | 'heavy' | 'acute' | 'fragile' | 'therapy' | 'dissociation';

export interface Option {
  id: string;
  label: L10n;
  hint?: L10n;
  weights?: Weights;
  /** Antwort der Sitzung auf diese Wahl – wie eine Therapeutin, die darauf eingeht. */
  response?: L10n;
  flags?: Flag[];
  /** Schließt alle anderen Optionen aus („Nichts davon“). */
  exclusive?: boolean;
}

// ---------------------------------------------------------------------------
// Geführte Texte
// ---------------------------------------------------------------------------

export interface GuidedLine {
  text: L10n;
  /** Empfohlene Pause in Sekunden, bevor es weitergeht. */
  pause?: number;
}

export type ExerciseId =
  | 'atem'
  | 'sichererOrt'
  | 'helfer'
  | 'tresor'
  | 'reorientierung'
  | 'schmetterling'
  | 'selbstmitgefuehl'
  | 'handAufsHerz'
  | 'kinderfoto'
  | 'kindBesuchen'
  | 'briefAndereHand'
  | 'beschuetzerDank'
  | 'glaubenssatzPruefen'
  | 'gefuehlsbruecke';

export type ExerciseKind = 'stabilize' | 'resource' | 'encounter' | 'reflect';

export interface Exercise {
  id: ExerciseId;
  kind: ExerciseKind;
  title: L10n;
  minutes: number;
  purpose: L10n;
  source: L10n;
  /** Für die Bibliothek: kann man sie ohne Vorbereitung allein machen? */
  standalone: boolean;
  lines: GuidedLine[];
}
