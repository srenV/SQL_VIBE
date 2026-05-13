"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Settings, Languages, Database, Sparkles, Sun, Moon, RotateCcw } from "lucide-react";
import { LanguageSwitcherInline } from "@/components/languageSwitcher";
import { DialectSwitcherInline } from "@/components/dialectSwitcher";
import { AutocompleteSwitch } from "@/components/autocompleteToggle";
import { ThemeToggle } from "@/components/themeToggle";
import { useDialect } from "@/lib/dialect";

/**
 * Settings Panel — animated dropdown for desktop navbar.
 *
 * Renders a gear icon that opens a panel with:
 * - Language (inline button-group)
 * - SQL Dialect (inline button-group)
 * - Autocomplete (toggle switch)
 * - Theme (embedded ThemeToggle)
 * - Font Size (inline button-group)
 * - Reset all settings button
 *
 * Closes on outside-click, Escape, or keyboard shortcut Cmd/Ctrl + ,
 */
export function SettingsPanel() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const { setDialect, setAutocompleteEnabled } = useDialect();

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

  // Keyboard shortcut: Cmd/Ctrl + ,
  useEffect(() => {
    function handleShortcut(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === ",") {
        e.preventDefault();
        setIsOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", handleShortcut);
    return () => document.removeEventListener("keydown", handleShortcut);
  }, []);

  // Reset all settings
  const handleReset = useCallback(() => {
    if (window.confirm(tCommon("resetConfirm"))) {
      setDialect("mysql");
      setAutocompleteEnabled(true);
      // Reset theme
      localStorage.removeItem("sql-trainer-theme");
      document.documentElement.classList.remove("dark");
      // Force reload to apply theme reset
      window.location.reload();
    }
  }, [setDialect, setAutocompleteEnabled, tCommon]);

  const panelVariants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: -4, scale: 0.97, filter: "blur(4px)" },
    visible: shouldReduceMotion
      ? { opacity: 1, transition: { duration: 0.15 } }
      : {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] },
        },
    exit: shouldReduceMotion
      ? { opacity: 0, transition: { duration: 0.1 } }
      : {
          opacity: 0,
          y: -4,
          scale: 0.97,
          filter: "blur(4px)",
          transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] },
        },
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button */}
      <motion.button
        onClick={() => setIsOpen((v) => !v)}
        whileTap={shouldReduceMotion ? {} : { scale: 0.9 }}
        className={`
          flex items-center justify-center w-9 h-9 rounded-lg
          text-ink-muted hover:text-ink
          hover:bg-surface-dim/60 dark:hover:bg-dark-dim/60
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          transition-colors duration-150
          ${isOpen ? "bg-surface-dim/60 dark:bg-dark-dim/60 text-ink" : ""}
        `}
        aria-label={tCommon("settingsAria")}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <Settings className="w-[18px] h-[18px]" />
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={shouldReduceMotion ? undefined : panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`
              absolute right-0 top-full mt-2 z-50 w-[280px]
              rounded-xl overflow-hidden
              bg-surface dark:bg-dark-dim
              border border-surface-dim dark:border-dark-dim
              shadow-lg shadow-black/10 dark:shadow-black/25
            `}
            role="dialog"
            aria-label={t("title")}
          >
            {/* Accent line */}
            <div className="h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400" />

            <div className="p-3 space-y-3">
              {/* Language */}
              <SettingsRow icon={<Languages className="w-4 h-4" />} label={t("language")}>
                <LanguageSwitcherInline />
              </SettingsRow>

              {/* Dialect */}
              <SettingsRow icon={<Database className="w-4 h-4" />} label={t("dialect")}>
                <DialectSwitcherInline />
              </SettingsRow>

              {/* Autocomplete */}
              <SettingsRow icon={<Sparkles className="w-4 h-4" />} label={t("autocomplete")}>
                <AutocompleteSwitch />
              </SettingsRow>

              {/* Theme */}
              <SettingsRow icon={<Sun className="w-4 h-4 dark:hidden" />} label={t("theme")}>
                <ThemeToggle />
              </SettingsRow>

              {/* Divider */}
              <div className="border-t border-surface-dim dark:border-dark-dim" />

              {/* Reset */}
              <motion.button
                onClick={handleReset}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                className={`
                  w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg
                  text-xs font-medium text-ink-muted
                  hover:text-error hover:bg-error/5
                  transition-colors duration-150
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1
                `}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t("resetAll")}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A single row in the settings panel: icon + label on the left, control on the right. */
function SettingsRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 text-ink-muted min-w-0">
        <span className="shrink-0">{icon}</span>
        <span className="text-sm font-medium truncate">{label}</span>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

