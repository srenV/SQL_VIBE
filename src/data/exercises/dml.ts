/**
 * DML-Uebungen (Data Manipulation Language).
 * Enthaelt Uebungen fuer INSERT, UPDATE und DELETE.
 */
import { makeWriteExercise, makeDebugExercise, makePredictExercise, resetCounter } from "@/data/exercises/_factory";
import type { Exercise } from "@/types/exercise";
import { shopDataset } from "@/data/datasets/shop";
import { fitnessDataset } from "@/data/datasets/fitness";
import { hrDataset } from "@/data/datasets/hr";
import { ticketsDataset } from "@/data/datasets/tickets";
import { bankingDataset } from "@/data/datasets/banking";
import { streamingDataset } from "@/data/datasets/streaming";
import { logsDataset } from "@/data/datasets/logs";

export const dmlExercises: Exercise[] = [];
resetCounter();
dmlExercises.push(
  makeWriteExercise("dml", {
    title: "INSERT: Neuen Kunden hinzufuegen",
    description: "Fuege einen neuen Kunden mit dem Namen 'Max Mustermann', der E-Mail 'max@beispiel.de' und der Stadt 'Berlin' in die Tabelle `kunden` ein.",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "INSERT INTO kunden (name, email, stadt) VALUES ('Max Mustermann', 'max@beispiel.de', 'Berlin');",
    tags: ["DML", "INSERT"],
    hints: [
      "Verwende `INSERT INTO tabelle (spalte1, spalte2, ...) VALUES (wert1, wert2, ...)`.",
      "Lass die `id`-Spalte weg, wenn sie automatisch vergeben wird (AUTO_INCREMENT)."
    ],
    hiddenTestQuery: "SELECT * FROM kunden WHERE name = 'Max Mustermann' AND email = 'max@beispiel.de';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "INSERT: Neuen Mitarbeiter anlegen",
    description: "Fuege einen neuen Mitarbeiter 'Anna Schmidt' in Abteilung 2 mit der Position 'Entwickler' und einem Gehalt von 55000 ein.",
    difficulty: "junior",
    category: "DML",
    datasetId: hrDataset.id,
    referenceQuery: "INSERT INTO mitarbeiter (name, abteilung_id, position, gehalt) VALUES ('Anna Schmidt', 2, 'Entwickler', 55000);",
    tags: ["DML", "INSERT"],
    hints: [
      "Gib alle Pflichtspalten im INSERT an.",
      "Die Reihenfolge der Spaltennamen muss mit den Werten uebereinstimmen."
    ],
    hiddenTestQuery: "SELECT * FROM mitarbeiter WHERE name = 'Anna Schmidt' AND position = 'Entwickler';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "INSERT: Neues Produkt erfassen",
    description: "Fuege das Produkt 'Bluetooth Lautsprecher' in Kategorie 1 mit Preis 79.99 und Lagerbestand 50 ein.",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "INSERT INTO produkte (name, kategorie_id, preis, lagerbestand) VALUES ('Bluetooth Lautsprecher', 1, 79.99, 50);",
    tags: ["DML", "INSERT"],
    hints: [
      "Dezimalwerte werden mit Punkt (nicht Komma) geschrieben.",
      "Gib alle Spalten an, die nicht automatisch gefuellt werden."
    ],
    hiddenTestQuery: "SELECT * FROM produkte WHERE name = 'Bluetooth Lautsprecher';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "INSERT: Neues Fitness-Workout eintragen",
    description: "Trage ein neues Workout fuer Nutzer 1 am heutigen Datum mit 45 Minuten Dauer und 320 verbrannten Kalorien ein.",
    difficulty: "junior",
    category: "DML",
    datasetId: fitnessDataset.id,
    referenceQuery: "INSERT INTO workouts (nutzer_id, datum, dauer_min, kalorien_verbrannt) VALUES (1, DATE('now'), 45, 320);",
    tags: ["DML", "INSERT", "Datum"],
    hints: [
      "Verwende `DATE('now')` fuer das aktuelle Datum in sql.js.",
      "Gib nutzer_id, datum, dauer_min und kalorien_verbrannt an."
    ],
    hiddenTestQuery: "SELECT * FROM workouts WHERE nutzer_id = 1 AND dauer_min = 45 AND kalorien_verbrannt = 320;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "INSERT: Neuen Streaming-Nutzer registrieren",
    description: "Registriere einen neuen Nutzer 'Julia Klein' mit der E-Mail 'julia@beispiel.de' und dem Abonnement 'Premium'.",
    difficulty: "junior",
    category: "DML",
    datasetId: streamingDataset.id,
    referenceQuery: "INSERT INTO nutzer (name, email, abonnement) VALUES ('Julia Klein', 'julia@beispiel.de', 'Premium');",
    tags: ["DML", "INSERT"],
    hints: [
      "Verwende INSERT INTO mit den Spalten name, email und abonnement.",
      "Das Abonnement ist ein Textwert – verwende einfache Anfuehrungszeichen."
    ],
    hiddenTestQuery: "SELECT * FROM nutzer WHERE name = 'Julia Klein' AND email = 'julia@beispiel.de';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE: Gehalt erhoehen",
    description: "Erhoehe das Gehalt aller Mitarbeiter in Abteilung 1 um 10%.",
    difficulty: "junior",
    category: "DML",
    datasetId: hrDataset.id,
    referenceQuery: "UPDATE mitarbeiter SET gehalt = gehalt * 1.10 WHERE abteilung_id = 1;",
    tags: ["DML", "UPDATE", "Berechnung"],
    hints: [
      "Verwende `UPDATE tabelle SET spalte = ausdruck WHERE bedingung`.",
      "Mit `gehalt * 1.10` erhoehst du das Gehalt um 10%."
    ],
    hiddenTestQuery: "SELECT name, gehalt FROM mitarbeiter WHERE abteilung_id = 1;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE: Produkt preis senken",
    description: "Setze den Preis aller Produkte mit kategorie_id 2 (Kleidung) auf 80% des urspruenglichen Preises (20% Rabatt).",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "UPDATE produkte SET preis = preis * 0.80 WHERE kategorie_id = 2;",
    tags: ["DML", "UPDATE", "Berechnung"],
    hints: [
      "80% des Preises entspricht `preis * 0.80`.",
      "Verwende WHERE kategorie_id = 2, um nur Kleidung zu aktualisieren."
    ],
    hiddenTestQuery: "SELECT name, preis FROM produkte WHERE kategorie_id = 2;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE: Bestellstatus aendern",
    description: "Aendere den Status aller Bestellungen mit Status 'in_bearbeitung' auf 'versendet'.",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "UPDATE bestellungen SET status = 'versendet' WHERE status = 'in_bearbeitung';",
    tags: ["DML", "UPDATE"],
    hints: [
      "Verwende `UPDATE bestellungen SET status = 'versendet'` fuer die Aenderung.",
      "Mit `WHERE status = 'in_bearbeitung'` beschraenkst du die Aenderung auf die richtigen Zeilen."
    ],
    hiddenTestQuery: "SELECT * FROM bestellungen WHERE status = 'versendet';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE: Ticket-Prioritaet erhoehen",
    description: "Setze die Prioritaet aller offenen Tickets auf 'hoch'.",
    difficulty: "junior",
    category: "DML",
    datasetId: ticketsDataset.id,
    referenceQuery: "UPDATE tickets SET prioritaet = 'hoch' WHERE status = 'offen';",
    tags: ["DML", "UPDATE"],
    hints: [
      "Kombiniere SET und WHERE, um nur bestimmte Zeilen zu aendern.",
      "Die Bedingung filtert offene Tickets, SET aendert die Prioritaet."
    ],
    hiddenTestQuery: "SELECT * FROM tickets WHERE status = 'offen';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE: Lagerbestand erhoehen",
    description: "Erhoehe den Lagerbestand aller Produkte um 100 Einheiten.",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "UPDATE produkte SET lagerbestand = lagerbestand + 100;",
    tags: ["DML", "UPDATE"],
    hints: [
      "Ohne WHERE-Klausel werden alle Zeilen aktualisiert.",
      "Verwende `lagerbestand = lagerbestand + 100` fuer die Erhoehung."
    ],
    hiddenTestQuery: "SELECT name, lagerbestand FROM produkte;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "DELETE: Stornierte Bestellungen entfernen",
    description: "Loesche alle Bestellungen mit dem Status 'storniert'.",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "DELETE FROM bestellungen WHERE status = 'storniert';",
    tags: ["DML", "DELETE"],
    hints: [
      "Verwende `DELETE FROM tabelle WHERE bedingung`, um bestimmte Zeilen zu loeschen.",
      "Ohne WHERE werden ALLE Zeilen geloescht – Vorsicht!"
    ],
    hiddenTestQuery: "SELECT * FROM bestellungen WHERE status <> 'storniert';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "DELETE: Inaktive Agenten entfernen",
    description: "Loesche alle Agenten, die nicht aktiv sind (aktiv = 0).",
    difficulty: "junior",
    category: "DML",
    datasetId: ticketsDataset.id,
    referenceQuery: "DELETE FROM agenten WHERE aktiv = 0;",
    tags: ["DML", "DELETE"],
    hints: [
      "Pruefe `WHERE aktiv = 0`, um nur inaktive Agenten zu entfernen.",
      "DELETE entfernt die Zeile unwiderruflich aus der Tabelle."
    ],
    hiddenTestQuery: "SELECT * FROM agenten WHERE aktiv = 1;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "DELETE: Abgelehnte Bewerbungen entfernen",
    description: "Loesche alle Bewerbungen mit dem Status 'abgelehnt'.",
    difficulty: "junior",
    category: "DML",
    datasetId: hrDataset.id,
    referenceQuery: "DELETE FROM bewerbungen WHERE status = 'abgelehnt';",
    tags: ["DML", "DELETE"],
    hints: [
      "Verwende `DELETE FROM bewerbungen WHERE status = 'abgelehnt'`.",
      "Nur abgelehnte Bewerbungen werden entfernt, alle anderen bleiben."
    ],
    hiddenTestQuery: "SELECT * FROM bewerbungen WHERE status <> 'abgelehnt';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "DELETE: Fehler-Logs aeltester als 30 Tage",
    description: "Loesche alle Fehler-Eintraege. (Vereinfacht: Loesche alle Eintraege aus der Tabelle `fehler`.)",
    difficulty: "junior",
    category: "DML",
    datasetId: logsDataset.id,
    referenceQuery: "DELETE FROM fehler;",
    tags: ["DML", "DELETE"],
    hints: [
      "Ohne WHERE-Klausel werden alle Zeilen geloescht.",
      "Verwende `DELETE FROM fehler;`, um die gesamte Tabelle zu leeren."
    ],
    hiddenTestQuery: "SELECT COUNT(*) AS anzahl FROM fehler;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE: Kontostand bei Einzahlung",
    description: "Erhoehe den Saldo des Kontos mit der id 1 um 500.",
    difficulty: "junior",
    category: "DML",
    datasetId: bankingDataset.id,
    referenceQuery: "UPDATE konten SET saldo = saldo + 500 WHERE id = 1;",
    tags: ["DML", "UPDATE"],
    hints: [
      "Verwende `saldo = saldo + 500`, um den Betrag hinzuzufuegen.",
      "Mit `WHERE id = 1` beschraenkst du die Aenderung auf ein bestimmtes Konto."
    ],
    hiddenTestQuery: "SELECT * FROM konten WHERE id = 1;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "INSERT mit SELECT: Produkte kopieren",
    description: "Erstelle Kopien aller Produkte mit kategorie_id 1 und aendere den Namen zu 'Kopie von <originalname>'. Hinweis: Verwende INSERT ... SELECT.",
    difficulty: "intermediate",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "INSERT INTO produkte (name, kategorie_id, preis, lagerbestand) SELECT 'Kopie von ' || name, kategorie_id, preis, lagerbestand FROM produkte WHERE kategorie_id = 1;",
    tags: ["DML", "INSERT", "INSERT SELECT"],
    hints: [
      "Verwende `INSERT INTO tabelle (spalten) SELECT ... FROM ...` fuer INSERT aus einer Abfrage.",
      "Mit `'Kopie von ' || name` konkatenierst du Zeichenketten."
    ],
    hiddenTestQuery: "SELECT * FROM produkte WHERE name LIKE 'Kopie von %';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE mit Unterabfrage: Gehalt an Durchschnitt anpassen",
    description: "Setze das Gehalt des Mitarbeiters mit id 1 auf den Durchschnittswert aller Mitarbeiter. Verwende eine Unterabfrage.",
    difficulty: "intermediate",
    category: "DML",
    datasetId: hrDataset.id,
    referenceQuery: "UPDATE mitarbeiter SET gehalt = (SELECT AVG(gehalt) FROM mitarbeiter) WHERE id = 1;",
    tags: ["DML", "UPDATE", "Subquery"],
    hints: [
      "Du kannst einen Subquery im SET-Teil verwenden: `SET gehalt = (SELECT ...)`.",
      "Der Subquery muss genau einen Wert zurueckgeben."
    ],
    hiddenTestQuery: "SELECT name, gehalt FROM mitarbeiter WHERE id = 1;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE basierend auf JOIN: Rabatt fuer Bestandskunden",
    description: "Erhoehe den Lagerbestand aller Produkte um 20, die in mindestens einer Bestellposition vorkommen. Verwende UPDATE mit Unterabfrage.",
    difficulty: "intermediate",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "UPDATE produkte SET lagerbestand = lagerbestand + 20 WHERE id IN (SELECT DISTINCT produkt_id FROM bestellpositionen);",
    tags: ["DML", "UPDATE", "Subquery"],
    hints: [
      "Verwende `WHERE id IN (SELECT ...)` fuer den Filter.",
      "Der Subquery liefert alle Produkt-IDs, die bestellt wurden."
    ],
    hiddenTestQuery: "SELECT name, lagerbestand FROM produkte WHERE id IN (SELECT DISTINCT produkt_id FROM bestellpositionen);",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "DELETE mit Unterabfrage: Tickets ohne Kommentare",
    description: "Loesche alle Tickets, die keine Kommentare haben. Verwende eine Unterabfrage mit NOT IN.",
    difficulty: "intermediate",
    category: "DML",
    datasetId: ticketsDataset.id,
    referenceQuery: "DELETE FROM tickets WHERE id NOT IN (SELECT DISTINCT ticket_id FROM kommentare);",
    tags: ["DML", "DELETE", "Subquery"],
    hints: [
      "Finde zuerst die Ticket-IDs mit Kommentaren: `SELECT DISTINCT ticket_id FROM kommentare`.",
      "Verwende `NOT IN`, um Tickets ohne Kommentare zu identifizieren."
    ],
    hiddenTestQuery: "SELECT * FROM tickets WHERE id IN (SELECT DISTINCT ticket_id FROM kommentare);",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dml", {
    title: "Debug: Fehlende WHERE-Klausel",
    description: "Diese UPDATE-Anweisung sollte nur das Gehalt von Mitarbeiter 3 erhoehen, aber die WHERE-Klausel fehlt. Korrigiere die Abfrage.",
    difficulty: "junior",
    category: "DML",
    datasetId: hrDataset.id,
    brokenQuery: "UPDATE mitarbeiter SET gehalt = gehalt * 1.10;",
    referenceQuery: "UPDATE mitarbeiter SET gehalt = gehalt * 1.10 WHERE id = 3;",
    tags: ["DML", "UPDATE", "Debugging"],
    hints: [
      "Ohne WHERE-Klausel werden ALLE Mitarbeiter aktualisiert.",
      "Fuege `WHERE id = 3` hinzu, um nur einen Mitarbeiter zu betreffen."
    ],
    hiddenTestQuery: "SELECT name, gehalt FROM mitarbeiter WHERE id = 3;",
    hiddenTestMode: "rows",
  }),
  makePredictExercise("dml", {
    title: "Vorhersage: Auswirkung von DELETE",
    description: "Was passiert, wenn du `DELETE FROM kunden WHERE stadt = 'Berlin'` ausfuehrst?",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    question: "Was passiert nach Ausfuehrung von `DELETE FROM kunden WHERE stadt = 'Berlin'`?",
    options: [
      { text: "Alle Berliner Kunden werden aus der Tabelle entfernt", isCorrect: true },
      { text: "Nur die Spalte 'stadt' der Berliner Kunden wird auf NULL gesetzt", isCorrect: false },
      { text: "Die gesamte kunden-Tabelle wird geleert", isCorrect: false },
      { text: "Die Berliner Kunden werden nur als inaktiv markiert", isCorrect: false }
    ],
    tags: ["DML", "DELETE", "Ergebnis-Vorhersage"],
    hints: [
      "DELETE entfernt komplette Zeilen, nicht nur einzelne Spalten.",
      "Mit WHERE wird nur ein Teil der Tabelle betroffen."
    ],
  }),
  makePredictExercise("dml", {
    title: "Vorhersage: UPDATE ohne WHERE",
    description: "Was passiert bei einem UPDATE ohne WHERE-Klausel?",
    difficulty: "junior",
    category: "DML",
    datasetId: hrDataset.id,
    question: "Was passiert, wenn du `UPDATE mitarbeiter SET gehalt = 50000` ohne WHERE ausfuehrst?",
    options: [
      { text: "Nur der erste Mitarbeiter bekommt 50000", isCorrect: false },
      { text: "Alle Mitarbeiter bekommen ein Gehalt von 50000", isCorrect: true },
      { text: "Es gibt einen Fehler, weil WHERE Pflicht ist", isCorrect: false },
      { text: "Nur Mitarbeiter ohne Gehalt werden aktualisiert", isCorrect: false }
    ],
    tags: ["DML", "UPDATE", "Ergebnis-Vorhersage"],
    hints: [
      "Ohne WHERE-Klausel betrifft UPDATE alle Zeilen der Tabelle.",
      "Das kann ungewollte Aenderungen verursachen – immer WHERE pruefen!"
    ],
  })
);