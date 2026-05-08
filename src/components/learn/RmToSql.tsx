"use client";

import React, { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";
import { SqlEditor } from "@/components/sqlEditor";
import { ResultsetTable } from "@/components/resultsetTable";
import { SuccessCelebration } from "@/components/successCelebration";
import { createDatabase, runQuery } from "@/lib/sqlEngine";
import type { SandboxQueryResult } from "@/types/sandbox";

/**
 * RmToSql – Interaktives Widget: Relationenmodell zu SQL.
 *
 * Zeigt ein Relationenmodell (Tabellenstruktur) und laesst den User
 * das passende CREATE TABLE schreiben. Validierung gegen sql.js.
 *
 * English: Interactive widget: Relational model to SQL.
 * Shows a relational model and lets the user write the matching
 * CREATE TABLE statement. Validated against sql.js.
 */

export interface RmTable {
  name: string;
  columns: RmColumn[];
}

export interface RmColumn {
  name: string;
  type: string;
  isPrimaryKey?: boolean;
  isForeignKey?: boolean;
  references?: string;
  isNotNull?: boolean;
}

export interface RmToSqlData {
  /** Die Tabellen, die erstellt werden sollen. */
  tables: RmTable[];
  /** Setup-SQL, das vor der Pruefung ausgefuehrt wird (z.B. referenzierte Tabellen). */
  setupSql?: string;
  /** Hinweis, der nach dem ersten Fehlversuch angezeigt wird. */
  hint?: string;
}

export interface RmToSqlProps {
  data: RmToSqlData;
  className?: string;
}

export function RmToSql({ data, className }: RmToSqlProps) {
  const [userSql, setUserSql] = useState("");
  const [result, setResult] = useState<SandboxQueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);

  const validateSql = useCallback(async () => {
    if (!userSql.trim()) return;

    setIsLoading(true);
    setAttempts((prev) => prev + 1);

    try {
      const db = await createDatabase(data.setupSql || "");

      // Try to run the user's SQL
      const execResult = runQuery(db, userSql);

      if (!execResult.success) {
        setResult({
          success: false,
          error: execResult.error || "Unbekannter Fehler",
          rowsModified: 0,
        });
        setIsCorrect(false);
        db.close();
        return;
      }

      // Verify: check that all expected tables exist with expected columns
      let allCorrect = true;
      const errors: string[] = [];

      for (const expectedTable of data.tables) {
        // Check if table exists
        const tableCheck = runQuery(db, `SELECT name FROM sqlite_master WHERE type='table' AND name='${expectedTable.name}'`);
        if (!tableCheck.success || !tableCheck.resultset || tableCheck.resultset.rows.length === 0) {
          errors.push(`Tabelle "${expectedTable.name}" wurde nicht gefunden.`);
          allCorrect = false;
          continue;
        }

        // Check columns
        const colCheck = runQuery(db, `PRAGMA table_info(${expectedTable.name})`);
        if (!colCheck.success || !colCheck.resultset) {
          errors.push(`Spalten für "${expectedTable.name}" konnten nicht geprüft werden.`);
          allCorrect = false;
          continue;
        }

        const existingCols = new Set(colCheck.resultset.rows.map((r: Record<string, unknown>) => String(r.name)));

        for (const expectedCol of expectedTable.columns) {
          if (!existingCols.has(expectedCol.name)) {
            errors.push(`Spalte "${expectedCol.name}" fehlt in Tabelle "${expectedTable.name}".`);
            allCorrect = false;
          }
        }
      }

      if (allCorrect) {
        setIsCorrect(true);
        setResult({
          success: true,
          resultset: { columns: [{ name: "Ergebnis", type: "text" }], rows: [{ Ergebnis: "Alle Tabellen korrekt erstellt!" }] },
          rowsModified: 0,
          statementType: "DDL",
        });
      } else {
        setIsCorrect(false);
        setResult({
          success: false,
          error: errors.join(" "),
          rowsModified: 0,
        });
      }

      db.close();
    } catch (err) {
      setResult({
        success: false,
        error: err instanceof Error ? err.message : String(err),
        rowsModified: 0,
      });
      setIsCorrect(false);
    } finally {
      setIsLoading(false);
    }
  }, [userSql, data]);

  // Show hint after 2 failed attempts
  useEffect(() => {
    if (attempts >= 2 && !isCorrect && data.hint) {
      setShowHint(true);
    }
  }, [attempts, isCorrect, data.hint]);

  // Pre-fill with a template
  const fillTemplate = useCallback(() => {
    const template = data.tables
      .map((table) => {
        const cols = table.columns
          .map((col) => {
            let def = `  ${col.name} ${col.type}`;
            if (col.isPrimaryKey) def += " PRIMARY KEY";
            if (col.isNotNull) def += " NOT NULL";
            if (col.isForeignKey && col.references) def += ` REFERENCES ${col.references}`;
            return def;
          })
          .join(",\n");
        return `CREATE TABLE ${table.name} (\n${cols}\n);`;
      })
      .join("\n\n");
    setUserSql(template);
  }, [data.tables]);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Task description */}
      <div className="flex items-start gap-2">
        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">
            Erstelle die passenden CREATE TABLE-Anweisungen
          </p>
          <p className="text-xs text-ink-muted mt-0.5">
            Schreibe SQL, um das folgende Relationenmodell umzusetzen.
          </p>
        </div>
      </div>

      {/* Relational model display */}
      <div className="space-y-3">
        {data.tables.map((table) => (
          <div
            key={table.name}
            className="rounded-lg border border-surface-dim dark:border-dark-dim overflow-hidden"
          >
            <div className="px-3 py-2 bg-primary-50 dark:bg-primary-900/20 border-b border-surface-dim dark:border-dark-dim">
              <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                {table.name}
              </p>
            </div>
            <div className="p-3 space-y-1">
              {table.columns.map((col) => (
                <div key={col.name} className="flex items-center gap-2 text-xs">
                  {col.isPrimaryKey && (
                    <span className="inline-flex px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-800 text-primary-700 dark:text-primary-300 font-medium">
                      PK
                    </span>
                  )}
                  {col.isForeignKey && (
                    <span className="inline-flex px-1.5 py-0.5 rounded bg-accent-100 dark:bg-accent-900 text-accent-700 dark:text-accent-300 font-medium">
                      FK→{col.references}
                    </span>
                  )}
                  {!col.isPrimaryKey && !col.isForeignKey && (
                    <span className="inline-flex px-1.5 py-0.5 rounded bg-surface-dim dark:bg-dark-dim text-ink-muted font-medium">
                      {col.type}
                    </span>
                  )}
                  <span className="text-ink font-medium">{col.name}</span>
                  {col.isNotNull && !col.isPrimaryKey && (
                    <span className="text-ink-muted">NOT NULL</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* SQL Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-ink">Deine SQL-Lösung:</label>
          <button
            onClick={fillTemplate}
            className="text-xs text-primary-500 hover:text-primary-600 transition-colors"
          >
            Vorlage einfügen
          </button>
        </div>
        <SqlEditor
          value={userSql}
          onChange={(e) => setUserSql(e.target.value)}
          onSubmit={validateSql}
          placeholder="CREATE TABLE ..."
        />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={validateSql}
            disabled={isLoading || !userSql.trim()}
          >
            {isLoading ? "Prüfe..." : "Prüfen"}
          </Button>
          {attempts > 0 && !isCorrect && (
            <span className="text-xs text-ink-muted">
              Versuch {attempts}
            </span>
          )}
        </div>
      </div>

      {/* Hint */}
      {showHint && !isCorrect && data.hint && (
        <div className="p-3 rounded-lg bg-warning/10 border border-warning/30">
          <p className="text-xs font-semibold text-warning flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg> Hinweis</p>
          <p className="text-xs text-ink mt-1">{data.hint}</p>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-2">
          {isCorrect && (
            <SuccessCelebration
              message="Richtig!"
              submessage="Du hast das Relationenmodell korrekt in SQL umgesetzt."
            />
          )}
          {result.success && result.resultset && result.resultset.rows.length > 0 && !isCorrect && (
            <ResultsetTable
              columns={result.resultset.columns}
              rows={result.resultset.rows}
            />
          )}
          {!result.success && (
            <div className="p-3 rounded-lg bg-error/10 border border-error/30">
              <p className="text-xs font-semibold text-error">Fehler</p>
              <p className="text-xs text-ink mt-1">{result.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}