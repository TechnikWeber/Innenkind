import type { L10n } from '../data/types';

/**
 * Oberflächentexte. Flach gehalten wie im LinuxKompass: ein Schlüssel, zwei
 * Sprachen. Inhaltliche Texte der Sitzung stehen in `data/`, nicht hier.
 */
export const ui = {
  // --- Rahmen ---
  appName: { de: 'Innenkind', en: 'Innenkind' },
  tagline: { de: 'Eine geführte Sitzung mit deinem inneren Kind', en: 'A guided session with your inner child' },
  skipToContent: { de: 'Zum Inhalt springen', en: 'Skip to content' },
  langSwitch: { de: 'Sprache', en: 'Language' },
  themeToDark: { de: 'Auf dunkles Design umschalten', en: 'Switch to the dark theme' },
  themeToLight: { de: 'Auf helles Design umschalten', en: 'Switch to the light theme' },
  navHome: { de: 'Start', en: 'Home' },
  navSession: { de: 'Sitzung', en: 'Session' },
  navDaily: { de: 'Täglich', en: 'Daily' },
  navExercises: { de: 'Übungen', en: 'Exercises' },
  navBackground: { de: 'Hintergrund', en: 'Background' },
  navHelp: { de: 'Hilfe', en: 'Help' },
  navAbout: { de: 'Über', en: 'About' },
  navResult: { de: 'Protokoll', en: 'Record' },
  footerBlurb: {
    de: 'Geführte Selbsthilfe, angelehnt an Schematherapie, Imaginationsarbeit und Selbstmitgefühl. Kein Ersatz für Psychotherapie. Quelloffen, ohne Werbung, ohne Nutzerverfolgung.',
    en: 'Guided self-help drawing on schema therapy, imagery work and self-compassion. No substitute for psychotherapy. Open source, no ads, no tracking.',
  },
  footerCrisis: { de: 'In einer Krise', en: 'In a crisis' },
  footerCrisisText: {
    de: 'Telefonseelsorge (DE): 0800 111 0 111 · Notruf 112 · alle Nummern unter „Hilfe“',
    en: 'Emergency: 112 (EU) · 988 (US) · 116 123 (UK) · all numbers under “Help”',
  },
  footerSource: { de: 'Quellcode', en: 'Source code' },

  // --- Allgemein ---
  next: { de: 'Weiter', en: 'Continue' },
  back: { de: 'Zurück', en: 'Back' },
  minutesShort: { de: '{n} Min.', en: '{n} min' },
  aboutMinutes: { de: 'ca. {n} Minuten', en: 'about {n} minutes' },
  optional: { de: 'freiwillig', en: 'optional' },
  chooseUpTo: { de: 'bis zu {n}', en: 'up to {n}' },
  suggested: { de: 'vorgeschlagen', en: 'suggested' },
  print: { de: 'Drucken oder als PDF sichern', en: 'Print or save as PDF' },
  download: { de: 'Als Textdatei herunterladen', en: 'Download as text file' },
  open: { de: 'Öffnen', en: 'Open' },
  start: { de: 'Starten', en: 'Start' },
  close: { de: 'Schließen', en: 'Close' },
  source: { de: 'Quelle', en: 'Source' },
  valueOf: { de: '{n} von 10', en: '{n} out of 10' },
  notAnswered: { de: 'noch nicht eingeschätzt', en: 'not rated yet' },

  // --- Pfade ---
  pathGentle: { de: 'Sanft', en: 'Gentle' },
  pathStandard: { de: 'Begegnung', en: 'Encounter' },
  pathDeep: { de: 'Tiefe', en: 'Depth' },
  pathGentleDesc: {
    de: 'Stärken, beruhigen und dem Kind am sicheren Ort begegnen – ohne belastende Erinnerungen. Für hohe Belastung, bekannte Traumatisierung oder den ersten Kontakt mit innerer Arbeit.',
    en: 'Strengthen, calm and meet the child at your safe place — without distressing memories. For high distress, known trauma or a first contact with inner work.',
  },
  pathStandardDesc: {
    de: 'Der Regelfall: Spurensuche, Begegnung über eine Situation von heute, Nachnähren in der Vorstellung, Brief und Alltagsplan.',
    en: 'The usual route: tracing back, meeting via a situation from today, reparenting in imagination, a letter and a daily plan.',
  },
  pathDeepDesc: {
    de: 'Alles aus „Begegnung“, dazu ein Dialog mit deinem wichtigsten Beschützer, Belege für die neuen Sätze und ein Antwortbrief des Kindes mit der anderen Hand.',
    en: 'Everything in “Encounter”, plus a dialogue with your main protector, evidence for the new beliefs and a reply letter from the child written with your other hand.',
  },
  pathRecommended: { de: 'Empfohlen', en: 'Recommended' },
  pathChosen: { de: 'Gewählt', en: 'Chosen' },
  pathChoose: { de: 'Diesen Weg wählen', en: 'Choose this path' },
  pathSwitchNote: {
    de: 'Du kannst jederzeit wechseln. Richtung „sanft“ geht immer, auch mitten in einer Übung.',
    en: 'You can switch at any time. Moving towards “gentle” is always possible, even in the middle of an exercise.',
  },

  // --- Sitzung ---
  sessionProgress: { de: 'Fortschritt', en: 'Progress' },
  sessionRemaining: { de: 'noch etwa {n} Min.', en: 'about {n} min left' },
  sessionPath: { de: 'Weg', en: 'Path' },
  sessionStepOf: { de: 'Schritt {a} von {b}', en: 'Step {a} of {b}' },
  sessionFinish: { de: 'Zum Sitzungsprotokoll', en: 'Go to the session record' },
  sessionResume: { de: 'Sitzung fortsetzen', en: 'Resume session' },
  sessionReset: { de: 'Sitzung zurücksetzen', en: 'Reset session' },
  sessionResetConfirm: {
    de: 'Neu beginnen? Alle Antworten dieser Sitzung werden verworfen.',
    en: 'Start over? All answers in this session will be discarded.',
  },
  sessionResetYes: { de: 'Ja, neu beginnen', en: 'Yes, start over' },
  sessionRestart: { de: 'Neue Sitzung beginnen', en: 'Begin a new session' },
  sessionPhases: { de: 'Phasen', en: 'Phases' },
  sessionMakeGentle: { de: 'Auf den sanften Weg wechseln', en: 'Switch to the gentle path' },
  sessionBlockedHint: { de: 'Bitte schau dir zuerst die Hinweise oben an.', en: 'Please look at the information above first.' },

  // --- Pause ---
  pauseButton: { de: 'Pause', en: 'Pause' },
  pauseButtonLong: { de: 'Pause – mir wird es gerade zu viel', en: 'Pause — this is getting too much' },
  pauseTitle: { de: 'Kurz innehalten', en: 'Taking a moment' },
  pauseLead: {
    de: 'Gut, dass du auf Pause gedrückt hast. Das ist genau das, was ein fürsorglicher Erwachsener tut: merken, wenn es zu viel wird, und anhalten.',
    en: 'Good that you pressed pause. That is exactly what a caring adult does: notice when it gets too much, and stop.',
  },
  pauseAnchors: { de: 'Was sofort hilft', en: 'What helps right away' },
  pauseContinue: { de: 'Weiter, wo ich war', en: 'Continue where I was' },
  pauseGentle: { de: 'Sanfter weitermachen', en: 'Continue more gently' },
  pauseGentleHint: { de: 'Wechselt auf den sanften Weg: keine belastenden Erinnerungen mehr, nur noch sicherer Ort und Stärkung.', en: 'Switches to the gentle path: no more distressing memories, only the safe place and strengthening.' },
  pauseClose: { de: 'Sitzung behutsam abschließen', en: 'Close the session gently' },
  pauseCloseHint: { de: 'Springt zum Abschluss: Tresor, Rückweg ins Hier und Jetzt, Nachspüren.', en: 'Jumps to the closing: vault, return to the here and now, noticing.' },
  pauseHelp: { de: 'Hilfe und Krisennummern', en: 'Help and crisis lines' },

  // --- Geführte Texte ---
  guidedNext: { de: 'Nächster Satz', en: 'Next sentence' },
  guidedAll: { de: 'Alles auf einmal zeigen', en: 'Show everything at once' },
  guidedRestart: { de: 'Von vorn', en: 'From the start' },
  guidedRead: { de: 'Vorlesen', en: 'Read aloud' },
  guidedReadStop: { de: 'Vorlesen anhalten', en: 'Stop reading' },
  guidedAuto: { de: 'Automatisch weiter', en: 'Advance automatically' },
  guidedDone: { de: 'Ende der Übung. Lass dir Zeit, bevor du weitergehst.', en: 'End of the exercise. Take your time before moving on.' },
  guidedReadNote: {
    de: 'Das Vorlesen übernimmt die Sprachausgabe deines Browsers. Je nach Browser kann sie über Server des Herstellers laufen.',
    en: 'Reading aloud uses your browser’s speech output. Depending on the browser, it may run through the vendor’s servers.',
  },
  guidedPause: { de: 'Pause: {n} Sekunden', en: 'Pause: {n} seconds' },
  breathIn: { de: 'Einatmen', en: 'Breathe in' },
  breathOut: { de: 'Ausatmen', en: 'Breathe out' },
  breathStart: { de: 'Atemkreis starten', en: 'Start breathing circle' },
  breathStop: { de: 'Anhalten', en: 'Stop' },

  // --- Start ---
  heroKicker: { de: 'Selbsthilfe mit Tiefgang – ehrlich über ihre Grenzen', en: 'Self-help with depth — honest about its limits' },
  heroTitle: { de: 'Dem Kind begegnen, das du einmal warst', en: 'Meet the child you once were' },
  heroLead: {
    de: 'Eine ausführliche, geführte Sitzung, aufgebaut wie Therapiestunden: ankommen, verstehen, Kraft sammeln, zurückschauen, dem inneren Kind begegnen, ihm geben, was gefehlt hat – und mit einem Brief und einem Plan für den Alltag abschließen. Etwa zwei Stunden, gut auf zwei Termine verteilbar.',
    en: 'A thorough guided session, structured like therapy sessions: arrive, understand, gather strength, look back, meet your inner child, give it what was missing — and finish with a letter and a plan for everyday life. About two hours, easy to split over two sittings.',
  },
  heroStart: { de: 'Sitzung beginnen', en: 'Begin the session' },
  heroDaily: { de: 'Tägliches Ritual', en: 'Daily ritual' },
  heroPrivacy: { de: 'Alles bleibt in deinem Browser. Kein Konto, kein Server, keine Statistik.', en: 'Everything stays in your browser. No account, no server, no analytics.' },

  // --- Protokoll ---
  resultTitle: { de: 'Dein Sitzungsprotokoll', en: 'Your session record' },
  resultEmpty: { de: 'Noch keine Sitzung. Beginne eine, dann entsteht hier dein Protokoll.', en: 'No session yet. Begin one and your record will appear here.' },
  resultKeep: { de: 'Auf diesem Gerät speichern', en: 'Keep on this device' },
  resultKeepHint: {
    de: 'Ohne Speichern verschwindet alles, wenn du diesen Tab schließt. Mit Speichern bleibt es in diesem Browser, bis du es löschst – dann kannst du Plan und Ritual in den nächsten Tagen weiterverwenden.',
    en: 'Without saving, everything disappears when you close this tab. With saving, it stays in this browser until you delete it — so you can keep using the plan and ritual over the coming days.',
  },
  resultKept: { de: 'Wird auf diesem Gerät gespeichert', en: 'Being kept on this device' },
  resultDelete: { de: 'Alles löschen', en: 'Delete everything' },
  resultDeleteConfirm: { de: 'Wirklich löschen? Das lässt sich nicht rückgängig machen.', en: 'Really delete? This cannot be undone.' },
  resultDeleteYes: { de: 'Ja, alles löschen', en: 'Yes, delete everything' },
  resultNew: { de: 'Neue Sitzung', en: 'New session' },
  resultNewKeep: { de: 'Neue Sitzung mit meinen Kraftquellen', en: 'New session with my resources' },
  resultNewKeepHint: {
    de: 'Übernimmt Name, sicheren Ort, Helferfigur und Sonnenkind-Antworten – alles andere beginnt neu.',
    en: 'Keeps the name, safe place, helper and sunshine-child answers — everything else starts fresh.',
  },
  unfinished: { de: 'Diese Sitzung ist noch nicht abgeschlossen.', en: 'This session is not finished yet.' },
} satisfies Record<string, L10n>;

export type UiKey = keyof typeof ui;
