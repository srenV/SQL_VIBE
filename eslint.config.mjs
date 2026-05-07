import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

/**
 * ESLint-Flat-Config fuer die SQL-Trainer MySQL-Lernplattform.
 *
 * Baut auf den offiziellen Next.js-Konfigurationen (core-web-vitals,
 * typescript) auf und erweitert sie um zusaetzliche Ignores fuer
 * Build-Artefakte und generierte Dateien.
 */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "dist/**", "next-env.d.ts", "node_modules/**"]),
]);

export default eslintConfig;
