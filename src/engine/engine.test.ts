import { describe, expect, it } from 'vitest';
import { needs, NEED_IDS } from '../data/needs';
import { beliefs, BELIEF_IDS } from '../data/beliefs';
import { protectors, PROTECTOR_IDS } from '../data/protectors';
import { exercises, exerciseById } from '../data/exercises';
import { allQuestions, profileQuestions } from '../data/questions';
import { helpRegions, therapySteps } from '../data/help';
import * as stepsModule from '../data/steps';
import { steps, phases } from '../data/steps';
import { ui } from '../i18n/strings';
import type { Path } from '../data/types';
import { PATHS } from '../data/types';
import { emptySession, entry, type SessionData } from './session';
import { computeProfile, suggestedBeliefs, topNeeds, topProtectors } from './profile';
import { estimateMinutes, resolveStep, visibleSteps } from './flow';
import { fill, textContext } from './text';
import { careReasons, chosenSentences, letterDraft, rescriptLines, sentenceOptions, speakLines, weekPlan } from './compose';
import { exportText } from './export';
import { recommendPath } from './path';

// ---------------------------------------------------------------------------
// Hilfen
// ---------------------------------------------------------------------------

function session(patch: Partial<SessionData> = {}): SessionData {
  return { ...emptySession(), ...patch };
}

/** Sammelt alle zweisprachigen Texte in einem beliebigen Datenobjekt. */
function collectL10n(value: unknown, path = '', out: { path: string; de: unknown; en: unknown }[] = [], seen = new Set<unknown>()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return out;
  seen.add(value);
  const obj = value as Record<string, unknown>;
  if ('de' in obj || 'en' in obj) {
    out.push({ path, de: obj.de, en: obj.en });
    return out;
  }
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'function') continue;
    collectL10n(v, `${path}.${k}`, out, seen);
  }
  return out;
}

const ALL_DATA = { needs, beliefs, protectors, exercises, allQuestions, steps, phases, helpRegions, therapySteps, ui, stepsModule };
const texts = collectL10n(ALL_DATA);
const KNOWN_PLACEHOLDERS = new Set(Object.keys(textContext(emptySession(), 'de')));

// ---------------------------------------------------------------------------
// Daten
// ---------------------------------------------------------------------------

describe('Inhalte', () => {
  it('liegen überall in beiden Sprachen vor', () => {
    expect(texts.length).toBeGreaterThan(800);
    const missing = texts.filter((t) => typeof t.de !== 'string' || typeof t.en !== 'string' || !t.de.trim() || !t.en.trim());
    expect(missing.map((m) => m.path)).toEqual([]);
  });

  it('verwenden nur bekannte Platzhalter, in beiden Sprachen dieselben', () => {
    const problems: string[] = [];
    for (const t of texts) {
      const de = [...String(t.de).matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
      const en = [...String(t.en).matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
      // Oberflächentexte haben eigene Platzhalter wie {n}; die prüft i18n.
      if (t.path.startsWith('.ui')) continue;
      for (const p of [...de, ...en]) if (!KNOWN_PLACEHOLDERS.has(p)) problems.push(`${t.path}: {${p}}`);
      const norm = (xs: string[]) => [...new Set(xs.map((x) => x.toLowerCase().replace('dat', '')))].sort().join(',');
      if (norm(de) !== norm(en)) problems.push(`${t.path}: DE {${de}} ≠ EN {${en}}`);
    }
    expect(problems).toEqual([]);
  });

  it('setzt deutsche Anführungszeichen paarweise', () => {
    const broken = texts.filter((t) => {
      const s = String(t.de);
      return (s.match(/„/g) ?? []).length !== (s.match(/“/g) ?? []).length;
    });
    expect(broken.map((b) => `${b.path}: ${String(b.de).slice(0, 60)}`)).toEqual([]);
  });

  it('hat eindeutige IDs', () => {
    const unique = (ids: string[]) => new Set(ids).size === ids.length;
    expect(unique(NEED_IDS)).toBe(true);
    expect(unique(BELIEF_IDS)).toBe(true);
    expect(unique(PROTECTOR_IDS)).toBe(true);
    expect(unique(exercises.map((e) => e.id))).toBe(true);
    expect(unique(steps.map((s) => s.id))).toBe(true);
    expect(unique(allQuestions.map((q) => q.id))).toBe(true);
    for (const q of allQuestions) expect(unique(q.options.map((o) => o.id)), q.id).toBe(true);
  });

  it('verweist nur auf existierende Bedürfnisse, Sätze und Beschützer', () => {
    for (const q of profileQuestions) {
      for (const o of q.options) {
        for (const id of Object.keys(o.weights?.needs ?? {})) expect(NEED_IDS, `${q.id}.${o.id}`).toContain(id);
        for (const id of Object.keys(o.weights?.beliefs ?? {})) expect(BELIEF_IDS, `${q.id}.${o.id}`).toContain(id);
        for (const id of Object.keys(o.weights?.protectors ?? {})) expect(PROTECTOR_IDS, `${q.id}.${o.id}`).toContain(id);
      }
    }
    for (const b of beliefs) for (const n of b.needs) expect(NEED_IDS).toContain(n);
  });

  it('bindet nur existierende Übungen ein', () => {
    for (const s of steps) {
      for (const b of s.blocks) if (b.t === 'exercise') expect(exerciseById.has(b.id), `${s.id}`).toBe(true);
    }
  });

  it('gibt jedem Glaubenssatz Sätze fürs Kind und realistische neue Sätze', () => {
    for (const b of beliefs) {
      expect(b.sentences.length).toBeGreaterThanOrEqual(2);
      expect(b.counters.length).toBeGreaterThanOrEqual(3);
    }
    for (const n of needs) {
      expect(n.sentences.length).toBe(4);
      expect(n.actions.length).toBe(4);
      expect(n.rescript.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('lässt Krisennummern nicht leer', () => {
    for (const r of helpRegions) for (const l of r.lines) expect(l.number.length).toBeGreaterThan(1);
  });
});

// ---------------------------------------------------------------------------
// Ablauf
// ---------------------------------------------------------------------------

describe('Wege durch die Sitzung', () => {
  it('beginnen mit dem Vorgespräch und enden stabilisiert', () => {
    for (const path of PATHS) {
      const list = visibleSteps(session({ path }));
      expect(list[0].id).toBe('v-willkommen');
      expect(list.at(-1)!.id).toBe('x-wuerdigung');
      const ids = list.map((s) => s.id);
      for (const must of ['v-sicherheit', 'k-ort', 'x-tresor', 'x-rueckweg', 'x-nachher']) expect(ids, `${path}: ${must}`).toContain(must);
      // Der sichere Ort kommt vor jeder Begegnung.
      expect(ids.indexOf('k-ort')).toBeLessThan(ids.indexOf('b-intro'));
    }
  });

  it('führen auf dem sanften Weg nie in eine belastende Erinnerung', () => {
    const d = session({ path: 'gentle', choices: { entry: ['bridge'] } });
    const ids = visibleSteps(d).map((s) => s.id);
    expect(ids).not.toContain('b-situation');
    expect(ids).not.toContain('b-bruecke');
    expect(ids).toContain('b-ort');
    expect(entry(d)).toBe('safeplace');
  });

  it('haben eine Pausenstelle ungefähr in der Mitte', () => {
    for (const path of PATHS) {
      const list = visibleSteps(session({ path }));
      const at = list.findIndex((st) => st.blocks.some((b) => b.t === 'special' && b.name === 'breakPoint'));
      const before = list.slice(0, at + 1).reduce((sum, st) => sum + st.minutes, 0);
      const total = list.reduce((sum, st) => sum + st.minutes, 0);
      expect(before / total, path).toBeGreaterThan(0.35);
      expect(before / total, path).toBeLessThan(0.65);
    }
  });

  it('dauern unterschiedlich lang, in realistischen Grenzen', () => {
    const [g, s, dp] = (['gentle', 'standard', 'deep'] as Path[]).map((p) => estimateMinutes(p));
    expect(g).toBeLessThan(s);
    expect(s).toBeLessThan(dp);
    // Ehrliche Größenordnung: etwa zwei Stunden, „Tiefe“ deutlich länger.
    expect(g).toBeGreaterThanOrEqual(90);
    expect(s).toBeGreaterThanOrEqual(100);
    expect(s).toBeLessThanOrEqual(130);
    expect(dp).toBeLessThanOrEqual(160);
  });

  it('gehen beim Wechsel auf „sanft“ vorwärts statt zurück', () => {
    const d = session({ path: 'gentle', stepId: 'b-bruecke', choices: { entry: ['bridge'] } });
    expect(resolveStep(d).id).toBe('b-ort');
  });

  it('halten bei akuter Gefahr an', () => {
    const step = steps.find((s) => s.id === 'v-sicherheit')!;
    expect(step.blocked!(session({ choices: { safety: ['akut'] } }))).toBe(true);
    expect(step.blocked!(session({ choices: { safety: ['nein'] } }))).toBe(false);
  });
});

describe('Wegvorschlag', () => {
  it('empfiehlt bei Dissoziation, Suizidgedanken oder hoher Belastung den sanften Weg', () => {
    expect(recommendPath(session({ choices: { flooding: ['oft'], time: ['150'] } })).path).toBe('gentle');
    expect(recommendPath(session({ choices: { safety: ['fluechtig'], time: ['150'] } })).path).toBe('gentle');
    expect(recommendPath(session({ values: { sudBefore: 8 }, choices: { time: ['150'] } })).path).toBe('gentle');
  });

  it('richtet sich sonst nach Zeit und Erfahrung', () => {
    expect(recommendPath(session({ choices: { time: ['120'] } })).path).toBe('standard');
    expect(recommendPath(session({ choices: { time: ['150'], experience: ['vertraut'] } })).path).toBe('deep');
    expect(recommendPath(session({ choices: { time: ['150'], experience: ['neu'] } })).path).toBe('standard');
    const split = recommendPath(session({ choices: { time: ['teilen'] } }));
    expect(split.path).toBe('standard');
    expect(split.reasons.some((r) => r.de.includes('Pausenstelle'))).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Auswertung
// ---------------------------------------------------------------------------

describe('Auswertung', () => {
  it('erkennt ein leistungsorientiertes Elternhaus', () => {
    const p = computeProfile(
      session({ choices: { home: ['leistung'], mistake: ['vergleich'], roles: ['held'], sayings: ['nurBestes', 'anstrengen'], reaction: ['perfektion'] } }),
    );
    expect(topNeeds(p)[0]).toBe('wert');
    expect(suggestedBeliefs(p).slice(0, 3)).toEqual(expect.arrayContaining(['leistung', 'nichtGenug']));
    expect(topProtectors(p)[0]).toBe('perfektion');
  });

  it('erkennt Parentifizierung', () => {
    const p = computeProfile(session({ choices: { sad: ['elternTroesten'], roles: ['kuemmerer'], home: ['belastet'] } }));
    expect(topNeeds(p)[0]).toBe('grenzen');
    expect(suggestedBeliefs(p)[0]).toBe('schuld');
    expect(topProtectors(p)[0]).toBe('kuemmern');
  });

  it('lässt gute Erfahrungen Bedürfnisse senken, aber nie unter null', () => {
    const p = computeProfile(session({ choices: { home: ['warm'], sad: ['getroestet'] } }));
    expect(p.needs.every((n) => n.score >= 0)).toBe(true);
    expect(topNeeds(p)).toEqual([]);
  });

  it('begründet jeden Wert mit den Antworten', () => {
    const p = computeProfile(session({ choices: { home: ['kalt'] } }));
    const naehe = p.needs.find((n) => n.id === 'naehe')!;
    expect(naehe.reasons).toEqual([{ questionId: 'home', optionId: 'kalt', points: 3 }]);
  });

  it('zählt eine laute innere Kritik als Beschützer', () => {
    const quiet = computeProfile(session({ values: { critic: 3 } }));
    const loud = computeProfile(session({ values: { critic: 9 } }));
    expect(quiet.protectors.find((p) => p.id === 'kritiker')!.score).toBe(0);
    expect(loud.protectors.find((p) => p.id === 'kritiker')!.score).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Texte
// ---------------------------------------------------------------------------

describe('Texte aus der Sitzung', () => {
  it('setzen den Namen des Kindes ein oder fallen auf „das Kind“ zurück', () => {
    const withName = textContext(session({ texts: { childName: 'Pia' } }), 'de');
    const without = textContext(session(), 'de');
    expect(fill('Schau {kind} an. {Kind} lächelt. Sag {kindDat} Hallo.', withName)).toBe('Schau Pia an. Pia lächelt. Sag Pia Hallo.');
    expect(fill('Schau {kind} an. {Kind} lächelt. Sag {kindDat} Hallo.', without)).toBe('Schau das Kind an. Das Kind lächelt. Sag dem Kind Hallo.');
  });

  it('schlagen Sätze aus gewählten Glaubenssätzen und Bedürfnissen vor, ohne Doppel', () => {
    const d = session({ choices: { beliefs: ['zuViel'], childNeed: ['trost'] } });
    const opts = sentenceOptions(d);
    expect(opts[0].id).toBe('belief:zuViel:0');
    expect(opts.some((o) => o.id.startsWith('need:naehe'))).toBe(true);
    expect(new Set(opts.map((o) => o.text.de)).size).toBe(opts.length);
  });

  it('bauen die Szene nach dem, was das Kind braucht', () => {
    const d = session({ path: 'standard', choices: { entry: ['bridge'], childNeed: ['schutz', 'weg'], helperWho: ['beide'] } });
    const lines = rescriptLines(d).map((l) => l.text.de).join(' ');
    expect(lines).toContain('Stell dich zwischen');
    expect(lines).toContain('raus aus dieser Situation');
    expect(lines).toContain('{helfer} ist an deiner Seite');
  });

  it('konfrontieren am sicheren Ort niemanden', () => {
    const d = session({ path: 'gentle', choices: { childNeed: ['schutz', 'verantwortung', 'weg'] } });
    const lines = rescriptLines(d).map((l) => l.text.de).join(' ');
    expect(lines).not.toMatch(/Erwachsenen in der Szene|raus aus dieser Situation|Hört auf/);
    expect(lines).toContain('Grenze deines sicheren Ortes');
  });

  it('lassen die gewählten Sätze sprechen – mit eigenem Satz zuletzt', () => {
    const d = session({ choices: { sentences: ['need:wert:0'] }, texts: { ownSentence: 'Ich bin stolz auf dich.' } });
    expect(chosenSentences(d, 'de')).toEqual(['Du bist richtig, so wie du bist.', 'Ich bin stolz auf dich.']);
    const spoken = speakLines(d, 'de').map((l) => l.text.de);
    expect(spoken).toContain('„Ich bin stolz auf dich.“');
  });

  it('entwerfen einen persönlichen Brief', () => {
    const d = session({
      texts: { childName: 'Tom', placeWhat: 'die Lichtung' },
      values: { childAge: 7 },
      choices: { strengths: ['neugierig', 'mutig'], sentences: ['need:naehe:0'], loved: ['natur'], home: ['kalt'] },
    });
    const letter = letterDraft(d, 'de', textContext(d, 'de'));
    expect(letter).toContain('Hallo Tom,');
    expect(letter).toContain('mit 7 Jahren');
    expect(letter).toContain('neugierig und mutig');
    expect(letter).toContain('Du darfst traurig sein');
    expect(letter).toContain('die Lichtung');
    expect(letter).not.toMatch(/\{\w+\}/);
  });

  it('planen sieben Tage mit täglichem Ritual', () => {
    const plan = weekPlan(session({ choices: { planActions: ['need:spiel:0'] } }));
    expect(plan).toHaveLength(7);
    expect(plan.every((d) => d.items[0].id.endsWith('ritual'))).toBe(true);
    expect(plan[0].items[1].id).toContain('need:spiel:0');
  });

  it('exportieren ein lesbares Protokoll ohne offene Platzhalter', () => {
    const d = session({
      startedAt: '2026-09-28T10:00:00.000Z',
      values: { moodBefore: 4, moodAfter: 6, 'belief.fehler.before': 80, 'belief.fehler.after': 60 },
      choices: { beliefs: ['fehler'], 'newBeliefPick.fehler': ['1'], triggers: ['kritik'], ifThenTrigger: ['kritik'], ifThenAction: ['herz'] },
      texts: { letter: 'Hallo,\n\nich bin da.', takeaway: 'Ich komme wieder.' },
    });
    const text = exportText(d, 'de', new Date('2026-09-28T12:00:00Z'));
    expect(text).toContain('Befinden (0–10): 4 → 6');
    expect(text).toContain('„Ich darf keine Fehler machen.“ (80 % → 60 %)');
    expect(text).toContain('Neu: „Ein Fehler ist ein Ereignis, kein Urteil über mich.“');
    expect(text).toContain('Wenn ich merke: Kritik');
    expect(text).not.toMatch(/\{\w+\}/);
  });
});

describe('Empfehlung professioneller Hilfe', () => {
  it('greift bei Trauma, Dissoziation und hoher Restbelastung', () => {
    expect(careReasons(session())).toEqual([]);
    expect(careReasons(session({ choices: { events: ['gewalt'] } }))).toContain('trauma');
    expect(careReasons(session({ choices: { flooding: ['oft'] } }))).toContain('dissociation');
    expect(careReasons(session({ values: { sudAfter: 7 } }))).toContain('distress');
  });
});
