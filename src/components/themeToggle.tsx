"use client";

import React, { useCallback, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

function getIsDarkSnapshot() {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function getServerIsDarkSnapshot() {
  return false;
}

function getIsMountedSnapshot() {
  return true;
}

function getIsMountedServerSnapshot() {
  return false;
}

export function ThemeToggle() {
  const isDark = useSyncExternalStore(emptySubscribe, getIsDarkSnapshot, getServerIsDarkSnapshot);
  const mounted = useSyncExternalStore(emptySubscribe, getIsMountedSnapshot, getIsMountedServerSnapshot);

  const toggle = useCallback(() => {
    const nextDark = !document.documentElement.classList.contains("dark");
    localStorage.setItem("vibaa-theme", nextDark ? "dark" : "light");
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Farbschema umschalten"
        className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-surface-dim bg-surface text-ink-muted hover:text-ink hover:bg-surface-dim transition-colors duration-150"
      >
        <span className="sr-only">Farbschema</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln"}
      className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-surface-dim bg-surface text-ink-muted hover:text-ink hover:bg-surface-dim transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
    >
      {isDark ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}