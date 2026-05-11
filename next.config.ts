import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Next.js Konfiguration fuer die SQL-Trainer MySQL-Lernplattform.
 *
 * - output: 'export' ermoeglicht ein Vercel-faehiges Static-Site-Deployment.
 * - images.unoptimized: bei Static Export notwendig, da kein
 *   Next.js Image-Optimization-Server verfuegbar ist.
 * - next-intl: Internationalisierung (DE + EN) mit Pfad-basierten Locales.
 */
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
