/**
 * Prediction exercises (English).
 * Contains multiple-choice exercises where the query result must be predicted.
 */
import { makePredictExercise, resetCounter } from "@/data/exercises/_factory";
import type { Exercise } from "@/types/exercise";
import { shopDataset } from "@/data/datasets/shop";
import { fitnessDataset } from "@/data/datasets/fitness";
import { hrDataset } from "@/data/datasets/hr";
import { ticketsDataset } from "@/data/datasets/tickets";
import { bankingDataset } from "@/data/datasets/banking";
import { streamingDataset } from "@/data/datasets/streaming";
import { logsDataset } from "@/data/datasets/logs";

export const predictExercisesEn: Exercise[] = [];
resetCounter();
predictExercisesEn.push(
  makePredictExercise("prd", {
    title: "Predict result: product count over 50 euros",
    description: "Given the following query:\n\n`SELECT COUNT(*) FROM products WHERE price > 50;`\n\nHow many products have a price over 50?",
    difficulty: "beginner",
    category: "Result Prediction",
    datasetId: "shop",
    question: "How many products have a price over 50?",
    options: [
      { text: "4", isCorrect: false },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: true },
      { text: "7", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "COUNT(*) counts all rows that satisfy the WHERE condition.",
      "Count all products in the `products` table where `price > 50` applies.",
      "Key point: The `products` table contains 10 entries, of which 6 have a price over 50 euros."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: users",
    description: "Given the following query:\n\n`SELECT AVG(weight_kg) FROM users;`\n\nWhat is the average weight of all users?",
    difficulty: "beginner",
    category: "Result Prediction",
    datasetId: "fitness",
    question: "What is the average weight of all users?",
    options: [
      { text: "65.0", isCorrect: false },
      { text: "70.81", isCorrect: true },
      { text: "75.0", isCorrect: false },
      { text: "80.0", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "AVG() calculates the average of all values in a column.",
      "Add up all `weight_kg` values in the `users` table and divide by the number of users.",
      "Key point: The sum of weights divided by the number of users equals 70.81 — close to 70, not 65 or 75."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: employees",
    description: "Given the following query:\n\n`SELECT COUNT(*) FROM employees WHERE salary > 60000;`\n\nHow many employees earn more than 60000?",
    difficulty: "beginner",
    category: "Result Prediction",
    datasetId: "hr",
    question: "How many employees earn more than 60000?",
    options: [
      { text: "3", isCorrect: true },
      { text: "4", isCorrect: false },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "Go through the `employees` table and mark all whose `salary` is greater than 60000.",
      "COUNT(*) only counts rows where the WHERE condition is true.",
      "Key point: Of the employees in the HR dataset, exactly 3 earn more than 60000 euros."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: tickets",
    description: "Given the following query:\n\n`SELECT COUNT(*) FROM tickets WHERE status = 'open';`\n\nHow many tickets have the status 'open'?",
    difficulty: "beginner",
    category: "Result Prediction",
    datasetId: "tickets",
    question: "How many tickets have the status 'open'?",
    options: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "Count all rows in the `tickets` table where `status = 'open'` applies.",
      "Each row counts individually — it's about how many tickets have this status.",
      "Key point: Exactly 4 tickets in the tickets dataset have the status 'open'."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: transactions",
    description: "Given the following query:\n\n`SELECT SUM(amount) FROM transactions WHERE type = 'credit';`\n\nWhat is the sum of all credits?",
    difficulty: "beginner",
    category: "Result Prediction",
    datasetId: "banking",
    question: "What is the sum of all credits?",
    options: [
      { text: "14500.00", isCorrect: false },
      { text: "15600.00", isCorrect: false },
      { text: "16600.00", isCorrect: true },
      { text: "17000.00", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "SUM() adds up all values of a column that satisfy the WHERE condition.",
      "Filter `transactions` to `type = 'credit'` and add up all `amount` values.",
      "Key point: The credits in the banking dataset sum to 16600.00 — not 15600 or 17000."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: movies",
    description: "Given the following query:\n\n`SELECT COUNT(*) FROM movies WHERE genre = 'Drama';`\n\nHow many movies are in the 'Drama' genre?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: "streaming",
    question: "How many movies are in the 'Drama' genre?",
    options: [
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "Count all entries in the `movies` table where `genre = 'Drama'` applies.",
      "Each movie is counted individually — pay attention to the exact value 'Drama' (case-sensitive).",
      "Key point: In the streaming dataset, exactly 4 movies are assigned to the 'Drama' genre."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: errors",
    description: "Given the following query:\n\n`SELECT COUNT(*) FROM errors WHERE severity = 'critical';`\n\nHow many errors are critical?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: "logs",
    question: "How many errors are critical?",
    options: [
      { text: "4", isCorrect: false },
      { text: "5", isCorrect: true },
      { text: "6", isCorrect: false },
      { text: "7", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "Count all rows in the `errors` table where `severity = 'critical'` applies.",
      "Make sure only errors are counted — not events or sessions.",
      "Key point: In the logs dataset, there are exactly 5 errors with the severity 'critical'."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: orders",
    description: "Given the following query:\n\n`SELECT AVG(total_amount) FROM orders;`\n\nWhat is the average order value?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: "shop",
    question: "What is the average order value?",
    options: [
      { text: "250.00", isCorrect: false },
      { text: "312.13", isCorrect: true },
      { text: "350.00", isCorrect: false },
      { text: "400.00", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "AVG() calculates the average of all `total_amount` values in the `orders` table.",
      "Add up all order amounts and divide by the number of orders.",
      "Key point: The average amount is 312.13 euros — close to 300, not 250 or 400."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: workouts",
    description: "Given the following query:\n\n`SELECT MAX(calories_burned) FROM workouts;`\n\nWhat is the maximum calories burned in a single workout?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: "fitness",
    question: "What is the maximum calories burned in a single workout?",
    options: [
      { text: "600", isCorrect: false },
      { text: "650", isCorrect: false },
      { text: "720", isCorrect: true },
      { text: "750", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "MAX() finds the largest value in the `calories_burned` column across all workouts.",
      "You're looking for the single workout entry with the most calories burned.",
      "Key point: The maximum in the `workouts` table is 720 calories — not 650 or 750."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: vacation",
    description: "Given the following query:\n\n`SELECT SUM(days) FROM vacation WHERE approved = 1;`\n\nHow many vacation days were approved in total?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: "hr",
    question: "How many vacation days were approved in total?",
    options: [
      { text: "60", isCorrect: false },
      { text: "72", isCorrect: true },
      { text: "80", isCorrect: false },
      { text: "90", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "SUM() adds up all `days` values where `approved = 1` applies.",
      "Only approved vacation requests count — filter the `vacation` table to `approved = 1`.",
      "Key point: The sum of all approved vacation days in the HR dataset is 72 days."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: accounts",
    description: "Given the following query:\n\n`SELECT COUNT(*) FROM accounts WHERE type = 'Checking';`\n\nHow many checking accounts are there?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: "banking",
    question: "How many checking accounts are there?",
    options: [
      { text: "6", isCorrect: false },
      { text: "7", isCorrect: true },
      { text: "8", isCorrect: false },
      { text: "9", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "Count all rows in the `accounts` table where `type = 'Checking'` applies.",
      "Pay attention to the exact value — case and spelling must match.",
      "Key point: In the banking dataset, there are exactly 7 accounts of type 'Checking'."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: reviews",
    description: "Given the following query:\n\n`SELECT AVG(stars) FROM reviews;`\n\nWhat is the average star rating?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: "streaming",
    question: "What is the average star rating?",
    options: [
      { text: "3.5", isCorrect: false },
      { text: "3.85", isCorrect: true },
      { text: "4.0", isCorrect: false },
      { text: "4.2", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "AVG() calculates the average of the `stars` column across all reviews in the `reviews` table.",
      "Add up all star values and divide by the total number of reviews.",
      "Key point: The average star rating in the streaming dataset is 3.85 — not 3.5 or 4.0."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: products",
    description: "Given the following query:\n\n`SELECT MAX(price) FROM products;`\n\nWhat is the highest product price?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: "shop",
    question: "What is the highest product price?",
    options: [
      { text: "599.00", isCorrect: false },
      { text: "899.00", isCorrect: true },
      { text: "999.00", isCorrect: false },
      { text: "129.00", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "MAX() finds the highest `price` value in the `products` table — without filtering.",
      "Go through all prices and identify the largest one.",
      "Key point: The most expensive item in the shop dataset costs 899.00 euros — not 599 or 999."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: comments",
    description: "Given the following query:\n\n`SELECT COUNT(*) FROM comments WHERE author LIKE 'Max%';`\n\nHow many comments are from an author whose name starts with 'Max'?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: "tickets",
    question: "How many comments are from an author whose name starts with 'Max'?",
    options: [
      { text: "1", isCorrect: false },
      { text: "2", isCorrect: true },
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "LIKE 'Max%' searches for entries where `author` begins with 'Max'.",
      "Go through the `comments` table and count all authors whose name starts with 'Max'.",
      "Key point: In the tickets dataset, there are exactly 2 comments where the author starts with 'Max'."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: events",
    description: "Given the following query:\n\n`SELECT COUNT(*) FROM events WHERE event_type = 'checkout';`\n\nHow many checkout events are there?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: "logs",
    question: "How many checkout events are there?",
    options: [
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false },
      { text: "7", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "Count all rows in the `events` table where `event_type = 'checkout'` applies.",
      "Each event entry with this type is counted individually.",
      "Key point: In the logs dataset, there are exactly 4 events of type 'checkout'."
    ],
  })
);

predictExercisesEn.push(
  makePredictExercise("prd", {
    title: "Predict result: DISTINCT cities",
    description: "Given the following query:\n\n`SELECT COUNT(DISTINCT city) FROM customers;`\n\nHow many unique cities are there?",
    difficulty: "beginner",
    category: "Result Prediction",
    datasetId: shopDataset.id,
    question: "How many unique cities are there in `customers`?",
    options: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false }
    ],
    tags: ["Result Prediction", "DISTINCT"],
    hints: [
      "COUNT(DISTINCT ...) only counts different values — duplicates are counted once.",
      "Look at the `city` column in `customers` and count how many different cities appear.",
      "Key point: `DISTINCT` removes duplicates — there are 4 unique cities: Berlin, Hamburg, Munich, and Cologne."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: MIN price",
    description: "Given the following query:\n\n`SELECT MIN(price) FROM products;`\n\nWhat is the lowest product price?",
    difficulty: "beginner",
    category: "Result Prediction",
    datasetId: shopDataset.id,
    question: "What is the lowest product price?",
    options: [
      { text: "14.99", isCorrect: true },
      { text: "19.99", isCorrect: false },
      { text: "24.99", isCorrect: false },
      { text: "29.99", isCorrect: false }
    ],
    tags: ["Result Prediction", "MIN"],
    hints: [
      "MIN() returns the smallest value in a column — without filtering across all rows.",
      "Go through all prices in the `products` table and identify the cheapest one.",
      "Key point: The smallest price in the `products` table is 14.99 — not 19.99 or 24.99."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: WHERE with LIKE",
    description: "Given the following query:\n\n`SELECT COUNT(*) FROM customers WHERE email LIKE '%example.com';`\n\nHow many customers have an email with 'example.com'?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: shopDataset.id,
    question: "How many customers have an email with 'example.com'?",
    options: [
      { text: "8", isCorrect: false },
      { text: "10", isCorrect: true },
      { text: "12", isCorrect: false },
      { text: "6", isCorrect: false }
    ],
    tags: ["Result Prediction", "LIKE"],
    hints: [
      "LIKE '%example.com' matches all emails ending with 'example.com'.",
      "Count all customers whose email address ends with 'example.com'.",
      "Key point: All 10 customers in the shop dataset have an email ending with 'example.com'."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: GROUP BY category",
    description: "Given the following query:\n\n`SELECT category_id, COUNT(*) FROM products GROUP BY category_id;`\n\nHow many rows will the result have?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: shopDataset.id,
    question: "How many rows will the result have?",
    options: [
      { text: "3", isCorrect: false },
      { text: "4", isCorrect: true },
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: false }
    ],
    tags: ["Result Prediction", "GROUP BY"],
    hints: [
      "GROUP BY creates one row per unique value in the grouped column.",
      "Count how many different `category_id` values exist in the `products` table.",
      "Key point: There are 4 different category IDs in the products table, so the result has 4 rows."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: HAVING filter",
    description: "Given the following query:\n\n`SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id HAVING COUNT(*) > 1;`\n\nHow many customers have more than one order?",
    difficulty: "intermediate",
    category: "Result Prediction",
    datasetId: shopDataset.id,
    question: "How many customers have more than one order?",
    options: [
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: true },
      { text: "4", isCorrect: false },
      { text: "5", isCorrect: false }
    ],
    tags: ["Result Prediction", "HAVING"],
    hints: [
      "HAVING filters groups after GROUP BY — only groups with COUNT(*) > 1 remain.",
      "Group orders by customer_id, count per group, and keep only those with more than 1.",
      "Key point: 3 customers have placed more than one order in the shop dataset."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: NULL handling",
    description: "Given the following query:\n\n`SELECT COUNT(*) FROM employees WHERE manager_id IS NULL;`\n\nHow many employees have no manager?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: hrDataset.id,
    question: "How many employees have no manager?",
    options: [
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: true },
      { text: "4", isCorrect: false },
      { text: "5", isCorrect: false }
    ],
    tags: ["Result Prediction", "NULL"],
    hints: [
      "IS NULL finds rows where a column has no value.",
      "Count employees where manager_id is NULL — these are top-level employees.",
      "Key point: 3 employees in the HR dataset have no manager (manager_id IS NULL)."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: BETWEEN range",
    description: "Given the following query:\n\n`SELECT COUNT(*) FROM movies WHERE duration_min BETWEEN 120 AND 150;`\n\nHow many movies are between 120 and 150 minutes long?",
    difficulty: "junior",
    category: "Result Prediction",
    datasetId: streamingDataset.id,
    question: "How many movies are between 120 and 150 minutes long?",
    options: [
      { text: "4", isCorrect: false },
      { text: "5", isCorrect: true },
      { text: "6", isCorrect: false },
      { text: "7", isCorrect: false }
    ],
    tags: ["Result Prediction", "BETWEEN"],
    hints: [
      "BETWEEN is inclusive — both 120 and 150 count.",
      "Count movies where duration_min falls in the range 120 to 150.",
      "Key point: 5 movies in the streaming dataset have a duration between 120 and 150 minutes."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: multiple aggregations",
    description: "Given the following query:\n\n`SELECT COUNT(*), AVG(price), MAX(price) FROM products WHERE category_id = 1;`\n\nHow many columns will the result have?",
    difficulty: "beginner",
    category: "Result Prediction",
    datasetId: shopDataset.id,
    question: "How many columns will the result have?",
    options: [
      { text: "1", isCorrect: false },
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: true },
      { text: "4", isCorrect: false }
    ],
    tags: ["Result Prediction", "Aggregation"],
    hints: [
      "Each aggregate function in SELECT produces one column in the result.",
      "Count the number of expressions in the SELECT clause.",
      "Key point: COUNT(*), AVG(price), and MAX(price) produce exactly 3 columns."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: ORDER BY with LIMIT",
    description: "Given the following query:\n\n`SELECT name FROM products ORDER BY price DESC LIMIT 3;`\n\nHow many rows will the result have?",
    difficulty: "beginner",
    category: "Result Prediction",
    datasetId: shopDataset.id,
    question: "How many rows will the result have?",
    options: [
      { text: "1", isCorrect: false },
      { text: "2", isCorrect: false },
      { text: "3", isCorrect: true },
      { text: "10", isCorrect: false }
    ],
    tags: ["Result Prediction", "LIMIT"],
    hints: [
      "LIMIT restricts the number of rows returned.",
      "The number after LIMIT is exactly how many rows you get.",
      "Key point: LIMIT 3 means exactly 3 rows are returned."
    ],
  }),
  makePredictExercise("prd", {
    title: "Predict result: IN with subquery",
    description: "Given the following query:\n\n`SELECT COUNT(*) FROM customers WHERE id IN (SELECT customer_id FROM orders);`\n\nHow many customers have placed at least one order?",
    difficulty: "intermediate",
    category: "Result Prediction",
    datasetId: shopDataset.id,
    question: "How many customers have placed at least one order?",
    options: [
      { text: "5", isCorrect: false },
      { text: "6", isCorrect: true },
      { text: "7", isCorrect: false },
      { text: "8", isCorrect: false }
    ],
    tags: ["Result Prediction", "Subquery"],
    hints: [
      "The subquery returns all customer_ids from orders.",
      "IN checks if a customer's id appears in that list.",
      "Key point: 6 distinct customers have placed orders in the shop dataset."
    ],
  })
);
