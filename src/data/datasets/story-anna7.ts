import type { Dataset } from "@/types/exercise";

export const storyAnna7Dataset: Dataset = {
  id: "story-anna7",
  name: "Korporations-HR (ANNA-7)",
  description: "Story-exklusive HR-Datenbank fuer den Fall 'Vermisst: Einheit ANNA-7'.",
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
  sql: `CREATE TABLE abteilungen (
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
(1,'Entwicklung','Sektor-7','280000.00'),
(2,'Vertrieb','Sektor-2','190000.00'),
(3,'Personal','Sektor-1','120000.00'),
(4,'Finanzen','Sektor-4','160000.00'),
(5,'IT-Security','Sektor-9','220000.00'),
(6,'Sondereinheit','Sektor-0','500000.00');
INSERT INTO mitarbeiter VALUES
(1,'Anna Schmidt',1,'Senior-Systemarchitektin',72000.00,'2019-03-15',NULL),
(2,'Ben Mueller',1,'Entwickler',58000.00,'2020-06-01',1),
(3,'Maria Wagner',1,'Junior-Entwicklerin',45000.00,'2022-01-10',1),
(4,'Lisa Fischer',2,'Vertriebsleiterin',52000.00,'2018-07-20',NULL),
(5,'Max Schmidt',3,'HR-Spezialist',48000.00,'2021-04-05',NULL),
(6,'Sarah Keller',4,'Finanzanalystin',40000.00,'2023-02-12',NULL),
(7,'Viktor Shen',5,'Security-Analyst',65000.00,'2017-09-30',NULL),
(8,'Stefan Wolff',6,'Projektleiter',85000.00,'2015-11-01',NULL);
INSERT INTO urlaub VALUES
(1,1,'2024-01-10','2024-01-19',10,1),
(2,2,'2024-07-15','2024-07-20',6,1),
(3,3,'2024-02-05','2024-02-09',5,1),
(4,4,'2024-03-01','2024-03-10',10,1),
(5,5,'2024-04-15','2024-04-20',6,0),
(6,6,'2024-06-01','2024-06-07',7,1);
INSERT INTO bewerbungen VALUES
(1,'Paul Schmitz','paul.schmitz@mail.de',1,'2024-01-10','eingegangen'),
(2,'Tom Meier','tom.meier@mail.de',1,'2024-02-01','abgelehnt'),
(3,'Noah Berger','noah.berger@mail.de',1,'2024-04-20','angebot'),
(4,'Julia Bauer','julia.bauer@mail.de',2,'2024-01-25','eingegangen'),
(5,'Kai Hoffmann','kai.hoffmann@mail.de',3,'2024-03-12','angebot');
`,
};
