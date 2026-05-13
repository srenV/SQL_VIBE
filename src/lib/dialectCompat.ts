/**
 * Dialect Compatibility Layer – Unified entry point for SQL dialect transpilation.
 *
 * Routes SQL queries to the correct transpiler based on the selected dialect:
 * - "sqlite"    → pass-through (no transformation)
 * - "mysql"     → mysqlToSqlite() + mapSqliteErrorToMysql() + mapSqliteTypeToMysql()
 * - "postgresql" → postgresToSqlite() + mapSqliteErrorToPostgres() + mapSqliteTypeToPostgres()
 *
 * All SQL execution in the app should go through this module so the dialect
 * preference is respected everywhere.
 */

import type { Dialect } from "./dialect";
import { mysqlToSqlite, mapSqliteErrorToMysql, mapSqliteTypeToMysql, getMysqlCompatWarnings } from "./mysqlCompat";
import { postgresToSqlite, mapSqliteErrorToPostgres, mapSqliteTypeToPostgres, getPostgresCompatWarnings } from "./postgresCompat";

/**
 * Transpile a SQL statement from the user's dialect to SQLite-compatible syntax.
 * For "sqlite" dialect, returns the input unchanged.
 */
export function transpileToSqlite(sql: string, dialect: Dialect): string {
  switch (dialect) {
    case "sqlite":
      return sql;
    case "mysql":
      return mysqlToSqlite(sql);
    case "postgresql":
      return postgresToSqlite(sql);
    default:
      return sql;
  }
}

/**
 * Map a SQLite error message to a dialect-appropriate error message.
 * For "sqlite" dialect, returns the original SQLite error.
 */
export function mapSqliteError(sqliteError: string, dialect: Dialect): string {
  switch (dialect) {
    case "sqlite":
      return sqliteError;
    case "mysql":
      return mapSqliteErrorToMysql(sqliteError);
    case "postgresql":
      return mapSqliteErrorToPostgres(sqliteError);
    default:
      return sqliteError;
  }
}

/**
 * Map a SQLite column type to a dialect-appropriate type name.
 * For "sqlite" dialect, returns the original SQLite type.
 */
export function mapSqliteType(sqliteType: string, dialect: Dialect): string {
  switch (dialect) {
    case "sqlite":
      return sqliteType;
    case "mysql":
      return mapSqliteTypeToMysql(sqliteType);
    case "postgresql":
      return mapSqliteTypeToPostgres(sqliteType);
    default:
      return sqliteType;
  }
}

/**
 * Get compatibility warnings for a SQL statement in the given dialect.
 * Returns an array of warning strings (may be empty).
 */
export function getCompatWarnings(sql: string, dialect: Dialect): string[] {
  switch (dialect) {
    case "sqlite":
      return [];
    case "mysql":
      return getMysqlCompatWarnings(sql);
    case "postgresql":
      return getPostgresCompatWarnings(sql);
    default:
      return [];
  }
}