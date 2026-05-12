/**
 * DDL exercises (Data Definition Language) — English.
 * Contains exercises for CREATE TABLE, ALTER TABLE, and DROP TABLE.
 */
import { makeWriteExercise, makeDebugExercise, makeSchemaExercise, resetCounter } from "@/data/exercises/_factory";
import type { Exercise } from "@/types/exercise";
import { shopDataset } from "@/data/datasets/shop";
import { fitnessDataset } from "@/data/datasets/fitness";
import { hrDataset } from "@/data/datasets/hr";
import { ticketsDataset } from "@/data/datasets/tickets";
import { bankingDataset } from "@/data/datasets/banking";
import { streamingDataset } from "@/data/datasets/streaming";
import { logsDataset } from "@/data/datasets/logs";

export const ddlExercisesEn: Exercise[] = [];
resetCounter();
ddlExercisesEn.push(
  makeWriteExercise("ddl", {
    title: "CREATE TABLE: Create a simple table",
    description: "Create a table `notes` with the columns: id (INTEGER, PRIMARY KEY), title (TEXT, NOT NULL), content (TEXT), created_at (TEXT).",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    referenceQuery: "CREATE TABLE notes (id INTEGER PRIMARY KEY, title TEXT NOT NULL, content TEXT, created_at TEXT);",
    tags: ["DDL", "CREATE TABLE"],
    hints: [
      "Use `CREATE TABLE tablename (column1 type, column2 type, ...)`.",
      "PRIMARY KEY defines the primary key, NOT NULL prohibits NULL values."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='notes';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE: Employee table",
    description: "Create a table `projects` with: id (INTEGER PRIMARY KEY), name (TEXT NOT NULL), budget (REAL), start_date (TEXT), department_id (INTEGER).",
    difficulty: "junior",
    category: "DDL",
    datasetId: hrDataset.id,
    referenceQuery: "CREATE TABLE projects (id INTEGER PRIMARY KEY, name TEXT NOT NULL, budget REAL, start_date TEXT, department_id INTEGER);",
    tags: ["DDL", "CREATE TABLE"],
    hints: [
      "REAL is the type for floating-point numbers in SQLite/sql.js.",
      "Each column gets its data type after the name."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='projects';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE with FOREIGN KEY",
    description: "Create a table `tasks` with: id (INTEGER PRIMARY KEY), title (TEXT NOT NULL), status (TEXT DEFAULT 'open'), project_id (INTEGER REFERENCES projects(id)).",
    difficulty: "junior",
    category: "DDL",
    datasetId: hrDataset.id,
    referenceQuery: "CREATE TABLE tasks (id INTEGER PRIMARY KEY, title TEXT NOT NULL, status TEXT DEFAULT 'open', project_id INTEGER REFERENCES projects(id));",
    tags: ["DDL", "CREATE TABLE", "FOREIGN KEY", "DEFAULT"],
    hints: [
      "`REFERENCES other_table(column)` defines a foreign key.",
      "`DEFAULT 'value'` sets a default value when no value is specified."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='tasks';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE: Logging table",
    description: "Create a table `access_log` with: id (INTEGER PRIMARY KEY), user_id (INTEGER NOT NULL), action (TEXT NOT NULL), timestamp (TEXT NOT NULL), details (TEXT).",
    difficulty: "junior",
    category: "DDL",
    datasetId: logsDataset.id,
    referenceQuery: "CREATE TABLE access_log (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, action TEXT NOT NULL, timestamp TEXT NOT NULL, details TEXT);",
    tags: ["DDL", "CREATE TABLE", "NOT NULL"],
    hints: [
      "NOT NULL ensures that the column must always have a value.",
      "Use NOT NULL for required fields like user_id or action."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='access_log';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE with UNIQUE",
    description: "Create a table `voucher_codes` with: id (INTEGER PRIMARY KEY), code (TEXT UNIQUE NOT NULL), discount_percent (REAL NOT NULL), valid_until (TEXT).",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    referenceQuery: "CREATE TABLE voucher_codes (id INTEGER PRIMARY KEY, code TEXT UNIQUE NOT NULL, discount_percent REAL NOT NULL, valid_until TEXT);",
    tags: ["DDL", "CREATE TABLE", "UNIQUE"],
    hints: [
      "UNIQUE ensures that each value in the column occurs only once.",
      "Combine UNIQUE and NOT NULL to create unique required fields."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='voucher_codes';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "ALTER TABLE: Add a column",
    description: "Add a new column `phone` of type TEXT to the `customers` table.",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    referenceQuery: "ALTER TABLE customers ADD COLUMN phone TEXT;",
    tags: ["DDL", "ALTER TABLE", "ADD COLUMN"],
    hints: [
      "Use `ALTER TABLE table ADD COLUMN column type`.",
      "New columns are added at the end of the table."
    ],
    hiddenTestQuery: "PRAGMA table_info(customers);",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "ALTER TABLE: Add a column with default",
    description: "Add a column `rating` of type REAL with the default value 0.0 to the `products` table.",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    referenceQuery: "ALTER TABLE products ADD COLUMN rating REAL DEFAULT 0.0;",
    tags: ["DDL", "ALTER TABLE", "ADD COLUMN", "DEFAULT"],
    hints: [
      "Use `ADD COLUMN column type DEFAULT value` to set a default value.",
      "Existing rows receive the default value for the new column."
    ],
    hiddenTestQuery: "PRAGMA table_info(products);",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "ALTER TABLE: Add column to employees",
    description: "Add the column `birth_date` of type TEXT to the `employees` table.",
    difficulty: "junior",
    category: "DDL",
    datasetId: hrDataset.id,
    referenceQuery: "ALTER TABLE employees ADD COLUMN birth_date TEXT;",
    tags: ["DDL", "ALTER TABLE", "ADD COLUMN"],
    hints: [
      "ALTER TABLE changes the structure of an existing table.",
      "ADD COLUMN adds a new column at the end."
    ],
    hiddenTestQuery: "PRAGMA table_info(employees);",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "DROP TABLE: Remove a table",
    description: "Completely delete the `notes` table from the database.",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    referenceQuery: "DROP TABLE IF EXISTS notes;",
    tags: ["DDL", "DROP TABLE"],
    hints: [
      "Use `DROP TABLE tablename` to irrevocably delete a table.",
      "`IF EXISTS` prevents an error if the table does not exist."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='notes';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE: Bank transaction table",
    description: "Create a table `salary_payments` with: id (INTEGER PRIMARY KEY), employee_id (INTEGER NOT NULL REFERENCES employees(id)), amount (REAL NOT NULL), payment_date (TEXT NOT NULL), type (TEXT DEFAULT 'Salary').",
    difficulty: "intermediate",
    category: "DDL",
    datasetId: bankingDataset.id,
    referenceQuery: "CREATE TABLE salary_payments (id INTEGER PRIMARY KEY, employee_id INTEGER NOT NULL REFERENCES employees(id), amount REAL NOT NULL, payment_date TEXT NOT NULL, type TEXT DEFAULT 'Salary');",
    tags: ["DDL", "CREATE TABLE", "FOREIGN KEY", "NOT NULL", "DEFAULT"],
    hints: [
      "Combine FOREIGN KEY and NOT NULL in a column definition.",
      "DEFAULT sets the default value 'Salary' for the type column."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='salary_payments';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE with composite primary key",
    description: "Create a table `movie_actors` with: movie_id (INTEGER NOT NULL), actor_id (INTEGER NOT NULL), role (TEXT), PRIMARY KEY (movie_id, actor_id).",
    difficulty: "intermediate",
    category: "DDL",
    datasetId: streamingDataset.id,
    referenceQuery: "CREATE TABLE movie_actors (movie_id INTEGER NOT NULL, actor_id INTEGER NOT NULL, role TEXT, PRIMARY KEY (movie_id, actor_id));",
    tags: ["DDL", "CREATE TABLE", "Composite Primary Key"],
    hints: [
      "A composite primary key is declared at the end of the column definitions with `PRIMARY KEY (col1, col2)`.",
      "Each column in the primary key must be NOT NULL."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='movie_actors';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "ALTER TABLE: Add NOT NULL column",
    description: "Add a column `urgency` of type INTEGER with the default value 1 and NOT NULL to the `tickets` table.",
    difficulty: "intermediate",
    category: "DDL",
    datasetId: ticketsDataset.id,
    referenceQuery: "ALTER TABLE tickets ADD COLUMN urgency INTEGER NOT NULL DEFAULT 1;",
    tags: ["DDL", "ALTER TABLE", "ADD COLUMN", "NOT NULL", "DEFAULT"],
    hints: [
      "With NOT NULL, you must specify a DEFAULT value so existing rows can be filled.",
      "Use `ADD COLUMN column type NOT NULL DEFAULT value`."
    ],
    hiddenTestQuery: "PRAGMA table_info(tickets);",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE: Workout ratings",
    description: "Create a table `workout_ratings` with: id (INTEGER PRIMARY KEY), user_id (INTEGER NOT NULL), workout_id (INTEGER NOT NULL), stars (INTEGER NOT NULL CHECK(stars BETWEEN 1 AND 5)), comment (TEXT), rated_at (TEXT DEFAULT CURRENT_TIMESTAMP).",
    difficulty: "intermediate",
    category: "DDL",
    datasetId: fitnessDataset.id,
    referenceQuery: "CREATE TABLE workout_ratings (id INTEGER PRIMARY KEY, user_id INTEGER NOT NULL, workout_id INTEGER NOT NULL, stars INTEGER NOT NULL CHECK(stars BETWEEN 1 AND 5), comment TEXT, rated_at TEXT DEFAULT CURRENT_TIMESTAMP);",
    tags: ["DDL", "CREATE TABLE", "CHECK", "DEFAULT"],
    hints: [
      "CHECK(condition) validates values on insert – here: stars must be between 1 and 5.",
      "CURRENT_TIMESTAMP automatically sets the current timestamp."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='workout_ratings';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "DROP TABLE IF EXISTS: Safe deletion",
    description: "Remove the `temp_import` table from the database — but only if it actually exists, without an error if it is missing.",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    referenceQuery: "DROP TABLE IF EXISTS temp_import;",
    tags: ["DDL", "DROP TABLE", "IF EXISTS"],
    hints: [
      "`IF EXISTS` prevents an error if the table does not exist.",
      "Without IF EXISTS, an error would occur for a non-existent table."
    ],
    hiddenTestQuery: "SELECT COUNT(*) AS cnt FROM sqlite_master WHERE type='table' AND name='temp_import';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("ddl", {
    title: "CREATE TABLE: Event table",
    description: "Create a table `events_calendar` with: id (INTEGER PRIMARY KEY AUTOINCREMENT), title (TEXT NOT NULL), description (TEXT), date (TEXT NOT NULL), max_participants (INTEGER DEFAULT 50), location (TEXT).",
    difficulty: "intermediate",
    category: "DDL",
    datasetId: streamingDataset.id,
    referenceQuery: "CREATE TABLE events_calendar (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, description TEXT, date TEXT NOT NULL, max_participants INTEGER DEFAULT 50, location TEXT);",
    tags: ["DDL", "CREATE TABLE", "AUTOINCREMENT", "DEFAULT"],
    hints: [
      "AUTOINCREMENT ensures automatically incrementing IDs.",
      "DEFAULT 50 sets 50 as the default value for max_participants."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='events_calendar';",
    hiddenTestMode: "rows",
  }),
  makeSchemaExercise("ddl", {
    title: "Schema understanding: Primary key",
    description: "Understand the role of the primary key.",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    question: "Why does every table need a primary key?",
    options: [
      { text: "To uniquely identify each row", isCorrect: true },
      { text: "To sort the table faster", isCorrect: false },
      { text: "To protect the table from deletions", isCorrect: false },
      { text: "It's just a convention, not necessary", isCorrect: false }
    ],
    tags: ["DDL", "PRIMARY KEY", "Schema Understanding"],
    hints: [
      "The primary key guarantees the uniqueness of each row.",
      "Without a primary key, duplicate rows cannot be distinguished."
    ],
  }),
  makeSchemaExercise("ddl", {
    title: "Schema understanding: Foreign key",
    description: "Understand the function of foreign keys.",
    difficulty: "junior",
    category: "DDL",
    datasetId: hrDataset.id,
    question: "Which statement about FOREIGN KEY is correct?",
    options: [
      { text: "A FOREIGN KEY references the primary key of another table and creates a relationship", isCorrect: true },
      { text: "A FOREIGN KEY is a second primary key in the same table", isCorrect: false },
      { text: "A FOREIGN KEY speeds up queries", isCorrect: false },
      { text: "A FOREIGN KEY automatically stores data in the other table", isCorrect: false }
    ],
    tags: ["DDL", "FOREIGN KEY", "Schema Understanding"],
    hints: [
      "FOREIGN KEY ensures referential integrity between tables.",
      "It always references a column (usually the primary key) in another table."
    ],
  }),
  makeSchemaExercise("ddl", {
    title: "Schema understanding: CHECK constraint",
    description: "Understand the purpose of CHECK constraints.",
    difficulty: "junior",
    category: "DDL",
    datasetId: fitnessDataset.id,
    question: "What does `CHECK(weight_kg > 0)` do in a table definition?",
    options: [
      { text: "It prevents inserting rows with weight_kg <= 0", isCorrect: true },
      { text: "It sorts the table by weight_kg", isCorrect: false },
      { text: "It automatically sets weight_kg to 1 when 0 is entered", isCorrect: false },
      { text: "It only shows rows with weight_kg > 0 on SELECT", isCorrect: false }
    ],
    tags: ["DDL", "CHECK", "Schema Understanding"],
    hints: [
      "CHECK validates data on insert or update.",
      "If the condition is not met, the action is rejected."
    ],
  }),
  makeSchemaExercise("ddl", {
    title: "Schema understanding: UNIQUE vs PRIMARY KEY",
    description: "Understand the difference between UNIQUE and PRIMARY KEY.",
    difficulty: "intermediate",
    category: "DDL",
    datasetId: bankingDataset.id,
    question: "What is the main difference between UNIQUE and PRIMARY KEY?",
    options: [
      { text: "PRIMARY KEY is implicitly NOT NULL and UNIQUE, UNIQUE allows NULL values per column", isCorrect: true },
      { text: "There is no difference", isCorrect: false },
      { text: "UNIQUE is faster than PRIMARY KEY", isCorrect: false },
      { text: "A table can have multiple PRIMARY KEYs, but only one UNIQUE", isCorrect: false }
    ],
    tags: ["DDL", "UNIQUE", "PRIMARY KEY", "Schema Understanding"],
    hints: [
      "PRIMARY KEY = UNIQUE + NOT NULL. Only one PRIMARY KEY is allowed per table.",
      "UNIQUE constraints allow NULL values and there can be multiple per table."
    ],
  }),
  makeDebugExercise("ddl", {
    title: "Debug: Wrong data type",
    description: "This CREATE TABLE statement has an error in the data type of the price column. Correct it.",
    difficulty: "junior",
    category: "DDL",
    datasetId: shopDataset.id,
    brokenQuery: "CREATE TABLE offers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, price TEXT NOT NULL, valid_until TEXT);",
    referenceQuery: "CREATE TABLE offers (id INTEGER PRIMARY KEY, name TEXT NOT NULL, price REAL NOT NULL, valid_until TEXT);",
    tags: ["DDL", "CREATE TABLE", "Data type", "Debugging"],
    hints: [
      "Prices should be stored as REAL (floating-point number), not as TEXT.",
      "TEXT would result in alphabetical instead of numerical sorting."
    ],
    hiddenTestQuery: "SELECT name FROM sqlite_master WHERE type='table' AND name='offers';",
    hiddenTestMode: "rows",
  })
);
