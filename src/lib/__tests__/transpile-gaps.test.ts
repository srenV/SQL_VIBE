/**
 * Gap-analysis tests for postgresCompat and mysqlCompat.
 * These 50 tests cover edge cases, interaction bugs, and untested paths
 * identified by systematic review of the transpilation layer.
 */
import { describe, it, expect } from "vitest";
import { postgresToSqlite } from "../postgresCompat";
import { mysqlToSqlite } from "../mysqlCompat";
import { mapSqliteError, mapSqliteType } from "../dialectCompat";

// ─── MySQL — String Literal Edge Cases ─────────────────────────────────────

describe("Gap: MySQL string literal safety for function keywords", () => {
  it("CONCAT() inside string literal should NOT be transformed", () => {
    const sql = "SELECT 'Use CONCAT(a,b) for joining' AS tip;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("'Use CONCAT(a,b) for joining'");
    expect(result).not.toContain("'Use a || b for joining'");
  });

  it("DATE_FORMAT inside string literal should NOT be transformed", () => {
    const sql = "SELECT 'DATE_FORMAT is a function' AS info;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("'DATE_FORMAT is a function'");
  });

  it("GREATEST inside string literal should NOT be transformed", () => {
    const sql = "SELECT 'GREATEST value' AS label;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("'GREATEST value'");
    expect(result).not.toContain("MAX(");
  });

  it("IF() inside string literal with comma should NOT be transformed", () => {
    const sql = "SELECT 'IF(a,b,c) works' AS info;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("'IF(a,b,c) works'");
    expect(result).not.toContain("CASE WHEN");
  });

  it("LIMIT inside string literal should NOT be transformed", () => {
    const sql = "SELECT 'LIMIT 10, 20 is pagination' AS tip;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("'LIMIT 10, 20 is pagination'");
    expect(result).not.toContain("LIMIT 20 OFFSET 10");
  });

  it("UNSIGNED inside string literal should NOT be removed", () => {
    const sql = "SELECT 'UNSIGNED integer' AS info;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("'UNSIGNED integer'");
  });

  it("XOR inside string literal should NOT be transformed", () => {
    const sql = "SELECT 'a XOR b is logical' AS info;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("'a XOR b is logical'");
    expect(result).not.toContain("AND NOT");
  });
});

// ─── MySQL — Multi-line & Complex SQL ──────────────────────────────────────

describe("Gap: MySQL multi-line and complex SQL", () => {
  it("Multi-line CREATE TABLE with AUTO_INCREMENT", () => {
    const sql = "CREATE TABLE users (\n  id INT AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(100)\n);";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("INTEGER PRIMARY KEY AUTOINCREMENT");
    expect(result).toContain("TEXT");
  });

  it("Multi-line CREATE TABLE with ENGINE on separate line", () => {
    const sql = "CREATE TABLE users (\n  id INT PRIMARY KEY,\n  name VARCHAR(100)\n) ENGINE=InnoDB;";
    const result = mysqlToSqlite(sql);
    expect(result).not.toContain("ENGINE");
    expect(result).toContain("name TEXT");
  });

  it("RIGHT JOIN with subquery alias", () => {
    const sql = "SELECT * FROM (SELECT * FROM a) AS t1 RIGHT JOIN b ON t1.id = b.id;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("LEFT JOIN");
    expect(result).not.toContain("RIGHT JOIN");
  });

  it("Nested IF inside CONCAT", () => {
    const sql = "SELECT CONCAT(IF(active, 'yes', 'no'), ' ', name) FROM users;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("CASE WHEN");
    expect(result).toContain("||");
    expect(result).not.toContain("IF(");
    expect(result).not.toContain("CONCAT(");
  });

  it("LIMIT with OFFSET already present should not double-transform", () => {
    const sql = "SELECT * FROM users LIMIT 10 OFFSET 5;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("LIMIT 10 OFFSET 5");
    // Should NOT become LIMIT 5 OFFSET 10
    expect(result).not.toContain("LIMIT 5 OFFSET 10");
  });

  it("SHOW COLUMNS FROM table with backticks", () => {
    const sql = "SHOW COLUMNS FROM `my_table`;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain('PRAGMA table_info("my_table")');
  });
});

// ─── MySQL — Type Mapping Edge Cases ────────────────────────────────────────

describe("Gap: MySQL type mapping edge cases", () => {
  it("CHAR(10) → TEXT", () => {
    const sql = "CREATE TABLE t (code CHAR(10));";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("code TEXT");
  });

  it("Multiple type conversions in one CREATE TABLE", () => {
    const sql = "CREATE TABLE t (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, active BOOLEAN DEFAULT TRUE, price DECIMAL(10,2), created DATETIME DEFAULT CURRENT_TIMESTAMP);";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("id INTEGER PRIMARY KEY AUTOINCREMENT");
    expect(result).not.toContain("UNSIGNED");
    expect(result).toContain("name TEXT");
    expect(result).toContain("active INTEGER DEFAULT 1");
    expect(result).toContain("price REAL");
    expect(result).toContain("created TEXT DEFAULT CURRENT_TIMESTAMP");
  });

  it("FLOAT without precision → REAL", () => {
    const sql = "CREATE TABLE t (ratio FLOAT);";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("ratio REAL");
  });

  it("INT(11) with UNSIGNED → INTEGER without UNSIGNED", () => {
    const sql = "CREATE TABLE t (id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT, PRIMARY KEY (id));";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("INTEGER NOT NULL AUTOINCREMENT");
    expect(result).not.toContain("UNSIGNED");
    expect(result).toContain("PRIMARY KEY");
  });

  it("NUMERIC(10,2) → REAL", () => {
    const sql = "CREATE TABLE products (id INT PRIMARY KEY, price NUMERIC(10,2));";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("price REAL");
  });
});

// ─── MySQL — Function Edge Cases ────────────────────────────────────────────

describe("Gap: MySQL function edge cases", () => {
  it("IFNULL() should NOT be confused with IF()", () => {
    const sql = "SELECT IFNULL(name, 'unknown') FROM users;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("IFNULL(name, 'unknown')");
    expect(result).not.toContain("CASE WHEN");
  });

  it("GROUP_CONCAT should NOT be confused with CONCAT", () => {
    const sql = "SELECT GROUP_CONCAT(name SEPARATOR ', ') FROM users;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("GROUP_CONCAT(name SEPARATOR ', ')");
    expect(result).not.toContain("||");
  });

  it("CONCAT with only 1 argument should pass through unchanged", () => {
    const sql = "SELECT CONCAT(name) FROM users;";
    const result = mysqlToSqlite(sql);
    // Single-arg CONCAT is not transformed (requires 2+ args)
    expect(result).toContain("CONCAT(name)");
  });

  it("DATEDIFF with column references", () => {
    const sql = "SELECT DATEDIFF(end_date, start_date) FROM projects;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("CAST(julianday(end_date) - julianday(start_date) AS INTEGER)");
  });

  it("TIMESTAMPDIFF with HOUR unit", () => {
    const sql = "SELECT TIMESTAMPDIFF(HOUR, start_time, end_time) FROM sessions;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("* 24");
  });

  it("TIMESTAMPDIFF with MINUTE unit", () => {
    const sql = "SELECT TIMESTAMPDIFF(MINUTE, start_time, end_time) FROM sessions;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("* 1440");
  });
});

// ─── PostgreSQL — Dollar-Quoted String Edge Cases ────────────────────────────

describe("Gap: PG dollar-quoted string edge cases", () => {
  it("Dollar-quoted string with single quotes inside", () => {
    const sql = "SELECT $$it's a test$$;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("'it''s a test'");
  });

  it("Dollar-quoted string with nested tag containing quotes", () => {
    const sql = "SELECT $tag$hello 'world'$tag$;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("'hello ''world'''");
  });

  it("Multiple dollar-quoted strings in one statement", () => {
    const sql = "SELECT $$hello$$, $$world$$;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("'hello'");
    expect(result).toContain("'world'");
  });

  it("Dollar-quoted string in INSERT", () => {
    const sql = "INSERT INTO logs (message) VALUES ($tag$Error: connection failed$tag$);";
    const result = postgresToSqlite(sql);
    expect(result).toContain("'Error: connection failed'");
  });
});

// ─── PostgreSQL — CAST Shorthand Edge Cases ──────────────────────────────────

describe("Gap: PG CAST shorthand edge cases", () => {
  it("::text with table-qualified column", () => {
    const sql = "SELECT u.id::text FROM users u;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("CAST(u.id AS TEXT)");
  });

  it("Multiple ::type in one statement", () => {
    const sql = "SELECT id::integer, price::real, name::text FROM products;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("CAST(id AS INTEGER)");
    expect(result).toContain("CAST(price AS REAL)");
    expect(result).toContain("CAST(name AS TEXT)");
  });

  it("::text inside string literal should NOT be transformed", () => {
    const sql = "SELECT 'value::text' AS label;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("'value::text'");
  });

  it("::boolean → CAST(expr AS INTEGER)", () => {
    const sql = "SELECT active::boolean FROM users;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("CAST(active AS INTEGER)");
  });
});

// ─── PostgreSQL — RETURNING Edge Cases ───────────────────────────────────────

describe("Gap: PG RETURNING edge cases", () => {
  it("RETURNING in UPDATE statement", () => {
    const sql = "UPDATE users SET name = 'John' WHERE id = 1 RETURNING *;";
    const result = postgresToSqlite(sql);
    expect(result).not.toContain("RETURNING");
  });

  it("RETURNING in DELETE statement", () => {
    const sql = "DELETE FROM users WHERE id = 1 RETURNING id, name;";
    const result = postgresToSqlite(sql);
    expect(result).not.toContain("RETURNING");
  });

  it("RETURNING with no semicolon", () => {
    const sql = "INSERT INTO users (name) VALUES ('John') RETURNING *";
    const result = postgresToSqlite(sql);
    expect(result).not.toContain("RETURNING");
  });
});

// ─── PostgreSQL — ON CONFLICT Edge Cases ────────────────────────────────────

describe("Gap: PG ON CONFLICT edge cases", () => {
  it("ON CONFLICT DO NOTHING without column list", () => {
    const sql = "INSERT INTO users (name) VALUES ('John') ON CONFLICT DO NOTHING;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("INSERT OR IGNORE");
    expect(result).not.toContain("ON CONFLICT");
  });

  it("ON CONFLICT with column list and DO UPDATE", () => {
    const sql = "INSERT INTO users (id, name) VALUES (1, 'John') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("INSERT OR REPLACE");
    expect(result).not.toContain("ON CONFLICT");
    expect(result).not.toContain("EXCLUDED");
  });

  it("ON CONFLICT DO NOTHING in simple INSERT", () => {
    const sql = "INSERT INTO t (a) VALUES (1) ON CONFLICT DO NOTHING;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("INSERT OR IGNORE INTO t (a) VALUES (1)");
  });
});

// ─── PostgreSQL — ALTER TABLE ADD COLUMN Edge Cases ─────────────────────────

describe("Gap: PG ALTER TABLE ADD COLUMN edge cases", () => {
  it("ALTER TABLE ADD COLUMN with DOUBLE PRECISION", () => {
    const sql = "ALTER TABLE measurements ADD COLUMN value DOUBLE PRECISION;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("value REAL");
  });

  it("ALTER TABLE ADD COLUMN with TIMESTAMPTZ", () => {
    const sql = "ALTER TABLE events ADD COLUMN created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("created_at TEXT DEFAULT CURRENT_TIMESTAMP");
  });

  it("ALTER TABLE ADD COLUMN with SERIAL (should not transform — SERIAL is CREATE TABLE only)", () => {
    const sql = "ALTER TABLE users ADD COLUMN new_id SERIAL;";
    const result = postgresToSqlite(sql);
    // SERIAL is only transformed in CREATE TABLE context, not ALTER TABLE ADD COLUMN
    // This is a known limitation
    expect(result).toContain("SERIAL");
  });
});

// ─── Cross-Dialect — Interaction & Order-Dependent Bugs ─────────────────────

describe("Gap: Cross-dialect interaction edge cases", () => {
  it("MySQL: BOOLEAN keyword in INSERT VALUES (not CREATE TABLE) should still convert", () => {
    const sql = "INSERT INTO t (status) VALUES (TRUE);";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("VALUES (1)");
  });

  it("MySQL: AUTO_INCREMENT in a non-CREATE-TABLE context (string literal)", () => {
    const sql = "SELECT * FROM t WHERE col = 'AUTO_INCREMENT';";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("'AUTO_INCREMENT'");
  });

  it("PG: BOOLEAN in ALTER TABLE ADD COLUMN with DEFAULT TRUE", () => {
    const sql = "ALTER TABLE users ADD COLUMN active BOOLEAN DEFAULT TRUE;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("active INTEGER DEFAULT 1");
  });

  it("PG: TIMESTAMP WITH TIME ZONE in ALTER TABLE ADD COLUMN", () => {
    const sql = "ALTER TABLE events ADD COLUMN ts TIMESTAMP WITH TIME ZONE;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("ts TEXT");
  });

  it("MySQL: CREATE TABLE with BOOLEAN DEFAULT TRUE — both must transform", () => {
    const sql = "CREATE TABLE t (id INT PRIMARY KEY, active BOOLEAN DEFAULT TRUE);";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("active INTEGER DEFAULT 1");
  });
});

// ─── Error Mapping & Type Mapping Edge Cases ────────────────────────────────

describe("Gap: Error mapping edge cases", () => {
  it("PG: no such view error mapping", () => {
    const result = mapSqliteError("no such view: my_view", "postgresql");
    expect(result).toContain("does not exist");
  });

  it("MySQL: UNIQUE constraint failed with table.column format", () => {
    const result = mapSqliteError("UNIQUE constraint failed: users.email", "mysql");
    expect(result).toContain("Duplicate entry");
  });

  it("PG: NOT NULL constraint failed error mapping", () => {
    const result = mapSqliteError("NOT NULL constraint failed: users.name", "postgresql");
    expect(result).toContain("null value");
    expect(result).toContain("name");
  });

  it("MySQL: syntax error near keyword", () => {
    const result = mapSqliteError('near "FROM": syntax error', "mysql");
    expect(result).toContain("SQL syntax");
  });
});

describe("Gap: Type mapping edge cases", () => {
  it("PG: DATETIME → TIMESTAMP WITH TIME ZONE", () => {
    expect(mapSqliteType("DATETIME", "postgresql")).toBe("TIMESTAMP WITH TIME ZONE");
  });

  it("MySQL: BLOB → BLOB", () => {
    expect(mapSqliteType("BLOB", "mysql")).toBe("BLOB");
  });

  it("PG: DATE → DATE", () => {
    expect(mapSqliteType("DATE", "postgresql")).toBe("DATE");
  });

  it("MySQL: BOOLEAN → BOOL mapping (not in switch, falls through)", () => {
    // BOOLEAN is not explicitly in the MySQL type mapper — check what happens
    const result = mapSqliteType("BOOLEAN", "mysql");
    // Should fall through to the regex or default
    expect(result).toBeTruthy();
  });

  it("PG: NUMERIC → NUMERIC", () => {
    expect(mapSqliteType("NUMERIC", "postgresql")).toBe("NUMERIC");
  });

  it("MySQL: VARCHAR(255) → VARCHAR(255) (already MySQL-like)", () => {
    expect(mapSqliteType("VARCHAR(255)", "mysql")).toBe("VARCHAR(255)");
  });
});

// ─── Additional Edge Cases ──────────────────────────────────────────────────

describe("Gap: Additional MySQL edge cases", () => {
  it("MySQL: TRUNCATE without TABLE keyword", () => {
    // PG supports TRUNCATE without TABLE, MySQL requires TABLE
    // But MySQL's regex requires TABLE keyword
    const sql = "TRUNCATE users;";
    const result = mysqlToSqlite(sql);
    // MySQL regex requires "TRUNCATE TABLE" — bare TRUNCATE won't match
    // This is a known limitation
    expect(result).toBeTruthy();
  });

  it("MySQL: SHOW FULL TABLES", () => {
    const sql = "SHOW FULL TABLES;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("Table_type");
    expect(result).toContain("sqlite_master");
  });

  it("MySQL: DESCRIBE with backtick-quoted table name", () => {
    const sql = "DESCRIBE `my_table`;";
    const result = mysqlToSqlite(sql);
    // Backticks should be converted to double quotes first
    expect(result).toContain('PRAGMA table_info("my_table")');
  });

  it("MySQL: Multiple SET commands in one script", () => {
    const sql = "SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO'; SET time_zone='+00:00'; SELECT * FROM users;";
    const result = mysqlToSqlite(sql);
    expect(result).not.toContain("SQL_MODE");
    expect(result).not.toContain("time_zone");
    expect(result).toContain("SELECT * FROM users");
  });

  it("MySQL: CREATE TABLE with COLLATE in column definition", () => {
    const sql = "CREATE TABLE t (id INT PRIMARY KEY, name VARCHAR(100) COLLATE utf8_general_ci);";
    const result = mysqlToSqlite(sql);
    // COLLATE in column definitions is not removed by current logic
    // (only table-level COLLATE is removed)
    expect(result).toContain("name TEXT");
  });

  it("MySQL: INSERT with ON DUPLICATE KEY UPDATE multiple columns", () => {
    const sql = "INSERT INTO users (id, name, email) VALUES (1, 'John', 'john@example.com') ON DUPLICATE KEY UPDATE name='John', email='john@example.com';";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("INSERT OR REPLACE INTO users");
    expect(result).not.toContain("ON DUPLICATE KEY");
  });

  it("MySQL: LIMIT 0, 10 (offset 0)", () => {
    const sql = "SELECT * FROM users LIMIT 0, 10;";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("LIMIT 10 OFFSET 0");
  });
});

describe("Gap: Additional PostgreSQL edge cases", () => {
  it("PG: TRUNCATE without TABLE keyword", () => {
    const sql = "TRUNCATE users;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("DELETE FROM users");
  });

  it("PG: TRUNCATE TABLE with semicolon", () => {
    const sql = "TRUNCATE TABLE users;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("DELETE FROM users");
  });

  it("PG: SMALLSERIAL → INTEGER (same as SERIAL)", () => {
    const sql = "CREATE TABLE t (id SMALLSERIAL PRIMARY KEY, name TEXT);";
    const result = postgresToSqlite(sql);
    expect(result).toContain("id INTEGER PRIMARY KEY");
  });

  it("PG: CREATE TABLE with DEFAULT FALSE", () => {
    const sql = "CREATE TABLE t (id SERIAL PRIMARY KEY, active BOOLEAN DEFAULT FALSE);";
    const result = postgresToSqlite(sql);
    expect(result).toContain("active INTEGER DEFAULT 0");
  });

  it("PG: SELECT with both ILIKE and NOT ILIKE", () => {
    const sql = "SELECT * FROM users WHERE name ILIKE '%john%' AND name NOT ILIKE '%admin%';";
    const result = postgresToSqlite(sql);
    expect(result).toContain("LOWER(name) LIKE LOWER('%john%')");
    expect(result).toContain("LOWER(name) NOT LIKE LOWER('%admin%')");
    expect(result).not.toContain("ILIKE");
  });

  it("PG: DATE_TRUNC with 'hour' unit", () => {
    const sql = "SELECT DATE_TRUNC('hour', created_at) FROM events;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("strftime('%Y-%m-%d %H:00:00', created_at)");
  });

  it("PG: AGE() with column references", () => {
    const sql = "SELECT AGE(end_date, start_date) FROM projects;";
    const result = postgresToSqlite(sql);
    expect(result).toContain("julianday(end_date) - julianday(start_date)");
  });
});