/**
 * Schema exercises (English).
 * Contains exercises for recognizing and understanding database structures.
 */
import { makeSchemaExercise, resetCounter } from "@/data/exercises/_factory";
import type { Exercise } from "@/types/exercise";
import { shopDataset } from "@/data/datasets/shop";
import { fitnessDataset } from "@/data/datasets/fitness";
import { hrDataset } from "@/data/datasets/hr";
import { ticketsDataset } from "@/data/datasets/tickets";
import { bankingDataset } from "@/data/datasets/banking";
import { streamingDataset } from "@/data/datasets/streaming";
import { logsDataset } from "@/data/datasets/logs";

export const schemaExercisesEn: Exercise[] = [];
resetCounter();
schemaExercisesEn.push(
  makeSchemaExercise("sch", {
    title: "Schema understanding: Shop table connection",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "shop",
    question: "Which tables must be joined to display a customer's name and the name of the purchased product?",
    options: [
      { text: "customers, orders, order_items, products", isCorrect: true },
      { text: "customers, products", isCorrect: false },
      { text: "orders, products", isCorrect: false },
      { text: "customers, orders, products", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "To go from customer name to product name, you need to link multiple tables.",
      "Look at the foreign key relationships: customers -> orders -> order_items -> products.",
      "The path is: `customers` (name) JOIN `orders` (customer_id) JOIN `order_items` (order_id, product_id) JOIN `products` (name)."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Fitness sets table",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "fitness",
    question: "Which table contains information about the performed sets?",
    options: [
      { text: "workouts", isCorrect: false },
      { text: "exercises", isCorrect: false },
      { text: "sets", isCorrect: true },
      { text: "users", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Look for a table that stores data about individual sets of a workout.",
      "Tables are often named after what they store — 'sets' sounds like individual exercise sets.",
      "The `sets` table stores individual exercise units with repetitions and weight — it references `workouts` and `exercises`."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: HR supervisor reference",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "hr",
    question: "Which column in `employees` references the supervisor?",
    options: [
      { text: "department_id", isCorrect: false },
      { text: "manager_id", isCorrect: true },
      { text: "position", isCorrect: false },
      { text: "id", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "A supervisor is themselves an employee — look for a column that references the same table.",
      "Self-references often have the name `<singular_table>_id`, so `employee_id` or `manager_id`.",
      "The `manager_id` column in the `employees` table references `employees.id` — that's the supervisor."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: tickets",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "tickets",
    question: "Which table stores the comments for a ticket?",
    options: [
      { text: "tickets", isCorrect: false },
      { text: "agents", isCorrect: false },
      { text: "comments", isCorrect: true },
      { text: "categories", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Comments belong to a ticket — look for a table that stores messages for tickets.",
      "Tables for dependent information often have a foreign key to the main table.",
      "The `comments` table has a `ticket_id` column that references `tickets.id` — comments are stored there."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: banking",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "banking",
    question: "Which column connects `transactions` with `accounts`?",
    options: [
      { text: "customer_id", isCorrect: false },
      { text: "account_id", isCorrect: true },
      { text: "id", isCorrect: false },
      { text: "account_number", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "A transaction belongs to an account — look for the foreign key that references the `accounts` table.",
      "Foreign keys are usually named `<table_singular>_id`, so the link to `accounts` would be a column called `account_id`.",
      "The `account_id` column in the `transactions` table references `accounts.id` — that's the connection."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: streaming",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "streaming",
    question: "Which tables are needed to see which user watched which movie?",
    options: [
      { text: "users, movies", isCorrect: false },
      { text: "users, watch_history, movies", isCorrect: true },
      { text: "watch_history, reviews", isCorrect: false },
      { text: "users, reviews", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Between users and movies, there must be an intermediate table that connects both.",
      "A table with `user_id` and `movie_id` as foreign keys establishes the connection.",
      "The `watch_history` table has `user_id` and `movie_id` — it links users with watched movies."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: logs",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "logs",
    question: "Which column in `events` references the session?",
    options: [
      { text: "id", isCorrect: false },
      { text: "session_id", isCorrect: true },
      { text: "user_id", isCorrect: false },
      { text: "page", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "An event belongs to a session — look for the foreign key that points to the `sessions` table.",
      "Foreign keys in `events` that reference `sessions` are typically called `session_id`.",
      "The `session_id` column in the `events` table references `sessions.id` — that's the link."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Shop category FK",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "shop",
    question: "Which column in `products` references the category?",
    options: [
      { text: "id", isCorrect: false },
      { text: "name", isCorrect: false },
      { text: "category_id", isCorrect: true },
      { text: "price", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Products belong to a category — look for the foreign key that points to the `categories` table.",
      "Foreign keys are usually named `<table_singular>_id`, so `category_id` for the reference to `categories`.",
      "The `category_id` column in the `products` table references `categories.id`."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: HR vacation requests",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "hr",
    question: "Which table stores the vacation requests?",
    options: [
      { text: "employees", isCorrect: false },
      { text: "vacation", isCorrect: true },
      { text: "departments", isCorrect: false },
      { text: "applications", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Vacation requests are separate from employee master data — look for a dedicated table.",
      "The table name likely contains 'vacation' or 'leave'.",
      "The `vacation` table stores vacation requests with `employee_id`, dates, and approval status."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Tickets priority FK",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "tickets",
    question: "Which column in `tickets` references the assigned agent?",
    options: [
      { text: "id", isCorrect: false },
      { text: "category_id", isCorrect: false },
      { text: "agent_id", isCorrect: true },
      { text: "priority", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Tickets can be assigned to an agent — look for a foreign key to the `agents` table.",
      "The foreign key is named after the target table: `agent_id`.",
      "The `agent_id` column in the `tickets` table references `agents.id`."
    ],
  })
);

schemaExercisesEn.push(
  makeSchemaExercise("sch", {
    title: "Schema understanding: Banking customer-account link",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "banking",
    question: "Which column in `accounts` references the owning customer?",
    options: [
      { text: "id", isCorrect: false },
      { text: "account_number", isCorrect: false },
      { text: "customer_id", isCorrect: true },
      { text: "balance", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Each account belongs to a customer — look for the foreign key to the `customers` table.",
      "The foreign key is named `customer_id`.",
      "The `customer_id` column in the `accounts` table references `customers.id`."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Streaming movie reviews",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "streaming",
    question: "Which table stores user ratings for movies?",
    options: [
      { text: "watch_history", isCorrect: false },
      { text: "movies", isCorrect: false },
      { text: "reviews", isCorrect: true },
      { text: "users", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Ratings are separate from watch history — look for a table specifically for reviews.",
      "The table name likely contains 'review' or 'rating'.",
      "The `reviews` table stores star ratings and comments with `user_id` and `movie_id`."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Logs error-event link",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "logs",
    question: "Which column in `errors` references the associated event?",
    options: [
      { text: "id", isCorrect: false },
      { text: "event_id", isCorrect: true },
      { text: "error_code", isCorrect: false },
      { text: "severity", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Each error is linked to an event — look for the foreign key to the `events` table.",
      "The foreign key is named `event_id`.",
      "The `event_id` column in the `errors` table references `events.id`."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Fitness workout-user link",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "fitness",
    question: "Which column in `workouts` references the user who performed it?",
    options: [
      { text: "id", isCorrect: false },
      { text: "date", isCorrect: false },
      { text: "user_id", isCorrect: true },
      { text: "duration_min", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Each workout is performed by a user — look for the foreign key to the `users` table.",
      "The foreign key is named `user_id`.",
      "The `user_id` column in the `workouts` table references `users.id`."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Shop payment-order link",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "shop",
    question: "Which column in `payments` references the associated order?",
    options: [
      { text: "id", isCorrect: false },
      { text: "amount", isCorrect: false },
      { text: "order_id", isCorrect: true },
      { text: "payment_method", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Each payment belongs to an order — look for the foreign key to the `orders` table.",
      "The foreign key is named `order_id`.",
      "The `order_id` column in the `payments` table references `orders.id`."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: HR application department link",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "hr",
    question: "Which column in `applications` references the target department?",
    options: [
      { text: "id", isCorrect: false },
      { text: "name", isCorrect: false },
      { text: "department_id", isCorrect: true },
      { text: "status", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Each application targets a department — look for the foreign key to the `departments` table.",
      "The foreign key is named `department_id`.",
      "The `department_id` column in the `applications` table references `departments.id`."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Tickets category link",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "tickets",
    question: "Which column in `tickets` references the ticket category?",
    options: [
      { text: "id", isCorrect: false },
      { text: "title", isCorrect: false },
      { text: "category_id", isCorrect: true },
      { text: "agent_id", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Each ticket belongs to a category — look for the foreign key to the `categories` table.",
      "The foreign key is named `category_id`.",
      "The `category_id` column in the `tickets` table references `categories.id`."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Banking fraud-transaction link",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "banking",
    question: "Which column in `fraud_cases` references the suspicious transaction?",
    options: [
      { text: "id", isCorrect: false },
      { text: "transaction_id", isCorrect: true },
      { text: "reason", isCorrect: false },
      { text: "status", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Each fraud case is linked to a transaction — look for the foreign key to the `transactions` table.",
      "The foreign key is named `transaction_id`.",
      "The `transaction_id` column in the `fraud_cases` table references `transactions.id`."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Streaming watch history user link",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "streaming",
    question: "Which two foreign keys does the `watch_history` table contain?",
    options: [
      { text: "user_id and movie_id", isCorrect: true },
      { text: "user_id and review_id", isCorrect: false },
      { text: "movie_id and genre_id", isCorrect: false },
      { text: "session_id and user_id", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Watch history connects users with movies — it needs foreign keys to both tables.",
      "Look for columns ending in `_id` in the `watch_history` table.",
      "The `watch_history` table has `user_id` (to `users`) and `movie_id` (to `movies`)."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Logs session columns",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "logs",
    question: "Which columns in `sessions` store the session's time boundaries?",
    options: [
      { text: "id and user_id", isCorrect: false },
      { text: "start_time and end_time", isCorrect: true },
      { text: "ip_address and browser", isCorrect: false },
      { text: "created_at and closed_at", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Time boundaries mark when a session started and ended.",
      "Look for columns with 'start' and 'end' in their names.",
      "The `sessions` table has `start_time` and `end_time` columns."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Fitness exercises muscle group",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "fitness",
    question: "Which column in `exercises` indicates which muscle group is trained?",
    options: [
      { text: "name", isCorrect: false },
      { text: "category", isCorrect: false },
      { text: "muscle_group", isCorrect: true },
      { text: "id", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "The column name directly describes what it stores — the trained muscle group.",
      "Look for a column with 'muscle' in its name.",
      "The `muscle_group` column in the `exercises` table stores the target muscle group."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Shop order status values",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "shop",
    question: "Which column in `orders` stores the current processing status?",
    options: [
      { text: "id", isCorrect: false },
      { text: "date", isCorrect: false },
      { text: "status", isCorrect: true },
      { text: "total_amount", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "The processing status indicates where an order is in its lifecycle.",
      "The column is simply named after what it represents.",
      "The `status` column in the `orders` table stores values like 'completed', 'cancelled', 'processing'."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: HR employee department link",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "hr",
    question: "Which column in `employees` references the department they work in?",
    options: [
      { text: "id", isCorrect: false },
      { text: "name", isCorrect: false },
      { text: "department_id", isCorrect: true },
      { text: "manager_id", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Each employee works in a department — look for the foreign key to the `departments` table.",
      "The foreign key is named `department_id`.",
      "The `department_id` column in the `employees` table references `departments.id`."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Tickets timestamps",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "tickets",
    question: "Which two columns in `tickets` store creation and closure times?",
    options: [
      { text: "title and description", isCorrect: false },
      { text: "created_at and closed_at", isCorrect: true },
      { text: "priority and status", isCorrect: false },
      { text: "id and agent_id", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "Creation and closure are time-related — look for datetime columns.",
      "The column names describe when something happened.",
      "The `tickets` table has `created_at` and `closed_at` columns."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Banking transaction types",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "banking",
    question: "Which column in `transactions` distinguishes between credits and debits?",
    options: [
      { text: "amount", isCorrect: false },
      { text: "type", isCorrect: true },
      { text: "description", isCorrect: false },
      { text: "date", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "The column indicates whether money is coming in or going out.",
      "The column name describes the category of the transaction.",
      "The `type` column in the `transactions` table stores 'credit' or 'debit'."
    ],
  }),
  makeSchemaExercise("sch", {
    title: "Schema understanding: Streaming user subscriptions",
    description: "Analyze the schema and answer the question.",
    difficulty: "beginner",
    category: "Schema Understanding",
    datasetId: "streaming",
    question: "Which column in `users` stores the subscription tier?",
    options: [
      { text: "name", isCorrect: false },
      { text: "email", isCorrect: false },
      { text: "subscription", isCorrect: true },
      { text: "registered_on", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema Understanding", "Table relationships"],
    hints: [
      "The subscription tier indicates the user's plan level.",
      "The column name directly describes what it stores.",
      "The `subscription` column in the `users` table stores 'Premium', 'Standard', or 'Basic'."
    ],
  })
);
