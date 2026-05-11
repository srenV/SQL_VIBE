import type { Metadata } from "next";
import Link from "next/link";
import { catalog, allLessonIds } from "@/data/catalog";
import { PageShell } from "@/components/pageShell";
import { FadeIn } from "@/components/animations";
import { AnimatedCard } from "@/components/animatedCard";
import { DifficultyBadge } from "@/components/difficultyBadge";
import type { Lesson } from "@/types/exercise";

export const metadata: Metadata = {
  title: "SQL Lektionen – Interaktive MySQL-Übungen",
  description:
    "Lerne MySQL Schritt für Schritt mit interaktiven Übungen: SELECT, WHERE, JOINs, Aggregationen, Subqueries, CTEs, Window Functions und mehr.",
  alternates: { canonical: "/lektionen" },
  openGraph: {
    title: "SQL Lektionen – Interaktive MySQL-Übungen",
    description:
      "Lerne MySQL Schritt für Schritt mit interaktiven Übungen: SELECT, WHERE, JOINs, Aggregationen, Subqueries, CTEs, Window Functions und mehr.",
  },
};

export default function LektionenPage() {
  const sortedLessons = allLessonIds
    .map((id) => catalog.lessons[id])
    .filter((l): l is NonNullable<typeof l> => !!l && l.id !== "lesson_story")
    .sort((a, b) => a.order - b.order);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "SQL Lektionen",
    description: "Interaktive MySQL-Übungen von SELECT-Grundlagen bis zu Interview-Challenges.",
    numberOfItems: sortedLessons.length,
    itemListElement: sortedLessons.map((lesson, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: lesson.title,
      url: `https://sql-vibe.vercel.app/lektionen/${lesson.id}`,
    })),
  };

  return (
    <PageShell mainClassName="flex-1 py-12" containerClassName="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
            <h2 className="sr-only">Alle Lektionen</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sortedLessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </FadeIn>
    </PageShell>
  );
}

function LessonCard({ lesson }: { lesson: Lesson }) {
  const exerciseCount = lesson.exercises.length;

  return (
    <Link
      href={`/lektionen/${lesson.id}`}
      className="group block"
    >
      <AnimatedCard colorTheme="primary">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-ink-muted">
                Lektion {lesson.order}
              </span>
              <DifficultyBadge difficulty={lesson.difficulty} />
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

        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-ink-muted">
          <span>
            {exerciseCount} {exerciseCount === 1 ? "Übung" : "Übungen"}
          </span>
          <span className="text-primary-500 font-medium group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
            Starten
            <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-1 group-hover:ml-0 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </AnimatedCard>
    </Link>
  );
}