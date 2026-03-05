'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { YesNo } from '@/components/ui/YesNo';
import { Slider } from '@/components/ui/Slider';
import { questions, TOTAL_STEPS } from '@/lib/questions';
import { calculateScore } from '@/lib/scoring';
import { trackEvent } from '@/lib/analytics';
import { isValidEmail } from '@/lib/utils';
import type { QuizAnswers, ContactInfo } from '@/types';

const STORAGE_KEY = 'inbound-audit-state';

interface StoredState {
  answers: QuizAnswers;
  currentStep: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadState(): StoredState {
  if (typeof window === 'undefined') return { answers: {}, currentStep: 0 };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredState;
  } catch {
    /* ignore */
  }
  return { answers: {}, currentStep: 0 };
}

function saveState(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

// ─── Validation ───────────────────────────────────────────────────────────────

function canProceed(step: number, answers: QuizAnswers, contact: ContactInfo): boolean {
  if (step < 12) {
    const q = questions[step];
    const key = q.id as keyof QuizAnswers;
    const val = answers[key];
    if (q.type === 'slider') return (answers.q4 ?? 0) >= 1;
    return val !== undefined;
  }
  // Lead capture step
  return isValidEmail(contact.email);
}

// ─── Quiz Step Renderer ───────────────────────────────────────────────────────

interface StepProps {
  step: number;
  answers: QuizAnswers;
  onChange: (key: keyof QuizAnswers, val: QuizAnswers[keyof QuizAnswers]) => void;
}

function QuizStepContent({ step, answers, onChange }: StepProps) {
  const q = questions[step];
  if (!q) return null;

  const key = q.id as keyof QuizAnswers;

  if (q.type === 'single-select') {
    return (
      <RadioGroup
        name={q.id}
        options={q.options ?? []}
        value={answers[key] as string | undefined}
        onChange={(v) => onChange(key, v as QuizAnswers[typeof key])}
      />
    );
  }

  if (q.type === 'yes-no') {
    return (
      <YesNo
        value={answers[key] as boolean | undefined}
        onChange={(v) => onChange(key, v as QuizAnswers[typeof key])}
      />
    );
  }

  if (q.type === 'slider') {
    return (
      <Slider
        value={(answers.q4 as number | undefined) ?? 3}
        onChange={(v) => onChange('q4', v)}
        min={q.min ?? 1}
        max={q.max ?? 5}
        labels={q.sliderLabels}
      />
    );
  }

  return null;
}

// ─── Lead Capture Step ────────────────────────────────────────────────────────

interface LeadStepProps {
  contact: ContactInfo;
  onChange: (field: keyof ContactInfo, value: string) => void;
}

function LeadCaptureStep({ contact, onChange }: LeadStepProps) {
  const inputClass =
    'w-full bg-surface border border-white/15 rounded-xl px-4 py-3.5 text-off-white placeholder:text-white/30 focus:outline-none focus:border-gold transition-colors text-base';

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm text-white/50 mb-2" htmlFor="audit-name">
          Name <span className="text-white/30">(optional)</span>
        </label>
        <input
          id="audit-name"
          type="text"
          placeholder="Max Mustermann"
          value={contact.name ?? ''}
          onChange={(e) => onChange('name', e.target.value)}
          className={inputClass}
          autoComplete="name"
        />
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-2" htmlFor="audit-email">
          E-Mail <span className="text-gold">*</span>
        </label>
        <input
          id="audit-email"
          type="email"
          placeholder="max@unternehmen.de"
          value={contact.email}
          onChange={(e) => onChange('email', e.target.value)}
          className={inputClass}
          autoComplete="email"
          required
        />
        {contact.email && !isValidEmail(contact.email) && (
          <p className="text-xs text-red-400 mt-1.5">Bitte eine gültige E-Mail eingeben.</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-white/50 mb-2" htmlFor="audit-linkedin">
          LinkedIn-Profil URL <span className="text-white/30">(optional)</span>
        </label>
        <input
          id="audit-linkedin"
          type="url"
          placeholder="https://linkedin.com/in/deinprofil"
          value={contact.linkedinUrl ?? ''}
          onChange={(e) => onChange('linkedinUrl', e.target.value)}
          className={inputClass}
          autoComplete="url"
        />
      </div>

      <p className="text-xs text-white/30 leading-relaxed">
        Deine Daten werden nicht weitergegeben. Kein Spam. Nur dein Ergebnis.{' '}
        <Link href="/privacy" className="text-white/50 hover:text-white underline" target="_blank">
          Datenschutz
        </Link>
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuditPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [contact, setContact] = useState<ContactInfo>({ email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage after mount
  useEffect(() => {
    const saved = loadState();
    setAnswers(saved.answers);
    setCurrentStep(saved.currentStep);
    setMounted(true);
  }, []);

  // Persist on every change
  useEffect(() => {
    if (!mounted) return;
    saveState({ answers, currentStep });
  }, [answers, currentStep, mounted]);

  // Track start
  useEffect(() => {
    if (mounted && currentStep === 0) {
      trackEvent('audit_started');
    }
  }, [mounted, currentStep]);

  const handleAnswer = useCallback(
    (key: keyof QuizAnswers, val: QuizAnswers[keyof QuizAnswers]) => {
      setAnswers((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  const handleContactChange = useCallback((field: keyof ContactInfo, value: string) => {
    setContact((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleNext = async () => {
    if (!canProceed(currentStep, answers, contact)) return;

    if (currentStep < 12) {
      setCurrentStep((s) => s + 1);
      return;
    }

    // Final submit
    setSubmitting(true);
    setError(null);

    const { score, categoryScores, leaks, qualified } = calculateScore(answers);

    trackEvent('audit_completed', { score, qualified });
    trackEvent(qualified ? 'qualified_true' : 'qualified_false', { score });

    let token: string | null = null;

    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contact.name || undefined,
          email: contact.email,
          linkedinUrl: contact.linkedinUrl || undefined,
          answers,
          score,
          categoryScores,
          leaks,
          qualified,
          createdAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        const data = await res.json() as { token?: string };
        token = data.token ?? null;
      }
    } catch {
      // Non-blocking – results still shown even if submission fails
    }

    // Fallback: localStorage for anonymous / API failure
    try {
      localStorage.setItem(
        'inbound-audit-results',
        JSON.stringify({ score, categoryScores, leaks, qualified, answers, contact })
      );
    } catch {
      /* ignore */
    }

    clearState();
    router.push(token ? `/results/${token}` : '/results');
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-near-black flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  const isLeadStep = currentStep === 12;
  const question = !isLeadStep ? questions[currentStep] : null;
  const progressValue = ((currentStep + 1) / TOTAL_STEPS) * 100;
  const canGoNext = canProceed(currentStep, answers, contact);

  return (
    <div className="min-h-screen bg-near-black flex flex-col">
      {/* Top bar */}
      <div className="sticky top-0 z-40 bg-near-black/90 backdrop-blur-sm border-b border-white/8 px-5 py-4">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-sm font-bold">
              Inbound<span className="text-gold">Audit</span>
            </Link>
            <span className="text-xs text-white/40">
              {Math.min(currentStep + 1, TOTAL_STEPS)} / {TOTAL_STEPS}
            </span>
          </div>
          <Progress value={progressValue} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-10 flex items-start justify-center">
        <div className="w-full max-w-xl space-y-8">
          {/* Category badge */}
          {question && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold/70 px-3 py-1 rounded-full border border-gold/20 bg-gold/5">
                {question.categoryLabel}
              </span>
              <span className="text-xs text-white/30">
                Frage {question.number} von 12
              </span>
            </div>
          )}
          {isLeadStep && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold/70 px-3 py-1 rounded-full border border-gold/20 bg-gold/5">
                Fast fertig
              </span>
            </div>
          )}

          {/* Question text */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold leading-snug text-off-white">
              {isLeadStep
                ? 'Wo sollen wir dein Ergebnis hinschicken?'
                : question?.text}
            </h2>
            {isLeadStep && (
              <p className="text-white/50 text-sm">
                Du erhältst deinen Score direkt auf der nächsten Seite. Die E-Mail ist für
                optionale Follow-ups.
              </p>
            )}
          </div>

          {/* Input */}
          {isLeadStep ? (
            <LeadCaptureStep contact={contact} onChange={handleContactChange} />
          ) : (
            question && (
              <QuizStepContent
                step={currentStep}
                answers={answers}
                onChange={handleAnswer}
              />
            )
          )}

          {/* Error */}
          {error && <p className="text-sm text-red-400">{error}</p>}

          {/* Navigation */}
          <div className="flex items-center gap-4 pt-2">
            {currentStep > 0 && (
              <Button variant="ghost" size="md" onClick={handleBack} disabled={submitting}>
                ← Zurück
              </Button>
            )}
            <Button
              size="md"
              className="flex-1"
              onClick={handleNext}
              disabled={!canGoNext || submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  Wird ausgewertet…
                </span>
              ) : isLeadStep ? (
                'Ergebnis anzeigen →'
              ) : (
                'Weiter →'
              )}
            </Button>
          </div>

          {/* Skip hint on last step */}
          {isLeadStep && (
            <button
              type="button"
              onClick={async () => {
                const { score, categoryScores, leaks, qualified } = calculateScore(answers);
                trackEvent('audit_completed', { score, qualified });
                trackEvent(qualified ? 'qualified_true' : 'qualified_false', { score });

                let anonToken: string | null = null;
                try {
                  const res = await fetch('/api/lead', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      email: 'anonymous',
                      answers,
                      score,
                      categoryScores,
                      leaks,
                      qualified,
                      createdAt: new Date().toISOString(),
                    }),
                  });
                  if (res.ok) {
                    const data = await res.json() as { token?: string };
                    anonToken = data.token ?? null;
                  }
                } catch { /* ignore */ }

                try {
                  localStorage.setItem(
                    'inbound-audit-results',
                    JSON.stringify({ score, categoryScores, leaks, qualified, answers, contact: { email: 'anonymous' } })
                  );
                } catch { /* ignore */ }
                clearState();
                router.push(anonToken ? `/results/${anonToken}` : '/results');
              }}
              className="w-full text-center text-xs text-white/25 hover:text-white/50 transition-colors py-2"
            >
              Ohne E-Mail fortfahren →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
