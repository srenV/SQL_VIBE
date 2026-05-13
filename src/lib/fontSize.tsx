/**
 * Font Size Context — Global font size state (sm / md / lg).
 *
 * Persists the selected font size to localStorage (key: "sql-vibe-font-size").
 * Default: "md" (16px).
 *
 * Sets CSS custom property --font-size-base on <html> so Tailwind can consume it.
 * Follows the same pattern as the theme toggle and dialect provider for hydration safety.
 */
"use client";

import React, { createContext, useContext, useCallback, useSyncExternalStore, useEffect } from "react";

export type FontSize = "sm" | "md" | "lg";

export const FONT_SIZES: FontSize[] = ["sm", "md", "lg"];

export const FONT_SIZE_LABELS: Record<FontSize, { px: number; labelKey: string }> = {
  sm: { px: 14, labelKey: "fontSizeSm" },
  md: { px: 16, labelKey: "fontSizeMd" },
  lg: { px: 18, labelKey: "fontSizeLg" },
};

const STORAGE_KEY = "sql-vibe-font-size";
const DEFAULT_FONT_SIZE: FontSize = "md";

// ─── localStorage sync ────────────────────────────────────────────────────

function getStoredFontSize(): FontSize {
  if (typeof window === "undefined") return DEFAULT_FONT_SIZE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && FONT_SIZES.includes(stored as FontSize)) {
      return stored as FontSize;
    }
  } catch {
    // localStorage not available
  }
  return DEFAULT_FONT_SIZE;
}

function setStoredFontSize(size: FontSize): void {
  try {
    localStorage.setItem(STORAGE_KEY, size);
  } catch {
    // localStorage not available
  }
}

// ─── Apply font size to DOM ────────────────────────────────────────────────

function applyFontSize(size: FontSize): void {
  if (typeof document === "undefined") return;
  const px = FONT_SIZE_LABELS[size].px;
  document.documentElement.style.setProperty("--font-size-base", `${px}px`);
}

// ─── External store for useSyncExternalStore ───────────────────────────────

let currentFontSize: FontSize = getStoredFontSize();
const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): FontSize {
  return currentFontSize;
}

function getServerSnapshot(): FontSize {
  return DEFAULT_FONT_SIZE;
}

function setFontSize(size: FontSize): void {
  currentFontSize = size;
  setStoredFontSize(size);
  applyFontSize(size);
  listeners.forEach((l) => l());
}

// ─── Context ──────────────────────────────────────────────────────────────

interface FontSizeContextValue {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextValue>({
  fontSize: DEFAULT_FONT_SIZE,
  setFontSize: () => {},
});

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const fontSize = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Apply on mount and when fontSize changes
  useEffect(() => {
    applyFontSize(fontSize);
  }, [fontSize]);

  const handleSetFontSize = useCallback((size: FontSize) => {
    setFontSize(size);
  }, []);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize: handleSetFontSize }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize(): FontSizeContextValue {
  const ctx = useContext(FontSizeContext);
  if (!ctx) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return ctx;
}

/**
 * Inline script to apply font size before first paint (avoids FOUC).
 * Must be placed in <head> via layout.tsx.
 */
export function FontSizeScript() {
  const script = `
    (function() {
      var stored = localStorage.getItem('${STORAGE_KEY}');
      var sizes = { sm: '14px', md: '16px', lg: '18px' };
      var size = sizes[stored] || sizes.md;
      document.documentElement.style.setProperty('--font-size-base', size);
    })();
  `;

  return <script suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />;
}