import type { L10n } from './types';

/**
 * Krisen- und Beratungsnummern. Stand: 2026-09-28.
 * Vor Änderungen an der Seite des jeweiligen Anbieters prüfen.
 */
export interface HelpLine {
  name: L10n;
  number: string;
  /** Wählbare Form für tel:-Links. */
  tel: string;
  note: L10n;
  url?: string;
}

export interface HelpRegion {
  id: string;
  name: L10n;
  lines: HelpLine[];
}

export const HELP_CHECKED = '2026-09-28';

export const helpRegions: HelpRegion[] = [
  {
    id: 'de',
    name: { de: 'Deutschland', en: 'Germany' },
    lines: [
      { name: { de: 'Notruf', en: 'Emergency' }, number: '112', tel: '112', note: { de: 'Bei akuter Gefahr für dich oder andere.', en: 'In acute danger to yourself or others.' } },
      { name: { de: 'Telefonseelsorge', en: 'Telefonseelsorge (crisis line)' }, number: '0800 111 0 111', tel: '08001110111', note: { de: 'Kostenlos, anonym, rund um die Uhr. Auch per Chat und Mail.', en: 'Free, anonymous, 24/7. Also via chat and e-mail.' }, url: 'https://online.telefonseelsorge.de/' },
      { name: { de: 'Telefonseelsorge (zweite Nummer)', en: 'Telefonseelsorge (second number)' }, number: '0800 111 0 222', tel: '08001110222', note: { de: 'Wie oben – falls die erste besetzt ist.', en: 'As above — if the first is busy.' } },
      { name: { de: 'Telefonseelsorge (europäische Nummer)', en: 'Telefonseelsorge (European number)' }, number: '116 123', tel: '116123', note: { de: 'Kostenlos, rund um die Uhr.', en: 'Free, 24/7.' } },
      { name: { de: 'Ärztlicher Bereitschaftsdienst', en: 'Out-of-hours medical service' }, number: '116 117', tel: '116117', note: { de: 'Außerhalb der Praxiszeiten. Über dieselbe Nummer vermittelt die Terminservicestelle auch psychotherapeutische Sprechstunden.', en: 'Outside surgery hours. The same number also arranges psychotherapy consultations via the appointment service.' }, url: 'https://www.116117.de/' },
      { name: { de: 'Hilfetelefon Sexueller Missbrauch', en: 'Sexual abuse helpline' }, number: '0800 22 55 530', tel: '08002255530', note: { de: 'Kostenlos und anonym, für Betroffene und Angehörige.', en: 'Free and anonymous, for survivors and relatives.' }, url: 'https://www.hilfe-portal-missbrauch.de/' },
      { name: { de: 'Hilfetelefon Gewalt gegen Frauen', en: 'Violence against women helpline' }, number: '116 016', tel: '116016', note: { de: 'Rund um die Uhr, in vielen Sprachen.', en: '24/7, in many languages.' }, url: 'https://www.hilfetelefon.de/' },
      { name: { de: 'Hilfetelefon Gewalt an Männern', en: 'Violence against men helpline' }, number: '0800 123 99 00', tel: '08001239900', note: { de: 'Kostenlos, mit festen Sprechzeiten.', en: 'Free, with set hours.' }, url: 'https://www.maennerhilfetelefon.de/' },
      { name: { de: 'Nummer gegen Kummer – Kinder und Jugendliche', en: 'Nummer gegen Kummer — children and teenagers' }, number: '116 111', tel: '116111', note: { de: 'Kostenlos und anonym.', en: 'Free and anonymous.' }, url: 'https://www.nummergegenkummer.de/' },
    ],
  },
  {
    id: 'at',
    name: { de: 'Österreich', en: 'Austria' },
    lines: [
      { name: { de: 'Notruf', en: 'Emergency' }, number: '112 / 144', tel: '144', note: { de: 'Rettung', en: 'Ambulance' } },
      { name: { de: 'Telefonseelsorge', en: 'Telefonseelsorge (crisis line)' }, number: '142', tel: '142', note: { de: 'Kostenlos, rund um die Uhr.', en: 'Free, 24/7.' }, url: 'https://www.telefonseelsorge.at/' },
      { name: { de: 'Rat auf Draht', en: 'Rat auf Draht' }, number: '147', tel: '147', note: { de: 'Für Kinder, Jugendliche und Eltern.', en: 'For children, teenagers and parents.' }, url: 'https://www.rataufdraht.at/' },
    ],
  },
  {
    id: 'ch',
    name: { de: 'Schweiz', en: 'Switzerland' },
    lines: [
      { name: { de: 'Notruf', en: 'Emergency' }, number: '112 / 144', tel: '144', note: { de: 'Sanität', en: 'Ambulance' } },
      { name: { de: 'Die Dargebotene Hand', en: 'Die Dargebotene Hand (crisis line)' }, number: '143', tel: '143', note: { de: 'Rund um die Uhr, auch per Chat.', en: '24/7, also via chat.' }, url: 'https://www.143.ch/' },
      { name: { de: 'Pro Juventute', en: 'Pro Juventute' }, number: '147', tel: '147', note: { de: 'Für Kinder und Jugendliche.', en: 'For children and teenagers.' }, url: 'https://www.147.ch/' },
    ],
  },
  {
    id: 'intl',
    name: { de: 'Andere Länder', en: 'Other countries' },
    lines: [
      { name: { de: 'Vereinigtes Königreich und Irland: Samaritans', en: 'UK and Ireland: Samaritans' }, number: '116 123', tel: '116123', note: { de: 'Kostenlos, rund um die Uhr.', en: 'Free, 24/7.' }, url: 'https://www.samaritans.org/' },
      { name: { de: 'USA: 988 Suicide & Crisis Lifeline', en: 'USA: 988 Suicide & Crisis Lifeline' }, number: '988', tel: '988', note: { de: 'Anruf oder SMS, rund um die Uhr.', en: 'Call or text, 24/7.' }, url: 'https://988lifeline.org/' },
      { name: { de: 'Weltweit: Find A Helpline', en: 'Worldwide: Find A Helpline' }, number: 'findahelpline.com', tel: '', note: { de: 'Verzeichnis kostenloser Krisendienste in über 130 Ländern.', en: 'Directory of free crisis services in over 130 countries.' }, url: 'https://findahelpline.com/' },
    ],
  },
];

/** Wege zu einer Psychotherapie – Schwerpunkt Deutschland, weil die Seite vor allem dort genutzt wird. */
export const therapySteps: { title: L10n; text: L10n }[] = [
  {
    title: { de: 'Psychotherapeutische Sprechstunde', en: 'Psychotherapy consultation (Germany)' },
    text: {
      de: 'In Deutschland kannst du ohne Überweisung direkt bei Praxen mit Kassenzulassung anrufen und um einen Termin in der Sprechstunde bitten. Dort wird geklärt, ob und welche Behandlung sinnvoll ist.',
      en: 'In Germany you can call practices with statutory health insurance approval directly, without a referral, and ask for a consultation appointment. There it is clarified whether and which treatment makes sense.',
    },
  },
  {
    title: { de: 'Terminservicestelle 116 117', en: 'Appointment service 116 117' },
    text: {
      de: 'Findest du selbst keinen Termin, vermittelt die Terminservicestelle der Kassenärztlichen Vereinigung eine Sprechstunde – telefonisch unter 116 117 oder online unter 116117.de.',
      en: 'If you cannot find an appointment yourself, the appointment service of the Association of Statutory Health Insurance Physicians arranges a consultation — by phone at 116 117 or online at 116117.de.',
    },
  },
  {
    title: { de: 'Kostenerstattung', en: 'Reimbursement' },
    text: {
      de: 'Ist in zumutbarer Zeit kein Kassenplatz zu bekommen, kann die Krankenkasse eine Behandlung bei einer approbierten Therapeutin in Privatpraxis bezahlen (Kostenerstattungsverfahren nach § 13 Abs. 3 SGB V). Wartezeiten und Absagen dafür dokumentieren und vorher bei der Kasse beantragen.',
      en: 'If no statutory place is available within a reasonable time, your health insurer may pay for treatment with a licensed therapist in private practice (reimbursement procedure). Document waiting times and refusals, and apply to the insurer beforehand.',
    },
  },
  {
    title: { de: 'Hausärztliche Praxis', en: 'Your GP' },
    text: {
      de: 'Ein guter erster Schritt, gerade wenn es schnell gehen muss oder du nicht weißt, wo du anfangen sollst. Hausärztinnen kennen die Angebote vor Ort und können überweisen.',
      en: 'A good first step, especially if things need to move quickly or you don’t know where to start. GPs know local services and can refer you.',
    },
  },
  {
    title: { de: 'Nach passenden Verfahren fragen', en: 'Ask about suitable approaches' },
    text: {
      de: 'Für die Themen dieser Seite eignen sich besonders Therapeutinnen mit Weiterbildung in Schematherapie, Traumatherapie (etwa PITT, EMDR) oder Compassion Focused Therapy. Bei Gewalt- oder Missbrauchserfahrungen ist eine traumatherapeutische Qualifikation wichtig.',
      en: 'For the topics on this site, therapists trained in schema therapy, trauma therapy (e.g. PITT, EMDR) or Compassion Focused Therapy are particularly suitable. For experiences of violence or abuse, trauma-therapy qualification is important.',
    },
  },
];
