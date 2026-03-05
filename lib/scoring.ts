import type { QuizAnswers, CategoryScores, Leak } from '@/types';

export function calculateScore(answers: QuizAnswers): {
  score: number;
  categoryScores: CategoryScores;
  leaks: Leak[];
  qualified: boolean;
} {
  // Revenue score (max 15)
  const revenueMap: Record<string, number> = {
    '<250k': 0,
    '250–500k': 5,
    '500k–1M': 10,
    '1–3M': 15,
    '3M+': 15,
  };
  const revenueScore = revenueMap[answers.q1 ?? ''] ?? 0;

  // Profile score (max 30)
  const headlineMap: Record<number, number> = { 1: 2, 2: 5, 3: 8, 4: 11, 5: 14 };
  const profileScore =
    (headlineMap[answers.q4 ?? 1] ?? 2) +
    (answers.q5 ? 8 : 0) +
    (answers.q6 ? 8 : 0);

  // Content score (max 35)
  const postsMap: Record<string, number> = {
    '0–1': 2,
    '2–3': 8,
    '4–5': 13,
    '6+': 15,
  };
  const contentScore =
    (postsMap[answers.q7 ?? '0–1'] ?? 2) +
    (answers.q8 ? 10 : 0) +
    (answers.q9 ? 10 : 0);

  // Distribution score (max 20)
  const connectionsMap: Record<string, number> = {
    '0–10': 2,
    '10–30': 6,
    '30–70': 9,
    '70+': 10,
  };
  const dmsMap: Record<string, number> = {
    '0': 0,
    '1–3': 2,
    '4–10': 4,
    '10+': 4,
  };
  const distributionScore =
    (answers.q10 ? 6 : 0) +
    (connectionsMap[answers.q11 ?? '0–10'] ?? 2) +
    (dmsMap[answers.q12 ?? '0'] ?? 0);

  const categoryScores: CategoryScores = {
    revenue: revenueScore,
    profile: profileScore,
    content: contentScore,
    distribution: distributionScore,
  };

  const score = Math.min(100, revenueScore + profileScore + contentScore + distributionScore);

  // All possible leaks with percentage for ranking
  const leakCandidates: (Leak & { pct: number })[] = [
    {
      category: 'Profil',
      title: 'Profil & Positionierung',
      description:
        'Dein Profil überzeugt Besucher nicht. Headline, Proof und CTA fehlen oder sind zu vage – Interessenten springen ab, bevor sie Kontakt aufnehmen.',
      fixes: [
        'Headline umschreiben: [Zielgruppe] → [konkretes Ergebnis] in [Zeitraum]',
        'Mindestens 3 Proof-Elemente einfügen (Zahlen, Cases, Logos, Testimonials)',
        'Klaren CTA im "Über mich"-Abschnitt platzieren (DM-Keyword, Link, Call)',
      ],
      score: profileScore,
      maxScore: 30,
      pct: profileScore / 30,
    },
    {
      category: 'Content',
      title: 'Content & CTA',
      description:
        'Dein Content generiert keine Anfragen. Kein System, kein Mechanismus, zu wenig Volumen – du postest, ohne dass etwas zurückkommt.',
      fixes: [
        'Auf 4–5 Posts pro Woche hochskalieren, Redaktionskalender aufsetzen',
        '1 Case Study pro Woche publizieren: Situation → Lösung → Ergebnis',
        'Jeden Post mit Kommentar-Trigger, DM-Keyword oder Lead Magnet beenden',
      ],
      score: contentScore,
      maxScore: 35,
      pct: contentScore / 35,
    },
    {
      category: 'Distribution',
      title: 'Distribution & Netzwerk',
      description:
        'Du erreichst nicht genug relevante Personen. Kein aktives Netzwerk-Wachstum, kein Engagement-System – der Algorithmus ignoriert dich.',
      fixes: [
        'Täglich 10 Min gezielt bei Zielkunden und Partnern kommentieren',
        '30–70 relevante Verbindungen pro Woche anfragen (personalisiert)',
        'Inbound-DM System aufsetzen: Keyword → Template → Call-Einladung',
      ],
      score: distributionScore,
      maxScore: 20,
      pct: distributionScore / 20,
    },
    {
      category: 'Angebot',
      title: 'Angebot & Positionierung',
      description:
        'LinkedIn-Kanal und Angebot sind noch nicht aufeinander ausgerichtet. Der Kanal kann nur funktionieren, wenn Positionierung und Preispunkt stimmen.',
      fixes: [
        'Angebot auf 5k+ ausrichten und klar kommunizieren',
        'Positionierung schärfen: Ein Problem, eine Zielgruppe, ein Ergebnis',
        'Premium-Proof und konkrete Zahlen in jedem Touchpoint kommunizieren',
      ],
      score: revenueScore,
      maxScore: 15,
      pct: revenueScore / 15,
    },
  ];

  // Sort by percentage ascending (worst performing first), take top 3
  const leaks: Leak[] = leakCandidates
    .sort((a, b) => a.pct - b.pct)
    .slice(0, 3)
    .map(({ pct: _pct, ...leak }) => leak);

  const qualified =
    (answers.q1 === '500k–1M' || answers.q1 === '1–3M' || answers.q1 === '3M+') && score < 80;

  return { score, categoryScores, leaks, qualified };
}

export function getScoreBucket(score: number): 'A' | 'B' | 'C' {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  return 'C';
}

export const bucketCopy = {
  A: {
    headline: 'Du bist nah dran.',
    message:
      'Dein System steht. Jetzt geht es um Conversion-Optimierung: Proof stärken, CTA schärfen und Konsistenz halten. Kleine Justierungen – große Wirkung.',
  },
  B: {
    headline: 'Du hast Potential – aber dein System leakt.',
    message:
      '2–3 strukturelle Fixes können den Unterschied machen. Die Basis ist da, aber Profil, Content oder Distribution bremsen dich aus. Zeit, die Lecks zu stopfen.',
  },
  C: {
    headline: 'Fundament fehlt – easy zu fixen.',
    message:
      'Hier liegt viel ungenutztes Potential. Die gute Nachricht: Mit einem klaren 7-Tage-Plan kannst du schnell Momentum aufbauen. Fang mit den Top-3-Leaks an.',
  },
};
