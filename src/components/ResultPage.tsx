import { useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { useSession } from '../state/session';
import { useApp } from '../state/app';
import { beliefById } from '../data/beliefs';
import { needById } from '../data/needs';
import { protectorById } from '../data/protectors';
import { computeProfile, topNeeds, topProtectors } from '../engine/profile';
import { careReasons, chosenSentences, ifThenText, newBeliefText } from '../engine/compose';
import { selectedBeliefs } from '../engine/session';
import { textContext } from '../engine/text';
import { exportText } from '../engine/export';
import { Callout, Link, Paragraphs, useFill } from './common';
import { Compare, WeekPlan } from './specials';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card result-section">
      <h2 className="result-section__title">{title}</h2>
      {children}
    </section>
  );
}

export function ResultPage() {
  const { t, lang } = useI18n();
  const f = useFill();
  const { data, persist, setPersist, reset, wipe } = useSession();
  const { navigate } = useApp();
  const [confirm, setConfirm] = useState(false);
  const profile = useMemo(() => computeProfile(data), [data]);
  const de = lang === 'de';

  if (!data.startedAt) {
    return (
      <div className="container container--narrow section stack">
        <h1>{t('resultTitle')}</h1>
        <p>{t('resultEmpty')}</p>
        <p>
          <Link to={{ name: 'session' }} className="btn btn--primary">
            {t('heroStart')} →
          </Link>
        </p>
      </div>
    );
  }

  const ctx = textContext(data, lang);
  const beliefs = selectedBeliefs(data);
  const sentences = chosenSentences(data, lang);
  const ifThen = ifThenText(data, lang, ctx);
  const needsTop = topNeeds(profile, 3);
  const prot = topProtectors(profile, 3);

  const download = () => {
    const blob = new Blob([exportText(data, lang)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const date = (data.startedAt ?? new Date().toISOString()).slice(0, 10);
    a.href = url;
    a.download = `innenkind-${date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container section stack stack-lg result">
      <header className="stack">
        <p className="eyebrow">
          {new Date(data.startedAt).toLocaleDateString(de ? 'de-DE' : 'en-GB', { dateStyle: 'full' })}
        </p>
        <h1>{t('resultTitle')}</h1>
        {!data.finishedAt && (
          <Callout tone="info">
            <p>
              {t('unfinished')}{' '}
              <Link to={{ name: 'session' }}>{t('sessionResume')} →</Link>
            </p>
          </Callout>
        )}
        <div className="row no-print">
          <button type="button" className="btn btn--primary" onClick={() => window.print()}>
            {t('print')}
          </button>
          <button type="button" className="btn" onClick={download}>
            {t('download')}
          </button>
        </div>
      </header>

      <div className="card card--flat stack no-print">
        <label className="toggle">
          <input type="checkbox" checked={persist} onChange={(e) => setPersist(e.target.checked)} />
          <strong>{persist ? t('resultKept') : t('resultKeep')}</strong>
        </label>
        <p className="muted small">{t('resultKeepHint')}</p>
      </div>

      <Compare />

      {data.texts.takeaway && (
        <Section title={de ? 'Was du mitnimmst' : 'What you are taking away'}>
          <blockquote className="takeaway">{data.texts.takeaway}</blockquote>
        </Section>
      )}

      {sentences.length > 0 && (
        <Section title={f({ de: 'Deine Sätze für {kind}', en: 'Your sentences for {kind}' })}>
          <ul className="sentence-cards">
            {sentences.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
          <p className="muted small">
            {de ? 'Schreib sie auf einen Zettel und leg ihn dorthin, wo du ihn jeden Tag siehst.' : 'Write them on a note and put it where you will see it every day.'}
          </p>
        </Section>
      )}

      {beliefs.length > 0 && (
        <Section title={de ? 'Alte und neue Sätze' : 'Old and new beliefs'}>
          <div className="stack">
            {beliefs.map((id) => {
              const nb = newBeliefText(data, id, lang);
              const before = data.values[`belief.${id}.before`];
              const after = data.values[`belief.${id}.after`];
              const rating = data.values[`newBelief.${id}.rating`];
              return (
                <div key={id} className="belief-pair">
                  <p className="belief-old">
                    „{f(beliefById.get(id)!.text)}“{' '}
                    {typeof before === 'number' && (
                      <span className="muted small">
                        {before} %{typeof after === 'number' && ` → ${after} %`}
                      </span>
                    )}
                  </p>
                  {nb && (
                    <p className="belief-new">
                      <span aria-hidden="true">→ </span>„{nb}“ {typeof rating === 'number' && <span className="muted small">{rating} %</span>}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      )}

      {data.texts.letter && (
        <Section title={f({ de: 'Dein Brief an {kind}', en: 'Your letter to {kind}' })}>
          <div className="letter-view">
            <Paragraphs text={data.texts.letter} />
          </div>
          {data.texts.letterFromChild && (
            <>
              <h3>{f({ de: 'Die Antwort von {kindDat}', en: 'The reply from {kind}' })}</h3>
              <div className="letter-view letter-view--child">
                <Paragraphs text={data.texts.letterFromChild} />
              </div>
            </>
          )}
        </Section>
      )}

      <Section title={de ? 'Dein Plan' : 'Your plan'}>
        <div className="stack">
          {ifThen && (
            <Callout tone="positive">
              <p>
                <strong>{ifThen}</strong>
              </p>
            </Callout>
          )}
          <WeekPlan />
          <p className="no-print">
            <Link to={{ name: 'daily' }} className="btn btn--primary">
              {de ? 'Zum täglichen Ritual' : 'Go to the daily ritual'}
            </Link>
          </p>
        </div>
      </Section>

      <Section title={f({ de: 'Was du über {kind} weißt', en: 'What you know about {kind}' })}>
        <dl className="facts">
          {data.texts.childName && (<><dt>{de ? 'Name' : 'Name'}</dt><dd>{data.texts.childName}</dd></>)}
          {typeof data.values.childAge === 'number' && (<><dt>{de ? 'Alter' : 'Age'}</dt><dd>{data.values.childAge}</dd></>)}
          {data.texts.childLook && (<><dt>{de ? 'Aussehen' : 'Appearance'}</dt><dd>{data.texts.childLook}</dd></>)}
          {data.texts.childScene && (<><dt>{de ? 'Szene' : 'Scene'}</dt><dd>{data.texts.childScene}</dd></>)}
          {data.texts.placeWhat && (<><dt>{de ? 'Sicherer Ort' : 'Safe place'}</dt><dd>{data.texts.placeWhat}{data.texts.placeDetails ? ` – ${data.texts.placeDetails}` : ''}</dd></>)}
          {data.texts.helperName && (<><dt>{de ? 'Helferfigur' : 'Helper'}</dt><dd>{data.texts.helperName}</dd></>)}
          {data.texts.happyMemory && (<><dt>{de ? 'Ein schöner Moment' : 'A happy moment'}</dt><dd>{data.texts.happyMemory}</dd></>)}
        </dl>
        {needsTop.length > 0 && (
          <>
            <h3>{de ? 'Was gefehlt haben könnte' : 'What may have been missing'}</h3>
            <ul>
              {needsTop.map((n) => (
                <li key={n}>
                  <strong>{f(needById.get(n)!.name)}</strong> – {f(needById.get(n)!.childVoice)}
                </li>
              ))}
            </ul>
          </>
        )}
        {prot.length > 0 && (
          <>
            <h3>{de ? 'Deine Beschützer' : 'Your protectors'}</h3>
            <ul>
              {prot.map((p) => (
                <li key={p}>
                  <strong>{f(protectorById.get(p)!.name)}</strong> – {f(protectorById.get(p)!.alternative)}
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      {careReasons(data).length > 0 && (
        <Callout tone="warning" title={de ? 'Denk an Unterstützung' : 'Remember to get support'}>
          <p>
            {de
              ? 'Einige deiner Antworten sprechen dafür, dass eine Begleitung durch eine Fachperson dir guttun würde. Du kannst dieses Protokoll ausdrucken und mitnehmen.'
              : 'Some of your answers suggest that support from a professional would do you good. You can print this record and take it with you.'}{' '}
            <Link to={{ name: 'help' }}>{t('navHelp')} →</Link>
          </p>
        </Callout>
      )}

      <section className="card card--flat stack no-print">
        <h2 className="result-section__title">{de ? 'Wie geht es weiter?' : 'What next?'}</h2>
        <div className="row">
          <button
            type="button"
            className="btn"
            title={t('resultNewKeepHint')}
            onClick={() => {
              reset(true);
              navigate({ name: 'session' });
            }}
          >
            {t('resultNewKeep')}
          </button>
          <button
            type="button"
            className="btn btn--quiet"
            onClick={() => {
              reset(false);
              navigate({ name: 'session' });
            }}
          >
            {t('resultNew')}
          </button>
        </div>
        <p className="muted small">{t('resultNewKeepHint')}</p>
        {!confirm ? (
          <p>
            <button type="button" className="btn btn--quiet btn--danger" onClick={() => setConfirm(true)}>
              {t('resultDelete')}
            </button>
          </p>
        ) : (
          <div className="row">
            <span>{t('resultDeleteConfirm')}</span>
            <button
              type="button"
              className="btn btn--danger"
              onClick={() => {
                wipe();
                navigate({ name: 'home' });
              }}
            >
              {t('resultDeleteYes')}
            </button>
            <button type="button" className="btn btn--quiet" onClick={() => setConfirm(false)}>
              {t('back')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
