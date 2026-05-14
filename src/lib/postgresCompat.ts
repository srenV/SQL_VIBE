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

  // 1b. ALTER TABLE ADD COLUMN Transformationen
  result = transformAlterTableAddColumn(result);

  // 2. TRUNCATE TABLE → DELETE FROM
  result = transformTruncate(result);

  // 3. CAST shorthand ::type → CAST(expr AS type)
  result = transformCastShorthand(result);

  // 4. EXTRACT(part FROM date) → strftime
  result = transformExtract(result);

  // 5. NOW() / CURRENT_TIMESTAMP → DATETIME('now')
  result = transformDateFunctions(result);

  // 5b. NOT ILIKE → NOT LOWER() LIKE LOWER() (must come before ILIKE)
  result = transformNotIlike(result);

  // 6. ILIKE → LOWER() LIKE LOWER()
  result = transformIlike(result);

  // 6b. IS DISTINCT FROM / IS NOT DISTINCT FROM → IS / IS NOT (NULL-safe comparison)
  result = transformIsDistinctFrom(result);

  // 7. RETURNING → removed
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

  // 13. CREATE OR REPLACE VIEW → DROP VIEW IF EXISTS; CREATE VIEW
  result = transformCreateOrReplaceView(result);

  // 14. WITH CHECK OPTION → strip (SQLite doesn't support)
  result = transformWithCheckOption(result);

  return result;
}

// ─── Einzelne Transformationen ────────────────────────────────────────────

/** CREATE OR REPLACE VIEW → DROP VIEW IF EXISTS; CREATE VIEW (SQLite doesn't support OR REPLACE) */
function transformCreateOrReplaceView(sql: string): string {
  const match = sql.match(/^\s*CREATE\s+OR\s+REPLACE\s+VIEW\s+(\w+)\s+AS\s+([\s\S]+)$/i);
  if (match) {
    const viewName = match[1];
    const viewDef = match[2];
    return `DROP VIEW IF EXISTS "${viewName}"; CREATE VIEW "${viewName}" AS ${viewDef}`;
  }
  return sql;
}

/** WITH CHECK OPTION → strip from CREATE VIEW (SQLite doesn't support) */
function transformWithCheckOption(sql: string): string {
  // Strip WITH CHECK OPTION / WITH CASCADED CHECK OPTION / WITH LOCAL CHECK OPTION
  return sql.replace(/\s+WITH\s+(?:CASCADED\s+|LOCAL\s+)?CHECK\s+OPTION\s*;?\s*$/i, ';');
}

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

  // Protect string literals from type keyword replacement.
  // Replace content inside single quotes with placeholders, transform, then restore.
  const strings: string[] = [];
  let result = sql.replace(/'([^']*)'/g, (match) => {
    strings.push(match);
    return `__STR${strings.length - 1}__`;
  });

  // GENERATED ALWAYS AS IDENTITY / GENERATED BY DEFAULT AS IDENTITY → remove, convert to AUTOINCREMENT
  // Pattern: column_name INT GENERATED {ALWAYS | BY DEFAULT} AS IDENTITY [PRIMARY KEY]
  // Must come before INT → INTEGER conversion
  result = result.replace(
    /\b(\w+)\s+INT\s+GENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY\s+PRIMARY\s+KEY\b/gi,
    "$1 INTEGER PRIMARY KEY AUTOINCREMENT"
  );
  result = result.replace(
    /\b(\w+)\s+INTEGER\s+GENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY\s+PRIMARY\s+KEY\b/gi,
    "$1 INTEGER PRIMARY KEY AUTOINCREMENT"
  );
  // Also handle without PRIMARY KEY (identity column without explicit PK constraint)
  result = result.replace(
    /\b(\w+)\s+INT\s+GENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY\b/gi,
    "$1 INTEGER"
  );
  result = result.replace(
    /\b(\w+)\s+INTEGER\s+GENERATED\s+(?:ALWAYS|BY\s+DEFAULT)\s+AS\s+IDENTITY\b/gi,
    "$1 INTEGER"
  );

  // SERIAL PRIMARY KEY → INTEGER PRIMARY KEY AUTOINCREMENT (must come before bare SERIAL)
  result = result.replace(/\b(SMALL|BIG)?SERIAL\s+PRIMARY\s+KEY\b/gi, "INTEGER PRIMARY KEY AUTOINCREMENT");

  // SERIAL → INTEGER (for non-PK contexts, e.g. SERIAL without PRIMARY KEY)
  // BIGSERIAL → same
  result = result.replace(/\b(SMALL|BIG)?SERIAL\b/gi, "INTEGER");

  // Type mappings
  result = result.replace(/\bBOOLEAN\b/gi, "INTEGER");
  result = result.replace(/\bDOUBLE\s+PRECISION\b/gi, "REAL");
  result = result.replace(/\bCHARACTER\s+VARYING\s*\(\s*\d+\s*\)/gi, "TEXT");
  result = result.replace(/\bVARCHAR\s*\(\s*\d+\s*\)/gi, "TEXT");
  // TIMESTAMP WITH TIME ZONE must come before bare TIMESTAMP
  result = result.replace(/\bTIMESTAMP\s+WITH(?:OUT)?\s+TIME\s+ZONE\b/gi, "TEXT");
  result = result.replace(/\bTIMESTAMPTZ\b/gi, "TEXT");
  // Bare TIMESTAMP → TEXT (SQLite has no TIMESTAMP type)
  result = result.replace(/\bTIMESTAMP\b/gi, "TEXT");
  result = result.replace(/\bINT\s+DEFAULT\s+NEXTVAL\s*\([^)]+\)\s*NOT\s+NULL\b/gi, "INTEGER NOT NULL");
  // DECIMAL(n,m) / NUMERIC(n,m) → REAL (SQLite hat kein echtes DECIMAL)
  result = result.replace(/\bDECIMAL\s*\(\s*\d+\s*,\s*\d+\s*\)/gi, "REAL");
  result = result.replace(/\bNUMERIC\s*\(\s*\d+\s*,\s*\d+\s*\)/gi, "REAL");
  // INT → INTEGER (SQLite requires INTEGER for PRIMARY KEY AUTOINCREMENT)
  result = result.replace(/\bINT\b(\s*\(\s*\d+\s*\))?/gi, "INTEGER");
  result = result.replace(/\bBIGINT\b/gi, "INTEGER");
  result = result.replace(/\bSMALLINT\b/gi, "INTEGER");

  // Restore string literals
  result = result.replace(/__STR(\d+)__/g, (_, idx) => strings[parseInt(idx)]);

  return result;
}

/** ALTER TABLE ADD COLUMN: PostgreSQL-Typen → SQLite-Typen */
function transformAlterTableAddColumn(sql: string): string {
  if (!/^\s*ALTER\s+TABLE\b/i.test(sql)) return sql;
  // Only transform ADD COLUMN statements
  if (!/\bADD\s+COLUMN\b/i.test(sql)) return sql;

  let result = sql;

  // Type mappings (same as CREATE TABLE)
  result = result.replace(/\bBOOLEAN\b/gi, "INTEGER");
  result = result.replace(/\bDOUBLE\s+PRECISION\b/gi, "REAL");
  result = result.replace(/\bCHARACTER\s+VARYING\s*\(\s*\d+\s*\)/gi, "TEXT");
  result = result.replace(/\bVARCHAR\s*\(\s*\d+\s*\)/gi, "TEXT");
  result = result.replace(/\bTIMESTAMP\s+WITH(?:OUT)?\s+TIME\s+ZONE\b/gi, "TEXT");
  result = result.replace(/\bTIMESTAMPTZ\b/gi, "TEXT");
  result = result.replace(/\bTIMESTAMP\b/gi, "TEXT");
  result = result.replace(/\bDECIMAL\s*\(\s*\d+\s*,\s*\d+\s*\)/gi, "REAL");
  result = result.replace(/\bNUMERIC\s*\(\s*\d+\s*,\s*\d+\s*\)/gi, "REAL");
  result = result.replace(/\bINT\b(\s*\(\s*\d+\s*\))?/gi, "INTEGER");
  result = result.replace(/\bBIGINT\b/gi, "INTEGER");
  result = result.replace(/\bSMALLINT\b/gi, "INTEGER");

  // TRUE/FALSE in DEFAULT values
  result = result.replace(/\bDEFAULT\s+TRUE\b/gi, "DEFAULT 1");
  result = result.replace(/\bDEFAULT\s+FALSE\b/gi, "DEFAULT 0");

  // DEFAULT CURRENT_TIMESTAMP protection
  result = result.replace(/\bDEFAULT\s+CURRENT_TIMESTAMP\s*\(\s*\)/gi, "DEFAULT __PG_CURRENT_TS__");
  result = result.replace(/\bDEFAULT\s+CURRENT_TIMESTAMP\b/gi, "DEFAULT __PG_CURRENT_TS__");
  result = result.replace(/__PG_CURRENT_TS__/g, "CURRENT_TIMESTAMP");

  return result;
}

/** TRUNCATE TABLE x → DELETE FROM x */
function transformTruncate(sql: string): string {
  return sql.replace(
    /^\s*TRUNCATE\s+(?:TABLE\s+)?(.+?)\s*;?\s*$/im,
    (_match, table: string) => `DELETE FROM ${table.trim()};`
  );
}

/**
 * Protect string literals in SQL by replacing them with placeholders.
 * Returns { masked: string, strings: string[] } where strings can be used to restore.
 */
function protectStringLiterals(sql: string): { masked: string; strings: string[] } {
  const strings: string[] = [];
  const masked = sql.replace(/'([^']*)'/g, (match) => {
    strings.push(match);
    return `__STR${strings.length - 1}__`;
  });
  return { masked, strings };
}

/** Restore string literals from placeholders */
function restoreStringLiterals(sql: string, strings: string[]): string {
  return sql.replace(/__STR(\d+)__/g, (_, idx) => strings[parseInt(idx)]);
}

/** PostgreSQL CAST shorthand ::type → CAST(expr AS type) */
function transformCastShorthand(sql: string): string {
  // Protect string literals from ::type replacement
  const { masked: result, strings } = protectStringLiterals(sql);

  // Match identifier::type or expression::type
  let transformed = result.replace(
    /(\w+(?:\([^)]*\))?)\s*::\s*(\w+(?:\[\])?)/g,
    (_match, expr: string, type: string) => {
      // Map PostgreSQL types to SQLite types
      const sqliteType = mapPgTypeToSqlite(type.replace(/\[\]/g, ""));
      return `CAST(${expr} AS ${sqliteType})`;
    }
  );

  return restoreStringLiterals(transformed, strings);
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
  // Protect string literals from EXTRACT replacement
  const { masked: result, strings } = protectStringLiterals(sql);

  const transformed = result.replace(
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

  return restoreStringLiterals(transformed, strings);
}

/**
 * Extract a balanced-parenthesis group starting at `startIdx` (which should point to '(').
 * Returns the index of the matching ')' or -1 if not found.
 */
function findMatchingParen(sql: string, startIdx: number): number {
  let depth = 0;
  for (let i = startIdx; i < sql.length; i++) {
    if (sql[i] === '(') depth++;
    if (sql[i] === ')') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/**
 * Extract the content between balanced parentheses starting at `startIdx`.
 * Returns the inner content (without the parens) or null if unbalanced.
 */
function extractBalancedContent(sql: string, startIdx: number): { content: string; endIdx: number } | null {
  const closeIdx = findMatchingParen(sql, startIdx);
  if (closeIdx === -1) return null;
  return { content: sql.substring(startIdx + 1, closeIdx), endIdx: closeIdx };
}

/** STRING_AGG(expr, delimiter) → GROUP_CONCAT(expr, delimiter) with balanced-paren support */
function transformStringAgg(sql: string): string {
  const result: string[] = [];
  let i = 0;
  const upper = sql.toUpperCase();
  while (i < sql.length) {
    // Look for STRING_AGG(
    if (upper.substring(i, i + 10) === 'STRING_AGG' && sql[i + 10] === '(') {
      // Find the matching close paren for STRING_AGG
      const aggEnd = findMatchingParen(sql, i + 10);
      if (aggEnd === -1) {
        result.push(sql[i]);
        i++;
        continue;
      }
      // Extract inner content: "expr, delimiter"
      const inner = sql.substring(i + 11, aggEnd);
      // Split on the first top-level comma
      const commaIdx = findTopLevelComma(inner);
      if (commaIdx === -1) {
        result.push(sql[i]);
        i++;
        continue;
      }
      const expr = inner.substring(0, commaIdx).trim();
      const delim = inner.substring(commaIdx + 1).trim();
      result.push(`GROUP_CONCAT(${expr}, ${delim})`);
      i = aggEnd + 1;
    } else {
      result.push(sql[i]);
      i++;
    }
  }
  return result.join('');
}

/** Find the first top-level comma in a string (not inside parentheses) */
function findTopLevelComma(s: string): number {
  let depth = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '(') depth++;
    if (s[i] === ')') depth--;
    if (s[i] === ',' && depth === 0) return i;
  }
  return -1;
}

/** FILTER (WHERE cond) on aggregates → CASE WHEN, with balanced-paren support */
function transformFilterWhere(sql: string): string {
  const result: string[] = [];
  let i = 0;
  const upper = sql.toUpperCase();
  const aggFuncs = ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'];

  while (i < sql.length) {
    let matched = false;
    for (const func of aggFuncs) {
      if (upper.substring(i, i + func.length) === func && sql[i + func.length] === '(') {
        // Found an aggregate function — extract its balanced content
        const aggOpen = i + func.length; // index of '('
        const aggEnd = findMatchingParen(sql, aggOpen);
        if (aggEnd === -1) break; // unbalanced, skip

        // Check if FILTER follows
        const afterAgg = sql.substring(aggEnd + 1).replace(/^\s+/, '');
        if (afterAgg.toUpperCase().startsWith('FILTER')) {
          const filterStart = aggEnd + 1 + (sql.length - (aggEnd + 1) - afterAgg.length) + 6; // after "FILTER"
          // Find the '(' after FILTER
          const filterParenStart = sql.indexOf('(', aggEnd + 1);
          if (filterParenStart === -1 || filterParenStart > filterStart + 10) break; // not FILTER(WHERE...)

          const filterContent = extractBalancedContent(sql, filterParenStart);
          if (!filterContent) break;

          // filterContent.content should start with "WHERE ..."
          const condStr = filterContent.content.trim();
          if (!condStr.toUpperCase().startsWith('WHERE')) break;

          const cond = condStr.substring(5).trim(); // remove "WHERE"
          const expr = sql.substring(aggOpen + 1, aggEnd).trim();

          if (func === 'COUNT') {
            result.push(`SUM(CASE WHEN ${cond} THEN 1 ELSE 0 END)`);
          } else {
            result.push(`${func}(CASE WHEN ${cond} THEN ${expr} ELSE NULL END)`);
          }
          i = filterContent.endIdx + 1;
          matched = true;
          break;
        }
      }
    }
    if (!matched) {
      result.push(sql[i]);
      i++;
    }
  }
  return result.join('');
}

/** NOW() / CURRENT_TIMESTAMP → DATETIME('now'), but preserve DEFAULT CURRENT_TIMESTAMP and string literals */
function transformDateFunctions(sql: string): string {
  // Protect string literals from date function replacement.
  // Replace content inside single quotes with placeholders, transform, then restore.
  const strings: string[] = [];
  let result = sql.replace(/'([^']*)'/g, (match) => {
    strings.push(match);
    return `__STR${strings.length - 1}__`;
  });

  // Protect CURRENT_TIMESTAMP in DEFAULT clauses from being converted.
  // SQLite natively supports DEFAULT CURRENT_TIMESTAMP but NOT DEFAULT DATETIME('now').
  result = result.replace(/\bDEFAULT\s+CURRENT_TIMESTAMP\s*\(\s*\)/gi, "DEFAULT __PG_CURRENT_TS__");
  result = result.replace(/\bDEFAULT\s+CURRENT_TIMESTAMP\b/gi, "DEFAULT __PG_CURRENT_TS__");

  // NOW() → DATETIME('now')
  result = result.replace(/\bNOW\s*\(\s*\)/gi, "DATETIME('now')");

  // CURRENT_TIMESTAMP() → DATETIME('now') (with parens — PG function call syntax)
  result = result.replace(/\bCURRENT_TIMESTAMP\s*\(\s*\)/gi, "DATETIME('now')");

  // CURRENT_TIMESTAMP (without parens) → DATETIME('now')
  result = result.replace(/\bCURRENT_TIMESTAMP\b(?!\s*\()/gi, "DATETIME('now')");

  // Restore protected DEFAULT CURRENT_TIMESTAMP
  result = result.replace(/__PG_CURRENT_TS__/g, "CURRENT_TIMESTAMP");

  // CURRENT_DATE → DATE('now')
  result = result.replace(/\bCURRENT_DATE\b(?!\s*\()/gi, "DATE('now')");

  // CURRENT_TIME → TIME('now')
  result = result.replace(/\bCURRENT_TIME\b(?!\s*\()/gi, "TIME('now')");

  // Restore string literals
  result = result.replace(/__STR(\d+)__/g, (_, idx) => strings[parseInt(idx)]);

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

  // STRING_AGG(expr, delimiter) → GROUP_CONCAT(expr, delimiter)
  // PG: STRING_AGG(name, ', ') → SQLite: GROUP_CONCAT(name, ', ')
  // Uses balanced-paren matching to handle nested function calls inside expr
  result = transformStringAgg(result);

  // FILTER (WHERE cond) on aggregates → CASE WHEN cond THEN expr ELSE null END
  // PG: COUNT(*) FILTER (WHERE status = 'active') → SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END)
  // PG: SUM(x) FILTER (WHERE cond) → SUM(CASE WHEN cond THEN x ELSE NULL END)
  // PG: AVG(x) FILTER (WHERE cond) → AVG(CASE WHEN cond THEN x ELSE NULL END)
  // Uses a function-based approach to handle nested parentheses in aggregate arguments
  result = transformFilterWhere(result);

  // TO_CHAR(expr, format) → strftime(format, expr)
  // PG: TO_CHAR(date_col, 'YYYY-MM-DD') → SQLite: strftime('%Y-%m-%d', date_col)
  result = result.replace(
    /\bTO_CHAR\s*\(\s*([^,]+)\s*,\s*'([^']+)'\s*\)/gi,
    (_match, expr: string, pgFmt: string) => {
      const sqliteFmt = convertPgDateFormat(pgFmt);
      return `strftime('${sqliteFmt}', ${expr.trim()})`;
    }
  );

  // TO_NUMBER(expr) → CAST(expr AS INTEGER)
  result = result.replace(
    /\bTO_NUMBER\s*\(\s*([^)]+)\s*\)/gi,
    (_match, expr: string) => `CAST(${expr.trim()} AS INTEGER)`
  );

  // TO_DATE(expr, format) → date(expr) (simplified — SQLite's date() only handles ISO-8601)
  result = result.replace(
    /\bTO_DATE\s*\(\s*([^,]+)\s*,\s*'[^']*'\s*\)/gi,
    (_match) => {
      // Extract just the first argument (the date string expression)
      const argMatch = _match.match(/\bTO_DATE\s*\(\s*([^,]+)/i);
      return `date(${argMatch ? argMatch[1].trim() : '?'})`;
    }
  );

  return result;
}

/** NOT ILIKE → LOWER(col) NOT LIKE LOWER(pattern) with expression support (must come before ILIKE) */
function transformNotIlike(sql: string): string {
  // Protect string literals from NOT ILIKE replacement
  const { masked: result, strings } = protectStringLiterals(sql);

  // Handles: col NOT ILIKE 'pattern', LOWER(col) NOT ILIKE 'pattern', expr NOT ILIKE 'pattern'
  // Left side: word, table.word, or function call like LOWER(col)
  // Right side: string literal or word
  const leftExpr = "(\\w+(?:\\.\\w+)?(?:\\s*\\([^)]*\\))?)";
  const rightExpr = "('[^']*'|\"[^\"]*\"|\\w+(?:\\.\\w+)?)";
  const transformed = result.replace(
    new RegExp(`${leftExpr}\\s+NOT\\s+ILIKE\\s+${rightExpr}`, "gi"),
    (_match, col: string, pattern: string) =>
      `LOWER(${col}) NOT LIKE LOWER(${pattern})`
  );

  return restoreStringLiterals(transformed, strings);
}

/** ILIKE → LOWER(col) LIKE LOWER(pattern) with expression support */
function transformIlike(sql: string): string {
  // Protect string literals from ILIKE replacement
  const { masked: result, strings } = protectStringLiterals(sql);

  // Handles: col ILIKE 'pattern', LOWER(col) ILIKE 'pattern', expr ILIKE 'pattern'
  // Left side: word, table.word, or function call like LOWER(col)
  // Right side: string literal or word
  const leftExpr = "(\\w+(?:\\.\\w+)?(?:\\s*\\([^)]*\\))?)";
  const rightExpr = "('[^']*'|\"[^\"]*\"|\\w+(?:\\.\\w+)?)";
  const transformed = result.replace(
    new RegExp(`${leftExpr}\\s+ILIKE\\s+${rightExpr}`, "gi"),
    (_match, col: string, pattern: string) =>
      `LOWER(${col}) LIKE LOWER(${pattern})`
  );

  return restoreStringLiterals(transformed, strings);
}

/** IS DISTINCT FROM / IS NOT DISTINCT FROM → NULL-safe comparison */
function transformIsDistinctFrom(sql: string): string {
  // Protect string literals from IS DISTINCT FROM replacement
  const { masked: result, strings } = protectStringLiterals(sql);

  // IS NOT DISTINCT FROM → IS (NULL-safe equality: a IS NOT DISTINCT FROM b → a IS b)
  // Must come before IS DISTINCT FROM so the negated form is matched first
  // Operand can be: column name, table.column, string literal, number, NULL
  const operand = "(\\w+(?:\\.\\w+)?|'[^']*'|\\d+|NULL)";
  let transformed = result.replace(
    new RegExp(`(\\w+(?:\\.\\w+)?)\\s+IS\\s+NOT\\s+DISTINCT\\s+FROM\\s+${operand}`, "gi"),
    "$1 IS $2"
  );

  // IS DISTINCT FROM → IS NOT (NULL-safe inequality: a IS DISTINCT FROM b → a IS NOT b)
  transformed = transformed.replace(
    new RegExp(`(\\w+(?:\\.\\w+)?)\\s+IS\\s+DISTINCT\\s+FROM\\s+${operand}`, "gi"),
    "$1 IS NOT $2"
  );

  return restoreStringLiterals(transformed, strings);
}

/** RETURNING * / RETURNING col1, col2 → removed (SQLite doesn't support) */
function transformReturning(sql: string): string {
  // Remove RETURNING clause from INSERT/UPDATE/DELETE
  // Matches: RETURNING *, RETURNING id, RETURNING id, name, etc.
  return sql.replace(/\s+RETURNING\s+[^;]+(?=;|$)/gi, "");
}

/** ON CONFLICT transformations */
function transformOnConflict(sql: string): string {
  let result = sql;

  // INSERT ... ON CONFLICT DO NOTHING → INSERT OR IGNORE
  if (/\bON\s+CONFLICT\s+DO\s+NOTHING\b/i.test(result)) {
    result = result.replace(/\s*ON\s+CONFLICT\s+DO\s+NOTHING\s*/gi, " ");
    result = result.replace(/^\s*INSERT\s+INTO\b/gi, "INSERT OR IGNORE INTO");
  }

  // INSERT ... ON CONFLICT (col) DO UPDATE SET ... → INSERT OR REPLACE INTO
  if (/\bON\s+CONFLICT\s+\([^)]+\)\s+DO\s+UPDATE\b/i.test(result)) {
    result = result.replace(/\s*ON\s+CONFLICT\s+\([^)]+\)\s+DO\s+UPDATE\s+SET\s+[^;]+/gi, "");
    result = result.replace(/^\s*INSERT\s+INTO\b/gi, "INSERT OR REPLACE INTO");
  }

  // INSERT ... ON CONFLICT DO NOTHING (without column list)
  if (/\bON\s+CONFLICT\s+DO\s+NOTHING\b/i.test(result)) {
    result = result.replace(/\s*ON\s+CONFLICT\s+DO\s+NOTHING\s*/gi, " ");
    result = result.replace(/^\s*INSERT\s+INTO\b/gi, "INSERT OR IGNORE INTO");
  }

  return result;
}

/** TRUE/FALSE → 1/0 */
function transformBooleans(sql: string): string {
  // Protect string literals before replacing TRUE/FALSE.
  // Replace content inside single quotes with placeholders, transform, then restore.
  const strings: string[] = [];
  let result = sql.replace(/'([^']*)'/g, (match) => {
    strings.push(match);
    return `__STR${strings.length - 1}__`;
  });

  result = result.replace(/\bTRUE\b/gi, "1");
  result = result.replace(/\bFALSE\b/gi, "0");

  // Restore string literals
  result = result.replace(/__STR(\d+)__/g, (_, idx) => strings[parseInt(idx)]);

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
    [/no such view: (.+)/i, 'view "$1" does not exist'],
    [/no such column: (.+)/i, 'column "$1" does not exist'],
    [/table (.+) already exists/i, 'relation "$1" already exists'],
    [/view (.+) already exists/i, 'view "$1" already exists'],
    [/cannot modify view (.+)/i, 'cannot modify view "$1"'],
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
  if (/\bIS\s+DISTINCT\s+FROM\b/i.test(sql)) warnings.push("IS DISTINCT FROM wurde zu IS NOT konvertiert (NULL-safe)");
  if (/\bIS\s+NOT\s+DISTINCT\s+FROM\b/i.test(sql)) warnings.push("IS NOT DISTINCT FROM wurde zu IS konvertiert (NULL-safe)");
  if (/\bSTRING_AGG\s*\(/i.test(sql)) warnings.push("STRING_AGG wurde zu GROUP_CONCAT konvertiert");
  if (/\bFILTER\s*\(\s*WHERE\b/i.test(sql)) warnings.push("FILTER (WHERE ...) wurde zu CASE WHEN konvertiert");
  if (/\bTO_CHAR\s*\(/i.test(sql)) warnings.push("TO_CHAR wurde zu strftime konvertiert");
  if (/\bTO_NUMBER\s*\(/i.test(sql)) warnings.push("TO_NUMBER wurde zu CAST(... AS INTEGER) konvertiert");
  if (/\bTO_DATE\s*\(/i.test(sql)) warnings.push("TO_DATE wurde zu date() konvertiert");

  return warnings;
}

/**
 * Konvertiert PostgreSQL-TO_CHAR-Format-Specifiers zu SQLite-strftime-Specifiers.
 * PG: YYYY, YY, MM, DD, HH24, HH12, MI, SS, Day, Dy, Month, Mon
 * SQLite: %Y, %y, %m, %d, %H, %I, %M, %S, %w, %j, %W
 */
function convertPgDateFormat(pgFmt: string): string {
  return pgFmt
    .replace(/YYYY/g, "%Y")
    .replace(/YY/g, "%y")
    .replace(/MM/g, "%m")
    .replace(/DD/g, "%d")
    .replace(/HH24/g, "%H")
    .replace(/HH12/g, "%I")
    .replace(/HH/g, "%H")
    .replace(/MI/g, "%M")
    .replace(/SS/g, "%S")
    .replace(/Day/g, "%A")    // Full weekday name (SQLite %A)
    .replace(/Dy/g, "%a")     // Abbreviated weekday name (SQLite %a)
    .replace(/Month/g, "%B")  // Full month name (SQLite %B)
    .replace(/Mon/g, "%b");  // Abbreviated month name (SQLite %b)
}