/**
 * Lektionen-Detailseite – Zeigt alle Uebungen einer Lektion mit
 * Fortschrittsanzeige und Schwierigkeitsgrad-Labels an.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCatalog, allLessonIds } from "@/data/catalog";
import { PageShell } from "@/components/pageShell";
import { Card } from "@/components/card";
import { FadeIn } from "@/components/animations";
import { DifficultyBadge } from "@/components/difficultyBadge";

interface PageProps {
  params: Promise<{ locale: string; lessonId: string }>;
}

export async function generateStaticParams() {
  return allLessonIds.map((id) => ({ lessonId: id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, lessonId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("lektionen");
  const metaCatalog = getCatalog(locale);
  const lesson = metaCatalog.lessons[lessonId];
  if (!lesson) return { title: t("lessonNotFound") };
  return {
    title: `${lesson.title} – ${t("title")}`,
    description: lesson.description,
    alternates: { canonical: `/lektionen/${lessonId}` },
    openGraph: {
      title: `${lesson.title} – ${t("title")}`,
      description: lesson.description,
    },
  };
}

export default async function LessonOverviewPage({ params }: PageProps) {
  const { locale, lessonId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("lektionen");
  const catalog = getCatalog(locale);
  const lesson = catalog.lessons[lessonId];
  if (!lesson) notFound();

  const exercises = lesson.exercises
    .map((id) => catalog.exercises[id])
    .filter(Boolean);

  const totalPoints = exercises.reduce((sum, e) => sum + e.points, 0);

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
    <PageShell mainClassName="flex-1 py-8" containerClassName="">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <FadeIn delay={0}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-ink">{lesson.title}</h1>
          <p className="mt-2 text-sm text-ink-muted">{lesson.description}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <DifficultyBadge difficulty={lesson.difficulty} />
                <span className="text-xs text-ink-muted">
                  {exercises.length} {t("exercisePlural")} · {totalPoints} {t("points")}
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
                        <span className="text-xs whitespace-nowrap">{exercise.points} {t("pointsShort")}</span>
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
                    {t("startFirstExercise")} &rarr;
                  </button>
                </Link>
              </div>
            </FadeIn>
          )}
    </PageShell>
  );
}