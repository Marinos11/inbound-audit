export type QuestionType = 'single-select' | 'yes-no' | 'slider';

export interface Question {
  id: string;
  number: number;
  category: string;
  categoryLabel: string;
  text: string;
  type: QuestionType;
  options?: string[];
  min?: number;
  max?: number;
  sliderLabels?: { value: number; label: string }[];
}

export const TOTAL_STEPS = 13; // 12 questions + 1 lead capture

export const questions: Question[] = [
  {
    id: 'q1',
    number: 1,
    category: 'qualifier',
    categoryLabel: 'Qualifier',
    text: 'Was ist dein aktueller Jahresumsatz?',
    type: 'single-select',
    options: ['<250k', '250–500k', '500k–1M', '1–3M', '3M+'],
  },
  {
    id: 'q2',
    number: 2,
    category: 'qualifier',
    categoryLabel: 'Qualifier',
    text: 'Was ist dein Business-Modell?',
    type: 'single-select',
    options: ['Coaching/Consulting', 'Agentur', 'SaaS', 'Dienstleistung', 'Anderes'],
  },
  {
    id: 'q3',
    number: 3,
    category: 'qualifier',
    categoryLabel: 'Qualifier',
    text: 'Was ist dein primäres LinkedIn-Ziel?',
    type: 'single-select',
    options: ['Mehr Reichweite', 'Mehr Inbound Leads', 'Mehr Sales Calls', 'Hiring/Team', 'Brand'],
  },
  {
    id: 'q4',
    number: 4,
    category: 'profile',
    categoryLabel: 'Profil',
    text: 'Meine Headline nennt klar Zielgruppe + Ergebnis.',
    type: 'slider',
    min: 1,
    max: 5,
    sliderLabels: [
      { value: 1, label: 'Stimmt nicht' },
      { value: 3, label: 'Teilweise' },
      { value: 5, label: 'Voll und ganz' },
    ],
  },
  {
    id: 'q5',
    number: 5,
    category: 'profile',
    categoryLabel: 'Profil',
    text: 'Mein Profil enthält Proof (Cases / Zahlen / Testimonials / Logos).',
    type: 'yes-no',
  },
  {
    id: 'q6',
    number: 6,
    category: 'profile',
    categoryLabel: 'Profil',
    text: 'Mein Profil hat eine klare Call-to-Action (Call / Lead Magnet / DM Keyword).',
    type: 'yes-no',
  },
  {
    id: 'q7',
    number: 7,
    category: 'content',
    categoryLabel: 'Content',
    text: 'Wie viele Posts veröffentlichst du pro Woche?',
    type: 'single-select',
    options: ['0–1', '2–3', '4–5', '6+'],
  },
  {
    id: 'q8',
    number: 8,
    category: 'content',
    categoryLabel: 'Content',
    text: 'Ich poste mindestens 1 Case Study pro Woche.',
    type: 'yes-no',
  },
  {
    id: 'q9',
    number: 9,
    category: 'content',
    categoryLabel: 'Content',
    text: 'Meine Posts haben einen wiederkehrenden CTA-Mechanismus (Kommentar / DM / Lead Magnet).',
    type: 'yes-no',
  },
  {
    id: 'q10',
    number: 10,
    category: 'distribution',
    categoryLabel: 'Distribution',
    text: 'Ich kommentiere täglich 10+ Minuten bei Zielkunden / Partnern.',
    type: 'yes-no',
  },
  {
    id: 'q11',
    number: 11,
    category: 'distribution',
    categoryLabel: 'Distribution',
    text: 'Wie viele relevante Verbindungen fügst du pro Woche hinzu?',
    type: 'single-select',
    options: ['0–10', '10–30', '30–70', '70+'],
  },
  {
    id: 'q12',
    number: 12,
    category: 'distribution',
    categoryLabel: 'Distribution',
    text: 'Wie viele qualifizierte Inbound-DMs erhältst du pro Monat?',
    type: 'single-select',
    options: ['0', '1–3', '4–10', '10+'],
  },
];
