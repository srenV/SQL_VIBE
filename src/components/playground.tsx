/**
 * Playground – Hauptkomponente fuer die SQL-Uebungsumgebung.
 * Orchestriert SQL-Editor, Schema-Explorer, Ergebnistabelle,
 * Hinweise und verdeckte Tests in einer einheitlichen Oberflaeche.
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { SqlEditor } from "@/components/sqlEditor";
import { ResultsetTable } from "@/components/resultsetTable";
import { SchemaExplorer } from "@/components/schemaExplorer";
import { FadeIn } from "@/components/animations";
import { StatusCard } from "@/components/statusCard";
import { SqlResultSkeleton } from "@/components/skeleton";
import { usePlayground } from "@/hooks/usePlayground";
import type { PlaygroundExercise } from "@/types/playground";

interface PlaygroundProps {
  exercise: PlaygroundExercise;
  onComplete?: (attemptCount: number) => void;
  prevHref?: string | null;
  nextHref?: string | null;
  finishHref?: string | null;
}

export const Playground: React.FC<PlaygroundProps> = ({ exercise, onComplete, prevHref, nextHref, finishHref }) => {
  const t = useTranslations("playground");
  const {
    phase,
    userQuery,
    queryResult,
    comparison,
    hiddenTestResults,
    hint,
    errorExplanation,
    attemptCount,
    completed,
    setUserQuery,
    runUserQuery,
    requestStrongerHint,
    showHint,
    showSolution,
    solutionRevealed,
    resetSession,
    liveSchema,
    db,
  } = usePlayground(exercise);

  const hasHiddenFailures = hiddenTestResults && hiddenTestResults.some((r) => !r.passed);

  const prevCompletedRef = React.useRef(false);
  const currentAttemptRef = React.useRef(attemptCount);
  React.useEffect(() => {
    currentAttemptRef.current = attemptCount;
  }, [attemptCount]);

  React.useEffect(() => {
    if (completed && !prevCompletedRef.current && onComplete) {
      onComplete(currentAttemptRef.current);
    }
    prevCompletedRef.current = completed;
  }, [completed, onComplete]);

  return (
    <div className="space-y-6">
      <FadeIn delay={0}>
        <Card variant="outlined" className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{exercise.title}</h3>
              <p className="text-sm text-ink-muted">{exercise.task}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                aria-label={t("difficultyLabel", { level: exercise.difficulty === "easy" ? t("easy") : exercise.difficulty === "medium" ? t("medium") : t("hard") })}
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  exercise.difficulty === "easy"
                    ? "bg-success/10 text-success"
                    : exercise.difficulty === "medium"
                    ? "bg-warning/10 text-warning"
                    : "bg-error/10 text-error"
                }`}
              >
                {exercise.difficulty === "easy"
                  ? t("easy")
                  : exercise.difficulty === "medium"
                  ? t("medium")
                  : t("hard")}
              </span>
            </div>
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={0.05}>
        <fieldset className="bg-surface rounded-xl border border-surface-dim dark:border-dark-dim p-5 min-w-0">
          <legend className="px-2 -ml-1 text-sm font-medium text-ink flex items-center gap-3">
            {t("yourQuery")}
            {attemptCount > 0 && (
              <span className="text-xs text-ink-muted tabular-nums">
                {t("attempt", { count: attemptCount })}
              </span>
            )}
          </legend>
          <SqlEditor
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            error={phase === "error"}
            placeholder={t("queryPlaceholder")}
            onSubmit={runUserQuery}
          />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={runUserQuery}
                isLoading={phase === "running"}
                disabled={!userQuery.trim() || phase === "running" ? true : false}
              >
                {t("runQuery")}
              </Button>
              <Button variant="ghost" size="sm" onClick={resetSession}>
                {t("reset")}
              </Button>

              {/* Hinweis-Icon – nur nach mind. 1 Versuch */}
              {attemptCount >= 1 && !completed && (
                <button
                  onClick={hint ? requestStrongerHint : showHint}
                  disabled={hint && hint.level >= (exercise.hints?.length ?? 1)}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-dim transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  title={hint ? t("strongerHint") : t("showHint")}
                  aria-label={hint ? t("strongerHint") : t("showHint")}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  {hint ? t("hintLevel", { level: hint.level, total: exercise.hints?.length ?? 1 }) : t("hint")}
                </button>
              )}

              {/* Lösung-Icon – nur ab 5 Fehlversuchen */}
              {attemptCount >= 5 && !completed && !solutionRevealed && (
                <button
                  onClick={showSolution}
                  className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20 transition-colors"
                  title={t("showSolution")}
                  aria-label={t("showSolution")}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Lösung
                </button>
              )}

              {solutionRevealed && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {t("solutionRevealed")}
                </span>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-2">
              {prevHref && (
                <a href={prevHref} className="inline-flex items-center justify-center gap-1 font-medium rounded-md px-3 py-1.5 text-sm bg-transparent text-ink hover:bg-surface-dim transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                  &larr; {t("back")}
                </a>
              )}
              {nextHref && (
                <a href={nextHref} className="inline-flex items-center justify-center gap-1 font-medium rounded-lg px-4 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                  {t("next")} &rarr;
                </a>
              )}
              {!nextHref && finishHref && (
                <a href={finishHref} className="inline-flex items-center justify-center gap-1 font-medium rounded-lg px-4 py-2 text-sm bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2">
                  {t("backToLessons")}
                </a>
              )}
            </div>
          </div>
        </fieldset>
      </FadeIn>

      {phase === "running" && (
        <Card variant="flat" className="p-5">
          <SqlResultSkeleton />
        </Card>
      )}

      {phase === "error" && errorExplanation && (
        <StatusCard variant="error" title={errorExplanation.category} animated>
          <p className="text-sm text-ink">{errorExplanation.userMessage}</p>
          <p className="text-xs text-ink-muted font-mono">{errorExplanation.originalError}</p>
        </StatusCard>
      )}

      {phase === "success" && completed && (
        <StatusCard variant="success" title={t("correct")} animated>
          <p className="text-sm text-ink">{t("correctMessage")}</p>
        </StatusCard>
      )}

      {(phase === "partial" || phase === "success") && queryResult && queryResult.resultset && (
        <FadeIn delay={0.05}>
          <Card variant="flat" className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-ink">{t("result")}</h4>
              <span className="text-xs text-ink-muted">
                {queryResult.resultset.rows.length} {queryResult.resultset.rows.length === 1 ? t("rowSingular") : t("rowsPlural")}
                {queryResult.executionTimeMs !== undefined
                  ? ` · ${queryResult.executionTimeMs} ms`
                  : ""}
              </span>
            </div>
            <ResultsetTable
              columns={queryResult.resultset.columns}
              rows={queryResult.resultset.rows}
            />
          </Card>
        </FadeIn>
      )}

      {phase === "partial" && comparison && comparison.status !== "equal" && (
        <FadeIn delay={0.05}>
          <Card variant="outlined" className="p-5 border-warning/40">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-warning/10 text-warning text-xs font-bold" aria-hidden="true">
                ?
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-warning">
                  {t("partialMatch")}
                </p>
                <p className="text-sm text-ink">{comparison.details}</p>
              </div>
            </div>
          </Card>
        </FadeIn>
      )}

      {phase === "success" && hasHiddenFailures && hiddenTestResults && (
        <FadeIn delay={0.05}>
          <Card variant="outlined" className="p-5 border-error/40">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-error">
                {t("hiddenTestsFailed")}
              </p>
              <ul className="list-disc pl-5 text-sm text-ink space-y-1">
                {hiddenTestResults
                  .filter((r) => !r.passed)
                  .map((r) => (
                    <li key={r.testId}>{r.message}</li>
                  ))}
              </ul>
            </div>
          </Card>
        </FadeIn>
      )}

      {hint && (
        <FadeIn delay={0.05}>
          <Card variant="outlined" className="p-5 border-primary-200">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-50 text-primary-700 text-xs font-bold dark:bg-primary-900/30 dark:text-primary-300" aria-hidden="true">
                {hint.level}
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-ink">{t("hintLevel", { level: hint.level })}</p>
                <p className="text-sm text-ink">{hint.message}</p>
              </div>
            </div>
          </Card>
        </FadeIn>
      )}

      {liveSchema && liveSchema.length > 0 && (
        <FadeIn delay={0.05}>
          <Card variant="flat" className="p-5">
            <h4 className="text-sm font-semibold text-ink mb-3">{t("schemaExplorer")}</h4>
            <SchemaExplorer tables={liveSchema} db={db} />
          </Card>
        </FadeIn>
      )}
    </div>
  );
};