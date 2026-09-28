import { useEffect, useMemo } from 'react';
import type { BeliefId, Path, ProtectorId } from '../data/types';
import { PATHS } from '../data/types';
import type { Special, Step } from '../data/steps';
import { phasesFor, estimateMinutes, visibleSteps } from '../engine/flow';
import { needs, needById } from '../data/needs';
import { beliefs, beliefById } from '../data/beliefs';
import { protectors, protectorById } from '../data/protectors';
import { lovedQuestion, questionById, triggersQuestion, concernQuestion } from '../data/questions';
import { computeProfile, NEED_THRESHOLD, suggestedBeliefs, topNeeds, topProtectors, type Reason } from '../engine/profile';
import { choice, selectedBeliefs } from '../engine/session';
import { recommendPath, roundFive } from '../engine/path';
import {
  careReasons,
  chosenSentences,
  focusNeeds,
  IF_THEN_ACTIONS,
  ifThenText,
  letterDraft,
  MAX_SENTENCES,
  rescriptLines,
  sentenceOptions,
  speakLines,
  weekPlan,
} from '../engine/compose';
import { textContext } from '../engine/text';
import { useI18n } from '../i18n';
import { useSession } from '../state/session';
import { Callout, Link, Meter, useFill, Voice } from './common';
import { GuidedPlayer } from './blocks';
import { usePause } from './Pause';
import { CrisisLines } from './CrisisLines';

export function SpecialBlock({ name, step }: { name: Special; step: Step }) {
  switch (name) {
    case 'crisis': return <Crisis />;
    case 'pathChoice': return <PathChoice />;
    case 'overview': return <Overview />;
    case 'needsList': return <NeedsList />;
    case 'traumaNotice': return <TraumaNotice />;
    case 'mirror': return <Mirror />;
    case 'beliefPick': return <BeliefPick />;
    case 'beliefRateBefore': return <BeliefRate when="before" />;
    case 'beliefRateAfter': return <BeliefRate when="after" />;
    case 'distressCheck': return <DistressCheck valueId={step.id === 'b-intro' ? 'sudPre' : 'sudImagery'} />;
    case 'situationCheck': return <SituationCheck />;
    case 'childNeedHint': return <ChildNeedHint />;
    case 'rescript': return <Rescript />;
    case 'sentences': return <Sentences />;
    case 'speak': return <Speak />;
    case 'protector': return <ProtectorDialog />;
    case 'newBeliefs': return <NewBeliefs />;
    case 'letter': return <Letter />;
    case 'plan': return <Plan />;
    case 'compare': return <Compare />;
    case 'appreciation': return <Appreciation />;
    case 'breakPoint': return <BreakPoint />;
  }
}

// ---------------------------------------------------------------------------
// Vorgespräch
// ---------------------------------------------------------------------------

function Crisis() {
  const { lang } = useI18n();
  const de = lang === 'de';
  return (
    <div className="stack">
      <Callout tone="critical" title={de ? 'Danke, dass du es sagst. Jetzt geht deine Sicherheit vor.' : 'Thank you for telling me. Your safety comes first now.'}>
        <p>
          {de
            ? 'Wenn du gerade daran denkst, dir etwas anzutun, ist das kein Moment für Erinnerungsarbeit – sondern dafür, nicht allein zu bleiben. Diese Gedanken sind ein Zeichen für sehr großen Schmerz, und sie können vorübergehen. Bitte ruf jetzt eine der Nummern an oder sprich mit einem Menschen in deiner Nähe. Bei akuter Gefahr: 112.'
            : 'If you are thinking about harming yourself right now, this is not a moment for memory work — it is a moment not to be alone. These thoughts are a sign of very great pain, and they can pass. Please call one of the numbers now or talk to someone near you. In acute danger, call your local emergency number (112 in the EU, 911 in the US).'}
        </p>
      </Callout>
      <CrisisLines compact />
      <div className="row">
        <Link to={{ name: 'help' }} className="btn btn--primary">
          {de ? 'Alle Hilfsangebote' : 'All sources of help'}
        </Link>
        <Link to={{ name: 'exercise', id: 'atem' }} className="btn">
          {de ? 'Eine Beruhigungsübung machen' : 'Do a calming exercise'}
        </Link>
      </div>
      <p className="muted small">
        {de
          ? 'Die Sitzung pausiert hier. Wenn es dir später wieder sicherer geht, kannst du deine Antwort ändern und weitermachen – am besten auf dem sanften Weg.'
          : 'The session pauses here. When you feel safer later, you can change your answer and continue — ideally on the gentle path.'}
      </p>
    </div>
  );
}

function PathChoice() {
  const { t, lang } = useI18n();
  const { data, setPath } = useSession();
  const rec = recommendPath(data);

  // Ohne ausdrückliche Wahl gilt der Vorschlag – so läuft „Weiter“ nie ins Leere.
  useEffect(() => {
    if (!data.pathChosen && data.path !== rec.path) setPath(rec.path, false);
  }, [data.pathChosen, data.path, rec.path, setPath]);

  const labels: Record<Path, [string, string]> = {
    gentle: [t('pathGentle'), t('pathGentleDesc')],
    standard: [t('pathStandard'), t('pathStandardDesc')],
    deep: [t('pathDeep'), t('pathDeepDesc')],
  };

  return (
    <div className="stack">
      <Voice>
        <p>{lang === 'de' ? 'Danke für deine Antworten. Mein Vorschlag:' : 'Thank you for your answers. My suggestion:'} <strong>{labels[rec.path][0]}</strong>.</p>
        <ul>
          {rec.reasons.map((r) => (
            <li key={r.de}>{r[lang]}</li>
          ))}
        </ul>
      </Voice>
      <div className="grid grid--3">
        {PATHS.map((p) => {
          const active = data.path === p;
          return (
            <article key={p} className={`card path-card${active ? ' path-card--active' : ''}`}>
              <div className="row row--between">
                <h3 className="card__title">{labels[p][0]}</h3>
                <span className="chip">{t('aboutMinutes', { n: roundFive(estimateMinutes(p, data)) })}</span>
              </div>
              {p === rec.path && <span className="chip chip--accent">{t('pathRecommended')}</span>}
              <p className="muted small">{labels[p][1]}</p>
              <button type="button" className={`btn btn--small${active ? ' btn--primary' : ''}`} aria-pressed={active} onClick={() => setPath(p, true)}>
                {active ? t('pathChosen') : t('pathChoose')}
              </button>
            </article>
          );
        })}
      </div>
      <p className="muted small">{t('pathSwitchNote')}</p>
    </div>
  );
}

function Overview() {
  const { lang, t } = useI18n();
  const { data } = useSession();
  const list = visibleSteps(data);
  return (
    <ol className="overview">
      {phasesFor(data).map((p) => {
        const minutes = list.filter((s) => s.phase === p.id).reduce((sum, s) => sum + s.minutes, 0);
        return (
          <li key={p.id}>
            <span>{p.title[lang]}</span>
            <span className="muted small">{t('minutesShort', { n: minutes })}</span>
          </li>
        );
      })}
    </ol>
  );
}

function NeedsList() {
  const f = useFill();
  return (
    <ul className="needs-list">
      {needs.map((n) => (
        <li key={n.id} className="card card--flat">
          <strong>{f(n.name)}</strong>
          <span className="muted">{f(n.childVoice)}</span>
          <details className="explainer">
            <summary>{f({ de: 'Mehr dazu', en: 'More' })}</summary>
            <div>
              <p>{f(n.description)}</p>
              <p>
                <em>{f({ de: 'Wenn es zu kurz kam, zeigt sich das oft so: ', en: 'When it was missing, it often shows like this: ' })}</em>
                {f(n.signs)}
              </p>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}

function TraumaNotice() {
  const { lang } = useI18n();
  const { data, soften } = useSession();
  const de = lang === 'de';
  return (
    <Callout tone="warning" title={de ? 'Was du angekreuzt hast, wiegt schwer' : 'What you ticked weighs heavily'}>
      <p>
        {de
          ? 'Dass du es hier benennst, braucht Mut. Solche Erfahrungen verdienen die Begleitung durch eine traumatherapeutisch ausgebildete Fachperson. Diese Sitzung kann dir Halt, Mitgefühl und neue Sätze geben – die Erinnerung an die Gewalt selbst bearbeiten wir hier bewusst nicht. Wenn bei der Begegnung eine solche Szene auftaucht: Lass sie weiterziehen und bleib am sicheren Ort.'
          : 'It takes courage to name this here. Experiences like these deserve the support of a trauma-trained professional. This session can give you support, compassion and new beliefs — but we deliberately do not work with the memory of the violence itself here. If such a scene comes up during the meeting: let it pass and stay at your safe place.'}
      </p>
      {data.path !== 'gentle' && (
        <p>
          <button type="button" className="btn btn--small" onClick={soften}>
            {de ? 'Auf den sanften Weg wechseln (empfohlen)' : 'Switch to the gentle path (recommended)'}
          </button>
        </p>
      )}
    </Callout>
  );
}

// ---------------------------------------------------------------------------
// Spiegelung
// ---------------------------------------------------------------------------

function ReasonList({ reasons }: { reasons: Reason[] }) {
  const { lang } = useI18n();
  const items = reasons
    .filter((r) => r.points > 0)
    .map((r) => {
      if (r.questionId === 'critic') return lang === 'de' ? `Deine innere kritische Stimme ist laut (${r.optionId} von 10)` : `Your inner critic is loud (${r.optionId} out of 10)`;
      const q = questionById.get(r.questionId);
      const o = q?.options.find((x) => x.id === r.optionId);
      return o ? o.label[lang] : null;
    })
    .filter((x): x is string => Boolean(x));
  const unique = [...new Set(items)];
  if (unique.length === 0) return null;
  return (
    <details className="explainer">
      <summary>{lang === 'de' ? 'Weil du angegeben hast …' : 'Because you said …'}</summary>
      <div>
        <ul>
          {unique.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </div>
    </details>
  );
}

function Mirror() {
  const { lang } = useI18n();
  const f = useFill();
  const { data } = useSession();
  const profile = useMemo(() => computeProfile(data), [data]);
  const de = lang === 'de';
  const needIds = topNeeds(profile, 3);
  const strongNeeds = profile.needs.filter((n) => needIds.includes(n.id));
  const maxNeed = Math.max(10, ...profile.needs.map((n) => n.score));
  const beliefIds = suggestedBeliefs(profile, 5);
  const protIds = topProtectors(profile, 3);
  const concerns = (data.choices.concern ?? []).map((id) => concernQuestion.options.find((o) => o.id === id)?.label[lang]).filter(Boolean);

  return (
    <div className="stack stack-lg mirror">
      {concerns.length > 0 && (
        <Voice>
          <p>
            {de ? 'Du bist mit diesem Anliegen gekommen: ' : 'You came with this concern: '}
            <em>{concerns.join(' · ')}</em>.{' '}
            {de ? 'Schauen wir, was deine Antworten dazu erzählen.' : 'Let us see what your answers say about it.'}
          </p>
        </Voice>
      )}

      <section>
        <h3>{de ? 'Bedürfnisse, die zu kurz gekommen sein könnten' : 'Needs that may have gone unmet'}</h3>
        {strongNeeds.length === 0 ? (
          <p className="muted">
            {de
              ? 'Deine Antworten zeigen wenig Hinweise auf Mangel – vielleicht hattest du vieles von dem, was ein Kind braucht, oder die Erinnerung ist blass. Beides ist in Ordnung. Wir arbeiten mit dem, was sich heute zeigt.'
              : 'Your answers show few signs of lack — perhaps you had much of what a child needs, or the memories are faint. Both are fine. We will work with what shows up today.'}
          </p>
        ) : (
          <div className="stack">
            {strongNeeds.map((n) => {
              const need = needById.get(n.id)!;
              return (
                <div key={n.id} className="card card--flat stack stack-sm">
                  <Meter label={f(need.name)} value={n.score} max={maxNeed} />
                  <p className="muted small">{f(need.childVoice)}</p>
                  <p className="small">{f(need.signs)}</p>
                  <ReasonList reasons={n.reasons} />
                </div>
              );
            })}
          </div>
        )}
        {strongNeeds.some((n) => n.score >= NEED_THRESHOLD * 3) && (
          <p className="muted small">
            {de
              ? 'Ein langer Balken heißt nicht „schlimm“, sondern „mehrere deiner Antworten zeigen in diese Richtung“.'
              : 'A long bar does not mean “bad” but “several of your answers point this way”.'}
          </p>
        )}
      </section>

      <section>
        <h3>{de ? 'Sätze, die in dir wirken könnten' : 'Beliefs that may be at work in you'}</h3>
        {beliefIds.length === 0 ? (
          <p className="muted">{de ? 'Keine Sätze stechen deutlich heraus. Im nächsten Schritt kannst du trotzdem alle ansehen.' : 'No beliefs stand out clearly. You can still look at all of them in the next step.'}</p>
        ) : (
          <ul className="belief-list">
            {beliefIds.map((id) => {
              const b = beliefById.get(id)!;
              const scored = profile.beliefs.find((x) => x.id === id)!;
              return (
                <li key={id} className="card card--flat">
                  <p className="belief-quote">„{f(b.text)}“</p>
                  <p className="small muted">{f(b.feels)}</p>
                  <p className="small">{f(b.origin)}</p>
                  <ReasonList reasons={scored.reasons} />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section>
        <h3>{de ? 'Deine Beschützer' : 'Your protectors'}</h3>
        {protIds.length === 0 ? (
          <p className="muted">{de ? 'Hierzu hast du nichts angegeben.' : 'You did not indicate anything here.'}</p>
        ) : (
          <div className="grid grid--3">
            {protIds.map((id) => {
              const p = protectorById.get(id)!;
              return (
                <article key={id} className="card card--flat stack stack-sm">
                  <strong>{f(p.name)}</strong>
                  <p className="small muted">„{f(p.voice)}“</p>
                  <p className="small">
                    <em>{de ? 'Schützt dich ' : 'Protects you '}</em>
                    {f(p.protects)}.
                  </p>
                  <p className="small">
                    <em>{de ? 'Kostet dich: ' : 'Costs you: '}</em>
                    {f(p.cost)}.
                  </p>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Voice>
        <p>
          {de
            ? 'Vielleicht erkennst du darin ein Muster: Was damals gefehlt hat, hat zu Schlüssen über dich selbst geführt, und die Beschützer sorgen seither dafür, dass diese Schlüsse nicht wehtun. Das ist keine Schwäche – es ist die Geschichte eines Kindes, das klug überlebt hat.'
            : 'Perhaps you recognise a pattern here: what was missing back then led to conclusions about yourself, and ever since the protectors have made sure these conclusions don’t hurt. That is not weakness — it is the story of a child who survived cleverly.'}
        </p>
      </Voice>
    </div>
  );
}

const MAX_BELIEFS = 3;

function BeliefPick() {
  const { t } = useI18n();
  const f = useFill();
  const { data, setChoice } = useSession();
  const profile = useMemo(() => computeProfile(data), [data]);
  const suggested = suggestedBeliefs(profile, 5);
  const ordered = [...suggested.map((id) => beliefById.get(id)!), ...beliefs.filter((b) => !suggested.includes(b.id))];
  const picked = selectedBeliefs(data);

  const toggle = (id: BeliefId) => {
    if (picked.includes(id)) setChoice('beliefs', picked.filter((p) => p !== id));
    else if (picked.length < MAX_BELIEFS) setChoice('beliefs', [...picked, id]);
  };

  return (
    <div className="answers">
      {ordered.map((b) => {
        const on = picked.includes(b.id);
        return (
          <button key={b.id} type="button" className="answer" aria-pressed={on} disabled={!on && picked.length >= MAX_BELIEFS} onClick={() => toggle(b.id)}>
            <span className="answer__box answer__box--check" aria-hidden="true" />
            <span>
              <span className="answer__label">
                {f(b.text)} {suggested.includes(b.id) && <span className="chip chip--accent">{t('suggested')}</span>}
              </span>
              <span className="answer__hint">{f(b.feels)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PercentRow({ id, label }: { id: string; label: string }) {
  const { data, setValue } = useSession();
  const current = data.values[id];
  return (
    <div className="scale">
      <p className="question__title">{label}</p>
      <div className="scale__row" role="radiogroup" aria-label={label}>
        {Array.from({ length: 11 }, (_, i) => i * 10).map((n) => (
          <button key={n} type="button" role="radio" aria-checked={current === n} className="scale__dot scale__dot--wide" onClick={() => setValue(id, current === n ? undefined : n)}>
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

function BeliefRate({ when }: { when: 'before' | 'after' }) {
  const { lang } = useI18n();
  const f = useFill();
  const { data } = useSession();
  const picked = selectedBeliefs(data);
  if (picked.length === 0) return null;
  const de = lang === 'de';
  return (
    <div className="stack">
      <p>
        {when === 'before'
          ? de ? 'Wie wahr fühlt sich jeder Satz an – gefühlsmäßig, in Prozent?' : 'How true does each sentence feel — emotionally, in per cent?'
          : de ? 'Und wie wahr fühlen sich die alten Sätze jetzt an?' : 'And how true do the old beliefs feel now?'}
      </p>
      {picked.map((id) => (
        <div key={id}>
          <PercentRow id={`belief.${id}.${when}`} label={`„${f(beliefById.get(id)!.text)}“`} />
          {when === 'after' && typeof data.values[`belief.${id}.before`] === 'number' && (
            <p className="muted small">
              {de ? 'Vorher: ' : 'Before: '}
              {data.values[`belief.${id}.before`]} %
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Begegnung
// ---------------------------------------------------------------------------

function DistressCheck({ valueId }: { valueId: string }) {
  const { lang } = useI18n();
  const { data, soften } = useSession();
  const { open } = usePause();
  const v = data.values[valueId];
  const de = lang === 'de';
  if (typeof v !== 'number' || v < 6) return null;
  if (v < 8) {
    return (
      <Voice>
        <p>
          {de
            ? 'Das ist eine spürbare Belastung. Du kannst weitergehen – achte dabei gut auf dich. Wenn es mehr wird, ist der Pause-Knopf da.'
            : 'That is noticeable distress. You can continue — just take good care of yourself. If it increases, the pause button is there.'}
        </p>
      </Voice>
    );
  }
  return (
    <Callout tone="warning" title={de ? 'Das ist gerade sehr viel' : 'This is a lot right now'}>
      <p>
        {de
          ? `Bei ${v} von 10 würde eine Therapeutin jetzt nicht vertiefen, sondern erst einmal für Halt sorgen. Das ist kein Rückschritt: Außerhalb deines Toleranzfensters kann das Gehirn nichts Neues abspeichern – es geht dann nur ums Überstehen.`
          : `At ${v} out of 10, a therapist would not go deeper now but first make sure you feel held. That is not a step back: outside your window of tolerance the brain cannot store anything new — it is only about getting through.`}
      </p>
      <div className="row">
        <button type="button" className="btn btn--primary btn--small" onClick={open}>
          {de ? 'Erst stabilisieren' : 'Stabilise first'}
        </button>
        {data.path !== 'gentle' && (
          <button type="button" className="btn btn--small" onClick={soften}>
            {de ? 'Auf den sanften Weg wechseln' : 'Switch to the gentle path'}
          </button>
        )}
      </div>
      <p className="small muted">
        {de ? 'Du kannst auch bewusst weitergehen. Du kennst dich am besten.' : 'You can also consciously continue. You know yourself best.'}
      </p>
    </Callout>
  );
}

function SituationCheck() {
  const { lang } = useI18n();
  const { data, setChoice } = useSession();
  const v = data.values.situationSud;
  const de = lang === 'de';
  if (typeof v !== 'number') return null;
  if (v <= 2) {
    return (
      <Voice>
        <p>
          {de
            ? 'Das ist eher leicht. Das kann funktionieren – manchmal braucht die Gefühlsbrücke aber etwas mehr Gefühl. Wenn dir eine etwas stärkere Situation einfällt, nimm gern die.'
            : 'That is fairly mild. It can work — but sometimes the affect bridge needs a bit more feeling. If a slightly stronger situation comes to mind, feel free to use that one.'}
        </p>
      </Voice>
    );
  }
  if (v < 7) {
    return (
      <Voice>
        <p>{de ? 'Gut gewählt – genau das richtige Gewicht zum Üben.' : 'Well chosen — just the right weight to practise with.'}</p>
      </Voice>
    );
  }
  return (
    <Callout tone="warning" title={de ? 'Das ist ziemlich viel für den Anfang' : 'That is quite a lot to start with'}>
      <p>
        {de
          ? 'Wähle lieber eine mildere Situation – oder begegne dem Kind über ein Foto oder an deinem sicheren Ort. Wer mit dem schwersten Gewicht anfängt, verletzt sich eher, als dass er stärker wird.'
          : 'Better choose a milder situation — or meet the child through a photo or at your safe place. Starting with the heaviest weight is more likely to injure than to strengthen.'}
      </p>
      <div className="row">
        <button type="button" className="btn btn--small" onClick={() => setChoice('entry', ['safeplace'])}>
          {de ? 'Am sicheren Ort begegnen' : 'Meet at the safe place'}
        </button>
        <button type="button" className="btn btn--small" onClick={() => setChoice('entry', ['photo'])}>
          {de ? 'Über ein Foto begegnen' : 'Meet through a photo'}
        </button>
      </div>
    </Callout>
  );
}

function ChildNeedHint() {
  const { lang } = useI18n();
  const f = useFill();
  const { data } = useSession();
  const profile = useMemo(() => computeProfile(data), [data]);
  const top = topNeeds(profile, 2).map((id) => f(needById.get(id)!.name));
  if (top.length === 0) return null;
  const text =
    lang === 'de'
      ? `Aus deiner Spurensuche: Vielleicht hat {kindDat} vor allem ${top.join(' und ')} gefehlt. Vertrau aber dem, was du jetzt in der Szene wahrnimmst.`
      : `From tracing back: perhaps what {kind} lacked most was ${top.join(' and ').toLowerCase()}. But trust what you perceive in the scene now.`;
  return (
    <Voice>
      <p>{f({ de: text, en: text })}</p>
    </Voice>
  );
}

function Rescript() {
  const { lang } = useI18n();
  const { data } = useSession();
  const lines = useMemo(() => rescriptLines(data), [data]);
  return (
    <div className="stack">
      <p>
        {lang === 'de'
          ? 'Nimm dir für diesen Teil besonders viel Zeit. Lies jeden Satz, schließ die Augen und lass das Bild entstehen, bevor du weitergehst.'
          : 'Take particular time over this part. Read each sentence, close your eyes and let the image form before you move on.'}
      </p>
      <GuidedPlayer lines={lines} />
    </div>
  );
}

function Sentences() {
  const { t, lang } = useI18n();
  const f = useFill();
  const { data, setChoice, setText } = useSession();
  const options = useMemo(() => sentenceOptions(data), [data]);
  const picked = data.choices.sentences ?? [];
  const toggle = (id: string) => {
    if (picked.includes(id)) setChoice('sentences', picked.filter((p) => p !== id));
    else if (picked.length < MAX_SENTENCES) setChoice('sentences', [...picked, id]);
  };
  return (
    <div className="stack">
      <p className="muted small">{t('chooseUpTo', { n: MAX_SENTENCES })}</p>
      <div className="answers">
        {options.map((o) => {
          const on = picked.includes(o.id);
          const sourceName = o.from === 'belief' ? `„${f(beliefById.get(o.sourceId as BeliefId)!.text)}“` : f(needById.get(o.sourceId as never)!.name);
          return (
            <button key={o.id} type="button" className="answer" aria-pressed={on} disabled={!on && picked.length >= MAX_SENTENCES} onClick={() => toggle(o.id)}>
              <span className="answer__box answer__box--check" aria-hidden="true" />
              <span>
                <span className="answer__label">{f(o.text)}</span>
                <span className="answer__hint">
                  {o.from === 'belief' ? (lang === 'de' ? 'gegen ' : 'against ') : lang === 'de' ? 'für ' : 'for '}
                  {sourceName}
                </span>
              </span>
            </button>
          );
        })}
      </div>
      <div className="field">
        <label className="field__label" htmlFor="own-sentence">
          {lang === 'de' ? 'Ein eigener Satz – so, wie du ihn sagen würdest:' : 'A sentence of your own — the way you would say it:'}
        </label>
        <input id="own-sentence" type="text" value={data.texts.ownSentence ?? ''} onChange={(e) => setText('ownSentence', e.target.value)} autoComplete="off" />
      </div>
    </div>
  );
}

function Speak() {
  const { lang } = useI18n();
  const { data } = useSession();
  const lines = useMemo(() => speakLines(data, lang), [data, lang]);
  return (
    <div className="stack">
      <p>
        {lang === 'de'
          ? 'Wenn du allein bist, sag die Sätze laut. Die eigene Stimme zu hören, wirkt stärker als stilles Lesen – auch wenn es sich anfangs seltsam anfühlt.'
          : 'If you are alone, say the sentences aloud. Hearing your own voice is more powerful than silent reading — even if it feels strange at first.'}
      </p>
      <GuidedPlayer lines={lines} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Beschützer
// ---------------------------------------------------------------------------

function ProtectorDialog() {
  const { lang, t } = useI18n();
  const f = useFill();
  const { data, setChoice } = useSession();
  const profile = useMemo(() => computeProfile(data), [data]);
  const suggested = topProtectors(profile, 3);
  const chosenId = (choice(data, 'protector') as ProtectorId | undefined) ?? suggested[0] ?? 'perfektion';
  const p = protectorById.get(chosenId)!;
  const de = lang === 'de';

  const lines = useMemo(() => {
    const name = p.name[lang];
    return [
      { text: { de: `Denk an eine Situation, in der „${name}“ bei dir angesprungen ist. Nichts Großes – ein gewöhnlicher Moment.`, en: `Think of a situation in which “${name}” kicked in for you. Nothing big — an ordinary moment.` }, pause: 10 },
      { text: { de: 'Stell dir diesen Beschützer als eigene Gestalt vor. Wie sieht sie aus? Wie alt wirkt sie? Wie weit steht sie von dir weg?', en: 'Imagine this protector as a figure of its own. What does it look like? How old does it seem? How far away from you is it standing?' }, pause: 12 },
      { text: { de: `Hör, was sie sagt. Vielleicht so etwas wie: „${p.voice.de}“`, en: `Listen to what it says. Perhaps something like: “${p.voice.en}”` }, pause: 10 },
      { text: { de: `Frag sie: „Wovor willst du mich schützen?“ Vielleicht ${p.protects.de}.`, en: `Ask it: “What do you want to protect me from?” Perhaps ${p.protects.en}.` }, pause: 12 },
      { text: { de: 'Frag: „Was befürchtest du, würde passieren, wenn du aufhörst?“ Hör in Ruhe zu.', en: 'Ask: “What are you afraid would happen if you stopped?” Listen calmly.' }, pause: 15 },
      { text: { de: 'Frag auch: „Wie alt glaubst du, dass ich bin?“ Viele Beschützer halten uns noch für das Kind von damals.', en: 'Ask too: “How old do you think I am?” Many protectors still take us for the child from back then.' }, pause: 10 },
      { text: { de: 'Zeig ihr, wie alt du heute bist, was du kannst und was du schon überstanden hast.', en: 'Show it how old you are today, what you can do and what you have already survived.' }, pause: 10 },
      { text: { de: `Nimm wahr, was dieser Schutz dich heute kostet: ${p.cost.de}.`, en: `Notice what this protection costs you today: ${p.cost.en}.` }, pause: 8 },
      { text: { de: `Sag ihr: „${p.thanks.de}“`, en: `Tell it: “${p.thanks.en}”` }, pause: 8 },
      { text: { de: `Mach ihr ein Angebot: „${p.offer.de}“`, en: `Make it an offer: “${p.offer.en}”` }, pause: 10 },
      { text: { de: 'Beobachte, wie sie reagiert. Du musst nichts erzwingen.', en: 'Watch how it responds. You don’t have to force anything.' }, pause: 12 },
    ];
  }, [p, lang]);

  return (
    <div className="stack">
      <p className="question__title">{de ? 'Mit welchem Beschützer möchtest du sprechen?' : 'Which protector would you like to talk to?'}</p>
      <div className="answers answers--inline">
        {[...suggested, ...protectors.map((x) => x.id).filter((id) => !suggested.includes(id))].map((id) => (
          <button key={id} type="button" className="answer answer--compact" aria-pressed={id === chosenId} onClick={() => setChoice('protector', [id])}>
            <span className="answer__box answer__box--radio" aria-hidden="true" />
            <span className="answer__label">
              {f(protectorById.get(id)!.name)} {suggested.includes(id) && <span className="chip chip--accent">{t('suggested')}</span>}
            </span>
          </button>
        ))}
      </div>
      <article className="card card--flat stack stack-sm">
        <strong>{f(p.name)}</strong>
        <p className="muted">„{f(p.voice)}“</p>
      </article>
      <GuidedPlayer key={chosenId} lines={lines} />
      <ProtectorNotes alternative={f(p.alternative)} />
    </div>
  );
}

function ProtectorNotes({ alternative }: { alternative: string }) {
  const { lang } = useI18n();
  const { data, setText } = useSession();
  const de = lang === 'de';
  return (
    <div className="stack">
      <div className="field">
        <label className="field__label" htmlFor="protector-fear">
          {de ? 'Was befürchtet dein Beschützer?' : 'What is your protector afraid of?'}
        </label>
        <textarea id="protector-fear" rows={2} value={data.texts.protectorFear ?? ''} onChange={(e) => setText('protectorFear', e.target.value)} />
      </div>
      <Callout tone="positive" title={de ? 'Eine kleine Alternative für den Alltag' : 'A small alternative for everyday life'}>
        <p>{alternative}</p>
      </Callout>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Neue Sätze, Brief, Plan
// ---------------------------------------------------------------------------

function NewBeliefs() {
  const { lang } = useI18n();
  const f = useFill();
  const { data, setChoice, setText } = useSession();
  const profile = useMemo(() => computeProfile(data), [data]);
  const picked = selectedBeliefs(data);
  const list = picked.length > 0 ? picked : suggestedBeliefs(profile, 2);
  const de = lang === 'de';

  if (list.length === 0) {
    return (
      <div className="field">
        <label className="field__label" htmlFor="nb-free">
          {de ? 'Welcher Satz soll dich in Zukunft begleiten?' : 'Which sentence should accompany you from now on?'}
        </label>
        <input id="nb-free" type="text" value={data.texts['newBelief.free'] ?? ''} onChange={(e) => setText('newBelief.free', e.target.value)} />
      </div>
    );
  }

  return (
    <div className="stack stack-lg">
      {list.map((id) => {
        const b = beliefById.get(id)!;
        const pickKey = `newBeliefPick.${id}`;
        const chosen = choice(data, pickKey);
        return (
          <section key={id} className="card card--flat stack">
            <p className="belief-old">
              <span className="muted small">{de ? 'Alt: ' : 'Old: '}</span>„{f(b.text)}“
            </p>
            <div className="answers">
              {b.counters.map((c, i) => (
                <button key={i} type="button" className="answer" aria-pressed={chosen === String(i)} onClick={() => setChoice(pickKey, chosen === String(i) ? [] : [String(i)])}>
                  <span className="answer__box answer__box--radio" aria-hidden="true" />
                  <span className="answer__label">{f(c)}</span>
                </button>
              ))}
            </div>
            <div className="field">
              <label className="field__label" htmlFor={`nb-${id}`}>
                {de ? 'Oder in deinen eigenen Worten:' : 'Or in your own words:'}
              </label>
              <input id={`nb-${id}`} type="text" value={data.texts[`newBelief.${id}`] ?? ''} onChange={(e) => setText(`newBelief.${id}`, e.target.value)} />
            </div>
            <PercentRow id={`newBelief.${id}.rating`} label={de ? 'Wie sehr kannst du den neuen Satz jetzt schon glauben?' : 'How much can you already believe the new sentence?'} />
            {data.path === 'deep' && (
              <div className="field">
                <label className="field__label" htmlFor={`ev-${id}`}>
                  {de ? 'Drei Erfahrungen – auch kleine –, die für den neuen Satz sprechen:' : 'Three experiences — even small ones — that support the new sentence:'}
                </label>
                <textarea id={`ev-${id}`} rows={3} value={data.texts[`evidence.${id}`] ?? ''} onChange={(e) => setText(`evidence.${id}`, e.target.value)} />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function Letter() {
  const { lang } = useI18n();
  const { data, setText } = useSession();
  const de = lang === 'de';
  const draft = () => letterDraft(data, lang, textContext(data, lang));

  useEffect(() => {
    if (data.texts.letter === undefined) setText('letter', draft());
    // Nur beim ersten Öffnen einen Entwurf anlegen; danach gehört der Text dir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="stack">
      <textarea className="letter" rows={18} value={data.texts.letter ?? ''} onChange={(e) => setText('letter', e.target.value)} aria-label={de ? 'Brief an das Kind' : 'Letter to the child'} />
      <div className="row">
        <button type="button" className="btn btn--small btn--quiet" onClick={() => setText('letter', draft())}>
          {de ? 'Entwurf neu erzeugen (überschreibt deine Änderungen)' : 'Regenerate draft (overwrites your changes)'}
        </button>
      </div>
      <p className="muted small">
        {de
          ? 'Tipp: Schreib den Brief zusätzlich mit der Hand ab. Handschrift verlangsamt – und langsam kommt mehr an.'
          : 'Tip: also copy the letter out by hand. Handwriting slows you down — and slowly, more gets through.'}
      </p>
    </div>
  );
}

function Plan() {
  const { lang } = useI18n();
  const f = useFill();
  const { data, setChoice, setText } = useSession();
  const profile = useMemo(() => computeProfile(data), [data]);
  const de = lang === 'de';
  const triggerIds = data.choices.triggers?.length ? data.choices.triggers : triggersQuestion.options.map((o) => o.id);
  const planActions = data.choices.planActions ?? [];
  const loved = data.choices.loved?.length ? data.choices.loved : lovedQuestion.options.map((o) => o.id);
  const ifThen = ifThenText(data, lang, textContext(data, lang));

  return (
    <div className="stack stack-lg">
      <section className="stack">
        <h3>{de ? '1. Dein Wenn-dann-Plan' : '1. Your if-then plan'}</h3>
        <p className="muted small">
          {de
            ? 'Vorsätze scheitern oft genau in dem Moment, in dem es darauf ankommt. Ein fester Wenn-dann-Plan verdoppelt in Studien die Chance, dass du dich im entscheidenden Moment daran erinnerst (Gollwitzer & Sheeran 2006).'
            : 'Intentions often fail at exactly the moment that matters. In studies, a fixed if-then plan substantially increases the chance you remember it at the crucial moment (Gollwitzer & Sheeran 2006).'}
        </p>
        <label className="field__label" htmlFor="if-trigger">
          {de ? 'Wenn ich merke …' : 'When I notice …'}
        </label>
        <select id="if-trigger" value={choice(data, 'ifThenTrigger') ?? ''} onChange={(e) => setChoice('ifThenTrigger', e.target.value ? [e.target.value] : [])}>
          <option value="">{de ? '– Situation wählen –' : '— choose a situation —'}</option>
          {triggerIds.map((id) => {
            const o = triggersQuestion.options.find((x) => x.id === id);
            return o ? (
              <option key={id} value={id}>
                {o.label[lang]}
              </option>
            ) : null;
          })}
        </select>
        <p className="field__label">{de ? '… dann …' : '… then …'}</p>
        <div className="answers">
          {IF_THEN_ACTIONS.map((a) => (
            <button key={a.id} type="button" className="answer" aria-pressed={choice(data, 'ifThenAction') === a.id} onClick={() => setChoice('ifThenAction', choice(data, 'ifThenAction') === a.id ? [] : [a.id])}>
              <span className="answer__box answer__box--radio" aria-hidden="true" />
              <span className="answer__label">{f(a.text)}</span>
            </button>
          ))}
        </div>
        <input type="text" aria-label={de ? 'Eigene Handlung' : 'Your own action'} placeholder={de ? 'oder eigene Handlung …' : 'or your own action …'} value={data.texts.ifThenOwn ?? ''} onChange={(e) => setText('ifThenOwn', e.target.value)} />
        {ifThen && <Callout tone="positive"><p><strong>{ifThen}</strong></p></Callout>}
      </section>

      <section className="stack">
        <h3>{de ? '2. Kleine Schritte für deine Bedürfnisse' : '2. Small steps for your needs'}</h3>
        <p className="muted small">{de ? 'Wähle ein bis drei Dinge, die du dir in dieser Woche wirklich vornehmen willst.' : 'Choose one to three things you genuinely want to do this week.'}</p>
        {focusNeeds(data, profile, 3).map((needId) => {
          const need = needById.get(needId)!;
          return (
            <div key={needId} className="stack stack-sm">
              <p className="question__title">{f(need.name)}</p>
              <div className="answers">
                {need.actions.map((a, i) => {
                  const id = `need:${needId}:${i}`;
                  const on = planActions.includes(id);
                  return (
                    <button key={id} type="button" className="answer" aria-pressed={on} onClick={() => setChoice('planActions', on ? planActions.filter((x) => x !== id) : [...planActions, id])}>
                      <span className="answer__box answer__box--check" aria-hidden="true" />
                      <span className="answer__label">{f(a)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      <section className="stack">
        <h3>{de ? '3. Spielzeit für dein Sonnenkind' : '3. Playtime for your sunshine child'}</h3>
        <div className="answers">
          {loved.map((id) => {
            const o = lovedQuestion.options.find((x) => x.id === id)!;
            const on = choice(data, 'planPlay') === id;
            return (
              <button key={id} type="button" className="answer" aria-pressed={on} onClick={() => setChoice('planPlay', on ? [] : [id])}>
                <span className="answer__box answer__box--radio" aria-hidden="true" />
                <span>
                  <span className="answer__label">{f(o.response)}</span>
                  <span className="answer__hint">{f(o.label)}</span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="stack">
        <h3>{de ? 'Deine Woche' : 'Your week'}</h3>
        <WeekPlan />
      </section>
    </div>
  );
}

export function WeekPlan({ interactive = true }: { interactive?: boolean }) {
  const { lang } = useI18n();
  const f = useFill();
  const { data, toggleDone } = useSession();
  const plan = weekPlan(data);
  return (
    <ol className="week">
      {plan.map((d) => (
        <li key={d.day} className="week__day">
          <span className="week__label">{lang === 'de' ? `Tag ${d.day}` : `Day ${d.day}`}</span>
          <ul>
            {d.items.map((item) => (
              <li key={item.id}>
                {interactive ? (
                  <label className="toggle">
                    <input type="checkbox" checked={data.done.includes(item.id)} onChange={() => toggleDone(item.id)} />
                    {f(item.text)}
                  </label>
                ) : (
                  <>☐ {f(item.text)}</>
                )}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );
}

// ---------------------------------------------------------------------------
// Abschluss
// ---------------------------------------------------------------------------

export function Compare() {
  const { lang } = useI18n();
  const f = useFill();
  const { data } = useSession();
  const de = lang === 'de';
  const rows: { label: string; before?: number; after?: number; max: number; lowerIsBetter?: boolean; unit?: string }[] = [
    { label: de ? 'Befinden' : 'Wellbeing', before: data.values.moodBefore, after: data.values.moodAfter, max: 10 },
    { label: de ? 'Belastung' : 'Distress', before: data.values.sudBefore, after: data.values.sudAfter, max: 10, lowerIsBetter: true },
    ...selectedBeliefs(data).map((id) => ({
      label: `„${f(beliefById.get(id)!.text)}“`,
      before: data.values[`belief.${id}.before`],
      after: data.values[`belief.${id}.after`],
      max: 100,
      lowerIsBetter: true,
      unit: ' %',
    })),
  ];
  const shown = rows.filter((r) => typeof r.before === 'number' && typeof r.after === 'number');
  if (shown.length === 0) return null;
  const better = shown.filter((r) => (r.lowerIsBetter ? r.after! < r.before! : r.after! > r.before!)).length;

  return (
    <div className="stack">
      <h3>{de ? 'Vorher und nachher' : 'Before and after'}</h3>
      <div className="compare">
        {shown.map((r) => (
          <div key={r.label} className="compare__row">
            <p className="compare__label">{r.label}</p>
            <Meter label={de ? 'vorher' : 'before'} value={r.before!} max={r.max} muted suffix={`${r.before}${r.unit ?? ''}`} />
            <Meter label={de ? 'jetzt' : 'now'} value={r.after!} max={r.max} suffix={`${r.after}${r.unit ?? ''}`} />
          </div>
        ))}
      </div>
      <Voice>
        <p>
          {better > 0
            ? de
              ? 'Etwas hat sich bewegt. Nimm dir einen Moment, das wirklich wahrzunehmen – du hast das selbst bewirkt.'
              : 'Something has shifted. Take a moment to really notice it — you did this yourself.'
            : de
              ? 'Die Zahlen haben sich nicht verbessert – und das ist nach so einer Sitzung häufig. Manchmal wird es erst schwerer, weil etwas Verdrängtes sichtbar wird, und die Erleichterung kommt Stunden oder Tage später. Achte heute besonders gut auf dich.'
              : 'The numbers have not improved — and that is common after a session like this. Sometimes things feel heavier first, because something pushed aside becomes visible, and relief comes hours or days later. Take particularly good care of yourself today.'}
        </p>
      </Voice>
    </div>
  );
}

function Appreciation() {
  const { lang } = useI18n();
  const f = useFill();
  const { data } = useSession();
  const de = lang === 'de';
  const reasons = careReasons(data);
  const done: string[] = [];
  if (data.texts.placeWhat || data.choices.placeWorked) done.push(de ? 'einen sicheren Ort gefunden' : 'found a safe place');
  if (data.choices.home || data.choices.sad) done.push(de ? 'ehrlich auf deine Kindheit geschaut' : 'looked honestly at your childhood');
  if (data.choices.beliefs?.length) done.push(de ? 'deine alten Sätze beim Namen genannt' : 'named your old beliefs');
  if (data.choices.selfFeeling || data.values.childAge !== undefined) done.push(f({ de: '{kindDat} begegnet', en: 'met {kind}' }));
  if (chosenSentences(data, lang).length) done.push(f({ de: '{kindDat} gesagt, was {kind} hören musste', en: 'told {kind} what {kind} needed to hear' }));
  if (data.choices.protector) done.push(de ? 'einem Beschützer gedankt' : 'thanked a protector');
  if (data.texts.letter) done.push(de ? 'einen Brief geschrieben' : 'written a letter');
  if (data.choices.planActions?.length || data.choices.ifThenAction) done.push(de ? 'einen Plan für den Alltag gemacht' : 'made a plan for everyday life');

  return (
    <div className="stack stack-lg">
      <Voice>
        <p>
          {de ? 'Du hast dir heute Zeit für etwas genommen, das viele Menschen ihr ganzes Leben vermeiden. Du hast ' : 'Today you took time for something many people avoid their whole life. You have '}
          {done.length > 0 ? done.join(', ') : de ? 'dich auf den Weg gemacht' : 'set out on the path'}.
        </p>
        <p>{f({ de: 'Das ist nicht wenig. Für {kindDat} war heute vielleicht das erste Mal, dass jemand wirklich gekommen ist.', en: 'That is no small thing. For {kind}, today may have been the first time someone really came.' })}</p>
      </Voice>

      {reasons.length > 0 && (
        <Callout tone="warning" title={de ? 'Eine ehrliche Empfehlung' : 'An honest recommendation'}>
          <p>
            {de
              ? 'Einige deiner Antworten sprechen dafür, dass du diesen Weg nicht allein gehen solltest:'
              : 'Some of your answers suggest that you should not walk this path alone:'}
          </p>
          <ul>
            {reasons.includes('trauma') && <li>{de ? 'Du hast Gewalt, Übergriffe oder Vernachlässigung erlebt. Das verdient traumatherapeutische Begleitung.' : 'You have experienced violence, abuse or neglect. That deserves trauma-informed therapy.'}</li>}
            {reasons.includes('dissociation') && <li>{de ? 'Du kennst Wegdriften oder Überflutung bei Erinnerungen.' : 'You know the experience of drifting away or being flooded by memories.'}</li>}
            {reasons.includes('distress') && <li>{de ? 'Deine Belastung ist am Ende der Sitzung noch hoch.' : 'Your distress is still high at the end of the session.'}</li>}
            {reasons.includes('mood') && <li>{de ? 'Es geht dir am Ende der Sitzung sehr schlecht.' : 'You are feeling very bad at the end of the session.'}</li>}
            {reasons.includes('overwhelmed') && <li>{de ? 'Die Begegnung ist dir zu viel geworden.' : 'The meeting became too much for you.'}</li>}
            {reasons.includes('thoughts') && <li>{de ? 'Du hattest zuletzt Gedanken, nicht mehr leben zu wollen.' : 'You have recently had thoughts of not wanting to live.'}</li>}
          </ul>
          <p>
            <Link to={{ name: 'help' }}>{de ? 'So findest du Unterstützung →' : 'How to find support →'}</Link>
          </p>
        </Callout>
      )}

      <section>
        <h3>{de ? 'In den nächsten Tagen' : 'Over the next few days'}</h3>
        <ul>
          <li>{de ? 'Nach solcher Arbeit ist Müdigkeit normal. Plane heute nichts Anstrengendes mehr, wenn es geht.' : 'Tiredness after this kind of work is normal. If you can, plan nothing demanding for the rest of today.'}</li>
          <li>{de ? 'Es kann sein, dass Erinnerungen, Träume oder Gefühle auftauchen. Das ist ein Zeichen, dass etwas in Bewegung gekommen ist. Schreib es auf und bring es in den Tresor, wenn es zu viel wird.' : 'Memories, dreams or feelings may surface. That is a sign that something has started moving. Write it down, and put it in the vault if it gets too much.'}</li>
          <li>{de ? 'Mach das tägliche Ritual – auch wenn es sich albern anfühlt. Gerade dann.' : 'Do the daily ritual — even if it feels silly. Especially then.'}</li>
          <li>{de ? 'Eine Folgesitzung ist in ein bis zwei Wochen sinnvoll. Deine Kraftquellen kannst du dabei übernehmen.' : 'A follow-up session makes sense in one or two weeks. You can carry your resources over.'}</li>
          <li>{de ? 'Wenn es dir schlechter statt besser geht: Hol dir Unterstützung. Das ist klug, nicht schwach.' : 'If you feel worse rather than better: get support. That is wise, not weak.'}</li>
        </ul>
      </section>
    </div>
  );
}

/** Pausenstelle zwischen Verstehen und Begegnung. */
function BreakPoint() {
  const { lang } = useI18n();
  const f = useFill();
  const { data, persist, setPersist } = useSession();
  const de = lang === 'de';
  const planned = choice(data, 'time') === 'teilen';
  return (
    <section className="card card--flat stack breakpoint">
      <p className="eyebrow">{de ? 'Pausenstelle' : 'Pause point'}</p>
      <Voice>
        <p>
          {f({
            de: 'Bis hierhin hast du zurückgeschaut und verstanden – das war schon viel Arbeit. Der zweite Teil, die Begegnung mit {kindDat}, braucht Kraft und Ruhe. Wenn du müde bist oder die Zeit knapp wird, ist jetzt der richtige Moment für eine Pause.',
            en: 'Up to here you have looked back and understood — that was already a lot of work. The second part, meeting {kind}, needs strength and calm. If you are tired or time is running short, now is the right moment for a break.',
          })}
          {planned && (de ? ' Du hattest vor, die Sitzung aufzuteilen – hier ist die Stelle dafür.' : ' You planned to split the session — this is the place to do it.')}
        </p>
      </Voice>
      <label className="toggle">
        <input type="checkbox" checked={persist} onChange={(e) => setPersist(e.target.checked)} />
        <strong>{de ? 'Auf diesem Gerät speichern, damit ich später weitermachen kann' : 'Keep on this device so I can continue later'}</strong>
      </label>
      <details className="explainer">
        <summary>{de ? 'So beendest du den ersten Teil gut' : 'How to close the first part well'}</summary>
        <div>
          <ul>
            <li>{de ? 'Eine Minute ruhig atmen, länger aus als ein.' : 'Breathe calmly for a minute, longer out than in.'}</li>
            <li>{de ? 'Fünf Dinge im Raum benennen, die du siehst.' : 'Name five things you can see in the room.'}</li>
            <li>
              {de ? 'Hat dich etwas aufgewühlt: ' : 'If something stirred you up: '}
              <Link to={{ name: 'exercise', id: 'tresor' }}>{de ? 'die Tresor-Übung' : 'the vault exercise'}</Link>.
            </li>
            <li>{de ? 'Wenn du wiederkommst, findest du die Sitzung unter „Sitzung“ – genau an dieser Stelle. Am besten innerhalb von ein paar Tagen.' : 'When you come back, you will find the session under “Session” — right at this point. Ideally within a few days.'}</li>
          </ul>
        </div>
      </details>
    </section>
  );
}
