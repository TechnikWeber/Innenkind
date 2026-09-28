import type { Lang } from '../data/types';
import { concernQuestion, goalQuestion, type Question } from '../data/questions';
import { beliefById } from '../data/beliefs';
import { needById } from '../data/needs';
import { protectorById } from '../data/protectors';
import { computeProfile, topNeeds, topProtectors } from './profile';
import { chosenSentences, ifThenText, newBeliefText, planActionText, playText, weekPlan } from './compose';
import { selectedBeliefs, type SessionData } from './session';
import { fill, textContext } from './text';

/**
 * Das Protokoll als schlichter Text – zum Herunterladen, Weiterleiten an die
 * eigene Therapeutin oder Ausdrucken ohne Seitenlayout.
 */
export function exportText(d: SessionData, lang: Lang, now = new Date()): string {
  const de = lang === 'de';
  const ctx = textContext(d, lang, now);
  const profile = computeProfile(d);
  const out: string[] = [];
  const h = (title: string) => out.push('', title, '-'.repeat(title.length));
  const line = (s: string) => out.push(s);

  const date = d.startedAt ? new Date(d.startedAt) : now;
  out.push(de ? 'Innenkind – Sitzungsprotokoll' : 'Innenkind — session record');
  out.push('='.repeat(out[0].length));
  line(date.toLocaleString(de ? 'de-DE' : 'en-GB', { dateStyle: 'full', timeStyle: 'short' }));

  const labels = (q: Question) =>
    (d.choices[q.id] ?? []).map((id) => q.options.find((o) => o.id === id)?.label[lang]).filter((l): l is string => !!l);
  const concerns = labels(concernQuestion);
  const goals = labels(goalQuestion);
  const concernText = (d.texts.concernText ?? '').trim();
  if (concerns.length > 0 || concernText || goals.length > 0) {
    h(de ? 'Anliegen' : 'What brought me here');
    concerns.forEach((c) => line(`• ${c}`));
    if (concernText) line(concernText);
    goals.forEach((g) => line(`${de ? 'Ziel' : 'Goal'}: ${g}`));
  }

  const scale = (label: string, a?: number, b?: number, unit = '') => {
    if (typeof a !== 'number' && typeof b !== 'number') return;
    line(`${label}: ${a ?? '–'}${unit} → ${b ?? '–'}${unit}`);
  };
  h(de ? 'Vorher → nachher' : 'Before → after');
  scale(de ? 'Befinden (0–10)' : 'Wellbeing (0–10)', d.values.moodBefore, d.values.moodAfter);
  scale(de ? 'Belastung (0–10)' : 'Distress (0–10)', d.values.sudBefore, d.values.sudAfter);

  const needsTop = topNeeds(profile, 3);
  if (needsTop.length > 0) {
    h(de ? 'Bedürfnisse, die zu kurz gekommen sein könnten' : 'Needs that may have gone unmet');
    needsTop.forEach((n) => line(`• ${needById.get(n)!.name[lang]}`));
  }

  const beliefs = selectedBeliefs(d);
  if (beliefs.length > 0) {
    h(de ? 'Alte und neue Sätze' : 'Old and new beliefs');
    for (const id of beliefs) {
      const b = beliefById.get(id)!;
      const before = d.values[`belief.${id}.before`];
      const after = d.values[`belief.${id}.after`];
      line(`${de ? 'Alt' : 'Old'}: „${b.text[lang]}“ ${typeof before === 'number' ? `(${before} %${typeof after === 'number' ? ` → ${after} %` : ''})` : ''}`.trim());
      const nb = newBeliefText(d, id, lang);
      if (nb) {
        const r = d.values[`newBelief.${id}.rating`];
        line(`${de ? 'Neu' : 'New'}: „${nb}“${typeof r === 'number' ? ` (${r} %)` : ''}`);
      }
      const ev = (d.texts[`evidence.${id}`] ?? '').trim();
      if (ev) line(`${de ? 'Belege' : 'Evidence'}: ${ev}`);
      line('');
    }
  }

  const prot = topProtectors(profile, 3);
  if (prot.length > 0) {
    h(de ? 'Beschützer' : 'Protectors');
    prot.forEach((p) => line(`• ${protectorById.get(p)!.name[lang]}`));
    if (d.texts.protectorFear) line(`${de ? 'Was er befürchtet' : 'What it is afraid of'}: ${d.texts.protectorFear}`);
  }

  h(de ? 'Das innere Kind' : 'The inner child');
  if (d.texts.childName) line(`${de ? 'Name' : 'Name'}: ${d.texts.childName}`);
  if (typeof d.values.childAge === 'number') line(`${de ? 'Alter' : 'Age'}: ${d.values.childAge}`);
  if (d.texts.childLook) line(`${de ? 'Aussehen' : 'Appearance'}: ${d.texts.childLook}`);
  if (d.texts.childScene) line(`${de ? 'Szene' : 'Scene'}: ${d.texts.childScene}`);
  if (d.texts.placeWhat) line(`${de ? 'Sicherer Ort' : 'Safe place'}: ${d.texts.placeWhat}${d.texts.placeDetails ? ` – ${d.texts.placeDetails}` : ''}`);
  if (d.texts.helperName) line(`${de ? 'Helferfigur' : 'Helper'}: ${d.texts.helperName}`);
  if (d.texts.happyMemory) line(`${de ? 'Ein schöner Moment' : 'A happy moment'}: ${d.texts.happyMemory}`);
  if (d.texts.situation) line(`${de ? 'Situation von heute' : 'Situation from today'}: ${d.texts.situation}`);

  const sentences = chosenSentences(d, lang);
  if (sentences.length > 0) {
    h(de ? 'Sätze für das Kind' : 'Sentences for the child');
    sentences.forEach((s) => line(`• ${s}`));
  }

  if (d.texts.letter) {
    h(de ? 'Brief' : 'Letter');
    line(d.texts.letter);
  }
  if (d.texts.letterFromChild) {
    h(de ? 'Antwort des Kindes' : 'Reply from the child');
    line(d.texts.letterFromChild);
  }

  h(de ? 'Plan' : 'Plan');
  const it = ifThenText(d, lang, ctx);
  if (it) line(it);
  for (const id of d.choices.planActions ?? []) {
    const a = planActionText(id);
    if (a) line(`• ${fill(a[lang], ctx)}`);
  }
  const play = playText(d);
  if (play) line(`• ${play[lang]}`);
  line('');
  for (const day of weekPlan(d)) {
    line(`${de ? 'Tag' : 'Day'} ${day.day}: ${day.items.map((i) => `[${d.done.includes(i.id) ? 'x' : ' '}] ${fill(i.text[lang], ctx)}`).join('  ')}`);
  }

  if (d.texts.takeaway) {
    h(de ? 'Was ich mitnehme' : 'What I am taking away');
    line(d.texts.takeaway);
  }

  out.push('', '—', de ? 'Erstellt mit Innenkind (technikweber.github.io/Innenkind). Kein Ersatz für Psychotherapie.' : 'Created with Innenkind (technikweber.github.io/Innenkind). No substitute for psychotherapy.');
  return out.join('\n').replace(/\n{3,}/g, '\n\n') + '\n';
}
