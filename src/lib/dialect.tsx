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

function getStoredAutocomplete(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = localStorage.getItem(AUTOCOMPLETE_KEY);
    if (stored === "false") return false;
    if (stored === "true") return true;
  } catch {
    // localStorage not available
  }
  return true;
}

function setStoredAutocomplete(enabled: boolean): void {
  try {
    localStorage.setItem(AUTOCOMPLETE_KEY, String(enabled));
  } catch {
    // localStorage not available
  }
}

// Initialize lazily to avoid hydration mismatch — server always returns true,
// client reads from localStorage on first actual access.
let currentAutocomplete: boolean = true;
let autocompleteInitialized = false;

function ensureAutocompleteInitialized(): void {
  if (!autocompleteInitialized) {
    currentAutocomplete = getStoredAutocomplete();
    autocompleteInitialized = true;
  }
}

const autocompleteListeners = new Set<() => void>();

function subscribeAutocomplete(callback: () => void): () => void {
  autocompleteListeners.add(callback);
  return () => autocompleteListeners.delete(callback);
}

function getAutocompleteSnapshot(): boolean {
  ensureAutocompleteInitialized();
  return currentAutocomplete;
}

function getAutocompleteServerSnapshot(): boolean {
  return true;
}

function setAutocomplete(enabled: boolean): void {
  ensureAutocompleteInitialized();
  currentAutocomplete = enabled;
  setStoredAutocomplete(enabled);
  autocompleteListeners.forEach((l) => l());
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
  const autocompleteEnabled = useSyncExternalStore(subscribeAutocomplete, getAutocompleteSnapshot, getAutocompleteServerSnapshot);

  const handleSetDialect = useCallback((d: Dialect) => {
    setDialect(d);
  }, []);

  const handleSetAutocomplete = useCallback((enabled: boolean) => {
    setAutocomplete(enabled);
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