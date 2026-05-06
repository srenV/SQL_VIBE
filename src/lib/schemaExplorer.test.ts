/**
 * Unit-Tests fuer den Schema-Explorer / Datenbank-Introspektion.
 *
 * English: Unit tests for Schema Explorer / Introspection.
 */

import { introspectSchema } from "./schemaExplorer";

const mockGetSchema = vi.fn();
const mockGetTableInfo = vi.fn();
const mockGetForeignKeys = vi.fn();

vi.mock("./sqlEngine", () => ({
  getSchema: (...args: unknown[]) => mockGetSchema(...args),
  getTableInfo: (...args: unknown[]) => mockGetTableInfo(...args),
  getForeignKeys: (...args: unknown[]) => mockGetForeignKeys(...args),
}));

function makeDb() {
  return {} as import("sql.js").Database;
}

describe("introspectSchema", () => {
  beforeEach(() => {
    mockGetSchema.mockReset();
    mockGetTableInfo.mockReset();
    mockGetForeignKeys.mockReset();
  });

  it("returns empty array when no tables exist", () => {
    mockGetSchema.mockReturnValue([]);
    const result = introspectSchema(makeDb());
    expect(result).toEqual([]);
  });

  it("returns table with columns and no foreign keys", () => {
    mockGetSchema.mockReturnValue([{ name: "users", sql: "CREATE TABLE users (...)" }]);
    mockGetTableInfo.mockReturnValue([
      { cid: 0, name: "id", type: "INTEGER", notnull: 1, dflt_value: null, pk: 1 },
      { cid: 1, name: "name", type: "TEXT", notnull: 1, dflt_value: null, pk: 0 },
    ]);
    mockGetForeignKeys.mockReturnValue([]);

    const result = introspectSchema(makeDb());
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("users");
    expect(result[0].columns).toEqual([
      { name: "id", type: "INTEGER", nullable: false, defaultValue: undefined, isPrimaryKey: true },
      { name: "name", type: "TEXT", nullable: false, defaultValue: undefined, isPrimaryKey: false },
    ]);
    expect(result[0].foreignKeys).toBeUndefined();
  });

  it("marks nullable when notnull is 0", () => {
    mockGetSchema.mockReturnValue([{ name: "products", sql: null }]);
    mockGetTableInfo.mockReturnValue([
      { cid: 0, name: "price", type: "REAL", notnull: 0, dflt_value: 0.0, pk: 0 },
    ]);
    mockGetForeignKeys.mockReturnValue([]);

    const result = introspectSchema(makeDb());
    expect(result[0].columns[0].nullable).toBe(true);
  });

  it("includes foreign keys when present", () => {
    mockGetSchema.mockReturnValue([{ name: "orders", sql: null }]);
    mockGetTableInfo.mockReturnValue([
      { cid: 0, name: "user_id", type: "INTEGER", notnull: 1, dflt_value: null, pk: 0 },
    ]);
    mockGetForeignKeys.mockReturnValue([
      { from: "user_id", to: "id", table: "users" },
    ]);

    const result = introspectSchema(makeDb());
    expect(result[0].foreignKeys).toEqual([
      { column: "user_id", referencedTable: "users", referencedColumn: "id" },
    ]);
  });

  it("handles multiple tables", () => {
    mockGetSchema.mockReturnValue([
      { name: "users", sql: null },
      { name: "posts", sql: null },
    ]);
    mockGetTableInfo
      .mockReturnValueOnce([{ cid: 0, name: "id", type: "INTEGER", notnull: 1, dflt_value: null, pk: 1 }])
      .mockReturnValueOnce([{ cid: 0, name: "title", type: "TEXT", notnull: 0, dflt_value: null, pk: 0 }]);
    mockGetForeignKeys.mockReturnValue([]);

    const result = introspectSchema(makeDb());
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe("users");
    expect(result[1].name).toBe("posts");
  });
});
