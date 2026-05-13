"use client";

import React, { useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
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

/**
 * Autocomplete Switch — toggle-switch variant for settings panels.
 *
 * Renders a track + thumb switch similar to ThemeToggle.
 * Uses the global autocomplete state from DialectProvider.
 * Persisted to localStorage via useSyncExternalStore.
 */
export function AutocompleteSwitch() {
  const { autocompleteEnabled, setAutocompleteEnabled } = useDialect();
  const shouldReduceMotion = useReducedMotion();
  const t = useTranslations("common");

  const toggle = useCallback(() => {
    setAutocompleteEnabled(!autocompleteEnabled);
  }, [autocompleteEnabled, setAutocompleteEnabled]);

  return (
    <motion.button
      onClick={toggle}
      role="switch"
      aria-checked={autocompleteEnabled}
      aria-label={t("autocomplete")}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-full"
    >
      {/* Track */}
      <motion.div
        className="relative overflow-hidden rounded-full"
        style={{ width: 44, height: 24 }}
        animate={{
          backgroundColor: autocompleteEnabled ? "#6366f1" : "#d1d5db",
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Thumb */}
        <motion.div
          className="absolute top-0.5 left-0.5 w-[20px] h-[20px] rounded-full bg-white shadow-sm"
          animate={{ x: autocompleteEnabled ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </motion.button>
  );
}