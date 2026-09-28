import type { ExerciseId, ExerciseKind } from '../data/types';
import { exercises, exerciseById } from '../data/exercises';
import { useI18n } from '../i18n';
import { Link, useFill } from './common';
import { GuidedPlayer } from './blocks';
import { PauseButton } from './Pause';

const KIND_ORDER: ExerciseKind[] = ['stabilize', 'resource', 'encounter', 'reflect'];
const KIND_LABEL: Record<ExerciseKind, { de: string; en: string }> = {
  stabilize: { de: 'Beruhigen & zurückkommen', en: 'Calming & returning' },
  resource: { de: 'Kraftquellen', en: 'Resources' },
  encounter: { de: 'Begegnung', en: 'Meeting' },
  reflect: { de: 'Nachdenken & schreiben', en: 'Reflecting & writing' },
};

export function ExercisesPage() {
  const { t, lang } = useI18n();
  const de = lang === 'de';
  return (
    <div className="container section stack stack-lg">
      <header className="stack prose">
        <h1>{t('navExercises')}</h1>
        <p className="lead">
          {de
            ? 'Alle Übungen der Sitzung zum Wiederholen – für den Alltag, für schwere Momente, für Folgetage.'
            : 'All exercises from the session to repeat — for everyday life, for hard moments, for the days after.'}
        </p>
        <p className="muted">
          {de
            ? 'Die Übungen zur Begegnung wirken am besten, wenn du einmal die ganze Sitzung gemacht hast und deinen sicheren Ort kennst.'
            : 'The meeting exercises work best once you have done the full session and know your safe place.'}
        </p>
      </header>
      {KIND_ORDER.map((kind) => (
        <section key={kind} className="stack">
          <h2 className="h3">{KIND_LABEL[kind][lang]}</h2>
          <div className="grid grid--3">
            {exercises
              .filter((e) => e.kind === kind && e.standalone)
              .map((e) => (
                <article key={e.id} className="card card--raised stack stack-sm">
                  <div className="row row--between">
                    <h3 className="card__title">{e.title[lang]}</h3>
                    <span className="chip">{t('minutesShort', { n: e.minutes })}</span>
                  </div>
                  <p className="muted small">{e.purpose[lang]}</p>
                  <p>
                    <Link to={{ name: 'exercise', id: e.id }} className="btn btn--small">
                      {t('start')} →
                    </Link>
                  </p>
                </article>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function ExercisePage({ id }: { id: ExerciseId }) {
  const { t, lang } = useI18n();
  const f = useFill();
  const ex = exerciseById.get(id);
  if (!ex) {
    return (
      <div className="container section">
        <p>
          <Link to={{ name: 'exercises' }}>← {t('navExercises')}</Link>
        </p>
      </div>
    );
  }
  return (
    <div className="container container--narrow section stack">
      <p>
        <Link to={{ name: 'exercises' }}>← {t('navExercises')}</Link>
      </p>
      <h1>{ex.title[lang]}</h1>
      <p className="lead">{f(ex.purpose)}</p>
      <p className="muted small">
        {t('source')}: {ex.source[lang]} · {t('minutesShort', { n: ex.minutes })}
      </p>
      <GuidedPlayer key={ex.id} lines={ex.lines} />
      <PauseButton />
    </div>
  );
}
