import { defineRouting } from "next-intl/routing";

/**
 * i18n-Routing-Konfiguration.
 *
 * Definiert die unterstützten Locales, das Default-Locale
 * und die Pfad-Präfixe für die Sprachumschaltung.
 */
export const routing = defineRouting({
  locales: ["de", "en"],
  defaultLocale: "de",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];