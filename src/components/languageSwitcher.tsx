"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Language Switcher Component.
 *
 * Renders a button to switch between DE and EN.
 * Preserves the current path, only changing the locale prefix.
 *
 * Uses full page navigation (window.location) instead of client-side
 * routing to ensure next-intl reloads the locale context correctly
 * in static export mode.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // pathname from next-intl's usePathname is locale-relative (no /de/ prefix)
    // Build the full path with the new locale prefix
    const newPath = `/${newLocale}${pathname === "/" ? "" : pathname}`;
    window.location.href = newPath;
  };

  const otherLocale = locale === "de" ? "en" : "de";
  const label = locale === "de" ? "EN" : "DE";

  return (
    <button
      onClick={() => switchLocale(otherLocale)}
      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-xs font-bold text-ink-muted hover:text-ink hover:bg-surface-dim/60 dark:hover:bg-dark-dim/60 transition-colors duration-150 border border-surface-dim dark:border-dark-dim"
      aria-label={t("switchLanguage")}
      title={t("switchLanguage")}
    >
      {label}
    </button>
  );
}