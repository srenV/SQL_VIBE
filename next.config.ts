import type { NextConfig } from "next";

/**
 * Next.js Konfiguration fuer die SQL-Trainer MySQL-Lernplattform.
 *
 * - output: 'export' ermoeglicht ein Vercel-faehiges Static-Site-Deployment.
 * - images.unoptimized: bei Static Export notwendig, da kein
 *   Next.js Image-Optimization-Server verfuegbar ist.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
