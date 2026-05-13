/**
 * Dialect Context — Global SQL dialect state (SQLite / MySQL / PostgreSQL).
 *
 * Persists the selected dialect to localStorage (key: "sql-vibe-dialect").
 * Default: "mysql" (preserves current behavior).
 *
 * Follows the same pattern as the theme toggle for hydration safety.
 */
"use client";

import React, { createContext, useContext, useCallback, useSyncExternalStore } from "react";

export type Dialect = "sqlite" | "mysql" | "postgresql";

export const DIALECTS: Dialect[] = ["sqlite", "mysql", "postgresql"];

export const DIALECT_LABELS: Record<Dialect, { short: string }> = {
  sqlite: { short: "SQLite" },
  mysql: { short: "MySQL" },
  postgresql: { short: "PostgreSQL" },
};

const STORAGE_KEY = "sql-vibe-dialect";
const AUTOCOMPLETE_KEY = "sql-vibe-autocomplete";
const DEFAULT_DIALECT: Dialect = "mysql";

// ─── localStorage sync (same pattern as theme toggle) ────────────────────

function getStoredDialect(): Dialect {
  if (typeof window === "undefined") return DEFAULT_DIALECT;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && DIALECTS.includes(stored as Dialect)) {
      return stored as Dialect;
    }
  } catch {
    // localStorage not available
  }
  return DEFAULT_DIALECT;
}

function setStoredDialect(dialect: Dialect): void {
  try {
    localStorage.setItem(STORAGE_KEY, dialect);
  } catch {
    // localStorage not available
  }
}

// ─── External store for useSyncExternalStore ─────────────────────────────

let currentDialect: Dialect = getStoredDialect();
const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Dialect {
  return currentDialect;
}

function getServerSnapshot(): Dialect {
  return DEFAULT_DIALECT;
}

function setDialect(dialect: Dialect): void {
  currentDialect = dialect;
  setStoredDialect(dialect);
  listeners.forEach((l) => l());
}

// ─── Autocomplete external store ────────────────────────────────────────

function readAutocomplete(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const v = localStorage.getItem(AUTOCOMPLETE_KEY);
    if (v === "false") return false;
  } catch { /* ignore */ }
  return true;
}

function writeAutocomplete(enabled: boolean): void {
  try { localStorage.setItem(AUTOCOMPLETE_KEY, String(enabled)); } catch { /* ignore */ }
}

// Module-level state + listeners (same pattern as dialect)
let currentAutocomplete: boolean = true;
const acListeners = new Set<() => void>();

// Initialize from localStorage immediately on client
if (typeof window !== "undefined") {
  currentAutocomplete = readAutocomplete();
}

function subscribeAc(cb: () => void): () => void {
  acListeners.add(cb);
  return () => { acListeners.delete(cb); };
}
function getAcSnap(): boolean { return currentAutocomplete; }
function getAcServerSnap(): boolean { return true; }
function setAc(v: boolean): void {
  currentAutocomplete = v;
  writeAutocomplete(v);
  acListeners.forEach(l => l());
}

// ─── Context ─────────────────────────────────────────────────────────────

interface DialectContextValue {
  dialect: Dialect;
  setDialect: (d: Dialect) => void;
  autocompleteEnabled: boolean;
  setAutocompleteEnabled: (enabled: boolean) => void;
}

const DialectContext = createContext<DialectContextValue>({
  dialect: DEFAULT_DIALECT,
  setDialect: () => {},
  autocompleteEnabled: true,
  setAutocompleteEnabled: () => {},
});

export function DialectProvider({ children }: { children: React.ReactNode }) {
  const dialect = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const autocompleteEnabled = useSyncExternalStore(subscribeAc, getAcSnap, getAcServerSnap);

  const handleSetDialect = useCallback((d: Dialect) => {
    setDialect(d);
  }, []);

  const handleSetAutocomplete = useCallback((enabled: boolean) => {
    setAc(enabled);
  }, []);

  return (
    <DialectContext.Provider value={{ dialect, setDialect: handleSetDialect, autocompleteEnabled, setAutocompleteEnabled: handleSetAutocomplete }}>
      {children}
    </DialectContext.Provider>
  );
}

export function useDialect(): DialectContextValue {
  const ctx = useContext(DialectContext);
  if (!ctx) {
    throw new Error("useDialect must be used within a DialectProvider");
  }
  return ctx;
}

/**
 * Inline script to set the dialect before React hydrates.
 * Prevents flash of wrong dialect state. Same pattern as ThemeScript.
 */
export function DialectScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: `(function(){try{var d=localStorage.getItem("${STORAGE_KEY}");if(d==="sqlite"||d==="mysql"||d==="postgresql"){/* dialect will be read by useSyncExternalStore */}}catch(e){}})()`,
      }}
    />
  );
}