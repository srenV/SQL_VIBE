"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const LOCALE_CONFIG: Record<Locale, { label: string; flag: string; nativeName: string }> = {
  de: { label: "DE", flag: "\u{1F1E9}\u{1F1EA}", nativeName: "Deutsch" },
  en: { label: "EN", flag: "\u{1F1EC}\u{1F1E7}", nativeName: "English" },
};

const LOCALES = [...routing.locales] as Locale[];

/**
 * Language Switcher — custom-styled select picker.
 *
 * Renders an animated dropdown with flag emojis and native language names.
 * Uses full page navigation (window.location) to ensure next-intl
 * reloads the locale context correctly in static export mode.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const switchLocale = useCallback((newLocale: Locale) => {
    const newPath = `/${newLocale}${pathname === "/" ? "" : pathname}`;
    window.location.href = newPath;
  }, [pathname]);

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

  const currentConfig = LOCALE_CONFIG[locale as Locale];

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
        aria-label={t("switchLanguage")}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {/* Current locale flag + code */}
        <span className="flex items-center gap-1">
          <span className="text-xs leading-none" role="img" aria-label={currentConfig.nativeName}>
            {currentConfig.flag}
          </span>
          <span className="text-xs font-semibold tracking-wide text-ink">
            {currentConfig.label}
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
              absolute right-0 bottom-full mb-1.5 min-w-[160px] z-50
              rounded-xl overflow-hidden
              bg-surface dark:bg-dark-dim
              border border-surface-dim dark:border-dark-dim
              shadow-lg shadow-black/5 dark:shadow-black/20
            `}
            role="listbox"
            aria-label={t("switchLanguage")}
          >
            {/* Subtle top accent line */}
            <div className="h-0.5 bg-gradient-to-r from-primary-400 via-primary-500 to-accent-400" />

            <div className="py-1">
              {LOCALES.map((loc: Locale, i: number) => {
                const config = LOCALE_CONFIG[loc];
                const isActive = loc === locale;

                return (
                  <motion.button
                    key={loc}
                    custom={i}
                    variants={shouldReduceMotion ? undefined : itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={() => {
                      setIsOpen(false);
                      if (!isActive) switchLocale(loc);
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
                    {/* Flag */}
                    <span className="text-lg leading-none" role="img" aria-label={config.nativeName}>
                      {config.flag}
                    </span>

                    {/* Native name */}
                    <span
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-primary-700 dark:text-primary-300"
                          : "text-ink"
                      }`}
                    >
                      {config.nativeName}
                    </span>

                    {/* Active indicator */}
                    {isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        className="ml-auto"
                      >
                        <svg
                          className="w-4 h-4 text-primary-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
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