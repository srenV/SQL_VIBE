"use client";

import React, { useCallback, useState } from "react";
import type { SchemaTable, SqlColumn, SqlRow } from "@/types/playground";
import { peekTableData } from "@/lib/sqlEngine";
import { Card } from "@/components/card";

export interface SchemaExplorerProps {
  tables: SchemaTable[];
  db?: import("sql.js").Database | null;
}

type ViewMode = "schema" | "data";

interface TableDataCache {
  columns: SqlColumn[];
  rows: SqlRow[];
  totalRows?: number;
}

export const SchemaExplorer: React.FC<SchemaExplorerProps> = ({ tables, db }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("schema");
  const [tableData, setTableData] = useState<Record<string, TableDataCache>>({});
  const [loadingTables, setLoadingTables] = useState<Set<string>>(new Set());

  const loadTableData = useCallback(
    (tableName: string) => {
      if (!db || tableData[tableName] || loadingTables.has(tableName)) return;

      setLoadingTables((prev) => new Set(prev).add(tableName));

      try {
        const limit = 10;
        const result = peekTableData(db, tableName, limit);

        if (result.success && result.resultset) {
          setTableData((prev) => ({
            ...prev,
            [tableName]: {
              columns: result.resultset!.columns,
              rows: result.resultset!.rows,
            },
          }));
        }
      } finally {
        setLoadingTables((prev) => {
          const next = new Set(prev);
          next.delete(tableName);
          return next;
        });
      }
    },
    [db, tableData, loadingTables]
  );

  const switchToData = useCallback(() => {
    setViewMode("data");
    if (db) {
      tables.forEach((table) => {
        if (!tableData[table.name] && !loadingTables.has(table.name)) {
          loadTableData(table.name);
        }
      });
    }
  }, [db, tables, tableData, loadingTables, loadTableData]);

  if (tables.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        Keine Tabellen in der aktuellen Datenbank.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 rounded-lg bg-surface-dim/70 dark:bg-dark-dim/70 p-1">
        <button
          onClick={() => setViewMode("schema")}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            viewMode === "schema"
              ? "bg-white text-ink shadow-sm dark:bg-dark-dim dark:text-ink"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Schema
        </button>
        <button
          onClick={switchToData}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            viewMode === "data"
              ? "bg-white text-ink shadow-sm dark:bg-dark-dim dark:text-ink"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Daten
        </button>
      </div>

      {viewMode === "schema" &&
        tables.map((table) => (
          <Card key={table.name} variant="flat" className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                Tabelle
              </span>
              <span className="text-sm font-semibold text-ink">{table.name}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-dim dark:border-dark-dim">
                    <th className="px-2 py-1 text-left font-medium text-ink-muted">Spalte</th>
                    <th className="px-2 py-1 text-left font-medium text-ink-muted">Typ</th>
                    <th className="px-2 py-1 text-left font-medium text-ink-muted">Nullable</th>
                    <th className="px-2 py-1 text-left font-medium text-ink-muted">Default</th>
                    <th className="px-2 py-1 text-left font-medium text-ink-muted">PK</th>
                  </tr>
                </thead>
                <tbody>
                  {table.columns.map((col) => (
                    <tr key={col.name} className="border-b border-surface-dim/50 dark:border-dark-dim/50">
                      <td className="px-2 py-1 text-ink">{col.name}</td>
                      <td className="px-2 py-1 text-ink-muted">{col.type}</td>
                      <td className="px-2 py-1 text-ink-muted">{col.nullable ? "Ja" : "Nein"}</td>
                      <td className="px-2 py-1 text-ink-muted">{col.defaultValue ?? "-"}</td>
                      <td className="px-2 py-1 text-ink-muted">{col.isPrimaryKey ? "PK" : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {table.foreignKeys && table.foreignKeys.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-medium text-ink-muted mb-1">Fremdschlüssel</p>
                <ul className="text-xs text-ink-muted space-y-1">
                  {table.foreignKeys.map((fk, i) => (
                    <li key={i}>
                      {fk.column} → {fk.referencedTable}({fk.referencedColumn})
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        ))}

      {viewMode === "data" &&
        tables.map((table) => (
          <Card key={table.name} variant="flat" className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                Tabelle
              </span>
              <span className="text-sm font-semibold text-ink">{table.name}</span>
            </div>

            {!db ? (
              <p className="text-xs text-ink-muted italic">Datenbank nicht verfügbar.</p>
            ) : loadingTables.has(table.name) ? (
              <p className="text-xs text-ink-muted italic">Laden...</p>
            ) : tableData[table.name] ? (
              tableData[table.name].rows.length === 0 ? (
                <p className="text-xs text-ink-muted italic">Keine Daten in dieser Tabelle.</p>
              ) : (
                <>
                  <p className="text-xs text-ink-muted mb-2">
                    Zeige {tableData[table.name].rows.length} Zeile{tableData[table.name].rows.length !== 1 ? "n" : ""}
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-surface-dim dark:border-dark-dim rounded">
                      <thead>
                        <tr className="bg-surface-dim/50 dark:bg-dark-dim/50">
                          {tableData[table.name].columns.map((col) => (
                            <th key={col.name} className="px-2 py-1 text-left font-medium text-ink-muted border-b border-surface-dim dark:border-dark-dim">
                              {col.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData[table.name].rows.map((row, rowIdx) => (
                          <tr key={rowIdx} className="border-b border-surface-dim/30 dark:border-dark-dim/30">
                            {tableData[table.name].columns.map((col) => (
                              <td key={col.name} className="px-2 py-1 text-ink whitespace-nowrap max-w-[200px] truncate">
                                {row[col.name] != null ? String(row[col.name]) : <span className="text-ink-muted italic">NULL</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )
            ) : (
              <p className="text-xs text-ink-muted italic">Laden...</p>
            )}
          </Card>
        ))}
    </div>
  );
};