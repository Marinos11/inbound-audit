'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CategoryBar } from '@/components/ui/Progress';
import { getScoreBucket, bucketCopy } from '@/lib/scoring';
import type { QuizResults } from '@/types';

// ─── Score Ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#c8a24a' : '#ef4444';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 136 136">
          <circle cx="68" cy="68" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle
            cx="68" cy="68" r={radius} fill="none"
            stroke={color} strokeWidth="10" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-off-white">{score}</span>
          <span className="text-xs text-white/40 mt-0.5">/ 100</span>
        </div>
      </div>
      <p className="text-xs text-white/40 uppercase tracking-widest">Dein Score</p>
    </div>
  );
}

// ─── Leak Card ────────────────────────────────────────────────────────────────

function LeakCard({ leak, rank }: { leak: QuizResults['leaks'][0]; rank: number }) {
  return (
    <Card variant="default" className="p-6 space-y-4">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold text-sm">
          {rank}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-white/40 uppercase tracking-widest">{leak.category}</span>
            <span className="text-xs text-white/20">·</span>
            <span className="text-xs text-red-400">{leak.score}/{leak.maxScore} Punkte</span>
          </div>
          <h3 className="font-semibold text-lg text-off-white">{leak.title}</h3>
        </div>
      </div>
      <p className="text-sm text-white/55 leading-relaxed">{leak.description}</p>
      <div className="pt-3 border-t border-white/8 space-y-2">
        <p className="text-xs font-semibold text-gold uppercase tracking-wider">Fix</p>
        <ul className="space-y-2">
          {leak.fixes.map((fix, i) => (
            <li key={i} className="flex gap-3 text-sm text-white/65">
              <span className="text-gold/60 flex-shrink-0 mt-0.5">→</span>
              <span>{fix}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

// ─── Next Steps ───────────────────────────────────────────────────────────────

function NextSteps({ bucket, qualified }: { bucket: 'A' | 'B' | 'C'; qualified: boolean }) {
  const copy = bucketCopy[bucket];
  const contactUrl = process.env.NEXT_PUBLIC_CONTACT_URL ?? 'mailto:hello@example.com';

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{copy.headline}</h2>
        <p className="text-white/55 leading-relaxed">{copy.message}</p>
      </div>

      {bucket === 'C' && (
        <Card className="p-6 space-y-3">
          <p className="text-sm font-semibold text-gold">Dein 7-Tage-Aktionsplan</p>
          <ol className="space-y-3">
            {[
              'Tag 1–2: Headline nach Formel [Zielgruppe → Ergebnis] umschreiben',
              'Tag 2–3: 3 Proof-Elemente im Profil platzieren (Zahlen, Cases)',
              'Tag 3–4: CTA im "Über mich" einbauen (DM-Keyword, Link)',
              'Tag 4–5: Ersten Case-Study-Post schreiben und veröffentlichen',
              'Tag 5–6: 30 relevante Verbindungen anfragen (personalisiert)',
              'Tag 6–7: Täglich 10 Min bei Zielkunden kommentieren – starten',
            ].map((action, i) => (
              <li key={i} className="flex gap-3 text-sm text-white/65">
                <span className="text-gold font-bold flex-shrink-0">{i + 1}.</span>
                <span>{action}</span>
              </li>
            ))}
          </ol>
        </Card>
      )}

      <div className={qualified
        ? 'p-6 rounded-xl border border-gold/40 bg-gold/5 space-y-4'
        : 'p-6 rounded-xl border border-white/12 bg-surface space-y-4'
      }>
        {qualified ? (
          <>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gold uppercase tracking-wider">Du bist qualifiziert</p>
              <h3 className="text-xl font-bold">Jetzt einen kostenlosen Diagnose-Call buchen.</h3>
              <p className="text-sm text-white/50">
                30 Minuten. Kein Pitch. Wir schauen gemeinsam auf deine Zahlen und ich sage dir
                ehrlich, ob und wie ich helfen kann.
              </p>
            </div>
            <a href={contactUrl}>
              <Button size="lg" className="w-full sm:w-auto">Call anfragen →</Button>
            </a>
          </>
        ) : (
          <>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white/40 uppercase tracking-wider">Nächste Schritte</p>
              <h3 className="text-xl font-bold">Quick Wins direkt umsetzen.</h3>
              <p className="text-sm text-white/50">
                Starte mit den Top-3-Fixes oben. Wenn du dabei Unterstützung willst, meld dich.
              </p>
            </div>
            <a href={contactUrl}>
              <Button variant="secondary" size="md">Kontakt aufnehmen →</Button>
            </a>
          </>
        )}
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResultsTokenPage() {
  const { token } = useParams<{ token: string }>();
  const [results, setResults] = useState<QuizResults | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/results/${token}`)
      .then((r) => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null; }
        return r.json();
      })
      .then((data) => {
        if (data) {
          setResults(data as QuizResults);
        }
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-near-black flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-gold border-t-transparent animate-spin" />
      </div>
    );
  }

  if (notFound || !results) {
    return (
      <div className="min-h-screen bg-near-black flex flex-col items-center justify-center gap-6 px-5 text-center">
        <p className="text-white/50">Ergebnis nicht gefunden oder abgelaufen.</p>
        <Link href="/audit">
          <Button>Audit neu starten →</Button>
        </Link>
      </div>
    );
  }

  const { score, categoryScores, leaks, qualified } = results;
  const bucket = getScoreBucket(score);

  return (
    <div className="min-h-screen bg-near-black">
      <div className="border-b border-white/8 px-5 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-sm font-bold">
            Inbound<span className="text-gold">Audit</span>
          </Link>
          <Link href="/audit">
            <Button variant="ghost" size="sm">Neu starten</Button>
          </Link>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-5 py-12 space-y-16">
        <section className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-xs text-white/40 uppercase tracking-widest">Dein Ergebnis</p>
            <h1 className="text-3xl sm:text-4xl font-bold">LinkedIn Inbound Score</h1>
          </div>
          <ScoreRing score={score} />
          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold border ${
            bucket === 'A'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
              : bucket === 'B'
              ? 'border-gold/40 bg-gold/8 text-gold'
              : 'border-red-500/40 bg-red-500/8 text-red-400'
          }`}>
            {bucket === 'A' ? 'Advanced' : bucket === 'B' ? 'Intermediate' : 'Needs Work'}
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold">Kategorie-Breakdown</h2>
          <Card className="p-6 space-y-5">
            <CategoryBar label="Profil & Positionierung" value={categoryScores.profile} maxValue={30} />
            <CategoryBar label="Content & CTA" value={categoryScores.content} maxValue={35} />
            <CategoryBar label="Distribution & Netzwerk" value={categoryScores.distribution} maxValue={20} />
            <CategoryBar label="Umsatz / Qualifizierung" value={categoryScores.revenue} maxValue={15} />
          </Card>
        </section>

        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Deine Top-3-Leaks</h2>
            <p className="text-sm text-white/40">Sortiert nach Hebel – fang oben an.</p>
          </div>
          <div className="space-y-4">
            {leaks.map((leak, i) => (
              <LeakCard key={leak.category} leak={leak} rank={i + 1} />
            ))}
          </div>
        </section>

        <NextSteps bucket={bucket} qualified={qualified} />

        <p className="text-xs text-white/25 text-center pb-4">
          © {new Date().getFullYear()} InboundAudit ·{' '}
          <Link href="/privacy" className="hover:text-white/50 underline">Datenschutz</Link>
        </p>
      </main>
    </div>
  );
}
