"use client";

import React, { useState, useImperativeHandle } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { SqlEditor, type SqlSchema } from "@/components/sqlEditor";
import { ResultsetTable } from "@/components/resultsetTable";
import { SchemaExplorer } from "@/components/schemaExplorer";
import { StatusCard } from "@/components/statusCard";
import type { SandboxQueryResult, QueryHistoryEntry } from "@/types/sandbox";
import type { SchemaTable, SqlColumn } from "@/types/playground";
import { explainError } from "@/lib/errorExplanation";
import { peekTableData } from "@/lib/sqlEngine";
import { useDialect } from "@/lib/dialect";
import { DialectSwitcher } from "@/components/dialectSwitcher";
import { AutocompleteToggle } from "@/components/autocompleteToggle";

export interface SandboxWorkspaceHandle {
  insertQuery: (sql: string) => void;
  insertAndRun: (sql: string) => Promise<void>;
}

export interface SandboxWorkspaceProps {
  db: import("sql.js").Database | null;
  liveSchema: SchemaTable[];
  queryResult: SandboxQueryResult | null;
  queryHistory: QueryHistoryEntry[];
  onRunQuery: (sql: string) => Promise<void>;
  onRefreshSchema: () => void;
  isLoading: boolean;
}

function getDmlMessage(result: SandboxQueryResult, t: (key: string, params?: Record<string, number>) => string): string {
  if (result.statementType === "DDL") return t("schemaChanged");
  if (result.rowsModified > 0) return t("rowsAffected", { count: result.rowsModified });
  return t("commandExecuted");
}

const PeekTableData: React.FC<{ db: import("sql.js").Database | null; tableName: string }> = ({ db, tableName }) => {
  const t = useTranslations("sandbox");
  const { dialect } = useDialect();
  const [data, setData] = useState<{ columns: SqlColumn[]; rows: Record<string, unknown>[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!db) return;
    try {
      const result = peekTableData(db, tableName, 50, dialect);
      if (result.success && result.resultset) {
        setData({ columns: result.resultset.columns, rows: result.resultset.rows as Record<string, unknown>[] });
        setError(null);
      } else {
        setData(null);
        setError(result.error || t("noDataAvailable"));
      }
    } catch (e) {
      setData(null);
      setError(e instanceof Error ? e.message : t("errorLoadingData"));
    }
  }, [db, tableName, t, dialect]);

  if (error) return <p className="text-xs text-error italic">{error}</p>;
  if (!data) return <p className="text-xs text-ink-muted italic">{t("loading")}</p>;
  if (data.rows.length === 0) return <p className="text-xs text-ink-muted italic">{t("tableEmpty")}</p>;

  return (
    <div className="overflow-x-auto">
      <ResultsetTable columns={data.columns} rows={data.rows} />
    </div>
  );
};

const tabContentVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const resultVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const historyVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: "auto", transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, height: 0, transition: { duration: 0.15, ease: "easeIn" as const } },
};

export const SandboxWorkspace = React.forwardRef<SandboxWorkspaceHandle, SandboxWorkspaceProps>(
function SandboxWorkspace({
  db,
  liveSchema,
  queryResult,
  queryHistory,
  onRunQuery,
  onRefreshSchema,
  isLoading,
}, ref) {
  const t = useTranslations("sandbox");
  const { dialect, autocompleteEnabled } = useDialect();
  const [userQuery, setUserQuery] = useState("");

  // Convert liveSchema to SqlSchema for CodeMirror autocompletion
  const editorSchema = React.useMemo<SqlSchema>(() => {
    if (!liveSchema || liveSchema.length === 0) return {};
    const schema: SqlSchema = {};
    for (const table of liveSchema) {
      schema[table.name] = table.columns.map((col) => col.name);
    }
    return schema;
  }, [liveSchema]);

  useImperativeHandle(ref, () => ({
    insertQuery: setUserQuery,
    insertAndRun: async (sql: string) => {
      setUserQuery(sql);
      await onRunQuery(sql);
      setQueryVersion((v) => v + 1);
      setActiveTab("result");
    },
  }), [onRunQuery]);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<"result" | "data" | "graph" | "schema">("result");
  const [queryVersion, setQueryVersion] = useState(0);

  const hasNoDb = !db;

  const handleRun = async () => {
    if (!userQuery.trim()) return;
    await onRunQuery(userQuery);
    setQueryVersion((v) => v + 1);
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
      label: t("tabResult"),
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      key: "data",
      label: t("tabData"),
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
        </svg>
      ),
    },
    {
      key: "graph",
      label: t("tabGraph"),
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
    },
    {
      key: "schema",
      label: t("tabSchema"),
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      className="flex-1 flex flex-col min-w-0 h-full overflow-hidden"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.08 }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-surface-dim dark:border-dark-dim bg-surface-dim/30 dark:bg-dark-dim/30">
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleRun} disabled={!userQuery.trim() || isLoading}>
            {t("runQuery")}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setUserQuery("")}>
            {t("clear")}
          </Button>
        </div>
        <div className="flex items-center gap-2">
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
            {t("history")}
          </button>
          <AutocompleteToggle />
          <DialectSwitcher />
        </div>
      </div>

      {/* SQL Editor */}
      <div className="px-4 pt-4 pb-3 border-b border-surface-dim dark:border-dark-dim">
        <SqlEditor
          label={t("sqlQuery")}
          value={userQuery}
          onChange={setUserQuery}
          onSubmit={handleRun}
          placeholder={hasNoDb ? t("placeholderNoDb") : t("placeholderWithDb")}
          schema={editorSchema}
          autocompleteEnabled={autocompleteEnabled}
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
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContentVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`flex-1 min-h-0 overflow-y-auto ${activeTab === "graph" || activeTab === "schema" ? "" : "p-4"}`}
        >
          {/* ── Ergebnis Tab ── */}
          {activeTab === "result" && (
            <>
              {/* Query History */}
              <AnimatePresence>
                {showHistory && (
                  <motion.div
                    variants={historyVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="overflow-hidden mb-4"
                  >
                    <Card variant="flat" className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-xs font-semibold text-ink-muted">{t("recentQueries")}</h4>
                        <button onClick={() => setShowHistory(false)} className="text-xs text-ink-muted hover:text-ink">{t("close")}</button>
                      </div>
                      {queryHistory.length === 0 ? (
                        <p className="text-xs text-ink-muted italic">{t("noQueriesYet")}</p>
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
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Loading */}
              {isLoading && (
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2 text-sm text-ink-muted">
                    <svg className="w-4 h-4 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t("databaseLoading")}
                  </div>
                </div>
              )}

              {/* Empty states */}
              {!queryResult && !isLoading && hasNoDb && (
                <div className="flex items-center justify-center h-full text-ink-muted">
                  <div className="text-center space-y-3">
                    <svg className="w-12 h-12 mx-auto text-surface-dim dark:text-dark-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5 0v3.75m16.5 0v3.75m-16.5 0v3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                    </svg>
                    <p className="text-sm font-medium">{t("noDatabaseOpen")}</p>
                    <p className="text-xs">{t("noDatabaseOpenHint")}</p>
                  </div>
                </div>
              )}
              {!queryResult && !isLoading && !hasNoDb && (
                <div className="flex items-center justify-center h-full text-ink-muted">
                  <div className="text-center space-y-2">
                    <svg className="w-12 h-12 mx-auto text-surface-dim dark:text-dark-dim" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">{t("writeQueryHint")}</p>
                    <p className="text-xs">{t("orCtrlEnter")}</p>
                  </div>
                </div>
              )}

              {/* Query results — animate on each new query */}
              <AnimatePresence mode="wait">
                {queryResult && (
                  <motion.div
                    key={queryVersion}
                    variants={resultVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    {!queryResult.success && (
                      <StatusCard variant="error" title={(() => { const exp = explainError(queryResult.error || ""); return exp.category; })()} className="p-4">
                        {(() => {
                          const exp = explainError(queryResult.error || "");
                          return (
                            <>
                              <p className="text-sm text-ink">{exp.userMessage}</p>
                              <p className="text-xs text-ink-muted font-mono">{exp.originalError}</p>
                            </>
                          );
                        })()}
                      </StatusCard>
                    )}

                    {queryResult.success && queryResult.resultset && queryResult.resultset.rows.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-ink">{t("result")}</h4>
                          <span className="text-xs text-ink-muted">
                            {queryResult.resultset.rows.length} {queryResult.resultset.rows.length !== 1 ? t("rowsPlural") : t("rowSingular")}
                            {queryResult.executionTimeMs != null && ` · ${queryResult.executionTimeMs}ms`}
                          </span>
                        </div>
                        <ResultsetTable
                          columns={queryResult.resultset.columns}
                          rows={queryResult.resultset.rows}
                        />
                      </div>
                    )}

                    {queryResult.success && (queryResult.statementType === "DDL" || queryResult.statementType === "DML") && (!queryResult.resultset || queryResult.resultset.rows.length === 0) && (
                      <Card variant="flat" className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success/10 text-success" aria-hidden="true">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </span>
                          <p className="text-sm text-ink">{getDmlMessage(queryResult, t)}</p>
                          {queryResult.executionTimeMs != null && (
                            <span className="text-xs text-ink-muted ml-auto">{queryResult.executionTimeMs}ms</span>
                          )}
                        </div>
                      </Card>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
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
                    <p className="text-sm">{t("noTablesYet")}</p>
                    <p className="text-xs">{t("createTableHint")}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {liveSchema.map((table) => (
                    <div key={table.name}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-ink">{table.name}</h4>
                        <span className="text-xs text-ink-muted">
                          {table.columns.length} {table.columns.length !== 1 ? t("columnsShort") : t("columnSingular")}
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
              fullHeight
              onDropTable={async (tableName) => {
                if (confirm(t("confirmDropTable", { name: tableName }))) {
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
                setUserQuery(`CREATE TABLE table_name (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(100) NOT NULL\n);`);
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
              fullHeight
              onDropTable={async (tableName) => {
                if (confirm(t("confirmDropTable", { name: tableName }))) {
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
                setUserQuery(`CREATE TABLE table_name (\n  id INTEGER PRIMARY KEY,\n  name VARCHAR(100) NOT NULL\n);`);
                setActiveTab("result");
              }}
              viewMode="schema"
              hideTabs
            />
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
});
SandboxWorkspace.displayName = "SandboxWorkspace";
