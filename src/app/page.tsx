import Link from "next/link";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { FadeIn } from "@/components/animations";
import { Button } from "@/components/button";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header />

      <main className="flex-1">
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

        {/* Drei-Säulen-Feature-Cards */}
        <section className="py-16 bg-surface-dim/30">
          <Container className="space-y-8 max-w-4xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-ink">Drei Wege, SQL zu meistern</h2>
              <p className="mt-2 text-ink-muted">
                Ob gezielte Übungen, freies Experimentieren oder Theorie-Nachhilfe
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <Link href="/lektionen" className="group block">
                <Card variant="flat" className="p-6 h-full transition-all duration-200 group-hover:shadow-lg group-hover:border-primary-300">
                  <div className="text-3xl mb-3" aria-hidden="true">
                    <svg className="w-10 h-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-ink text-lg">Üben</h3>
                  <p className="text-sm text-ink-muted mt-2">
                    Interaktive Übungen mit sofortigem Feedback, Hinweisen und gamifiziertem Fortschritt.
                    Von SELECT-Grundlagen bis zu Interview-Challenges.
                  </p>
                  <span className="text-primary-500 font-medium text-sm mt-3 inline-block group-hover:translate-x-1 transition-transform">
                    Zu den Lektionen &rarr;
                  </span>
                </Card>
              </Link>
              <Link href="/sandbox" className="group block">
                <Card variant="flat" className="p-6 h-full transition-all duration-200 group-hover:shadow-lg group-hover:border-accent-300">
                  <div className="text-3xl mb-3" aria-hidden="true">
                    <svg className="w-10 h-10 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-ink text-lg">Sandbox</h3>
                  <p className="text-sm text-ink-muted mt-2">
                    Eigene Datenbanken erstellen, Tabellen anlegen, Daten einfügen und beliebige
                    SQL-Abfragen ausführen. Alles wird lokal gespeichert.
                  </p>
                  <span className="text-accent-500 font-medium text-sm mt-3 inline-block group-hover:translate-x-1 transition-transform">
                    Sandbox öffnen &rarr;
                  </span>
                </Card>
              </Link>
              <Link href="/lernen" className="group block">
                <Card variant="flat" className="p-6 h-full transition-all duration-200 group-hover:shadow-lg group-hover:border-warning/50">
                  <div className="text-3xl mb-3" aria-hidden="true">
                    <svg className="w-10 h-10 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-14.48 0a60.46 60.46 0 00-.491-6.347A48.627 48.627 0 0112 3.096a48.627 48.627 0 018.962 3.7m-2.48 0A48.627 48.627 0 0012 3.096a48.627 48.627 0 00-8.962 3.7m14.48 0v.008H7.482v-.008" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-ink text-lg">Lernen</h3>
                  <p className="text-sm text-ink-muted mt-2">
                    Theorie-Hub: Normalisierung, Relationenmodell, ERM, SQL-Grundlagen und mehr.
                    Mit interaktiven Diagrammen und eingebetteten Beispielen.
                  </p>
                  <span className="text-warning font-medium text-sm mt-3 inline-block group-hover:translate-x-1 transition-transform">
                    Zum Lern-Hub &rarr;
                  </span>
                </Card>
              </Link>
            </div>
          </Container>
        </section>


      </main>


    </div>
  );
}