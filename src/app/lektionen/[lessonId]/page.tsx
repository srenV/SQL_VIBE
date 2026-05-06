/**
 * Lektionen-Detailseite – Zeigt alle Uebungen einer Lektion mit
 * Fortschrittsanzeige und Schwierigkeitsgrad-Labels an.
 */
import { notFound } from "next/navigation";
import Link from "next/link";
import { catalog, allLessonIds } from "@/data/catalog";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { Card } from "@/components/card";
import { FadeIn } from "@/components/animations";

interface PageProps {
  params: Promise<{ lessonId: string }>;
}

export async function generateStaticParams() {
  return allLessonIds.map((id) => ({ lessonId: id }));
}

const difficultyLabels: Record<string, { label: string; className: string }> = {
  beginner: { label: "Anfänger", className: "bg-success/10 text-success" },
  junior: { label: "Grundlagen", className: "bg-primary-100 text-primary-700" },
  intermediate: { label: "Fortgeschritten", className: "bg-warning/10 text-warning" },
  advanced: { label: "Experte", className: "bg-error/10 text-error" },
  interview: { label: "Interview", className: "bg-accent-100 text-accent-700" },
};

export default async function LessonOverviewPage({ params }: PageProps) {
  const { lessonId } = await params;
  const lesson = catalog.lessons[lessonId];
  if (!lesson) notFound();

  const exercises = lesson.exercises
    .map((id) => catalog.exercises[id])
    .filter(Boolean);

  const totalPoints = exercises.reduce((sum, e) => sum + e.points, 0);
  const diff = difficultyLabels[lesson.difficulty] ?? difficultyLabels.beginner;

  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header
        breadcrumbs={
          <>
            <span className="text-ink-muted">/</span>
            <span className="text-sm font-medium text-ink">{lesson.title}</span>
          </>
        }
      />

      <main className="flex-1 py-8">
        <Container>
          <FadeIn delay={0}>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-ink">{lesson.title}</h1>
              <p className="mt-2 text-sm text-ink-muted">{lesson.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${diff.className}`}>
                  {diff.label}
                </span>
                <span className="text-xs text-ink-muted">
                  {exercises.length} Übungen · {totalPoints} Punkte
                </span>
              </div>
            </div>
          </FadeIn>

          <div className="grid gap-4">
            {exercises.map((exercise, i) => (
              <FadeIn key={exercise.id} delay={Math.min(i * 0.02, 0.3)}>
                <Link href={`/lektionen/${lesson.id}/${exercise.id}`}>
                  <Card variant="outlined" className="p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-xs font-medium">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-ink truncate">{exercise.title}</h3>
                          <p className="text-xs text-ink-muted mt-0.5 line-clamp-2">{exercise.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-ink-muted">{exercise.points} Pkt</span>
                        <span className="text-ink-muted text-sm" aria-hidden="true">&rarr;</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </FadeIn>
            ))}
          </div>

          {exercises.length > 0 && (
            <FadeIn delay={0.3}>
              <div className="mt-8 text-center">
                <Link href={`/lektionen/${lesson.id}/${exercises[0].id}`}>
                  <button
                    className="inline-flex items-center justify-center gap-2 font-medium rounded-xl px-6 py-3 text-base bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Erste Übung starten &rarr;
                  </button>
                </Link>
              </div>
            </FadeIn>
          )}
        </Container>
      </main>
    </div>
  );
}