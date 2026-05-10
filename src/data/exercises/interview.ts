/**
 * Interview-Uebungen.
 * Enthaelt anspruchsvolle SQL-Aufgaben im Stile von Vorstellungsgespraechen.
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

export const interviewExercises: Exercise[] = [];
resetCounter();
interviewExercises.push(
  makeWriteExercise("int", {
    title: "Top 3 umsatzstaerkste Kunden",
    description: "Finde die 3 Kunden mit dem hoechsten Gesamtumsatz ueber alle Bestellungen. Gib `name` und den Gesamtumsatz als `umsatz` aus.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "shop",
    referenceQuery: `SELECT k.name, SUM(b.gesamtbetrag) AS umsatz FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name ORDER BY umsatz DESC LIMIT 3;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT k.name, SUM(b.gesamtbetrag) AS umsatz FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name ORDER BY umsatz DESC LIMIT 3;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Produkte, die nie bestellt wurden",
    description: "Zeige alle Produkte, die in keiner Bestellung vorkommen.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "shop",
    referenceQuery: `SELECT p.name FROM produkte p LEFT JOIN bestellpositionen bp ON p.id = bp.produkt_id WHERE bp.produkt_id IS NULL;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT p.name FROM produkte p LEFT JOIN bestellpositionen bp ON p.id = bp.produkt_id WHERE bp.produkt_id IS NULL;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Nutzer mit mehr als 5 Workouts",
    description: "Zeige alle Nutzer, die mehr als 5 Workouts absolviert haben, sortiert nach Anzahl absteigend.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "fitness",
    referenceQuery: `SELECT n.name, COUNT(w.id) AS workout_anzahl FROM nutzer n INNER JOIN workouts w ON n.id = w.nutzer_id GROUP BY n.id, n.name HAVING COUNT(w.id) > 5 ORDER BY workout_anzahl DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT n.name, COUNT(w.id) AS workout_anzahl FROM nutzer n INNER JOIN workouts w ON n.id = w.nutzer_id GROUP BY n.id, n.name HAVING COUNT(w.id) > 5 ORDER BY workout_anzahl DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Abteilungen mit hoechstem Durchschnittsgehalt",
    description: "Zeige die Abteilung mit dem hoechsten Durchschnittsgehalt.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "hr",
    referenceQuery: `SELECT a.name, AVG(m.gehalt) AS durchschnitt FROM abteilungen a INNER JOIN mitarbeiter m ON a.id = m.abteilung_id GROUP BY a.id, a.name ORDER BY durchschnitt DESC LIMIT 1;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT a.name, AVG(m.gehalt) AS durchschnitt FROM abteilungen a INNER JOIN mitarbeiter m ON a.id = m.abteilung_id GROUP BY a.id, a.name ORDER BY durchschnitt DESC LIMIT 1;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Agenten mit offenen Tickets",
    description: "Zeige alle Agenten und wie viele offene Tickets sie aktuell haben.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "tickets",
    referenceQuery: `SELECT a.name, COUNT(t.id) AS offene_tickets FROM agenten a LEFT JOIN tickets t ON a.id = t.agent_id AND t.status = 'offen' GROUP BY a.id, a.name ORDER BY offene_tickets DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT a.name, COUNT(t.id) AS offene_tickets FROM agenten a LEFT JOIN tickets t ON a.id = t.agent_id AND t.status = 'offen' GROUP BY a.id, a.name ORDER BY offene_tickets DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Kunden mit negativem Saldo",
    description: "Finde Kunden, deren Gesamtsaldo ueber alle Konten negativ ist.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "banking",
    referenceQuery: `SELECT ku.name, SUM(k.saldo) AS gesamt_saldo FROM kunden ku INNER JOIN konten k ON ku.id = k.kunde_id GROUP BY ku.id, ku.name HAVING SUM(k.saldo) < 0;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT ku.name, SUM(k.saldo) AS gesamt_saldo FROM kunden ku INNER JOIN konten k ON ku.id = k.kunde_id GROUP BY ku.id, ku.name HAVING SUM(k.saldo) < 0;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Filme mit Durchschnittsbewertung ueber 4",
    description: "Zeige alle Filme, deren Durchschnittsbewertung ueber 4 Sterne liegt.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "streaming",
    referenceQuery: `SELECT f.titel, AVG(b.sterne) AS avg_sterne FROM filme f INNER JOIN bewertungen b ON f.id = b.film_id GROUP BY f.id, f.titel HAVING AVG(b.sterne) > 4;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT f.titel, AVG(b.sterne) AS avg_sterne FROM filme f INNER JOIN bewertungen b ON f.id = b.film_id GROUP BY f.id, f.titel HAVING AVG(b.sterne) > 4;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Sessions mit mehr als 3 Events",
    description: "Zeige alle Session-IDs, die mehr als 3 Events haben, und die Anzahl.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: "logs",
    referenceQuery: `SELECT session_id, COUNT(*) AS event_anzahl FROM events GROUP BY session_id HAVING COUNT(*) > 3 ORDER BY event_anzahl DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT session_id, COUNT(*) AS event_anzahl FROM events GROUP BY session_id HAVING COUNT(*) > 3 ORDER BY event_anzahl DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Monatlicher Umsatz",
    description: "Berechne den Gesamtumsatz pro Monat (basierend auf Bestelldatum).",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "shop",
    referenceQuery: `SELECT strftime('%Y-%m', datum) AS monat, SUM(gesamtbetrag) AS umsatz FROM bestellungen GROUP BY monat ORDER BY monat;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT strftime('%Y-%m', datum) AS monat, SUM(gesamtbetrag) AS umsatz FROM bestellungen GROUP BY monat ORDER BY monat;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Persoenlicher Rekord pro Uebung",
    description: "Finde fuer jeden Nutzer und jede Uebung das maximale Gewicht.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "fitness",
    referenceQuery: `SELECT n.name, u.name AS uebung, MAX(s.gewicht_kg) AS max_gewicht FROM nutzer n INNER JOIN workouts w ON n.id = w.nutzer_id INNER JOIN saetze s ON w.id = s.workout_id INNER JOIN uebungen u ON s.uebung_id = u.id GROUP BY n.id, n.name, u.id, u.name ORDER BY n.name, max_gewicht DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT n.name, u.name AS uebung, MAX(s.gewicht_kg) AS max_gewicht FROM nutzer n INNER JOIN workouts w ON n.id = w.nutzer_id INNER JOIN saetze s ON w.id = s.workout_id INNER JOIN uebungen u ON s.uebung_id = u.id GROUP BY n.id, n.name, u.id, u.name ORDER BY n.name, max_gewicht DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Mitarbeiter ohne Urlaub in 2024",
    description: "Zeige alle Mitarbeiter, die im Jahr 2024 keinen Urlaub beantragt haben.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "hr",
    referenceQuery: `SELECT m.name FROM mitarbeiter m WHERE m.id NOT IN (SELECT mitarbeiter_id FROM urlaub WHERE startdatum LIKE '2024-%');`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT m.name FROM mitarbeiter m WHERE m.id NOT IN (SELECT mitarbeiter_id FROM urlaub WHERE startdatum LIKE '2024-%');`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Durchschnittliche Bearbeitungszeit",
    description: "Berechne die durchschnittliche Bearbeitungszeit (in Stunden) fuer abgeschlossene Tickets.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "tickets",
    referenceQuery: `SELECT AVG((julianday(geschlossen_am) - julianday(erstellt_am)) * 24) AS avg_stunden FROM tickets WHERE status = 'abgeschlossen';`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT AVG((julianday(geschlossen_am) - julianday(erstellt_am)) * 24) AS avg_stunden FROM tickets WHERE status = 'abgeschlossen';`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Verdacht auf Betrug",
    description: "Zeige alle Kunden, die mehr als 2 Betrugsfaelle haben.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "banking",
    referenceQuery: `SELECT ku.name, COUNT(bf.id) AS faelle FROM kunden ku INNER JOIN konten ko ON ku.id = ko.kunde_id INNER JOIN transaktionen t ON ko.id = t.konto_id INNER JOIN betrugsfaelle bf ON t.id = bf.transaktion_id GROUP BY ku.id, ku.name HAVING COUNT(bf.id) > 2;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT ku.name, COUNT(bf.id) AS faelle FROM kunden ku INNER JOIN konten ko ON ku.id = ko.kunde_id INNER JOIN transaktionen t ON ko.id = t.konto_id INNER JOIN betrugsfaelle bf ON t.id = bf.transaktion_id GROUP BY ku.id, ku.name HAVING COUNT(bf.id) > 2;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Nutzer, die alle Filme geschaut haben",
    description: "Finde Nutzer, die mindestens 5 verschiedene Filme zu 100% geschaut haben.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "streaming",
    referenceQuery: `SELECT n.name, COUNT(DISTINCT wh.film_id) AS filme_geschaut FROM nutzer n INNER JOIN watch_history wh ON n.id = wh.nutzer_id WHERE wh.fortschritt_prozent = 100 GROUP BY n.id, n.name HAVING COUNT(DISTINCT wh.film_id) >= 5;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT n.name, COUNT(DISTINCT wh.film_id) AS filme_geschaut FROM nutzer n INNER JOIN watch_history wh ON n.id = wh.nutzer_id WHERE wh.fortschritt_prozent = 100 GROUP BY n.id, n.name HAVING COUNT(DISTINCT wh.film_id) >= 5;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Fehler pro Session",
    description: "Zeige Sessions, die mindestens 2 Fehler enthalten.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "logs",
    referenceQuery: `SELECT s.id, s.browser, COUNT(f.id) AS fehler_anzahl FROM sessions s INNER JOIN events e ON s.id = e.session_id INNER JOIN fehler f ON e.id = f.event_id GROUP BY s.id, s.browser HAVING COUNT(f.id) >= 2;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zerlege die Aufgabe in kleine Schritte.",
      "Welche Tabellen brauchst du? Welche Aggregate?"
    ],
    hiddenTestQuery: `SELECT s.id, s.browser, COUNT(f.id) AS fehler_anzahl FROM sessions s INNER JOIN events e ON s.id = e.session_id INNER JOIN fehler f ON e.id = f.event_id GROUP BY s.id, s.browser HAVING COUNT(f.id) >= 2;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Kunden aus Berlin",
    description: "Zeige alle Kunden, die in Berlin wohnen. Gib Name und E-Mail aus.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: "shop",
    referenceQuery: `SELECT name, email FROM kunden WHERE stadt = 'Berlin';`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Welche Tabelle enthaelt die Kundendaten?",
      "Verwende WHERE, um nach der Stadt zu filtern."
    ],
    hiddenTestQuery: `SELECT name, email FROM kunden WHERE stadt = 'Berlin';`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Uebungen fuer Brustmuskel",
    description: "Zeige alle Uebungen, die die Muskelgruppe 'Brust' trainieren.",
    difficulty: "beginner",
    category: "Interview-Challenge",
    datasetId: "fitness",
    referenceQuery: `SELECT name, muskelgruppe, kategorie FROM uebungen WHERE muskelgruppe = 'Brust';`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Die Tabelle uebungen enthaelt die Muskelgruppe.",
      "Filtere mit WHERE muskelgruppe = 'Brust'."
    ],
    hiddenTestQuery: `SELECT name, muskelgruppe, kategorie FROM uebungen WHERE muskelgruppe = 'Brust';`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Mitarbeiter und ihre Abteilung",
    description: "Zeige den Namen, die Position und die Abteilung jedes Mitarbeiters.",
    difficulty: "beginner",
    category: "Interview-Challenge",
    datasetId: "hr",
    referenceQuery: `SELECT m.name, m.position, a.name AS abteilung FROM mitarbeiter m INNER JOIN abteilungen a ON m.abteilung_id = a.id;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Du musst mitarbeiter mit abteilungen joinen.",
      "Verwende INNER JOIN ueber abteilung_id."
    ],
    hiddenTestQuery: `SELECT m.name, m.position, a.name AS abteilung FROM mitarbeiter m INNER JOIN abteilungen a ON m.abteilung_id = a.id;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Tickets mit hoher Prioritaet",
    description: "Finde alle Tickets mit der Prioritaet 'hoch', sortiert nach Erstellungsdatum absteigend.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: "tickets",
    referenceQuery: `SELECT titel, prioritaet, status, erstellt_am FROM tickets WHERE prioritaet = 'hoch' ORDER BY erstellt_am DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filtere mit WHERE auf prioritaet = 'hoch'.",
      "Sortiere mit ORDER BY erstellt_am DESC."
    ],
    hiddenTestQuery: `SELECT titel, prioritaet, status, erstellt_am FROM tickets WHERE prioritaet = 'hoch' ORDER BY erstellt_am DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Konten mit hohem Saldo",
    description: "Zeige alle Konten mit einem Saldo ueber 5000, sortiert nach Saldo absteigend.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: "banking",
    referenceQuery: `SELECT kontonummer, typ, saldo FROM konten WHERE saldo > 5000 ORDER BY saldo DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filtere mit WHERE saldo > 5000.",
      "Sortiere mit ORDER BY saldo DESC."
    ],
    hiddenTestQuery: `SELECT kontonummer, typ, saldo FROM konten WHERE saldo > 5000 ORDER BY saldo DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Action-Filme nach Bewertung",
    description: "Zeige alle Action-Filme sortiert nach Bewertung absteigend.",
    difficulty: "beginner",
    category: "Interview-Challenge",
    datasetId: "streaming",
    referenceQuery: `SELECT titel, jahr, dauer_min, bewertung FROM filme WHERE genre = 'Action' ORDER BY bewertung DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filtere nach genre = 'Action'.",
      "Sortiere absteigend nach bewertung."
    ],
    hiddenTestQuery: `SELECT titel, jahr, dauer_min, bewertung FROM filme WHERE genre = 'Action' ORDER BY bewertung DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Events auf der Startseite",
    description: "Zeige alle Events, die auf der Seite 'home' stattfanden, sortiert nach Zeitpunkt.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: "logs",
    referenceQuery: `SELECT event_typ, seite, zeitpunkt, dauer_ms FROM events WHERE seite = 'home' ORDER BY zeitpunkt DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filtere mit WHERE seite = 'home'.",
      "Nutze ORDER BY zeitpunkt DESC fuer chronologische Sortierung."
    ],
    hiddenTestQuery: `SELECT event_typ, seite, zeitpunkt, dauer_ms FROM events WHERE seite = 'home' ORDER BY zeitpunkt DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Informatik-Studenten",
    description: "Finde alle Studenten im Studiengang Informatik, sortiert nach Semester.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: "university",
    referenceQuery: `SELECT name, email, semester FROM studenten WHERE studiengang = 'Informatik' ORDER BY semester;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filtere nach studiengang = 'Informatik'.",
      "Sortiere aufsteigend nach semester."
    ],
    hiddenTestQuery: `SELECT name, email, semester FROM studenten WHERE studiengang = 'Informatik' ORDER BY semester;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Elektronik unter 100 Euro",
    description: "Zeige alle Elektronik-Produkte, die weniger als 100 Euro kosten.",
    difficulty: "beginner",
    category: "Interview-Challenge",
    datasetId: "ecommerce",
    referenceQuery: `SELECT name, preis, hersteller FROM produkte WHERE kategorie = 'Elektronik' AND preis < 100;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Kombiniere zwei Bedingungen mit AND.",
      "Filtere nach kategorie und preis."
    ],
    hiddenTestQuery: `SELECT name, preis, hersteller FROM produkte WHERE kategorie = 'Elektronik' AND preis < 100;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Aerzte der Chirurgie",
    description: "Zeige alle Aerzte, die in der Abteilung 'Chirurgie' arbeiten.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: "hospital",
    referenceQuery: `SELECT a.name, a.position FROM aerzte a INNER JOIN abteilungen ab ON a.abteilung_id = ab.id WHERE ab.name = 'Chirurgie';`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Du musst aerzte mit abteilungen joinen.",
      "Filtere danach auf den Abteilungsnamen."
    ],
    hiddenTestQuery: `SELECT a.name, a.position FROM aerzte a INNER JOIN abteilungen ab ON a.abteilung_id = ab.id WHERE ab.name = 'Chirurgie';`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Stornierte Bestellungen",
    description: "Finde alle stornierten Bestellungen, sortiert nach Datum absteigend.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: "shop",
    referenceQuery: `SELECT id, kunde_id, datum, gesamtbetrag FROM bestellungen WHERE status = 'storniert' ORDER BY datum DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filtere mit WHERE status = 'storniert'.",
      "Sortiere nach datum absteigend."
    ],
    hiddenTestQuery: `SELECT id, kunde_id, datum, gesamtbetrag FROM bestellungen WHERE status = 'storniert' ORDER BY datum DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Einzahlungen ueber 1000 Euro",
    description: "Zeige alle Einzahlungen mit einem Betrag ueber 1000 Euro.",
    difficulty: "beginner",
    category: "Interview-Challenge",
    datasetId: "banking",
    referenceQuery: `SELECT t.id, t.konto_id, t.betrag, t.datum FROM transaktionen t WHERE t.typ = 'Einzahlung' AND t.betrag > 1000;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Kombiniere typ und betrag im WHERE-Filter.",
      "Verwende AND, um beide Bedingungen zu verknuepfen."
    ],
    hiddenTestQuery: `SELECT t.id, t.konto_id, t.betrag, t.datum FROM transaktionen t WHERE t.typ = 'Einzahlung' AND t.betrag > 1000;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Notendurchschnitt pro Student",
    description: "Berechne den Notendurchschnitt fuer jeden Studenten, sortiert nach bester Note zuerst.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "university",
    referenceQuery: `SELECT s.name, ROUND(AVG(e.note), 2) AS durchschnittsnote FROM studenten s INNER JOIN einschreibungen e ON s.id = e.student_id GROUP BY s.id, s.name ORDER BY durchschnittsnote DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Verwende AVG() fuer den Durchschnitt und gruppiere nach Student.",
      "JOIN studenten mit einschreibungen ueber student_id."
    ],
    hiddenTestQuery: `SELECT s.name, ROUND(AVG(e.note), 2) AS durchschnittsnote FROM studenten s INNER JOIN einschreibungen e ON s.id = e.student_id GROUP BY s.id, s.name ORDER BY durchschnittsnote DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Umsatz nach Produktkategorie",
    description: "Berechne den Gesamtumsatz pro Produktkategorie (Menge * Einzelpreis).",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "ecommerce",
    referenceQuery: `SELECT p.kategorie, ROUND(SUM(bp.menge * bp.einzelpreis), 2) AS kategorie_umsatz FROM produkte p INNER JOIN bestellpositionen bp ON p.id = bp.produkt_id GROUP BY p.kategorie ORDER BY kategorie_umsatz DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Join produkte mit bestellpositionen ueber produkt_id.",
      "Berechne menge * einzelpreis und summiere pro Kategorie."
    ],
    hiddenTestQuery: `SELECT p.kategorie, ROUND(SUM(bp.menge * bp.einzelpreis), 2) AS kategorie_umsatz FROM produkte p INNER JOIN bestellpositionen bp ON p.id = bp.produkt_id GROUP BY p.kategorie ORDER BY kategorie_umsatz DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Patienten mit mehreren Behandlungen",
    description: "Zeige alle Patienten, die mehr als eine Behandlung hatten, sortiert nach Anzahl.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "hospital",
    referenceQuery: `SELECT p.name, COUNT(b.id) AS behandlungsanzahl FROM patienten p INNER JOIN behandlungen b ON p.id = b.patient_id GROUP BY p.id, p.name HAVING COUNT(b.id) > 1 ORDER BY behandlungsanzahl DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Zaehle die Behandlungen pro Patient mit COUNT().",
      "Verwende HAVING, um nach der Aggregation zu filtern."
    ],
    hiddenTestQuery: `SELECT p.name, COUNT(b.id) AS behandlungsanzahl FROM patienten p INNER JOIN behandlungen b ON p.id = b.patient_id GROUP BY p.id, p.name HAVING COUNT(b.id) > 1 ORDER BY behandlungsanzahl DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Trainingsvolumen nach Muskelgruppe",
    description: "Berechne dasGesamttrainingsvolumen (Wiederholungen * Gewicht) pro Muskelgruppe.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "fitness",
    referenceQuery: `SELECT u.muskelgruppe, SUM(s.wiederholungen * s.gewicht_kg) AS trainingsvolumen FROM uebungen u INNER JOIN saetze s ON u.id = s.uebung_id GROUP BY u.muskelgruppe ORDER BY trainingsvolumen DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Verbinde uebungen mit saetze ueber uebung_id.",
      "Trainingsvolumen = wiederholungen * gewicht_kg, summiert pro Muskelgruppe."
    ],
    hiddenTestQuery: `SELECT u.muskelgruppe, SUM(s.wiederholungen * s.gewicht_kg) AS trainingsvolumen FROM uebungen u INNER JOIN saetze s ON u.id = s.uebung_id GROUP BY u.muskelgruppe ORDER BY trainingsvolumen DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Manager und direkte Untergebene",
    description: "Zeige jeden Manager und wie viele Mitarbeiter ihm direkt unterstehen.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "hr",
    referenceQuery: `SELECT m.name AS manager, COUNT(u.id) AS anzahl_untergebene FROM mitarbeiter m INNER JOIN mitarbeiter u ON m.id = u.manager_id GROUP BY m.id, m.name ORDER BY anzahl_untergebene DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Dies ist ein Self-Join: joine mitarbeiter mit sich selbst ueber manager_id.",
      "Der Manager ist die Zeile, deren id gleich der manager_id des Untergebenen ist."
    ],
    hiddenTestQuery: `SELECT m.name AS manager, COUNT(u.id) AS anzahl_untergebene FROM mitarbeiter m INNER JOIN mitarbeiter u ON m.id = u.manager_id GROUP BY m.id, m.name ORDER BY anzahl_untergebene DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Tickets ohne Kommentare",
    description: "Finde alle Tickets, die noch keine Kommentare haben.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "tickets",
    referenceQuery: `SELECT t.titel, t.status, t.prioritaet FROM tickets t LEFT JOIN kommentare k ON t.id = k.ticket_id WHERE k.id IS NULL;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Verwende LEFT JOIN, um auch Tickets ohne Kommentare zu behalten.",
      "Filtere mit WHERE k.id IS NULL auf fehlende Kommentare."
    ],
    hiddenTestQuery: `SELECT t.titel, t.status, t.prioritaet FROM tickets t LEFT JOIN kommentare k ON t.id = k.ticket_id WHERE k.id IS NULL;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Monatliche Einzahlungssumme",
    description: "Berechne die monatliche Summe aller Einzahlungen, sortiert nach Monat.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "banking",
    referenceQuery: `SELECT strftime('%Y-%m', datum) AS monat, SUM(betrag) AS einzahlungssumme FROM transaktionen WHERE typ = 'Einzahlung' GROUP BY monat ORDER BY monat;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Nutze strftime, um das Datum auf Jahr-Monat zu kuerzen.",
      "Gruppiere nach dem formatierten Monat und summiere den Betrag."
    ],
    hiddenTestQuery: `SELECT strftime('%Y-%m', datum) AS monat, SUM(betrag) AS einzahlungssumme FROM transaktionen WHERE typ = 'Einzahlung' GROUP BY monat ORDER BY monat;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Durchschnittsbewertung nach Genre",
    description: "Berechne die durchschnittliche Sternebewertung pro Film-Genre.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "streaming",
    referenceQuery: `SELECT f.genre, ROUND(AVG(b.sterne), 2) AS avg_bewertung, COUNT(b.id) AS bewertungsanzahl FROM filme f INNER JOIN bewertungen b ON f.id = b.film_id GROUP BY f.genre ORDER BY avg_bewertung DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Join filme mit bewertungen ueber film_id.",
      "Gruppiere nach genre und berechne AVG(sterne)."
    ],
    hiddenTestQuery: `SELECT f.genre, ROUND(AVG(b.sterne), 2) AS avg_bewertung, COUNT(b.id) AS bewertungsanzahl FROM filme f INNER JOIN bewertungen b ON f.id = b.film_id GROUP BY f.genre ORDER BY avg_bewertung DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Kurse mit wenigen Einschreibungen",
    description: "Zeige alle Kurse, die weniger als 3 Einschreibungen haben, inklusive Kurse ohne Einschreibungen.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "university",
    referenceQuery: `SELECT k.name, k.max_teilnehmer, COUNT(e.id) AS aktuelle_teilnehmer FROM kurse k LEFT JOIN einschreibungen e ON k.id = e.kurs_id GROUP BY k.id, k.name, k.max_teilnehmer HAVING COUNT(e.id) < 3;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Verwende LEFT JOIN, um auch Kurse ohne Einschreibungen zu erfassen.",
      "HAVING filtert nach der Aggregation, nicht WHERE."
    ],
    hiddenTestQuery: `SELECT k.name, k.max_teilnehmer, COUNT(e.id) AS aktuelle_teilnehmer FROM kurse k LEFT JOIN einschreibungen e ON k.id = e.kurs_id GROUP BY k.id, k.name, k.max_teilnehmer HAVING COUNT(e.id) < 3;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Premium-Kunden und ihr Umsatz",
    description: "Zeige alle Premium-Kunden mit ihrer Bestellanzahl und dem Gesamtumsatz, sortiert nach Umsatz.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "ecommerce",
    referenceQuery: `SELECT k.name, COUNT(b.id) AS bestellanzahl, SUM(b.gesamtbetrag) AS gesamtumsatz FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id WHERE k.ist_premium = 1 GROUP BY k.id, k.name ORDER BY gesamtumsatz DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filtere zuerst auf Premium-Kunden mit WHERE ist_premium = 1.",
      "Gruppiere dann nach Kunde und aggregated Bestellanzahl und Umsatz."
    ],
    hiddenTestQuery: `SELECT k.name, COUNT(b.id) AS bestellanzahl, SUM(b.gesamtbetrag) AS gesamtumsatz FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id WHERE k.ist_premium = 1 GROUP BY k.id, k.name ORDER BY gesamtumsatz DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Browser-Nutzungsstatistik",
    description: "Zeige wie viele Sessions pro Browser stattfanden, sortiert nach Haeufigkeit.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "logs",
    referenceQuery: `SELECT browser, COUNT(*) AS session_anzahl FROM sessions GROUP BY browser ORDER BY session_anzahl DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Gruppiere nach der Spalte browser.",
      "Zaehle mit COUNT(*) die Sessions pro Gruppe."
    ],
    hiddenTestQuery: `SELECT browser, COUNT(*) AS session_anzahl FROM sessions GROUP BY browser ORDER BY session_anzahl DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Behandlungskosten pro Abteilung",
    description: "Berechne die Gesamtkosten und Anzahl der Behandlungen pro Abteilung.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "hospital",
    referenceQuery: `SELECT ab.name, ROUND(SUM(b.kosten), 2) AS gesamt_kosten, COUNT(b.id) AS behandlungsanzahl FROM abteilungen ab INNER JOIN aerzte a ON ab.id = a.abteilung_id INNER JOIN behandlungen b ON a.id = b.arzt_id GROUP BY ab.id, ab.name ORDER BY gesamt_kosten DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Du musst drei Tabellen joinen: abteilungen, aerzte, behandlungen.",
      "Summiere kosten und zaehle Behandlungen pro Abteilung."
    ],
    hiddenTestQuery: `SELECT ab.name, ROUND(SUM(b.kosten), 2) AS gesamt_kosten, COUNT(b.id) AS behandlungsanzahl FROM abteilungen ab INNER JOIN aerzte a ON ab.id = a.abteilung_id INNER JOIN behandlungen b ON a.id = b.arzt_id GROUP BY ab.id, ab.name ORDER BY gesamt_kosten DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Kunden mit mindestens 3 Bestellungen",
    description: "Finde alle Kunden, die 3 oder mehr Bestellungen getaetigt haben, sortiert nach Anzahl.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: "shop",
    referenceQuery: `SELECT k.name, COUNT(b.id) AS bestellanzahl FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name HAVING COUNT(b.id) >= 3 ORDER BY bestellanzahl DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Gruppiere nach Kunde und zaehle die Bestellungen.",
      "Verwende HAVING, um nach der Aggregation zu filtern."
    ],
    hiddenTestQuery: `SELECT k.name, COUNT(b.id) AS bestellanzahl FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name HAVING COUNT(b.id) >= 3 ORDER BY bestellanzahl DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Gehaltsrang pro Abteilung",
    description: "Zeige jeden Mitarbeiter mit Gehalt und seinem Rang innerhalb seiner Abteilung, absteigend nach Gehalt.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "hr",
    referenceQuery: `SELECT m.name, a.name AS abteilung, m.gehalt, RANK() OVER (PARTITION BY a.name ORDER BY m.gehalt DESC) AS gehaltsrang FROM mitarbeiter m INNER JOIN abteilungen a ON m.abteilung_id = a.id;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Verwende RANK() OVER (PARTITION BY ... ORDER BY ...) als Window-Function.",
      "PARTITION BY teilt die Daten in Gruppen, ORDER BY bestimmt die Reihenfolge innerhalb."
    ],
    hiddenTestQuery: `SELECT m.name, a.name AS abteilung, m.gehalt, RANK() OVER (PARTITION BY a.name ORDER BY m.gehalt DESC) AS gehaltsrang FROM mitarbeiter m INNER JOIN abteilungen a ON m.abteilung_id = a.id;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Laufende Transaktionssumme",
    description: "Berechne die laufende Summe der Betraege pro Konto, sortiert nach Datum.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "banking",
    referenceQuery: `SELECT t.id, t.konto_id, t.betrag, t.typ, t.datum, SUM(t.betrag) OVER (PARTITION BY t.konto_id ORDER BY t.datum, t.id) AS laufende_summe FROM transaktionen t ORDER BY t.konto_id, t.datum;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "SUM() OVER (PARTITION BY ... ORDER BY ...) berechnet eine laufende Summe.",
      "Partitioniere nach konto_id und sortiere nach datum."
    ],
    hiddenTestQuery: `SELECT t.id, t.konto_id, t.betrag, t.typ, t.datum, SUM(t.betrag) OVER (PARTITION BY t.konto_id ORDER BY t.datum, t.id) AS laufende_summe FROM transaktionen t ORDER BY t.konto_id, t.datum;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Top-3 Bewertungen pro Nutzer",
    description: "Zeige die 3 besten Bewertungen jedes Nutzers, sortiert nach Sternen.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "streaming",
    referenceQuery: `SELECT nutzer_name, film_id, sterne FROM (SELECT n.name AS nutzer_name, b.film_id, b.sterne, ROW_NUMBER() OVER (PARTITION BY n.id ORDER BY b.sterne DESC) AS rang FROM nutzer n INNER JOIN bewertungen b ON n.id = b.nutzer_id) sub WHERE rang <= 3;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Verwende ROW_NUMBER() in einer Unterabfrage, um die Bewertungen zu nummerieren.",
      "Filtere die aeussere Abfrage auf rang <= 3."
    ],
    hiddenTestQuery: `SELECT nutzer_name, film_id, sterne FROM (SELECT n.name AS nutzer_name, b.film_id, b.sterne, ROW_NUMBER() OVER (PARTITION BY n.id ORDER BY b.sterne DESC) AS rang FROM nutzer n INNER JOIN bewertungen b ON n.id = b.nutzer_id) sub WHERE rang <= 3;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Gleitender Durchschnitt der Kalorien",
    description: "Berechne den gleitenden 3-Werte-Durchschnitt der verbrannten Kalorien pro Nutzer.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "fitness",
    referenceQuery: `SELECT n.name, w.datum, w.kalorien_verbrannt, ROUND(AVG(w.kalorien_verbrannt) OVER (PARTITION BY n.id ORDER BY w.datum ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS gleitender_durchschnitt FROM nutzer n INNER JOIN workouts w ON n.id = w.nutzer_id ORDER BY n.name, w.datum;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "AVG() OVER mit ROWS BETWEEN definiert ein gleitendes Fenster.",
      "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW nimmt die letzten 3 Werte."
    ],
    hiddenTestQuery: `SELECT n.name, w.datum, w.kalorien_verbrannt, ROUND(AVG(w.kalorien_verbrannt) OVER (PARTITION BY n.id ORDER BY w.datum ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS gleitender_durchschnitt FROM nutzer n INNER JOIN workouts w ON n.id = w.nutzer_id ORDER BY n.name, w.datum;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Abschlussrate pro Agent",
    description: "Berechne den Prozentsatz abgeschlossener Tickets fuer jeden Agenten.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "tickets",
    referenceQuery: `WITH agent_stats AS (SELECT agent_id, COUNT(*) AS gesamt, SUM(CASE WHEN status = 'abgeschlossen' THEN 1 ELSE 0 END) AS abgeschlossen FROM tickets GROUP BY agent_id) SELECT a.name, ags.gesamt, ags.abgeschlossen, ROUND(ags.abgeschlossen * 100.0 / ags.gesamt, 1) AS abschlussrate FROM agenten a INNER JOIN agent_stats ags ON a.id = ags.agent_id ORDER BY abschlussrate DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Verwende eine CTE (WITH-Klausel), um die Ticket-Statistiken pro Agent vorzuberechnen.",
      "CASE WHEN zaehlt abgeschlossene Tickets, dann teile durch die Gesamtzahl."
    ],
    hiddenTestQuery: `WITH agent_stats AS (SELECT agent_id, COUNT(*) AS gesamt, SUM(CASE WHEN status = 'abgeschlossen' THEN 1 ELSE 0 END) AS abgeschlossen FROM tickets GROUP BY agent_id) SELECT a.name, ags.gesamt, ags.abgeschlossen, ROUND(ags.abgeschlossen * 100.0 / ags.gesamt, 1) AS abschlussrate FROM agenten a INNER JOIN agent_stats ags ON a.id = ags.agent_id ORDER BY abschlussrate DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Studenten-Ranking nach Notendurchschnitt",
    description: "Erstelle ein Ranking aller Studenten nach ihrem Notendurchschnitt mit RANK().",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "university",
    referenceQuery: `WITH noten_avg AS (SELECT s.id, s.name, AVG(e.note) AS durchschnitt FROM studenten s INNER JOIN einschreibungen e ON s.id = e.student_id GROUP BY s.id, s.name) SELECT name, ROUND(durchschnitt, 2) AS durchschnittsnote, RANK() OVER (ORDER BY durchschnitt DESC) AS rang FROM noten_avg;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Berechne zuerst den Durchschnitt pro Student in einer CTE.",
      "Verwende RANK() OVER (ORDER BY ...) im Select der CTE-Ergebnisse."
    ],
    hiddenTestQuery: `WITH noten_avg AS (SELECT s.id, s.name, AVG(e.note) AS durchschnitt FROM studenten s INNER JOIN einschreibungen e ON s.id = e.student_id GROUP BY s.id, s.name) SELECT name, ROUND(durchschnitt, 2) AS durchschnittsnote, RANK() OVER (ORDER BY durchschnitt DESC) AS rang FROM noten_avg;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Teuerste Behandlung pro Patient",
    description: "Finde die teuerste Behandlung jedes Patienten mit ROW_NUMBER().",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "hospital",
    referenceQuery: `WITH patient_kosten AS (SELECT p.name AS patient_name, b.diagnose, b.kosten, ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY b.kosten DESC) AS rn FROM patienten p INNER JOIN behandlungen b ON p.id = b.patient_id) SELECT patient_name, diagnose, kosten FROM patient_kosten WHERE rn = 1 ORDER BY kosten DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Verwende ROW_NUMBER() in einer CTE, um Behandlungen pro Patient zu nummerieren.",
      "Filtere in der aeusseren Abfrage auf rn = 1 fuer die teuerste."
    ],
    hiddenTestQuery: `WITH patient_kosten AS (SELECT p.name AS patient_name, b.diagnose, b.kosten, ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY b.kosten DESC) AS rn FROM patienten p INNER JOIN behandlungen b ON p.id = b.patient_id) SELECT patient_name, diagnose, kosten FROM patient_kosten WHERE rn = 1 ORDER BY kosten DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Produktumsatz-Ranking",
    description: "Erstelle ein Ranking aller Produkte nach ihrem Gesamtumsatz mit DENSE_RANK().",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "shop",
    referenceQuery: `WITH produkt_umsatz AS (SELECT p.name, SUM(bp.menge * bp.einzelpreis) AS umsatz FROM produkte p INNER JOIN bestellpositionen bp ON p.id = bp.produkt_id GROUP BY p.id, p.name) SELECT name, ROUND(umsatz, 2) AS umsatz, DENSE_RANK() OVER (ORDER BY umsatz DESC) AS rang FROM produkt_umsatz;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Berechne den Umsatz pro Produkt in einer CTE mit SUM(menge * einzelpreis).",
      "Verwende DENSE_RANK() OVER (ORDER BY umsatz DESC) fuer das Ranking."
    ],
    hiddenTestQuery: `WITH produkt_umsatz AS (SELECT p.name, SUM(bp.menge * bp.einzelpreis) AS umsatz FROM produkte p INNER JOIN bestellpositionen bp ON p.id = bp.produkt_id GROUP BY p.id, p.name) SELECT name, ROUND(umsatz, 2) AS umsatz, DENSE_RANK() OVER (ORDER BY umsatz DESC) AS rang FROM produkt_umsatz;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Kampagnen-Konversionsrate",
    description: "Berechne die Konversionsrate (Konversionen/Klicks in Prozent) jeder Kampagne.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "ecommerce",
    referenceQuery: `WITH kamp_stats AS (SELECT name, typ, budget, klicks, konversionen, ROUND(konversionen * 100.0 / NULLIF(klicks, 0), 2) AS konversionsrate FROM kampagnen) SELECT name, typ, budget, klicks, konversionen, konversionsrate FROM kamp_stats ORDER BY konversionsrate DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "NULLIF(klicks, 0) verhindert Division durch Null.",
      "Berechne konversionen * 100.0 / klicks als Prozentwert."
    ],
    hiddenTestQuery: `WITH kamp_stats AS (SELECT name, typ, budget, klicks, konversionen, ROUND(konversionen * 100.0 / NULLIF(klicks, 0), 2) AS konversionsrate FROM kampagnen) SELECT name, typ, budget, klicks, konversionen, konversionsrate FROM kamp_stats ORDER BY konversionsrate DESC;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("int", {
    title: "Taegliche Fehlerstatistik",
    description: "Zeige die Anzahl der Fehler pro Tag und Schwerkraft, sortiert nach Tag.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: "logs",
    referenceQuery: `WITH fehler_pro_tag AS (SELECT strftime('%Y-%m-%d', e.zeitpunkt) AS tag, f.schweregrad, COUNT(*) AS anzahl FROM fehler f INNER JOIN events e ON f.event_id = e.id GROUP BY tag, f.schweregrad) SELECT tag, schweregrad, anzahl FROM fehler_pro_tag ORDER BY tag DESC, anzahl DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Verwende eine CTE, um Fehler mit Events zu joinen und nach Tag/Gruppe zu aggregieren.",
      "strftime formatiert das Datum, GROUP BY faehrt nach tag und schweregrad."
    ],
    hiddenTestQuery: `WITH fehler_pro_tag AS (SELECT strftime('%Y-%m-%d', e.zeitpunkt) AS tag, f.schweregrad, COUNT(*) AS anzahl FROM fehler f INNER JOIN events e ON f.event_id = e.id GROUP BY tag, f.schweregrad) SELECT tag, schweregrad, anzahl FROM fehler_pro_tag ORDER BY tag DESC, anzahl DESC;`,
    hiddenTestMode: "rows"
  })
);

interviewExercises.push(
  makeWriteExercise("int", {
    title: "Alle Informatik-Studenten",
    description: "Zeige alle Studenten, die Informatik studieren, mit Name und Semester.",
    difficulty: "beginner",
    category: "Interview-Challenge",
    datasetId: universityDataset.id,
    referenceQuery: `SELECT name, semester FROM studenten WHERE studiengang = 'Informatik';`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "WHERE", "SELECT"],
    hints: [
      "Welche Spalte filtert den Studiengang?",
      "Nutze WHERE mit einem einfachen String-Vergleich."
    ],
    hiddenTestQuery: `SELECT name, semester FROM studenten WHERE studiengang = 'Informatik';`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Premium-Kunden",
    description: "Finde alle Premium-Kunden mit Name und E-Mail.",
    difficulty: "beginner",
    category: "Interview-Challenge",
    datasetId: ecommerceDataset.id,
    referenceQuery: `SELECT name, email FROM kunden WHERE ist_premium = 1;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "WHERE", "SELECT"],
    hints: [
      "Wie wird der Premium-Status in der Tabelle gespeichert?",
      "In sql.js werden Booleans als 0/1 gespeichert."
    ],
    hiddenTestQuery: `SELECT name, email FROM kunden WHERE ist_premium = 1;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Patienten mit Versicherung",
    description: "Zeige alle versicherten Patienten mit Name und Adresse.",
    difficulty: "beginner",
    category: "Interview-Challenge",
    datasetId: hospitalDataset.id,
    referenceQuery: `SELECT name, adresse FROM patienten WHERE versichert = 1;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "WHERE", "SELECT"],
    hints: [
      "Filtere nach der Spalte 'versichert'.",
      "Boolean-Werte werden in sql.js als 0/1 gespeichert."
    ],
    hiddenTestQuery: `SELECT name, adresse FROM patienten WHERE versichert = 1;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Produkte teurer als 100 Euro",
    description: "Zeige alle Produkte mit einem Preis ueber 100 Euro, sortiert nach Preis absteigend.",
    difficulty: "beginner",
    category: "Interview-Challenge",
    datasetId: ecommerceDataset.id,
    referenceQuery: `SELECT name, preis FROM produkte WHERE preis > 100 ORDER BY preis DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "WHERE", "ORDER BY"],
    hints: [
      "Nutze WHERE mit einem Preisvergleich.",
      "Sortiere das Ergebnis mit ORDER BY ... DESC."
    ],
    hiddenTestQuery: `SELECT name, preis FROM produkte WHERE preis > 100 ORDER BY preis DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Aerzte je Abteilung",
    description: "Zeige den Namen jedes Arztes und den Namen seiner Abteilung.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: hospitalDataset.id,
    referenceQuery: `SELECT ae.name AS arzt, ab.name AS abteilung FROM aerzte ae INNER JOIN abteilungen ab ON ae.abteilung_id = ab.id;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "SELECT"],
    hints: [
      "Du musst aerzte mit abteilungen ueber abteilung_id verknuepfen.",
      "Nutze INNER JOIN und vergiss nicht die Aliasnamen fuer die Namensspalten."
    ],
    hiddenTestQuery: `SELECT ae.name AS arzt, ab.name AS abteilung FROM aerzte ae INNER JOIN abteilungen ab ON ae.abteilung_id = ab.id;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Kurse eines Professors",
    description: "Finde alle Kurse, die von 'Prof. Dr. Mueller' gehalten werden.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: universityDataset.id,
    referenceQuery: `SELECT k.name, k.credits FROM kurse k INNER JOIN professoren p ON k.professor_id = p.id WHERE p.name LIKE '%Mueller%';`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "WHERE"],
    hints: [
      "Verbinde kurse mit professoren ueber professor_id.",
      "Filtere mit WHERE auf den Namen des Professors."
    ],
    hiddenTestQuery: `SELECT k.name, k.credits FROM kurse k INNER JOIN professoren p ON k.professor_id = p.id WHERE p.name LIKE '%Mueller%';`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Stornierte Bestellungen",
    description: "Zeige alle stornierten Bestellungen mit Datum und Gesamtbetrag.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: ecommerceDataset.id,
    referenceQuery: `SELECT id, datum, gesamtbetrag FROM bestellungen WHERE status = 'storniert';`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "WHERE", "SELECT"],
    hints: [
      "Welcher Statuswert steht fuer stornierte Bestellungen?",
      "Der Status-Wert ist 'storniert'."
    ],
    hiddenTestQuery: `SELECT id, datum, gesamtbetrag FROM bestellungen WHERE status = 'storniert';`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Behandlungen je Patient",
    description: "Zeige fuer jeden Patienten den Namen und die Anzahl seiner Behandlungen.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: hospitalDataset.id,
    referenceQuery: `SELECT p.name, COUNT(b.id) AS anzahl_behandlungen FROM patienten p INNER JOIN behandlungen b ON p.id = b.patient_id GROUP BY p.id, p.name ORDER BY anzahl_behandlungen DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "GROUP BY", "COUNT"],
    hints: [
      "Verbinde patienten mit behandlungen und gruppiere nach Patient.",
      "Nutze COUNT und GROUP BY, um die Anzahl zu zaehlen."
    ],
    hiddenTestQuery: `SELECT p.name, COUNT(b.id) AS anzahl_behandlungen FROM patienten p INNER JOIN behandlungen b ON p.id = b.patient_id GROUP BY p.id, p.name ORDER BY anzahl_behandlungen DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Log-Ereignisse nach Typ",
    description: "Zaehle, wie oft jeder Event-Typ vorkommt, sortiert nach Haeufigkeit.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: logsDataset.id,
    referenceQuery: `SELECT event_typ, COUNT(*) AS anzahl FROM events GROUP BY event_typ ORDER BY anzahl DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "GROUP BY", "COUNT"],
    hints: [
      "Gruppiere nach der Spalte event_typ.",
      "Nutze COUNT(*) und ORDER BY absteigend."
    ],
    hiddenTestQuery: `SELECT event_typ, COUNT(*) AS anzahl FROM events GROUP BY event_typ ORDER BY anzahl DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Krankenhaus-Behandlungskosten",
    description: "Berechne die Gesamtkosten aller Behandlungen pro Diagnose.",
    difficulty: "junior",
    category: "Interview-Challenge",
    datasetId: hospitalDataset.id,
    referenceQuery: `SELECT diagnose, SUM(kosten) AS gesamtkosten, COUNT(*) AS anzahl FROM behandlungen GROUP BY diagnose ORDER BY gesamtkosten DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "GROUP BY", "SUM"],
    hints: [
      "Gruppiere nach Diagnose und summiere die Kosten.",
      "Nutze SUM(kosten) und COUNT(*)."
    ],
    hiddenTestQuery: `SELECT diagnose, SUM(kosten) AS gesamtkosten, COUNT(*) AS anzahl FROM behandlungen GROUP BY diagnose ORDER BY gesamtkosten DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Durchschnittsnote je Kurs",
    description: "Berechne die Durchschnittsnote fuer jeden Kurs. Zeige Kursname und Durchschnittsnote, sortiert nach bester Note.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: universityDataset.id,
    referenceQuery: `SELECT k.name AS kurs, AVG(e.note) AS durchschnittsnote FROM kurse k INNER JOIN einschreibungen e ON k.id = e.kurs_id WHERE e.note IS NOT NULL GROUP BY k.id, k.name ORDER BY durchschnittsnote ASC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation", "NULL-Behandlung"],
    hints: [
      "Beachte, dass manche Noten NULL sein koennen.",
      "Nutze AVG() und filtere NULL-Werte mit WHERE note IS NOT NULL."
    ],
    hiddenTestQuery: `SELECT k.name AS kurs, AVG(e.note) AS durchschnittsnote FROM kurse k INNER JOIN einschreibungen e ON k.id = e.kurs_id WHERE e.note IS NOT NULL GROUP BY k.id, k.name ORDER BY durchschnittsnote ASC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Umsatz je Produktkategorie (E-Commerce)",
    description: "Berechne den Gesamtumsatz pro Produktkategorie basierend auf den Bestellpositionen.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: ecommerceDataset.id,
    referenceQuery: `SELECT p.kategorie, SUM(bp.menge * bp.einzelpreis) AS umsatz FROM produkte p INNER JOIN bestellpositionen bp ON p.id = bp.produkt_id GROUP BY p.kategorie ORDER BY umsatz DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Berechne den Umsatz als menge * einzelpreis pro Position.",
      "Verbinde produkte mit bestellpositionen und gruppiere nach kategorie."
    ],
    hiddenTestQuery: `SELECT p.kategorie, SUM(bp.menge * bp.einzelpreis) AS umsatz FROM produkte p INNER JOIN bestellpositionen bp ON p.id = bp.produkt_id GROUP BY p.kategorie ORDER BY umsatz DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Offene Rechnungen nach Status",
    description: "Zeige den Gesamtbetrag der offenen und der bezahlten Rechnungen.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: hospitalDataset.id,
    referenceQuery: `SELECT status, SUM(betrag) AS gesamtbetrag, COUNT(*) AS anzahl FROM rechnungen GROUP BY status ORDER BY gesamtbetrag DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "GROUP BY", "Aggregation"],
    hints: [
      "Gruppiere die Rechnungen nach ihrem Status.",
      "Nutze SUM und COUNT mit GROUP BY."
    ],
    hiddenTestQuery: `SELECT status, SUM(betrag) AS gesamtbetrag, COUNT(*) AS anzahl FROM rechnungen GROUP BY status ORDER BY gesamtbetrag DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Studenten ohne Einschreibung",
    description: "Finde alle Studenten, die in keinem Kurs eingeschrieben sind.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: universityDataset.id,
    referenceQuery: `SELECT s.name FROM studenten s LEFT JOIN einschreibungen e ON s.id = e.student_id WHERE e.id IS NULL;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "LEFT JOIN", "NULL"],
    hints: [
      "Wie findest du Studenten ohne Einschreibung? Ueberlege, welchen JOIN du brauchst.",
      "Nutze LEFT JOIN und pruefe auf NULL in der einschreibungen-Spalte."
    ],
    hiddenTestQuery: `SELECT s.name FROM studenten s LEFT JOIN einschreibungen e ON s.id = e.student_id WHERE e.id IS NULL;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Kampagnen-ROI",
    description: "Berechne den ROI (Konversionen / Klicks * 100) fuer jede Kampagne.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: ecommerceDataset.id,
    referenceQuery: `SELECT name, typ, klicks, konversionen, ROUND(konversionen * 100.0 / klicks, 2) AS roi_prozent FROM kampagnen ORDER BY roi_prozent DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Berechnung", "ORDER BY"],
    hints: [
      "ROI wird als (Konversionen / Klicks) * 100 berechnet.",
      "Multipliziere mit 100.0 um Fliesskommadivision zu erzwingen."
    ],
    hiddenTestQuery: `SELECT name, typ, klicks, konversionen, ROUND(konversionen * 100.0 / klicks, 2) AS roi_prozent FROM kampagnen ORDER BY roi_prozent DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Professor mit meisten Kursen",
    description: "Finde den Professor, der die meisten Kurse gibt, und zeige die Anzahl.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: universityDataset.id,
    referenceQuery: `SELECT p.name, COUNT(k.id) AS kursanzahl FROM professoren p INNER JOIN kurse k ON p.id = k.professor_id GROUP BY p.id, p.name ORDER BY kursanzahl DESC LIMIT 1;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "GROUP BY", "LIMIT"],
    hints: [
      "Verbinde professoren mit kursen und zaehle.",
      "Sortiere absteigend und hole mit LIMIT 1 den obersten."
    ],
    hiddenTestQuery: `SELECT p.name, COUNT(k.id) AS kursanzahl FROM professoren p INNER JOIN kurse k ON p.id = k.professor_id GROUP BY p.id, p.name ORDER BY kursanzahl DESC LIMIT 1;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Wiederholungskaeufer",
    description: "Finde Kunden, die mehr als eine Bestellung aufgegeben haben.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: ecommerceDataset.id,
    referenceQuery: `SELECT k.name, COUNT(b.id) AS bestellanzahl FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name HAVING COUNT(b.id) > 1 ORDER BY bestellanzahl DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "GROUP BY", "HAVING"],
    hints: [
      "Gruppiere nach Kunde und zaehle die Bestellungen.",
      "Nutze HAVING, um nur Kunden mit mehr als 1 Bestellung zu zeigen."
    ],
    hiddenTestQuery: `SELECT k.name, COUNT(b.id) AS bestellanzahl FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name HAVING COUNT(b.id) > 1 ORDER BY bestellanzahl DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Abteilungen mit mehr als 2 Aerzten",
    description: "Zeige alle Abteilungen, die mehr als 2 Aerzte haben.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: hospitalDataset.id,
    referenceQuery: `SELECT ab.name, COUNT(ae.id) AS aerzte_anzahl FROM abteilungen ab INNER JOIN aerzte ae ON ab.id = ae.abteilung_id GROUP BY ab.id, ab.name HAVING COUNT(ae.id) > 2;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "GROUP BY", "HAVING"],
    hints: [
      "Verbinde Abteilungen und Aerzte, dann gruppiere.",
      "Nutze HAVING COUNT(...) > 2 zum Filtern."
    ],
    hiddenTestQuery: `SELECT ab.name, COUNT(ae.id) AS aerzte_anzahl FROM abteilungen ab INNER JOIN aerzte ae ON ab.id = ae.abteilung_id GROUP BY ab.id, ab.name HAVING COUNT(ae.id) > 2;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Bewertungen nach Sterne",
    description: "Zeige die durchschnittliche Sternebewertung pro Produkt, aber nur fuer Produkte mit mindestens 2 Bewertungen.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: ecommerceDataset.id,
    referenceQuery: `SELECT p.name, AVG(b.sterne) AS avg_sterne, COUNT(b.id) AS anzahl FROM produkte p INNER JOIN bewertungen b ON p.id = b.produkt_id GROUP BY p.id, p.name HAVING COUNT(b.id) >= 2 ORDER BY avg_sterne DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "HAVING", "Aggregation"],
    hints: [
      "Verbinde produkte mit bewertungen und gruppiere nach Produkt.",
      "Nutze HAVING COUNT(b.id) >= 2 und AVG(b.sterne)."
    ],
    hiddenTestQuery: `SELECT p.name, AVG(b.sterne) AS avg_sterne, COUNT(b.id) AS anzahl FROM produkte p INNER JOIN bewertungen b ON p.id = b.produkt_id GROUP BY p.id, p.name HAVING COUNT(b.id) >= 2 ORDER BY avg_sterne DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Mitarbeiter mit hoeherem Gehalt als Durchschnitt",
    description: "Finde alle Mitarbeiter, die mehr verdienen als der Durchschnitt ihrer Abteilung.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: hrDataset.id,
    referenceQuery: `SELECT m.name, m.gehalt, a.name AS abteilung FROM mitarbeiter m INNER JOIN abteilungen a ON m.abteilung_id = a.id WHERE m.gehalt > (SELECT AVG(m2.gehalt) FROM mitarbeiter m2 WHERE m2.abteilung_id = m.abteilung_id) ORDER BY m.gehalt DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Subquery", "Correlated Subquery"],
    hints: [
      "Du brauchst eine korrelierte Unterabfrage, die den Durchschnitt der gleichen Abteilung berechnet.",
      "Vergleiche m.gehalt mit dem Subquery-Ergebnis fuer die gleiche abteilung_id."
    ],
    hiddenTestQuery: `SELECT m.name, m.gehalt, a.name AS abteilung FROM mitarbeiter m INNER JOIN abteilungen a ON m.abteilung_id = a.id WHERE m.gehalt > (SELECT AVG(m2.gehalt) FROM mitarbeiter m2 WHERE m2.abteilung_id = m.abteilung_id) ORDER BY m.gehalt DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Zahlungsmethoden-Verteilung",
    description: "Zeige jede Zahlungsmethode und den damit erzielten Gesamtumsatz.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: shopDataset.id,
    referenceQuery: `SELECT zahlungsmittel, SUM(betrag) AS gesamtumsatz, COUNT(*) AS anzahl FROM zahlungen GROUP BY zahlungsmittel ORDER BY gesamtumsatz DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "GROUP BY", "Aggregation"],
    hints: [
      "Gruppiere die Zahlungen nach zahlungsmittel.",
      "Nutze SUM(betrag) und COUNT(*)."
    ],
    hiddenTestQuery: `SELECT zahlungsmittel, SUM(betrag) AS gesamtumsatz, COUNT(*) AS anzahl FROM zahlungen GROUP BY zahlungsmittel ORDER BY gesamtumsatz DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Pruefungsbestehensrate je Kurs",
    description: "Berechne die Bestehensrate (Anteil bestanden) fuer jeden Kurs mit Pruefung.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: universityDataset.id,
    referenceQuery: `SELECT k.name AS kurs, ROUND(SUM(CASE WHEN pe.bestanden = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS bestehensrate_prozent FROM kurse k INNER JOIN pruefungen pr ON k.id = pr.kurs_id INNER JOIN pruefungsergebnisse pe ON pr.id = pe.pruefung_id GROUP BY k.id, k.name ORDER BY bestehensrate_prozent DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "CASE WHEN", "JOIN", "Aggregation"],
    hints: [
      "Nutze CASE WHEN bestanden = 1 THEN 1 ELSE 0 END, um Bestanden zu zaehlen.",
      "Teile die Anzahl Bestandene durch die Gesamtanzahl und multipliziere mit 100."
    ],
    hiddenTestQuery: `SELECT k.name AS kurs, ROUND(SUM(CASE WHEN pe.bestanden = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS bestehensrate_prozent FROM kurse k INNER JOIN pruefungen pr ON k.id = pr.kurs_id INNER JOIN pruefungsergebnisse pe ON pr.id = pe.pruefung_id GROUP BY k.id, k.name ORDER BY bestehensrate_prozent DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Durchschnittliche Behandlungskosten je Abteilung",
    description: "Berechne die durchschnittlichen Behandlungskosten pro Abteilung.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: hospitalDataset.id,
    referenceQuery: `SELECT ab.name AS abteilung, ROUND(AVG(b.kosten), 2) AS avg_kosten FROM abteilungen ab INNER JOIN aerzte ae ON ab.id = ae.abteilung_id INNER JOIN behandlungen b ON ae.id = b.arzt_id GROUP BY ab.id, ab.name ORDER BY avg_kosten DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Multi-JOIN", "Aggregation"],
    hints: [
      "Du musst drei Tabellen joinen: abteilungen -> aerzte -> behandlungen.",
      "Gruppiere nach Abteilung und nutze AVG(kosten)."
    ],
    hiddenTestQuery: `SELECT ab.name AS abteilung, ROUND(AVG(b.kosten), 2) AS avg_kosten FROM abteilungen ab INNER JOIN aerzte ae ON ab.id = ae.abteilung_id INNER JOIN behandlungen b ON ae.id = b.arzt_id GROUP BY ab.id, ab.name ORDER BY avg_kosten DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Versicherungsquote nach Geschlecht",
    description: "Zeige den Anteil versicherter Patienten nach Geschlecht.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    datasetId: hospitalDataset.id,
    referenceQuery: `SELECT geschlecht, COUNT(*) AS anzahl, SUM(CASE WHEN versichert = 1 THEN 1 ELSE 0 END) AS versichert, ROUND(SUM(CASE WHEN versichert = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS versicherungsquote_prozent FROM patienten GROUP BY geschlecht;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "CASE WHEN", "GROUP BY"],
    hints: [
      "Nutze CASE WHEN versichert = 1, um Versicherte zu zaehlen.",
      "Teile durch COUNT(*) und multipliziere mit 100 fuer den Prozentsatz."
    ],
    hiddenTestQuery: `SELECT geschlecht, COUNT(*) AS anzahl, SUM(CASE WHEN versichert = 1 THEN 1 ELSE 0 END) AS versichert, ROUND(SUM(CASE WHEN versichert = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 1) AS versicherungsquote_prozent FROM patienten GROUP BY geschlecht;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Gehaltsranking je Abteilung",
    description: "Zeige jeden Mitarbeiter mit seinem Gehaltsranking innerhalb seiner Abteilung (hoechstes Gehalt bekommt Rang 1).",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: hrDataset.id,
    referenceQuery: `SELECT m.name, a.name AS abteilung, m.gehalt, RANK() OVER (PARTITION BY m.abteilung_id ORDER BY m.gehalt DESC) AS gehaltsrang FROM mitarbeiter m INNER JOIN abteilungen a ON m.abteilung_id = a.id ORDER BY a.name, gehaltsrang;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Window Function", "RANK"],
    hints: [
      "Nutze RANK() OVER (PARTITION BY ... ORDER BY ...) fuer das Ranking.",
      "Partitioniere nach abteilung_id und sortiere nach gehalt DESC."
    ],
    hiddenTestQuery: `SELECT m.name, a.name AS abteilung, m.gehalt, RANK() OVER (PARTITION BY m.abteilung_id ORDER BY m.gehalt DESC) AS gehaltsrang FROM mitarbeiter m INNER JOIN abteilungen a ON m.abteilung_id = a.id ORDER BY a.name, gehaltsrang;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Top-Arzt je Abteilung nach Kosten",
    description: "Finde den Arzt mit den hoechsten Behandlungskosten pro Abteilung.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: hospitalDataset.id,
    referenceQuery: `SELECT ab.name AS abteilung, ae.name AS arzt, SUM(b.kosten) AS gesamtkosten FROM abteilungen ab INNER JOIN aerzte ae ON ab.id = ae.abteilung_id INNER JOIN behandlungen b ON ae.id = b.arzt_id GROUP BY ab.id, ab.name, ae.id, ae.name ORDER BY ab.name, gesamtkosten DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Multi-JOIN", "Aggregation"],
    hints: [
      "Berechne zuerst die Gesamtkosten pro Arzt ueber alle Behandlungen.",
      "Verbinde Abteilungen, Aerzte und Behandlungen."
    ],
    hiddenTestQuery: `SELECT ab.name AS abteilung, ae.name AS arzt, SUM(b.kosten) AS gesamtkosten FROM abteilungen ab INNER JOIN aerzte ae ON ab.id = ae.abteilung_id INNER JOIN behandlungen b ON ae.id = b.arzt_id GROUP BY ab.id, ab.name, ae.id, ae.name ORDER BY ab.name, gesamtkosten DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Laufende Summe der E-Commerce-Bestellungen",
    description: "Berechne eine laufende Summe (Running Total) der Bestellgesamtbeitraege, sortiert nach Datum.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: ecommerceDataset.id,
    referenceQuery: `SELECT id, datum, gesamtbetrag, SUM(gesamtbetrag) OVER (ORDER BY datum) AS laufende_summe FROM bestellungen ORDER BY datum;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Window Function", "Running Total"],
    hints: [
      "Nutze SUM() OVER (ORDER BY ...) als Window Function.",
      "Das erzeugt eine kumulative Summe ueber die geordnete Menge."
    ],
    hiddenTestQuery: `SELECT id, datum, gesamtbetrag, SUM(gesamtbetrag) OVER (ORDER BY datum) AS laufende_summe FROM bestellungen ORDER BY datum;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Mitarbeiter und deren Manager",
    description: "Zeige jeden Mitarbeiter und den Namen seines Managers (Self-Join).",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: hrDataset.id,
    referenceQuery: `SELECT m.name AS mitarbeiter, mg.name AS manager FROM mitarbeiter m LEFT JOIN mitarbeiter mg ON m.manager_id = mg.id ORDER BY m.name;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Self-JOIN", "LEFT JOIN"],
    hints: [
      "Verknuepfe die Mitarbeiter-Tabelle mit sich selbst ueber manager_id.",
      "Nutze einen Self-Join: mitarbeiter m LEFT JOIN mitarbeiter mg ON m.manager_id = mg.id."
    ],
    hiddenTestQuery: `SELECT m.name AS mitarbeiter, mg.name AS manager FROM mitarbeiter m LEFT JOIN mitarbeiter mg ON m.manager_id = mg.id ORDER BY m.name;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Kunden mit Umsatz ueber Durchschnitt",
    description: "Finde alle Kunden, deren Gesamtbestellwert ueber dem Durchschnitt aller Kunden liegt.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: ecommerceDataset.id,
    referenceQuery: `SELECT k.name, SUM(b.gesamtbetrag) AS kundenumsatz FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name HAVING SUM(b.gesamtbetrag) > (SELECT AVG(kundenumsatz) FROM (SELECT SUM(b2.gesamtbetrag) AS kundenumsatz FROM bestellungen b2 GROUP BY b2.kunde_id)) ORDER BY kundenumsatz DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Subquery", "HAVING", "Aggregation"],
    hints: [
      "Berechne zuerst den Durchschnittsumsatz pro Kunde als Subquery.",
      "Vergleiche dann mit HAVING SUM(gesamtbetrag) > dem Durchschnitt."
    ],
    hiddenTestQuery: `SELECT k.name, SUM(b.gesamtbetrag) AS kundenumsatz FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name HAVING SUM(b.gesamtbetrag) > (SELECT AVG(kundenumsatz) FROM (SELECT SUM(b2.gesamtbetrag) AS kundenumsatz FROM bestellungen b2 GROUP BY b2.kunde_id)) ORDER BY kundenumsatz DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Pruefungspunkte relativ zum Maximum",
    description: "Zeige fuer jedes Pruefungsergebnis den Studenten, das erreichte Punkte und den Prozentsatz der Maximalpunkte.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: universityDataset.id,
    referenceQuery: `SELECT s.name AS student, k.name AS kurs, pe.punkte, pr.max_punkte, ROUND(pe.punkte * 100.0 / pr.max_punkte, 1) AS prozent FROM pruefungsergebnisse pe INNER JOIN pruefungen pr ON pe.pruefung_id = pr.id INNER JOIN kurse k ON pr.kurs_id = k.id INNER JOIN studenten s ON pe.student_id = s.id ORDER BY prozent DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Multi-JOIN", "Berechnung"],
    hints: [
      "Du musst vier Tabellen joinen: pruefungsergebnisse -> pruefungen -> kurse, und studenten.",
      "Berechne den Prozentsatz als punkte * 100.0 / max_punkte."
    ],
    hiddenTestQuery: `SELECT s.name AS student, k.name AS kurs, pe.punkte, pr.max_punkte, ROUND(pe.punkte * 100.0 / pr.max_punkte, 1) AS prozent FROM pruefungsergebnisse pe INNER JOIN pruefungen pr ON pe.pruefung_id = pr.id INNER JOIN kurse k ON pr.kurs_id = k.id INNER JOIN studenten s ON pe.student_id = s.id ORDER BY prozent DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Gehaltsdifferenz zum Abteilungsdurchschnitt",
    description: "Zeige jeden Mitarbeiter, sein Gehalt, den Durchschnitt seiner Abteilung und die Differenz zum Durchschnitt.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: hrDataset.id,
    referenceQuery: `SELECT m.name, a.name AS abteilung, m.gehalt, ROUND(dept_avg.avg_gehalt, 2) AS abteilungs_durchschnitt, ROUND(m.gehalt - dept_avg.avg_gehalt, 2) AS differenz FROM mitarbeiter m INNER JOIN abteilungen a ON m.abteilung_id = a.id INNER JOIN (SELECT abteilung_id, AVG(gehalt) AS avg_gehalt FROM mitarbeiter GROUP BY abteilung_id) dept_avg ON m.abteilung_id = dept_avg.abteilung_id ORDER BY differenz DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Subquery", "Aggregation"],
    hints: [
      "Berechne den Durchschnitt pro Abteilung als Unterabfrage.",
      "Verbinde das Ergebnis mit den Mitarbeitern und berechne die Differenz."
    ],
    hiddenTestQuery: `SELECT m.name, a.name AS abteilung, m.gehalt, ROUND(dept_avg.avg_gehalt, 2) AS abteilungs_durchschnitt, ROUND(m.gehalt - dept_avg.avg_gehalt, 2) AS differenz FROM mitarbeiter m INNER JOIN abteilungen a ON m.abteilung_id = a.id INNER JOIN (SELECT abteilung_id, AVG(gehalt) AS avg_gehalt FROM mitarbeiter GROUP BY abteilung_id) dept_avg ON m.abteilung_id = dept_avg.abteilung_id ORDER BY differenz DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Konversionsrate je Kampagnentyp",
    description: "Berechne fuer jeden Kampagnentyp die durchschnittlichen Klicks, Konversionen und die Konversionsrate.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: ecommerceDataset.id,
    referenceQuery: `SELECT typ, COUNT(*) AS anzahl, ROUND(AVG(klicks), 0) AS avg_klicks, ROUND(AVG(konversionen), 0) AS avg_konversionen, ROUND(AVG(konversionen) * 100.0 / AVG(klicks), 2) AS konversionsrate_prozent FROM kampagnen GROUP BY typ ORDER BY konversionsrate_prozent DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Aggregation", "Berechnung"],
    hints: [
      "Gruppiere nach Kampagnentyp und berechne Durchschnittswerte.",
      "Konversionsrate = Konversionen / Klicks * 100."
    ],
    hiddenTestQuery: `SELECT typ, COUNT(*) AS anzahl, ROUND(AVG(klicks), 0) AS avg_klicks, ROUND(AVG(konversionen), 0) AS avg_konversionen, ROUND(AVG(konversionen) * 100.0 / AVG(klicks), 2) AS konversionsrate_prozent FROM kampagnen GROUP BY typ ORDER BY konversionsrate_prozent DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Tickets mit Kommentaren zaehlen",
    description: "Zeige jedes Ticket mit der Anzahl seiner Kommentare.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: ticketsDataset.id,
    referenceQuery: `SELECT t.id, t.titel, COUNT(ko.id) AS kommentar_anzahl FROM tickets t LEFT JOIN kommentare ko ON t.id = ko.ticket_id GROUP BY t.id, t.titel ORDER BY kommentar_anzahl DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "LEFT JOIN", "GROUP BY", "COUNT"],
    hints: [
      "Nutze LEFT JOIN, da nicht jedes Ticket Kommentare hat.",
      "Zaehle die Kommentare mit COUNT und gruppiere nach Ticket."
    ],
    hiddenTestQuery: `SELECT t.id, t.titel, COUNT(ko.id) AS kommentar_anzahl FROM tickets t LEFT JOIN kommentare ko ON t.id = ko.ticket_id GROUP BY t.id, t.titel ORDER BY kommentar_anzahl DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Umsatz pro Kunde mit Ranking",
    description: "Berechne den Gesamtumsatz pro Kunde und weise jedem Kunden ein Ranking basierend auf dem Umsatz zu.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: shopDataset.id,
    referenceQuery: `SELECT k.name, SUM(b.gesamtbetrag) AS umsatz, RANK() OVER (ORDER BY SUM(b.gesamtbetrag) DESC) AS rang FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name ORDER BY rang;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Window Function", "RANK", "Aggregation"],
    hints: [
      "Berechne zuerst den Gesamtumsatz pro Kunde mit GROUP BY.",
      "Nutze RANK() OVER (ORDER BY SUM(...) DESC) fuer das Ranking."
    ],
    hiddenTestQuery: `SELECT k.name, SUM(b.gesamtbetrag) AS umsatz, RANK() OVER (ORDER BY SUM(b.gesamtbetrag) DESC) AS rang FROM kunden k INNER JOIN bestellungen b ON k.id = b.kunde_id GROUP BY k.id, k.name ORDER BY rang;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Ueberfaellige Rechnungen mit Patientendaten",
    description: "Finde alle ueberfaelligen Rechnungen mit Patientennamen und Tagen seit Rechnungsdatum.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: hospitalDataset.id,
    referenceQuery: `SELECT p.name AS patient, r.betrag, r.rechnungsdatum, r.faelligkeitsdatum, CAST(julianday('2024-06-01') - julianday(r.rechnungsdatum) AS INTEGER) AS tage_seit_rechnung FROM rechnungen r INNER JOIN patienten p ON r.patient_id = p.id WHERE r.status = 'ueberfaellig' ORDER BY r.betrag DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Date Function", "CAST"],
    hints: [
      "Filtere auf status = 'ueberfaellig' und joine mit patienten.",
      "Nutze julianday() um die Tage seit der Rechnung zu berechnen."
    ],
    hiddenTestQuery: `SELECT p.name AS patient, r.betrag, r.rechnungsdatum, r.faelligkeitsdatum, CAST(julianday('2024-06-01') - julianday(r.rechnungsdatum) AS INTEGER) AS tage_seit_rechnung FROM rechnungen r INNER JOIN patienten p ON r.patient_id = p.id WHERE r.status = 'ueberfaellig' ORDER BY r.betrag DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Filme mit hoeherer Bewertung als Genre-Durchschnitt",
    description: "Finde alle Filme, deren Bewertung ueber dem Durchschnitt ihres Genres liegt.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: streamingDataset.id,
    referenceQuery: `SELECT f.titel, f.genre, f.bewertung, ROUND(genre_avg.avg_bewertung, 2) AS genre_durchschnitt FROM filme f INNER JOIN (SELECT genre, AVG(bewertung) AS avg_bewertung FROM filme GROUP BY genre) genre_avg ON f.genre = genre_avg.genre WHERE f.bewertung > genre_avg.avg_bewertung ORDER BY f.bewertung DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Subquery", "Aggregation"],
    hints: [
      "Berechne den Durchschnitt pro Genre als Unterabfrage.",
      "Vergleiche jede Filmbewertung mit dem Durchschnitt des zugehoerigen Genres."
    ],
    hiddenTestQuery: `SELECT f.titel, f.genre, f.bewertung, ROUND(genre_avg.avg_bewertung, 2) AS genre_durchschnitt FROM filme f INNER JOIN (SELECT genre, AVG(bewertung) AS avg_bewertung FROM filme GROUP BY genre) genre_avg ON f.genre = genre_avg.genre WHERE f.bewertung > genre_avg.avg_bewertung ORDER BY f.bewertung DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Fehlerquote nach Browser",
    description: "Berechne die Fehlerquote (Fehler pro Session) fuer jeden Browser.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: logsDataset.id,
    referenceQuery: `SELECT s.browser, COUNT(DISTINCT s.id) AS sessions, COUNT(f.id) AS fehler, ROUND(COUNT(f.id) * 100.0 / COUNT(DISTINCT s.id), 2) AS fehlerquote_prozent FROM sessions s LEFT JOIN events e ON s.id = e.session_id LEFT JOIN fehler f ON e.id = f.event_id GROUP BY s.browser ORDER BY fehlerquote_prozent DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Multi-JOIN", "LEFT JOIN", "Aggregation"],
    hints: [
      "Verbinde sessions -> events -> fehler mit LEFT JOINs.",
      "Zaehle eindeutige Sessions und Fehler, berechne den Prozentsatz."
    ],
    hiddenTestQuery: `SELECT s.browser, COUNT(DISTINCT s.id) AS sessions, COUNT(f.id) AS fehler, ROUND(COUNT(f.id) * 100.0 / COUNT(DISTINCT s.id), 2) AS fehlerquote_prozent FROM sessions s LEFT JOIN events e ON s.id = e.session_id LEFT JOIN fehler f ON e.id = f.event_id GROUP BY s.browser ORDER BY fehlerquote_prozent DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Gekoppelte Premium-Kunden-Bestellungen",
    description: "Finde Produkte, die von Premium-Kunden gekauft wurden, und zeige pro Produkt die Anzahl der Bestellpositionen von Premium-Kunden.",
    difficulty: "advanced",
    category: "Interview-Challenge",
    datasetId: ecommerceDataset.id,
    referenceQuery: `SELECT p.name AS produkt, p.kategorie, COUNT(bp.id) AS premium_bestellungen FROM produkte p INNER JOIN bestellpositionen bp ON p.id = bp.produkt_id INNER JOIN bestellungen b ON bp.bestellung_id = b.id INNER JOIN kunden k ON b.kunde_id = k.id WHERE k.ist_premium = 1 GROUP BY p.id, p.name, p.kategorie ORDER BY premium_bestellungen DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "Multi-JOIN", "GROUP BY", "Filtering"],
    hints: [
      "Du musst vier Tabellen joinen: produkte -> bestellpositionen -> bestellungen -> kunden.",
      "Filtere auf ist_premium = 1 und zaehle die Bestellpositionen."
    ],
    hiddenTestQuery: `SELECT p.name AS produkt, p.kategorie, COUNT(bp.id) AS premium_bestellungen FROM produkte p INNER JOIN bestellpositionen bp ON p.id = bp.produkt_id INNER JOIN bestellungen b ON bp.bestellung_id = b.id INNER JOIN kunden k ON b.kunde_id = k.id WHERE k.ist_premium = 1 GROUP BY p.id, p.name, p.kategorie ORDER BY premium_bestellungen DESC;`,
    hiddenTestMode: "rows",
  })
);
