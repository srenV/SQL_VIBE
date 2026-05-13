"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useDialect, DIALECTS, DIALECT_LABELS, type Dialect } from "@/lib/dialect";

/** SVG icons for each SQL dialect — no emojis. */
function DialectIcon({ dialect, className = "w-4 h-4" }: { dialect: Dialect; className?: string }) {
  switch (dialect) {
    case "sqlite":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7" />
          <path d="M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4" />
          <path d="M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          <path d="M12 14.5c-1.5 0-3-.5-3-2" />
        </svg>
      );
    case "mysql":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c-1.5 3-4 5-7 6 3 1 5.5 3 7 6 1.5-3 4-5 7-6-3-1-5.5-3-7-6z" />
        </svg>
      );
    case "postgresql":
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C8 2 4 6 4 10c0 4 2 8 8 12 6-4 8-8 8-12 0-4-4-8-8-8z" />
          <path d="M9 12h6" />
          <path d="M12 9v6" />
        </svg>
      );
  }
}

/**
 * Dialect Switcher — custom-styled select picker for SQL dialect.
 *
 * Renders an animated dropdown with icons and labels.
 * Persists selection via localStorage through the DialectProvider.
 */
export function DialectSwitcher() {
  const { dialect, setDialect } = useDialect();
  const t = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  const currentConfig = DIALECT_LABELS[dialect];

  const dropdownVariants = {
    hidden: { opacity: 0, y: 4, scale: 0.95, filter: "blur(4px)" },
    visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
    exit: { opacity: 0, y: 4, scale: 0.95, filter: "blur(4px)" },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -8 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.04,
        duration: shouldReduceMotion ? 0 : 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
    exit: { opacity: 0, x: -8 },
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
        className={`
          group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
          text-sm font-medium
          bg-surface-dim/60 dark:bg-dark-dim/60
          border border-surface-dim dark:border-dark-dim
          hover:bg-surface-dim dark:hover:bg-dark-dim
          hover:border-primary-300 dark:hover:border-primary-700
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          transition-colors duration-200
        `}
        aria-label={t("switchDialect")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Current dialect icon + label */}
        <span className="flex items-center gap-1">
          <DialectIcon dialect={dialect} className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold tracking-wide text-ink">
            {currentConfig.short}
          </span>
        </span>

        {/* Chevron */}
        <motion.svg
          className="w-3 h-3 text-ink-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={shouldReduceMotion ? undefined : dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`
              absolute right-0 bottom-full mb-1.5 min-w-[180px] z-50
              rounded-xl overflow-hidden
              bg-surface dark:bg-dark-dim
              border border-surface-dim dark:border-dark-dim
              shadow-lg shadow-black/5 dark:shadow-black/20
            `}
            role="listbox"
            aria-label={t("switchDialect")}
          >
            {/* Subtle top accent line */}
            <div className="h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400" />

            <div className="py-1">
              {DIALECTS.map((d: Dialect, i: number) => {
                const config = DIALECT_LABELS[d];
                const isActive = d === dialect;

                return (
                  <motion.button
                    key={d}
                    custom={i}
                    variants={shouldReduceMotion ? undefined : itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => {
                      setIsOpen(false);
                      if (!isActive) setDialect(d);
                    }}
                    disabled={isActive}
                    className={`
                      w-full flex items-center gap-3 px-3.5 py-2.5 text-left
                      transition-colors duration-150
                      ${isActive
                        ? "bg-primary-50 dark:bg-primary-950/40 cursor-default"
                        : "hover:bg-surface-dim/60 dark:hover:bg-white/5 cursor-pointer"
                      }
                    `}
                    role="option"
                    aria-selected={isActive}
                  >
                    {/* Icon */}
                    <DialectIcon dialect={d} className="w-4 h-4" />

                    {/* Label + description */}
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-medium ${
                          isActive
                            ? "text-primary-700 dark:text-primary-300"
                            : "text-ink"
                        }`}
                      >
                        {config.short}
                      </span>
                      <span className="text-[10px] text-ink-muted leading-tight">
                        {t(`dialectDesc_${d}` as Parameters<typeof t>[0])}
                      </span>
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="ml-auto"
                      >
                        <svg className="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}