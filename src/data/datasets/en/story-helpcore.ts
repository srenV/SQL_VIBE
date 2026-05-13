import type { Dataset } from "@/types/exercise";

export const storyHelpCoreDatasetEn: Dataset = {
  id: "story-helpcore",
  name: "HelpCore Ticket System",
  description: "Story-exclusive ticket database for the case 'Virus in the HelpCore Network'.",
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
  category_id INTEGER NOT NULL REFERENCES categories(id),
  agent_id INTEGER REFERENCES agents(id),
  priority VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at DATETIME NOT NULL,
  closed_at DATETIME
);
CREATE TABLE comments (
  id INTEGER PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES tickets(id),
  author VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL
);
INSERT INTO agents VALUES
(1,'Lena Mayer','lena@helpcore.de','Infrastructure',1),
(2,'Tom Billing','tom.billing@helpcore.de','Energy',1),
(3,'Sara Vogel','sara@helpcore.de','Civil Rights',1),
(4,'Max Gruber','max@helpcore.de','Infrastructure',1),
(5,'Petra Zorn','petra@helpcore.de','Energy',0),
(6,'Klaus Held','klaus@helpcore.de','General',1);
INSERT INTO categories VALUES
(1,'Infrastructure'),
(2,'Energy'),
(3,'Civil Rights'),
(4,'Payment'),
(5,'General'),
(6,'Security');
INSERT INTO tickets VALUES
(1,'Power outage Sector 7','Permanent outage for 3 days',2,2,'critical','open','2024-04-01 08:00:00',NULL),
(2,'Water supply interrupted','Pressure drop in residential zone 4',1,1,'critical','in_progress','2024-04-01 09:00:00',NULL),
(3,'Payment processing failing','Checkout not reachable',4,2,'critical','closed','2024-04-02 10:00:00','2024-04-02 14:00:00'),
(4,'Heating failure Block 12','No heating for 48h',2,5,'critical','in_progress','2024-04-03 07:00:00',NULL),
(5,'Network outage Citizen Portal','Portal unreachable for hours',1,NULL,'critical','closed','2024-04-03 11:00:00','2024-04-04 09:00:00'),
(6,'Street light defective','Sector 3 completely dark',1,4,'high','open','2024-04-01 20:00:00',NULL),
(7,'Garbage collection delayed','No pickup for 2 weeks',5,3,'medium','open','2024-04-02 09:00:00',NULL),
(8,'Civil rights violation','Unauthorized data sharing',3,NULL,'high','open','2024-04-01 15:00:00',NULL),
(9,'Traffic light defective','Intersection Main St./Ring St.',1,1,'high','in_progress','2024-04-02 12:00:00',NULL),
(10,'Sewer fluctuation','Wastewater level critical',2,NULL,'medium','open','2024-04-03 06:00:00',NULL),
(11,'Data loss in archive','Backup failed',6,4,'high','open','2024-04-01 10:00:00',NULL),
(12,'Public WiFi outage','Free WiFi offline',5,NULL,'low','open','2024-04-04 08:00:00',NULL),
(13,'Energy rationing Zone 2','Unauthorized shutdown',2,NULL,'high','open','2024-04-04 09:00:00',NULL),
(14,'Energy rationing Zone 5','Arbitrary shutdown',2,NULL,'high','open','2024-04-04 10:00:00',NULL),
(15,'Water billing error','Triple billing',4,NULL,'medium','open','2024-04-04 11:00:00',NULL);
INSERT INTO comments VALUES
(1,1,'Tom Billing','Ticket checked, escalating internally.','2024-04-01 10:00:00'),
(2,1,'Lena Mayer','Technician dispatched, status unknown.','2024-04-01 11:00:00'),
(3,2,'Tom Billing','Cause identified: valve defect.','2024-04-01 12:00:00'),
(4,3,'Tom Billing','Ticket marked as resolved — no bug.','2024-04-02 10:30:00'),
(5,3,'Sara Vogel','I cannot confirm this.','2024-04-02 11:00:00'),
(6,4,'Max Gruber','Heating technician informed.','2024-04-03 08:00:00'),
(7,5,'Klaus Held','Portal restarted, status being monitored.','2024-04-03 12:00:00'),
(8,6,'Lena Mayer','Repair team requested.','2024-04-01 21:00:00'),
(9,7,'Sara Vogel','Pickup rescheduled for next week.','2024-04-02 10:00:00'),
(10,9,'Max Gruber','Traffic light control restarted.','2024-04-02 13:00:00'),
(11,11,'Max Gruber','Backup system being investigated.','2024-04-01 11:00:00');
`,
  // Tickets WITHOUT any comments: 8, 10, 12, 13, 14, 15 = exactly 6
  // Tickets WITH critical priority: 1, 2, 3, 4, 5 = exactly 5
  // Tom Billing comments: tickets 1, 2, 3 = 3 (> 2, leads the ranking)
};
