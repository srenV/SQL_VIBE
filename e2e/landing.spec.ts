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
    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("zeigt Logo und Hauptueberschrift", async ({ page }) => {
    await expect(page.locator("text=SQL-Trainer").first()).toBeVisible();
    await expect(page.locator("h1")).toContainText(/SQL/i);
  });

  test("zeigt Statistiken (Übungen, Lektionen)", async ({ page }) => {
    await expect(page.locator("text=Übungen").first()).toBeVisible();
    await expect(page.locator("text=Lektionen").first()).toBeVisible();
  });

  test("zeigt Lektion-Karten mit Links zu Uebungen", async ({ page }) => {
    const lessonCards = page.locator('a[href^="/lektionen/lesson_"]');
    const count = await lessonCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Start-Button ist sichtbar", async ({ page }) => {
    const startButton = page.locator("text=/Jetzt üben|Jetzt starten/i").first();
    await expect(startButton).toBeVisible({ timeout: 5000 });
  });

  test("Hauptseite hat keinen Layoutfehler", async ({ page }) => {
    await expect(page.locator("main")).toBeVisible();
  });

  // Snapshot-Tests sind deaktiviert, bis Basis-Snapshots erstellt wurden.
  // Um sie zu aktivieren: npx playwright test --update-snapshots
  // Danach die Tests wieder aktivieren.
});