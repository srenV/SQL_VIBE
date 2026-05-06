import Link from "next/link";
import { catalog, allLessonIds } from "@/data/catalog";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { FadeIn, AnimatedList } from "@/components/animations";
import { Button } from "@/components/button";
import type { Difficulty } from "@/types/exercise";

const difficultyLabels: Record<Difficulty, { label: string; className: string }> = {
  beginner: { label: "Anfänger", className: "bg-success/10 text-success" },
  junior: { label: "Grundlagen", className: "bg-primary-100 text-primary-700" },
  intermediate: { label: "Fortgeschritten", className: "bg-warning/10 text-warning" },
  advanced: { label: "Experte", className: "bg-error/10 text-error" },
  interview: { label: "Interview", className: "bg-accent-100 text-accent-700" },
};

const totalExercises = Object.keys(catalog.exercises).length;
const totalLessons = Object.keys(catalog.lessons).length;
const totalDatasets = Object.keys(catalog.datasets).length;

export default function HomePage() {
  const sortedLessons = allLessonIds
    .map((id) => catalog.lessons[id])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header />

      <main className="flex-1">
        <section className="py-20 text-center bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-950/30 dark:to-transparent">
          <Container className="space-y-6 max-w-3xl mx-auto">
            <FadeIn delay={0}>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                Lerne <span className="text-primary-500">MySQL</span> spielerisch
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg sm:text-xl text-ink-muted max-w-2xl mx-auto">
                Interaktive Übungen, sofortiges Feedback und gamifizierter Fortschritt
                &mdash; alles direkt im Browser, ganz ohne Anmeldung.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href={`/lektionen/${sortedLessons[0]?.id}/${sortedLessons[0]?.exercises[0]}`}>
                  <Button size="lg">
                    Jetzt starten
                  </Button>
                </Link>
                <Link href="/lektionen">
                  <Button variant="secondary" size="lg">
                    Alle Lektionen
                  </Button>
                </Link>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex items-center justify-center gap-8 mt-8 text-sm text-ink-muted">
                <div className="text-center">
                  <p className="text-3xl font-bold text-ink">{totalExercises}</p>
                  <p>Übungen</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-ink">{totalLessons}</p>
                  <p>Lektionen</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-ink">{totalDatasets}</p>
                  <p>Datensätze</p>
                </div>
              </div>
            </FadeIn>
          </Container>
        </section>

        <section className="py-16">
          <Container className="space-y-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-ink">Alle Lektionen</h2>
              <p className="mt-2 text-ink-muted">
                Von SELECT-Grundlagen bis zu Interview-Challenges
              </p>
            </div>

            <AnimatedList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedLessons.map((lesson) => {
                const diff = difficultyLabels[lesson.difficulty] ?? difficultyLabels.beginner;
                const exerciseCount = lesson.exercises.length;
                const firstExerciseId = lesson.exercises[0];

                return (
                  <Link
                    key={lesson.id}
                    href={`/lektionen/${lesson.id}/${firstExerciseId}`}
                    className="group block"
                  >
                    <Card
                      variant="default"
                      className="h-full transition-all duration-200 group-hover:shadow-lg group-hover:border-primary-300 group-hover:-translate-y-0.5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-ink-muted">
                              Lektion {lesson.order}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${diff.className}`}
                            >
                              {diff.label}
                            </span>
                          </div>
                          <h3 className="text-base font-semibold text-ink group-hover:text-primary-500 transition-colors">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-ink-muted line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>
                        <span className="shrink-0 text-2xl font-bold text-primary-200 group-hover:text-primary-400 transition-colors">
                          {String(lesson.order).padStart(2, "0")}
                        </span>
                      </div>

                      <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
                        <span>
                          {exerciseCount} {exerciseCount === 1 ? "Übung" : "Übungen"}
                        </span>
                        <span className="text-primary-500 font-medium group-hover:translate-x-1 inline-block transition-transform">
                          Starten &rarr;
                        </span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </AnimatedList>
          </Container>
        </section>

        <section className="py-16 bg-surface-dim/30">
          <Container className="space-y-8 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-ink">Wie funktioniert&apos;s?</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              <Card variant="flat" className="p-5">
                <div className="text-3xl mb-2" aria-hidden="true">&#x1F4DD;</div>
                <h3 className="font-semibold text-ink">Übung lesen</h3>
                <p className="text-sm text-ink-muted mt-1">
                  Jede Lektion erklärt das Thema und gibt eine konkrete Aufgabe vor.
                </p>
              </Card>
              <Card variant="flat" className="p-5">
                <div className="text-3xl mb-2" aria-hidden="true">&#x2328;&#xFE0F;</div>
                <h3 className="font-semibold text-ink">SQL schreiben</h3>
                <p className="text-sm text-ink-muted mt-1">
                  Löse die Aufgabe im integrierten Playground mit sofortigem Feedback.
                </p>
              </Card>
              <Card variant="flat" className="p-5">
                <div className="text-3xl mb-2" aria-hidden="true">&#x1F3C6;</div>
                <h3 className="font-semibold text-ink">Punkte sammeln</h3>
                <p className="text-sm text-ink-muted mt-1">
                  Verfolge deinen Fortschritt und baue eine Streak auf.
                </p>
              </Card>
            </div>
          </Container>
        </section>
      </main>


    </div>
  );
}