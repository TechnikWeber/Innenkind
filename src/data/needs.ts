import type { Need, NeedId } from './types';

/**
 * Die sieben Bedürfnisse, aus denen die Auswertung rechnet.
 *
 * Grundlage sind die fünf emotionalen Grundbedürfnisse der Schematherapie
 * (Young, Klosko & Weishaar 2003) – sichere Bindung; Autonomie, Kompetenz und
 * Identität; Freiheit, Bedürfnisse und Gefühle auszudrücken; Spontaneität und
 * Spiel; realistische Grenzen – abgeglichen mit Grawes vier Grundbedürfnissen
 * (Bindung, Orientierung/Kontrolle, Lust, Selbstwert). Sichere Bindung ist
 * hier dreigeteilt, weil „sicher“, „getröstet“ und „gesehen“ im Erleben sehr
 * verschiedene Mängel sind und verschiedene Antworten brauchen.
 *
 * Platzhalter: {kind}, {Kind}, {kindDat} – Name des Kindes oder „das Kind“.
 */
export const needs: Need[] = [
  {
    id: 'sicherheit',
    name: { de: 'Sicherheit & Verlässlichkeit', en: 'Safety & reliability' },
    childVoice: { de: '„Ich brauche jemanden, der aufpasst, damit ich es nicht muss.“', en: '“I need someone to keep watch so that I don’t have to.”' },
    description: {
      de: 'Ein Zuhause, das vorhersehbar ist. Erwachsene, deren Stimmung man nicht ständig lesen muss. Die Gewissheit: Mir passiert nichts – und wenn doch, ist jemand da, der mich schützt.',
      en: 'A home that is predictable. Adults whose moods you do not have to read all the time. The certainty that nothing will happen to you — and if it does, someone is there to protect you.',
    },
    signs: {
      de: 'Ständige Wachsamkeit, schwer abschalten können, Schreckhaftigkeit, ein großes Bedürfnis nach Kontrolle, Anspannung bei lauten Stimmen oder schlechter Stimmung.',
      en: 'Constant alertness, difficulty switching off, being easily startled, a strong need for control, tension around raised voices or a bad atmosphere.',
    },
    sentences: [
      { de: 'Du bist jetzt sicher. Ich passe auf dich auf.', en: 'You are safe now. I am looking after you.' },
      { de: 'Du musst nicht mehr aufpassen, wie es den Großen geht. Das ist meine Aufgabe.', en: 'You don’t have to keep watch over the grown-ups any more. That is my job.' },
      { de: 'Ich bleibe. Ich gehe nicht weg.', en: 'I am staying. I am not going away.' },
      { de: 'Es war nie deine Aufgabe, für Ruhe zu sorgen.', en: 'It was never your job to keep the peace.' },
    ],
    rescript: [
      { de: 'Stell dich zwischen {kind} und das, was bedrohlich ist. Du bist groß. Du hast heute Möglichkeiten, die {kind} damals nicht hatte.', en: 'Step between {kind} and whatever is threatening. You are big. You have options today that {kind} did not have back then.' },
      { de: 'Wenn es nötig ist, sprich zu den Erwachsenen in der Szene – ruhig und bestimmt: „Hört auf. So geht man nicht mit einem Kind um.“', en: 'If needed, speak to the adults in the scene — calmly and firmly: “Stop. That is not how you treat a child.”' },
      { de: 'Nimm {kind} an die Hand. Ihr geht gemeinsam hinaus, an einen Ort, an dem nichts mehr passieren kann.', en: 'Take {kind} by the hand. You leave together, to a place where nothing can happen any more.' },
    ],
    actions: [
      { de: 'Einen festen Abendablauf einführen, der Halt gibt – gleiche Uhrzeit, gleiche Tasse Tee, gleiche Musik.', en: 'Set up a fixed evening routine that gives you something to hold on to — same time, same cup of tea, same music.' },
      { de: 'In der Wohnung einen Platz einrichten, der sich geborgen anfühlt: eine Decke, warmes Licht, etwas Weiches.', en: 'Create a spot at home that feels sheltered: a blanket, warm light, something soft.' },
      { de: 'Bei Anspannung die Hand aufs Herz legen und leise sagen: „Ich bin da. Jetzt ist jetzt.“', en: 'When you feel tense, put a hand on your heart and say quietly: “I am here. Now is now.”' },
      { de: 'Eine Person festlegen, die du anrufen kannst, wenn es eng wird – und ihr das auch sagen.', en: 'Pick one person you can call when things get tight — and tell them so.' },
    ],
  },
  {
    id: 'naehe',
    name: { de: 'Nähe, Trost & Zuwendung', en: 'Closeness, comfort & care' },
    childVoice: { de: '„Ich brauche jemanden, der mich in den Arm nimmt, wenn ich traurig bin.“', en: '“I need someone to hold me when I am sad.”' },
    description: {
      de: 'Jemand, der sich zuwendet, wenn es weh tut. Körperliche Nähe, ein warmer Blick, Zeit. Das Gefühl, dass sich jemand freut, dass es mich gibt.',
      en: 'Someone who turns towards you when it hurts. Physical closeness, a warm look, time. The feeling that someone is glad you exist.',
    },
    signs: {
      de: 'Einsamkeit auch unter Menschen, Schwierigkeiten, sich trösten zu lassen, starke Sehnsucht nach Nähe oder das Gegenteil: Nähe schnell als zu viel erleben.',
      en: 'Loneliness even among people, difficulty accepting comfort, a strong longing for closeness — or the opposite: quickly experiencing closeness as too much.',
    },
    sentences: [
      { de: 'Du darfst traurig sein, und ich bleibe bei dir.', en: 'You are allowed to be sad, and I am staying with you.' },
      { de: 'Du bist nicht allein damit.', en: 'You are not alone with this.' },
      { de: 'Komm her. Du darfst dich anlehnen.', en: 'Come here. You can lean on me.' },
      { de: 'Ich freue mich, dass es dich gibt.', en: 'I am glad that you exist.' },
    ],
    rescript: [
      { de: 'Geh in die Hocke, auf Augenhöhe mit {kindDat}. Lass dir Zeit. Schau {kind} freundlich an.', en: 'Crouch down to eye level with {kind}. Take your time. Look at {kind} kindly.' },
      { de: 'Frag, ob {kind} in den Arm genommen werden möchte. Wenn ja, halte fest – so lange, wie es gebraucht wird. Wenn nein, bleib einfach nah.', en: 'Ask whether {kind} would like to be held. If yes, hold on — for as long as it is needed. If not, simply stay close.' },
      { de: 'Spür, wie die Wärme zwischen euch fließt. Nichts muss gesagt werden. Du bist da.', en: 'Feel the warmth flowing between you. Nothing has to be said. You are there.' },
    ],
    actions: [
      { de: 'Täglich eine Minute die Hand aufs Herz legen oder dich selbst umarmen – als bewusste Geste der Zuwendung.', en: 'Every day, spend a minute with a hand on your heart or hugging yourself — as a deliberate gesture of care.' },
      { de: 'Einem Menschen schreiben, bei dem du dich wohlfühlst, und ein Treffen ausmachen.', en: 'Message someone you feel good around and arrange to meet.' },
      { de: 'Etwas Warmes gönnen – Wärmflasche, Bad, weiche Kleidung – ausdrücklich als Trost, nicht als Belohnung.', en: 'Allow yourself something warm — a hot-water bottle, a bath, soft clothes — explicitly as comfort, not as a reward.' },
      { de: 'Wenn es dir schlecht geht, einmal jemanden anrufen, statt es allein durchzustehen.', en: 'When you are struggling, call someone once instead of getting through it alone.' },
    ],
  },
  {
    id: 'wert',
    name: { de: 'Gesehen & angenommen werden', en: 'Being seen & accepted' },
    childVoice: { de: '„Ich brauche jemanden, der mich mag – auch ohne dass ich etwas leiste.“', en: '“I need someone who likes me — without me having to achieve anything.”' },
    description: {
      de: 'Wahrgenommen werden als die Person, die man ist – mit den eigenen Eigenschaften, Interessen und Schwächen. Liebe, die nicht an Bedingungen geknüpft ist.',
      en: 'Being noticed as the person you are — with your own traits, interests and weaknesses. Love that does not come with conditions.',
    },
    signs: {
      de: 'Ein lauter innerer Kritiker, Vergleichen, Lob nicht annehmen können, das Gefühl, sich Zuneigung verdienen zu müssen, Angst vor Bewertung.',
      en: 'A loud inner critic, comparing yourself, not being able to accept praise, feeling that affection has to be earned, fear of being judged.',
    },
    sentences: [
      { de: 'Du bist richtig, so wie du bist.', en: 'You are right just as you are.' },
      { de: 'Du musst nichts leisten, damit ich dich mag.', en: 'You don’t have to achieve anything for me to like you.' },
      { de: 'Ich sehe dich. Du bist wichtig.', en: 'I see you. You matter.' },
      { de: 'Deine Art ist kein Fehler.', en: 'The way you are is not a mistake.' },
    ],
    rescript: [
      { de: 'Schau {kind} wirklich an. Nimm wahr, was du siehst: die Augen, die Haltung, das, was {kind} kann und mag.', en: 'Really look at {kind}. Notice what you see: the eyes, the posture, what {kind} can do and likes to do.' },
      { de: 'Sag laut oder innerlich, was du siehst – ohne Bewertung, nur mit Wohlwollen: „Ich sehe, wie viel Mühe du dir gibst. Ich sehe, wie klug und wie feinfühlig du bist.“', en: 'Say aloud or inwardly what you see — without judgement, only with goodwill: “I see how hard you try. I see how clever and how sensitive you are.”' },
      { de: 'Lass {kind} spüren: Hier muss nichts verdient werden.', en: 'Let {kind} feel it: nothing has to be earned here.' },
    ],
    actions: [
      { de: 'Jeden Abend drei Dinge notieren, die dir heute gelungen sind – auch ganz kleine.', en: 'Every evening, write down three things that went well today — even tiny ones.' },
      { de: 'Ein Lob annehmen, ohne es kleinzureden: nur „Danke“ sagen.', en: 'Accept a compliment without playing it down: just say “thank you”.' },
      { de: 'Etwas tun, das dir gefällt, ohne dass es nützlich sein muss.', en: 'Do something you enjoy without it having to be useful.' },
      { de: 'Den inneren Kritiker bemerken und ihm freundlich antworten: „Danke, ich hab dich gehört.“', en: 'Notice the inner critic and answer it kindly: “Thanks, I heard you.”' },
    ],
  },
  {
    id: 'ausdruck',
    name: { de: 'Gefühle zeigen dürfen', en: 'Permission to show feelings' },
    childVoice: { de: '„Ich brauche jemanden, der es aushält, wenn ich weine oder wütend bin.“', en: '“I need someone who can bear it when I cry or get angry.”' },
    description: {
      de: 'Alle Gefühle haben dürfen – auch Wut, Angst, Traurigkeit – und erleben, dass die Beziehung das aushält. Sagen dürfen, was man braucht. Nein sagen dürfen.',
      en: 'Being allowed to have every feeling — including anger, fear and sadness — and experiencing that the relationship can bear it. Being allowed to say what you need. Being allowed to say no.',
    },
    signs: {
      de: 'Gefühle schwer spüren oder benennen, „Ich funktioniere einfach“, Schwierigkeiten mit Nein-Sagen, Wut, die sich staut und dann plötzlich herausbricht.',
      en: 'Difficulty feeling or naming emotions, “I just function”, trouble saying no, anger that builds up and then suddenly bursts out.',
    },
    sentences: [
      { de: 'Alle deine Gefühle sind erlaubt – auch Wut, auch Angst.', en: 'All of your feelings are allowed — anger too, fear too.' },
      { de: 'Du darfst weinen. Das ist nicht schlimm.', en: 'You are allowed to cry. That is not a bad thing.' },
      { de: 'Du darfst sagen, was du brauchst.', en: 'You are allowed to say what you need.' },
      { de: 'Du darfst Nein sagen.', en: 'You are allowed to say no.' },
    ],
    rescript: [
      { de: 'Lade {kind} ein, zu zeigen, was gerade da ist: weinen, schimpfen, stampfen oder schweigen. Du hältst das aus. Nichts davon ist zu viel.', en: 'Invite {kind} to show whatever is there right now: crying, shouting, stamping or staying silent. You can bear it. None of it is too much.' },
      { de: 'Benenne das Gefühl mit freundlicher Stimme: „Du bist ganz schön wütend. Das verstehe ich.“ – „Du hast Angst. Das darf sein.“', en: 'Name the feeling in a kind voice: “You are really angry. I understand.” — “You are scared. That is allowed.”' },
      { de: 'Bleib da, bis die Welle von allein kleiner wird. Gefühle kommen und gehen, wenn jemand bleibt.', en: 'Stay until the wave gets smaller by itself. Feelings come and go when someone stays.' },
    ],
    actions: [
      { de: 'Dreimal am Tag kurz innehalten: Was fühle ich gerade? Was brauche ich gerade?', en: 'Pause three times a day: What am I feeling right now? What do I need right now?' },
      { de: 'Einmal in dieser Woche ein kleines Nein sagen, wo du sonst Ja gesagt hättest.', en: 'Once this week, say a small no where you would normally have said yes.' },
      { de: 'Wut körperlich rauslassen, ohne jemandem zu schaden: ins Kissen boxen, rennen, laut im Auto singen.', en: 'Let anger out physically without harming anyone: punch a pillow, run, sing loudly in the car.' },
      { de: 'Ein Gefühlstagebuch: jeden Abend ein einziger Satz, wie der Tag sich angefühlt hat.', en: 'A feelings diary: every evening, a single sentence about how the day felt.' },
    ],
  },
  {
    id: 'autonomie',
    name: { de: 'Autonomie & Zutrauen', en: 'Autonomy & confidence' },
    childVoice: { de: '„Ich brauche jemanden, der mir etwas zutraut und mich meinen Weg gehen lässt.“', en: '“I need someone who believes in me and lets me find my own way.”' },
    description: {
      de: 'Ausprobieren dürfen, eigene Meinungen haben, Fehler machen und daraus lernen. Erwachsene, die ermutigen statt abnehmen – und die aushalten, wenn das Kind anders ist als sie.',
      en: 'Being allowed to try things, to have your own opinions, to make mistakes and learn from them. Adults who encourage rather than take over — and who can bear it when the child is different from them.',
    },
    signs: {
      de: 'Entscheidungen schwer treffen, sich wenig zutrauen, starke Abhängigkeit von der Meinung anderer, Aufschieben aus Angst, es nicht zu schaffen.',
      en: 'Finding decisions hard, having little faith in yourself, depending heavily on other people’s opinions, putting things off for fear of not managing.',
    },
    sentences: [
      { de: 'Ich traue dir etwas zu.', en: 'I believe in you.' },
      { de: 'Du darfst deinen eigenen Weg gehen.', en: 'You are allowed to go your own way.' },
      { de: 'Du darfst es ausprobieren, auch wenn es schiefgeht.', en: 'You are allowed to try, even if it goes wrong.' },
      { de: 'Deine Meinung zählt.', en: 'Your opinion counts.' },
    ],
    rescript: [
      { de: 'Frag {kind} nach der eigenen Meinung – und hör wirklich zu. Nimm ernst, was kommt.', en: 'Ask {kind} for their own opinion — and really listen. Take seriously whatever comes.' },
      { de: 'Lass {kind} etwas entscheiden: wohin ihr geht, was ihr als Nächstes macht.', en: 'Let {kind} decide something: where you go, what you do next.' },
      { de: 'Sag: „Ich bin da, falls du Hilfe brauchst. Aber ich glaube, du kannst das.“', en: 'Say: “I am here in case you need help. But I think you can do it.”' },
    ],
    actions: [
      { de: 'Heute eine kleine Entscheidung ganz nach deinem Geschmack treffen, ohne jemanden zu fragen.', en: 'Today, make one small decision purely by your own taste, without asking anyone.' },
      { de: 'Etwas Neues ausprobieren, bei dem Fehler ausdrücklich erlaubt sind.', en: 'Try something new where mistakes are explicitly allowed.' },
      { de: 'Bevor du um Rat fragst, erst selbst eine Antwort finden – dann entscheiden, ob du noch fragen willst.', en: 'Before asking for advice, find your own answer first — then decide whether you still want to ask.' },
      { de: 'Einen kleinen Wunsch aussprechen, den du bisher zurückgehalten hast.', en: 'Voice a small wish you have been holding back.' },
    ],
  },
  {
    id: 'spiel',
    name: { de: 'Spiel & Leichtigkeit', en: 'Play & lightness' },
    childVoice: { de: '„Ich brauche Zeit zum Spielen, ohne dass ich erst etwas erledigen muss.“', en: '“I need time to play without having to get something done first.”' },
    description: {
      de: 'Unbeschwert sein dürfen, albern, laut, verträumt. Spielen ohne Zweck. Freude, die nicht verdient werden muss.',
      en: 'Being allowed to be carefree, silly, loud, dreamy. Play without a purpose. Joy that does not have to be earned.',
    },
    signs: {
      de: 'Schlechtes Gewissen beim Ausruhen, Freizeit als weitere Aufgabe, Schwierigkeiten, loszulassen und albern zu sein, das Gefühl, „zu ernst“ geworden zu sein.',
      en: 'Guilt when resting, free time as another task, difficulty letting go and being silly, the feeling of having become “too serious”.',
    },
    sentences: [
      { de: 'Du darfst spielen. Du musst vorher nichts erledigt haben.', en: 'You are allowed to play. You don’t have to finish anything first.' },
      { de: 'Dein Lachen ist schön.', en: 'Your laugh is lovely.' },
      { de: 'Du darfst albern sein.', en: 'You are allowed to be silly.' },
      { de: 'Du musst nicht vernünftig sein.', en: 'You don’t have to be sensible.' },
    ],
    rescript: [
      { de: 'Frag {kind}: „Was möchtest du jetzt am liebsten spielen?“', en: 'Ask {kind}: “What would you most like to play right now?”' },
      { de: 'Und dann spielt ihr. Du bist nicht zu alt dafür. Lass {kind} bestimmen, wie das Spiel geht.', en: 'And then you play. You are not too old for it. Let {kind} decide how the game goes.' },
      { de: 'Spür, wie sich Lachen im Körper anfühlt. Das gehört euch beiden.', en: 'Feel what laughter feels like in the body. It belongs to both of you.' },
    ],
    actions: [
      { de: 'Diese Woche 20 Minuten für etwas, das du als Kind geliebt hast – ohne Zweck, ohne Ziel.', en: 'This week, spend 20 minutes on something you loved as a child — no purpose, no goal.' },
      { de: 'Etwas Albernes tun: in der Küche tanzen, Seifenblasen, durch Pfützen springen.', en: 'Do something silly: dance in the kitchen, blow bubbles, jump in puddles.' },
      { de: 'Einen halben Tag ohne Plan verbringen.', en: 'Spend half a day without a plan.' },
      { de: 'Ein Spiel spielen – Brettspiel, Kartenspiel, Ballspiel – allein oder mit anderen.', en: 'Play a game — board game, card game, ball game — alone or with others.' },
    ],
  },
  {
    id: 'grenzen',
    name: { de: 'Orientierung & gute Grenzen', en: 'Guidance & healthy limits' },
    childVoice: { de: '„Ich brauche Große, die Verantwortung übernehmen, damit ich Kind sein kann.“', en: '“I need grown-ups who take responsibility so that I can be a child.”' },
    description: {
      de: 'Kinder brauchen Erwachsene, die Halt geben: Regeln, die Sinn ergeben; jemanden, der Stopp sagt, wenn es zu viel wird; der zeigt, wie man mit Frust umgeht; und der die Verantwortung trägt, die zu schwer für ein Kind ist.',
      en: 'Children need adults who give them something to hold on to: rules that make sense; someone who says stop when it gets too much; who shows how to deal with frustration; and who carries the responsibility that is too heavy for a child.',
    },
    signs: {
      de: 'Überverantwortlichkeit („Wenn ich es nicht mache, macht es keiner“), Schwierigkeiten mit Selbststeuerung, Struktur und Frust, Erschöpfung durch das Kümmern um andere.',
      en: 'Over-responsibility (“If I don’t do it, nobody will”), difficulty with self-regulation, structure and frustration, exhaustion from looking after others.',
    },
    sentences: [
      { de: 'Du bist nicht für die Großen verantwortlich.', en: 'You are not responsible for the grown-ups.' },
      { de: 'Du musst nicht alles allein entscheiden. Ich trage das.', en: 'You don’t have to decide everything alone. I will carry it.' },
      { de: 'Es ist okay, wenn etwas schwer ist. Wir machen das Schritt für Schritt.', en: 'It is okay if something is hard. We will take it step by step.' },
      { de: 'Ich sage Stopp, wenn es zu viel wird.', en: 'I will say stop when it gets too much.' },
    ],
    rescript: [
      { de: 'Übernimm die Verantwortung in der Szene. Sag {kindDat}: „Das ist Sache der Erwachsenen. Ich kümmere mich.“', en: 'Take over responsibility in the scene. Tell {kind}: “This is grown-up business. I will take care of it.”' },
      { de: 'Wende dich an die anderen Erwachsenen und gib ihnen zurück, was ihnen gehört: „Das ist eure Aufgabe, nicht die eines Kindes.“', en: 'Turn to the other adults and hand back what belongs to them: “This is your job, not a child’s.”' },
      { de: 'Spür, wie leicht die Schultern von {kindDat} werden, wenn diese Last abgenommen ist.', en: 'Feel how light the shoulders of {kind} become once that burden is lifted.' },
    ],
    actions: [
      { de: 'Eine freundliche Tagesstruktur: feste Zeiten für Aufstehen, Essen und Schlafen.', en: 'A kind daily structure: fixed times for getting up, eating and sleeping.' },
      { de: 'Eine große Aufgabe in drei kleine Schritte teilen und heute nur den ersten tun.', en: 'Split one big task into three small steps and only do the first one today.' },
      { de: 'Dir selbst eine liebevolle Grenze setzen – zum Beispiel das Telefon um 22 Uhr weglegen – als Fürsorge, nicht als Strafe.', en: 'Set yourself a loving limit — for example, putting your phone away at 10 pm — as care, not punishment.' },
      { de: 'Wenn du dich für die Stimmung anderer zuständig fühlst, innerlich sagen: „Das ist nicht meine Aufgabe.“', en: 'When you feel responsible for other people’s moods, say inwardly: “That is not my job.”' },
    ],
  },
];

export const needById = new Map<NeedId, Need>(needs.map((n) => [n.id, n]));
export const NEED_IDS: NeedId[] = needs.map((n) => n.id);
