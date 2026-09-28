import type { Path } from '../data/types';
import { choice, flags, type SessionData } from './session';

/** Wegvorschlag aus dem Vorgespräch. Nachvollziehbar: jeder Grund wird genannt. */
export function recommendPath(d: SessionData): { path: Path; reasons: { de: string; en: string }[] } {
  const reasons: { de: string; en: string }[] = [];
  const f = flags(d);
  let path: Path = 'standard';

  if (f.has('dissociation')) reasons.push({ de: 'Du kennst es, bei Erinnerungen wegzudriften oder überflutet zu werden.', en: 'You know the experience of drifting away or being flooded by memories.' });
  if (f.has('fragile')) reasons.push({ de: 'Du hattest zuletzt Gedanken, nicht mehr leben zu wollen.', en: 'You have recently had thoughts of not wanting to live.' });
  if ((d.values.sudBefore ?? 0) >= 7) reasons.push({ de: 'Du bist gerade stark belastet.', en: 'You are under a lot of strain right now.' });
  if (typeof d.values.moodBefore === 'number' && d.values.moodBefore <= 2) reasons.push({ de: 'Es geht dir gerade sehr schlecht.', en: 'You are feeling very bad right now.' });
  if (reasons.length > 0) return { path: 'gentle', reasons };

  const time = choice(d, 'time');
  const exp = choice(d, 'experience');
  if (time === '150' && exp !== 'neu') {
    path = 'deep';
    reasons.push({ de: 'Du hast viel Zeit und Erfahrung mit inneren Bildern.', en: 'You have plenty of time and experience with inner imagery.' });
  } else {
    reasons.push({ de: 'Der Weg, der für die meisten Menschen passt.', en: 'The path that suits most people.' });
    if (time === '150' && exp === 'neu') reasons.push({ de: 'Innere Bilder sind neu für dich – „Tiefe“ lohnt sich eher beim zweiten Mal.', en: 'Inner imagery is new to you — “Depth” is more worthwhile the second time.' });
  }
  if (time === 'teilen') reasons.push({ de: 'Du teilst die Sitzung auf: Nach der Spiegelung kommt eine gute Pausenstelle. Speichere dort auf dem Gerät, dann geht nichts verloren.', en: 'You are splitting the session: a good pause point comes after the reflection. Save on the device there so nothing is lost.' });
  if (choice(d, 'therapy') === 'ja') reasons.push({ de: 'Du bist in Therapie: Sprich tiefere Arbeit am besten dort ab.', en: 'You are in therapy: ideally agree deeper work there.' });
  return { path, reasons };
}


/** Minutenangaben auf fünf gerundet – genauer lässt sich eine innere Reise nicht planen. */
export const roundFive = (n: number) => Math.max(5, Math.round(n / 5) * 5);
