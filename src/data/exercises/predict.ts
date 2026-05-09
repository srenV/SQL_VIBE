/**
 * Vorhersage-Uebungen.
 * Enthaelt Multiple-Choice-Uebungen, bei denen das Abfrageergebnis vorhergesagt werden muss.
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

export const predictExercises: Exercise[] = [];
resetCounter();
predictExercises.push(
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: Produktanzahl ueber 50 Euro",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM produkte WHERE preis > 50;`\n\nWie viele Produkte haben einen Preis ueber 50?",
    difficulty: "beginner",
    category: "Ergebnis-Vorhersage",
    datasetId: "shop",
    question: "Wie viele Produkte haben einen Preis ueber 50?",
    options: [
      { text: "4", isCorrect: false },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: true },
      { text: "7", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "COUNT(*) zaehlt alle Zeilen, die die WHERE-Bedingung erfuellen.",
      "Zaehle alle Produkte in der Tabelle `produkte`, bei denen `preis > 50` gilt.",
      "Entscheidend: Die `produkte`-Tabelle enthaelt 10 Eintraege, davon haben 6 einen Preis ueber 50 Euro."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: nutzer",
    description: "Gegeben ist folgende Query:\n\n`SELECT AVG(gewicht_kg) FROM nutzer;`\n\nWas ist das durchschnittliche Gewicht aller Nutzer?",
    difficulty: "beginner",
    category: "Ergebnis-Vorhersage",
    datasetId: "fitness",
    question: "Was ist das durchschnittliche Gewicht aller Nutzer?",
    options: [
      { text: "65.0", isCorrect: false },
      { text: "70.81", isCorrect: true },
      { text: "75.0", isCorrect: false },
      { text: "80.0", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "AVG() berechnet den Durchschnitt aller Werte in einer Spalte.",
      "Addiere alle `gewicht_kg`-Werte der `nutzer`-Tabelle und teile durch die Anzahl der Nutzer.",
      "Entscheidend: Die Summe der Gewichte geteilt durch die Anzahl der Nutzer ergibt 70.81 — nahe 70, nicht 65 oder 75."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: mitarbeiter",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM mitarbeiter WHERE gehalt > 60000;`\n\nWie viele Mitarbeiter verdienen mehr als 60000?",
    difficulty: "beginner",
    category: "Ergebnis-Vorhersage",
    datasetId: "hr",
    question: "Wie viele Mitarbeiter verdienen mehr als 60000?",
    options: [
      { text: "3", isCorrect: true },
      { text: "4", isCorrect: false },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "Gehe die `mitarbeiter`-Tabelle durch und markiere alle, deren `gehalt` groesser als 60000 ist.",
      "COUNT(*) zaehlt nur Zeilen, bei denen die WHERE-Bedingung wahr ist.",
      "Entscheidend: Von den Mitarbeitern im HR-Datensatz verdienen genau 3 mehr als 60000 Euro."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: tickets",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM tickets WHERE status = 'offen';`\n\nWie viele Tickets haben den Status 'offen'?",
    difficulty: "beginner",
    category: "Ergebnis-Vorhersage",
    datasetId: "tickets",
    question: "Wie viele Tickets haben den Status 'offen'?",
    options: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "Zaehle in der `tickets`-Tabelle alle Zeilen, bei denen `status = 'offen'` gilt.",
      "Jede Zeile zaehlt einzeln — es geht darum, wie viele Tickets diesen Status haben.",
      "Entscheidend: Genau 4 Tickets im Tickets-Datensatz haben den Status 'offen'."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: transaktionen",
    description: "Gegeben ist folgende Query:\n\n`SELECT SUM(betrag) FROM transaktionen WHERE typ = 'eingang';`\n\nWie hoch ist die Summe aller Eingaenge?",
    difficulty: "beginner",
    category: "Ergebnis-Vorhersage",
    datasetId: "banking",
    question: "Wie hoch ist die Summe aller Eingaenge?",
    options: [
      { text: "14500.00", isCorrect: false },
      { text: "15600.00", isCorrect: false },
      { text: "16600.00", isCorrect: true },
      { text: "17000.00", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "SUM() addiert alle Werte einer Spalte, die die WHERE-Bedingung erfuellen.",
      "Filtere die `transaktionen` auf `typ = 'eingang'` und addiere alle `betrag`-Werte.",
      "Entscheidend: Die Eingaenge im Banking-Datensatz summieren sich zu 16600.00 — nicht 15600 oder 17000."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: filme",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM filme WHERE genre = 'Drama';`\n\nWie viele Filme sind im Genre 'Drama'?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: "streaming",
    question: "Wie viele Filme sind im Genre 'Drama'?",
    options: [
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "Zaehle in der `filme`-Tabelle alle Eintraege, bei denen `genre = 'Drama'` gilt.",
      "Jeder Film wird einzeln gezaehlt — achte auf den exakten Wert 'Drama' (Gross-/Kleinschreibung).",
      "Entscheidend: Im Streaming-Datensatz sind genau 4 Filme dem Genre 'Drama' zugeordnet."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: fehler",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM fehler WHERE schweregrad = 'kritisch';`\n\nWie viele Fehler sind kritisch?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: "logs",
    question: "Wie viele Fehler sind kritisch?",
    options: [
      { text: "4", isCorrect: false },
      { text: "5", isCorrect: true },
      { text: "6", isCorrect: false },
      { text: "7", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "Zaehle in der `fehler`-Tabelle alle Zeilen, bei denen `schweregrad = 'kritisch'` gilt.",
      "Achte darauf, dass nur Fehler gezaehlt werden — nicht Events oder Sessions.",
      "Entscheidend: Im Logs-Datensatz gibt es genau 5 Fehler mit dem Schweregrad 'kritisch'."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: bestellungen",
    description: "Gegeben ist folgende Query:\n\n`SELECT AVG(gesamtbetrag) FROM bestellungen;`\n\nWas ist der durchschnittliche Bestellwert?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: "shop",
    question: "Was ist der durchschnittliche Bestellwert?",
    options: [
      { text: "250.00", isCorrect: false },
      { text: "312.13", isCorrect: true },
      { text: "350.00", isCorrect: false },
      { text: "400.00", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "AVG() berechnet den Durchschnitt aller `gesamtbetrag`-Werte in der `bestellungen`-Tabelle.",
      "Addiere alle Bestellbetrage und teile durch die Anzahl der Bestellungen.",
      "Entscheidend: Der Durchschnittsbetrag liegt bei 312.13 Euro — nahe 300, nicht 250 oder 400."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: workouts",
    description: "Gegeben ist folgende Query:\n\n`SELECT MAX(kalorien_verbrannt) FROM workouts;`\n\nWie viele Kalorien wurden maximal bei einem Workout verbrannt?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: "fitness",
    question: "Wie viele Kalorien wurden maximal bei einem Workout verbrannt?",
    options: [
      { text: "600", isCorrect: false },
      { text: "650", isCorrect: false },
      { text: "720", isCorrect: true },
      { text: "750", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "MAX() findet den groessten Wert in der Spalte `kalorien_verbrannt` ueber alle Workouts.",
      "Du suchst den einzelnen Workout-Eintrag mit den meisten verbrannten Kalorien.",
      "Entscheidend: Das Maximum in der `workouts`-Tabelle betraegt 720 Kalorien — nicht 650 oder 750."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: urlaub",
    description: "Gegeben ist folgende Query:\n\n`SELECT SUM(tage) FROM urlaub WHERE genehmigt = 1;`\n\nWie viele Urlaubstage wurden insgesamt genehmigt?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: "hr",
    question: "Wie viele Urlaubstage wurden insgesamt genehmigt?",
    options: [
      { text: "60", isCorrect: false },
      { text: "72", isCorrect: true },
      { text: "80", isCorrect: false },
      { text: "90", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "SUM() addiert alle `tage`-Werte, bei denen `genehmigt = 1` gilt.",
      "Nur genehmigte Urlaubsantraege zaehlen — filtere die `urlaub`-Tabelle auf `genehmigt = 1`.",
      "Entscheidend: Die Summe aller genehmigten Urlaubstage im HR-Datensatz betraegt 72 Tage."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: konten",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM konten WHERE typ = 'Girokonto';`\n\nWie viele Girokonten gibt es?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: "banking",
    question: "Wie viele Girokonten gibt es?",
    options: [
      { text: "6", isCorrect: false },
      { text: "7", isCorrect: true },
      { text: "8", isCorrect: false },
      { text: "9", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "Zaehle in der `konten`-Tabelle alle Zeilen, bei denen `typ = 'Girokonto'` gilt.",
      "Achte auf den exakten Wert — Gross-/Kleinschreibung und Schreibweise muessen stimmen.",
      "Entscheidend: Im Banking-Datensatz gibt es genau 7 Konten vom Typ 'Girokonto'."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: bewertungen",
    description: "Gegeben ist folgende Query:\n\n`SELECT AVG(sterne) FROM bewertungen;`\n\nWie hoch ist die durchschnittliche Sternebewertung?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: "streaming",
    question: "Wie hoch ist die durchschnittliche Sternebewertung?",
    options: [
      { text: "3.5", isCorrect: false },
      { text: "3.85", isCorrect: true },
      { text: "4.0", isCorrect: false },
      { text: "4.2", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "AVG() berechnet den Durchschnitt der `sterne`-Spalte ueber alle Bewertungen in der `bewertungen`-Tabelle.",
      "Addiere alle Sternewerte und teile durch die Gesamtanzahl der Bewertungen.",
      "Entscheidend: Der Durchschnitt der Sternebewertungen im Streaming-Datensatz betraegt 3.85 — nicht 3.5 oder 4.0."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: produkte",
    description: "Gegeben ist folgende Query:\n\n`SELECT MAX(preis) FROM produkte;`\n\nWas ist der hoechste Produktpreis?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: "shop",
    question: "Was ist der hoechste Produktpreis?",
    options: [
      { text: "599.00", isCorrect: false },
      { text: "899.00", isCorrect: true },
      { text: "999.00", isCorrect: false },
      { text: "129.00", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "MAX() findet den hoechsten `preis`-Wert in der `produkte`-Tabelle — ohne Filterung.",
      "Gehe alle Preise durch und identifiziere den groessten.",
      "Entscheidend: Der teuerste Artikel im Shop-Datensatz kostet 899.00 Euro — nicht 599 oder 999."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: kommentare",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM kommentare WHERE autor LIKE 'Max%';`\n\nWie viele Kommentare stammen von einem Autor, dessen Name mit 'Max' beginnt?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: "tickets",
    question: "Wie viele Kommentare stammen von einem Autor, dessen Name mit 'Max' beginnt?",
    options: [
      { text: "1", isCorrect: false },
      { text: "2", isCorrect: true },
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "LIKE 'Max%' sucht nach Eintraegen, bei denen `autor` mit 'Max' beginnt.",
      "Gehe die `kommentare`-Tabelle durch und zaehle alle Autoren, deren Name mit 'Max' anfaengt.",
      "Entscheidend: Im Tickets-Datensatz gibt es genau 2 Kommentare, bei denen der Autor mit 'Max' beginnt."
    ],
  }),

  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: events",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM events WHERE event_typ = 'checkout';`\n\nWie viele Checkout-Events gibt es?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: "logs",
    question: "Wie viele Checkout-Events gibt es?",
    options: [
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false },
      { text: "7", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Ergebnis-Vorhersage", "Aggregation"],
    hints: [
      "Zaehle in der `events`-Tabelle alle Zeilen, bei denen `event_typ = 'checkout'` gilt.",
      "Jeder Event-Eintrag mit diesem Typ wird einzeln gezaehlt.",
      "Entscheidend: Im Logs-Datensatz gibt es genau 4 Events vom Typ 'checkout'."
    ],
  })
);

predictExercises.push(
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: DISTINCT Staedte",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(DISTINCT stadt) FROM kunden;`\n\nWie viele eindeutige Staedte gibt es?",
    difficulty: "beginner",
    category: "Ergebnis-Vorhersage",
    datasetId: shopDataset.id,
    question: "Wie viele eindeutige Staedte gibt es in `kunden`?",
    options: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "DISTINCT"],
    hints: [
      "COUNT(DISTINCT ...) zaehlt nur unterschiedliche Werte — Duplikate werden einmal gezaehlt.",
      "Schau dir die `stadt`-Spalte in `kunden` an und zaehle, wie viele verschiedene Staedte vorkommen.",
      "Entscheidend: `DISTINCT` entfernt Duplikate — es gibt 4 eindeutige Staedte: Berlin, Hamburg, Muenchen und Koeln."
    ],
  }),
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: MIN Preis",
    description: "Gegeben ist folgende Query:\n\n`SELECT MIN(preis) FROM produkte;`\n\nWas ist der niedrigste Produktpreis?",
    difficulty: "beginner",
    category: "Ergebnis-Vorhersage",
    datasetId: shopDataset.id,
    question: "Was ist der niedrigste Produktpreis?",
    options: [
      { text: "14.99", isCorrect: true },
      { text: "19.99", isCorrect: false },
      { text: "24.99", isCorrect: false },
      { text: "29.99", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "MIN"],
    hints: [
      "MIN() gibt den kleinsten Wert in einer Spalte zurueck — ohne Filter ueber alle Zeilen.",
      "Gehe alle Preise in der `produkte`-Tabelle durch und identifiziere den guenstigsten.",
      "Entscheidend: Der kleinste Preis in der `produkte`-Tabelle betraegt 14.99 — nicht 19.99 oder 24.99."
    ],
  }),
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: WHERE mit LIKE",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM kunden WHERE email LIKE '%beispiel.de';`\n\nWie viele Kunden haben eine E-Mail mit 'beispiel.de'?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: shopDataset.id,
    question: "Wie viele Kunden haben eine E-Mail mit 'beispiel.de'?",
    options: [
      { text: "8", isCorrect: false },
      { text: "10", isCorrect: true },
      { text: "12", isCorrect: false },
      { text: "15", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "LIKE"],
    hints: [
      "LIKE '%beispiel.de' trifft zu, wenn `email` mit 'beispiel.de' endet — das `%` steht fuer beliebig viele Zeichen davor.",
      "Zaehle alle Kunden in der `kunden`-Tabelle, deren E-Mail auf 'beispiel.de' endet.",
      "Entscheidend: Alle 10 Kunden im Shop-Datensatz haben eine E-Mail mit der Domain 'beispiel.de' — daher ist das Ergebnis 10."
    ],
  }),
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: WHERE mit IN",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM bestellungen WHERE status IN ('abgeschlossen', 'versendet');`\n\nWie viele Bestellungen sind abgeschlossen oder versendet?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: shopDataset.id,
    question: "Wie viele Bestellungen sind abgeschlossen oder versendet?",
    options: [
      { text: "10", isCorrect: true },
      { text: "11", isCorrect: false },
      { text: "12", isCorrect: false },
      { text: "13", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "IN"],
    hints: [
      "IN ('wert1', 'wert2') prueft, ob der Wert in der Liste vorkommt — entspricht einem OR fuer denselben Spaltenwert.",
      "Zaehle alle Bestellungen in der `bestellungen`-Tabelle mit Status 'abgeschlossen' ODER 'versendet'.",
      "Entscheidend: Im Shop-Datensatz haben genau 10 Bestellungen den Status 'abgeschlossen' oder 'versendet'."
    ],
  }),
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: Abteilungs-Budget",
    description: "Gegeben ist folgende Query:\n\n`SELECT SUM(budget) FROM abteilungen;`\n\nWie hoch ist die Summe aller Abteilungsbudgets?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: hrDataset.id,
    question: "Wie hoch ist die Summe aller Abteilungsbudgets?",
    options: [
      { text: "500000", isCorrect: false },
      { text: "680000", isCorrect: true },
      { text: "750000", isCorrect: false },
      { text: "800000", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "SUM"],
    hints: [
      "SUM() addiert alle Werte der `budget`-Spalte — alle Abteilungen, kein Filter.",
      "Addiere die Budgetwerte aller Zeilen in der `abteilungen`-Tabelle.",
      "Entscheidend: Die Gesamtsumme aller Abteilungsbudgets im HR-Datensatz betraegt 680000 — nicht 500000 oder 750000."
    ],
  }),
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: Fitness-Workouts",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM workouts WHERE dauer_min > 60;`\n\nWie viele Workouts dauern laenger als 60 Minuten?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: fitnessDataset.id,
    question: "Wie viele Workouts dauern laenger als 60 Minuten?",
    options: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "COUNT"],
    hints: [
      "COUNT(*) zaehlt alle Zeilen der `workouts`-Tabelle, bei denen die WHERE-Bedingung gilt.",
      "Zaehle alle Workouts, bei denen `dauer_min > 60` ist — also Workouts laenger als eine Stunde.",
      "Entscheidend: Im Fitness-Datensatz dauern genau 4 Workouts laenger als 60 Minuten."
    ],
  }),
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: Aktive Agenten",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM agenten WHERE aktiv = 1;`\n\nWie viele Agenten sind aktiv?",
    difficulty: "beginner",
    category: "Ergebnis-Vorhersage",
    datasetId: ticketsDataset.id,
    question: "Wie viele Agenten sind aktiv?",
    options: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "COUNT"],
    hints: [
      "COUNT(*) zaehlt alle Zeilen der `agenten`-Tabelle, bei denen `aktiv = 1` gilt.",
      "Aktiv wird als 1 gespeichert (boolescher Wert) — zaehle nur diese Eintraege.",
      "Entscheidend: Im Tickets-Datensatz sind genau 4 Agenten als aktiv (aktiv = 1) markiert."
    ],
  }),
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: Banking-Summe",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM betrugsfaelle;`\n\nWie viele Betrugsfaelle gibt es?",
    difficulty: "beginner",
    category: "Ergebnis-Vorhersage",
    datasetId: bankingDataset.id,
    question: "Wie viele Betrugsfaelle gibt es?",
    options: [
      { text: "2", isCorrect: true },
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: false },
      { text: "5", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "COUNT"],
    hints: [
      "COUNT(*) zaehlt alle Zeilen der Tabelle ohne Filterung.",
      "Zaehle einfach alle Eintraege in der `betrugsfaelle`-Tabelle — kein WHERE noetig.",
      "Entscheidend: Im Banking-Datensatz gibt es genau 2 Betrugsfaelle in der `betrugsfaelle`-Tabelle."
    ],
  }),
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: LIMIT",
    description: "Gegeben ist folgende Query:\n\n`SELECT name FROM produkte ORDER BY preis DESC LIMIT 1;`\n\nWelches Produkt wird als einziges zurueckgegeben?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: shopDataset.id,
    question: "Welches Produkt wird zurueckgegeben?",
    options: [
      { text: "Laptop", isCorrect: true },
      { text: "Smartphone", isCorrect: false },
      { text: "Kopfhoerer", isCorrect: false },
      { text: "Staubsauger", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "LIMIT", "ORDER BY"],
    hints: [
      "ORDER BY preis DESC sortiert die Produkte vom teuersten zum guenstigsten, LIMIT 1 gibt nur die erste Zeile zurueck.",
      "Das Ergebnis ist genau ein Produkt — naemlich das mit dem hoechsten Preis.",
      "Entscheidend: Das teuerste Produkt im Shop-Datensatz ist der 'Laptop' — er hat den hoechsten Preis und erscheint daher zuerst."
    ],
  }),
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: Streaming-Premium",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM nutzer WHERE abonnement = 'Premium';`\n\nWie viele Premium-Nutzer gibt es?",
    difficulty: "beginner",
    category: "Ergebnis-Vorhersage",
    datasetId: streamingDataset.id,
    question: "Wie viele Premium-Nutzer gibt es?",
    options: [
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: true },
      { text: "4", isCorrect: false },
      { text: "5", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "COUNT"],
    hints: [
      "COUNT(*) zaehlt alle Zeilen der `nutzer`-Tabelle im Streaming-Datensatz, wo `abonnement = 'Premium'` gilt.",
      "Schaue dir die `nutzer`-Tabelle an und zaehle nur die Premium-Eintraege.",
      "Entscheidend: Im Streaming-Datensatz haben genau 3 Nutzer das Abonnement 'Premium'."
    ],
  }),
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: JOIN-Ergebnisgroesse",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(*) FROM kunden INNER JOIN bestellungen ON kunden.id = bestellungen.kunde_id;`\n\nWie viele Zeilen gibt das Ergebnis?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: shopDataset.id,
    question: "Wie viele Zeilen hat das JOIN-Ergebnis?",
    options: [
      { text: "10", isCorrect: false },
      { text: "15", isCorrect: true },
      { text: "20", isCorrect: false },
      { text: "25", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "JOIN", "COUNT"],
    hints: [
      "INNER JOIN erzeugt eine Zeile fuer jede Kombination, die in beiden Tabellen passt — pro Bestellung, nicht pro Kunde.",
      "Kunden ohne Bestellungen fallen raus, Kunden mit mehreren Bestellungen erscheinen mehrfach.",
      "Entscheidend: Das Ergebnis zaehlt nach Bestellungen, nicht nach Kunden — es gibt 15 passende Kunden-Bestellungs-Kombinationen."
    ],
  }),
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: GROUP BY Anzahl",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(DISTINCT kategorie_id) FROM produkte;`\n\nWie viele verschiedene Kategorien sind in `produkte` vertreten?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: shopDataset.id,
    question: "Wie viele verschiedene Kategorien sind in `produkte`?",
    options: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: false },
      { text: "5", isCorrect: true },
      { text: "6", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "DISTINCT"],
    hints: [
      "COUNT(DISTINCT ...) zaehlt jeden unterschiedlichen Wert in der `kategorie_id`-Spalte genau einmal.",
      "Auch wenn es mehr Produkte gibt — gezaehlt werden nur verschiedene Kategorien.",
      "Entscheidend: `DISTINCT` entfernt Duplikate — es gibt 5 verschiedene Kategorien in der `produkte`-Tabelle: Elektronik, Buecher, Kleidung, Sport, Haushalt."
    ],
  }),
  makePredictExercise("prd", {
    title: "Ergebnis vorhersagen: Browser-Verteilung",
    description: "Gegeben ist folgende Query:\n\n`SELECT COUNT(DISTINCT browser) FROM sessions;`\n\nWie viele verschiedene Browser gibt es?",
    difficulty: "junior",
    category: "Ergebnis-Vorhersage",
    datasetId: logsDataset.id,
    question: "Wie viele verschiedene Browser gibt es?",
    options: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false }
    ],
    tags: ["Ergebnis-Vorhersage", "DISTINCT"],
    hints: [
      "COUNT(DISTINCT browser) zaehlt jeden Browser-Namen in der `sessions`-Tabelle nur einmal.",
      "Auch wenn ein Browser viele Sessions hat — bei DISTINCT zaehlt er nur einmal.",
      "Entscheidend: `DISTINCT` entfernt Duplikate — es gibt 4 verschiedene Browser: Chrome, Firefox, Safari und Edge."
    ],
  })
);
