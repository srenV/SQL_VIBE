/**
 * Lernen-Uebersichtsseite – Zeigt alle Lernmodule als Card-Grid an.
 *
 * English: Learning overview page – Shows all learning modules as a card grid.
 */

import Link from "next/link";
import { learnModules, totalArticles } from "@/data/learnContent";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { FadeIn } from "@/components/animations";
import { getModuleIcon } from "@/components/learn/moduleIcons";

const DIFFICULTY_CONFIG: Record<string, { label: string; className: string }> = {
  beginner: { label: "Anfänger", className: "bg-success/10 text-success" },
  junior: { label: "Grundlagen", className: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" },
  intermediate: { label: "Fortgeschritten", className: "bg-warning/10 text-warning" },
};

export default function LernenPage() {
  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header />

      <main className="flex-1 py-12">
        <Container className="space-y-10">
          <FadeIn delay={0}>
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-ink">
                Lern-Hub
              </h1>
              <p className="text-lg text-ink-muted max-w-2xl mx-auto">
                Verstehe die Theorie hinter den Datenbanken: Normalisierung, Relationenmodell,
                ERM, SQL-Grundlagen und mehr — mit interaktiven Beispielen und Übungen.
              </p>
              <p className="text-sm text-ink-muted">
                {learnModules.length} Module · {totalArticles} Artikel
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {learnModules.map((mod) => {
                const totalMin = mod.articles.reduce((sum, a) => sum + a.estimatedMinutes, 0);
                const diffConfig = DIFFICULTY_CONFIG[mod.difficulty] ?? DIFFICULTY_CONFIG.beginner;

                return (
                  <Link
                    key={mod.id}
                    href={`/lernen/${mod.id}`}
                    className="group block"
                  >
                    <Card
                      variant="default"
                      className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:border-primary-300 group-hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        {(() => {
                          const IconComponent = getModuleIcon(mod.id);
                          return <IconComponent className="w-8 h-8 text-primary-500" />;
                        })()}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${diffConfig.className}`}>
                          {diffConfig.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-ink group-hover:text-primary-500 transition-colors mt-3">
                        {mod.title}
                      </h3>
                      <p className="text-sm text-ink-muted mt-2 line-clamp-3">
                        {mod.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
                        <div className="flex items-center gap-3">
                          <span>
                            {mod.articles.length} {mod.articles.length === 1 ? "Artikel" : "Artikel"}
                          </span>
                          <span>·</span>
                          <span>~{totalMin} Min.</span>
                        </div>
                        <span className="text-primary-500 font-medium group-hover:translate-x-1 inline-block transition-transform">
                          Lesen &rarr;
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </FadeIn>
        </Container>
      </main>
    </div>
  );
}