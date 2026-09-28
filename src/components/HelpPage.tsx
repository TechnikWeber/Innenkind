import { HELP_CHECKED, therapySteps } from '../data/help';
import { useI18n } from '../i18n';
import { Callout } from './common';
import { CrisisLines } from './CrisisLines';

export function HelpPage() {
  const { lang } = useI18n();
  const de = lang === 'de';
  return (
    <div className="container section stack stack-lg">
      <header className="prose stack">
        <h1>{de ? 'Hilfe' : 'Help'}</h1>
        <Callout tone="critical" title={de ? 'Wenn du gerade in Gefahr bist' : 'If you are in danger right now'}>
          <p>
            {de
              ? 'Ruf den Notruf 112 an oder geh in die Notaufnahme des nächsten Krankenhauses. Wenn du Gedanken hast, dir etwas anzutun: Du musst damit nicht allein bleiben. Die Telefonseelsorge ist kostenlos, anonym und rund um die Uhr erreichbar: 0800 111 0 111.'
              : 'Call your local emergency number (112 in Europe, 911 in the US) or go to the nearest emergency department. If you are having thoughts of harming yourself: you don’t have to stay alone with them. Crisis lines are free and anonymous — see below.'}
          </p>
        </Callout>
      </header>

      <section className="stack">
        <h2>{de ? 'Krisen- und Beratungsnummern' : 'Crisis and advice lines'}</h2>
        <CrisisLines />
        <p className="muted small">
          {de ? 'Stand der Nummern: ' : 'Numbers checked: '}
          <time dateTime={HELP_CHECKED}>{HELP_CHECKED}</time>
        </p>
      </section>

      <section className="prose stack">
        <h2>{de ? 'Wann du dir Begleitung holen solltest' : 'When you should get support'}</h2>
        <ul>
          <li>{de ? 'Du hast Gewalt, sexuelle Übergriffe oder schwere Vernachlässigung erlebt.' : 'You have experienced violence, sexual abuse or severe neglect.'}</li>
          <li>{de ? 'Du driftest bei Erinnerungen weg, hast Filmrisse oder wirst von Bildern überflutet.' : 'You drift away with memories, have blackouts or are flooded by images.'}</li>
          <li>{de ? 'Es geht dir seit Wochen schlecht – Schlaf, Appetit, Antrieb oder Freude sind deutlich verändert.' : 'You have been feeling bad for weeks — sleep, appetite, drive or joy have clearly changed.'}</li>
          <li>{de ? 'Du hast Gedanken, nicht mehr leben zu wollen.' : 'You have thoughts of not wanting to live.'}</li>
          <li>{de ? 'Du betäubst dich regelmäßig mit Alkohol, Medikamenten oder anderen Mitteln.' : 'You regularly numb yourself with alcohol, medication or other substances.'}</li>
          <li>{de ? 'Nach einer Sitzung wie dieser geht es dir mehrere Tage schlechter statt besser.' : 'After a session like this one you feel worse rather than better for several days.'}</li>
        </ul>
        <p>
          {de
            ? 'Hilfe zu suchen ist keine Niederlage. Es ist genau das, was du einem Kind in deiner Lage raten würdest.'
            : 'Seeking help is not defeat. It is exactly what you would advise a child in your situation to do.'}
        </p>
      </section>

      <section className="prose stack">
        <h2>{de ? 'Wege zu einer Psychotherapie' : 'Routes to psychotherapy'}</h2>
        {therapySteps.map((s) => (
          <div key={s.title.de}>
            <h3 className="h4">{s.title[lang]}</h3>
            <p>{s.text[lang]}</p>
          </div>
        ))}
        {!de && (
          <p className="muted">
            Outside Germany, your GP or family doctor is usually the best first step. In the UK, you can also self-refer to NHS Talking Therapies.
          </p>
        )}
      </section>
    </div>
  );
}
