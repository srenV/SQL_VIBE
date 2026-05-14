/**
 * Schema-Explorer
 *
 * Introspektiert eine In-Memory-sql.js-Datenbank und liefert strukturierte
 * Schema-Informationen: Tabellen, Spalten, Fremdschluessel.
 *
 * English: Schema Explorer. Introspects an in-memory sql.js database
 * and returns structured schema information.
 */

import type { SchemaColumn, SchemaTable, ForeignKey } from "@/types/playground";
import { getForeignKeys, getSchema, getTableInfo } from "./sqlEngine";
import type { Dialect } from "./dialect";

/**
 * Introspektiert das Schema einer sql.js-Datenbank und liefert strukturierte Tabelleninformationen.
 * @param db - Die sql.js-Datenbankinstanz.
 * @param dialect - Der SQL-Dialekt (Standard: "mysql").
 * @returns Array von SchemaTable mit Spalten und Fremdschluesseln.
 */
export function introspectSchema(db: import("sql.js").Database, dialect: Dialect = "mysql"): SchemaTable[] {
  const tables = getSchema(db);
  return tables.map((t) => {
    const info = getTableInfo(db, t.name, dialect);
    // Views don't have foreign keys
    const fks = t.type === "view" ? [] : getForeignKeys(db, t.name, dialect);
    const columns: SchemaColumn[] = info.map((col) => ({
      name: col.name,
      type: col.type,
      nullable: col.notnull === 0,
      defaultValue: col.dflt_value != null ? String(col.dflt_value) : undefined,
      isPrimaryKey: col.pk === 1,
    }));

    const foreignKeys: ForeignKey[] = fks.map((fk) => ({
      column: fk.from,
      referencedTable: fk.table,
      referencedColumn: fk.to,
    }));

    return {
      name: t.name,
      type: t.type,
      columns,
      foreignKeys: foreignKeys.length > 0 ? foreignKeys : undefined,
      sql: t.sql ?? undefined,
    };
  });
}

/**
 * Merged das live-introspektierte Schema (Spalten aus der DB) mit den
 * Fremdschluessel-Definitionen aus den statischen Schema-Tabellen (Dataset-Metadaten).
 *
 * SQL-DDL in den Datasets deklariert oft keine FOREIGN KEY Constraints,
 * sodass PRAGMA foreign_key_list() leer ist. Die FK-Info steckt stattdessen
 * in den ColumnDef.references der Dataset-Definition.
 *
 * @param liveSchema - Von introspectSchema() aus der Live-DB ermittelt.
 * @param staticSchema - Aus exercise.schemaTables (vom Adapter aus Dataset-Metadaten gebaut).
 * @returns Gemerged Schema: Spalten aus liveSchema, FKs aus staticSchema.
 */
export function mergeSchemaWithFKs(
  liveSchema: SchemaTable[],
  staticSchema: SchemaTable[]
): SchemaTable[] {
  if (liveSchema.length === 0) return staticSchema;

  const staticFKMap = new Map<string, ForeignKey[]>();
  for (const t of staticSchema) {
    if (t.foreignKeys && t.foreignKeys.length > 0) {
      staticFKMap.set(t.name, t.foreignKeys);
    }
  }

  return liveSchema.map((liveTable) => {
    const fks = staticFKMap.get(liveTable.name);
    return {
      ...liveTable,
      foreignKeys: fks && fks.length > 0 ? fks : liveTable.foreignKeys,
    };
  });
}
