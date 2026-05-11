/**
 * Lektionen-Detailseite – Zeigt alle Uebungen einer Lektion mit
 * Fortschrittsanzeige und Schwierigkeitsgrad-Labels an.
 */
import type { Metadata } from "next";
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = catalog.lessons[lessonId];
  if (!lesson) return { title: "Lektion nicht gefunden" };
  return {
    title: `${lesson.title} – SQL Üben`,
    description: lesson.description,
    alternates: { canonical: `/lektionen/${lessonId}` },
    openGraph: {
      title: `${lesson.title} – SQL Üben`,
      description: lesson.description,
    },
  };
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://sql-vibe.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Lektionen", item: "https://sql-vibe.vercel.app/lektionen" },
      { "@type": "ListItem", position: 3, name: lesson.title, item: `https://sql-vibe.vercel.app/lektionen/${lessonId}` },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header />

      <main className="flex-1 py-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
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

          <div className="grid grid-cols-1 gap-4">
            {exercises.map((exercise, i) => (
              <FadeIn key={exercise.id} delay={Math.min(i * 0.02, 0.3)}>
                <Link href={`/lektionen/${lesson.id}/${exercise.id}`} className="block">
                  <Card variant="outlined" className="p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-xs font-medium dark:bg-primary-950 dark:text-primary-300">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-ink leading-snug">{exercise.title}</h3>
                        <p className="text-xs text-ink-muted mt-1 line-clamp-2">{exercise.description}</p>
                      </div>
                      <div className="shrink-0 flex items-center gap-1 text-ink-muted pt-0.5">
                        <span className="text-xs whitespace-nowrap">{exercise.points} Pkt</span>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
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