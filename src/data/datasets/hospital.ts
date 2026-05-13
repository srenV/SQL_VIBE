/**
 * Krankenhaus-Verwaltungsdatensatz.
 * Enthaelt Patienten, Aerzte, Abteilungen, Behandlungen und Rechnungen
 * fuer komplexe JOIN- und Analyse-Uebungen.
 */
import type { Dataset } from "@/types/exercise";

export const hospitalDataset: Dataset = {
  id: "hospital",
  name: "Krankenhaus-Verwaltung",
  description:
    "Ein Krankenhaus-System mit Patienten, Aerzten, Abteilungen, Behandlungen und Rechnungen fuer komplexe JOIN- und Analyse-Uebungen.",
  tables: [
    {
      name: "abteilungen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(50)", nullable: false },
        { name: "etage", type: "INTEGER", nullable: false },
        { name: "bettenanzahl", type: "INTEGER", nullable: false },
      ],
    },
    {
      name: "aerzte",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "abteilung_id", type: "INTEGER", nullable: false, references: "abteilungen.id" },
        { name: "position", type: "VARCHAR(30)", nullable: false },
        { name: "gehalt", type: "DECIMAL(10,2)", nullable: false },
        { name: "eingestellt_am", type: "DATE", nullable: false },
      ],
    },
    {
      name: "patienten",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "geburtsdatum", type: "DATE", nullable: false },
        { name: "geschlecht", type: "VARCHAR(10)", nullable: false },
        { name: "adresse", type: "VARCHAR(200)", nullable: true },
        { name: "versichert", type: "BOOLEAN", nullable: false },
      ],
    },
    {
      name: "behandlungen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "patient_id", type: "INTEGER", nullable: false, references: "patienten.id" },
        { name: "arzt_id", type: "INTEGER", nullable: false, references: "aerzte.id" },
        { name: "diagnose", type: "VARCHAR(200)", nullable: false },
        { name: "behandlungsdatum", type: "DATE", nullable: false },
        { name: "dauer_tage", type: "INTEGER", nullable: false },
        { name: "kosten", type: "DECIMAL(10,2)", nullable: false },
      ],
    },
    {
      name: "rechnungen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "patient_id", type: "INTEGER", nullable: false, references: "patienten.id" },
        { name: "betrag", type: "DECIMAL(10,2)", nullable: false },
        { name: "status", type: "VARCHAR(20)", nullable: false },
        { name: "rechnungsdatum", type: "DATE", nullable: false },
        { name: "faelligkeitsdatum", type: "DATE", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE abteilungen (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  etage INTEGER NOT NULL,
  bettenanzahl INTEGER NOT NULL
);
CREATE TABLE aerzte (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  abteilung_id INTEGER NOT NULL REFERENCES abteilungen(id),
  position VARCHAR(30) NOT NULL,
  gehalt DECIMAL(10,2) NOT NULL,
  eingestellt_am DATE NOT NULL
);
CREATE TABLE patienten (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  geburtsdatum DATE NOT NULL,
  geschlecht VARCHAR(10) NOT NULL,
  adresse VARCHAR(200),
  versichert BOOLEAN NOT NULL
);
CREATE TABLE behandlungen (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patienten(id),
  arzt_id INTEGER NOT NULL REFERENCES aerzte(id),
  diagnose VARCHAR(200) NOT NULL,
  behandlungsdatum DATE NOT NULL,
  dauer_tage INTEGER NOT NULL,
  kosten DECIMAL(10,2) NOT NULL
);
CREATE TABLE rechnungen (
  id INTEGER PRIMARY KEY,
  patient_id INTEGER NOT NULL REFERENCES patienten(id),
  betrag DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  rechnungsdatum DATE NOT NULL,
  faelligkeitsdatum DATE NOT NULL
);
INSERT INTO abteilungen VALUES
(1,'Kardiologie',3,40),
(2,'Neurologie',4,35),
(3,'Chirurgie',2,50),
(4,'Paediatrie',5,30),
(5,'Innere Medizin',1,60),
(6,'Notaufnahme',0,20);
INSERT INTO aerzte VALUES
(1,'Dr. Herz','Kardiologie','Chefarzt',15000.00,'2015-03-01'),
(2,'Dr. Nerv','Neurologie','Oberarzt',12000.00,'2016-06-15'),
(3,'Dr. Schnitt','Chirurgie','Chefarzt',16000.00,'2014-01-10'),
(4,'Dr. Kind','Paediatrie','Facharzt',9500.00,'2019-09-01'),
(5,'Dr. Allgemeinn','Innere Medizin','Oberarzt',11000.00,'2017-11-01'),
(6,'Dr. Puls','Kardiologie','Facharzt',10000.00,'2020-02-15'),
(7,'Dr. Brain','Neurologie','Facharzt',9800.00,'2021-04-01'),
(8,'Dr. Knochen','Chirurgie','Assistenzarzt',7500.00,'2022-08-01'),
(9,'Dr. Wund','Chirurgie','Facharzt',10500.00,'2018-05-10'),
(10,'Dr. Haus','Innere Medizin','Chefarzt',14500.00,'2013-07-01');
INSERT INTO patienten VALUES
(1,'Karl Herzberg','1950-03-15','m','Hauptstr. 1, Berlin',1),
(2,'Helga Muellerin','1945-07-22','f','Parkweg 5, Hamburg',1),
(3,'Peter Schmerz','1988-11-04','m','Ringstr. 12, Muenchen',0),
(4,'Maria Gesund','1995-05-18','f','Marktplatz 3, Koeln',1),
(5,'Stefan Knochen','1970-09-30','m','Lindenallee 8, Stuttgart',1),
(6,'Ingrid Pfundig','1960-01-14','f','Rosenweg 2, Frankfurt',0),
(7,'Thomas Fieber','1992-12-08','m','Kirchstr. 7, Dresden',1),
(8,'Sabine Ruhig','1982-04-25','f','Eichenweg 4, Bremen',1),
(9,'Wolfgang Stark','1978-06-30','m','Goethestr. 10, Leipzig',0),
(10,'Petra Leicht','1990-08-16','f','Schillerstr. 6, Nuernberg',1);
INSERT INTO behandlungen VALUES
(1,1,1,'Herzrhythmusstoerung','2024-01-15',5,3500.00),
(2,2,5,'Diabetes-Kontrolle','2024-01-20',3,1800.00),
(3,3,3,'Appendizitis','2024-02-05',7,5200.00),
(4,4,4,'Kinderuntersuchung','2024-01-10',1,450.00),
(5,5,9,'Knochenbruch','2024-02-15',10,4800.00),
(6,6,5,'Bluthochdruck','2024-01-25',4,2200.00),
(7,7,6,'Herzkatheter-Untersuchung','2024-03-01',3,6000.00),
(8,8,2,'Migraene','2024-02-10',2,1500.00),
(9,9,3,'Gallenstein','2024-03-05',5,3500.00),
(10,10,5,'Allergie-Test','2024-01-30',1,600.00),
(11,1,6,'Herzklappen-Check','2024-04-01',2,4200.00),
(12,3,8,'Nachbehandlung','2024-03-10',3,1800.00),
(13,5,3,'Rehabilitation','2024-03-20',14,7200.00),
(14,7,1,'EKG- Kontrolle','2024-04-15',1,800.00),
(15,8,7,'CT-Untersuchung','2024-03-12',1,2500.00);
INSERT INTO rechnungen VALUES
(1,1,3500.00,'bezahlt','2024-02-01','2024-03-01'),
(2,2,1800.00,'bezahlt','2024-02-20','2024-03-20'),
(3,3,5200.00,'offen','2024-03-05','2024-04-05'),
(4,4,450.00,'bezahlt','2024-02-10','2024-03-10'),
(5,5,4800.00,'offen','2024-03-15','2024-04-15'),
(6,6,2200.00,'bezahlt','2024-02-25','2024-03-25'),
(7,7,6000.00,'offen','2024-04-01','2024-05-01'),
(8,8,1500.00,'ueberfaellig','2024-03-10','2024-04-10'),
(9,9,3500.00,'bezahlt','2024-04-05','2024-05-05'),
(10,10,600.00,'bezahlt','2024-03-01','2024-04-01'),
(11,11,4200.00,'offen','2024-05-01','2024-06-01'),
(12,12,1800.00,'bezahlt','2024-04-10','2024-05-10'),
(13,13,7200.00,'offen','2024-04-20','2024-05-20'),
(14,14,800.00,'bezahlt','2024-05-15','2024-06-15'),
(15,15,2500.00,'ueberfaellig','2024-04-12','2024-05-12');
`,
};