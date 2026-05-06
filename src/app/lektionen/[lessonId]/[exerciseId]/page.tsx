/**
 * Uebungsseite – Server-Komponente, die eine einzelne Uebung laedt,
 * den Playground-Adapter aufruft und die Client-Komponente rendert.
 * Generiert statische Pfade fuer alle Uebungen beim Build.
 */
import { notFound } from "next/navigation";
import { catalog, allLessonIds } from "@/data/catalog";
import { adaptExercise } from "@/lib/playgroundAdapter";
import { ExercisePageClient } from "./ExercisePageClient";

interface PageProps {
  params: Promise<{ lessonId: string; exerciseId: string }>;
}

export async function generateStaticParams() {
  const params: { lessonId: string; exerciseId: string }[] = [];
  for (const lessonId of allLessonIds) {
    const lesson = catalog.lessons[lessonId];
    if (!lesson) continue;
    for (const exerciseId of lesson.exercises) {
      params.push({ lessonId, exerciseId });
    }
  }
  return params;
}

export default async function ExercisePage({ params }: PageProps) {
  const { lessonId, exerciseId } = await params;

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

  return (
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
  );
}