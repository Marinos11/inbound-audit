export type RevenueRange = '<250k' | '250–500k' | '500k–1M' | '1–3M' | '3M+';
export type BusinessModel = 'Coaching/Consulting' | 'Agentur' | 'SaaS' | 'Dienstleistung' | 'Anderes';
export type PrimaryGoal = 'Mehr Reichweite' | 'Mehr Inbound Leads' | 'Mehr Sales Calls' | 'Hiring/Team' | 'Brand';
export type PostsPerWeek = '0–1' | '2–3' | '4–5' | '6+';
export type ConnectionsPerWeek = '0–10' | '10–30' | '30–70' | '70+';
export type InboundDMs = '0' | '1–3' | '4–10' | '10+';

export interface QuizAnswers {
  q1?: RevenueRange;
  q2?: BusinessModel;
  q3?: PrimaryGoal;
  q4?: number;
  q5?: boolean;
  q6?: boolean;
  q7?: PostsPerWeek;
  q8?: boolean;
  q9?: boolean;
  q10?: boolean;
  q11?: ConnectionsPerWeek;
  q12?: InboundDMs;
}

export interface ContactInfo {
  email: string;
  linkedinUrl?: string;
  name?: string;
}

export interface CategoryScores {
  revenue: number;
  profile: number;
  content: number;
  distribution: number;
}

export interface Leak {
  category: string;
  title: string;
  description: string;
  fixes: string[];
  score: number;
  maxScore: number;
}

export interface QuizResults {
  score: number;
  categoryScores: CategoryScores;
  leaks: Leak[];
  qualified: boolean;
  answers: QuizAnswers;
  contact: ContactInfo;
}

export interface LeadPayload {
  name?: string;
  email: string;
  linkedinUrl?: string;
  answers: QuizAnswers;
  score: number;
  categoryScores: CategoryScores;
  leaks?: Leak[];
  qualified: boolean;
  token?: string;
  createdAt: string;
}

export interface StoredResult {
  token: string;
  score: number;
  categoryScores: CategoryScores;
  leaks: Leak[];
  qualified: boolean;
  answers: QuizAnswers;
  contact: ContactInfo;
  createdAt: string;
}
