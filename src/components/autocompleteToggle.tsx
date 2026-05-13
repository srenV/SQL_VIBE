"use client";

import React, { useCallback } from "react";
import { useDialect } from "@/lib/dialect";
import { Sparkles } from "lucide-react";

/**
 * Autocomplete Toggle — simple button to toggle SQL autocompletion.
 *
 * Uses the global autocomplete state from DialectProvider.
 * Persisted to localStorage via useSyncExternalStore.
 */
export function AutocompleteToggle() {
  const { autocompleteEnabled, setAutocompleteEnabled } = useDialect();

  const toggle = useCallback(() => {
    setAutocompleteEnabled(!autocompleteEnabled);
  }, [autocompleteEnabled, setAutocompleteEnabled]);

  return (
    <button
      onClick={toggle}
      role="switch"
      aria-checked={autocompleteEnabled}
      aria-label={autocompleteEnabled ? "Autocomplete off" : "Autocomplete on"}
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
        text-xs font-semibold tracking-wide
        border transition-colors duration-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
        ${
          autocompleteEnabled
            ? "bg-primary-50 text-primary-700 border-primary-300 dark:bg-primary-950/40 dark:text-primary-300 dark:border-primary-700"
            : "bg-surface-dim/60 text-ink-muted border-surface-dim dark:bg-dark-dim/60 dark:border-dark-dim hover:text-ink dark:hover:text-ink"
        }
      `}
    >
      <Sparkles className="w-3.5 h-3.5" />
      AC
    </button>
  );
}