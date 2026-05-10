/**
 * DDL-Uebungen (Data Definition Language).
 * Enthaelt Uebungen fuer CREATE TABLE, ALTER TABLE und DROP TABLE.
 */
import { makeWriteExercise, makeDebugExercise, makePredictExercise, makeSchemaExercise, resetCounter } from "@/data/exercises/_factory";
import type { Exercise } from "@/types/exercise";
import { shopDataset } from "@/data/datasets/shop";
import { fitnessDataset } from "@/data/datasets/fitness";
import { hrDataset } from "@/data/datasets/hr";
import { ticketsDataset } from "@/data/datasets/tickets";
import { bankingDataset } from "@/data/datasets/banking";
import { streamingDataset } from "@/data/datasets/streaming";
import { logsDataset } from "@/data/datasets/logs";

export const ddlExercises: Exercise[] = [];
resetCounter();
ddlExercises.push(
  makeWriteExercise("ddl", {
    title: "CREATE TABLE: Einfache Tabelle erstellen",
    description: "Erstelle eine Tabelle `notizen` mit den Spalten: id (INTEGER, PRIMARY KEY), titel (TEXT, NOT NULL), inhalt (TEXT), erstellt_am (TEXT).",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    referenceQuery: "CREATE TABLE notizen (id INTEGER PRIMARY KEY, titel TEXT NOT NULL, inhalt TEXT, erstellt_am TEXT);",
    tags: ["DDL", "CREATE TABLE"],
    hints: [
      "Verwende `CREATE TABLE tabellenname (spalte1 typ, spalte2 typ, ...)`.",
      "PRIMARY KEY definiert den Hauptschluessel, NOT NULL verbietet NULL-Werte."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='notizen';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE: Mitarbeiter-Tabelle",
    description: "Erstelle eine Tabelle `projekte` mit: id (INTEGER PRIMARY KEY), name (TEXT NOT NULL), budget (REAL), startdatum (TEXT), abteilung_id (INTEGER).",
    difficulty: "junior",
    category: "DDL",
    datasetId: hrDataset.id,
    referenceQuery: "CREATE TABLE projekte (id INTEGER PRIMARY KEY, name TEXT NOT NULL, budget REAL, startdatum TEXT, abteilung_id INTEGER);",
    tags: ["DDL", "CREATE TABLE"],
    hints: [
      "REAL ist der Typ fuer Fliesskommazahlen in SQLite/sql.js.",
      "Jede Spalte bekommt ihren Datentyp nach dem Namen."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='projekte';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE mit FOREIGN KEY",
    description: "Erstelle eine Tabelle `aufgaben` mit: id (INTEGER PRIMARY KEY), titel (TEXT NOT NULL), status (TEXT DEFAULT 'offen'), projekt_id (INTEGER REFERENCES projekte(id)).",
    difficulty: "junior",
    category: "DDL",
    datasetId: hrDataset.id,
    referenceQuery: "CREATE TABLE aufgaben (id INTEGER PRIMARY KEY, titel TEXT NOT NULL, status TEXT DEFAULT 'offen', projekt_id INTEGER REFERENCES projekte(id));",
    tags: ["DDL", "CREATE TABLE", "FOREIGN KEY", "DEFAULT"],
    hints: [
      "`REFERENCES andere_tabelle(spalte)` definiert einen Fremdschluessel.",
      "`DEFAULT 'wert'` legt einen Standardwert fest, wenn kein Wert angegeben wird."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='aufgaben';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE: Logging-Tabelle",
    description: "Erstelle eine Tabelle `zugriffslog` mit: id (INTEGER PRIMARY KEY), nutzer_id (INTEGER NOT NULL), aktion (TEXT NOT NULL), zeitpunkt (TEXT NOT NULL), details (TEXT).",
    difficulty: "junior",
    category: "DDL",
    datasetId: logsDataset.id,
    referenceQuery: "CREATE TABLE zugriffslog (id INTEGER PRIMARY KEY, nutzer_id INTEGER NOT NULL, aktion TEXT NOT NULL, zeitpunkt TEXT NOT NULL, details TEXT);",
    tags: ["DDL", "CREATE TABLE", "NOT NULL"],
    hints: [
      "NOT NULL stellt sicher, dass die Spalte immer einen Wert haben muss.",
      "Verwende NOT NULL bei Pflichtfeldern wie nutzer_id oder aktion."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='zugriffslog';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE mit UNIQUE",
    description: "Erstelle eine Tabelle `gutscheincodes` mit: id (INTEGER PRIMARY KEY), code (TEXT UNIQUE NOT NULL), rabatt_prozent (REAL NOT NULL), gueltig_bis (TEXT).",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    referenceQuery: "CREATE TABLE gutscheincodes (id INTEGER PRIMARY KEY, code TEXT UNIQUE NOT NULL, rabatt_prozent REAL NOT NULL, gueltig_bis TEXT);",
    tags: ["DDL", "CREATE TABLE", "UNIQUE"],
    hints: [
      "UNIQUE stellt sicher, dass jeder Wert in der Spalte nur einmal vorkommt.",
      "Kombiniere UNIQUE und NOT NULL, um eindeutige Pflichtfelder zu erstellen."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='gutscheincodes';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "ALTER TABLE: Spalte hinzufuegen",
    description: "Fuege der Tabelle `kunden` eine neue Spalte `telefon` vom Typ TEXT hinzu.",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    referenceQuery: "ALTER TABLE kunden ADD COLUMN telefon TEXT;",
    tags: ["DDL", "ALTER TABLE", "ADD COLUMN"],
    hints: [
      "Verwende `ALTER TABLE tabelle ADD COLUMN spalte typ`.",
      "Neue Spalten werden am Ende der Tabelle hinzugefuegt."
    ],
    hiddenTestQuery: "PRAGMA table_info(kunden);",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "ALTER TABLE: Spalte mit Default hinzufuegen",
    description: "Fuege der Tabelle `produkte` eine Spalte `bewertung` vom Typ REAL mit dem Standardwert 0.0 hinzu.",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    referenceQuery: "ALTER TABLE produkte ADD COLUMN bewertung REAL DEFAULT 0.0;",
    tags: ["DDL", "ALTER TABLE", "ADD COLUMN", "DEFAULT"],
    hints: [
      "Verwende `ADD COLUMN spalte typ DEFAULT wert`, um einen Standardwert festzulegen.",
      "Bestehende Zeilen erhalten den Standardwert fuer die neue Spalte."
    ],
    hiddenTestQuery: "PRAGMA table_info(produkte);",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "ALTER TABLE: Spalte zu mitarbeiter hinzufuegen",
    description: "Fuege der Tabelle `mitarbeiter` die Spalte `geburtsdatum` vom Typ TEXT hinzu.",
    difficulty: "junior",
    category: "DDL",
    datasetId: hrDataset.id,
    referenceQuery: "ALTER TABLE mitarbeiter ADD COLUMN geburtsdatum TEXT;",
    tags: ["DDL", "ALTER TABLE", "ADD COLUMN"],
    hints: [
      "ALTER TABLE aendert die Struktur einer bestehenden Tabelle.",
      "ADD COLUMN fuegt eine neue Spalte am Ende hinzu."
    ],
    hiddenTestQuery: "PRAGMA table_info(mitarbeiter);",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "DROP TABLE: Tabelle entfernen",
    description: "Loesche die Tabelle `notizen` komplett aus der Datenbank.",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    referenceQuery: "DROP TABLE IF EXISTS notizen;",
    tags: ["DDL", "DROP TABLE"],
    hints: [
      "Verwende `DROP TABLE tabellenname`, um eine Tabelle unwiderruflich zu loeschen.",
      "`IF EXISTS` verhindert einen Fehler, wenn die Tabelle nicht existiert."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='notizen';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE: Banktransaktionstabelle",
    description: "Erstelle eine Tabelle `gehalt_zahlungen` mit: id (INTEGER PRIMARY KEY), mitarbeiter_id (INTEGER NOT NULL REFERENCES mitarbeiter(id)), betrag (REAL NOT NULL), zahlungsdatum (TEXT NOT NULL), typ (TEXT DEFAULT 'Gehalt').",
    difficulty: "intermediate",
    category: "DDL",
    datasetId: bankingDataset.id,
    referenceQuery: "CREATE TABLE gehalt_zahlungen (id INTEGER PRIMARY KEY, mitarbeiter_id INTEGER NOT NULL REFERENCES mitarbeiter(id), betrag REAL NOT NULL, zahlungsdatum TEXT NOT NULL, typ TEXT DEFAULT 'Gehalt');",
    tags: ["DDL", "CREATE TABLE", "FOREIGN KEY", "NOT NULL", "DEFAULT"],
    hints: [
      "Verbinde FOREIGN KEY und NOT NULL in einer Spaltendefinition.",
      "DEFAULT legt den Standardwert 'Gehalt' fuer die Spalte typ fest."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='gehalt_zahlungen';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE mit zusammengesetztem Primaerschluessel",
    description: "Erstelle eine Tabelle `film_schauspieler` mit: film_id (INTEGER NOT NULL), schauspieler_id (INTEGER NOT NULL), rolle (TEXT), PRIMARY KEY (film_id, schauspieler_id).",
    difficulty: "intermediate",
    category: "DDL",
    datasetId: streamingDataset.id,
    referenceQuery: "CREATE TABLE film_schauspieler (film_id INTEGER NOT NULL, schauspieler_id INTEGER NOT NULL, rolle TEXT, PRIMARY KEY (film_id, schauspieler_id));",
    tags: ["DDL", "CREATE TABLE", "Composite Primary Key"],
    hints: [
      "Ein zusammengesetzter Primaerschluessel wird am Ende der Spaltendefinition mit `PRIMARY KEY (sp1, sp2)` deklariert.",
      "Jede Spalte im Primaerschluessel muss NOT NULL sein."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='film_schauspieler';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "ALTER TABLE: NOT NULL Spalte hinzufuegen",
    description: "Fuege der Tabelle `tickets` eine Spalte `dringlichkeit` vom Typ INTEGER mit dem Standardwert 1 und NOT NULL hinzu.",
    difficulty: "intermediate",
    category: "DDL",
    datasetId: ticketsDataset.id,
    referenceQuery: "ALTER TABLE tickets ADD COLUMN dringlichkeit INTEGER NOT NULL DEFAULT 1;",
    tags: ["DDL", "ALTER TABLE", "ADD COLUMN", "NOT NULL", "DEFAULT"],
    hints: [
      "Bei NOT NULL musst du einen DEFAULT-Wert angeben, damit bestehende Zeilen gefuellt werden koennen.",
      "Verwende `ADD COLUMN spalte typ NOT NULL DEFAULT wert`."
    ],
    hiddenTestQuery: "PRAGMA table_info(tickets);",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE: Workout-Bewertungen",
    description: "Erstelle eine Tabelle `workout_bewertungen` mit: id (INTEGER PRIMARY KEY), nutzer_id (INTEGER NOT NULL), workout_id (INTEGER NOT NULL), sterne (INTEGER NOT NULL CHECK(sterne BETWEEN 1 AND 5)), kommentar (TEXT), bewertet_am (TEXT DEFAULT CURRENT_TIMESTAMP).",
    difficulty: "intermediate",
    category: "DDL",
    datasetId: fitnessDataset.id,
    referenceQuery: "CREATE TABLE workout_bewertungen (id INTEGER PRIMARY KEY, nutzer_id INTEGER NOT NULL, workout_id INTEGER NOT NULL, sterne INTEGER NOT NULL CHECK(sterne BETWEEN 1 AND 5), kommentar TEXT, bewertet_am TEXT DEFAULT CURRENT_TIMESTAMP);",
    tags: ["DDL", "CREATE TABLE", "CHECK", "DEFAULT"],
    hints: [
      "CHECK(bedingung) validiert Werte beim Einfuegen – hier: sterne muss zwischen 1 und 5 liegen.",
      "CURRENT_TIMESTAMP setzt automatisch den aktuellen Zeitstempel."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='workout_bewertungen';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "DROP TABLE IF EXISTS: Sicher loeschen",
    description: "Entferne die Tabelle `temp_import` aus der Datenbank — aber nur, wenn sie tatsaechlich existiert, ohne Fehler falls sie fehlt.",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    referenceQuery: "DROP TABLE IF EXISTS temp_import;",
    tags: ["DDL", "DROP TABLE", "IF EXISTS"],
    hints: [
      "`IF EXISTS` verhindert einen Fehler, wenn die Tabelle nicht existiert.",
      "Ohne IF EXISTS wuerde ein Fehler auftreten bei einer nicht existierenden Tabelle."
    ],
    hiddenTestQuery: "SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' AND name='temp_import';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE: Veranstaltungstabelle",
    description: "Erstelle eine Tabelle `veranstaltungen` mit: id (INTEGER PRIMARY KEY AUTOINCREMENT), titel (TEXT NOT NULL), beschreibung (TEXT), datum (TEXT NOT NULL), max_teilnehmer (INTEGER DEFAULT 50), ort (TEXT).",
    difficulty: "intermediate",
    category: "DDL",
    datasetId: streamingDataset.id,
    referenceQuery: "CREATE TABLE veranstaltungen (id INTEGER PRIMARY KEY AUTOINCREMENT, titel TEXT NOT NULL, beschreibung TEXT, datum TEXT NOT NULL, max_teilnehmer INTEGER DEFAULT 50, ort TEXT);",
    tags: ["DDL", "CREATE TABLE", "AUTOINCREMENT", "DEFAULT"],
    hints: [
      "AUTOINCREMENT sorgt fuer automatisch steigende IDs.",
      "DEFAULT 50 setzt 50 als Standardwert fuer max_teilnehmer."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='veranstaltungen';",
    hiddenTestMode: "rows",
  }),
  makeSchemaExercise("ddl", {
    title: "Schema-Verstaendnis: Primaerschluessel",
    description: "Verstehe die Rolle des Primaerschluessels.",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    question: "Warum braucht jede Tabelle einen Primaerschluessel?",
    options: [
      { text: "Um jede Zeile eindeutig identifizieren zu koennen", isCorrect: true },
      { text: "Um die Tabelle schneller zu sortieren", isCorrect: false },
      { text: "Um die Tabelle vor Loeschungen zu schuetzen", isCorrect: false },
      { text: "Es ist nur eine Konvention, nicht notwendig", isCorrect: false }
    ],
    tags: ["DDL", "PRIMARY KEY", "Schema-Verstaendnis"],
    hints: [
      "Der Primaerschluessel garantiert die Eindeutigkeit jeder Zeile.",
      "Ohne Primaerschluessel koennen doppelte Zeilen nicht unterschieden werden."
    ],
  }),
  makeSchemaExercise("ddl", {
    title: "Schema-Verstaendnis: Fremdschluessel",
    description: "Verstehe die Funktion von Fremdschluesseln.",
    difficulty: "junior",
    category: "DDL",
    datasetId: hrDataset.id,
    question: "Welche Aussage ueber FOREIGN KEY ist richtig?",
    options: [
      { text: "Ein FOREIGN KEY verweist auf den Primaerschluessel einer anderen Tabelle und erstellt eine Beziehung", isCorrect: true },
      { text: "Ein FOREIGN KEY ist ein zweiter Primaerschluessel in derselben Tabelle", isCorrect: false },
      { text: "Ein FOREIGN KEY beschleunigt Abfragen", isCorrect: false },
      { text: "Ein FOREIGN KEY speichert automatisch Daten in der anderen Tabelle", isCorrect: false }
    ],
    tags: ["DDL", "FOREIGN KEY", "Schema-Verstaendnis"],
    hints: [
      "FOREIGN KEY stellt referentielle Integritaet zwischen Tabellen sicher.",
      "Er verweist immer auf eine Spalte (meist den Primaerschluessel) in einer anderen Tabelle."
    ],
  }),
  makeSchemaExercise("ddl", {
    title: "Schema-Verstaendnis: CHECK-Constraint",
    description: "Verstehe den Zweck von CHECK-Constraints.",
    difficulty: "junior",
    category: "DDL",
    datasetId: fitnessDataset.id,
    question: "Was bewirkt `CHECK(gewicht_kg > 0)` in einer Tabellendefinition?",
    options: [
      { text: "Es verhindert das Einfuegen von Zeilen mit gewicht_kg <= 0", isCorrect: true },
      { text: "Es sortiert die Tabelle nach gewicht_kg", isCorrect: false },
      { text: "Es setzt gewicht_kg automatisch auf 1, wenn 0 eingegeben wird", isCorrect: false },
      { text: "Es zeigt nur Zeilen mit gewicht_kg > 0 bei SELECT an", isCorrect: false }
    ],
    tags: ["DDL", "CHECK", "Schema-Verstaendnis"],
    hints: [
      "CHECK validiert Daten beim Einfuegen oder Aktualisieren.",
      "Wenn die Bedingung nicht erfuellt ist, wird die Aktion abgelehnt."
    ],
  }),
  makeSchemaExercise("ddl", {
    title: "Schema-Verstaendnis: UNIQUE vs PRIMARY KEY",
    description: "Verstehe den Unterschied zwischen UNIQUE und PRIMARY KEY.",
    difficulty: "intermediate",
    category: "DDL",
    datasetId: bankingDataset.id,
    question: "Was ist der Hauptunterschied zwischen UNIQUE und PRIMARY KEY?",
    options: [
      { text: "PRIMARY KEY ist implizit NOT NULL und UNIQUE, UNIQUE erlaubt NULL-Werte pro Spalte", isCorrect: true },
      { text: "Es gibt keinen Unterschied", isCorrect: false },
      { text: "UNIQUE ist schneller als PRIMARY KEY", isCorrect: false },
      { text: "Eine Tabelle kann mehrere PRIMARY KEYs haben, aber nur ein UNIQUE", isCorrect: false }
    ],
    tags: ["DDL", "UNIQUE", "PRIMARY KEY", "Schema-Verstaendnis"],
    hints: [
      "PRIMARY KEY = UNIQUE + NOT NULL. Pro Tabelle ist nur ein PRIMARY KEY erlaubt.",
      "UNIQUE-Constraints erlauben NULL-Werte und es kann mehrere pro Tabelle geben."
    ],
  }),
  makeDebugExercise("ddl", {
    title: "Debug: Falscher Datentyp",
    description: "Diese CREATE TABLE-Anweisung hat einen Fehler beim Datentyp der Spalte preis. Korrigiere sie.",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    brokenQuery: "CREATE TABLE angebote (id INTEGER PRIMARY KEY, name TEXT NOT NULL, preis TEXT NOT NULL, gueltig_bis TEXT);",
    referenceQuery: "CREATE TABLE angebote (id INTEGER PRIMARY KEY, name TEXT NOT NULL, preis REAL NOT NULL, gueltig_bis TEXT);",
    tags: ["DDL", "CREATE TABLE", "Datentyp", "Debugging"],
    hints: [
      "Preise sollten als REAL (Fliesskommazahl) gespeichert werden, nicht als TEXT.",
      "TEXT wuerde alphabetische statt numerische Sortierung ergeben."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='angebote';",
    hiddenTestMode: "rows",
  })
);