/**
 * Unit-Tests fuer den Hidden-Tests-Runner (Verdeckte Tests).
 *
 * English: Unit tests for Hidden Tests Runner.
 */

import { runHiddenTests } from "./hiddenTests";
import type { HiddenTest } from "@/types/playground";

const mockRunQuery = vi.fn();
vi.mock("./sqlEngine", () => ({
  runQuery: (...args: unknown[]) => mockRunQuery(...args),
}));

function makeDb() {
  return {} as import("sql.js").Database;
}

describe("runHiddenTests", () => {
  beforeEach(() => {
    mockRunQuery.mockReset();
  });

  it("passes when hidden test returns rows", () => {
    mockRunQuery.mockReturnValue({
      success: true,
      resultset: { columns: [{ name: "c", type: "TEXT" }], rows: [{ c: 1 }] },
    });

    const tests: HiddenTest[] = [
      { id: "ht1", name: "Check", query: "SELECT 1", failureMessage: "Fail" },
    ];
    const results = runHiddenTests(makeDb(), tests);
    expect(results[0].passed).toBe(true);
  });

  it("fails when hidden test returns no rows", () => {
    mockRunQuery.mockReturnValue({
      success: true,
      resultset: { columns: [], rows: [] },
    });

    const tests: HiddenTest[] = [
      { id: "ht1", name: "Check", query: "SELECT 1", failureMessage: "Nothing found" },
    ];
    const results = runHiddenTests(makeDb(), tests);
    expect(results[0].passed).toBe(false);
    expect(results[0].message).toBe("Nothing found");
  });

  it("fails when hidden test query errors", () => {
    mockRunQuery.mockReturnValue({ success: false, error: "syntax error" });

    const tests: HiddenTest[] = [
      { id: "ht1", name: "Check", query: "SELECT", failureMessage: "Bad query" },
    ];
    const results = runHiddenTests(makeDb(), tests);
    expect(results[0].passed).toBe(false);
    expect(results[0].message).toContain("Bad query");
  });

  it("uses expectedResultset when provided", () => {
    mockRunQuery.mockReturnValue({
      success: true,
      resultset: {
        columns: [{ name: "id", type: "INT" }],
        rows: [{ id: 1 }],
      },
    });

    const tests: HiddenTest[] = [
      {
        id: "ht1",
        name: "Exact",
        query: "SELECT id FROM t",
        expectedResultset: {
          columns: [{ name: "id", type: "INT" }],
          rows: [{ id: 1 }],
        },
        failureMessage: "Wrong data",
      },
    ];
    const results = runHiddenTests(makeDb(), tests);
    expect(results[0].passed).toBe(true);
  });

  it("fails when expectedResultset differs", () => {
    mockRunQuery.mockReturnValue({
      success: true,
      resultset: {
        columns: [{ name: "id", type: "INT" }],
        rows: [{ id: 2 }],
      },
    });

    const tests: HiddenTest[] = [
      {
        id: "ht1",
        name: "Exact",
        query: "SELECT id FROM t",
        expectedResultset: {
          columns: [{ name: "id", type: "INT" }],
          rows: [{ id: 1 }],
        },
        failureMessage: "Wrong data",
      },
    ];
    const results = runHiddenTests(makeDb(), tests);
    expect(results[0].passed).toBe(false);
    expect(results[0].message).toContain("Wrong data");
  });

  it("passes with compareMode='rows' ignoring order", () => {
    mockRunQuery.mockReturnValue({
      success: true,
      resultset: {
        columns: [{ name: "id", type: "INT" }, { name: "name", type: "TEXT" }],
        rows: [{ id: 2, name: "Bob" }, { id: 1, name: "Alice" }],
      },
    });

    const tests: HiddenTest[] = [
      {
        id: "ht1",
        name: "Rows",
        query: "SELECT id, name FROM t",
        compareMode: "rows",
        expectedResultset: {
          columns: [{ name: "id", type: "INT" }, { name: "name", type: "TEXT" }],
          rows: [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }],
        },
        failureMessage: "Row mismatch",
      },
    ];
    const results = runHiddenTests(makeDb(), tests);
    expect(results[0].passed).toBe(true);
  });

  it("fails with compareMode='rows' when row count differs", () => {
    mockRunQuery.mockReturnValue({
      success: true,
      resultset: {
        columns: [{ name: "id", type: "INT" }],
        rows: [{ id: 1 }],
      },
    });

    const tests: HiddenTest[] = [
      {
        id: "ht1",
        name: "Rows",
        query: "SELECT id FROM t",
        compareMode: "rows",
        expectedResultset: {
          columns: [{ name: "id", type: "INT" }],
          rows: [{ id: 1 }, { id: 2 }],
        },
        failureMessage: "Row count mismatch",
      },
    ];
    const results = runHiddenTests(makeDb(), tests);
    expect(results[0].passed).toBe(false);
  });

  it("passes with compareMode='columns' when column names match", () => {
    mockRunQuery.mockReturnValue({
      success: true,
      resultset: {
        columns: [{ name: "id", type: "INT" }, { name: "NAME", type: "TEXT" }],
        rows: [{ id: 99 }],
      },
    });

    const tests: HiddenTest[] = [
      {
        id: "ht1",
        name: "Cols",
        query: "SELECT id, name FROM t",
        compareMode: "columns",
        expectedResultset: {
          columns: [{ name: "id", type: "INT" }, { name: "name", type: "TEXT" }],
          rows: [{ id: 1, name: "Alice" }],
        },
        failureMessage: "Column mismatch",
      },
    ];
    const results = runHiddenTests(makeDb(), tests);
    expect(results[0].passed).toBe(true);
  });

  it("passes with compareMode='count' when row count matches", () => {
    mockRunQuery.mockReturnValue({
      success: true,
      resultset: {
        columns: [{ name: "id", type: "INT" }],
        rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    });

    const tests: HiddenTest[] = [
      {
        id: "ht1",
        name: "Count",
        query: "SELECT id FROM t",
        compareMode: "count",
        expectedResultset: {
          columns: [{ name: "x", type: "INT" }],
          rows: [{ x: 10 }, { x: 20 }, { x: 30 }],
        },
        failureMessage: "Count mismatch",
      },
    ];
    const results = runHiddenTests(makeDb(), tests);
    expect(results[0].passed).toBe(true);
  });

  it("passes with compareMode='contains' when expected rows are subset", () => {
    mockRunQuery.mockReturnValue({
      success: true,
      resultset: {
        columns: [{ name: "id", type: "INT" }],
        rows: [{ id: 1 }, { id: 2 }, { id: 3 }],
      },
    });

    const tests: HiddenTest[] = [
      {
        id: "ht1",
        name: "Contains",
        query: "SELECT id FROM t",
        compareMode: "contains",
        expectedResultset: {
          columns: [{ name: "id", type: "INT" }],
          rows: [{ id: 2 }],
        },
        failureMessage: "Missing expected row",
      },
    ];
    const results = runHiddenTests(makeDb(), tests);
    expect(results[0].passed).toBe(true);
  });

  it("fails with compareMode='contains' when expected row not found", () => {
    mockRunQuery.mockReturnValue({
      success: true,
      resultset: {
        columns: [{ name: "id", type: "INT" }],
        rows: [{ id: 1 }, { id: 2 }],
      },
    });

    const tests: HiddenTest[] = [
      {
        id: "ht1",
        name: "Contains",
        query: "SELECT id FROM t",
        compareMode: "contains",
        expectedResultset: {
          columns: [{ name: "id", type: "INT" }],
          rows: [{ id: 5 }],
        },
        failureMessage: "Missing expected row",
      },
    ];
    const results = runHiddenTests(makeDb(), tests);
    expect(results[0].passed).toBe(false);
  });
});
