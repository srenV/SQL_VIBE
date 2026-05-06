/**
 * Unit-Tests fuer die Ergebnismengen-Vergleichs-Engine (Resultset Comparison Engine).
 *
 * English: Unit tests for Resultset Comparison Engine.
 */

import { compareResultsets } from "./resultsetComparison";
import type { SqlResultset } from "@/types/playground";

function rs(columns: string[], rows: Record<string, unknown>[], types?: string[]): SqlResultset {
  return {
    columns: columns.map((name, i) => ({ name, type: types?.[i] ?? "TEXT" })),
    rows,
  };
}

describe("compareResultsets", () => {
  it("returns equal for identical resultsets", () => {
    const expected = rs(["id", "name"], [{ id: 1, name: "Alice" }]);
    const actual = rs(["id", "name"], [{ id: 1, name: "Alice" }]);
    const result = compareResultsets(expected, actual);
    expect(result.status).toBe("equal");
  });

  it("detects column count mismatch", () => {
    const expected = rs(["id"], [{ id: 1 }]);
    const actual = rs(["id", "name"], [{ id: 1, name: "Alice" }]);
    const result = compareResultsets(expected, actual);
    expect(result.status).toBe("column_mismatch");
  });

  it("detects column name mismatch", () => {
    const expected = rs(["id", "name"], [{ id: 1, name: "Alice" }]);
    const actual = rs(["id", "vorname"], [{ id: 1, vorname: "Alice" }]);
    const result = compareResultsets(expected, actual);
    expect(result.status).toBe("column_mismatch");
  });

  it("allows case-insensitive column names", () => {
    const expected = rs(["ID", "Name"], [{ ID: 1, Name: "Alice" }]);
    const actual = rs(["id", "name"], [{ id: 1, name: "Alice" }]);
    const result = compareResultsets(expected, actual);
    expect(result.status).toBe("equal");
  });

  it("detects row count mismatch", () => {
    const expected = rs(["id"], [{ id: 1 }]);
    const actual = rs(["id"], [{ id: 1 }, { id: 2 }]);
    const result = compareResultsets(expected, actual);
    expect(result.status).toBe("row_count_mismatch");
  });

  it("detects row data mismatch", () => {
    const expected = rs(["id"], [{ id: 1 }]);
    const actual = rs(["id"], [{ id: 2 }]);
    const result = compareResultsets(expected, actual);
    expect(result.status).toBe("row_data_mismatch");
    expect(result.firstMismatchRow).toBe(0);
  });

  it("handles null values correctly", () => {
    const expected = rs(["id", "name"], [{ id: 1, name: null }]);
    const actual = rs(["id", "name"], [{ id: 1, name: null }]);
    const result = compareResultsets(expected, actual);
    expect(result.status).toBe("equal");
  });

  it("handles empty resultsets as equal", () => {
    const expected = rs([], []);
    const actual = rs([], []);
    const result = compareResultsets(expected, actual);
    expect(result.status).toBe("equal");
  });

  it("handles numeric comparisons", () => {
    const expected = rs(["a"], [{ a: 42 }]);
    const actual = rs(["a"], [{ a: 42 }]);
    const result = compareResultsets(expected, actual);
    expect(result.status).toBe("equal");
  });

  it("detects numeric value mismatch", () => {
    const expected = rs(["a"], [{ a: 42 }]);
    const actual = rs(["a"], [{ a: 43 }]);
    const result = compareResultsets(expected, actual);
    expect(result.status).toBe("row_data_mismatch");
  });

  it("detects column type mismatch", () => {
    const expected = rs(["id"], [{ id: 1 }], ["INTEGER"]);
    const actual = rs(["id"], [{ id: 1 }], ["TEXT"]);
    const result = compareResultsets(expected, actual);
    expect(result.status).toBe("type_mismatch");
  });

  it("skips type comparison when type is UNKNOWN", () => {
    const expected = rs(["id"], [{ id: 1 }], ["UNKNOWN"]);
    const actual = rs(["id"], [{ id: 1 }], ["TEXT"]);
    const result = compareResultsets(expected, actual);
    expect(result.status).toBe("equal");
  });
});
