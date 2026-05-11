import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PageShell } from "@/components/pageShell";
import { FadeIn } from "@/components/animations";
import { FeatureCard } from "@/components/featureCard";

export const metadata: Metadata = {
  title: "SQL VIBE – Lerne MySQL: Üben, Experimentieren, Verstehen",
  description:
    "Interaktive MySQL-Lernplattform mit Übungen, freier Sandbox für eigene Datenbanken und Theorie-Hub für Normalisierung, RM, ERM und SQL-Grundlagen. MySQL-Syntax wird vollständig unterstützt.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "SQL VIBE – Lerne MySQL: Üben, Experimentieren, Verstehen",
    description:
      "Interaktive MySQL-Lernplattform mit Übungen, freier Sandbox für eigene Datenbanken und Theorie-Hub für Normalisierung, RM, ERM und SQL-Grundlagen.",
    type: "website",
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SQL VIBE",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    description:
      "Interaktive MySQL-Lernplattform mit Übungen, freier Sandbox für eigene Datenbanken und Theorie-Hub für Normalisierung, RM, ERM und SQL-Grundlagen.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
  };

  return (
    <PageShell mainClassName="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="py-20 text-center bg-linear-to-b from-primary-50/50 to-transparent dark:from-primary-950/30 dark:to-transparent">
          <Container className="space-y-6 max-w-4xl mx-auto">
            <FadeIn delay={0}>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                Lerne <span className="text-primary-500">SQL</span> — üben, experimentieren, verstehen
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg sm:text-xl text-ink-muted max-w-2xl mx-auto">
                Interaktive Übungen, eine freie Sandbox für eigene Datenbanken und ein Lern-Hub
                für Normalisierung, RM &amp; ERM &mdash; alles direkt im Browser, ganz ohne Anmeldung.
              </p>
            </FadeIn>
          </Container>
        </section>

        {/* Feature-Cards */}
        <section className="py-16 bg-surface-dim/30">
          <Container className="space-y-8 max-w-6xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-ink">SQL meistern — auf deine Art</h2>
              <p className="mt-2 text-ink-muted">
                Gezielte Übungen, spannende Story-Missionen, freies Experimentieren oder Theorie-Nachhilfe
              </p>
            </div>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <FeatureCard
                href="/lektionen"
                title="Üben"
                description="Interaktive Übungen mit sofortigem Feedback, Hinweisen und gamifiziertem Fortschritt. Von SELECT-Grundlagen bis zu Interview-Challenges."
                cta="Zu den Lektionen"
                colorTheme="primary"
                icon={
                  <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
                  </svg>
                }
              />
              <FeatureCard
                href="/story"
                title="Story"
                description="Löse spannende SQL-Kriminalfälle und Missionen mit steigender Schwierigkeit. Narrative Abenteuer, bei denen jede Abfrage zählt."
                cta="Zur Story"
                colorTheme="violet"
                icon={
                  <svg className="w-10 h-10 text-violet-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 2v2" />
                    <path d="M17.915 22a6 6 0 0 0-12 0" />
                    <path d="M8 2v2" />
                    <circle cx="12" cy="12" r="4" />
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                  </svg>
                }
              />
              <FeatureCard
                href="/sandbox"
                title="Sandbox"
                description="Eigene Datenbanken erstellen, Tabellen anlegen, Daten einfügen und beliebige SQL-Abfragen ausführen. Alles wird lokal gespeichert."
                cta="Sandbox öffnen"
                colorTheme="accent"
                icon={
                  <svg className="w-10 h-10 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                  </svg>
                }
              />
              <FeatureCard
                href="/lernen"
                title="Lernen"
                description="Theorie-Hub: Normalisierung, Relationenmodell, ERM, SQL-Grundlagen und mehr. Mit interaktiven Diagrammen und eingebetteten Beispielen."
                cta="Zum Lern-Hub"
                colorTheme="amber"
                icon={
                  <svg className="w-10 h-10 text-amber-500 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                }
              />
            </div>
          </Container>
        </section>
    </PageShell>
  );
}
