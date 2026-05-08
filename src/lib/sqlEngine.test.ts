/**
 * Unit-Tests fuer den sqlEngine.
 *
 * Testet die MySQL-Kompatibilitäts-Transformationen
 * (ehemals transformRightJoin, jetzt via mysqlToSqlite).
 *
 * sql.js wird im Browser geladen; fuer Unit-Tests mocken wir das Modul.
 */

import { describe, it, expect, vi } from "vitest";
import { mysqlToSqlite } from "./mysqlCompat";
import { splitSqlStatements } from "./sqlEngine";

describe("RIGHT JOIN Transformation (via mysqlToSqlite)", () => {
  it("wandelt einen einfachen RIGHT JOIN mit Alias in LEFT JOIN um", () => {
    const sql = "SELECT * FROM kunden k RIGHT JOIN bestellungen b ON k.id = b.kunden_id";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("LEFT JOIN");
    expect(result).toContain("bestellungen b LEFT JOIN kunden k ON k.id = b.kunden_id");
    expect(result).not.toContain("RIGHT JOIN");
  });

  it("wandelt RIGHT JOIN ohne Aliase um", () => {
    const sql = "SELECT * FROM kunden RIGHT JOIN bestellungen ON kunden.id = bestellungen.kunden_id";
    const result = mysqlToSqlite(sql);
    expect(result).toContain("LEFT JOIN");
    expect(result).toContain("bestellungen");
    expect(result).toContain("kunden");
    expect(result).not.toContain("RIGHT JOIN");
  });

  it("laesst normale LEFT JOINs unberuehrt", () => {
    const sql = "SELECT * FROM kunden LEFT JOIN bestellungen ON kunden.id = bestellungen.kunden_id";
    const result = mysqlToSqlite(sql);
    expect(result).toBe(sql);
  });

  it("laesst Queries ohne JOIN unberuehrt", () => {
    const sql = "SELECT * FROM kunden WHERE id > 5";
    const result = mysqlToSqlite(sql);
    expect(result).toBe(sql);
  });

  it("behandelt case-insensitive RIGHT JOIN", () => {
    const sql = "SELECT * FROM a right join b on a.id = b.id";
    const result = mysqlToSqlite(sql);
    expect(result).not.toContain("right join");
    expect(result).toContain("LEFT JOIN");
  });

  it("behandelt mehrere RIGHT JOINs in einer Query", () => {
    const sql = "SELECT * FROM a RIGHT JOIN b ON a.id = b.id RIGHT JOIN c ON b.id = c.id";
    const result = mysqlToSqlite(sql);
    expect(result).not.toContain("RIGHT");
  });
});

describe("splitSqlStatements", () => {
  it("splittet einfache Statements an Semikolons", () => {
    const sql = "SELECT 1; SELECT 2;";
    const stmts = splitSqlStatements(sql);
    expect(stmts).toEqual(["SELECT 1", "SELECT 2"]);
  });

  it("ignoriert Semikolons in String-Literalen", () => {
    const sql = "INSERT INTO t VALUES ('a;b'); SELECT 1;";
    const stmts = splitSqlStatements(sql);
    expect(stmts).toEqual(["INSERT INTO t VALUES ('a;b')", "SELECT 1"]);
  });

  it("splittet nicht innerhalb von Kommentaren mit Semikolons", () => {
    // Kommentare die durch mysqlToSqlite erzeugt werden, dürfen keine Semikolons enthalten
    const comment = "-- MySQL: DROP DATABASE Kuechenstudio (SQLite: automatisch ignoriert)";
    const stmts = splitSqlStatements(comment);
    expect(stmts).toHaveLength(1);
    expect(stmts[0]).toContain("automatisch ignoriert");
  });

  it("verarbeitet Küchen-Skript-Header korrekt (DROP+CREATE+USE)", () => {
    const header = [
      "DROP DATABASE IF EXISTS Kuechenstudio;",
      "CREATE DATABASE Kuechenstudio;",
      "USE Kuechenstudio;",
    ].join("\n");

    const sqliteSql = mysqlToSqlite(header);
    const stmts = splitSqlStatements(sqliteSql);

    // Alle Statements sollten Kommentare sein (die Semikolons wurden aus den Kommentaren entfernt,
    // also werden die Kommentar-Zeilen als ein Statement zusammengefasst)
    for (const stmt of stmts) {
      const trimmed = stmt.trim();
      expect(trimmed.startsWith("--")).toBe(true);
    }

    // Die Kommentare enthalten keine ausführbaren SQL-Befehle
    expect(stmts.join("\n")).toContain("DROP DATABASE");
    expect(stmts.join("\n")).toContain("CREATE DATABASE");
    expect(stmts.join("\n")).toContain("USE");
    expect(stmts.join("\n")).toContain("automatisch ignoriert");
  });

  it("splittet CREATE TABLE + INSERT korrekt", () => {
    const sql = [
      "CREATE TABLE kunden (id INTEGER PRIMARY KEY, name TEXT);",
      "INSERT INTO kunden VALUES (1, 'Max');",
    ].join("\n");

    const stmts = splitSqlStatements(sql);
    expect(stmts).toHaveLength(2);
    expect(stmts[0]).toContain("CREATE TABLE");
    expect(stmts[1]).toContain("INSERT INTO");
  });

  it("überspringt leere Statements", () => {
    const sql = "SELECT 1;; SELECT 2;;";
    const stmts = splitSqlStatements(sql);
    expect(stmts).toEqual(["SELECT 1", "SELECT 2"]);
  });

  it("splittet mehrzeilige CREATE TABLE korrekt", () => {
    const sql = `CREATE TABLE Personal
(
  PersonalNr INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  Name TEXT,
  Vorname TEXT
);

INSERT INTO Personal(Name, Vorname) VALUES ('Test', 'User');`;

    const stmts = splitSqlStatements(sql);
    expect(stmts).toHaveLength(2);
    expect(stmts[0]).toContain("CREATE TABLE");
    expect(stmts[0]).toContain("PersonalNr");
    expect(stmts[1]).toContain("INSERT INTO");
  });

  it("splittet komplettes Küchen-Skript korrekt (Integration)", () => {
    const kuechenScript = `DROP DATABASE IF EXISTS Kuechenstudio;
CREATE DATABASE Kuechenstudio;
USE Kuechenstudio;

CREATE TABLE Personal
(
  PersonalNr SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(60),
  Vorname VARCHAR(60),
  Provision SMALLINT UNSIGNED
);

INSERT INTO personal(Name, Vorname, Provision) VALUES ('Albrecht','Theo','25');

CREATE TABLE Kueche
(
  KuechenID TINYINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  Preis DECIMAL(9,2) NOT NULL,
  PersonalNr SMALLINT UNSIGNED NOT NULL,
  FOREIGN KEY (PersonalNr) REFERENCES Personal(PersonalNr)
);

ALTER TABLE personal ADD COLUMN Arbeitsbeginn DATE;
ALTER TABLE kategorie CHANGE COLUMN Provision BonusProvision TINYINT;
ALTER TABLE hersteller MODIFY COLUMN Name VARCHAR(50) NOT NULL;`;

    // Pipeline: split → transform each (wie in createDatabase/runQuery)
    const rawStmts = splitSqlStatements(kuechenScript);
    const transformedStmts = rawStmts.map(s => mysqlToSqlite(s.trim()));

    // DROP/CREATE/USE → Kommentare
    const dbComments = transformedStmts.filter(s => s.trim().startsWith("--"));
    expect(dbComments.length).toBeGreaterThanOrEqual(3);

    // UNSIGNED entfernt in CREATE TABLE
    const createTableStmts = transformedStmts.filter(s => s.includes("CREATE TABLE"));
    for (const stmt of createTableStmts) {
      expect(stmt).not.toContain("UNSIGNED");
    }

    // AUTO_INCREMENT → AUTOINCREMENT
    const personalStmt = transformedStmts.find(s => s.includes("PersonalNr"));
    expect(personalStmt).toBeDefined();
    expect(personalStmt!).toContain("AUTOINCREMENT");

    // TINYINT → INTEGER, SMALLINT → INTEGER
    for (const stmt of createTableStmts) {
      expect(stmt).not.toContain("TINYINT");
      expect(stmt).not.toContain("SMALLINT");
    }

    // DECIMAL → REAL
    const kuecheStmt = transformedStmts.find(s => s.includes("Preis"));
    expect(kuecheStmt).toBeDefined();
    expect(kuecheStmt!).not.toContain("DECIMAL");

    // ALTER TABLE CHANGE COLUMN → RENAME COLUMN
    const renameStmt = transformedStmts.find(s => s.includes("RENAME COLUMN"));
    expect(renameStmt).toBeDefined();

    // ALTER TABLE MODIFY COLUMN → Kommentar
    const modifyStmt = transformedStmts.find(s => s.includes("nicht unterstützt"));
    expect(modifyStmt).toBeDefined();

    // Kommentare dürfen keine Semikolons enthalten
    for (const comment of dbComments) {
      expect(comment).not.toMatch(/;\s*\w/);
    }
  });

  it("Pipeline: split-first-then-transform erhält CREATE TABLE Transformationen", () => {
    // WICHTIG: Dieser Test verifiziert, dass die Pipeline (split → transform each)
    // korrekt funktioniert. Wenn man den gesamten Skript zuerst transformiert,
    // werden CREATE TABLE Transformationen nicht angewendet, weil der Skript
    // nicht mit CREATE TABLE beginnt.
    const script = `DROP DATABASE IF EXISTS test;
CREATE TABLE users (id TINYINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, name VARCHAR(60));
INSERT INTO users(name) VALUES ('Max');`;

    // Falsche Pipeline (transform-then-split): AUTO_INCREMENT wird NICHT transformiert
    const wrongTransformed = mysqlToSqlite(script);
    const wrongStmts = splitSqlStatements(wrongTransformed);
    const createTableWrong = wrongStmts.find(s => s.includes("CREATE TABLE"));
    // Das CREATE TABLE beginnt nicht am Zeilenanfang, also wird transformCreateTable nicht angewendet
    // (Dieser Test zeigt, warum die split-first Pipeline wichtig ist)

    // Korrekte Pipeline (split-first-then-transform)
    const rawStmts = splitSqlStatements(script);
    const transformedStmts = rawStmts.map(s => mysqlToSqlite(s.trim()));

    const createTableCorrect = transformedStmts.find(s => s.includes("CREATE TABLE"));
    expect(createTableCorrect).toBeDefined();
    expect(createTableCorrect!).toContain("AUTOINCREMENT");
    expect(createTableCorrect!).not.toContain("AUTO_INCREMENT");
    expect(createTableCorrect!).not.toContain("UNSIGNED");
    expect(createTableCorrect!).not.toContain("TINYINT");
  });

  it("Pipeline: Foreign KEY (Großbuchstabe F) wird beibehalten", () => {
    const sql = `CREATE TABLE KueMoe
(
  MoebelID SMALLINT UNSIGNED,
  KuechenID TINYINT UNSIGNED,
  Anzahl TINYINT UNSIGNED,
  PRIMARY KEY (MoebelID,KuechenID),
  FOREIGN KEY (MoebelID) REFERENCES Moebel(MoebelID),
  Foreign KEY (KuechenID) REFERENCES Kueche(KuechenID)
);`;

    const rawStmts = splitSqlStatements(sql);
    const transformedStmts = rawStmts.map(s => mysqlToSqlite(s.trim()));

    const kueMoeStmt = transformedStmts.find(s => s.includes("KueMoe") || s.includes("MoebelID"));
    expect(kueMoeStmt).toBeDefined();
    // Foreign KEY (capital F) sollte erhalten bleiben — SQLite ist case-insensitive
    expect(kueMoeStmt!).toContain("Foreign KEY");
    expect(kueMoeStmt!).toContain("FOREIGN KEY");
    // UNSIGNED und TINYINT/SMALLINT sollten transformiert sein
    expect(kueMoeStmt!).not.toContain("UNSIGNED");
    expect(kueMoeStmt!).not.toContain("TINYINT");
    expect(kueMoeStmt!).not.toContain("SMALLINT");
  });
});