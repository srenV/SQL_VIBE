"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Language Switcher Component.
 *
 * Renders a button to switch between DE and EN.
 * Preserves the current path, only changing the locale prefix.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: Locale) => {
    // Remove current locale prefix from pathname
    const segments = pathname.split("/");
    // pathname is like /de/lektionen or /en/sandbox
    if (segments.length > 1 && routing.locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }
    router.push(segments.join("/"));
  };

  const otherLocale = locale === "de" ? "en" : "de";
  const label = locale === "de" ? "EN" : "DE";

  return (
    <button
      onClick={() => switchLocale(otherLocale)}
      className="inline-flex items-center justify-center w-8 h-8 rounded-md text-xs font-bold text-ink-muted hover:text-ink hover:bg-surface-dim/60 dark:hover:bg-dark-dim/60 transition-colors duration-150 border border-surface-dim dark:border-dark-dim"
      aria-label={locale === "de" ? "Switch to English" : "Zur Deutsch wechseln"}
      title={locale === "de" ? "Switch to English" : "Zur Deutsch wechseln"}
    >
      {label}
    </button>
  );
}