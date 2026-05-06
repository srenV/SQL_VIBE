/**
 * Unit-Tests fuer den PlaygroundAdapter.
 *
 * Testet die Umwandlung von Katalog-Exercise + Dataset in
 * PlaygroundExercise inkl. Hints, HiddenTests und Schema-Tabellen.
 */

import { describe, it, expect } from "vitest";
import { adaptExercise } from "./playgroundAdapter";
import type { Exercise, Dataset } from "@/types/exercise";

const minimalDataset: Dataset = {
  id: "test_ds",
  name: "Test-Datensatz",
  description: "Beschreibung",
  tables: [
    {
      name: "kunden",
      columns: [
        { name: "id", type: "INTEGER", isPrimaryKey: true },
        { name: "name", type: "TEXT" },
        { name: "email", type: "TEXT", nullable: true },
        { name: "stadt", type: "TEXT", references: "staedte.name" },
      ],
    },
  ],
  sql: "CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, email TEXT, stadt TEXT);",
};

const writeExercise: Exercise = {
  id: "sel_0001",
  title: "Alle Kunden abfragen",
  description: "Frage alle Spalten der Tabelle kunden ab.",
  type: "write",
  difficulty: "beginner",
  category: "SELECT",
  datasetId: "test_ds",
  referenceQuery: "SELECT * FROM kunden;",
  points: 10,
  hints: [
    { level: 1, text: "Verwende SELECT *", trigger: { type: "wrong_result" } },
    { level: 2, text: "Die Tabelle heisst kunden", trigger: { type: "syntax_error" } },
    { level: 3, text: "SELECT * FROM kunden;", trigger: { type: "always" } },
  ],
  hiddenTests: [
    { name: "Zeilenanzahl", query: "SELECT COUNT(*) FROM kunden;", compareMode: "rows" },
    { name: "Spaltennamen", query: "SELECT * FROM kunden LIMIT 1;", compareMode: "columns" },
  ],
  exercises: [],
};

const debugExercise: Exercise = {
  id: "debug_0001",
  title: "Fehlerhafte SELECT-Abfrage",
  description: "Finde den Fehler in der Abfrage.",
  type: "debug",
  difficulty: "junior",
  category: "Debugging",
  datasetId: "test_ds",
  brokenQuery: "SELCET * FROM kunden;",
  referenceQuery: "SELECT * FROM kunden;",
  points: 15,
  hints: [],
  hiddenTests: [],
  exercises: [],
};

const predictExercise: Exercise = {
  id: "predict_0001",
  title: "Ergebnis vorhersagen",
  description: "Schaue dir die Abfrage an und waehle das richtige Ergebnis.",
  type: "predict",
  difficulty: "beginner",
  category: "Ergebnis-Vorhersage",
  datasetId: "test_ds",
  referenceQuery: "SELECT COUNT(*) FROM kunden;",
  points: 5,
  question: "Wie viele Zeilen liefert diese Abfrage?",
  options: [
    { id: "opt1", text: "0 Zeilen", isCorrect: false },
    { id: "opt2", text: "1 Zeile", isCorrect: true },
    { id: "opt3", text: "Alle Zeilen", isCorrect: false },
  ],
  hints: [],
  hiddenTests: [],
  exercises: [],
};

describe("adaptExercise", () => {
  it("konvertiert eine Write-Uebung korrekt", () => {
    const result = adaptExercise(writeExercise, minimalDataset);
    expect(result.id).toBe("sel_0001");
    expect(result.title).toBe("Alle Kunden abfragen");
    expect(result.exerciseType).toBe("write");
    expect(result.setupSql).toBe(minimalDataset.sql);
    expect(result.solutionQuery).toBe("SELECT * FROM kunden;");
    expect(result.prefillQuery).toBeUndefined();
  });

  it("konvertiert eine Debug-Uebung mit prefillQuery", () => {
    const result = adaptExercise(debugExercise, minimalDataset);
    expect(result.exerciseType).toBe("debug");
    expect(result.prefillQuery).toBe("SELCET * FROM kunden;");
    expect(result.solutionQuery).toBe("SELECT * FROM kunden;");
  });

  it("konvertiert eine Predict-Uebung mit Optionen", () => {
    const result = adaptExercise(predictExercise, minimalDataset);
    expect(result.exerciseType).toBe("predict");
    expect(result.question).toBe("Wie viele Zeilen liefert diese Abfrage?");
    expect(result.options).toHaveLength(3);
    expect(result.options![0].text).toBe("0 Zeilen");
    expect(result.options![1].isCorrect).toBe(true);
  });

  it("konvertiert Hints mit korrekten Leveln und Triggern", () => {
    const result = adaptExercise(writeExercise, minimalDataset);
    expect(result.hints).toHaveLength(3);
    expect(result.hints[0].level).toBe(1);
    expect(result.hints[0].trigger).toEqual({ type: "wrong_result" });
    expect(result.hints[2].message).toBe("SELECT * FROM kunden;");
    expect(result.hints[2].trigger).toEqual({ type: "always" });
  });

  it("konvertiert HiddenTests mit IDs und Namen", () => {
    const result = adaptExercise(writeExercise, minimalDataset);
    expect(result.hiddenTests).toHaveLength(2);
    expect(result.hiddenTests[0].id).toBe("ht-0");
    expect(result.hiddenTests[0].name).toBe("Zeilenanzahl");
    expect(result.hiddenTests[0].compareMode).toBe("rows");
  });

  it("erstellt Schema-Tabellen mit Spalten und Fremdschluesseln", () => {
    const result = adaptExercise(writeExercise, minimalDataset);
    expect(result.schemaTables).toHaveLength(1);
    const table = result.schemaTables[0];
    expect(table.name).toBe("kunden");
    expect(table.columns).toHaveLength(4);
    expect(table.columns[0].name).toBe("id");
    expect(table.columns[0].isPrimaryKey).toBe(true);
    expect(table.columns[3].name).toBe("stadt");
    expect(table.foreignKeys).toHaveLength(1);
    expect(table.foreignKeys![0].column).toBe("stadt");
    expect(table.foreignKeys![0].referencedTable).toBe("staedte");
    expect(table.foreignKeys![0].referencedColumn).toBe("name");
  });

  it("mappt Schwierigkeitsgrade korrekt", () => {
    const beginnerEx = { ...writeExercise, difficulty: "beginner" as const };
    const juniorEx = { ...writeExercise, difficulty: "junior" as const };
    const intermediateEx = { ...writeExercise, difficulty: "intermediate" as const };
    const advancedEx = { ...writeExercise, difficulty: "advanced" as const };
    const interviewEx = { ...writeExercise, difficulty: "interview" as const };

    expect(adaptExercise(beginnerEx, minimalDataset).difficulty).toBe("easy");
    expect(adaptExercise(juniorEx, minimalDataset).difficulty).toBe("easy");
    expect(adaptExercise(intermediateEx, minimalDataset).difficulty).toBe("medium");
    expect(adaptExercise(advancedEx, minimalDataset).difficulty).toBe("hard");
    expect(adaptExercise(interviewEx, minimalDataset).difficulty).toBe("hard");
  });

  it("verwendet Default-Trigger fuer Hints ohne expliziten Trigger", () => {
    const exNoTrigger: Exercise = {
      ...writeExercise,
      hints: [{ level: 1, text: "Tipp" }],
    };
    const result = adaptExercise(exNoTrigger, minimalDataset);
    expect(result.hints[0].trigger).toEqual({ type: "always" });
  });

  it("begrenzt Hint-Level auf den Bereich 1-3", () => {
    const exHighLevel: Exercise = {
      ...writeExercise,
      hints: [{ level: 5, text: "Zu hoch" }],
    };
    const result = adaptExercise(exHighLevel, minimalDataset);
    expect(result.hints[0].level).toBe(3);
  });
});