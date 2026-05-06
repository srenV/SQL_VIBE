/**
 * Fensterfunktionen-Uebungen.
 * Enthaelt Uebungen fuer ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD und PARTITION BY.
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

export const windowFunctionExercises: Exercise[] = [];
resetCounter();
windowFunctionExercises.push(
  makeWriteExercise("win", {
    title: "ROW_NUMBER: Produkte nach Preis nummerieren",
    description: "Nummerniere alle Produkte nach ihrem Preis absteigend. Zeige den Produktnamen, den Preis und die Zeilennummer.",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name, preis, ROW_NUMBER() OVER (ORDER BY preis DESC) AS rn FROM produkte;",
    tags: ["Window Functions", "ROW_NUMBER"],
    hints: [
      "Verwende `ROW_NUMBER() OVER (ORDER BY spalte DESC)`, um eine fortlaufende Nummer zu erzeugen.",
      "ROW_NUMBER() vergibt immer eindeutige Nummern, auch bei gleichen Werten."
    ],
    hiddenTestQuery: "SELECT name, preis, ROW_NUMBER() OVER (ORDER BY preis DESC) AS rn FROM produkte;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "ROW_NUMBER mit Partition: Neueste Bestellung pro Kunde",
    description: "Zeige fuer jeden Kunden nur die neueste Bestellung an. Verwende ROW_NUMBER und partitioniere nach kunde_id, sortiert nach datum absteigend.",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT * FROM (SELECT kunde_id, datum, gesamtbetrag, ROW_NUMBER() OVER (PARTITION BY kunde_id ORDER BY datum DESC) AS rn FROM bestellungen) sub WHERE rn = 1;",
    tags: ["Window Functions", "ROW_NUMBER", "PARTITION BY"],
    hints: [
      "Verwende `PARTITION BY kunde_id`, um die Nummerierung pro Kunde neu zu starten.",
      "Filteere im aeusseren SELECT mit `WHERE rn = 1`, um nur die neueste Bestellung zu behalten."
    ],
    hiddenTestQuery: "SELECT * FROM (SELECT kunde_id, datum, gesamtbetrag, ROW_NUMBER() OVER (PARTITION BY kunde_id ORDER BY datum DESC) AS rn FROM bestellungen) sub WHERE rn = 1;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "RANK: Mitarbeiter-Rangliste nach Gehalt",
    description: "Erstelle eine Rangliste aller Mitarbeiter nach Gehalt absteigend. Verwende RANK() und zeige Name, Gehalt und den Rang.",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT name, gehalt, RANK() OVER (ORDER BY gehalt DESC) AS rang FROM mitarbeiter;",
    tags: ["Window Functions", "RANK"],
    hints: [
      "RANK() vergibt gleiche Raenge bei gleichen Werten und ueberspringt die naechsten Nummern.",
      "Verwende `RANK() OVER (ORDER BY gehalt DESC)`."
    ],
    hiddenTestQuery: "SELECT name, gehalt, RANK() OVER (ORDER BY gehalt DESC) AS rang FROM mitarbeiter;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "DENSE_RANK: Filme nach Bewertung",
    description: "Erstelle eine Rangliste der Filme nach Bewertung absteigend. Verwende DENSE_RANK(), um keine Luecken in der Nummerierung zu haben.",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: streamingDataset.id,
    referenceQuery: "SELECT titel, bewertung, DENSE_RANK() OVER (ORDER BY bewertung DESC) AS rang FROM filme;",
    tags: ["Window Functions", "DENSE_RANK"],
    hints: [
      "DENSE_RANK() vergibt gleiche Raenge bei gleichen Werten, ueberspringt aber keine Nummern.",
      "Verwende `DENSE_RANK() OVER (ORDER BY bewertung DESC)`."
    ],
    hiddenTestQuery: "SELECT titel, bewertung, DENSE_RANK() OVER (ORDER BY bewertung DESC) AS rang FROM filme;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "RANK vs DENSE_RANK: Vergleich bei Gehalt",
    description: "Zeige Name, Gehalt, RANK() und DENSE_RANK() nebeneinander, sortiert nach Gehalt absteigend. So kannst du den Unterschied sehen.",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT name, gehalt, RANK() OVER (ORDER BY gehalt DESC) AS rnk, DENSE_RANK() OVER (ORDER BY gehalt DESC) AS drnk FROM mitarbeiter;",
    tags: ["Window Functions", "RANK", "DENSE_RANK"],
    hints: [
      "Du kannst mehrere Window Functions in einem SELECT verwenden.",
      "RANK ueberspringt Nummern bei Gleichstand, DENSE_RANK nicht."
    ],
    hiddenTestQuery: "SELECT name, gehalt, RANK() OVER (ORDER BY gehalt DESC) AS rnk, DENSE_RANK() OVER (ORDER BY gehalt DESC) AS drnk FROM mitarbeiter;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "RANK partitioniert: Gehaltsrang pro Abteilung",
    description: "Erstelle einen Rang der Mitarbeiter nach Gehalt innerhalb jeder Abteilung. Zeige Name, Gehalt, Abteilungs-ID und den Rang.",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT name, gehalt, abteilung_id, RANK() OVER (PARTITION BY abteilung_id ORDER BY gehalt DESC) AS rang FROM mitarbeiter;",
    tags: ["Window Functions", "RANK", "PARTITION BY"],
    hints: [
      "Verwende `PARTITION BY abteilung_id`, um den Rang pro Abteilung zu berechnen.",
      "Jede Partitution bekommt ihre eigene Rangfolge, beginnend bei 1."
    ],
    hiddenTestQuery: "SELECT name, gehalt, abteilung_id, RANK() OVER (PARTITION BY abteilung_id ORDER BY gehalt DESC) AS rang FROM mitarbeiter;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "LAG: Preisvergleich mit vorherigem Produkt",
    description: "Zeige den Namen und Preis jedes Produkts sowie den Preis des vorherigen Produkts (nach id sortiert). Verwende LAG().",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name, preis, LAG(preis) OVER (ORDER BY id) AS vorheriger_preis FROM produkte;",
    tags: ["Window Functions", "LAG"],
    hints: [
      "LAG(spalte) greift auf den Wert der vorherigen Zeile innerhalb der Fensterdefinition zu.",
      "Verwende `LAG(preis) OVER (ORDER BY id)`, um den Preis des vorherigen Produkts zu erhalten."
    ],
    hiddenTestQuery: "SELECT name, preis, LAG(preis) OVER (ORDER BY id) AS vorheriger_preis FROM produkte;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "LAG: Gewichtsdifferenz zum vorherigen Eintrag",
    description: "Zeige fuer jeden Koerperdaten-Eintrag das Gewicht und die Differenz zum vorherigen Gewicht desselben Nutzers. Verwende LAG().",
    difficulty: "advanced",
    category: "Window Functions",
    datasetId: fitnessDataset.id,
    referenceQuery: "SELECT nutzer_id, datum, gewicht_kg, gewicht_kg - LAG(gewicht_kg) OVER (PARTITION BY nutzer_id ORDER BY datum) AS diff FROM koerperdaten;",
    tags: ["Window Functions", "LAG", "PARTITION BY"],
    hints: [
      "Partitioniere nach nutzer_id, damit jeder Nutzer seine eigene Vergleichsbasis hat.",
      "Subtrahiere `LAG(gewicht_kg)` vom aktuellen Gewicht, um die Differenz zu berechnen."
    ],
    hiddenTestQuery: "SELECT nutzer_id, datum, gewicht_kg, gewicht_kg - LAG(gewicht_kg) OVER (PARTITION BY nutzer_id ORDER BY datum) AS diff FROM koerperdaten;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "LEAD: Naechste Transaktion anzeigen",
    description: "Zeige fuer jede Transaktion auf einem Konto den Betrag und den Betrag der naechsten Transaktion (nach Datum sortiert). Verwende LEAD().",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: bankingDataset.id,
    referenceQuery: "SELECT id, konto_id, betrag, datum, LEAD(betrag) OVER (PARTITION BY konto_id ORDER BY datum) AS naechster_betrag FROM transaktionen;",
    tags: ["Window Functions", "LEAD", "PARTITION BY"],
    hints: [
      "LEAD() greift auf den Wert der naechsten Zeile zu, im Gegensatz zu LAG().",
      "Verwende `PARTITION BY konto_id`, um pro Konto zu vergleichen."
    ],
    hiddenTestQuery: "SELECT id, konto_id, betrag, datum, LEAD(betrag) OVER (PARTITION BY konto_id ORDER BY datum) AS naechster_betrag FROM transaktionen;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "SUM OVER: Laufende Summe der Bestellbetraege",
    description: "Berechne die laufende Summe (Running Total) der Gesamtbetraege aller Bestellungen, sortiert nach Datum.",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT id, datum, gesamtbetrag, SUM(gesamtbetrag) OVER (ORDER BY datum) AS laufende_summe FROM bestellungen;",
    tags: ["Window Functions", "SUM OVER", "Running Total"],
    hints: [
      "SUM(spalte) OVER (ORDER BY ...) berechnet eine kumulative Summe.",
      "Ohne PARTITION BY wird die Summe ueber alle Zeilen fortlaufend berechnet."
    ],
    hiddenTestQuery: "SELECT id, datum, gesamtbetrag, SUM(gesamtbetrag) OVER (ORDER BY datum) AS laufende_summe FROM bestellungen;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "SUM OVER partitioniert: Laufende Summe pro Konto",
    description: "Berechne die laufende Summe der Transaktionsbetraege pro Konto, sortiert nach Datum.",
    difficulty: "advanced",
    category: "Window Functions",
    datasetId: bankingDataset.id,
    referenceQuery: "SELECT id, konto_id, betrag, datum, SUM(betrag) OVER (PARTITION BY konto_id ORDER BY datum) AS laufender_saldo FROM transaktionen;",
    tags: ["Window Functions", "SUM OVER", "PARTITION BY", "Running Total"],
    hints: [
      "Verwende `PARTITION BY konto_id`, um die laufende Summe pro Konto neu zu starten.",
      "Die Frame-Definition `ORDER BY datum` sorgt fuer die kumulative Berechnung innerhalb jeder Partitution."
    ],
    hiddenTestQuery: "SELECT id, konto_id, betrag, datum, SUM(betrag) OVER (PARTITION BY konto_id ORDER BY datum) AS laufender_saldo FROM transaktionen;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "AVG OVER: Durchschnittsgehalt pro Abteilung",
    description: "Zeige jeden Mitarbeiter mit seinem Gehalt und dem Durchschnittsgehalt seiner Abteilung als zustzliche Spalte.",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT name, gehalt, abteilung_id, AVG(gehalt) OVER (PARTITION BY abteilung_id) AS avg_gehalt FROM mitarbeiter;",
    tags: ["Window Functions", "AVG OVER", "PARTITION BY"],
    hints: [
      "AVG(spalte) OVER (PARTITION BY ...) berechnet den Durchschnitt pro Gruppe.",
      "Jeder Mitarbeiter in derselben Abteilung erhaelt denselben Durchschnittswert."
    ],
    hiddenTestQuery: "SELECT name, gehalt, abteilung_id, AVG(gehalt) OVER (PARTITION BY abteilung_id) AS avg_gehalt FROM mitarbeiter;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "COUNT OVER: Ticket-Anzahl pro Agent",
    description: "Zeige jedes Ticket mit Titel und Prioritaet sowie die Gesamtanzahl der Tickets des zugewiesenen Agenten als Zustzspalte.",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: ticketsDataset.id,
    referenceQuery: "SELECT titel, prioritaet, agent_id, COUNT(*) OVER (PARTITION BY agent_id) AS ticket_count FROM tickets WHERE agent_id IS NOT NULL;",
    tags: ["Window Functions", "COUNT OVER", "PARTITION BY"],
    hints: [
      "COUNT(*) OVER (PARTITION BY ...) zaehlt die Zeilen pro Gruppe.",
      "Filtere zunaechst mit `WHERE agent_id IS NOT NULL` um nur zugewiesene Tickets zu zaehlen."
    ],
    hiddenTestQuery: "SELECT titel, prioritaet, agent_id, COUNT(*) OVER (PARTITION BY agent_id) AS ticket_count FROM tickets WHERE agent_id IS NOT NULL;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "DENSE_RANK partitioniert: Workout-Rang pro Nutzer",
    description: "Erstelle eine Rangliste der Workouts nach verbrannten Kalorien pro Nutzer. Verwende DENSE_RANK() mit PARTITION BY.",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: fitnessDataset.id,
    referenceQuery: "SELECT id, nutzer_id, kalorien_verbrannt, DENSE_RANK() OVER (PARTITION BY nutzer_id ORDER BY kalorien_verbrannt DESC) AS rang FROM workouts;",
    tags: ["Window Functions", "DENSE_RANK", "PARTITION BY"],
    hints: [
      "Verwende `PARTITION BY nutzer_id`, um fuer jeden Nutzer separat zu rangieren.",
      "DENSE_RANK() erzeugt keine Luecken in der Nummerierung."
    ],
    hiddenTestQuery: "SELECT id, nutzer_id, kalorien_verbrannt, DENSE_RANK() OVER (PARTITION BY nutzer_id ORDER BY kalorien_verbrannt DESC) AS rang FROM workouts;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "Top-N pro Gruppe: Die 3 teuersten Produkte pro Kategorie",
    description: "Finde die 3 teuersten Produkte pro Kategorie. Verwende ROW_NUMBER() mit PARTITION BY und filtere auf rn <= 3.",
    difficulty: "advanced",
    category: "Window Functions",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT * FROM (SELECT name, kategorie_id, preis, ROW_NUMBER() OVER (PARTITION BY kategorie_id ORDER BY preis DESC) AS rn FROM produkte) sub WHERE rn <= 3;",
    tags: ["Window Functions", "ROW_NUMBER", "Top-N", "PARTITION BY"],
    hints: [
      "Verwende ROW_NUMBER() mit PARTITION BY kategorie_id, um die Produkte pro Kategorie zu nummerieren.",
      "Setze die Abfrage in einen Subquery und filtere mit `WHERE rn <= 3`."
    ],
    hiddenTestQuery: "SELECT * FROM (SELECT name, kategorie_id, preis, ROW_NUMBER() OVER (PARTITION BY kategorie_id ORDER BY preis DESC) AS rn FROM produkte) sub WHERE rn <= 3;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "LAG mit Offset: Vergleich mit dem vorvorherigen Wert",
    description: "Zeige fuer jeden Kontostand den Saldo und den Saldo von zwei Transaktionen zuvor (LEAD/LAG mit Offset 2). Verwende LAG mit Offset 2.",
    difficulty: "advanced",
    category: "Window Functions",
    datasetId: bankingDataset.id,
    referenceQuery: "SELECT id, konto_id, betrag, datum, LAG(betrag, 2) OVER (PARTITION BY konto_id ORDER BY datum) AS betrag_vor_2 FROM transaktionen;",
    tags: ["Window Functions", "LAG", "Offset"],
    hints: [
      "LAG(spalte, n) greift auf die n-te Zeile zuvor zu, nicht nur die direkte Vorgaengerzeile.",
      "Verwende `LAG(betrag, 2)`, um zwei Zeilen zurueckzugehen."
    ],
    hiddenTestQuery: "SELECT id, konto_id, betrag, datum, LAG(betrag, 2) OVER (PARTITION BY konto_id ORDER BY datum) AS betrag_vor_2 FROM transaktionen;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "AVG OVER: Vergleich mit dem Durchschnitt",
    description: "Zeige jeden Film mit seiner Bewertung und dem Durchschnittsbewertungswert aller Filme. Wie weit weicht der Film vom Durchschnitt ab?",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: streamingDataset.id,
    referenceQuery: "SELECT titel, bewertung, AVG(bewertung) OVER () AS avg_bewertung, bewertung - AVG(bewertung) OVER () AS diff FROM filme;",
    tags: ["Window Functions", "AVG OVER"],
    hints: [
      "Ohne PARTITION BY und ORDER BY berechnet AVG() OVER () den Gesamtdurchschnitt.",
      "Du kannst die Window Function auch in Berechnungen verwenden: `spalte - AVG(spalte) OVER ()`."
    ],
    hiddenTestQuery: "SELECT titel, bewertung, AVG(bewertung) OVER () AS avg_bewertung, bewertung - AVG(bewertung) OVER () AS diff FROM filme;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "Mehrere Window Functions: Rang und Durchschnitt",
    description: "Zeige Name, Gehalt, den Rang nach Gehalt und das Durchschnittsgehalt der Abteilung in einer Abfrage.",
    difficulty: "advanced",
    category: "Window Functions",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT name, gehalt, abteilung_id, RANK() OVER (ORDER BY gehalt DESC) AS gehalts_rang, AVG(gehalt) OVER (PARTITION BY abteilung_id) AS avg_gehalt FROM mitarbeiter;",
    tags: ["Window Functions", "RANK", "AVG OVER", "PARTITION BY"],
    hints: [
      "Du kannst mehrere Window Functions in einem SELECT verwenden.",
      "RANK() hat kein PARTITION BY (globaler Rang), AVG() hat PARTITION BY (pro Abteilung)."
    ],
    hiddenTestQuery: "SELECT name, gehalt, abteilung_id, RANK() OVER (ORDER BY gehalt DESC) AS gehalts_rang, AVG(gehalt) OVER (PARTITION BY abteilung_id) AS avg_gehalt FROM mitarbeiter;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "ROW_NUMBER: Pagination – Seite 2",
    description: "Simuliere Pagination: Zeige die Produkte auf Seite 2 (Elemente 11-20), sortiert nach Preis absteigend. Verwende ROW_NUMBER().",
    difficulty: "advanced",
    category: "Window Functions",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT * FROM (SELECT name, preis, ROW_NUMBER() OVER (ORDER BY preis DESC) AS rn FROM produkte) sub WHERE rn BETWEEN 11 AND 20;",
    tags: ["Window Functions", "ROW_NUMBER", "Pagination"],
    hints: [
      "Nummeriere zuerst mit ROW_NUMBER() im Subquery.",
      "Filtere dann mit `WHERE rn BETWEEN 11 AND 20` fuer die zweite Seite."
    ],
    hiddenTestQuery: "SELECT * FROM (SELECT name, preis, ROW_NUMBER() OVER (ORDER BY preis DESC) AS rn FROM produkte) sub WHERE rn BETWEEN 11 AND 20;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("win", {
    title: "LAG und LEAD kombiniert: Transaktionsanalyse",
    description: "Zeige jede Transaktion mit dem vorherigen und dem naechsten Betrag auf demselben Konto. Berechne auch die Aenderung zum Vorgaenger.",
    difficulty: "advanced",
    category: "Window Functions",
    datasetId: bankingDataset.id,
    referenceQuery: "SELECT id, konto_id, betrag, datum, LAG(betrag) OVER (PARTITION BY konto_id ORDER BY datum) AS prev_betrag, LEAD(betrag) OVER (PARTITION BY konto_id ORDER BY datum) AS next_betrag, betrag - LAG(betrag) OVER (PARTITION BY konto_id ORDER BY datum) AS aenderung FROM transaktionen;",
    tags: ["Window Functions", "LAG", "LEAD", "PARTITION BY"],
    hints: [
      "Du kannst LAG() und LEAD() gleichzeitig in einer Abfrage verwenden.",
      "Beide muessen dieselbe PARTITION BY- und ORDER BY-Klausel haben."
    ],
    hiddenTestQuery: "SELECT id, konto_id, betrag, datum, LAG(betrag) OVER (PARTITION BY konto_id ORDER BY datum) AS prev_betrag, LEAD(betrag) OVER (PARTITION BY konto_id ORDER BY datum) AS next_betrag, betrag - LAG(betrag) OVER (PARTITION BY konto_id ORDER BY datum) AS aenderung FROM transaktionen;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("win", {
    title: "Debug: Fehlendes PARTITION BY",
    description: "Diese Abfrage soll den Gehaltsrang pro Abteilung berechnen, aber das PARTITION BY fehlt. Korrigiere die Abfrage.",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: hrDataset.id,
    brokenQuery: "SELECT name, gehalt, abteilung_id, RANK() OVER (ORDER BY gehalt DESC) AS rang FROM mitarbeiter;",
    referenceQuery: "SELECT name, gehalt, abteilung_id, RANK() OVER (PARTITION BY abteilung_id ORDER BY gehalt DESC) AS rang FROM mitarbeiter;",
    tags: ["Window Functions", "RANK", "PARTITION BY", "Debugging"],
    hints: [
      "Ohne PARTITION BY wird der Rang ueber alle Mitarbeiter berechnet, nicht pro Abteilung.",
      "Fuege `PARTITION BY abteilung_id` zur OVER-Klausel hinzu."
    ],
    hiddenTestQuery: "SELECT name, gehalt, abteilung_id, RANK() OVER (PARTITION BY abteilung_id ORDER BY gehalt DESC) AS rang FROM mitarbeiter;",
    hiddenTestMode: "rows",
  }),
  makePredictExercise("win", {
    title: "Vorhersage: RANK vs ROW_NUMBER",
    description: "Was passiert, wenn mehrere Produkte denselben Preis haben?",
    difficulty: "intermediate",
    category: "Window Functions",
    datasetId: shopDataset.id,
    question: "Wenn zwei Produkte denselben Preis (z.B. 29.99) haben und ROW_NUMBER() bzw. RANK() verwendet wird –Was ist der Unterschied?",
    options: [
      { text: "ROW_NUMBER gibt beiden die 1, RANK gibt 1 und 2", isCorrect: false },
      { text: "ROW_NUMBER gibt 1 und 2, RANK gibt beiden die 1 (danach wird 3 vergeben)", isCorrect: true },
      { text: "Beide geben 1 und 2, es gibt keinen Unterschied", isCorrect: false },
      { text: "ROW_NUMBER gibt 1 und 2, RANK gibt 1 und 1 (danach wird 2 vergeben)", isCorrect: false }
    ],
    tags: ["Window Functions", "RANK", "ROW_NUMBER", "Ergebnis-Vorhersage"],
    hints: [
      "ROW_NUMBER() vergibt immer eindeutige Nummern.",
      "RANK() vergibt gleiche Raenge bei gleichen Werten und ueberspringt die naechsten Nummern (z.B. 1,1,3)."
    ],
  }),
  makePredictExercise("win", {
    title: "Vorhersage: Laufende Summe",
    description: "Was zeigt die laufende Summe bei Bestellungen?",
    difficulty: "advanced",
    category: "Window Functions",
    datasetId: shopDataset.id,
    question: "Gegeben sei eine Tabelle mit Bestellungen (id=1, gesamtbetrag=100), (id=2, gesamtbetrag=200), (id=3, gesamtbetrag=50). Was ist die laufende Summe bei der dritten Bestellung mit `SUM(gesamtbetrag) OVER (ORDER BY id)`?",
    options: [
      { text: "50", isCorrect: false },
      { text: "350", isCorrect: true },
      { text: "100 + 200 + 50 = 350, aber nur in der letzten Zeile", isCorrect: false },
      { text: "150", isCorrect: false }
    ],
    tags: ["Window Functions", "SUM OVER", "Ergebnis-Vorhersage"],
    hints: [
      "Die laufende Summe (Running Total) summiert alle Werte bis zur aktuellen Zeile.",
      "Bei id=3 waere die Summe: 100 + 200 + 50 = 350."
    ],
  })
);