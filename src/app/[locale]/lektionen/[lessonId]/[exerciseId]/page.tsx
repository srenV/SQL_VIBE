/**
 * Uebungsseite – Server-Komponente, die eine einzelne Uebung laedt,
 * den Playground-Adapter aufruft und die Client-Komponente rendert.
 * Generiert statische Pfade fuer alle Uebungen beim Build.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { getCatalog, allLessonIds } from "@/data/catalog";
import { routing } from "@/i18n/routing";
import { adaptExercise } from "@/lib/playgroundAdapter";
import { ExercisePageClient } from "./ExercisePageClient";

interface PageProps {
  params: Promise<{ locale: string; lessonId: string; exerciseId: string }>;
}

export async function generateStaticParams() {
  const params: { locale: string; lessonId: string; exerciseId: string }[] = [];
  for (const locale of routing.locales) {
    const catalog = getCatalog(locale);
    for (const lessonId of allLessonIds) {
      const lesson = catalog.lessons[lessonId];
      if (!lesson) continue;
      for (const exerciseId of lesson.exercises) {
        params.push({ locale, lessonId, exerciseId });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, lessonId, exerciseId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("exercise");
  const metaCatalog = getCatalog(locale);
  const lesson = metaCatalog.lessons[lessonId];
  const exercise = metaCatalog.exercises[exerciseId];
  if (!lesson || !exercise) return { title: t("notFound") };
  return {
    title: `${exercise.title} – ${lesson.title}`,
    description: exercise.description,
    alternates: { canonical: `/lektionen/${lessonId}/${exerciseId}` },
    openGraph: {
      title: `${exercise.title} – ${lesson.title}`,
      description: exercise.description,
    },
  };
}

export default async function ExercisePage({ params }: PageProps) {
  const { locale, lessonId, exerciseId } = await params;
  setRequestLocale(locale);

  const catalog = getCatalog(locale);

  const lesson = catalog.lessons[lessonId];
  if (!lesson) notFound();

  const exercise = catalog.exercises[exerciseId];
  if (!exercise) notFound();

  const dataset = catalog.datasets[exercise.datasetId];
  if (!dataset) notFound();

  const playgroundExercise = adaptExercise(exercise, dataset);

  const lessonExerciseIds = lesson.exercises;
  const currentIndex = lessonExerciseIds.indexOf(exerciseId);
  const prevExerciseId = currentIndex > 0 ? lessonExerciseIds[currentIndex - 1] : null;
  const nextExerciseId =
    currentIndex < lessonExerciseIds.length - 1
      ? lessonExerciseIds[currentIndex + 1]
      : null;

  const lessonExerciseTitles = lessonExerciseIds.map(
    (id) => catalog.exercises[id]?.title ?? id
  );

  const lessonExerciseCompleted = lessonExerciseIds.map(() => false);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://sql-vibe.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Lektionen", item: "https://sql-vibe.vercel.app/lektionen" },
      { "@type": "ListItem", position: 3, name: lesson.title, item: `https://sql-vibe.vercel.app/lektionen/${lessonId}` },
      { "@type": "ListItem", position: 4, name: exercise.title, item: `https://sql-vibe.vercel.app/lektionen/${lessonId}/${exerciseId}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ExercisePageClient
        lesson={lesson}
        exercise={exercise}
        playgroundExercise={playgroundExercise}
        prevExerciseId={prevExerciseId}
        nextExerciseId={nextExerciseId}
        lessonExerciseIds={lessonExerciseIds}
        lessonExerciseTitles={lessonExerciseTitles}
        lessonExerciseCompleted={lessonExerciseCompleted}
      />
    </>
  );
}