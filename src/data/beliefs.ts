import type { Belief, BeliefId } from './types';

/**
 * Glaubenssätze des „Schattenkinds“ (Stahl 2015) bzw. frühe maladaptive
 * Schemata (Young 1990) in Alltagssprache.
 *
 * Die neuen Sätze sind bewusst keine Affirmationen („Ich bin großartig“).
 * Ein Satz, dem man nicht glaubt, verstärkt eher das Gefühl, dass etwas nicht
 * stimmt (Wood, Perunovic & Lee 2009). Deshalb: realistisch, erlaubend,
 * unterscheidend zwischen damals und heute.
 */
export const beliefs: Belief[] = [
  {
    id: 'nichtGenug',
    text: { de: 'Ich bin nicht gut genug.', en: 'I am not good enough.' },
    feels: { de: 'Ein nagendes Gefühl, hinterher zu sein, egal wie viel man tut.', en: 'A gnawing sense of falling short, however much you do.' },
    origin: { de: 'Häufig aus Vergleichen, viel Kritik oder Zuneigung, die an Leistung geknüpft schien.', en: 'Often from comparisons, a lot of criticism, or affection that seemed tied to performance.' },
    needs: ['wert', 'autonomie'],
    sentences: [
      { de: 'Du bist genug. Genau so, wie du bist.', en: 'You are enough. Exactly as you are.' },
      { de: 'Du musst dir nichts verdienen.', en: 'You don’t have to earn anything.' },
    ],
    counters: [
      { de: 'Ich bin gut genug, auch wenn ich nicht alles kann.', en: 'I am good enough, even though I can’t do everything.' },
      { de: 'Ich darf wachsen, ohne vorher perfekt sein zu müssen.', en: 'I can grow without having to be perfect first.' },
      { de: 'Mein Wert hängt nicht an meiner letzten Leistung.', en: 'My worth does not depend on my last achievement.' },
    ],
  },
  {
    id: 'nichtLiebenswert',
    text: { de: 'Ich bin nicht liebenswert.', en: 'I am not lovable.' },
    feels: { de: 'Scham, das Gefühl, im Kern falsch zu sein, und Angst, dass andere es merken.', en: 'Shame, feeling wrong at the core, and fear that others will notice.' },
    origin: { de: 'Häufig, wenn Wärme fehlte, an Bedingungen geknüpft war oder ein Kind abgelehnt wurde.', en: 'Often when warmth was missing, came with conditions, or a child was rejected.' },
    needs: ['naehe', 'wert'],
    sentences: [
      { de: 'Ich hab dich lieb. Einfach so.', en: 'I love you. Just because.' },
      { de: 'Es lag nie an dir.', en: 'It was never about you.' },
    ],
    counters: [
      { de: 'Ich bin liebenswert – mit meinen Ecken und Kanten.', en: 'I am lovable — rough edges and all.' },
      { de: 'Dass ich damals zu wenig Liebe bekam, sagt etwas über die Umstände, nicht über mich.', en: 'That I received too little love back then says something about the circumstances, not about me.' },
      { de: 'Es gibt Menschen, die mich mögen, und ich darf das glauben.', en: 'There are people who like me, and I am allowed to believe it.' },
    ],
  },
  {
    id: 'zuViel',
    text: { de: 'Ich bin zu viel. Ich störe.', en: 'I am too much. I am a bother.' },
    feels: { de: 'Sich klein machen, leise sein, sich für die eigene Anwesenheit entschuldigen.', en: 'Making yourself small, staying quiet, apologising for being there at all.' },
    origin: { de: 'Häufig, wenn lebhafte, laute oder bedürftige Seiten als Last behandelt wurden.', en: 'Often when lively, loud or needy sides were treated as a burden.' },
    needs: ['ausdruck', 'naehe'],
    sentences: [
      { de: 'Du bist nicht zu viel. Du bist genau richtig.', en: 'You are not too much. You are just right.' },
      { de: 'Du störst nicht. Ich habe Zeit für dich.', en: 'You are not a bother. I have time for you.' },
    ],
    counters: [
      { de: 'Ich darf Raum einnehmen.', en: 'I am allowed to take up space.' },
      { de: 'Meine Lebendigkeit ist kein Fehler – manche Menschen mögen genau das an mir.', en: 'My liveliness is not a flaw — some people like exactly that about me.' },
      { de: 'Wer mich zu viel findet, passt vielleicht nicht zu mir. Das heißt nicht, dass ich falsch bin.', en: 'If someone finds me too much, they may not be the right fit. That does not make me wrong.' },
    ],
  },
  {
    id: 'unwichtig',
    text: { de: 'Meine Bedürfnisse sind nicht wichtig.', en: 'My needs don’t matter.' },
    feels: { de: 'Automatisch zurückstecken, erst merken, was man braucht, wenn man erschöpft ist.', en: 'Automatically stepping back, only noticing what you need once you are exhausted.' },
    origin: { de: 'Häufig, wenn andere Bedürfnisse in der Familie immer Vorrang hatten.', en: 'Often when other needs in the family always came first.' },
    needs: ['ausdruck', 'wert'],
    sentences: [
      { de: 'Was du brauchst, ist wichtig.', en: 'What you need matters.' },
      { de: 'Sag mir, was du brauchst. Ich höre zu.', en: 'Tell me what you need. I am listening.' },
    ],
    counters: [
      { de: 'Meine Bedürfnisse sind genauso wichtig wie die der anderen.', en: 'My needs matter just as much as other people’s.' },
      { de: 'Für mich zu sorgen ist nicht egoistisch, sondern notwendig.', en: 'Taking care of myself is not selfish, it is necessary.' },
      { de: 'Ich darf fragen, was ich brauche – auch wenn die Antwort manchmal Nein ist.', en: 'I am allowed to ask for what I need — even if the answer is sometimes no.' },
    ],
  },
  {
    id: 'allein',
    text: { de: 'Ich bin allein. Auf niemanden ist Verlass.', en: 'I am alone. I can’t rely on anyone.' },
    feels: { de: 'Alles selbst machen, Hilfe schwer annehmen, eine tiefe Einsamkeit.', en: 'Doing everything yourself, finding it hard to accept help, a deep loneliness.' },
    origin: { de: 'Häufig, wenn ein Kind viel allein war oder Erwachsene nicht verlässlich da waren.', en: 'Often when a child spent a lot of time alone or adults were not reliably there.' },
    needs: ['naehe', 'sicherheit'],
    sentences: [
      { de: 'Du bist nicht allein. Ich bin da.', en: 'You are not alone. I am here.' },
      { de: 'Ich bleibe – heute und morgen auch.', en: 'I am staying — today and tomorrow too.' },
    ],
    counters: [
      { de: 'Heute gibt es Menschen, auf die ich mich verlassen kann – und ich kann mir selbst eine verlässliche Begleitung sein.', en: 'Today there are people I can rely on — and I can be a reliable companion to myself.' },
      { de: 'Ich darf um Hilfe bitten.', en: 'I am allowed to ask for help.' },
      { de: 'Damals war ich allein. Heute muss ich es nicht mehr sein.', en: 'Back then I was alone. Today I don’t have to be.' },
    ],
  },
  {
    id: 'fehler',
    text: { de: 'Ich darf keine Fehler machen.', en: 'I must not make mistakes.' },
    feels: { de: 'Anspannung, Kontrolle, Scham nach jedem Fehler und langes Nachgrübeln.', en: 'Tension, checking, shame after every mistake and long rumination.' },
    origin: { de: 'Häufig, wenn Fehler Kritik, Strafe oder Beschämung nach sich zogen.', en: 'Often when mistakes led to criticism, punishment or shaming.' },
    needs: ['wert', 'autonomie', 'sicherheit'],
    sentences: [
      { de: 'Fehler sind erlaubt. Ich mag dich trotzdem genauso.', en: 'Mistakes are allowed. I like you just as much anyway.' },
      { de: 'Du musst nicht perfekt sein.', en: 'You don’t have to be perfect.' },
    ],
    counters: [
      { de: 'Fehler gehören zum Lernen. Ich darf Fehler machen und bin trotzdem in Ordnung.', en: 'Mistakes are part of learning. I can make mistakes and still be okay.' },
      { de: 'Ein Fehler ist ein Ereignis, kein Urteil über mich.', en: 'A mistake is an event, not a verdict on me.' },
      { de: 'Gut genug ist oft gut genug.', en: 'Good enough is often good enough.' },
    ],
  },
  {
    id: 'schuld',
    text: { de: 'Ich bin schuld, wenn es anderen schlecht geht.', en: 'It is my fault when others are unwell.' },
    feels: { de: 'Schnelles Schuldgefühl, Verantwortung für die Stimmung anderer, sich schwer abgrenzen.', en: 'Quick guilt, feeling responsible for other people’s moods, difficulty setting boundaries.' },
    origin: { de: 'Häufig, wenn ein Kind für Erwachsene sorgen musste oder für deren Probleme verantwortlich gemacht wurde.', en: 'Often when a child had to look after adults or was blamed for their problems.' },
    needs: ['grenzen', 'sicherheit'],
    sentences: [
      { de: 'Es war nicht deine Schuld.', en: 'It was not your fault.' },
      { de: 'Du bist nicht dafür zuständig, dass es den Großen gut geht.', en: 'It is not your job to make the grown-ups feel better.' },
    ],
    counters: [
      { de: 'Ich bin nicht für die Gefühle anderer Erwachsener verantwortlich.', en: 'I am not responsible for the feelings of other adults.' },
      { de: 'Was damals passiert ist, war nicht die Schuld eines Kindes.', en: 'What happened back then was not a child’s fault.' },
      { de: 'Ich darf mitfühlen, ohne die Last zu übernehmen.', en: 'I can feel with others without taking on their load.' },
    ],
  },
  {
    id: 'unsicher',
    text: { de: 'Die Welt ist gefährlich. Ich muss wachsam sein.', en: 'The world is dangerous. I have to stay alert.' },
    feels: { de: 'Anspannung, Schreckhaftigkeit, das Schlimmste erwarten, schwer zur Ruhe kommen.', en: 'Tension, jumpiness, expecting the worst, finding it hard to settle.' },
    origin: { de: 'Häufig nach Unberechenbarkeit, Streit, Gewalt oder Überbehütung.', en: 'Often after unpredictability, conflict, violence or overprotection.' },
    needs: ['sicherheit'],
    sentences: [
      { de: 'Du bist jetzt sicher.', en: 'You are safe now.' },
      { de: 'Ich passe auf. Du darfst dich ausruhen.', en: 'I am keeping watch. You can rest.' },
    ],
    counters: [
      { de: 'Ich bin heute erwachsen und kann mich schützen.', en: 'I am an adult today and I can protect myself.' },
      { de: 'Nicht jede Unsicherheit ist eine Gefahr. Ich darf mich auch entspannen.', en: 'Not every uncertainty is a danger. I am allowed to relax too.' },
      { de: 'Damals war es gefährlich. Heute ist heute.', en: 'Back then it was dangerous. Today is today.' },
    ],
  },
  {
    id: 'hilflos',
    text: { de: 'Ich schaffe das nicht. Ich bin hilflos.', en: 'I can’t manage. I am helpless.' },
    feels: { de: 'Sich klein fühlen vor Aufgaben, schnell aufgeben oder gar nicht erst anfangen.', en: 'Feeling small in the face of tasks, giving up quickly or never starting.' },
    origin: { de: 'Häufig, wenn einem Kind wenig zugetraut oder alles abgenommen wurde – oder es tatsächlich überfordert war.', en: 'Often when a child was trusted with little, had everything done for them — or really was overwhelmed.' },
    needs: ['autonomie', 'grenzen'],
    sentences: [
      { de: 'Ich traue dir das zu.', en: 'I believe you can do this.' },
      { de: 'Wir schaffen das zusammen, Schritt für Schritt.', en: 'We will manage this together, step by step.' },
    ],
    counters: [
      { de: 'Ich habe schon viel geschafft, auch Schweres.', en: 'I have already managed a lot, including hard things.' },
      { de: 'Ich muss nicht alles allein können – und ich kann mehr, als ich denke.', en: 'I don’t have to be able to do everything alone — and I can do more than I think.' },
      { de: 'Damals war ich klein. Heute habe ich Möglichkeiten.', en: 'Back then I was small. Today I have options.' },
    ],
  },
  {
    id: 'gefuehle',
    text: { de: 'Gefühle zu zeigen ist gefährlich oder schwach.', en: 'Showing feelings is dangerous or weak.' },
    feels: { de: 'Funktionieren, Gefühle wegdrücken, sich schämen, wenn doch Tränen kommen.', en: 'Functioning, pushing feelings away, feeling ashamed when tears do come.' },
    origin: { de: 'Häufig, wenn Gefühle kleingeredet, belächelt oder bestraft wurden.', en: 'Often when feelings were dismissed, laughed at or punished.' },
    needs: ['ausdruck'],
    sentences: [
      { de: 'Du darfst weinen.', en: 'You are allowed to cry.' },
      { de: 'Deine Gefühle sind hier willkommen.', en: 'Your feelings are welcome here.' },
    ],
    counters: [
      { de: 'Gefühle sind Informationen, keine Schwäche.', en: 'Feelings are information, not weakness.' },
      { de: 'Bei Menschen, denen ich vertraue, darf ich zeigen, wie es mir geht.', en: 'With people I trust, I can show how I am.' },
      { de: 'Es braucht Stärke, Gefühle zuzulassen.', en: 'It takes strength to allow feelings.' },
    ],
  },
  {
    id: 'anpassen',
    text: { de: 'Ich muss es allen recht machen, sonst werde ich abgelehnt.', en: 'I have to please everyone or I will be rejected.' },
    feels: { de: 'Sich ständig nach anderen richten, eigene Meinung zurückhalten, Konflikte um jeden Preis vermeiden.', en: 'Constantly adjusting to others, holding back your own opinion, avoiding conflict at any cost.' },
    origin: { de: 'Häufig, wenn Zuneigung davon abhing, brav, angepasst und pflegeleicht zu sein.', en: 'Often when affection depended on being good, compliant and easy to handle.' },
    needs: ['wert', 'ausdruck'],
    sentences: [
      { de: 'Du musst niemandem gefallen, damit ich bleibe.', en: 'You don’t have to please anyone for me to stay.' },
      { de: 'Du darfst anderer Meinung sein.', en: 'You are allowed to disagree.' },
    ],
    counters: [
      { de: 'Ich darf anderer Meinung sein und trotzdem verbunden bleiben.', en: 'I can disagree and still stay connected.' },
      { de: 'Wer mich nur mag, wenn ich funktioniere, mag nicht mich.', en: 'Anyone who only likes me when I function does not like me.' },
      { de: 'Es ist in Ordnung, nicht von allen gemocht zu werden.', en: 'It is okay not to be liked by everyone.' },
    ],
  },
  {
    id: 'nichtWehren',
    text: { de: 'Ich darf mich nicht wehren. Ich darf nicht Nein sagen.', en: 'I must not stand up for myself. I must not say no.' },
    feels: { de: 'Ja sagen, obwohl man Nein meint, Wut, die nach innen geht, Ohnmacht.', en: 'Saying yes when you mean no, anger that turns inwards, powerlessness.' },
    origin: { de: 'Häufig, wenn Widerspruch bestraft, belächelt oder mit Liebesentzug beantwortet wurde.', en: 'Often when pushing back was punished, mocked or met with withdrawal of love.' },
    needs: ['ausdruck', 'autonomie', 'sicherheit'],
    sentences: [
      { de: 'Du darfst Nein sagen.', en: 'You are allowed to say no.' },
      { de: 'Du darfst dich wehren. Ich stehe hinter dir.', en: 'You are allowed to stand up for yourself. I am right behind you.' },
    ],
    counters: [
      { de: 'Ich darf Nein sagen – freundlich und klar.', en: 'I am allowed to say no — kindly and clearly.' },
      { de: 'Mich zu schützen ist mein Recht.', en: 'Protecting myself is my right.' },
      { de: 'Ein Nein zu einer Sache ist kein Nein zu einem Menschen.', en: 'A no to a thing is not a no to a person.' },
    ],
  },
  {
    id: 'verlassen',
    text: { de: 'Am Ende werde ich verlassen.', en: 'In the end I will be left.' },
    feels: { de: 'Verlustangst, Klammern oder vorsorglicher Rückzug, Unruhe bei ausbleibenden Nachrichten.', en: 'Fear of loss, clinging or pre-emptive withdrawal, unease when messages don’t come.' },
    origin: { de: 'Häufig nach Trennungen, Verlusten oder Zuneigung, die mal da war und mal nicht.', en: 'Often after separations, losses, or affection that was sometimes there and sometimes not.' },
    needs: ['naehe', 'sicherheit'],
    sentences: [
      { de: 'Ich verlasse dich nicht.', en: 'I will not leave you.' },
      { de: 'Ich komme wieder. Jeden Tag.', en: 'I will come back. Every day.' },
    ],
    counters: [
      { de: 'Beziehungen können enden – aber ich verlasse mich nicht selbst.', en: 'Relationships can end — but I will not abandon myself.' },
      { de: 'Nicht jede Distanz ist ein Abschied.', en: 'Not every distance is a goodbye.' },
      { de: 'Ich kann einen Verlust überstehen. Ich habe es schon getan.', en: 'I can survive a loss. I have done it before.' },
    ],
  },
  {
    id: 'kontrolle',
    text: { de: 'Ich muss alles unter Kontrolle haben.', en: 'I have to keep everything under control.' },
    feels: { de: 'Planen, absichern, schwer abgeben können, Unruhe, wenn etwas offen ist.', en: 'Planning, double-checking, finding it hard to delegate, unease when things are open.' },
    origin: { de: 'Häufig, wenn das Zuhause chaotisch oder unberechenbar war und Kontrolle Sicherheit versprach.', en: 'Often when home was chaotic or unpredictable and control promised safety.' },
    needs: ['sicherheit', 'grenzen'],
    sentences: [
      { de: 'Du musst nicht alles im Griff haben. Das mache ich.', en: 'You don’t have to have everything under control. I will do that.' },
      { de: 'Du darfst loslassen. Ich halte.', en: 'You can let go. I am holding on.' },
    ],
    counters: [
      { de: 'Ich kann vieles beeinflussen, aber nicht alles – und das ist aushaltbar.', en: 'I can influence a lot, but not everything — and that is bearable.' },
      { de: 'Ich darf etwas abgeben und anderen vertrauen.', en: 'I can hand something over and trust others.' },
      { de: 'Wenn etwas schiefgeht, finde ich einen Weg.', en: 'If something goes wrong, I will find a way.' },
    ],
  },
  {
    id: 'leistung',
    text: { de: 'Ich bin nur etwas wert, wenn ich etwas leiste.', en: 'I am only worth something if I achieve.' },
    feels: { de: 'Ruhe fühlt sich wie Faulheit an, Pausen müssen verdient werden, Erschöpfung.', en: 'Rest feels like laziness, breaks have to be earned, exhaustion.' },
    origin: { de: 'Häufig, wenn Anerkennung vor allem für Noten, Hilfe oder Erfolg kam.', en: 'Often when recognition came mainly for grades, helping or success.' },
    needs: ['wert', 'spiel'],
    sentences: [
      { de: 'Du bist wertvoll, auch wenn du gar nichts tust.', en: 'You are precious even when you do nothing at all.' },
      { de: 'Du darfst ausruhen.', en: 'You are allowed to rest.' },
    ],
    counters: [
      { de: 'Ich bin wertvoll, auch wenn ich nichts leiste.', en: 'I am worthy even when I don’t achieve anything.' },
      { de: 'Ausruhen muss ich mir nicht verdienen. Es ist ein Bedürfnis.', en: 'I don’t have to earn rest. It is a need.' },
      { de: 'Die Menschen, die mir wichtig sind, mögen mich nicht wegen meiner Leistung.', en: 'The people who matter to me don’t like me because of what I achieve.' },
    ],
  },
];

export const beliefById = new Map<BeliefId, Belief>(beliefs.map((b) => [b.id, b]));
export const BELIEF_IDS: BeliefId[] = beliefs.map((b) => b.id);
