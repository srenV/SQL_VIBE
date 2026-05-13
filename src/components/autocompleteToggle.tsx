"use client";

import React, { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDialect } from "@/lib/dialect";

/**
 * Autocomplete Toggle — animated switch matching the ThemeToggle style.
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
    <motion.button
      onClick={toggle}
      role="switch"
      aria-checked={autocompleteEnabled}
      aria-label={autocompleteEnabled ? "Autocomplete off" : "Autocomplete on"}
      whileTap={{ scale: 0.9 }}
      className="relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-full"
    >
      {/* Track */}
      <motion.div
        className="relative overflow-hidden rounded-full"
        style={{ width: 56, height: 28 }}
        animate={{
          backgroundColor: autocompleteEnabled ? "#6366f1" : "#94a3b8",
          boxShadow: autocompleteEnabled
            ? "0 0 0 1.5px #4f46e5, 0 0 8px 1px rgba(99,102,241,0.18)"
            : "0 0 0 1.5px #64748b, 0 0 4px 1px rgba(148,163,184,0.15)",
        }}
        whileHover={{
          boxShadow: autocompleteEnabled
            ? "0 0 0 1.5px #4338ca, 0 0 14px 2px rgba(99,102,241,0.3)"
            : "0 0 0 1.5px #475569, 0 0 10px 1px rgba(148,163,184,0.25)",
        }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Subtle glow shimmer — on only */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(129,140,248,0.25) 0%, transparent 65%)",
          }}
          animate={{ opacity: autocompleteEnabled ? 1 : 0 }}
          transition={{ duration: 0.45 }}
        />

        {/* Small sparkle dots — on only */}
        <motion.span
          className="absolute rounded-full bg-white/70 pointer-events-none"
          style={{ left: 10, top: 7, width: 1.5, height: 1.5 }}
          animate={
            autocompleteEnabled
              ? { opacity: [0.2, 0.8, 0.2], scale: [0.7, 1.3, 0.7] }
              : { opacity: 0, scale: 0 }
          }
          transition={
            autocompleteEnabled
              ? { repeat: Infinity, duration: 2.4, delay: 0, ease: "easeInOut" }
              : { duration: 0.15 }
          }
        />
        <motion.span
          className="absolute rounded-full bg-white/50 pointer-events-none"
          style={{ left: 22, top: 5, width: 1, height: 1 }}
          animate={
            autocompleteEnabled
              ? { opacity: [0.15, 0.7, 0.15], scale: [0.6, 1.2, 0.6] }
              : { opacity: 0, scale: 0 }
          }
          transition={
            autocompleteEnabled
              ? { repeat: Infinity, duration: 2, delay: 0.6, ease: "easeInOut" }
              : { duration: 0.15 }
          }
        />
        <motion.span
          className="absolute rounded-full bg-white/60 pointer-events-none"
          style={{ left: 16, top: 18, width: 1.2, height: 1.2 }}
          animate={
            autocompleteEnabled
              ? { opacity: [0.2, 0.9, 0.2], scale: [0.7, 1.4, 0.7] }
              : { opacity: 0, scale: 0 }
          }
          transition={
            autocompleteEnabled
              ? { repeat: Infinity, duration: 2.8, delay: 1.2, ease: "easeInOut" }
              : { duration: 0.15 }
          }
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-0.75 rounded-full flex items-center justify-center overflow-hidden"
          style={{ width: 22, height: 22 }}
          animate={{
            x: autocompleteEnabled ? 31 : 3,
            backgroundColor: autocompleteEnabled ? "#e0e7ff" : "#cbd5e1",
            boxShadow: autocompleteEnabled
              ? "0 2px 10px rgba(99,102,241,0.55), 0 0 4px rgba(129,140,248,0.35)"
              : "0 1px 4px rgba(100,116,139,0.3)",
          }}
          transition={{ type: "spring", stiffness: 420, damping: 26, mass: 0.85 }}
        >
          <AnimatePresence mode="wait">
            {autocompleteEnabled ? (
              <motion.div
                key="on"
                initial={{ opacity: 0, scale: 0.3, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.3, rotate: 30 }}
                transition={{ duration: 0.2, ease: "backOut" }}
                className="flex items-center justify-center w-full h-full"
              >
                {/* Lightbulb on — filled */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2a7 7 0 0 0-4.6 12.3c.6.5 1 1.2 1.1 2l.1.7h6.8l.1-.7c.1-.8.5-1.5 1.1-2A7 7 0 0 0 12 2z" fill="#6366f1" stroke="#4338ca" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9 18h6M10 21h4" stroke="#4338ca" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Rays */}
                  <line x1="12" y1="0.5" x2="12" y2="1.5" stroke="#818cf8" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="4.5" y1="4" x2="5.2" y2="4.7" stroke="#818cf8" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="19.5" y1="4" x2="18.8" y2="4.7" stroke="#818cf8" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              </motion.div>
            ) : (
              <motion.div
                key="off"
                initial={{ opacity: 0, scale: 0.3, rotate: 30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.3, rotate: -30 }}
                transition={{ duration: 0.2, ease: "backOut" }}
                className="flex items-center justify-center w-full h-full"
              >
                {/* Lightbulb off — outline only */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18h6M10 21h4M12 2a7 7 0 0 0-4.6 12.3c.6.5 1 1.2 1.1 2l.1.7h6.8l.1-.7c.1-.8.5-1.5 1.1-2A7 7 0 0 0 12 2z" />
                </svg>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.button>
  );
}