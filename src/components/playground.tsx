/**
 * Playground – Hauptkomponente fuer die SQL-Uebungsumgebung.
 * Orchestriert SQL-Editor, Schema-Explorer, Ergebnistabelle,
 * Hinweise und verdeckte Tests in einer einheitlichen Oberflaeche.
 */
"use client";

import React from "react";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { SqlEditor } from "@/components/sqlEditor";
import { ResultsetTable } from "@/components/resultsetTable";
import { SchemaExplorer } from "@/components/schemaExplorer";
import { FadeIn } from "@/components/animations";
import { SuccessCelebration } from "@/components/successCelebration";
import { SqlResultSkeleton } from "@/components/skeleton";
import { usePlayground } from "@/hooks/usePlayground";
import type { PlaygroundExercise } from "@/types/playground";

interface PlaygroundProps {
  exercise: PlaygroundExercise;
  onComplete?: (attemptCount: number) => void;
}

export const Playground: React.FC<PlaygroundProps> = ({ exercise, onComplete }) => {
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
  const [showCelebration, setShowCelebration] = React.useState(false);

  React.useEffect(() => {
    if (completed && !prevCompletedRef.current && onComplete) {
      onComplete(currentAttemptRef.current);
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
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
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  exercise.difficulty === "easy"
                    ? "bg-success/10 text-success"
                    : exercise.difficulty === "medium"
                    ? "bg-warning/10 text-warning"
                    : "bg-error/10 text-error"
                }`}
              >
                {exercise.difficulty === "easy"
                  ? "Leicht"
                  : exercise.difficulty === "medium"
                  ? "Mittel"
                  : "Schwer"}
              </span>
            </div>
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Card variant="flat" className="p-5">
          <SqlEditor
            label="Deine SQL-Abfrage"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            error={phase === "error"}
            placeholder="Schreibe hier deine SQL-Abfrage ..."
            onSubmit={runUserQuery}
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              onClick={runUserQuery}
              isLoading={phase === "running"}
              disabled={!userQuery.trim() || phase === "running"}
            >
              Abfrage ausführen
            </Button>
            <Button variant="ghost" size="sm" onClick={resetSession}>
              Zurücksetzen
            </Button>
            {hint && (
              <Button
                variant="secondary"
                size="sm"
                onClick={requestStrongerHint}
                disabled={hint.level >= 3}
              >
                Stärkeren Hinweis anzeigen
              </Button>
            )}
          </div>
        </Card>
      </FadeIn>

      {phase === "running" && (
        <Card variant="flat" className="p-5">
          <SqlResultSkeleton />
        </Card>
      )}

      {phase === "error" && errorExplanation && (
        <FadeIn delay={0.05}>
          <Card variant="outlined" className="p-5 border-error/40">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-error/10 text-error text-xs font-bold" aria-hidden="true">
                !
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-error">
                  {errorExplanation.category}
                </p>
                <p className="text-sm text-ink">{errorExplanation.userMessage}</p>
                <p className="text-xs text-ink-muted font-mono">{errorExplanation.originalError}</p>
              </div>
            </div>
          </Card>
        </FadeIn>
      )}

      {(phase === "partial" || phase === "success") && queryResult && queryResult.resultset && (
        <FadeIn delay={0.05}>
          <Card variant="flat" className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-ink">Ergebnis</h4>
              <span className="text-xs text-ink-muted">
                {queryResult.resultset.rows.length} Zeile
                {queryResult.resultset.rows.length === 1 ? "" : "n"}
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
                  Ergebnis passt nicht ganz
                </p>
                <p className="text-sm text-ink">{comparison.details}</p>
              </div>
            </div>
          </Card>
        </FadeIn>
      )}

      {phase === "success" && completed && (
        <FadeIn delay={0.05}>
          <Card variant="outlined" className="p-5 border-success/40">
            <SuccessCelebration
              message="Richtig!"
              submessage={
                hasHiddenFailures === false && hiddenTestResults && hiddenTestResults.length > 0
                  ? "Deine Abfrage liefert das erwartete Ergebnis. Alle versteckten Tests bestanden."
                  : "Deine Abfrage liefert das erwartete Ergebnis."
              }
              show={showCelebration}
            />
          </Card>
        </FadeIn>
      )}

      {phase === "success" && hasHiddenFailures && hiddenTestResults && (
        <FadeIn delay={0.05}>
          <Card variant="outlined" className="p-5 border-error/40">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-error">
                Versteckte Tests fehlgeschlagen
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
                <p className="text-sm font-semibold text-ink">Hinweis (Stufe {hint.level})</p>
                <p className="text-sm text-ink">{hint.message}</p>
              </div>
            </div>
          </Card>
        </FadeIn>
      )}

      {attemptCount > 0 && (
        <FadeIn delay={0.05}>
          <Card variant="flat" className="p-5">
            <p className="text-xs text-ink-muted">Versuch {attemptCount}</p>
          </Card>
        </FadeIn>
      )}

      {liveSchema && liveSchema.length > 0 && (
        <FadeIn delay={0.05}>
          <Card variant="flat" className="p-5">
            <h4 className="text-sm font-semibold text-ink mb-3">Schema-Explorer</h4>
            <SchemaExplorer tables={liveSchema} db={db} />
          </Card>
        </FadeIn>
      )}
    </div>
  );
};