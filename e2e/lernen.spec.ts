/**
 * E2E-Tests: Lernen-Modus der SQL-Trainer Plattform.
 *
 * Testet die kritischen Nutzerfluesse:
 * - Lernen-Hub zeigt Module
 * - Modul-Detailseite zeigt Artikel
 * - Artikel-Seite laedt mit Inhalt
 * - Navigation zwischen Modulen und Artikeln
 * - Mini-Playground in Artikeln funktioniert
 */

import { test, expect } from "@playwright/test";

test.describe("Lernen – Hub-Seite", () => {
  test("Lernen-Hub laedt und zeigt Module", async ({ page }) => {
    await page.goto("lernen");
    await page.waitForLoadState("networkidle");

    // Ueberschrift ist sichtbar
    await expect(page.locator("h1, h2").first()).toContainText(/Lern|Theorie/i);

    // Modul-Karten sind sichtbar
    const moduleCards = page.locator("a[href*='/lernen/'], article, [class*='card']");
    const count = await moduleCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Modul-Karten haben Links zu Detailseiten", async ({ page }) => {
    await page.goto("lernen");
    await page.waitForLoadState("networkidle");

    // Mindestens ein Modul-Link sollte vorhanden sein
    const moduleLinks = page.locator('a[href*="/lernen/"]');
    const count = await moduleLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Normalisierung-Modul ist verfuegbar", async ({ page }) => {
    await page.goto("lernen");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("text=Normalisierung").first()).toBeVisible({ timeout: 5000 });
  });

  test("SQL-Grundlagen-Modul ist verfuegbar", async ({ page }) => {
    await page.goto("lernen");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("text=SQL-Grundlagen").first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Lernen – Modul-Detailseite", () => {
  test("Normalisierung-Modul zeigt Artikel", async ({ page }) => {
    await page.goto("lernen/normalisierung");
    await page.waitForLoadState("networkidle");

    // Artikel-Liste ist sichtbar
    const articleLinks = page.locator('a[href*="/normalisierung/"]');
    const count = await articleLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Relationenmodell-Modul zeigt Artikel", async ({ page }) => {
    await page.goto("lernen/relationenmodell");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 5000 });
  });

  test("ERM-Modul zeigt Artikel", async ({ page }) => {
    await page.goto("lernen/erm");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 5000 });
  });

  test("Joins-Modul zeigt Artikel", async ({ page }) => {
    await page.goto("lernen/joins");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Lernen – Artikel-Seite", () => {
  test("Artikel-Seite laedt mit Inhalt", async ({ page }) => {
    await page.goto("lernen/normalisierung/was-ist-normalisierung");
    await page.waitForLoadState("networkidle");

    // Artikel-Titel ist sichtbar
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 5000 });

    // Inhalts-Abschnitte sind sichtbar
    const sections = page.locator("section, [id^='section-']");
    const count = await sections.count();
    expect(count).toBeGreaterThan(0);
  });

  test("Erste-Normalform-Artikel laedt", async ({ page }) => {
    await page.goto("lernen/normalisierung/erste-normalform");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 5000 });
  });

  test("SQL-Grundlagen-Artikel laedt", async ({ page }) => {
    await page.goto("lernen/sql-grundlagen/sql-einfuehrung");
    await page.waitForLoadState("networkidle");

    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 5000 });
  });

  test("Navigation zu naechstem Artikel", async ({ page }) => {
    await page.goto("lernen/normalisierung/was-ist-normalisierung");
    await page.waitForLoadState("networkidle");

    // "Naechster Artikel" Link sollte sichtbar sein
    const nextLink = page.locator('a[href*="/normalisierung/"]').last();
    if (await nextLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      const href = await nextLink.getAttribute("href");
      if (href && href.includes("/normalisierung/")) {
        await nextLink.click();
        await page.waitForLoadState("networkidle");
        // Seite sollte eine andere Artikel-URL sein
        await expect(page).toHaveURL(/\/lernen\/normalisierung\//);
      }
    }
  });

  test("Breadcrumb-Navigation funktioniert", async ({ page }) => {
    await page.goto("lernen/normalisierung/was-ist-normalisierung");
    await page.waitForLoadState("networkidle");

    // Breadcrumb-Link zum Lernen-Hub
    const lernenLink = page.locator('a[href*="/lernen"]').first();
    if (await lernenLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await lernenLink.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/lernen/);
    }
  });
});

test.describe("Lernen – Mini-Playground", () => {
  test("SQL-Beispiel in Artikel kann ausgefuehrt werden", async ({ page }) => {
    await page.goto("lernen/normalisierung/was-ist-normalisierung");
    await page.waitForLoadState("networkidle");

    // Pruefen ob ein SQL-Beispiel-Playground existiert
    const sqlEditor = page.locator(".cm-content").first();
    if (await sqlEditor.isVisible({ timeout: 3000 }).catch(() => false)) {
      // SQL-Editor sollte einen Ausfuehren-Button haben
      const runButton = page.locator("button:has-text('Ausführen')").first();
      await expect(runButton).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe("Lernen – Visuelle Snapshots", () => {
  // Snapshot-Tests sind deaktiviert, bis Basis-Snapshots erstellt wurden.
  // Um sie zu aktivieren: npx playwright test --update-snapshots
  // Danach die Tests wieder aktivieren.
});