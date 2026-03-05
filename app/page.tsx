import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

// ─── Shared primitives ────────────────────────────────────────────────────────

function GoldDivider() {
  return <div className="w-12 h-px bg-gold/60 mx-auto" />;
}

// ─── Header ───────────────────────────────────────────────────────────────────

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-near-black/80 backdrop-blur-md border-b border-white/8">
      <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
        <span className="font-bold text-off-white tracking-tight">
          Inbound<span className="text-gold">Audit</span>
        </span>
        <Link href="/audit">
          <Button size="sm">Audit starten →</Button>
        </Link>
      </div>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="pt-20 pb-24 px-5">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/8 text-gold text-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
          Für Unternehmer, Coaches & Consultants ab 500k
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-off-white">
          Finde in 5 Minuten heraus,{' '}
          <span className="text-gradient-gold">warum dein LinkedIn keine Anfragen bringt.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg sm:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto">
          Du bekommst einen Score (0–100) + die 3 größten Leaks + eine Prioritätenliste. Für
          Unternehmer, Coaches, Consultants & Agenturinhaber ab 500k Umsatz.
        </p>

        {/* Bullet points */}
        <ul className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center text-sm text-white/70">
          {[
            { icon: '◆', text: 'Profil & Positionierung' },
            { icon: '◆', text: 'Content & CTA' },
            { icon: '◆', text: 'Distribution & Netzwerk' },
          ].map(({ icon, text }) => (
            <li key={text} className="flex items-center gap-2">
              <span className="text-gold text-xs">{icon}</span>
              {text}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/audit">
            <Button size="lg">Audit starten →</Button>
          </Link>
          <p className="text-white/30 text-sm">Kostenlos · Keine Anmeldung · 5 Minuten</p>
        </div>
      </div>
    </section>
  );
}

// ─── Proof / Stats ────────────────────────────────────────────────────────────

function ProofStats() {
  const stats = [
    { value: '5,1M', label: 'Impressions' },
    { value: '1,3M', label: 'Reach' },
    { value: '8,5k', label: 'Follower' },
  ];

  const cases = [
    {
      metric: '+340%',
      label: 'Inbound-Anfragen',
      detail: 'Consulting, B2B SaaS',
      timeframe: '90 Tage',
    },
    {
      metric: '12 Calls',
      label: 'pro Monat',
      detail: 'Executive Coach',
      timeframe: '60 Tage',
    },
    {
      metric: '€180k',
      label: 'über LinkedIn',
      detail: 'Agenturinhaber',
      timeframe: '6 Monate',
    },
  ];

  return (
    <section className="py-20 px-5 border-t border-white/8">
      <div className="max-w-5xl mx-auto space-y-14">
        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-12">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-4xl font-bold text-gradient-gold">{value}</p>
              <p className="text-sm text-white/50 mt-1">{label}</p>
            </div>
          ))}
        </div>

        <GoldDivider />

        {/* Case study cards */}
        <div className="grid sm:grid-cols-3 gap-5">
          {cases.map(({ metric, label, detail, timeframe }) => (
            <Card key={metric} variant="gold" className="p-6 space-y-3">
              <div>
                <p className="text-3xl font-bold text-gold">{metric}</p>
                <p className="text-sm text-white/60 mt-0.5">{label}</p>
              </div>
              <div className="pt-3 border-t border-white/8">
                <p className="text-xs text-white/40">{detail}</p>
                <p className="text-xs text-white/30">{timeframe}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: '5 Minuten Fragen beantworten',
      desc: '12 gezielte Fragen zu Profil, Content und Distribution. Kein Bullshit, kein Pitch.',
    },
    {
      number: '02',
      title: 'Score + Leaks erhalten',
      desc: 'Du bekommst deinen Score (0–100), die 3 größten Leaks und konkrete Fix-Maßnahmen.',
    },
    {
      number: '03',
      title: 'Nur wenn es Sinn macht: Call',
      desc: 'Kein Cold Sales. Nur wenn die Zahlen stimmen und ich helfen kann, reden wir.',
    },
  ];

  return (
    <section className="py-20 px-5 border-t border-white/8">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">So funktioniert&apos;s</h2>
          <p className="text-white/50">Drei Schritte. Kein Aufwand.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden sm:block absolute top-9 left-1/6 right-1/6 h-px bg-gold/20" />

          {steps.map(({ number, title, desc }) => (
            <Card key={number} className="p-7 space-y-4 relative">
              <div className="w-12 h-12 rounded-full bg-gold/12 border border-gold/30 flex items-center justify-center">
                <span className="text-gold font-bold text-sm">{number}</span>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg leading-snug">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link href="/audit">
            <Button size="lg">Jetzt starten →</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'Warum erst das Audit?',
    a: 'Weil ein Call ohne Kontext Zeitverschwendung für uns beide ist. Das Audit zeigt mir in 5 Minuten, wo dein LinkedIn steht – und ob ich überhaupt helfen kann. Nur wenn das passt, macht ein Gespräch Sinn.',
  },
  {
    q: 'Wie lange dauert es?',
    a: 'Exakt 5 Minuten. 12 Fragen, kein Blabla. Du bekommst sofort dein Ergebnis – ohne Wartezeit, ohne Anruf nötig.',
  },
  {
    q: 'Für wen ist es NICHT?',
    a: 'Für Selbstständige unter 250k Umsatz, Jobsuchende oder alle, die LinkedIn „mal ausprobieren" wollen. Das Audit ist für Unternehmer, die LinkedIn ernsthaft als Inbound-Kanal aufbauen wollen.',
  },
];

function FAQ() {
  return (
    <section className="py-20 px-5 border-t border-white/8">
      <div className="max-w-2xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">Häufige Fragen</h2>
        </div>

        <div className="space-y-4">
          {faqs.map(({ q, a }) => (
            <Card key={q} className="p-6 space-y-3">
              <h3 className="font-semibold text-base text-gold">{q}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{a}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA Banner ─────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="py-20 px-5 border-t border-white/8">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
          Bereit, deine Leaks zu finden?
        </h2>
        <p className="text-white/50">
          5 Minuten. Kostenlos. Keine Anmeldung. Sofortiger Score.
        </p>
        <Link href="/audit">
          <Button size="lg">Audit starten →</Button>
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-8 px-5 border-t border-white/8">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="font-bold text-sm">
          Inbound<span className="text-gold">Audit</span>
        </span>
        <div className="flex gap-6 text-sm text-white/40">
          <Link href="/privacy" className="hover:text-white/70 transition-colors">
            Datenschutz
          </Link>
          <Link href="/audit" className="hover:text-white/70 transition-colors">
            Audit starten
          </Link>
        </div>
        <p className="text-xs text-white/30">© {new Date().getFullYear()} · Alle Rechte vorbehalten</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <ProofStats />
        <HowItWorks />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
