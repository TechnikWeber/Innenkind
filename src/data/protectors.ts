import type { Protector, ProtectorId } from './types';

/**
 * Schutzstrategien – bei Stahl „Schutzstrategien“, in der Schematherapie
 * Bewältigungsmodi, im IFS-Modell „Manager“ und „Feuerwehrleute“.
 *
 * Allen gemeinsam: Sie waren einmal eine kluge Lösung für ein Kind, das keine
 * bessere hatte. Deshalb werden sie hier gewürdigt und entlastet, nicht
 * bekämpft. Wer gegen einen Beschützer kämpft, macht ihn stärker.
 */
export const protectors: Protector[] = [
  {
    id: 'perfektion',
    name: { de: 'Perfektionismus', en: 'Perfectionism' },
    voice: { de: 'Ich sorge dafür, dass alles fehlerfrei ist. Dann kann uns niemand kritisieren.', en: 'I make sure everything is flawless. Then no one can criticise us.' },
    protects: { de: 'vor Kritik, Beschämung und dem Gefühl, nicht zu genügen', en: 'from criticism, shame and the feeling of not being enough' },
    cost: { de: 'Erschöpfung, Aufschieben, nie zufrieden sein, wenig Freude am Erreichten', en: 'exhaustion, procrastination, never being satisfied, little joy in what you achieve' },
    thanks: { de: 'Danke, dass du so hart gearbeitet hast, damit uns niemand verletzen kann.', en: 'Thank you for working so hard so that no one could hurt us.' },
    offer: { de: 'Ich passe jetzt mit auf. An vielen Stellen reicht „gut genug“. Du darfst öfter Pause machen.', en: 'I am keeping watch too now. In many places “good enough” is enough. You are allowed to take more breaks.' },
    alternative: { de: 'Bewusst eine Sache mit 80 % abgeben und beobachten, was passiert.', en: 'Deliberately hand in one thing at 80 % and watch what happens.' },
  },
  {
    id: 'anpassung',
    name: { de: 'Anpassung – es allen recht machen', en: 'Pleasing — keeping everyone happy' },
    voice: { de: 'Ich spüre, was die anderen wollen, und liefere es. Dann bleiben sie freundlich.', en: 'I sense what others want and deliver it. Then they stay friendly.' },
    protects: { de: 'vor Ablehnung, Streit und Verlassenwerden', en: 'from rejection, conflict and being left' },
    cost: { de: 'die eigenen Wünsche verlieren, stille Wut, Erschöpfung, Beziehungen, in denen man nicht wirklich vorkommt', en: 'losing your own wishes, silent anger, exhaustion, relationships you are not really part of' },
    thanks: { de: 'Danke, dass du so feinfühlig warst und uns durch schwierige Stimmungen gebracht hast.', en: 'Thank you for being so sensitive and getting us through difficult moods.' },
    offer: { de: 'Ich kann heute mit Ärger umgehen. Du musst nicht mehr jede Stimmung retten.', en: 'I can deal with displeasure today. You don’t have to rescue every mood any more.' },
    alternative: { de: 'Vor einem Ja kurz innehalten: „Ich melde mich gleich.“ Dann prüfen, was du willst.', en: 'Pause before saying yes: “I will get back to you.” Then check what you want.' },
  },
  {
    id: 'kuemmern',
    name: { de: 'Helfen & Kümmern', en: 'Helping & caretaking' },
    voice: { de: 'Ich kümmere mich um alle. Wenn es den anderen gut geht, sind wir sicher und gebraucht.', en: 'I take care of everyone. When the others are fine, we are safe and needed.' },
    protects: { de: 'vor Hilflosigkeit, Schuld und dem Gefühl, nicht gebraucht zu werden', en: 'from helplessness, guilt and the feeling of not being needed' },
    cost: { de: 'Überforderung, eigene Bedürfnisse bleiben liegen, einseitige Beziehungen', en: 'overload, your own needs get left behind, one-sided relationships' },
    thanks: { de: 'Danke, dass du so viel Verantwortung getragen hast, als niemand sonst es tat.', en: 'Thank you for carrying so much responsibility when no one else did.' },
    offer: { de: 'Die Erwachsenen von damals sind für sich selbst zuständig. Du darfst auch für uns sorgen.', en: 'The adults from back then are responsible for themselves. You are allowed to care for us too.' },
    alternative: { de: 'Einmal nicht sofort helfen, sondern fragen: „Was brauchst du von mir?“ – und dann auch dich fragen.', en: 'For once, don’t help straight away; ask: “What do you need from me?” — and then ask yourself too.' },
  },
  {
    id: 'rueckzug',
    name: { de: 'Rückzug', en: 'Withdrawal' },
    voice: { de: 'Ich mache zu und gehe weg. Wo niemand ist, kann uns niemand verletzen.', en: 'I shut down and leave. Where there is no one, no one can hurt us.' },
    protects: { de: 'vor Verletzung, Überforderung und Zurückweisung', en: 'from hurt, overwhelm and rejection' },
    cost: { de: 'Einsamkeit, Missverständnisse, verpasste Nähe', en: 'loneliness, misunderstandings, missed closeness' },
    thanks: { de: 'Danke, dass du uns in Sicherheit gebracht hast, wenn es zu viel war.', en: 'Thank you for taking us to safety when it was too much.' },
    offer: { de: 'Rückzug darf bleiben – als Pause, nicht als Mauer. Ich sage den anderen, dass wir wiederkommen.', en: 'Withdrawal can stay — as a pause, not a wall. I will tell the others that we will come back.' },
    alternative: { de: 'Beim Rückzug einen Satz dalassen: „Ich brauche eine Stunde, dann melde ich mich.“', en: 'When withdrawing, leave a sentence behind: “I need an hour, then I will get back to you.”' },
  },
  {
    id: 'kontrolle',
    name: { de: 'Kontrolle & Planen', en: 'Control & planning' },
    voice: { de: 'Ich plane alles und behalte den Überblick. Dann kann uns nichts überraschen.', en: 'I plan everything and keep track. Then nothing can surprise us.' },
    protects: { de: 'vor Chaos, Ohnmacht und Unberechenbarkeit', en: 'from chaos, powerlessness and unpredictability' },
    cost: { de: 'Anspannung, wenig Spontaneität, Konflikte mit anderen, schwer abschalten', en: 'tension, little spontaneity, conflicts with others, trouble switching off' },
    thanks: { de: 'Danke, dass du Ordnung geschaffen hast, als um uns herum alles unsicher war.', en: 'Thank you for creating order when everything around us was uncertain.' },
    offer: { de: 'Heute ist es sicherer. Du darfst an kleinen Stellen ausprobieren, loszulassen. Ich bin da, falls etwas schiefgeht.', en: 'It is safer today. You can try letting go in small places. I am here in case something goes wrong.' },
    alternative: { de: 'Einmal pro Woche etwas bewusst offen lassen und beobachten, wie es sich anfühlt.', en: 'Once a week, deliberately leave something open and notice how it feels.' },
  },
  {
    id: 'angriff',
    name: { de: 'Angriff & Wut', en: 'Attack & anger' },
    voice: { de: 'Ich schlage zurück, bevor uns jemand klein macht.', en: 'I strike back before anyone can make us small.' },
    protects: { de: 'vor Ohnmacht, Demütigung und Ungerechtigkeit', en: 'from powerlessness, humiliation and injustice' },
    cost: { de: 'verletzte Beziehungen, Reue, andere gehen auf Abstand', en: 'damaged relationships, regret, others keeping their distance' },
    thanks: { de: 'Danke, dass du für uns gekämpft hast, als uns niemand verteidigt hat.', en: 'Thank you for fighting for us when no one defended us.' },
    offer: { de: 'Deine Kraft ist wertvoll. Lass sie uns für klare Grenzen nutzen statt für Verletzungen. Ich stehe dafür ein.', en: 'Your strength is valuable. Let us use it for clear boundaries rather than hurting. I will stand up for us.' },
    alternative: { de: 'Wenn die Wut hochkommt: erst zehn Atemzüge oder kurz rausgehen, dann einen Ich-Satz sagen.', en: 'When anger rises: first ten breaths or step outside briefly, then say an “I” statement.' },
  },
  {
    id: 'betaeuben',
    name: { de: 'Betäuben & Ablenken', en: 'Numbing & distraction' },
    voice: { de: 'Ich sorge dafür, dass der Schmerz nicht durchkommt – mit Essen, Bildschirm, Arbeit oder etwas anderem.', en: 'I make sure the pain doesn’t get through — with food, screens, work or something else.' },
    protects: { de: 'vor überwältigenden Gefühlen, Leere und Einsamkeit', en: 'from overwhelming feelings, emptiness and loneliness' },
    cost: { de: 'die Gefühle bleiben unverarbeitet, Gesundheit, Zeit, manchmal Abhängigkeit', en: 'the feelings stay unprocessed, health, time, sometimes dependence' },
    thanks: { de: 'Danke, dass du uns über Momente gebracht hast, die zu schwer waren.', en: 'Thank you for getting us through moments that were too heavy.' },
    offer: { de: 'Ich kann heute einen Teil dieser Gefühle halten. Lass uns einmal kurz hinschauen, bevor du übernimmst.', en: 'I can hold part of these feelings today. Let us look for a moment before you take over.' },
    alternative: { de: 'Vor dem Griff zum Handy, Kühlschrank oder Glas eine Minute Hand aufs Herz und fragen: Was fühle ich gerade?', en: 'Before reaching for the phone, fridge or glass, spend a minute with a hand on your heart and ask: What am I feeling right now?' },
  },
  {
    id: 'leisten',
    name: { de: 'Leisten & Beschäftigtsein', en: 'Achieving & keeping busy' },
    voice: { de: 'Ich halte uns beschäftigt und erfolgreich. Wer leistet, ist etwas wert – und muss nichts fühlen.', en: 'I keep us busy and successful. Whoever achieves is worth something — and doesn’t have to feel.' },
    protects: { de: 'vor Wertlosigkeit, Leere und schmerzhaften Gefühlen', en: 'from worthlessness, emptiness and painful feelings' },
    cost: { de: 'Erschöpfung, Burn-out-Gefahr, keine echte Erholung', en: 'exhaustion, risk of burnout, no real recovery' },
    thanks: { de: 'Danke, dass du uns so viel ermöglicht hast.', en: 'Thank you for making so much possible for us.' },
    offer: { de: 'Wir sind auch ohne Leistung wertvoll. Du darfst Feierabend machen.', en: 'We are valuable without achieving too. You are allowed to clock off.' },
    alternative: { de: 'Pausen in den Kalender schreiben und sie so ernst nehmen wie Termine.', en: 'Put breaks in the calendar and take them as seriously as appointments.' },
  },
  {
    id: 'kritiker',
    name: { de: 'Innerer Kritiker', en: 'Inner critic' },
    voice: { de: 'Ich kritisiere uns, bevor es andere tun. Dann tut es weniger weh – und wir strengen uns an.', en: 'I criticise us before others can. Then it hurts less — and we make an effort.' },
    protects: { de: 'vor Beschämung durch andere, vor Versagen, vor Ablehnung', en: 'from being shamed by others, from failure, from rejection' },
    cost: { de: 'ständige Selbstabwertung, Angst, Niedergeschlagenheit', en: 'constant self-criticism, anxiety, low mood' },
    thanks: { de: 'Danke, dass du uns schützen wolltest. Ich weiß, du hast es gut gemeint.', en: 'Thank you for wanting to protect us. I know you meant well.' },
    offer: { de: 'Ich höre dich. Aber du darfst freundlicher werden – wir lernen mit Ermutigung besser als mit Härte.', en: 'I hear you. But you are allowed to become kinder — we learn better with encouragement than with harshness.' },
    alternative: { de: 'Den Satz des Kritikers aufschreiben und darunter, was eine gute Freundin dazu sagen würde.', en: 'Write down the critic’s sentence and below it, what a good friend would say to it.' },
  },
  {
    id: 'vermeiden',
    name: { de: 'Vermeiden & Aufschieben', en: 'Avoidance & procrastination' },
    voice: { de: 'Ich halte uns fern von allem, was schiefgehen könnte.', en: 'I keep us away from anything that could go wrong.' },
    protects: { de: 'vor Versagen, Bloßstellung und Überforderung', en: 'from failure, exposure and overwhelm' },
    cost: { de: 'verpasste Chancen, wachsender Druck, das Gefühl, nicht vom Fleck zu kommen', en: 'missed opportunities, growing pressure, the feeling of being stuck' },
    thanks: { de: 'Danke, dass du uns vor Situationen bewahrt hast, die damals zu groß waren.', en: 'Thank you for keeping us out of situations that were too big back then.' },
    offer: { de: 'Wir gehen in kleinen Schritten. Ich halte deine Hand, und wir hören auf, wenn es zu viel wird.', en: 'We will go in small steps. I will hold your hand, and we will stop if it gets too much.' },
    alternative: { de: 'Fünf-Minuten-Regel: Nur fünf Minuten anfangen, danach darfst du aufhören.', en: 'Five-minute rule: just start for five minutes, then you are allowed to stop.' },
  },
  {
    id: 'fassade',
    name: { de: 'Fassade – „Alles gut“', en: 'The façade — “All fine”' },
    voice: { de: 'Ich zeige nach außen, dass alles in Ordnung ist. Dann fragt niemand nach, und niemand sieht die Wunde.', en: 'I show the world that everything is fine. Then no one asks, and no one sees the wound.' },
    protects: { de: 'vor Scham, Mitleid und dem Risiko, sich verletzlich zu zeigen', en: 'from shame, pity and the risk of being vulnerable' },
    cost: { de: 'Einsamkeit hinter dem Lächeln, niemand kann wirklich helfen', en: 'loneliness behind the smile, no one can really help' },
    thanks: { de: 'Danke, dass du uns stark aussehen lassen hast, als Schwäche gefährlich war.', en: 'Thank you for making us look strong when weakness was dangerous.' },
    offer: { de: 'Bei ausgewählten Menschen darfst du einen Spalt breit öffnen. Ich entscheide mit, bei wem.', en: 'With selected people you may open up a crack. I will help decide with whom.' },
    alternative: { de: 'Einem vertrauten Menschen einmal ehrlich antworten, wenn er fragt, wie es dir geht.', en: 'Answer one trusted person honestly next time they ask how you are.' },
  },
  {
    id: 'gruebeln',
    name: { de: 'Grübeln & Sorgen', en: 'Rumination & worry' },
    voice: { de: 'Ich denke alles durch, immer wieder. Dann sind wir vorbereitet.', en: 'I think everything through, again and again. Then we are prepared.' },
    protects: { de: 'vor Überraschung, Hilflosigkeit und davor, etwas falsch zu machen', en: 'from being caught off guard, helplessness and getting things wrong' },
    cost: { de: 'Schlafprobleme, Anspannung, Kopfkino, wenig Gegenwart', en: 'sleep problems, tension, a mind that won’t stop, little presence' },
    thanks: { de: 'Danke, dass du so wachsam für uns warst.', en: 'Thank you for being so watchful for us.' },
    offer: { de: 'Wir geben dem Grübeln eine feste Zeit am Tag. Außerhalb davon darfst du dich ausruhen.', en: 'We will give worrying a fixed time each day. Outside it, you are allowed to rest.' },
    alternative: { de: 'Eine feste „Sorgenzeit“ von 15 Minuten; kommt der Gedanke vorher, aufschreiben und vertagen.', en: 'A fixed 15-minute “worry time”; if the thought comes earlier, write it down and postpone it.' },
  },
];

export const protectorById = new Map<ProtectorId, Protector>(protectors.map((p) => [p.id, p]));
export const PROTECTOR_IDS: ProtectorId[] = protectors.map((p) => p.id);
