import type { L10n, Option } from './types';

/**
 * Alle Auswahlfragen der Sitzung.
 *
 * Die Gewichte sind bewusst grob (1–3). Sie sollen keine Diagnose stellen,
 * sondern die Spiegelung in Phase 5 begründen können: „Weil du angegeben
 * hast …". Negative Gewichte stehen für Erfahrungen, die ein Bedürfnis gut
 * erfüllt haben – sie ziehen den Wert nach unten, nie unter null.
 */
export interface Question {
  id: string;
  question: L10n;
  hint?: L10n;
  multi?: boolean;
  /** Höchstzahl bei Mehrfachauswahl. */
  max?: number;
  /** Darf leer bleiben. */
  optional?: boolean;
  options: Option[];
}

const dontKnow = (response?: L10n): Option => ({
  id: 'weissNicht',
  label: { de: 'Weiß ich nicht / erinnere ich kaum', en: 'I don’t know / hardly remember' },
  exclusive: true,
  response: response ?? {
    de: 'Das ist häufiger, als man denkt, und kein Fehler. Manche Zeiten liegen im Nebel – oft gerade die, in denen wenig Raum für ein Kind war. Wir arbeiten mit dem, was da ist.',
    en: 'That is more common than you might think, and it is not a failing. Some periods are foggy — often precisely those in which there was little room for a child. We work with what is there.',
  },
});

// ---------------------------------------------------------------------------
// Vorgespräch
// ---------------------------------------------------------------------------

export const safetyQuestion: Question = {
  id: 'safety',
  question: {
    de: 'Hattest du in den letzten Tagen Gedanken, nicht mehr leben zu wollen oder dir etwas anzutun?',
    en: 'In the last few days, have you had thoughts of not wanting to live or of harming yourself?',
  },
  hint: {
    de: 'Diese Frage stellt jede Therapeutin im Erstgespräch. Deine Antwort bleibt auf deinem Gerät.',
    en: 'Every therapist asks this in a first session. Your answer stays on your device.',
  },
  options: [
    { id: 'nein', label: { de: 'Nein', en: 'No' } },
    {
      id: 'fluechtig',
      label: { de: 'Manchmal flüchtig, aber ich bin sicher', en: 'Fleetingly at times, but I am safe' },
      flags: ['fragile'],
      response: {
        de: 'Danke, dass du das so offen sagst. Solche Gedanken zeigen, wie viel du gerade trägst. Wir gehen heute behutsam vor. Bitte sprich in den nächsten Tagen auch mit einem Menschen darüber – einer Freundin, deiner Hausärztin, der Telefonseelsorge (0800 111 0 111, kostenlos, rund um die Uhr). Und wenn die Gedanken drängender werden: Die Hilfe-Seite ist immer einen Klick entfernt.',
        en: 'Thank you for saying this so openly. Thoughts like these show how much you are carrying right now. We will go gently today. Please also talk to someone about it in the coming days — a friend, your doctor, or a helpline. And if the thoughts become more pressing: the help page is always one click away.',
      },
    },
    {
      id: 'akut',
      label: { de: 'Ja, gerade jetzt', en: 'Yes, right now' },
      flags: ['acute'],
    },
  ],
};

export const floodingQuestion: Question = {
  id: 'flooding',
  question: {
    de: 'Kennst du es, dass du bei belastenden Erinnerungen „wegdriftest“, dich unwirklich fühlst, Lücken in der Erinnerung hast oder von Bildern überflutet wirst?',
    en: 'Do you know the experience of “drifting away” with distressing memories, feeling unreal, having gaps in your memory, or being flooded by images?',
  },
  options: [
    { id: 'nein', label: { de: 'Nein, kenne ich nicht', en: 'No, I don’t' } },
    {
      id: 'selten',
      label: { de: 'Selten und nur leicht', en: 'Rarely and only mildly' },
      response: {
        de: 'Gut, dass du darauf achtest. Wenn es heute passiert: Pause-Knopf, Füße auf den Boden, Augen auf, fünf Dinge im Raum benennen.',
        en: 'Good that you pay attention to it. If it happens today: pause button, feet on the floor, eyes open, name five things in the room.',
      },
    },
    {
      id: 'oft',
      label: { de: 'Ja, das passiert mir öfter', en: 'Yes, this happens to me quite often' },
      flags: ['dissociation'],
      response: {
        de: 'Danke für diese wichtige Information. Wer so reagiert, dessen Nervensystem hat gelernt, sich vor Überwältigung zu schützen – das ist eine Fähigkeit, keine Schwäche. Für dich ist der sanfte Weg der richtige: Wir stärken, beruhigen und begegnen dem Kind aus sicherer Entfernung, ohne in belastende Erinnerungen zu gehen. Tiefere Erinnerungsarbeit gehört in eine traumatherapeutische Begleitung.',
        en: 'Thank you for this important information. If you react like this, your nervous system has learned to protect itself from being overwhelmed — that is a capacity, not a weakness. The gentle path is the right one for you: we strengthen, calm and meet the child from a safe distance, without going into distressing memories. Deeper memory work belongs in trauma-informed therapy.',
      },
    },
  ],
};

export const therapyQuestion: Question = {
  id: 'therapy',
  question: { de: 'Bist du zurzeit in psychotherapeutischer Behandlung?', en: 'Are you currently in psychotherapy?' },
  options: [
    { id: 'nein', label: { de: 'Nein', en: 'No' } },
    {
      id: 'ja',
      label: { de: 'Ja', en: 'Yes' },
      flags: ['therapy'],
      response: {
        de: 'Schön, dass du begleitet bist. Sprich diese Sitzung am besten mit deiner Therapeutin oder deinem Therapeuten ab – und bring mit, was hier entsteht. Das Protokoll am Ende lässt sich ausdrucken.',
        en: 'Good that you have support. Ideally, talk this session over with your therapist — and bring along what comes out of it. The record at the end can be printed.',
      },
    },
    {
      id: 'warte',
      label: { de: 'Ich warte auf einen Platz', en: 'I am on a waiting list' },
      response: {
        de: 'Die Wartezeit ist oft zäh. Diese Sitzung kann dir helfen, dich besser zu verstehen und Worte zu finden – die kannst du dann mitnehmen.',
        en: 'Waiting is often hard. This session can help you understand yourself better and find words — which you can then bring along.',
      },
    },
  ],
};

export const timeQuestion: Question = {
  id: 'time',
  question: { de: 'Wie viel ungestörte Zeit hast du?', en: 'How much undisturbed time do you have?' },
  hint: {
    de: 'Die ganze Sitzung dauert etwa zwei Stunden. Sie lässt sich nach der Spiegelung gut auf zwei Tage verteilen.',
    en: 'The whole session takes about two hours. It can easily be split over two days after the reflection.',
  },
  options: [
    { id: 'teilen', label: { de: 'Etwa eine Stunde – ich teile die Sitzung auf zwei Tage auf', en: 'About an hour — I will split the session over two days' } },
    { id: '120', label: { de: 'Etwa zwei Stunden', en: 'About two hours' } },
    { id: '150', label: { de: 'Zweieinhalb Stunden oder mehr', en: 'Two and a half hours or more' } },
  ],
};

export const experienceQuestion: Question = {
  id: 'experience',
  question: {
    de: 'Wie vertraut sind dir innere Bilder, Fantasiereisen oder Meditation?',
    en: 'How familiar are you with inner imagery, guided visualisations or meditation?',
  },
  options: [
    { id: 'neu', label: { de: 'Ganz neu für mich', en: 'Completely new to me' } },
    { id: 'etwas', label: { de: 'Habe ich schon ausprobiert', en: 'I have tried it' } },
    { id: 'vertraut', label: { de: 'Sehr vertraut', en: 'Very familiar' } },
  ],
};

// ---------------------------------------------------------------------------
// Ankommen
// ---------------------------------------------------------------------------

export const concernQuestion: Question = {
  id: 'concern',
  question: { de: 'Was führt dich heute her?', en: 'What brings you here today?' },
  hint: { de: 'Mehrere Antworten möglich.', en: 'Choose as many as apply.' },
  multi: true,
  options: [
    { id: 'beziehung', label: { de: 'Immer wieder dieselben Muster in Beziehungen', en: 'The same patterns in relationships again and again' } },
    { id: 'selbstwert', label: { de: 'Ein wackeliger Selbstwert', en: 'Shaky self-esteem' } },
    { id: 'reaktionen', label: { de: 'Reaktionen, die mir selbst zu heftig vorkommen', en: 'Reactions that seem too strong even to me' } },
    { id: 'angst', label: { de: 'Ängste und Unsicherheit', en: 'Anxiety and insecurity' } },
    { id: 'leere', label: { de: 'Leere oder Traurigkeit', en: 'Emptiness or sadness' } },
    { id: 'erschoepfung', label: { de: 'Erschöpfung vom ständigen Funktionieren', en: 'Exhaustion from always having to function' } },
    { id: 'grenzen', label: { de: 'Schwierigkeiten, Nein zu sagen', en: 'Difficulty saying no' } },
    { id: 'eltern', label: { de: 'Ich will verstehen, was meine Kindheit mit mir gemacht hat', en: 'I want to understand what my childhood did to me' } },
    { id: 'elternschaft', label: { de: 'Ich will meinen eigenen Kindern nicht weitergeben, was ich erlebt habe', en: 'I don’t want to pass on to my children what I went through' } },
    { id: 'neugier', label: { de: 'Neugier – ich möchte mich besser kennenlernen', en: 'Curiosity — I want to get to know myself better' } },
  ],
};

export const goalQuestion: Question = {
  id: 'goal',
  question: { de: 'Was soll am Ende dieser Sitzung ein kleines bisschen anders sein?', en: 'What should be a little bit different at the end of this session?' },
  hint: { de: 'Ein realistisches kleines Ziel ist besser als ein großes.', en: 'A small realistic goal is better than a big one.' },
  options: [
    { id: 'verstehen', label: { de: 'Ich verstehe mich ein Stück besser', en: 'I understand myself a little better' } },
    { id: 'mitgefuehl', label: { de: 'Ich kann etwas freundlicher mit mir sein', en: 'I can be a little kinder to myself' } },
    { id: 'ruhe', label: { de: 'Ich bin ruhiger als vorher', en: 'I am calmer than before' } },
    { id: 'kontakt', label: { de: 'Ich habe Kontakt zu dem Kind in mir gefunden', en: 'I have made contact with the child in me' } },
    { id: 'plan', label: { de: 'Ich weiß, was ich im Alltag anders machen kann', en: 'I know what I can do differently in everyday life' } },
  ],
};

// ---------------------------------------------------------------------------
// Kraftquellen (Sonnenkind)
// ---------------------------------------------------------------------------

/** Was jemand als Kind geliebt hat – mit einem Spielvorschlag für heute. */
export const lovedQuestion: Question = {
  id: 'loved',
  question: { de: 'Was hast du als Kind geliebt?', en: 'What did you love as a child?' },
  hint: { de: 'Alles, was dir einfällt – auch Kleinigkeiten.', en: 'Anything that comes to mind — small things too.' },
  multi: true,
  optional: true,
  options: [
    { id: 'natur', label: { de: 'Draußen sein, Wald, Wiese, Natur', en: 'Being outdoors, woods, meadows, nature' }, response: { de: 'Eine Stunde draußen ohne Ziel – barfuß laufen, Stöcke sammeln, Wolken anschauen.', en: 'An hour outdoors with no goal — walk barefoot, collect sticks, watch the clouds.' } },
    { id: 'tiere', label: { de: 'Tiere', en: 'Animals' }, response: { de: 'Zeit mit einem Tier verbringen – eigenes, geliehenes, im Tierpark oder beim Füttern der Enten.', en: 'Spend time with an animal — your own, a borrowed one, at a petting zoo, or feeding the ducks.' } },
    { id: 'malen', label: { de: 'Malen, Basteln, Kneten', en: 'Painting, crafting, modelling clay' }, response: { de: 'Ein Blatt Papier und Farben – ohne Ziel, einfach malen, was kommt.', en: 'A sheet of paper and some colours — no goal, just paint whatever comes.' } },
    { id: 'bauen', label: { de: 'Bauen, Tüfteln, Auseinandernehmen', en: 'Building, tinkering, taking things apart' }, response: { de: 'Etwas bauen, nur zum Spaß: Lego, eine Holzkiste, ein Modell, eine Murmelbahn.', en: 'Build something just for fun: Lego, a wooden box, a model, a marble run.' } },
    { id: 'musik', label: { de: 'Musik, Singen', en: 'Music, singing' }, response: { de: 'Laut die Lieder von damals hören und mitsingen.', en: 'Play the songs from back then loudly and sing along.' } },
    { id: 'tanzen', label: { de: 'Tanzen, Bewegung, Toben', en: 'Dancing, moving, romping about' }, response: { de: 'Ein Lied lang tanzen, als würde niemand zusehen.', en: 'Dance for one song as if no one is watching.' } },
    { id: 'lesen', label: { de: 'Bücher, Geschichten, Hörspiele', en: 'Books, stories, audio dramas' }, response: { de: 'Ein Kinderbuch oder Hörspiel von damals wiederentdecken – mit einer Tasse Kakao.', en: 'Rediscover a children’s book or audio story from back then — with a cup of hot chocolate.' } },
    { id: 'fantasie', label: { de: 'Fantasiewelten, Verkleiden, Rollenspiele', en: 'Fantasy worlds, dressing up, role play' }, response: { de: 'Eine Geschichte erfinden und aufschreiben – oder dich verkleiden, einfach so.', en: 'Invent a story and write it down — or dress up, just because.' } },
    { id: 'sport', label: { de: 'Sport, Rad fahren, Klettern', en: 'Sport, cycling, climbing' }, response: { de: 'Rad fahren ohne Ziel, auf einen Baum klettern, Ball spielen.', en: 'Ride a bike with no destination, climb a tree, play ball.' } },
    { id: 'wasser', label: { de: 'Wasser: Baden, Planschen, Schwimmen', en: 'Water: bathing, splashing, swimming' }, response: { de: 'Ins Schwimmbad oder an einen See – und nicht Bahnen ziehen, sondern planschen.', en: 'Go to a pool or lake — and don’t swim lengths, splash around.' } },
    { id: 'spiele', label: { de: 'Brett-, Karten- oder Computerspiele', en: 'Board, card or computer games' }, response: { de: 'Ein Spiel von damals spielen – allein oder mit jemandem, der Lust hat.', en: 'Play a game from back then — alone or with someone who feels like it.' } },
    { id: 'kochen', label: { de: 'Kochen, Backen, Naschen', en: 'Cooking, baking, treats' }, response: { de: 'Das Lieblingsessen oder den Lieblingskuchen von damals machen.', en: 'Make your favourite meal or cake from back then.' } },
    { id: 'freunde', label: { de: 'Mit Freunden herumstreunen', en: 'Roaming around with friends' }, response: { de: 'Mit einem Menschen, den du magst, einfach losziehen – ohne Programm.', en: 'Head out with someone you like — no plan.' } },
    { id: 'sammeln', label: { de: 'Sammeln: Steine, Bilder, Karten', en: 'Collecting: stones, pictures, cards' }, response: { de: 'Beim nächsten Spaziergang etwas sammeln, das dir gefällt, und es sichtbar hinstellen.', en: 'On your next walk, collect something you like and put it where you can see it.' } },
  ],
};

export const strengthsQuestion: Question = {
  id: 'strengths',
  question: { de: 'Wie warst du als Kind, wenn es dir gut ging?', en: 'What were you like as a child when things were good?' },
  hint: { de: 'Das sind Fähigkeiten, die noch in dir stecken.', en: 'These are abilities that are still in you.' },
  multi: true,
  optional: true,
  options: [
    { id: 'neugierig', label: { de: 'neugierig', en: 'curious' } },
    { id: 'mutig', label: { de: 'mutig', en: 'brave' } },
    { id: 'lustig', label: { de: 'lustig', en: 'funny' } },
    { id: 'einfuehlsam', label: { de: 'einfühlsam', en: 'empathetic' } },
    { id: 'kreativ', label: { de: 'kreativ', en: 'creative' } },
    { id: 'fantasievoll', label: { de: 'fantasievoll', en: 'imaginative' } },
    { id: 'ausdauernd', label: { de: 'ausdauernd', en: 'persistent' } },
    { id: 'wild', label: { de: 'wild und lebendig', en: 'wild and lively' } },
    { id: 'ruhig', label: { de: 'ruhig und beobachtend', en: 'quiet and observant' } },
    { id: 'gerecht', label: { de: 'gerechtigkeitsliebend', en: 'fair-minded' } },
    { id: 'klug', label: { de: 'klug', en: 'clever' } },
    { id: 'zaertlich', label: { de: 'zärtlich und verschmust', en: 'tender and cuddly' } },
  ],
};

export const goodPersonQuestion: Question = {
  id: 'goodPerson',
  question: { de: 'Gab es jemanden, bei dem du dich als Kind wohl und sicher gefühlt hast?', en: 'Was there someone you felt good and safe with as a child?' },
  optional: true,
  multi: true,
  options: [
    { id: 'grosseltern', label: { de: 'Oma oder Opa', en: 'A grandparent' } },
    { id: 'elternteil', label: { de: 'Ein Elternteil', en: 'A parent' } },
    { id: 'verwandte', label: { de: 'Tante, Onkel, Pate', en: 'An aunt, uncle or godparent' } },
    { id: 'geschwister', label: { de: 'Geschwister', en: 'A sibling' } },
    { id: 'lehrer', label: { de: 'Eine Lehrerin, ein Lehrer, eine Erzieherin', en: 'A teacher or nursery worker' } },
    { id: 'nachbarn', label: { de: 'Nachbarn, Eltern von Freunden', en: 'Neighbours, friends’ parents' } },
    { id: 'freund', label: { de: 'Eine Freundin oder ein Freund', en: 'A friend' } },
    { id: 'tier', label: { de: 'Ein Tier', en: 'An animal' } },
    {
      id: 'niemand',
      label: { de: 'Eigentlich niemand', en: 'No one, really' },
      exclusive: true,
      response: {
        de: 'Das tut mir leid. Ein Kind, das niemanden hatte, hat sehr viel allein getragen. Umso wichtiger ist, was du heute tust: Du kannst selbst dieser Mensch werden. Und für die Übungen darfst du dir eine Helferfigur ausdenken – das wirkt nicht weniger.',
        en: 'I am sorry. A child who had no one carried a great deal alone. That makes what you are doing today all the more important: you can become that person yourself. And for the exercises you may invent a helper figure — that works just as well.',
      },
    },
  ],
};

// ---------------------------------------------------------------------------
// Spurensuche: Kindheit
// ---------------------------------------------------------------------------

export const homeQuestion: Question = {
  id: 'home',
  question: { de: 'Wenn du an die Stimmung bei dir zu Hause denkst – bis du etwa zwölf warst –, was trifft zu?', en: 'When you think about the atmosphere at home — up to about age twelve — what applies?' },
  hint: { de: 'Mehrere Antworten möglich. Es darf widersprüchlich sein; Familien sind das oft.', en: 'Choose as many as apply. It may be contradictory; families often are.' },
  multi: true,
  options: [
    { id: 'warm', label: { de: 'Warm und geborgen', en: 'Warm and secure' }, weights: { needs: { naehe: -2, sicherheit: -2, wert: -1 } } },
    { id: 'streng', label: { de: 'Streng, viele Regeln', en: 'Strict, lots of rules' }, weights: { needs: { autonomie: 2, ausdruck: 1, spiel: 1 }, beliefs: { fehler: 1, nichtWehren: 1 }, protectors: { perfektion: 1, anpassung: 1 } } },
    { id: 'kalt', label: { de: 'Kühl und distanziert – wenig Umarmungen, wenig Worte', en: 'Cool and distant — few hugs, few words' }, weights: { needs: { naehe: 3, wert: 1 }, beliefs: { nichtLiebenswert: 2, allein: 2, gefuehle: 1 }, protectors: { rueckzug: 1, fassade: 1 } } },
    { id: 'unberechenbar', label: { de: 'Unberechenbar – man wusste nie, welche Stimmung kommt', en: 'Unpredictable — you never knew what mood was coming' }, weights: { needs: { sicherheit: 3, grenzen: 1 }, beliefs: { unsicher: 2, kontrolle: 2, schuld: 1 }, protectors: { kontrolle: 2, anpassung: 1, gruebeln: 1 } } },
    { id: 'laut', label: { de: 'Laut – viel Streit', en: 'Loud — lots of arguing' }, weights: { needs: { sicherheit: 3 }, beliefs: { unsicher: 1, schuld: 1, zuViel: 1 }, protectors: { rueckzug: 1, anpassung: 1 } } },
    { id: 'angespannt', label: { de: 'Still und angespannt – Konflikte unter der Oberfläche', en: 'Quiet and tense — conflict under the surface' }, weights: { needs: { sicherheit: 2, ausdruck: 2 }, beliefs: { gefuehle: 2, unwichtig: 1 }, protectors: { fassade: 1, anpassung: 1 } } },
    { id: 'chaotisch', label: { de: 'Chaotisch – wenig Struktur, wenig Aufsicht', en: 'Chaotic — little structure, little supervision' }, weights: { needs: { grenzen: 3, sicherheit: 2 }, beliefs: { allein: 1, hilflos: 1, kontrolle: 1 }, protectors: { kontrolle: 1, kuemmern: 1 } } },
    { id: 'leistung', label: { de: 'Leistungsorientiert – Noten und Erfolg zählten viel', en: 'Achievement-focused — grades and success counted for a lot' }, weights: { needs: { wert: 3, spiel: 1 }, beliefs: { leistung: 3, nichtGenug: 2, fehler: 1 }, protectors: { perfektion: 2, leisten: 2, kritiker: 1 } } },
    { id: 'behuetet', label: { de: 'Überbehütet – man traute mir wenig zu', en: 'Overprotective — little was trusted to me' }, weights: { needs: { autonomie: 3 }, beliefs: { hilflos: 2, unsicher: 1 }, protectors: { vermeiden: 1, gruebeln: 1 } } },
    { id: 'allein', label: { de: 'Ich war viel allein', en: 'I was alone a lot' }, weights: { needs: { naehe: 3, sicherheit: 1 }, beliefs: { allein: 3, unwichtig: 1 }, protectors: { rueckzug: 1, betaeuben: 1 } } },
    { id: 'belastet', label: { de: 'Ein Elternteil war krank, süchtig oder psychisch sehr belastet', en: 'A parent was ill, addicted or under severe psychological strain' }, flags: ['heavy'], weights: { needs: { sicherheit: 2, grenzen: 2, naehe: 1 }, beliefs: { schuld: 2, unwichtig: 2, kontrolle: 1 }, protectors: { kuemmern: 2, kontrolle: 1 } } },
    { id: 'wechselhaft', label: { de: 'Je nach Elternteil sehr unterschiedlich', en: 'Very different depending on the parent' }, weights: { needs: { sicherheit: 1 } } },
    dontKnow(),
  ],
};

export const sadQuestion: Question = {
  id: 'sad',
  question: { de: 'Wenn du als Kind traurig oder ängstlich warst – was passierte meistens?', en: 'When you were sad or scared as a child — what usually happened?' },
  options: [
    { id: 'getroestet', label: { de: 'Jemand hat mich getröstet', en: 'Someone comforted me' }, weights: { needs: { naehe: -2, ausdruck: -1 } } },
    { id: 'kleingeredet', label: { de: '„Stell dich nicht so an“ – es wurde kleingeredet', en: '“Don’t make such a fuss” — it was played down' }, weights: { needs: { ausdruck: 3, naehe: 2 }, beliefs: { gefuehle: 2, zuViel: 1, unwichtig: 1 }, protectors: { fassade: 1 } } },
    { id: 'versteckt', label: { de: 'Ich habe es niemandem gezeigt', en: 'I didn’t show it to anyone' }, weights: { needs: { ausdruck: 2, naehe: 2 }, beliefs: { allein: 2, gefuehle: 2 }, protectors: { fassade: 2, rueckzug: 1 } } },
    { id: 'bestraft', label: { de: 'Ich wurde dafür ausgeschimpft oder bestraft', en: 'I was scolded or punished for it' }, weights: { needs: { ausdruck: 3, sicherheit: 2 }, beliefs: { gefuehle: 3, zuViel: 2 }, protectors: { fassade: 1, rueckzug: 1 } } },
    { id: 'abgelenkt', label: { de: 'Ich wurde abgelenkt – mit Süßem, Fernsehen, Geschenken', en: 'I was distracted — with sweets, TV, presents' }, weights: { needs: { ausdruck: 2, naehe: 1 }, beliefs: { gefuehle: 1 }, protectors: { betaeuben: 2 } } },
    { id: 'elternTroesten', label: { de: 'Am Ende musste ich die Erwachsenen trösten', en: 'In the end I had to comfort the adults' }, weights: { needs: { grenzen: 3, naehe: 2, ausdruck: 1 }, beliefs: { schuld: 2, unwichtig: 2 }, protectors: { kuemmern: 3 } } },
    { id: 'unterschiedlich', label: { de: 'Mal so, mal so', en: 'It varied' }, weights: { needs: { naehe: 1, sicherheit: 1 } } },
    dontKnow(),
  ],
};

export const angerQuestion: Question = {
  id: 'anger',
  question: { de: 'Und wenn du wütend warst?', en: 'And when you were angry?' },
  options: [
    { id: 'erlaubt', label: { de: 'Wut durfte sein, und jemand half mir damit', en: 'Anger was allowed, and someone helped me with it' }, weights: { needs: { ausdruck: -2, grenzen: -1 } } },
    { id: 'verboten', label: { de: 'Wut war verboten – „Sei nicht so frech“', en: 'Anger was forbidden — “Don’t be cheeky”' }, weights: { needs: { ausdruck: 3 }, beliefs: { nichtWehren: 3, anpassen: 1 }, protectors: { anpassung: 2 } } },
    { id: 'liebesentzug', label: { de: 'Darauf folgten harte Strafen oder Liebesentzug', en: 'Harsh punishment or withdrawal of love followed' }, weights: { needs: { ausdruck: 3, sicherheit: 2, naehe: 1 }, beliefs: { nichtWehren: 2, verlassen: 2, anpassen: 2 }, protectors: { anpassung: 2, fassade: 1 } } },
    { id: 'ignoriert', label: { de: 'Niemand reagierte', en: 'No one reacted' }, weights: { needs: { ausdruck: 1, wert: 2 }, beliefs: { unwichtig: 2 } } },
    { id: 'ausgelacht', label: { de: 'Ich wurde ausgelacht', en: 'I was laughed at' }, weights: { needs: { wert: 3, ausdruck: 2 }, beliefs: { nichtGenug: 1, gefuehle: 2 }, protectors: { rueckzug: 1 } } },
    { id: 'eskaliert', label: { de: 'Die Erwachsenen wurden noch wütender', en: 'The adults got even angrier' }, weights: { needs: { sicherheit: 3 }, beliefs: { unsicher: 2, nichtWehren: 2 }, protectors: { anpassung: 1, angriff: 1 } } },
    { id: 'grenzenlos', label: { de: 'Ich durfte fast alles, Grenzen gab es kaum', en: 'I was allowed almost anything; there were hardly any limits' }, weights: { needs: { grenzen: 3 }, beliefs: { hilflos: 1 }, protectors: { angriff: 1, betaeuben: 1 } } },
    dontKnow(),
  ],
};

export const mistakeQuestion: Question = {
  id: 'mistake',
  question: { de: 'Wenn du einen Fehler gemacht hast oder etwas nicht konntest?', en: 'When you made a mistake or couldn’t do something?' },
  options: [
    { id: 'ok', label: { de: 'Das war in Ordnung, man half mir', en: 'That was fine; someone helped me' }, weights: { needs: { wert: -2, autonomie: -1 } } },
    { id: 'kritik', label: { de: 'Es gab Kritik oder Enttäuschung', en: 'There was criticism or disappointment' }, weights: { needs: { wert: 2 }, beliefs: { fehler: 2, nichtGenug: 2 }, protectors: { perfektion: 2, kritiker: 2 } } },
    { id: 'strafe', label: { de: 'Es gab Strafe, Schreien oder Schläge', en: 'There was punishment, shouting or hitting' }, flags: ['heavy'], weights: { needs: { sicherheit: 3, wert: 2 }, beliefs: { fehler: 3, unsicher: 2 }, protectors: { perfektion: 2, kontrolle: 1 } } },
    { id: 'beschaemt', label: { de: 'Ich wurde bloßgestellt oder vor anderen beschämt', en: 'I was exposed or shamed in front of others' }, weights: { needs: { wert: 3 }, beliefs: { nichtGenug: 2, fehler: 2 }, protectors: { perfektion: 1, rueckzug: 1, fassade: 1 } } },
    { id: 'abgenommen', label: { de: 'Die Erwachsenen haben es dann lieber selbst gemacht', en: 'The adults would rather do it themselves' }, weights: { needs: { autonomie: 3 }, beliefs: { hilflos: 3 }, protectors: { vermeiden: 2 } } },
    { id: 'vergleich', label: { de: 'Ich wurde mit anderen verglichen', en: 'I was compared with others' }, weights: { needs: { wert: 3 }, beliefs: { nichtGenug: 3, leistung: 1 }, protectors: { leisten: 1, kritiker: 1 } } },
    { id: 'egal', label: { de: 'Es interessierte niemanden', en: 'Nobody cared' }, weights: { needs: { wert: 2, grenzen: 1, naehe: 1 }, beliefs: { unwichtig: 2, allein: 1 } } },
    dontKnow(),
  ],
};

export const playQuestion: Question = {
  id: 'play',
  question: { de: 'Freude, Spielen, Albernsein – wie viel Platz hatte das?', en: 'Joy, play, silliness — how much room was there for that?' },
  options: [
    { id: 'viel', label: { de: 'Viel – das gehörte einfach dazu', en: 'A lot — it was simply part of life' }, weights: { needs: { spiel: -2 } } },
    { id: 'nachPflicht', label: { de: 'Erst nach den Pflichten', en: 'Only after the chores were done' }, weights: { needs: { spiel: 2 }, beliefs: { leistung: 2 }, protectors: { leisten: 1 } } },
    { id: 'frueh', label: { de: 'Wenig – ich musste früh vernünftig sein', en: 'Little — I had to be sensible early on' }, weights: { needs: { spiel: 3, grenzen: 1 }, beliefs: { leistung: 1, schuld: 1 }, protectors: { kuemmern: 1, kontrolle: 1 } } },
    { id: 'zuLaut', label: { de: 'Ich war schnell „zu laut“ oder „zu wild“', en: 'I was quickly “too loud” or “too wild”' }, weights: { needs: { spiel: 2, ausdruck: 2 }, beliefs: { zuViel: 3 }, protectors: { anpassung: 1 } } },
    { id: 'allein', label: { de: 'Ich habe vor allem allein gespielt', en: 'I mostly played alone' }, weights: { needs: { naehe: 2 }, beliefs: { allein: 1 } } },
    dontKnow(),
  ],
};

export const ownQuestion: Question = {
  id: 'own',
  question: { de: 'Eigene Wünsche, Meinungen und Wege – wie wurde darauf reagiert?', en: 'Your own wishes, opinions and ways — how were they received?' },
  options: [
    { id: 'gefoerdert', label: { de: 'Ich wurde ermutigt', en: 'I was encouraged' }, weights: { needs: { autonomie: -2, wert: -1 } } },
    { id: 'uebergangen', label: { de: 'Die Erwachsenen entschieden, meine Meinung zählte wenig', en: 'The adults decided; my opinion counted for little' }, weights: { needs: { autonomie: 3, wert: 1 }, beliefs: { unwichtig: 2, nichtWehren: 1 }, protectors: { anpassung: 1 } } },
    { id: 'misstraut', label: { de: 'Man traute mir wenig zu', en: 'Little was trusted to me' }, weights: { needs: { autonomie: 3 }, beliefs: { hilflos: 2, nichtGenug: 1 }, protectors: { vermeiden: 1 } } },
    { id: 'gekraenkt', label: { de: 'Wollte ich etwas Eigenes, war jemand gekränkt', en: 'When I wanted something of my own, someone was hurt' }, weights: { needs: { autonomie: 2, grenzen: 1 }, beliefs: { schuld: 2, anpassen: 2 }, protectors: { anpassung: 2, kuemmern: 1 } } },
    { id: 'zuFrueh', label: { de: 'Ich musste viel zu früh alles allein entscheiden', en: 'I had to decide everything alone far too early' }, weights: { needs: { grenzen: 3, sicherheit: 1 }, beliefs: { allein: 2, kontrolle: 2 }, protectors: { kontrolle: 2, leisten: 1 } } },
    dontKnow(),
  ],
};

export const rolesQuestion: Question = {
  id: 'roles',
  question: { de: 'Welche Rolle hattest du in deiner Familie?', en: 'What role did you have in your family?' },
  hint: { de: 'Kinder übernehmen Rollen, damit das Familiensystem funktioniert. Mehrere möglich.', en: 'Children take on roles to keep the family system going. Choose as many as apply.' },
  multi: true,
  options: [
    { id: 'vernuenftig', label: { de: 'Das vernünftige Kind, das keine Probleme macht', en: 'The sensible child who never causes trouble' }, weights: { needs: { ausdruck: 2, spiel: 1 }, beliefs: { unwichtig: 2, anpassen: 1 }, protectors: { anpassung: 2, fassade: 1 } } },
    { id: 'kuemmerer', label: { de: 'Das Kind, das sich um andere kümmert – Eltern, Geschwister', en: 'The child who looks after others — parents, siblings' }, weights: { needs: { grenzen: 3, naehe: 1 }, beliefs: { schuld: 3, unwichtig: 2 }, protectors: { kuemmern: 3 } } },
    { id: 'unsichtbar', label: { de: 'Das unsichtbare Kind – kaum bemerkt', en: 'The invisible child — hardly noticed' }, weights: { needs: { wert: 3, naehe: 2 }, beliefs: { unwichtig: 2, allein: 2 }, protectors: { rueckzug: 2 } } },
    { id: 'sonnenschein', label: { de: 'Der Sonnenschein oder Clown – für gute Stimmung zuständig', en: 'The sunshine or clown — in charge of keeping the mood up' }, weights: { needs: { ausdruck: 2, grenzen: 1 }, beliefs: { gefuehle: 1, schuld: 1 }, protectors: { fassade: 2 } } },
    { id: 'sorgenkind', label: { de: 'Das Sorgenkind oder schwarze Schaf', en: 'The problem child or black sheep' }, weights: { needs: { wert: 3 }, beliefs: { nichtGenug: 2, zuViel: 2, nichtLiebenswert: 1 }, protectors: { angriff: 1 } } },
    { id: 'held', label: { de: 'Der Stolz der Familie – musste glänzen', en: 'The family’s pride — had to shine' }, weights: { needs: { wert: 2, spiel: 1 }, beliefs: { leistung: 3, fehler: 2 }, protectors: { leisten: 2, perfektion: 2 } } },
    { id: 'vermittler', label: { de: 'Das Kind, das zwischen den Erwachsenen vermittelt', en: 'The child who mediated between the adults' }, weights: { needs: { grenzen: 3, sicherheit: 1 }, beliefs: { schuld: 2, kontrolle: 1 }, protectors: { kuemmern: 2, anpassung: 1 } } },
    { id: 'rebell', label: { de: 'Das Kind, das sich auflehnt', en: 'The child who rebelled' }, weights: { needs: { autonomie: 1, naehe: 1 }, beliefs: { allein: 1 }, protectors: { angriff: 2 } } },
    { id: 'keine', label: { de: 'Keine besondere Rolle', en: 'No particular role' }, exclusive: true },
  ],
};

export const sayingsQuestion: Question = {
  id: 'sayings',
  question: { de: 'Welche Sätze hast du oft gehört – ausgesprochen oder unausgesprochen?', en: 'Which sentences did you often hear — spoken or unspoken?' },
  hint: { de: 'Auch Sätze, die niemand sagte, die aber in der Luft lagen.', en: 'Including sentences no one said but which hung in the air.' },
  multi: true,
  options: [
    { id: 'anstellen', label: { de: '„Stell dich nicht so an.“', en: '“Stop making such a fuss.”' }, weights: { needs: { ausdruck: 2 }, beliefs: { gefuehle: 2 } } },
    { id: 'leute', label: { de: '„Was sollen die Leute denken?“', en: '“What will people think?”' }, weights: { needs: { wert: 1 }, beliefs: { anpassen: 2, fehler: 1 }, protectors: { fassade: 1 } } },
    { id: 'niewas', label: { de: '„Aus dir wird nie was.“', en: '“You’ll never amount to anything.”' }, weights: { needs: { wert: 3 }, beliefs: { nichtGenug: 3, hilflos: 1 } } },
    { id: 'brav', label: { de: '„Sei vernünftig.“ / „Sei brav.“', en: '“Be sensible.” / “Be good.”' }, weights: { needs: { spiel: 1, ausdruck: 1 }, beliefs: { anpassen: 2 }, protectors: { anpassung: 1 } } },
    { id: 'schaffstNicht', label: { de: '„Das schaffst du eh nicht.“', en: '“You won’t manage that anyway.”' }, weights: { needs: { autonomie: 3 }, beliefs: { hilflos: 3 } } },
    { id: 'wegenDir', label: { de: '„Wegen dir …“ / „Du bist schuld, dass …“', en: '“Because of you …” / “It’s your fault that …”' }, weights: { needs: { sicherheit: 1 }, beliefs: { schuld: 3 } } },
    { id: 'heulNicht', label: { de: '„Heul nicht.“ / „Reiß dich zusammen.“', en: '“Stop crying.” / “Pull yourself together.”' }, weights: { needs: { ausdruck: 3 }, beliefs: { gefuehle: 3 }, protectors: { fassade: 1 } } },
    { id: 'still', label: { de: '„Sei still.“ / „Nicht jetzt.“', en: '“Be quiet.” / “Not now.”' }, weights: { needs: { wert: 1, ausdruck: 1 }, beliefs: { zuViel: 2, unwichtig: 2 } } },
    { id: 'empfindlich', label: { de: '„Du bist zu empfindlich.“', en: '“You’re too sensitive.”' }, weights: { needs: { ausdruck: 2 }, beliefs: { zuViel: 2, gefuehle: 1 } } },
    { id: 'anstrengen', label: { de: '„Streng dich mehr an.“', en: '“Try harder.”' }, weights: { needs: { wert: 2 }, beliefs: { leistung: 2, nichtGenug: 2 }, protectors: { kritiker: 2 } } },
    { id: 'wichtig', label: { de: '„Nimm dich nicht so wichtig.“', en: '“Don’t think you’re so important.”' }, weights: { needs: { wert: 2 }, beliefs: { unwichtig: 3 } } },
    { id: 'vorsicht', label: { de: '„Pass auf, da passiert was!“', en: '“Careful, something will happen!”' }, weights: { needs: { autonomie: 2, sicherheit: 1 }, beliefs: { unsicher: 2, hilflos: 1 }, protectors: { kontrolle: 1, gruebeln: 1 } } },
    { id: 'nurBestes', label: { de: '„Nur das Beste ist gut genug.“', en: '“Only the best is good enough.”' }, weights: { needs: { wert: 2 }, beliefs: { fehler: 2, leistung: 2 }, protectors: { perfektion: 2 } } },
    { id: 'nichtReden', label: { de: '„Darüber reden wir nicht.“', en: '“We don’t talk about that.”' }, weights: { needs: { ausdruck: 2, sicherheit: 1 }, beliefs: { gefuehle: 2 }, protectors: { fassade: 2 } } },
    { id: 'nichtLieb', label: { de: '„Wenn du so bist, hab ich dich nicht mehr lieb.“', en: '“If you’re like that, I don’t love you any more.”' }, weights: { needs: { naehe: 3, sicherheit: 2 }, beliefs: { verlassen: 3, anpassen: 2, nichtLiebenswert: 2 }, protectors: { anpassung: 2 } } },
    { id: 'liebevoll', label: { de: 'Liebevolle Sätze wie „Ich bin stolz auf dich“ oder „Ich hab dich lieb“', en: 'Loving sentences like “I’m proud of you” or “I love you”' }, weights: { needs: { wert: -2, naehe: -2 } } },
    { id: 'keine', label: { de: 'Nichts davon', en: 'None of these' }, exclusive: true },
  ],
};

export const eventsQuestion: Question = {
  id: 'events',
  question: { de: 'Gab es Erfahrungen, die dich besonders geprägt haben?', en: 'Were there experiences that shaped you in particular?' },
  hint: {
    de: 'Freiwillig. Du musst hier nichts angeben. Wenn die Frage dich aufwühlt: Pause-Knopf unten rechts.',
    en: 'Optional. You don’t have to tick anything here. If the question stirs you up: pause button at the bottom right.',
  },
  multi: true,
  optional: true,
  options: [
    { id: 'trennung', label: { de: 'Trennung oder Scheidung der Eltern', en: 'Parents separating or divorcing' }, weights: { needs: { sicherheit: 2, naehe: 1 }, beliefs: { verlassen: 2, schuld: 1 } } },
    { id: 'verlust', label: { de: 'Tod oder schwere Krankheit eines nahen Menschen', en: 'Death or serious illness of someone close' }, weights: { needs: { sicherheit: 2, naehe: 2 }, beliefs: { verlassen: 2, unsicher: 1 } } },
    { id: 'umzug', label: { de: 'Häufige Umzüge oder Schulwechsel', en: 'Frequent moves or school changes' }, weights: { needs: { sicherheit: 1, naehe: 1 }, beliefs: { allein: 1 } } },
    { id: 'geschwister', label: { de: 'Ein Geschwister bekam deutlich mehr Aufmerksamkeit', en: 'A sibling got far more attention' }, weights: { needs: { wert: 2, naehe: 1 }, beliefs: { unwichtig: 2, nichtGenug: 1 } } },
    { id: 'mobbing', label: { de: 'Mobbing oder Ausgrenzung', en: 'Bullying or exclusion' }, weights: { needs: { wert: 2, sicherheit: 2 }, beliefs: { nichtLiebenswert: 2, zuViel: 1, unsicher: 1 }, protectors: { rueckzug: 1, fassade: 1 } } },
    { id: 'sucht', label: { de: 'Sucht in der Familie', en: 'Addiction in the family' }, flags: ['heavy'], weights: { needs: { sicherheit: 2, grenzen: 2 }, beliefs: { kontrolle: 2, schuld: 2 }, protectors: { kuemmern: 1, kontrolle: 1 } } },
    { id: 'psychisch', label: { de: 'Psychische Erkrankung eines Elternteils', en: 'A parent’s mental illness' }, flags: ['heavy'], weights: { needs: { grenzen: 2, naehe: 2 }, beliefs: { schuld: 2, unwichtig: 1 }, protectors: { kuemmern: 2 } } },
    { id: 'gewalt', label: { de: 'Körperliche oder seelische Gewalt', en: 'Physical or emotional violence' }, flags: ['trauma'], weights: { needs: { sicherheit: 3 }, beliefs: { unsicher: 3, schuld: 2, nichtWehren: 2 } } },
    { id: 'uebergriffe', label: { de: 'Sexuelle Übergriffe', en: 'Sexual abuse' }, flags: ['trauma'], weights: { needs: { sicherheit: 3 }, beliefs: { unsicher: 3, schuld: 2 } } },
    { id: 'vernachlaessigung', label: { de: 'Vernachlässigung – zu wenig Essen, Pflege oder Aufsicht', en: 'Neglect — not enough food, care or supervision' }, flags: ['trauma'], weights: { needs: { sicherheit: 3, naehe: 3, grenzen: 2 }, beliefs: { allein: 3, unwichtig: 2 } } },
    { id: 'keine', label: { de: 'Nichts davon', en: 'None of these' }, exclusive: true },
    { id: 'nichtSagen', label: { de: 'Möchte ich nicht beantworten', en: 'I’d rather not say' }, exclusive: true },
  ],
};

// ---------------------------------------------------------------------------
// Spurensuche: heute
// ---------------------------------------------------------------------------

export const triggersQuestion: Question = {
  id: 'triggers',
  question: { de: 'In welchen Situationen reagierst du heute stärker, als es dir selbst angemessen scheint?', en: 'In which situations do you react more strongly today than seems appropriate even to you?' },
  hint: { de: 'Solche Momente sind die Tür zum inneren Kind: Da reagiert das Damals auf das Heute.', en: 'Moments like these are the door to the inner child: the past is reacting to the present.' },
  multi: true,
  options: [
    { id: 'kritik', label: { de: 'Kritik – auch sachliche', en: 'Criticism — even constructive' }, weights: { beliefs: { nichtGenug: 2, fehler: 2 }, protectors: { perfektion: 1, angriff: 1 } } },
    { id: 'ablehnung', label: { de: 'Zurückweisung, eine Absage, eine Nachricht ohne Antwort', en: 'Rejection, being turned down, a message left unanswered' }, weights: { beliefs: { verlassen: 2, nichtLiebenswert: 2 }, protectors: { gruebeln: 1 } } },
    { id: 'uebergangen', label: { de: 'Übergangen oder nicht gesehen werden', en: 'Being overlooked or not seen' }, weights: { beliefs: { unwichtig: 2, nichtGenug: 1 } } },
    { id: 'streit', label: { de: 'Streit, laute Stimmen, schlechte Stimmung', en: 'Arguments, raised voices, a bad atmosphere' }, weights: { beliefs: { unsicher: 2, schuld: 1 }, protectors: { anpassung: 1, rueckzug: 1 } } },
    { id: 'fehler', label: { de: 'Eigene Fehler', en: 'My own mistakes' }, weights: { beliefs: { fehler: 3 }, protectors: { kritiker: 1 } } },
    { id: 'kontrollverlust', label: { de: 'Unvorhergesehenes, Kontrollverlust', en: 'The unexpected, loss of control' }, weights: { beliefs: { kontrolle: 3, unsicher: 1 }, protectors: { kontrolle: 1 } } },
    { id: 'alleinsein', label: { de: 'Alleinsein, Stille, Abende ohne Plan', en: 'Being alone, silence, evenings with no plans' }, weights: { beliefs: { allein: 2, verlassen: 1 }, protectors: { betaeuben: 1 } } },
    { id: 'erwartungen', label: { de: 'Zu viel Nähe oder Erwartungen anderer', en: 'Too much closeness or other people’s expectations' }, weights: { beliefs: { anpassen: 1 }, protectors: { rueckzug: 2 } } },
    { id: 'neinSagen', label: { de: 'Nein sagen, Grenzen ziehen', en: 'Saying no, setting boundaries' }, weights: { beliefs: { nichtWehren: 3, anpassen: 2 } } },
    { id: 'bitten', label: { de: 'Um etwas bitten, eigene Wünsche äußern', en: 'Asking for something, voicing my wishes' }, weights: { beliefs: { unwichtig: 3, zuViel: 1 } } },
    { id: 'bewertung', label: { de: 'Prüfungen, Bewertungen, Leistungsdruck', en: 'Exams, evaluations, pressure to perform' }, weights: { beliefs: { leistung: 2, nichtGenug: 1 }, protectors: { leisten: 1, gruebeln: 1 } } },
    { id: 'ungerecht', label: { de: 'Ungerechtigkeit, nicht ernst genommen werden', en: 'Injustice, not being taken seriously' }, weights: { beliefs: { unwichtig: 1 }, protectors: { angriff: 2 } } },
    { id: 'lob', label: { de: 'Lob oder Aufmerksamkeit – das ist mir unangenehm', en: 'Praise or attention — it makes me uncomfortable' }, weights: { beliefs: { nichtLiebenswert: 1, zuViel: 1 } } },
    { id: 'andereLeiden', label: { de: 'Wenn es anderen schlecht geht', en: 'When others are unwell' }, weights: { beliefs: { schuld: 2 }, protectors: { kuemmern: 2 } } },
  ],
};

/** Gefühle – auch Grundlage für die Gefühlsbrücke. Das Label im Nominativ ohne Artikel. */
export const feelingQuestion: Question = {
  id: 'feeling',
  question: { de: 'Welches Gefühl ist in solchen Momenten am stärksten?', en: 'Which feeling is strongest in those moments?' },
  hint: { de: 'Höchstens drei. Das erste gewählte nehmen wir später als Brücke.', en: 'Up to three. We will use the first one you pick as a bridge later.' },
  multi: true,
  max: 3,
  options: [
    { id: 'angst', label: { de: 'Angst', en: 'Fear' }, weights: { needs: { sicherheit: 1 }, beliefs: { unsicher: 1 } } },
    { id: 'scham', label: { de: 'Scham', en: 'Shame' }, weights: { needs: { wert: 1 }, beliefs: { nichtGenug: 1, zuViel: 1 } } },
    { id: 'traurigkeit', label: { de: 'Traurigkeit', en: 'Sadness' }, weights: { needs: { naehe: 1 } } },
    { id: 'wut', label: { de: 'Wut', en: 'Anger' }, weights: { needs: { ausdruck: 1 } } },
    { id: 'einsamkeit', label: { de: 'Einsamkeit', en: 'Loneliness' }, weights: { needs: { naehe: 1 }, beliefs: { allein: 1 } } },
    { id: 'hilflosigkeit', label: { de: 'Hilflosigkeit', en: 'Helplessness' }, weights: { needs: { autonomie: 1 }, beliefs: { hilflos: 1 } } },
    { id: 'schuld', label: { de: 'Schuld', en: 'Guilt' }, weights: { needs: { grenzen: 1 }, beliefs: { schuld: 1 } } },
    { id: 'leere', label: { de: 'Leere oder Taubheit', en: 'Emptiness or numbness' }, weights: { needs: { ausdruck: 1 }, protectors: { betaeuben: 1, rueckzug: 1 } } },
    { id: 'unruhe', label: { de: 'Unruhe oder Panik', en: 'Restlessness or panic' }, weights: { needs: { sicherheit: 1 }, protectors: { kontrolle: 1 } } },
  ],
};

/** Direkte Frage nach den Schutzstrategien – jede Option trifft genau eine. */
export const reactionQuestion: Question = {
  id: 'reaction',
  question: { de: 'Und was tust du dann meistens?', en: 'And what do you usually do then?' },
  multi: true,
  options: [
    { id: 'perfektion', label: { de: 'Ich arbeite noch härter daran, dass alles perfekt ist', en: 'I work even harder to make everything perfect' }, weights: { protectors: { perfektion: 3 } } },
    { id: 'anpassung', label: { de: 'Ich passe mich an, entschuldige mich, mache es allen recht', en: 'I adapt, apologise, try to please everyone' }, weights: { protectors: { anpassung: 3 } } },
    { id: 'kuemmern', label: { de: 'Ich kümmere mich um die anderen statt um mich', en: 'I look after the others instead of myself' }, weights: { protectors: { kuemmern: 3 } } },
    { id: 'rueckzug', label: { de: 'Ich ziehe mich zurück, mache zu, gehe weg', en: 'I withdraw, shut down, leave' }, weights: { protectors: { rueckzug: 3 } } },
    { id: 'kontrolle', label: { de: 'Ich versuche, alles zu kontrollieren und zu planen', en: 'I try to control and plan everything' }, weights: { protectors: { kontrolle: 3 } } },
    { id: 'angriff', label: { de: 'Ich werde laut, scharf oder kontere', en: 'I get loud, sharp or hit back' }, weights: { protectors: { angriff: 3 } } },
    { id: 'betaeuben', label: { de: 'Ich lenke mich ab oder betäube mich – Essen, Handy, Serien, Alkohol …', en: 'I distract or numb myself — food, phone, series, alcohol …' }, weights: { protectors: { betaeuben: 3 } } },
    { id: 'leisten', label: { de: 'Ich stürze mich in Arbeit und Beschäftigung', en: 'I throw myself into work and keeping busy' }, weights: { protectors: { leisten: 3 } } },
    { id: 'kritiker', label: { de: 'Ich mache mich innerlich fertig', en: 'I tear myself apart inside' }, weights: { protectors: { kritiker: 3 } } },
    { id: 'vermeiden', label: { de: 'Ich weiche aus, schiebe auf, sage ab', en: 'I avoid, procrastinate, cancel' }, weights: { protectors: { vermeiden: 3 } } },
    { id: 'fassade', label: { de: 'Ich tue so, als wäre alles in Ordnung', en: 'I pretend everything is fine' }, weights: { protectors: { fassade: 3 } } },
    { id: 'gruebeln', label: { de: 'Ich grüble stundenlang und male mir Schlimmes aus', en: 'I ruminate for hours and imagine the worst' }, weights: { protectors: { gruebeln: 3 } } },
  ],
};

export const areasQuestion: Question = {
  id: 'areas',
  question: { de: 'Wo in deinem Leben zeigt sich das am meisten?', en: 'Where in your life does this show up most?' },
  multi: true,
  optional: true,
  options: [
    { id: 'partnerschaft', label: { de: 'In der Partnerschaft', en: 'In my relationship' } },
    { id: 'arbeit', label: { de: 'Bei der Arbeit', en: 'At work' } },
    { id: 'freunde', label: { de: 'In Freundschaften', en: 'In friendships' } },
    { id: 'herkunft', label: { de: 'Mit meiner Herkunftsfamilie', en: 'With my family of origin' } },
    { id: 'kinder', label: { de: 'Mit meinen eigenen Kindern', en: 'With my own children' } },
    { id: 'selbstbild', label: { de: 'Im Blick auf mich selbst', en: 'In how I see myself' } },
    { id: 'koerper', label: { de: 'Im Umgang mit Körper, Essen, Schlaf', en: 'In how I treat my body, food, sleep' } },
  ],
};

/** Fragen, deren Gewichte in die Auswertung eingehen. */
export const profileQuestions: Question[] = [
  homeQuestion,
  sadQuestion,
  angerQuestion,
  mistakeQuestion,
  playQuestion,
  ownQuestion,
  rolesQuestion,
  sayingsQuestion,
  eventsQuestion,
  triggersQuestion,
  feelingQuestion,
  reactionQuestion,
];

export const allQuestions: Question[] = [
  safetyQuestion,
  floodingQuestion,
  therapyQuestion,
  timeQuestion,
  experienceQuestion,
  concernQuestion,
  goalQuestion,
  lovedQuestion,
  strengthsQuestion,
  goodPersonQuestion,
  ...profileQuestions,
  areasQuestion,
];

export const questionById = new Map<string, Question>(allQuestions.map((q) => [q.id, q]));
