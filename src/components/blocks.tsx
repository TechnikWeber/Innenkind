import { useEffect, useId, useRef, useState } from 'react';
import type { GuidedLine, Lang } from '../data/types';
import type { Question } from '../data/questions';
import { useI18n } from '../i18n';
import { useSession } from '../state/session';
import { useFill, Voice } from './common';

// ---------------------------------------------------------------------------
// Auswahlfrage
// ---------------------------------------------------------------------------

export function QuestionBlock({ q }: { q: Question }) {
  const { data, setChoice } = useSession();
  const { t } = useI18n();
  const f = useFill();
  const picked = data.choices[q.id] ?? [];
  const headingId = useId();

  const toggle = (id: string) => {
    const opt = q.options.find((o) => o.id === id)!;
    if (!q.multi) {
      setChoice(q.id, picked[0] === id ? [] : [id]);
      return;
    }
    if (picked.includes(id)) {
      setChoice(q.id, picked.filter((p) => p !== id));
      return;
    }
    if (opt.exclusive) {
      setChoice(q.id, [id]);
      return;
    }
    const withoutExclusive = picked.filter((p) => !q.options.find((o) => o.id === p)?.exclusive);
    if (q.max && withoutExclusive.length >= q.max) return;
    setChoice(q.id, [...withoutExclusive, id]);
  };

  const responses = q.options.filter((o) => picked.includes(o.id) && o.response);
  const full = Boolean(q.multi && q.max && picked.length >= q.max);

  return (
    <fieldset className="question">
      <legend id={headingId} className="question__title">
        {f(q.question)}
        {q.optional && <span className="chip question__chip">{t('optional')}</span>}
        {q.multi && q.max && <span className="chip question__chip">{t('chooseUpTo', { n: q.max })}</span>}
      </legend>
      {q.hint && <p className="question__hint">{f(q.hint)}</p>}
      <div className="answers" role="group" aria-labelledby={headingId}>
        {q.options.map((o) => {
          const on = picked.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              className="answer"
              aria-pressed={on}
              disabled={!on && full && !o.exclusive}
              onClick={() => toggle(o.id)}
            >
              <span className={`answer__box answer__box--${q.multi ? 'check' : 'radio'}`} aria-hidden="true" />
              <span>
                <span className="answer__label">{f(o.label)}</span>
                {o.hint && <span className="answer__hint">{f(o.hint)}</span>}
              </span>
            </button>
          );
        })}
      </div>
      {responses.map((o) => (
        <Voice key={o.id}>
          <p>{f(o.response)}</p>
        </Voice>
      ))}
    </fieldset>
  );
}

// ---------------------------------------------------------------------------
// Skala 0–10
// ---------------------------------------------------------------------------

export function ScaleBlock({ id, label, low, high }: { id: string; label: string; low: string; high: string }) {
  const { data, setValue } = useSession();
  const current = data.values[id];
  const headingId = useId();
  return (
    <div className="scale">
      <p id={headingId} className="question__title">
        {label}
      </p>
      <div className="scale__row" role="radiogroup" aria-labelledby={headingId}>
        {Array.from({ length: 11 }, (_, n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={current === n}
            className="scale__dot"
            onClick={() => setValue(id, current === n ? undefined : n)}
          >
            {n}
          </button>
        ))}
      </div>
      <div className="scale__ends" aria-hidden="true">
        <span>{low}</span>
        <span>{high}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Freitext und Zahl
// ---------------------------------------------------------------------------

export function TextBlock({ id, label, hint, placeholder, rows = 3 }: { id: string; label: string; hint?: string; placeholder?: string; rows?: number }) {
  const { data, setText } = useSession();
  const inputId = useId();
  return (
    <div className="field">
      <label htmlFor={inputId} className="field__label">
        {label}
      </label>
      {hint && <p className="question__hint">{hint}</p>}
      {rows <= 1 ? (
        <input id={inputId} type="text" value={data.texts[id] ?? ''} placeholder={placeholder} onChange={(e) => setText(id, e.target.value)} autoComplete="off" />
      ) : (
        <textarea id={inputId} rows={rows} value={data.texts[id] ?? ''} placeholder={placeholder} onChange={(e) => setText(id, e.target.value)} />
      )}
    </div>
  );
}

export function NumberBlock({ id, label, min, max }: { id: string; label: string; min: number; max: number }) {
  const { data, setValue } = useSession();
  const inputId = useId();
  const current = data.values[id];
  return (
    <div className="field">
      <label htmlFor={inputId} className="field__label">
        {label}
      </label>
      <input
        id={inputId}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        style={{ maxWidth: '8rem' }}
        value={current ?? ''}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value, 10);
          setValue(id, Number.isFinite(n) ? Math.max(min, Math.min(max, n)) : undefined);
        }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Geführter Text: Satz für Satz, auf Wunsch vorgelesen
// ---------------------------------------------------------------------------

const speechAvailable = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

function pickVoice(lang: Lang): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  const prefix = lang === 'de' ? 'de' : 'en';
  return voices.find((v) => v.lang.toLowerCase().startsWith(prefix) && v.localService) ?? voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
}

/**
 * Liest geführte Texte Satz für Satz.
 *
 * Imaginationen wirken nur, wenn zwischen den Sätzen Zeit bleibt. Deshalb
 * erscheint jeder Satz einzeln; die empfohlene Pause steht klein darunter.
 * „Automatisch weiter“ wartet diese Pause ab – beim Vorlesen erst, nachdem
 * der Satz zu Ende gesprochen ist.
 */
export function GuidedPlayer({ lines, title }: { lines: GuidedLine[]; title?: string }) {
  const { t, lang } = useI18n();
  const f = useFill();
  const [shown, setShown] = useState(1);
  const [speak, setSpeak] = useState(false);
  const [auto, setAuto] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const current = lines[shown - 1];
  const done = shown >= lines.length;
  const listRef = useRef<HTMLOListElement>(null);

  // Beim Verlassen der Seite nichts weitersprechen lassen.
  useEffect(() => () => {
    if (speechAvailable()) window.speechSynthesis.cancel();
    window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    window.clearTimeout(timer.current);
    const advance = () => {
      if (!auto || done) return;
      timer.current = window.setTimeout(() => setShown((s) => Math.min(lines.length, s + 1)), (current?.pause ?? 4) * 1000);
    };
    if (speak && speechAvailable() && current) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(f(current.text));
      u.lang = lang === 'de' ? 'de-DE' : 'en-GB';
      u.rate = 0.88;
      const voice = pickVoice(lang);
      if (voice) u.voice = voice;
      u.onend = advance;
      window.speechSynthesis.speak(u);
    } else {
      advance();
    }
    return () => window.clearTimeout(timer.current);
    // `f` ändert sich bei jeder Eingabe; hier zählt nur der Satzwechsel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, speak, auto, lang]);

  useEffect(() => {
    const el = listRef.current?.lastElementChild as HTMLElement | null;
    if (shown > 1) el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [shown]);

  const stopSpeaking = () => {
    if (speechAvailable()) window.speechSynthesis.cancel();
    setSpeak(false);
  };

  return (
    <section className="guided" aria-label={title}>
      {title && <h3 className="guided__title">{title}</h3>}
      <ol className="guided__lines" ref={listRef} aria-live="polite">
        {lines.slice(0, shown).map((line, i) => (
          <li key={i} className={i === shown - 1 ? 'guided__line guided__line--current' : 'guided__line'}>
            {f(line.text)}
            {i === shown - 1 && line.pause && !done && <span className="guided__pause">{t('guidedPause', { n: line.pause })}</span>}
          </li>
        ))}
      </ol>
      {done && <p className="guided__done">{t('guidedDone')}</p>}
      <div className="guided__controls">
        {!done ? (
          <button type="button" className="btn btn--primary" onClick={() => setShown((s) => s + 1)}>
            {t('guidedNext')} <span aria-hidden="true">↓</span>
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => { stopSpeaking(); setAuto(false); setShown(1); }}>
            {t('guidedRestart')}
          </button>
        )}
        {!done && (
          <button type="button" className="btn btn--quiet" onClick={() => { stopSpeaking(); setAuto(false); setShown(lines.length); }}>
            {t('guidedAll')}
          </button>
        )}
        <label className="toggle">
          <input type="checkbox" checked={auto} onChange={(e) => setAuto(e.target.checked)} />
          {t('guidedAuto')}
        </label>
        {speechAvailable() && (
          <label className="toggle" title={t('guidedReadNote')}>
            <input type="checkbox" checked={speak} onChange={(e) => (e.target.checked ? setSpeak(true) : stopSpeaking())} />
            {t('guidedRead')}
          </label>
        )}
      </div>
      {speak && <p className="guided__note">{t('guidedReadNote')}</p>}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Atemkreis: 4 Sekunden ein, 6 Sekunden aus
// ---------------------------------------------------------------------------

export function Breath() {
  const { t } = useI18n();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<'in' | 'out'>('in');

  useEffect(() => {
    if (!running) return;
    let current: 'in' | 'out' = 'in';
    let id = 0;
    const tick = () => {
      current = current === 'in' ? 'out' : 'in';
      setPhase(current);
      id = window.setTimeout(tick, current === 'in' ? 4000 : 6000);
    };
    id = window.setTimeout(tick, 4000);
    return () => window.clearTimeout(id);
  }, [running]);

  return (
    <div className="breath">
      <div className={`breath__circle${running ? ` breath__circle--${phase}` : ''}`} aria-hidden="true" />
      <p className="breath__label" aria-live="polite">
        {running ? (phase === 'in' ? t('breathIn') : t('breathOut')) : ' '}
      </p>
      <button
        type="button"
        className="btn btn--small"
        onClick={() => {
          setPhase('in');
          setRunning((r) => !r);
        }}
      >
        {running ? t('breathStop') : t('breathStart')}
      </button>
    </div>
  );
}
