**English** · [Deutsch](README.de.md)

# Innenkind

A guided, self-paced session with your inner child — in the browser, in German
and English, and private by design. It is built like therapy sessions:
arriving, understanding, gathering resources, tracing back, a personal
reflection, meeting the child in imagination, giving it what was missing, and
closing with a letter and a plan for everyday life.

**→ [technikweber.github.io/Innenkind](https://technikweber.github.io/Innenkind/)**

> **Not therapy.** This is guided self-help drawing on established methods. It
> does not replace psychotherapy or a diagnosis and must not be used in an acute
> crisis. Crisis lines for DE, AT, CH and other countries are on the site's
> *Help* page.

## What it does

- **Thirteen phases, about two hours.** Preliminary talk, arriving,
  understanding, resources, tracing back, reflection, meeting, reparenting,
  protectors, new beliefs, letters, daily life, closing. After the reflection
  there is a deliberate pause point, so the session can be split over two
  sittings — like a first consultation and a working session.
- **Three paths.** *Gentle* (no work with distressing memories — the child is
  met at the safe place, from a distance), *Encounter* (the usual route, via an
  affect bridge from a present-day situation) and *Depth* (adds a dialogue with
  your main protector, evidence for new beliefs and a reply letter written with
  the other hand). The preliminary talk suggests a path and says why; switching
  towards *gentle* is possible at any moment, even mid-exercise.
- **A personal reflection.** The answers in the tracing-back phase carry weights on seven core
  needs (after schema therapy and Grawe), fifteen core beliefs and twelve
  protective strategies. The result is presented the way a therapist would
  summarise a conversation — cautiously, with “does that fit?”, and every
  score can be expanded to show which answers produced it.
- **It responds.** At the points where a therapist would react — how you feel
  towards the child (compassion, emptiness, irritation, rejection, fear), how
  the child reacts to what you say, how a protector takes your offer — the
  session answers with its own text. Irritation towards the child, for
  instance, is treated as a protective part that can be asked to step back
  (IFS), not as a failure.
- **Imagery rescripting, built from your answers.** The new scene is assembled
  from what the child needs (protection, comfort, being seen, permission to
  feel, confidence, play, someone taking responsibility, getting out). At the
  safe place, versions that confront adults are replaced with gentle ones.
- **Sentence by sentence.** Guided texts appear one line at a time with a
  suggested pause, can advance automatically and can be read aloud by the
  browser.
- **Safety first.** Safety question at the start (acute risk stops the session
  and shows crisis lines), distress measured before and after the imagery,
  explicit titration (“a situation at 3–6 out of 10, not the worst”), a pause
  button on every page with an emergency kit, and every session ends
  stabilised (vault, safe place, 5-4-3-2-1). A closing recommendation for
  professional help appears when answers suggest it.
- **Something to take home.** Your sentences for the child, old and new
  beliefs with believability ratings, an editable letter drafted from the
  session, an if-then plan, small steps per need, a play idea from what you
  loved as a child, and a seven-day plan to tick off. Printable and
  downloadable as a text file.
- **Beyond the hour.** A three-minute daily ritual and a library of 14 guided
  exercises (safe place, helper, vault, butterfly hug, self-compassion break,
  childhood photo, letter with the other hand, protector dialogue …).
- **Private.** No server, no account, no analytics, no cookies, no external
  fonts. Answers live in `sessionStorage` and vanish with the tab unless you
  explicitly choose to keep them on the device. Unlike LinuxKompass, nothing is
  put into the URL — these answers do not belong in browser history or shared
  links.
- German and English throughout, light and dark themes, keyboard and screen
  reader friendly, prints cleanly.

## Where it comes from

Transactional analysis (Berne), Bradshaw and Whitfield, Stefanie Stahl's
sunshine and shadow child, schema therapy (Young; Arntz & Jacob) with its core
needs, child modes and imagery rescripting, Internal Family Systems (Schwartz),
Luise Reddemann's stabilisation techniques, Compassion Focused Therapy
(Gilbert), mindful self-compassion (Neff & Germer), the affect bridge
(Watkins) and implementation intentions (Gollwitzer). The *Background* page
explains the model, lists the research honestly — “inner child work” as such
is barely studied, several of its components are well supported — and gives
the literature.

The full design document is in [`docs/KONZEPT.md`](docs/KONZEPT.md) (German).

## Development

```bash
npm install
npm run dev        # local development server
npm run test:run   # tests
npm run build      # production build into dist/
```

Vite, React 19 and TypeScript, no other runtime dependencies. All content —
needs, beliefs, protectors, questions with their weights, exercises and the
session flow — is plain, typed data in `src/data/`. The logic that evaluates
answers and composes scene, sentences, letter and plan lives in `src/engine/`.

The tests check that every text exists in both languages, that placeholders
match between languages, that German quotation marks are paired, that all
references between answers, needs, beliefs and protectors are valid, that
every path starts with the safety question and ends stabilised, that the
gentle path never leads into a distressing memory, and that the evaluation
produces the expected results for typical constellations.

Every push to `main` is built and deployed to GitHub Pages by GitHub Actions.

## Contributing

Corrections are very welcome — especially misleading wording, outdated crisis
numbers or places where the session could feel unsafe. Please keep both `de`
and `en` filled in; the tests will fail otherwise.

## License

[MIT](LICENSE).
