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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
      "Fuehre die Query mental aus oder schreibe sie auf Papier.",
      "Zaehle Zeilen oder berechne Summen/Durchschnitte."
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
    hints: ["Berliner, Hamburger, Muenchener und Koelner."],
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
    hints: ["Suche den kleinsten Preis in der Tabelle."],
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
    hints: ["Alle Kunden in diesem Datensatz haben 'beispiel.de' als Domain."],
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
    hints: ["Zaehle die Zeilen mit Status 'abgeschlossen' oder 'versendet'."],
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
    hints: ["Addiere alle Budgets aus der Tabelle `abteilungen`."],
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
    hints: ["Zaehle Workouts mit `dauer_min > 60`."],
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
    hints: ["Zaehle Agenten mit `aktiv = 1`."],
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
    hints: ["Zaehle die Eintraege in `betrugsfaelle`."],
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
    hints: ["LIMIT 1 mit ORDER BY DESC gibt das teuerste Produkt."],
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
    hints: ["Zaehle die Nutzer mit Abonnement 'Premium'."],
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
    hints: ["INNER JOIN gibt eine Zeile pro Bestellung, nicht pro Kunde."],
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
    hints: ["Es gibt 5 Kategorien: Elektronik, Buecher, Kleidung, Sport, Haushalt."],
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
    hints: ["Chrome, Firefox, Safari, Edge."],
  })
);
