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

// ─── Context ─────────────────────────────────────────────────────────────

interface DialectContextValue {
  dialect: Dialect;
  setDialect: (d: Dialect) => void;
}

const DialectContext = createContext<DialectContextValue>({
  dialect: DEFAULT_DIALECT,
  setDialect: () => {},
});

export function DialectProvider({ children }: { children: React.ReactNode }) {
  const dialect = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const handleSetDialect = useCallback((d: Dialect) => {
    setDialect(d);
  }, []);

  return (
    <DialectContext.Provider value={{ dialect, setDialect: handleSetDialect }}>
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