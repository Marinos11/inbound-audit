import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LinkedIn Inbound Leak Audit | Finde deine Top-3-Leaks',
  description:
    'In 5 Minuten herausfinden, warum dein LinkedIn keine Anfragen bringt. Score (0–100) + die 3 größten Leaks + Prioritätenliste.',
  openGraph: {
    title: 'LinkedIn Inbound Leak Audit',
    description: 'Score (0–100) + 3 größte Leaks + Prioritätenliste. Für Unternehmer ab 500k.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-near-black text-off-white antialiased">{children}</body>
    </html>
  );
}
