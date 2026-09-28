import { useState } from 'react';
import type { L10n, NeedId } from '../data/types';
import { needs, needById } from '../data/needs';
import { useI18n } from '../i18n';
import { useSession } from '../state/session';
import { chosenSentences } from '../engine/compose';
import { Breath } from './blocks';
import { Link, useFill, Voice } from './common';
import { PauseButton } from './Pause';

const FEELINGS: { id: string; label: L10n; response: L10n }[] = [
  { id: 'froh', label: { de: 'froh', en: 'happy' }, response: { de: 'Wie schön. Freu dich mit {kindDat}. Vielleicht magst du heute etwas tun, das {kind} Spaß macht – geteilte Freude wächst.', en: 'How lovely. Be glad with {kind}. Perhaps do something today that {kind} enjoys — shared joy grows.' } },
  { id: 'ruhig', label: { de: 'ruhig', en: 'calm' }, response: { de: 'Gut. Sag {kindDat}: „Schön, dass es dir gut geht. Ich bin trotzdem da.“ Kinder brauchen Aufmerksamkeit nicht nur, wenn es brennt.', en: 'Good. Tell {kind}: “I am glad you are well. I am here anyway.” Children need attention not only when something is wrong.' } },
  { id: 'muede', label: { de: 'müde', en: 'tired' }, response: { de: 'Dann braucht {kind} heute vielleicht vor allem Schonung. Was kannst du heute weglassen?', en: 'Then perhaps what {kind} needs most today is rest. What can you leave out today?' } },
  { id: 'traurig', label: { de: 'traurig', en: 'sad' }, response: { de: 'Traurigkeit braucht Nähe, keine Lösung. Leg eine Hand aufs Herz und sag: „Ich bin bei dir.“', en: 'Sadness needs closeness, not a solution. Place a hand on your heart and say: “I am with you.”' } },
  { id: 'aengstlich', label: { de: 'ängstlich', en: 'scared' }, response: { de: 'Angst braucht Schutz und Orientierung. Sag: „Ich passe auf. Du musst das nicht allein schaffen.“ Und atme länger aus als ein.', en: 'Fear needs protection and orientation. Say: “I am keeping watch. You don’t have to manage this alone.” And breathe out longer than in.' } },
  { id: 'wuetend', label: { de: 'wütend', en: 'angry' }, response: { de: 'Wut zeigt, dass eine Grenze verletzt wurde. Frag {kind}: „Was war nicht in Ordnung?“ Du musst nichts tun – nur zuhören.', en: 'Anger shows that a boundary was crossed. Ask {kind}: “What wasn’t okay?” You don’t have to do anything — just listen.' } },
  { id: 'einsam', label: { de: 'einsam', en: 'lonely' }, response: { de: 'Einsamkeit braucht Verbindung. Sag: „Ich bin da.“ Und vielleicht schreibst du heute einem Menschen, den du magst.', en: 'Loneliness needs connection. Say: “I am here.” And perhaps message someone you like today.' } },
  { id: 'unklar', label: { de: 'weiß nicht', en: 'don’t know' }, response: { de: 'Das ist in Ordnung. Manchmal ist die Verbindung leise. Bleib einfach einen Moment, ohne etwas zu wollen.', en: 'That is fine. Sometimes the connection is quiet. Just stay for a moment without wanting anything.' } },
];

/** Tag des Jahres – damit Satz und Handlung täglich wechseln, ohne etwas zu speichern. */
function dayOfYear(now = new Date()): number {
  return Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86_400_000);
}

export function DailyPage() {
  const { lang } = useI18n();
  const f = useFill();
  const { data } = useSession();
  const [feeling, setFeeling] = useState<string | null>(null);
  const [need, setNeed] = useState<NeedId | null>(null);
  const [promised, setPromised] = useState(false);
  const de = lang === 'de';
  const day = dayOfYear();
  const own = chosenSentences(data, lang);
  const n = need ? needById.get(need)! : null;
  const sentence = n ? n.sentences[day % n.sentences.length] : null;
  const action = n ? n.actions[day % n.actions.length] : null;

  return (
    <div className="container container--narrow section stack stack-lg daily">
      <header className="stack">
        <p className="eyebrow">{new Date().toLocaleDateString(de ? 'de-DE' : 'en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        <h1>{de ? 'Drei Minuten für dein inneres Kind' : 'Three minutes for your inner child'}</h1>
        <p className="lead">
          {de
            ? 'Jeden Tag ein kurzer Besuch. Nicht, weil etwas repariert werden muss, sondern weil Vertrauen durch Wiederkommen wächst.'
            : 'A short visit every day. Not because something needs fixing, but because trust grows through coming back.'}
        </p>
        {!data.startedAt && (
          <p className="muted small">
            {de ? 'Am besten wirkt das Ritual nach einer vollständigen Sitzung. ' : 'The ritual works best after a full session. '}
            <Link to={{ name: 'session' }}>{de ? 'Sitzung beginnen →' : 'Begin the session →'}</Link>
          </p>
        )}
      </header>

      <section className="card stack">
        <h2 className="h3">{de ? '1. Ankommen' : '1. Arrive'}</h2>
        <p>{de ? 'Drei ruhige Atemzüge. Leg eine Hand aufs Herz.' : 'Three calm breaths. Place a hand on your heart.'}</p>
        <Breath />
      </section>

      <section className="card stack">
        <h2 className="h3">{f({ de: '2. „Hallo {kind}. Wie geht es dir heute?“', en: '2. “Hello {kind}. How are you today?”' })}</h2>
        <p className="muted small">{de ? 'Spür hinein, was kommt. Nimm das Erste.' : 'Feel what comes. Take the first thing.'}</p>
        <div className="chiprow">
          {FEELINGS.map((fe) => (
            <button key={fe.id} type="button" className="chip-button" aria-pressed={feeling === fe.id} onClick={() => setFeeling(fe.id)}>
              {fe.label[lang]}
            </button>
          ))}
        </div>
        {feeling && (
          <Voice>
            <p>{f(FEELINGS.find((x) => x.id === feeling)!.response)}</p>
          </Voice>
        )}
      </section>

      <section className="card stack">
        <h2 className="h3">{de ? '3. „Was brauchst du heute von mir?“' : '3. “What do you need from me today?”'}</h2>
        <div className="answers">
          {needs.map((x) => (
            <button key={x.id} type="button" className="answer" aria-pressed={need === x.id} onClick={() => setNeed(x.id)}>
              <span className="answer__box answer__box--radio" aria-hidden="true" />
              <span>
                <span className="answer__label">{f(x.name)}</span>
                <span className="answer__hint">{f(x.childVoice)}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {n && sentence && action && (
        <>
          <section className="card stack">
            <h2 className="h3">{f({ de: '4. Sag es {kindDat}', en: '4. Say it to {kind}' })}</h2>
            <p className="big-sentence">„{f(sentence)}“</p>
            {own.length > 0 && (
              <>
                <p className="muted small">{de ? 'Oder einer deiner eigenen Sätze aus der Sitzung:' : 'Or one of your own sentences from the session:'}</p>
                <ul className="sentence-cards">
                  {own.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </>
            )}
          </section>

          <section className="card stack">
            <h2 className="h3">{de ? '5. Ein kleines Versprechen für heute' : '5. A small promise for today'}</h2>
            <p>{f(action)}</p>
            <label className="toggle">
              <input type="checkbox" checked={promised} onChange={(e) => setPromised(e.target.checked)} />
              {de ? 'Das mache ich heute.' : 'I will do this today.'}
            </label>
            {promised && (
              <Voice>
                <p>{f({ de: 'Sag {kindDat}: „Ich komme morgen wieder.“ Und dann: bis morgen.', en: 'Tell {kind}: “I will come back tomorrow.” And then: see you tomorrow.' })}</p>
              </Voice>
            )}
          </section>
        </>
      )}
      <PauseButton />
    </div>
  );
}
