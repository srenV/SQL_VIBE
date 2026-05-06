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
    title: "Ergebnis vorhersagen: produkte",
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
