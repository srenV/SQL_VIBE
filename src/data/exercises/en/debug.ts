/**
 * Debug exercises (English).
 * Contains exercises where faulty SQL queries must be corrected.
 */
import { makeDebugExercise, resetCounter } from "@/data/exercises/_factory";
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

export const debugExercisesEn: Exercise[] = [];
resetCounter();
debugExercisesEn.push(
  makeDebugExercise("dbg", {
    title: "Fix query in customers",
    description: "The following query has an error. Correct it so that it returns the desired result.\n\nFaulty: `SELECT name, city FROM customers WHERE city = 'Berlin' AND city = 'Munich';`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "shop",
    brokenQuery: `SELECT name, city FROM customers WHERE city = 'Berlin' AND city = 'Munich';`,
    referenceQuery: `SELECT name, city FROM customers WHERE city = 'Berlin' OR city = 'Munich';`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "A column cannot have two different values at the same time — you need a different logical operator.",
      "Use `WHERE column = 'value1' OR column = 'value2'` for alternative conditions.",
      "The error is with `AND`: Replace it with `OR`, so the condition becomes `WHERE city = 'Berlin' OR city = 'Munich'`."
    ],
    hiddenTestQuery: `SELECT name, city FROM customers WHERE city = 'Berlin' OR city = 'Munich';`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query in products",
    description: "The following query has an error. Correct it so that it returns the desired result.\n\nFaulty: `SELECT name FROM products WHERE price > 100 ORDER price DESC;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "shop",
    brokenQuery: `SELECT name FROM products WHERE price > 100 ORDER price DESC;`,
    referenceQuery: `SELECT name FROM products WHERE price > 100 ORDER BY price DESC;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "The sort instruction is incomplete — look closely at how ORDER BY is correctly written.",
      "The complete syntax is `ORDER BY columnname ASC|DESC`.",
      "The error is at `ORDER price DESC` — the keyword `BY` is missing. Write `ORDER BY price DESC`."
    ],
    hiddenTestQuery: `SELECT name FROM products WHERE price > 100 ORDER BY price DESC;`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query in workouts",
    description: "The following query has an error. Correct it so that it returns the desired result.\n\nFaulty: `SELECT user_id, SUM(duration_min) FROM workouts GROUP user_id;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "fitness",
    brokenQuery: `SELECT user_id, SUM(duration_min) FROM workouts GROUP user_id;`,
    referenceQuery: `SELECT user_id, SUM(duration_min) FROM workouts GROUP BY user_id;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Aggregate functions like SUM require grouping — look closely at how GROUP BY is written.",
      "The correct syntax is `GROUP BY columnname`.",
      "The error is at `GROUP user_id` — the keyword `BY` is missing. Write `GROUP BY user_id`."
    ],
    hiddenTestQuery: `SELECT user_id, SUM(duration_min) FROM workouts GROUP BY user_id;`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query in employees",
    description: "The following query has an error. Correct it so that it returns the desired result.\n\nFaulty: `SELECT name, position FROM employees HAVING salary > 50000;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "hr",
    brokenQuery: `SELECT name, position FROM employees HAVING salary > 50000;`,
    referenceQuery: `SELECT name, position FROM employees WHERE salary > 50000;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "HAVING and WHERE have different use cases — when is each used?",
      "`WHERE` filters individual rows before aggregation, `HAVING` filters groups after GROUP BY.",
      "The error is `HAVING` without GROUP BY — without aggregation it must be `WHERE salary > 50000`."
    ],
    hiddenTestQuery: `SELECT name, position FROM employees WHERE salary > 50000;`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query in tickets",
    description: "The following query has an error. Correct it so that it returns the desired result.\n\nFaulty: `SELECT title, status FROM tickets WHERE status = 'open' OR status = 'in_progress' AND priority = 'high';`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "tickets",
    brokenQuery: `SELECT title, status FROM tickets WHERE status = 'open' OR status = 'in_progress' AND priority = 'high';`,
    referenceQuery: `SELECT title, status FROM tickets WHERE (status = 'open' OR status = 'in_progress') AND priority = 'high';`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Pay attention to the order of logical operators — AND and OR are not weighted equally.",
      "AND has higher priority than OR, so related OR parts are grouped with parentheses: `(A OR B) AND C`.",
      "The error is the missing parentheses: `status = 'open' OR status = 'in_progress'` must be enclosed in parentheses so AND works correctly."
    ],
    hiddenTestQuery: `SELECT title, status FROM tickets WHERE (status = 'open' OR status = 'in_progress') AND priority = 'high';`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query in transactions",
    description: "The following query has an error. Correct it so that it returns the desired result.\n\nFaulty: `SELECT account_id, SUM(amount) FROM transactions WHERE type = 'debit';`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "banking",
    brokenQuery: `SELECT account_id, SUM(amount) FROM transactions WHERE type = 'debit';`,
    referenceQuery: `SELECT account_id, SUM(amount) FROM transactions WHERE type = 'debit' GROUP BY account_id;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "When you use a non-aggregated column alongside an aggregate function, something must be missing.",
      "Whenever SUM(), COUNT() or AVG() appear together with other columns, `GROUP BY` is needed for those columns.",
      "The error: `account_id` in SELECT requires `GROUP BY account_id` at the end of the query."
    ],
    hiddenTestQuery: `SELECT account_id, SUM(amount) FROM transactions WHERE type = 'debit' GROUP BY account_id;`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query in movies",
    description: "The following query has an error. Correct it so that it returns the desired result.\n\nFaulty: `SELECT title FROM movies WHERE year > 2000 AND genre = 'Drama' OR genre = 'Action';`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "streaming",
    brokenQuery: `SELECT title FROM movies WHERE year > 2000 AND genre = 'Drama' OR genre = 'Action';`,
    referenceQuery: `SELECT title FROM movies WHERE year > 2000 AND (genre = 'Drama' OR genre = 'Action');`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "The year condition should apply to both genres — check whether this is actually interpreted that way without parentheses.",
      "AND binds more strongly than OR. Without parentheses, SQL reads: `(year > 2000 AND genre = 'Drama') OR genre = 'Action'`.",
      "Parenthesize the OR part: `WHERE year > 2000 AND (genre = 'Drama' OR genre = 'Action')`."
    ],
    hiddenTestQuery: `SELECT title FROM movies WHERE year > 2000 AND (genre = 'Drama' OR genre = 'Action');`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query in events",
    description: "The following query has an error. Correct it so that it returns the desired result.\n\nFaulty: `SELECT session_id, COUNT(*) FROM events GROUP BY session_id HAVING COUNT > 5;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "logs",
    brokenQuery: `SELECT session_id, COUNT(*) FROM events GROUP BY session_id HAVING COUNT > 5;`,
    referenceQuery: `SELECT session_id, COUNT(*) AS count FROM events GROUP BY session_id HAVING COUNT(*) > 5;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "COUNT alone is not a valid expression — aggregate functions always need an argument.",
      "Always write aggregate functions with parentheses: `COUNT(*)`, `SUM(column)`, `AVG(column)`.",
      "The error is at `HAVING COUNT > 5` — write `HAVING COUNT(*) > 5` so the expression is valid."
    ],
    hiddenTestQuery: `SELECT session_id, COUNT(*) AS count FROM events GROUP BY session_id HAVING COUNT(*) > 5;`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query (shop)",
    description: "Correct the faulty query.\n\nFaulty: `SELECT * FROM customers ORDER BY name;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "shop",
    brokenQuery: `SELECT * FROM customers ORDER BY name;`,
    referenceQuery: `SELECT * FROM customers ORDER BY name ASC;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "ORDER BY sorts in a default direction — which one is missing here for clarity?",
      "Add `ASC` or `DESC` after the column name to explicitly specify the sort direction.",
      "Add `ASC` after `name`: `ORDER BY name ASC` — this makes the ascending sort explicit and unambiguous."
    ],
    hiddenTestQuery: `SELECT * FROM customers ORDER BY name ASC;`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query (hr)",
    description: "Correct the faulty query.\n\nFaulty: `SELECT department_id, AVG(salary) FROM employees;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "hr",
    brokenQuery: `SELECT department_id, AVG(salary) FROM employees;`,
    referenceQuery: `SELECT department_id, AVG(salary) FROM employees GROUP BY department_id;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "If you want to calculate AVG() per group, SQL needs to know how the groups are formed.",
      "Every non-aggregated column in SELECT must appear in `GROUP BY`.",
      "The error: `department_id` in SELECT without `GROUP BY department_id` at the end — add `GROUP BY department_id`."
    ],
    hiddenTestQuery: `SELECT department_id, AVG(salary) FROM employees GROUP BY department_id;`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query (fitness)",
    description: "Correct the faulty query.\n\nFaulty: `SELECT name FROM users WHERE weight_kg = NULL;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "fitness",
    brokenQuery: `SELECT name FROM users WHERE weight_kg = NULL;`,
    referenceQuery: `SELECT name FROM users WHERE weight_kg IS NULL;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "NULL is not a normal value — it represents the absence of a value. How do you check for missing values in SQL?",
      "NULL cannot be compared with `=`. Use `IS NULL` or `IS NOT NULL` instead.",
      "Replace `weight_kg = NULL` with `weight_kg IS NULL` — only this way does SQL correctly recognize missing entries."
    ],
    hiddenTestQuery: `SELECT name FROM users WHERE weight_kg IS NULL;`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query (tickets)",
    description: "Correct the faulty query.\n\nFaulty: `SELECT title FROM tickets WHERE priority IN ('high', 'critical';`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "tickets",
    brokenQuery: `SELECT title FROM tickets WHERE priority IN ('high', 'critical';`,
    referenceQuery: `SELECT title FROM tickets WHERE priority IN ('high', 'critical');`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Look closely at the end of the WHERE condition — is the parenthesization correct?",
      "`IN (value1, value2)` requires a closing parenthesis after the value list.",
      "The error: the closing parenthesis `)` after `'critical'` is missing — write `IN ('high', 'critical')`."
    ],
    hiddenTestQuery: `SELECT title FROM tickets WHERE priority IN ('high', 'critical');`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query (banking)",
    description: "Correct the faulty query.\n\nFaulty: `SELECT c.name, c.balance FROM customers c JOIN accounts c ON c.id = c.customer_id;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "banking",
    brokenQuery: `SELECT c.name, c.balance FROM customers c JOIN accounts c ON c.id = c.customer_id;`,
    referenceQuery: `SELECT c.name, a.balance FROM customers c JOIN accounts a ON c.id = a.customer_id;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "When two tables get the same alias, SQL can no longer distinguish which table is meant.",
      "Give each table alias a unique abbreviation, e.g. `c` for customers and `a` for accounts.",
      "The error: both tables have alias `c`. Change `JOIN accounts c` to `JOIN accounts a` and adjust all references to `a`."
    ],
    hiddenTestQuery: `SELECT c.name, a.balance FROM customers c JOIN accounts a ON c.id = a.customer_id;`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query (streaming)",
    description: "Correct the faulty query.\n\nFaulty: `SELECT * FROM movies WHERE rating > 4.5;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "streaming",
    brokenQuery: `SELECT * FROM movies WHERE rating > 4.5;`,
    referenceQuery: `SELECT * FROM movies WHERE rating > 4.5;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Compare the query carefully with the task description — is something actually wrong?",
      "Sometimes a query is correct — check whether SELECT, FROM, WHERE and the condition are all correct.",
      "This query is syntactically correct: `SELECT * FROM movies WHERE rating > 4.5` has no error. Sometimes no correction is needed."
    ],
    hiddenTestQuery: `SELECT * FROM movies WHERE rating > 4.5;`,
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query (logs)",
    description: "Correct the faulty query.\n\nFaulty: `SELECT event_type FROM events WHERE duration_ms > 200 AND < 400;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: "logs",
    brokenQuery: `SELECT event_type FROM events WHERE duration_ms > 200 AND < 400;`,
    referenceQuery: `SELECT event_type FROM events WHERE duration_ms > 200 AND duration_ms < 400;`,
    expectedResultText: "",
    tags: ["Debugging", "Syntax"],
    hints: [
      "Every comparison needs a complete expression — check whether something is missing in the second part.",
      "SQL requires for every condition: `columnname operator value`. The column name must not be omitted.",
      "The error: `AND < 400` has no column name. Write `AND duration_ms < 400`."
    ],
    hiddenTestQuery: `SELECT event_type FROM events WHERE duration_ms > 200 AND duration_ms < 400;`,
    hiddenTestMode: "rows",
  })
);

debugExercisesEn.push(
  makeDebugExercise("dbg", {
    title: "Fix missing DISTINCT",
    description: "The query should output unique cities, but DISTINCT is missing.\n\nFaulty: `SELECT city FROM customers;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT city FROM customers;",
    referenceQuery: "SELECT DISTINCT city FROM customers;",
    hints: [
      "The query should output each city only once — what's missing to remove duplicates?",
      "With the keyword `DISTINCT` directly after `SELECT`, duplicate rows in the result are removed.",
      "The error: `DISTINCT` is missing. Write `SELECT DISTINCT city FROM customers;`."
    ],
    hiddenTestQuery: "SELECT DISTINCT city FROM customers;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Wrong JOIN type",
    description: "The query should show all customers, even those without orders.\n\nFaulty: `SELECT customers.name, orders.total_amount FROM customers INNER JOIN orders ON customers.id = orders.customer_id;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT customers.name, orders.total_amount FROM customers INNER JOIN orders ON customers.id = orders.customer_id;",
    referenceQuery: "SELECT customers.name, orders.total_amount FROM customers LEFT JOIN orders ON customers.id = orders.customer_id;",
    hints: [
      "Customers without orders should still appear — which JOIN type keeps all rows from the left table?",
      "`INNER JOIN` only shows rows with a match in both tables. `LEFT JOIN` keeps all rows from the left table, even without a match.",
      "Replace `INNER JOIN` with `LEFT JOIN` so customers without orders are shown with `NULL` in the amount."
    ],
    hiddenTestQuery: "SELECT customers.name, orders.total_amount FROM customers LEFT JOIN orders ON customers.id = orders.customer_id;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "GROUP BY with non-aggregate column",
    description: "The column `name` is not in GROUP BY.\n\nFaulty: `SELECT name, department_id, COUNT(*) FROM employees GROUP BY department_id;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: hrDataset.id,
    brokenQuery: "SELECT name, department_id, COUNT(*) FROM employees GROUP BY department_id;",
    referenceQuery: "SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;",
    hints: [
      "All columns in SELECT that are not aggregated must also appear in the GROUP BY clause.",
      "Either remove `name` from SELECT or include it in `GROUP BY` — depending on the goal.",
      "The error: `name` is not aggregated and not in `GROUP BY`. Remove `name` from SELECT for the desired result."
    ],
    hiddenTestQuery: "SELECT department_id, COUNT(*) FROM employees GROUP BY department_id;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "HAVING without GROUP BY",
    description: "HAVING is used without GROUP BY.\n\nFaulty: `SELECT * FROM products HAVING price > 100;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT * FROM products HAVING price > 100;",
    referenceQuery: "SELECT * FROM products WHERE price > 100;",
    hints: [
      "HAVING filters after aggregation — but there is no aggregation here. Which clause filters individual rows?",
      "`WHERE` filters rows before grouping, `HAVING` filters groups after GROUP BY — without GROUP BY it must be WHERE.",
      "Replace `HAVING price > 100` with `WHERE price > 100`."
    ],
    hiddenTestQuery: "SELECT * FROM products WHERE price > 100;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Missing semicolon",
    description: "The query has no terminating semicolon.\n\nFaulty: `SELECT name, email FROM customers`",
    difficulty: "beginner",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT name, email FROM customers",
    referenceQuery: "SELECT name, email FROM customers;",
    hints: [
      "Look at the end of the query — is something missing there?",
      "SQL statements should be terminated with a semicolon (`;`).",
      "Add `;` at the end: `SELECT name, email FROM customers;`."
    ],
    hiddenTestQuery: "SELECT name, email FROM customers;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Wrong table name",
    description: "The table name is misspelled.\n\nFaulty: `SELECT * FROM customer;`",
    difficulty: "beginner",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT * FROM customer;",
    referenceQuery: "SELECT * FROM customers;",
    hints: [
      "SQL table names must exactly match the database schema — check whether the name is correct.",
      "Check the schema: What is the exact table name?",
      "The error: The table is called `customers`, not `customer`. Write `SELECT * FROM customers;`."
    ],
    hiddenTestQuery: "SELECT * FROM customers;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query (university)",
    description: "Correct the faulty query.\n\nFaulty: `SELECT name FROM students WHERE semester > 3 ORDER name;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: universityDataset.id,
    brokenQuery: "SELECT name FROM students WHERE semester > 3 ORDER name;",
    referenceQuery: "SELECT name FROM students WHERE semester > 3 ORDER BY name;",
    hints: [
      "The sort instruction is incomplete — look closely at how ORDER BY is correctly written.",
      "The complete syntax is `ORDER BY columnname`.",
      "The error is at `ORDER name` — the keyword `BY` is missing. Write `ORDER BY name`."
    ],
    hiddenTestQuery: "SELECT name FROM students WHERE semester > 3 ORDER BY name;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query (ecommerce)",
    description: "Correct the faulty query.\n\nFaulty: `SELECT name, price FROM products WHERE category = 'Electronics' AND price < 100 OR price > 500;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: ecommerceDataset.id,
    brokenQuery: "SELECT name, price FROM products WHERE category = 'Electronics' AND price < 100 OR price > 500;",
    referenceQuery: "SELECT name, price FROM products WHERE category = 'Electronics' AND (price < 100 OR price > 500);",
    hints: [
      "The category condition should apply to both price conditions — check the operator precedence.",
      "AND binds more strongly than OR. Without parentheses, SQL reads: `(category = 'Electronics' AND price < 100) OR price > 500`.",
      "Parenthesize the OR part: `WHERE category = 'Electronics' AND (price < 100 OR price > 500)`."
    ],
    hiddenTestQuery: "SELECT name, price FROM products WHERE category = 'Electronics' AND (price < 100 OR price > 500);",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query (hospital)",
    description: "Correct the faulty query.\n\nFaulty: `SELECT name FROM patients WHERE insured = 'true';`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: hospitalDataset.id,
    brokenQuery: "SELECT name FROM patients WHERE insured = 'true';",
    referenceQuery: "SELECT name FROM patients WHERE insured = 1;",
    hints: [
      "Boolean values in SQL are stored as numbers, not as text strings.",
      "Use `WHERE column = 1` for true and `WHERE column = 0` for false — without quotes.",
      "The error: `insured = 'true'` treats the boolean as text. Write `insured = 1`."
    ],
    hiddenTestQuery: "SELECT name FROM patients WHERE insured = 1;",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dbg", {
    title: "Fix query (shop join)",
    description: "Correct the faulty query.\n\nFaulty: `SELECT customers.name, orders.total_amount FROM customers JOIN orders ON id = id;`",
    difficulty: "junior",
    category: "Debugging",
    datasetId: shopDataset.id,
    brokenQuery: "SELECT customers.name, orders.total_amount FROM customers JOIN orders ON id = id;",
    referenceQuery: "SELECT customers.name, orders.total_amount FROM customers JOIN orders ON customers.id = orders.customer_id;",
    hints: [
      "The JOIN condition `id = id` is ambiguous — SQL doesn't know which table's id is meant.",
      "Always qualify column names with the table name in JOIN conditions: `table1.column = table2.column`.",
      "The error: `ON id = id` is ambiguous. Write `ON customers.id = orders.customer_id`."
    ],
    hiddenTestQuery: "SELECT customers.name, orders.total_amount FROM customers JOIN orders ON customers.id = orders.customer_id;",
    hiddenTestMode: "rows",
  })
);
