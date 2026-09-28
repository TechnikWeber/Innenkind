import { needs } from '../data/needs';
import { beliefs } from '../data/beliefs';
import { protectors } from '../data/protectors';
import { useI18n } from '../i18n';

/*
 * Die Studienlage ist bewusst vorsichtig formuliert: Genannt wird nur, was
 * die jeweilige Arbeit tatsächlich zeigt, und die Lücke – kaum Forschung zur
 * „Innere-Kind-Arbeit“ als eigenem Verfahren – steht gleich am Anfang.
 */
const EVIDENCE = [
  {
    title: { de: 'Imagery Rescripting', en: 'Imagery rescripting' },
    text: {
      de: 'Das Umschreiben belastender Erinnerungen in der Vorstellung ist die am besten untersuchte Methode, die in dieser Sitzung vorkommt. Eine Meta-Analyse über 19 Studien fand deutliche Verbesserungen bei verschiedenen Störungsbildern, darunter Posttraumatische Belastungsstörung, soziale Angst und Depression (Morina, Lancee & Arntz 2017). Die Studien untersuchen Rescripting mit therapeutischer Begleitung – die Selbstanwendung ist weniger gut belegt.',
      en: 'Rewriting distressing memories in imagination is the best-researched method used in this session. A meta-analysis of 19 studies found clear improvements across several conditions, including post-traumatic stress disorder, social anxiety and depression (Morina, Lancee & Arntz 2017). The studies examine rescripting with a therapist — self-administered use is less well supported.',
    },
  },
  {
    title: { de: 'Schematherapie', en: 'Schema therapy' },
    text: {
      de: 'Die Schematherapie, aus der Bedürfnismodell, Kind-Modi und Nachbeelterung stammen, hat sich in randomisierten Studien vor allem bei Persönlichkeitsstörungen als wirksam erwiesen (Giesen-Bloo et al. 2006; Bamelis et al. 2014), inzwischen auch bei weiteren Störungen.',
      en: 'Schema therapy, the source of the needs model, child modes and reparenting, has proven effective in randomised trials, above all for personality disorders (Giesen-Bloo et al. 2006; Bamelis et al. 2014), and increasingly for other conditions.',
    },
  },
  {
    title: { de: 'Selbstmitgefühl', en: 'Self-compassion' },
    text: {
      de: 'Mehr Selbstmitgefühl hängt deutlich mit weniger Angst, Depression und Stress zusammen (MacBeth & Gumley 2012). Eine Meta-Analyse von 27 randomisierten Studien fand, dass gezielte Selbstmitgefühls-Übungen Selbstkritik, Depressivität und Angst verringern (Ferrari et al. 2019).',
      en: 'Greater self-compassion is clearly associated with less anxiety, depression and stress (MacBeth & Gumley 2012). A meta-analysis of 27 randomised trials found that targeted self-compassion exercises reduce self-criticism, depression and anxiety (Ferrari et al. 2019).',
    },
  },
  {
    title: { de: 'Wenn-dann-Pläne', en: 'If-then plans' },
    text: {
      de: 'Durchführungsintentionen („Wenn X passiert, dann tue ich Y“) erhöhen in einer Meta-Analyse über 94 Studien die Wahrscheinlichkeit deutlich, dass Vorsätze umgesetzt werden – mit mittlerem bis großem Effekt (Gollwitzer & Sheeran 2006).',
      en: 'Implementation intentions (“If X happens, then I will do Y”) substantially increase the likelihood that intentions are carried out — a medium-to-large effect in a meta-analysis of 94 studies (Gollwitzer & Sheeran 2006).',
    },
  },
  {
    title: { de: 'Warum keine Affirmationen', en: 'Why no affirmations' },
    text: {
      de: 'Menschen mit niedrigem Selbstwert fühlen sich nach überschwänglichen positiven Sätzen („Ich bin ein liebenswerter Mensch“) eher schlechter als besser (Wood, Perunovic & Lee 2009). Deshalb bietet die Sitzung realistische, erlaubende Sätze an und fragt, wie glaubwürdig sie sich anfühlen.',
      en: 'People with low self-esteem tend to feel worse, not better, after effusive positive statements (“I am a lovable person”) (Wood, Perunovic & Lee 2009). That is why the session offers realistic, permission-giving sentences and asks how believable they feel.',
    },
  },
  {
    title: { de: 'Selbsthilfe im Netz', en: 'Online self-help' },
    text: {
      de: 'Internetbasierte Selbsthilfe wirkt nachweislich, begleitete Programme aber in der Regel stärker als unbegleitete. Eine einzelne Sitzung ist ein Anfang, keine Behandlung.',
      en: 'Internet-based self-help has demonstrated effects, but guided programmes are generally more effective than unguided ones. A single session is a beginning, not a treatment.',
    },
  },
];

const LITERATURE = [
  'Arntz, A. & Jacob, G. (2012). Schematherapie in der Praxis. Beltz. / Schema Therapy in Practice. Wiley.',
  'Berne, E. (1964). Games People Play. Grove Press.',
  'Bradshaw, J. (1990). Homecoming: Reclaiming and Championing Your Inner Child. Bantam.',
  'Capacchione, L. (1991). Recovery of Your Inner Child. Simon & Schuster.',
  'Ferrari, M. et al. (2019). Self-compassion interventions and psychosocial outcomes: a meta-analysis of RCTs. Mindfulness, 10, 1455–1473.',
  'Gilbert, P. (2010). Compassion Focused Therapy. Routledge.',
  'Gollwitzer, P. M. & Sheeran, P. (2006). Implementation intentions and goal achievement: a meta-analysis. Advances in Experimental Social Psychology, 38, 69–119.',
  'Grawe, K. (2004). Neuropsychotherapie. Hogrefe.',
  'MacBeth, A. & Gumley, A. (2012). Exploring compassion: a meta-analysis of the association between self-compassion and psychopathology. Clinical Psychology Review, 32, 545–552.',
  'Morina, N., Lancee, J. & Arntz, A. (2017). Imagery rescripting as a clinical intervention for aversive memories: a meta-analysis. Journal of Behavior Therapy and Experimental Psychiatry, 55, 6–15.',
  'Neff, K. & Germer, C. (2018). The Mindful Self-Compassion Workbook. Guilford.',
  'Reddemann, L. (2001/2016). Imagination als heilsame Kraft. Klett-Cotta.',
  'Schwartz, R. C. (2021). No Bad Parts. Sounds True.',
  'Stahl, S. (2015). Das Kind in dir muss Heimat finden. Kailash.',
  'Watkins, J. G. (1971). The affect bridge: a hypnoanalytic technique. International Journal of Clinical and Experimental Hypnosis, 19, 21–27.',
  'Whitfield, C. L. (1987). Healing the Child Within. Health Communications.',
  'Winnicott, D. W. (1953). Transitional objects and transitional phenomena. International Journal of Psycho-Analysis, 34, 89–97.',
  'Wood, J. V., Perunovic, W. Q. E. & Lee, J. W. (2009). Positive self-statements: power for some, peril for others. Psychological Science, 20, 860–866.',
  'Young, J. E., Klosko, J. S. & Weishaar, M. E. (2003). Schema Therapy: A Practitioner’s Guide. Guilford.',
];

export function BackgroundPage() {
  const { lang } = useI18n();
  const de = lang === 'de';
  return (
    <div className="container section stack stack-lg background">
      <header className="prose stack">
        <h1>{de ? 'Hintergrund' : 'Background'}</h1>
        <p className="lead">
          {de
            ? 'Woraus diese Sitzung gebaut ist, was die Forschung dazu sagt – und was nicht.'
            : 'What this session is built from, what research says about it — and what it does not.'}
        </p>
        <nav className="toc" aria-label={de ? 'Inhalt' : 'Contents'}>
          <a href="#modell" onClick={(e) => { e.preventDefault(); document.getElementById('modell')?.scrollIntoView(); }}>{de ? 'Das Modell' : 'The model'}</a>
          <a href="#beduerfnisse" onClick={(e) => { e.preventDefault(); document.getElementById('beduerfnisse')?.scrollIntoView(); }}>{de ? 'Bedürfnisse' : 'Needs'}</a>
          <a href="#saetze" onClick={(e) => { e.preventDefault(); document.getElementById('saetze')?.scrollIntoView(); }}>{de ? 'Glaubenssätze' : 'Core beliefs'}</a>
          <a href="#beschuetzer" onClick={(e) => { e.preventDefault(); document.getElementById('beschuetzer')?.scrollIntoView(); }}>{de ? 'Beschützer' : 'Protectors'}</a>
          <a href="#forschung" onClick={(e) => { e.preventDefault(); document.getElementById('forschung')?.scrollIntoView(); }}>{de ? 'Forschung' : 'Research'}</a>
          <a href="#literatur" onClick={(e) => { e.preventDefault(); document.getElementById('literatur')?.scrollIntoView(); }}>{de ? 'Literatur' : 'Literature'}</a>
        </nav>
      </header>

      <section id="modell" className="prose stack">
        <h2>{de ? 'Das Modell' : 'The model'}</h2>
        <p>
          {de
            ? 'Die Sitzung verbindet vier Bausteine: das Bild vom inneren Kind mit Sonnen- und Schattenseite (Stahl, Bradshaw), die emotionalen Grundbedürfnisse und die Nachbeelterung aus der Schematherapie (Young), die Beschützer-Arbeit aus Internal Family Systems (Schwartz) und die Stabilisierungsübungen der Imaginationsarbeit (Reddemann). Dazu kommen Selbstmitgefühl (Neff, Gilbert) und Wenn-dann-Pläne (Gollwitzer) für den Alltag.'
            : 'The session combines four building blocks: the image of the inner child with a sunny and a shadow side (Stahl, Bradshaw), the core emotional needs and reparenting from schema therapy (Young), protector work from Internal Family Systems (Schwartz) and the stabilisation exercises of imagery work (Reddemann). Added to these are self-compassion (Neff, Gilbert) and if-then plans (Gollwitzer) for daily life.'}
        </p>
        <p>
          {de
            ? 'Der Ablauf folgt dem Grundsatz „Stabilisierung vor Konfrontation“: Erst werden Kraftquellen aufgebaut, dann wird zurückgeschaut, dann begegnet – und jede Sitzung endet stabilisiert.'
            : 'The sequence follows the principle “stabilisation before confrontation”: first resources are built, then we look back, then we meet — and every session ends in a stable place.'}
        </p>
      </section>

      <section id="beduerfnisse" className="stack">
        <h2>{de ? 'Die sieben Bedürfnisse' : 'The seven needs'}</h2>
        <div className="grid grid--2">
          {needs.map((n) => (
            <article key={n.id} className="card stack stack-sm">
              <h3 className="card__title">{n.name[lang]}</h3>
              <p className="muted">{n.childVoice[lang]}</p>
              <p className="small">{n.description[lang]}</p>
              <p className="small">
                <em>{de ? 'Wenn es fehlte: ' : 'When it was missing: '}</em>
                {n.signs[lang]}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="saetze" className="stack">
        <h2>{de ? 'Die fünfzehn Glaubenssätze' : 'The fifteen core beliefs'}</h2>
        <div className="grid grid--2">
          {beliefs.map((b) => (
            <article key={b.id} className="card stack stack-sm">
              <p className="belief-quote">„{b.text[lang]}“</p>
              <p className="small muted">{b.feels[lang]}</p>
              <p className="small">{b.origin[lang]}</p>
              <p className="small">
                <em>{de ? 'Neu, zum Beispiel: ' : 'New, for example: '}</em>„{b.counters[0][lang]}“
              </p>
            </article>
          ))}
        </div>
      </section>

      <section id="beschuetzer" className="stack">
        <h2>{de ? 'Die zwölf Beschützer' : 'The twelve protectors'}</h2>
        <div className="grid grid--3">
          {protectors.map((p) => (
            <article key={p.id} className="card stack stack-sm">
              <h3 className="card__title">{p.name[lang]}</h3>
              <p className="small muted">„{p.voice[lang]}“</p>
              <p className="small"><em>{de ? 'Schützt ' : 'Protects '}</em>{p.protects[lang]}.</p>
              <p className="small"><em>{de ? 'Kostet: ' : 'Costs: '}</em>{p.cost[lang]}.</p>
              <p className="small"><em>{de ? 'Alternative: ' : 'Alternative: '}</em>{p.alternative[lang]}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="forschung" className="prose stack">
        <h2>{de ? 'Was die Forschung sagt' : 'What research says'}</h2>
        <p>
          {de
            ? '„Innere-Kind-Arbeit“ als eigenständiges Verfahren ist kaum mit kontrollierten Studien untersucht; die bekannten Bücher dazu sind Ratgeber, keine Forschungsarbeiten. Mehrere Bausteine, aus denen diese Sitzung besteht, sind dagegen gut belegt:'
            : '“Inner child work” as a method in its own right has hardly been studied in controlled trials; the well-known books on it are self-help guides, not research. Several building blocks this session consists of, however, are well supported:'}
        </p>
        {EVIDENCE.map((e) => (
          <div key={e.title.en}>
            <h3 className="h4">{e.title[lang]}</h3>
            <p>{e.text[lang]}</p>
          </div>
        ))}
      </section>

      <section id="literatur" className="prose stack">
        <h2>{de ? 'Literatur' : 'Literature'}</h2>
        <ul className="literature">
          {LITERATURE.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
