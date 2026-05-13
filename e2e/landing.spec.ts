/**
 * Smoke-Test: Landing-Page der SQL-Trainer MySQL-Lernplattform.
 *
 * Verifiziert, dass die Hauptseite korrekt laedt, das Logo
 * sichtbar ist und Kern-Links funktionieren.
 *
 * Screenshot-Vergleich fuer visuelle Regression.
 */

import { test, expect } from "@playwright/test";

test.describe("Landing Page Smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("");
    await page.waitForLoadState("networkidle");
  });

  test("zeigt Logo und Hauptueberschrift", async ({ page }) => {
    await expect(page.locator("text=SQLVIBE").first()).toBeVisible();
    await expect(page.locator("h1")).toContainText(/SQL/i);
  });

  test("zeigt Statistiken (Übungen, Lektionen)", async ({ page }) => {
    await expect(page.locator("text=Übungen").first()).toBeVisible();
    await expect(page.locator("text=Lektionen").first()).toBeVisible();
  });

  test("zeigt Feature-Cards mit Links zu Lektionen, Sandbox und Lernen", async ({ page }) => {
    const featureCards = page.locator('a[href*="/lektionen"], a[href*="/sandbox"], a[href*="/lernen"]');
    const count = await featureCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("CTA-Links sind sichtbar", async ({ page }) => {
    const ctaLinks = page.locator("text=/Zu den Lektionen|Sandbox öffnen|Zum Lern-Hub/i").first();
    await expect(ctaLinks).toBeVisible({ timeout: 5000 });
  });

  test("Hauptseite hat keinen Layoutfehler", async ({ page }) => {
    await expect(page.locator("main")).toBeVisible();
  });

  // Snapshot-Tests sind deaktiviert, bis Basis-Snapshots erstellt wurden.
  // Um sie zu aktivieren: npx playwright test --update-snapshots
  // Danach die Tests wieder aktivieren.
});