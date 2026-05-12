/**
 * Ticket system dataset (English).
 * Contains tickets, agents, categories, priorities, and comments
 * for support ticket SQL exercises.
 */
import type { Dataset } from "@/types/exercise";

export const ticketsDatasetEn: Dataset = {
  id: "tickets",
  name: "Ticket System",
  description:
    "A support ticket system with tickets, agents, categories, priorities, and comments.",
  tables: [
    {
      name: "agents",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "team", type: "VARCHAR(50)", nullable: false },
        { name: "active", type: "BOOLEAN", nullable: false },
      ],
    },
    {
      name: "categories",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(50)", nullable: false },
      ],
    },
    {
      name: "tickets",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "title", type: "VARCHAR(200)", nullable: false },
        { name: "description", type: "TEXT", nullable: true },
        { name: "category_id", type: "INTEGER", nullable: false, references: "categories.id" },
        { name: "agent_id", type: "INTEGER", nullable: true, references: "agents.id" },
        { name: "priority", type: "VARCHAR(10)", nullable: false },
        { name: "status", type: "VARCHAR(20)", nullable: false },
        { name: "created_at", type: "DATETIME", nullable: false },
        { name: "closed_at", type: "DATETIME", nullable: true },
      ],
    },
    {
      name: "comments",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "ticket_id", type: "INTEGER", nullable: false, references: "tickets.id" },
        { name: "author", type: "VARCHAR(100)", nullable: false },
        { name: "message", type: "TEXT", nullable: false },
        { name: "created_at", type: "DATETIME", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE agents (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  team VARCHAR(50) NOT NULL,
  active BOOLEAN NOT NULL
);
CREATE TABLE categories (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category_id INTEGER NOT NULL,
  agent_id INTEGER,
  priority VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL,
  closed_at DATETIME
);
CREATE TABLE comments (
  id INTEGER PRIMARY KEY,
  ticket_id INTEGER NOT NULL,
  author VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL
);
INSERT INTO agents VALUES
(1,'Max Support','max@support.de','Tech',1),
(2,'Lisa Helpdesk','lisa@support.de','Tech',1),
(3,'Tom Billing','tom@support.de','Billing',1),
(4,'Sarah Account','sarah@support.de','Account',1),
(5,'John Escalation','john@support.de','Tech',0),
(6,'Emma Onboarding','emma@support.de','Account',1);
INSERT INTO categories VALUES
(1,'Login Issues'),
(2,'Payment Errors'),
(3,'Orders'),
(4,'Technical Error'),
(5,'Feature Request'),
(6,'Returns');
INSERT INTO tickets VALUES
(1,'Password reset not working','Customer cannot reset password, email not arriving.',1,1,'high','open','2024-01-10 09:00:00',NULL),
(2,'Double charge','Customer was charged twice for order #1234.',2,3,'critical','in_progress','2024-01-10 10:30:00',NULL),
(3,'Order status not visible','Customer cannot see their order in the account.',3,4,'medium','open','2024-01-11 08:15:00',NULL),
(4,'App crashes on open','Mobile app crashes immediately after launch on iOS 17.',4,1,'high','in_progress','2024-01-11 11:00:00',NULL),
(5,'Dark mode request','Customer wants a dark mode for the app.',5,NULL,'low','open','2024-01-12 14:20:00',NULL),
(6,'Request item return','Customer wants to return items from order #5678.',6,4,'medium','closed','2024-01-12 09:00:00','2024-01-15 16:30:00'),
(7,'Login with GigaMail not working','OAuth login with GigaMail account fails.',1,2,'high','in_progress','2024-01-13 10:00:00',NULL),
(8,'Invoice not received','Customer did not receive invoice for order #9012.',2,3,'medium','closed','2024-01-13 11:30:00','2024-01-14 09:00:00'),
(9,'Product page loading slowly','Product page load time over 10 seconds.',4,1,'high','open','2024-01-14 08:00:00',NULL),
(10,'Delete account','Customer wants to permanently delete their account.',3,4,'low','open','2024-01-14 13:00:00',NULL),
(11,'Improve filter function','Customer wants advanced filters in product search.',5,NULL,'low','open','2024-01-15 09:30:00',NULL),
(12,'Wrong delivery address','Order was delivered to wrong address.',3,4,'critical','in_progress','2024-01-15 10:00:00',NULL),
(13,'Add payment method','Customer cannot save new credit card.',2,3,'medium','closed','2024-01-16 08:00:00','2024-01-17 14:00:00'),
(14,'Disable push notifications','Customer wants to turn off all push notifications.',4,2,'low','open','2024-01-16 11:00:00',NULL),
(15,'Coupon code not accepted','Discount code shown as invalid at checkout.',2,3,'high','in_progress','2024-01-17 09:00:00',NULL);
INSERT INTO comments VALUES
(1,1,'Max Support','Have you checked the spam folder?','2024-01-10 09:15:00'),
(2,1,'Customer','Yes, nothing there either.','2024-01-10 09:30:00'),
(3,2,'Tom Billing','We are checking the transactions.','2024-01-10 11:00:00'),
(4,3,'Sarah Account','Please try with a different browser.','2024-01-11 08:30:00'),
(5,4,'Max Support','Can you send us the crash logs?','2024-01-11 11:15:00'),
(6,6,'Sarah Account','Return approved, label sent.','2024-01-13 10:00:00'),
(7,7,'Lisa Helpdesk','We are checking the GigaMail OAuth configuration.','2024-01-13 10:30:00'),
(8,8,'Tom Billing','Invoice was resent.','2024-01-14 09:00:00'),
(9,9,'Max Support','We are analyzing the performance.','2024-01-14 08:30:00'),
(10,12,'Sarah Account','New delivery sent to correct address.','2024-01-16 09:00:00'),
(11,13,'Tom Billing','Card was successfully added.','2024-01-17 14:00:00'),
(12,15,'Tom Billing','Coupon was time-limited, has now expired.','2024-01-17 10:00:00');
`,
};