import type { ExerciseId, GuidedLine, L10n, Path } from './types';
import {
  angerQuestion,
  areasQuestion,
  concernQuestion,
  eventsQuestion,
  experienceQuestion,
  feelingQuestion,
  floodingQuestion,
  goalQuestion,
  goodPersonQuestion,
  homeQuestion,
  lovedQuestion,
  mistakeQuestion,
  ownQuestion,
  playQuestion,
  reactionQuestion,
  rolesQuestion,
  sadQuestion,
  safetyQuestion,
  sayingsQuestion,
  strengthsQuestion,
  therapyQuestion,
  timeQuestion,
  triggersQuestion,
  type Question,
} from './questions';
import { entry, isAcute, type SessionData } from '../engine/session';

// ---------------------------------------------------------------------------
// Typen
// ---------------------------------------------------------------------------

export type Cond = (d: SessionData) => boolean;

export type PhaseId =
  | 'vorgespraech'
  | 'ankommen'
  | 'verstehen'
  | 'kraft'
  | 'spuren'
  | 'spiegel'
  | 'begegnung'
  | 'nachnaehren'
  | 'beschuetzer'
  | 'saetze'
  | 'briefe'
  | 'alltag'
  | 'abschluss';

export interface Phase {
  id: PhaseId;
  title: L10n;
}

/** Bausteine mit eigener Logik – umgesetzt in `components/specials`. */
export type Special =
  | 'crisis'
  | 'pathChoice'
  | 'overview'
  | 'needsList'
  | 'traumaNotice'
  | 'mirror'
  | 'beliefPick'
  | 'beliefRateBefore'
  | 'beliefRateAfter'
  | 'distressCheck'
  | 'situationCheck'
  | 'childNeedHint'
  | 'rescript'
  | 'sentences'
  | 'speak'
  | 'protector'
  | 'newBeliefs'
  | 'letter'
  | 'plan'
  | 'compare'
  | 'appreciation'
  | 'breakPoint';

export type Block =
  | { t: 'lead' | 'p'; text: L10n; when?: Cond }
  | { t: 'list'; items: L10n[]; when?: Cond }
  | { t: 'more'; title: L10n; body: L10n[]; when?: Cond }
  | { t: 'callout'; tone: 'info' | 'warning' | 'critical' | 'positive'; title?: L10n; text: L10n; when?: Cond }
  | { t: 'question'; q: Question; when?: Cond }
  | { t: 'scale'; id: string; label: L10n; low: L10n; high: L10n; when?: Cond }
  | { t: 'text'; id: string; label: L10n; hint?: L10n; placeholder?: L10n; rows?: number; when?: Cond }
  | { t: 'number'; id: string; label: L10n; min: number; max: number; when?: Cond }
  | { t: 'exercise'; id: ExerciseId; when?: Cond }
  | { t: 'guided'; lines: GuidedLine[]; when?: Cond }
  | { t: 'breath'; when?: Cond }
  | { t: 'special'; name: Special; when?: Cond };

export interface Step {
  id: string;
  phase: PhaseId;
  title: L10n;
  /** Geschätzte Dauer in Minuten – für die Wegwahl und den Fortschritt. */
  minutes: number;
  /** Fehlt die Angabe, gehört der Schritt zu allen Wegen. */
  paths?: Path[];
  when?: Cond;
  blocks: Block[];
  /** Solange das zutrifft, geht es nicht weiter (nur Sicherheitsfrage). */
  blocked?: Cond;
}

// ---------------------------------------------------------------------------
// Phasen
// ---------------------------------------------------------------------------

export const phases: Phase[] = [
  { id: 'vorgespraech', title: { de: 'Vorgespräch', en: 'Preliminary talk' } },
  { id: 'ankommen', title: { de: 'Ankommen', en: 'Arriving' } },
  { id: 'verstehen', title: { de: 'Verstehen', en: 'Understanding' } },
  { id: 'kraft', title: { de: 'Kraftquellen', en: 'Resources' } },
  { id: 'spuren', title: { de: 'Spurensuche', en: 'Tracing back' } },
  { id: 'spiegel', title: { de: 'Spiegelung', en: 'Reflection' } },
  { id: 'begegnung', title: { de: 'Begegnung', en: 'Meeting' } },
  { id: 'nachnaehren', title: { de: 'Nachnähren', en: 'Reparenting' } },
  { id: 'beschuetzer', title: { de: 'Beschützer', en: 'Protectors' } },
  { id: 'saetze', title: { de: 'Neue Sätze', en: 'New beliefs' } },
  { id: 'briefe', title: { de: 'Briefe', en: 'Letters' } },
  { id: 'alltag', title: { de: 'In den Alltag', en: 'Into daily life' } },
  { id: 'abschluss', title: { de: 'Abschluss', en: 'Closing' } },
];

// ---------------------------------------------------------------------------
// Wiederkehrende Bausteine
// ---------------------------------------------------------------------------

const STANDARD_DEEP: Path[] = ['standard', 'deep'];
const DEEP: Path[] = ['deep'];

const scale0to10 = {
  low: { de: '0 – gar nicht', en: '0 – not at all' },
  high: { de: '10 – extrem', en: '10 – extremely' },
};

const entryQuestion: Question = {
  id: 'entry',
  question: { de: 'Wie möchtest du {kindDat} begegnen?', en: 'How would you like to meet {kind}?' },
  options: [
    {
      id: 'bridge',
      label: { de: 'Über eine Situation von heute (Gefühlsbrücke)', en: 'Through a situation from today (affect bridge)' },
      hint: { de: 'Der klassische Weg: vom Gefühl im Heute zu einem frühen Moment. Am wirksamsten, aber auch am bewegendsten.', en: 'The classic way: from a feeling today to an early moment. The most effective, but also the most moving.' },
    },
    {
      id: 'photo',
      label: { de: 'Über ein Foto von mir als Kind', en: 'Through a photo of me as a child' },
      hint: { de: 'Nah und trotzdem mit Abstand. Gut, wenn du ein Foto zur Hand hast.', en: 'Close and yet at a distance. Good if you have a photo to hand.' },
    },
    {
      id: 'safeplace',
      label: { de: 'An meinem sicheren Ort', en: 'At my safe place' },
      hint: { de: 'Das Kind kommt zu dir, ohne belastende Szene. Der behutsamste Zugang.', en: 'The child comes to you, without a distressing scene. The gentlest way in.' },
    },
  ],
};

const entryGentleQuestion: Question = {
  ...entryQuestion,
  id: 'entryGentle',
  options: entryQuestion.options.filter((o) => o.id !== 'bridge'),
};

const helperTypeQuestion: Question = {
  id: 'helperType',
  question: { de: 'Wer oder was ist zu dir gekommen?', en: 'Who or what came to you?' },
  optional: true,
  options: [
    { id: 'mensch', label: { de: 'Ein Mensch, den ich kenne oder kannte', en: 'A person I know or knew' } },
    { id: 'figur', label: { de: 'Eine Figur aus einem Buch, Film oder Märchen', en: 'A character from a book, film or fairy tale' } },
    { id: 'tier', label: { de: 'Ein Tier', en: 'An animal' } },
    { id: 'licht', label: { de: 'Ein Licht, eine Kraft, ein Wesen', en: 'A light, a force, a being' } },
    { id: 'weise', label: { de: 'Eine ältere, weise Version von mir', en: 'An older, wiser version of me' } },
    {
      id: 'keine',
      label: { de: 'Niemand – und das ist gerade in Ordnung', en: 'No one — and that is fine for now' },
      response: {
        de: 'Das ist in Ordnung. Du bist selbst die wichtigste Begleitung für dein inneres Kind. Wenn später doch jemand auftaucht, darf er oder sie mitkommen.',
        en: 'That is fine. You are yourself the most important companion for your inner child. If someone does appear later, they are welcome to come along.',
      },
    },
  ],
};

const placeWorkedQuestion: Question = {
  id: 'placeWorked',
  question: { de: 'Wie war das für dich?', en: 'How was that for you?' },
  options: [
    {
      id: 'gut',
      label: { de: 'Es hat sich gut und sicher angefühlt', en: 'It felt good and safe' },
      response: {
        de: 'Schön. Dann hast du jetzt einen Ort, an den du jederzeit gehen kannst – auch außerhalb dieser Sitzung, vor dem Einschlafen, in der Bahn, vor einem schwierigen Gespräch.',
        en: 'Lovely. Then you now have a place you can go to at any time — outside this session too, before falling asleep, on the train, before a difficult conversation.',
      },
    },
    {
      id: 'teils',
      label: { de: 'Teilweise – das Bild war blass oder ist gewandert', en: 'Partly — the image was faint or kept drifting' },
      response: {
        de: 'Das ist ganz normal, besonders beim ersten Mal. Innere Bilder werden mit Übung klarer. Manche Menschen sehen wenig, spüren aber etwas oder hören etwas. Alles davon zählt.',
        en: 'That is perfectly normal, especially the first time. Inner images become clearer with practice. Some people see little but feel or hear something. All of it counts.',
      },
    },
    {
      id: 'schwer',
      label: { de: 'Es war schwer, mich irgendwo sicher zu fühlen', en: 'It was hard to feel safe anywhere' },
      response: {
        de: 'Danke für deine Ehrlichkeit. Wenn Sicherheit schwer vorstellbar ist, erzählt das oft davon, wie wenig sicher es früher war. Dann hilft es, klein anzufangen: ein einzelner Gegenstand, eine Decke, eine Farbe. Wir gehen heute besonders behutsam weiter – und der sanfte Weg ist jederzeit wählbar.',
        en: 'Thank you for your honesty. If safety is hard to imagine, that often tells of how little safety there was back then. It helps to start small: a single object, a blanket, a colour. We will continue especially gently today — and the gentle path can be chosen at any time.',
      },
    },
  ],
};

const childFeelsQuestion: Question = {
  id: 'childFeels',
  question: { de: 'Was fühlt {kind} – was glaubst du?', en: 'What is {kind} feeling — what do you think?' },
  multi: true,
  optional: true,
  options: [
    { id: 'angst', label: { de: 'Angst', en: 'Scared' } },
    { id: 'traurig', label: { de: 'Traurigkeit', en: 'Sad' } },
    { id: 'einsam', label: { de: 'Einsamkeit', en: 'Lonely' } },
    { id: 'wut', label: { de: 'Wut', en: 'Angry' } },
    { id: 'scham', label: { de: 'Scham', en: 'Ashamed' } },
    { id: 'verwirrt', label: { de: 'Verwirrung', en: 'Confused' } },
    { id: 'erstarrt', label: { de: 'Erstarrung', en: 'Frozen' } },
    { id: 'froh', label: { de: 'Freude', en: 'Happy' } },
    { id: 'neugierig', label: { de: 'Neugier', en: 'Curious' } },
    { id: 'unklar', label: { de: 'Ich weiß es nicht', en: 'I don’t know' }, exclusive: true },
  ],
};

const selfFeelingQuestion: Question = {
  id: 'selfFeeling',
  question: { de: 'Und wie fühlst du dich gegenüber {kindDat}, wenn du {kind} so ansiehst?', en: 'And how do you feel towards {kind} as you look at them like this?' },
  hint: {
    de: 'Eine der wichtigsten Fragen der Sitzung. Es gibt keine falsche Antwort – jede sagt etwas Wertvolles.',
    en: 'One of the most important questions of the session. There is no wrong answer — each one tells us something valuable.',
  },
  options: [
    {
      id: 'mitgefuehl',
      label: { de: 'Mitgefühl, Wärme, Zärtlichkeit', en: 'Compassion, warmth, tenderness' },
      response: {
        de: 'Das ist die Haltung, aus der Heilung geschieht. Dein erwachsenes, mitfühlendes Ich ist da. Bleib mit diesem Gefühl in Kontakt – wir brauchen es gleich.',
        en: 'That is the stance from which healing happens. Your adult, compassionate self is present. Stay in touch with this feeling — we will need it in a moment.',
      },
    },
    {
      id: 'neugier',
      label: { de: 'Neugier, Offenheit', en: 'Curiosity, openness' },
      response: {
        de: 'Wunderbar. Neugier ist eine der Qualitäten, die Richard Schwartz dem „Selbst“ zuschreibt – dem Kern, der heilen kann. Du musst noch nichts anderes fühlen als Interesse. Das genügt.',
        en: 'Wonderful. Curiosity is one of the qualities Richard Schwartz attributes to the “Self” — the core that can heal. You don’t need to feel anything other than interest yet. That is enough.',
      },
    },
    {
      id: 'traurig',
      label: { de: 'Traurigkeit', en: 'Sadness' },
      response: {
        de: 'Traurigkeit beim Anblick des Kindes ist oft Mitgefühl, das noch keinen Ausweg hat: Du siehst, was {kindDat} gefehlt hat. Das darf da sein. Wird sie sehr groß, atme etwas länger aus und spür deine Füße – du bist heute erwachsen, und du bist hier.',
        en: 'Sadness at the sight of the child is often compassion that has not yet found a way out: you see what {kind} was missing. That is allowed to be there. If it becomes very big, breathe out a little longer and feel your feet — you are an adult today, and you are here.',
      },
    },
    {
      id: 'nichts',
      label: { de: 'Nichts, Leere, Distanz', en: 'Nothing, emptiness, distance' },
      response: {
        de: 'Auch das ist eine Antwort. Oft schützt uns ein Teil davor, zu viel zu fühlen – gerade, wenn früher niemand da war, der Gefühle aufgefangen hat. Du musst nichts erzwingen. Wir gehen einfach weiter, als ob die Wärme schon da wäre. Handeln geht dem Fühlen oft voraus.',
        en: 'That is an answer too. Often a part of us protects us from feeling too much — especially if, back then, no one was there to catch our feelings. You don’t have to force anything. We will simply carry on as if the warmth were already there. Acting often comes before feeling.',
      },
    },
    {
      id: 'ungeduld',
      label: { de: 'Ungeduld, Genervtsein', en: 'Impatience, irritation' },
      response: {
        de: 'Danke für diese ehrliche Antwort – sie ist wichtig. Ungeduld gegenüber dem inneren Kind kommt meist nicht von dir selbst, sondern von einem Beschützer-Anteil, der gelernt hat, dass Schwäche Ärger bringt. Oft klingt er wie ein Erwachsener von damals. Bitte ihn innerlich freundlich, einen Schritt zurückzutreten: „Ich weiß, du willst uns schützen. Lass mich kurz mit dem Kind allein.“ Schau dann noch einmal hin. Verändert sich etwas?',
        en: 'Thank you for this honest answer — it matters. Impatience towards the inner child usually does not come from you yourself but from a protective part that learned weakness brings trouble. It often sounds like an adult from back then. Kindly ask it inwardly to step back: “I know you want to protect us. Let me be alone with the child for a moment.” Then look again. Does anything change?',
      },
    },
    {
      id: 'ablehnung',
      label: { de: 'Ablehnung, Scham oder Ekel', en: 'Rejection, shame or disgust' },
      response: {
        de: 'Das ist schwer zu spüren, und es ist mutig, es zuzugeben. Viele Menschen lehnen ihr inneres Kind ab – so, wie es früher abgelehnt wurde. Das ist eine übernommene Stimme, nicht deine eigene. Bitte diesen Teil, ein Stück zur Seite zu gehen, oder hol {helfer} dazu: Die Helferfigur kann sich dem Kind zuwenden, solange es dir noch schwerfällt. Du darfst erst einmal nur zuschauen.',
        en: 'That is hard to feel, and it is brave to admit it. Many people reject their inner child — just as it was rejected back then. That is an inherited voice, not your own. Ask this part to step aside a little, or bring in {helfer}: the helper can turn towards the child while it is still hard for you. For now, you may simply watch.',
      },
    },
    {
      id: 'angst',
      label: { de: 'Angst, Überforderung', en: 'Fear, overwhelm' },
      response: {
        de: 'Dann gehen wir langsamer. Vergrößere den Abstand, bis es sich aushaltbar anfühlt – stell dir vor, du siehst {kind} durch eine Glasscheibe oder auf einer Leinwand. Bleibt die Angst, nutze den Pause-Knopf oder wechsle auf den sanften Weg. Beides ist eine gute Entscheidung.',
        en: 'Then we will go more slowly. Increase the distance until it feels bearable — imagine seeing {kind} through a pane of glass or on a screen. If the fear stays, use the pause button or switch to the gentle path. Both are good decisions.',
      },
    },
  ],
};

const helperWhoQuestion: Question = {
  id: 'helperWho',
  question: { de: 'Wer tritt jetzt zu {kindDat}?', en: 'Who steps towards {kind} now?' },
  options: [
    { id: 'ich', label: { de: 'Ich – mein erwachsenes Ich von heute', en: 'Me — my adult self of today' } },
    {
      id: 'helfer',
      label: { de: 'Meine Helferfigur', en: 'My helper' },
      response: {
        de: 'Gut. Manchmal ist es leichter, wenn zunächst jemand anderes vorangeht. Du bist trotzdem dabei, schaust zu und lernst mit.',
        en: 'Good. Sometimes it is easier if someone else goes first. You are still there, watching and learning along the way.',
      },
    },
    { id: 'beide', label: { de: 'Wir beide gemeinsam', en: 'Both of us together' } },
  ],
};

const childNeedQuestion: Question = {
  id: 'childNeed',
  question: { de: 'Was braucht {kind} jetzt am meisten?', en: 'What does {kind} need most right now?' },
  hint: { de: 'Höchstens drei. Vertrau deinem ersten Impuls.', en: 'Up to three. Trust your first impulse.' },
  multi: true,
  max: 3,
  options: [
    { id: 'schutz', label: { de: 'Schutz – jemanden, der dazwischengeht', en: 'Protection — someone who steps in' } },
    { id: 'trost', label: { de: 'Trost und Nähe', en: 'Comfort and closeness' } },
    { id: 'gesehen', label: { de: 'Gesehen und gemocht werden', en: 'Being seen and liked' } },
    { id: 'gefuehle', label: { de: 'Die Erlaubnis, zu fühlen und zu zeigen', en: 'Permission to feel and show it' } },
    { id: 'zutrauen', label: { de: 'Jemanden, der etwas zutraut', en: 'Someone who believes in them' } },
    { id: 'spielen', label: { de: 'Spielen und Leichtigkeit', en: 'Play and lightness' } },
    { id: 'verantwortung', label: { de: 'Jemanden, der die Verantwortung übernimmt', en: 'Someone who takes on the responsibility' } },
    { id: 'weg', label: { de: 'Einfach weg aus dieser Situation', en: 'Simply to get out of this situation' } },
  ],
};

const childReactionQuestion: Question = {
  id: 'childReaction',
  question: { de: 'Wie reagiert {kind}?', en: 'How does {kind} react?' },
  options: [
    {
      id: 'naeher',
      label: { de: '{Kind} kommt näher oder lehnt sich an', en: '{Kind} comes closer or leans in' },
      response: {
        de: 'Wie schön. Bleib in diesem Moment. Spür, wie es sich anfühlt, für jemanden der sichere Ort zu sein. Diese Nähe ist neu für {kind} – und vielleicht auch für dich. Präg dir dieses Bild gut ein; du kannst es jederzeit wieder aufrufen.',
        en: 'How lovely. Stay in this moment. Feel what it is like to be a safe place for someone. This closeness is new for {kind} — and perhaps for you too. Imprint this image well; you can call it up again at any time.',
      },
    },
    {
      id: 'weint',
      label: { de: '{Kind} weint', en: '{Kind} cries' },
      response: {
        de: 'Tränen sind oft ein Zeichen, dass etwas endlich ankommen darf. Du musst sie nicht stoppen. Halte {kind} oder bleib einfach da. In Gegenwart eines Menschen zu weinen, der bleibt, ist etwas völlig anderes, als allein zu weinen.',
        en: 'Tears are often a sign that something is finally allowed to land. You don’t have to stop them. Hold {kind} or simply stay. Crying in the presence of someone who stays is something entirely different from crying alone.',
      },
    },
    {
      id: 'ruhiger',
      label: { de: '{Kind} lächelt oder wird ruhiger', en: '{Kind} smiles or becomes calmer' },
      response: {
        de: 'Das ist ein wichtiger Moment. Lass dir Zeit, ihn wirklich zu spüren – auch in deinem Körper. Wo spürst du die Erleichterung?',
        en: 'This is an important moment. Take time to really feel it — in your body too. Where do you feel the relief?',
      },
    },
    {
      id: 'misstrauisch',
      label: { de: '{Kind} ist misstrauisch oder glaubt mir nicht', en: '{Kind} is suspicious or doesn’t believe me' },
      response: {
        de: 'Das ist verständlich und sogar ein gutes Zeichen: {Kind} ist klug und hat erlebt, dass Versprechen nicht gehalten wurden. Vertrauen wächst nicht durch Worte, sondern durch Wiederkommen. Sag: „Du musst mir nicht gleich glauben. Ich zeige es dir – jeden Tag ein bisschen.“ Genau dafür ist das tägliche Ritual am Ende der Sitzung da.',
        en: 'That is understandable, and even a good sign: {kind} is clever and has experienced promises not being kept. Trust does not grow through words but through coming back. Say: “You don’t have to believe me straight away. I will show you — a little every day.” That is exactly what the daily ritual at the end of the session is for.',
      },
    },
    {
      id: 'abgewandt',
      label: { de: '{Kind} wendet sich ab oder ist wütend', en: '{Kind} turns away or is angry' },
      response: {
        de: 'Auch das darf sein. Vielleicht ist {kind} wütend, dass so lange niemand kam – auch du nicht. Das ist eine berechtigte Wut. Sag: „Du hast recht. Ich war lange nicht da. Es tut mir leid. Jetzt bin ich hier.“ Und dann bleib, ohne dich aufzudrängen. Abstand, den {kind} selbst bestimmt, ist auch eine Form von Sicherheit.',
        en: 'That is allowed too. Perhaps {kind} is angry that no one came for so long — not even you. That is justified anger. Say: “You are right. I was not there for a long time. I am sorry. I am here now.” And then stay, without pushing. Distance that {kind} decides on is also a form of safety.',
      },
    },
    {
      id: 'nichts',
      label: { de: 'Ich sehe keine Reaktion / weiß nicht', en: 'I see no reaction / don’t know' },
      response: {
        de: 'Das ist in Ordnung. Innere Bilder reagieren manchmal langsam, und manche Menschen erleben mehr über den Körper als über Bilder. Achte einen Moment auf deinen Körper: Hat sich etwas verändert – im Atem, in den Schultern, im Bauch? Auch eine kleine Veränderung zählt.',
        en: 'That is fine. Inner images sometimes respond slowly, and some people experience more through the body than through images. Pay attention to your body for a moment: has anything changed — in your breath, your shoulders, your belly? Even a small change counts.',
      },
    },
    {
      id: 'zuViel',
      label: { de: 'Es wird mir gerade zu viel', en: 'It is getting too much for me' },
      response: {
        de: 'Danke, dass du auf dich achtest. Dann ist jetzt der Moment für Halt, nicht für Tiefe. Nimm {kind} an die Hand und geht gemeinsam an deinen sicheren Ort – das ist genau der nächste Schritt. Und nutze den Pause-Knopf, wenn du mehr brauchst.',
        en: 'Thank you for looking after yourself. Then now is the moment for support, not for depth. Take {kind} by the hand and go together to your safe place — that is exactly the next step. And use the pause button if you need more.',
      },
    },
  ],
};

const mirrorFitQuestion: Question = {
  id: 'mirrorFit',
  question: { de: 'Wie passt das für dich?', en: 'How does that fit for you?' },
  options: [
    {
      id: 'sehr',
      label: { de: 'Das trifft es ziemlich genau', en: 'That is pretty accurate' },
      response: {
        de: 'Manchmal ist es erleichternd, das so schwarz auf weiß zu sehen – und manchmal auch schmerzhaft. Beides ist verständlich. Wichtig: Das ist keine Diagnose, sondern eine Landkarte. Sie zeigt, wo die Arbeit heute ansetzt.',
        en: 'Sometimes it is a relief to see it in black and white like this — and sometimes it also hurts. Both are understandable. Important: this is not a diagnosis but a map. It shows where today’s work begins.',
      },
    },
    {
      id: 'teils',
      label: { de: 'Teilweise', en: 'Partly' },
      response: {
        de: 'Dann nimm, was passt, und lass den Rest. Im nächsten Schritt wählst du selbst, welche Sätze sich wirklich wahr anfühlen – du bist die Expertin, der Experte für dein Leben.',
        en: 'Then take what fits and leave the rest. In the next step you choose for yourself which sentences really feel true — you are the expert on your life.',
      },
    },
    {
      id: 'nein',
      label: { de: 'Eher nicht', en: 'Not really' },
      response: {
        de: 'Danke, dass du das sagst. Eine Auswertung aus Ankreuzfragen kann danebenliegen. Du findest im nächsten Schritt alle fünfzehn Sätze – wähl die, die dich wirklich betreffen, oder keinen, wenn keiner passt.',
        en: 'Thank you for saying so. An evaluation based on tick boxes can miss the mark. In the next step you will find all fifteen sentences — pick the ones that really apply to you, or none if none fit.',
      },
    },
  ],
};

const protectorResponseQuestion: Question = {
  id: 'protectorResponse',
  question: { de: 'Wie reagiert dein Beschützer auf das Angebot?', en: 'How does your protector respond to the offer?' },
  options: [
    {
      id: 'erleichtert',
      label: { de: 'Erleichtert – er entspannt sich ein wenig', en: 'Relieved — it relaxes a little' },
      response: {
        de: 'Das ist ein großer Schritt. Beschützer sind oft müde; sie arbeiten seit Jahrzehnten ohne Pause. Achte in den nächsten Tagen darauf, wann er anspringt, und erinnere ihn freundlich: „Ich bin da.“',
        en: 'That is a big step. Protectors are often tired; they have been working without a break for decades. Over the next few days, notice when it kicks in and remind it kindly: “I am here.”',
      },
    },
    {
      id: 'skeptisch',
      label: { de: 'Skeptisch – er glaubt es noch nicht', en: 'Sceptical — it doesn’t believe it yet' },
      response: {
        de: 'Völlig verständlich. Er hat gute Gründe, vorsichtig zu sein. Mach ihm keinen Druck. Sag: „Du musst nicht aufhören. Schau einfach zu, wie ich es mache.“ Vertrauen wächst, wenn er erlebt, dass du wirklich da bist.',
        en: 'Completely understandable. It has good reasons to be careful. Don’t pressure it. Say: “You don’t have to stop. Just watch how I do it.” Trust grows when it experiences that you really are there.',
      },
    },
    {
      id: 'ablehnend',
      label: { de: 'Ablehnend – er will auf keinen Fall aufhören', en: 'Refusing — it absolutely won’t stop' },
      response: {
        de: 'Das ist ein Zeichen, wie groß die Angst dahinter ist. Frag ihn, was passieren müsste, damit er ein kleines bisschen weniger arbeiten kann. Und akzeptiere seine Antwort. Starke Beschützer brauchen Zeit – in einer Therapie oft viele Stunden. Das ist kein Scheitern.',
        en: 'That shows how great the fear behind it is. Ask it what would have to happen for it to work just a tiny bit less. And accept its answer. Strong protectors need time — in therapy, often many sessions. That is not failure.',
      },
    },
    {
      id: 'unklar',
      label: { de: 'Ich weiß es nicht', en: 'I don’t know' },
      response: {
        de: 'Auch in Ordnung. Du hast Kontakt aufgenommen, und das allein verändert oft schon etwas. Beobachte in den nächsten Tagen, ob du ihn anders wahrnimmst.',
        en: 'That is fine too. You have made contact, and that alone often changes something. Watch over the next few days whether you perceive it differently.',
      },
    },
  ],
};

const notGentle: Cond = (d) => d.path !== 'gentle';
const trauma: Cond = (d) => (d.choices.events ?? []).some((e) => ['gewalt', 'uebergriffe', 'vernachlaessigung'].includes(e));

// ---------------------------------------------------------------------------
// Die Schritte
// ---------------------------------------------------------------------------

export const steps: Step[] = [
  // --- Vorgespräch --------------------------------------------------------
  {
    id: 'v-willkommen',
    phase: 'vorgespraech',
    title: { de: 'Schön, dass du da bist', en: 'Good to have you here' },
    minutes: 2,
    blocks: [
      {
        t: 'lead',
        text: {
          de: 'Bevor wir beginnen, möchte ich dich kurz kennenlernen – so wie in einem Vorgespräch. Ein paar Fragen dazu, wie es dir gerade geht und wie viel Zeit du hast. Danach schlage ich dir einen Weg durch die Sitzung vor.',
          en: 'Before we begin, I would like to get to know you a little — as in a preliminary talk. A few questions about how you are right now and how much time you have. After that, I will suggest a path through the session.',
        },
      },
      {
        t: 'callout',
        tone: 'info',
        title: { de: 'Was diese Seite ist – und was nicht', en: 'What this page is — and what it is not' },
        text: {
          de: 'Eine geführte Selbsthilfe-Sitzung, angelehnt an Methoden aus Schematherapie, Imaginationsarbeit und Selbstmitgefühl. Sie ersetzt keine Psychotherapie und keine Diagnose. Wenn dich etwas überfordert, ist das kein Versagen, sondern ein Hinweis, dass dieses Thema Begleitung verdient.',
          en: 'A guided self-help session drawing on methods from schema therapy, imagery work and self-compassion. It does not replace psychotherapy or a diagnosis. If something overwhelms you, that is not failure — it is a sign that this topic deserves support.',
        },
      },
      {
        t: 'p',
        text: {
          de: 'Alles, was du hier eingibst, bleibt in diesem Browser. Es gibt keinen Server, der mitliest, und keine Statistik.',
          en: 'Everything you enter here stays in this browser. There is no server reading along and no analytics.',
        },
      },
      {
        t: 'scale',
        id: 'moodBefore',
        label: { de: 'Wie geht es dir gerade, alles in allem?', en: 'How are you right now, all things considered?' },
        low: { de: '0 – sehr schlecht', en: '0 – very bad' },
        high: { de: '10 – sehr gut', en: '10 – very good' },
      },
      {
        t: 'scale',
        id: 'sudBefore',
        label: { de: 'Wie belastet oder angespannt fühlst du dich gerade?', en: 'How distressed or tense do you feel right now?' },
        low: { de: '0 – ganz ruhig', en: '0 – completely calm' },
        high: { de: '10 – extrem belastet', en: '10 – extremely distressed' },
      },
    ],
  },
  {
    id: 'v-sicherheit',
    phase: 'vorgespraech',
    title: { de: 'Eine Frage zu deiner Sicherheit', en: 'A question about your safety' },
    minutes: 1,
    blocked: isAcute,
    blocks: [
      { t: 'question', q: safetyQuestion },
      { t: 'special', name: 'crisis', when: isAcute },
    ],
  },
  {
    id: 'v-erfahrung',
    phase: 'vorgespraech',
    title: { de: 'Was ich über dich wissen sollte', en: 'What I should know about you' },
    minutes: 1,
    blocks: [
      { t: 'question', q: floodingQuestion },
      { t: 'question', q: therapyQuestion },
    ],
  },
  {
    id: 'v-rahmen',
    phase: 'vorgespraech',
    title: { de: 'Zeit und Rahmen', en: 'Time and setting' },
    minutes: 2,
    blocks: [
      { t: 'question', q: timeQuestion },
      { t: 'question', q: experienceQuestion },
      {
        t: 'p',
        text: {
          de: 'Eine gute Sitzung braucht einen geschützten Rahmen – wie ein Therapiezimmer. Wenn möglich:',
          en: 'A good session needs a protected setting — like a therapy room. If you can:',
        },
      },
      {
        t: 'list',
        items: [
          { de: 'Telefon lautlos, Benachrichtigungen aus.', en: 'Phone on silent, notifications off.' },
          { de: 'Eine Tür, die du schließen kannst.', en: 'A door you can close.' },
          { de: 'Ein Glas Wasser und Taschentücher in Reichweite.', en: 'A glass of water and tissues within reach.' },
          { de: 'Papier und Stift – manche Übungen gehen von Hand besser.', en: 'Paper and a pen — some exercises work better by hand.' },
          { de: 'Kopfhörer, falls du dir Texte vorlesen lassen möchtest.', en: 'Headphones, if you would like texts read aloud.' },
          { de: 'Nach der Sitzung etwas Zeit ohne Termin, um nachzuspüren.', en: 'Some unscheduled time after the session to let things settle.' },
        ],
      },
    ],
  },
  {
    id: 'v-weg',
    phase: 'vorgespraech',
    title: { de: 'Dein Weg durch die Sitzung', en: 'Your path through the session' },
    minutes: 2,
    blocks: [{ t: 'special', name: 'pathChoice' }],
  },

  // --- Ankommen -------------------------------------------------------------
  {
    id: 'a-rahmen',
    phase: 'ankommen',
    title: { de: 'So gehen wir vor', en: 'How we will proceed' },
    minutes: 2,
    blocks: [
      { t: 'special', name: 'overview' },
      {
        t: 'list',
        items: [
          { de: 'Du bestimmst das Tempo. Es gibt keine Uhr, die abläuft.', en: 'You set the pace. There is no clock running out.' },
          { de: 'Die ganze Sitzung dauert ungefähr zwei Stunden – so lange wie zwei Therapiestunden. Nach der Spiegelung gibt es eine gute Pausenstelle: Bis dahin geht es ums Verstehen, danach um die Begegnung. Du kannst dort aufhören und an einem anderen Tag weitermachen.', en: 'The whole session takes about two hours — as long as two therapy sessions. After the reflection there is a good place to pause: up to then it is about understanding, after that about meeting. You can stop there and continue on another day.' },
          { de: 'Unten rechts ist immer der Pause-Knopf. Er öffnet einen Notfallkoffer mit Übungen, die dich zurück ins Hier holen – und lässt dich sanfter weitermachen oder behutsam abschließen.', en: 'The pause button is always at the bottom right. It opens an emergency kit of exercises that bring you back to the here and now — and lets you continue more gently or close carefully.' },
          { de: 'Alles, was auftaucht, ist willkommen: Tränen, Müdigkeit, Lachen – oder auch nichts. „Nichts spüren“ ist ebenfalls eine Erfahrung und kein Fehler.', en: 'Whatever comes up is welcome: tears, tiredness, laughter — or nothing at all. “Feeling nothing” is also an experience, not a mistake.' },
          { de: 'Die Textfelder sind Angebote. Du musst nichts aufschreiben, was du nicht aufschreiben willst.', en: 'The text fields are offers. You don’t have to write anything you don’t want to.' },
          { de: 'Bei geführten Übungen kannst du dir den Text vorlesen lassen und die Augen schließen.', en: 'In guided exercises you can have the text read aloud and close your eyes.' },
        ],
      },
    ],
  },
  {
    id: 'a-anliegen',
    phase: 'ankommen',
    title: { de: 'Dein Anliegen', en: 'What you are here for' },
    minutes: 2,
    blocks: [
      { t: 'question', q: concernQuestion },
      { t: 'text', id: 'concernText', label: { de: 'Wenn du magst, in eigenen Worten:', en: 'If you like, in your own words:' }, rows: 3 },
      { t: 'question', q: goalQuestion },
    ],
  },
  {
    id: 'a-atem',
    phase: 'ankommen',
    title: { de: 'Ankommen', en: 'Arriving' },
    minutes: 3,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'Bevor wir inhaltlich einsteigen, komm erst einmal an – im Raum und in deinem Körper. Wenn du magst, folge dem Kreis: Einatmen, während er wächst, ausatmen, während er kleiner wird.',
          en: 'Before we get into the content, first arrive — in the room and in your body. If you like, follow the circle: breathe in as it grows, breathe out as it shrinks.',
        },
      },
      { t: 'breath' },
      { t: 'exercise', id: 'atem' },
    ],
  },
  {
    id: 'a-name',
    phase: 'ankommen',
    title: { de: 'Wie hat man dich gerufen?', en: 'What were you called?' },
    minutes: 1,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'In der Sitzung sprechen wir vom Kind, das du einmal warst. Hattest du als Kind einen Namen oder Spitznamen, bei dem du dich gemeint gefühlt hast? Dann verwende ich ihn im weiteren Text. Lässt du das Feld leer, schreibe ich „das Kind“.',
          en: 'During the session we will speak of the child you once were. Did you have a name or nickname as a child that felt like you? Then I will use it in the rest of the text. If you leave the field empty, I will write “the child”.',
        },
      },
      { t: 'text', id: 'childName', label: { de: 'Name oder Spitzname als Kind', en: 'Name or nickname as a child' }, placeholder: { de: 'z. B. Lena, Pipo, Maxi', en: 'e.g. Lena, Pip, Max' }, rows: 1 },
      {
        t: 'p',
        text: {
          de: 'Hat sich jemand oft über dich lustig gemacht mit einem Namen, dann nimm lieber einen anderen – oder gar keinen.',
          en: 'If someone often mocked you with a name, choose a different one instead — or none at all.',
        },
      },
    ],
  },

  // --- Verstehen -------------------------------------------------------------
  {
    id: 'u-innereskind',
    phase: 'verstehen',
    title: { de: 'Was ist das innere Kind?', en: 'What is the inner child?' },
    minutes: 4,
    blocks: [
      {
        t: 'lead',
        text: {
          de: 'Jeder Mensch trägt die Erfahrungen seiner Kindheit in sich – nicht nur als Erinnerung, sondern als Gefühl, als Körperreaktion, als Überzeugung. Diese innere Schicht nennt man das innere Kind.',
          en: 'Everyone carries the experiences of their childhood within them — not only as memories, but as feelings, bodily reactions and convictions. This inner layer is called the inner child.',
        },
      },
      {
        t: 'p',
        text: {
          de: 'Das innere Kind hat zwei Seiten. Die Psychologin Stefanie Stahl nennt sie Sonnenkind und Schattenkind. Das Sonnenkind ist neugierig, verspielt, lebendig und vertrauensvoll – alles, was in dir gut gewachsen ist. Das Schattenkind trägt die Verletzungen: die Momente, in denen du nicht bekommen hast, was du gebraucht hättest, und die Schlüsse, die du daraus gezogen hast.',
          en: 'The inner child has two sides. The psychologist Stefanie Stahl calls them the sunshine child and the shadow child. The sunshine child is curious, playful, lively and trusting — everything in you that grew well. The shadow child carries the wounds: the moments when you did not get what you needed, and the conclusions you drew from them.',
        },
      },
      {
        t: 'p',
        text: {
          de: 'Solche Schlüsse heißen Glaubenssätze: „Ich bin nicht gut genug.“ „Ich darf keine Fehler machen.“ „Ich bin zu viel.“ Ein Kind kann nicht denken: „Meine Eltern sind überfordert.“ Es denkt: „Mit mir stimmt etwas nicht.“ Für ein Kind ist das sogar die sicherere Erklärung – denn dann könnte es sich ja ändern und alles würde gut.',
          en: 'Such conclusions are called core beliefs: “I am not good enough.” “I must not make mistakes.” “I am too much.” A child cannot think: “My parents are overwhelmed.” It thinks: “Something is wrong with me.” For a child, that is even the safer explanation — because then it could change, and everything would be fine.',
        },
      },
      {
        t: 'p',
        text: {
          de: 'Um mit diesen Gefühlen fertigzuwerden, entwickelt ein Kind Schutzstrategien: sich anpassen, perfekt sein, sich zurückziehen, kämpfen, sich um alle kümmern. Das waren kluge Lösungen – damals. Heute kosten sie oft mehr, als sie nützen.',
          en: 'To cope with these feelings, a child develops protective strategies: adapting, being perfect, withdrawing, fighting, taking care of everyone. These were clever solutions — back then. Today they often cost more than they help.',
        },
      },
      {
        t: 'p',
        text: {
          de: 'Und dann gibt es dich: den erwachsenen Menschen, der du heute bist. Mit Erfahrung, Überblick und Möglichkeiten, die das Kind nicht hatte. In der Schematherapie heißt dieser Teil „gesunder Erwachsener“. Heilung bedeutet hier: Das erwachsene Ich lernt, sich um das Kind zu kümmern – so, wie es damals nötig gewesen wäre.',
          en: 'And then there is you: the adult you are today. With experience, perspective and options the child did not have. In schema therapy this part is called the “healthy adult”. Healing here means: the adult self learns to take care of the child — the way it would have been needed back then.',
        },
      },
      {
        t: 'more',
        title: { de: 'Ein Beispiel aus dem Alltag', en: 'An everyday example' },
        body: [
          {
            de: 'Eine Kollegin sagt beiläufig: „Das hättest du auch anders machen können.“ Das erwachsene Ich weiß: ein sachlicher Hinweis. Doch im Bauch zieht sich etwas zusammen, das Gesicht wird heiß, und stundenlang kreist ein Gedanke: „Ich kann einfach nichts.“',
            en: 'A colleague remarks in passing: “You could have done that differently.” The adult self knows: a factual comment. But something tightens in the stomach, the face gets hot, and for hours one thought circles: “I just can’t do anything right.”',
          },
          {
            de: 'Das ist das Schattenkind, das auf eine alte Erfahrung reagiert – vielleicht auf einen Vater, der jede Zeichnung korrigierte. Und dann springt ein Beschützer ein: Du bleibst bis spät, um alles perfekt zu machen, oder du ziehst dich gekränkt zurück.',
            en: 'That is the shadow child reacting to an old experience — perhaps a father who corrected every drawing. And then a protector jumps in: you stay late to make everything perfect, or you withdraw, hurt.',
          },
          {
            de: 'Innere-Kind-Arbeit fragt: Was bräuchte das Kind in diesem Moment? Und kann ich, als Erwachsener, es ihm geben?',
            en: 'Inner child work asks: What would the child need in that moment? And can I, as an adult, give it?',
          },
        ],
      },
      {
        t: 'more',
        title: { de: 'Woher das Konzept kommt', en: 'Where the concept comes from' },
        body: [
          {
            de: 'Die Idee geht auf die Transaktionsanalyse (Eric Berne) zurück, wurde von John Bradshaw und Charles Whitfield bekannt gemacht und im deutschsprachigen Raum vor allem durch Stefanie Stahl. Fachlich am besten ausgearbeitet ist sie in der Schematherapie (Jeffrey Young) mit ihren Kind-Modi und der Methode des Imagery Rescripting. Ähnliche Gedanken finden sich in Internal Family Systems (Richard Schwartz), in der Imaginationsarbeit von Luise Reddemann und in der Compassion Focused Therapy (Paul Gilbert).',
            en: 'The idea goes back to transactional analysis (Eric Berne), was popularised by John Bradshaw and Charles Whitfield, and in the German-speaking world above all by Stefanie Stahl. It is most thoroughly developed in schema therapy (Jeffrey Young), with its child modes and the method of imagery rescripting. Similar ideas are found in Internal Family Systems (Richard Schwartz), in Luise Reddemann’s imagery work and in Compassion Focused Therapy (Paul Gilbert).',
          },
          {
            de: 'Ehrlich gesagt: „Innere-Kind-Arbeit“ als eigenes Verfahren ist wissenschaftlich kaum untersucht. Gut belegt sind aber mehrere ihrer Bausteine, die diese Sitzung verwendet – Imagery Rescripting, Selbstmitgefühl und konkrete Wenn-dann-Pläne. Mehr dazu unter „Hintergrund“.',
            en: 'To be honest: “inner child work” as a method in its own right has hardly been studied scientifically. But several of its building blocks, which this session uses, are well supported — imagery rescripting, self-compassion and concrete if-then plans. More under “Background”.',
          },
        ],
      },
    ],
  },
  {
    id: 'u-beduerfnisse',
    phase: 'verstehen',
    title: { de: 'Was jedes Kind braucht', en: 'What every child needs' },
    minutes: 2,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'Die Schematherapie beschreibt Grundbedürfnisse, die jedes Kind hat. Hier sind sie in sieben Bereiche aufgeteilt – aus ihnen berechnet sich später deine persönliche Auswertung.',
          en: 'Schema therapy describes core needs that every child has. Here they are divided into seven areas — your personal evaluation will be calculated from them later.',
        },
      },
      { t: 'special', name: 'needsList' },
      {
        t: 'p',
        text: {
          de: 'Kein Elternhaus erfüllt alle Bedürfnisse perfekt, und das muss es auch nicht. Der Kinderarzt Donald Winnicott sprach von der „ausreichend guten“ Mutter. Wo aber ein Bedürfnis dauerhaft zu kurz kam, entsteht eine Lücke, die wir heute oft noch spüren.',
          en: 'No home meets every need perfectly, and it doesn’t have to. The paediatrician Donald Winnicott spoke of the “good enough” mother. But where a need was chronically unmet, a gap forms that we often still feel today.',
        },
      },
      {
        t: 'callout',
        tone: 'info',
        title: { de: 'Es geht nicht um Schuld', en: 'This is not about blame' },
        text: {
          de: 'Die meisten Eltern haben getan, was sie konnten – mit den Mitteln und Wunden, die sie selbst hatten. Beides darf gleichzeitig wahr sein: Sie haben ihr Bestes gegeben, und dir hat trotzdem etwas gefehlt. Du musst niemandem verzeihen und niemanden anklagen, um gut für dich zu sorgen.',
          en: 'Most parents did what they could — with the means and wounds they had themselves. Both can be true at the same time: they did their best, and you still missed something. You don’t have to forgive or accuse anyone to take good care of yourself.',
        },
      },
    ],
  },

  // --- Kraftquellen -----------------------------------------------------------
  {
    id: 'k-intro',
    phase: 'kraft',
    title: { de: 'Erst stärken, dann hinschauen', en: 'Strengthen first, then look' },
    minutes: 1,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'In der Traumatherapie gilt ein Grundsatz: Stabilisierung vor Konfrontation. Bevor wir uns dem zuwenden, was weh tut, sammeln wir, was dich trägt. Das ist kein Vorgeplänkel, sondern das Fundament für alles Weitere – und du wirst später darauf zurückgreifen.',
          en: 'Trauma therapy has a basic principle: stabilisation before confrontation. Before we turn to what hurts, we gather what holds you up. This is not a warm-up but the foundation for everything that follows — and you will draw on it later.',
        },
      },
    ],
  },
  {
    id: 'k-ort',
    phase: 'kraft',
    title: { de: 'Dein sicherer Ort', en: 'Your safe place' },
    minutes: 6,
    blocks: [
      { t: 'exercise', id: 'sichererOrt' },
      { t: 'text', id: 'placeWhat', label: { de: 'Wie würdest du deinen sicheren Ort in ein paar Worten nennen?', en: 'What would you call your safe place in a few words?' }, placeholder: { de: 'z. B. die Lichtung am See', en: 'e.g. the clearing by the lake' }, rows: 1 },
      { t: 'text', id: 'placeDetails', label: { de: 'Was macht ihn sicher? Farben, Geräusche, Gerüche, die Grenze …', en: 'What makes it safe? Colours, sounds, smells, the boundary …' }, rows: 3 },
      { t: 'question', q: placeWorkedQuestion },
    ],
  },
  {
    id: 'k-helfer',
    phase: 'kraft',
    title: { de: 'Eine Helferfigur', en: 'A helper' },
    minutes: 4,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'Manchmal hat das erwachsene Ich allein noch nicht genug Kraft oder Wärme. Dann hilft eine innere Gestalt, die ganz auf deiner Seite steht.',
          en: 'Sometimes the adult self on its own does not yet have enough strength or warmth. Then an inner figure who is entirely on your side can help.',
        },
      },
      { t: 'exercise', id: 'helfer' },
      { t: 'question', q: helperTypeQuestion },
      { t: 'text', id: 'helperName', label: { de: 'Wie nennst du sie oder ihn?', en: 'What do you call them?' }, placeholder: { de: 'z. B. Oma Lotte, der alte Bär, die weise Frau', en: 'e.g. Grandma Lottie, the old bear, the wise woman' }, rows: 1, when: (d) => d.choices.helperType?.[0] !== 'keine' },
    ],
  },
  {
    id: 'k-sonnenkind',
    phase: 'kraft',
    title: { de: 'Dein Sonnenkind', en: 'Your sunshine child' },
    minutes: 3,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'Jetzt schauen wir auf das, was in deiner Kindheit gut war – auch wenn es wenig gewesen sein mag. Das Sonnenkind ist die Quelle, aus der du heute schöpfen kannst.',
          en: 'Now we look at what was good in your childhood — even if there may not have been much. The sunshine child is the source you can draw on today.',
        },
      },
      { t: 'question', q: lovedQuestion },
      { t: 'question', q: strengthsQuestion },
      { t: 'question', q: goodPersonQuestion },
      { t: 'text', id: 'happyMemory', label: { de: 'Gibt es einen schönen Moment aus deiner Kindheit? Ein Stichwort genügt.', en: 'Is there a happy moment from your childhood? A keyword is enough.' }, rows: 2 },
      {
        t: 'p',
        text: {
          de: 'All das gehört zu dir. Das Sonnenkind ist nicht verschwunden – es wartet nur darauf, wieder Platz zu bekommen.',
          en: 'All of this belongs to you. The sunshine child has not disappeared — it is just waiting to be given room again.',
        },
      },
    ],
  },

  // --- Spurensuche -----------------------------------------------------------
  {
    id: 's-intro',
    phase: 'spuren',
    title: { de: 'Spurensuche', en: 'Tracing back' },
    minutes: 1,
    blocks: [
      {
        t: 'lead',
        text: {
          de: 'Jetzt schauen wir behutsam zurück. Es geht nicht darum, jemanden anzuklagen, sondern zu verstehen, was dich geprägt hat.',
          en: 'Now we look back carefully. This is not about accusing anyone, but about understanding what shaped you.',
        },
      },
      {
        t: 'p',
        text: {
          de: 'Antworte aus dem Bauch – die erste Antwort ist meist die zutreffende. „Weiß ich nicht“ ist immer erlaubt. Und wenn beim Lesen etwas hochkommt: Pause-Knopf, Füße spüren, weiteratmen.',
          en: 'Answer from the gut — the first answer is usually the right one. “I don’t know” is always allowed. And if something comes up while reading: pause button, feel your feet, keep breathing.',
        },
      },
    ],
  },
  {
    id: 's-zuhause',
    phase: 'spuren',
    title: { de: 'Die Stimmung zu Hause', en: 'The atmosphere at home' },
    minutes: 1,
    blocks: [{ t: 'question', q: homeQuestion }],
  },
  {
    id: 's-gefuehle',
    phase: 'spuren',
    title: { de: 'Wenn es dir schlecht ging', en: 'When things were hard for you' },
    minutes: 2,
    blocks: [
      { t: 'question', q: sadQuestion },
      { t: 'question', q: angerQuestion, when: notGentle },
    ],
  },
  {
    id: 's-fehler',
    phase: 'spuren',
    title: { de: 'Fehler, Spiel und eigene Wege', en: 'Mistakes, play and your own way' },
    minutes: 2,
    blocks: [
      { t: 'question', q: mistakeQuestion },
      { t: 'question', q: playQuestion },
      { t: 'question', q: ownQuestion, when: notGentle },
    ],
  },
  {
    id: 's-rollen',
    phase: 'spuren',
    paths: STANDARD_DEEP,
    title: { de: 'Deine Rolle', en: 'Your role' },
    minutes: 1,
    blocks: [{ t: 'question', q: rolesQuestion }],
  },
  {
    id: 's-saetze',
    phase: 'spuren',
    title: { de: 'Sätze, die hängen geblieben sind', en: 'Sentences that stuck' },
    minutes: 1,
    blocks: [{ t: 'question', q: sayingsQuestion }],
  },
  {
    id: 's-erfahrungen',
    phase: 'spuren',
    paths: STANDARD_DEEP,
    title: { de: 'Prägende Erfahrungen', en: 'Formative experiences' },
    minutes: 1,
    blocks: [
      { t: 'question', q: eventsQuestion },
      { t: 'special', name: 'traumaNotice', when: trauma },
    ],
  },
  {
    id: 's-heute',
    phase: 'spuren',
    title: { de: 'Wo es heute anspringt', en: 'Where it gets triggered today' },
    minutes: 2,
    blocks: [
      { t: 'question', q: triggersQuestion },
      { t: 'question', q: feelingQuestion },
    ],
  },
  {
    id: 's-reaktion',
    phase: 'spuren',
    title: { de: 'Was du dann tust', en: 'What you do then' },
    minutes: 2,
    blocks: [
      { t: 'question', q: reactionQuestion },
      {
        t: 'scale',
        id: 'critic',
        label: { de: 'Wie laut ist deine innere kritische Stimme an einem gewöhnlichen Tag?', en: 'How loud is your inner critical voice on an ordinary day?' },
        low: { de: '0 – kaum hörbar', en: '0 – barely audible' },
        high: { de: '10 – ständig und laut', en: '10 – constant and loud' },
      },
      { t: 'question', q: areasQuestion, when: (d) => d.path === 'deep' },
    ],
  },

  // --- Spiegelung ------------------------------------------------------------
  {
    id: 'm-spiegel',
    phase: 'spiegel',
    title: { de: 'Was ich heraushöre', en: 'What I am hearing' },
    minutes: 4,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'Danke für deine Offenheit. Ich fasse zusammen, was ich aus deinen Antworten heraushöre – so, wie eine Therapeutin es nach einem Gespräch tun würde. Nimm es als Angebot, nicht als Urteil.',
          en: 'Thank you for your openness. I will summarise what I am hearing in your answers — the way a therapist would after a conversation. Take it as an offer, not a verdict.',
        },
      },
      { t: 'special', name: 'mirror' },
      { t: 'question', q: mirrorFitQuestion },
    ],
  },
  {
    id: 'm-glaubenssaetze',
    phase: 'spiegel',
    title: { de: 'Deine Glaubenssätze', en: 'Your core beliefs' },
    minutes: 3,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'Welche Sätze fühlen sich – im Bauch, nicht im Kopf – wahr an? Wähle einen bis drei. Die markierten ergeben sich aus deinen Antworten; du kannst jeden anderen nehmen.',
          en: 'Which sentences feel true — in your gut, not your head? Pick one to three. The marked ones follow from your answers; you can choose any others.',
        },
      },
      { t: 'special', name: 'beliefPick' },
      { t: 'special', name: 'beliefRateBefore' },
      { t: 'special', name: 'breakPoint' },
    ],
  },

  // --- Begegnung --------------------------------------------------------------
  {
    id: 'b-intro',
    phase: 'begegnung',
    title: { de: 'Dem Kind begegnen', en: 'Meeting the child' },
    minutes: 2,
    blocks: [
      {
        t: 'lead',
        text: {
          de: 'Jetzt begegnest du {kindDat}, das du einmal warst. Du bist dabei nicht das Kind – du bist heute erwachsen und schaust mit deinen heutigen Augen.',
          en: 'Now you will meet {kind}, the child you once were. You are not the child in this — you are an adult today, looking with today’s eyes.',
        },
      },
      {
        t: 'p',
        text: {
          de: 'Schließ bei den geführten Teilen gern die Augen und lass dir den Text vorlesen – oder lies langsam, Satz für Satz, und halte nach jedem Satz inne.',
          en: 'During the guided parts, feel free to close your eyes and have the text read aloud — or read slowly, sentence by sentence, pausing after each.',
        },
      },
      { t: 'question', q: entryQuestion, when: notGentle },
      { t: 'question', q: entryGentleQuestion, when: (d) => d.path === 'gentle' },
      {
        t: 'scale',
        id: 'sudPre',
        label: { de: 'Wie belastet fühlst du dich jetzt, bevor es losgeht?', en: 'How distressed do you feel now, before we begin?' },
        ...scale0to10,
      },
      { t: 'special', name: 'distressCheck' },
    ],
  },
  {
    id: 'b-situation',
    phase: 'begegnung',
    paths: STANDARD_DEEP,
    when: (d) => entry(d) === 'bridge',
    title: { de: 'Eine Situation von heute', en: 'A situation from today' },
    minutes: 3,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'Denk an eine Situation aus letzter Zeit, in der du so reagiert hast, wie du es vorhin beschrieben hast. Wähle eine, die dich mittel belastet – etwa 3 bis 6 von 10. Nicht die schlimmste. Wir üben an einem mittleren Gewicht, wie beim Krafttraining.',
          en: 'Think of a recent situation in which you reacted the way you described earlier. Choose one that is moderately distressing — about 3 to 6 out of 10. Not the worst. We practise with a medium weight, as in strength training.',
        },
      },
      { t: 'text', id: 'situation', label: { de: 'Was ist passiert? Ein, zwei Sätze genügen.', en: 'What happened? One or two sentences are enough.' }, rows: 3 },
      {
        t: 'scale',
        id: 'situationSud',
        label: { de: 'Wie sehr belastet dich diese Situation, wenn du jetzt daran denkst?', en: 'How much does this situation distress you when you think about it now?' },
        ...scale0to10,
      },
      { t: 'special', name: 'situationCheck' },
    ],
  },
  {
    id: 'b-bruecke',
    phase: 'begegnung',
    paths: STANDARD_DEEP,
    when: (d) => entry(d) === 'bridge',
    title: { de: 'Die Gefühlsbrücke', en: 'The affect bridge' },
    minutes: 5,
    blocks: [{ t: 'exercise', id: 'gefuehlsbruecke' }],
  },
  {
    id: 'b-foto',
    phase: 'begegnung',
    when: (d) => entry(d) === 'photo',
    title: { de: 'Das Foto', en: 'The photo' },
    minutes: 5,
    blocks: [{ t: 'exercise', id: 'kinderfoto' }],
  },
  {
    id: 'b-ort',
    phase: 'begegnung',
    when: (d) => entry(d) === 'safeplace',
    title: { de: 'Begegnung am sicheren Ort', en: 'Meeting at the safe place' },
    minutes: 5,
    blocks: [
      {
        t: 'guided',
        lines: [
          { text: { de: 'Geh in Gedanken an deinen sicheren Ort{ortZusatz}. Nimm dir Zeit, dort anzukommen: die Farben, die Geräusche, der Boden unter dir.', en: 'Go in your mind to your safe place{ortZusatz}. Take time to arrive: the colours, the sounds, the ground beneath you.' }, pause: 12 },
          { text: { de: 'Wenn du eine Helferfigur hast, darf sie jetzt dabei sein.', en: 'If you have a helper, they may be with you now.' }, pause: 6 },
          { text: { de: 'Stell dir vor, dass in einiger Entfernung ein Kind auftaucht. Es ist {kind} – du, als du jünger warst.', en: 'Imagine a child appearing at some distance. It is {kind} — you, when you were younger.' }, pause: 10 },
          { text: { de: 'Du musst nicht näher gehen. Schau erst einmal nur – so, als würdest du durch ein Fenster schauen. Du bestimmst den Abstand.', en: 'You don’t have to go closer. First just look — as if through a window. You decide the distance.' }, pause: 10 },
          { text: { de: 'Wie alt ist {kind} ungefähr? Was hat {kind} an? Wie ist die Haltung – aufrecht, zusammengesunken, zappelig, still?', en: 'Roughly how old is {kind}? What is {kind} wearing? What is the posture like — upright, slumped, fidgety, still?' }, pause: 15 },
          { text: { de: 'Welche Stimmung geht von {kindDat} aus? Du musst nichts deuten. Nur wahrnehmen.', en: 'What mood comes from {kind}? You don’t have to interpret anything. Just notice.' }, pause: 12 },
          { text: { de: 'Wenn es sich stimmig anfühlt, geh ein paar Schritte näher. Wenn nicht, bleib, wo du bist. Beides ist richtig.', en: 'If it feels right, take a few steps closer. If not, stay where you are. Both are right.' }, pause: 10 },
          { text: { de: 'Nimm wahr, was du empfindest, wenn du {kind} so siehst.', en: 'Notice what you feel as you see {kind} like this.' }, pause: 10 },
          { text: { de: 'Öffne die Augen, wenn du bereit bist, und halte fest, was du wahrgenommen hast.', en: 'Open your eyes when you are ready, and note what you noticed.' } },
        ],
      },
    ],
  },
  {
    id: 'b-kind',
    phase: 'begegnung',
    title: { de: 'Was du gesehen hast', en: 'What you saw' },
    minutes: 3,
    blocks: [
      { t: 'number', id: 'childAge', label: { de: 'Wie alt ist {kind} ungefähr?', en: 'Roughly how old is {kind}?' }, min: 0, max: 17 },
      { t: 'text', id: 'childLook', label: { de: 'Wie sieht {kind} aus? Was trägt, was tut {kind}?', en: 'What does {kind} look like? What is {kind} wearing, doing?' }, rows: 3 },
      { t: 'text', id: 'childScene', label: { de: 'Wo ist {kind}, und was geschieht gerade?', en: 'Where is {kind}, and what is happening?' }, rows: 3, when: (d) => entry(d) !== 'safeplace' },
      { t: 'question', q: childFeelsQuestion },
    ],
  },
  {
    id: 'b-haltung',
    phase: 'begegnung',
    title: { de: 'Deine Haltung', en: 'Your stance' },
    minutes: 2,
    blocks: [
      { t: 'question', q: selfFeelingQuestion },
      {
        t: 'scale',
        id: 'sudImagery',
        label: { de: 'Wie belastet fühlst du dich gerade?', en: 'How distressed do you feel right now?' },
        ...scale0to10,
      },
      { t: 'special', name: 'distressCheck' },
    ],
  },

  // --- Nachnähren --------------------------------------------------------------
  {
    id: 'n-intro',
    phase: 'nachnaehren',
    title: { de: 'Was {kind} gebraucht hätte', en: 'What {kind} would have needed' },
    minutes: 2,
    blocks: [
      {
        t: 'lead',
        text: {
          de: 'Jetzt kommt der wichtigste Teil. Du gibst {kindDat} in der Vorstellung, was damals gefehlt hat.',
          en: 'Now comes the most important part. In your imagination, you give {kind} what was missing back then.',
        },
      },
      {
        t: 'p',
        when: notGentle,
        text: {
          de: 'In der Schematherapie heißt diese Methode Imagery Rescripting: Die Szene wird in der Vorstellung verändert. Nicht die Vergangenheit ändert sich, aber das, was sie in dir gespeichert hat. Ein Erwachsener tritt hinzu und gibt dem Kind, was es gebraucht hätte. Das Gehirn unterscheidet bei inneren Bildern erstaunlich wenig zwischen vorgestellt und erlebt – deshalb wirkt das.',
          en: 'In schema therapy this method is called imagery rescripting: the scene is changed in the imagination. The past does not change, but what it stored in you does. An adult steps in and gives the child what it needed. With inner images, the brain distinguishes surprisingly little between imagined and experienced — that is why it works.',
        },
      },
      {
        t: 'p',
        when: (d) => d.path === 'gentle',
        text: {
          de: 'In der Schematherapie heißt das Nachbeelterung: Das erwachsene Ich gibt dem Kind, was es gebraucht hätte. Wir bleiben dafür an deinem sicheren Ort – dort kann nichts Belastendes geschehen.',
          en: 'In schema therapy this is called reparenting: the adult self gives the child what it needed. We will stay at your safe place for this — nothing distressing can happen there.',
        },
      },
      { t: 'question', q: helperWhoQuestion },
      { t: 'special', name: 'childNeedHint' },
      { t: 'question', q: childNeedQuestion },
    ],
  },
  {
    id: 'n-szene',
    phase: 'nachnaehren',
    title: { de: 'Die neue Szene', en: 'The new scene' },
    minutes: 6,
    blocks: [{ t: 'special', name: 'rescript' }],
  },
  {
    id: 'n-saetze',
    phase: 'nachnaehren',
    title: { de: 'Was {kind} hören muss', en: 'What {kind} needs to hear' },
    minutes: 3,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'Welche Sätze hätte {kind} damals hören müssen? Hier sind Vorschläge, die zu deinen Antworten passen. Wähle bis zu fünf – und ergänze gern einen eigenen. Eigene Worte wirken oft am stärksten.',
          en: 'Which sentences did {kind} need to hear back then? Here are suggestions that fit your answers. Choose up to five — and feel free to add your own. Your own words often have the strongest effect.',
        },
      },
      { t: 'special', name: 'sentences' },
    ],
  },
  {
    id: 'n-sprechen',
    phase: 'nachnaehren',
    title: { de: 'Sag es {kindDat}', en: 'Say it to {kind}' },
    minutes: 3,
    blocks: [{ t: 'special', name: 'speak' }],
  },
  {
    id: 'n-reaktion',
    phase: 'nachnaehren',
    title: { de: 'Wie {kind} antwortet', en: 'How {kind} responds' },
    minutes: 2,
    blocks: [{ t: 'question', q: childReactionQuestion }],
  },
  {
    id: 'n-ort',
    phase: 'nachnaehren',
    title: { de: 'Ein neuer Ort für {kind}', en: 'A new place for {kind}' },
    minutes: 4,
    blocks: [
      {
        t: 'guided',
        lines: [
          { text: { de: 'Nimm {kind} jetzt mit an deinen sicheren Ort{ortZusatz} – oder, wenn ihr schon dort seid, schaut ihn euch gemeinsam an.', en: 'Now take {kind} with you to your safe place{ortZusatz} — or, if you are already there, look at it together.' }, pause: 10 },
          { text: { de: 'Zeig {kindDat} alles: was du siehst, hörst, riechst. Vielleicht verändert {kind} den Ort ein wenig – mehr Farben, ein Baumhaus, ein Kuscheltier. Das ist erlaubt.', en: 'Show {kind} everything: what you see, hear, smell. Perhaps {kind} changes the place a little — more colours, a tree house, a cuddly toy. That is allowed.' }, pause: 15 },
          { text: { de: 'Sag: „Das ist jetzt auch dein Ort. Hier bist du sicher. Du musst nicht mehr zurück.“', en: 'Say: “This is your place now too. You are safe here. You don’t have to go back.”' }, pause: 8 },
          { text: { de: 'Frag, was {kind} hier gern tun möchte. Und lass es geschehen.', en: 'Ask what {kind} would like to do here. And let it happen.' }, pause: 15 },
          { text: { de: '{Kind} kann jetzt dort bleiben, gut aufgehoben – vielleicht mit {helfer}. Oder {kind} kommt in deinem Herzen mit. Frag, was sich richtig anfühlt.', en: '{Kind} can stay there now, well looked after — perhaps with {helfer}. Or {kind} comes along in your heart. Ask what feels right.' }, pause: 10 },
          { text: { de: 'Sag zum Abschied: „Ich komme wieder.“', en: 'Say as you part: “I will come back.”' }, pause: 6 },
          { text: { de: 'Und komm zurück in den Raum. Atme tief. Spür deine Füße auf dem Boden.', en: 'And come back into the room. Breathe deeply. Feel your feet on the floor.' } },
        ],
      },
    ],
  },
  {
    id: 'n-nachher',
    phase: 'nachnaehren',
    title: { de: 'Nachspüren', en: 'Noticing' },
    minutes: 2,
    blocks: [
      {
        t: 'scale',
        id: 'sudAfterImagery',
        label: { de: 'Wie belastet fühlst du dich jetzt?', en: 'How distressed do you feel now?' },
        ...scale0to10,
      },
      { t: 'special', name: 'beliefRateAfter' },
      {
        t: 'p',
        text: {
          de: 'Haben sich die Zahlen kaum verändert: völlig normal. Alte Sätze sind tief verwurzelt. Sie lockern sich durch Wiederholung, nicht durch eine einzelne Sitzung.',
          en: 'If the numbers have barely changed: completely normal. Old beliefs are deeply rooted. They loosen through repetition, not through a single session.',
        },
      },
    ],
  },

  // --- Beschützer --------------------------------------------------------------
  {
    id: 'p-beschuetzer',
    phase: 'beschuetzer',
    paths: DEEP,
    title: { de: 'Deinen Beschützer würdigen', en: 'Honouring your protector' },
    minutes: 8,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'Jede Schutzstrategie war einmal die beste Lösung eines Kindes, das keine bessere hatte. Beschützer lassen erst los, wenn sie sich gesehen und abgelöst fühlen – nicht, wenn man gegen sie kämpft. Im Modell Internal Family Systems ist das der entscheidende Schritt.',
          en: 'Every protective strategy was once the best solution of a child who had no better one. Protectors only let go when they feel seen and relieved — not when you fight them. In the Internal Family Systems model, this is the crucial step.',
        },
      },
      { t: 'special', name: 'protector' },
      { t: 'question', q: protectorResponseQuestion },
    ],
  },

  // --- Neue Sätze --------------------------------------------------------------
  {
    id: 'z-neu',
    phase: 'saetze',
    title: { de: 'Neue Sätze', en: 'New beliefs' },
    minutes: 4,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'Stefanie Stahl nennt sie Sonnenkind-Sätze: neue Überzeugungen, die neben die alten treten. Sie müssen sich nicht wahr anfühlen – nur möglich. Schon 20 bis 30 % sind ein guter Anfang. Überschwängliche Sätze („Ich bin großartig“) wirken übrigens eher gegenteilig; realistische Sätze wachsen besser.',
          en: 'Stefanie Stahl calls them sunshine-child beliefs: new convictions that stand alongside the old ones. They don’t have to feel true — only possible. Even 20 to 30 % is a good start. Effusive statements (“I am amazing”) tend to backfire, by the way; realistic ones grow better.',
        },
      },
      { t: 'special', name: 'newBeliefs' },
    ],
  },

  // --- Briefe ---------------------------------------------------------------------
  {
    id: 'l-brief',
    phase: 'briefe',
    title: { de: 'Ein Brief an {kind}', en: 'A letter to {kind}' },
    minutes: 6,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'Ein Brief hält fest, was heute geschehen ist, und du kannst ihn wieder lesen, wenn die alten Sätze laut werden. Aus deinen Antworten habe ich einen Entwurf vorbereitet. Er ist nur ein Anfang – schreib ihn um, streich, ergänze, bis er nach dir klingt.',
          en: 'A letter records what happened today, and you can read it again when the old beliefs get loud. I have prepared a draft from your answers. It is only a beginning — rewrite, delete, add until it sounds like you.',
        },
      },
      { t: 'special', name: 'letter' },
    ],
  },
  {
    id: 'l-antwort',
    phase: 'briefe',
    paths: DEEP,
    title: { de: 'Die Antwort von {kindDat}', en: 'The reply from {kind}' },
    minutes: 12,
    blocks: [
      { t: 'exercise', id: 'briefAndereHand' },
      { t: 'text', id: 'letterFromChild', label: { de: 'Wenn du magst, tipp ab, was {kind} geschrieben hat.', en: 'If you like, type out what {kind} wrote.' }, rows: 5 },
    ],
  },

  // --- Alltag -------------------------------------------------------------------
  {
    id: 't-ritual',
    phase: 'alltag',
    title: { de: 'Das tägliche Ritual', en: 'The daily ritual' },
    minutes: 2,
    blocks: [
      {
        t: 'lead',
        text: {
          de: 'Eine einzelne Sitzung öffnet eine Tür. Durchgehen musst du im Alltag – und zwar oft und in kleinen Schritten.',
          en: 'A single session opens a door. Walking through it happens in daily life — often, and in small steps.',
        },
      },
      {
        t: 'p',
        text: {
          de: 'Die wichtigste Übung ist deshalb die kleinste: Drei Minuten täglich, in denen du bei {kindDat} vorbeischaust. Unter „Täglich“ findest du sie jederzeit auf dieser Seite. So geht sie:',
          en: 'The most important exercise is therefore the smallest: three minutes a day in which you check in on {kind}. You can find it at any time under “Daily” on this site. It goes like this:',
        },
      },
      {
        t: 'list',
        items: [
          { de: 'Drei ruhige Atemzüge, Hand aufs Herz.', en: 'Three calm breaths, hand on heart.' },
          { de: '„Hallo {kind}. Wie geht es dir heute?“ – und spüren, was kommt.', en: '“Hello {kind}. How are you today?” — and feel what comes.' },
          { de: '„Was brauchst du heute von mir?“', en: '“What do you need from me today?”' },
          { de: 'Einen deiner Sätze sagen.', en: 'Say one of your sentences.' },
          { de: 'Eine kleine Sache versprechen – und sie heute tun.', en: 'Promise one small thing — and do it today.' },
        ],
      },
      {
        t: 'p',
        text: {
          de: 'Warum so klein? Weil Vertrauen durch Verlässlichkeit entsteht. Ein Kind, das erlebt, dass jemand jeden Tag wiederkommt, beginnt zu glauben, dass es wichtig ist.',
          en: 'Why so small? Because trust comes from reliability. A child who experiences someone coming back every day begins to believe that it matters.',
        },
      },
    ],
  },
  {
    id: 't-plan',
    phase: 'alltag',
    title: { de: 'Dein Plan für die nächsten Tage', en: 'Your plan for the coming days' },
    minutes: 5,
    blocks: [{ t: 'special', name: 'plan' }],
  },

  // --- Abschluss ---------------------------------------------------------------
  {
    id: 'x-tresor',
    phase: 'abschluss',
    title: { de: 'Wegschließen, was du nicht mitnehmen willst', en: 'Locking away what you don’t want to carry' },
    minutes: 4,
    blocks: [
      {
        t: 'p',
        text: {
          de: 'Wir kommen zum Ende. Eine gute Sitzung endet nie mitten im Gefühl, sondern stabil. Deshalb schließen wir zuerst weg, was heute nicht mehr gebraucht wird.',
          en: 'We are coming to the end. A good session never ends in the middle of a feeling, but in a stable place. So first we lock away what is no longer needed today.',
        },
      },
      { t: 'exercise', id: 'tresor' },
    ],
  },
  {
    id: 'x-rueckweg',
    phase: 'abschluss',
    title: { de: 'Zurück ins Hier und Jetzt', en: 'Back to the here and now' },
    minutes: 3,
    blocks: [{ t: 'exercise', id: 'reorientierung' }],
  },
  {
    id: 'x-nachher',
    phase: 'abschluss',
    title: { de: 'Wie es dir jetzt geht', en: 'How you are now' },
    minutes: 2,
    blocks: [
      {
        t: 'scale',
        id: 'moodAfter',
        label: { de: 'Wie geht es dir jetzt, alles in allem?', en: 'How are you now, all things considered?' },
        low: { de: '0 – sehr schlecht', en: '0 – very bad' },
        high: { de: '10 – sehr gut', en: '10 – very good' },
      },
      {
        t: 'scale',
        id: 'sudAfter',
        label: { de: 'Wie belastet oder angespannt fühlst du dich jetzt?', en: 'How distressed or tense do you feel now?' },
        low: { de: '0 – ganz ruhig', en: '0 – completely calm' },
        high: { de: '10 – extrem belastet', en: '10 – extremely distressed' },
      },
      { t: 'special', name: 'compare' },
      { t: 'text', id: 'takeaway', label: { de: 'Was nimmst du aus dieser Sitzung mit? Ein Satz genügt.', en: 'What are you taking away from this session? One sentence is enough.' }, rows: 3 },
    ],
  },
  {
    id: 'x-wuerdigung',
    phase: 'abschluss',
    title: { de: 'Was du heute getan hast', en: 'What you did today' },
    minutes: 2,
    blocks: [{ t: 'special', name: 'appreciation' }],
  },
];

export const stepById = new Map<string, Step>(steps.map((s) => [s.id, s]));
export const phaseById = new Map<PhaseId, Phase>(phases.map((p) => [p.id, p]));
export { childNeedQuestion, childReactionQuestion, entryQuestion, selfFeelingQuestion, helperTypeQuestion, placeWorkedQuestion, childFeelsQuestion, helperWhoQuestion, mirrorFitQuestion, protectorResponseQuestion, entryGentleQuestion };
