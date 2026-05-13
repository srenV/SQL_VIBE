"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Language Switcher Component.
 *
 * Renders a button to switch between DE and EN.
 * Preserves the current path, only changing the locale prefix.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // pathname already includes the locale prefix (e.g. /de/lektionen)
    // Replace the current locale with the new one
    const currentLocalePrefix = `/${locale}`;
    const newPath = pathname.replace(currentLocalePrefix, `/${newLocale}`);
    router.push(newPath);
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