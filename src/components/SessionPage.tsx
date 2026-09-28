import { useEffect, useRef } from 'react';
import { useI18n } from '../i18n';
import { useSession } from '../state/session';
import { useApp } from '../state/app';
import { phasesFor, remainingMinutes, resolveStep, visibleBlocks, visibleSteps } from '../engine/flow';
import type { Block, Step } from '../data/steps';
import { exerciseById } from '../data/exercises';
import type { Path } from '../data/types';
import { PATHS } from '../data/types';
import { Callout, Paragraphs, useFill } from './common';
import { Breath, GuidedPlayer, NumberBlock, QuestionBlock, ScaleBlock, TextBlock } from './blocks';
import { SpecialBlock } from './specials';
import { PauseButton } from './Pause';

function BlockView({ block, step, index }: { block: Block; step: Step; index: number }) {
  const f = useFill();
  const { lang } = useI18n();
  switch (block.t) {
    case 'lead':
      return <p className="lead">{f(block.text)}</p>;
    case 'p':
      return <p>{f(block.text)}</p>;
    case 'list':
      return (
        <ul className="list">
          {block.items.map((item) => (
            <li key={item.de}>{f(item)}</li>
          ))}
        </ul>
      );
    case 'more':
      return (
        <details className="explainer">
          <summary>{f(block.title)}</summary>
          <div>
            {block.body.map((b) => (
              <p key={b.de}>{f(b)}</p>
            ))}
          </div>
        </details>
      );
    case 'callout':
      return (
        <Callout tone={block.tone} title={block.title ? f(block.title) : undefined}>
          <Paragraphs text={f(block.text)} />
        </Callout>
      );
    case 'question':
      return <QuestionBlock q={block.q} />;
    case 'scale':
      return <ScaleBlock id={block.id} label={f(block.label)} low={f(block.low)} high={f(block.high)} />;
    case 'text':
      return <TextBlock id={block.id} label={f(block.label)} hint={block.hint ? f(block.hint) : undefined} placeholder={block.placeholder ? f(block.placeholder) : undefined} rows={block.rows} />;
    case 'number':
      return <NumberBlock id={block.id} label={f(block.label)} min={block.min} max={block.max} />;
    case 'exercise': {
      const ex = exerciseById.get(block.id)!;
      return (
        <div className="stack stack-sm">
          <GuidedPlayer key={`${step.id}-${index}`} lines={ex.lines} title={ex.title[lang]} />
          <p className="muted small">
            {lang === 'de' ? 'Nach: ' : 'After: '}
            {ex.source[lang]}
          </p>
        </div>
      );
    }
    case 'guided':
      return <GuidedPlayer key={`${step.id}-${index}`} lines={block.lines} />;
    case 'breath':
      return <Breath />;
    case 'special':
      return <SpecialBlock name={block.name} step={step} />;
  }
}

function PathSwitch() {
  const { t } = useI18n();
  const { data, setPath } = useSession();
  const labels: Record<Path, string> = { gentle: t('pathGentle'), standard: t('pathStandard'), deep: t('pathDeep') };
  return (
    <div className="switch-group" role="group" aria-label={t('sessionPath')}>
      {PATHS.map((p) => (
        <button key={p} type="button" aria-pressed={data.path === p} onClick={() => setPath(p)}>
          {labels[p]}
        </button>
      ))}
    </div>
  );
}

export function SessionPage() {
  const { t, lang } = useI18n();
  const f = useFill();
  const { data, begin, goNext, goBack, goTo, finish } = useSession();
  const { navigate } = useApp();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    begin();
  }, [begin]);

  const list = visibleSteps(data);
  const step = resolveStep(data);
  const index = list.indexOf(step);
  const isLast = index === list.length - 1;
  const blocked = step.blocked?.(data) ?? false;
  const phases = phasesFor(data);
  const currentPhase = phases.findIndex((p) => p.id === step.phase);

  // Neuer Schritt: nach oben und die Überschrift fokussieren, damit
  // Vorleseprogramme dort weiterlesen und nicht am Knopf von eben hängen.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    headingRef.current?.focus();
  }, [step.id]);

  const onNext = () => {
    if (isLast) {
      finish();
      navigate({ name: 'result' });
    } else goNext();
  };

  return (
    <div className="container section session">
      <div className="session-grid">
        <div className="session-main">
          <div className="progress" aria-hidden="true">
            <div className="progress__fill" style={{ width: `${((index + 1) / list.length) * 100}%` }} />
          </div>
          <p className="eyebrow session__phase">
            {phases[currentPhase]?.title[lang]} · {t('sessionStepOf', { a: index + 1, b: list.length })}
          </p>
          <h1 className="session__title" tabIndex={-1} ref={headingRef}>
            {f(step.title)}
          </h1>
          <div className="stack stack-lg session__blocks">
            {visibleBlocks(step, data).map((block, i) => (
              <BlockView key={`${step.id}-${i}`} block={block} step={step} index={i} />
            ))}
          </div>
          <nav className="session__nav" aria-label={t('sessionProgress')}>
            <button type="button" className="btn" onClick={goBack} disabled={index === 0}>
              <span aria-hidden="true">←</span> {t('back')}
            </button>
            <button type="button" className="btn btn--primary" onClick={onNext} disabled={blocked}>
              {isLast ? t('sessionFinish') : t('next')} <span aria-hidden="true">→</span>
            </button>
          </nav>
          {blocked && <p className="muted small">{t('sessionBlockedHint')}</p>}
        </div>

        <aside className="session-aside no-print" aria-label={t('sessionPhases')}>
          <div className="card card--flat stack">
            <div>
              <p className="eyebrow">{t('sessionPath')}</p>
              <PathSwitch />
            </div>
            <p className="muted small">{t('sessionRemaining', { n: remainingMinutes(data) })}</p>
            <ol className="phase-list">
              {phases.map((p, i) => {
                const first = list.find((s) => s.phase === p.id);
                const state = i < currentPhase ? 'done' : i === currentPhase ? 'current' : 'todo';
                return (
                  <li key={p.id} className={`phase-list__item phase-list__item--${state}`}>
                    {state === 'done' && first ? (
                      <button type="button" className="linklike" onClick={() => goTo(first.id)}>
                        {p.title[lang]}
                      </button>
                    ) : (
                      <span aria-current={state === 'current' ? 'step' : undefined}>{p.title[lang]}</span>
                    )}
                  </li>
                );
              })}
            </ol>
          </div>
        </aside>
      </div>
      <PauseButton />
    </div>
  );
}
