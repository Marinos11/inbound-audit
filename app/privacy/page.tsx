import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-near-black">
      <div className="border-b border-white/8 px-5 py-4">
        <div className="max-w-2xl mx-auto">
          <Link href="/" className="text-sm font-bold">
            Inbound<span className="text-gold">Audit</span>
          </Link>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-5 py-12 space-y-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Datenschutzerklärung</h1>
          <p className="text-sm text-white/40">Stand: {new Date().getFullYear()}</p>
        </div>

        {[
          {
            title: '1. Verantwortlicher',
            text: 'Verantwortlich für die Datenverarbeitung auf dieser Website ist der Betreiber. Kontakt: Bitte verwende das Kontaktformular oder die auf der Website angegebene E-Mail-Adresse.',
          },
          {
            title: '2. Welche Daten wir erheben',
            text: 'Im Rahmen des Audits erheben wir folgende Daten: Name (optional), E-Mail-Adresse (erforderlich für das Ergebnis), LinkedIn-Profil URL (optional), sowie deine Antworten auf die 12 Audit-Fragen. Technische Daten (IP-Adresse, Browser, Betriebssystem) werden durch den Hosting-Anbieter in Server-Logs gespeichert.',
          },
          {
            title: '3. Zweck der Datenverarbeitung',
            text: 'Wir verarbeiten deine Daten ausschließlich zur Bereitstellung des Audit-Ergebnisses, zur optionalen Kontaktaufnahme im Rahmen eines Beratungsgesprächs sowie zur Verbesserung unseres Angebots. Ohne deine ausdrückliche Zustimmung findet keine Weitergabe an Dritte zu Werbezwecken statt.',
          },
          {
            title: '4. Rechtsgrundlage',
            text: 'Die Datenverarbeitung erfolgt auf Basis deiner Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) durch das Ausfüllen und Absenden des Audit-Formulars sowie auf Basis unseres berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO) an der Bereitstellung eines funktionierenden Dienstes.',
          },
          {
            title: '5. Speicherdauer',
            text: 'Deine Daten werden nur so lange gespeichert, wie es für die genannten Zwecke erforderlich ist oder gesetzliche Aufbewahrungsfristen dies verlangen. Audit-Ergebnisse werden lokal in deinem Browser (localStorage) gespeichert und können jederzeit durch Löschen der Browser-Daten entfernt werden.',
          },
          {
            title: '6. Deine Rechte',
            text: 'Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch gegen die Verarbeitung deiner personenbezogenen Daten. Zur Ausübung dieser Rechte wende dich an den oben genannten Verantwortlichen.',
          },
          {
            title: '7. Cookies und lokale Speicherung',
            text: 'Diese Website verwendet keine Tracking-Cookies von Drittanbietern. Wir setzen localStorage ein, um deine Audit-Antworten während der Sitzung zu speichern. Diese Daten verbleiben ausschließlich auf deinem Gerät.',
          },
          {
            title: '8. Hosting',
            text: 'Diese Website wird auf Servern eines Hosting-Anbieters betrieben. Der Anbieter verarbeitet Zugriffsdaten (IP-Adresse, Zeitstempel, aufgerufene Seiten) im Rahmen seiner Datenschutzbestimmungen.',
          },
        ].map(({ title, text }) => (
          <section key={title} className="space-y-3">
            <h2 className="text-lg font-semibold text-off-white">{title}</h2>
            <p className="text-sm text-white/55 leading-relaxed">{text}</p>
          </section>
        ))}

        <div className="pt-6 border-t border-white/8">
          <Link
            href="/"
            className="text-sm text-white/40 hover:text-white/70 transition-colors"
          >
            ← Zurück zur Startseite
          </Link>
        </div>
      </main>
    </div>
  );
}
