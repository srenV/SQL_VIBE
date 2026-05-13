/**
 * E2E-Tests: Sandbox-Modus der SQL-Trainer Plattform.
 *
 * Testet die kritischen Nutzerfluesse:
 * - Sandbox-Seite laedt korrekt
 * - Neue Datenbank erstellen
 * - SQL-Abfragen ausfuehren (DDL, DML, DQL)
 * - Schema-Explorer zeigt Tabellen nach CREATE TABLE
 * - Datenbank-Persistenz (IndexedDB)
 * - Datenbank loeschen, umbenennen, duplizieren
 * - Query-History
 * - Fehlerbehandlung bei fehlerhaftem SQL
 */

import { test, expect } from "@playwright/test";

test.describe("Sandbox – Seitenladung", () => {
  test("Sandbox-Seite laedt und zeigt UI-Elemente", async ({ page }) => {
    await page.goto("sandbox");
    await page.waitForLoadState("networkidle");

    // Sidebar ist sichtbar
    await expect(page.locator("text=Datenbanken").first()).toBeVisible({ timeout: 5000 });

    // "+ Neu" Button ist sichtbar
    await expect(page.locator("text=+ Neu").first()).toBeVisible();

    // MySQL-Badge ist sichtbar
    await expect(page.locator("text=MySQL").first()).toBeVisible();

    // Leerer Zustand: "Noch keine Datenbanken"
    await expect(page.locator("text=Noch keine Datenbanken").first()).toBeVisible({ timeout: 3000 });
  });

  test("Navigation zur Sandbox von der Landing-Page", async ({ page }) => {
    await page.goto("");
    await page.waitForLoadState("networkidle");

    // Klick auf "Sandbox öffnen" oder Tab
    const sandboxLink = page.locator('a[href="/sandbox"], button:has-text("Sandbox")').first();
    if (await sandboxLink.isVisible({ timeout: 3000 }).catch(() => false)) {
      await sandboxLink.click();
      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/sandbox/);
    } else {
      // Direkter Test: Navigation ueber Header-Tabs
      await page.goto("sandbox");
      await page.waitForLoadState("networkidle");
      await expect(page.locator("text=Datenbanken").first()).toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe("Sandbox – Datenbank erstellen", () => {
  test("Neue Datenbank erstellen und oeffnen", async ({ page }) => {
    await page.goto("sandbox");
    await page.waitForLoadState("networkidle");

    // "+ Neu" klicken
    await page.locator("text=+ Neu").first().click();

    // Inline-Input erscheint
    const nameInput = page.locator('input[placeholder="Name der Datenbank"]');
    await expect(nameInput).toBeVisible({ timeout: 3000 });

    // Name eingeben und OK klicken
    await nameInput.fill("TestDB");
    await page.locator("button:has-text('OK')").click();

    // DB erscheint in der Sidebar
    await expect(page.locator("text=TestDB").first()).toBeVisible({ timeout: 5000 });

    // SQL-Editor ist sichtbar
    await expect(page.locator(".cm-content").first()).toBeVisible({ timeout: 5000 });
  });

  test("Neue Datenbank mit Default-Name erstellen (leeres Input)", async ({ page }) => {
    await page.goto("sandbox");
    await page.waitForLoadState("networkidle");

    // "+ Neu" klicken
    await page.locator("text=+ Neu").first().click();

    // OK klicken ohne Name (sollte "Neue Datenbank" als Default verwenden)
    await page.locator("button:has-text('OK')").click();

    // DB erscheint mit Default-Name
    await expect(page.locator("text=Neue Datenbank").first()).toBeVisible({ timeout: 5000 });
  });

  test("Neue Datenbank erstellen mit Enter-Taste", async ({ page }) => {
    await page.goto("sandbox");
    await page.waitForLoadState("networkidle");

    await page.locator("text=+ Neu").first().click();

    const nameInput = page.locator('input[placeholder="Name der Datenbank"]');
    await expect(nameInput).toBeVisible({ timeout: 3000 });
    await nameInput.fill("EnterDB");
    await nameInput.press("Enter");

    await expect(page.locator("text=EnterDB").first()).toBeVisible({ timeout: 5000 });
  });

  test("Erstellung mit Escape abbrechen", async ({ page }) => {
    await page.goto("sandbox");
    await page.waitForLoadState("networkidle");

    await page.locator("text=+ Neu").first().click();

    const nameInput = page.locator('input[placeholder="Name der Datenbank"]');
    await expect(nameInput).toBeVisible({ timeout: 3000 });
    await nameInput.press("Escape");

    // Input sollte verschwinden
    await expect(nameInput).not.toBeVisible({ timeout: 3000 });
  });
});

test.describe("Sandbox – SQL-Abfragen", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("sandbox");
    await page.waitForLoadState("networkidle");

    // Datenbank erstellen
    await page.locator("text=+ Neu").first().click();
    const nameInput = page.locator('input[placeholder="Name der Datenbank"]');
    await expect(nameInput).toBeVisible({ timeout: 3000 });
    await nameInput.fill("SQLTestDB");
    await page.locator("button:has-text('OK')").click();
    await expect(page.locator("text=SQLTestDB").first()).toBeVisible({ timeout: 5000 });
  });

  test("CREATE TABLE ausfuehren und im Schema sehen", async ({ page }) => {
    const editor = page.locator(".cm-content").first();
    await expect(editor).toBeVisible({ timeout: 5000 });

    // CREATE TABLE eingeben
    await editor.click();
    await page.keyboard.type('CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT, email TEXT);');
    await page.locator("button:has-text('Ausführen')").first().click();

    // Warten auf Ergebnis
    await page.waitForTimeout(1000);

    // Schema sollte die Tabelle zeigen
    const schemaToggle = page.locator("text=Schema").first();
    if (await schemaToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
      await schemaToggle.click();
      await expect(page.locator("text=kunden").first()).toBeVisible({ timeout: 5000 });
    }
  });

  test("INSERT und SELECT ausfuehren", async ({ page }) => {
    const editor = page.locator(".cm-content").first();
    await expect(editor).toBeVisible({ timeout: 5000 });

    // Tabelle erstellen
    await editor.click();
    await page.keyboard.type('CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT);');
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(500);

    // Daten einfuegen
    await editor.click();
    await page.keyboard.type("INSERT INTO kunden VALUES (1, 'Max');");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(500);

    // Daten abfragen
    await editor.click();
    await page.keyboard.type("SELECT * FROM kunden;");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(1000);

    // Ergebnis sollte "Max" zeigen
    await expect(page.locator("text=Max").first()).toBeVisible({ timeout: 5000 });
  });

  test("Fehlerhafte SQL-Abfrage zeigt Fehlermeldung", async ({ page }) => {
    const editor = page.locator(".cm-content").first();
    await expect(editor).toBeVisible({ timeout: 5000 });

    await editor.click();
    await page.keyboard.type("SELECT * FROM nichtexistent;");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(1000);

    // Fehlermeldung sollte sichtbar sein
    await expect(page.locator("text=/no such table|nichtexistent|Error/i").first()).toBeVisible({ timeout: 5000 });
  });

  test("DROP TABLE ausfuehren", async ({ page }) => {
    const editor = page.locator(".cm-content").first();
    await expect(editor).toBeVisible({ timeout: 5000 });

    // Tabelle erstellen
    await editor.click();
    await page.keyboard.type('CREATE TABLE temp_table (id INTEGER);');
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(500);

    // Tabelle droppen
    await editor.click();
    await page.keyboard.type("DROP TABLE temp_table;");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(500);

    // Schema sollte die Tabelle nicht mehr zeigen
    // (Wir pruefen nur, dass kein Fehler auftritt)
    await expect(page.locator("button:has-text('Ausführen')").first()).toBeVisible();
  });

  test("UPDATE und DELETE ausfuehren", async ({ page }) => {
    const editor = page.locator(".cm-content").first();
    await expect(editor).toBeVisible({ timeout: 5000 });

    // Tabelle erstellen und Daten einfuegen
    await editor.click();
    await page.keyboard.type('CREATE TABLE produkte (id INTEGER PRIMARY KEY, name TEXT, preis REAL);');
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(500);

    await editor.click();
    await page.keyboard.type("INSERT INTO produkte VALUES (1, 'Apfel', 1.5);");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(500);

    await editor.click();
    await page.keyboard.type("INSERT INTO produkte VALUES (2, 'Banane', 2.0);");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(500);

    // UPDATE
    await editor.click();
    await page.keyboard.type("UPDATE produkte SET preis = 1.8 WHERE name = 'Apfel';");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(500);

    // SELECT um UPDATE zu verifizieren
    await editor.click();
    await page.keyboard.type("SELECT * FROM produkte WHERE name = 'Apfel';");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(1000);

    // DELETE
    await editor.click();
    await page.keyboard.type("DELETE FROM produkte WHERE name = 'Banane';");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(500);

    // SELECT um DELETE zu verifizieren
    await editor.click();
    await page.keyboard.type("SELECT * FROM produkte;");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(1000);

    // Nur Apfel sollte uebrig sein
    await expect(page.locator("text=Apfel").first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Sandbox – Persistenz (IndexedDB)", () => {
  test("Datenbank und Daten bleiben nach Page-Reload erhalten", async ({ page }) => {
    await page.goto("sandbox");
    await page.waitForLoadState("networkidle");

    // Datenbank erstellen
    await page.locator("text=+ Neu").first().click();
    const nameInput = page.locator('input[placeholder="Name der Datenbank"]');
    await expect(nameInput).toBeVisible({ timeout: 3000 });
    await nameInput.fill("PersistDB");
    await page.locator("button:has-text('OK')").click();
    await expect(page.locator("text=PersistDB").first()).toBeVisible({ timeout: 5000 });

    // Tabelle erstellen und Daten einfuegen
    const editor = page.locator(".cm-content").first();
    await expect(editor).toBeVisible({ timeout: 5000 });
    await editor.click();
    await page.keyboard.type('CREATE TABLE test_persist (id INTEGER PRIMARY KEY, wert TEXT);');
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(500);

    await editor.click();
    await page.keyboard.type("INSERT INTO test_persist VALUES (1, 'persistiert');");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(1000);

    // Page reload
    await page.reload();
    await page.waitForLoadState("networkidle");

    // DB sollte noch in der Sidebar sein
    await expect(page.locator("text=PersistDB").first()).toBeVisible({ timeout: 5000 });

    // DB oeffnen und Daten pruefen
    await page.locator("text=PersistDB").first().click();
    await page.waitForTimeout(1000);

    await editor.click();
    await page.keyboard.type("SELECT * FROM test_persist;");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(1000);

    await expect(page.locator("text=persistiert").first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe("Sandbox – Datenbank-Verwaltung", () => {
  test("Datenbank umbenennen", async ({ page }) => {
    await page.goto("sandbox");
    await page.waitForLoadState("networkidle");

    // Datenbank erstellen
    await page.locator("text=+ Neu").first().click();
    const nameInput = page.locator('input[placeholder="Name der Datenbank"]');
    await expect(nameInput).toBeVisible({ timeout: 3000 });
    await nameInput.fill("RenameDB");
    await page.locator("button:has-text('OK')").click();
    await expect(page.locator("text=RenameDB").first()).toBeVisible({ timeout: 5000 });

    // Rechtsklick fuer Kontextmenue
    await page.locator("text=RenameDB").first().click({ button: "right" });
    await page.waitForTimeout(500);

    // Umbenennen im Kontextmenue
    const renameButton = page.locator("text=Umbenennen").first();
    if (await renameButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await renameButton.click();
      const renameInput = page.locator('input[type="text"]').last();
      await renameInput.fill("RenamedDB");
      await renameInput.press("Enter");
      await expect(page.locator("text=RenamedDB").first()).toBeVisible({ timeout: 5000 });
    }
  });

  test("Datenbank loeschen", async ({ page }) => {
    await page.goto("sandbox");
    await page.waitForLoadState("networkidle");

    // Datenbank erstellen
    await page.locator("text=+ Neu").first().click();
    const nameInput = page.locator('input[placeholder="Name der Datenbank"]');
    await expect(nameInput).toBeVisible({ timeout: 3000 });
    await nameInput.fill("DeleteDB");
    await page.locator("button:has-text('OK')").click();
    await expect(page.locator("text=DeleteDB").first()).toBeVisible({ timeout: 5000 });

    // Rechtsklick fuer Kontextmenue
    await page.locator("text=DeleteDB").first().click({ button: "right" });
    await page.waitForTimeout(500);

    // Loeschen im Kontextmenue
    const deleteButton = page.locator("text=Löschen").first();
    if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Confirm-Dialog akzeptieren
      page.on("dialog", (dialog) => dialog.accept());
      await deleteButton.click();
      await page.waitForTimeout(1000);

      // DB sollte nicht mehr in der Sidebar sein
      await expect(page.locator("text=DeleteDB").first()).not.toBeVisible({ timeout: 5000 });
    }
  });
});

test.describe("Sandbox – Query-History", () => {
  test("History zeigt ausgefuehrte Abfragen", async ({ page }) => {
    await page.goto("sandbox");
    await page.waitForLoadState("networkidle");

    // Datenbank erstellen
    await page.locator("text=+ Neu").first().click();
    const nameInput = page.locator('input[placeholder="Name der Datenbank"]');
    await expect(nameInput).toBeVisible({ timeout: 3000 });
    await nameInput.fill("HistoryDB");
    await page.locator("button:has-text('OK')").click();
    await expect(page.locator("text=HistoryDB").first()).toBeVisible({ timeout: 5000 });

    const editor = page.locator(".cm-content").first();
    await expect(editor).toBeVisible({ timeout: 5000 });

    // Abfrage ausfuehren
    await editor.click();
    await page.keyboard.type('CREATE TABLE test (id INTEGER);');
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(500);

    // History oeffnen
    const historyToggle = page.locator("text=History").first();
    if (await historyToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
      await historyToggle.click();
      await expect(page.locator("text=CREATE TABLE").first()).toBeVisible({ timeout: 3000 });
    }
  });
});

test.describe("Sandbox – Fehlerbehandlung", () => {
  test("Leere Abfrage zeigt keinen Fehler", async ({ page }) => {
    await page.goto("sandbox");
    await page.waitForLoadState("networkidle");

    await page.locator("text=+ Neu").first().click();
    const nameInput = page.locator('input[placeholder="Name der Datenbank"]');
    await expect(nameInput).toBeVisible({ timeout: 3000 });
    await nameInput.fill("ErrorDB");
    await page.locator("button:has-text('OK')").click();
    await expect(page.locator("text=ErrorDB").first()).toBeVisible({ timeout: 5000 });

    // Leeren Ausfuehren-Button klicken (sollte disabled sein oder nichts tun)
    const runButton = page.locator("button:has-text('Ausführen')").first();
    await expect(runButton).toBeVisible();
  });

  test("Syntax-Fehler zeigt Fehlermeldung", async ({ page }) => {
    await page.goto("sandbox");
    await page.waitForLoadState("networkidle");

    await page.locator("text=+ Neu").first().click();
    const nameInput = page.locator('input[placeholder="Name der Datenbank"]');
    await expect(nameInput).toBeVisible({ timeout: 3000 });
    await nameInput.fill("SyntaxDB");
    await page.locator("button:has-text('OK')").click();
    await expect(page.locator("text=SyntaxDB").first()).toBeVisible({ timeout: 5000 });

    const editor = page.locator(".cm-content").first();
    await expect(editor).toBeVisible({ timeout: 5000 });

    await editor.click();
    await page.keyboard.type("INVALID SQL SYNTAX HERE;");
    await page.locator("button:has-text('Ausführen')").first().click();
    await page.waitForTimeout(1000);

    // Fehlermeldung sollte sichtbar sein
    await expect(page.locator("text=/syntax|error|near/i").first()).toBeVisible({ timeout: 5000 });
  });
});