"use client";

import { useSyncExternalStore } from "react";

/**
 * Subscribes to dark mode class changes on <html>.
 */
function subscribeToDarkMode(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  window.addEventListener("storage", callback);
  return () => {
    observer.disconnect();
    window.removeEventListener("storage", callback);
  };
}

function getIsDarkSnapshot() {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

/**
 * Hook that returns the current theme ("dark" or "light").
 * Uses useSyncExternalStore for hydration-safe reads.
 */
export function useTheme(): { theme: "dark" | "light"; isDark: boolean } {
  const isDark = useSyncExternalStore(
    subscribeToDarkMode,
    getIsDarkSnapshot,
    getServerSnapshot,
  );

  return {
    theme: isDark ? "dark" : "light",
    isDark,
  };
}