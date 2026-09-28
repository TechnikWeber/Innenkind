[English](README.md) · **Deutsch**

# Innenkind

Eine geführte Sitzung mit deinem inneren Kind – im Browser, auf Deutsch und
Englisch, und privat von Grund auf. Aufgebaut wie Therapiestunden: ankommen,
verstehen, Kraftquellen sammeln, zurückschauen, eine persönliche Spiegelung,
dem Kind in der Vorstellung begegnen, ihm geben, was gefehlt hat, und mit einem
Brief und einem Plan für den Alltag abschließen.

**→ [technikweber.github.io/Innenkind](https://technikweber.github.io/Innenkind/)**

> **Keine Therapie.** Das ist geführte Selbsthilfe auf Grundlage bewährter
> Methoden. Sie ersetzt keine Psychotherapie und keine Diagnose und ist nicht für
> akute Krisen gedacht. Krisennummern für Deutschland, Österreich, die Schweiz
> und weitere Länder stehen auf der Seite unter *Hilfe*.

## Was die Seite kann

- **Dreizehn Phasen, etwa zwei Stunden.** Vorgespräch, Ankommen, Verstehen,
  Kraftquellen, Spurensuche, Spiegelung, Begegnung, Nachnähren, Beschützer,
  neue Sätze, Briefe, Alltag, Abschluss. Nach der Spiegelung gibt es eine
  bewusste Pausenstelle – die Sitzung lässt sich auf zwei Termine verteilen,
  wie Erstgespräch und Arbeitssitzung.
- **Drei Wege.** *Sanft* (keine Arbeit an belastenden Erinnerungen – das Kind
  wird am sicheren Ort und aus Distanz getroffen), *Begegnung* (der Regelfall,
  über eine Gefühlsbrücke aus einer Situation von heute) und *Tiefe* (zusätzlich
  ein Dialog mit dem wichtigsten Beschützer, Belege für die neuen Sätze und ein
  Antwortbrief mit der anderen Hand). Das Vorgespräch schlägt einen Weg vor und
  begründet ihn; Richtung *sanft* wechseln geht jederzeit, auch mitten in einer
  Übung.
- **Eine persönliche Spiegelung.** Die Antworten der Spurensuche tragen
  Gewichte auf sieben Grundbedürfnisse (nach Schematherapie und Grawe),
  fünfzehn Glaubenssätze und zwölf Schutzstrategien. Das Ergebnis wird so
  zusammengefasst, wie eine Therapeutin ein Gespräch zusammenfasst – vorsichtig,
  mit „Passt das?", und zu jedem Wert lässt sich aufklappen, welche Antworten
  dazu geführt haben.
- **Sie antwortet.** An den Stellen, an denen eine Therapeutin reagieren würde –
  wie du dich dem Kind gegenüber fühlst (Mitgefühl, Leere, Ungeduld,
  Ablehnung, Angst), wie das Kind auf deine Worte reagiert, wie ein Beschützer
  dein Angebot aufnimmt – antwortet die Sitzung mit eigenem Text. Ungeduld
  gegenüber dem Kind etwa wird als Beschützer-Anteil verstanden, der einen
  Schritt zurücktreten darf (IFS), nicht als Versagen.
- **Imagery Rescripting aus deinen Antworten.** Die neue Szene setzt sich aus
  dem zusammen, was das Kind braucht (Schutz, Trost, Gesehenwerden, Erlaubnis
  zu fühlen, Zutrauen, Spiel, jemand, der Verantwortung übernimmt, raus aus der
  Situation). Am sicheren Ort werden Fassungen, die Erwachsene konfrontieren,
  durch sanfte ersetzt.
- **Satz für Satz.** Geführte Texte erscheinen einzeln mit empfohlener Pause,
  können automatisch weiterlaufen und vom Browser vorgelesen werden.
- **Sicherheit zuerst.** Sicherheitsfrage zu Beginn (bei akuter Gefahr hält die
  Sitzung an und zeigt Krisennummern), Belastung vor und nach der Imagination,
  ausdrückliche Dosierung („eine Situation bei 3–6 von 10, nicht die
  schlimmste"), ein Pause-Knopf mit Notfallkoffer auf jeder Seite, und jede
  Sitzung endet stabilisiert (Tresor, sicherer Ort, 5-4-3-2-1). Sprechen die
  Antworten dafür, empfiehlt der Abschluss ausdrücklich professionelle Hilfe.
- **Etwas zum Mitnehmen.** Deine Sätze für das Kind, alte und neue
  Glaubenssätze mit Einschätzung, ein bearbeitbarer Brief, der aus der Sitzung
  entworfen wird, ein Wenn-dann-Plan, kleine Schritte je Bedürfnis, eine
  Spielidee aus dem, was du als Kind geliebt hast, und ein Sieben-Tage-Plan
  zum Abhaken. Druckbar und als Textdatei herunterladbar.
- **Über die Stunde hinaus.** Ein tägliches Drei-Minuten-Ritual und eine
  Bibliothek mit 14 geführten Übungen (sicherer Ort, Helferfigur, Tresor,
  Schmetterlingsumarmung, Selbstmitgefühls-Pause, Kinderfoto, Brief mit der
  anderen Hand, Beschützer-Dialog …).
- **Privat.** Kein Server, kein Konto, keine Statistik, keine Cookies, keine
  externen Schriften. Antworten liegen im `sessionStorage` und verschwinden mit
  dem Tab – außer du entscheidest dich ausdrücklich fürs Speichern auf dem
  Gerät. Anders als beim LinuxKompass steht nichts in der Adresszeile: Diese
  Antworten gehören nicht in den Verlauf oder in geteilte Links.
- Durchgehend Deutsch und Englisch, helles und dunkles Design, mit Tastatur und
  Vorleseprogramm bedienbar, druckt sauber.

## Woher das kommt

Transaktionsanalyse (Berne), Bradshaw und Whitfield, Sonnenkind und
Schattenkind nach Stefanie Stahl, Schematherapie (Young; Arntz & Jacob) mit
Grundbedürfnissen, Kind-Modi und Imagery Rescripting, Internal Family Systems
(Schwartz), die Stabilisierungsübungen von Luise Reddemann, Compassion Focused
Therapy (Gilbert), Selbstmitgefühl (Neff & Germer), die Affektbrücke (Watkins)
und Durchführungsintentionen (Gollwitzer). Die Seite *Hintergrund* erklärt das
Modell, stellt die Studienlage ehrlich dar – „Innere-Kind-Arbeit" als solche
ist kaum untersucht, mehrere ihrer Bausteine sind gut belegt – und nennt die
Literatur.

Das vollständige Konzept steht in [`docs/KONZEPT.md`](docs/KONZEPT.md).

## Entwicklung

```bash
npm install
npm run dev        # lokaler Entwicklungsserver
npm run test:run   # Tests
npm run build      # Produktionsbau nach dist/
```

Vite, React 19 und TypeScript, keine weiteren Laufzeitabhängigkeiten. Alle
Inhalte – Bedürfnisse, Glaubenssätze, Beschützer, Fragen mit ihren Gewichten,
Übungen und der Sitzungsablauf – liegen als schlichte, typisierte Daten in
`src/data/`. Die Logik, die Antworten auswertet und daraus Szene, Sätze, Brief
und Plan zusammensetzt, steht in `src/engine/`.

Die Tests prüfen, dass jeder Text in beiden Sprachen vorliegt, Platzhalter in
beiden Sprachen übereinstimmen, deutsche Anführungszeichen paarweise gesetzt
sind, alle Verweise zwischen Antworten, Bedürfnissen, Glaubenssätzen und
Beschützern gültig sind, jeder Weg mit der Sicherheitsfrage beginnt und
stabilisiert endet, der sanfte Weg nie in eine belastende Erinnerung führt und
die Auswertung für typische Konstellationen das Erwartete liefert.

Jeder Push auf `main` wird per GitHub Actions gebaut und auf GitHub Pages
veröffentlicht.

## Mitmachen

Korrekturen sind sehr willkommen – besonders missverständliche Formulierungen,
veraltete Krisennummern oder Stellen, an denen sich die Sitzung unsicher
anfühlen könnte. Bitte immer `de` und `en` ausfüllen, sonst schlagen die Tests
fehl.

## Lizenz

MIT – siehe [LICENSE](LICENSE).
