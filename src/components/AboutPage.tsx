import { useI18n } from '../i18n';
import { useSession } from '../state/session';
import { Link } from './common';

export function AboutPage() {
  const { lang } = useI18n();
  const { persist } = useSession();
  const de = lang === 'de';
  return (
    <div className="container container--narrow section stack stack-lg">
      <header className="stack">
        <h1>{de ? 'Über Innenkind' : 'About Innenkind'}</h1>
        <p className="lead">
          {de
            ? 'Eine freie, quelloffene Seite, die dich durch eine Sitzung mit deinem inneren Kind führt – so nah an einer Therapiestunde, wie es eine Webseite verantwortbar sein kann.'
            : 'A free, open-source site that guides you through a session with your inner child — as close to a therapy hour as a website can responsibly be.'}
        </p>
      </header>

      <section className="stack">
        <h2>{de ? 'Was die Seite nicht ist' : 'What the site is not'}</h2>
        <p>
          {de
            ? 'Kein Medizinprodukt, keine Diagnose, keine Therapie. Die Inhalte sind sorgfältig aus der Fachliteratur zusammengestellt, aber nicht von einer Ethikkommission geprüft und nicht in Studien getestet. Sie ersetzen kein Gespräch mit einer Ärztin, einem Psychotherapeuten oder einer Beratungsstelle.'
            : 'Not a medical device, not a diagnosis, not therapy. The content has been carefully compiled from the professional literature, but has not been reviewed by an ethics committee or tested in studies. It does not replace a conversation with a doctor, a psychotherapist or a counselling service.'}
        </p>
      </section>

      <section className="stack">
        <h2>{de ? 'Datenschutz' : 'Privacy'}</h2>
        <ul>
          <li>{de ? 'Die Seite ist eine statische Datei auf GitHub Pages. Es gibt keinen eigenen Server, kein Konto, keine Datenbank.' : 'The site is a static file on GitHub Pages. There is no server of its own, no account, no database.'}</li>
          <li>{de ? 'Keine Statistik, keine Cookies, keine externen Schriften oder Skripte. GitHub protokolliert als Hoster technisch notwendige Zugriffsdaten (z. B. IP-Adresse).' : 'No analytics, no cookies, no external fonts or scripts. As the host, GitHub logs technically necessary access data (e.g. IP address).'}</li>
          <li>{de ? 'Deine Antworten liegen im Sitzungsspeicher deines Browsers und verschwinden, wenn du den Tab schließt – außer du wählst im Protokoll ausdrücklich „Auf diesem Gerät speichern“.' : 'Your answers are kept in your browser’s session storage and disappear when you close the tab — unless you explicitly choose “Keep on this device” in the record.'}</li>
          <li>{de ? 'Nichts davon steht in der Adresszeile. Ein Link auf diese Seite verrät nichts über dich.' : 'None of it appears in the address bar. A link to this site reveals nothing about you.'}</li>
          <li>{de ? 'Das Vorlesen nutzt die Sprachausgabe deines Browsers. Manche Browser verarbeiten den Text dafür auf Servern ihres Herstellers; ist dir das nicht recht, lass das Vorlesen aus.' : 'Reading aloud uses your browser’s speech output. Some browsers process the text on their vendor’s servers for this; if you are not comfortable with that, leave reading aloud off.'}</li>
          <li>
            {de ? 'Aktuell: ' : 'Currently: '}
            <strong>{persist ? (de ? 'Protokoll wird auf diesem Gerät gespeichert.' : 'Record is kept on this device.') : de ? 'nichts dauerhaft gespeichert.' : 'nothing stored permanently.'}</strong>{' '}
            <Link to={{ name: 'result' }}>{de ? 'Zum Protokoll' : 'Go to the record'}</Link>
          </li>
        </ul>
      </section>

      <section className="stack">
        <h2>{de ? 'Wie die Seite gebaut ist' : 'How the site is built'}</h2>
        <p>
          {de
            ? 'Im gleichen Stil wie der LinuxKompass: React und TypeScript, keine weiteren Abhängigkeiten, Deutsch und Englisch, helles und dunkles Design, mit Tastatur und Vorleseprogramm bedienbar, druckt sauber. Alle Inhalte – Bedürfnisse, Glaubenssätze, Beschützer, Übungen und der Sitzungsablauf – liegen als lesbare Daten im Repository. Tests prüfen, dass beide Sprachen überall vorhanden sind und die Auswertung nachvollziehbar bleibt.'
            : 'In the same style as LinuxKompass: React and TypeScript, no other dependencies, German and English, light and dark themes, usable with keyboard and screen reader, prints cleanly. All content — needs, core beliefs, protectors, exercises and the session flow — lives as readable data in the repository. Tests check that both languages are present everywhere and that the evaluation stays traceable.'}
        </p>
        <p>
          <a href="https://github.com/TechnikWeber/Innenkind" target="_blank" rel="noreferrer noopener">
            github.com/TechnikWeber/Innenkind
          </a>
          {' · '}
          <a href="https://technikweber.github.io/LinuxKompass/" target="_blank" rel="noreferrer noopener">
            LinuxKompass
          </a>
        </p>
        <p className="muted small">
          {de
            ? 'Hinweise auf Fehler, missverständliche Formulierungen oder fehlende Hilfsangebote sind sehr willkommen – am liebsten als Issue auf GitHub.'
            : 'Reports of errors, misleading wording or missing sources of help are very welcome — ideally as an issue on GitHub.'}
        </p>
      </section>
    </div>
  );
}
