/**
 * Beispiel-Uebungsdaten fuer das SQL-Trainer Playground.
 *
 * Diese Uebungen testen alle Teile der Playground-Infrastruktur:
 * Ergebnismengen-Vergleich, verdeckte Tests, Hinweis-Engine,
 * Schema-Explorer und Fehlererklaerungen.
 *
 * English: Sample exercise data for the SQL-Trainer Playground.
 * These exercises exercise all parts of the playground infrastructure.
 */

import type { PlaygroundExercise } from "@/types/playground";

/** Beispiel-Uebungen fuer den Playground-Modus. */
export const sampleExercises: PlaygroundExercise[] = [
  {
    id: "select-all-users",
    title: "Alle Benutzer anzeigen",
    description: "Lerne, wie man alle Zeilen aus einer Tabelle abfragt.",
    difficulty: "easy",
    category: "SELECT",
    setupSql: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        age INTEGER
      );
      INSERT INTO users (id, name, email, age) VALUES
        (1, 'Alice', 'alice@example.com', 30),
        (2, 'Bob', 'bob@example.com', 25),
        (3, 'Charlie', 'charlie@example.com', 35);
    `,
    solutionQuery: `SELECT id, name, email, age FROM users;`,
    task: "Schreibe eine Abfrage, die alle Spalten und alle Zeilen der Tabelle users zurückgibt.",
    hiddenTests: [
      {
        id: "ht1-no-limit",
        name: "Kein LIMIT",
        query: `SELECT COUNT(*) AS cnt FROM users;`,
        failureMessage: "Stelle sicher, dass du alle Benutzer zurückgibst (kein LIMIT).",
      },
      {
        id: "ht2-all-columns",
        name: "Alle Spalten",
        query: `SELECT id, name, email, age FROM users;`,
        expectedResultset: {
          columns: [
            { name: "id", type: "INTEGER" },
            { name: "name", type: "TEXT" },
            { name: "email", type: "TEXT" },
            { name: "age", type: "INTEGER" },
          ],
          rows: [
            { id: 1, name: "Alice", email: "alice@example.com", age: 30 },
            { id: 2, name: "Bob", email: "bob@example.com", age: 25 },
            { id: 3, name: "Charlie", email: "charlie@example.com", age: 35 },
          ],
        },
        failureMessage: "Die Spalten müssen id, name, email und age sein.",
      },
    ],
    hints: [
      {
        level: 1,
        trigger: { type: "syntax_error" },
        message: "Stelle sicher, dass du SELECT und FROM richtig schreibst.",
      },
      {
        level: 1,
        trigger: { type: "wrong_result", comparisonStatus: "column_mismatch" },
        message: "Achte darauf, alle vier Spalten (id, name, email, age) auszuwählen.",
      },
      {
        level: 1,
        trigger: { type: "wrong_result", comparisonStatus: "row_count_mismatch" },
        message: "Es gibt 3 Benutzer. Achte darauf, kein LIMIT oder WHERE zu verwenden.",
      },
      {
        level: 2,
        trigger: { type: "repeated_failures", threshold: 3 },
        message: "Die korrekte Abfrage lautet: SELECT * FROM users;",
      },
      {
        level: 3,
        trigger: { type: "always" },
        message: "Lösung: SELECT id, name, email, age FROM users;",
      },
    ],
    schemaTables: [
      {
        name: "users",
        columns: [
          { name: "id", type: "INTEGER", nullable: false, isPrimaryKey: true },
          { name: "name", type: "TEXT", nullable: false },
          { name: "email", type: "TEXT", nullable: true },
          { name: "age", type: "INTEGER", nullable: true },
        ],
        foreignKeys: [],
      },
    ],
  },
  {
    id: "filter-adult-users",
    title: "Benutzer über 30 filtern",
    description: "Lerne, wie man mit WHERE Daten filtert.",
    difficulty: "easy",
    category: "WHERE",
    setupSql: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER
      );
      INSERT INTO users (id, name, age) VALUES
        (1, 'Alice', 30),
        (2, 'Bob', 25),
        (3, 'Charlie', 35);
    `,
    solutionQuery: `SELECT name, age FROM users WHERE age > 30;`,
    task: "Schreibe eine Abfrage, die den Namen und das Alter aller Benutzer über 30 zurückgibt.",
    hiddenTests: [
      {
        id: "ht1-exact-rows",
        name: "Genau 1 Zeile",
        query: `SELECT COUNT(*) AS cnt FROM users WHERE age > 30;`,
        expectedResultset: {
          columns: [{ name: "cnt", type: "INTEGER" }],
          rows: [{ cnt: 1 }],
        },
        failureMessage: "Es sollte genau ein Benutzer über 30 zurückgegeben werden.",
      },
    ],
    hints: [
      {
        level: 1,
        trigger: { type: "syntax_error", pattern: "SLECT" },
        message: "Du hast SELECT falsch geschrieben. Prüfe die Schreibweise.",
      },
      {
        level: 1,
        trigger: { type: "wrong_result" },
        message: "Vergiss nicht die WHERE-Klausel mit age > 30.",
      },
      {
        level: 2,
        trigger: { type: "repeated_failures", threshold: 3 },
        message: "Versuche: SELECT name, age FROM users WHERE age > 30;",
      },
      {
        level: 3,
        trigger: { type: "always" },
        message: "Lösung: SELECT name, age FROM users WHERE age > 30;",
      },
    ],
    schemaTables: [
      {
        name: "users",
        columns: [
          { name: "id", type: "INTEGER", nullable: false, isPrimaryKey: true },
          { name: "name", type: "TEXT", nullable: false },
          { name: "age", type: "INTEGER", nullable: true },
        ],
      },
    ],
  },
  {
    id: "join-orders-users",
    title: "Bestellungen mit Benutzern verknüpfen",
    description: "Lerne, wie man JOIN verwendet, um Daten aus zwei Tabellen zu kombinieren.",
    difficulty: "medium",
    category: "JOIN",
    setupSql: `
      CREATE TABLE users (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      );
      CREATE TABLE orders (
        id INTEGER PRIMARY KEY,
        user_id INTEGER NOT NULL,
        total REAL
      );
      INSERT INTO users (id, name) VALUES
        (1, 'Alice'),
        (2, 'Bob');
      INSERT INTO orders (id, user_id, total) VALUES
        (101, 1, 49.99),
        (102, 1, 19.99),
        (103, 2, 99.99);
    `,
    solutionQuery: `SELECT users.name, orders.total FROM users JOIN orders ON users.id = orders.user_id;`,
    task: "Schreibe eine Abfrage, die den Benutzernamen und den Bestellbetrag für jede Bestellung zurückgibt.",
    hiddenTests: [
      {
        id: "ht1-no-cartesian",
        name: "Kein Kreuzprodukt",
        query: `SELECT COUNT(*) AS cnt FROM users JOIN orders ON users.id = orders.user_id;`,
        expectedResultset: {
          columns: [{ name: "cnt", type: "INTEGER" }],
          rows: [{ cnt: 3 }],
        },
        failureMessage: "Stelle sicher, dass du die Tabellen über die user_id verknüpfst.",
      },
    ],
    hints: [
      {
        level: 1,
        trigger: { type: "wrong_result", comparisonStatus: "row_count_mismatch" },
        message: "Es gibt 3 Bestellungen insgesamt. Prüfe, ob alle Bestellungen erfasst werden.",
      },
      {
        level: 2,
        trigger: { type: "repeated_failures", threshold: 3 },
        message: "Verwende JOIN mit ON users.id = orders.user_id.",
      },
      {
        level: 3,
        trigger: { type: "always" },
        message: "Lösung: SELECT users.name, orders.total FROM users JOIN orders ON users.id = orders.user_id;",
      },
    ],
    schemaTables: [
      {
        name: "users",
        columns: [
          { name: "id", type: "INTEGER", nullable: false, isPrimaryKey: true },
          { name: "name", type: "TEXT", nullable: false },
        ],
      },
      {
        name: "orders",
        columns: [
          { name: "id", type: "INTEGER", nullable: false, isPrimaryKey: true },
          { name: "user_id", type: "INTEGER", nullable: false },
          { name: "total", type: "REAL", nullable: true },
        ],
        foreignKeys: [
          { column: "user_id", referencedTable: "users", referencedColumn: "id" },
        ],
      },
    ],
  },
];
