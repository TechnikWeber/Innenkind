import { useI18n } from '../i18n';
import { useSession } from '../state/session';
import { estimateMinutes } from '../engine/flow';
import { exercises } from '../data/exercises';
import { phases } from '../data/steps';
import { Link } from './common';
import { roundFive } from '../engine/path';

export function HomePage() {
  const { t, lang } = useI18n();
  const { data } = useSession();
  const de = lang === 'de';
  const inProgress = Boolean(data.startedAt && !data.finishedAt);

  const features = de
    ? [
        ['Aufgebaut wie eine Therapiestunde', 'Vorgespräch, Ankommen, Verstehen, Kraftquellen, Spurensuche, Spiegelung, Begegnung, Nachnähren, Abschluss. Jede Phase hat ihren Sinn – und ihre Zeit.'],
        ['Persönlich statt Schema F', 'Aus deinen Antworten entstehen deine Bedürfnisse, Glaubenssätze und Schutzstrategien – mit Begründung. Daraus werden deine Sätze für das Kind, dein Brief und dein Plan.'],
        ['Antwortet, wenn du antwortest', 'Schaut das Kind weg? Fühlst du Ärger statt Mitgefühl? Wird es zu viel? An den entscheidenden Stellen geht die Sitzung darauf ein – so, wie es eine Therapeutin tun würde.'],
        ['Sicherheit zuerst', 'Stabilisierung vor Erinnerungsarbeit, Belastung wird gemessen, ein Pause-Knopf auf jeder Seite, ein sanfter Weg ohne belastende Erinnerungen und ein Ende, das immer stabil ist.'],
        ['Mehr als eine Stunde', 'Ein tägliches Drei-Minuten-Ritual, ein Wochenplan zum Abhaken und eine Bibliothek mit 14 Übungen – denn Veränderung entsteht durch Wiederholung.'],
        ['Privat, wirklich', 'Kein Konto, kein Server, keine Statistik. Nichts landet in der Adresszeile. Ob du dein Protokoll auf dem Gerät behältst, entscheidest du.'],
      ]
    : [
        ['Structured like a therapy hour', 'Preliminary talk, arriving, understanding, resources, tracing back, reflection, meeting, reparenting, closing. Each phase has its purpose — and its time.'],
        ['Personal, not generic', 'Your answers reveal your needs, core beliefs and protective strategies — with reasons. From them come your sentences for the child, your letter and your plan.'],
        ['Responds when you respond', 'Does the child look away? Do you feel irritation instead of compassion? Is it getting too much? At the crucial points the session responds — the way a therapist would.'],
        ['Safety first', 'Stabilisation before memory work, distress is measured, a pause button on every page, a gentle path without distressing memories, and an ending that is always stable.'],
        ['More than one hour', 'A daily three-minute ritual, a weekly plan to tick off and a library of 14 exercises — because change comes from repetition.'],
        ['Private, really', 'No account, no server, no analytics. Nothing ends up in the address bar. Whether you keep your record on the device is up to you.'],
      ];

  return (
    <>
      <section className="section hero">
        <div className="container">
          <p className="chip chip--accent">{t('heroKicker')}</p>
          <h1 style={{ maxWidth: '20ch', marginTop: '1rem' }}>{t('heroTitle')}</h1>
          <p className="prose lead">{t('heroLead')}</p>
          <div className="row" style={{ marginTop: '1.75rem' }}>
            <Link to={{ name: 'session' }} className="btn btn--primary">
              {inProgress ? t('sessionResume') : t('heroStart')} <span aria-hidden="true">→</span>
            </Link>
            <Link to={{ name: 'daily' }} className="btn">
              {t('heroDaily')}
            </Link>
          </div>
          <p className="muted small" style={{ marginTop: '1rem' }}>
            {t('heroPrivacy')}
          </p>

          <div className="grid grid--3 stats">
            <div>
              <div className="score">{phases.length}</div>
              <div className="muted small">{de ? 'Phasen wie in einer Therapiestunde' : 'phases, as in a therapy hour'}</div>
            </div>
            <div>
              <div className="score">
                {roundFive(estimateMinutes('gentle'))}–{roundFive(estimateMinutes('deep'))}
              </div>
              <div className="muted small">{de ? 'Minuten, je nach Weg' : 'minutes, depending on the path'}</div>
            </div>
            <div>
              <div className="score">{exercises.length}</div>
              <div className="muted small">{de ? 'geführte Übungen, auch einzeln' : 'guided exercises, also standalone'}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--sunken">
        <div className="container">
          <div className="grid grid--3">
            {features.map(([title, text]) => (
              <article key={title} className="card card--raised">
                <h3 className="card__title">{title}</h3>
                <p className="muted" style={{ margin: 0 }}>
                  {text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>{de ? 'Drei Wege' : 'Three paths'}</h2>
          <p className="prose muted">
            {de
              ? 'Das Vorgespräch schlägt einen Weg vor. Du entscheidest – und kannst jederzeit wechseln.'
              : 'The preliminary talk suggests a path. You decide — and can switch at any time.'}
          </p>
          <div className="grid grid--3" style={{ marginTop: '1.5rem' }}>
            {(
              [
                ['gentle', t('pathGentle'), t('pathGentleDesc')],
                ['standard', t('pathStandard'), t('pathStandardDesc')],
                ['deep', t('pathDeep'), t('pathDeepDesc')],
              ] as const
            ).map(([p, title, desc]) => (
              <article key={p} className="card">
                <h3 className="card__title">{title}</h3>
                <p className="chip">{t('aboutMinutes', { n: roundFive(estimateMinutes(p)) })}</p>
                <p className="muted" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                  {desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sunken">
        <div className="container container--narrow stack">
          <h2>{de ? 'Ehrlich gesagt' : 'To be honest'}</h2>
          <p>
            {de
              ? 'Diese Seite ist keine Therapie und kann keine sein. Eine Therapeutin sieht dein Gesicht, hört deine Stimme, hält aus, was du erzählst, und bleibt über Monate. Was eine Webseite kann: dich durch bewährte Übungen führen, dir helfen, dich zu verstehen, und dir Worte geben – für dich selbst und für ein späteres Gespräch mit einer Fachperson.'
              : 'This site is not therapy and cannot be. A therapist sees your face, hears your voice, holds what you tell them, and stays for months. What a website can do: guide you through proven exercises, help you understand yourself, and give you words — for yourself and for a later conversation with a professional.'}
          </p>
          <p>
            {de
              ? 'Bitte nutze sie nicht in einer akuten Krise. Wenn du Gewalt, Missbrauch oder schwere Vernachlässigung erlebt hast oder bei Erinnerungen oft wegdriftest, ist der sanfte Weg der richtige – und eine traumatherapeutische Begleitung der eigentliche.'
              : 'Please do not use it in an acute crisis. If you have experienced violence, abuse or severe neglect, or often drift away with memories, the gentle path is the right one here — and trauma-informed therapy is the real one.'}
          </p>
          <p>
            <Link to={{ name: 'help' }}>{de ? 'Hilfe und Krisennummern →' : 'Help and crisis lines →'}</Link>
          </p>
        </div>
      </section>
    </>
  );
}
