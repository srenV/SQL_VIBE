import type { Dataset } from "@/types/exercise";

export const storySystemfehlerDeltaDataset: Dataset = {
  id: "story-systemfehler-delta",
  name: "SmartCity-Server-Logs (Delta)",
  description: "Story-exklusive Log-Datenbank fuer den Fall 'Systemfehler Delta'.",
  tables: [
    {
      name: "events",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "session_id", type: "VARCHAR(50)", nullable: false },
        { name: "event_typ", type: "VARCHAR(30)", nullable: false },
        { name: "seite", type: "VARCHAR(100)", nullable: true },
        { name: "zeitpunkt", type: "DATETIME", nullable: false },
        { name: "dauer_ms", type: "INTEGER", nullable: true },
      ],
    },
    {
      name: "sessions",
      columns: [
        { name: "id", type: "VARCHAR(50)", nullable: false },
        { name: "nutzer_id", type: "INTEGER", nullable: true },
        { name: "ip_adresse", type: "VARCHAR(15)", nullable: false },
        { name: "browser", type: "VARCHAR(50)", nullable: false },
        { name: "startzeit", type: "DATETIME", nullable: false },
        { name: "endzeit", type: "DATETIME", nullable: true },
      ],
    },
    {
      name: "fehler",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "event_id", type: "INTEGER", nullable: false, references: "events.id" },
        { name: "fehlercode", type: "VARCHAR(10)", nullable: false },
        { name: "nachricht", type: "TEXT", nullable: false },
        { name: "schweregrad", type: "VARCHAR(10)", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE events (
  id INTEGER PRIMARY KEY,
  session_id VARCHAR(50) NOT NULL,
  event_typ VARCHAR(30) NOT NULL,
  seite VARCHAR(100),
  zeitpunkt DATETIME NOT NULL,
  dauer_ms INTEGER
);
CREATE TABLE sessions (
  id VARCHAR(50) PRIMARY KEY,
  nutzer_id INTEGER,
  ip_adresse VARCHAR(15) NOT NULL,
  browser VARCHAR(50) NOT NULL,
  startzeit DATETIME NOT NULL,
  endzeit DATETIME
);
CREATE TABLE fehler (
  id INTEGER PRIMARY KEY,
  event_id INTEGER NOT NULL,
  fehlercode VARCHAR(10) NOT NULL,
  nachricht TEXT NOT NULL,
  schweregrad VARCHAR(10) NOT NULL
);
INSERT INTO sessions VALUES
('s01',1,'10.0.1.10','ChromeBot/91','2089-03-01 02:00:00','2089-03-01 02:10:00'),
('s02',2,'10.0.1.11','ChromeBot/91','2089-03-01 02:05:00','2089-03-01 02:15:00'),
('s03',3,'10.0.1.12','ChromeBot/91','2089-03-01 02:10:00','2089-03-01 02:20:00'),
('s04',4,'10.0.2.50','Firefox/88','2089-03-01 08:00:00','2089-03-01 08:30:00'),
('s05',5,'10.0.2.51','Safari/14','2089-03-01 09:00:00','2089-03-01 09:20:00'),
('s06',6,'10.0.3.10','Edge/90','2089-03-01 10:00:00','2089-03-01 10:15:00'),
('s07',7,'10.0.3.11','Firefox/88','2089-03-01 11:00:00',NULL),
('s08',8,'10.0.4.20','Chrome/90','2089-03-01 12:00:00','2089-03-01 12:45:00'),
('s09',9,'10.0.4.21','Safari/14','2089-03-01 13:00:00','2089-03-01 13:30:00'),
('s10',10,'10.0.5.30','Firefox/88','2089-03-01 14:00:00','2089-03-01 14:20:00'),
('s11',1,'10.0.1.10','ChromeBot/91','2089-03-02 03:00:00','2089-03-02 03:05:00'),
('s12',2,'10.0.1.11','ChromeBot/91','2089-03-02 03:02:00','2089-03-02 03:07:00'),
('s13',11,'10.0.6.40','Chrome/90','2089-03-02 09:00:00','2089-03-02 09:30:00'),
('s14',12,'10.0.6.41','Safari/14','2089-03-02 10:00:00','2089-03-02 10:20:00'),
('s15',13,'10.0.7.50','Edge/90','2089-03-02 11:00:00',NULL);
INSERT INTO events VALUES
(1,'s01','pageview','/checkout','2089-03-01 02:01:00',520),
(2,'s01','pageview','/checkout','2089-03-01 02:02:00',610),
(3,'s02','pageview','/checkout','2089-03-01 02:06:00',480),
(4,'s03','pageview','/checkout','2089-03-01 02:11:00',550),
(5,'s03','pageview','/checkout','2089-03-01 02:12:00',430),
(6,'s04','pageview','/products','2089-03-01 08:05:00',310),
(7,'s04','pageview','/products','2089-03-01 08:10:00',290),
(8,'s05','pageview','/home','2089-03-01 09:05:00',150),
(9,'s06','pageview','/checkout','2089-03-01 10:05:00',200),
(10,'s07','pageview','/about','2089-03-01 11:05:00',100),
(11,'s08','pageview','/products','2089-03-01 12:10:00',180),
(12,'s09','pageview','/home','2089-03-01 13:05:00',120),
(13,'s10','pageview','/checkout','2089-03-01 14:05:00',160),
(14,'s11','pageview','/checkout','2089-03-02 03:01:00',500),
(15,'s12','pageview','/checkout','2089-03-02 03:03:00',420),
(16,'s13','pageview','/home','2089-03-02 09:10:00',130),
(17,'s14','pageview','/products','2089-03-02 10:05:00',200),
(18,'s15','pageview','/checkout','2089-03-02 11:05:00',170);
INSERT INTO fehler VALUES
(1,1,'ERR_502','Gateway-Timeout beim Checkout-Prozessor','kritisch'),
(2,2,'ERR_502','Gateway-Timeout beim Checkout-Prozessor','kritisch'),
(3,3,'ERR_502','Gateway-Timeout beim Checkout-Prozessor','kritisch'),
(4,4,'ERR_404','Produkt nicht gefunden','warnung'),
(5,5,'ERR_404','Produkt nicht gefunden','warnung'),
(6,6,'ERR_404','Produkt nicht gefunden','warnung'),
(7,7,'ERR_500','Datenbankverbindung unterbrochen','kritisch'),
(8,9,'ERR_500','Datenbankverbindung unterbrochen','kritisch'),
(9,13,'ERR_500','Datenbankverbindung unterbrochen','kritisch');
`,
};
