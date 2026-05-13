"use client";

import React, { useEffect, useRef, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { EditorView, keymap, placeholder as cmPlaceholder } from "@codemirror/view";
import { EditorState, Compartment } from "@codemirror/state";
import { sql, MySQL, PostgreSQL, SQLite } from "@codemirror/lang-sql";
import { autocompletion, closeBrackets, closeBracketsKeymap, CompletionContext, CompletionResult } from "@codemirror/autocomplete";
import { history, defaultKeymap, historyKeymap } from "@codemirror/commands";
import { searchKeymap, highlightSelectionMatches } from "@codemirror/search";
import { bracketMatching } from "@codemirror/language";
import { cn } from "@/lib/utils";
import { getEditorTheme } from "@/lib/codeMirrorTheme";
import { useDialect, type Dialect } from "@/lib/dialect";
import { useTheme } from "@/hooks/useTheme";

/**
 * SQL keywords for autocompletion.
 * Only includes standard SQL keywords that are valid in most contexts.
 */
const SQL_KEYWORDS = [
  // DML
  "SELECT", "FROM", "WHERE", "INSERT", "INTO", "VALUES", "UPDATE", "SET",
  "DELETE", "MERGE",
  // DDL
  "CREATE", "TABLE", "DROP", "ALTER", "ADD", "COLUMN", "INDEX", "VIEW",
  "TRIGGER", "PROCEDURE", "FUNCTION",
  // Query clauses
  "AS", "ON", "AND", "OR", "NOT", "IN", "BETWEEN", "LIKE", "IS", "NULL",
  "EXISTS", "DISTINCT", "ALL", "ANY", "SOME",
  // Joins
  "JOIN", "INNER", "LEFT", "RIGHT", "FULL", "OUTER", "CROSS", "NATURAL",
  // Grouping & ordering
  "GROUP", "BY", "HAVING", "ORDER", "ASC", "DESC", "LIMIT", "OFFSET",
  // Set operations
  "UNION", "INTERSECT", "EXCEPT",
  // Aggregates
  "COUNT", "SUM", "AVG", "MIN", "MAX",
  // Subquery
  "WITH", "RECURSIVE",
  // Window functions
  "OVER", "PARTITION", "ROWS", "RANGE", "PRECEDING", "FOLLOWING", "UNBOUNDED", "CURRENT", "ROW",
  // Types
  "INTEGER", "TEXT", "REAL", "BLOB", "BOOLEAN", "DATE", "DATETIME", "VARCHAR", "CHAR", "NUMERIC", "FLOAT", "DOUBLE", "DECIMAL",
  // Constraints
  "PRIMARY", "KEY", "FOREIGN", "REFERENCES", "UNIQUE", "CHECK", "DEFAULT", "CONSTRAINT",
  // Boolean / null
  "TRUE", "FALSE",
  // Case
  "CASE", "WHEN", "THEN", "ELSE", "END",
  // Other
  "IF", "EXISTS", "CAST", "COLLATE", "AUTOINCREMENT", "TEMP", "TEMPORARY",
];

/**
 * Custom autocompletion source that combines SQL keywords with schema.
 * Only triggers on explicit request (Ctrl+Space) or when typing a word
 * that starts with at least 2 characters. Keywords are shown in UPPERCASE.
 */
function sqlCompletionSource(context: CompletionContext, schema?: SqlSchema): CompletionResult | null {
  // Don't auto-complete in strings or comments
  const line = context.state.doc.lineAt(context.pos);
  const textBefore = line.text.slice(0, context.pos - line.from);
  if (/['"\']/.test(textBefore) && !/['"\'].*['"\']/.test(textBefore.slice(0, -1))) return null;

  // Match word being typed
  const word = context.matchBefore(/[\w.]+/);
  if (!word) return null;
  const prefix = word.text.toUpperCase();
  const lowerPrefix = word.text.toLowerCase();

  // Build keyword completions (uppercase)
  const keywordCompletions = SQL_KEYWORDS
    .filter((kw) => kw.startsWith(prefix) || kw.startsWith(lowerPrefix))
    .map((kw) => ({
      label: kw,
      type: "keyword",
      apply: kw,
      boost: kw === prefix ? 2 : 0,
    }));

  // Build schema completions (table.column)
  const schemaCompletions: { label: string; type: string; apply: string; detail?: string; boost?: number }[] = [];
  if (schema && Object.keys(schema).length > 0) {
    // If typing after a dot, complete columns of that table
    if (word.text.includes(".")) {
      const [tableName, colPrefix] = word.text.split(".");
      const cols = schema[tableName] || schema[tableName.toLowerCase()];
      if (cols) {
        cols
          .filter((c) => c.toUpperCase().startsWith(prefix.split(".").pop() || ""))
          .forEach((col) => {
            schemaCompletions.push({
              label: `${tableName}.${col}`,
              type: "property",
              apply: `${tableName}.${col}`,
              detail: "column",
            });
          });
      }
    } else {
      // Complete table names
      Object.keys(schema)
        .filter((t) => t.toUpperCase().startsWith(prefix) || t.toLowerCase().startsWith(lowerPrefix))
        .forEach((t) => {
          schemaCompletions.push({
            label: t,
            type: "type",
            apply: t,
            detail: `table (${schema[t].length} cols)`,
          });
        });
      // Complete column names (without table prefix)
      Object.entries(schema).forEach(([table, cols]) => {
        cols.forEach((col) => {
          if (col.toUpperCase().startsWith(prefix) || col.toLowerCase().startsWith(lowerPrefix)) {
            schemaCompletions.push({
              label: col,
              type: "property",
              apply: col,
              detail: `${table}.${col}`,
              boost: -1,
            });
          }
        });
      });
    }
  }

  const options = [...keywordCompletions, ...schemaCompletions];
  if (options.length === 0) return null;

  return {
    from: word.from,
    options,
    filter: false,
  };
}

/**
 * Map our dialect type to CodeMirror SQL dialect objects.
 */
const SQL_DIALECT_MAP: Record<Dialect, typeof MySQL> = {
  sqlite: SQLite,
  mysql: MySQL,
  postgresql: PostgreSQL,
};

/**
 * Schema shape expected for autocompletion.
 * Maps table names to their column names.
 */
export interface SqlSchema {
  [tableName: string]: string[];
}

/**
 * SqlEditorProps – CodeMirror 6 powered SQL editor props.
 */
export interface SqlEditorProps {
  /** Controlled value of the editor */
  value: string;
  /** Callback when editor content changes */
  onChange: (value: string) => void;
  /** Whether the editor is in an error state */
  error?: boolean;
  /** Accessible label for the editor */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Callback when user presses Ctrl+Enter */
  onSubmit?: () => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Schema for autocompletion: table name → column names */
  schema?: SqlSchema;
  /** Whether autocompletion is enabled (default: true) */
  autocompleteEnabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** HTML id attribute */
  id?: string;
}

/**
 * SqlEditor – CodeMirror 6 powered SQL editor with:
 * - Dialect-aware syntax highlighting (SQLite / MySQL / PostgreSQL)
 * - Schema-aware autocompletion
 * - Dark/light theme matching the app's design system
 * - Ctrl+Enter to run query
 * - Bracket matching, close brackets, history
 */
export const SqlEditor = React.memo(function SqlEditor({
  value,
  onChange,
  error,
  label,
  placeholder,
  onSubmit,
  disabled,
  schema,
  autocompleteEnabled = true,
  className,
  id,
}: SqlEditorProps) {
  const t = useTranslations("sandbox");
  const { dialect } = useDialect();
  const { theme: appTheme } = useTheme();
  const isDark = appTheme === "dark";

  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onSubmitRef = useRef(onSubmit);
  const isSettingValueRef = useRef(false);

  // Keep refs in sync so callbacks always see latest values
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);
  useEffect(() => { onSubmitRef.current = onSubmit; }, [onSubmit]);

  // Compartments for dynamic reconfiguration
  const dialectCompartment = useMemo(() => new Compartment(), []);
  const schemaCompartment = useMemo(() => new Compartment(), []);
  const themeCompartment = useMemo(() => new Compartment(), []);
  const readOnlyCompartment = useMemo(() => new Compartment(), []);
  const autocompleteCompartment = useMemo(() => new Compartment(), []);

  // Create the editor once
  useEffect(() => {
    if (!editorRef.current) return;

    const initialDialect = SQL_DIALECT_MAP[dialect];
    const initialSchema = schema ?? {};
    const initialTheme = getEditorTheme(isDark);

    const runQueryKeymap = keymap.of([
      {
        key: "Ctrl-Enter",
        run: () => { onSubmitRef.current?.(); return true; },
        preventDefault: true,
      },
      {
        key: "Cmd-Enter",
        run: () => { onSubmitRef.current?.(); return true; },
        preventDefault: true,
      },
    ]);

    // Build autocompletion extension based on enabled state
    const autocompleteExt = autocompleteEnabled
      ? autocompletion({
          override: [(context: CompletionContext) => sqlCompletionSource(context, initialSchema)],
          activateOnTyping: true,
          icons: true,
          maxRenderedOptions: 12,
        })
      : autocompletion({ activateOnTyping: false, icons: true });

    const state = EditorState.create({
      doc: value,
      extensions: [
        history(),
        closeBrackets(),
        bracketMatching(),
        highlightSelectionMatches(),
        autocompleteExt,
        sql({ dialect: initialDialect, schema: Object.keys(initialSchema).length > 0 ? initialSchema : undefined }),
        dialectCompartment.of(initialDialect),
        schemaCompartment.of(
          Object.keys(initialSchema).length > 0 ? sql({ schema: initialSchema }) : [],
        ),
        themeCompartment.of(initialTheme),
        readOnlyCompartment.of(EditorState.readOnly.of(!!disabled)),
        autocompleteCompartment.of(autocompleteExt),
        runQueryKeymap,
        keymap.of([
          ...closeBracketsKeymap,
          ...defaultKeymap,
          ...searchKeymap,
          ...historyKeymap,
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged && !isSettingValueRef.current) {
            onChangeRef.current(update.state.doc.toString());
          }
        }),
        EditorView.lineWrapping,
        EditorView.theme({
          "&": { outline: "none !important" },
          ".cm-scroller": { overflow: "auto", maxHeight: "none" },
          ".cm-editor": { minHeight: "10rem" },
          ".cm-tooltip.cm-tooltip-autocomplete": {
            zIndex: "9999",
            position: "fixed !important" as unknown as string,
          },
        }),
        placeholder ? cmPlaceholder(placeholder) : [],
      ],
    });

    const view = new EditorView({ state, parent: editorRef.current });
    viewRef.current = view;

    return () => { view.destroy(); viewRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes into the editor
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentValue = view.state.doc.toString();
    if (currentValue !== value) {
      isSettingValueRef.current = true;
      view.dispatch({ changes: { from: 0, to: currentValue.length, insert: value } });
      isSettingValueRef.current = false;
    }
  }, [value]);

  // Update dialect when it changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const newDialect = SQL_DIALECT_MAP[dialect];
    view.dispatch({ effects: dialectCompartment.reconfigure(newDialect) });
  }, [dialect, dialectCompartment]);

  // Update schema when it changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const schemaExt = schema && Object.keys(schema).length > 0 ? sql({ schema }) : [];
    const currentSchema = schema ?? {};
    const newAutocomplete = autocompleteEnabled
      ? autocompletion({
          override: [(context: CompletionContext) => sqlCompletionSource(context, currentSchema)],
          activateOnTyping: true,
          icons: true,
          maxRenderedOptions: 12,
        })
      : autocompletion({ activateOnTyping: false, icons: true });
    view.dispatch({
      effects: [
        schemaCompartment.reconfigure(schemaExt),
        autocompleteCompartment.reconfigure(newAutocomplete),
      ],
    });
  }, [schema, autocompleteEnabled, schemaCompartment, autocompleteCompartment]);

  // Update theme when it changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({ effects: themeCompartment.reconfigure(getEditorTheme(isDark)) });
  }, [isDark, themeCompartment]);

  // Update readOnly when disabled changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    view.dispatch({ effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(!!disabled)) });
  }, [disabled, readOnlyCompartment]);

  // Update autocompletion when enabled state changes
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const currentSchema = schema ?? {};
    const newAutocomplete = autocompleteEnabled
      ? autocompletion({
          override: [(context: CompletionContext) => sqlCompletionSource(context, currentSchema)],
          activateOnTyping: true,
          icons: true,
          maxRenderedOptions: 12,
        })
      : autocompletion({ activateOnTyping: false, icons: true });
    view.dispatch({ effects: autocompleteCompartment.reconfigure(newAutocomplete) });
  }, [autocompleteEnabled, schema, autocompleteCompartment]);

  const generatedId = React.useId();
  const editorId = id || generatedId;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={editorId} className="text-sm font-medium text-ink">
          {label}
        </label>
      )}
      <div
        ref={editorRef}
        id={editorId}
        role="textbox"
        aria-label={label || "SQL Editor"}
        aria-invalid={error ? "true" : undefined}
        className={cn(
          "cm-editor-wrapper overflow-hidden",
          error
            ? "[&_.cm-editor]:border-error [&_.cm-editor]:focus-within:ring-2 [&_.cm-editor]:focus-within:ring-error/40"
            : "[&_.cm-editor]:focus-within:ring-2 [&_.cm-editor]:focus-within:ring-primary-500/40",
          disabled && "[&_.cm-editor]:opacity-50 [&_.cm-editor]:pointer-events-none",
          className,
        )}
      />
      {onSubmit && (
        <p className="text-xs text-ink-muted">
          <kbd className="rounded border border-surface-dim px-1 py-0.5 text-xs font-mono">Ctrl</kbd>{" "}&#43;{" "}
          <kbd className="rounded border border-surface-dim px-1 py-0.5 text-xs font-mono">&#x21B5;</kbd>{" "}
          {t("orCtrlEnter")}
          </p>
        )}
      </div>
    );
  }
);
SqlEditor.displayName = "SqlEditor";
