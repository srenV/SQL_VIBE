/**
 * SQL Syntax Reference Data – per-dialect syntax reference for the Syntax Help Modal.
 *
 * Each dialect (sqlite, mysql, postgresql) has its own set of sections.
 * Items can be tagged with `autoTranslated: true` to indicate that the feature
 * is automatically transpiled to SQLite under the hood.
 * Items can be tagged with `notSupported: true` to indicate limitations.
 */

import type { Dialect } from "@/lib/dialect";

/* ─── Types ──────────────────────────────────────────────────────────────── */

export interface SyntaxItem {
  /** The SQL keyword / syntax snippet, e.g. "SELECT … FROM …" */
  syntax: string;
  /** i18n key for the description, resolved via t(`items.${key}`) */
  descriptionKey: string;
  /** Optional example query */
  example?: string;
  /** If true, this feature is automatically translated to SQLite */
  autoTranslated?: boolean;
  /** If true, this feature is NOT available in this dialect */
  notSupported?: boolean;
}

export interface SyntaxSection {
  /** Section heading (i18n key or plain text) */
  title: string;
  /** Icon name from lucide-react */
  icon: string;
  items: SyntaxItem[];
}

export interface SyntaxReference {
  dialect: Dialect;
  sections: SyntaxSection[];
}

/* ─── Shared items (available in all 3 dialects) ─────────────────────────── */

const commonQuerySections: SyntaxSection[] = [
  {
    title: "queryBasics",
    icon: "Search",
    items: [
      { syntax: "SELECT col1, col2", descriptionKey: "selectColumns" },
      { syntax: "SELECT *", descriptionKey: "selectAll" },
      { syntax: "SELECT DISTINCT col", descriptionKey: "selectDistinct" },
      { syntax: "FROM table", descriptionKey: "fromTable" },
      { syntax: "WHERE condition", descriptionKey: "whereCondition" },
      { syntax: "ORDER BY col ASC / DESC", descriptionKey: "orderBy", example: "SELECT * FROM users ORDER BY name ASC" },
      { syntax: "LIMIT n", descriptionKey: "limitRows" },
      { syntax: "LIMIT n OFFSET m", descriptionKey: "limitOffset", example: "SELECT * FROM users LIMIT 10 OFFSET 20" },
      { syntax: "AS alias", descriptionKey: "asAlias", example: "SELECT COUNT(*) AS total" },
    ],
  },
  {
    title: "filtering",
    icon: "Filter",
    items: [
      { syntax: "=  !=  <  >  <=  >=", descriptionKey: "comparisonOps" },
      { syntax: "AND  OR  NOT", descriptionKey: "logicalOps" },
      { syntax: "IS NULL / IS NOT NULL", descriptionKey: "nullCheck" },
      { syntax: "IN (val1, val2, …)", descriptionKey: "inList", example: "SELECT * FROM users WHERE role IN ('admin', 'editor')" },
      { syntax: "BETWEEN x AND y", descriptionKey: "betweenRange" },
      { syntax: "LIKE 'pattern'", descriptionKey: "likePattern", example: "SELECT * FROM users WHERE name LIKE 'A%'" },
      { syntax: "GLOB 'pattern'", descriptionKey: "globPattern" },
    ],
  },
  {
    title: "joins",
    icon: "GitMerge",
    items: [
      { syntax: "INNER JOIN", descriptionKey: "innerJoin" },
      { syntax: "LEFT JOIN", descriptionKey: "leftJoin" },
      { syntax: "CROSS JOIN", descriptionKey: "crossJoin" },
      { syntax: "NATURAL JOIN", descriptionKey: "naturalJoin" },
      { syntax: "ON t1.col = t2.col", descriptionKey: "onCondition" },
      { syntax: "USING (col)", descriptionKey: "usingShorthand" },
    ],
  },
  {
    title: "aggregation",
    icon: "Calculator",
    items: [
      { syntax: "COUNT(*)", descriptionKey: "countAll" },
      { syntax: "COUNT(col)", descriptionKey: "countNonNull" },
      { syntax: "SUM(col)", descriptionKey: "sumValues" },
      { syntax: "AVG(col)", descriptionKey: "avgValues" },
      { syntax: "MIN(col) / MAX(col)", descriptionKey: "minMax" },
      { syntax: "GROUP BY col", descriptionKey: "groupBy", example: "SELECT role, COUNT(*) FROM users GROUP BY role" },
      { syntax: "HAVING condition", descriptionKey: "having", example: "SELECT role, COUNT(*) AS n FROM users GROUP BY role HAVING n > 1" },
      { syntax: "GROUP_CONCAT(col, sep)", descriptionKey: "groupConcat" },
    ],
  },
  {
    title: "subqueries",
    icon: "Layers",
    items: [
      { syntax: "WHERE col IN (SELECT …)", descriptionKey: "subqueryWhere" },
      { syntax: "FROM (SELECT …)", descriptionKey: "derivedTable" },
      { syntax: "WITH cte AS (SELECT …)", descriptionKey: "cte" },
      { syntax: "WITH RECURSIVE cte AS (…)", descriptionKey: "recursiveCte" },
    ],
  },
  {
    title: "setOperations",
    icon: "Combine",
    items: [
      { syntax: "UNION", descriptionKey: "union" },
      { syntax: "UNION ALL", descriptionKey: "unionAll" },
      { syntax: "INTERSECT", descriptionKey: "intersect" },
      { syntax: "EXCEPT", descriptionKey: "except" },
    ],
  },
  {
    title: "conditional",
    icon: "GitBranch",
    items: [
      { syntax: "CASE WHEN … THEN … ELSE … END", descriptionKey: "caseWhen", example: "SELECT CASE WHEN age >= 18 THEN 'adult' ELSE 'minor' END FROM users" },
      { syntax: "COALESCE(a, b, …)", descriptionKey: "coalesce" },
      { syntax: "NULLIF(a, b)", descriptionKey: "nullif" },
      { syntax: "IFNULL(a, b)", descriptionKey: "ifnull" },
      { syntax: "CAST(expr AS type)", descriptionKey: "cast" },
    ],
  },
  {
    title: "ddl",
    icon: "Database",
    items: [
      { syntax: "CREATE TABLE name (…)", descriptionKey: "createTable" },
      { syntax: "DROP TABLE name", descriptionKey: "dropTable" },
      { syntax: "ALTER TABLE name ADD COLUMN …", descriptionKey: "alterAddColumn" },
      { syntax: "CREATE INDEX name ON table (col)", descriptionKey: "createIndex" },
      { syntax: "DROP INDEX name", descriptionKey: "dropIndex" },
      { syntax: "INSERT INTO table VALUES (…)", descriptionKey: "insertValues" },
      { syntax: "INSERT INTO table SELECT …", descriptionKey: "insertSelect" },
      { syntax: "UPDATE table SET col = val WHERE …", descriptionKey: "updateRows" },
      { syntax: "DELETE FROM table WHERE …", descriptionKey: "deleteRows" },
      { syntax: "CREATE VIEW name AS SELECT …", descriptionKey: "createView" },
      { syntax: "DROP VIEW name", descriptionKey: "dropView" },
      { syntax: "DROP VIEW IF EXISTS name", descriptionKey: "dropViewIfExists" },
    ],
  },
];

/* ─── SQLite-specific sections ────────────────────────────────────────────── */

const sqliteSections: SyntaxSection[] = [
  ...commonQuerySections,
  {
    title: "sqliteSpecific",
    icon: "Zap",
    items: [
      { syntax: "INTEGER PRIMARY KEY AUTOINCREMENT", descriptionKey: "autoincrement" },
      { syntax: "PRAGMA table_info(table)", descriptionKey: "pragmaTableInfo" },
      { syntax: "PRAGMA foreign_keys = ON", descriptionKey: "pragmaForeignKeys" },
      { syntax: "strftime('%Y-%m-%d', col)", descriptionKey: "strftime", example: "SELECT strftime('%Y', hire_date) FROM employees" },
      { syntax: "date('now')", descriptionKey: "dateNow" },
      { syntax: "datetime('now')", descriptionKey: "datetimeNow" },
      { syntax: "julianday(date)", descriptionKey: "julianday" },
      { syntax: "typeof(col)", descriptionKey: "typeof" },
      { syntax: "INSERT OR REPLACE INTO …", descriptionKey: "insertOrReplace" },
      { syntax: "INSERT OR IGNORE INTO …", descriptionKey: "insertOrIgnore" },
    ],
  },
  {
    title: "sqliteTypes",
    icon: "Type",
    items: [
      { syntax: "INTEGER", descriptionKey: "typeInteger" },
      { syntax: "TEXT", descriptionKey: "typeText" },
      { syntax: "REAL", descriptionKey: "typeReal" },
      { syntax: "BLOB", descriptionKey: "typeBlob" },
      { syntax: "NUMERIC", descriptionKey: "typeNumeric" },
    ],
  },
  {
    title: "sqliteViews",
    icon: "Layers",
    items: [
      { syntax: "CREATE VIEW name AS SELECT …", descriptionKey: "createView" },
      { syntax: "DROP VIEW name", descriptionKey: "dropView" },
      { syntax: "DROP VIEW IF EXISTS name", descriptionKey: "dropViewIfExists" },
    ],
  },
  {
    title: "limitations",
    icon: "AlertTriangle",
    items: [
      { syntax: "FULL OUTER JOIN", descriptionKey: "notSupportedFullOuter", notSupported: true },
      { syntax: "RIGHT JOIN", descriptionKey: "notSupportedRightJoin", notSupported: true },
      { syntax: "Window functions (OVER)", descriptionKey: "limitedWindowFunctions" },
    ],
  },
];

/* ─── MySQL-specific sections ─────────────────────────────────────────────── */

const mysqlSections: SyntaxSection[] = [
  ...commonQuerySections,
  {
    title: "mysqlSpecific",
    icon: "Zap",
    items: [
      { syntax: "IF(cond, a, b)", descriptionKey: "ifFunction", autoTranslated: true, example: "SELECT IF(age >= 18, 'adult', 'minor') FROM users" },
      { syntax: "CONCAT(a, b, …)", descriptionKey: "concatFunction", autoTranslated: true, example: "SELECT CONCAT(first, ' ', last) FROM users" },
      { syntax: "CONCAT_WS(sep, a, b)", descriptionKey: "concatWs", autoTranslated: true },
      { syntax: "NOW() / CURDATE()", descriptionKey: "nowCurdate", autoTranslated: true },
      { syntax: "DATE_FORMAT(date, fmt)", descriptionKey: "dateFormat", autoTranslated: true },
      { syntax: "YEAR(date) / MONTH(date) / DAY(date)", descriptionKey: "dateParts", autoTranslated: true },
      { syntax: "DATEDIFF(d1, d2)", descriptionKey: "datediff", autoTranslated: true },
      { syntax: "LIMIT x, y", descriptionKey: "limitOffsetMysql", autoTranslated: true, example: "SELECT * FROM users LIMIT 20, 10" },
      { syntax: "SHOW TABLES", descriptionKey: "showTables", autoTranslated: true },
      { syntax: "DESCRIBE table", descriptionKey: "describeTable", autoTranslated: true },
      { syntax: "TRUNCATE TABLE name", descriptionKey: "truncateTable", autoTranslated: true },
      { syntax: "INSERT … ON DUPLICATE KEY UPDATE", descriptionKey: "onDuplicateKey", autoTranslated: true },
      { syntax: "INSERT IGNORE INTO …", descriptionKey: "insertIgnore", autoTranslated: true },
      { syntax: "`backtick` identifiers", descriptionKey: "backtickQuoting", autoTranslated: true },
      { syntax: "AUTO_INCREMENT", descriptionKey: "autoIncrement", autoTranslated: true },
      { syntax: "UNSIGNED", descriptionKey: "unsignedModifier", autoTranslated: true },
    ],
  },
  {
    title: "mysqlTypes",
    icon: "Type",
    items: [
      { syntax: "INT / BIGINT", descriptionKey: "typeIntBigint", autoTranslated: true },
      { syntax: "VARCHAR(n)", descriptionKey: "typeVarchar", autoTranslated: true },
      { syntax: "TEXT", descriptionKey: "typeLongText" },
      { syntax: "BOOLEAN", descriptionKey: "typeBooleanInt", autoTranslated: true },
      { syntax: "DATETIME", descriptionKey: "typeDatetime", autoTranslated: true },
      { syntax: "DOUBLE / FLOAT", descriptionKey: "typeDoubleFloat", autoTranslated: true },
      { syntax: "DECIMAL(p, s)", descriptionKey: "typeDecimal", autoTranslated: true },
    ],
  },
  {
    title: "mysqlViews",
    icon: "Layers",
    items: [
      { syntax: "CREATE VIEW name AS SELECT …", descriptionKey: "createView" },
      { syntax: "DROP VIEW name", descriptionKey: "dropView" },
      { syntax: "DROP VIEW IF EXISTS name", descriptionKey: "dropViewIfExists" },
      { syntax: "CREATE OR REPLACE VIEW name AS …", descriptionKey: "createOrReplaceView", autoTranslated: true },
      { syntax: "SHOW CREATE VIEW name", descriptionKey: "showCreateView", autoTranslated: true },
    ],
  },
  {
    title: "limitations",
    icon: "AlertTriangle",
    items: [
      { syntax: "FULL OUTER JOIN", descriptionKey: "notSupportedFullOuterSqlite", notSupported: true },
      { syntax: "STORED PROCEDURES", descriptionKey: "notSupportedStoredProcedures", notSupported: true },
      { syntax: "TRIGGERS (advanced)", descriptionKey: "limitedTriggers" },
      { syntax: "VIEWS (updatable)", descriptionKey: "notSupportedUpdatableViews" },
    ],
  },
];

/* ─── PostgreSQL-specific sections ───────────────────────────────────────── */

const postgresqlSections: SyntaxSection[] = [
  ...commonQuerySections,
  {
    title: "postgresqlSpecific",
    icon: "Zap",
    items: [
      { syntax: "expr::type", descriptionKey: "shorthandCast", autoTranslated: true, example: "SELECT name::TEXT FROM users" },
      { syntax: "EXTRACT(part FROM date)", descriptionKey: "extractPart", autoTranslated: true, example: "SELECT EXTRACT(YEAR FROM hire_date) FROM employees" },
      { syntax: "ILIKE 'pattern'", descriptionKey: "ilikePattern", autoTranslated: true, example: "SELECT * FROM users WHERE name ILIKE 'john%'" },
      { syntax: "SERIAL / BIGSERIAL", descriptionKey: "serialColumn", autoTranslated: true },
      { syntax: "NOW() / CURRENT_TIMESTAMP", descriptionKey: "nowCurrentTimestamp", autoTranslated: true },
      { syntax: "RETURNING *", descriptionKey: "returningStar", autoTranslated: true, example: "INSERT INTO users (name) VALUES ('Alice') RETURNING *" },
      { syntax: "ON CONFLICT DO UPDATE", descriptionKey: "onConflictUpdate", autoTranslated: true, example: "INSERT INTO users (id, name) VALUES (1, 'Alice') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name" },
      { syntax: "ON CONFLICT DO NOTHING", descriptionKey: "onConflictNothing", autoTranslated: true },
      { syntax: "TRUNCATE TABLE name", descriptionKey: "truncateTable", autoTranslated: true },
      { syntax: "$$ … $$ (dollar quoting)", descriptionKey: "dollarQuoting", autoTranslated: true },
      { syntax: "IS DISTINCT FROM", descriptionKey: "isDistinctFrom", autoTranslated: true },
      { syntax: "BOOLEAN", descriptionKey: "typeBooleanInt", autoTranslated: true },
      { syntax: "DOUBLE PRECISION", descriptionKey: "typeDoublePrecision", autoTranslated: true },
      { syntax: "CHARACTER VARYING(n)", descriptionKey: "typeCharVarying", autoTranslated: true },
      { syntax: "TIMESTAMP WITH TIME ZONE", descriptionKey: "typeTimestampTz", autoTranslated: true },
    ],
  },
  {
    title: "postgresqlTypes",
    icon: "Type",
    items: [
      { syntax: "SERIAL / BIGSERIAL", descriptionKey: "serialColumn", autoTranslated: true },
      { syntax: "INTEGER / BIGINT", descriptionKey: "typeIntBigint" },
      { syntax: "VARCHAR(n) / TEXT", descriptionKey: "typeVarcharText" },
      { syntax: "BOOLEAN", descriptionKey: "typeBooleanInt", autoTranslated: true },
      { syntax: "REAL / DOUBLE PRECISION", descriptionKey: "typeDoubleFloat", autoTranslated: true },
      { syntax: "TIMESTAMP WITH TIME ZONE", descriptionKey: "typeTimestampTz", autoTranslated: true },
    ],
  },
  {
    title: "postgresqlViews",
    icon: "Layers",
    items: [
      { syntax: "CREATE VIEW name AS SELECT …", descriptionKey: "createView" },
      { syntax: "DROP VIEW name", descriptionKey: "dropView" },
      { syntax: "DROP VIEW IF EXISTS name", descriptionKey: "dropViewIfExists" },
      { syntax: "CREATE OR REPLACE VIEW name AS …", descriptionKey: "createOrReplaceView", autoTranslated: true },
    ],
  },
  {
    title: "limitations",
    icon: "AlertTriangle",
    items: [
      { syntax: "FULL OUTER JOIN", descriptionKey: "notSupportedFullOuterSqlite", notSupported: true },
      { syntax: "ARRAY[]", descriptionKey: "notSupportedArray", notSupported: true },
      { syntax: "LATERAL", descriptionKey: "notSupportedLateral", notSupported: true },
      { syntax: "STORED PROCEDURES", descriptionKey: "notSupportedStoredProcedures", notSupported: true },
      { syntax: "WINDOW FUNCTIONS (advanced)", descriptionKey: "limitedWindowFunctions" },
    ],
  },
];

/* ─── Lookup map ──────────────────────────────────────────────────────────── */

const referenceMap: Record<Dialect, SyntaxSection[]> = {
  sqlite: sqliteSections,
  mysql: mysqlSections,
  postgresql: postgresqlSections,
};

/**
 * Get the syntax reference for the given dialect.
 */
export function getSyntaxReference(dialect: Dialect): SyntaxReference {
  return {
    dialect,
    sections: referenceMap[dialect],
  };
}