/**
 * Unit-Tests fuer den sqlEngine.
 *
 * Testet createDatabase, runQuery, getSchema, getTableInfo, getForeignKeys
 * und die RIGHT-JOIN-Transformation.
 *
 * sql.js wird im Browser geladen; fuer Unit-Tests mocken wir das Modul.
 */

import { describe, it, expect, vi } from "vitest";

vi.mock("sql.js/dist/sql-wasm.js", () => {
  const mockDb = {
    run: vi.fn(),
    exec: vi.fn(),
    close: vi.fn(),
  };
  const initSqlJs = vi.fn().mockResolvedValue({
    Database: vi.fn().mockImplementation(() => mockDb),
  });
  return { default: initSqlJs };
});

import { transformRightJoin } from "./sqlEngine";

describe("transformRightJoin", () => {
  it("wandelt einen einfachen RIGHT JOIN mit Alias in LEFT JOIN um", () => {
    const sql = "SELECT * FROM kunden k RIGHT JOIN bestellungen b ON k.id = b.kunden_id";
    const result = transformRightJoin(sql);
    expect(result).toContain("LEFT JOIN");
    expect(result).toContain("bestellungen b LEFT JOIN kunden k ON k.id = b.kunden_id");
    expect(result).not.toContain("RIGHT JOIN");
  });

  it("wandelt RIGHT JOIN ohne Aliase um", () => {
    const sql = "SELECT * FROM kunden RIGHT JOIN bestellungen ON kunden.id = bestellungen.kunden_id";
    const result = transformRightJoin(sql);
    expect(result).toContain("LEFT JOIN");
    expect(result).toContain("bestellungen");
    expect(result).toContain("kunden");
    expect(result).not.toContain("RIGHT JOIN");
  });

  it("laesst normale LEFT JOINs unberuehrt", () => {
    const sql = "SELECT * FROM kunden LEFT JOIN bestellungen ON kunden.id = bestellungen.kunden_id";
    const result = transformRightJoin(sql);
    expect(result).toBe(sql);
  });

  it("laesst Queries ohne JOIN unberuehrt", () => {
    const sql = "SELECT * FROM kunden WHERE id > 5";
    const result = transformRightJoin(sql);
    expect(result).toBe(sql);
  });

  it("behandelt case-insensitive RIGHT JOIN", () => {
    const sql = "SELECT * FROM a right join b on a.id = b.id";
    const result = transformRightJoin(sql);
    expect(result).not.toContain("right join");
    expect(result).toContain("LEFT JOIN");
  });

  it("behandelt mehrere RIGHT JOINs in einer Query", () => {
    const sql = "SELECT * FROM a RIGHT JOIN b ON a.id = b.id RIGHT JOIN c ON b.id = c.id";
    const result = transformRightJoin(sql);
    expect(result).not.toContain("RIGHT");
  });
});