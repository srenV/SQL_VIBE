/**
 * Universitaets-Datensatz.
 * Enthaelt Studenten, Professoren, Kurse, Einschreibungen und Pruefungen
 * fuer universitaetsbezogene SQL-Uebungen.
 */
import type { Dataset } from "@/types/exercise";

export const universityDataset: Dataset = {
  id: "university",
  name: "Universitaet",
  description:
    "Ein Universitaetssystem mit Studenten, Professoren, Kursen, Einschreibungen und Pruefungen.",
  tables: [
    {
      name: "studenten",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "semester", type: "INTEGER", nullable: false },
        { name: "studiengang", type: "VARCHAR(50)", nullable: false },
        { name: "einschreibungsdatum", type: "DATE", nullable: false },
      ],
    },
    {
      name: "professoren",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "fakultaet", type: "VARCHAR(50)", nullable: false },
        { name: "gehalt", type: "DECIMAL(10,2)", nullable: false },
        { name: "eingestellt_am", type: "DATE", nullable: false },
      ],
    },
    {
      name: "kurse",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "professor_id", type: "INTEGER", nullable: false, references: "professoren.id" },
        { name: "credits", type: "INTEGER", nullable: false },
        { name: "semester", type: "VARCHAR(20)", nullable: false },
        { name: "max_teilnehmer", type: "INTEGER", nullable: false },
      ],
    },
    {
      name: "einschreibungen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "student_id", type: "INTEGER", nullable: false, references: "studenten.id" },
        { name: "kurs_id", type: "INTEGER", nullable: false, references: "kurse.id" },
        { name: "note", type: "DECIMAL(3,1)", nullable: true },
        { name: "semester", type: "VARCHAR(20)", nullable: false },
      ],
    },
    {
      name: "pruefungen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "kurs_id", type: "INTEGER", nullable: false, references: "kurse.id" },
        { name: "datum", type: "DATE", nullable: false },
        { name: "art", type: "VARCHAR(20)", nullable: false },
        { name: "max_punkte", type: "INTEGER", nullable: false },
      ],
    },
    {
      name: "pruefungsergebnisse",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "pruefung_id", type: "INTEGER", nullable: false, references: "pruefungen.id" },
        { name: "student_id", type: "INTEGER", nullable: false, references: "studenten.id" },
        { name: "punkte", type: "INTEGER", nullable: false },
        { name: "bestanden", type: "BOOLEAN", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE studenten (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  semester INTEGER NOT NULL,
  studiengang VARCHAR(50) NOT NULL,
  einschreibungsdatum DATE NOT NULL
);
CREATE TABLE professoren (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  fakultaet VARCHAR(50) NOT NULL,
  gehalt DECIMAL(10,2) NOT NULL,
  eingestellt_am DATE NOT NULL
);
CREATE TABLE kurse (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  professor_id INTEGER NOT NULL,
  credits INTEGER NOT NULL,
  semester VARCHAR(20) NOT NULL,
  max_teilnehmer INTEGER NOT NULL
);
CREATE TABLE einschreibungen (
  id INTEGER PRIMARY KEY,
  student_id INTEGER NOT NULL,
  kurs_id INTEGER NOT NULL,
  note DECIMAL(3,1),
  semester VARCHAR(20) NOT NULL
);
CREATE TABLE pruefungen (
  id INTEGER PRIMARY KEY,
  kurs_id INTEGER NOT NULL,
  datum DATE NOT NULL,
  art VARCHAR(20) NOT NULL,
  max_punkte INTEGER NOT NULL
);
CREATE TABLE pruefungsergebnisse (
  id INTEGER PRIMARY KEY,
  pruefung_id INTEGER NOT NULL,
  student_id INTEGER NOT NULL,
  punkte INTEGER NOT NULL,
  bestanden BOOLEAN NOT NULL
);
INSERT INTO studenten VALUES
(1,'Lukas Weber','lukas@uni.de',3,'Informatik','2022-10-01'),
(2,'Marie Schneider','marie@uni.de',5,'Mathematik','2021-10-01'),
(3,'Jonas Braun','jonas@uni.de',2,'Informatik','2023-10-01'),
(4,'Sophie Fischer','sophie@uni.de',7,'Physik','2020-10-01'),
(5,'Tim Mueller','tim@uni.de',1,'Informatik','2024-10-01'),
(6,'Laura Becker','laura@uni.de',4,'Mathematik','2022-04-01'),
(7,'Felix Wagner','felix@uni.de',6,'Physik','2021-04-01'),
(8,'Anna Hoffmann','anna@uni.de',3,'Informatik','2022-10-01'),
(9,'Max Schmitz','max@uni.de',2,'Wirtschaft','2023-10-01'),
(10,'Emma Klein','emma@uni.de',5,'Informatik','2021-10-01'),
(11,'Leon Krause','leon@uni.de',1,'Mathematik','2024-10-01'),
(12,'Hannah Wolf','hannah@uni.de',4,'Wirtschaft','2022-04-01'),
(13,'Julian Maier','julian@uni.de',8,'Informatik','2020-10-01'),
(14,'Sarah Neumann','sarah@uni.de',3,'Physik','2022-10-01'),
(15,'David Hartmann','david@uni.de',6,'Mathematik','2021-04-01');
INSERT INTO professoren VALUES
(1,'Prof. Dr. Mueller','Informatik',8500.00,'2015-03-01'),
(2,'Prof. Dr. Schmidt','Mathematik',7800.00,'2012-06-15'),
(3,'Prof. Dr. Fischer','Physik',8200.00,'2018-09-01'),
(4,'Prof. Dr. Weber','Wirtschaft',7500.00,'2016-01-10'),
(5,'Prof. Dr. Keller','Informatik',9000.00,'2010-11-01');
INSERT INTO kurse VALUES
(1,'Datenbanken',1,6,'WS2024',40),
(2,'Algorithmen',1,6,'WS2024',35),
(3,'Lineare Algebra',2,8,'WS2024',50),
(4,'Analysis I',2,8,'WS2024',45),
(5,'Quantenmechanik',3,6,'WS2024',30),
(6,'BWL Grundlagen',4,4,'WS2024',60),
(7,'Machine Learning',5,6,'WS2024',25),
(8,'Statistik',2,6,'SS2024',40),
(9,'Software Engineering',1,6,'SS2024',30),
(10,'Theoretische Physik',3,8,'SS2024',20);
INSERT INTO einschreibungen VALUES
(1,1,1,2.3,'WS2024'),
(2,1,2,1.7,'WS2024'),
(3,2,3,1.0,'WS2024'),
(4,2,4,1.3,'WS2024'),
(5,3,1,2.7,'WS2024'),
(6,3,2,3.0,'WS2024'),
(7,4,5,1.7,'WS2024'),
(8,5,1,NULL,'WS2024'),
(9,5,2,NULL,'WS2024'),
(10,6,3,2.0,'WS2024'),
(11,6,8,1.3,'SS2024'),
(12,7,5,2.3,'WS2024'),
(13,8,1,1.7,'WS2024'),
(14,8,7,2.0,'WS2024'),
(15,9,6,2.7,'WS2024'),
(16,10,7,1.0,'WS2024'),
(17,10,1,1.3,'WS2024'),
(18,11,3,NULL,'WS2024'),
(19,12,6,2.0,'WS2024'),
(20,13,9,1.7,'SS2024'),
(21,13,1,1.0,'WS2024'),
(22,14,5,2.7,'WS2024'),
(23,15,8,1.3,'SS2024'),
(24,15,3,1.0,'WS2024'),
(25,1,7,2.0,'WS2024');
INSERT INTO pruefungen VALUES
(1,1,'2024-02-15','Klausur',60),
(2,2,'2024-02-20','Klausur',80),
(3,3,'2024-02-10','Klausur',50),
(4,4,'2024-02-12','Klausur',100),
(5,5,'2024-02-18','Muendlich',30),
(6,6,'2024-02-22','Klausur',40),
(7,7,'2024-07-15','Projekt',100),
(8,8,'2024-07-10','Klausur',60);
INSERT INTO pruefungsergebnisse VALUES
(1,1,1,48,1),
(2,1,3,35,1),
(3,1,5,28,0),
(4,1,8,52,1),
(5,1,10,55,1),
(6,1,13,58,1),
(7,2,1,72,1),
(8,2,3,55,1),
(9,2,5,40,0),
(10,2,8,65,1),
(11,3,2,48,1),
(12,3,6,42,1),
(13,3,11,38,1),
(14,3,15,47,1),
(15,4,2,88,1),
(16,4,6,75,1),
(17,5,4,26,1),
(18,5,7,28,1),
(19,5,14,22,0),
(20,7,10,95,1),
(21,7,8,78,1),
(22,8,6,52,1),
(23,8,15,55,1);
`,
};