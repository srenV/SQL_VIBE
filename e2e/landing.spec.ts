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
    await expect(page.locator("h1")).toContainText("MySQL");
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
    const startButton = page.locator("text=Jetzt starten").first();
    await expect(startButton).toBeVisible();
  });

  test("Hauptseite hat keinen Layoutfehler", async ({ page }) => {
    await expect(page.locator("main")).toBeVisible();
  });

  test("visueller Snapshot Desktop", async ({ page }) => {
    await expect(page).toHaveScreenshot("landing-desktop.png", {
      fullPage: true,
      maxDiffPixels: 500,
    });
  });

  test("visueller Snapshot Mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveScreenshot("landing-mobile.png", {
      fullPage: true,
      maxDiffPixels: 500,
    });
  });
});