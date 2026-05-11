/**
 * Fitness-App-Datensatz.
 * Enthaelt Nutzer, Workouts, Uebungen, Trainingssaetze und Koerperdaten
 * fuer fitnessbezogene SQL-Uebungen.
 */
import type { Dataset } from "@/types/exercise";

export const fitnessDataset: Dataset = {
  id: "fitness",
  name: "Fitness-App",
  description:
    "Eine Fitness-App mit Nutzern, Workouts, Uebungen, Trainingssaetzen und Körperdaten.",
  tables: [
    {
      name: "nutzer",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "geburtsdatum", type: "DATE", nullable: true },
        { name: "gewicht_kg", type: "DECIMAL(5,2)", nullable: true },
        { name: "groesse_cm", type: "INTEGER", nullable: true },
        { name: "registriert_am", type: "DATE", nullable: false },
      ],
    },
    {
      name: "uebungen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "muskelgruppe", type: "VARCHAR(50)", nullable: false },
        { name: "kategorie", type: "VARCHAR(20)", nullable: false },
      ],
    },
    {
      name: "workouts",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "nutzer_id", type: "INTEGER", nullable: false, references: "nutzer.id" },
        { name: "datum", type: "DATE", nullable: false },
        { name: "dauer_min", type: "INTEGER", nullable: false },
        { name: "kalorien_verbrannt", type: "INTEGER", nullable: true },
      ],
    },
    {
      name: "saetze",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "workout_id", type: "INTEGER", nullable: false, references: "workouts.id" },
        { name: "uebung_id", type: "INTEGER", nullable: false, references: "uebungen.id" },
        { name: "wiederholungen", type: "INTEGER", nullable: false },
        { name: "gewicht_kg", type: "DECIMAL(5,2)", nullable: true },
        { name: "satz_nr", type: "INTEGER", nullable: false },
      ],
    },
    {
      name: "koerperdaten",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "nutzer_id", type: "INTEGER", nullable: false, references: "nutzer.id" },
        { name: "datum", type: "DATE", nullable: false },
        { name: "gewicht_kg", type: "DECIMAL(5,2)", nullable: false },
        { name: "koerperfett_prozent", type: "DECIMAL(4,2)", nullable: true },
      ],
    },
  ],
  sql: `CREATE TABLE nutzer (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  geburtsdatum DATE,
  gewicht_kg DECIMAL(5,2),
  groesse_cm INTEGER,
  registriert_am DATE NOT NULL
);
CREATE TABLE uebungen (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  muskelgruppe VARCHAR(50) NOT NULL,
  kategorie VARCHAR(20) NOT NULL
);
CREATE TABLE workouts (
  id INTEGER PRIMARY KEY,
  nutzer_id INTEGER NOT NULL,
  datum DATE NOT NULL,
  dauer_min INTEGER NOT NULL,
  kalorien_verbrannt INTEGER
);
CREATE TABLE saetze (
  id INTEGER PRIMARY KEY,
  workout_id INTEGER NOT NULL,
  uebung_id INTEGER NOT NULL,
  wiederholungen INTEGER NOT NULL,
  gewicht_kg DECIMAL(5,2),
  satz_nr INTEGER NOT NULL
);
CREATE TABLE koerperdaten (
  id INTEGER PRIMARY KEY,
  nutzer_id INTEGER NOT NULL,
  datum DATE NOT NULL,
  gewicht_kg DECIMAL(5,2) NOT NULL,
  koerperfett_prozent DECIMAL(4,2)
);
INSERT INTO nutzer VALUES
(1,'Tim Becker','tim@fitness.de','1990-05-12',78.50,180,'2023-01-10'),
(2,'Nina Schmitz','nina@fitness.de','1985-09-23',62.00,165,'2023-02-15'),
(3,'Oliver Neumann','oliver@fitness.de','1992-11-04',85.00,190,'2023-03-20'),
(4,'Laura Hoffmann','laura@fitness.de','1988-07-18',58.00,170,'2023-04-05'),
(5,'Felix Lang','felix@fitness.de','1995-01-30',72.00,175,'2023-05-12'),
(6,'Sophie Braun','sophie@fitness.de','1991-03-14',66.00,168,'2023-06-18'),
(7,'David Maier','david@fitness.de','1983-12-08',90.00,185,'2023-07-22'),
(8,'Lena Krause','lena@fitness.de','1994-06-25',55.00,162,'2023-08-30');
INSERT INTO uebungen VALUES
(1,'Bankdruecken','Brust','Kraft'),
(2,'Kniebeuge','Beine','Kraft'),
(3,'Kreuzheben','Ruecken','Kraft'),
(4,'Schulterpresse','Schultern','Kraft'),
(5,'Bizep curls','Arme','Kraft'),
(6,'Trizep dips','Arme','Kraft'),
(7,'Laufen','Beine','Cardio'),
(8,'Fahrrad','Beine','Cardio'),
(9,'Rudern','Ruecken','Cardio'),
(10,'Yoga','Ganzkoerper','Flexibilitaet');
INSERT INTO workouts VALUES
(1,1,'2024-01-15',60,450),
(2,2,'2024-01-16',45,320),
(3,3,'2024-01-17',90,700),
(4,4,'2024-01-18',30,200),
(5,5,'2024-01-19',75,550),
(6,6,'2024-01-20',50,380),
(7,7,'2024-01-21',40,280),
(8,8,'2024-01-22',60,420),
(9,1,'2024-01-24',55,460),
(10,2,'2024-01-25',40,290),
(11,3,'2024-01-26',85,650),
(12,4,'2024-01-27',35,220),
(13,5,'2024-01-28',70,530),
(14,6,'2024-01-29',45,340),
(15,7,'2024-01-30',50,350),
(16,8,'2024-01-31',55,400),
(17,1,'2024-02-02',60,470),
(18,2,'2024-02-03',45,310),
(19,3,'2024-02-04',90,720),
(20,4,'2024-02-05',30,210);
INSERT INTO saetze VALUES
(1,1,1,10,80.00,1),
(2,1,1,8,85.00,2),
(3,1,1,6,90.00,3),
(4,1,5,12,15.00,1),
(5,1,5,10,17.50,2),
(6,2,7,30,NULL,1),
(7,2,10,20,NULL,1),
(8,3,2,12,100.00,1),
(9,3,2,10,110.00,2),
(10,3,3,8,120.00,1),
(11,3,4,10,50.00,1),
(12,4,8,40,NULL,1),
(13,4,10,25,NULL,1),
(14,5,1,10,82.50,1),
(15,5,1,8,87.50,2),
(16,5,2,12,105.00,1),
(17,5,5,12,16.00,1),
(18,6,7,35,NULL,1),
(19,6,9,20,NULL,1),
(20,7,2,10,120.00,1),
(21,7,3,8,125.00,1),
(22,8,8,45,NULL,1),
(23,8,7,25,NULL,1),
(24,9,1,10,82.50,1),
(25,9,1,8,87.50,2),
(26,9,5,12,16.50,1),
(27,10,7,32,NULL,1),
(28,10,10,22,NULL,1),
(29,11,2,12,105.00,1),
(30,11,3,8,125.00,1),
(31,11,4,10,52.50,1),
(32,12,8,42,NULL,1),
(33,13,1,10,85.00,1),
(34,13,1,8,90.00,2),
(35,13,2,12,110.00,1),
(36,14,7,38,NULL,1),
(37,14,9,22,NULL,1),
(38,15,2,10,125.00,1),
(39,15,3,8,130.00,1),
(40,16,8,48,NULL,1),
(41,16,7,28,NULL,1),
(42,17,1,10,85.00,1),
(43,17,1,8,90.00,2),
(44,17,5,12,17.00,1),
(45,18,7,35,NULL,1),
(46,18,10,24,NULL,1),
(47,19,2,12,110.00,1),
(48,19,3,8,130.00,1),
(49,20,8,40,NULL,1);
INSERT INTO koerperdaten VALUES
(1,1,'2024-01-01',79.00,18.50),
(2,1,'2024-02-01',78.50,18.20),
(3,1,'2024-03-01',77.80,17.90),
(4,2,'2024-01-01',63.00,24.00),
(5,2,'2024-02-01',62.50,23.50),
(6,2,'2024-03-01',62.00,23.20),
(7,3,'2024-01-01',86.00,22.00),
(8,3,'2024-02-01',85.50,21.80),
(9,3,'2024-03-01',85.00,21.50),
(10,4,'2024-01-01',59.00,25.00),
(11,4,'2024-02-01',58.50,24.50),
(12,4,'2024-03-01',58.00,24.00),
(13,5,'2024-01-01',73.00,20.00),
(14,5,'2024-02-01',72.50,19.80),
(15,5,'2024-03-01',72.00,19.50),
(16,6,'2024-01-01',67.00,23.00),
(17,6,'2024-02-01',66.50,22.50),
(18,6,'2024-03-01',66.00,22.00),
(19,7,'2024-01-01',91.00,25.00),
(20,7,'2024-02-01',90.50,24.50),
(21,7,'2024-03-01',90.00,24.00),
(22,8,'2024-01-01',56.00,22.00),
(23,8,'2024-02-01',55.50,21.50),
(24,8,'2024-03-01',55.00,21.00);
`,
};
