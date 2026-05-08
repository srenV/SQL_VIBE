"use client";

import React, { useCallback, useEffect, useState } from "react";
import type { SchemaTable, SqlColumn, SqlRow } from "@/types/playground";
import { peekTableData } from "@/lib/sqlEngine";
import { Card } from "@/components/card";
import { SchemaGraph } from "@/components/schemaGraph";

export interface SchemaExplorerProps {
  tables: SchemaTable[];
  db?: import("sql.js").Database | null;
  /** Sandbox-Modus: zeigt zusaetzliche Aktionen (Drop Table, Create Table, Insert). */
  sandboxMode?: boolean;
  /** Callback: Tabelle droppen (nur Sandbox). */
  onDropTable?: (tableName: string) => void;
  /** Callback: INSERT-Template in Editor einfuegen (nur Sandbox). */
  onInsertTemplate?: (tableName: string) => void;
  /** Callback: CREATE TABLE-Template in Editor einfuegen (nur Sandbox). */
  onCreateTableTemplate?: () => void;
}

type ViewMode = "rm" | "data" | "schema";

interface TableDataCache {
  columns: SqlColumn[];
  rows: SqlRow[];
  totalRows?: number;
}

export const SchemaExplorer: React.FC<SchemaExplorerProps> = ({ tables, db, sandboxMode, onDropTable, onInsertTemplate, onCreateTableTemplate }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("rm");
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

  // Automatisch Daten laden, wenn "Daten" der aktive View ist
  useEffect(() => {
    if (viewMode === "data" && db) {
      tables.forEach((table) => loadTableData(table.name));
    }
  }, [viewMode, db]); // eslint-disable-line react-hooks/exhaustive-deps

  if (tables.length === 0) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-ink-muted">
          Keine Tabellen in der aktuellen Datenbank.
        </p>
        {sandboxMode && onCreateTableTemplate && (
          <button
            onClick={onCreateTableTemplate}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Tabelle erstellen
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 rounded-lg bg-surface-dim/70 dark:bg-dark-dim/70 p-1">
        <button
          onClick={() => setViewMode("rm")}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            viewMode === "rm"
              ? "bg-white text-ink shadow-sm dark:bg-dark-dim dark:text-ink"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          RM
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
      </div>

      {viewMode === "rm" && <SchemaGraph tables={tables} />}

      {/* Sandbox: Create Table Button */}
      {sandboxMode && onCreateTableTemplate && viewMode !== "rm" && (
        <button
          onClick={onCreateTableTemplate}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-primary-900/20 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Tabelle erstellen
        </button>
      )}

      {viewMode === "schema" &&
        tables.map((table) => (
          <Card key={table.name} variant="flat" className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                Tabelle
              </span>
              <span className="text-sm font-semibold text-ink">{table.name}</span>
              {sandboxMode && (
                <div className="ml-auto flex items-center gap-1">
                  {onInsertTemplate && (
                    <button
                      onClick={() => onInsertTemplate(table.name)}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-ink-muted hover:text-ink hover:bg-surface-dim dark:hover:bg-dark-dim transition-colors"
                      title="INSERT-Template einfügen"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                  {onDropTable && (
                    <button
                      onClick={() => onDropTable(table.name)}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-error/70 hover:text-error hover:bg-error/10 transition-colors"
                      title="Tabelle löschen"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
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
              {sandboxMode && (
                <div className="ml-auto flex items-center gap-1">
                  {onInsertTemplate && (
                    <button
                      onClick={() => onInsertTemplate(table.name)}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-ink-muted hover:text-ink hover:bg-surface-dim dark:hover:bg-dark-dim transition-colors"
                      title="INSERT-Template einfügen"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                  {onDropTable && (
                    <button
                      onClick={() => onDropTable(table.name)}
                      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-error/70 hover:text-error hover:bg-error/10 transition-colors"
                      title="Tabelle löschen"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
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
                              <td key={col.name} className="px-2 py-1 text-ink whitespace-nowrap max-w-50 truncate">
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