/**
 * Unit-Tests fuer die Hinweis-Engine (Hint Engine).
 *
 * English: Unit tests for Hint Engine.
 */

import { getStrongerHint, selectHint } from "./hintEngine";
import type { ExerciseHint, SqlQueryResult } from "@/types/playground";

describe("selectHint", () => {
  const syntaxHint: ExerciseHint = {
    level: 1,
    trigger: { type: "syntax_error" },
    message: "Prüfe die Syntax.",
  };
  const wrongResultHint: ExerciseHint = {
    level: 1,
    trigger: { type: "wrong_result" },
    message: "Das Ergebnis ist falsch.",
  };
  const repeatedHint: ExerciseHint = {
    level: 2,
    trigger: { type: "repeated_failures", threshold: 3 },
    message: "Versuche es mit einem JOIN.",
  };

  it("returns syntax hint on syntax error", () => {
    const result: SqlQueryResult = { success: false, error: "near 'SLECT': syntax error" };
    const hint = selectHint([syntaxHint, wrongResultHint], result, undefined, 1);
    expect(hint).toBeDefined();
    expect(hint!.message).toBe("Prüfe die Syntax.");
    expect(hint!.level).toBe(1);
  });

  it("returns wrong_result hint when comparison fails", () => {
    const result: SqlQueryResult = { success: true };
    const comparison = { status: "row_count_mismatch" as const, details: "x" };
    const hint = selectHint([syntaxHint, wrongResultHint], result, comparison, 1);
    expect(hint).toBeDefined();
    expect(hint!.message).toBe("Das Ergebnis ist falsch.");
  });

  it("returns repeated_failures hint after threshold attempts", () => {
    const result: SqlQueryResult = { success: true };
    const comparison = { status: "row_count_mismatch" as const, details: "x" };
    const hint = selectHint([syntaxHint, wrongResultHint, repeatedHint], result, comparison, 3);
    expect(hint).toBeDefined();
    // Level 1 hints match first; wrong_result matches because comparison is wrong
    expect(hint!.level).toBe(1);
  });

  it("returns undefined when nothing matches", () => {
    const result: SqlQueryResult = { success: true };
    const hint = selectHint([syntaxHint], result, undefined, 1);
    expect(hint).toBeUndefined();
  });

  it("matches syntax_error with pattern", () => {
    const patternHint: ExerciseHint = {
      level: 1,
      trigger: { type: "syntax_error", pattern: "SLECT" },
      message: "Du hast SELECT falsch geschrieben.",
    };
    const result: SqlQueryResult = { success: false, error: "near 'SLECT': syntax error" };
    const hint = selectHint([patternHint], result, undefined, 1);
    expect(hint).toBeDefined();
    expect(hint!.message).toBe("Du hast SELECT falsch geschrieben.");
  });
});

describe("getStrongerHint", () => {
  const h1: ExerciseHint = {
    level: 1,
    trigger: { type: "wrong_result" },
    message: "Einfacher Hinweis",
  };
  const h2: ExerciseHint = {
    level: 2,
    trigger: { type: "wrong_result" },
    message: "Stärkerer Hinweis",
  };
  const h3: ExerciseHint = {
    level: 3,
    trigger: { type: "repeated_failures", threshold: 5 },
    message: "Lösung fast verraten",
  };

  it("returns next level hint when available", () => {
    const result: SqlQueryResult = { success: true };
    const comparison = { status: "row_count_mismatch" as const, details: "x" };
    const hint = getStrongerHint([h1, h2, h3], 1, result, comparison, 2);
    expect(hint).toBeDefined();
    expect(hint!.level).toBe(2);
    expect(hint!.message).toBe("Stärkerer Hinweis");
  });

  it("skips levels that do not match trigger", () => {
    const result: SqlQueryResult = { success: true };
    const comparison = { status: "row_count_mismatch" as const, details: "x" };
    const hint = getStrongerHint([h1, h3], 1, result, comparison, 2);
    // h3 requires 5 attempts, so no match
    expect(hint).toBeUndefined();
  });
});
