/**
 * HR-System-Datensatz.
 * Enthaelt Mitarbeiter, Abteilungen, Gehaelter, Urlauben und Bewerbungen
 * fuer HR-bezogene SQL-Uebungen.
 */
import type { Dataset } from "@/types/exercise";

export const hrDataset: Dataset = {
  id: "hr",
  name: "HR-System",
  description:
    "Ein HR-System mit Mitarbeitern, Abteilungen, Gehaeltern, Urlauben und Bewerbungen.",
  tables: [
    {
      name: "abteilungen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(50)", nullable: false },
        { name: "standort", type: "VARCHAR(50)", nullable: false },
        { name: "budget", type: "DECIMAL(12,2)", nullable: false },
      ],
    },
    {
      name: "mitarbeiter",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "abteilung_id", type: "INTEGER", nullable: false, references: "abteilungen.id" },
        { name: "position", type: "VARCHAR(50)", nullable: false },
        { name: "gehalt", type: "DECIMAL(10,2)", nullable: false },
        { name: "einstiegsdatum", type: "DATE", nullable: false },
        { name: "manager_id", type: "INTEGER", nullable: true, references: "mitarbeiter.id" },
      ],
    },
    {
      name: "urlaub",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "mitarbeiter_id", type: "INTEGER", nullable: false, references: "mitarbeiter.id" },
        { name: "startdatum", type: "DATE", nullable: false },
        { name: "enddatum", type: "DATE", nullable: false },
        { name: "tage", type: "INTEGER", nullable: false },
        { name: "genehmigt", type: "BOOLEAN", nullable: false },
      ],
    },
    {
      name: "bewerbungen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "abteilung_id", type: "INTEGER", nullable: false, references: "abteilungen.id" },
        { name: "bewerbungsdatum", type: "DATE", nullable: false },
        { name: "status", type: "VARCHAR(20)", nullable: false },
      ],
    },
  ],
  sql: `
CREATE TABLE abteilungen (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  standort VARCHAR(50) NOT NULL,
  budget DECIMAL(12,2) NOT NULL
);
CREATE TABLE mitarbeiter (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  abteilung_id INTEGER NOT NULL,
  position VARCHAR(50) NOT NULL,
  gehalt DECIMAL(10,2) NOT NULL,
  einstiegsdatum DATE NOT NULL,
  manager_id INTEGER
);
CREATE TABLE urlaub (
  id INTEGER PRIMARY KEY,
  mitarbeiter_id INTEGER NOT NULL,
  startdatum DATE NOT NULL,
  enddatum DATE NOT NULL,
  tage INTEGER NOT NULL,
  genehmigt BOOLEAN NOT NULL
);
CREATE TABLE bewerbungen (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  abteilung_id INTEGER NOT NULL,
  bewerbungsdatum DATE NOT NULL,
  status VARCHAR(20) NOT NULL
);
INSERT INTO abteilungen VALUES
(1,'Entwicklung','Berlin',500000.00),
(2,'Vertrieb','Muenchen',300000.00),
(3,'Marketing','Hamburg',250000.00),
(4,'Finanzen','Berlin',200000.00),
(5,'HR','Koeln',150000.00),
(6,'Support','Muenchen',180000.00);
INSERT INTO mitarbeiter VALUES
(1,'Anna Schmidt',1,'Senior Developer',72000.00,'2018-03-15',NULL),
(2,'Ben Mueller',1,'Developer',58000.00,'2020-06-01',1),
(3,'Clara Fischer',2,'Sales Manager',65000.00,'2019-01-10',NULL),
(4,'David Wagner',2,'Sales Representative',48000.00,'2021-04-20',3),
(5,'Elena Becker',3,'Marketing Manager',62000.00,'2019-09-15',NULL),
(6,'Felix Hoffmann',3,'Content Creator',45000.00,'2022-02-28',5),
(7,'Greta Lang',4,'Controller',60000.00,'2017-11-01',NULL),
(8,'Henrik Bauer',4,'Buchhalter',42000.00,'2021-08-15',7),
(9,'Ines Keller',5,'HR Manager',55000.00,'2020-01-20',NULL),
(10,'Jakob Neumann',5,'Recruiter',40000.00,'2022-05-10',9),
(11,'Kira Wolf',6,'Support Lead',50000.00,'2019-07-01',NULL),
(12,'Lars Krause',6,'Support Agent',38000.00,'2023-01-15',11),
(13,'Maria Maier',1,'Junior Developer',45000.00,'2023-03-01',1),
(14,'Noah Peters',2,'Sales Representative',47000.00,'2023-06-15',3),
(15,'Olivia Braun',3,'Social Media Manager',44000.00,'2023-09-01',5);
INSERT INTO urlaub VALUES
(1,1,'2024-06-01','2024-06-10',10,1),
(2,2,'2024-07-15','2024-07-20',6,1),
(3,3,'2024-08-01','2024-08-14',14,1),
(4,4,'2024-09-05','2024-09-10',6,0),
(5,5,'2024-06-20','2024-06-25',6,1),
(6,6,'2024-10-01','2024-10-05',5,0),
(7,7,'2024-07-01','2024-07-15',15,1),
(8,8,'2024-11-10','2024-11-15',6,1),
(9,9,'2024-08-20','2024-08-25',6,1),
(10,10,'2024-12-20','2024-12-24',5,0),
(11,11,'2024-06-15','2024-06-20',6,1),
(12,12,'2024-09-01','2024-09-03',3,1),
(13,13,'2024-07-10','2024-07-12',3,0),
(14,14,'2024-08-05','2024-08-10',6,1),
(15,15,'2024-10-15','2024-10-20',6,0);
INSERT INTO bewerbungen VALUES
(1,'Paul Schmitz','paul@bewerbung.de',1,'2024-01-10','eingegangen'),
(2,'Lisa Weber','lisa@bewerbung.de',2,'2024-01-15','gespraech'),
(3,'Tom Meier','tom@bewerbung.de',1,'2024-02-01','abgelehnt'),
(4,'Nina Hartmann','nina@bewerbung.de',3,'2024-02-20','eingegangen'),
(5,'Leon Schwarz','leon@bewerbung.de',4,'2024-03-05','angebot'),
(6,'Emma Richter','emma@bewerbung.de',5,'2024-03-15','gespraech'),
(7,'Finn Lorenz','finn@bewerbung.de',2,'2024-04-01','eingegangen'),
(8,'Mia Schmid','mia@bewerbung.de',6,'2024-04-10','abgelehnt'),
(9,'Noah Berger','noah@bewerbung.de',1,'2024-04-20','angebot'),
(10,'Sophia Wolf','sophia@bewerbung.de',3,'2024-05-01','eingegangen');
`,
};
