/**
 * SELECT Basics exercises (English).
 * Contains exercises for simple to advanced SELECT queries.
 */
import { shopDataset } from "@/data/datasets/shop";
import { fitnessDataset } from "@/data/datasets/fitness";
import { hrDataset } from "@/data/datasets/hr";
import { ticketsDataset } from "@/data/datasets/tickets";
import { bankingDataset } from "@/data/datasets/banking";
import { streamingDataset } from "@/data/datasets/streaming";
import { logsDataset } from "@/data/datasets/logs";
import {
  makeWriteExercise,
  resetCounter,
} from "@/data/exercises/_factory";
import type { Exercise } from "@/types/exercise";

// ============================================================
// SELECT BASICS (40 exercises)
// ============================================================
export const selectExercisesEn: Exercise[] = [];

resetCounter();
selectExercisesEn.push(
  makeWriteExercise("sel", {
    title: "Display all customers",
    description: "Write a query that outputs all columns of all customers from the `customers` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT * FROM customers;",
    expectedResultText: "10 rows: id, name, email, city, registered_on",
    tags: ["SELECT", "Basics"],
    hints: [
      "To retrieve all columns from a table, you can use a wildcard instead of specific column names.",
      "The asterisk `*` stands for all columns: `SELECT * FROM tablename;`",
      "Use `SELECT *` on the `customers` table."
    ],
    hiddenTestQuery: "SELECT * FROM customers;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Product names",
    description: "Output only the `name` column from the `products` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name FROM products;",
    tags: ["SELECT", "Columns"],
    hints: [
      "You can selectively choose individual columns instead of always loading all of them.",
      "Write the column name directly after `SELECT`: `SELECT columnname FROM tablename;`",
      "Select only the `name` column from the `products` table."
    ],
    hiddenTestQuery: "SELECT name FROM products;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Name and price of products",
    description: "Output the `name` and `price` columns of all products.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name, price FROM products;",
    tags: ["SELECT", "Columns"],
    hints: [
      "If you need multiple columns, you can specify them all in a single query.",
      "Separate multiple column names in SELECT with commas: `SELECT column1, column2 FROM tablename;`",
      "Select the `name` and `price` columns from the `products` table."
    ],
    hiddenTestQuery: "SELECT name, price FROM products;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Product name with alias",
    description: "Output the `name` column from the `products` table, but rename it to `product_name` in the result.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name AS product_name FROM products;",
    tags: ["SELECT", "Alias"],
    hints: [
      "You can rename column names in the result — this is called an alias and makes output more readable.",
      "Use the `AS` keyword directly after the column name: `SELECT column AS new_name FROM tablename;`",
      "Use `AS product_name` after the `name` column in the `products` table."
    ],
    hiddenTestQuery: "SELECT name AS product_name FROM products;",
    hiddenTestMode: "columns",
  }),
  makeWriteExercise("sel", {
    title: "Find duplicate cities (DISTINCT)",
    description: "Output all unique cities from the `customers` table. Use `DISTINCT`.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT DISTINCT city FROM customers;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "When a column contains the same value multiple times, you can filter out duplicate entries from the result.",
      "`DISTINCT` directly after `SELECT` removes duplicates: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `city` column in the `customers` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT city FROM customers;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Show all departments",
    description: "Output all columns from the `departments` table in the HR dataset.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT * FROM departments;",
    tags: ["SELECT", "Basics"],
    hints: [
      "To read all data from a table, you don't need to specify individual column names.",
      "The asterisk `*` stands for all columns: `SELECT * FROM tablename;`",
      "Use `SELECT *` on the `departments` table."
    ],
    hiddenTestQuery: "SELECT * FROM departments;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Employee names and positions",
    description: "Output the `name` and `position` columns of all employees.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT name, position FROM employees;",
    tags: ["SELECT", "Columns"],
    hints: [
      "If you only need certain information, you can selectively choose individual columns.",
      "Separate multiple column names with commas: `SELECT column1, column2 FROM tablename;`",
      "Select the `name` and `position` columns from the `employees` table."
    ],
    hiddenTestQuery: "SELECT name, position FROM employees;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Agent teams",
    description: "Output all unique values of the `team` column from the `agents` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: ticketsDataset.id,
    referenceQuery: "SELECT DISTINCT team FROM agents;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "To get a list of unique values without repetitions, there is a special keyword.",
      "`DISTINCT` after `SELECT` removes duplicates from the result: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `team` column in the `agents` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT team FROM agents;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "User subscriptions",
    description: "Output the `name` and `subscription` columns from the `users` table of the streaming dataset.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: streamingDataset.id,
    referenceQuery: "SELECT name, subscription FROM users;",
    tags: ["SELECT", "Columns"],
    hints: [
      "You only need two specific pieces of information from the table — select only those columns.",
      "List the desired column names separated by commas: `SELECT column1, column2 FROM tablename;`",
      "Select the `name` and `subscription` columns from the `users` table."
    ],
    hiddenTestQuery: "SELECT name, subscription FROM users;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Exercise names with alias",
    description: "Output the `name` column from the `exercises` table and rename it as `exercise`.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: fitnessDataset.id,
    referenceQuery: "SELECT name AS exercise FROM exercises;",
    tags: ["SELECT", "Alias"],
    hints: [
      "You can give a column a different name in the result — this is useful for readable output.",
      "Use `AS` after the column name to assign an alias: `SELECT column AS alias FROM tablename;`",
      "Use `AS exercise` after the `name` column in the `exercises` table."
    ],
    hiddenTestQuery: "SELECT name AS exercise FROM exercises;",
    hiddenTestMode: "columns",
  })
);

// More SELECT exercises 11-20
selectExercisesEn.push(
  makeWriteExercise("sel", {
    title: "All ticket titles",
    description: "Output only the `title` column of all tickets.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: ticketsDataset.id,
    referenceQuery: "SELECT title FROM tickets;",
    tags: ["SELECT", "Columns"],
    hints: [
      "You only need a single column from the table — this is more efficient than loading all data.",
      "Write the column name directly after `SELECT`: `SELECT columnname FROM tablename;`",
      "Select only the `title` column from the `tickets` table."
    ],
    hiddenTestQuery: "SELECT title FROM tickets;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Account numbers and balances",
    description: "Output the `account_number` and `balance` columns from the `accounts` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: bankingDataset.id,
    referenceQuery: "SELECT account_number, balance FROM accounts;",
    tags: ["SELECT", "Columns"],
    hints: [
      "You need exactly two columns from this table — select only those.",
      "Separate multiple column names in SELECT with commas: `SELECT column1, column2 FROM tablename;`",
      "Select the `account_number` and `balance` columns from the `accounts` table."
    ],
    hiddenTestQuery: "SELECT account_number, balance FROM accounts;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Movie titles and genre",
    description: "Output the `title` and `genre` columns from the `movies` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: streamingDataset.id,
    referenceQuery: "SELECT title, genre FROM movies;",
    tags: ["SELECT", "Columns"],
    hints: [
      "You only need two pieces of information per movie — selectively choose those columns.",
      "Separate multiple column names with commas: `SELECT column1, column2 FROM tablename;`",
      "Select the `title` and `genre` columns from the `movies` table."
    ],
    hiddenTestQuery: "SELECT title, genre FROM movies;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Unique event types",
    description: "Output all unique `event_type` values from the `events` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: logsDataset.id,
    referenceQuery: "SELECT DISTINCT event_type FROM events;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "You want to see each event type only once — without repetitions.",
      "`DISTINCT` after `SELECT` filters out duplicate values: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `event_type` column in the `events` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT event_type FROM events;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "All employees with full name",
    description: "Output all columns from the `employees` table, but rename `name` as `full_name`.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT id, name AS full_name, department_id, position, salary, start_date, manager_id FROM employees;",
    tags: ["SELECT", "Alias"],
    hints: [
      "You can rename individual columns, but `SELECT *` doesn't allow aliases — you must list all columns explicitly.",
      "List all columns and use `AS` for the one to rename: `SELECT column1, column2 AS alias, column3 FROM tablename;`",
      "List all columns and rename `name` with `AS full_name` in the `employees` table."
    ],
    hiddenTestQuery: "SELECT id, name AS full_name, department_id, position, salary, start_date, manager_id FROM employees;",
    hiddenTestMode: "columns",
  }),
  makeWriteExercise("sel", {
    title: "Product categories without duplicates",
    description: "Output all unique category names from the `categories` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT DISTINCT name FROM categories;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "If category names appear multiple times, you want to see each one only once.",
      "`DISTINCT` removes duplicate rows: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `name` column in the `categories` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT name FROM categories;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "All tickets with description",
    description: "Output the `title` and `description` columns of all tickets.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: ticketsDataset.id,
    referenceQuery: "SELECT title, description FROM tickets;",
    tags: ["SELECT", "Columns"],
    hints: [
      "You need two specific columns from the table — not all of them.",
      "Separate multiple column names with commas: `SELECT column1, column2 FROM tablename;`",
      "Select the `title` and `description` columns from the `tickets` table."
    ],
    hiddenTestQuery: "SELECT title, description FROM tickets;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Names and birth dates of bank customers",
    description: "Output the `name` and `birth_date` columns from the `customers` table in the banking dataset.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: bankingDataset.id,
    referenceQuery: "SELECT name, birth_date FROM customers;",
    tags: ["SELECT", "Columns"],
    hints: [
      "You only need two specific pieces of information per customer.",
      "Separate multiple column names with commas: `SELECT column1, column2 FROM tablename;`",
      "Select the `name` and `birth_date` columns from the `customers` table in the banking dataset."
    ],
    hiddenTestQuery: "SELECT name, birth_date FROM customers;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Exercise categories",
    description: "Output the `name` and `muscle_group` columns from the `exercises` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: fitnessDataset.id,
    referenceQuery: "SELECT name, muscle_group FROM exercises;",
    tags: ["SELECT", "Columns"],
    hints: [
      "You only need two of the available columns from this table.",
      "Separate multiple column names with commas: `SELECT column1, column2 FROM tablename;`",
      "Select the `name` and `muscle_group` columns from the `exercises` table."
    ],
    hiddenTestQuery: "SELECT name, muscle_group FROM exercises;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Session IDs and browsers",
    description: "Output the `id` and `browser` columns from the `sessions` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: logsDataset.id,
    referenceQuery: "SELECT id, browser FROM sessions;",
    tags: ["SELECT", "Columns"],
    hints: [
      "You only need two specific columns from the sessions table.",
      "Separate multiple column names with commas: `SELECT column1, column2 FROM tablename;`",
      "Select the `id` and `browser` columns from the `sessions` table."
    ],
    hiddenTestQuery: "SELECT id, browser FROM sessions;",
    hiddenTestMode: "rows",
  })
);

// SELECT exercises 21-30
selectExercisesEn.push(
  makeWriteExercise("sel", {
    title: "Unique subscription types",
    description: "Output all unique `subscription` values from the `users` table of the streaming dataset.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: streamingDataset.id,
    referenceQuery: "SELECT DISTINCT subscription FROM users;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "You want to find out which subscription types exist — each type only once.",
      "`DISTINCT` filters out duplicate values: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `subscription` column in the `users` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT subscription FROM users;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "All transaction types",
    description: "Output all unique values of the `type` column from the `transactions` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: bankingDataset.id,
    referenceQuery: "SELECT DISTINCT type FROM transactions;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "You want to see which transaction types exist — each type only once.",
      "`DISTINCT` removes duplicates from the result: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `type` column in the `transactions` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT type FROM transactions;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Product name and stock with alias",
    description: "Output `name` as `product` and `stock` as `in_stock` from the `products` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name AS product, stock AS in_stock FROM products;",
    tags: ["SELECT", "Alias"],
    hints: [
      "You can rename multiple columns at once to make the result more understandable.",
      "Use `AS` after each column name: `SELECT column1 AS alias1, column2 AS alias2 FROM tablename;`",
      "Use `AS product` after `name` and `AS in_stock` after `stock` in the `products` table."
    ],
    hiddenTestQuery: "SELECT name AS product, stock AS in_stock FROM products;",
    hiddenTestMode: "columns",
  }),
  makeWriteExercise("sel", {
    title: "All ticket status values",
    description: "Output all unique `status` values from the `tickets` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: ticketsDataset.id,
    referenceQuery: "SELECT DISTINCT status FROM tickets;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "You want a list of all possible status values — without repetitions.",
      "`DISTINCT` after `SELECT` returns only unique values: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `status` column in the `tickets` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT status FROM tickets;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Movie titles and release year",
    description: "Output the `title` and `year` columns from the `movies` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: streamingDataset.id,
    referenceQuery: "SELECT title, year FROM movies;",
    tags: ["SELECT", "Columns"],
    hints: [
      "You only need two specific pieces of information per movie from the table.",
      "Separate multiple column names with commas: `SELECT column1, column2 FROM tablename;`",
      "Select the `title` and `year` columns from the `movies` table."
    ],
    hiddenTestQuery: "SELECT title, year FROM movies;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "All workout data",
    description: "Output all columns from the `workouts` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: fitnessDataset.id,
    referenceQuery: "SELECT * FROM workouts;",
    tags: ["SELECT", "Basics"],
    hints: [
      "You want to see all information from the table — don't omit any column.",
      "The asterisk `*` stands for all columns: `SELECT * FROM tablename;`",
      "Use `SELECT *` on the `workouts` table."
    ],
    hiddenTestQuery: "SELECT * FROM workouts;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Account types without duplicates",
    description: "Output all unique `type` values from the `accounts` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: bankingDataset.id,
    referenceQuery: "SELECT DISTINCT type FROM accounts;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "You want to find out which account types exist — each type only once.",
      "`DISTINCT` filters duplicates: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `type` column in the `accounts` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT type FROM accounts;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Show event pages",
    description: "Output the `page` column from the `events` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: logsDataset.id,
    referenceQuery: "SELECT page FROM events;",
    tags: ["SELECT", "Columns"],
    hints: [
      "You only need a single column from this table.",
      "Write the column name directly after `SELECT`: `SELECT columnname FROM tablename;`",
      "Select only the `page` column from the `events` table."
    ],
    hiddenTestQuery: "SELECT page FROM events;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Application status without duplicates",
    description: "Output all unique `status` values from the `applications` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT DISTINCT status FROM applications;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "You want to see which status types exist for applications — each only once.",
      "`DISTINCT` removes duplicate values from the result: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `status` column in the `applications` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT status FROM applications;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "All payment methods",
    description: "Output all unique `payment_method` values from the `payments` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT DISTINCT payment_method FROM payments;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "You want a list of all payment methods used — without repetitions.",
      "`DISTINCT` returns each value only once: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `payment_method` column in the `payments` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT payment_method FROM payments;",
    hiddenTestMode: "rows",
  })
);

// SELECT exercises 31-40
selectExercisesEn.push(
  makeWriteExercise("sel", {
    title: "Names and cities with alias",
    description: "Output `name` as `customer` and `city` from the `customers` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name AS customer, city FROM customers;",
    tags: ["SELECT", "Alias"],
    hints: [
      "You can give a column a different name in the result while other columns remain unchanged.",
      "Use `AS` after the column name: `SELECT column AS alias, other_column FROM tablename;`",
      "Use `AS customer` after the `name` column in the `customers` table, also select `city`."
    ],
    hiddenTestQuery: "SELECT name AS customer, city FROM customers;",
    hiddenTestMode: "columns",
  }),
  makeWriteExercise("sel", {
    title: "All ticket priorities",
    description: "Output all unique `priority` values from the `tickets` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: ticketsDataset.id,
    referenceQuery: "SELECT DISTINCT priority FROM tickets;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "You want to find out which priority levels exist — list each only once.",
      "`DISTINCT` filters duplicate values: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `priority` column in the `tickets` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT priority FROM tickets;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Exercise name and category",
    description: "Output `name` and `category` from the `exercises` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: fitnessDataset.id,
    referenceQuery: "SELECT name, category FROM exercises;",
    tags: ["SELECT", "Columns"],
    hints: [
      "You only need two specific columns from the exercises table.",
      "Separate multiple column names with commas: `SELECT column1, column2 FROM tablename;`",
      "Select the `name` and `category` columns from the `exercises` table."
    ],
    hiddenTestQuery: "SELECT name, category FROM exercises;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Movie genre and duration",
    description: "Output `genre` and `duration_min` from the `movies` table and rename `duration_min` as `duration_minutes`.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: streamingDataset.id,
    referenceQuery: "SELECT genre, duration_min AS duration_minutes FROM movies;",
    tags: ["SELECT", "Alias"],
    hints: [
      "You can output a column under a different name while the other column remains unchanged.",
      "Use `AS` after the column name: `SELECT column1, column2 AS alias FROM tablename;`",
      "Select `genre` and `duration_min AS duration_minutes` from the `movies` table."
    ],
    hiddenTestQuery: "SELECT genre, duration_min AS duration_minutes FROM movies;",
    hiddenTestMode: "columns",
  }),
  makeWriteExercise("sel", {
    title: "All error codes",
    description: "Output all unique `error_code` values from the `errors` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: logsDataset.id,
    referenceQuery: "SELECT DISTINCT error_code FROM errors;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "You want a list of all existing error codes — each only once.",
      "`DISTINCT` removes duplicate values: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `error_code` column in the `errors` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT error_code FROM errors;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "All trainers with alias",
    description: "Output all columns from the `trainers` table, but rename `name` as `trainer_name`.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: fitnessDataset.id,
    referenceQuery: "SELECT id, name AS trainer_name, specialization, salary, hired_on FROM trainers;",
    tags: ["SELECT", "Alias"],
    hints: [
      "You can rename individual columns, but `SELECT *` doesn't allow aliases — list all columns explicitly.",
      "List all columns and use `AS` for the one to rename: `SELECT column1, column2 AS alias, column3 FROM tablename;`",
      "List all columns and rename `name` with `AS trainer_name` in the `trainers` table."
    ],
    hiddenTestQuery: "SELECT id, name AS trainer_name, specialization, salary, hired_on FROM trainers;",
    hiddenTestMode: "columns",
  }),
  makeWriteExercise("sel", {
    title: "Unique error severities",
    description: "Output all unique `severity` values from the `errors` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: logsDataset.id,
    referenceQuery: "SELECT DISTINCT severity FROM errors;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "You want to see which severity levels exist — each only once.",
      "`DISTINCT` filters duplicates: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `severity` column in the `errors` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT severity FROM errors;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Customer emails with alias",
    description: "Output `name` and `email` from the `customers` table, rename `email` as `contact`.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name, email AS contact FROM customers;",
    tags: ["SELECT", "Alias"],
    hints: [
      "You can rename one column while leaving the other as-is.",
      "Use `AS` after the column to rename: `SELECT column1, column2 AS alias FROM tablename;`",
      "Select `name` and `email AS contact` from the `customers` table."
    ],
    hiddenTestQuery: "SELECT name, email AS contact FROM customers;",
    hiddenTestMode: "columns",
  }),
  makeWriteExercise("sel", {
    title: "All movie genres",
    description: "Output all unique `genre` values from the `movies` table.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: streamingDataset.id,
    referenceQuery: "SELECT DISTINCT genre FROM movies;",
    tags: ["SELECT", "DISTINCT"],
    hints: [
      "You want a list of all available genres — each only once.",
      "`DISTINCT` returns unique values: `SELECT DISTINCT column FROM tablename;`",
      "Use `DISTINCT` before the `genre` column in the `movies` table."
    ],
    hiddenTestQuery: "SELECT DISTINCT genre FROM movies;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("sel", {
    title: "Employee salaries with alias",
    description: "Output `name` and `salary` from the `employees` table, rename `salary` as `monthly_salary`.",
    difficulty: "beginner",
    category: "SELECT",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT name, salary AS monthly_salary FROM employees;",
    tags: ["SELECT", "Alias"],
    hints: [
      "You can give a column a more descriptive name in the output.",
      "Use `AS` after the column name: `SELECT column1, column2 AS alias FROM tablename;`",
      "Select `name` and `salary AS monthly_salary` from the `employees` table."
    ],
    hiddenTestQuery: "SELECT name, salary AS monthly_salary FROM employees;",
    hiddenTestMode: "columns",
  })
);
