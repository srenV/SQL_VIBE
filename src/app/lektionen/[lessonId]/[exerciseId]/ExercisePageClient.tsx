/**
 * ExercisePageClient – Client-Komponente fuer die Uebungsseite.
 * Steuert die Darstellung je nach Aufgabentyp (Write, Debug, Predict, Schema, Story)
 * und verwaltet Navigation, Fortschritt und Layout.
 */
"use client";

import React from "react";
import Link from "next/link";
import { Playground } from "@/components/playground";
import { PredictQuiz } from "@/components/predictQuiz";
import { StoryPlayer } from "@/components/storyPlayer";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { FadeIn } from "@/components/animations";
import { ProgressBar } from "@/components/progressBar";
import { useProgress } from "@/hooks/useProgress";
import type { Lesson as LessonType, Exercise as ExerciseType } from "@/types/exercise";
import type { PlaygroundExercise } from "@/types/playground";

interface ExercisePageClientProps {
  lesson: LessonType;
  exercise: ExerciseType;
  playgroundExercise: PlaygroundExercise;
  prevExerciseId: string | null;
  nextExerciseId: string | null;
  lessonExerciseIds: string[];
  lessonExerciseTitles: string[];
  lessonExerciseCompleted: boolean[];
}

const difficultyLabels: Record<string, { label: string; className: string }> = {
  beginner: { label: "Anfänger", className: "bg-success/10 text-success" },
  junior: { label: "Grundlagen", className: "bg-primary-100 text-primary-700" },
  intermediate: { label: "Fortgeschritten", className: "bg-warning/10 text-warning" },
  advanced: { label: "Experte", className: "bg-error/10 text-error" },
  interview: { label: "Interview", className: "bg-accent-100 text-accent-700" },
};

export function ExercisePageClient({
  lesson,
  exercise,
  playgroundExercise,
  prevExerciseId,
  nextExerciseId,
  lessonExerciseIds,
  lessonExerciseTitles,
  lessonExerciseCompleted,
}: ExercisePageClientProps) {
  const { progress, markExerciseCompleted, getLessonProgress } = useProgress();
  const completed = progress.exercises[exercise.id]?.completed ?? false;

  const lessonProgress = getLessonProgress(lesson.exercises);

  const handleComplete = React.useCallback((attemptCount: number) => {
    markExerciseCompleted(exercise.id, attemptCount, exercise.points);
  }, [exercise.id, exercise.points, markExerciseCompleted]);
  const completedExCount = lessonProgress.completed;
  const totalExCount = lessonProgress.total;
  const progressPercent = totalExCount > 0 ? Math.round((completedExCount / totalExCount) * 100) : 0;

  const currentIndex = lesson.exercises.indexOf(exercise.id);
  const diff = difficultyLabels[exercise.difficulty] ?? difficultyLabels.beginner;

  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header
        breadcrumbs={
          <>
            <Link
              href="/lektionen"
              className="text-ink-muted hover:text-ink transition-colors"
            >
              Lektionen
            </Link>
            <span className="text-ink-muted" aria-hidden="true">/</span>
            <Link
              href={`/lektionen/${lesson.id}`}
              className="text-ink-muted hover:text-ink transition-colors"
            >
              {lesson.title}
            </Link>
          </>
        }
        rightSlot={
          <div className="flex items-center gap-3 shrink-0">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-ink-muted">Gesamtfortschritt</p>
              <p className="text-sm font-semibold text-ink">
                {progress.totalPoints} Punkte
              </p>
            </div>
            {progress.streak > 1 && (
              <span className="inline-flex items-center rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700 dark:bg-accent-900/30 dark:text-accent-300">
                {progress.streak} Tage Streak 🔥
              </span>
            )}
          </div>
        }
      />

      <div className="border-b border-surface-dim bg-surface/50 backdrop-blur-sm">
        <Container className="py-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-ink-muted">
                Übung {currentIndex + 1}/{lesson.exercises.length}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${diff.className}`}
              >
                {diff.label}
              </span>
              {completed && (
                <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                  ✓ Gelöst
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 w-48">
              <ProgressBar
                value={completedExCount}
                max={totalExCount}
                label={`${completedExCount} von ${totalExCount} Übungen abgeschlossen`}
                variant={progressPercent === 100 ? "success" : "primary"}
                size="sm"
              />
              <span className="text-xs text-ink-muted shrink-0">
                {completedExCount}/{totalExCount}
              </span>
            </div>
          </div>
        </Container>
      </div>

      <main className="flex-1 py-6">
        <Container>
          <div className="flex gap-6">
            <nav className="w-56 shrink-0 hidden lg:block space-y-1" aria-label="Übungsnavigation">
              <p className="text-xs font-semibold text-ink-muted mb-2 uppercase tracking-wide">
                {lesson.title}
              </p>
              {lessonExerciseIds.map((exId, i) => {
                const isCompleted = progress.exercises[exId]?.completed ?? lessonExerciseCompleted[i];
                const isCurrent = exId === exercise.id;

                return (
                  <Link
                    key={exId}
                    href={`/lektionen/${lesson.id}/${exId}`}
                    aria-current={isCurrent ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all duration-150 ${
                      isCurrent
                        ? "bg-primary-50 text-primary-700 font-medium dark:bg-primary-900/30"
                        : "text-ink-muted hover:bg-surface-dim hover:text-ink"
                    }`}
                  >
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-xs transition-colors duration-200 ${
                        isCompleted
                          ? "bg-success/15 text-success"
                          : isCurrent
                          ? "bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-300"
                          : "bg-surface-dim text-ink-muted"
                      }`}
                    >
                      {isCompleted ? "✓" : i + 1}
                    </span>
                    <span className="truncate">
                      {lessonExerciseTitles[i]}
                    </span>
                  </Link>
                );
              })}
            </nav>

            <div className="flex-1 min-w-0">
              <FadeIn delay={0}>
                {playgroundExercise.exerciseType === "predict" || playgroundExercise.exerciseType === "schema" || playgroundExercise.exerciseType === "multiple_choice" ? (
                  <PredictQuiz exercise={playgroundExercise} onComplete={handleComplete} />
                ) : playgroundExercise.exerciseType === "story" ? (
                  <StoryPlayer exercise={playgroundExercise} onComplete={handleComplete} />
                ) : (
                  <Playground exercise={playgroundExercise} onComplete={handleComplete} />
                )}
              </FadeIn>

              <FadeIn delay={0.1}>
                <nav className="mt-6 flex items-center justify-between" aria-label="Übungsnavigation">
                  <div>
                    {prevExerciseId && (
                      <Link href={`/lektionen/${lesson.id}/${prevExerciseId}`}>
                        <button className="inline-flex items-center justify-center gap-2 font-medium rounded-md px-3 py-1.5 text-sm bg-transparent text-ink hover:bg-surface-dim transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                          &larr; Vorherige
                        </button>
                      </Link>
                    )}
                  </div>
                  <div>
                    {nextExerciseId && (
                      <Link href={`/lektionen/${lesson.id}/${nextExerciseId}`}>
                        <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg px-4 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                          Nächste Übung &rarr;
                        </button>
                      </Link>
                    )}
                    {!nextExerciseId && (
                      <Link href="/lektionen">
                        <button className="inline-flex items-center justify-center gap-2 font-medium rounded-lg px-4 py-2 text-sm bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                          Zurück zu Lektionen
                        </button>
                      </Link>
                    )}
                  </div>
                </nav>
              </FadeIn>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}