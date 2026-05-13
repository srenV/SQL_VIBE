/**
 * CodeMirror 6 theme for SQL VIBE editor.
 *
 * Provides light and dark theme extensions that match the app's
 * design system (primary indigo, accent teal, surface/ink tokens).
 * The correct theme is selected at runtime based on the `dark` class
 * on <html>.
 */
import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";

/* ------------------------------------------------------------------ */
/*  Shared token colours                                               */
/* ------------------------------------------------------------------ */

const tokens = {
  keyword: "#6366f1" as const,    // primary-500
  string: "#0d9488" as const,      // accent-600
  number: "#f59e0b" as const,      // warning
  comment: "#94a3b8" as const,     // ink-muted (dark mode)
  variable: "#6366f1" as const,    // primary-500
  operator: "#64748b" as const,    // ink-muted
  typeName: "#818cf8" as const,    // primary-400
  propertyName: "#2dd4bf" as const, // accent-400
};

/* ------------------------------------------------------------------ */
/*  Light theme                                                        */
/* ------------------------------------------------------------------ */

const lightTheme = EditorView.theme(
  {
    "&": {
      fontSize: "14px",
      borderRadius: "0.5rem",
      border: "1px solid var(--color-surface-dim, #e2e8f0)",
      backgroundColor: "var(--color-surface, #f8fafc)",
    },
    ".cm-content": {
      fontFamily:
        'var(--font-mono), ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      caretColor: "#6366f1",
      padding: "8px 0",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#6366f1",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "#c7d2fe !important", // primary-200
    },
    ".cm-gutters": {
      backgroundColor: "var(--color-surface, #f8fafc)",
      color: "var(--color-ink-muted, #64748b)",
      border: "none",
      borderRight: "1px solid var(--color-surface-dim, #e2e8f0)",
      minWidth: "2em",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "var(--color-surface-dim, #e2e8f0)",
      color: "var(--color-ink, #0f172a)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(99, 102, 241, 0.04)", // primary-500 @ 4%
    },
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "#c7d2fe",
      border: "1px solid #6366f1",
      color: "#0f172a",
    },
    ".cm-searchMatch": {
      backgroundColor: "#fef08a",
      outline: "1px solid #f59e0b",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#fde68a",
    },
    ".cm-selectionMatch": {
      backgroundColor: "#c7d2fe",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "var(--color-surface-dim, #e2e8f0)",
      border: "none",
      color: "var(--color-ink-muted, #64748b)",
    },
    ".cm-tooltip": {
      border: "1px solid var(--color-surface-dim, #e2e8f0)",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      zIndex: "9999",
    },
    ".cm-tooltip.cm-tooltip-autocomplete": {
      border: "1px solid var(--color-surface-dim, #e2e8f0)",
      borderRadius: "0.5rem",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
      zIndex: "9999",
    },
    ".cm-tooltip-autocomplete ul li": {
      padding: "4px 8px",
      lineHeight: "1.5",
    },
    ".cm-tooltip-autocomplete ul li[aria-selected]": {
      backgroundColor: "#eef2ff", // primary-50
      color: "#3730a3", // primary-800
    },
    ".cm-completionLabel": {
      fontFamily:
        'var(--font-mono), ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace',
      fontSize: "13px",
    },
    ".cm-completionDetail": {
      fontStyle: "normal",
      color: "var(--color-ink-muted, #64748b)",
    },
    ".cm-line": {
      padding: "0 12px",
    },
  },
  { dark: false },
);

const lightHighlightStyle = EditorView.baseTheme({
  "&dark .tok-keyword": { color: tokens.keyword },
  "&light .tok-keyword": { color: tokens.keyword },
});

/* ------------------------------------------------------------------ */
/*  Dark theme                                                         */
/* ------------------------------------------------------------------ */

const darkTheme = EditorView.theme(
  {
    "&": {
      fontSize: "14px",
      borderRadius: "0.5rem",
      border: "1px solid var(--color-dark-dim, #1e293b)",
      backgroundColor: "var(--color-surface, #0f172a)",
    },
    ".cm-content": {
      fontFamily:
        'var(--font-mono), ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      caretColor: "#818cf8",
      padding: "8px 0",
    },
    ".cm-cursor, .cm-dropCursor": {
      borderLeftColor: "#818cf8",
      borderLeftWidth: "2px",
    },
    "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": {
      backgroundColor: "#312e81 !important", // primary-900
    },
    ".cm-gutters": {
      backgroundColor: "var(--color-surface, #0f172a)",
      color: "var(--color-ink-muted, #94a3b8)",
      border: "none",
      borderRight: "1px solid var(--color-dark-dim, #1e293b)",
      minWidth: "2em",
    },
    ".cm-activeLineGutter": {
      backgroundColor: "var(--color-dark-dim, #1e293b)",
      color: "var(--color-ink, #f1f5f9)",
    },
    ".cm-activeLine": {
      backgroundColor: "rgba(129, 140, 248, 0.06)", // primary-400 @ 6%
    },
    ".cm-matchingBracket, .cm-nonmatchingBracket": {
      backgroundColor: "#312e81",
      border: "1px solid #818cf8",
      color: "#f1f5f9",
    },
    ".cm-searchMatch": {
      backgroundColor: "#854d0e",
      outline: "1px solid #f59e0b",
    },
    ".cm-searchMatch.cm-searchMatch-selected": {
      backgroundColor: "#a16207",
    },
    ".cm-selectionMatch": {
      backgroundColor: "#312e81",
    },
    ".cm-foldPlaceholder": {
      backgroundColor: "var(--color-dark-dim, #1e293b)",
      border: "none",
      color: "var(--color-ink-muted, #94a3b8)",
    },
    ".cm-tooltip": {
      border: "1px solid var(--color-dark-dim, #1e293b)",
      borderRadius: "0.5rem",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
      backgroundColor: "var(--color-surface, #0f172a)",
      zIndex: "9999",
    },
    ".cm-tooltip.cm-tooltip-autocomplete": {
      border: "1px solid var(--color-dark-dim, #1e293b)",
      borderRadius: "0.5rem",
      boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
      backgroundColor: "var(--color-surface, #0f172a)",
      zIndex: "9999",
    },
    ".cm-tooltip-autocomplete ul li": {
      padding: "4px 8px",
      lineHeight: "1.5",
    },
    ".cm-tooltip-autocomplete ul li[aria-selected]": {
      backgroundColor: "#1e1b4b", // primary-950
      color: "#a5b4fc", // primary-300
    },
    ".cm-completionLabel": {
      fontFamily:
        'var(--font-mono), ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace',
      fontSize: "13px",
    },
    ".cm-completionDetail": {
      fontStyle: "normal",
      color: "var(--color-ink-muted, #94a3b8)",
    },
    ".cm-line": {
      padding: "0 12px",
    },
  },
  { dark: true },
);

/* ------------------------------------------------------------------ */
/*  Syntax highlighting styles                                         */
/* ------------------------------------------------------------------ */

import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags } from "@lezer/highlight";

const sqlHighlightLight = HighlightStyle.define([
  { tag: tags.keyword, color: "#4f46e5" },           // primary-600
  { tag: tags.variableName, color: "#6366f1" },      // primary-500
  { tag: tags.typeName, color: "#818cf8" },           // primary-400
  { tag: tags.string, color: "#0d9488" },             // accent-600
  { tag: tags.special(tags.string), color: "#0f766e" }, // accent-700
  { tag: tags.number, color: "#d97706" },              // amber-600
  { tag: tags.comment, color: "#94a3b8", fontStyle: "italic" }, // slate-400
  { tag: tags.operator, color: "#64748b" },            // slate-500
  { tag: tags.punctuation, color: "#64748b" },        // slate-500
  { tag: tags.propertyName, color: "#2dd4bf" },       // accent-400
  { tag: tags.bool, color: "#6366f1" },               // primary-500
  { tag: tags.null, color: "#94a3b8" },              // slate-400
  { tag: tags.separator, color: "#94a3b8" },          // slate-400
]);

const sqlHighlightDark = HighlightStyle.define([
  { tag: tags.keyword, color: "#a5b4fc" },           // primary-300
  { tag: tags.variableName, color: "#818cf8" },      // primary-400
  { tag: tags.typeName, color: "#c7d2fe" },          // primary-200
  { tag: tags.string, color: "#2dd4bf" },            // accent-400
  { tag: tags.special(tags.string), color: "#5eead4" }, // accent-300
  { tag: tags.number, color: "#fbbf24" },             // amber-400
  { tag: tags.comment, color: "#64748b", fontStyle: "italic" }, // slate-500
  { tag: tags.operator, color: "#94a3b8" },           // slate-400
  { tag: tags.punctuation, color: "#94a3b8" },        // slate-400
  { tag: tags.propertyName, color: "#5eead4" },      // accent-300
  { tag: tags.bool, color: "#818cf8" },               // primary-400
  { tag: tags.null, color: "#64748b" },               // slate-500
  { tag: tags.separator, color: "#64748b" },          // slate-500
]);

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Returns the CodeMirror theme extensions for the given mode.
 * @param dark - Whether to use the dark theme variant
 */
export function getEditorTheme(dark: boolean): Extension[] {
  return [
    dark ? darkTheme : lightTheme,
    syntaxHighlighting(dark ? sqlHighlightDark : sqlHighlightLight),
  ];
}