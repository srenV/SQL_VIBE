/**
 * Tests für den MySQL-Kompatibilitäts-Layer.
 *
 * Verifiziert, dass MySQL-Syntax korrekt zu SQLite übersetzt wird,
 * SQLite-Fehler zu MySQL-Fehlern gemappt werden und
 * Typ-Mapping funktioniert.
 */

import { describe, it, expect } from "vitest";
import {
  mysqlToSqlite,
  mapSqliteErrorToMysql,
  mapSqliteTypeToMysql,
  getMysqlCompatWarnings,
  extractDatabaseName,
} from "./mysqlCompat";
import { splitSqlStatements } from "./sqlEngine";

describe("mysqlToSqlite", () => {
  // ─── RIGHT JOIN ──────────────────────────────────────────────────────
  it("transformiert RIGHT JOIN zu LEFT JOIN mit vertauschten Tabellen", () => {
    expect(mysqlToSqlite("SELECT * FROM a RIGHT JOIN b ON a.id = b.a_id"))
      .toBe("SELECT * FROM b LEFT JOIN a ON a.id = b.a_id");
  });

  it("transformiert RIGHT JOIN mit Alias", () => {
    expect(mysqlToSqlite("SELECT * FROM kunden k RIGHT JOIN bestellungen b ON k.id = b.kunde_id"))
      .toBe("SELECT * FROM bestellungen b LEFT JOIN kunden k ON k.id = b.kunde_id");
  });

  it("transformiert RIGHT JOIN mit AS-Alias", () => {
    // AS wird von der Regex entfernt, aber das Ergebnis ist semantisch identisch
    expect(mysqlToSqlite("SELECT * FROM kunden AS k RIGHT JOIN bestellungen AS b ON k.id = b.kunde_id"))
      .toBe("SELECT * FROM bestellungen b LEFT JOIN kunden k ON k.id = b.kunde_id");
  });

  // ─── TRUNCATE ────────────────────────────────────────────────────────
  it("transformiert TRUNCATE TABLE zu DELETE FROM", () => {
    expect(mysqlToSqlite("TRUNCATE TABLE kunden")).toBe("DELETE FROM kunden");
  });

  // ─── SHOW TABLES ─────────────────────────────────────────────────────
  it("transformiert SHOW TABLES", () => {
    const result = mysqlToSqlite("SHOW TABLES");
    expect(result).toContain("sqlite_master");
    expect(result).toContain("type = 'table'");
  });

  it("transformiert DESCRIBE", () => {
    const result = mysqlToSqlite("DESCRIBE kunden");
    expect(result).toContain("PRAGMA table_info");
    expect(result).toContain("kunden");
  });

  it("transformiert SHOW COLUMNS FROM", () => {
    const result = mysqlToSqlite("SHOW COLUMNS FROM kunden");
    expect(result).toContain("PRAGMA table_info");
  });

  it("transformiert SHOW CREATE TABLE", () => {
    const result = mysqlToSqlite("SHOW CREATE TABLE kunden");
    expect(result).toContain("sqlite_master");
    expect(result).toContain("kunden");
  });

  // ─── LIMIT x, y ─────────────────────────────────────────────────────
  it("transformiert LIMIT offset, count zu LIMIT count OFFSET offset", () => {
    expect(mysqlToSqlite("SELECT * FROM kunden LIMIT 10, 20"))
      .toBe("SELECT * FROM kunden LIMIT 20 OFFSET 10");
  });

  it("lässt LIMIT n unverändert", () => {
    expect(mysqlToSqlite("SELECT * FROM kunden LIMIT 10"))
      .toBe("SELECT * FROM kunden LIMIT 10");
  });

  // ─── Funktionen ──────────────────────────────────────────────────────
  it("transformiert IF() zu CASE WHEN", () => {
    expect(mysqlToSqlite("SELECT IF(age > 18, 'adult', 'minor') FROM users"))
      .toBe("SELECT CASE WHEN age > 18 THEN 'adult' ELSE 'minor' END FROM users");
  });

  it("transformiert CONCAT() zu ||", () => {
    expect(mysqlToSqlite("SELECT CONCAT(vorname, ' ', nachname) FROM kunden"))
      .toBe("SELECT vorname || ' ' || nachname FROM kunden");
  });

  it("transformiert NOW() zu DATETIME('now')", () => {
    expect(mysqlToSqlite("SELECT NOW()")).toBe("SELECT DATETIME('now')");
  });

  it("transformiert CURDATE() zu DATE('now')", () => {
    expect(mysqlToSqlite("SELECT CURDATE()")).toBe("SELECT DATE('now')");
  });

  it("transformiert YEAR() zu strftime", () => {
    const result = mysqlToSqlite("SELECT YEAR(datum) FROM kunden");
    expect(result).toContain("strftime('%Y'");
    expect(result).toContain("CAST");
  });

  it("transformiert MONTH() zu strftime", () => {
    const result = mysqlToSqlite("SELECT MONTH(datum) FROM kunden");
    expect(result).toContain("strftime('%m'");
  });

  it("transformiert DAY() zu strftime", () => {
    const result = mysqlToSqlite("SELECT DAY(datum) FROM kunden");
    expect(result).toContain("strftime('%d'");
  });

  it("transformiert DATEDIFF() zu julianday", () => {
    const result = mysqlToSqlite("SELECT DATEDIFF('2024-12-31', '2024-01-01')");
    expect(result).toContain("julianday");
    expect(result).toContain("CAST");
  });

  it("transformiert SUBSTRING zu SUBSTR", () => {
    expect(mysqlToSqlite("SELECT SUBSTRING(name, 1, 3) FROM kunden"))
      .toBe("SELECT SUBSTR(name, 1, 3) FROM kunden");
  });

  it("transformiert ISNULL() zu IFNULL()", () => {
    expect(mysqlToSqlite("SELECT ISNULL(name) FROM kunden"))
      .toBe("SELECT IFNULL(name) FROM kunden");
  });

  // ─── CREATE TABLE ────────────────────────────────────────────────────
  it("transformiert AUTO_INCREMENT zu AUTOINCREMENT in CREATE TABLE", () => {
    const result = mysqlToSqlite("CREATE TABLE test (id INTEGER PRIMARY KEY AUTO_INCREMENT)");
    expect(result).toContain("AUTOINCREMENT");
    expect(result).not.toContain("AUTO_INCREMENT");
  });

  it("transformiert BOOLEAN zu INTEGER in CREATE TABLE", () => {
    const result = mysqlToSqlite("CREATE TABLE test (aktiv BOOLEAN NOT NULL)");
    expect(result).toContain("INTEGER");
    expect(result).not.toContain("BOOLEAN");
  });

  it("transformiert DATETIME zu TEXT in CREATE TABLE", () => {
    const result = mysqlToSqlite("CREATE TABLE test (erstellt_am DATETIME NOT NULL)");
    expect(result).toContain("TEXT");
    expect(result).not.toContain("DATETIME");
  });

  it("transformiert TINYINT zu INTEGER in CREATE TABLE", () => {
    const result = mysqlToSqlite("CREATE TABLE test (status TINYINT(1))");
    expect(result).toContain("INTEGER");
    expect(result).not.toContain("TINYINT");
  });

  it("transformiert DOUBLE zu REAL in CREATE TABLE", () => {
    const result = mysqlToSqlite("CREATE TABLE test (preis DOUBLE)");
    expect(result).toContain("REAL");
    expect(result).not.toContain("DOUBLE");
  });

  it("transformiert DECIMAL(n,m) zu REAL in CREATE TABLE", () => {
    const result = mysqlToSqlite("CREATE TABLE test (betrag DECIMAL(10,2))");
    expect(result).toContain("REAL");
    expect(result).not.toContain("DECIMAL");
  });

  it("entfernt ON UPDATE CURRENT_TIMESTAMP", () => {
    const result = mysqlToSqlite("CREATE TABLE test (ts TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
    expect(result).not.toContain("ON UPDATE CURRENT_TIMESTAMP");
  });

  // ─── Backticks ───────────────────────────────────────────────────────
  it("transformiert Backtick-Quotes zu Double-Quotes", () => {
    expect(mysqlToSqlite("SELECT `name` FROM `kunden`"))
      .toBe('SELECT "name" FROM "kunden"');
  });

  // ─── UNSIGNED ────────────────────────────────────────────────────────
  it("entfernt UNSIGNED-Keyword", () => {
    const result = mysqlToSqlite("CREATE TABLE test (id INT UNSIGNED)");
    expect(result).not.toContain("UNSIGNED");
  });

  // ─── INSERT ON DUPLICATE KEY UPDATE ──────────────────────────────────
  it("transformiert INSERT ... ON DUPLICATE KEY UPDATE zu INSERT OR REPLACE", () => {
    const result = mysqlToSqlite("INSERT INTO kunden (id, name) VALUES (1, 'Max') ON DUPLICATE KEY UPDATE name = 'Max'");
    expect(result).toContain("INSERT OR REPLACE");
    expect(result).not.toContain("ON DUPLICATE KEY UPDATE");
  });

  // ─── Passthrough ─────────────────────────────────────────────────────
  it("lässt Standard-SQL unverändert", () => {
    const sql = "SELECT * FROM kunden WHERE name = 'Max'";
    expect(mysqlToSqlite(sql)).toBe(sql);
  });

  it("lässt LEFT JOIN unverändert", () => {
    const sql = "SELECT * FROM kunden LEFT JOIN bestellungen ON kunden.id = bestellungen.kunde_id";
    expect(mysqlToSqlite(sql)).toBe(sql);
  });

  it("lässt GROUP_CONCAT unverändert", () => {
    const sql = "SELECT GROUP_CONCAT(name, ', ') FROM kunden";
    expect(mysqlToSqlite(sql)).toBe(sql);
  });

  // ─── ALTER TABLE ─────────────────────────────────────────────────────
  it("transformiert ALTER TABLE CHANGE COLUMN zu RENAME COLUMN", () => {
    const result = mysqlToSqlite("ALTER TABLE kategorie CHANGE COLUMN Provision BonusProvision TINYINT");
    expect(result).toContain("RENAME COLUMN");
    expect(result).toContain("Provision");
    expect(result).toContain("BonusProvision");
    expect(result).not.toContain("CHANGE");
  });

  it("transformiert ALTER TABLE MODIFY COLUMN zu Kommentar (nicht unterstützt)", () => {
    const result = mysqlToSqlite("ALTER TABLE hersteller MODIFY COLUMN Name VARCHAR(50) NOT NULL");
    expect(result).toContain("nicht unterstützt");
    expect(result).toContain("--");  // Wird zu SQL-Kommentar
  });

  it("lässt ALTER TABLE ADD COLUMN unverändert", () => {
    const sql = "ALTER TABLE personal ADD COLUMN Arbeitsbeginn DATE";
    expect(mysqlToSqlite(sql)).toBe(sql);
  });

  it("lässt ALTER TABLE RENAME COLUMN unverändert", () => {
    const sql = 'ALTER TABLE personal RENAME COLUMN "Arbeitsbeginn" TO "Beginn"';
    expect(mysqlToSqlite(sql)).toBe(sql);
  });

  // ─── Komplettes MySQL-Skript (Küchen-Datenbank) ──────────────────────
  it("transformiert ein komplettes MySQL-Skript mit CREATE TABLE, INSERT, ALTER TABLE", () => {
    const statements = [
      "CREATE TABLE Personal (PersonalNr SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(60), Vorname VARCHAR(60), Provision SMALLINT UNSIGNED)",
      "INSERT INTO personal(Name, Vorname, Provision) VALUES ('Albrecht','Theo','25')",
      "CREATE TABLE Kueche (KuechenID TINYINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, Preis DECIMAL(9,2) NOT NULL, PersonalNr SMALLINT UNSIGNED NOT NULL, FOREIGN KEY (PersonalNr) REFERENCES Personal(PersonalNr))",
      "CREATE TABLE Moebel (MoebelID SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT, Name VARCHAR(50), Preis DECIMAL(7,2), FOREIGN KEY (KatID) REFERENCES Kategorie(KatID))",
      "ALTER TABLE personal ADD COLUMN Arbeitsbeginn DATE",
      "ALTER TABLE kategorie CHANGE COLUMN Provision BonusProvision TINYINT",
      "ALTER TABLE hersteller MODIFY COLUMN Name VARCHAR(50) NOT NULL",
    ];

    const results = statements.map(s => mysqlToSqlite(s));

    // CREATE TABLE: AUTO_INCREMENT → AUTOINCREMENT
    expect(results[0]).toContain("AUTOINCREMENT");
    expect(results[0]).not.toContain("AUTO_INCREMENT");

    // CREATE TABLE: TINYINT → INTEGER
    expect(results[0]).toContain("INTEGER");
    expect(results[0]).not.toContain("SMALLINT");

    // CREATE TABLE: UNSIGNED entfernt
    expect(results[0]).not.toContain("UNSIGNED");

    // CREATE TABLE: DECIMAL → REAL
    expect(results[2]).toContain("REAL");
    expect(results[2]).not.toContain("DECIMAL");

    // INSERT: unverändert
    expect(results[1]).toContain("INSERT INTO");

    // ALTER TABLE ADD COLUMN: unverändert
    expect(results[4]).toContain("ADD COLUMN");

    // ALTER TABLE CHANGE COLUMN → RENAME COLUMN
    expect(results[5]).toContain("RENAME COLUMN");
    expect(results[5]).not.toContain("CHANGE");

    // ALTER TABLE MODIFY COLUMN → Kommentar
    expect(results[6]).toContain("nicht unterstützt");
  });

  // ─── DROP / CREATE / USE DATABASE ────────────────────────────────────
  it("transformiert DROP DATABASE IF EXISTS zu Kommentar", () => {
    const result = mysqlToSqlite("DROP DATABASE IF EXISTS Kuechenstudio;");
    expect(result).toContain("-- MySQL: DROP DATABASE Kuechenstudio");
    expect(result).toContain("automatisch ignoriert");
    // Das Statement ist jetzt ein Kommentar, kein ausführbares SQL mehr
    expect(result.trim()).toMatch(/^--/);
  });

  it("transformiert CREATE DATABASE zu Kommentar", () => {
    const result = mysqlToSqlite("CREATE DATABASE Kuechenstudio;");
    expect(result).toContain("-- MySQL: CREATE DATABASE Kuechenstudio");
    expect(result).toContain("automatisch ignoriert");
    expect(result.trim()).toMatch(/^--/);
  });

  it("transformiert CREATE DATABASE IF NOT EXISTS zu Kommentar", () => {
    const result = mysqlToSqlite("CREATE DATABASE IF NOT EXISTS Kuechenstudio;");
    expect(result).toContain("-- MySQL: CREATE DATABASE Kuechenstudio");
    expect(result).toContain("automatisch ignoriert");
  });

  it("transformiert USE zu Kommentar", () => {
    const result = mysqlToSqlite("USE Kuechenstudio;");
    expect(result).toContain("-- MySQL: USE Kuechenstudio");
    expect(result).toContain("automatisch ignoriert");
    expect(result.trim()).toMatch(/^--/);
  });

  it("transformiert CREATE DATABASE mit CHARACTER SET und COLLATE", () => {
    const result = mysqlToSqlite("CREATE DATABASE IF NOT EXISTS backshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    expect(result).toContain("-- MySQL: CREATE DATABASE backshop");
    expect(result).toContain("automatisch ignoriert");
    expect(result.trim()).toMatch(/^--/);
  });

  it("transformiert CREATE DATABASE mit DEFAULT CHARSET", () => {
    const result = mysqlToSqlite("CREATE DATABASE mydb DEFAULT CHARSET utf8mb4;");
    expect(result).toContain("-- MySQL: CREATE DATABASE mydb");
    expect(result).toContain("automatisch ignoriert");
  });

  it("transformiert CREATE DATABASE mit CHARACTER SET und COLLATE (ohne IF NOT EXISTS)", () => {
    const result = mysqlToSqlite("CREATE DATABASE backshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    expect(result).toContain("-- MySQL: CREATE DATABASE backshop");
    expect(result.trim()).toMatch(/^--/);
  });

  it("transformiert komplettes Küchen-Skript-Header (DROP + CREATE + USE)", () => {
    const header = [
      "DROP DATABASE IF EXISTS Kuechenstudio;",
      "CREATE DATABASE Kuechenstudio;",
      "USE Kuechenstudio;",
    ].join("\n");

    const result = mysqlToSqlite(header);
    // Alle drei Zeilen sind jetzt Kommentare
    const lines = result.split("\n").map(l => l.trim()).filter(l => l.length > 0);
    expect(lines.every(l => l.startsWith("--"))).toBe(true);
    expect(result).toContain("ignoriert");
  });

  it("Kommentare enthalten keine Semikolons (splitSqlStatements-kompatibel)", () => {
    // WICHTIG: Kommentare dürfen keine Semikolons enthalten, da splitSqlStatements
    // an Semikolons splittet und sonst der Kommentar in zwei Teile gesplittet wird
    const statements = [
      "DROP DATABASE IF EXISTS Kuechenstudio;",
      "CREATE DATABASE Kuechenstudio;",
      "USE Kuechenstudio;",
      "ALTER TABLE hersteller MODIFY COLUMN Name VARCHAR(50) NOT NULL;",
    ];

    for (const stmt of statements) {
      const result = mysqlToSqlite(stmt);
      if (result.trim().startsWith("--")) {
        // Kommentar darf kein Semikolon enthalten
        expect(result).not.toMatch(/;(?!\s*$)/); // kein Semikolon innerhalb des Kommentars
      }
    }
  });

  it("transformiert komplettes Küchen-Datenbank-Skript korrekt (Integration)", () => {
    // Das vollständige Küchen-Datenbank-Skript wie es ein User eingeben würde
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
INSERT INTO personal(Name, Vorname, Provision) VALUES ('Albrecht','Karl','18');

CREATE TABLE Kueche
(
  KuechenID TINYINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  Preis DECIMAL(9,2) NOT NULL,
  PersonalNr SMALLINT UNSIGNED NOT NULL,
  FOREIGN KEY (PersonalNr) REFERENCES Personal(PersonalNr)
);

CREATE TABLE Kategorie
(
  KatID TINYINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  Bezeichnung VARCHAR(120),
  Preisklasse VARCHAR(30),
  maxRabatt TINYINT UNSIGNED,
  Provision TINYINT UNSIGNED NOT NULL
);

CREATE TABLE Hersteller
(
  HerstID TINYINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(50),
  Kontakt VARCHAR(59)
);

CREATE TABLE Moebel
(
  MoebelID SMALLINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  Name VARCHAR(50),
  Laenge_cm SMALLINT UNSIGNED NOT NULL,
  Breite_cm SMALLINT UNSIGNED NOT NULL,
  Hoehe_cm SMALLINT UNSIGNED NOT NULL,
  KatID TINYINT UNSIGNED NOT NULL,
  HerstID TINYINT UNSIGNED NOT NULL,
  Preis DECIMAL(7,2),
  FOREIGN KEY (KatID) REFERENCES Kategorie(KatID),
  FOREIGN KEY (HerstID) REFERENCES Hersteller(HerstID)
);

CREATE TABLE KueMoe
(
  MoebelID SMALLINT UNSIGNED,
  KuechenID TINYINT UNSIGNED,
  Anzahl TINYINT UNSIGNED,
  PRIMARY KEY (MoebelID,KuechenID),
  FOREIGN KEY (MoebelID) REFERENCES Moebel(MoebelID),
  Foreign KEY (KuechenID) REFERENCES Kueche(KuechenID)
);

ALTER TABLE personal ADD COLUMN Arbeitsbeginn DATE;
ALTER TABLE kategorie CHANGE COLUMN Provision BonusProvision TINYINT;
ALTER TABLE hersteller MODIFY COLUMN Name VARCHAR(50) NOT NULL;`;

    // WICHTIG: In der echten Pipeline wird das Skript ZUERST in Statements
    // aufgeteilt (splitSqlStatements) und DANN wird mysqlToSqlite auf JEDES
    // Statement einzeln angewendet. Das ist nötig, weil mysqlToSqlite()
    // nur auf einzelnen Statements korrekt arbeitet (z.B. prüft
    // transformCreateTable auf /^\s*CREATE\s+TABLE/).
    //
    // Hier testen wir, ob die Transformation auf jedes einzelne Statement
    // korrekt angewendet wird.

    // Simuliere die Pipeline: split → transform each
    const rawStmts = splitSqlStatements(kuechenScript);

    // Jedes Statement einzeln transformieren
    const transformedStmts = rawStmts.map(stmt => mysqlToSqlite(stmt.trim()));

    // DROP/CREATE/USE DATABASE → Kommentare
    const dbComments = transformedStmts.filter(s => s.trim().startsWith("--"));
    expect(dbComments.length).toBeGreaterThanOrEqual(3); // DROP, CREATE, USE

    // UNSIGNED entfernt in allen CREATE TABLE Statements
    const createTableStmts = transformedStmts.filter(s => s.includes("CREATE TABLE"));
    for (const stmt of createTableStmts) {
      expect(stmt).not.toContain("UNSIGNED");
    }

    // AUTO_INCREMENT → AUTOINCREMENT in CREATE TABLE
    const personalStmt = transformedStmts.find(s => s.includes("PersonalNr"));
    expect(personalStmt).toBeDefined();
    expect(personalStmt!).toContain("AUTOINCREMENT");
    expect(personalStmt!).not.toContain("AUTO_INCREMENT");

    // TINYINT → INTEGER, SMALLINT → INTEGER
    for (const stmt of createTableStmts) {
      expect(stmt).not.toContain("TINYINT");
      expect(stmt).not.toContain("SMALLINT");
    }

    // DECIMAL → REAL
    const kuecheStmt = transformedStmts.find(s => s.includes("KuechenID") || s.includes("Preis"));
    expect(kuecheStmt).toBeDefined();
    expect(kuecheStmt!).not.toContain("DECIMAL");

    // ALTER TABLE CHANGE COLUMN → RENAME COLUMN (mit Semikolon!)
    const renameStmt = transformedStmts.find(s => s.includes("RENAME COLUMN"));
    expect(renameStmt).toBeDefined();

    // ALTER TABLE MODIFY COLUMN → Kommentar
    const modifyStmt = transformedStmts.find(s => s.includes("nicht unterstützt"));
    expect(modifyStmt).toBeDefined();

    // Foreign KEY (capital F) sollte erhalten bleiben
    const kueMoeStmt = transformedStmts.find(s => s.includes("KueMoe") || s.includes("KuechenID") && s.includes("MoebelID"));
    expect(kueMoeStmt).toBeDefined();
    expect(kueMoeStmt!).toContain("Foreign KEY");

    // Kommentare dürfen keine Semikolons enthalten
    for (const comment of dbComments) {
      expect(comment).not.toMatch(/;\s*\w/); // kein Semikolon gefolgt von Text
    }
  });

  it("transformiert CREATE TABLE IF NOT EXISTS korrekt", () => {
    const result = mysqlToSqlite("CREATE TABLE IF NOT EXISTS produkte (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL);");
    expect(result).toContain("CREATE TABLE IF NOT EXISTS produkte");
    expect(result).toContain("AUTOINCREMENT");
    expect(result).not.toContain("AUTO_INCREMENT");
  });

  it("transformiert komplettes Backshop-Skript mit IF NOT EXISTS und CHARACTER SET (Integration)", () => {
    const backshopScript = `CREATE DATABASE IF NOT EXISTS backshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE backshop;

CREATE TABLE IF NOT EXISTS produkte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    kategorie VARCHAR(50) NOT NULL,
    preis DECIMAL(6,2) NOT NULL,
    bestand INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS kunden (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vorname VARCHAR(50) NOT NULL,
    nachname VARCHAR(50) NOT NULL,
    email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS bestellungen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kunde_id INT NOT NULL,
    bestell_datum DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kunde_id) REFERENCES kunden(id)
);

CREATE TABLE IF NOT EXISTS bestellpositionen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bestellung_id INT NOT NULL,
    produkt_id INT NOT NULL,
    menge INT NOT NULL,
    einzelpreis DECIMAL(6,2) NOT NULL,
    FOREIGN KEY (bestellung_id) REFERENCES bestellungen(id),
    FOREIGN KEY (produkt_id) REFERENCES produkte(id)
);

INSERT INTO produkte (name, kategorie, preis, bestand) VALUES
('Brötchen', 'Backwaren', 0.45, 200),
('Croissant', 'Gebäck', 1.50, 80),
('Pide', 'Herzhaftes', 3.50, 40),
('Kaffee', 'Getränke', 2.20, 100);

INSERT INTO kunden (vorname, nachname, email) VALUES
('Ali', 'Yilmaz', 'ali.yilmaz@example.com'),
('Mara', 'Schneider', 'mara.schneider@example.com');

INSERT INTO bestellungen (kunde_id) VALUES
(1),
(2);

INSERT INTO bestellpositionen (bestellung_id, produkt_id, menge, einzelpreis) VALUES
(1, 1, 5, 0.45),
(1, 4, 2, 2.20),
(2, 2, 3, 1.50),
(2, 3, 1, 3.50);`;

    const rawStmts = splitSqlStatements(backshopScript);
    const transformedStmts = rawStmts.map(stmt => mysqlToSqlite(stmt.trim()));

    // CREATE DATABASE → Kommentar
    const createDbComment = transformedStmts.find(s => s.includes("CREATE DATABASE backshop"));
    expect(createDbComment).toBeDefined();
    expect(createDbComment!.trim()).toMatch(/^--/);

    // USE → Kommentar
    const useComment = transformedStmts.find(s => s.includes("USE backshop"));
    expect(useComment).toBeDefined();
    expect(useComment!.trim()).toMatch(/^--/);

    // CREATE TABLE IF NOT EXISTS bleibt erhalten
    const produkteStmt = transformedStmts.find(s => s.includes("produkte") && s.includes("CREATE TABLE"));
    expect(produkteStmt).toBeDefined();
    expect(produkteStmt!).toContain("IF NOT EXISTS");
    expect(produkteStmt!).toContain("AUTOINCREMENT");
    expect(produkteStmt!).not.toContain("AUTO_INCREMENT");
    expect(produkteStmt!).not.toContain("DECIMAL");

    // DATETIME → TEXT
    const bestellungenStmt = transformedStmts.find(s => s.includes("bestellungen") && s.includes("CREATE TABLE"));
    expect(bestellungenStmt).toBeDefined();
    expect(bestellungenStmt!).toContain("TEXT");
    expect(bestellungenStmt!).not.toContain("DATETIME");

    // DECIMAL → REAL
    const bestellpositionenStmt = transformedStmts.find(s => s.includes("bestellpositionen") && s.includes("CREATE TABLE"));
    expect(bestellpositionenStmt).toBeDefined();
    expect(bestellpositionenStmt!).not.toContain("DECIMAL");

    // INSERT-Statements bleiben erhalten
    const insertStmts = transformedStmts.filter(s => s.includes("INSERT INTO"));
    expect(insertStmts.length).toBeGreaterThanOrEqual(4);

    // Keine Statements sollten Fehler verursachen (alle sind gültiges SQLite)
    for (const stmt of transformedStmts) {
      if (stmt.trim().startsWith("--")) continue; // Kommentare überspringen
      // Alle nicht-Kommentar-Statements sollten mit CREATE TABLE, INSERT INTO, oder PRAGMA beginnen
      expect(stmt.trim()).toMatch(/^(CREATE TABLE|INSERT INTO|PRAGMA)/i);
    }
  });

  it("transformiert Backshop-Skript mit CHARACTER SET und COLLATE korrekt (Integration)", () => {
    // Das Backshop-Skript wie es ein User eingeben würde
    const backshopScript = `CREATE DATABASE IF NOT EXISTS backshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE backshop;

CREATE TABLE produkte (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    kategorie VARCHAR(50),
    preis DECIMAL(6,2) NOT NULL,
    bestand INT DEFAULT 0
);

CREATE TABLE kunden (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vorname VARCHAR(50) NOT NULL,
    nachname VARCHAR(50) NOT NULL,
    email VARCHAR(100)
);

CREATE TABLE bestellungen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kunde_id INT,
    bestell_datum DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kunde_id) REFERENCES kunden(id)
);

CREATE TABLE bestellpositionen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bestellung_id INT,
    produkt_id INT,
    menge INT NOT NULL,
    einzelpreis DECIMAL(6,2) NOT NULL,
    FOREIGN KEY (bestellung_id) REFERENCES bestellungen(id),
    FOREIGN KEY (produkt_id) REFERENCES produkte(id)
);

INSERT INTO produkte (name, kategorie, preis, bestand)
VALUES
('Brötchen', 'Backwaren', 0.45, 200),
('Croissant', 'Gebäck', 1.50, 80),
('Pide', 'Herzhaftes', 3.50, 40),
('Kaffee', 'Getränke', 2.20, 100);

INSERT INTO kunden (vorname, nachname, email)
VALUES
('Ali', 'Yilmaz', 'ali.yilmaz@example.com'),
('Mara', 'Schneider', 'mara.schneider@example.com');

INSERT INTO bestellungen (kunde_id)
VALUES
(1),
(2);

INSERT INTO bestellpositionen (bestellung_id, produkt_id, menge, einzelpreis)
VALUES
(1, 1, 5, 0.45),
(1, 4, 2, 2.20),
(2, 2, 3, 1.50),
(2, 3, 1, 3.50);`;

    // Pipeline simulieren: split → transform each
    const rawStmts = splitSqlStatements(backshopScript);
    const transformedStmts = rawStmts.map(stmt => mysqlToSqlite(stmt.trim()));

    // CREATE DATABASE und USE → Kommentare
    const dbComments = transformedStmts.filter(s => s.trim().startsWith("--"));
    expect(dbComments.length).toBeGreaterThanOrEqual(2); // CREATE DATABASE + USE

    // CREATE DATABASE mit CHARACTER SET/COLLATE wird korrekt transformiert
    const createDbComment = transformedStmts.find(s => s.includes("CREATE DATABASE backshop"));
    expect(createDbComment).toBeDefined();
    expect(createDbComment!.trim()).toMatch(/^--/);

    // USE wird korrekt transformiert
    const useComment = transformedStmts.find(s => s.includes("USE backshop"));
    expect(useComment).toBeDefined();
    expect(useComment!.trim()).toMatch(/^--/);

    // AUTO_INCREMENT → AUTOINCREMENT in CREATE TABLE
    const produkteStmt = transformedStmts.find(s => s.includes("produkte"));
    expect(produkteStmt).toBeDefined();
    expect(produkteStmt!).toContain("AUTOINCREMENT");
    expect(produkteStmt!).not.toContain("AUTO_INCREMENT");

    // DECIMAL → REAL
    for (const stmt of transformedStmts) {
      if (stmt.includes("DECIMAL")) {
        // DECIMAL sollte nur noch in INSERT-Statements vorkommen (als Wert)
        // nicht in CREATE TABLE
        expect(stmt).not.toContain("CREATE TABLE");
      }
    }

    // DATETIME → TEXT
    const bestellungenStmt = transformedStmts.find(s => s.includes("bestellungen") && s.includes("CREATE TABLE"));
    expect(bestellungenStmt).toBeDefined();
    expect(bestellungenStmt!).toContain("TEXT");
    expect(bestellungenStmt!).not.toContain("DATETIME");

    // CURRENT_TIMESTAMP → wird in DEFAULT behalten (SQLite kennt CURRENT_TIMESTAMP)
    expect(bestellungenStmt!).toContain("CURRENT_TIMESTAMP");

    // Kommentare dürfen keine Semikolons enthalten
    for (const comment of dbComments) {
      expect(comment).not.toMatch(/;\s*\w/);
    }
  });
});

describe("mapSqliteErrorToMysql", () => {
  it("mappt 'no such table' zu MySQL-Fehler", () => {
    expect(mapSqliteErrorToMysql("no such table: kunden"))
      .toBe("Table 'kunden' doesn't exist");
  });

  it("mappt 'no such column' zu MySQL-Fehler", () => {
    expect(mapSqliteErrorToMysql("no such column: name"))
      .toBe("Unknown column 'name'");
  });

  it("mappt 'table already exists' zu MySQL-Fehler", () => {
    expect(mapSqliteErrorToMysql("table kunden already exists"))
      .toBe("Table 'kunden' already exists");
  });

  it("mappt Syntaxfehler zu MySQL-Fehler", () => {
    const result = mapSqliteErrorToMysql('near "FROM": syntax error');
    expect(result).toContain("You have an error in your SQL syntax");
  });

  it("mappt UNIQUE constraint failed zu Duplicate entry", () => {
    const result = mapSqliteErrorToMysql("UNIQUE constraint failed: kunden.id");
    expect(result).toContain("Duplicate entry");
  });

  it("mappt NOT NULL constraint failed zu Column cannot be null", () => {
    const result = mapSqliteErrorToMysql("NOT NULL constraint failed: kunden.name");
    expect(result).toContain("cannot be null");
  });

  it("mappt foreign key mismatch zu MySQL-Fehler", () => {
    const result = mapSqliteErrorToMysql("foreign key mismatch");
    expect(result).toContain("foreign key constraint fails");
  });

  it("lässt unbekannte Fehler unverändert", () => {
    const err = "some unknown error message";
    expect(mapSqliteErrorToMysql(err)).toBe(err);
  });
});

describe("mapSqliteTypeToMysql", () => {
  it("mappt INTEGER zu INT", () => {
    expect(mapSqliteTypeToMysql("INTEGER")).toBe("INT");
  });

  it("mappt REAL zu DOUBLE", () => {
    expect(mapSqliteTypeToMysql("REAL")).toBe("DOUBLE");
  });

  it("mappt TEXT zu VARCHAR(255)", () => {
    expect(mapSqliteTypeToMysql("TEXT")).toBe("VARCHAR(255)");
  });

  it("lässt MySQL-Typen unverändert", () => {
    expect(mapSqliteTypeToMysql("VARCHAR(100)")).toBe("VARCHAR(100)");
    expect(mapSqliteTypeToMysql("DATETIME")).toBe("DATETIME");
    expect(mapSqliteTypeToMysql("DECIMAL(10,2)")).toBe("DECIMAL(10,2)");
  });
});

describe("getMysqlCompatWarnings", () => {
  it("warnt bei FULL OUTER JOIN", () => {
    const warnings = getMysqlCompatWarnings("SELECT * FROM a FULL OUTER JOIN b ON a.id = b.id");
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toContain("FULL OUTER JOIN");
  });

  it("warnt bei Stored Procedures", () => {
    const warnings = getMysqlCompatWarnings("CALL my_procedure()");
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain("Stored Procedures");
  });

  it("warnt bei LOAD DATA INFILE", () => {
    const warnings = getMysqlCompatWarnings("LOAD DATA INFILE 'data.csv' INTO TABLE kunden");
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain("LOAD DATA");
  });

  it("gibt keine Warnungen für Standard-SQL", () => {
    const warnings = getMysqlCompatWarnings("SELECT * FROM kunden WHERE name = 'Max'");
    expect(warnings).toHaveLength(0);
  });

  it("gibt keine Warnungen für SHOW TABLES (wird vom Transpiler abgefangen)", () => {
    const warnings = getMysqlCompatWarnings("SHOW TABLES");
    expect(warnings).toHaveLength(0);
  });

  it("gibt keine Warnungen für RIGHT JOIN (wird vom Transpiler abgefangen)", () => {
    const warnings = getMysqlCompatWarnings("SELECT * FROM a RIGHT JOIN b ON a.id = b.id");
    expect(warnings).toHaveLength(0);
  });
});

describe("extractDatabaseName", () => {
  it("extrahiert den Namen aus CREATE DATABASE", () => {
    expect(extractDatabaseName("CREATE DATABASE Kuechenstudio;")).toBe("Kuechenstudio");
  });

  it("extrahiert den Namen aus CREATE DATABASE IF NOT EXISTS", () => {
    expect(extractDatabaseName("CREATE DATABASE IF NOT EXISTS Kuechenstudio;")).toBe("Kuechenstudio");
  });

  it("extrahiert den Namen aus USE", () => {
    expect(extractDatabaseName("USE Kuechenstudio;")).toBe("Kuechenstudio");
  });

  it("priorisiert CREATE DATABASE über USE", () => {
    const sql = "DROP DATABASE IF EXISTS Kuechenstudio;\nCREATE DATABASE Kuechenstudio;\nUSE Kuechenstudio;";
    expect(extractDatabaseName(sql)).toBe("Kuechenstudio");
  });

  it("extrahiert den Namen aus USE wenn kein CREATE DATABASE vorhanden", () => {
    const sql = "USE mydb;\nSELECT * FROM test;";
    expect(extractDatabaseName(sql)).toBe("mydb");
  });

  it("extrahiert den Namen aus CREATE DATABASE mit CHARACTER SET und COLLATE", () => {
    expect(extractDatabaseName("CREATE DATABASE IF NOT EXISTS backshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")).toBe("backshop");
  });

  it("extrahiert den Namen aus CREATE DATABASE mit DEFAULT CHARSET", () => {
    expect(extractDatabaseName("CREATE DATABASE mydb DEFAULT CHARSET utf8mb4;")).toBe("mydb");
  });

  it("extrahiert den Namen aus CREATE DATABASE mit CHARACTER SET (ohne IF NOT EXISTS)", () => {
    expect(extractDatabaseName("CREATE DATABASE backshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")).toBe("backshop");
  });

  it("gibt null zurück wenn kein CREATE DATABASE oder USE vorhanden", () => {
    expect(extractDatabaseName("SELECT * FROM kunden;")).toBeNull();
  });

  it("extrahiert den Namen aus einem vollständigen Küchen-Skript", () => {
    const sql = `DROP DATABASE IF EXISTS Kuechenstudio;
CREATE DATABASE Kuechenstudio;
USE Kuechenstudio;

CREATE TABLE Personal (PersonalNr INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Vorname TEXT, Provision INTEGER);`;
    expect(extractDatabaseName(sql)).toBe("Kuechenstudio");
  });
});