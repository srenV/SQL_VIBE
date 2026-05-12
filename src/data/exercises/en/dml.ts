/**
 * DML exercises (Data Manipulation Language) — English.
 * Contains exercises for INSERT, UPDATE, and DELETE.
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

export const dmlExercisesEn: Exercise[] = [];
resetCounter();
dmlExercisesEn.push(
  makeWriteExercise("dml", {
    title: "INSERT: Add a new customer",
    description: "A new customer should be stored in the database: Name = 'Max Mustermann', Email = 'max@example.com', City = 'Berlin'.",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "INSERT INTO customers (name, email, city) VALUES ('Max Mustermann', 'max@example.com', 'Berlin');",
    tags: ["DML", "INSERT"],
    hints: [
      "Use `INSERT INTO table (column1, column2, ...) VALUES (value1, value2, ...)`.",
      "Omit the `id` column if it is automatically assigned (AUTO_INCREMENT)."
    ],
    hiddenTestQuery: "SELECT * FROM customers WHERE name = 'Max Mustermann' AND email = 'max@example.com';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "INSERT: Create a new employee",
    description: "Create a new employee in the database: Name = 'Anna Schmidt', Department 2, Position = 'Developer', Salary = 55000.",
    difficulty: "junior",
    category: "DML",
    datasetId: hrDataset.id,
    referenceQuery: "INSERT INTO employees (name, department_id, position, salary) VALUES ('Anna Schmidt', 2, 'Developer', 55000);",
    tags: ["DML", "INSERT"],
    hints: [
      "Specify all required columns in the INSERT.",
      "The order of column names must match the values."
    ],
    hiddenTestQuery: "SELECT * FROM employees WHERE name = 'Anna Schmidt' AND position = 'Developer';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "INSERT: Record a new product",
    description: "Record a new product in the database: Name = 'Bluetooth Speaker', Category 1, Price = 79.99, Stock = 50.",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "INSERT INTO products (name, category_id, price, stock) VALUES ('Bluetooth Speaker', 1, 79.99, 50);",
    tags: ["DML", "INSERT"],
    hints: [
      "Decimal values are written with a period (not a comma).",
      "Specify all columns that are not automatically filled."
    ],
    hiddenTestQuery: "SELECT * FROM products WHERE name = 'Bluetooth Speaker';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "INSERT: Log a new fitness workout",
    description: "Save a new workout for user 1 in the database: Date = today, Duration = 45 minutes, Calories burned = 320.",
    difficulty: "junior",
    category: "DML",
    datasetId: fitnessDataset.id,
    referenceQuery: "INSERT INTO workouts (user_id, date, duration_min, calories_burned) VALUES (1, DATE('now'), 45, 320);",
    tags: ["DML", "INSERT", "Date"],
    hints: [
      "Use `DATE('now')` for the current date in sql.js.",
      "Specify user_id, date, duration_min, and calories_burned."
    ],
    hiddenTestQuery: "SELECT * FROM workouts WHERE user_id = 1 AND duration_min = 45 AND calories_burned = 320;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "INSERT: Register a new streaming user",
    description: "Register a new user 'Julia Klein' with the email 'julia@example.com' and the 'Premium' subscription.",
    difficulty: "junior",
    category: "DML",
    datasetId: streamingDataset.id,
    referenceQuery: "INSERT INTO users (name, email, subscription) VALUES ('Julia Klein', 'julia@example.com', 'Premium');",
    tags: ["DML", "INSERT"],
    hints: [
      "Use INSERT INTO with the columns name, email, and subscription.",
      "The subscription is a text value – use single quotes."
    ],
    hiddenTestQuery: "SELECT * FROM users WHERE name = 'Julia Klein' AND email = 'julia@example.com';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE: Increase salary",
    description: "Increase the salary of all employees in department 1 by 10%.",
    difficulty: "junior",
    category: "DML",
    datasetId: hrDataset.id,
    referenceQuery: "UPDATE employees SET salary = salary * 1.10 WHERE department_id = 1;",
    tags: ["DML", "UPDATE", "Calculation"],
    hints: [
      "Use `UPDATE table SET column = expression WHERE condition`.",
      "With `salary * 1.10` you increase the salary by 10%."
    ],
    hiddenTestQuery: "SELECT name, salary FROM employees WHERE department_id = 1;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE: Lower product price",
    description: "Set the price of all products with category_id 2 (Clothing) to 80% of the original price (20% discount).",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "UPDATE products SET price = price * 0.80 WHERE category_id = 2;",
    tags: ["DML", "UPDATE", "Calculation"],
    hints: [
      "80% of the price corresponds to `price * 0.80`.",
      "Use WHERE category_id = 2 to update only clothing."
    ],
    hiddenTestQuery: "SELECT name, price FROM products WHERE category_id = 2;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE: Change order status",
    description: "Change the status of all orders with status 'processing' to 'shipped'.",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "UPDATE orders SET status = 'shipped' WHERE status = 'processing';",
    tags: ["DML", "UPDATE"],
    hints: [
      "Use `UPDATE orders SET status = 'shipped'` for the change.",
      "With `WHERE status = 'processing'` you limit the change to the correct rows."
    ],
    hiddenTestQuery: "SELECT * FROM orders WHERE status = 'shipped';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE: Increase ticket priority",
    description: "Set the priority of all open tickets to 'high'.",
    difficulty: "junior",
    category: "DML",
    datasetId: ticketsDataset.id,
    referenceQuery: "UPDATE tickets SET priority = 'high' WHERE status = 'open';",
    tags: ["DML", "UPDATE"],
    hints: [
      "Combine SET and WHERE to change only specific rows.",
      "The condition filters open tickets, SET changes the priority."
    ],
    hiddenTestQuery: "SELECT * FROM tickets WHERE status = 'open';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE: Increase stock",
    description: "Increase the stock of all products by 100 units.",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "UPDATE products SET stock = stock + 100;",
    tags: ["DML", "UPDATE"],
    hints: [
      "Without a WHERE clause, all rows are updated.",
      "Use `stock = stock + 100` for the increase."
    ],
    hiddenTestQuery: "SELECT name, stock FROM products;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "DELETE: Remove cancelled orders",
    description: "Delete all orders with the status 'cancelled'.",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "DELETE FROM orders WHERE status = 'cancelled';",
    tags: ["DML", "DELETE"],
    hints: [
      "Use `DELETE FROM table WHERE condition` to delete specific rows.",
      "Without WHERE, ALL rows are deleted – be careful!"
    ],
    hiddenTestQuery: "SELECT * FROM orders WHERE status <> 'cancelled';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "DELETE: Remove inactive agents",
    description: "Delete all agents who are not active (active = 0).",
    difficulty: "junior",
    category: "DML",
    datasetId: ticketsDataset.id,
    referenceQuery: "DELETE FROM agents WHERE active = 0;",
    tags: ["DML", "DELETE"],
    hints: [
      "Check `WHERE active = 0` to remove only inactive agents.",
      "DELETE irrevocably removes the row from the table."
    ],
    hiddenTestQuery: "SELECT * FROM agents WHERE active = 1;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "DELETE: Remove rejected applications",
    description: "Delete all applications with the status 'rejected'.",
    difficulty: "junior",
    category: "DML",
    datasetId: hrDataset.id,
    referenceQuery: "DELETE FROM applications WHERE status = 'rejected';",
    tags: ["DML", "DELETE"],
    hints: [
      "Use `DELETE FROM applications WHERE status = 'rejected'`.",
      "Only rejected applications are removed, all others remain."
    ],
    hiddenTestQuery: "SELECT * FROM applications WHERE status <> 'rejected';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "DELETE: Error logs older than 30 days",
    description: "Delete all error entries. (Simplified: Delete all entries from the `errors` table.)",
    difficulty: "junior",
    category: "DML",
    datasetId: logsDataset.id,
    referenceQuery: "DELETE FROM errors;",
    tags: ["DML", "DELETE"],
    hints: [
      "Without a WHERE clause, all rows are deleted.",
      "Use `DELETE FROM errors;` to empty the entire table."
    ],
    hiddenTestQuery: "SELECT COUNT(*) AS count FROM errors;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE: Account balance on deposit",
    description: "Increase the balance of the account with id 1 by 500.",
    difficulty: "junior",
    category: "DML",
    datasetId: bankingDataset.id,
    referenceQuery: "UPDATE accounts SET balance = balance + 500 WHERE id = 1;",
    tags: ["DML", "UPDATE"],
    hints: [
      "Use `balance = balance + 500` to add the amount.",
      "With `WHERE id = 1` you limit the change to a specific account."
    ],
    hiddenTestQuery: "SELECT * FROM accounts WHERE id = 1;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "INSERT with SELECT: Copy products",
    description: "Create copies of all products from category 1 as new entries in the database. The name of each copy should be 'Copy of <original name>'.",
    difficulty: "intermediate",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "INSERT INTO products (name, category_id, price, stock) SELECT 'Copy of ' || name, category_id, price, stock FROM products WHERE category_id = 1;",
    tags: ["DML", "INSERT", "INSERT SELECT"],
    hints: [
      "Use `INSERT INTO table (columns) SELECT ... FROM ...` for INSERT from a query.",
      "With `'Copy of ' || name` you concatenate strings."
    ],
    hiddenTestQuery: "SELECT * FROM products WHERE name LIKE 'Copy of %';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE with subquery: Adjust salary to average",
    description: "Set the salary of the employee with id 1 to the average value of all employees. Use a subquery.",
    difficulty: "intermediate",
    category: "DML",
    datasetId: hrDataset.id,
    referenceQuery: "UPDATE employees SET salary = (SELECT AVG(salary) FROM employees) WHERE id = 1;",
    tags: ["DML", "UPDATE", "Subquery"],
    hints: [
      "You can use a subquery in the SET part: `SET salary = (SELECT ...)`.",
      "The subquery must return exactly one value."
    ],
    hiddenTestQuery: "SELECT name, salary FROM employees WHERE id = 1;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "UPDATE based on JOIN: Discount for existing customers",
    description: "Increase the stock of all products by 20 that appear in at least one order item.",
    difficulty: "intermediate",
    category: "DML",
    datasetId: shopDataset.id,
    referenceQuery: "UPDATE products SET stock = stock + 20 WHERE id IN (SELECT DISTINCT product_id FROM order_items);",
    tags: ["DML", "UPDATE", "Subquery"],
    hints: [
      "Use `WHERE id IN (SELECT ...)` for the filter.",
      "The subquery returns all product IDs that have been ordered."
    ],
    hiddenTestQuery: "SELECT name, stock FROM products WHERE id IN (SELECT DISTINCT product_id FROM order_items);",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("dml", {
    title: "DELETE with subquery: Tickets without comments",
    description: "Remove all tickets from the database that have no comments.",
    difficulty: "intermediate",
    category: "DML",
    datasetId: ticketsDataset.id,
    referenceQuery: "DELETE FROM tickets WHERE id NOT IN (SELECT DISTINCT ticket_id FROM comments);",
    tags: ["DML", "DELETE", "Subquery"],
    hints: [
      "First find the ticket IDs with comments: `SELECT DISTINCT ticket_id FROM comments`.",
      "Use `NOT IN` to identify tickets without comments."
    ],
    hiddenTestQuery: "SELECT * FROM tickets WHERE id IN (SELECT DISTINCT ticket_id FROM comments);",
    hiddenTestMode: "rows",
  }),
  makeDebugExercise("dml", {
    title: "Debug: Missing WHERE clause",
    description: "This UPDATE statement should only increase the salary of employee 3, but the WHERE clause is missing. Correct the query.",
    difficulty: "junior",
    category: "DML",
    datasetId: hrDataset.id,
    brokenQuery: "UPDATE employees SET salary = salary * 1.10;",
    referenceQuery: "UPDATE employees SET salary = salary * 1.10 WHERE id = 3;",
    tags: ["DML", "UPDATE", "Debugging"],
    hints: [
      "Without a WHERE clause, ALL employees are updated.",
      "Add `WHERE id = 3` to affect only one employee."
    ],
    hiddenTestQuery: "SELECT name, salary FROM employees WHERE id = 3;",
    hiddenTestMode: "rows",
  }),
  makePredictExercise("dml", {
    title: "Prediction: Effect of DELETE",
    description: "What happens when you execute `DELETE FROM customers WHERE city = 'Berlin'`?",
    difficulty: "junior",
    category: "DML",
    datasetId: shopDataset.id,
    question: "What happens after executing `DELETE FROM customers WHERE city = 'Berlin'`?",
    options: [
      { text: "All Berlin customers are removed from the table", isCorrect: true },
      { text: "Only the 'city' column of Berlin customers is set to NULL", isCorrect: false },
      { text: "The entire customers table is emptied", isCorrect: false },
      { text: "Berlin customers are only marked as inactive", isCorrect: false }
    ],
    tags: ["DML", "DELETE", "Result Prediction"],
    hints: [
      "DELETE removes complete rows, not just individual columns.",
      "With WHERE, only a portion of the table is affected."
    ],
  }),
  makePredictExercise("dml", {
    title: "Prediction: UPDATE without WHERE",
    description: "What happens with an UPDATE without a WHERE clause?",
    difficulty: "junior",
    category: "DML",
    datasetId: hrDataset.id,
    question: "What happens if you execute `UPDATE employees SET salary = 50000` without WHERE?",
    options: [
      { text: "Only the first employee gets 50000", isCorrect: false },
      { text: "All employees get a salary of 50000", isCorrect: true },
      { text: "An error occurs because WHERE is mandatory", isCorrect: false },
      { text: "Only employees without a salary are updated", isCorrect: false }
    ],
    tags: ["DML", "UPDATE", "Result Prediction"],
    hints: [
      "Without a WHERE clause, UPDATE affects all rows of the table.",
      "This can cause unintended changes – always check WHERE!"
    ],
  })
);
