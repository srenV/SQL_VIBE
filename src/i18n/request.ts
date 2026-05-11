import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/**
 * Server-seitige i18n-Konfiguration.
 *
 * Lädt die Message-Datei für das angeforderte Locale.
 * Wird von next-intl automatisch aufgerufen.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Validate that the incoming locale is supported
  if (!locale || !routing.locales.includes(locale as "de" | "en")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});