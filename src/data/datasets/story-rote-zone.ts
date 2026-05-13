import type { Dataset } from "@/types/exercise";

export const storyRoteZoneDataset: Dataset = {
  id: "story-rote-zone",
  name: "MedGov-Krankenhaus",
  description: "Story-exklusive Krankenhausdatenbank fuer den Fall 'Die rote Zone'.",
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
(1,'Chirurgie',3,20),
(2,'Kardiologie',2,15),
(3,'Innere Medizin',1,25),
(4,'Paediatrie',4,18),
(5,'Orthopaedie',2,12),
(6,'Allgemeinmedizin',1,30);
INSERT INTO aerzte VALUES
(1,'Dr. Schnitt',1,'Chefarzt',16000.00,'2010-03-15'),
(2,'Dr. Herz',2,'Chefarzt',15000.00,'2012-07-01'),
(3,'Dr. Meyer',3,'Oberarzt',12000.00,'2015-01-20'),
(4,'Dr. Klein',4,'Chefarzt',13500.00,'2011-09-10'),
(5,'Dr. Braun',6,'Assistenzarzt',8500.00,'2020-03-01'),
(6,'Dr. Hoffmann',5,'Oberarzt',11000.00,'2016-06-15'),
(7,'Dr. Werner',3,'Assistenzarzt',8000.00,'2022-01-10'),
(8,'Dr. Gruber',1,'Assistenzarzt',9000.00,'2021-08-20'),
(9,'Dr. Baum',2,'Oberarzt',12500.00,'2014-04-05'),
(10,'Dr. Frost',6,'Assistenzarzt',8200.00,'2023-02-28');
INSERT INTO patienten VALUES
(1,'Stefan Knochen','1985-04-12','maennlich','Hauptstr. 5, Ost-Block-1',1),
(2,'Peter Schmerz','1990-08-22','maennlich','Ringstr. 8, Ost-Block-2',0),
(3,'Thomas Fieber','1978-11-15','maennlich','Lindenweg 3, Ost-Block-3',1),
(4,'Maria Kurz','1995-02-28','weiblich','Gartenstr. 12, Ost-Block-1',1),
(5,'Ingrid Pfundig','1982-07-04','weiblich','Marktplatz 7, Ost-Block-4',0),
(6,'Wolfgang Stark','1975-12-30','maennlich','Bahnhofstr. 2, Ost-Block-2',0),
(7,'Claudia Bein','1988-05-16','weiblich','Rosenweg 4, Ost-Block-3',1),
(8,'Karl Nerv','1970-09-08','maennlich','Kirchstr. 9, Ost-Block-5',1),
(9,'Sandra Herz','1993-01-25','weiblich','Eichenweg 6, Ost-Block-1',1),
(10,'Bruno Lung','1965-06-18','maennlich','Wiesenstr. 11, Ost-Block-2',1);
INSERT INTO behandlungen VALUES
(1,1,1,'Rehabilitation nach Unfall',  '2091-01-10',14,7200.00),
(2,1,1,'Knochenbruch Oberschenkel',   '2091-03-05',10,4800.00),
(3,2,1,'Appendizitis',                '2091-02-14',7, 5200.00),
(4,3,2,'Herzrhythmusstörung',         '2091-01-20',3, 3800.00),
(5,5,3,'Bluthochdruck',               '2091-02-10',2, 2200.00),
(6,6,3,'Gallenstein',                 '2091-03-01',4, 3500.00),
(7,4,4,'Mandelentzuendung',           '2091-01-15',2, 1800.00),
(8,7,6,'Erkältung komplex',           '2091-02-20',2, 1400.00),
(9,8,2,'Koronare Herzerkrankung',     '2091-03-10',3, 4100.00),
(10,9,3,'Magengeschwür',              '2091-01-25',3, 2400.00),
(11,10,1,'Blinddarmentzuendung',      '2091-02-05',2, 4200.00),
(12,2,5,'Nachbehandlung Appendizitis','2091-03-20',2, 1800.00),
(13,3,2,'Kontrolluntersuchung',       '2091-04-01',1, 800.00),
(14,8,3,'Blutdruckkontrolle',         '2091-04-05',1, 600.00),
(15,4,6,'Nachsorge',                  '2091-04-10',1, 600.00);
INSERT INTO rechnungen VALUES
(1,3,6000.00,'offen',  '2091-02-01','2091-03-01'),
(2,2,5200.00,'offen',  '2091-03-01','2091-04-01'),
(3,1,4800.00,'offen',  '2091-03-15','2091-04-15'),
(4,1,7200.00,'bezahlt','2091-01-25','2091-02-25'),
(5,4,1800.00,'bezahlt','2091-01-20','2091-02-20'),
(6,5,2200.00,'bezahlt','2091-02-15','2091-03-15'),
(7,6,3500.00,'bezahlt','2091-03-10','2091-04-10'),
(8,8,4100.00,'bezahlt','2091-03-20','2091-04-20'),
(9,9,2400.00,'bezahlt','2091-02-05','2091-03-05'),
(10,10,4200.00,'bezahlt','2091-02-15','2091-03-15'),
(11,7,1400.00,'bezahlt','2091-03-01','2091-04-01'),
(12,2,1800.00,'ausstehend','2091-03-25','2091-04-25');
`,
};
