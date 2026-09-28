import type { L10n, Lang } from '../data/types';
import { feelingQuestion } from '../data/questions';
import type { SessionData } from './session';

/**
 * Platzhalter in Texten einsetzen.
 *
 * {kind}/{Kind}/{kindDat} – Name des Kindes oder „das Kind“/„dem Kind“.
 * Ein Name bleibt im Deutschen in allen hier benutzten Fällen gleich, daher
 * genügen drei Formen. Pronomen kommen in den Texten absichtlich nicht vor.
 */
export interface TextContext {
  kind: string;
  Kind: string;
  kindDat: string;
  helfer: string;
  ortZusatz: string;
  gefuehl: string;
  datum: string;
  alter: string;
}

const dateCache = new Map<string, string>();

/** Das heutige Datum, ausgeschrieben – zwischengespeichert, weil Intl-Formatierung teuer ist. */
function longDate(now: Date, lang: Lang): string {
  const key = `${lang}:${now.toDateString()}`;
  let out = dateCache.get(key);
  if (!out) {
    out = now.toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    dateCache.set(key, out);
  }
  return out;
}

export function textContext(d: SessionData, lang: Lang, now = new Date()): TextContext {
  const name = (d.texts.childName ?? '').trim();
  const helperName = (d.texts.helperName ?? '').trim();
  const place = (d.texts.placeWhat ?? '').trim();
  const feelingId = d.choices.feeling?.[0];
  const feeling = feelingQuestion.options.find((o) => o.id === feelingId)?.label[lang];
  const age = d.values.childAge;

  const de = lang === 'de';
  return {
    kind: name || (de ? 'das Kind' : 'the child'),
    Kind: name || (de ? 'Das Kind' : 'The child'),
    kindDat: name || (de ? 'dem Kind' : 'the child'),
    helfer: helperName || (de ? 'deine Helferfigur' : 'your helper'),
    ortZusatz: place ? ` (${place})` : '',
    gefuehl: feeling ? (de ? feeling : feeling.toLowerCase()) : de ? 'dieses Gefühl' : 'that feeling',
    datum: longDate(now, lang),
    alter: typeof age === 'number' ? String(age) : '',
  };
}

export function fill(text: string, ctx: TextContext): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in ctx ? ctx[key as keyof TextContext] : match,
  );
}

export function fillL(value: L10n, lang: Lang, ctx: TextContext): string {
  return fill(value[lang], ctx);
}
