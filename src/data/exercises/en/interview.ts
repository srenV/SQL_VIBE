/**
 * Interview exercises (English).
 * Contains challenging SQL tasks in the style of job interviews.
 */
import { makeWriteExercise, resetCounter } from "@/data/exercises/_factory";
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

export const interviewExercisesEn: Exercise[] = [];
resetCounter();
interviewExercisesEn.push(
  makeWriteExercise("int", {
    title: "Top 3 customers by revenue",
    description: "Find the 3 customers with the highest total revenue across all orders. Output `name` and the total revenue as `revenue`.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "shop",
    referenceQuery: `SELECT c.name, SUM(o.total_amount) AS revenue FROM customers c INNER JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name ORDER BY revenue DESC LIMIT 3;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT c.name, SUM(o.total_amount) AS revenue FROM customers c INNER JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name ORDER BY revenue DESC LIMIT 3;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Products never ordered",
    description: "Show all products that do not appear in any order.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "shop",
    referenceQuery: `SELECT p.name FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id WHERE oi.product_id IS NULL;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT p.name FROM products p LEFT JOIN order_items oi ON p.id = oi.product_id WHERE oi.product_id IS NULL;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Users with more than 5 workouts",
    description: "Show all users who have completed more than 5 workouts, sorted by count descending.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "fitness",
    referenceQuery: `SELECT u.name, COUNT(w.id) AS workout_count FROM users u INNER JOIN workouts w ON u.id = w.user_id GROUP BY u.id, u.name HAVING COUNT(w.id) > 5 ORDER BY workout_count DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT u.name, COUNT(w.id) AS workout_count FROM users u INNER JOIN workouts w ON u.id = w.user_id GROUP BY u.id, u.name HAVING COUNT(w.id) > 5 ORDER BY workout_count DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Department with highest average salary",
    description: "Show the department with the highest average salary.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "hr",
    referenceQuery: `SELECT d.name, AVG(e.salary) AS average FROM departments d INNER JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name ORDER BY average DESC LIMIT 1;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT d.name, AVG(e.salary) AS average FROM departments d INNER JOIN employees e ON d.id = e.department_id GROUP BY d.id, d.name ORDER BY average DESC LIMIT 1;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Agents with open tickets",
    description: "Show all agents and how many open tickets they currently have.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "tickets",
    referenceQuery: `SELECT a.name, COUNT(t.id) AS open_tickets FROM agents a LEFT JOIN tickets t ON a.id = t.agent_id AND t.status = 'open' GROUP BY a.id, a.name ORDER BY open_tickets DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT a.name, COUNT(t.id) AS open_tickets FROM agents a LEFT JOIN tickets t ON a.id = t.agent_id AND t.status = 'open' GROUP BY a.id, a.name ORDER BY open_tickets DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Customers with negative balance",
    description: "Find customers whose total balance across all accounts is negative.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "banking",
    referenceQuery: `SELECT c.name, SUM(a.balance) AS total_balance FROM customers c INNER JOIN accounts a ON c.id = a.customer_id GROUP BY c.id, c.name HAVING SUM(a.balance) < 0;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT c.name, SUM(a.balance) AS total_balance FROM customers c INNER JOIN accounts a ON c.id = a.customer_id GROUP BY c.id, c.name HAVING SUM(a.balance) < 0;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Movies with average rating over 4",
    description: "Show all movies whose average rating is above 4 stars.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "streaming",
    referenceQuery: `SELECT m.title, AVG(r.stars) AS avg_stars FROM movies m INNER JOIN reviews r ON m.id = r.movie_id GROUP BY m.id, m.title HAVING AVG(r.stars) > 4;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT m.title, AVG(r.stars) AS avg_stars FROM movies m INNER JOIN reviews r ON m.id = r.movie_id GROUP BY m.id, m.title HAVING AVG(r.stars) > 4;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Sessions with more than 3 events",
    description: "Show all session IDs that have more than 3 events, and the count.",
    difficulty: "junior",
    category: "Interview Challenge",
    datasetId: "logs",
    referenceQuery: `SELECT session_id, COUNT(*) AS event_count FROM events GROUP BY session_id HAVING COUNT(*) > 3 ORDER BY event_count DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT session_id, COUNT(*) AS event_count FROM events GROUP BY session_id HAVING COUNT(*) > 3 ORDER BY event_count DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Monthly revenue",
    description: "Calculate the total revenue per month (based on order date).",
    difficulty: "advanced",
    category: "Interview Challenge",
    datasetId: "shop",
    referenceQuery: `SELECT strftime('%Y-%m', date) AS month, SUM(total_amount) AS revenue FROM orders GROUP BY month ORDER BY month;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT strftime('%Y-%m', date) AS month, SUM(total_amount) AS revenue FROM orders GROUP BY month ORDER BY month;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Personal record per exercise",
    description: "Find the maximum weight for each user and each exercise.",
    difficulty: "advanced",
    category: "Interview Challenge",
    datasetId: "fitness",
    referenceQuery: `SELECT u.name, ex.name AS exercise, MAX(s.weight_kg) AS max_weight FROM users u INNER JOIN workouts w ON u.id = w.user_id INNER JOIN sets s ON w.id = s.workout_id INNER JOIN exercises ex ON s.exercise_id = ex.id GROUP BY u.id, u.name, ex.id, ex.name ORDER BY u.name, max_weight DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT u.name, ex.name AS exercise, MAX(s.weight_kg) AS max_weight FROM users u INNER JOIN workouts w ON u.id = w.user_id INNER JOIN sets s ON w.id = s.workout_id INNER JOIN exercises ex ON s.exercise_id = ex.id GROUP BY u.id, u.name, ex.id, ex.name ORDER BY u.name, max_weight DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Employees without vacation in 2024",
    description: "Show all employees who did not request any vacation in 2024.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "hr",
    referenceQuery: `SELECT e.name FROM employees e WHERE e.id NOT IN (SELECT employee_id FROM vacation WHERE start_date LIKE '2024-%');`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT e.name FROM employees e WHERE e.id NOT IN (SELECT employee_id FROM vacation WHERE start_date LIKE '2024-%');`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Average processing time",
    description: "Calculate the average processing time (in hours) for completed tickets.",
    difficulty: "advanced",
    category: "Interview Challenge",
    datasetId: "tickets",
    referenceQuery: `SELECT AVG((julianday(closed_at) - julianday(created_at)) * 24) AS avg_hours FROM tickets WHERE status = 'closed';`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT AVG((julianday(closed_at) - julianday(created_at)) * 24) AS avg_hours FROM tickets WHERE status = 'closed';`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Suspected fraud",
    description: "Show all customers who have more than 2 fraud cases.",
    difficulty: "advanced",
    category: "Interview Challenge",
    datasetId: "banking",
    referenceQuery: `SELECT c.name, COUNT(fc.id) AS cases FROM customers c INNER JOIN accounts a ON c.id = a.customer_id INNER JOIN transactions t ON a.id = t.account_id INNER JOIN fraud_cases fc ON t.id = fc.transaction_id GROUP BY c.id, c.name HAVING COUNT(fc.id) > 2;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT c.name, COUNT(fc.id) AS cases FROM customers c INNER JOIN accounts a ON c.id = a.customer_id INNER JOIN transactions t ON a.id = t.account_id INNER JOIN fraud_cases fc ON t.id = fc.transaction_id GROUP BY c.id, c.name HAVING COUNT(fc.id) > 2;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Users who watched all movies",
    description: "Find users who have watched at least 5 different movies to 100% completion.",
    difficulty: "advanced",
    category: "Interview Challenge",
    datasetId: "streaming",
    referenceQuery: `SELECT u.name, COUNT(DISTINCT wh.movie_id) AS movies_watched FROM users u INNER JOIN watch_history wh ON u.id = wh.user_id WHERE wh.progress_percent = 100 GROUP BY u.id, u.name HAVING COUNT(DISTINCT wh.movie_id) >= 5;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT u.name, COUNT(DISTINCT wh.movie_id) AS movies_watched FROM users u INNER JOIN watch_history wh ON u.id = wh.user_id WHERE wh.progress_percent = 100 GROUP BY u.id, u.name HAVING COUNT(DISTINCT wh.movie_id) >= 5;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Errors per session",
    description: "Show sessions that contain at least 2 errors.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "logs",
    referenceQuery: `SELECT s.id, s.browser, COUNT(e.id) AS error_count FROM sessions s INNER JOIN events ev ON s.id = ev.session_id INNER JOIN errors e ON ev.id = e.event_id GROUP BY s.id, s.browser HAVING COUNT(e.id) >= 2;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Break the task down into small steps.",
      "Which tables do you need? Which aggregates?"
    ],
    hiddenTestQuery: `SELECT s.id, s.browser, COUNT(e.id) AS error_count FROM sessions s INNER JOIN events ev ON s.id = ev.session_id INNER JOIN errors e ON ev.id = e.event_id GROUP BY s.id, s.browser HAVING COUNT(e.id) >= 2;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Customers from Berlin",
    description: "Show all customers who live in Berlin. Output name and email.",
    difficulty: "junior",
    category: "Interview Challenge",
    datasetId: "shop",
    referenceQuery: `SELECT name, email FROM customers WHERE city = 'Berlin';`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Which table contains the customer data?",
      "Use WHERE to filter by city."
    ],
    hiddenTestQuery: `SELECT name, email FROM customers WHERE city = 'Berlin';`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Exercises for chest muscle",
    description: "Show all exercises that train the 'Chest' muscle group.",
    difficulty: "beginner",
    category: "Interview Challenge",
    datasetId: "fitness",
    referenceQuery: `SELECT name, muscle_group, category FROM exercises WHERE muscle_group = 'Chest';`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "The exercises table contains the muscle group.",
      "Filter with WHERE muscle_group = 'Chest'."
    ],
    hiddenTestQuery: `SELECT name, muscle_group, category FROM exercises WHERE muscle_group = 'Chest';`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Employees and their department",
    description: "Show the name, position, and department of each employee.",
    difficulty: "beginner",
    category: "Interview Challenge",
    datasetId: "hr",
    referenceQuery: `SELECT e.name, e.position, d.name AS department FROM employees e INNER JOIN departments d ON e.department_id = d.id;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "You need to join employees with departments.",
      "Use INNER JOIN on department_id."
    ],
    hiddenTestQuery: `SELECT e.name, e.position, d.name AS department FROM employees e INNER JOIN departments d ON e.department_id = d.id;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Tickets with high priority",
    description: "Find all tickets with priority 'high', sorted by creation date descending.",
    difficulty: "junior",
    category: "Interview Challenge",
    datasetId: "tickets",
    referenceQuery: `SELECT title, priority, status, created_at FROM tickets WHERE priority = 'high' ORDER BY created_at DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filter with WHERE on priority = 'high'.",
      "Sort with ORDER BY created_at DESC."
    ],
    hiddenTestQuery: `SELECT title, priority, status, created_at FROM tickets WHERE priority = 'high' ORDER BY created_at DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Accounts with high balance",
    description: "Show all accounts with a balance over 5000, sorted by balance descending.",
    difficulty: "junior",
    category: "Interview Challenge",
    datasetId: "banking",
    referenceQuery: `SELECT account_number, type, balance FROM accounts WHERE balance > 5000 ORDER BY balance DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filter with WHERE balance > 5000.",
      "Sort with ORDER BY balance DESC."
    ],
    hiddenTestQuery: `SELECT account_number, type, balance FROM accounts WHERE balance > 5000 ORDER BY balance DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Action movies by rating",
    description: "Show all action movies sorted by rating descending.",
    difficulty: "beginner",
    category: "Interview Challenge",
    datasetId: "streaming",
    referenceQuery: `SELECT title, year, duration_min, rating FROM movies WHERE genre = 'Action' ORDER BY rating DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filter by genre = 'Action'.",
      "Sort descending by rating."
    ],
    hiddenTestQuery: `SELECT title, year, duration_min, rating FROM movies WHERE genre = 'Action' ORDER BY rating DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Events on the home page",
    description: "Show all events that occurred on the 'home' page, sorted by timestamp.",
    difficulty: "junior",
    category: "Interview Challenge",
    datasetId: "logs",
    referenceQuery: `SELECT event_type, page, timestamp, duration_ms FROM events WHERE page = 'home' ORDER BY timestamp DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filter with WHERE page = 'home'.",
      "Use ORDER BY timestamp DESC for chronological sorting."
    ],
    hiddenTestQuery: `SELECT event_type, page, timestamp, duration_ms FROM events WHERE page = 'home' ORDER BY timestamp DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Computer Science students",
    description: "Find all students in the Computer Science major, sorted by semester.",
    difficulty: "junior",
    category: "Interview Challenge",
    datasetId: "university",
    referenceQuery: `SELECT name, email, semester FROM students WHERE major = 'Computer Science' ORDER BY semester;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filter by major = 'Computer Science'.",
      "Sort ascending by semester."
    ],
    hiddenTestQuery: `SELECT name, email, semester FROM students WHERE major = 'Computer Science' ORDER BY semester;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Electronics under 100 euros",
    description: "Show all electronics products that cost less than 100 euros.",
    difficulty: "beginner",
    category: "Interview Challenge",
    datasetId: "ecommerce",
    referenceQuery: `SELECT name, price, manufacturer FROM products WHERE category = 'Electronics' AND price < 100;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Combine two conditions with AND.",
      "Filter by category and price."
    ],
    hiddenTestQuery: `SELECT name, price, manufacturer FROM products WHERE category = 'Electronics' AND price < 100;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Doctors in Surgery",
    description: "Show all doctors who work in the 'Surgery' department.",
    difficulty: "junior",
    category: "Interview Challenge",
    datasetId: "hospital",
    referenceQuery: `SELECT d.name, d.position FROM doctors d INNER JOIN departments dep ON d.department_id = dep.id WHERE dep.name = 'Surgery';`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "You need to join doctors with departments.",
      "Then filter by the department name."
    ],
    hiddenTestQuery: `SELECT d.name, d.position FROM doctors d INNER JOIN departments dep ON d.department_id = dep.id WHERE dep.name = 'Surgery';`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Cancelled orders",
    description: "Find all cancelled orders, sorted by date descending.",
    difficulty: "junior",
    category: "Interview Challenge",
    datasetId: "shop",
    referenceQuery: `SELECT id, customer_id, date, total_amount FROM orders WHERE status = 'cancelled' ORDER BY date DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Filter with WHERE status = 'cancelled'.",
      "Sort by date descending."
    ],
    hiddenTestQuery: `SELECT id, customer_id, date, total_amount FROM orders WHERE status = 'cancelled' ORDER BY date DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Deposits over 1000 euros",
    description: "Show all deposits with an amount over 1000 euros.",
    difficulty: "beginner",
    category: "Interview Challenge",
    datasetId: "banking",
    referenceQuery: `SELECT t.id, t.account_id, t.amount, t.date FROM transactions t WHERE t.type = 'credit' AND t.amount > 1000;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Combine type and amount in the WHERE filter.",
      "Use AND to link both conditions."
    ],
    hiddenTestQuery: `SELECT t.id, t.account_id, t.amount, t.date FROM transactions t WHERE t.type = 'credit' AND t.amount > 1000;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Grade average per student",
    description: "Calculate the grade average for each student, sorted by best grade first.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "university",
    referenceQuery: `SELECT s.name, ROUND(AVG(e.grade), 2) AS average_grade FROM students s INNER JOIN enrollments e ON s.id = e.student_id GROUP BY s.id, s.name ORDER BY average_grade DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Use AVG() for the average and group by student.",
      "JOIN students with enrollments on student_id."
    ],
    hiddenTestQuery: `SELECT s.name, ROUND(AVG(e.grade), 2) AS average_grade FROM students s INNER JOIN enrollments e ON s.id = e.student_id GROUP BY s.id, s.name ORDER BY average_grade DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Revenue by product category",
    description: "Calculate the total revenue per product category (quantity * unit_price).",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "ecommerce",
    referenceQuery: `SELECT p.category, ROUND(SUM(oi.quantity * oi.unit_price), 2) AS category_revenue FROM products p INNER JOIN order_items oi ON p.id = oi.product_id GROUP BY p.category ORDER BY category_revenue DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Join products with order_items on product_id.",
      "Calculate quantity * unit_price and sum per category."
    ],
    hiddenTestQuery: `SELECT p.category, ROUND(SUM(oi.quantity * oi.unit_price), 2) AS category_revenue FROM products p INNER JOIN order_items oi ON p.id = oi.product_id GROUP BY p.category ORDER BY category_revenue DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Patients with multiple treatments",
    description: "Show all patients who had more than one treatment, sorted by count.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "hospital",
    referenceQuery: `SELECT p.name, COUNT(t.id) AS treatment_count FROM patients p INNER JOIN treatments t ON p.id = t.patient_id GROUP BY p.id, p.name HAVING COUNT(t.id) > 1 ORDER BY treatment_count DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Count the treatments per patient with COUNT().",
      "Use HAVING to filter after aggregation."
    ],
    hiddenTestQuery: `SELECT p.name, COUNT(t.id) AS treatment_count FROM patients p INNER JOIN treatments t ON p.id = t.patient_id GROUP BY p.id, p.name HAVING COUNT(t.id) > 1 ORDER BY treatment_count DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Training volume by muscle group",
    description: "Calculate the total training volume (repetitions * weight) per muscle group.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "fitness",
    referenceQuery: `SELECT ex.muscle_group, SUM(s.repetitions * s.weight_kg) AS training_volume FROM exercises ex INNER JOIN sets s ON ex.id = s.exercise_id GROUP BY ex.muscle_group ORDER BY training_volume DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Connect exercises with sets via exercise_id.",
      "Training volume = repetitions * weight_kg, summed per muscle group."
    ],
    hiddenTestQuery: `SELECT ex.muscle_group, SUM(s.repetitions * s.weight_kg) AS training_volume FROM exercises ex INNER JOIN sets s ON ex.id = s.exercise_id GROUP BY ex.muscle_group ORDER BY training_volume DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Managers and direct reports",
    description: "Show each manager and how many employees report directly to them.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "hr",
    referenceQuery: `SELECT m.name AS manager, COUNT(r.id) AS report_count FROM employees m INNER JOIN employees r ON m.id = r.manager_id GROUP BY m.id, m.name ORDER BY report_count DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "This is a self-join: join employees with itself via manager_id.",
      "The manager is the row whose id equals the report's manager_id."
    ],
    hiddenTestQuery: `SELECT m.name AS manager, COUNT(r.id) AS report_count FROM employees m INNER JOIN employees r ON m.id = r.manager_id GROUP BY m.id, m.name ORDER BY report_count DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Tickets without comments",
    description: "Find all tickets that have no comments yet.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "tickets",
    referenceQuery: `SELECT t.title, t.status, t.priority FROM tickets t LEFT JOIN comments c ON t.id = c.ticket_id WHERE c.id IS NULL;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Use LEFT JOIN to keep tickets without comments.",
      "Filter with WHERE c.id IS NULL for missing comments."
    ],
    hiddenTestQuery: `SELECT t.title, t.status, t.priority FROM tickets t LEFT JOIN comments c ON t.id = c.ticket_id WHERE c.id IS NULL;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Monthly deposit sum",
    description: "Calculate the monthly sum of all deposits, sorted by month.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "banking",
    referenceQuery: `SELECT strftime('%Y-%m', date) AS month, SUM(amount) AS deposit_sum FROM transactions WHERE type = 'credit' GROUP BY month ORDER BY month;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Use strftime to truncate the date to year-month.",
      "Group by the formatted month and sum the amount."
    ],
    hiddenTestQuery: `SELECT strftime('%Y-%m', date) AS month, SUM(amount) AS deposit_sum FROM transactions WHERE type = 'credit' GROUP BY month ORDER BY month;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Average rating by genre",
    description: "Calculate the average star rating per movie genre.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "streaming",
    referenceQuery: `SELECT m.genre, ROUND(AVG(r.stars), 2) AS avg_rating, COUNT(r.id) AS review_count FROM movies m INNER JOIN reviews r ON m.id = r.movie_id GROUP BY m.genre ORDER BY avg_rating DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Join movies with reviews on movie_id.",
      "Group by genre and calculate AVG(stars)."
    ],
    hiddenTestQuery: `SELECT m.genre, ROUND(AVG(r.stars), 2) AS avg_rating, COUNT(r.id) AS review_count FROM movies m INNER JOIN reviews r ON m.id = r.movie_id GROUP BY m.genre ORDER BY avg_rating DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Courses with few enrollments",
    description: "Show all courses that have fewer than 3 enrollments, including courses with no enrollments.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "university",
    referenceQuery: `SELECT c.name, c.max_participants, COUNT(e.id) AS current_participants FROM courses c LEFT JOIN enrollments e ON c.id = e.course_id GROUP BY c.id, c.name, c.max_participants HAVING COUNT(e.id) < 3;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Use LEFT JOIN to also capture courses without enrollments.",
      "HAVING filters after aggregation, not WHERE."
    ],
    hiddenTestQuery: `SELECT c.name, c.max_participants, COUNT(e.id) AS current_participants FROM courses c LEFT JOIN enrollments e ON c.id = e.course_id GROUP BY c.id, c.name, c.max_participants HAVING COUNT(e.id) < 3;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Premium customers and their revenue",
    description: "Show all premium customers with their order count and total revenue, sorted by revenue.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "ecommerce",
    referenceQuery: `SELECT c.name, COUNT(o.id) AS order_count, SUM(o.total_amount) AS total_revenue FROM customers c INNER JOIN orders o ON c.id = o.customer_id WHERE c.is_premium = 1 GROUP BY c.id, c.name ORDER BY total_revenue DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "First filter to premium customers with WHERE is_premium = 1.",
      "Then group by customer and aggregate order count and revenue."
    ],
    hiddenTestQuery: `SELECT c.name, COUNT(o.id) AS order_count, SUM(o.total_amount) AS total_revenue FROM customers c INNER JOIN orders o ON c.id = o.customer_id WHERE c.is_premium = 1 GROUP BY c.id, c.name ORDER BY total_revenue DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Browser usage statistics",
    description: "Show how many sessions occurred per browser, sorted by frequency.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "logs",
    referenceQuery: `SELECT browser, COUNT(*) AS session_count FROM sessions GROUP BY browser ORDER BY session_count DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Group by the browser column.",
      "Count with COUNT(*) the sessions per group."
    ],
    hiddenTestQuery: `SELECT browser, COUNT(*) AS session_count FROM sessions GROUP BY browser ORDER BY session_count DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Treatment costs per department",
    description: "Calculate the total costs and number of treatments per department.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "hospital",
    referenceQuery: `SELECT dep.name, ROUND(SUM(t.cost), 2) AS total_costs, COUNT(t.id) AS treatment_count FROM departments dep INNER JOIN doctors d ON dep.id = d.department_id INNER JOIN treatments t ON d.id = t.doctor_id GROUP BY dep.id, dep.name ORDER BY total_costs DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "You need to join three tables: departments, doctors, treatments.",
      "Sum costs and count treatments per department."
    ],
    hiddenTestQuery: `SELECT dep.name, ROUND(SUM(t.cost), 2) AS total_costs, COUNT(t.id) AS treatment_count FROM departments dep INNER JOIN doctors d ON dep.id = d.department_id INNER JOIN treatments t ON d.id = t.doctor_id GROUP BY dep.id, dep.name ORDER BY total_costs DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Customers with at least 3 orders",
    description: "Find all customers who have placed 3 or more orders, sorted by count.",
    difficulty: "intermediate",
    category: "Interview Challenge",
    datasetId: "shop",
    referenceQuery: `SELECT c.name, COUNT(o.id) AS order_count FROM customers c INNER JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name HAVING COUNT(o.id) >= 3 ORDER BY order_count DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Group by customer and count the orders.",
      "Use HAVING to filter after aggregation."
    ],
    hiddenTestQuery: `SELECT c.name, COUNT(o.id) AS order_count FROM customers c INNER JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name HAVING COUNT(o.id) >= 3 ORDER BY order_count DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Salary rank per department",
    description: "Show each employee with salary and their rank within their department, descending by salary.",
    difficulty: "advanced",
    category: "Interview Challenge",
    datasetId: "hr",
    referenceQuery: `SELECT e.name, d.name AS department, e.salary, RANK() OVER (PARTITION BY d.name ORDER BY e.salary DESC) AS salary_rank FROM employees e INNER JOIN departments d ON e.department_id = d.id;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Use RANK() OVER (PARTITION BY ... ORDER BY ...) as a window function.",
      "PARTITION BY divides the data into groups, ORDER BY determines the order within."
    ],
    hiddenTestQuery: `SELECT e.name, d.name AS department, e.salary, RANK() OVER (PARTITION BY d.name ORDER BY e.salary DESC) AS salary_rank FROM employees e INNER JOIN departments d ON e.department_id = d.id;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Running transaction sum",
    description: "Calculate the running sum of amounts per account, sorted by date.",
    difficulty: "advanced",
    category: "Interview Challenge",
    datasetId: "banking",
    referenceQuery: `SELECT t.id, t.account_id, t.amount, t.type, t.date, SUM(t.amount) OVER (PARTITION BY t.account_id ORDER BY t.date, t.id) AS running_sum FROM transactions t ORDER BY t.account_id, t.date;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "SUM() OVER (PARTITION BY ... ORDER BY ...) calculates a running sum.",
      "Partition by account_id and sort by date."
    ],
    hiddenTestQuery: `SELECT t.id, t.account_id, t.amount, t.type, t.date, SUM(t.amount) OVER (PARTITION BY t.account_id ORDER BY t.date, t.id) AS running_sum FROM transactions t ORDER BY t.account_id, t.date;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Top 3 reviews per user",
    description: "Show the 3 best reviews of each user, sorted by stars.",
    difficulty: "advanced",
    category: "Interview Challenge",
    datasetId: "streaming",
    referenceQuery: `SELECT user_name, movie_id, stars FROM (SELECT u.name AS user_name, r.movie_id, r.stars, ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY r.stars DESC) AS rank FROM users u INNER JOIN reviews r ON u.id = r.user_id) sub WHERE rank <= 3;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Use ROW_NUMBER() in a subquery to number the reviews.",
      "Filter the outer query to rank <= 3."
    ],
    hiddenTestQuery: `SELECT user_name, movie_id, stars FROM (SELECT u.name AS user_name, r.movie_id, r.stars, ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY r.stars DESC) AS rank FROM users u INNER JOIN reviews r ON u.id = r.user_id) sub WHERE rank <= 3;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Moving average of calories",
    description: "Calculate the 3-value moving average of calories burned per user.",
    difficulty: "advanced",
    category: "Interview Challenge",
    datasetId: "fitness",
    referenceQuery: `SELECT u.name, w.date, w.calories_burned, ROUND(AVG(w.calories_burned) OVER (PARTITION BY u.id ORDER BY w.date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS moving_average FROM users u INNER JOIN workouts w ON u.id = w.user_id ORDER BY u.name, w.date;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "AVG() OVER with ROWS BETWEEN defines a moving window.",
      "ROWS BETWEEN 2 PRECEDING AND CURRENT ROW takes the last 3 values."
    ],
    hiddenTestQuery: `SELECT u.name, w.date, w.calories_burned, ROUND(AVG(w.calories_burned) OVER (PARTITION BY u.id ORDER BY w.date ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 1) AS moving_average FROM users u INNER JOIN workouts w ON u.id = w.user_id ORDER BY u.name, w.date;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Completion rate per agent",
    description: "Calculate the percentage of completed tickets for each agent.",
    difficulty: "advanced",
    category: "Interview Challenge",
    datasetId: "tickets",
    referenceQuery: `WITH agent_stats AS (SELECT agent_id, COUNT(*) AS total, SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS completed FROM tickets GROUP BY agent_id) SELECT a.name, ags.total, ags.completed, ROUND(ags.completed * 100.0 / ags.total, 1) AS completion_rate FROM agents a INNER JOIN agent_stats ags ON a.id = ags.agent_id ORDER BY completion_rate DESC;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "Use a CTE (WITH clause) to pre-calculate ticket statistics per agent.",
      "CASE WHEN counts completed tickets, then divide by the total."
    ],
    hiddenTestQuery: `WITH agent_stats AS (SELECT agent_id, COUNT(*) AS total, SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) AS completed FROM tickets GROUP BY agent_id) SELECT a.name, ags.total, ags.completed, ROUND(ags.completed * 100.0 / ags.total, 1) AS completion_rate FROM agents a INNER JOIN agent_stats ags ON a.id = ags.agent_id ORDER BY completion_rate DESC;`,
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("int", {
    title: "Student ranking by grade average",
    description: "Create a ranking of all students by their grade average using RANK().",
    difficulty: "advanced",
    category: "Interview Challenge",
    datasetId: "university",
    referenceQuery: `WITH grade_avg AS (SELECT s.id, s.name, AVG(e.grade) AS average FROM students s INNER JOIN enrollments e ON s.id = e.student_id GROUP BY s.id, s.name) SELECT name, ROUND(average, 2) AS average_grade, RANK() OVER (ORDER BY average DESC) AS rank FROM grade_avg;`,
    expectedResultText: "",
    tags: ["Interview", "Challenge", "JOIN", "Aggregation"],
    hints: [
      "First calculate the average per student in a CTE.",
      "Use RANK() OVER (ORDER BY ...) in the select of the CTE results."
    ],
    hiddenTestQuery: `WITH grade_avg AS (SELECT s.id, s.name, AVG(e.grade) AS average FROM students s INNER JOIN enrollments e ON s.id = e.student_id GROUP BY s.id, s.name) SELECT name, ROUND(average, 2) AS average_grade, RANK() OVER (ORDER BY average DESC) AS rank FROM grade_avg;`,
    hiddenTestMode: "rows",
  })
);
