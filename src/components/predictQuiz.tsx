/**
 * PredictQuiz – Interaktive Multiple-Choice-Komponente fuer Vorhersage-Uebungen.
 * Zeigt eine Frage mit Antwortoptionen an, wertet die Auswahl aus und
 * verfolgt den Lernfortschritt.
 */
"use client";

import React from "react";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { FadeIn } from "@/components/animations";
import { SuccessCelebration } from "@/components/successCelebration";
import { SchemaExplorer } from "@/components/schemaExplorer";
import { useProgress } from "@/hooks/useProgress";
import type { PlaygroundExercise, QuizOption } from "@/types/playground";
import { createDatabase, runQuery } from "@/lib/sqlEngine";
import { introspectSchema } from "@/lib/schemaExplorer";

/** Props fuer die PredictQuiz-Komponente. */
interface PredictQuizProps {
  exercise: PlaygroundExercise;
  /** Callback nach erfolgreicher Loesung. */
  onComplete?: (attemptCount: number) => void;
}

export const PredictQuiz: React.FC<PredictQuizProps> = ({ exercise, onComplete }) => {
  const [selectedOption, setSelectedOption] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState(false);
  const [attemptCount, setAttemptCount] = React.useState(0);
  const [liveSchema, setLiveSchema] = React.useState(exercise.schemaTables || []);
  const [showCelebration, setShowCelebration] = React.useState(false);
  const [db, setDb] = React.useState<import("sql.js").Database | null>(null);

  const prevCompletedRef = React.useRef(false);
  const dbRef = React.useRef<import("sql.js").Database | null>(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const db = await createDatabase(exercise.setupSql);
        dbRef.current = db;
        setDb(db);
        const schema = introspectSchema(db);
        if (mounted) {
          setLiveSchema(schema.length > 0 ? schema : (exercise.schemaTables || []));
        }
      } catch {
        // Fallback to static schema
      }
    })();
    return () => { mounted = false; };
  }, [exercise.setupSql, exercise.schemaTables]);

  React.useEffect(() => {
    if (isCorrect && !prevCompletedRef.current && onComplete) {
      onComplete(attemptCount);
    }
    prevCompletedRef.current = isCorrect;
  }, [isCorrect, onComplete, attemptCount]);

  const options: QuizOption[] = exercise.options || [];

  const handleSubmit = () => {
    if (!selectedOption) return;
    const nextAttempt = attemptCount + 1;
    setAttemptCount(nextAttempt);
    setSubmitted(true);

    const chosen = options.find((o) => o.id === selectedOption);
    const correct = chosen?.isCorrect === true;
    setIsCorrect(correct);
    if (correct) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const handleReset = () => {
    setSelectedOption(null);
    setSubmitted(false);
    setIsCorrect(false);
  };

  return (
    <div className="space-y-6">
      <FadeIn delay={0}>
        <Card variant="outlined" className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{exercise.title}</h3>
              {exercise.question && (
                <div className="mt-2 text-sm text-ink whitespace-pre-line">{exercise.question}</div>
              )}
              <p className="text-sm text-ink-muted">{exercise.task}</p>
            </div>
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
        </Card>
      </FadeIn>

      {exercise.description && exercise.description !== exercise.task && (
        <FadeIn delay={0.05}>
          <Card variant="flat" className="p-5">
            <p className="text-sm text-ink whitespace-pre-line">{exercise.description}</p>
          </Card>
        </FadeIn>
      )}

      <FadeIn delay={0.1}>
        <Card variant="flat" className="p-5">
          <div className="space-y-3">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isChosen = submitted && isSelected;
              const showCorrect = submitted && opt.isCorrect;
              const showWrong = submitted && isChosen && !opt.isCorrect;

              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={submitted}
                  onClick={() => !submitted && setSelectedOption(opt.id)}
                  className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                    showCorrect
                      ? "border-success/60 bg-success/10 text-success font-medium"
                      : showWrong
                      ? "border-error/60 bg-error/10 text-error"
                      : isSelected && !submitted
                      ? "border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-600"
                      : "border-surface-dim hover:border-primary-300 hover:bg-primary-50/50 text-ink dark:border-dark-dim dark:hover:border-primary-600 dark:hover:bg-dark-dim"
                  } disabled:cursor-not-allowed`}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            {!submitted && (
              <Button
                onClick={handleSubmit}
                disabled={!selectedOption}
              >
                Antwort pruefen
              </Button>
            )}
            {submitted && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Nochmal versuchen
              </Button>
            )}
          </div>
        </Card>
      </FadeIn>

      {submitted && isCorrect && (
        <FadeIn delay={0.05}>
          <Card variant="outlined" className="p-5 border-success/40">
            <SuccessCelebration
              message="Richtig!"
              submessage="Deine Antwort ist korrekt."
              show={showCelebration}
            />
          </Card>
        </FadeIn>
      )}

      {submitted && !isCorrect && (
        <FadeIn delay={0.05}>
          <Card variant="outlined" className="p-5 border-error/40">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-error/10 text-error text-xs font-bold">
                ✗
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-error">Leider falsch</p>
                <p className="text-sm text-ink">
                  Versuche es noch einmal. Die richtige Antwort ist hervorgehoben.
                </p>
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