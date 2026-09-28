import type { BeliefId, GuidedLine, L10n, Lang, NeedId } from '../data/types';
import { needById, needs } from '../data/needs';
import { beliefById } from '../data/beliefs';
import { protectorById } from '../data/protectors';
import { lovedQuestion, strengthsQuestion, triggersQuestion } from '../data/questions';
import { computeProfile, topNeeds, topProtectors, type Profile } from './profile';
import { CHILD_NEED_MAP, choice, entry, selectedBeliefs, type SessionData } from './session';
import { fill, type TextContext } from './text';

// ---------------------------------------------------------------------------
// Bedürfnisse, um die es in der Begegnung geht
// ---------------------------------------------------------------------------

/** Aus der Wahl in der Szene, sonst aus der Auswertung. */
export function sceneNeeds(d: SessionData, profile: Profile = computeProfile(d)): NeedId[] {
  const picked = (d.choices.childNeed ?? [])
    .map((c) => CHILD_NEED_MAP[c])
    .filter((n): n is NeedId => Boolean(n));
  if (picked.length > 0) return picked;
  const top = topNeeds(profile, 2);
  return top.length > 0 ? top : ['naehe', 'wert'];
}

/** Bedürfnisse für Sätze und Alltag: Szene zuerst, dann Auswertung, ohne Doppel. */
export function focusNeeds(d: SessionData, profile: Profile = computeProfile(d), max = 3): NeedId[] {
  const out: NeedId[] = [];
  for (const id of [...sceneNeeds(d, profile), ...topNeeds(profile, 3)]) {
    if (!out.includes(id)) out.push(id);
  }
  return out.slice(0, max);
}

// ---------------------------------------------------------------------------
// Sätze für das Kind
// ---------------------------------------------------------------------------

export interface SentenceOption {
  id: string;
  text: L10n;
  from: 'need' | 'belief';
  sourceId: string;
}

export function sentenceById(id: string): L10n | undefined {
  const [kind, source, idx] = id.split(':');
  const i = Number(idx);
  if (kind === 'need') return needById.get(source as NeedId)?.sentences[i];
  if (kind === 'belief') return beliefById.get(source as BeliefId)?.sentences[i];
  return undefined;
}

export function sentenceOptions(d: SessionData, profile: Profile = computeProfile(d)): SentenceOption[] {
  const out: SentenceOption[] = [];
  const seen = new Set<string>();
  const push = (o: SentenceOption) => {
    if (seen.has(o.text.de)) return;
    seen.add(o.text.de);
    out.push(o);
  };
  for (const b of selectedBeliefs(d)) {
    beliefById.get(b)?.sentences.forEach((text, i) => push({ id: `belief:${b}:${i}`, text, from: 'belief', sourceId: b }));
  }
  for (const n of focusNeeds(d, profile, 3)) {
    needById.get(n)?.sentences.forEach((text, i) => push({ id: `need:${n}:${i}`, text, from: 'need', sourceId: n }));
  }
  return out;
}

export const MAX_SENTENCES = 5;

/** Die gewählten Sätze als Text, eigene Formulierung am Ende. */
export function chosenSentences(d: SessionData, lang: Lang): string[] {
  const picked = (d.choices.sentences ?? [])
    .map((id) => sentenceById(id)?.[lang])
    .filter((s): s is string => Boolean(s));
  const own = (d.texts.ownSentence ?? '').trim();
  return own ? [...picked, own] : picked;
}

// ---------------------------------------------------------------------------
// Die neue Szene (Imagery Rescripting)
// ---------------------------------------------------------------------------

/**
 * Am sicheren Ort gibt es niemanden, dem man Einhalt gebieten müsste. Die
 * Bedürfnisse, deren Szenentext Erwachsene anspricht, bekommen dort eine
 * eigene Fassung.
 */
const SAFE_PLACE_RESCRIPT: Partial<Record<NeedId, L10n[]>> = {
  sicherheit: [
    { de: 'Sag {kindDat}: „Hier bist du sicher. Ich passe auf, und niemand kommt herein, den du nicht einlädst.“', en: 'Tell {kind}: “You are safe here. I am keeping watch, and no one comes in whom you don’t invite.”' },
    { de: 'Zeig {kindDat} die Grenze deines sicheren Ortes – die Hecke, die Mauer, die Tür. Lass {kind} spüren, wie fest sie ist.', en: 'Show {kind} the boundary of your safe place — the hedge, the wall, the door. Let {kind} feel how solid it is.' },
    { de: 'Sag: „Ich bleibe. Ich gehe nicht weg.“', en: 'Say: “I am staying. I am not going away.”' },
  ],
  grenzen: [
    { de: 'Sag {kindDat}: „Du musst dich um niemanden mehr kümmern. Das machen jetzt die Großen – und ich kümmere mich um dich.“', en: 'Tell {kind}: “You don’t have to look after anyone any more. The grown-ups will do that now — and I will look after you.”' },
    { de: 'Stell dir vor, wie {kind} einen schweren Rucksack absetzt, der viel zu lange getragen wurde. Du nimmst ihn und stellst ihn weit weg.', en: 'Imagine {kind} putting down a heavy rucksack that was carried for far too long. You take it and put it far away.' },
    { de: 'Spür, wie leicht die Schultern von {kindDat} werden.', en: 'Feel how light the shoulders of {kind} become.' },
  ],
};

const line = (de: string, en: string, pause?: number): GuidedLine => ({ text: { de, en }, pause });

export function rescriptLines(d: SessionData, profile: Profile = computeProfile(d)): GuidedLine[] {
  const how = entry(d);
  const who = choice(d, 'helperWho') ?? 'ich';
  const out: GuidedLine[] = [];

  if (how === 'safeplace') {
    out.push(line('Geh wieder an deinen sicheren Ort{ortZusatz}, zu {kindDat}. Nimm dir einen Moment, um anzukommen.', 'Go back to your safe place{ortZusatz}, to {kind}. Take a moment to arrive.', 10));
  } else {
    out.push(line('Schließ die Augen, wenn du magst, und geh zurück zu dem Bild von eben. {Kind} ist dort, so wie du {kind} gesehen hast.', 'Close your eyes if you like, and go back to the image from before. {Kind} is there, just as you saw {kind}.', 10));
    out.push(line('Friere das Bild kurz ein, wie bei einem Film, den man anhält. Nichts geht weiter, solange du es nicht willst.', 'Freeze the image for a moment, like pausing a film. Nothing moves on until you want it to.', 8));
  }

  if (who === 'helfer') {
    out.push(line('{helfer} tritt jetzt hinzu – ruhig, stark und voller Wärme. Du bist dabei und schaust zu.', '{helfer} now steps in — calm, strong and full of warmth. You are there, watching.', 10));
  } else if (who === 'beide') {
    out.push(line('Du trittst jetzt hinzu, und {helfer} ist an deiner Seite. Ihr seid zu zweit. Spür, wie viel Kraft das gibt.', 'You step in now, with {helfer} at your side. There are two of you. Feel how much strength that gives.', 10));
  } else {
    out.push(line('Du trittst jetzt hinzu – als der erwachsene Mensch, der du heute bist. Spür deine Größe, deine Kraft, deine Erfahrung.', 'You step in now — as the adult you are today. Feel your size, your strength, your experience.', 10));
  }
  out.push(line('Geh zu {kindDat}. Lass dir Zeit. Nimm Blickkontakt auf, wenn {kind} das zulässt.', 'Go to {kind}. Take your time. Make eye contact if {kind} allows it.', 10));

  for (const id of sceneNeeds(d, profile)) {
    const safe = how === 'safeplace' ? SAFE_PLACE_RESCRIPT[id] : undefined;
    const lines = safe ?? needById.get(id)?.rescript ?? [];
    lines.forEach((text) => out.push({ text, pause: 14 }));
  }

  if ((d.choices.childNeed ?? []).includes('weg') && how !== 'safeplace') {
    out.push(line('Und dann nimm {kind} mit – raus aus dieser Situation. Niemand hält euch auf. Ihr geht gemeinsam, Schritt für Schritt, und mit jedem Schritt wird es leichter.', 'And then take {kind} with you — out of this situation. No one stops you. You walk together, step by step, and with every step it gets lighter.', 14));
  }

  out.push(line('Schau, wie {kind} reagiert. Was verändert sich im Gesicht, in der Haltung, im Blick?', 'Watch how {kind} responds. What changes in the face, the posture, the eyes?', 15));
  out.push(line('Frag {kind}: „Brauchst du noch etwas?“ Und gib es, so gut du kannst.', 'Ask {kind}: “Do you need anything else?” And give it as best you can.', 15));
  out.push(line('Bleib noch einen Moment. Es muss nichts mehr geschehen.', 'Stay a moment longer. Nothing more needs to happen.', 10));
  return out;
}

export function speakLines(d: SessionData, lang: Lang): GuidedLine[] {
  const sentences = chosenSentences(d, lang);
  const out: GuidedLine[] = [
    line('Wende dich {kindDat} zu. Geh in die Hocke, auf Augenhöhe. Schau {kind} freundlich an.', 'Turn towards {kind}. Crouch down to eye level. Look at {kind} kindly.', 10),
    line('Sag jetzt – laut oder innerlich –, was {kind} hören muss. Langsam, Satz für Satz.', 'Now say — aloud or inwardly — what {kind} needs to hear. Slowly, sentence by sentence.', 5),
  ];
  const fallback = [needs[1].sentences[0][lang], needs[2].sentences[0][lang]];
  for (const s of sentences.length > 0 ? sentences : fallback) {
    out.push({ text: { de: `„${s}“`, en: `“${s}”` }, pause: 10 });
  }
  out.push(line('Sag die Sätze noch einmal, noch langsamer. Lass jeden einzelnen ankommen.', 'Say the sentences once more, even more slowly. Let each one land.', 20));
  out.push(line('Nimm wahr, wie {kind} diese Worte aufnimmt.', 'Notice how {kind} takes in these words.', 12));
  return out;
}

// ---------------------------------------------------------------------------
// Brief
// ---------------------------------------------------------------------------

function listJoin(items: string[], lang: Lang): string {
  if (items.length <= 1) return items.join('');
  const last = items[items.length - 1];
  return `${items.slice(0, -1).join(', ')} ${lang === 'de' ? 'und' : 'and'} ${last}`;
}

export function letterDraft(d: SessionData, lang: Lang, ctx: TextContext, profile: Profile = computeProfile(d)): string {
  const de = lang === 'de';
  const name = (d.texts.childName ?? '').trim();
  const greeting = name ? (de ? `Hallo ${name},` : `Dear ${name},`) : de ? 'Liebes kleines Ich,' : 'Dear little me,';
  const paras: string[] = [];

  const age = d.values.childAge;
  paras.push(
    de
      ? `heute habe ich dich besucht${typeof age === 'number' ? ` – dich, mit ${age} Jahren` : ''}. Ich habe dich angeschaut, und ich möchte dir ein paar Dinge sagen, die du damals hättest hören sollen.`
      : `today I came to visit you${typeof age === 'number' ? ` — you, at ${age} years old` : ''}. I looked at you, and I want to tell you a few things you should have heard back then.`,
  );

  const strengths = (d.choices.strengths ?? [])
    .map((id) => strengthsQuestion.options.find((o) => o.id === id)?.label[lang])
    .filter((s): s is string => Boolean(s))
    .slice(0, 3);
  if (strengths.length > 0) {
    paras.push(
      de
        ? `Ich sehe dich. Ich sehe, wie ${listJoin(strengths, lang)} du bist. Das ist nicht verloren gegangen – es steckt noch in mir, und ich bin stolz darauf.`
        : `I see you. I see how ${listJoin(strengths, lang)} you are. That has not been lost — it is still in me, and I am proud of it.`,
    );
  }

  const focus = focusNeeds(d, profile, 2).map((n) => needById.get(n)!.name[lang]);
  if (focus.length > 0) {
    paras.push(
      de
        ? `Ich weiß jetzt, dass dir manches gefehlt hat – vor allem ${listJoin(focus, lang)}. Das war nicht deine Schuld. Du hast getan, was ein Kind tun kann, und du hast Wege gefunden, damit zurechtzukommen.`
        : `I know now that some things were missing for you — above all ${listJoin(focus.map((f) => f.toLowerCase()), lang)}. That was not your fault. You did what a child can do, and you found ways to cope.`,
    );
  }

  const prot = topProtectors(profile, 1)[0];
  if (prot) {
    const p = protectorById.get(prot)!;
    paras.push(
      de
        ? `Du hast gelernt, dich zu schützen. Einer deiner Wege dafür heißt: ${p.name.de.split(' – ')[0]}. Das war klug. Aber du musst das nicht mehr allein tun. Ich bin jetzt erwachsen, und ich kümmere mich.`
        : `You learned to protect yourself. One of your ways of doing it is called: ${p.name.en.split(' — ')[0].toLowerCase()}. That was clever. But you don’t have to do it alone any more. I am grown up now, and I will take care of things.`,
    );
  }

  const sentences = chosenSentences(d, lang);
  if (sentences.length > 0) {
    paras.push((de ? 'Hör gut zu:\n' : 'Listen carefully:\n') + sentences.map((s) => `– ${s}`).join('\n'));
  }

  const loved = (d.choices.loved ?? [])
    .map((id) => lovedQuestion.options.find((o) => o.id === id)?.label[lang])
    .filter((s): s is string => Boolean(s))
    .slice(0, 2);
  if (loved.length > 0) {
    paras.push(
      de
        ? `Ich habe nicht vergessen, was du geliebt hast: ${listJoin(loved, lang)}. Wir holen uns das zurück, Stück für Stück.`
        : `I have not forgotten what you loved: ${listJoin(loved.map((l) => l.toLowerCase()), lang)}. We will get that back, bit by bit.`,
    );
  }

  const place = (d.texts.placeWhat ?? '').trim();
  paras.push(
    de
      ? `Du hast jetzt einen sicheren Ort${place ? ` – ${place}` : ''}. Da kannst du bleiben, so lange du willst. Und ich komme wieder. Nicht nur heute, sondern jeden Tag ein bisschen.`
      : `You have a safe place now${place ? ` — ${place}` : ''}. You can stay there as long as you like. And I will come back. Not only today, but a little every day.`,
  );

  const closing = de ? 'In Liebe,\ndein erwachsenes Ich' : 'With love,\nyour grown-up self';
  return fill([greeting, ...paras, closing].join('\n\n'), ctx);
}

// ---------------------------------------------------------------------------
// Alltag
// ---------------------------------------------------------------------------

export const IF_THEN_ACTIONS: { id: string; text: L10n }[] = [
  { id: 'herz', text: { de: 'lege ich eine Hand aufs Herz und sage innerlich: „Ich bin da. Das ist damals, nicht heute.“', en: 'I put a hand on my heart and say inwardly: “I am here. That was then, not now.”' } },
  { id: 'alter', text: { de: 'atme ich dreimal lang aus und frage mich: „Wie alt fühle ich mich gerade?“', en: 'I breathe out long three times and ask myself: “How old do I feel right now?”' } },
  { id: 'satz', text: { de: 'sage ich {kindDat} einen meiner Sätze.', en: 'I say one of my sentences to {kind}.' } },
  { id: 'ort', text: { de: 'gehe ich kurz aus dem Raum und denke an meinen sicheren Ort.', en: 'I briefly leave the room and think of my safe place.' } },
  { id: 'boden', text: { de: 'stelle ich die Füße fest auf den Boden und benenne fünf Dinge, die ich sehe.', en: 'I plant my feet firmly on the floor and name five things I can see.' } },
  { id: 'beschuetzer', text: { de: 'sage ich innerlich zu meinem Beschützer: „Danke, ich übernehme.“', en: 'I say inwardly to my protector: “Thank you, I’ll take it from here.”' } },
];

export function ifThenText(d: SessionData, lang: Lang, ctx: TextContext): string | null {
  const triggerId = choice(d, 'ifThenTrigger');
  const actionId = choice(d, 'ifThenAction');
  const own = (d.texts.ifThenOwn ?? '').trim();
  if (!triggerId || (!actionId && !own)) return null;
  const trigger = triggersQuestion.options.find((o) => o.id === triggerId)?.label[lang] ?? '';
  const action = own || IF_THEN_ACTIONS.find((a) => a.id === actionId)?.text[lang] || '';
  return fill(lang === 'de' ? `Wenn ich merke: ${trigger} – dann ${action}` : `When I notice: ${trigger.charAt(0).toLowerCase() + trigger.slice(1)} — then ${action}`, ctx);
}

/** Gewählte Alltagshandlungen, ID `need:<bedürfnis>:<index>`. */
export function planActionText(id: string): L10n | undefined {
  const [, need, idx] = id.split(':');
  return needById.get(need as NeedId)?.actions[Number(idx)];
}

export function playText(d: SessionData): L10n | undefined {
  const id = choice(d, 'planPlay');
  return lovedQuestion.options.find((o) => o.id === id)?.response;
}

export interface DayPlan {
  day: number;
  items: { id: string; text: L10n }[];
}

const RITUAL: L10n = { de: 'Tägliches Ritual: drei Minuten mit {kindDat}', en: 'Daily ritual: three minutes with {kind}' };
const FIXED: Record<number, L10n> = {
  3: { de: 'Den Brief an {kind} noch einmal lesen – laut, wenn du magst', en: 'Read the letter to {kind} again — aloud, if you like' },
  5: { de: 'Übung: {kind} am sicheren Ort besuchen (6 Min.)', en: 'Exercise: visit {kind} at the safe place (6 min)' },
  7: { de: 'Rückblick: Was hat sich verändert? Die neuen Sätze noch einmal einschätzen', en: 'Review: what has changed? Rate the new beliefs again' },
};

export function weekPlan(d: SessionData): DayPlan[] {
  const flexible: { id: string; text: L10n }[] = [];
  for (const id of d.choices.planActions ?? []) {
    const text = planActionText(id);
    if (text) flexible.push({ id, text });
  }
  const play = playText(d);
  if (play) flexible.push({ id: 'play', text: play });
  if (flexible.length === 0) {
    flexible.push({ id: 'selbstmitgefuehl', text: { de: 'Übung: Selbstmitgefühls-Pause (3 Min.)', en: 'Exercise: self-compassion break (3 min)' } });
  }

  const days: DayPlan[] = [];
  let k = 0;
  for (let day = 1; day <= 7; day += 1) {
    const items = [{ id: `d${day}-ritual`, text: RITUAL }];
    const fixed = FIXED[day];
    if (fixed) items.push({ id: `d${day}-fixed`, text: fixed });
    else {
      const f = flexible[k % flexible.length];
      k += 1;
      items.push({ id: `d${day}-${f.id}`, text: f.text });
    }
    days.push({ day, items });
  }
  return days;
}

// ---------------------------------------------------------------------------
// Wann professionelle Begleitung ausdrücklich empfohlen wird
// ---------------------------------------------------------------------------

export type CareReason = 'trauma' | 'dissociation' | 'distress' | 'mood' | 'overwhelmed' | 'thoughts';

export function careReasons(d: SessionData): CareReason[] {
  const out: CareReason[] = [];
  const events = d.choices.events ?? [];
  if (events.some((e) => ['gewalt', 'uebergriffe', 'vernachlaessigung'].includes(e))) out.push('trauma');
  if (choice(d, 'flooding') === 'oft') out.push('dissociation');
  if ((d.values.sudAfter ?? 0) >= 6) out.push('distress');
  if (typeof d.values.moodAfter === 'number' && d.values.moodAfter <= 3) out.push('mood');
  if (choice(d, 'childReaction') === 'zuViel') out.push('overwhelmed');
  if (choice(d, 'safety') === 'fluechtig') out.push('thoughts');
  return out;
}

/** Der neue Satz, der zu einem alten gewählt oder formuliert wurde. */
export function newBeliefText(d: SessionData, id: BeliefId, lang: Lang): string | null {
  const own = (d.texts[`newBelief.${id}`] ?? '').trim();
  if (own) return own;
  const pick = d.choices[`newBeliefPick.${id}`]?.[0];
  if (pick === undefined) return null;
  return beliefById.get(id)?.counters[Number(pick)]?.[lang] ?? null;
}
