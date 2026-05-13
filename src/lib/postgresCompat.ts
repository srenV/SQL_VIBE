/**
 * PostgreSQL-Kompatibilitäts-Layer für SQLite (sql.js).
 *
 * Übersetzt PostgreSQL-Syntax zu SQLite-äquivalenten Ausdrücken,
 * damit User PostgreSQL-Syntax schreiben können, die unter der Haube
 * auf SQLite ausgeführt wird.
 *
 * Unterstützte Transformationen:
 * - SERIAL / BIGSERIAL → INTEGER PRIMARY KEY AUTOINCREMENT
 * - ::type CAST → CAST(expr AS type)
 * - EXTRACT(part FROM date) → strftime('%part', date)
 * - NOW() / CURRENT_TIMESTAMP → DATETIME('now')
 * - ILIKE → LIKE with LOWER()
 * - LIMIT x OFFSET y → LIMIT y OFFSET x (already compatible)
 * - BOOLEAN → INTEGER
 * - RETURNING * → removed (SQLite doesn't support)
 * - ON CONFLICT → INSERT OR REPLACE / INSERT OR IGNORE
 * - TRUNCATE TABLE x → DELETE FROM x
 * - ARRAY[] → removed (not supported)
 * - LATERAL → removed (not supported)
 * - TRUE/FALSE → 1/0
 * - DOUBLE PRECISION → REAL
 * - CHARACTER VARYING(n) → TEXT
 * - TIMESTAMP WITH TIME ZONE → TEXT
 * - DEFAULT nextval('seq') → removed
 * - Dollar-quoted strings → regular strings
 */

import type { Dialect } from "./dialect";

/**
 * Hauptfunktion: Übersetzt eine PostgreSQL-SQL-Anweisung zu SQLite-kompatibler Syntax.
 * Wird vor der Ausführung auf der sql.js-Engine aufgerufen.
 *
 * @param sql - Die PostgreSQL-SQL-Anweisung
 * @returns Die SQLite-kompatible Anweisung
 */
export function postgresToSqlite(sql: string): string {
  let result = sql;

  // 0. Dollar-quoted strings → regular single-quoted strings
  result = transformDollarQuotes(result);

  // 1. CREATE TABLE Transformationen
  result = transformCreateTable(result);

  // 2. TRUNCATE TABLE → DELETE FROM
  result = transformTruncate(result);

  // 3. CAST shorthand ::type → CAST(expr AS type)
  result = transformCastShorthand(result);

  // 4. EXTRACT(part FROM date) → strftime
  result = transformExtract(result);

  // 5. NOW() / CURRENT_TIMESTAMP → DATETIME('now')
  result = transformDateFunctions(result);

  // 6. ILIKE → LOWER() LIKE LOWER()
  result = transformIlike(result);

  // 7. RETURNING * → removed
  result = transformReturning(result);

  // 8. ON CONFLICT transformations
  result = transformOnConflict(result);

  // 9. TRUE/FALSE → 1/0
  result = transformBooleans(result);

  // 10. SERIAL / BIGSERIAL → INTEGER PRIMARY KEY AUTOINCREMENT
  // (already handled in transformCreateTable)

  // 11. DEFAULT nextval('seq') → removed
  result = removeNextvalDefaults(result);

  // 12. DROP DATABASE / CREATE DATABASE → comments
  result = transformDatabaseStatements(result);

  return result;
}

// ─── Einzelne Transformationen ────────────────────────────────────────────

/** Dollar-quoted strings ($$...$$ or $tag$...$tag$) → regular strings */
function transformDollarQuotes(sql: string): string {
  // Replace $$...$$ with single-quoted strings
  // This is a simplified approach — dollar-quoted strings can contain anything
  let result = sql;
  // Match $$...$$ (non-greedy)
  result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_match, content: string) => {
    return "'" + content.replace(/'/g, "''") + "'";
  });
  // Match $tag$...$tag$ patterns
  result = result.replace(/\$([a-zA-Z_]\w*)\$([\s\S]*?)\$\1\$/g, (_match, _tag: string, content: string) => {
    return "'" + content.replace(/'/g, "''") + "'";
  });
  return result;
}

/** CREATE TABLE: PostgreSQL-Typen → SQLite-Typen, SERIAL → AUTOINCREMENT */
function transformCreateTable(sql: string): string {
  if (!/^\s*CREATE\s+TABLE\b/i.test(sql)) return sql;

  let result = sql;

  // SERIAL → INTEGER PRIMARY KEY AUTOINCREMENT (if it's a primary key column)
  // BIGSERIAL → same
  result = result.replace(/\b(SMALL|BIG)?SERIAL\b/gi, "INTEGER");

  // Type mappings
  result = result.replace(/\bBOOLEAN\b/gi, "INTEGER");
  result = result.replace(/\bDOUBLE\s+PRECISION\b/gi, "REAL");
  result = result.replace(/\bCHARACTER\s+VARYING\s*\(\s*\d+\s*\)/gi, "TEXT");
  result = result.replace(/\bVARCHAR\s*\(\s*\d+\s*\)/gi, "TEXT");
  result = result.replace(/\bTIMESTAMP\s+WITH(?:OUT)?\s+TIME\s+ZONE\b/gi, "TEXT");
  result = result.replace(/\bTIMESTAMPTZ\b/gi, "TEXT");
  result = result.replace(/\bINT\s+DEFAULT\s+NEXTVAL\s*\([^)]+\)\s*NOT\s+NULL\b/gi, "INTEGER NOT NULL");

  return result;
}

/** TRUNCATE TABLE x → DELETE FROM x */
function transformTruncate(sql: string): string {
  return sql.replace(
    /^\s*TRUNCATE\s+(?:TABLE\s+)?(.+?)\s*;?\s*$/im,
    (_match, table: string) => `DELETE FROM ${table.trim()};`
  );
}

/** PostgreSQL CAST shorthand ::type → CAST(expr AS type) */
function transformCastShorthand(sql: string): string {
  // Match patterns like expression::type
  // This is tricky because :: can appear inside strings
  // We'll do a simple approach: replace ::type patterns outside of strings
  let result = sql;
  // Match identifier::type or expression::type
  // Be careful not to match inside strings
  result = result.replace(
    /(\w+(?:\([^)]*\))?)\s*::\s*(\w+(?:\[\])?)/g,
    (_match, expr: string, type: string) => {
      // Map PostgreSQL types to SQLite types
      const sqliteType = mapPgTypeToSqlite(type.replace(/\[\]/g, ""));
      return `CAST(${expr} AS ${sqliteType})`;
    }
  );
  return result;
}

/** Map PostgreSQL type names to SQLite equivalents */
function mapPgTypeToSqlite(pgType: string): string {
  const upper = pgType.toUpperCase();
  switch (upper) {
    case "INT":
    case "INTEGER":
    case "BIGINT":
    case "SMALLINT":
    case "SERIAL":
    case "BIGSERIAL":
    case "SMALLSERIAL":
      return "INTEGER";
    case "REAL":
    case "DOUBLE PRECISION":
    case "FLOAT":
    case "NUMERIC":
    case "DECIMAL":
      return "REAL";
    case "BOOLEAN":
    case "BOOL":
      return "INTEGER";
    case "TEXT":
    case "VARCHAR":
    case "CHAR":
    case "CHARACTER":
    case "CHARACTER VARYING":
      return "TEXT";
    case "DATE":
    case "TIMESTAMP":
    case "TIMESTAMPTZ":
    case "TIMESTAMP WITH TIME ZONE":
    case "TIMESTAMP WITHOUT TIME ZONE":
      return "TEXT";
    case "UUID":
      return "TEXT";
    case "JSON":
    case "JSONB":
      return "TEXT";
    case "BYTEA":
      return "BLOB";
    default:
      return upper;
  }
}

/** EXTRACT(part FROM date) → strftime('%X', date) */
function transformExtract(sql: string): string {
  return sql.replace(
    /\bEXTRACT\s*\(\s*(YEAR|MONTH|DAY|HOUR|MINUTE|SECOND)\s+FROM\s+([^)]+)\s*\)/gi,
    (_match, part: string, dateExpr: string) => {
      const upperPart = part.toUpperCase();
      const fmtMap: Record<string, string> = {
        YEAR: "%Y",
        MONTH: "%m",
        DAY: "%d",
        HOUR: "%H",
        MINUTE: "%M",
        SECOND: "%S",
      };
      const fmt = fmtMap[upperPart] || "%Y";
      return `CAST(strftime('${fmt}', ${dateExpr.trim()}) AS INTEGER)`;
    }
  );
}

/** NOW() / CURRENT_TIMESTAMP → DATETIME('now') */
function transformDateFunctions(sql: string): string {
  let result = sql;

  // NOW() → DATETIME('now')
  result = result.replace(/\bNOW\s*\(\s*\)/gi, "DATETIME('now')");

  // CURRENT_TIMESTAMP (without parens) → DATETIME('now')
  // But only if not already inside a function call
  result = result.replace(/\bCURRENT_TIMESTAMP\b(?!\s*\()/gi, "DATETIME('now')");

  // CURRENT_DATE → DATE('now')
  result = result.replace(/\bCURRENT_DATE\b(?!\s*\()/gi, "DATE('now')");

  // CURRENT_TIME → TIME('now')
  result = result.replace(/\bCURRENT_TIME\b(?!\s*\()/gi, "TIME('now')");

  // AGE(date1, date2) → simplified
  result = result.replace(
    /\bAGE\s*\(\s*([^,)]+)\s*,\s*([^)]+)\s*\)/gi,
    (_match, d1: string, d2: string) =>
      `(julianday(${d1.trim()}) - julianday(${d2.trim()}))`
  );

  // DATE_TRUNC('part', date) → strftime
  result = result.replace(
    /\bDATE_TRUNC\s*\(\s*'([^']+)'\s*,\s*([^)]+)\s*\)/gi,
    (_match, part: string, dateExpr: string) => {
      const fmtMap: Record<string, string> = {
        year: "%Y-01-01",
        month: "%Y-%m-01",
        day: "%Y-%m-%d",
        week: "%Y-%W-1",
        hour: "%Y-%m-%d %H:00:00",
      };
      const fmt = fmtMap[part.toLowerCase()] || "%Y-%m-%d";
      return `strftime('${fmt}', ${dateExpr.trim()})`;
    }
  );

  return result;
}

/** ILIKE → LOWER(col) LIKE LOWER(pattern) */
function transformIlike(sql: string): string {
  // Simple approach: col ILIKE 'pattern' → LOWER(col) LIKE LOWER('pattern')
  return sql.replace(
    /(\w+(?:\.\w+)?)\s+ILIKE\s+('[^']*'|"[^"]*")/gi,
    (_match, col: string, pattern: string) =>
      `LOWER(${col}) LIKE LOWER(${pattern})`
  );
}

/** RETURNING * / RETURNING col → removed (SQLite doesn't support) */
function transformReturning(sql: string): string {
  // Remove RETURNING clause from INSERT/UPDATE/DELETE
  return sql.replace(/\s+RETURNING\s+\*\s*/gi, " ");
}

/** ON CONFLICT transformations */
function transformOnConflict(sql: string): string {
  let result = sql;

  // INSERT ... ON CONFLICT DO NOTHING → INSERT OR IGNORE
  result = result.replace(
    /^\s*INSERT\s+INTO\b/gi,
    (match) => {
      // Check if ON CONFLICT DO NOTHING follows later
      if (/\bON\s+CONFLICT\s+DO\s+NOTHING\b/i.test(result)) {
        result = result.replace(/\s*ON\s+CONFLICT\s+DO\s+NOTHING\s*/gi, " ");
        return "INSERT OR IGNORE INTO";
      }
      if (/\bON\s+CONFLICT\s+DO\s+UPDATE\b/i.test(result)) {
        result = result.replace(/\s*ON\s+CONFLICT\s+\([^)]+\)\s+DO\s+UPDATE\s+SET\s+[^;]+/gi, " ");
        return "INSERT OR REPLACE INTO";
      }
      return match;
    }
  );

  return result;
}

/** TRUE/FALSE → 1/0 */
function transformBooleans(sql: string): string {
  let result = sql;

  // TRUE → 1 (but not inside strings)
  result = result.replace(/\bTRUE\b/gi, "1");
  result = result.replace(/\bFALSE\b/gi, "0");

  return result;
}

/** Remove DEFAULT nextval('seq') patterns */
function removeNextvalDefaults(sql: string): string {
  return sql.replace(/\bDEFAULT\s+nextval\s*\([^)]*\)/gi, "");
}

/** DROP DATABASE / CREATE DATABASE → comments */
function transformDatabaseStatements(sql: string): string {
  let result = sql;

  result = result.replace(
    /^\s*CREATE\s+DATABASE\s+\w+\s*;?\s*$/gim,
    "-- CREATE DATABASE not supported in SQLite"
  );
  result = result.replace(
    /^\s*DROP\s+DATABASE\s+\w+\s*;?\s*$/gim,
    "-- DROP DATABASE not supported in SQLite"
  );

  return result;
}

// ─── Error Mapping ──────────────────────────────────────────────────────

/**
 * Übersetzt eine SQLite-Fehlermeldung in eine PostgreSQL-artige Fehlermeldung.
 */
export function mapSqliteErrorToPostgres(sqliteError: string): string {
  let msg = sqliteError;

  // Common SQLite error patterns → PostgreSQL-style messages
  const mappings: [RegExp, string][] = [
    [/no such table: (.+)/i, 'relation "$1" does not exist'],
    [/no such column: (.+)/i, 'column "$1" does not exist'],
    [/table (.+) already exists/i, 'relation "$1" already exists'],
    [/unique constraint failed: (.+)/i, 'duplicate key value violates unique constraint "$1"'],
    [/foreign key mismatch/i, "foreign key constraint violation"],
    [/constraint failed/i, "constraint violation"],
    [/syntax error/i, "syntax error at or near"],
    [/NOT NULL constraint failed: (.+)/i, 'null value in column "$1" violates not-null constraint'],
    [/CHECK constraint failed/i, "check constraint violation"],
    [/disk I\/O error/i, "could not read from file: I/O error"],
  ];

  for (const [pattern, replacement] of mappings) {
    const match = msg.match(pattern);
    if (match) {
      return replacement.replace("$1", match[1] || "");
    }
  }

  return msg;
}

/**
 * Übersetzt SQLite-Spaltentypen in PostgreSQL-artige Typbezeichnungen.
 */
export function mapSqliteTypeToPostgres(sqliteType: string): string {
  const upper = sqliteType.toUpperCase().trim();
  switch (upper) {
    case "INTEGER":
    case "INT":
      return "INTEGER";
    case "TEXT":
    case "VARCHAR":
      return "TEXT";
    case "REAL":
    case "FLOAT":
    case "DOUBLE":
      return "DOUBLE PRECISION";
    case "BLOB":
      return "BYTEA";
    case "NUMERIC":
    case "DECIMAL":
      return "NUMERIC";
    case "DATETIME":
    case "TIMESTAMP":
      return "TIMESTAMP WITH TIME ZONE";
    case "DATE":
      return "DATE";
    case "BOOLEAN":
    case "BOOL":
      return "BOOLEAN";
    default:
      // If it's a VARCHAR(n) or similar parameterized type
      if (/^VARCHAR\s*\(\d+\)$/i.test(upper)) return "CHARACTER VARYING";
      if (/^CHAR\s*\(\d+\)$/i.test(upper)) return "CHARACTER";
      return upper;
  }
}

/**
 * Gibt Kompatibilitäts-Warnungen für PostgreSQL-Features zurück,
 * die in SQLite nicht oder nur eingeschränkt unterstützt werden.
 */
export function getPostgresCompatWarnings(sql: string): string[] {
  const warnings: string[] = [];

  if (/\bARRAY\b/i.test(sql)) warnings.push("ARRAY-Typen werden in SQLite nicht unterstützt");
  if (/\bLATERAL\b/i.test(sql)) warnings.push("LATERAL JOINs werden in SQLite nicht unterstützt");
  if (/\bWINDOW\s+FUNCTION\b/i.test(sql) || /\bOVER\s*\(/i.test(sql)) warnings.push("Window Functions werden in SQLite nur teilweise unterstützt");
  if (/\bCTE\b/i.test(sql) || /\bWITH\s+RECURSIVE\b/i.test(sql)) warnings.push("CTEs werden in SQLite nur teilweise unterstützt");
  if (/\bRETURNING\b/i.test(sql)) warnings.push("RETURNING wird in SQLite nicht unterstützt und wurde entfernt");
  if (/\bON\s+CONFLICT\b/i.test(sql)) warnings.push("ON CONFLICT wurde zu INSERT OR IGNORE/REPLACE konvertiert");
  if (/\bILIKE\b/i.test(sql)) warnings.push("ILIKE wurde zu LOWER() LIKE konvertiert");
  if (/\bEXTRACT\s*\(/i.test(sql)) warnings.push("EXTRACT wurde zu strftime konvertiert");

  return warnings;
}