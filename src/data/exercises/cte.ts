/**
 * CTE-Uebungen (Common Table Expressions).
 * Enthaelt Uebungen fuer WITH-Klauseln und rekursive CTEs.
 */
import { makeWriteExercise, resetCounter } from "@/data/exercises/_factory";
import type { Exercise } from "@/types/exercise";
import { shopDataset } from "@/data/datasets/shop";
import { fitnessDataset } from "@/data/datasets/fitness";
import { hrDataset } from "@/data/datasets/hr";
import { ticketsDataset } from "@/data/datasets/tickets";
import { bankingDataset } from "@/data/datasets/banking";
import { streamingDataset } from "@/data/datasets/streaming";
import { logsDataset } from "@/data/datasets/logs";

export const cteExercises: Exercise[] = [];
resetCounter();
cteExercises.push(
  makeWriteExercise("cte", {
    title: "Einfache CTE: Kunden mit Bestellungen",
    description: "Verwende eine CTE, um alle Kunden zu finden, die mindestens eine Bestellung aufgegeben haben. Zeige den Kundennamen und die Anzahl der Bestellungen.",
    difficulty: "intermediate",
    category: "CTE",
    datasetId: shopDataset.id,
    referenceQuery: "WITH kunden_bestellungen AS (SELECT kunde_id, COUNT(*) AS anzahl FROM bestellungen GROUP BY kunde_id) SELECT k.name, kb.anzahl FROM kunden k INNER JOIN kunden_bestellungen kb ON k.id = kb.kunde_id ORDER BY kb.anzahl DESC;",
    tags: ["CTE", "WITH"],
    hints: [
      "Eine CTE beginnt mit `WITH name AS (...)`.",
      "Definiere die CTE mit der Aggregation, dann joine sie mit der Haupttabelle."
    ],
    hiddenTestQuery: "WITH kunden_bestellungen AS (SELECT kunde_id, COUNT(*) AS anzahl FROM bestellungen GROUP BY kunde_id) SELECT k.name, kb.anzahl FROM kunden k INNER JOIN kunden_bestellungen kb ON k.id = kb.kunde_id ORDER BY kb.anzahl DESC;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Mitarbeiter mit hoechstem Gehalt pro Abteilung",
    description: "Nutze eine CTE, um den bestbezahlten Mitarbeiter je Abteilung zu finden.",
    difficulty: "intermediate",
    category: "CTE",
    datasetId: hrDataset.id,
    referenceQuery: "WITH top_gehalt AS (SELECT abteilung_id, MAX(gehalt) AS max_gehalt FROM mitarbeiter GROUP BY abteilung_id) SELECT m.name, m.gehalt, a.name AS abteilung FROM mitarbeiter m INNER JOIN top_gehalt tg ON m.abteilung_id = tg.abteilung_id AND m.gehalt = tg.max_gehalt INNER JOIN abteilungen a ON m.abteilung_id = a.id;",
    tags: ["CTE", "WITH", "Aggregation"],
    hints: [
      "Erstelle eine CTE, die die maximales Gehalt pro Abteilung ermittelt.",
      "Joine dann die CTE mit der Mitarbeitetabelle, um die Namen zu erhalten."
    ],
    hiddenTestQuery: "WITH top_gehalt AS (SELECT abteilung_id, MAX(gehalt) AS max_gehalt FROM mitarbeiter GROUP BY abteilung_id) SELECT m.name, m.gehalt, a.name AS abteilung FROM mitarbeiter m INNER JOIN top_gehalt tg ON m.abteilung_id = tg.abteilung_id AND m.gehalt = tg.max_gehalt INNER JOIN abteilungen a ON m.abteilung_id = a.id;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Durchschnittsbewertung pro Film",
    description: "Verwende eine CTE, um die Durchschnittsbewertung pro Film zu berechnen und filme mit Bewertung ueber 4.0 anzuzeigen.",
    difficulty: "intermediate",
    category: "CTE",
    datasetId: streamingDataset.id,
    referenceQuery: "WITH film_bewertungen AS (SELECT film_id, AVG(sterne) AS avg_sterne FROM bewertungen GROUP BY film_id) SELECT f.titel, fb.avg_sterne FROM filme f INNER JOIN film_bewertungen fb ON f.id = fb.film_id WHERE fb.avg_sterne > 4.0 ORDER BY fb.avg_sterne DESC;",
    tags: ["CTE", "WITH", "Aggregation"],
    hints: [
      "Erstelle eine CTE mit `AVG(sterne)` und `GROUP BY film_id`.",
      "Joine die CTE mit `filme` und filtere mit `WHERE avg_sterne > 4.0`."
    ],
    hiddenTestQuery: "WITH film_bewertungen AS (SELECT film_id, AVG(sterne) AS avg_sterne FROM bewertungen GROUP BY film_id) SELECT f.titel, fb.avg_sterne FROM filme f INNER JOIN film_bewertungen fb ON f.id = fb.film_id WHERE fb.avg_sterne > 4.0 ORDER BY fb.avg_sterne DESC;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Kunden und ihr Gesamtumsatz",
    description: "Nutze eine CTE, um den Gesamtumsatz je Kunde zu berechnen, und zeige Kunden mit Umsatz ueber 500.",
    difficulty: "intermediate",
    category: "CTE",
    datasetId: shopDataset.id,
    referenceQuery: "WITH kunden_umsatz AS (SELECT kunde_id, SUM(gesamtbetrag) AS total_umsatz FROM bestellungen GROUP BY kunde_id) SELECT k.name, ku.total_umsatz FROM kunden k INNER JOIN kunden_umsatz ku ON k.id = ku.kunde_id WHERE ku.total_umsatz > 500 ORDER BY ku.total_umsatz DESC;",
    tags: ["CTE", "WITH", "Aggregation"],
    hints: [
      "Berechne in der CTE die Summe pro `kunde_id`.",
      "Joine mit `kunden` um den Namen zu erhalten."
    ],
    hiddenTestQuery: "WITH kunden_umsatz AS (SELECT kunde_id, SUM(gesamtbetrag) AS total_umsatz FROM bestellungen GROUP BY kunde_id) SELECT k.name, ku.total_umsatz FROM kunden k INNER JOIN kunden_umsatz ku ON k.id = ku.kunde_id WHERE ku.total_umsatz > 500 ORDER BY ku.total_umsatz DESC;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Sessions mit mehr als 5 Events",
    description: "Verwende eine CTE, um die Anzahl von Events pro Session zu zaehlen und Sessions mit mehr als 5 Events anzuzeigen.",
    difficulty: "intermediate",
    category: "CTE",
    datasetId: logsDataset.id,
    referenceQuery: "WITH session_events AS (SELECT session_id, COUNT(*) AS event_count FROM events GROUP BY session_id) SELECT s.id, s.browser, se.event_count FROM sessions s INNER JOIN session_events se ON s.id = se.session_id WHERE se.event_count > 5 ORDER BY se.event_count DESC;",
    tags: ["CTE", "WITH", "Aggregation"],
    hints: [
      "Zaehle die Events pro Session in der CTE.",
      "Filtere die CTE-Ergebnisse mit `WHERE event_count > 5`."
    ],
    hiddenTestQuery: "WITH session_events AS (SELECT session_id, COUNT(*) AS event_count FROM events GROUP BY session_id) SELECT s.id, s.browser, se.event_count FROM sessions s INNER JOIN session_events se ON s.id = se.session_id WHERE se.event_count > 5 ORDER BY se.event_count DESC;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Agenten und Ticket-Statistiken",
    description: "Nutze eine CTE, um die Anzahl und den Durchschnittspriority-Wert der Tickets pro Agent zu berechnen.",
    difficulty: "intermediate",
    category: "CTE",
    datasetId: ticketsDataset.id,
    referenceQuery: "WITH agent_stats AS (SELECT agent_id, COUNT(*) AS ticket_count FROM tickets WHERE agent_id IS NOT NULL GROUP BY agent_id) SELECT a.name, a.team, COALESCE(ast.ticket_count, 0) AS ticket_count FROM agenten a LEFT JOIN agent_stats ast ON a.id = ast.agent_id ORDER BY ticket_count DESC;",
    tags: ["CTE", "WITH", "LEFT JOIN"],
    hints: [
      "Zaehle die Tickets pro `agent_id` in der CTE.",
      "Verwende einen LEFT JOIN, um auch Agenten ohne Tickets zu zeigen."
    ],
    hiddenTestQuery: "WITH agent_stats AS (SELECT agent_id, COUNT(*) AS ticket_count FROM tickets WHERE agent_id IS NOT NULL GROUP BY agent_id) SELECT a.name, a.team, COALESCE(ast.ticket_count, 0) AS ticket_count FROM agenten a LEFT JOIN agent_stats ast ON a.id = ast.agent_id ORDER BY ticket_count DESC;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Gesamtsaldo pro Kunde",
    description: "Verwende eine CTE, um den Gesamtsaldo pro Kunde ueber alle Konten zu berechnen.",
    difficulty: "intermediate",
    category: "CTE",
    datasetId: bankingDataset.id,
    referenceQuery: "WITH kunden_saldi AS (SELECT kunde_id, SUM(saldo) AS gesamt_saldo FROM konten GROUP BY kunde_id) SELECT ku.name, ks.gesamt_saldo FROM kunden ku INNER JOIN kunden_saldi ks ON ku.id = ks.kunde_id ORDER BY ks.gesamt_saldo DESC;",
    tags: ["CTE", "WITH", "Aggregation"],
    hints: [
      "Summiere den Saldo pro `kunde_id` in der CTE.",
      "Joine mit `kunden` um den Namen zu erhalten."
    ],
    hiddenTestQuery: "WITH kunden_saldi AS (SELECT kunde_id, SUM(saldo) AS gesamt_saldo FROM konten GROUP BY kunde_id) SELECT ku.name, ks.gesamt_saldo FROM kunden ku INNER JOIN kunden_saldi ks ON ku.id = ks.kunde_id ORDER BY ks.gesamt_saldo DESC;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Workout-Dauer pro Nutzer",
    description: "Nutze eine CTE, um die Gesamtdauer der Workouts pro Nutzer zu berechnen.",
    difficulty: "intermediate",
    category: "CTE",
    datasetId: fitnessDataset.id,
    referenceQuery: "WITH nutzer_workouts AS (SELECT nutzer_id, SUM(dauer_min) AS total_min FROM workouts GROUP BY nutzer_id) SELECT n.name, nw.total_min FROM nutzer n INNER JOIN nutzer_workouts nw ON n.id = nw.nutzer_id ORDER BY nw.total_min DESC;",
    tags: ["CTE", "WITH", "Aggregation"],
    hints: [
      "Summiere die `dauer_min` pro `nutzer_id` in der CTE.",
      "Joine mit der Nutzertabelle fuer die Namen."
    ],
    hiddenTestQuery: "WITH nutzer_workouts AS (SELECT nutzer_id, SUM(dauer_min) AS total_min FROM workouts GROUP BY nutzer_id) SELECT n.name, nw.total_min FROM nutzer n INNER JOIN nutzer_workouts nw ON n.id = nw.nutzer_id ORDER BY nw.total_min DESC;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Urlaubsantraege nach Monat",
    description: "Verwende eine CTE, um die Anzahl der Urlaubsantraege pro Monat zu zaehlen.",
    difficulty: "intermediate",
    category: "CTE",
    datasetId: hrDataset.id,
    referenceQuery: "WITH urlaub_pro_monat AS (SELECT strftime('%Y-%m', startdatum) AS monat, COUNT(*) AS anzahl FROM urlaub GROUP BY monat) SELECT monat, anzahl FROM urlaub_pro_monat ORDER BY monat;",
    tags: ["CTE", "WITH", "Datum"],
    hints: [
      "Verwende `strftime('%Y-%m', startdatum)` fuer die Monatsextraktion.",
      "Gruppiere und zaehle in der CTE."
    ],
    hiddenTestQuery: "WITH urlaub_pro_monat AS (SELECT strftime('%Y-%m', startdatum) AS monat, COUNT(*) AS anzahl FROM urlaub GROUP BY monat) SELECT monat, anzahl FROM urlaub_pro_monat ORDER BY monat;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "Mehrere CTEs: Produkte und Bestellstatistiken",
    description: "Verwende zwei CTEs: eine fuer Produktstatistiken (anzahl bestellungen pro produkt) und eine fuer die Bestellsumme pro produkt. Zeige Produktname, Anzahl und Summe.",
    difficulty: "advanced",
    category: "CTE",
    datasetId: shopDataset.id,
    referenceQuery: "WITH produkt_anzahl AS (SELECT produkt_id, SUM(menge) AS anzahl FROM bestellpositionen GROUP BY produkt_id), produkt_summe AS (SELECT produkt_id, SUM(menge * einzelpreis) AS summe FROM bestellpositionen GROUP BY produkt_id) SELECT p.name, pa.anzahl, ps.summe FROM produkte p LEFT JOIN produkt_anzahl pa ON p.id = pa.produkt_id LEFT JOIN produkt_summe ps ON p.id = ps.produkt_id ORDER BY ps.summe DESC;",
    tags: ["CTE", "WITH", "Mehrere CTEs"],
    hints: [
      "Verwende `WITH cte1 AS (...), cte2 AS (...)` fuer mehrere CTEs.",
      "Erstelle eine CTE fuer die Anzahl und eine fuer die Summe."
    ],
    hiddenTestQuery: "WITH produkt_anzahl AS (SELECT produkt_id, SUM(menge) AS anzahl FROM bestellpositionen GROUP BY produkt_id), produkt_summe AS (SELECT produkt_id, SUM(menge * einzelpreis) AS summe FROM bestellpositionen GROUP BY produkt_id) SELECT p.name, pa.anzahl, ps.summe FROM produkte p LEFT JOIN produkt_anzahl pa ON p.id = pa.produkt_id LEFT JOIN produkt_summe ps ON p.id = ps.produkt_id ORDER BY ps.summe DESC;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE vs Subquery: Kundenumsatz",
    description: "Schreibe die gleiche Abfrage einmal mit CTE und einmal als Subquery. Zeige Kunden mit Gesamtbestellsumme ueber 500.",
    difficulty: "advanced",
    category: "CTE",
    datasetId: shopDataset.id,
    referenceQuery: "WITH kunden_umsatz AS (SELECT kunde_id, SUM(gesamtbetrag) AS total FROM bestellungen GROUP BY kunde_id) SELECT k.name, ku.total FROM kunden k INNER JOIN kunden_umsatz ku ON k.id = ku.kunde_id WHERE ku.total > 500 ORDER BY ku.total DESC;",
    tags: ["CTE", "WITH"],
    hints: [
      "CTEs machen komplexe Abfragen lesbarer als verschachtelte Subqueries.",
      "Beginne mit `WITH name AS (...)` und fuege dann den Haupt-SELECT hinzu."
    ],
    hiddenTestQuery: "WITH kunden_umsatz AS (SELECT kunde_id, SUM(gesamtbetrag) AS total FROM bestellungen GROUP BY kunde_id) SELECT k.name, ku.total FROM kunden k INNER JOIN kunden_umsatz ku ON k.id = ku.kunde_id WHERE ku.total > 500 ORDER BY ku.total DESC;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Betrugsfaelle mit Transaktionsdetails",
    description: "Nutze eine CTE mit den Betrugsfaellen und joine sie mit Transaktions- und Kontodetails, um die Betrugsbeschreibung, den Betrag und den Kontotyp anzuzeigen.",
    difficulty: "advanced",
    category: "CTE",
    datasetId: bankingDataset.id,
    referenceQuery: "WITH betrug_details AS (SELECT bf.id AS betrugs_id, bf.grund, bf.status, t.betrag, t.beschreibung, k.typ AS kontotyp FROM betrugsfaelle bf INNER JOIN transaktionen t ON bf.transaktion_id = t.id INNER JOIN konten k ON t.konto_id = k.id) SELECT betrugs_id, grund, status, betrag, kontotyp FROM betrug_details;",
    tags: ["CTE", "WITH", "JOIN"],
    hints: [
      "Joine zuerst drei Tabellen in der CTE.",
      "Waele dann nur die relevanten Spalten aus der CTE."
    ],
    hiddenTestQuery: "WITH betrug_details AS (SELECT bf.id AS betrugs_id, bf.grund, bf.status, t.betrag, t.beschreibung, k.typ AS kontotyp FROM betrugsfaelle bf INNER JOIN transaktionen t ON bf.transaktion_id = t.id INNER JOIN konten k ON t.konto_id = k.id) SELECT betrugs_id, grund, status, betrag, kontotyp FROM betrug_details;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Fehlerquote pro Browser",
    description: "Berechne mit einer CTE die Fehlerquote (Anteil der Events mit Fehlern) pro Browser.",
    difficulty: "advanced",
    category: "CTE",
    datasetId: logsDataset.id,
    referenceQuery: "WITH browser_events AS (SELECT s.browser, COUNT(DISTINCT e.id) AS total_events, COUNT(DISTINCT f.id) AS error_events FROM sessions s INNER JOIN events e ON s.id = e.session_id LEFT JOIN fehler f ON e.id = f.event_id GROUP BY s.browser) SELECT browser, total_events, error_events, ROUND(CAST(error_events AS FLOAT) / total_events * 100, 2) AS fehlerquote_prozent FROM browser_events ORDER BY fehlerquote_prozent DESC;",
    tags: ["CTE", "WITH", "Aggregation", "Berechnung"],
    hints: [
      "Zaehle in der CTE die Gesamt-Events und Fehler-Events je Browser.",
      "Berechne den Prozentsatz im Haupt-SELECT."
    ],
    hiddenTestQuery: "WITH browser_events AS (SELECT s.browser, COUNT(DISTINCT e.id) AS total_events, COUNT(DISTINCT f.id) AS error_events FROM sessions s INNER JOIN events e ON s.id = e.session_id LEFT JOIN fehler f ON e.id = f.event_id GROUP BY s.browser) SELECT browser, total_events, error_events, ROUND(CAST(error_events AS FLOAT) / total_events * 100, 2) AS fehlerquote_prozent FROM browser_events ORDER BY fehlerquote_prozent DESC;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Nutzer mit durchschnittlich hoechstem Kalorienverbrauch",
    description: "Nutze eine CTE, um pro Nutzer die durchschnittlichen Kalorien pro Workout zu berechnen und den Nutzer mit dem hoechsten Durchschnitt anzuzeigen.",
    difficulty: "advanced",
    category: "CTE",
    datasetId: fitnessDataset.id,
    referenceQuery: "WITH nutzer_avg AS (SELECT nutzer_id, AVG(kalorien_verbrannt) AS avg_kalorien FROM workouts GROUP BY nutzer_id) SELECT n.name, na.avg_kalorien FROM nutzer n INNER JOIN nutzer_avg na ON n.id = na.nutzer_id ORDER BY na.avg_kalorien DESC LIMIT 1;",
    tags: ["CTE", "WITH", "Aggregation"],
    hints: [
      "Berechne den Durchschnitt pro Nutzer in der CTE.",
      "Sortiere absteigend und nimm den obersten mit LIMIT 1."
    ],
    hiddenTestQuery: "WITH nutzer_avg AS (SELECT nutzer_id, AVG(kalorien_verbrannt) AS avg_kalorien FROM workouts GROUP BY nutzer_id) SELECT n.name, na.avg_kalorien FROM nutzer n INNER JOIN nutzer_avg na ON n.id = na.nutzer_id ORDER BY na.avg_kalorien DESC LIMIT 1;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Produkterloes pro Kategorie",
    description: "Berechne mit einer CTE den Gesamtumsatz pro Produkt (Menge * Einzelpreis) und zeige dann den Umsatz pro Produktkategorie.",
    difficulty: "advanced",
    category: "CTE",
    datasetId: shopDataset.id,
    referenceQuery: "WITH produkt_umsatz AS (SELECT bp.produkt_id, SUM(bp.menge * bp.einzelpreis) AS umsatz FROM bestellpositionen bp GROUP BY bp.produkt_id) SELECT k.name AS kategorie, SUM(pu.umsatz) AS kategorie_umsatz FROM kategorien k INNER JOIN produkte p ON k.id = p.kategorie_id INNER JOIN produkt_umsatz pu ON p.id = pu.produkt_id GROUP BY k.id, k.name ORDER BY kategorie_umsatz DESC;",
    tags: ["CTE", "WITH", "Aggregation", "JOIN"],
    hints: [
      "Berechne in der CTE den Umsatz pro Produkt.",
      "JOine danach mit Kategorien und aggregiere auf Kategorieebene."
    ],
    hiddenTestQuery: "WITH produkt_umsatz AS (SELECT bp.produkt_id, SUM(bp.menge * bp.einzelpreis) AS umsatz FROM bestellpositionen bp GROUP BY bp.produkt_id) SELECT k.name AS kategorie, SUM(pu.umsatz) AS kategorie_umsatz FROM kategorien k INNER JOIN produkte p ON k.id = p.kategorie_id INNER JOIN produkt_umsatz pu ON p.id = pu.produkt_id GROUP BY k.id, k.name ORDER BY kategorie_umsatz DESC;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("cte", {
    title: "CTE: Abteilungen mit mehr als 3 Mitarbeitern",
    description: "Verwende eine CTE, um die Anzahl der Mitarbeiter pro Abteilung zu zaehlen und nur Abteilungen mit mehr als 3 Mitarbeitern anzuzeigen.",
    difficulty: "intermediate",
    category: "CTE",
    datasetId: hrDataset.id,
    referenceQuery: "WITH abteilung_mitarbeiter AS (SELECT abteilung_id, COUNT(*) AS anzahl FROM mitarbeiter GROUP BY abteilung_id HAVING COUNT(*) > 3) SELECT a.name, am.anzahl FROM abteilungen a INNER JOIN abteilung_mitarbeiter am ON a.id = am.abteilung_id ORDER BY am.anzahl DESC;",
    tags: ["CTE", "WITH", "HAVING"],
    hints: [
      "Gruppiere nach `abteilung_id` und verwende `HAVING COUNT(*) > 3`.",
      "Joine die CTE mit der Abteilungstabelle fuer die Namen."
    ],
    hiddenTestQuery: "WITH abteilung_mitarbeiter AS (SELECT abteilung_id, COUNT(*) AS anzahl FROM mitarbeiter GROUP BY abteilung_id HAVING COUNT(*) > 3) SELECT a.name, am.anzahl FROM abteilungen a INNER JOIN abteilung_mitarbeiter am ON a.id = am.abteilung_id ORDER BY am.anzahl DESC;",
    hiddenTestMode: "rows",
  })
);