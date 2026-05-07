import { defineConfig } from "vitest/config";
import path from "path";

/**
 * Vitest-Konfiguration fuer die SQL-Trainer MySQL-Lernplattform.
 *
 * - environment: jsdom (Browser-DOM fuer Unit-Tests ohne echten Browser).
 * - globals: true (describe/it/expect ohne Import verfuegbar).
 * - setupFiles: vitest.setup.ts laedt jest-dom Matcher.
 * - coverage: V8 mit HTML/Text/JSON Reportern.
 *
 * Quelle: https://vitest.dev/config/file.html
 */
export default defineConfig({
  root: process.cwd(),
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["vitest.setup.ts"],
    include: ["src/**/*.test.ts", "src/**/*.test.tsx", "tests/**/*.test.ts"],
    coverage: {
      reporter: ["text", "html", "json"],
      include: ["src/**/*.ts", "src/**/*.tsx"],
      exclude: ["src/**/*.d.ts", "src/**/*.test.{ts,tsx}", "src/**/*.stories.{ts,tsx}"],
    },
  },
  resolve: {
    alias: [
      {
        find: /^@\/(.*)/,
        replacement: path.resolve(__dirname, "src/$1"),
      },
    ],
  },
});
