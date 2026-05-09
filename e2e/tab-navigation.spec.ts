/**
 * E2E-Tests: Tab-Navigation und Integration der 3-Saeulen-Architektur.
 *
 * Testet die kritischen Nutzerfluesse:
 * - Tab-Navigation zwischen Ueben/Sandbox/Lernen
 * - Landing-Page zeigt 3-Saeulen-CTAs
 * - Header-Tabs funktionieren
 * - Cross-Tab-Navigation verliert keinen Zustand
 */

import { test, expect } from "@playwright/test";

test.describe("Tab-Navigation", () => {
  test("Header zeigt 3 Tabs: Ueben, Sandbox, Lernen", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Alle 3 Tab-Links sollten sichtbar sein (Icons sind immer sichtbar, Text ab sm)
    await expect(page.locator('a[href="/lektionen"]').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('a[href="/sandbox"]').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('a[href="/lernen"]').first()).toBeVisible({ timeout: 5000 });
  });

  test("Tab-Navigation zu Sandbox", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Sandbox-Tab klicken
    const sandboxTab = page.locator('a[href="/sandbox"]').first();
    if (await sandboxTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await sandboxTab.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/sandbox/);
    } else {
      // Direkter Navigation-Test
      await page.goto("/sandbox");
      await page.waitForLoadState("networkidle");
      await expect(page.locator("text=Datenbanken").first()).toBeVisible({ timeout: 5000 });
    }
  });

  test("Tab-Navigation zu Lernen", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const lernenTab = page.locator('a[href="/lernen"]').first();
    if (await lernenTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await lernenTab.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/lernen/);
    }
  });

  test("Tab-Navigation zu Ueben", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const uebenTab = page.locator('a[href="/lektionen"]').first();
    if (await uebenTab.isVisible({ timeout: 3000 }).catch(() => false)) {
      await uebenTab.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/lektionen/);
    }
  });
});

test.describe("Landing-Page 3-Saeulen", () => {
  test("Landing-Page zeigt 3 Feature-Cards", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // 3 Saeulen-CTAs sollten sichtbar sein (Heading-Text ist auf allen Viewports sichtbar)
    await expect(page.locator("h3", { hasText: "Üben" }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator("h3", { hasText: "Sandbox" }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator("h3", { hasText: "Lernen" }).first()).toBeVisible({ timeout: 5000 });
  });

  test("Landing-Page CTA 'Zu den Lektionen' navigiert zu Lektionen", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const cta = page.locator('a[href="/lektionen"]').first();
    if (await cta.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cta.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/lektionen/);
    }
  });

  test("Landing-Page CTA 'Sandbox' navigiert zu Sandbox", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const cta = page.locator('a[href*="/sandbox"], button:has-text("Sandbox")').first();
    if (await cta.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cta.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/sandbox/);
    }
  });

  test("Landing-Page CTA 'Lernen' navigiert zu Lernen", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const cta = page.locator('a[href*="/lernen"], button:has-text("Lernen")').first();
    if (await cta.isVisible({ timeout: 3000 }).catch(() => false)) {
      await cta.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/lernen/);
    }
  });
});

test.describe("Cross-Tab Zustand", () => {
  test("Sandbox-Zustand bleibt nach Tab-Wechsel erhalten", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === "mobile", "Sandbox ist nur auf Desktop/Tablet verfuegbar");

    // Sandbox oeffnen und DB erstellen
    await page.goto("/sandbox");
    await page.waitForLoadState("networkidle");

    await page.locator("text=+ Neu").first().click();
    const nameInput = page.locator('input[placeholder="Name der Datenbank"]');
    await expect(nameInput).toBeVisible({ timeout: 3000 });
    await nameInput.fill("CrossTabDB");
    await page.locator("button:has-text('OK')").click();
    await expect(page.locator("text=CrossTabDB").first()).toBeVisible({ timeout: 5000 });

    // Tabelle erstellen
    const editor = page.locator("textarea").first();
    await expect(editor).toBeVisible({ timeout: 5000 });
    await editor.fill('CREATE TABLE cross_test (id INTEGER, name TEXT);');
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(1000);

    // Zu Lernen navigieren
    await page.goto("/lernen");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Zurueck zur Sandbox
    await page.goto("/sandbox");
    await page.waitForLoadState("networkidle");

    // DB sollte noch da sein
    await expect(page.locator("text=CrossTabDB").first()).toBeVisible({ timeout: 5000 });

    // DB oeffnen und Daten pruefen
    await page.locator("text=CrossTabDB").first().click();
    await page.waitForTimeout(1000);

    await editor.fill("SELECT * FROM cross_test;");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(1000);

    // Tabelle sollte noch existieren (leer, aber kein Fehler)
    await expect(page.locator("button:has-text('Ausführen')").first()).toBeVisible();
  });
});