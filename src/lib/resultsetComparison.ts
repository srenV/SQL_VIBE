/**
 * Ergebnismengen-Vergleichs-Engine (Resultset Comparison Engine)
 *
 * Vergleicht die Abfrageergebnisse des Benutzers mit der erwarteten
 * Ergebnismenge anhand von Spaltennamen, Typen, Zeilenzahl und Zellenwerten.
 *
 * English: Compares a user's query result against the expected resultset
 * on column names, types, row count, and row values.
 */

import type { ResultsetComparison, SqlResultset, SqlRow } from "@/types/playground";

/** Normalisiert einen Zellwert fuer den Vergleich: null/undefined → "NULL", numbers → String, boolean → 0/1. */
function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) return "NULL";
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "1" : "0";
  if (value instanceof Date) return value.toISOString();
  return String(value);
}

/** Vergleicht zwei Zeilen anhand der angegebenen Spaltennamen. */
function rowsEqual(
  expectedRow: SqlRow,
  actualRow: SqlRow,
  expectedCols: string[],
  actualCols: string[]
): boolean {
  for (let i = 0; i < expectedCols.length; i++) {
    if (normalizeValue(expectedRow[expectedCols[i]]) !== normalizeValue(actualRow[actualCols[i]])) {
      return false;
    }
  }
  return true;
}

/**
 * Vergleicht zwei Ergebnismengen und liefert einen detaillierten Vergleichsstatus.
 * Prueft nacheinander: Leer-Status, Spaltenanzahl, Spaltennamen, Spaltentypen,
 * Zeilenzahl und Zellenwerte.
 * @param expected - Die erwartete Ergebnismenge.
 * @param actual - Die tatsaechliche Ergebnismenge des Benutzers.
 * @returns ResultsetComparison mit Status und Details zur Abweichung.
 */
export function compareResultsets(expected: SqlResultset, actual: SqlResultset): ResultsetComparison {
  // Leer-Status pruefen
  if (expected.rows.length === 0 && actual.rows.length === 0) {
    if (expected.columns.length === 0 && actual.columns.length === 0) {
      return { status: "equal", details: "Beide Ergebnismengen sind leer." };
    }
  }

  // Spaltenanzahl pruefen
  if (expected.columns.length !== actual.columns.length) {
    return {
      status: "column_mismatch",
      details: `Die Anzahl der Spalten stimmt nicht überein. Erwartet: ${expected.columns.length}, erhalten: ${actual.columns.length}.`,
      columnDiff: { expected: expected.columns, actual: actual.columns },
    };
  }

  // Spaltennamen (ohne Gross-/Kleinschreibung) und Reihenfolge pruefen
  for (let i = 0; i < expected.columns.length; i++) {
    const expCol = expected.columns[i];
    const actCol = actual.columns[i];
    if (expCol.name.toLowerCase() !== actCol.name.toLowerCase()) {
      return {
        status: "column_mismatch",
        details: `Spaltenname stimmt nicht überein (Position ${i + 1}). Erwartet: "${expCol.name}", erhalten: "${actCol.name}".`,
        columnDiff: { expected: expected.columns, actual: actual.columns },
      };
    }
    if (expCol.type && actCol.type && expCol.type.toUpperCase() !== actCol.type.toUpperCase() && expCol.type.toUpperCase() !== "UNKNOWN" && actCol.type.toUpperCase() !== "UNKNOWN") {
      return {
        status: "type_mismatch",
        details: `Spaltentyp stimmt nicht überein (Spalte "${expCol.name}"). Erwartet: ${expCol.type}, erhalten: ${actCol.type}.`,
        columnDiff: { expected: expected.columns, actual: actual.columns },
      };
    }
  }

  // Zeilenzahl pruefen
  if (expected.rows.length !== actual.rows.length) {
    return {
      status: "row_count_mismatch",
      details: `Die Anzahl der Zeilen stimmt nicht überein. Erwartet: ${expected.rows.length}, erhalten: ${actual.rows.length}.`,
      rowDiff: { expectedRowCount: expected.rows.length, actualRowCount: actual.rows.length },
    };
  }

  // Zeilendaten vergleichen
  const expectedColNames = expected.columns.map((c) => c.name);
  const actualColNames = actual.columns.map((c) => c.name);
  for (let i = 0; i < expected.rows.length; i++) {
    if (!rowsEqual(expected.rows[i], actual.rows[i], expectedColNames, actualColNames)) {
      return {
        status: "row_data_mismatch",
        details: `Zeile ${i + 1} stimmt nicht mit der erwarteten Ergebnismenge überein.`,
        firstMismatchRow: i,
      };
    }
  }

  return {
    status: "equal",
    details: "Die Ergebnismengen sind identisch.",
  };
}
