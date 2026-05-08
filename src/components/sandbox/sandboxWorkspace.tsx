/**
 * SandboxWorkspace – Hauptarbeitsbereich des Sandbox-Modus.
 *
 * Orchestriert SQL-Editor, Schema-Explorer und Ergebnis-Anzeige
 * in einem Split-Pane-Layout.
 *
 * English: SandboxWorkspace – Main workspace of the Sandbox mode.
 * Orchestrates SQL editor, schema explorer, and result display
 * in a split-pane layout.
 */

"use client";

import React, { useState } from "react";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { SqlEditor } from "@/components/sqlEditor";
import { ResultsetTable } from "@/components/resultsetTable";
import { SchemaExplorer } from "@/components/schemaExplorer";
import type { SandboxQueryResult, QueryHistoryEntry } from "@/types/sandbox";
import type { SchemaTable, SqlColumn } from "@/types/playground";
import { explainError } from "@/lib/errorExplanation";
import { peekTableData } from "@/lib/sqlEngine";

export interface SandboxWorkspaceProps {
  /** Die aktive sql.js-Datenbankinstanz. */
  db: import("sql.js").Database | null;
  /** Aktuelles Schema der aktiven Datenbank. */
  liveSchema: SchemaTable[];
  /** Ergebnis der letzten Query. */
  queryResult: SandboxQueryResult | null;
  /** Query-History. */
  queryHistory: QueryHistoryEntry[];
  /** Fuehrt eine SQL-Abfrage aus. */
  onRunQuery: (sql: string) => Promise<void>;
  /** Aktualisiert das Schema. */
  onRefreshSchema: () => void;
  /** Ob der Hook laedt. */
  isLoading: boolean;
}

/** DML/DDL-Erfolgsmeldungen auf Deutsch. */
function getDmlMessage(result: SandboxQueryResult): string {
  if (result.statementType === "DDL") {
    return "Schema geändert.";
  }
  if (result.rowsModified > 0) {
    return `${result.rowsModified} Zeile${result.rowsModified !== 1 ? "n" : ""} betroffen.`;
  }
  return "Befehl ausgeführt.";
}

/** Zeigt eine Daten-Vorschau für eine einzelne Tabelle. */
const PeekTableData: React.FC<{ db: import("sql.js").Database | null; tableName: string }> = ({ db, tableName }) => {
  const [data, setData] = useState<{ columns: SqlColumn[]; rows: Record<string, unknown>[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!db) return;
    try {
      const result = peekTableData(db, tableName, 50);
      if (result.success && result.resultset) {
        setData({ columns: result.resultset.columns, rows: result.resultset.rows as Record<string, unknown>[] });
        setError(null);
      } else {
        setData(null);
        setError(result.error || "Keine Daten verfügbar.");
      }
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : "Fehler beim Laden der Daten.");
    }
  }, [db, tableName]);

  if (error) {
    return <p className="text-xs text-error italic">{error}</p>;
  }

  if (!data) {
    return <p className="text-xs text-ink-muted italic">Laden…</p>;
  }

  if (data.rows.length === 0) {
    return <p className="text-xs text-ink-muted italic">Tabelle ist leer.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <ResultsetTable columns={data.columns} rows={data.rows} />
    </div>
  );
};

export const SandboxWorkspace: React.FC<SandboxWorkspaceProps> = ({
  db,
  liveSchema,
  queryResult,
  queryHistory,
  onRunQuery,
  onRefreshSchema,
  isLoading,
}) => {
  const [userQuery, setUserQuery] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<"result" | "data" | "graph" | "schema">("result");

  const hasNoDb = !db;

  const handleRun = async () => {
    if (!userQuery.trim()) return;
    await onRunQuery(userQuery);
    setActiveTab("result");
  };

  const handleHistorySelect = (sql: string) => {
    setUserQuery(sql);
    setShowHistory(false);
  };

  type TabKey = "result" | "data" | "graph" | "schema";
  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: "result",
      label: "Ergebnis",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: "data",
      label: "Daten",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
    },
    {
      key: "graph",
      label: "Graph",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      key: "schema",
      label: "Schema",
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-surface-dim dark:border-dark-dim bg-surface-dim/30 dark:bg-dark-dim/30">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleRun} disabled={!userQuery.trim() || isLoading}>
            Ausführen
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setUserQuery("")}>
            Leeren
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {/* History-Toggle */}
          <button
            onClick={() => setShowHistory(!showHistory)}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors ${
              showHistory
                ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            History
          </button>
          {/* Engine-Hinweis */}
          <span className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-muted bg-surface-dim dark:bg-dark-dim" title="MySQL-Syntax wird unterstützt. RIGHT JOIN, IF(), CONCAT(), NOW() etc. werden automatisch übersetzt. FULL OUTER JOIN wird nicht unterstützt.">
            MySQL
          </span>
        </div>
      </div>

      {/* SQL Editor (full width, top) */}
      <div className="px-4 pt-4 pb-3 border-b border-surface-dim dark:border-dark-dim">
        <SqlEditor
          label="SQL-Abfrage"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          onSubmit={handleRun}
          placeholder={hasNoDb ? "Füge dein SQL ein — eine Datenbank wird automatisch erstellt …" : "Schreibe hier dein SQL — z.B. CREATE TABLE, INSERT, SELECT …"}
        />
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-0 border-b border-surface-dim dark:border-dark-dim bg-surface-dim/20 dark:bg-dark-dim/20">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-primary-500 text-primary-700 dark:text-primary-300"
                : "border-transparent text-ink-muted hover:text-ink hover:border-surface-dim dark:hover:border-dark-dim"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* ── Ergebnis Tab ── */}
        {activeTab === "result" && (
          <>
            {/* Query History Overlay */}
            {showHistory && (
              <Card variant="flat" className="p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-ink-muted">Letzte Abfragen</h4>
                  <button onClick={() => setShowHistory(false)} className="text-xs text-ink-muted hover:text-ink">Schließen</button>
                </div>
                {queryHistory.length === 0 ? (
                  <p className="text-xs text-ink-muted italic">Noch keine Abfragen ausgeführt.</p>
                ) : (
                  <ul className="space-y-1">
                    {queryHistory.slice(0, 20).map((entry, i) => (
                      <li key={i}>
                        <button
                          onClick={() => handleHistorySelect(entry.sql)}
                          className="w-full text-left rounded px-2 py-1.5 text-xs font-mono text-ink hover:bg-surface-dim dark:hover:bg-dark-dim transition-colors truncate"
                          title={entry.sql}
                        >
                          <span className={entry.success ? "text-success" : "text-error"}>●</span>{" "}
                          {entry.sql.length > 80 ? entry.sql.slice(0, 80) + "…" : entry.sql}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            )}

            {/* Empty State */}
            {!queryResult && !isLoading && hasNoDb && (
              <div className="flex items-center justify-center h-full text-ink-muted">
                <div className="text-center space-y-3">
                  <svg className="w-12 h-12 mx-auto text-surface-dim dark:text-dark-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5 0v3.75m16.5 0v3.75m-16.5 0v3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                  </svg>
                  <p className="text-sm font-medium">Keine Datenbank geöffnet</p>
                  <p className="text-xs">Füge SQL in den Editor ein und klicke &quot;Ausführen&quot; — eine Datenbank wird automatisch erstellt. Oder erstelle eine in der Seitenleiste.</p>
                </div>
              </div>
            )}
            {!queryResult && !isLoading && !hasNoDb && (
              <div className="flex items-center justify-center h-full text-ink-muted">
                <div className="text-center space-y-2">
                  <svg className="w-12 h-12 mx-auto text-surface-dim dark:text-dark-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">Schreibe eine SQL-Abfrage und klicke &quot;Ausführen&quot;</p>
                  <p className="text-xs">oder drücke Strg + Enter</p>
                </div>
              </div>
            )}

            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <p className="text-sm text-ink-muted animate-pulse">Datenbank wird geladen…</p>
              </div>
            )}

            {queryResult && !queryResult.success && (
              <Card variant="outlined" className="p-4 border-error/40">
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-error/10 text-error text-xs font-bold" aria-hidden="true">
                    !
                  </span>
                  <div className="space-y-1">
                    {(() => {
                      const exp = explainError(queryResult.error || "");
                      return (
                        <>
                          <p className="text-sm font-semibold text-error">{exp.category}</p>
                          <p className="text-sm text-ink">{exp.userMessage}</p>
                          <p className="text-xs text-ink-muted font-mono">{exp.originalError}</p>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </Card>
            )}

            {queryResult && queryResult.success && queryResult.resultset && queryResult.resultset.rows.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-ink">Ergebnis</h4>
                  <span className="text-xs text-ink-muted">
                    {queryResult.resultset.rows.length} Zeile{queryResult.resultset.rows.length !== 1 ? "n" : ""}
                    {queryResult.executionTimeMs != null && ` · ${queryResult.executionTimeMs}ms`}
                  </span>
                </div>
                <ResultsetTable
                  columns={queryResult.resultset.columns}
                  rows={queryResult.resultset.rows}
                />
              </div>
            )}

            {queryResult && queryResult.success && (queryResult.statementType === "DDL" || queryResult.statementType === "DML") && (!queryResult.resultset || queryResult.resultset.rows.length === 0) && (
              <Card variant="flat" className="p-4">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success/10 text-success" aria-hidden="true">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  <p className="text-sm text-ink">{getDmlMessage(queryResult)}</p>
                  {queryResult.executionTimeMs != null && (
                    <span className="text-xs text-ink-muted ml-auto">{queryResult.executionTimeMs}ms</span>
                  )}
                </div>
              </Card>
            )}
          </>
        )}

        {/* ── Daten Tab ── */}
        {activeTab === "data" && (
          <>
            {liveSchema.length === 0 ? (
              <div className="flex items-center justify-center h-full text-ink-muted">
                <div className="text-center space-y-2">
                  <svg className="w-12 h-12 mx-auto text-surface-dim dark:text-dark-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  <p className="text-sm">Noch keine Tabellen vorhanden.</p>
                  <p className="text-xs">Erstelle eine Tabelle mit CREATE TABLE, um Daten anzusehen.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {liveSchema.map((table) => (
                  <div key={table.name}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-ink">{table.name}</h4>
                      <span className="text-xs text-ink-muted">
                        {table.columns.length} Spalte{table.columns.length !== 1 ? "n" : ""}
                      </span>
                    </div>
                    <PeekTableData db={db} tableName={table.name} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Graph Tab ── */}
        {activeTab === "graph" && (
          <SchemaExplorer
            tables={liveSchema}
            db={db}
            sandboxMode
            onDropTable={async (tableName) => {
              if (confirm(`Tabelle "${tableName}" wirklich löschen?`)) {
                await onRunQuery(`DROP TABLE IF EXISTS "${tableName}";`);
                onRefreshSchema();
              }
            }}
            onInsertTemplate={(tableName) => {
              const cols = liveSchema.find((t) => t.name === tableName)?.columns ?? [];
              const colNames = cols.map((c) => c.name).join(", ");
              const placeholders = cols.map(() => "?").join(", ");
              setUserQuery(`INSERT INTO "${tableName}" (${colNames})\nVALUES (${placeholders});`);
              setActiveTab("result");
            }}
            onCreateTableTemplate={() => {
              setUserQuery(`CREATE TABLE tabelle_name (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(100) NOT NULL\n);`);
              setActiveTab("result");
            }}
            viewMode="rm"
            hideTabs
          />
        )}

        {/* ── Schema Tab ── */}
        {activeTab === "schema" && (
          <SchemaExplorer
            tables={liveSchema}
            db={db}
            sandboxMode
            onDropTable={async (tableName) => {
              if (confirm(`Tabelle "${tableName}" wirklich löschen?`)) {
                await onRunQuery(`DROP TABLE IF EXISTS "${tableName}";`);
                onRefreshSchema();
              }
            }}
            onInsertTemplate={(tableName) => {
              const cols = liveSchema.find((t) => t.name === tableName)?.columns ?? [];
              const colNames = cols.map((c) => c.name).join(", ");
              const placeholders = cols.map(() => "?").join(", ");
              setUserQuery(`INSERT INTO "${tableName}" (${colNames})\nVALUES (${placeholders});`);
              setActiveTab("result");
            }}
            onCreateTableTemplate={() => {
              setUserQuery(`CREATE TABLE tabelle_name (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(100) NOT NULL\n);`);
              setActiveTab("result");
            }}
            viewMode="schema"
            hideTabs
          />
        )}
      </div>
    </div>
  );
};