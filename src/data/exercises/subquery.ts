/**
 * Unterabfrage-Uebungen.
 * Enthaelt Uebungen fuer verschachtelte SELECT-Abfragen (Subqueries).
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

export const subqueryExercises: Exercise[] = [];
resetCounter();
subqueryExercises.push(
  makeWriteExercise("sub", {
    title: "Produkte mit EXISTS-Subquery",
    description: "Zeige Name und Preis aller Produkte, fuer die es mindestens eine passende Zeile in `bestellpositionen` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "shop",
    referenceQuery: `SELECT name, preis FROM produkte WHERE EXISTS (SELECT 1 FROM bestellpositionen WHERE bestellpositionen.produkt_id = produkte.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT name, preis FROM produkte WHERE EXISTS (SELECT 1 FROM bestellpositionen WHERE bestellpositionen.produkt_id = produkte.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "IN-Subquery auf Produkte",
    description: "Zeige Name und Preis der Produkte, deren `id` in einer Liste aus `bestellpositionen` vorkommt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "shop",
    referenceQuery: `SELECT name, preis FROM produkte WHERE id IN (SELECT produkt_id FROM bestellpositionen);`,
    expectedResultText: "",
    tags: ["Subquery", "IN"],
    hints: [
      "Verwende `IN (SELECT ... )`."
    ],
    hiddenTestQuery: `SELECT name, preis FROM produkte WHERE id IN (SELECT produkt_id FROM bestellpositionen);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Inline-View: Produkte (name und preis)",
    description: "Nutze eine Subquery, die `name` und `preis` aus `produkte` auswaehlt, als Datenquelle und gib das Ergebnis aus.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "shop",
    referenceQuery: `SELECT * FROM (SELECT name, preis FROM produkte) AS sub;`,
    expectedResultText: "",
    tags: ["Subquery", "Inline-View"],
    hints: [
      "Schreibe die Subquery in Klammern nach `FROM`."
    ],
    hiddenTestQuery: `SELECT * FROM (SELECT name, preis FROM produkte) AS sub;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Korrelierte Subquery auf Produkte",
    description: "Zeige Name, Preis und die Anzahl der zugehoerigen Bestellpositionen fuer jedes Produkt.",
    difficulty: "advanced",
    category: "Subquery",
    datasetId: "shop",
    referenceQuery: `SELECT name, preis, (SELECT COUNT(*) FROM bestellpositionen WHERE bestellpositionen.produkt_id = produkte.id) AS anzahl FROM produkte;`,
    expectedResultText: "",
    tags: ["Subquery", "korreliert"],
    hints: [
      "Platziere die Subquery direkt im SELECT."
    ],
    hiddenTestQuery: `SELECT name, preis, (SELECT COUNT(*) FROM bestellpositionen WHERE bestellpositionen.produkt_id = produkte.id) AS anzahl FROM produkte;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Produkte mit Bestellpositionen per EXISTS (Variante)",
    description: "Zeige Name und Preis aller Produkte, fuer die es mindestens eine passende Zeile in `bestellpositionen` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "shop",
    referenceQuery: `SELECT name, preis FROM produkte WHERE EXISTS (SELECT 1 FROM bestellpositionen WHERE bestellpositionen.produkt_id = produkte.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT name, preis FROM produkte WHERE EXISTS (SELECT 1 FROM bestellpositionen WHERE bestellpositionen.produkt_id = produkte.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Kunden mit EXISTS-Subquery",
    description: "Zeige Name und E-Mail aller Kunden, fuer die es mindestens eine passende Zeile in `bestellungen` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "shop",
    referenceQuery: `SELECT name, email FROM kunden WHERE EXISTS (SELECT 1 FROM bestellungen WHERE bestellungen.kunde_id = kunden.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT name, email FROM kunden WHERE EXISTS (SELECT 1 FROM bestellungen WHERE bestellungen.kunde_id = kunden.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "IN-Subquery auf Kunden (Shop)",
    description: "Zeige Name und E-Mail der Kunden, deren `id` in einer Liste aus `bestellungen` vorkommt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "shop",
    referenceQuery: `SELECT name, email FROM kunden WHERE id IN (SELECT kunde_id FROM bestellungen);`,
    expectedResultText: "",
    tags: ["Subquery", "IN"],
    hints: [
      "Verwende `IN (SELECT ... )`."
    ],
    hiddenTestQuery: `SELECT name, email FROM kunden WHERE id IN (SELECT kunde_id FROM bestellungen);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Inline-View: Kunden (Shop)",
    description: "Nutze eine Subquery, die `name` und `email` aus `kunden` auswaehlt, als Datenquelle und gib das Ergebnis aus.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "shop",
    referenceQuery: `SELECT * FROM (SELECT name, email FROM kunden) AS sub;`,
    expectedResultText: "",
    tags: ["Subquery", "Inline-View"],
    hints: [
      "Schreibe die Subquery in Klammern nach `FROM`."
    ],
    hiddenTestQuery: `SELECT * FROM (SELECT name, email FROM kunden) AS sub;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Korrelierte Subquery auf Kunden (Shop)",
    description: "Zeige Name, E-Mail und die Anzahl der Bestellungen fuer jeden Kunden.",
    difficulty: "advanced",
    category: "Subquery",
    datasetId: "shop",
    referenceQuery: `SELECT name, email, (SELECT COUNT(*) FROM bestellungen WHERE bestellungen.kunde_id = kunden.id) AS anzahl FROM kunden;`,
    expectedResultText: "",
    tags: ["Subquery", "korreliert"],
    hints: [
      "Platziere die Subquery direkt im SELECT."
    ],
    hiddenTestQuery: `SELECT name, email, (SELECT COUNT(*) FROM bestellungen WHERE bestellungen.kunde_id = kunden.id) AS anzahl FROM kunden;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Kunden mit Bestellungen per EXISTS (Shop)",
    description: "Zeige Name und E-Mail aller Kunden, fuer die es mindestens eine passende Zeile in `bestellungen` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "shop",
    referenceQuery: `SELECT name, email FROM kunden WHERE EXISTS (SELECT 1 FROM bestellungen WHERE bestellungen.kunde_id = kunden.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT name, email FROM kunden WHERE EXISTS (SELECT 1 FROM bestellungen WHERE bestellungen.kunde_id = kunden.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Nutzer mit EXISTS-Subquery",
    description: "Zeige die Namen aller Nutzer, fuer die es mindestens eine passende Zeile in `workouts` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "fitness",
    referenceQuery: `SELECT name FROM nutzer WHERE EXISTS (SELECT 1 FROM workouts WHERE workouts.nutzer_id = nutzer.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT name FROM nutzer WHERE EXISTS (SELECT 1 FROM workouts WHERE workouts.nutzer_id = nutzer.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "IN-Subquery auf Nutzer",
    description: "Zeige die Namen der Nutzer, deren `id` in einer Liste aus `workouts` vorkommt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "fitness",
    referenceQuery: `SELECT name FROM nutzer WHERE id IN (SELECT nutzer_id FROM workouts);`,
    expectedResultText: "",
    tags: ["Subquery", "IN"],
    hints: [
      "Verwende `IN (SELECT ... )`."
    ],
    hiddenTestQuery: `SELECT name FROM nutzer WHERE id IN (SELECT nutzer_id FROM workouts);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Inline-View: Nutzer (name)",
    description: "Nutze eine Subquery, die `name` aus `nutzer` auswaehlt, als Datenquelle und gib das Ergebnis aus.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "fitness",
    referenceQuery: `SELECT * FROM (SELECT name FROM nutzer) AS sub;`,
    expectedResultText: "",
    tags: ["Subquery", "Inline-View"],
    hints: [
      "Schreibe die Subquery in Klammern nach `FROM`."
    ],
    hiddenTestQuery: `SELECT * FROM (SELECT name FROM nutzer) AS sub;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Korrelierte Subquery auf Nutzer",
    description: "Zeige den Namen und die Anzahl der Workouts fuer jeden Nutzer.",
    difficulty: "advanced",
    category: "Subquery",
    datasetId: "fitness",
    referenceQuery: `SELECT name, (SELECT COUNT(*) FROM workouts WHERE workouts.nutzer_id = nutzer.id) AS anzahl FROM nutzer;`,
    expectedResultText: "",
    tags: ["Subquery", "korreliert"],
    hints: [
      "Platziere die Subquery direkt im SELECT."
    ],
    hiddenTestQuery: `SELECT name, (SELECT COUNT(*) FROM workouts WHERE workouts.nutzer_id = nutzer.id) AS anzahl FROM nutzer;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Nutzer mit Workouts per EXISTS (Variante)",
    description: "Zeige die Namen aller Nutzer, fuer die es mindestens eine passende Zeile in `workouts` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "fitness",
    referenceQuery: `SELECT name FROM nutzer WHERE EXISTS (SELECT 1 FROM workouts WHERE workouts.nutzer_id = nutzer.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT name FROM nutzer WHERE EXISTS (SELECT 1 FROM workouts WHERE workouts.nutzer_id = nutzer.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Abteilungen mit EXISTS-Subquery",
    description: "Zeige Name und Standort aller Abteilungen, fuer die es mindestens eine passende Zeile in `mitarbeiter` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "hr",
    referenceQuery: `SELECT name, standort FROM abteilungen WHERE EXISTS (SELECT 1 FROM mitarbeiter WHERE mitarbeiter.abteilung_id = abteilungen.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT name, standort FROM abteilungen WHERE EXISTS (SELECT 1 FROM mitarbeiter WHERE mitarbeiter.abteilung_id = abteilungen.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "IN-Subquery auf Abteilungen",
    description: "Zeige Name und Standort der Abteilungen, deren `id` in einer Liste aus `mitarbeiter` vorkommt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "hr",
    referenceQuery: `SELECT name, standort FROM abteilungen WHERE id IN (SELECT abteilung_id FROM mitarbeiter);`,
    expectedResultText: "",
    tags: ["Subquery", "IN"],
    hints: [
      "Verwende `IN (SELECT ... )`."
    ],
    hiddenTestQuery: `SELECT name, standort FROM abteilungen WHERE id IN (SELECT abteilung_id FROM mitarbeiter);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Inline-View: Abteilungen (name und standort)",
    description: "Nutze eine Subquery, die `name` und `standort` aus `abteilungen` auswaehlt, als Datenquelle und gib das Ergebnis aus.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "hr",
    referenceQuery: `SELECT * FROM (SELECT name, standort FROM abteilungen) AS sub;`,
    expectedResultText: "",
    tags: ["Subquery", "Inline-View"],
    hints: [
      "Schreibe die Subquery in Klammern nach `FROM`."
    ],
    hiddenTestQuery: `SELECT * FROM (SELECT name, standort FROM abteilungen) AS sub;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Korrelierte Subquery auf Abteilungen",
    description: "Zeige Name, Standort und die Anzahl der zugehoerigen Mitarbeiter fuer jede Abteilung.",
    difficulty: "advanced",
    category: "Subquery",
    datasetId: "hr",
    referenceQuery: `SELECT name, standort, (SELECT COUNT(*) FROM mitarbeiter WHERE mitarbeiter.abteilung_id = abteilungen.id) AS anzahl FROM abteilungen;`,
    expectedResultText: "",
    tags: ["Subquery", "korreliert"],
    hints: [
      "Platziere die Subquery direkt im SELECT."
    ],
    hiddenTestQuery: `SELECT name, standort, (SELECT COUNT(*) FROM mitarbeiter WHERE mitarbeiter.abteilung_id = abteilungen.id) AS anzahl FROM abteilungen;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Abteilungen mit Mitarbeitern per EXISTS (Variante)",
    description: "Zeige Name und Standort aller Abteilungen, fuer die es mindestens eine passende Zeile in `mitarbeiter` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "hr",
    referenceQuery: `SELECT name, standort FROM abteilungen WHERE EXISTS (SELECT 1 FROM mitarbeiter WHERE mitarbeiter.abteilung_id = abteilungen.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT name, standort FROM abteilungen WHERE EXISTS (SELECT 1 FROM mitarbeiter WHERE mitarbeiter.abteilung_id = abteilungen.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Agenten mit EXISTS-Subquery",
    description: "Zeige Name und Team aller Agenten, fuer die es mindestens eine passende Zeile in `tickets` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "tickets",
    referenceQuery: `SELECT name, team FROM agenten WHERE EXISTS (SELECT 1 FROM tickets WHERE tickets.agent_id = agenten.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT name, team FROM agenten WHERE EXISTS (SELECT 1 FROM tickets WHERE tickets.agent_id = agenten.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "IN-Subquery auf Agenten",
    description: "Zeige Name und Team der Agenten, deren `id` in einer Liste aus `tickets` vorkommt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "tickets",
    referenceQuery: `SELECT name, team FROM agenten WHERE id IN (SELECT agent_id FROM tickets);`,
    expectedResultText: "",
    tags: ["Subquery", "IN"],
    hints: [
      "Verwende `IN (SELECT ... )`."
    ],
    hiddenTestQuery: `SELECT name, team FROM agenten WHERE id IN (SELECT agent_id FROM tickets);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Inline-View: Agenten (name und team)",
    description: "Nutze eine Subquery, die `name` und `team` aus `agenten` auswaehlt, als Datenquelle und gib das Ergebnis aus.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "tickets",
    referenceQuery: `SELECT * FROM (SELECT name, team FROM agenten) AS sub;`,
    expectedResultText: "",
    tags: ["Subquery", "Inline-View"],
    hints: [
      "Schreibe die Subquery in Klammern nach `FROM`."
    ],
    hiddenTestQuery: `SELECT * FROM (SELECT name, team FROM agenten) AS sub;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Korrelierte Subquery auf Agenten",
    description: "Zeige Name, Team und die Anzahl der zugehoerigen Tickets fuer jeden Agenten.",
    difficulty: "advanced",
    category: "Subquery",
    datasetId: "tickets",
    referenceQuery: `SELECT name, team, (SELECT COUNT(*) FROM tickets WHERE tickets.agent_id = agenten.id) AS anzahl FROM agenten;`,
    expectedResultText: "",
    tags: ["Subquery", "korreliert"],
    hints: [
      "Platziere die Subquery direkt im SELECT."
    ],
    hiddenTestQuery: `SELECT name, team, (SELECT COUNT(*) FROM tickets WHERE tickets.agent_id = agenten.id) AS anzahl FROM agenten;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Agenten mit Tickets per EXISTS (Variante)",
    description: "Zeige Name und Team aller Agenten, fuer die es mindestens eine passende Zeile in `tickets` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "tickets",
    referenceQuery: `SELECT name, team FROM agenten WHERE EXISTS (SELECT 1 FROM tickets WHERE tickets.agent_id = agenten.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT name, team FROM agenten WHERE EXISTS (SELECT 1 FROM tickets WHERE tickets.agent_id = agenten.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Kunden mit Konten per EXISTS",
    description: "Zeige die Namen aller Kunden, fuer die es mindestens eine passende Zeile in `konten` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "banking",
    referenceQuery: `SELECT name FROM kunden WHERE EXISTS (SELECT 1 FROM konten WHERE konten.kunde_id = kunden.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT name FROM kunden WHERE EXISTS (SELECT 1 FROM konten WHERE konten.kunde_id = kunden.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "IN-Subquery auf Kunden (Banking)",
    description: "Zeige die Namen der Kunden, deren `id` in einer Liste aus `konten` vorkommt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "banking",
    referenceQuery: `SELECT name FROM kunden WHERE id IN (SELECT kunde_id FROM konten);`,
    expectedResultText: "",
    tags: ["Subquery", "IN"],
    hints: [
      "Verwende `IN (SELECT ... )`."
    ],
    hiddenTestQuery: `SELECT name FROM kunden WHERE id IN (SELECT kunde_id FROM konten);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Inline-View: Kunden (Banking)",
    description: "Nutze eine Subquery, die `name` aus `kunden` auswaehlt, als Datenquelle und gib das Ergebnis aus.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "banking",
    referenceQuery: `SELECT * FROM (SELECT name FROM kunden) AS sub;`,
    expectedResultText: "",
    tags: ["Subquery", "Inline-View"],
    hints: [
      "Schreibe die Subquery in Klammern nach `FROM`."
    ],
    hiddenTestQuery: `SELECT * FROM (SELECT name FROM kunden) AS sub;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Korrelierte Subquery auf Kunden (Banking)",
    description: "Zeige den Namen und die Anzahl der Konten fuer jeden Kunden.",
    difficulty: "advanced",
    category: "Subquery",
    datasetId: "banking",
    referenceQuery: `SELECT name, (SELECT COUNT(*) FROM konten WHERE konten.kunde_id = kunden.id) AS anzahl FROM kunden;`,
    expectedResultText: "",
    tags: ["Subquery", "korreliert"],
    hints: [
      "Platziere die Subquery direkt im SELECT."
    ],
    hiddenTestQuery: `SELECT name, (SELECT COUNT(*) FROM konten WHERE konten.kunde_id = kunden.id) AS anzahl FROM kunden;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Kunden mit Konten per EXISTS (Banking)",
    description: "Zeige die Namen aller Kunden, fuer die es mindestens eine passende Zeile in `konten` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "banking",
    referenceQuery: `SELECT name FROM kunden WHERE EXISTS (SELECT 1 FROM konten WHERE konten.kunde_id = kunden.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT name FROM kunden WHERE EXISTS (SELECT 1 FROM konten WHERE konten.kunde_id = kunden.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Filme mit EXISTS-Subquery",
    description: "Zeige Titel und Genre aller Filme, fuer die es mindestens eine passende Zeile in `watch_history` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "streaming",
    referenceQuery: `SELECT titel, genre FROM filme WHERE EXISTS (SELECT 1 FROM watch_history WHERE watch_history.film_id = filme.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT titel, genre FROM filme WHERE EXISTS (SELECT 1 FROM watch_history WHERE watch_history.film_id = filme.id);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "IN-Subquery auf Filme",
    description: "Zeige Titel und Genre der Filme, deren `id` in einer Liste aus `watch_history` vorkommt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "streaming",
    referenceQuery: `SELECT titel, genre FROM filme WHERE id IN (SELECT film_id FROM watch_history);`,
    expectedResultText: "",
    tags: ["Subquery", "IN"],
    hints: [
      "Verwende `IN (SELECT ... )`."
    ],
    hiddenTestQuery: `SELECT titel, genre FROM filme WHERE id IN (SELECT film_id FROM watch_history);`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Inline-View: Filme (titel und genre)",
    description: "Nutze eine Subquery, die `titel` und `genre` aus `filme` auswaehlt, als Datenquelle und gib das Ergebnis aus.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "streaming",
    referenceQuery: `SELECT * FROM (SELECT titel, genre FROM filme) AS sub;`,
    expectedResultText: "",
    tags: ["Subquery", "Inline-View"],
    hints: [
      "Schreibe die Subquery in Klammern nach `FROM`."
    ],
    hiddenTestQuery: `SELECT * FROM (SELECT titel, genre FROM filme) AS sub;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Korrelierte Subquery auf Filme",
    description: "Zeige Titel, Genre und die Anzahl der zugehoerigen Watch-History-Eintraege fuer jeden Film.",
    difficulty: "advanced",
    category: "Subquery",
    datasetId: "streaming",
    referenceQuery: `SELECT titel, genre, (SELECT COUNT(*) FROM watch_history WHERE watch_history.film_id = filme.id) AS anzahl FROM filme;`,
    expectedResultText: "",
    tags: ["Subquery", "korreliert"],
    hints: [
      "Platziere die Subquery direkt im SELECT."
    ],
    hiddenTestQuery: `SELECT titel, genre, (SELECT COUNT(*) FROM watch_history WHERE watch_history.film_id = filme.id) AS anzahl FROM filme;`,
    hiddenTestMode: "rows",
  }),

  makeWriteExercise("sub", {
    title: "Filme mit Watch-History per EXISTS (Variante)",
    description: "Zeige Titel und Genre aller Filme, fuer die es mindestens eine passende Zeile in `watch_history` gibt.",
    difficulty: "intermediate",
    category: "Subquery",
    datasetId: "streaming",
    referenceQuery: `SELECT titel, genre FROM filme WHERE EXISTS (SELECT 1 FROM watch_history WHERE watch_history.film_id = filme.id);`,
    expectedResultText: "",
    tags: ["Subquery", "EXISTS"],
    hints: [
      "Verwende `EXISTS (SELECT 1 FROM ... WHERE ...)`."
    ],
    hiddenTestQuery: `SELECT titel, genre FROM filme WHERE EXISTS (SELECT 1 FROM watch_history WHERE watch_history.film_id = filme.id);`,
    hiddenTestMode: "rows",
  })
);
