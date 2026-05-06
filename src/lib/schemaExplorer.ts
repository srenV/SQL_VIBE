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

/**
 * Introspektiert das Schema einer sql.js-Datenbank und liefert strukturierte Tabelleninformationen.
 * @param db - Die sql.js-Datenbankinstanz.
 * @returns Array von SchemaTable mit Spalten und Fremdschluesseln.
 */
export function introspectSchema(db: import("sql.js").Database): SchemaTable[] {
  const tables = getSchema(db);
  return tables.map((t) => {
    const info = getTableInfo(db, t.name);
    const fks = getForeignKeys(db, t.name);
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
      columns,
      foreignKeys: foreignKeys.length > 0 ? foreignKeys : undefined,
    };
  });
}
