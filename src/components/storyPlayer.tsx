"use client";

/**
 * StoryPlayer – Narrativer Spielmodus (SQL Agent).
 *
 * Zeigt ein Szenario mit mehreren Kapiteln an. Jedes Kapitel hat:
 *   1. Einen narrativen Einfuehrungstext
 *   2. Eine SQL-Herausforderung (wie im normalen Playground)
 *   3. Einen Abschluss-Erzaehlungstext nach erfolgreicher Loesung
 *
 * Kapitel werden nacheinander freigeschaltet. Der Fortschritt wird
 * im Local Storage gespeichert.
 */

import React from "react";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { SqlEditor } from "@/components/sqlEditor";
import { ResultsetTable } from "@/components/resultsetTable";
import { SchemaExplorer } from "@/components/schemaExplorer";
import { FadeIn } from "@/components/animations";
import { SuccessCelebration } from "@/components/successCelebration";
import { usePlayground } from "@/hooks/usePlayground";
import { useProgress } from "@/hooks/useProgress";
import { createDatabase, runQuery } from "@/lib/sqlEngine";
import { introspectSchema, mergeSchemaWithFKs } from "@/lib/schemaExplorer";
import type { PlaygroundExercise, PlaygroundStoryChapter, PlaygroundStoryData, SchemaTable } from "@/types/playground";

interface StoryPlayerProps {
  exercise: PlaygroundExercise;
  onComplete?: (attemptCount: number) => void;
}

export const StoryPlayer: React.FC<StoryPlayerProps> = ({ exercise, onComplete }) => {
  const story = exercise.story;
  if (!story) return null;

  const { getStoryProgress, markStoryChapterSolved, setStoryCurrentChapter } = useProgress();

  // Load persisted progress on mount
  const persistedProgress = getStoryProgress(exercise.id);
  const hasPersistedProgress = !!persistedProgress && persistedProgress.solvedChapters.length > 0;

  const [currentChapter, setCurrentChapter] = React.useState(
    persistedProgress?.currentChapter ?? 0,
  );
  const [solvedChapters, setSolvedChapters] = React.useState<Set<number>>(
    () => new Set(persistedProgress?.solvedChapters ?? []),
  );
  const [showIntro, setShowIntro] = React.useState(!hasPersistedProgress);
  const [showOutro, setShowOutro] = React.useState(false);
  const [chapterCompletionNarratives, setChapterCompletionNarratives] = React.useState<Record<number, string>>(
    persistedProgress?.chapterCompletionNarratives ?? {},
  );

  const chapter: PlaygroundStoryChapter | undefined = story.chapters[currentChapter];
  const isChapterUnlocked = currentChapter <= solvedChapters.size;

  const chapterExercise: PlaygroundExercise = React.useMemo(() => {
    if (!chapter) return exercise;
    return {
      ...exercise,
      title: chapter.title,
      description: chapter.narrative,
      task: chapter.narrative,
      solutionQuery: chapter.referenceQuery,
      hiddenTests: chapter.hiddenTests,
      hints: chapter.hints,
      prefillQuery: undefined,
    };
  }, [exercise, chapter]);

  const playground = usePlayground(chapterExercise);
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
  } = playground;

  const prevCompletedRef = React.useRef(false);
  React.useEffect(() => {
    if (completed && !prevCompletedRef.current) {
      const newSolved = new Set(solvedChapters);
      newSolved.add(currentChapter);
      setSolvedChapters(newSolved);
      if (chapter) {
        setChapterCompletionNarratives((prev) => ({
          ...prev,
          [currentChapter]: chapter.completionNarrative,
        }));
        // Persist chapter progress to localStorage
        markStoryChapterSolved(exercise.id, currentChapter, chapter.completionNarrative);
      }
      const totalAttempts = attemptCount;
      const allSolved = newSolved.size === story.chapters.length;
      if (allSolved && onComplete) {
        onComplete(totalAttempts);
      }
    }
    prevCompletedRef.current = completed;
  }, [completed, solvedChapters, currentChapter, chapter, story.chapters.length, onComplete, attemptCount, markStoryChapterSolved, exercise.id]);

  const allChaptersSolved = solvedChapters.size === story.chapters.length;
  const canAdvance = completed && currentChapter < story.chapters.length - 1;
  const isLastChapter = currentChapter === story.chapters.length - 1;

  if (showIntro) {
    return (
      <div className="space-y-6">
        <FadeIn delay={0}>
          <Card variant="outlined" className="p-6 border-primary-200 bg-gradient-to-br from-primary-50/50 to-accent-50/30">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <h2 className="text-xl font-bold text-ink">{story.scenarioTitle}</h2>
              </div>
              <div className="text-sm text-ink whitespace-pre-line leading-relaxed">
                {story.intro}
              </div>
              <div className="flex items-center gap-3 text-xs text-ink-muted">
                <span>{story.chapters.length} Kapitel</span>
                <span>·</span>
                <span>Schwierigkeit: {exercise.difficulty === "easy" ? "Anfaenger" : exercise.difficulty === "medium" ? "Fortgeschritten" : "Experte"}</span>
              </div>
              <div className="pt-2">
                <Button onClick={() => setShowIntro(false)}>
                  Ermittlungen beginnen
                </Button>
              </div>
            </div>
          </Card>
        </FadeIn>
      </div>
    );
  }

  if (showOutro && allChaptersSolved) {
    return (
      <div className="space-y-6">
        <FadeIn delay={0}>
          <Card variant="outlined" className="p-6 border-success/40 bg-linear-to-br from-success/5 to-accent-50/30">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
                </svg>
                <h2 className="text-xl font-bold text-success">Fall geloest!</h2>
              </div>
              <div className="text-sm text-ink whitespace-pre-line leading-relaxed">
                {story.outro}
              </div>
              <div className="flex items-center gap-3 text-sm text-ink-muted">
                <span>Alle {story.chapters.length} Kapitel geloest</span>
                <span>·</span>
                <span>{story.chapters.reduce((sum, ch) => sum + ch.points, 0)} Punkte moeglich</span>
              </div>
            </div>
          </Card>
        </FadeIn>
      </div>
    );
  }

  if (!chapter) return null;

  return (
    <div className="space-y-6">
      <FadeIn delay={0}>
        <Card variant="flat" className="p-4 bg-linear-to-r from-primary-50/50 to-accent-50/30 border border-primary-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-primary-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide">
                Kapitel {chapter.chapterNumber} von {story.chapters.length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {story.chapters.map((_, i) => (
                <span
                  key={i}
                  className={`inline-block h-2 w-2 rounded-full ${
                    solvedChapters.has(i)
                      ? "bg-success"
                      : i === currentChapter
                      ? "bg-primary-500"
                      : "bg-surface-dim"
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </FadeIn>

      <FadeIn delay={0.05}>
        <Card variant="outlined" className="p-5 border-primary-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-2">{chapter.title}</h3>
          <p className="text-sm text-ink whitespace-pre-line leading-relaxed">{chapter.narrative}</p>
        </Card>
      </FadeIn>

      <FadeIn delay={0.1}>
        <fieldset className="bg-surface rounded-xl border border-surface-dim dark:border-dark-dim p-5 min-w-0">
          <legend className="px-2 -ml-1 text-sm font-medium text-ink">Deine SQL-Abfrage</legend>
          <SqlEditor
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            error={phase === "error"}
            placeholder="Schreibe hier deine SQL-Abfrage zur Ermittlung ..."
            onSubmit={runUserQuery}
          />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              onClick={runUserQuery}
              isLoading={phase === "running"}
              disabled={!userQuery.trim() || phase === "running"}
            >
              Abfrage ausfuehren
            </Button>
            <Button variant="ghost" size="sm" onClick={resetSession}>
              Zuruecksetzen
            </Button>
            {hint && (
              <Button
                variant="secondary"
                size="sm"
                onClick={requestStrongerHint}
                disabled={hint.level >= 3}
              >
                Staerkeren Hinweis anzeigen
              </Button>
            )}
          </div>
        </fieldset>
      </FadeIn>

      {phase === "error" && errorExplanation && (
        <FadeIn delay={0.05}>
          <Card variant="outlined" className="p-5 border-error/40">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-error/10 text-error text-xs font-bold">
                !
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-error">{errorExplanation.category}</p>
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
                {queryResult.resultset.rows.length} Zeile{queryResult.resultset.rows.length === 1 ? "" : "n"}
                {queryResult.executionTimeMs !== undefined ? ` · ${queryResult.executionTimeMs} ms` : ""}
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
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-warning/10 text-warning text-xs font-bold">
                ?
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-warning">Ergebnis passt nicht ganz</p>
                <p className="text-sm text-ink">{comparison.details}</p>
              </div>
            </div>
          </Card>
        </FadeIn>
      )}

      {completed && chapterCompletionNarratives[currentChapter] && (
        <FadeIn delay={0.05}>
          <Card variant="outlined" className="p-5 border-success/40 bg-success/5">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <p className="text-sm font-semibold text-success">Hinweis gefunden!</p>
              </div>
              <p className="text-sm text-ink whitespace-pre-line leading-relaxed">
                {chapterCompletionNarratives[currentChapter]}
              </p>
            </div>
          </Card>
        </FadeIn>
      )}

      {canAdvance && (
        <FadeIn delay={0.1}>
          <div className="flex justify-end">
            <Button
              onClick={() => {
                resetSession();
                const nextChapter = currentChapter + 1;
                setCurrentChapter(nextChapter);
                setStoryCurrentChapter(exercise.id, nextChapter);
                prevCompletedRef.current = false;
              }}
            >
              Naechstes Kapitel &rarr;
            </Button>
          </div>
        </FadeIn>
      )}

      {isLastChapter && completed && (
        <FadeIn delay={0.1}>
          <div className="flex justify-end">
            <Button
              variant="accent"
              onClick={() => setShowOutro(true)}
            >
              Fall abschliessen
            </Button>
          </div>
        </FadeIn>
      )}

      {hint && (
        <FadeIn delay={0.05}>
          <Card variant="outlined" className="p-5 border-primary-200">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary-50 text-primary-700 text-xs font-bold">
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