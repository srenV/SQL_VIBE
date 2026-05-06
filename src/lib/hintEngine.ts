/**
 * Hinweis-Engine (Hint Engine)
 *
 * Liefert kontextsensitive Hinweise basierend auf Fehlermustern,
 * Ergebnismengen-Abweichungen und wiederholten Fehlversuchen.
 *
 * English: Hint Engine. Provides context-sensitive hints based on
 * error patterns, resultset mismatches, and repeated failures.
 */

import type { ExerciseHint, HintResult, HintTrigger, ResultsetComparison, SqlQueryResult } from "@/types/playground";

/**
 * Waehlt den passendsten Hinweis fuer den aktuellen Kontext aus.
 * @param hints - Verfuegbare Hinweise, sortiert nach Level aufsteigend.
 * @param queryResult - Das Ergebnis der letzten Benutzerabfrage.
 * @param comparison - Das Vergleichsergebnis mit der Referenz-Ergebnismenge.
 * @param attemptCount - Anzahl der bisherigen Versuche.
 * @returns Den passendsten Hinweis oder undefined, falls keiner passt.
 */
export function selectHint(
  hints: ExerciseHint[],
  queryResult: SqlQueryResult,
  comparison: ResultsetComparison | undefined,
  attemptCount: number
): HintResult | undefined {
  // Sortiert nach Level aufsteigend, bevorzugt niedrigere Hinweise
  const sorted = [...hints].sort((a, b) => a.level - b.level);

  for (const hint of sorted) {
    if (matchesTrigger(hint.trigger, queryResult, comparison, attemptCount)) {
      return { level: hint.level, message: hint.message };
    }
  }

  return undefined;
}

/** Prueft, ob ein Hinweis-Trigger zum aktuellen Kontext passt. */
function matchesTrigger(
  trigger: HintTrigger,
  queryResult: SqlQueryResult,
  comparison: ResultsetComparison | undefined,
  attemptCount: number
): boolean {
  switch (trigger.type) {
    case "syntax_error": {
      if (!queryResult.success) {
        if (trigger.pattern) {
          return queryResult.error?.toLowerCase().includes(trigger.pattern.toLowerCase()) ?? false;
        }
        return true;
      }
      return false;
    }
    case "wrong_result": {
      if (!queryResult.success) return false;
      if (!comparison) return false;
      if (trigger.comparisonStatus) {
        return comparison.status === trigger.comparisonStatus;
      }
      return comparison.status !== "equal";
    }
    case "repeated_failures": {
      return attemptCount >= trigger.threshold;
    }
    case "always": {
      return true;
    }
  }
}

/**
 * Liefert einen staerkeren Hinweis (hoeheres Level) als den aktuell angezeigten.
 * Bevorzugt den naechsthoehere Level, der zum Kontext passt.
 * @param hints - Verfuegbare Hinweise.
 * @param currentLevel - Das aktuell angezeigte Hinweis-Level (1-3).
 * @returns Naechst staerkerer Hinweis oder undefined.
 */
export function getStrongerHint(
  hints: ExerciseHint[],
  currentLevel: 1 | 2 | 3,
  queryResult: SqlQueryResult,
  comparison: ResultsetComparison | undefined,
  attemptCount: number
): HintResult | undefined {
  // Bevorzugt den naechst hoeheren Level, falls dieser zum Kontext passt
  const higher = hints
    .filter((h) => h.level > currentLevel)
    .sort((a, b) => a.level - b.level);

  for (const hint of higher) {
    if (matchesTrigger(hint.trigger, queryResult, comparison, attemptCount)) {
      return { level: hint.level, message: hint.message };
    }
  }
  return undefined;
}
