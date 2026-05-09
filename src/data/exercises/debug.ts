/**
 * Debug-Uebungen.
 * Enthaelt Uebungen, bei denen fehlerhafte SQL-Abfragen korrigiert werden muessen.
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
import { universityDataset } from "@/data/datasets/university";
import { ecommerceDataset } from "@/data/datasets/ecommerce";
import { hospitalDataset } from "@/data/datasets/hospital";

export const debugExercises: Exercise[] = [];
resetCounter();
debugExercises.push(
  makeDebugExercise("dbg", {
    title: "Query in kunden reparieren",
    description: "Die folgende Query hat einen Fehler. Korrigiere sie so, dass sie das gewuenschte Ergebnis liefert.\\n\\nFehlerhaft: `SELECT name, stadt FROM kunden WHERE stadt = 'Berlin' AND stadt = 'Muenchen';`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "shop",
    brokenQuery: `SELECT name, stadt FROM kunden WHERE stadt = 'Berlin' AND stadt = 'Muenchen';`,
    referenceQuery: `SELECT name, stadt FROM kunden WHERE stadt = 'Berlin' OR stadt = 'Muenchen';`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Eine Spalte kann nicht gleichzeitig zwei verschiedene Werte haben — du brauchst eine andere logische Verknuepfung.",
      "Verwende `WHERE spalte = 'wert1' OR spalte = 'wert2'` fuer alternative Bedingungen.",
      "Der Fehler liegt bei `AND`: Ersetze es durch `OR`, sodass die Bedingung lautet `WHERE stadt = 'Berlin' OR stadt = 'Muenchen'`."
    ],
    hiddenTestQuery: `SELECT name, stadt FROM kunden WHERE stadt = 'Berlin' OR stadt = 'Muenchen';`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query in produkte reparieren",
    description: "Die folgende Query hat einen Fehler. Korrigiere sie so, dass sie das gewuenschte Ergebnis liefert.\\n\\nFehlerhaft: `SELECT name FROM produkte WHERE preis > 100 ORDER preis DESC;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "shop",
    brokenQuery: `SELECT name FROM produkte WHERE preis > 100 ORDER preis DESC;`,
    referenceQuery: `SELECT name FROM produkte WHERE preis > 100 ORDER BY preis DESC;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Die Sortieranweisung ist unvollstaendig — schau genau, wie ORDER BY korrekt geschrieben wird.",
      "Die vollstaendige Syntax lautet `ORDER BY spaltenname ASC|DESC`.",
      "Der Fehler liegt bei `ORDER preis DESC` — das Schluesselwort `BY` fehlt. Schreibe `ORDER BY preis DESC`."
    ],
    hiddenTestQuery: `SELECT name FROM produkte WHERE preis > 100 ORDER BY preis DESC;`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query in workouts reparieren",
    description: "Die folgende Query hat einen Fehler. Korrigiere sie so, dass sie das gewuenschte Ergebnis liefert.\\n\\nFehlerhaft: `SELECT nutzer_id, SUM(dauer_min) FROM workouts GROUP nutzer_id;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "fitness",
    brokenQuery: `SELECT nutzer_id, SUM(dauer_min) FROM workouts GROUP nutzer_id;`,
    referenceQuery: `SELECT nutzer_id, SUM(dauer_min) FROM workouts GROUP BY nutzer_id;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Aggregatfunktionen wie SUM erfordern eine Gruppierung — schau genau, wie GROUP BY geschrieben wird.",
      "Die korrekte Syntax lautet `GROUP BY spaltenname`.",
      "Der Fehler liegt bei `GROUP nutzer_id` — das Schluesselwort `BY` fehlt. Schreibe `GROUP BY nutzer_id`."
    ],
    hiddenTestQuery: `SELECT nutzer_id, SUM(dauer_min) FROM workouts GROUP BY nutzer_id;`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query in mitarbeiter reparieren",
    description: "Die folgende Query hat einen Fehler. Korrigiere sie so, dass sie das gewuenschte Ergebnis liefert.\\n\\nFehlerhaft: `SELECT name, position FROM mitarbeiter HAVING gehalt > 50000;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "hr",
    brokenQuery: `SELECT name, position FROM mitarbeiter HAVING gehalt > 50000;`,
    referenceQuery: `SELECT name, position FROM mitarbeiter WHERE gehalt > 50000;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "HAVING und WHERE haben unterschiedliche Einsatzgebiete — wann kommt welches?",
      "`WHERE` filtert einzelne Zeilen vor der Aggregation, `HAVING` filtert Gruppen nach GROUP BY.",
      "Der Fehler liegt bei `HAVING` ohne GROUP BY — ohne Aggregation muss es `WHERE gehalt > 50000` heissen."
    ],
    hiddenTestQuery: `SELECT name, position FROM mitarbeiter WHERE gehalt > 50000;`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query in tickets reparieren",
    description: "Die folgende Query hat einen Fehler. Korrigiere sie so, dass sie das gewuenschte Ergebnis liefert.\\n\\nFehlerhaft: `SELECT titel, status FROM tickets WHERE status = 'offen' OR status = 'bearbeitung' AND prioritaet = 'hoch';`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "tickets",
    brokenQuery: `SELECT titel, status FROM tickets WHERE status = 'offen' OR status = 'bearbeitung' AND prioritaet = 'hoch';`,
    referenceQuery: `SELECT titel, status FROM tickets WHERE (status = 'offen' OR status = 'bearbeitung') AND prioritaet = 'hoch';`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Achte auf die Reihenfolge der logischen Operatoren — AND und OR werden nicht gleich gewichtet.",
      "AND hat hoehere Prioritaet als OR, daher werden zusammengehoerige OR-Teile mit Klammern gruppiert: `(A OR B) AND C`.",
      "Der Fehler liegt in der fehlenden Klammerung: `status = 'offen' OR status = 'bearbeitung'` muss in Klammern gesetzt werden, damit AND korrekt wirkt."
    ],
    hiddenTestQuery: `SELECT titel, status FROM tickets WHERE (status = 'offen' OR status = 'bearbeitung') AND prioritaet = 'hoch';`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query in transaktionen reparieren",
    description: "Die folgende Query hat einen Fehler. Korrigiere sie so, dass sie das gewuenschte Ergebnis liefert.\\n\\nFehlerhaft: `SELECT konto_id, SUM(betrag) FROM transaktionen WHERE typ = 'ausgang';`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "banking",
    brokenQuery: `SELECT konto_id, SUM(betrag) FROM transaktionen WHERE typ = 'ausgang';`,
    referenceQuery: `SELECT konto_id, SUM(betrag) FROM transaktionen WHERE typ = 'ausgang' GROUP BY konto_id;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Wenn du eine nicht-aggregierte Spalte neben einer Aggregatfunktion verwendest, muss etwas fehlen.",
      "Immer wenn SUM(), COUNT() oder AVG() zusammen mit anderen Spalten stehen, braucht es `GROUP BY` fuer diese Spalten.",
      "Der Fehler: `konto_id` im SELECT erfordert `GROUP BY konto_id` am Ende der Query."
    ],
    hiddenTestQuery: `SELECT konto_id, SUM(betrag) FROM transaktionen WHERE typ = 'ausgang' GROUP BY konto_id;`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query in filme reparieren",
    description: "Die folgende Query hat einen Fehler. Korrigiere sie so, dass sie das gewuenschte Ergebnis liefert.\\n\\nFehlerhaft: `SELECT titel FROM filme WHERE jahr > 2000 AND genre = 'Drama' OR genre = 'Action';`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "streaming",
    brokenQuery: `SELECT titel FROM filme WHERE jahr > 2000 AND genre = 'Drama' OR genre = 'Action';`,
    referenceQuery: `SELECT titel FROM filme WHERE jahr > 2000 AND (genre = 'Drama' OR genre = 'Action');`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Die Jahresbedingung soll fuer beide Genres gelten — pruefte, ob das ohne Klammern wirklich so interpretiert wird.",
      "AND bindet staerker als OR. Ohne Klammern liest SQL: `(jahr > 2000 AND genre = 'Drama') OR genre = 'Action'`.",
      "Klammere den OR-Teil: `WHERE jahr > 2000 AND (genre = 'Drama' OR genre = 'Action')`."
    ],
    hiddenTestQuery: `SELECT titel FROM filme WHERE jahr > 2000 AND (genre = 'Drama' OR genre = 'Action');`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query in events reparieren",
    description: "Die folgende Query hat einen Fehler. Korrigiere sie so, dass sie das gewuenschte Ergebnis liefert.\\n\\nFehlerhaft: `SELECT session_id, COUNT(*) FROM events GROUP BY session_id HAVING COUNT > 5;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "logs",
    brokenQuery: `SELECT session_id, COUNT(*) FROM events GROUP BY session_id HAVING COUNT > 5;`,
    referenceQuery: `SELECT session_id, COUNT(*) AS anzahl FROM events GROUP BY session_id HAVING COUNT(*) > 5;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "COUNT allein ist kein gueltiger Ausdruck — Aggregatfunktionen brauchen immer ein Argument.",
      "Schreibe Aggregatfunktionen immer mit Klammern: `COUNT(*)`, `SUM(spalte)`, `AVG(spalte)`.",
      "Der Fehler liegt bei `HAVING COUNT > 5` — schreibe `HAVING COUNT(*) > 5`, damit der Ausdruck gueltig ist."
    ],
    hiddenTestQuery: `SELECT session_id, COUNT(*) AS anzahl FROM events GROUP BY session_id HAVING COUNT(*) > 5;`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query reparieren (shop)",
    description: "Korrigiere die fehlerhafte Query.\\n\\nFehlerhaft: `SELECT * FROM kunden ORDER BY name;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "shop",
    brokenQuery: `SELECT * FROM kunden ORDER BY name;`,
    referenceQuery: `SELECT * FROM kunden ORDER BY name ASC;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "ORDER BY sortiert standardmaessig in einer bestimmten Richtung — welche fehlt hier zur Klarheit?",
      "Fuge `ASC` oder `DESC` nach dem Spaltennamen hinzu, um die Sortierrichtung explizit anzugeben.",
      "Ergaenze `ASC` nach `name`: `ORDER BY name ASC` — so ist die aufsteigende Sortierung explizit und eindeutig."
    ],
    hiddenTestQuery: `SELECT * FROM kunden ORDER BY name ASC;`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query reparieren (hr)",
    description: "Korrigiere die fehlerhafte Query.\\n\\nFehlerhaft: `SELECT abteilung_id, AVG(gehalt) FROM mitarbeiter;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "hr",
    brokenQuery: `SELECT abteilung_id, AVG(gehalt) FROM mitarbeiter;`,
    referenceQuery: `SELECT abteilung_id, AVG(gehalt) FROM mitarbeiter GROUP BY abteilung_id;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Wenn du AVG() pro Gruppe berechnen willst, muss SQL wissen, wie die Gruppen gebildet werden.",
      "Jede nicht-aggregierte Spalte im SELECT muss im `GROUP BY` stehen.",
      "Der Fehler: `abteilung_id` im SELECT ohne `GROUP BY abteilung_id` am Ende — ergaenze `GROUP BY abteilung_id`."
    ],
    hiddenTestQuery: `SELECT abteilung_id, AVG(gehalt) FROM mitarbeiter GROUP BY abteilung_id;`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query reparieren (fitness)",
    description: "Korrigiere die fehlerhafte Query.\\n\\nFehlerhaft: `SELECT name FROM nutzer WHERE gewicht_kg = NULL;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "fitness",
    brokenQuery: `SELECT name FROM nutzer WHERE gewicht_kg = NULL;`,
    referenceQuery: `SELECT name FROM nutzer WHERE gewicht_kg IS NULL;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "NULL ist kein normaler Wert — es repraesentiert das Fehlen eines Wertes. Wie prueft man auf fehlende Werte in SQL?",
      "NULL kann nicht mit `=` verglichen werden. Verwende stattdessen `IS NULL` oder `IS NOT NULL`.",
      "Ersetze `gewicht_kg = NULL` durch `gewicht_kg IS NULL` — nur so erkennt SQL fehlende Eintraege korrekt."
    ],
    hiddenTestQuery: `SELECT name FROM nutzer WHERE gewicht_kg IS NULL;`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query reparieren (tickets)",
    description: "Korrigiere die fehlerhafte Query.\\n\\nFehlerhaft: `SELECT titel FROM tickets WHERE prioritaet IN ('hoch', 'kritisch';`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "tickets",
    brokenQuery: `SELECT titel FROM tickets WHERE prioritaet IN ('hoch', 'kritisch';`,
    referenceQuery: `SELECT titel FROM tickets WHERE prioritaet IN ('hoch', 'kritisch');`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Schau genau auf das Ende der WHERE-Bedingung — stimmt die Klammerung?",
      "`IN (wert1, wert2)` erfordert eine schliessende Klammer nach der Werteliste.",
      "Der Fehler: die schliessende Klammer `)` nach `'kritisch'` fehlt — schreibe `IN ('hoch', 'kritisch')`."
    ],
    hiddenTestQuery: `SELECT titel FROM tickets WHERE prioritaet IN ('hoch', 'kritisch');`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query reparieren (banking)",
    description: "Korrigiere die fehlerhafte Query.\\n\\nFehlerhaft: `SELECT k.name, k.saldo FROM kunden k JOIN konten k ON k.id = k.kunde_id;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "banking",
    brokenQuery: `SELECT k.name, k.saldo FROM kunden k JOIN konten k ON k.id = k.kunde_id;`,
    referenceQuery: `SELECT k.name, ko.saldo FROM kunden k JOIN konten ko ON k.id = ko.kunde_id;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Wenn zwei Tabellen denselben Alias bekommen, kann SQL nicht mehr unterscheiden, welche Tabelle gemeint ist.",
      "Vergib jedem Tabellen-Alias einen eindeutigen Kuerzel, z.B. `k` fuer kunden und `ko` fuer konten.",
      "Der Fehler: beide Tabellen haben Alias `k`. Aendere `JOIN konten k` zu `JOIN konten ko` und passe alle Referenzen auf `ko` an."
    ],
    hiddenTestQuery: `SELECT k.name, ko.saldo FROM kunden k JOIN konten ko ON k.id = ko.kunde_id;`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query reparieren (streaming)",
    description: "Korrigiere die fehlerhafte Query.\\n\\nFehlerhaft: `SELECT * FROM filme WHERE bewertung > 4.5;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "streaming",
    brokenQuery: `SELECT * FROM filme WHERE bewertung > 4.5;`,
    referenceQuery: `SELECT * FROM filme WHERE bewertung > 4.5;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Vergleiche die Query sorgfaeltig mit der Aufgabenstellung — ist wirklich etwas falsch?",
      "Manchmal ist eine Query korrekt — pruefe, ob SELECT, FROM, WHERE und die Bedingung alle stimmen.",
      "Diese Query ist syntaktisch korrekt: `SELECT * FROM filme WHERE bewertung > 4.5` hat keinen Fehler. Manchmal ist keine Korrektur noetig."
    ],
    hiddenTestQuery: `SELECT * FROM filme WHERE bewertung > 4.5;`,
    hiddenTestMode: "rows",
  }),

  makeDebugExercise("dbg", {
    title: "Query reparieren (logs)",
    description: "Korrigiere die fehlerhafte Query.\\n\\nFehlerhaft: `SELECT event_typ FROM events WHERE dauer_ms > 200 AND < 400;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "logs",
    brokenQuery: `SELECT event_typ FROM events WHERE dauer_ms > 200 AND < 400;`,
    referenceQuery: `SELECT event_typ FROM events WHERE dauer_ms > 200 AND dauer_ms < 400;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Jeder Vergleich braucht einen vollstaendigen Ausdruck — schau, ob im zweiten Teil etwas fehlt.",
      "SQL erfordert bei jeder Bedingung: `spaltenname operator wert`. Der Spaltenname darf nicht weggelassen werden.",
      "Der Fehler: `AND < 400` hat keinen Spaltennamen. Schreibe `AND dauer_ms < 400`."
    ],
    hiddenTestQuery: `SELECT event_typ FROM events WHERE dauer_ms > 200 AND dauer_ms < 400;`,
    hiddenTestMode: "rows",
  })
);

debugExercises.push(
  makeDebugExercise("dbg", {
    title: "Fehlendes DISTINCT reparieren",
    description: "Die Query soll eindeutige Staedte ausgeben, aber DISTINCT fehlt.\\n\\nFehlerhaft: `SELECT stadt FROM kunden;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT stadt FROM kunden;",
    referenceQuery: "SELECT DISTINCT stadt FROM kunden;",
    hints: [
      "Die Query soll jede Stadt nur einmal ausgeben — was fehlt, damit Duplikate entfernt werden?",
      "Mit dem Schluesselwort `DISTINCT` direkt nach `SELECT` werden doppelte Zeilen im Ergebnis entfernt.",
      "Der Fehler: `DISTINCT` fehlt. Schreibe `SELECT DISTINCT stadt FROM kunden;`."
    ],
    hiddenTestQuery: "SELECT DISTINCT stadt FROM kunden;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Falscher JOIN-Typ",
    description: "Die Query soll alle Kunden zeigen, auch ohne Bestellung.\\n\\nFehlerhaft: `SELECT kunden.name, bestellungen.gesamtbetrag FROM kunden INNER JOIN bestellungen ON kunden.id = bestellungen.kunde_id;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT kunden.name, bestellungen.gesamtbetrag FROM kunden INNER JOIN bestellungen ON kunden.id = bestellungen.kunde_id;",
    referenceQuery: "SELECT kunden.name, bestellungen.gesamtbetrag FROM kunden LEFT JOIN bestellungen ON kunden.id = bestellungen.kunde_id;",
    hints: [
      "Kunden ohne Bestellungen sollen trotzdem erscheinen — welcher JOIN-Typ behalt alle Zeilen der linken Tabelle?",
      "`INNER JOIN` zeigt nur Zeilen mit Treffer in beiden Tabellen. `LEFT JOIN` behaelt alle Zeilen der linken Tabelle, auch ohne Treffer.",
      "Ersetze `INNER JOIN` durch `LEFT JOIN`, damit Kunden ohne Bestellungen mit `NULL` im Betrag angezeigt werden."
    ],
    hiddenTestQuery: "SELECT kunden.name, bestellungen.gesamtbetrag FROM kunden LEFT JOIN bestellungen ON kunden.id = bestellungen.kunde_id;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "GROUP BY mit Nicht-Aggregatspalte",
    description: "Die Spalte `name` steht nicht im GROUP BY.\\n\\nFehlerhaft: `SELECT name, abteilung_id, COUNT(*) FROM mitarbeiter GROUP BY abteilung_id;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: hrDataset.id,
    brokenQuery: "SELECT name, abteilung_id, COUNT(*) FROM mitarbeiter GROUP BY abteilung_id;",
    referenceQuery: "SELECT abteilung_id, COUNT(*) FROM mitarbeiter GROUP BY abteilung_id;",
    hints: [
      "Alle Spalten im SELECT, die nicht aggregiert werden, muessen auch in der GROUP BY-Klausel stehen.",
      "Entweder `name` aus dem SELECT entfernen, oder es in `GROUP BY` aufnehmen — je nach Ziel.",
      "Der Fehler: `name` ist nicht aggregiert und nicht im `GROUP BY`. Entferne `name` aus dem SELECT fuer das gewuenschte Ergebnis."
    ],
    hiddenTestQuery: "SELECT abteilung_id, COUNT(*) FROM mitarbeiter GROUP BY abteilung_id;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "HAVING ohne GROUP BY",
    description: "HAVING wird ohne GROUP BY verwendet.\\n\\nFehlerhaft: `SELECT * FROM produkte HAVING preis > 100;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT * FROM produkte HAVING preis > 100;",
    referenceQuery: "SELECT * FROM produkte WHERE preis > 100;",
    hints: [
      "HAVING filtert nach einer Aggregation — aber hier gibt es gar keine Aggregation. Welche Klausel filtert einzelne Zeilen?",
      "`WHERE` filtert Zeilen vor der Gruppierung, `HAVING` filtert Gruppen nach GROUP BY — ohne GROUP BY muss es WHERE sein.",
      "Ersetze `HAVING preis > 100` durch `WHERE preis > 100`."
    ],
    hiddenTestQuery: "SELECT * FROM produkte WHERE preis > 100;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fehlendes Semi-Kolon",
    description: "Die Query hat keinen abschliessenden Semikolon.\\n\\nFehlerhaft: `SELECT name, email FROM kunden`",
    difficulty: "beginner",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT name, email FROM kunden",
    referenceQuery: "SELECT name, email FROM kunden;",
    hints: [
      "Schau ans Ende der Query — fehlt dort etwas?",
      "SQL-Anweisungen sollten mit einem Semikolon (`;`) abgeschlossen werden.",
      "Fuege `;` am Ende hinzu: `SELECT name, email FROM kunden;`."
    ],
    hiddenTestQuery: "SELECT name, email FROM kunden;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Falscher Tabellenname",
    description: "Der Tabellenname ist falsch geschrieben.\\n\\nFehlerhaft: `SELECT * FROM kunde;`",
    difficulty: "beginner",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT * FROM kunde;",
    referenceQuery: "SELECT * FROM kunden;",
    hints: [
      "SQL Tabellennamen muessen exakt dem Datenbank-Schema entsprechen — schau, ob der Name stimmt.",
      "Pruefen das Schema: Wie lautet der exakte Tabellenname?",
      "Der Fehler: Die Tabelle heisst `kunden`, nicht `kunde`. Schreibe `SELECT * FROM kunden;`."
    ],
    hiddenTestQuery: "SELECT * FROM kunden;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "OR vs AND Logikfehler",
    description: "AND wurde statt OR verwendet.\\n\\nFehlerhaft: `SELECT name FROM produkte WHERE preis < 20 AND preis > 500;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT name FROM produkte WHERE preis < 20 AND preis > 500;",
    referenceQuery: "SELECT name FROM produkte WHERE preis < 20 OR preis > 500;",
    hints: [
      "Denk logisch: Kann ein Preis gleichzeitig unter 20 UND ueber 500 sein?",
      "Fuer zwei sich ausschliessende Bereiche, bei denen einer von beiden zutreffen soll, verwende `OR`.",
      "Ersetze `AND` durch `OR`: `WHERE preis < 20 OR preis > 500`."
    ],
    hiddenTestQuery: "SELECT name FROM produkte WHERE preis < 20 OR preis > 500;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Falsche Aggregation ohne Alias",
    description: "Die Aggregationsspalte hat keinen Alias und die Query ist schwer lesbar.\\n\\nFehlerhaft: `SELECT kategorie_id, COUNT(*) FROM produkte GROUP BY kategorie_id;`",
    difficulty: "beginner",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT kategorie_id, COUNT(*) FROM produkte GROUP BY kategorie_id;",
    referenceQuery: "SELECT kategorie_id, COUNT(*) AS anzahl FROM produkte GROUP BY kategorie_id;",
    hints: [
      "Die Spaltenbezeichnung im Ergebnis ist automatisch generiert und schlecht lesbar — wie kann man das verbessern?",
      "Verwende `AS alias` nach einem Ausdruck, um der Ergebnisspalte einen lesbaren Namen zu geben.",
      "Ergaenze `AS anzahl` nach `COUNT(*)`: `COUNT(*) AS anzahl`."
    ],
    hiddenTestQuery: "SELECT kategorie_id, COUNT(*) AS anzahl FROM produkte GROUP BY kategorie_id;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "ASC/DESC fehlt",
    description: "Die Sortierrichtung ist unklar.\\n\\nFehlerhaft: `SELECT name, preis FROM produkte ORDER BY preis;`",
    difficulty: "beginner",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT name, preis FROM produkte ORDER BY preis;",
    referenceQuery: "SELECT name, preis FROM produkte ORDER BY preis ASC;",
    hints: [
      "Die Sortierrichtung ist nicht angegeben — SQL sortiert dann nach einer Standardregel. Was ist expliziter?",
      "`ASC` (aufsteigend) ist der Standardwert, aber guter SQL-Stil schreibt ihn immer explizit aus.",
      "Ergaenze `ASC` nach `preis`: `ORDER BY preis ASC`."
    ],
    hiddenTestQuery: "SELECT name, preis FROM produkte ORDER BY preis ASC;",
    hiddenTestMode: "exact",
  }),
  makeDebugExercise("dbg", {
    title: "COUNT ohne * reparieren",
    description: "COUNT wurde ohne * verwendet.\\n\\nFehlerhaft: `SELECT COUNT FROM kunden;`",
    difficulty: "beginner",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT COUNT FROM kunden;",
    referenceQuery: "SELECT COUNT(*) AS anzahl FROM kunden;",
    hints: [
      "COUNT ist keine Spalte — es ist eine Funktion. Wie werden Funktionen in SQL aufgerufen?",
      "Funktionen brauchen immer Klammern mit Argument: `COUNT(*)` zaehlt alle Zeilen.",
      "Schreibe `COUNT(*) AS anzahl` statt `COUNT` — `COUNT(*)` zaehlt alle Zeilen der Tabelle."
    ],
    hiddenTestQuery: "SELECT COUNT(*) AS anzahl FROM kunden;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "NULL-Vergleich reparieren",
    description: "NULL wurde mit = verglichen.\\n\\nFehlerhaft: `SELECT * FROM tickets WHERE agent_id = NULL;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: ticketsDataset.id,
    brokenQuery: "SELECT * FROM tickets WHERE agent_id = NULL;",
    referenceQuery: "SELECT * FROM tickets WHERE agent_id IS NULL;",
    hints: [
      "NULL bedeutet 'unbekannt' — ein Vergleich mit `=` ergibt immer 'unbekannt', nicht 'wahr'.",
      "Fuer NULL-Pruefungen gibt es in SQL spezielle Operatoren: `IS NULL` und `IS NOT NULL`.",
      "Ersetze `agent_id = NULL` durch `agent_id IS NULL` in der tickets-Tabelle."
    ],
    hiddenTestQuery: "SELECT * FROM tickets WHERE agent_id IS NULL;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fehlendes Komma in SELECT",
    description: "Das Komma zwischen zwei Spalten fehlt.\\n\\nFehlerhaft: `SELECT name preis FROM produkte;`",
    difficulty: "beginner",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT name preis FROM produkte;",
    referenceQuery: "SELECT name, preis FROM produkte;",
    hints: [
      "SQL interpretiert `name preis` als Spalte `name` mit Alias `preis` — ist das die Absicht?",
      "Mehrere Spalten im SELECT werden mit Komma getrennt: `SELECT spalte1, spalte2`.",
      "Fuege ein Komma zwischen `name` und `preis` ein: `SELECT name, preis FROM produkte;`."
    ],
    hiddenTestQuery: "SELECT name, preis FROM produkte;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "WHERE statt HAVING",
    description: "WHERE wurde statt HAVING verwendet.\\n\\nFehlerhaft: `SELECT kategorie_id, COUNT(*) AS anzahl FROM produkte GROUP BY kategorie_id WHERE COUNT(*) > 2;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT kategorie_id, COUNT(*) AS anzahl FROM produkte GROUP BY kategorie_id WHERE COUNT(*) > 2;",
    referenceQuery: "SELECT kategorie_id, COUNT(*) AS anzahl FROM produkte GROUP BY kategorie_id HAVING COUNT(*) > 2;",
    hints: [
      "Du willst Gruppen filtern, nicht einzelne Zeilen — welche Klausel filtert nach einer Aggregation?",
      "`WHERE` kommt vor `GROUP BY` und kennt keine Aggregatfunktionen. `HAVING` kommt danach und kann `COUNT()` verwenden.",
      "Ersetze `WHERE COUNT(*) > 2` durch `HAVING COUNT(*) > 2` — HAVING steht nach GROUP BY."
    ],
    hiddenTestQuery: "SELECT kategorie_id, COUNT(*) AS anzahl FROM produkte GROUP BY kategorie_id HAVING COUNT(*) > 2;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "LIKE ohne Wildcard",
    description: "LIKE wurde ohne Platzhalter verwendet.\\n\\nFehlerhaft: `SELECT name FROM kunden WHERE name LIKE 'M';`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT name FROM kunden WHERE name LIKE 'M';",
    referenceQuery: "SELECT name FROM kunden WHERE name LIKE 'M%';",
    hints: [
      "`LIKE 'M'` sucht nach exakt dem Buchstaben 'M' — was brauchst du, damit alles mit M-Anfang gefunden wird?",
      "`%` ist der Wildcard-Platzhalter in SQL LIKE — er steht fuer beliebig viele Zeichen.",
      "Ergaenze `%` nach `M`: `WHERE name LIKE 'M%'` — so werden alle Namen gefunden, die mit 'M' beginnen."
    ],
    hiddenTestQuery: "SELECT name FROM kunden WHERE name LIKE 'M%';",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "JOIN ON Bedingung fehlt",
    description: "Der JOIN hat keine ON-Bedingung.\\n\\nFehlerhaft: `SELECT * FROM kunden JOIN bestellungen;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT * FROM kunden JOIN bestellungen;",
    referenceQuery: "SELECT * FROM kunden JOIN bestellungen ON kunden.id = bestellungen.kunde_id;",
    hints: [
      "Ein JOIN ohne Bedingung verbindet jede Zeile der ersten Tabelle mit jeder Zeile der zweiten — das ist meistens falsch.",
      "Jeder JOIN braucht eine `ON`-Klausel, die angibt, wie die Tabellen verbunden werden.",
      "Ergaenze `ON kunden.id = bestellungen.kunde_id` nach dem Tabellennamen `bestellungen`."
    ],
    hiddenTestQuery: "SELECT * FROM kunden JOIN bestellungen ON kunden.id = bestellungen.kunde_id;",
    hiddenTestMode: "rows",
  })
);

debugExercises.push(
  makeDebugExercise("dbg", {
    title: "Falsches JOIN bei Studenten und Kursen",
    description: "Die Query soll alle Studenten zeigen, auch solche ohne Einschreibung. Korrigiere den JOIN-Typ.\\n\\nFehlerhaft: `SELECT s.name, e.note FROM studenten s INNER JOIN einschreibungen e ON s.id = e.student_id;`",
    difficulty: "intermediate",
    category: "Debugging",
    datasetId: universityDataset.id,
    brokenQuery: "SELECT s.name, e.note FROM studenten s INNER JOIN einschreibungen e ON s.id = e.student_id;",
    referenceQuery: "SELECT s.name, e.note FROM studenten s LEFT JOIN einschreibungen e ON s.id = e.student_id;",
    hints: [
      "Alle Studenten sollen erscheinen, auch ohne Einschreibung — welcher JOIN-Typ behalt alle Zeilen der linken Tabelle?",
      "`INNER JOIN` gibt nur Studenten mit passenden Einschreibungen zurueck. `LEFT JOIN` behaelt alle Studenten.",
      "Ersetze `INNER JOIN` durch `LEFT JOIN`: `FROM studenten s LEFT JOIN einschreibungen e ON s.id = e.student_id`."
    ],
    hiddenTestQuery: "SELECT s.name, e.note FROM studenten s LEFT JOIN einschreibungen e ON s.id = e.student_id;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fehlendes Semikolon (Universität)",
    description: "Die Query hat keinen abschliessenden Semikolon.\\n\\nFehlerhaft: `SELECT name, semester FROM studenten`",
    difficulty: "beginner",
    category: "Debugging",
    datasetId: universityDataset.id,
    brokenQuery: "SELECT name, semester FROM studenten",
    referenceQuery: "SELECT name, semester FROM studenten;",
    hints: [
      "Schau ans Ende der Query — fehlt das abschliessende Zeichen?",
      "SQL-Anweisungen werden mit einem Semikolon (`;`) abgeschlossen.",
      "Ergaenze `;` am Ende: `SELECT name, semester FROM studenten;`."
    ],
    hiddenTestQuery: "SELECT name, semester FROM studenten;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Falsche WHERE-Bedingung mit NULL",
    description: "Die Abfrage sucht unbezahlte Rechnungen, aber der NULL-Vergleich ist falsch.\\n\\nFehlerhaft: `SELECT * FROM rechnungen WHERE faelligkeitsdatum = NULL;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: hospitalDataset.id,
    brokenQuery: "SELECT * FROM rechnungen WHERE faelligkeitsdatum = NULL;",
    referenceQuery: "SELECT * FROM rechnungen WHERE faelligkeitsdatum IS NULL;",
    hints: [
      "NULL ist kein Wert — es bedeutet 'kein Eintrag vorhanden'. Wie prueft man auf fehlende Werte?",
      "In SQL gibt es fuer NULL-Pruefungen den Operator `IS NULL` (bzw. `IS NOT NULL`).",
      "Ersetze `faelligkeitsdatum = NULL` durch `faelligkeitsdatum IS NULL`."
    ],
    hiddenTestQuery: "SELECT * FROM rechnungen WHERE faelligkeitsdatum IS NULL;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "GROUP BY fehlt bei E-Commerce-Aggregation",
    description: "Die Aggregation hat kein GROUP BY.\\n\\nFehlerhaft: `SELECT kategorie, AVG(preis) FROM produkte;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: ecommerceDataset.id,
    brokenQuery: "SELECT kategorie, AVG(preis) FROM produkte;",
    referenceQuery: "SELECT kategorie, AVG(preis) AS avg_preis FROM produkte GROUP BY kategorie;",
    hints: [
      "Du willst den Durchschnittspreis pro Kategorie — SQL muss wissen, wie die Gruppen gebildet werden.",
      "Wenn `AVG()` mit einer nicht-aggregierten Spalte kombiniert wird, ist `GROUP BY` fuer diese Spalte Pflicht.",
      "Ergaenze `GROUP BY kategorie` am Ende und optional `AS avg_preis` nach `AVG(preis)`."
    ],
    hiddenTestQuery: "SELECT kategorie, AVG(preis) AS avg_preis FROM produkte GROUP BY kategorie;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Falsche Spaltenreihenfolge in ORDER BY",
    description: "Die Sortierung ist aufsteigend statt absteigend.\\n\\nFehlerhaft: `SELECT name, gehalt FROM mitarbeiter ORDER BY gehalt;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: hrDataset.id,
    brokenQuery: "SELECT name, gehalt FROM mitarbeiter ORDER BY gehalt;",
    referenceQuery: "SELECT name, gehalt FROM mitarbeiter ORDER BY gehalt DESC;",
    hints: [
      "Ohne Sortierrichtung wird standardmaessig aufsteigend sortiert — die Aufgabe verlangt aber absteigend.",
      "`ASC` = aufsteigend (Standard), `DESC` = absteigend. Fuge `DESC` nach dem Spaltennamen hinzu.",
      "Ergaenze `DESC` nach `gehalt`: `ORDER BY gehalt DESC` — so erscheint das hoechste Gehalt zuerst."
    ],
    hiddenTestQuery: "SELECT name, gehalt FROM mitarbeiter ORDER BY gehalt DESC;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Doppelter Tabellenalias (E-Commerce)",
    description: "Zwei Tabellen verwenden denselben Alias.\\n\\nFehlerhaft: `SELECT k.name, k.gesamtbetrag FROM kunden k JOIN bestellungen k ON k.id = k.kunde_id;`",
    difficulty: "intermediate",
    category: "Debugging",
    datasetId: ecommerceDataset.id,
    brokenQuery: "SELECT k.name, k.gesamtbetrag FROM kunden k JOIN bestellungen k ON k.id = k.kunde_id;",
    referenceQuery: "SELECT k.name, b.gesamtbetrag FROM kunden k JOIN bestellungen b ON k.id = b.kunde_id;",
    hints: [
      "Wenn zwei Tabellen denselben Alias haben, kann SQL bei `k.name` nicht entscheiden, aus welcher Tabelle die Spalte kommt.",
      "Vergib jeden Alias nur einmal: z.B. `k` fuer kunden und `b` fuer bestellungen.",
      "Aendere `JOIN bestellungen k` zu `JOIN bestellungen b` und passe SELECT und ON entsprechend auf `b` an."
    ],
    hiddenTestQuery: "SELECT k.name, b.gesamtbetrag FROM kunden k JOIN bestellungen b ON k.id = b.kunde_id;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Falsche Comparison-Operatoren",
    description: "SQL verwendet <> statt != fuer Ungleichheit in manchen Dialekten. Die Query soll Patienten ohne Versicherung finden.\\n\\nFehlerhaft: `SELECT name FROM patienten WHERE versichert != 0;`",
    difficulty: "beginner",
    category: "Debugging",
    datasetId: hospitalDataset.id,
    brokenQuery: "SELECT name FROM patienten WHERE versichert != 0;",
    referenceQuery: "SELECT name FROM patienten WHERE versichert = 0;",
    hints: [
      "Lies die Aufgabenstellung genau: Sollen versicherte oder unversicherte Patienten gezeigt werden?",
      "`!= 0` bedeutet 'nicht null' — also alle Versicherten. Die Aufgabe will aber Patienten OHNE Versicherung.",
      "Ersetze `!= 0` durch `= 0`: `WHERE versichert = 0` — so werden nur unversicherte Patienten gezeigt."
    ],
    hiddenTestQuery: "SELECT name FROM patienten WHERE versichert = 0;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fehlender Tabellenalias im SELECT",
    description: "Die Spalte ambiguity: name kommt in beiden Tabellen vor.\\n\\nFehlerhaft: `SELECT name, titel FROM tickets INNER JOIN kategorien ON tickets.kategorie_id = kategorien.id;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: ticketsDataset.id,
    brokenQuery: "SELECT name, titel FROM tickets INNER JOIN kategorien ON tickets.kategorie_id = kategorien.id;",
    referenceQuery: "SELECT tickets.titel, kategorien.name AS kategorie FROM tickets INNER JOIN kategorien ON tickets.kategorie_id = kategorien.id;",
    hints: [
      "Wenn dieselbe Spalte in mehreren Tabellen vorkommt, muss SQL wissen, aus welcher Tabelle sie stammt.",
      "Qualifiziere Spaltennamen mit dem Tabellennamen: `tabelle.spalte` — bei JOINs ist das besonders wichtig.",
      "Ersetze `name, titel` durch `tickets.titel, kategorien.name AS kategorie` um Mehrdeutigkeiten aufzuloesen."
    ],
    hiddenTestQuery: "SELECT tickets.titel, kategorien.name AS kategorie FROM tickets INNER JOIN kategorien ON tickets.kategorie_id = kategorien.id;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "HAVING statt WHERE (Universität)",
    description: "HAVING wird vor GROUP BY verwendet, aber es sollte WHERE sein.\\n\\nFehlerhaft: `SELECT studiengang, COUNT(*) FROM studenten HAVING semester > 2 GROUP BY studiengang;`",
    difficulty: "intermediate",
    category: "Debugging",
    datasetId: universityDataset.id,
    brokenQuery: "SELECT studiengang, COUNT(*) FROM studenten HAVING semester > 2 GROUP BY studiengang;",
    referenceQuery: "SELECT studiengang, COUNT(*) FROM studenten WHERE semester > 2 GROUP BY studiengang;",
    hints: [
      "Du willst einzelne Zeilen filtern (semester > 2), bevor Gruppen gebildet werden — welche Klausel macht das?",
      "Die korrekte SQL-Reihenfolge ist: `FROM ... WHERE ... GROUP BY ... HAVING`. HAVING muss nach GROUP BY stehen.",
      "Ersetze `HAVING semester > 2` durch `WHERE semester > 2` und stelle sicher, dass WHERE vor GROUP BY steht."
    ],
    hiddenTestQuery: "SELECT studiengang, COUNT(*) FROM studenten WHERE semester > 2 GROUP BY studiengang;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Falsche Reihenfolge SELECT-Klausel",
    description: "DISTINCT und COUNT sind falsch kombiniert.\\n\\nFehlerhaft: `SELECT DISTINCT COUNT(*) FROM bewertungen;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: ecommerceDataset.id,
    brokenQuery: "SELECT DISTINCT COUNT(*) FROM bewertungen;",
    referenceQuery: "SELECT COUNT(*) AS anzahl FROM bewertungen;",
    hints: [
      "DISTINCT und COUNT(*) zusammen ergeben keinen Sinn — warum?",
      "COUNT(*) liefert immer genau eine Zahl. DISTINCT auf eine einzelne Zahl hat keinerlei Effekt.",
      "Entferne `DISTINCT` und fuege einen Alias hinzu: `SELECT COUNT(*) AS anzahl FROM bewertungen;`."
    ],
    hiddenTestQuery: "SELECT COUNT(*) AS anzahl FROM bewertungen;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Falscher JOIN bei Behandlungen",
    description: "Der JOIN hat die falsche Richtung.\\n\\nFehlerhaft: `SELECT p.name, b.diagnose FROM behandlungen b INNER JOIN patienten p ON b.id = p.id;`",
    difficulty: "intermediate",
    category: "Debugging",
    datasetId: hospitalDataset.id,
    brokenQuery: "SELECT p.name, b.diagnose FROM behandlungen b INNER JOIN patienten p ON b.id = p.id;",
    referenceQuery: "SELECT p.name, b.diagnose FROM behandlungen b INNER JOIN patienten p ON b.patient_id = p.id;",
    hints: [
      "Der JOIN verbindet zwei Tabellen ueber ihre Beziehung — welche Spalte in `behandlungen` verweist auf `patienten`?",
      "Fremdschluessel heissen ueblicherweise `<tabelle>_id`, also `patient_id` in behandlungen, die auf `patienten.id` zeigt.",
      "Ersetze `ON b.id = p.id` durch `ON b.patient_id = p.id` — `behandlungen.patient_id` ist der Fremdschluessel."
    ],
    hiddenTestQuery: "SELECT p.name, b.diagnose FROM behandlungen b INNER JOIN patienten p ON b.patient_id = p.id;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Aggregate ohne Alias (Kurse)",
    description: "Die Aggregationsspalte hat keinen Alias und ist schwer lesbar.\\n\\nFehlerhaft: `SELECT professor_id, AVG(credits) FROM kurse GROUP BY professor_id;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: universityDataset.id,
    brokenQuery: "SELECT professor_id, AVG(credits) FROM kurse GROUP BY professor_id;",
    referenceQuery: "SELECT professor_id, AVG(credits) AS avg_credits FROM kurse GROUP BY professor_id;",
    hints: [
      "Die Ergebnisspalte fuer den Durchschnitt hat keinen sprechenden Namen — wie verbessert man das?",
      "Verwende `AS alias` nach einem Ausdruck, um der Spalte im Ergebnis einen lesbaren Namen zu geben.",
      "Ergaenze `AS avg_credits` nach `AVG(credits)`: `AVG(credits) AS avg_credits`."
    ],
    hiddenTestQuery: "SELECT professor_id, AVG(credits) AS avg_credits FROM kurse GROUP BY professor_id;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Falsche Klammersetzung in WHERE (E-Commerce)",
    description: "Die OR/AND Logik ist falsch geklammert.\\n\\nFehlerhaft: `SELECT name, preis FROM produkte WHERE preis > 50 OR kategorie = 'Elektronik' AND preis < 500;`",
    difficulty: "intermediate",
    category: "Debugging",
    datasetId: ecommerceDataset.id,
    brokenQuery: "SELECT name, preis FROM produkte WHERE preis > 50 OR kategorie = 'Elektronik' AND preis < 500;",
    referenceQuery: "SELECT name, preis FROM produkte WHERE (preis > 50 OR kategorie = 'Elektronik') AND preis < 500;",
    hints: [
      "Die Preisgrenze soll fuer beide Faelle gelten — pruefe, ob das ohne Klammern wirklich so interpretiert wird.",
      "AND bindet staerker als OR. Ohne Klammern liest SQL: `preis > 50 OR (kategorie = 'Elektronik' AND preis < 500)`.",
      "Klammere den OR-Teil: `WHERE (preis > 50 OR kategorie = 'Elektronik') AND preis < 500`."
    ],
    hiddenTestQuery: "SELECT name, preis FROM produkte WHERE (preis > 50 OR kategorie = 'Elektronik') AND preis < 500;",
    hiddenTestMode: "rows",
  })
);
