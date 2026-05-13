import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright-E2E-Konfiguration fuer die SQL-Trainer MySQL-Lernplattform.
 *
 * - Fuehrt einen visuellen Smoke-Test gegen den statischen Export durch.
 * - Startet automatisch einen lokalen Webserver (`serve`) auf Port 4000.
 * - Macht Screenshots bei Testfehlern.
 *
 * Quelle: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "html",

  use: {
    baseURL: "http://localhost:4000/de",
    trace: "on-first-retry",
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "tablet",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 820, height: 1180 },
        userAgent:
          "Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A5341f Safari/604.1",
        isMobile: false,
        hasTouch: true,
      },
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 5"] },
    },
  ],

  webServer: {
    command: "npx serve out -l 4000",
    port: 4000,
    reuseExistingServer: !process.env.CI,
  },
});
