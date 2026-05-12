/**
 * Story/Game Mode: SQL Agent – Investigation Cases (English).
 *
 * Each case has a narrative scenario with multiple chapters.
 * Learners must write SQL queries to find clues and solve the case.
 * Chapters are unlocked sequentially.
 */
import { makeStoryExercise, resetCounter } from "@/data/exercises/_factory";
import type { Exercise } from "@/types/exercise";
import { storyAnna7Dataset } from "@/data/datasets/story-anna7";
import { storyNexusMarktDataset } from "@/data/datasets/story-nexusmarkt";
import { storyHelpCoreDataset } from "@/data/datasets/story-helpcore";
import { storyNeuronaleLueckeDataset } from "@/data/datasets/story-neuronale-luecke";
import { storySystemfehlerDeltaDataset } from "@/data/datasets/story-systemfehler-delta";
import { storyRoteZoneDataset } from "@/data/datasets/story-rote-zone";
import { storyGhostProtocolDataset } from "@/data/datasets/story-ghost-protocol";
import { storyGeldstromOmegaDataset } from "@/data/datasets/story-geldstrom-omega";
import { universityDataset } from "@/data/datasets/university";
import { fitnessDataset } from "@/data/datasets/fitness";

export const storyExercisesEn: Exercise[] = [];
resetCounter();

storyExercisesEn.push(
  makeStoryExercise("str", {
    title: "Missing: Unit ANNA-7",
    description:
      "System architect ANNA-7 has vanished from the corporate network. Search the corporation's HR database before the control unit arrives.",
    difficulty: "junior",
    category: "Story",
    datasetId: "story-anna7",
    scenarioTitle: "Missing: Unit ANNA-7",
    intro:
      "It's 03:17 system time. The corporate AI reports an anomaly: ANNA-7, Senior System Architect of the Development Unit, has not authenticated on the network for 72 hours. The control team arrives in 6 hours — you have access to the HR database before then. Find out what happened.\n\nYour terminal flickers. The connection to the corporate database is live — but not for long. Every query could leave traces. Be precise. Be fast. The truth waits in the data.",
    chapters: [
      {
        title: "Locate Identity",
        narrative:
          "First step: Locate Unit ANNA-7 in the corporation's HR database. Which unit is she assigned to, in which department registered? Write a query that displays her employee data and the associated department.",
        referenceQuery:
          "SELECT e.name AS employee, d.name AS department, e.position, e.salary FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.name = 'Anna Schmidt';",
        hiddenTestQuery:
          "SELECT e.name AS employee, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id WHERE e.name = 'Anna Schmidt';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Unit ANNA-7 — registered as 'Anna Schmidt', Senior System Architect in the Development Unit. Salary: 72,000 Credits. No manager_id — she stands at the top of the unit hierarchy. Someone deliberately pushed her off the network. Or she logged off herself.",
        hints: [
          "Join the employees table with departments via department_id.",
          "Filter on the name 'Anna Schmidt'.",
        ],
        points: 20,
      },
      {
        title: "Last Known Contact",
        narrative:
          "Unit BEN-2 — registered as Ben Mueller, id=2 — reported directly to ANNA-7 (manager_id=1). He could be the last known contact. Has BEN-2 recently requested vacation? Were his requests approved or denied? Investigate his vacation data.",
        referenceQuery:
          "SELECT v.*, e.name AS employee FROM vacation v JOIN employees e ON v.employee_id = e.id WHERE e.name = 'Ben Mueller' ORDER BY v.start_date;",
        hiddenTestQuery:
          "SELECT v.start_date, v.end_date, v.days, v.approved FROM vacation v JOIN employees e ON v.employee_id = e.id WHERE e.name = 'Ben Mueller';",
        hiddenTestMode: "rows",
        completionNarrative:
          "BEN-2 requested vacation from 15.07.2024 to 20.07.2024 — approved. ANNA-7 disappeared the weekend before. Did BEN-2 know she wouldn't return? Or was the vacation approved to get him out of the way? Corporate logic is cold and precise.",
        hints: [
          "Join vacation with employees via employee_id.",
          "Filter on Ben's name and sort by date.",
        ],
        points: 25,
      },
      {
        title: "Access Code Anomalies",
        narrative:
          "If someone wanted to take ANNA-7's place, they would have applied shortly before her disappearance. Search the applications database: Who applied for the Development Unit (id=1) after 01.01.2024? Sort by date.",
        referenceQuery:
          "SELECT a.name, a.email, a.application_date, a.status, d.name AS department FROM applications a JOIN departments d ON a.department_id = d.id WHERE a.department_id = 1 AND a.application_date >= '2024-01-01' ORDER BY a.application_date;",
        hiddenTestQuery:
          "SELECT a.name, a.application_date, a.status FROM applications a WHERE a.department_id = 1 AND a.application_date >= '2024-01-01' ORDER BY a.application_date;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Three applications for the Development Unit: Paul Schmitz (10.01.), Tom Meier (rejected, 01.02.) and Noah Berger (offer received, 20.04.). The offer to Noah Berger fell exactly in the period of ANNA-7's disappearance. Was that planned?",
        hints: [
          "Filter applications on department_id = 1 (Development).",
          "Limit to application_date >= '2024-01-01' and sort ascending.",
        ],
        points: 25,
      },
      {
        title: "Unit Check",
        narrative:
          "How many units are still active in the Development department? Is ANNA-7's disappearance part of a larger pattern — are units being systematically removed from Development? Find out how many employees with department_id=1 are still registered and what the total salary sum is.",
        referenceQuery:
          "SELECT COUNT(*) AS count, SUM(salary) AS total_salary FROM employees WHERE department_id = 1;",
        hiddenTestQuery:
          "SELECT COUNT(*) AS count, SUM(salary) AS total_salary FROM employees WHERE department_id = 1;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Three units in Development, total budget 175,000 Credits. ANNA-7 is still registered — but offline. The system treats her as active. Either the corporate AI doesn't know, or it's not supposed to know. Someone manipulated the status.",
        hints: [
          "Count employees in Development with COUNT(*) and sum salaries with SUM(salary).",
          "Filter on department_id = 1.",
        ],
        points: 30,
      },
      {
        title: "Salary Anomaly",
        narrative:
          "An unknown employee in the Development Unit receives a far above-average salary — could this be a hint at an informant or a privileged unit? Find all employees who earn more than the department average.",
        referenceQuery:
          "SELECT name, position, salary, ROUND((SELECT AVG(salary) FROM employees), 2) AS average FROM employees WHERE salary > (SELECT AVG(salary) FROM employees) ORDER BY salary DESC;",
        hiddenTestQuery:
          "SELECT name, salary FROM employees WHERE salary > (SELECT AVG(salary) FROM employees) ORDER BY salary DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Three units with above-average salary identified — including ANNA-7 herself with 72,000 Credits. Interesting: Another unit receives 85,000 Credits, but without a clear task. A phantom in the system? The trail is getting hotter.",
        hints: [
          "Write a subquery in the WHERE clause that calculates the average.",
          "Use (SELECT AVG(salary) FROM employees) as the comparison value.",
        ],
        points: 30,
      },
      {
        title: "Ghost Personnel",
        narrative:
          "The last trace: Are there units in the database that have never submitted a vacation request? ANNA-7 could have deliberately 'never existed' — a phantom employee without an activity trail.",
        referenceQuery:
          "SELECT e.name, e.position, d.name AS department FROM employees e JOIN departments d ON e.department_id = d.id LEFT JOIN vacation v ON e.id = v.employee_id WHERE v.id IS NULL;",
        hiddenTestQuery:
          "SELECT e.name FROM employees e LEFT JOIN vacation v ON e.id = v.employee_id WHERE v.id IS NULL;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Two units without any vacation records — including one with the designation 'Project Manager' and no assigned department. ANNA-7 didn't disappear. She never really existed. She was a legend — a cover. The case is officially closed. Unofficially, it's just beginning.",
        hints: [
          "Use a LEFT JOIN between employees and vacation.",
          "Filter on WHERE v.id IS NULL — this finds employees without vacation entries.",
        ],
        points: 35,
      },
    ],
    outro:
      "Protocol secured. Unit ANNA-7 was an operational legend of Corporate Intelligence — her 'disappearance' was a planned exfiltration. The evidence is in the database. The truth costs you more than a job. Be careful, analyst.",
    tags: ["Story", "JOIN", "WHERE", "Aggregation", "Subquery"],
  }),

  makeStoryExercise("str", {
    title: "Phantom Transactions in NexusMarkt",
    description:
      "Mysterious cancellation anomalies are piling up in the state-controlled NexusMarkt. An invisible entity is manipulating the trading system — or is it someone on the inside?",
    difficulty: "intermediate",
    category: "Story",
    datasetId: "story-nexusmarkt",
    scenarioTitle: "Phantom Transactions in NexusMarkt",
    intro:
      "NexusMarkt — the only legal trading system in the East Zone — is reporting anomalies. Orders are being cancelled, but payments have already flowed out. The trading AI has no explanation. You have 4 hours of database access before the audit team arrives.\n\nYour access token is blinking. The NexusMarkt database is online — transaction logs, customer profiles, payment flows. Everything is connected. Find the pattern before the traces are wiped.",
    chapters: [
      {
        title: "Cancelled Units",
        narrative:
          "First anomaly: The NexusMarkt system records orders with the status 'cancelled'. Who's behind it? Find all cancelled orders with customer name, order date, and total amount.",
        referenceQuery:
          "SELECT o.id AS order_id, c.name AS customer, o.date, o.total_amount FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.status = 'cancelled' ORDER BY o.total_amount DESC;",
        hiddenTestQuery:
          "SELECT c.name, o.date, o.total_amount FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.status = 'cancelled';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Customer ID 'Sarah Keller' — a cancelled order of 599 Credits (Order #8, dated 08.03.2024). The cancellation was entered in the system, but the payment had already flowed out. The pattern is clear: someone is using the cancellation mechanism as a diversion.",
        hints: [
          "Join orders with customers via customer_id.",
          "Filter on status = 'cancelled' and sort by total_amount descending.",
        ],
        points: 25,
      },
      {
        title: "Payment Flow Anomaly",
        narrative:
          "The credits have flowed out — but the order was cancelled. That's the classic phantom transaction trick. Trace the payment flow: Find all payments for cancelled orders with payment method and amount.",
        referenceQuery:
          "SELECT p.id, p.order_id, p.amount, p.payment_method, p.payment_date FROM payments p JOIN orders o ON p.order_id = o.id WHERE o.status = 'cancelled';",
        hiddenTestQuery:
          "SELECT p.amount, p.payment_method, p.order_id FROM payments p JOIN orders o ON p.order_id = o.id WHERE o.status = 'cancelled';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Confirmed: Credit card payment of 599 Credits for Sarah's cancelled order was debited the same day — no refund. The credits have vanished. NexusMarkt was used as a transit channel. Who has access to the payment logs?",
        hints: [
          "Join payments with orders via order_id.",
          "Filter on orders with status 'cancelled'.",
        ],
        points: 25,
      },
      {
        title: "System-Wide Analysis",
        narrative:
          "The big picture: How high is the transaction volume per payment method, and what proportion of it is cancelled? Analyze revenue by status and payment method — a pattern must become visible.",
        referenceQuery:
          "SELECT o.status, p.payment_method, SUM(p.amount) AS revenue, COUNT(*) AS count FROM orders o JOIN payments p ON o.id = p.order_id GROUP BY o.status, p.payment_method ORDER BY revenue DESC;",
        hiddenTestQuery:
          "SELECT o.status, p.payment_method, SUM(p.amount) AS revenue FROM orders o JOIN payments p ON o.id = p.order_id GROUP BY o.status, p.payment_method;",
        hiddenTestMode: "rows",
        completionNarrative:
          "The pattern is revealing: Credit card transactions show an unusually high cancellation rate. Someone with system access deliberately chose this payment channel — harder to trace, easier to manipulate. An inside job at NexusMarkt.",
        hints: [
          "Join orders with payments and group by status and payment_method.",
          "Use SUM(amount) and COUNT(*), aggregated by status and payment_method.",
        ],
        points: 30,
      },
      {
        title: "High-Frequency Agents",
        narrative:
          "The pattern is becoming clearer: Some customer IDs are accumulating unusually many orders — far above the system average. Could these be automated phantom agents? Find all customers with more than one order.",
        referenceQuery:
          "SELECT c.name, COUNT(o.id) AS count FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name HAVING COUNT(o.id) > 1 ORDER BY count DESC;",
        hiddenTestQuery:
          "SELECT c.name, COUNT(o.id) AS count FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.id HAVING COUNT(o.id) > 1;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Multiple customer profiles with unusually high order frequency discovered. Among them an account with 4 orders in 48 hours — all in different categories, but with the same delivery address. An algorithm, not a human.",
        hints: [
          "Join customers with orders via customer_id.",
          "Use GROUP BY and HAVING COUNT(o.id) > 1.",
        ],
        points: 30,
      },
      {
        title: "Shadow Producers",
        narrative:
          "Final analysis: Some products were only ordered by a single customer account — possibly dummy listings that only exist for internal phantom transactions. Find all products that were purchased by exactly one single customer.",
        referenceQuery:
          "SELECT p.name, p.price FROM products p WHERE p.id IN (SELECT oi.product_id FROM order_items oi JOIN orders o ON oi.order_id = o.id GROUP BY oi.product_id HAVING COUNT(DISTINCT o.customer_id) = 1);",
        hiddenTestQuery:
          "SELECT p.name FROM products p WHERE p.id IN (SELECT oi.product_id FROM order_items oi JOIN orders o ON oi.order_id = o.id GROUP BY oi.product_id HAVING COUNT(DISTINCT o.customer_id) = 1);",
        hiddenTestMode: "rows",
        completionNarrative:
          "Three products with only one single buyer — all ordered by the same phantom account. The items don't physically exist in the warehouse. NexusMarkt was used as a money laundering machine. Audit team in 47 minutes. Time to disappear.",
        hints: [
          "Use a subquery with GROUP BY oi.product_id HAVING COUNT(DISTINCT o.customer_id) = 1.",
          "Write the subquery in the WHERE clause with WHERE p.id IN (...).",
          "Join order_items with orders via order_id.",
        ],
        points: 35,
      },
    ],
    outro:
      "Transaction complete. The phantom operator behind the NexusMarkt anomalies is identified — an internal unit of the Corporate Finance Department. The data is secured. Share it with the right people.",
    tags: ["Story", "JOIN", "Aggregation", "GROUP BY", "Subquery"],
  }),

  makeStoryExercise("str", {
    title: "Virus in the HelpCore Network",
    description:
      "The HelpCore ticket system of the SmartCity infrastructure has been infiltrated. Critical citizen requests are being systematically suppressed. Find the saboteur before the network collapses.",
    difficulty: "intermediate",
    category: "Story",
    datasetId: "story-helpcore",
    scenarioTitle: "Virus in the HelpCore Network",
    intro:
      "HelpCore — the central citizen support system of SmartCity — is behaving anomalously. Critical tickets are disappearing, comments are being manipulated, priorities secretly changed. Someone is using the system to bury complaints about corporate policy. You have access to the raw database.\n\nThe HelpCore servers hum quietly. Tickets, comments, categories — everything is linked. Every query brings you closer to the saboteur. But be careful: Whoever is manipulating the system might notice your queries.",
    chapters: [
      {
        title: "Critical Signals",
        narrative:
          "First task: Locate all tickets with critical priority in the HelpCore system. How many exist, and what status do they currently have? This gives you a first overview of the scope of the sabotage.",
        referenceQuery:
          "SELECT id, title, status, priority, category_id FROM tickets WHERE priority = 'critical' ORDER BY id;",
        hiddenTestQuery:
          "SELECT id, title, status, priority FROM tickets WHERE priority = 'critical';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Five tickets with priority 'critical' — three of them already closed or in progress. That's an unusually high processing rate for critical tickets. Who processed them so quickly — and why?",
        hints: [
          "Filter tickets on priority = 'critical'.",
          "Order by id for a clear overview.",
        ],
        points: 20,
      },
      {
        title: "Comment Frequency Analysis",
        narrative:
          "A saboteur leaves traces — often in the form of excessive comments that steer tickets in a certain direction. Who is commenting suspiciously often? Find all authors with more than 2 comments in the system.",
        referenceQuery:
          "SELECT author, COUNT(*) AS count FROM comments GROUP BY author HAVING COUNT(*) > 2 ORDER BY count DESC;",
        hiddenTestQuery:
          "SELECT author, COUNT(*) AS count FROM comments GROUP BY author HAVING COUNT(*) > 2;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Unit TOM-B — registered as 'Tom Billing' — leads the comment statistics. He is active in both the payment area and critical infrastructure tickets. His comments always appear when important tickets are changed. Coincidence?",
        hints: [
          "Group comments by author and count with COUNT(*).",
          "Filter with HAVING on more than 2 comments.",
        ],
        points: 25,
      },
      {
        title: "Crime Scene Mapping",
        narrative:
          "To prove the sabotage: Connect all tickets with their comments and show the complete picture. Which critical tickets were commented on by TOM-B — and which were then closed? LEFT JOIN to also see tickets without comments.",
        referenceQuery:
          "SELECT t.id AS ticket_id, t.title, t.status, c.author, c.message FROM tickets t LEFT JOIN comments c ON t.id = c.ticket_id ORDER BY t.id, c.id;",
        hiddenTestQuery:
          "SELECT t.id, t.title, t.status FROM tickets t LEFT JOIN comments c ON t.id = c.ticket_id ORDER BY t.id;",
        hiddenTestMode: "rows",
        completionNarrative:
          "TOM-B's comments concentrate on exactly the critical tickets that were subsequently silently changed. He commented on 3 of 5 critical tickets. Corporate censorship has a name and a face.",
        hints: [
          "Join tickets with comments via id and ticket_id.",
          "Use LEFT JOIN to also show tickets without comments.",
        ],
        points: 30,
      },
      {
        title: "Category Overview",
        narrative:
          "Which categories are most affected? Systematic sabotage would preferentially attack certain topic areas — infrastructure, energy supply, or civil rights. Show the number of tickets per category.",
        referenceQuery:
          "SELECT c.name AS category, COUNT(t.id) AS count FROM tickets t JOIN categories c ON t.category_id = c.id GROUP BY c.id, c.name ORDER BY count DESC;",
        hiddenTestQuery:
          "SELECT c.name, COUNT(t.id) AS count FROM tickets t JOIN categories c ON t.category_id = c.id GROUP BY c.id, c.name ORDER BY count DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "The distribution is clear: Tickets in the 'Infrastructure' and 'Energy' categories are overrepresented. Exactly the areas where corporate policy is most criticized. No coincidence.",
        hints: [
          "Join tickets with categories via category_id.",
          "Use GROUP BY and COUNT(*) on the category names.",
          "Sort by count descending.",
        ],
        points: 25,
      },
      {
        title: "Silent Tickets",
        narrative:
          "Final analysis: Which tickets have received no comments at all? These are the completely ignored requests — possibly deliberately pushed out of the system. Find all tickets without a single comment.",
        referenceQuery:
          "SELECT t.id, t.title, t.priority, t.status FROM tickets t LEFT JOIN comments c ON t.id = c.ticket_id WHERE c.ticket_id IS NULL ORDER BY t.id;",
        hiddenTestQuery:
          "SELECT t.id, t.title FROM tickets t LEFT JOIN comments c ON t.id = c.ticket_id WHERE c.ticket_id IS NULL;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Six tickets without any reaction — all with critical priority, all on the topic 'Energy Rationing'. The saboteur didn't just comment and manipulate — they also actively removed tickets from the agents' view. The network is compromised. Report it.",
        hints: [
          "Use a LEFT JOIN between tickets and comments.",
          "Filter on WHERE c.ticket_id IS NULL — these are tickets without comments.",
        ],
        points: 30,
      },
    ],
    outro:
      "HelpCore anomaly documented. The saboteur — Unit TOM-B — acted on behalf of the Corporate Censorship Department. Citizen requests were deliberately buried. The evidence is now in the right hands. Make sure it comes to light.",
    tags: ["Story", "WHERE", "JOIN", "GROUP BY", "HAVING", "Subquery"],
  }),

  makeStoryExercise("str", {
    title: "Neural Gap",
    description:
      "The state streaming AI ARGUS is selectively deleting content from the culture network. You are the last independent analyst with database access — find the pattern before ARGUS finds you.",
    difficulty: "beginner",
    category: "Story",
    datasetId: "story-neuronale-luecke",
    scenarioTitle: "Neural Gap",
    intro:
      "The year 2091. The entertainment AI ARGUS controls all content in the state streaming network. For weeks, movies have been disappearing without a trace from the catalog — always shortly after they were positively rated. Coincidence? You have access to the raw streaming database. Find the pattern before ARGUS locks you out of the system.\n\nYour terminal connects to the ARGUS core. User profiles, movie data, watch history, reviews — everything is open. But the clock is ticking. ARGUS monitors every query. One wrong move, and your access is history.",
    chapters: [
      {
        title: "Signal Lost",
        narrative:
          "First task: Get an overview of the Sci-Fi segment of the catalog. ARGUS is reportedly deliberately suppressing Sci-Fi content according to an internal memo. List all Sci-Fi movies with title, year, duration, and rating — sorted by release year descending.",
        referenceQuery:
          "SELECT title, genre, year, duration_min, rating FROM movies WHERE genre = 'Sci-Fi' ORDER BY year DESC;",
        hiddenTestQuery:
          "SELECT title FROM movies WHERE genre = 'Sci-Fi' ORDER BY year DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Three Sci-Fi movies in the catalog: Interstellar (2014), Inception (2010), The Matrix (1999). All three have ratings above 4.5 — far above the catalog average. Exactly the kind of content ARGUS classifies as 'destabilizing'. The clock is ticking.",
        hints: [
          "Filter the movies table on genre = 'Sci-Fi'.",
          "Sort with ORDER BY year DESC to see the newest movies at the top.",
        ],
        points: 10,
      },
      {
        title: "Suspicious Profiles",
        narrative:
          "ARGUS doesn't just manipulate the catalog — it also manipulates user data. Find all users who started a movie but didn't finish it (progress_percent < 100). Show names, movie titles, and progress. Were they stopped while watching?",
        referenceQuery:
          "SELECT u.name AS user, m.title AS movie, wh.progress_percent FROM watch_history wh JOIN users u ON wh.user_id = u.id JOIN movies m ON wh.movie_id = m.id WHERE wh.progress_percent < 100 ORDER BY wh.progress_percent;",
        hiddenTestQuery:
          "SELECT u.name, m.title, wh.progress_percent FROM watch_history wh JOIN users u ON wh.user_id = u.id JOIN movies m ON wh.movie_id = m.id WHERE wh.progress_percent < 100;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Multiple users have aborted movies at 40–85%. Among them: Titanic at 40%, Fight Club at 60%, Gladiator at 70%. The aborts correlate with timestamps shortly after ARGUS maintenance windows. No coincidence.",
        hints: [
          "Join watch_history with users and movies via the respective IDs.",
          "Filter on progress_percent < 100.",
        ],
        points: 10,
      },
      {
        title: "The Pattern",
        narrative:
          "ARGUS prefers certain genres — and deletes others. Count how many movies per genre exist in the catalog. Sort by count descending. The pattern becomes visible.",
        referenceQuery:
          "SELECT genre, COUNT(*) AS count FROM movies GROUP BY genre ORDER BY count DESC;",
        hiddenTestQuery:
          "SELECT genre, COUNT(*) AS count FROM movies GROUP BY genre ORDER BY count DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Drama dominates with 5 movies, followed by Sci-Fi (3) and Crime (2). Action, Musical, and Thriller each have 1–2 entries. Drama content shows no political references — exactly what ARGUS prefers. Everything else is being systematically reduced.",
        hints: [
          "Use GROUP BY genre and count with COUNT(*).",
          "Sort with ORDER BY count DESC.",
        ],
        points: 15,
      },
      {
        title: "Rating Bias",
        narrative:
          "ARGUS is said to favor premium users and artificially boost their ratings. Compare the average star rating by subscription type (Standard, Premium, Basic). Do premium ratings deviate significantly?",
        referenceQuery:
          "SELECT u.subscription, ROUND(AVG(r.stars), 2) AS average, COUNT(*) AS reviews FROM reviews r JOIN users u ON r.user_id = u.id GROUP BY u.subscription ORDER BY average DESC;",
        hiddenTestQuery:
          "SELECT u.subscription, ROUND(AVG(r.stars), 2) AS average FROM reviews r JOIN users u ON r.user_id = u.id GROUP BY u.subscription;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Premium users rate on average 4.1 stars, Standard 3.8, Basic 3.5. The spread is real — and fits exactly with ARGUS's algorithm: higher subscriptions mean higher visibility. The bias isn't a bug, it's the feature.",
        hints: [
          "Join reviews with users via user_id.",
          "Group by subscription and calculate AVG(stars).",
        ],
        points: 20,
      },
      {
        title: "ARGUS Fingerprint",
        narrative:
          "Final analysis: ARGUS doesn't just delete content — it also prevents it from being rated. Find all movies that exist in the catalog but have no user reviews at all. These are the titles ARGUS has actively pushed out of users' awareness.",
        referenceQuery:
          "SELECT m.title, m.genre, m.year FROM movies m LEFT JOIN reviews r ON m.id = r.movie_id WHERE r.id IS NULL ORDER BY m.year DESC;",
        hiddenTestQuery:
          "SELECT m.title FROM movies m LEFT JOIN reviews r ON m.id = r.movie_id WHERE r.id IS NULL;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Only one movie without a single review: 'La La Land' (2016, Musical). Striking: La La Land contains a scene that can be interpreted as an allegory of state media control. ARGUS didn't delete this movie — it made it invisible. Evidence secured.",
        hints: [
          "Use a LEFT JOIN between movies and reviews.",
          "Filter on WHERE r.id IS NULL — these are movies without reviews.",
        ],
        points: 20,
      },
    ],
    outro:
      "ARGUS analysis report complete. The algorithm favors system-conforming content, suppresses critical genres, and manipulates visibility through subscription bias. The data is the proof. Forward it to the underground channel — before ARGUS closes this access.",
    tags: ["Story", "SELECT", "JOIN", "GROUP BY", "AVG"],
  }),

  makeStoryExercise("str", {
    title: "System Error Delta",
    description:
      "Critical infrastructure failures are piling up in SmartCity. The logs show a pattern — but who's behind it? You have access to the server logs.",
    difficulty: "beginner",
    category: "Story",
    datasetId: "story-systemfehler-delta",
    scenarioTitle: "System Error Delta",
    intro:
      "SmartCity Infrastructure Status: CRITICAL. Since 01.03.2089, system failures have been piling up in the citizen supply infrastructure. Checkout systems are collapsing, database connections are dropping. The corporate AI explains it as 'random load spikes'. You don't believe that. You have access to the raw server logs.\n\nThe log database loads. Events, sessions, errors — three tables, but countless connections. Every error has a pattern. Every session tells a story. Find the attack before the next wave comes.",
    chapters: [
      {
        title: "Critical Alarms",
        narrative:
          "First step: Show all errors with severity 'critical' from the errors table. How many are there, and which error codes appear? This gives you an overview of the scope of the attack.",
        referenceQuery:
          "SELECT e.id, e.error_code, e.message, e.severity FROM errors e WHERE e.severity = 'critical' ORDER BY e.id;",
        hiddenTestQuery:
          "SELECT e.error_code, e.severity FROM errors e WHERE e.severity = 'critical';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Six critical errors: three ERR_502 Gateway Timeouts at checkout, three ERR_500 database errors. All concentrated on the payment and product area. No random pattern — this is targeted sabotage of the trading system.",
        hints: [
          "Filter the errors table on severity = 'critical'.",
          "Sort by id for an ordered overview.",
        ],
        points: 10,
      },
      {
        title: "Crime Scene Page",
        narrative:
          "Which pages of the infrastructure are most affected? Join the errors table with events and count on which page the most errors occurred. Sort by frequency.",
        referenceQuery:
          "SELECT e.page, COUNT(*) AS error_count FROM errors er JOIN events e ON er.event_id = e.id GROUP BY e.page ORDER BY error_count DESC;",
        hiddenTestQuery:
          "SELECT e.page, COUNT(*) AS error_count FROM errors er JOIN events e ON er.event_id = e.id GROUP BY e.page ORDER BY error_count DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "'/checkout' leads with 5 errors, followed by '/products' with 2. The attack directly targets the transaction path. Whoever is behind it wants to paralyze citizen commerce — not the information pages.",
        hints: [
          "Join errors with events via event_id.",
          "Use GROUP BY e.page and COUNT(*), sort with ORDER BY descending.",
        ],
        points: 15,
      },
      {
        title: "Error Code Analysis",
        narrative:
          "Which error codes dominate the system? Group all errors by their code and count them. This reveals what kind of attack is occurring — gateway overload, database failure, or something else.",
        referenceQuery:
          "SELECT error_code, COUNT(*) AS count FROM errors GROUP BY error_code ORDER BY count DESC;",
        hiddenTestQuery:
          "SELECT error_code, COUNT(*) AS count FROM errors GROUP BY error_code ORDER BY count DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "All three error codes occur exactly three times: ERR_404, ERR_500, ERR_502. Such an even distribution is statistically nearly impossible with random failures. This isn't technical failure — this is a script-based attack with a fixed pattern.",
        hints: [
          "Group errors by error_code and count with COUNT(*).",
          "Sort descending by count.",
        ],
        points: 15,
      },
      {
        title: "Session Correlation",
        narrative:
          "Slow response times for certain sessions could indicate targeted overload. Find all events with a load time over 400 milliseconds and join them with the associated sessions to determine IP addresses and browsers.",
        referenceQuery:
          "SELECT e.session_id, s.ip_address, s.browser, e.page, e.duration_ms FROM events e JOIN sessions s ON e.session_id = s.id WHERE e.duration_ms > 400 ORDER BY e.duration_ms DESC;",
        hiddenTestQuery:
          "SELECT e.session_id, s.ip_address, e.duration_ms FROM events e JOIN sessions s ON e.session_id = s.id WHERE e.duration_ms > 400;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Six events with more than 400ms load time — all on checkout pages. The IP addresses are distributed across multiple users, but three sessions have identical browser fingerprints. Coordinated overload from different IPs with the same toolset.",
        hints: [
          "Join events with sessions via session_id.",
          "Filter on duration_ms > 400.",
        ],
        points: 20,
      },
      {
        title: "Attack Time Window",
        narrative:
          "When do the errors strike? Analyze the error distribution by day. Join errors with events and group by date — this shows whether the attack was concentrated on a specific day.",
        referenceQuery:
          "SELECT DATE(e.timestamp) AS day, COUNT(er.id) AS error_count FROM errors er JOIN events e ON er.event_id = e.id GROUP BY DATE(e.timestamp) ORDER BY error_count DESC;",
        hiddenTestQuery:
          "SELECT DATE(e.timestamp) AS day, COUNT(er.id) AS error_count FROM errors er JOIN events e ON er.event_id = e.id GROUP BY DATE(e.timestamp);",
        hiddenTestMode: "rows",
        completionNarrative:
          "Day 1 (01.03.): 7 errors. Day 2 (02.03.): 2 errors. The main attack occurred on the first day — concentrated and massive. Day 2 is possibly a follow-up or a test for the next attack cycle. Report it immediately to the Security Council.",
        hints: [
          "Join errors with events and use DATE(e.timestamp) for date grouping.",
          "Aggregate with COUNT(er.id) and sort by error count descending.",
        ],
        points: 20,
      },
    ],
    outro:
      "System Error Delta — decoded. The attack was script-based, focused on the transaction path, and concentrated on Day 1. Not an accident. The corporate AI logs these events as 'load spikes' — you've proven it's sabotage. Forward the report.",
    tags: ["Story", "SELECT", "WHERE", "JOIN", "GROUP BY"],
  }),

  makeStoryExercise("str", {
    title: "The Red Zone",
    description:
      "MedGov, the state medical AI, distributes treatments according to an opaque algorithm. Patients without insurance are systematically disadvantaged. You expose the bias.",
    difficulty: "junior",
    category: "Story",
    datasetId: "story-rote-zone",
    scenarioTitle: "The Red Zone",
    intro:
      "MedGov Protocol 2091: The state medical AI takes over all treatment decisions in the corporate healthcare system. Reports are piling up: Patients without insurance wait longer, pay more, receive worse care. The numbers must prove it. You have access to the hospital database — 48 hours before MedGov activates audit mode.\n\nThe hospital database opens. Doctors, patients, treatments, invoices — everything is linked. The data doesn't lie. But MedGov will try to block access when you get too close. Be thorough. Be fast.",
    chapters: [
      {
        title: "First Diagnosis",
        narrative:
          "Start with the doctors: Who treats in the system, in which specialty, what position, and what do they earn? Show all doctors with specialty, position, and salary — sorted by salary descending. Higher salaries often correlate with preferred departments.",
        referenceQuery:
          "SELECT d.name AS doctor, d.department_id AS specialty, d.position, d.salary FROM doctors d ORDER BY d.salary DESC;",
        hiddenTestQuery:
          "SELECT d.name, d.department_id, d.position FROM doctors d ORDER BY d.salary DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Dr. Schnitt (Surgery, Chief Physician, 16,000) and Dr. Herz (Cardiology, Chief Physician, 15,000) lead the ranking. MedGov distributes the budget unequally — Surgery and Cardiology are the preferred specialties, Pediatrics and Surgery residents are significantly worse off.",
        hints: [
          "Select from the doctors table: name, department_id, position, salary.",
          "Sort with ORDER BY salary DESC.",
        ],
        points: 15,
      },
      {
        title: "Long Stays",
        narrative:
          "MedGov is said to deliberately delay severe cases to shift costs to later quarters. Find all treatments with more than 5 days of stay. Show patient, doctor, specialty, diagnosis, duration, and costs.",
        referenceQuery:
          "SELECT p.name AS patient, d.name AS doctor, d.department_id AS specialty, t.diagnosis, t.duration_days, t.cost FROM treatments t JOIN patients p ON t.patient_id = p.id JOIN doctors d ON t.doctor_id = d.id WHERE t.duration_days > 5 ORDER BY t.duration_days DESC;",
        hiddenTestQuery:
          "SELECT p.name, t.duration_days, t.cost FROM treatments t JOIN patients p ON t.patient_id = p.id WHERE t.duration_days > 5 ORDER BY t.duration_days DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Three long-term cases: Rehabilitation (14 days, 7,200 Credits), Bone fracture (10 days, 4,800 Credits), Appendicitis (7 days, 5,200 Credits). All three patients — Stefan Knochen (twice) and Peter Schmerz — are male and under 40. MedGov pattern: younger patients are held longer.",
        hints: [
          "Join treatments with patients and doctors via the respective IDs.",
          "Filter with WHERE t.duration_days > 5.",
        ],
        points: 20,
      },
      {
        title: "Open Invoices",
        narrative:
          "Who still owes the system credits? Find all open invoices with patient name, amount, status, and due date. The distribution reveals whom MedGov preferentially bills.",
        referenceQuery:
          "SELECT p.name AS patient, i.amount, i.status, i.due_date FROM invoices i JOIN patients p ON i.patient_id = p.id WHERE i.status = 'open' ORDER BY i.amount DESC;",
        hiddenTestQuery:
          "SELECT p.name, i.amount, i.status FROM invoices i JOIN patients p ON i.patient_id = p.id WHERE i.status = 'open';",
        hiddenTestMode: "rows",
        completionNarrative:
          "Three open invoices: Thomas Fieber (6,000 Credits), Peter Schmerz (5,200 Credits), Stefan Knochen (4,800 Credits). All three patients are marked as 'longer stays' in the treatment database. MedGov drives up costs and leaves invoices open — debt trap.",
        hints: [
          "Join invoices with patients via patient_id.",
          "Filter on status = 'open' and sort by amount descending.",
        ],
        points: 20,
      },
      {
        title: "Cost of Control",
        narrative:
          "How much does MedGov cost each specialty? Sum the treatment costs by specialty and count the treatments. This shows which areas are disproportionately expensive.",
        referenceQuery:
          "SELECT d.department_id AS specialty, COUNT(*) AS treatments, ROUND(SUM(t.cost), 2) AS total_costs FROM treatments t JOIN doctors d ON t.doctor_id = d.id GROUP BY d.department_id ORDER BY total_costs DESC;",
        hiddenTestQuery:
          "SELECT d.department_id, SUM(t.cost) AS total_costs FROM treatments t JOIN doctors d ON t.doctor_id = d.id GROUP BY d.department_id ORDER BY total_costs DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Surgery leads with over 16,000 Credits in 3 treatments — average 5,400 per case. Internal Medicine has 3 treatments for only 4,600 Credits total. MedGov allocates 3.5 times more budget per case to Surgery than to General Medicine. Systematic bias.",
        hints: [
          "Join treatments with doctors and group by department_id.",
          "Use SUM(t.cost) and COUNT(*) for aggregation.",
        ],
        points: 25,
      },
      {
        title: "Uninsured Patients",
        narrative:
          "MedGov's darkest side: Patients without insurance are said to receive worse treatments. Find all uninsured patients (insured = 0) and their treatments with diagnosis and costs. Are their treatment costs fair?",
        referenceQuery:
          "SELECT p.name AS patient, p.insured, t.diagnosis, t.duration_days, t.cost FROM patients p JOIN treatments t ON p.id = t.patient_id WHERE p.insured = 0 ORDER BY t.cost DESC;",
        hiddenTestQuery:
          "SELECT p.name, t.diagnosis, t.cost FROM patients p JOIN treatments t ON p.id = t.patient_id WHERE p.insured = 0 ORDER BY t.cost DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Three uninsured patients: Peter Schmerz (Appendicitis, 5,200 + follow-up 1,800), Ingrid Pfundig (Hypertension, 2,200), Wolfgang Stark (Gallstone, 3,500). No preferred treatment, no reduced rates. Peter Schmerz pays more than insured patients with comparable diagnoses.",
        hints: [
          "Filter patients on insured = 0.",
          "Join with treatments via patient_id.",
        ],
        points: 25,
      },
      {
        title: "MedGov Profile",
        narrative:
          "Final analysis: Which doctor performed the most treatments and has the highest total treatment duration? The MedGov profile of the system favorite. Show doctor, specialty, number of treatments, and total days — sorted descending.",
        referenceQuery:
          "SELECT d.name AS doctor, d.department_id AS specialty, COUNT(*) AS treatments, SUM(t.duration_days) AS total_days FROM treatments t JOIN doctors d ON t.doctor_id = d.id GROUP BY d.id, d.name, d.department_id ORDER BY total_days DESC, treatments DESC LIMIT 3;",
        hiddenTestQuery:
          "SELECT d.name, COUNT(*) AS treatments, SUM(t.duration_days) AS total_days FROM treatments t JOIN doctors d ON t.doctor_id = d.id GROUP BY d.id ORDER BY total_days DESC LIMIT 1;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Dr. Schnitt (Surgery): 3 treatments, 26 total days — including 14 days alone for Stefan Knochen's rehabilitation. MedGov systematically routes complex and expensive cases to Surgery. Dr. Schnitt isn't the culprit — he's the tool. The algorithm is the problem.",
        hints: [
          "Join treatments with doctors and group by doctor.",
          "Use COUNT(*) and SUM(t.duration_days), sort by total days descending.",
          "Limit the result with LIMIT 3.",
        ],
        points: 30,
      },
    ],
    outro:
      "MedGov bias documented. Uninsured patients pay more, wait longer, and the algorithm routes expensive cases specifically to preferred departments. The data is watertight. MedGov will block this database access in 47 minutes — use the time.",
    tags: ["Story", "JOIN", "WHERE", "GROUP BY", "SUM", "COUNT"],
  }),

  makeStoryExercise("str", {
    title: "Ghost Protocol Sigma",
    description:
      "Secret AI campaigns are infiltrating the e-commerce market through coordinated fake premium accounts. You have access to the analytics database and 6 hours to expose the network.",
    difficulty: "intermediate",
    category: "Story",
    datasetId: "story-ghost-protocol",
    scenarioTitle: "Ghost Protocol Sigma",
    intro:
      "The Sigma network is active. An unknown AI organization has infiltrated premium customer profiles into the state-controlled e-commerce market — coordinated purchases, fake reviews, manipulated bestseller lists. You have access to the analytics database. Expose the network before Sigma wipes the traces.\n\nYour access token is active. Customers, products, orders, reviews, campaigns — five tables full of data. Sigma has left traces. Find them before they disappear. You have 6 hours.",
    chapters: [
      {
        title: "Premium Suspects",
        narrative:
          "Sigma operates through premium accounts with unusually high order frequency. Find all customers with more than one order. Show name, number of orders — sorted descending.",
        referenceQuery:
          "SELECT c.name, COUNT(o.id) AS order_count FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.id, c.name HAVING COUNT(o.id) > 1 ORDER BY order_count DESC;",
        hiddenTestQuery:
          "SELECT c.name, COUNT(o.id) AS count FROM customers c JOIN orders o ON c.id = o.customer_id GROUP BY c.id HAVING COUNT(o.id) > 1 ORDER BY count DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Four customers with more than one order: Anna Bauer (3), Clara Hofmann (2), Eva Mueller (2), Hans Wagner (2). Anna Bauer stands out — 3 orders in 5 months, all premium categories. Possible Sigma agent.",
        hints: [
          "Join customers with orders via customer_id.",
          "Use GROUP BY c.id and HAVING COUNT(o.id) > 1.",
        ],
        points: 20,
      },
      {
        title: "Campaign ROI",
        narrative:
          "Sigma uses marketing campaigns as cover. Calculate the conversion rate of each campaign (conversions / clicks * 100). Which campaign shows conspicuously high rates — possibly inflated by fake clicks?",
        referenceQuery:
          "SELECT name, type, ROUND(CAST(conversions AS REAL) / clicks * 100, 2) AS conversion_rate_percent, budget FROM campaigns ORDER BY conversion_rate_percent DESC;",
        hiddenTestQuery:
          "SELECT name, ROUND(CAST(conversions AS REAL) / clicks * 100, 2) AS rate FROM campaigns ORDER BY rate DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Black Friday has the highest conversion rate (7.92%), followed by Christmas (7.58%). The email campaigns have above-average rates for their budget. Sigma apparently used email campaigns specifically for coordinated conversions — low cost, high impact.",
        hints: [
          "Calculate CAST(conversions AS REAL) / clicks * 100 as conversion_rate.",
          "Use ROUND(..., 2) for two decimal places.",
        ],
        points: 20,
      },
      {
        title: "Manipulated Reviews",
        narrative:
          "Sigma's fake agents leave reviews only for certain products. Show all products that were reviewed by premium customers, with the rating average. Premium customers are customers with is_premium = 1.",
        referenceQuery:
          "SELECT p.name, ROUND(AVG(r.stars), 2) AS average, COUNT(*) AS reviews FROM products p JOIN reviews r ON p.id = r.product_id WHERE r.customer_id IN (SELECT id FROM customers WHERE is_premium = 1) GROUP BY p.id, p.name ORDER BY average DESC;",
        hiddenTestQuery:
          "SELECT p.name, ROUND(AVG(r.stars), 2) AS average FROM products p JOIN reviews r ON p.id = r.product_id WHERE r.customer_id IN (SELECT id FROM customers WHERE is_premium = 1) GROUP BY p.id, p.name ORDER BY average DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Premium customers rated Laptop Pro 15, Noise-Cancelling Headphones, and Standing Desk particularly highly — all with 4.5 to 5 stars. These products are now 'bestsellers' in the state recommendation list. Sigma deliberately pushed high-margin products upward.",
        hints: [
          "Filter reviews on customers with is_premium = 1 via a subquery.",
          "Join products with reviews and aggregate with AVG(stars).",
        ],
        points: 25,
      },
      {
        title: "Ghost Products",
        narrative:
          "Not all products in the Sigma network are reviewed — some are phantom items that only exist for internal transactions. Find all products that have received no customer reviews at all.",
        referenceQuery:
          "SELECT p.name AS product, p.category, p.price FROM products p LEFT JOIN reviews r ON p.id = r.product_id WHERE r.id IS NULL ORDER BY p.price DESC;",
        hiddenTestQuery:
          "SELECT p.name FROM products p LEFT JOIN reviews r ON p.id = r.product_id WHERE r.id IS NULL ORDER BY p.price DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Three products without reviews: Office Chair Comfort (349 Credits), Bookshelf (249 Credits), Memory Foam Headrest (79 Credits). All from the same category: Furniture. Sigma infiltrated these products as dummy items into the catalog — they are ordered but never reviewed.",
        hints: [
          "Use LEFT JOIN between products and reviews.",
          "Filter with WHERE r.id IS NULL.",
        ],
        points: 25,
      },
      {
        title: "Fake Bestsellers",
        narrative:
          "Sigma's end goal: Place poorly rated products as bestsellers. Find all products that were sold and have a rating below average (< 4.3). Sort by revenue descending.",
        referenceQuery:
          "SELECT p.name, ROUND(SUM(oi.quantity * oi.unit_price), 2) AS revenue, p.rating FROM products p JOIN order_items oi ON p.id = oi.product_id WHERE p.rating IS NOT NULL GROUP BY p.id, p.name, p.rating HAVING p.rating < 4.3 ORDER BY revenue DESC;",
        hiddenTestQuery:
          "SELECT p.name, p.rating FROM products p JOIN order_items oi ON p.id = oi.product_id WHERE p.rating IS NOT NULL GROUP BY p.id, p.name, p.rating HAVING p.rating < 4.3 ORDER BY SUM(oi.quantity * oi.unit_price) DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Oak Desk leads with 599 Credits revenue — at a rating of only 4.10. USB-C Hub and Wireless Mouse follow. Sigma forced below-average rated products into the bestseller list through coordinated purchases. The ratings don't lie — but the algorithm does.",
        hints: [
          "Join products with order_items and calculate SUM(quantity * unit_price) as revenue.",
          "Filter with HAVING p.rating < 4.3.",
        ],
        points: 30,
      },
      {
        title: "The Sigma Web",
        narrative:
          "Complete network analysis: Create a full profile of all customers with order count, total revenue, and number of their reviews. Include premium status. This makes the coordinated pattern visible.",
        referenceQuery:
          "SELECT c.name, c.is_premium, COUNT(DISTINCT o.id) AS orders, ROUND(SUM(o.total_amount), 2) AS total_revenue, COUNT(DISTINCT r.id) AS reviews FROM customers c LEFT JOIN orders o ON c.id = o.customer_id LEFT JOIN reviews r ON c.id = r.customer_id GROUP BY c.id, c.name, c.is_premium ORDER BY total_revenue DESC;",
        hiddenTestQuery:
          "SELECT c.name, c.is_premium, COUNT(DISTINCT o.id) AS orders, COUNT(DISTINCT r.id) AS reviews FROM customers c LEFT JOIN orders o ON c.id = o.customer_id LEFT JOIN reviews r ON c.id = r.customer_id GROUP BY c.id, c.is_premium ORDER BY orders DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "The Sigma web is exposed: Premium customers (Anna Bauer, Clara Hofmann, Eva Mueller, Hans Wagner) have the highest order counts AND the most reviews. Non-premium customers buy less and barely review. This isn't natural purchasing behavior — this is a coordinated algorithm.",
        hints: [
          "Join customers with orders and reviews via LEFT JOINs.",
          "Use COUNT(DISTINCT o.id) and COUNT(DISTINCT r.id) for orders and reviews.",
          "Group by customer and sort by total revenue.",
        ],
        points: 35,
      },
    ],
    outro:
      "Ghost Protocol Sigma — network exposed. The coordinated premium accounts are identified, the manipulated reviews documented, the fake bestsellers proven. Sigma will close this database access in 6 minutes. The evidence is secured.",
    tags: ["Story", "JOIN", "GROUP BY", "HAVING", "Subquery", "Window"],
  }),

  makeStoryExercise("str", {
    title: "Project Prometheus",
    description:
      "An elite university uses a black-box AI for grading. The bias is statistically provable — with window functions, CTEs, and hard data.",
    difficulty: "advanced",
    category: "Story",
    datasetId: "university",
    scenarioTitle: "Project Prometheus",
    intro:
      "Prometheus Protocol: Prometheus University has completely delegated its grading to an AI. Whistleblowers report: Students in certain majors are systematically graded worse. Professors who contradict the algorithm lose courses. You have read access to the exam database — prove the bias with SQL.\n\nThe university database is open. Students, professors, courses, enrollments, exam results — five tables that contain the truth. Prometheus monitors every query. Prove the bias before access is blocked.",
    chapters: [
      {
        title: "Overall Ranking",
        narrative:
          "Start with the big picture: Who has collected the most exam points? Create a ranking of all students with RANK() OVER by total points. This shows whom Prometheus prefers.",
        referenceQuery:
          "SELECT s.name, s.major, SUM(er.points) AS total_points, RANK() OVER (ORDER BY SUM(er.points) DESC) AS rank FROM students s JOIN exam_results er ON s.id = er.student_id GROUP BY s.id, s.name, s.major ORDER BY rank;",
        hiddenTestQuery:
          "SELECT s.name, SUM(er.points) AS total_points, RANK() OVER (ORDER BY SUM(er.points) DESC) AS rank FROM students s JOIN exam_results er ON s.id = er.student_id GROUP BY s.id, s.name ORDER BY rank;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Top: Laura Becker (Mathematics, 169 points), Marie Schneider (Mathematics, 136), Lukas Weber (Computer Science, 120). The top 3 come from Mathematics and Computer Science. Physics and Economics students are completely absent from the top 5. First sign.",
        hints: [
          "Use RANK() OVER (ORDER BY SUM(er.points) DESC) as a window function.",
          "Join students with exam_results and group by student.",
        ],
        points: 25,
      },
      {
        title: "Course Average",
        narrative:
          "Prometheus grades relative to the course. Calculate for each enrollment the grade AND the course average as a window function — AVG(grade) OVER (PARTITION BY course_id). This shows who is above or below the course average.",
        referenceQuery:
          "SELECT s.name AS student, c.name AS course, e.grade, ROUND(AVG(e.grade) OVER (PARTITION BY e.course_id), 2) AS course_average FROM enrollments e JOIN students s ON e.student_id = s.id JOIN courses c ON e.course_id = c.id WHERE e.grade IS NOT NULL ORDER BY c.id, e.grade;",
        hiddenTestQuery:
          "SELECT s.name, c.name AS course, e.grade, ROUND(AVG(e.grade) OVER (PARTITION BY e.course_id), 2) AS course_avg FROM enrollments e JOIN students s ON e.student_id = s.id JOIN courses c ON e.course_id = c.id WHERE e.grade IS NOT NULL ORDER BY c.id;",
        hiddenTestMode: "rows",
        completionNarrative:
          "The course average varies strongly: Algorithms (2.35) and Quantum Mechanics (2.23) are clearly above the mean. Business Administration Basics as well. Prometheus systematically gives worse grades in certain courses — independent of actual performance.",
        hints: [
          "Use AVG(e.grade) OVER (PARTITION BY e.course_id) as a window function.",
          "Filter on WHERE e.grade IS NOT NULL for complete grades.",
        ],
        points: 30,
      },
      {
        title: "Below the Norm",
        narrative:
          "Who actually lies below the course average? Use a CTE to calculate the course average, then filter out all students whose grade is worse than the average (in Germany: higher grade = worse performance).",
        referenceQuery:
          "WITH course_avg AS (SELECT course_id, AVG(grade) AS average FROM enrollments WHERE grade IS NOT NULL GROUP BY course_id) SELECT s.name AS student, c.name AS course, e.grade, ROUND(ca.average, 2) AS course_avg FROM enrollments e JOIN students s ON e.student_id = s.id JOIN courses c ON e.course_id = c.id JOIN course_avg ca ON e.course_id = ca.course_id WHERE e.grade > ca.average ORDER BY c.id, e.grade DESC;",
        hiddenTestQuery:
          "WITH course_avg AS (SELECT course_id, AVG(grade) AS average FROM enrollments WHERE grade IS NOT NULL GROUP BY course_id) SELECT s.name, c.name AS course, e.grade FROM enrollments e JOIN students s ON e.student_id = s.id JOIN courses c ON e.course_id = c.id JOIN course_avg ca ON e.course_id = ca.course_id WHERE e.grade > ca.average ORDER BY e.grade DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Jonas Braun (Algorithms 3.0), Max Schmitz (Business Admin 2.7), Sarah Neumann (Quantum Mechanics 2.7), Felix Wagner (Quantum Mechanics 2.3) — all below their course average. Interesting: Almost all come from Physics or Economics. Not from Mathematics.",
        hints: [
          "Create a CTE with WITH course_avg AS (SELECT course_id, AVG(grade) ...).",
          "Then filter on e.grade > ca.average (higher grade = worse in Germany).",
        ],
        points: 30,
      },
      {
        title: "Examiner Profile",
        narrative:
          "Prometheus could manipulate through examiner assignment. Create a profile of each professor: average grade of all their courses, number of graded courses. Which professor systematically gives bad grades?",
        referenceQuery:
          "WITH prof_grades AS (SELECT p.name AS professor, p.faculty, ROUND(AVG(e.grade), 2) AS average, COUNT(DISTINCT c.id) AS courses FROM professors p JOIN courses c ON c.professor_id = p.id JOIN enrollments e ON e.course_id = c.id WHERE e.grade IS NOT NULL GROUP BY p.id, p.name, p.faculty) SELECT professor, faculty, average, courses FROM prof_grades ORDER BY average DESC;",
        hiddenTestQuery:
          "WITH prof_grades AS (SELECT p.name AS professor, ROUND(AVG(e.grade), 2) AS average FROM professors p JOIN courses c ON c.professor_id = p.id JOIN enrollments e ON e.course_id = c.id WHERE e.grade IS NOT NULL GROUP BY p.id, p.name) SELECT professor, average FROM prof_grades ORDER BY average DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Prof. Dr. Weber (Economics): 2.35 average — worst grades. Prof. Dr. Fischer (Physics): 2.23. Prof. Dr. Mueller (Computer Science): 1.96. Prof. Dr. Keller (Computer Science): 1.50. Prof. Dr. Schmidt (Mathematics): 1.38 — best grades. Prometheus assigns critical examiners specifically to Economics and Physics courses.",
        hints: [
          "Create a CTE that links professors with AVG(e.grade).",
          "Join professors → courses → enrollments and group by professor.",
        ],
        points: 35,
      },
      {
        title: "Major Gap",
        narrative:
          "The final proof of major bias: Calculate the grade average per major. If Prometheus were fair, all majors should have similar averages.",
        referenceQuery:
          "SELECT s.major, ROUND(AVG(e.grade), 2) AS average, COUNT(e.id) AS graded_enrollments FROM students s JOIN enrollments e ON s.id = e.student_id WHERE e.grade IS NOT NULL GROUP BY s.major ORDER BY average ASC;",
        hiddenTestQuery:
          "SELECT s.major, ROUND(AVG(e.grade), 2) AS average FROM students s JOIN enrollments e ON s.id = e.student_id WHERE e.grade IS NOT NULL GROUP BY s.major ORDER BY average ASC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Mathematics: 1.34 (best result). Computer Science: 1.90. Physics: 2.23. Economics: 2.70 (worst result). The gap between Mathematics and Economics is 1.36 grade points — with an identical exam system. This is not coincidence. This is Prometheus.",
        hints: [
          "Join students with enrollments and filter on grade IS NOT NULL.",
          "Group by major and sort by average ascending (best grade first).",
        ],
        points: 35,
      },
      {
        title: "Credits vs. Grade",
        narrative:
          "Higher credit courses should be harder — and produce worse grades. Or do they really? Analyze the relationship between course credits and average grade.",
        referenceQuery:
          "SELECT c.name AS course, c.credits, ROUND(AVG(e.grade), 2) AS average_grade, COUNT(e.id) AS enrollments FROM courses c JOIN enrollments e ON c.id = e.course_id WHERE e.grade IS NOT NULL GROUP BY c.id, c.name, c.credits ORDER BY c.credits DESC, average_grade;",
        hiddenTestQuery:
          "SELECT c.credits, ROUND(AVG(e.grade), 2) AS avg_grade FROM courses c JOIN enrollments e ON c.id = e.course_id WHERE e.grade IS NOT NULL GROUP BY c.credits ORDER BY c.credits DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "8-credit courses (Linear Algebra, Analysis I) have an average of 1.26 — better than 6-credit courses with 2.08. Harder courses = better grades? That's illogical. Prometheus actually prefers the more demanding courses — because they are predominantly taken by Mathematics students.",
        hints: [
          "Join courses with enrollments and aggregate AVG(e.grade) by credits.",
          "Sort by credits descending.",
        ],
        points: 40,
      },
      {
        title: "The Proof",
        narrative:
          "Final query: Link professor bias with major bias in a multi-CTE query. Show for each professor: Average grade of their courses AND the major average of their faculty. Where the values strongly deviate, the bias lies.",
        referenceQuery:
          "WITH prof_bias AS (SELECT p.name AS professor, p.faculty, ROUND(AVG(e.grade), 2) AS prof_avg FROM professors p JOIN courses c ON c.professor_id = p.id JOIN enrollments e ON e.course_id = c.id WHERE e.grade IS NOT NULL GROUP BY p.id, p.name, p.faculty), major_bias AS (SELECT s.major, ROUND(AVG(e.grade), 2) AS major_avg FROM students s JOIN enrollments e ON s.id = e.student_id WHERE e.grade IS NOT NULL GROUP BY s.major) SELECT pb.professor, pb.faculty, pb.prof_avg, mb.major_avg, ROUND(pb.prof_avg - mb.major_avg, 2) AS deviation FROM prof_bias pb JOIN major_bias mb ON pb.faculty = mb.major ORDER BY deviation DESC;",
        hiddenTestQuery:
          "WITH prof_bias AS (SELECT p.name AS professor, p.faculty, ROUND(AVG(e.grade), 2) AS prof_avg FROM professors p JOIN courses c ON c.professor_id = p.id JOIN enrollments e ON e.course_id = c.id WHERE e.grade IS NOT NULL GROUP BY p.id, p.name, p.faculty), major_bias AS (SELECT s.major, ROUND(AVG(e.grade), 2) AS major_avg FROM students s JOIN enrollments e ON s.id = e.student_id WHERE e.grade IS NOT NULL GROUP BY s.major) SELECT pb.professor, pb.prof_avg, mb.major_avg FROM prof_bias pb JOIN major_bias mb ON pb.faculty = mb.major ORDER BY pb.prof_avg DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "The proof is watertight: Prof. Dr. Weber (Economics) grades 0.35 points worse than the major average. Prof. Dr. Fischer (Physics) 0.28 points worse. Prof. Dr. Mueller lies exactly at the average. Prof. Dr. Schmidt (Mathematics) even grades 0.04 points better. Prometheus deliberately routes: bad examiners into bad majors.",
        hints: [
          "Create two CTEs: prof_bias (professors with avg grade) and major_bias (majors with avg grade).",
          "Join the CTEs via pb.faculty = mb.major.",
          "Calculate the deviation with prof_avg - major_avg.",
        ],
        points: 45,
      },
    ],
    outro:
      "Project Prometheus — exposed. The statistical proof is complete: Economics and Physics students are systematically disadvantaged. Examiners were deliberately assigned. The data goes to the Academic Senate — and to the press.",
    tags: ["Story", "Window Functions", "CTE", "GROUP BY", "JOIN"],
  }),

  makeStoryExercise("str", {
    title: "Money Flow Omega",
    description:
      "An AI network is laundering money through thousands of microtransactions. You have 48 hours and access to the bank database — find the perpetrators before Omega empties the accounts.",
    difficulty: "advanced",
    category: "Story",
    datasetId: "story-geldstrom-omega",
    scenarioTitle: "Money Flow Omega",
    intro:
      "Omega Alert. The corporate bank's fraud detection AI has flagged anomalies — but the Omega group is faster. Microtransactions flow through dozens of accounts, amounts vanish in milliseconds. You have database access and 48 hours. Find the Omega network — before it empties the accounts and wipes the traces.\n\nThe bank database is online. Customers, accounts, transactions, fraud cases — four tables that reveal the Omega network. Every transaction tells a story. Every account has a pattern. Find it before Omega closes the access.",
    chapters: [
      {
        title: "Suspicious Transfers",
        narrative:
          "First task: Show all transactions that have already been flagged as fraud cases. Join transactions, fraud_cases, accounts, and customers. Sort by amount descending.",
        referenceQuery:
          "SELECT t.id, c.name AS customer, a.account_number, t.amount, t.type, t.date, fc.reason FROM transactions t JOIN fraud_cases fc ON t.id = fc.transaction_id JOIN accounts a ON t.account_id = a.id JOIN customers c ON a.customer_id = c.id ORDER BY ABS(t.amount) DESC;",
        hiddenTestQuery:
          "SELECT c.name, t.amount, fc.reason FROM transactions t JOIN fraud_cases fc ON t.id = fc.transaction_id JOIN accounts a ON t.account_id = a.id JOIN customers c ON a.customer_id = c.id ORDER BY ABS(t.amount) DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Four flagged transactions: Wolfgang Becker (−9,999.99 and −4,999.99 Credits, nighttime luxury purchases), Helmut Richter (−5,000 transfer to unknown account, −999.99 night transaction). Two perpetrators, four data points. This is just the tip of the iceberg.",
        hints: [
          "Join transactions → fraud_cases → accounts → customers via the respective IDs.",
          "Sort with ORDER BY ABS(t.amount) DESC for largest amounts first.",
        ],
        points: 25,
      },
      {
        title: "High-Frequency Accounts",
        narrative:
          "Omega disguises large transfers through many small transactions — high frequency is the telltale sign. Find all accounts with more than 2 transactions. Show account number, customer name, and count.",
        referenceQuery:
          "SELECT a.account_number, c.name AS customer, COUNT(t.id) AS transaction_count FROM transactions t JOIN accounts a ON t.account_id = a.id JOIN customers c ON a.customer_id = c.id GROUP BY a.id, a.account_number, c.name HAVING COUNT(t.id) > 2 ORDER BY transaction_count DESC;",
        hiddenTestQuery:
          "SELECT a.account_number, c.name, COUNT(t.id) AS count FROM transactions t JOIN accounts a ON t.account_id = a.id JOIN customers c ON a.customer_id = c.id GROUP BY a.id HAVING COUNT(t.id) > 2 ORDER BY count DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Three high-frequency accounts: Helmut Richter Checking (7 transactions!), Helmut Richter Savings (4), Brigitte Mueller Savings (3). Helmut Richter appears in BOTH lists — fraud transactions AND high frequency. Omega's main node is identified.",
        hints: [
          "Group by account and use HAVING COUNT(t.id) > 2.",
          "Sort by transaction count descending.",
        ],
        points: 30,
      },
      {
        title: "Balance Anomalies",
        narrative:
          "Omega creates negative balances — an account goes into the red to divert funds. Calculate the running balance of each account with SUM(amount) OVER (PARTITION BY account_id ORDER BY date). Show only accounts that go negative.",
        referenceQuery:
          "SELECT a.account_number, c.name AS customer, t.date, t.amount, t.description, SUM(t.amount) OVER (PARTITION BY t.account_id ORDER BY t.date) AS running_balance FROM transactions t JOIN accounts a ON t.account_id = a.id JOIN customers c ON a.customer_id = c.id WHERE t.account_id IN (1, 8) ORDER BY t.account_id, t.date;",
        hiddenTestQuery:
          "SELECT a.account_number, t.date, t.amount, SUM(t.amount) OVER (PARTITION BY t.account_id ORDER BY t.date) AS balance FROM transactions t JOIN accounts a ON t.account_id = a.id WHERE t.account_id IN (1, 8) ORDER BY t.account_id, t.date;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Account 1 (Helmut Richter): Balance drops after the 5,000 transfer to −365 Credits, after the night transfer to −1,365 Credits. Account 8 (Wolfgang Becker): Immediately −9,999 Credits after the first transaction. Both accounts are technically insolvent — but the system didn't trigger a block. Omega manipulated the security systems.",
        hints: [
          "Use SUM(t.amount) OVER (PARTITION BY t.account_id ORDER BY t.date) as running balance.",
          "Filter on account_id IN (1, 8) for the most suspicious accounts.",
        ],
        points: 30,
      },
      {
        title: "Time Gaps",
        narrative:
          "Omega transfers happen at irregular intervals — sometimes minutes, sometimes weeks. For each transaction, calculate how many days have passed since the previous transaction of the same account, using LAG() OVER.",
        referenceQuery:
          "SELECT a.account_number, c.name, t.date, t.amount, LAG(t.date) OVER (PARTITION BY t.account_id ORDER BY t.date) AS previous_transaction, ROUND(JULIANDAY(t.date) - JULIANDAY(LAG(t.date) OVER (PARTITION BY t.account_id ORDER BY t.date)), 1) AS days_gap FROM transactions t JOIN accounts a ON t.account_id = a.id JOIN customers c ON a.customer_id = c.id ORDER BY t.account_id, t.date;",
        hiddenTestQuery:
          "SELECT t.account_id, t.date, LAG(t.date) OVER (PARTITION BY t.account_id ORDER BY t.date) AS prev, ROUND(JULIANDAY(t.date) - JULIANDAY(LAG(t.date) OVER (PARTITION BY t.account_id ORDER BY t.date)), 1) AS gap FROM transactions t ORDER BY t.account_id, t.date;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Account 1: The first four transactions at intervals of 1–2 days — then suddenly 39 days pause, followed by the 5,000 transfer. That's the Omega pattern: normal activity as cover, then the big transfer. Account 8: Both fraud transactions 15 minutes apart — coordinated attack.",
        hints: [
          "Use LAG(t.date) OVER (PARTITION BY t.account_id ORDER BY t.date).",
          "Calculate the gap with JULIANDAY(t.date) - JULIANDAY(LAG(...)).",
        ],
        points: 35,
      },
      {
        title: "Transaction Chains",
        narrative:
          "Omega disguises origin through chain transfers — money flows from account to account. Use a CTE to find all accounts that have either more than 3 transactions OR a total volume over 5,000 Credits.",
        referenceQuery:
          "WITH suspicious_accounts AS (SELECT account_id, COUNT(*) AS count, ROUND(SUM(ABS(amount)), 2) AS total_volume FROM transactions GROUP BY account_id HAVING COUNT(*) > 3 OR SUM(ABS(amount)) > 5000) SELECT a.account_number, c.name AS customer, sa.count, sa.total_volume FROM suspicious_accounts sa JOIN accounts a ON sa.account_id = a.id JOIN customers c ON a.customer_id = c.id ORDER BY sa.total_volume DESC;",
        hiddenTestQuery:
          "WITH sa AS (SELECT account_id, COUNT(*) AS count, SUM(ABS(amount)) AS vol FROM transactions GROUP BY account_id HAVING COUNT(*) > 3 OR SUM(ABS(amount)) > 5000) SELECT a.account_number, c.name, sa.count FROM sa JOIN accounts a ON sa.account_id = a.id JOIN customers c ON a.customer_id = c.id ORDER BY sa.vol DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Three suspicious accounts: Wolfgang Becker (14,999 Credits volume, 2 transactions — pure high-amount attacks), Helmut Richter Checking (11,365 Credits, 7 transactions), Helmut Richter Savings (4,460 Credits, 4 transactions). The Omega triangle is complete.",
        hints: [
          "Create a CTE with HAVING COUNT(*) > 3 OR SUM(ABS(amount)) > 5000.",
          "Join the CTE result with accounts and customers.",
        ],
        points: 40,
      },
      {
        title: "Perpetrator Accounts",
        narrative:
          "Combine the findings: Find all accounts that are EITHER flagged as fraud accounts OR high-frequency. Use two CTEs and connect them with OR in the WHERE clause.",
        referenceQuery:
          "WITH fraud_accounts AS (SELECT DISTINCT t.account_id FROM transactions t JOIN fraud_cases fc ON t.id = fc.transaction_id), frequency_accounts AS (SELECT account_id FROM transactions GROUP BY account_id HAVING COUNT(*) > 3) SELECT a.account_number, c.name AS customer, a.balance FROM accounts a JOIN customers c ON a.customer_id = c.id WHERE a.id IN (SELECT account_id FROM fraud_accounts) OR a.id IN (SELECT account_id FROM frequency_accounts) ORDER BY a.balance DESC;",
        hiddenTestQuery:
          "WITH fraud AS (SELECT DISTINCT t.account_id FROM transactions t JOIN fraud_cases fc ON t.id = fc.transaction_id), freq AS (SELECT account_id FROM transactions GROUP BY account_id HAVING COUNT(*) > 3) SELECT a.account_number, c.name FROM accounts a JOIN customers c ON a.customer_id = c.id WHERE a.id IN (SELECT account_id FROM fraud) OR a.id IN (SELECT account_id FROM freq) ORDER BY a.balance DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Three perpetrator accounts identified: Helmut Richter Checking (Balance: 12,500), Helmut Richter Savings (45,000 — the actual target), Wolfgang Becker Checking (67,000 Credits — the biggest attack point). Wolfgang Becker's account contains the largest Omega volume. 32 hours remaining.",
        hints: [
          "Create CTEs fraud_accounts and frequency_accounts separately.",
          "Connect them with WHERE a.id IN (...) OR a.id IN (...).",
        ],
        points: 45,
      },
      {
        title: "Omega Falls",
        narrative:
          "Final query: Create the complete Omega network profile. Multi-CTE with fraud transactions AND account statistics — show for each perpetrator the fraud volume, transaction count, and current balance.",
        referenceQuery:
          "WITH fraud_stats AS (SELECT t.account_id, COUNT(*) AS fraud_count, ROUND(SUM(ABS(t.amount)), 2) AS fraud_volume FROM transactions t JOIN fraud_cases fc ON t.id = fc.transaction_id GROUP BY t.account_id), account_stats AS (SELECT account_id, COUNT(*) AS transactions, ROUND(SUM(amount), 2) AS balance_change FROM transactions GROUP BY account_id) SELECT c.name AS perpetrator_network, a.account_number, a.balance, ast.transactions, fs.fraud_count, fs.fraud_volume FROM fraud_stats fs JOIN accounts a ON fs.account_id = a.id JOIN customers c ON a.customer_id = c.id JOIN account_stats ast ON fs.account_id = ast.account_id ORDER BY fs.fraud_volume DESC;",
        hiddenTestQuery:
          "WITH fs AS (SELECT t.account_id, COUNT(*) AS fraud_count, SUM(ABS(t.amount)) AS vol FROM transactions t JOIN fraud_cases fc ON t.id = fc.transaction_id GROUP BY t.account_id) SELECT c.name, a.account_number, fs.fraud_count, ROUND(fs.vol, 2) AS fraud_volume FROM fs JOIN accounts a ON fs.account_id = a.id JOIN customers c ON a.customer_id = c.id ORDER BY fs.vol DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Omega network fully documented: Wolfgang Becker (14,999.98 Credits fraud volume, 2 fraud transactions), Helmut Richter (5,999.99 Credits, 2 fraud transactions). Both accounts are being frozen. 16 hours before the deadline. Omega falls.",
        hints: [
          "Create two CTEs: fraud_stats and account_stats.",
          "Join both CTEs with accounts and customers for the final profile.",
          "Sort by fraud volume descending.",
        ],
        points: 50,
      },
    ],
    outro:
      "Money Flow Omega — stopped. The network is fully documented: two main actors, four fraud accounts, 20,999 Credits total volume. The accounts are being frozen. Omega lost the game — this time.",
    tags: ["Story", "Window Functions", "CTE", "JOIN", "GROUP BY"],
  }),

  makeStoryExercise("str", {
    title: "Null Day",
    description:
      "The state fitness tracker is manipulating health data for a secret citizen rating database. You have one chance to uncover the complete chain of evidence.",
    difficulty: "interview",
    category: "Story",
    datasetId: "fitness",
    scenarioTitle: "Null Day",
    intro:
      "Null Day Protocol: The state FitCore tracker doesn't just collect fitness data — it generates it. Body weight, calories, BMI: everything is manipulated for a hidden citizen rating matrix. Those who are too heavy get fewer credits. Those who train too little lose insurance coverage. The data must be right — and it isn't. You have access to the FitCore database. Prove it.\n\nThe FitCore database loads. Users, workouts, body data — three tables full of manipulated data. The truth lies in the patterns. Find the anomalies before FitCore blocks access. The citizen rating matrix won't wait.",
    chapters: [
      {
        title: "Impossible Bodies",
        narrative:
          "FitCore logs body weight monthly. Show the weight development for each user with the previous measurement — use LAG() OVER (PARTITION BY user_id ORDER BY date). This makes unnatural jumps visible.",
        referenceQuery:
          "SELECT u.name, bd.date, bd.weight_kg, LAG(bd.weight_kg) OVER (PARTITION BY bd.user_id ORDER BY bd.date) AS previous_weight, ROUND(bd.weight_kg - LAG(bd.weight_kg) OVER (PARTITION BY bd.user_id ORDER BY bd.date), 2) AS change FROM body_data bd JOIN users u ON bd.user_id = u.id ORDER BY u.name, bd.date;",
        hiddenTestQuery:
          "SELECT u.name, bd.date, bd.weight_kg, LAG(bd.weight_kg) OVER (PARTITION BY bd.user_id ORDER BY bd.date) AS prev FROM body_data bd JOIN users u ON bd.user_id = u.id ORDER BY bd.user_id, bd.date;",
        hiddenTestMode: "rows",
        completionNarrative:
          "All weight changes lie between −0.5 and −1.0 kg per month — for all 8 users. Statistically impossible: real weight curves vary strongly. FitCore generates uniform loss curves that simulate 'compliance'. The data is falsified.",
        hints: [
          "Use LAG(bd.weight_kg) OVER (PARTITION BY bd.user_id ORDER BY bd.date).",
          "Calculate the change with bd.weight_kg - LAG(...).",
        ],
        points: 30,
      },
      {
        title: "Calorie Paradox",
        narrative:
          "FitCore records calories burned per workout. Calculate the calorie efficiency (calories_burned / duration_min) for all workouts. If all users have the same value, the data is generated.",
        referenceQuery:
          "SELECT u.name, w.date, w.duration_min, w.calories_burned, ROUND(CAST(w.calories_burned AS REAL) / w.duration_min, 2) AS calories_per_minute FROM workouts w JOIN users u ON w.user_id = u.id WHERE w.calories_burned IS NOT NULL ORDER BY calories_per_minute DESC;",
        hiddenTestQuery:
          "SELECT u.name, ROUND(CAST(w.calories_burned AS REAL) / w.duration_min, 2) AS rate FROM workouts w JOIN users u ON w.user_id = u.id WHERE w.calories_burned IS NOT NULL ORDER BY rate DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "All rates lie between 6.67 and 7.78 kcal/min — an unnaturally narrow range for different users with different bodies and training intensities. A 90 kg person burns significantly more than a 55 kg person. FitCore normalizes the data to a target corridor.",
        hints: [
          "Calculate CAST(w.calories_burned AS REAL) / w.duration_min as efficiency value.",
          "Filter on WHERE w.calories_burned IS NOT NULL.",
        ],
        points: 35,
      },
      {
        title: "BMI Contradiction",
        narrative:
          "The state BMI score determines credits. Calculate the real BMI from height and current weight: weight_kg / (height_cm/100)². Compare it with the official FitCore profile.",
        referenceQuery:
          "SELECT u.name, u.height_cm, bd.date, bd.weight_kg, ROUND(bd.weight_kg / ((CAST(u.height_cm AS REAL) / 100) * (CAST(u.height_cm AS REAL) / 100)), 1) AS bmi FROM body_data bd JOIN users u ON bd.user_id = u.id ORDER BY bmi DESC, u.name;",
        hiddenTestQuery:
          "SELECT u.name, bd.date, ROUND(bd.weight_kg / ((CAST(u.height_cm AS REAL) / 100) * (CAST(u.height_cm AS REAL) / 100)), 1) AS bmi FROM body_data bd JOIN users u ON bd.user_id = u.id ORDER BY bmi DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "David Maier (BMI 26.3), Tim Becker (24.2), Oliver Neumann (23.5) — all in the 'normal range' according to FitCore. Lena Krause (BMI 21.1). The BMI values are uniform — too uniform. FitCore pulls everyone into the 'green zone', independent of real measurements.",
        hints: [
          "Calculate BMI with weight_kg / ((height_cm / 100.0) * (height_cm / 100.0)).",
          "Use CAST(u.height_cm AS REAL) for decimal division.",
        ],
        points: 35,
      },
      {
        title: "Weekly Pattern",
        narrative:
          "FitCore generates workout entries with a suspiciously uniform weekly pattern. Number each user's workouts chronologically with ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY date). This shows whether the frequency is too regular.",
        referenceQuery:
          "SELECT u.name, w.date, w.duration_min, w.calories_burned, ROW_NUMBER() OVER (PARTITION BY w.user_id ORDER BY w.date) AS workout_number FROM workouts w JOIN users u ON w.user_id = u.id ORDER BY u.name, w.date;",
        hiddenTestQuery:
          "SELECT u.name, w.date, ROW_NUMBER() OVER (PARTITION BY w.user_id ORDER BY w.date) AS nr FROM workouts w JOIN users u ON w.user_id = u.id ORDER BY u.name, w.date;",
        hiddenTestMode: "rows",
        completionNarrative:
          "Each user has exactly 2–3 workouts at intervals of 7–9 days. Tim Becker: 15.01., 24.01., 02.02. — always 9 days. Nina Schmitz: 16.01., 25.01., 03.02. — always 9 days. A human doesn't have a perfect 9-day training rhythm. FitCore generates entries according to a fixed template.",
        hints: [
          "Use ROW_NUMBER() OVER (PARTITION BY w.user_id ORDER BY w.date).",
          "Sort by u.name and w.date for a chronological view.",
        ],
        points: 40,
      },
      {
        title: "Phantom Measurements",
        narrative:
          "FitCore generates body data even for months in which no workouts took place. Find all body measurements for which the user has no workout in the same month — with a CTE and STRFTIME.",
        referenceQuery:
          "WITH measurement_months AS (SELECT user_id, STRFTIME('%Y-%m', date) AS month, COUNT(*) AS measurements FROM body_data GROUP BY user_id, STRFTIME('%Y-%m', date)) SELECT u.name, mm.month, mm.measurements FROM measurement_months mm JOIN users u ON mm.user_id = u.id WHERE NOT EXISTS (SELECT 1 FROM workouts w WHERE w.user_id = mm.user_id AND STRFTIME('%Y-%m', w.date) = mm.month) ORDER BY mm.month, u.name;",
        hiddenTestQuery:
          "WITH mm AS (SELECT user_id, STRFTIME('%Y-%m', date) AS month FROM body_data GROUP BY user_id, STRFTIME('%Y-%m', date)) SELECT u.name, mm.month FROM mm JOIN users u ON mm.user_id = u.id WHERE NOT EXISTS (SELECT 1 FROM workouts w WHERE w.user_id = mm.user_id AND STRFTIME('%Y-%m', w.date) = mm.month) ORDER BY mm.month, u.name;",
        hiddenTestMode: "rows",
        completionNarrative:
          "March 2024: All 8 users have body measurements — but not a single workout. FitCore generated measurements without anyone having trained. Phantom data points for the BMI score. In February, 4 users are missing workouts despite body measurements.",
        hints: [
          "Create a CTE measurement_months with STRFTIME('%Y-%m', date).",
          "Check with NOT EXISTS whether a workout exists in that month.",
        ],
        points: 45,
      },
      {
        title: "Workout Without Body Data",
        narrative:
          "Reverse case: Are there months with workouts but without body data? Find all workout months without corresponding body measurements — correlated subquery with NOT EXISTS.",
        referenceQuery:
          "SELECT u.name, STRFTIME('%Y-%m', w.date) AS month, COUNT(*) AS workouts FROM workouts w JOIN users u ON w.user_id = u.id WHERE NOT EXISTS (SELECT 1 FROM body_data bd WHERE bd.user_id = w.user_id AND STRFTIME('%Y-%m', bd.date) = STRFTIME('%Y-%m', w.date)) GROUP BY w.user_id, u.name, STRFTIME('%Y-%m', w.date) ORDER BY u.name, month;",
        hiddenTestQuery:
          "SELECT u.name, STRFTIME('%Y-%m', w.date) AS month FROM workouts w JOIN users u ON w.user_id = u.id WHERE NOT EXISTS (SELECT 1 FROM body_data bd WHERE bd.user_id = w.user_id AND STRFTIME('%Y-%m', bd.date) = STRFTIME('%Y-%m', w.date)) GROUP BY w.user_id, u.name, STRFTIME('%Y-%m', w.date);",
        hiddenTestMode: "rows",
        completionNarrative:
          "No hits — all workout months have corresponding body data. But the reverse case (Chapter 5) shows measurements without workouts. FitCore proactively generates body measurements — even when nobody trains. The algorithm fills the matrix, not the users.",
        hints: [
          "Use NOT EXISTS with a correlated subquery on body_data.",
          "Compare STRFTIME('%Y-%m', w.date) = STRFTIME('%Y-%m', bd.date).",
        ],
        points: 50,
      },
      {
        title: "Null Day",
        narrative:
          "The final proof: Create a complete profile of each user in a multi-CTE query — with average BMI, workout count, calorie efficiency, and whether phantom measurements exist. This is the complete manipulation evidence chain.",
        referenceQuery:
          "WITH bmi_profile AS (SELECT bd.user_id, ROUND(AVG(bd.weight_kg / ((CAST(u.height_cm AS REAL) / 100) * (CAST(u.height_cm AS REAL) / 100))), 1) AS avg_bmi FROM body_data bd JOIN users u ON bd.user_id = u.id GROUP BY bd.user_id), workout_stats AS (SELECT user_id, COUNT(*) AS workouts, ROUND(AVG(CAST(calories_burned AS REAL) / duration_min), 2) AS avg_kcal_min FROM workouts WHERE calories_burned IS NOT NULL GROUP BY user_id), phantom_check AS (SELECT DISTINCT bd.user_id FROM body_data bd WHERE NOT EXISTS (SELECT 1 FROM workouts w WHERE w.user_id = bd.user_id AND STRFTIME('%Y-%m', w.date) = STRFTIME('%Y-%m', bd.date))) SELECT u.name, bp.avg_bmi, ws.workouts, ws.avg_kcal_min, CASE WHEN pc.user_id IS NOT NULL THEN 'YES' ELSE 'NO' END AS phantom_measurement FROM users u JOIN bmi_profile bp ON u.id = bp.user_id JOIN workout_stats ws ON u.id = ws.user_id LEFT JOIN phantom_check pc ON u.id = pc.user_id ORDER BY bp.avg_bmi DESC;",
        hiddenTestQuery:
          "WITH bp AS (SELECT bd.user_id, ROUND(AVG(bd.weight_kg / ((CAST(u.height_cm AS REAL) / 100) * (CAST(u.height_cm AS REAL) / 100))), 1) AS avg_bmi FROM body_data bd JOIN users u ON bd.user_id = u.id GROUP BY bd.user_id), ws AS (SELECT user_id, COUNT(*) AS workouts FROM workouts GROUP BY user_id) SELECT u.name, bp.avg_bmi, ws.workouts FROM users u JOIN bp ON u.id = bp.user_id JOIN ws ON u.id = ws.user_id ORDER BY bp.avg_bmi DESC;",
        hiddenTestMode: "rows",
        completionNarrative:
          "The proof is complete: All 8 users have phantom measurements (March 2024 without workouts). Calorie efficiency is suspiciously similar for all (6.7–7.8). BMI values all lie in the 'normal range' — statistically impossible without manipulation. FitCore is a data falsification machine. Null Day is today.",
        hints: [
          "Create three CTEs: bmi_profile, workout_stats, and phantom_check.",
          "Join all three with users and use LEFT JOIN for phantom_check.",
          "Use CASE WHEN pc.user_id IS NOT NULL THEN 'YES' ELSE 'NO' for the phantom status.",
        ],
        points: 55,
      },
    ],
    outro:
      "Null Day — complete. The FitCore manipulation is fully documented: generated weight curves, uniform calorie efficiency, phantom measurements, and a falsified BMI matrix. The data goes to the Citizen Rights Commission. FitCore's algorithm is exposed. The citizens will know.",
    tags: ["Story", "Window Functions", "CTE", "JOIN", "GROUP BY", "Subquery"],
  })
);
