"use client";

import React, { useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Languages, Database, Sparkles, RotateCcw } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcherInline } from "@/components/languageSwitcher";
import { DialectSwitcherInline } from "@/components/dialectSwitcher";
import { AutocompleteSwitch } from "@/components/autocompleteToggle";
import { ThemeToggle } from "@/components/themeToggle";
import { useDialect } from "@/lib/dialect";

export function SettingsPageClient() {
  const t = useTranslations("settings");
  const tCommon = useTranslations("common");
  const { setDialect, setAutocompleteEnabled } = useDialect();
  const shouldReduceMotion = useReducedMotion();

  const handleReset = useCallback(() => {
    if (window.confirm(tCommon("resetConfirm"))) {
      setDialect("mysql");
      setAutocompleteEnabled(true);
      localStorage.removeItem("sql-trainer-theme");
      document.documentElement.classList.remove("dark");
      window.location.reload();
    }
  }, [setDialect, setAutocompleteEnabled, tCommon]);

  const cardVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: shouldReduceMotion ? 0 : i * 0.06,
        duration: shouldReduceMotion ? 0 : 0.35,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-ink-muted hover:text-ink hover:bg-surface-dim/60 transition-colors duration-150"
          aria-label={tCommon("back")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-ink">{t("title")}</h1>
      </div>

      {/* Settings Cards */}
      <div className="space-y-3">
        {/* Language */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl bg-surface-dim/40 dark:bg-dark-dim/40 border border-surface-dim dark:border-dark-dim"
        >
          <div className="flex items-center gap-3 text-ink-muted">
            <Languages className="w-5 h-5" />
            <span className="text-sm font-medium text-ink">{t("language")}</span>
          </div>
          <LanguageSwitcherInline />
        </motion.div>

        {/* Dialect */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl bg-surface-dim/40 dark:bg-dark-dim/40 border border-surface-dim dark:border-dark-dim"
        >
          <div className="flex items-center gap-3 text-ink-muted">
            <Database className="w-5 h-5" />
            <span className="text-sm font-medium text-ink">{t("dialect")}</span>
          </div>
          <DialectSwitcherInline />
        </motion.div>

        {/* Autocomplete */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl bg-surface-dim/40 dark:bg-dark-dim/40 border border-surface-dim dark:border-dark-dim"
        >
          <div className="flex items-center gap-3 text-ink-muted">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium text-ink">{t("autocomplete")}</span>
          </div>
          <AutocompleteSwitch />
        </motion.div>

        {/* Theme */}
        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl bg-surface-dim/40 dark:bg-dark-dim/40 border border-surface-dim dark:border-dark-dim"
        >
          <div className="flex items-center gap-3 text-ink-muted">
            <SunMoonIcon />
            <span className="text-sm font-medium text-ink">{t("theme")}</span>
          </div>
          <ThemeToggle />
        </motion.div>

      </div>

      {/* Reset */}
      <motion.div
        custom={4}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="pt-2"
      >
        <button
          onClick={handleReset}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
            text-sm font-medium text-ink-muted
            border border-surface-dim dark:border-dark-dim
            hover:text-error hover:border-error/30 hover:bg-error/5
            transition-colors duration-150
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
          `}
        >
          <RotateCcw className="w-4 h-4" />
          {t("resetAll")}
        </button>
      </motion.div>
    </div>
  );
}

/** Sun/Moon icon that switches based on dark mode. */
function SunMoonIcon() {
  return (
    <>
      <svg className="w-5 h-5 dark:hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
      <svg className="w-5 h-5 hidden dark:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
      </svg>
    </>
  );
}