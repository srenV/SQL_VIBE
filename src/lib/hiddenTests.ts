/**
 * Hidden-Tests-Runner (Verdeckte Tests)
 *
 * Fuehrt zusaetzliche Pruefungsabfragen nach der Benutzerabfrage aus,
 * um Hardcoding zu verhindern und Randfaelle abzudecken.
 *
 * English: Hidden Tests Runner. Executes additional validation queries
 * after the user's query to prevent hardcoding and check edge cases.
 */

import type { HiddenTest, HiddenTestResult } from "@/types/playground";
import { compareResultsets } from "./resultsetComparison";
import { runQuery } from "./sqlEngine";
import type { Dialect } from "./dialect";

/** Prueft, ob die Zeilen zweier Ergebnismengen uebereinstimmen (ohne Beruecksichtigung der Reihenfolge). */
function resultsetsMatchRows(expected: { columns: { name: string }[]; rows: Record<string, unknown>[] }, actual: { columns: { name: string }[]; rows: Record<string, unknown>[] }): boolean {
  if (expected.rows.length !== actual.rows.length) return false;
  const expKey = (row: Record<string, unknown>) => JSON.stringify(Object.entries(row).sort(([a], [b]) => a.localeCompare(b)));
  const expSet = new Set(expected.rows.map(expKey));
  return actual.rows.every((row) => expSet.has(expKey(row)));
}

/** Prueft, ob die Spaltennamen zweier Ergebnismengen uebereinstimmen (ohne Beruecksichtigung von Gross-/Kleinschreibung). */
function resultsetsMatchColumns(expected: { columns: { name: string }[] }, actual: { columns: { name: string }[] }): boolean {
  if (expected.columns.length !== actual.columns.length) return false;
  const expNames = new Set(expected.columns.map((c) => c.name.toLowerCase()));
  return actual.columns.every((c) => expNames.has(c.name.toLowerCase()));
}

/** Prueft, ob alle erwarteten Zeilen im tatsaechlichen Ergebnis enthalten sind (Teilmenge). */
function resultsetsMatchContains(expected: { columns: { name: string }[]; rows: Record<string, unknown>[] }, actual: { columns: { name: string }[]; rows: Record<string, unknown>[] }): boolean {
  const actKey = (row: Record<string, unknown>) => JSON.stringify(Object.entries(row).sort(([a], [b]) => a.localeCompare(b)));
  const actSet = new Set(actual.rows.map(actKey));
  return expected.rows.every((row) => actSet.has(actKey(row)));
}

/** Vergleicht das eigentliche Ergebnis mit dem erwarteten Ergebnis anhand des compareMode. */
function matchesExpected(expected: HiddenTest, resultset: { columns: { name: string; type: string }[]; rows: Record<string, unknown>[] }): boolean {
  if (!expected.expectedResultset) {
    return resultset.rows.length > 0;
  }
  const mode = expected.compareMode ?? "exact";
  switch (mode) {
    case "exact":
      return compareResultsets(expected.expectedResultset, resultset).status === "equal";
    case "rows":
      return resultsetsMatchRows(expected.expectedResultset, resultset);
    case "columns":
      return resultsetsMatchColumns(expected.expectedResultset, resultset);
    case "count":
      return expected.expectedResultset.rows.length === resultset.rows.length;
    case "contains":
      return resultsetsMatchContains(expected.expectedResultset, resultset);
    default:
      return resultset.rows.length > 0;
  }
}

/**
 * Fuehrt alle verdeckten Tests fuer eine Uebung aus und gibt die Ergebnisse zurueck.
 * @param db - Die sql.js-Datenbankinstanz.
 * @param hiddenTests - Array der auszufuehrenden verdeckten Tests.
 * @returns Array von HiddenTestResult mit bestanden/nicht bestanden Status.
 */
export function runHiddenTests(
  db: import("sql.js").Database,
  hiddenTests: HiddenTest[],
  dialect: Dialect = "mysql"
): HiddenTestResult[] {
  return hiddenTests.map((test) => {
    const result = runQuery(db, test.query, dialect);
    if (!result.success) {
      return {
        testId: test.id,
        passed: false,
        message: `${test.failureMessage} (Fehler bei Hidden-Test: ${result.error})`,
      };
    }

    if (!result.resultset) {
      return {
        testId: test.id,
        passed: false,
        message: test.failureMessage,
      };
    }

    if (!matchesExpected(test, result.resultset)) {
      return {
        testId: test.id,
        passed: false,
        message: test.failureMessage,
      };
    }

    return { testId: test.id, passed: true };
  });
}
