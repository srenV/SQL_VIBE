/**
 * SQL.js-Engine-Wrapper fuer die SQL-Trainer MySQL-Lernplattform.
 *
 * Laedt sql.js dynamisch im Browser, erstellt In-Memory-Datenbanken,
 * fuehrt Abfragen aus und liefert strukturierte Ergebnismengen zurueck.
 *
 * English: SQL.js engine wrapper for the SQL-Trainer Playground.
 * Dynamically loads sql.js in the browser, creates in-memory databases,
 * runs queries, and returns structured resultsets.
 */

import type { SqlColumn, SqlQueryResult, SqlRow } from "@/types/playground";
import type { SandboxQueryResult } from "@/types/sandbox";
import { transpileToSqlite, mapSqliteError, mapSqliteType } from "@/lib/dialectCompat";
import type { Dialect } from "@/lib/dialect";

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
 * Teilt ein Multi-Statement-SQL-Skript in einzelne Statements auf.
 * Berücksichtigt String-Literale (einfache und doppelte Anführungszeichen)
 * und ignoriert Semikolons innerhalb von Strings.
 *
 * @param sql - Das SQL-Skript mit einem oder mehreren Statements.
 * @returns Array einzelner SQL-Statements (ohne leere Einträge).
 */
export function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];
  let current = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];

    // String-Literal-Tracking
    if (inString) {
      current += ch;
      if (ch === stringChar && sql[i - 1] !== "\\") {
        inString = false;
      }
      continue;
    }

    if (ch === "'" || ch === '"') {
      inString = true;
      stringChar = ch;
      current += ch;
      continue;
    }

    // Semikolon = Statement-Ende
    if (ch === ";") {
      const trimmed = current.trim();
      if (trimmed) {
        statements.push(trimmed);
      }
      current = "";
      continue;
    }

    current += ch;
  }

  // Letztes Statement (ohne abschließendes Semikolon)
  const trimmed = current.trim();
  if (trimmed) {
    statements.push(trimmed);
  }

  return statements;
}

/**
 * Erstellt eine neue In-Memory-Datenbank und fuehrt optionales Setup-SQL aus.
 * @param sql - SQL-Statement(s) zum Initialisieren der Datenbank (DDL + DML).
 * @param dialect - Der SQL-Dialekt des Setup-SQLs (Standard: "mysql" für Abwärtskompatibilität).
 * @returns Die geoeffnete sql.js-Datenbankinstanz.
 */
export async function createDatabase(sql: string, dialect: Dialect = "mysql"): Promise<SqlJsModule["Database"]> {
  const SQL = await loadSqlJs();
  const db = new SQL.Database();
  // Foreign-Key-Constraints aktivieren (SQLite-Default: OFF)
  db.run("PRAGMA foreign_keys = ON;");
  if (sql.trim()) {
    // Zuerst in einzelne Statements aufteilen, dann jedes einzeln transformieren.
    const rawStatements = splitSqlStatements(sql);
    for (const rawStmt of rawStatements) {
      const trimmed = rawStmt.trim();
      if (!trimmed) continue;

      // Jedes Statement einzeln transformieren (dialektabhängig)
      const sqliteStmt = transpileToSqlite(trimmed, dialect);

      // Kommentare überspringen
      if (sqliteStmt.trim().startsWith("--")) continue;

      try {
        db.run(sqliteStmt);
      } catch (err) {
        // Fehler loggen aber nicht abbrechen — andere Statements sollen weiterlaufen
        console.warn("SQL-Statement fehlgeschlagen:", sqliteStmt, err);
      }
    }
  }
  return db;
}

/**
 * Fuehrt eine SQL-Abfrage auf der Datenbank aus und liefert ein strukturiertes Ergebnis.
 * Der SQL-Input wird je nach Dialekt automatisch zu SQLite übersetzt.
 *
 * Unterstützt Multi-Statement-SQL: Mehrere Statements werden einzeln ausgeführt,
 * das Ergebnis des letzten SELECT/PRAGMA/SHOW-Statements wird zurückgegeben.
 * DDL/DML-Statements ohne Ergebnismenge werden stillschweigend ausgeführt.
 *
 * @param db - Die sql.js-Datenbankinstanz.
 * @param sql - Die auszufuehrende SQL-Abfrage (dialektabhängige Syntax akzeptiert).
 * @param dialect - Der SQL-Dialekt (Standard: "mysql" für Abwärtskompatibilität).
 * @returns Ergebnisobjekt mit Erfolgsstatus, Ergebnismenge oder Fehlertext und Ausfuehrungszeit.
 */
export function runQuery(
  db: SqlJsModule["Database"],
  sql: string,
  dialect: Dialect = "mysql"
): SqlQueryResult {
  const start = performance.now();
  try {
    // Zuerst in einzelne Statements aufteilen, dann jedes einzeln transformieren.
    // Das ist wichtig, weil mysqlToSqlite() nur auf einzelnen Statements korrekt
    // arbeitet (z.B. transformCreateTable prüft auf /^\s*CREATE\s+TABLE/).
    const rawStatements = splitSqlStatements(sql);

    // Wenn nur ein Statement: direkte Ausführung (bestehendes Verhalten)
    if (rawStatements.length <= 1) {
      const singleRaw = rawStatements[0] || sql;
      const transformedSql = transpileToSqlite(singleRaw, dialect);
      if (transformedSql.trim().startsWith("--")) {
        // Nur-Kommentar-Statement: Erfolg ohne Ergebnis
        const executionTimeMs = Math.round(performance.now() - start);
        return { success: true, resultset: { columns: [], rows: [] }, executionTimeMs };
      }
      const stmt = db.exec(transformedSql);
      const executionTimeMs = Math.round(performance.now() - start);

      const raw = stmt as unknown as { columns?: string[]; values?: unknown[][] }[];
      if (!raw || raw.length === 0) {
        return { success: true, resultset: { columns: [], rows: [] }, executionTimeMs };
      }

      const resultPart = raw.find((r) => r.columns && r.columns.length > 0);
      if (!resultPart) {
        return { success: true, resultset: { columns: [], rows: [] }, executionTimeMs };
      }

      const columns: SqlColumn[] = resultPart.columns!.map((name) => ({
        name,
        type: "UNKNOWN",
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
    }

    // Multi-Statement: Jedes einzeln transformieren und ausführen
    let lastResult: SqlQueryResult | null = null;
    let lastSelectResult: SqlQueryResult | null = null;

    for (const rawStmt of rawStatements) {
      const trimmed = rawStmt.trim();
      if (!trimmed) continue;

      // Jedes Statement einzeln transformieren
      const sqliteStmt = transpileToSqlite(trimmed, dialect);

      // Kommentare überspringen
      if (sqliteStmt.trim().startsWith("--")) continue;

      try {
        const execResult = db.exec(sqliteStmt);
        const executionTimeMs = Math.round(performance.now() - start);

        const raw = execResult as unknown as { columns?: string[]; values?: unknown[][] }[];
        if (!raw || raw.length === 0) {
          lastResult = { success: true, resultset: { columns: [], rows: [] }, executionTimeMs };
        } else {
          const resultPart = raw.find((r) => r.columns && r.columns.length > 0);
          if (resultPart) {
            const columns: SqlColumn[] = resultPart.columns!.map((name) => ({
              name,
              type: "UNKNOWN",
            }));
            const rows: SqlRow[] = (resultPart.values || []).map((row) => {
              const obj: SqlRow = {};
              resultPart.columns!.forEach((col, idx) => {
                obj[col] = row[idx];
              });
              return obj;
            });
            lastResult = { success: true, resultset: { columns, rows }, executionTimeMs };
            lastSelectResult = lastResult;
          } else {
            lastResult = { success: true, resultset: { columns: [], rows: [] }, executionTimeMs };
          }
        }
      } catch (err) {
        // Bei Fehler: Abbrechen und Fehler zurückgeben
        const executionTimeMs = Math.round(performance.now() - start);
        const rawError = err instanceof Error ? err.message : String(err);
        const dialectError = mapSqliteError(rawError, dialect);
        return {
          success: false,
          error: dialectError,
          executionTimeMs,
        };
      }
    }

    // Bevorzugt das letzte SELECT/PRAGMA-Ergebnis zurückgeben,
    // sonst das letzte Statement-Ergebnis
    const finalResult = lastSelectResult || lastResult || {
      success: true,
      resultset: { columns: [], rows: [] },
      executionTimeMs: Math.round(performance.now() - start),
    };
    return finalResult;
  } catch (err) {
    const executionTimeMs = Math.round(performance.now() - start);
    // SQLite-Fehler zu dialekt-artigen Fehlern übersetzen
    const rawError = err instanceof Error ? err.message : String(err);
    const dialectError = mapSqliteError(rawError, dialect);
    return {
      success: false,
      error: dialectError,
      executionTimeMs,
    };
  }
}

/**
 * Liefert alle Tabellen- und Sichtnamen (views) mit zugehoerigen DDL-Anweisungen aus der Datenbank.
 * @param db - Die sql.js-Datenbankinstanz.
 * @returns Array mit Name, Typ (table/view) und SQL-DDL fuer jede Tabelle und Sicht.
 */
export function getSchema(db: SqlJsModule["Database"], dialect: Dialect = "mysql"): {
  name: string;
  type: "table" | "view";
  sql: string | null;
}[] {
  const result = runQuery(
    db,
    "SELECT name, type, sql FROM sqlite_master WHERE type IN ('table', 'view') AND name NOT LIKE 'sqlite_%' ORDER BY type, name;",
    dialect
  );
  if (!result.success || !result.resultset) return [];
  return result.resultset.rows.map((r) => ({
    name: String(r.name),
    type: (String(r.type) === "view" ? "view" : "table") as "table" | "view",
    sql: r.sql != null ? String(r.sql) : null,
  }));
}

/**
 * Liefert Spalteninformationen fuer eine bestimmte Tabelle (PRAGMA table_info).
 * @param db - Die sql.js-Datenbankinstanz.
 * @param tableName - Name der Tabelle.
 * @param dialect - Der SQL-Dialekt (Standard: "mysql").
 * @returns Array mit Spaltenmetadaten (cid, name, type, notnull, dflt_value, pk).
 */
export function getTableInfo(
  db: SqlJsModule["Database"],
  tableName: string,
  dialect: Dialect = "mysql"
): { cid: number; name: string; type: string; notnull: number; dflt_value: unknown; pk: number }[] {
  const result = runQuery(db, `PRAGMA table_info(${escapeIdentifier(tableName)});`, dialect);
  if (!result.success || !result.resultset) return [];
  return result.resultset.rows.map((r) => ({
    cid: Number(r.cid),
    name: String(r.name),
    type: mapSqliteType(String(r.type), dialect), // Dialekt-artige Typen anzeigen
    notnull: Number(r.notnull),
    dflt_value: r.dflt_value,
    pk: Number(r.pk),
  }));
}

/**
 * Liefert Fremdschluessel-Beziehungen fuer eine bestimmte Tabelle (PRAGMA foreign_key_list).
 * @param db - Die sql.js-Datenbankinstanz.
 * @param tableName - Name der Tabelle.
 * @param dialect - Der SQL-Dialekt (Standard: "mysql").
 * @returns Array mit from-Spalte, to-Spalte und Zieltabelle.
 */
export function getForeignKeys(
  db: SqlJsModule["Database"],
  tableName: string,
  dialect: Dialect = "mysql"
): { from: string; to: string; table: string }[] {
  const result = runQuery(db, `PRAGMA foreign_key_list(${escapeIdentifier(tableName)});`, dialect);
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
  limit: number = 10,
  dialect: Dialect = "mysql"
): SqlQueryResult {
  const safeName = escapeIdentifier(tableName);
  return runQuery(db, `SELECT * FROM ${safeName} LIMIT ${limit};`, dialect);
}

/**
 * Schliesst die Datenbankverbindung und gibt den Speicher frei.
 * @param db - Die zu schliessende sql.js-Datenbankinstanz.
 */
export function closeDatabase(db: SqlJsModule["Database"]): void {
  db.close();
}

/**
 * Laedt eine sql.js-Datenbank aus einem binaeren SQLite-File (z. B. aus IndexedDB).
 * @param data - Uint8Array mit den Binaerdaten der SQLite-Datenbank.
 * @returns Die geoeffnete sql.js-Datenbankinstanz.
 */
export async function loadDatabaseFromBinary(data: Uint8Array): Promise<SqlJsModule["Database"]> {
  const SQL = await loadSqlJs();
  const db = new SQL.Database(data);
  // Foreign-Key-Constraints aktivieren (SQLite-Default: OFF)
  db.run("PRAGMA foreign_keys = ON;");
  return db;
}

/**
 * Exportiert eine sql.js-Datenbank als binaeres SQLite-File fuer Persistenz.
 *
 * WARNUNG: db.export() schliesst und oeffnet die DB intern neu (sql.js Issue #159).
 * Nach dem Aufruf ist die DB-Instanz in einem undefinierten Zustand – Pragmas
 * sind zurueckgesetzt und weitere Operationen koennen fehlschlagen.
 *
 * SICHERE ALTERNATIVE: exportAndCloseDatabase() oder exportDatabaseSafe() verwenden.
 *
 * @param db - Die zu exportierende sql.js-Datenbankinstanz.
 * @returns Uint8Array mit den Binaerdaten der SQLite-Datenbank.
 * @deprecated Use exportAndCloseDatabase() or exportDatabaseSafe() instead.
 */
export function exportDatabase(db: SqlJsModule["Database"]): Uint8Array {
  return db.export();
}

/**
 * Exportiert eine sql.js-Datenbank und schliesst sie anschliessend.
 *
 * Da db.export() die DB intern ohnehin schliesst und neu oeffnet (sql.js Issue #159),
 * ist es sicherer, die DB nach dem Export explizit zu schliessen und die
 * Instanz nicht weiterzuverwenden.
 *
 * @param db - Die zu exportierende und zu schliessende sql.js-Datenbankinstanz.
 * @returns Uint8Array mit den Binaerdaten der SQLite-Datenbank.
 */
export function exportAndCloseDatabase(db: SqlJsModule["Database"]): Uint8Array {
  const binary = db.export();
  // Nach export() ist die DB intern neu geoeffnet worden, aber in einem
  // inkonsistenten Zustand (Pragmas resetted). Explizit schliessen:
  try {
    db.close();
  } catch {
    // Ignorieren – DB war moeglicherweise schon geschlossen
  }
  return binary;
}

/**
 * Exportiert eine sql.js-Datenbank sicher und gibt eine FRISCHE Instanz zurueck.
 *
 * Da db.export() die DB intern schliesst/neu-oeffnet (sql.js Issue #159),
 * ist die alte Instanz danach korrupt. Diese Funktion:
 * 1. Exportiert die DB als Binary
 * 2. Schliesst die alte (korrupte) Instanz
 * 3. Erstellt eine neue Instanz aus dem Binary
 *
 * @param db - Die zu exportierende sql.js-Datenbankinstanz.
 * @returns { binary: Uint8Array, freshDb: Database } – Binary + frische DB-Instanz.
 */
export async function exportDatabaseSafe(db: SqlJsModule["Database"]): Promise<{
  binary: Uint8Array;
  freshDb: SqlJsModule["Database"];
}> {
  const binary = exportAndCloseDatabase(db);
  const freshDb = await loadDatabaseFromBinary(binary);
  return { binary, freshDb };
}

/**
 * Liefert die Anzahl der durch die letzte DML-Anweisung geaenderten Zeilen.
 * @param db - Die sql.js-Datenbankinstanz.
 * @returns Anzahl der geaenderten/eingefuegten/geloeschten Zeilen.
 */
export function getRowsModified(db: SqlJsModule["Database"]): number {
  return db.getRowsModified();
}

/**
 * Erkennt den Typ einer SQL-Anweisung (DDL, DML, DQL oder OTHER).
 * @param sql - Die SQL-Anweisung.
 * @returns Der erkannte Anweisungstyp.
 */
export function detectStatementType(sql: string): "DDL" | "DML" | "DQL" | "OTHER" {
  const trimmed = sql.trim().toUpperCase();
  if (/^(CREATE|DROP|ALTER|TRUNCATE)\b/.test(trimmed)) return "DDL";
  if (/^(INSERT|UPDATE|DELETE|REPLACE)\b/.test(trimmed)) return "DML";
  if (/^(SELECT|WITH|PRAGMA|EXPLAIN|SHOW|DESCRIBE|DESC)\b/.test(trimmed)) return "DQL";
  return "OTHER";
}

/**
 * Fuehrt eine SQL-Abfrage im Sandbox-Modus aus und liefert ein erweitertes Ergebnis
 * mit rowsModified und statementType.
 * @param db - Die sql.js-Datenbankinstanz.
 * @param sql - Die auszufuehrende SQL-Abfrage.
 * @param dialect - Der SQL-Dialekt (Standard: "mysql").
 * @returns SandboxQueryResult mit Erfolgsstatus, Ergebnismenge, rowsModified und statementType.
 */
export function runSandboxQuery(
  db: SqlJsModule["Database"],
  sql: string,
  dialect: Dialect = "mysql"
): SandboxQueryResult {
  const statementType = detectStatementType(sql);
  const result = runQuery(db, sql, dialect);
  const rowsModified = result.success ? getRowsModified(db) : 0;

  return {
    ...result,
    rowsModified,
    statementType,
  };
}
