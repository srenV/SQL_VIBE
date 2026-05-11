/**
 * Log-Analyse-Datensatz.
 * Enthaelt Server-Logs mit Events, Sessions, Fehlercodes und Performance-Metriken
 * fuer analysebezogene SQL-Uebungen.
 */
import type { Dataset } from "@/types/exercise";

export const logsDataset: Dataset = {
  id: "logs",
  name: "Log-Analyse",
  description:
    "Server-Logs mit Events, Sessions, Fehlercodes und Performance-Metriken fuer Analyse-Uebungen.",
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
        { name: "browser", type: "VARCHAR(50)", nullable: true },
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
  browser VARCHAR(50),
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
('sess_001',1,'192.168.1.10','Chrome','2024-03-01 08:00:00','2024-03-01 08:15:00'),
('sess_002',2,'192.168.1.11','Firefox','2024-03-01 09:00:00','2024-03-01 09:30:00'),
('sess_003',3,'192.168.1.12','Safari','2024-03-01 10:00:00',NULL),
('sess_004',1,'192.168.1.10','Chrome','2024-03-01 11:00:00','2024-03-01 11:20:00'),
('sess_005',4,'192.168.1.13','Edge','2024-03-01 12:00:00','2024-03-01 12:10:00'),
('sess_006',5,'192.168.1.14','Chrome','2024-03-01 13:00:00','2024-03-01 13:45:00'),
('sess_007',NULL,'192.168.1.15','Firefox','2024-03-01 14:00:00','2024-03-01 14:05:00'),
('sess_008',6,'192.168.1.16','Safari','2024-03-01 15:00:00',NULL),
('sess_009',7,'192.168.1.17','Chrome','2024-03-01 16:00:00','2024-03-01 16:30:00'),
('sess_010',8,'192.168.1.18','Firefox','2024-03-01 17:00:00','2024-03-01 17:15:00'),
('sess_011',1,'192.168.1.10','Chrome','2024-03-02 08:00:00','2024-03-02 08:25:00'),
('sess_012',2,'192.168.1.11','Firefox','2024-03-02 09:00:00','2024-03-02 09:20:00'),
('sess_013',9,'192.168.1.19','Edge','2024-03-02 10:00:00','2024-03-02 10:40:00'),
('sess_014',10,'192.168.1.20','Chrome','2024-03-02 11:00:00','2024-03-02 11:15:00'),
('sess_015',NULL,'192.168.1.21','Safari','2024-03-02 12:00:00','2024-03-02 12:03:00');
INSERT INTO events VALUES
(1,'sess_001','page_view','/home','2024-03-01 08:00:00',120),
(2,'sess_001','page_view','/products','2024-03-01 08:02:00',250),
(3,'sess_001','click','/products/1','2024-03-01 08:03:00',NULL),
(4,'sess_001','page_view','/cart','2024-03-01 08:04:00',180),
(5,'sess_001','checkout','/checkout','2024-03-01 08:05:00',500),
(6,'sess_002','page_view','/home','2024-03-01 09:00:00',90),
(7,'sess_002','page_view','/blog','2024-03-01 09:05:00',200),
(8,'sess_002','page_view','/blog/sql','2024-03-01 09:07:00',150),
(9,'sess_003','page_view','/home','2024-03-01 10:00:00',300),
(10,'sess_003','page_view','/products','2024-03-01 10:02:00',400),
(11,'sess_003','page_view','/products','2024-03-01 10:05:00',350),
(12,'sess_004','page_view','/home','2024-03-01 11:00:00',100),
(13,'sess_004','page_view','/account','2024-03-01 11:01:00',120),
(14,'sess_004','page_view','/orders','2024-03-01 11:02:00',200),
(15,'sess_005','page_view','/home','2024-03-01 12:00:00',80),
(16,'sess_005','page_view','/products','2024-03-01 12:02:00',150),
(17,'sess_005','checkout','/checkout','2024-03-01 12:05:00',600),
(18,'sess_006','page_view','/home','2024-03-01 13:00:00',110),
(19,'sess_006','page_view','/products','2024-03-01 13:03:00',220),
(20,'sess_006','click','/products/5','2024-03-01 13:04:00',NULL),
(21,'sess_006','page_view','/cart','2024-03-01 13:05:00',190),
(22,'sess_006','checkout','/checkout','2024-03-01 13:06:00',550),
(23,'sess_007','page_view','/home','2024-03-01 14:00:00',95),
(24,'sess_007','page_view','/about','2024-03-01 14:02:00',130),
(25,'sess_008','page_view','/home','2024-03-01 15:00:00',105),
(26,'sess_008','page_view','/products','2024-03-01 15:02:00',210),
(27,'sess_009','page_view','/home','2024-03-01 16:00:00',115),
(28,'sess_009','page_view','/products','2024-03-01 16:02:00',230),
(29,'sess_009','click','/products/2','2024-03-01 16:03:00',NULL),
(30,'sess_009','page_view','/cart','2024-03-01 16:04:00',180),
(31,'sess_009','checkout','/checkout','2024-03-01 16:05:00',480),
(32,'sess_010','page_view','/home','2024-03-01 17:00:00',88),
(33,'sess_010','page_view','/blog','2024-03-01 17:03:00',170),
(34,'sess_011','page_view','/home','2024-03-02 08:00:00',125),
(35,'sess_011','page_view','/products','2024-03-02 08:03:00',240),
(36,'sess_011','checkout','/checkout','2024-03-02 08:06:00',520),
(37,'sess_012','page_view','/home','2024-03-02 09:00:00',98),
(38,'sess_012','page_view','/blog','2024-03-02 09:04:00',185),
(39,'sess_013','page_view','/home','2024-03-02 10:00:00',140),
(40,'sess_013','page_view','/products','2024-03-02 10:03:00',260),
(41,'sess_013','click','/products/3','2024-03-02 10:04:00',NULL),
(42,'sess_013','page_view','/cart','2024-03-02 10:05:00',195),
(43,'sess_013','checkout','/checkout','2024-03-02 10:07:00',580),
(44,'sess_014','page_view','/home','2024-03-02 11:00:00',108),
(45,'sess_014','page_view','/account','2024-03-02 11:02:00',135),
(46,'sess_015','page_view','/home','2024-03-02 12:00:00',92);
INSERT INTO fehler VALUES
(1,3,'ERR_404','Produktseite nicht gefunden','warnung'),
(2,9,'ERR_500','Datenbankfehler beim Laden der Produkte','kritisch'),
(3,11,'ERR_404','Produktseite nicht gefunden','warnung'),
(4,17,'ERR_502','Gateway-Timeout beim Checkout','kritisch'),
(5,22,'ERR_500','Zahlungsgateway nicht erreichbar','kritisch'),
(6,26,'ERR_404','Produktseite nicht gefunden','warnung'),
(7,31,'ERR_502','Gateway-Timeout beim Checkout','kritisch'),
(8,36,'ERR_500','Datenbankfehler beim Checkout','kritisch'),
(9,43,'ERR_502','Gateway-Timeout beim Checkout','kritisch');
`,
};
