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
import { storyExercises } from "@/data/exercises";
import { getUnlockStatus } from "@/lib/storyUnlock";
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
    markExerciseCompleted(exercise.id, attemptCount, exercise.points, {
      exerciseType: exercise.type,
      difficulty: exercise.difficulty,
    });
  }, [exercise.id, exercise.points, exercise.type, exercise.difficulty, markExerciseCompleted]);
  const completedExCount = lessonProgress.completed;
  const totalExCount = lessonProgress.total;
  const progressPercent = totalExCount > 0 ? Math.round((completedExCount / totalExCount) * 100) : 0;

  const currentIndex = lesson.exercises.indexOf(exercise.id);
  const diff = difficultyLabels[exercise.difficulty] ?? difficultyLabels.beginner;

  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header />

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
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Gelöst
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
          <div className="relative lg:pl-62">
            <nav
              className="hidden lg:flex absolute left-0 top-0 bottom-0 w-56 flex-col gap-2 p-2 rounded-lg border border-surface-dim dark:border-dark-dim"
              aria-label="Übungsnavigation"
            >
              <p className="shrink-0 px-1 text-xs font-semibold text-ink-muted uppercase tracking-wide">
                {lesson.title}
              </p>
              <div
                className="flex-1 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--color-violet-500)_transparent] [&::-webkit-scrollbar]:w-0.75 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-surface-dim/50 dark:[&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-violet-500 [&::-webkit-scrollbar-thumb]:max-h-8 [&::-webkit-scrollbar-thumb]:[box-shadow:0_0_8px_--theme(--color-violet-500/0.8)]"
                style={{ direction: "rtl" }}
              >
                <div className="space-y-1 pl-3" style={{ direction: "ltr" }}>
              {lessonExerciseIds.map((exId, i) => {
                const isCompleted = progress.exercises[exId]?.completed ?? lessonExerciseCompleted[i];
                const isCurrent = exId === exercise.id;

                const storyEx = lesson.id === "lesson_story"
                  ? storyExercises.find(e => e.id === exId)
                  : undefined;
                const isLocked = storyEx
                  ? getUnlockStatus(storyEx, storyExercises, progress) === "locked"
                  : false;

                if (isLocked) {
                  return (
                    <div
                      key={exId}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm opacity-40 cursor-not-allowed"
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full text-xs bg-surface-dim text-ink-muted">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>
                      </span>
                      <span className="truncate text-ink-muted">
                        {lessonExerciseTitles[i]}
                      </span>
                    </div>
                  );
                }

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
                      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs transition-colors duration-200 ${
                        isCompleted
                          ? "bg-success/15 text-success"
                          : isCurrent
                          ? "bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-300"
                          : "bg-surface-dim text-ink-muted"
                      }`}
                    >
                      {isCompleted ? <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : i + 1}
                    </span>
                    <span className="truncate">
                      {lessonExerciseTitles[i]}
                    </span>
                  </Link>
                );
              })}
                </div>
              </div>
            </nav>

            <div className="flex-1 min-w-0">
              <FadeIn delay={0}>
                {playgroundExercise.exerciseType === "predict" || playgroundExercise.exerciseType === "schema" || playgroundExercise.exerciseType === "multiple_choice" ? (
                  <PredictQuiz exercise={playgroundExercise} onComplete={handleComplete} />
                ) : playgroundExercise.exerciseType === "story" ? (
                  <StoryPlayer exercise={playgroundExercise} onComplete={handleComplete} />
                ) : (
                  <Playground
                    exercise={playgroundExercise}
                    onComplete={handleComplete}
                    prevHref={prevExerciseId ? `/lektionen/${lesson.id}/${prevExerciseId}` : null}
                    nextHref={nextExerciseId ? `/lektionen/${lesson.id}/${nextExerciseId}` : null}
                    finishHref={!nextExerciseId ? "/lektionen" : null}
                  />
                )}
              </FadeIn>

            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}