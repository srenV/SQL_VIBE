/**
 * SQL.js-Engine-Wrapper fuer die VIBAA MySQL-Lernplattform.
 *
 * Laedt sql.js dynamisch im Browser, erstellt In-Memory-Datenbanken,
 * fuehrt Abfragen aus und liefert strukturierte Ergebnismengen zurueck.
 *
 * English: SQL.js engine wrapper for the VIBAA Playground.
 * Dynamically loads sql.js in the browser, creates in-memory databases,
 * runs queries, and returns structured resultsets.
 */

import type { SqlColumn, SqlQueryResult, SqlRow } from "@/types/playground";

/** Sql.js-Modultyp – any wegen dynamischem Import. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqlJsModule = any;

/** Gecachte Referenz auf das geladene sql.js-Modul. */
let sqlJsModule: SqlJsModule | null = null;

/**
 * Laedt das sql.js-WASM-Modul einmalig und cachet es.
 * Der dynamische Import funktioniert im Browser; die WASM-Datei muss
 * aus public/ bereitgestellt werden (wird beim Build kopiert).
 */
async function loadSqlJs(): Promise<SqlJsModule> {
  if (sqlJsModule) return sqlJsModule;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod: any = await import("sql.js/dist/sql-wasm.js");
  const initSqlJs = mod.default ?? mod;
  sqlJsModule = await initSqlJs({
    locateFile: (file: string) => `/${file}`,
  });
  return sqlJsModule;
}

/**
 * Erstellt eine neue In-Memory-Datenbank und fuehrt optionales Setup-SQL aus.
 * @param sql - SQL-Statement(s) zum Initialisieren der Datenbank (DDL + DML).
 * @returns Die geoeffnete sql.js-Datenbankinstanz.
 */
export async function createDatabase(sql: string): Promise<SqlJsModule["Database"]> {
  const SQL = await loadSqlJs();
  const db = new SQL.Database();
  if (sql.trim()) {
    db.run(sql);
  }
  return db;
}

/**
 * Wandelt RIGHT JOIN in LEFT JOIN mit vertauschten Tabellen um, da SQLite
 * kein RIGHT JOIN oder FULL OUTER JOIN unterstuetzt.
 * Pattern: A RIGHT JOIN B ON A.x = B.y → B LEFT JOIN A ON A.x = B.y
 * Auch mit Alias: A a RIGHT JOIN B b ON a.x = b.y → B b LEFT JOIN A a ON a.x = b.y
 *
 * English: Transforms RIGHT JOIN into LEFT JOIN with swapped tables so SQLite can execute them.
 */
export function transformRightJoin(sql: string): string {
  return sql
    .replace(/\bRIGHT\s+JOIN\b/gi, "LEFT_JOIN_SWAPPED")
    .replace(
      /(\w+)(?:\s+(\w+))?\s+LEFT_JOIN_SWAPPED\s+(\w+)(?:\s+(\w+))?\s+ON\s+/gi,
      (_, lt, la, rt, ra) => {
        const left = la ? `${lt} ${la}` : lt;
        const right = ra ? `${rt} ${ra}` : rt;
        return `${right} LEFT JOIN ${left} ON `;
      }
    );
}

/**
 * Fuehrt eine SQL-Abfrage auf der Datenbank aus und liefert ein strukturiertes Ergebnis.
 * Unterstuetzt automatisch RIGHT-JOIN-Transformation fuer SQLite-Kompatibilitaet.
 * @param db - Die sql.js-Datenbankinstanz.
 * @param sql - Die auszufuehrende SQL-Abfrage.
 * @returns Ergebnisobjekt mit Erfolgsstatus, Ergebnismenge oder Fehlertext und Ausfuehrungszeit.
 */
export function runQuery(
  db: SqlJsModule["Database"],
  sql: string
): SqlQueryResult {
  const start = performance.now();
  try {
    const transformedSql = transformRightJoin(sql);
    const stmt = db.exec(transformedSql);
    const executionTimeMs = Math.round(performance.now() - start);

    // sql.js liefert { columns: string[], values: unknown[][] }
    const raw = stmt as unknown as { columns?: string[]; values?: unknown[][] }[];
    // Falls keine Ergebnisse vorliegen (z. B. CREATE/INSERT ohne SELECT), leere Erfolgsmeldung zurueckgeben
    if (!raw || raw.length === 0) {
      return { success: true, resultset: { columns: [], rows: [] }, executionTimeMs };
    }

    // Erste Anweisung mit Spalten verwenden
    const resultPart = raw.find((r) => r.columns && r.columns.length > 0);
    if (!resultPart) {
      return { success: true, resultset: { columns: [], rows: [] }, executionTimeMs };
    }

    const columns: SqlColumn[] = resultPart.columns!.map((name) => ({
      name,
      type: "UNKNOWN", // sql.js gibt Spaltentypen nicht direkt preis
    }));

    const rows: SqlRow[] = (resultPart.values || []).map((row) => {
      const obj: SqlRow = {};
      resultPart.columns!.forEach((col, idx) => {
        obj[col] = row[idx];
      });
      return obj;
    });

    return {
      success: true,
      resultset: { columns, rows },
      executionTimeMs,
    };
  } catch (err) {
    const executionTimeMs = Math.round(performance.now() - start);
    return {
      success: false,
      error: err instanceof Error ? err.message : String(err),
      executionTimeMs,
    };
  }
}

/**
 * Liefert alle Tabellennamen und zugehoerige DDL-Anweisungen aus der Datenbank.
 * @param db - Die sql.js-Datenbankinstanz.
 * @returns Array mit Tabellenname und SQL-DDL fuer jede Tabelle.
 */
export function getSchema(db: SqlJsModule["Database"]): {
  name: string;
  sql: string | null;
}[] {
  const result = runQuery(
    db,
    "SELECT name, sql FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
  );
  if (!result.success || !result.resultset) return [];
  return result.resultset.rows.map((r) => ({
    name: String(r.name),
    sql: r.sql != null ? String(r.sql) : null,
  }));
}

/**
 * Liefert Spalteninformationen fuer eine bestimmte Tabelle (PRAGMA table_info).
 * @param db - Die sql.js-Datenbankinstanz.
 * @param tableName - Name der Tabelle.
 * @returns Array mit Spaltenmetadaten (cid, name, type, notnull, dflt_value, pk).
 */
export function getTableInfo(
  db: SqlJsModule["Database"],
  tableName: string
): { cid: number; name: string; type: string; notnull: number; dflt_value: unknown; pk: number }[] {
  const result = runQuery(db, `PRAGMA table_info(${escapeIdentifier(tableName)});`);
  if (!result.success || !result.resultset) return [];
  return result.resultset.rows.map((r) => ({
    cid: Number(r.cid),
    name: String(r.name),
    type: String(r.type),
    notnull: Number(r.notnull),
    dflt_value: r.dflt_value,
    pk: Number(r.pk),
  }));
}

/**
 * Liefert Fremdschluessel-Beziehungen fuer eine bestimmte Tabelle (PRAGMA foreign_key_list).
 * @param db - Die sql.js-Datenbankinstanz.
 * @param tableName - Name der Tabelle.
 * @returns Array mit from-Spalte, to-Spalte und Zieltabelle.
 */
export function getForeignKeys(
  db: SqlJsModule["Database"],
  tableName: string
): { from: string; to: string; table: string }[] {
  const result = runQuery(db, `PRAGMA foreign_key_list(${escapeIdentifier(tableName)});`);
  if (!result.success || !result.resultset) return [];
  return result.resultset.rows.map((r) => ({
    from: String(r.from),
    to: String(r.to),
    table: String(r.table),
  }));
}

/** Escaped einen SQL-Bezeichner fuer sichere Verwendung in PRAGMA-Anweisungen. */
function escapeIdentifier(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

/**
 * Liefert eine Vorschau der Daten einer Tabelle (max. `limit` Zeilen).
 * @param db - Die sql.js-Datenbankinstanz.
 * @param tableName - Name der Tabelle.
 * @param limit - Maximale Anzahl Zeilen (Standard: 10).
 * @returns Ergebnismenge mit Spalten und Zeilen oder leeres Ergebnis bei Fehler.
 */
export function peekTableData(
  db: SqlJsModule["Database"],
  tableName: string,
  limit: number = 10
): SqlQueryResult {
  const safeName = escapeIdentifier(tableName);
  return runQuery(db, `SELECT * FROM ${safeName} LIMIT ${limit};`);
}

/**
 * Schliesst die Datenbankverbindung und gibt den Speicher frei.
 * @param db - Die zu schliessende sql.js-Datenbankinstanz.
 */
export function closeDatabase(db: SqlJsModule["Database"]): void {
  db.close();
}
