/**
 * MySQL-Kompatibilitäts-Layer für SQLite (sql.js).
 *
 * Übersetzt MySQL-Syntax zu SQLite-äquivalenten Ausdrücken,
 * damit User MySQL-Syntax schreiben können, die unter der Haube
 * auf SQLite ausgeführt wird.
 *
 * Unterstützte Transformationen:
 * - RIGHT JOIN → LEFT JOIN (Tabellen vertauscht)
 * - AUTO_INCREMENT → AUTOINCREMENT
 * - IFNULL() → IFNULL() (identisch in SQLite)
 * - IF(expr, a, b) → CASE WHEN expr THEN a ELSE b END
 * - CONCAT(a, b, ...) → a || b || ...
 * - CONCAT_WS(sep, a, b) → a || sep || b (vereinfacht)
 * - NOW() / CURDATE() / CURRENT_TIMESTAMP → DATE('now')/DATETIME('now')
 * - DATE_FORMAT(date, fmt) → strftime(fmt, date)
 * - YEAR(date) → CAST(strftime('%Y', date) AS INTEGER)
 * - MONTH(date) → CAST(strftime('%m', date) AS INTEGER)
 * - DAY(date) → CAST(strftime('%d', date) AS INTEGER)
 * - DATEDIFF(d1, d2) → CAST(julianday(d1) - julianday(d2) AS INTEGER)
 * - LIMIT x, y → LIMIT y OFFSET x
 * - GROUP_CONCAT(col, sep) → GROUP_CONCAT(col, sep) (identisch)
 * - SHOW TABLES → SELECT name FROM sqlite_master WHERE type='table'
 * - DESCRIBE / SHOW COLUMNS → PRAGMA table_info
 * - TRUNCATE TABLE x → DELETE FROM x
 * - INSERT ... ON DUPLICATE KEY UPDATE → INSERT OR REPLACE
 * - UNSIGNED-Keyword → entfernt
 * - ENGINE=... / CHARACTER SET ... / COLLATE ... → entfernt
 * - BACKTICK-Quotes → DOUBLE-QUOTE
 * - BOOLEAN → INTEGER
 * - DATETIME → TEXT
 * - DOUBLE / FLOAT → REAL
 */

/**
 * Hauptfunktion: Übersetzt eine MySQL-SQL-Anweisung zu SQLite-kompatibler Syntax.
 * Wird vor der Ausführung auf der sql.js-Engine aufgerufen.
 *
 * @param sql - Die MySQL-SQL-Anweisung
 * @returns Die SQLite-kompatible Anweisung
 */
export function mysqlToSqlite(sql: string): string {
  let result = sql;

  // 0. phpMyAdmin-Kommentare entfernen: /*!40101 ... */ und /*!...*/
  // Diese sind MySQL-Version-bedingte Kommentare, die in phpMyAdmin-Exports vorkommen
  // Das Semikolon nach dem Kommentar wird auch entfernt
  result = result.replace(/\/\*!\d*\s*[\s\S]*?\*\/\s*;?\s*/g, "");

  // 0b. MySQL-SET-Befehle entfernen (SET SQL_MODE, SET time_zone, SET NAMES, etc.)
  // Diese werden von phpMyAdmin-Exports generiert und sind in SQLite nicht nötig
  // Auch START TRANSACTION und COMMIT entfernen
  // Match standalone lines and inline statements (SET ...; or SET ...\n)
  result = result.replace(/^\s*SET\s+SQL_MODE\s*=[^;\n]*;?\s*/gim, "");
  result = result.replace(/^\s*SET\s+time_zone\s*=[^;\n]*;?\s*/gim, "");
  result = result.replace(/^\s*SET\s+NAMES\s+\S+[^;\n]*;?\s*/gim, "");
  result = result.replace(/^\s*START\s+TRANSACTION\s*;?\s*/gim, "");
  result = result.replace(/^\s*COMMIT\s*;?\s*/gim, "");

  // 1. Kommentare entfernen (für zuverlässiges Parsing)
  // Aber wir müssen sie behalten — nur für die Transformation relevant

  // 2. Backtick-Quotes → Double-Quote
  result = replaceBackticks(result);

  // 3. CREATE TABLE Transformationen
  result = transformCreateTable(result);

  // 4. RIGHT JOIN → LEFT JOIN (Tabellen vertauscht)
  result = transformRightJoin(result);

  // 5. TRUNCATE TABLE → DELETE FROM
  result = transformTruncate(result);

  // 6. SHOW TABLES / DESCRIBE / SHOW COLUMNS
  result = transformShowAndDescribe(result);

  // 7. LIMIT x, y → LIMIT y OFFSET x (MySQL-Pagination)
  result = transformLimitOffset(result);

  // 8. Funktions-Transformationen
  result = transformFunctions(result);

  // 9. INSERT ... ON DUPLICATE KEY UPDATE → INSERT OR REPLACE
  result = transformOnDuplicateKey(result);

  // 10. UNSIGNED-Keyword entfernen
  result = removeUnsigned(result);

  // 11. TRUE/FALSE → 1/0 (SQLite hat keinen Boolean-Typ)
  result = transformBooleans(result);

  // 12. ENGINE= / CHARACTER SET / COLLATE / AUTO_INCREMENT-Table-Option entfernen
  result = removeMysqlTableOptions(result);

  // 12. ALTER TABLE MySQL-Befehle → SQLite-Äquivalente
  result = transformAlterTable(result);

  // 13. DROP DATABASE / CREATE DATABASE / USE → Kommentare (SQLite hat keine Multi-DB)
  result = transformDatabaseStatements(result);

  return result;
}

// ─── Einzelne Transformationen ────────────────────────────────────────────

/** Backtick-Quotes → Double-Quote */
function replaceBackticks(sql: string): string {
  return sql.replace(/`([^`]+)`/g, '"$1"');
}

/** CREATE TABLE: MySQL-Typen → SQLite-Typen, AUTO_INCREMENT → AUTOINCREMENT */
function transformCreateTable(sql: string): string {
  // Nur anwenden wenn es ein CREATE TABLE ist
  if (!/^\s*CREATE\s+TABLE\b/i.test(sql)) return sql;

  // Protect string literals from type keyword replacement.
  // Replace content inside single quotes with placeholders, transform, then restore.
  const strings: string[] = [];
  let result = sql.replace(/'([^']*)'/g, (match) => {
    strings.push(match);
    return `__STR${strings.length - 1}__`;
  });

  // AUTO_INCREMENT → AUTOINCREMENT (nur innerhalb von CREATE TABLE)
  result = result.replace(/\bAUTO_INCREMENT\b/gi, "AUTOINCREMENT");

  // SQLite verlangt: INTEGER PRIMARY KEY AUTOINCREMENT
  // MySQL schreibt: INT AUTO_INCREMENT PRIMARY KEY
  // Nach obiger Transformation: INTEGER AUTOINCREMENT PRIMARY KEY
  // Muss umsortiert werden zu: INTEGER PRIMARY KEY AUTOINCREMENT
  result = result.replace(/\bAUTOINCREMENT\s+PRIMARY\s+KEY\b/gi, "PRIMARY KEY AUTOINCREMENT");

  // BOOLEAN → INTEGER (SQLite speichert BOOL als INT)
  result = result.replace(/\bBOOLEAN\b/gi, "INTEGER");

  // DATETIME → TEXT (SQLite hat keinen DATETIME-Typ)
  result = result.replace(/\bDATETIME\b/gi, "TEXT");

  // DOUBLE / FLOAT → REAL
  result = result.replace(/\bDOUBLE\b(?!\s*\()/gi, "REAL");
  result = result.replace(/\bFLOAT\s*\(\s*\d+\s*,\s*\d+\s*\)/gi, "REAL");
  result = result.replace(/\bFLOAT\b(?!\s*\()/gi, "REAL");

  // TINYINT / SMALLINT / MEDIUMINT / BIGINT → INTEGER
  result = result.replace(/\bTINYINT\b(\(\d+\))?/gi, "INTEGER");
  result = result.replace(/\bSMALLINT\b(\(\d+\))?/gi, "INTEGER");
  result = result.replace(/\bMEDIUMINT\b(\(\d+\))?/gi, "INTEGER");
  result = result.replace(/\bBIGINT\b(\(\d+\))?/gi, "INTEGER");

  // INT → INTEGER (SQLite verlangt INTEGER PRIMARY KEY für AUTOINCREMENT;
  // INT PRIMARY KEY AUTOINCREMENT ist ungültig und wird stillschweigend ignoriert)
  // Muss NACH TINYINT/SMALLINT/MEDIUMINT/BIGINT kommen, da diese bereits
  // zu INTEGER transformiert wurden und \bINT\b nicht in INTEGER matcht.
  result = result.replace(/\bINT\b(\(\d+\))?/gi, "INTEGER");

  // VARCHAR(n) / CHAR(n) → TEXT (SQLite hat keine Längenbeschränkung bei TEXT)
  result = result.replace(/\bVARCHAR\s*\(\s*\d+\s*\)/gi, "TEXT");
  result = result.replace(/\bCHAR\s*\(\s*\d+\s*\)/gi, "TEXT");

  // DECIMAL(n,m) / NUMERIC(n,m) → REAL (SQLite hat kein echtes DECIMAL)
  result = result.replace(/\bDECIMAL\s*\(\s*\d+\s*,\s*\d+\s*\)/gi, "REAL");
  result = result.replace(/\bNUMERIC\s*\(\s*\d+\s*,\s*\d+\s*\)/gi, "REAL");

  // ON UPDATE CURRENT_TIMESTAMP entfernen (SQLite-Feature nicht vorhanden)
  result = result.replace(/\bON\s+UPDATE\s+CURRENT_TIMESTAMP\b/gi, "");

  // Restore string literals
  result = result.replace(/__STR(\d+)__/g, (_, idx) => strings[parseInt(idx)]);

  return result;
}

/** RIGHT JOIN → LEFT JOIN mit vertauschten Tabellen */
function transformRightJoin(sql: string): string {
  // Zweistufig: Erst RIGHT JOIN markieren, dann Tabellen vertauschen
  let result = sql.replace(/\bRIGHT\s+JOIN\b/gi, "LEFT_JOIN_SWAPPED");

  // Pattern: ... FROM left_table [alias] LEFT_JOIN_SWAPPED right_table [alias] ON ...
  // Wir müssen das FROM-Keyword berücksichtigen
  result = result.replace(
    /\bFROM\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?\s+LEFT_JOIN_SWAPPED\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?\s+ON\s+/gi,
    (_, lt, la, rt, ra) => {
      const left = la ? `${lt} ${la}` : lt;
      const right = ra ? `${rt} ${ra}` : rt;
      return `FROM ${right} LEFT JOIN ${left} ON `;
    }
  );

  // Fallback für JOINs ohne FROM (z.B. in Subqueries nach Komma)
  result = result.replace(
    /(\w+)(?:\s+(?:AS\s+)?(\w+))?\s+LEFT_JOIN_SWAPPED\s+(\w+)(?:\s+(?:AS\s+)?(\w+))?\s+ON\s+/gi,
    (_, lt, la, rt, ra) => {
      const left = la ? `${lt} ${la}` : lt;
      const right = ra ? `${rt} ${ra}` : rt;
      return `${right} LEFT JOIN ${left} ON `;
    }
  );

  return result;
}

/** TRUNCATE TABLE x → DELETE FROM x */
function transformTruncate(sql: string): string {
  return sql.replace(
    /^\s*TRUNCATE\s+TABLE\s+(\w+)/gi,
    (_, table) => `DELETE FROM ${table}`
  );
}

/** SHOW TABLES / DESCRIBE / SHOW COLUMNS → SQLite-Äquivalente */
function transformShowAndDescribe(sql: string): string {
  const trimmed = sql.trim();

  // SHOW TABLES LIKE 'pattern' (must come before plain SHOW TABLES)
  const showTablesLike = trimmed.match(
    /^\s*SHOW\s+TABLES\s+LIKE\s+'([^']+)'/i
  );
  if (showTablesLike) {
    const pattern = showTablesLike[1].replace(/%/g, "%").replace(/_/g, "_");
    return `SELECT name AS \`Table\` FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' AND name LIKE '${pattern}' ORDER BY name;`;
  }

  // SHOW TABLES FROM db (ignoriert DB-Name, must come before plain SHOW TABLES)
  if (/^\s*SHOW\s+TABLES\s+FROM\b/i.test(trimmed)) {
    return "SELECT name AS `Table` FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name;";
  }

  // SHOW TABLES
  if (/^\s*SHOW\s+TABLES\b/i.test(trimmed)) {
    return "SELECT name AS `Table` FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name;";
  }

  // DESCRIBE table / DESC table
  const describeMatch = trimmed.match(
    /^\s*(?:DESCRIBE|DESC)\s+(\w+)/i
  );
  if (describeMatch) {
    const table = describeMatch[1];
    return `PRAGMA table_info("${table}");`;
  }

  // SHOW COLUMNS FROM table / SHOW FIELDS FROM table
  const showColsMatch = trimmed.match(
    /^\s*SHOW\s+(?:COLUMNS|FIELDS)\s+FROM\s+(\w+)/i
  );
  if (showColsMatch) {
    const table = showColsMatch[1];
    return `PRAGMA table_info("${table}");`;
  }

  // SHOW CREATE TABLE table
  const showCreateMatch = trimmed.match(
    /^\s*SHOW\s+CREATE\s+TABLE\s+(\w+)/i
  );
  if (showCreateMatch) {
    const table = showCreateMatch[1];
    return `SELECT sql AS 'Create Table' FROM sqlite_master WHERE type = 'table' AND name = '${table}';`;
  }

  return sql;
}

/** LIMIT x, y → LIMIT y OFFSET x (MySQL-Pagination) */
function transformLimitOffset(sql: string): string {
  // LIMIT 10, 20 → LIMIT 20 OFFSET 10
  return sql.replace(
    /\bLIMIT\s+(\d+)\s*,\s*(\d+)\b/gi,
    (_, offset, limit) => `LIMIT ${limit} OFFSET ${offset}`
  );
}

/** MySQL-Funktionen → SQLite-Äquivalente */
function transformFunctions(sql: string): string {
  let result = sql;

  // IF(expr, a, b) → CASE WHEN expr THEN a ELSE b END
  // Achtung: Verschachtelte IFs werden nicht unterstützt — einfache Fälle nur
  result = result.replace(
    /\bIF\s*\(([^,]+),\s*([^,]+),\s*([^)]+)\)/gi,
    (_, cond, thenVal, elseVal) => `CASE WHEN ${cond} THEN ${thenVal} ELSE ${elseVal} END`
  );

  // CONCAT(a, b, c) → a || b || c
  // Einfacher Fall: 2-3 Argumente
  result = transformConcat(result);

  // Protect CURRENT_TIMESTAMP in DEFAULT clauses from being converted.
  // SQLite natively supports DEFAULT CURRENT_TIMESTAMP but NOT DEFAULT DATETIME('now').
  result = result.replace(/\bDEFAULT\s+CURRENT_TIMESTAMP\s*\(\s*\)/gi, "DEFAULT __MYSQL_CURRENT_TS__");
  result = result.replace(/\bDEFAULT\s+CURRENT_TIMESTAMP\b/gi, "DEFAULT __MYSQL_CURRENT_TS__");

  // NOW() → DATETIME('now')
  result = result.replace(/\bNOW\s*\(\s*\)/gi, "DATETIME('now')");

  // CURDATE() → DATE('now')
  result = result.replace(/\bCURDATE\s*\(\s*\)/gi, "DATE('now')");

  // CURRENT_TIMESTAMP() → DATETIME('now') (with parens — MySQL function call syntax)
  result = result.replace(/\bCURRENT_TIMESTAMP\s*\(\s*\)/gi, "DATETIME('now')");

  // CURRENT_TIMESTAMP (without parens) → DATETIME('now')
  // Only in non-DEFAULT contexts (DEFAULT CURRENT_TIMESTAMP is already protected above)
  result = result.replace(/\bCURRENT_TIMESTAMP\b(?!\s*\()/gi, "DATETIME('now')");

  // Restore protected DEFAULT CURRENT_TIMESTAMP
  result = result.replace(/__MYSQL_CURRENT_TS__/g, "CURRENT_TIMESTAMP");

  // DATE_FORMAT(date, format) → strftime(format, date)
  // MySQL-Format-Specifiers → SQLite-Format-Specifiers
  result = transformDateFormat(result);

  // YEAR(date) → CAST(strftime('%Y', date) AS INTEGER)
  result = result.replace(
    /\bYEAR\s*\(\s*([^)]+)\s*\)/gi,
    (_, expr) => `CAST(strftime('%Y', ${expr}) AS INTEGER)`
  );

  // MONTH(date) → CAST(strftime('%m', date) AS INTEGER)
  result = result.replace(
    /\bMONTH\s*\(\s*([^)]+)\s*\)/gi,
    (_, expr) => `CAST(strftime('%m', ${expr}) AS INTEGER)`
  );

  // DAY(date) → CAST(strftime('%d', date) AS INTEGER)
  result = result.replace(
    /\bDAY\s*\(\s*([^)]+)\s*\)/gi,
    (_, expr) => `CAST(strftime('%d', ${expr}) AS INTEGER)`
  );

  // DATEDIFF(d1, d2) → CAST(julianday(d1) - julianday(d2) AS INTEGER)
  result = result.replace(
    /\bDATEDIFF\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/gi,
    (_, d1, d2) => `CAST(julianday(${d1}) - julianday(${d2}) AS INTEGER)`
  );

  // SUBSTRING(str, pos, len) → SUBSTR(str, pos, len)
  result = result.replace(/\bSUBSTRING\b/gi, "SUBSTR");

  // ISNULL(expr) → IFNULL(expr) (MySQL's ISNULL mit 1 Arg = IFNULL)
  // Achtung: ISNULL mit 2 Args gibt es nicht in MySQL
  result = result.replace(/\bISNULL\s*\(([^,)]+)\)/gi, "IFNULL($1)");

  return result;
}

/** CONCAT(a, b, ...) → a || b || ... */
function transformConcat(sql: string): string {
  // Einfacher Ansatz: CONCAT mit 2-5 Argumenten
  // Komplexe Verschachtelungen werden nicht aufgelöst
  const concatRegex = /\bCONCAT\s*\(([^)]+)\)/gi;
  return sql.replace(concatRegex, (match, args) => {
    // Argumente am Komma splitten (aber nicht innerhalb von Klammern)
    const splitArgs = splitTopLevel(args, ",");
    if (splitArgs.length < 2) return match; // Nichts zu tun
    return splitArgs.map((a: string) => a.trim()).join(" || ");
  });
}

/** CONCAT_WS(sep, a, b, ...) → a || sep || b || sep || c ... */
function transformConcatWs(sql: string): string {
  const concatWsRegex = /\bCONCAT_WS\s*\(([^)]+)\)/gi;
  return sql.replace(concatWsRegex, (match, args) => {
    const splitArgs = splitTopLevel(args, ",");
    if (splitArgs.length < 3) return match; // Need separator + at least 2 values
    const sep = splitArgs[0].trim();
    const values = splitArgs.slice(1).map((a: string) => a.trim());
    return values.join(` || ${sep} || `);
  });
}

/** DATE_FORMAT(date, format) → strftime(sqlite_format, date) */
function transformDateFormat(sql: string): string {
  const dateFormatRegex = /\bDATE_FORMAT\s*\(\s*([^,]+)\s*,\s*'([^']+)'\s*\)/gi;
  return sql.replace(dateFormatRegex, (_, dateExpr, mysqlFmt) => {
    const sqliteFmt = convertMysqlDateFormat(mysqlFmt);
    return `strftime('${sqliteFmt}', ${dateExpr.trim()})`;
  });
}

/**
 * Konvertiert MySQL-DATE_FORMAT-Specifiers zu SQLite-strftime-Specifiers.
 * MySQL: %Y %m %d %H %i %s %W %M %b %a %p %r %T %j %U %u
 * SQLite: %Y %m %d %H %M %S %w %m (begrenzt)
 */
function convertMysqlDateFormat(mysqlFmt: string): string {
  return mysqlFmt
    .replace(/%Y/g, "%Y")   // 4-stelliges Jahr — identisch
    .replace(/%y/g, "%y")   // 2-stelliges Jahr — identisch
    .replace(/%m/g, "%m")   // Monat (01-12) — identisch
    .replace(/%d/g, "%d")   // Tag (01-31) — identisch
    .replace(/%H/g, "%H")   // Stunde 24h (00-23) — identisch
    .replace(/%h/g, "%I")   // Stunde 12h (01-12) — SQLite: %I
    .replace(/%I/g, "%I")   // Stunde 12h — SQLite: %I
    .replace(/%i/g, "%M")   // Minute (00-59) — MySQL %i → SQLite %M
    .replace(/%s/g, "%S")   // Sekunde (00-59) — MySQL %s → SQLite %S
    .replace(/%S/g, "%S")   // Sekunde — identisch
    .replace(/%p/g, "%p")   // AM/PM — nicht in allen SQLite-Versionen
    .replace(/%W/g, "%w")   // Wochentag-Name → SQLite: Nummer (0=Sonntag)
    .replace(/%j/g, "%j")   // Tag des Jahres (001-366) — identisch
    .replace(/%M/g, "%m")   // Monatsname → SQLite hat keinen Namen, Fallback: Nummer
    .replace(/%b/g, "%m")   // Abgekürzter Monatsname → Fallback: Nummer
    .replace(/%a/g, "%w");  // Abgekürzter Wochentag → Fallback: Nummer
}

/** INSERT ... ON DUPLICATE KEY UPDATE → INSERT OR REPLACE */
function transformOnDuplicateKey(sql: string): string {
  // INSERT INTO table ... ON DUPLICATE KEY UPDATE ... → INSERT OR REPLACE INTO table ...
  return sql.replace(
    /^\s*INSERT\s+(?:INTO\s+)?(\w+)([\s\S]*?)\s+ON\s+DUPLICATE\s+KEY\s+UPDATE\s+[\s\S]*/i,
    (_, table, rest) => `INSERT OR REPLACE INTO ${table}${rest}`
  );
}

/** UNSIGNED-Keyword entfernen */
function removeUnsigned(sql: string): string {
  return sql.replace(/\bUNSIGNED\b/gi, "");
}

/** TRUE/FALSE → 1/0 (SQLite hat keinen Boolean-Typ) */
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

/** MySQL-spezifische ALTER TABLE-Optionen entfernen (ENGINE, CHARSET, etc.) */
function removeMysqlTableOptions(sql: string): string {
  // Nur bei CREATE TABLE
  if (!/^\s*CREATE\s+TABLE\b/i.test(sql)) return sql;

  // Strategy: Find the last closing parenthesis ) before the final ;
  // Everything between ) and ; that contains MySQL keywords should be removed.
  // This handles both single-line and multi-line CREATE TABLE statements.

  // Find the position of the last ) before the final ;
  const lastParenIdx = sql.lastIndexOf(")");
  if (lastParenIdx === -1) return sql;

  const afterParen = sql.substring(lastParenIdx + 1).trim();
  // Check if there are MySQL table options between ) and ;
  if (/\bENGINE\b|\bCHARSET\b|\bCHARACTER\s+SET\b|\bCOLLATE\b|\bAUTO_INCREMENT\b/i.test(afterParen)) {
    // Remove everything between ) and ; (or end of string)
    return sql.substring(0, lastParenIdx + 1) + ";";
  }

  return sql;
}

/**
 * ALTER TABLE MySQL-Befehle → SQLite-Äquivalente.
 *
 * SQLite unterstützt nur einen Teil der ALTER TABLE-Befehle:
 * - ADD COLUMN (ohne NOT NULL ohne DEFAULT) → wird durchgereicht
 * - RENAME COLUMN old TO new → wird durchgereicht
 * - RENAME TABLE old TO new → wird durchgereicht
 * - DROP COLUMN → wird durchgereicht (SQLite 3.35+)
 *
 * MySQL-spezifisch:
 * - CHANGE COLUMN old new type → RENAME COLUMN old TO new (Typ-Änderung ignoriert mit Warnung)
 * - MODIFY COLUMN col type → Kommentar: Typ-Änderung nicht unterstützt
 * - ALTER COLUMN SET DEFAULT → wird durchgereicht
 */
function transformAlterTable(sql: string): string {
  let result = sql;

  // ─── Multi-clause ALTER TABLE (phpMyAdmin style) ────────────────────────
  // phpMyAdmin exports ALTER TABLE with multiple ADD clauses separated by commas:
  //   ALTER TABLE "auftrag"
  //     ADD PRIMARY KEY ("AuftrNr"),
  //     ADD KEY "LKWNr" ("LKWNr"),
  //     ADD KEY "KdNr" ("KdNr");
  // SQLite doesn't support this syntax. We need to split them into separate statements.

  // Check if this is a multi-clause ALTER TABLE (contains commas between ADD clauses)
  const multiClauseMatch = result.match(
    /^\s*ALTER\s+TABLE\s+"?(\w+)"?\s+(ADD\s+[\s\S]+)$/i
  );
  if (multiClauseMatch && /,\s*\n?\s*ADD\s+/i.test(multiClauseMatch[2])) {
    const tableName = multiClauseMatch[1];
    const clauses = multiClauseMatch[2];

    // Split by comma followed by ADD (but not commas inside parentheses)
    const splitClauses: string[] = [];
    let current = "";
    let depth = 0;
    for (let i = 0; i < clauses.length; i++) {
      const ch = clauses[i];
      if (ch === "(") depth++;
      if (ch === ")") depth--;

      // Split at comma+ADD when not inside parentheses
      if (depth === 0 && ch === "," && /^\s*ADD\s+/i.test(clauses.substring(i + 1))) {
        splitClauses.push(current.trim());
        current = "";
        // Skip the comma
        continue;
      }
      current += ch;
    }
    if (current.trim()) splitClauses.push(current.trim());

    // Transform each clause into a separate ALTER TABLE or CREATE INDEX statement
    const transformedClauses = splitClauses.map(clause => {
      const fullStmt = `ALTER TABLE "${tableName}" ${clause}`;
      return transformAlterTable(fullStmt);
    });

    return transformedClauses.join("\n");
  }

  // ─── Single-clause ALTER TABLE transformations ──────────────────────────

  // ALTER TABLE ... ADD PRIMARY KEY (col) → durchreichen (SQLite unterstützt das)
  // Beispiel: ALTER TABLE auftrag ADD PRIMARY KEY (AuftrNr)
  // Keine Transformation nötig, SQLite versteht ADD PRIMARY KEY

  // ALTER TABLE ... ADD KEY idxname (col) → CREATE INDEX idxname ON table (col)
  // MySQL: ALTER TABLE ... ADD KEY idxname (col) / ADD INDEX idxname (col)
  // SQLite: CREATE INDEX idxname ON table (col)
  result = result.replace(
    /^\s*ALTER\s+TABLE\s+"?(\w+)"?\s+ADD\s+(?:KEY|INDEX)\s+"?(\w+)"?\s*\(([^)]+)\)\s*;?\s*$/i,
    (_, table, idxName, cols) => {
      return `CREATE INDEX "${idxName}" ON "${table}" (${cols});`;
    }
  );

  // ALTER TABLE ... ADD UNIQUE KEY idxname (col) → CREATE UNIQUE INDEX idxname ON table (col)
  result = result.replace(
    /^\s*ALTER\s+TABLE\s+"?(\w+)"?\s+ADD\s+UNIQUE\s+(?:KEY|INDEX)\s+"?(\w+)"?\s*\(([^)]+)\)\s*;?\s*$/i,
    (_, table, idxName, cols) => {
      return `CREATE UNIQUE INDEX "${idxName}" ON "${table}" (${cols});`;
    }
  );

  // ALTER TABLE ... ADD CONSTRAINT name FOREIGN KEY (col) REFERENCES other (col)
  // → ALTER TABLE ... ADD FOREIGN KEY (col) REFERENCES other (col)
  // SQLite unterstützt ADD FOREIGN KEY, aber nicht die CONSTRAINT name Syntax
  result = result.replace(
    /^\s*ALTER\s+TABLE\s+"?(\w+)"?\s+ADD\s+CONSTRAINT\s+"?\w+"?\s+FOREIGN\s+KEY\s*\(([^)]+)\)\s+REFERENCES\s*"?\w+"?\s*\(([^)]+)\)(?:\s+ON\s+(?:DELETE|UPDATE)\s+(?:CASCADE|SET\s+NULL|SET\s+DEFAULT|RESTRICT|NO\s+ACTION))*\s*;?\s*$/i,
    (match, table, fkCols, refCols) => {
      // Extract the REFERENCES clause including ON DELETE/UPDATE from the original
      const onDeleteMatch = match.match(/\bON\s+DELETE\s+(CASCADE|SET\s+NULL|SET\s+DEFAULT|RESTRICT|NO\s+ACTION)\b/i);
      const onUpdateMatch = match.match(/\bON\s+UPDATE\s+(CASCADE|SET\s+NULL|SET\s+DEFAULT|RESTRICT|NO\s+ACTION)\b/i);
      // Extract referenced table name
      const refTableMatch = match.match(/REFERENCES\s+"?(\w+)"?\s*\(/i);
      const refTable = refTableMatch ? refTableMatch[1] : 'UNKNOWN';
      let fkSql = `ALTER TABLE "${table}" ADD FOREIGN KEY (${fkCols}) REFERENCES "${refTable}" (${refCols})`;
      if (onDeleteMatch) fkSql += ` ON DELETE ${onDeleteMatch[1].toUpperCase()}`;
      if (onUpdateMatch) fkSql += ` ON UPDATE ${onUpdateMatch[1].toUpperCase()}`;
      return fkSql + ';';
    }
  );

  // ALTER TABLE ... CHANGE COLUMN old_name new_name type → ALTER TABLE ... RENAME COLUMN old_name TO new_name
  // MySQL: CHANGE COLUMN kann Spalte umbenennen UND Typ ändern
  // SQLite: Nur RENAME COLUMN (Typ-Änderung wird ignoriert)
  result = result.replace(
    /^\s*ALTER\s+TABLE\s+(\w+)\s+CHANGE\s+COLUMN\s+(\w+)\s+(\w+)\s+[^;]*;?/i,
    (_, table, oldCol, newCol) => {
      if (oldCol.toLowerCase() === newCol.toLowerCase()) {
        // Gleicher Name → MODIFY COLUMN (Typ-Änderung), nicht unterstützt
        return `-- SQLite: ALTER TABLE "${table}" MODIFY COLUMN wird nicht unterstützt. Spaltentyp kann nicht geändert werden.`;
      }
      return `ALTER TABLE "${table}" RENAME COLUMN "${oldCol}" TO "${newCol}";`;
    }
  );

  // ALTER TABLE ... MODIFY COLUMN col type → Nicht unterstützt in SQLite
  result = result.replace(
    /^\s*ALTER\s+TABLE\s+(\w+)\s+MODIFY\s+COLUMN\s+(\w+)\s+[^;]*;?/i,
    (_, table, col) => {
      return `-- SQLite: ALTER TABLE "${table}" MODIFY COLUMN "${col}" wird nicht unterstützt. Spaltentyp kann nicht geändert werden.`;
    }
  );

  // ALTER TABLE ... MODIFY col type [UNSIGNED] [NOT NULL] AUTO_INCREMENT [=x] → Nicht unterstützt
  // Wird oft von phpMyAdmin für AUTO_INCREMENT-Wert gesetzt
  // UNSIGNED wurde bereits von removeUnsigned entfernt, daher optional
  result = result.replace(
    /^\s*ALTER\s+TABLE\s+"?(\w+)"?\s+MODIFY\s+"?(\w+)"?\s+[^;]*AUTO_INCREMENT\s*(?:=\s*\d+)?\s*;?\s*$/i,
    (_, table, col) => {
      return `-- SQLite: ALTER TABLE "${table}" MODIFY "${col}" mit AUTO_INCREMENT wird nicht unterstützt.`;
    }
  );

  // ALTER TABLE ... ALTER COLUMN ... SET DEFAULT → wird unterstützt
  // ALTER TABLE ... ALTER COLUMN ... DROP DEFAULT → wird unterstützt
  // Diese durchreichen, keine Transformation nötig

  return result;
}

/**
 * DROP DATABASE / CREATE DATABASE / USE → SQL-Kommentare.
 *
 * SQLite hat kein Datenbank-Konzept im MySQL-Sinn (eine Datei = eine DB).
 * Diese Befehle werden zu Kommentaren umgewandelt, damit sie nicht
 * zu Fehlern führen, aber im Skript erhalten bleiben.
 */
function transformDatabaseStatements(sql: string): string {
  let result = sql;

  // DROP DATABASE [IF EXISTS] name; → Kommentar (ohne Semikolon im Kommentar!)
  result = result.replace(
    /^\s*DROP\s+DATABASE\s+(?:IF\s+EXISTS\s+)?(\w+)\s*;?\s*$/gim,
    (_, name) => `-- MySQL: DROP DATABASE ${name} (SQLite: automatisch ignoriert)`
  );

  // CREATE DATABASE [IF NOT EXISTS] name [CHARACTER SET ...] [COLLATE ...] [DEFAULT CHARSET ...]; → Kommentar
  // MySQL erlaubt: CHARACTER SET, COLLATE, DEFAULT CHARSET nach dem DB-Namen
  result = result.replace(
    /^\s*CREATE\s+DATABASE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)(?:\s+(?:CHARACTER\s+SET|DEFAULT\s+CHARSET|COLLATE)\s+\S+)*\s*;?\s*$/gim,
    (_, name) => `-- MySQL: CREATE DATABASE ${name} (SQLite: automatisch ignoriert)`
  );

  // USE name; → Kommentar (ohne Semikolon im Kommentar!)
  result = result.replace(
    /^\s*USE\s+(\w+)\s*;?\s*$/gim,
    (_, name) => `-- MySQL: USE ${name} (SQLite: automatisch ignoriert)`
  );

  return result;
}

// ─── Hilfsfunktionen ──────────────────────────────────────────────────────

/**
 * Splittet einen String an einem Separator, aber nur auf Top-Level
 * (ignoriert Separator innerhalb von Klammern).
 */
function splitTopLevel(str: string, separator: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  let inString = false;
  let stringChar = "";

  for (let i = 0; i < str.length; i++) {
    const ch = str[i];

    if (inString) {
      current += ch;
      if (ch === stringChar && str[i - 1] !== "\\") {
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

    if (ch === "(") depth++;
    if (ch === ")") depth--;

    if (ch === separator && depth === 0) {
      parts.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  if (current.trim()) parts.push(current);
  return parts;
}

// ─── MySQL-Fehler-Mapping ─────────────────────────────────────────────────

/**
 * Übersetzt SQLite-Fehlermeldungen zu MySQL-artigen Fehlermeldungen,
 * damit die User-Erfahrung konsistent mit MySQL bleibt.
 *
 * @param sqliteError - Die SQLite-Fehlermeldung
 * @returns MySQL-artige Fehlermeldung
 */
export function mapSqliteErrorToMysql(sqliteError: string): string {
  let error = sqliteError;

  // "no such table" → "Table 'x' doesn't exist"
  error = error.replace(
    /no such table:\s*(\w+)/gi,
    (_, table) => `Table '${table}' doesn't exist`
  );

  // "no such column" → "Unknown column 'x'" ([\w.]+ erfasst qualifizierte Namen wie tabelle.spalte)
  error = error.replace(
    /no such column:\s*([\w.]+)/gi,
    (_, col) => `Unknown column '${col}'`
  );

  // "table x already exists" → "Table 'x' already exists"
  error = error.replace(
    /table\s+(\w+)\s+already\s+exists/gi,
    (_, table) => `Table '${table}' already exists`
  );

  // "near "x": syntax error" → "You have an error in your SQL syntax near 'x'"
  error = error.replace(
    /near\s+"([^"]+)":\s*syntax\s*error/gi,
    (_, near) => `You have an error in your SQL syntax; check the manual near '${near}'`
  );

  // "cannot drop table" → "Cannot drop table 'x'"
  error = error.replace(
    /cannot\s+drop\s+table\s+(\w+)/gi,
    (_, table) => `Cannot drop table '${table}'`
  );

  // "foreign key mismatch" → "Cannot add or update a child row: foreign key constraint fails"
  if (/foreign key mismatch/i.test(error)) {
    error = "Cannot add or update a child row: a foreign key constraint fails";
  }

  // "UNIQUE constraint failed" → "Duplicate entry for key 'x'"
  error = error.replace(
    /UNIQUE\s+constraint\s+failed:\s+(\w+)\.(\w+)/gi,
    (_, table, col) => `Duplicate entry for key '${table}.${col}'`
  );

  // "NOT NULL constraint failed" → "Column 'x' cannot be null"
  error = error.replace(
    /NOT\s+NULL\s+constraint\s+failed:\s+(\w+)\.(\w+)/gi,
    (_, table, col) => `Column '${col}' cannot be null`
  );

  // "CHECK constraint failed" → "Check constraint failed for column"
  error = error.replace(
    /CHECK\s+constraint\s+failed/i,
    "Check constraint violation"
  );

  // SQLite-spezifische PRAGMA-Fehler
  if (/PRAGMA/i.test(error) && !/foreign_keys/i.test(error)) {
    // PRAGMA-Fehler sind SQLite-intern, nicht an User zeigen
    error = error.replace(/PRAGMA\s+\w+/gi, "");
  }

  return error;
}

/**
 * Übersetzt SQLite-Schema-Informationen zu MySQL-artigen Spaltentypen.
 * Wird verwendet, um im Schema-Explorer MySQL-Typen anzuzeigen.
 *
 * @param sqliteType - Der von PRAGMA table_info gelieferte Typ
 * @returns MySQL-artiger Typ-String
 */
export function mapSqliteTypeToMysql(sqliteType: string): string {
  const upper = sqliteType.toUpperCase().trim();

  // SQLite speichert Typen als deklariert, aber mit Affinity-Regeln
  if (upper === "INTEGER") return "INT";
  if (upper === "REAL") return "DOUBLE";
  if (upper === "TEXT") return "VARCHAR(255)";
  if (upper === "BLOB") return "BLOB";

  // Bereits MySQL-artige Typen durchlassen
  if (/^(INT|TINYINT|SMALLINT|MEDIUMINT|BIGINT|FLOAT|DOUBLE|DECIMAL|NUMERIC|VARCHAR|CHAR|TEXT|DATETIME|DATE|TIMESTAMP|BOOLEAN|ENUM|BLOB|SET)/i.test(upper)) {
    return upper;
  }

  // Fallback
  return upper;
}

/**
 * Extrahiert den Datenbanknamen aus CREATE DATABASE- oder USE-Statements
 * in einem SQL-Skript. Wird verwendet, um automatisch erstellte
 * Datenbanken sinnvoll zu benennen.
 *
 * Priorität: CREATE DATABASE > USE > "Neue Datenbank"
 *
 * @param sql - Das SQL-Skript
 * @returns Der extrahierte Datenbankname oder null
 */
export function extractDatabaseName(sql: string): string | null {
  // CREATE DATABASE [IF NOT EXISTS] name [CHARACTER SET ...] [COLLATE ...] [DEFAULT CHARSET ...]
  const createMatch = sql.match(/\bCREATE\s+DATABASE\s+(?:IF\s+NOT\s+EXISTS\s+)?(\w+)/i);
  if (createMatch) {
    return createMatch[1];
  }

  // USE name
  const useMatch = sql.match(/\bUSE\s+(\w+)/i);
  if (useMatch) {
    return useMatch[1];
  }

  return null;
}

/**
 * Prüft, ob eine SQL-Anweisung MySQL-spezifische Features verwendet,
 * die in SQLite nicht unterstützt werden (auch nicht mit Transpiler).
 * Gibt eine Liste von Warnungen zurück.
 *
 * @param sql - Die SQL-Anweisung
 * @returns Array von Warnungs-Strings (leer = keine Warnungen)
 */
export function getMysqlCompatWarnings(sql: string): string[] {
  const warnings: string[] = [];
  const upper = sql.toUpperCase().trim();

  // FULL OUTER JOIN — SQLite unterstützt das nicht
  if (/\bFULL\s+OUTER\s+JOIN\b/i.test(upper)) {
    warnings.push("FULL OUTER JOIN wird von SQLite nicht unterstützt. Verwende UNION von zwei LEFT JOINs.");
  }

  // NATURAL JOIN — SQLite unterstützt es, aber es ist selten sinnvoll
  if (/\bNATURAL\s+JOIN\b/i.test(upper)) {
    warnings.push("NATURAL JOIN kann unerwartete Ergebnisse liefern — explizite ON-Klausel empfohlen.");
  }

  // Stored Procedures / DELIMITER
  if (/\b(DELIMITER|CALL|PROCEDURE|FUNCTION|TRIGGER|EVENT)\b/i.test(upper)) {
    warnings.push("Stored Procedures, Functions und Trigger werden in dieser Umgebung nicht unterstützt.");
  }

  // SHOW PROCESSLIST / SHOW STATUS etc.
  if (/\bSHOW\s+(PROCESSLIST|STATUS|VARIABLES|GRANTS|INDEX|CREATE|TABLES|COLUMNS|FIELDS)\b/i.test(upper)) {
    // SHOW TABLES und DESCRIBE werden vom Transpiler abgefangen
    if (!/^\s*SHOW\s+(TABLES|COLUMNS|FIELDS|CREATE\s+TABLE)\b/i.test(upper)) {
      warnings.push("Dieses SHOW-Kommando wird in dieser Umgebung nicht unterstützt.");
    }
  }

  // EXPLAIN mit MySQL-Syntax
  if (/^\s*EXPLAIN\s+(?!QUERY\s+PLAN)/i.test(upper)) {
    warnings.push("EXPLAIN wird in SQLite als EXPLAIN QUERY PLAN ausgeführt.");
  }

  // LOAD DATA INFILE
  if (/\bLOAD\s+DATA\b/i.test(upper)) {
    warnings.push("LOAD DATA INFILE wird in dieser Umgebung nicht unterstützt.");
  }

  // LOCK TABLES
  if (/\bLOCK\s+TABLES\b/i.test(upper)) {
    warnings.push("LOCK TABLES wird in dieser Umgebung nicht unterstützt.");
  }

  // SET (Session-Variablen)
  if (/^\s*SET\s+(?!@)/i.test(upper) && !/^\s*SET\s+FOREIGN_KEYS/i.test(upper)) {
    warnings.push("SET-Variablen werden in dieser Umgebung nicht unterstützt.");
  }

  // REPLACE INTO (MySQL-spezifisch, SQLite hat es aber auch)
  // Keine Warnung nötig — funktioniert in beiden

  return warnings;
}