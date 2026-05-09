/**
 * E2E-Tests: Lektionen-Navigation und Uebungsseiten.
 *
 * Testet die kritischen Nutzerfluesse:
 * - Landing-Page laedt und zeigt Lektionen
 * - Lektionen-Seite listet alle Lektionen
 * - Einzelne Lektion zeigt Uebungen
 * - Uebungsseite laedt mit SQL-Editor
 * - Navigation zwischen Lektionen und Uebungen
 * - Fortschrittsanzeige (Local Storage)
 * - Visuelle Snapshots fuer Regression
 * - Canary: Bereitstellung Readiness
 */

import { test, expect } from "@playwright/test";

test.describe("Landing Page", () => {
  test("laedt und zeigt die Hauptueberschrift", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText(/SQL/i);
    await expect(page.locator("text=SQLVIBE").first()).toBeVisible();
  });

  test("zeigt Statistiken (Übungen, Lektionen, Datensätze)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=Übungen").first()).toBeVisible();
    await expect(page.locator("text=Lektionen").first()).toBeVisible();
  });

  test("zeigt Feature-Cards mit Links zu Lektionen, Sandbox und Lernen", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const featureCards = page.locator('a[href="/lektionen"], a[href="/sandbox"], a[href="/lernen"]');
    const count = await featureCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("CTA-Links sind sichtbar", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=/Zu den Lektionen|Sandbox öffnen|Zum Lern-Hub/i").first()).toBeVisible({ timeout: 5000 });
  });

  // Snapshot-Tests sind deaktiviert, bis Basis-Snapshots erstellt wurden.
  // Um sie zu aktivieren: npx playwright test --update-snapshots
  // Danach die Tests wieder aktivieren.
});

test.describe("Lektionen-Uebersicht", () => {
  test("zeigt alle 15 Lektionen", async ({ page }) => {
    await page.goto("/lektionen");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("SQL Lektionen");
    const lessonCards = page.locator('a[href^="/lektionen/lesson_"]');
    const count = await lessonCards.count();
    expect(count).toBe(15);
  });

  test("jede Lektion zeigt Titel", async ({ page }) => {
    await page.goto("/lektionen");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=SELECT Grundlagen").first()).toBeVisible();
  });

  // Snapshot deaktiviert – Basis-Snapshots fehlen
  // Um zu aktivieren: npx playwright test --update-snapshots
});

test.describe("Einzelne Lektion-Seite", () => {
  test("zeigt Lektion-Titel und Beschreibung", async ({ page }) => {
    await page.goto("/lektionen/lesson_select");
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toContainText("SELECT Grundlagen");
  });

  test("listet Uebungen auf", async ({ page }) => {
    await page.goto("/lektionen/lesson_select");
    await page.waitForLoadState("networkidle");
    const exerciseLinks = page.locator('a[href^="/lektionen/lesson_select/sel_"]');
    const count = await exerciseLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  // Snapshot deaktiviert – Basis-Snapshots fehlen
  // Um zu aktivieren: npx playwright test --update-snapshots
});

test.describe("Uebungs-Seite (SQL Editor)", () => {
  const FIRST_SELECT_URL = "/lektionen/lesson_select/sel_0001";

  test("Uebungsseite laedt und zeigt Inhalt", async ({ page }) => {
    await page.goto(FIRST_SELECT_URL);
    await page.waitForLoadState("networkidle");
    const mainContent = page.locator("#main-content").or(page.locator("main"));
    await expect(mainContent.first()).toBeVisible();
  });

  test("zeigt Logo", async ({ page }) => {
    await page.goto(FIRST_SELECT_URL);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("text=SQLVIBE").first()).toBeVisible();
  });

  test("zeigt Naechste-Uebung-Link oder Hinweis", async ({ page }) => {
    await page.goto(FIRST_SELECT_URL);
    await page.waitForLoadState("networkidle");
    // "Nächste" Button ist im Playground, sel_0002 Link in Sidebar; einer davon muss sichtbar sein
    await expect(page.locator('a[href*="sel_0002"]').first()).toBeVisible();
  });

  // Snapshot deaktiviert – Basis-Snapshots fehlen
  // Um zu aktivieren: npx playwright test --update-snapshots
});

test.describe("Fortlaufende Navigation", () => {
  test("/uebung leitet auf erste Uebung weiter", async ({ page }) => {
    await page.goto("/uebung");
    await page.waitForURL(/\/lektionen\/lesson_select\//);
    const mainContent = page.locator("#main-content").or(page.locator("main"));
    await expect(mainContent.first()).toBeVisible();
  });

  test("Lektionen-Seite ist von jeder Lektion aus erreichbar", async ({ page }) => {
    await page.goto("/lektionen/lesson_select");
    await page.waitForLoadState("networkidle");
    const lektionenLink = page.locator('a[href="/lektionen"]').or(page.locator("text=Lektionen"));
    await expect(lektionenLink.first()).toBeVisible();
  });
});

test.describe("Verschiedene Uebungstypen", () => {
  test("WHERE-Uebung laedt", async ({ page }) => {
    const response = await page.goto("/lektionen/lesson_where/whr_0001");
    expect(response!.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Debug-Uebung laedt", async ({ page }) => {
    const response = await page.goto("/lektionen/lesson_debug/dbg_0001");
    expect(response!.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
  });

  test("Predict-Uebung laedt", async ({ page }) => {
    const response = await page.goto("/lektionen/lesson_predict/prd_0001");
    expect(response!.status()).toBe(200);
  });

  test("Story-Uebung laedt", async ({ page }) => {
    const response = await page.goto("/lektionen/lesson_story/str_0001");
    expect(response!.status()).toBe(200);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Canary: Bereitstellung Readiness", () => {
  test("alle Hauptseiten liefern HTTP 200", async ({ page }) => {
    const urls = ["/", "/lektionen", "/lektionen/lesson_select", "/lektionen/lesson_select/sel_0001"];
    for (const url of urls) {
      const response = await page.goto(url);
      expect(response!.status()).toBe(200);
    }
  });

  test("seitenuebergreifende Navigation ist konsistent", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const lektionenLink = page.locator('a[href="/lektionen"]').first();
    await lektionenLink.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/lektionen$/);

    const firstLesson = page.locator('a[href^="/lektionen/lesson_select"]').first();
    await firstLesson.click();
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/lektionen\/lesson_select$/);
  });

  test("statische Assets laden (CSS)", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const cssLinks = await page.locator('link[rel="stylesheet"]').count();
    expect(cssLinks).toBeGreaterThan(0);
  });
});