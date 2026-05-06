import Link from "next/link";
import { catalog, allLessonIds } from "@/data/catalog";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { FadeIn } from "@/components/animations";
import type { Difficulty, Lesson } from "@/types/exercise";

const difficultyLabels: Record<Difficulty, { label: string; className: string }> = {
  beginner: { label: "Anfänger", className: "bg-success/10 text-success" },
  junior: { label: "Grundlagen", className: "bg-primary-100 text-primary-700" },
  intermediate: { label: "Fortgeschritten", className: "bg-warning/10 text-warning" },
  advanced: { label: "Experte", className: "bg-error/10 text-error" },
  interview: { label: "Interview", className: "bg-accent-100 text-accent-700" },
};

export default function LektionenPage() {
  const sortedLessons = allLessonIds
    .map((id) => catalog.lessons[id])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header />

      <main className="flex-1 py-12">
        <Container className="space-y-10">
          <FadeIn delay={0}>
            <div className="text-center space-y-3">
              <h1 className="text-4xl font-bold tracking-tight text-ink">
                SQL Lektionen
              </h1>
              <p className="text-lg text-ink-muted max-w-2xl mx-auto">
                Lerne MySQL Schritt für Schritt. Wähle eine Lektion, um mit den
                interaktiven Übungen zu beginnen.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </FadeIn>
        </Container>
      </main>


    </div>
  );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  const diff = difficultyLabels[lesson.difficulty] ?? difficultyLabels.beginner;
  const exerciseCount = lesson.exercises.length;

  return (
    <Link
      href={`/lektionen/${lesson.id}`}
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
}