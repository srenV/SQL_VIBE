/**
 * E-Commerce-Analytics-Datensatz.
 * Enthaelt Kunden, Produkte, Bestellungen, Bewertungen und Marketing-Kampagnen
 * fuer fortgeschrittene Analyse-Uebungen.
 */
import type { Dataset } from "@/types/exercise";

export const ecommerceDataset: Dataset = {
  id: "ecommerce",
  name: "E-Commerce-Analytics",
  description:
    "Ein E-Commerce-System mit Kunden, Produkten, Bestellungen, Bewertungen und Marketing-Kampagnen fuer fortgeschrittene Analyse-Uebungen.",
  tables: [
    {
      name: "kunden",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "stadt", type: "VARCHAR(50)", nullable: true },
        { name: "land", type: "VARCHAR(50)", nullable: false },
        { name: "registriert_am", type: "DATE", nullable: false },
        { name: "ist_premium", type: "BOOLEAN", nullable: false },
      ],
    },
    {
      name: "produkte",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "kategorie", type: "VARCHAR(50)", nullable: false },
        { name: "preis", type: "DECIMAL(10,2)", nullable: false },
        { name: "hersteller", type: "VARCHAR(80)", nullable: true },
        { name: "bewertung", type: "DECIMAL(3,2)", nullable: true },
      ],
    },
    {
      name: "bestellungen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "kunde_id", type: "INTEGER", nullable: false, references: "kunden.id" },
        { name: "datum", type: "DATE", nullable: false },
        { name: "gesamtbetrag", type: "DECIMAL(10,2)", nullable: false },
        { name: "status", type: "VARCHAR(20)", nullable: false },
        { name: "versandart", type: "VARCHAR(30)", nullable: false },
      ],
    },
    {
      name: "bestellpositionen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "bestellung_id", type: "INTEGER", nullable: false, references: "bestellungen.id" },
        { name: "produkt_id", type: "INTEGER", nullable: false, references: "produkte.id" },
        { name: "menge", type: "INTEGER", nullable: false },
        { name: "einzelpreis", type: "DECIMAL(10,2)", nullable: false },
      ],
    },
    {
      name: "bewertungen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "kunde_id", type: "INTEGER", nullable: false, references: "kunden.id" },
        { name: "produkt_id", type: "INTEGER", nullable: false, references: "produkte.id" },
        { name: "sterne", type: "INTEGER", nullable: false },
        { name: "kommentar", type: "TEXT", nullable: true },
        { name: "datum", type: "DATE", nullable: false },
      ],
    },
    {
      name: "kampagnen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "typ", type: "VARCHAR(30)", nullable: false },
        { name: "startdatum", type: "DATE", nullable: false },
        { name: "enddatum", type: "DATE", nullable: false },
        { name: "budget", type: "DECIMAL(12,2)", nullable: false },
        { name: "klicks", type: "INTEGER", nullable: false },
        { name: "konversionen", type: "INTEGER", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE kunden (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  stadt VARCHAR(50),
  land VARCHAR(50) NOT NULL,
  registriert_am DATE NOT NULL,
  ist_premium BOOLEAN NOT NULL
);
CREATE TABLE produkte (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  kategorie VARCHAR(50) NOT NULL,
  preis DECIMAL(10,2) NOT NULL,
  hersteller VARCHAR(80),
  bewertung DECIMAL(3,2)
);
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL REFERENCES kunden(id),
  datum DATE NOT NULL,
  gesamtbetrag DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  versandart VARCHAR(30) NOT NULL
);
CREATE TABLE bestellpositionen (
  id INTEGER PRIMARY KEY,
  bestellung_id INTEGER NOT NULL REFERENCES bestellungen(id),
  produkt_id INTEGER NOT NULL REFERENCES produkte(id),
  menge INTEGER NOT NULL,
  einzelpreis DECIMAL(10,2) NOT NULL
);
CREATE TABLE bewertungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL REFERENCES kunden(id),
  produkt_id INTEGER NOT NULL REFERENCES produkte(id),
  sterne INTEGER NOT NULL,
  kommentar TEXT,
  datum DATE NOT NULL
);
CREATE TABLE kampagnen (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  typ VARCHAR(30) NOT NULL,
  startdatum DATE NOT NULL,
  enddatum DATE NOT NULL,
  budget DECIMAL(12,2) NOT NULL,
  klicks INTEGER NOT NULL,
  konversionen INTEGER NOT NULL
);
INSERT INTO kunden VALUES
(1,'Anna Bauer','anna@beispiel.de','Berlin','Deutschland','2023-01-15',1),
(2,'Ben Schneider','ben@beispiel.de','Muenchen','Deutschland','2023-03-20',0),
(3,'Clara Hofmann','clara@beispiel.de','Wien','Oesterreich','2023-05-10',1),
(4,'David Klein','david@beispiel.de','Zuerich','Schweiz','2023-07-05',0),
(5,'Eva Mueller','eva@beispiel.de','Hamburg','Deutschland','2023-09-12',1),
(6,'Felix Wolf','felix@beispiel.de','Salzburg','Oesterreich','2023-11-18',0),
(7,'Greta Fischer','greta@beispiel.de','Koeln','Deutschland','2024-01-22',0),
(8,'Hans Wagner','hans@beispiel.de','Bern','Schweiz','2024-03-30',1),
(9,'Ina Becker','ina@beispiel.de','Frankfurt','Deutschland','2024-05-14',0),
(10,'Jan Schmitz','jan@beispiel.de','Graz','Oesterreich','2024-07-01',0);
INSERT INTO produkte VALUES
(1,'Laptop Pro 15','Elektronik',1199.00,'TechCorp',4.50),
(2,'Wireless Maus','Elektronik',39.99,'InputCo',4.20),
(3,'Mechanische Tastatur','Elektronik',129.00,'KeyMaster',4.60),
(4,'Bürostuhl Comfort','Moebel',349.00,'SitWell',4.30),
(5,'Schreibtisch Eiche','Moebel',599.00,'WoodCraft',4.10),
(6,'Monitor 27 Zoll','Elektronik',399.00,'ViewMax',4.40),
(7,'USB-C Hub','Elektronik',59.99,'ConnectAll',4.00),
(8,'Webcam HD','Elektronik',89.99,'StreamPro',3.80),
(9,'Kopfstuetze Memory','Moebel',79.00,'SitWell',4.50),
(10,'Buecherregal','Moebel',249.00,'WoodCraft',4.20),
(11,'Noise-Cancelling Kopfhoerer','Elektronik',249.00,'AudioMax',4.70),
(12,'Standing Desk','Moebel',449.00,'ErgoUp',4.60);
INSERT INTO bestellungen VALUES
(1,1,'2024-01-20',1238.99,'geliefert','Express'),
(2,1,'2024-03-15',168.99,'geliefert','Standard'),
(3,2,'2024-02-10',59.99,'geliefert','Standard'),
(4,3,'2024-01-25',1567.99,'geliefert','Express'),
(5,3,'2024-04-01',449.00,'geliefert','Standard'),
(6,4,'2024-03-05',89.99,'storniert','Standard'),
(7,5,'2024-02-20',798.00,'geliefert','Express'),
(8,5,'2024-05-10',39.99,'in_bearbeitung','Standard'),
(9,6,'2024-04-15',399.00,'geliefert','Standard'),
(10,7,'2024-03-28',129.00,'geliefert','Standard'),
(11,8,'2024-04-05',1598.99,'geliefert','Express'),
(12,8,'2024-06-12',59.99,'in_bearbeitung','Standard'),
(13,9,'2024-05-20',599.00,'geliefert','Standard'),
(14,10,'2024-06-01',249.00,'geliefert','Standard'),
(15,1,'2024-06-15',449.00,'in_bearbeitung','Express');
INSERT INTO bestellpositionen VALUES
(1,1,1,1,1199.00),
(2,1,2,1,39.99),
(3,2,3,1,129.00),
(4,2,9,1,79.00),
(5,3,2,1,39.99),
(6,4,1,1,1199.00),
(7,4,6,1,399.00),
(8,4,7,1,59.99),
(9,5,12,1,449.00),
(10,6,8,1,89.99),
(11,7,11,1,249.00),
(12,7,6,1,399.00),
(13,7,3,1,129.00),
(14,8,2,1,39.99),
(15,9,6,1,399.00),
(16,10,3,1,129.00),
(17,11,1,1,1199.00),
(18,11,3,1,129.00),
(19,11,11,1,249.00),
(20,12,7,1,59.99),
(21,13,5,1,599.00),
(22,14,11,1,249.00),
(23,15,12,1,449.00);
INSERT INTO bewertungen VALUES
(1,1,1,5,'Hervorragendes Geraet','2024-02-01'),
(2,1,3,4,'Gutes Schreibgefuehl','2024-03-20'),
(3,2,2,3,'In Ordnung','2024-02-15'),
(4,3,1,5,'Schnell und zuverlaessig','2024-02-01'),
(5,3,6,4,'Gute Bildqualitaet','2024-04-10'),
(6,4,8,2,'Mittelmassig','2024-03-15'),
(7,5,11,5,'Bester Sound','2024-02-28'),
(8,5,7,4,'Praktisch','2024-05-20'),
(9,6,6,4,'Scharfes Bild','2024-04-20'),
(10,7,3,5,'Lieblingstastatur','2024-04-05'),
(11,8,1,4,'Solide Leistung','2024-04-15'),
(12,8,12,5,'Perfekt fuer Homeoffice','2024-06-20'),
(13,9,5,4,'Stabiler Schreibtisch','2024-05-28'),
(14,10,11,4,'Gute Geraeuschunterdrueckung','2024-06-10');
INSERT INTO kampagnen VALUES
(1,'Sommer-Sale 2024','rabatt','2024-06-01','2024-06-30',15000.00,45000,2800),
(2,'Fruehlings-Aktion','rabatt','2024-03-01','2024-03-31',8000.00,22000,1300),
(3,'Neukunden-Willkommen','banner','2024-01-01','2024-12-31',20000.00,85000,4200),
(4,'Black Friday 2024','rabatt','2024-11-22','2024-11-29',25000.00,120000,9500),
(5,'Premium-Launch','email','2024-04-01','2024-04-30',5000.00,15000,800),
(6,'Rueckkehr-Kampagne','email','2024-02-01','2024-02-28',3000.00,10000,500),
(7,'Weihnachten 2024','banner','2024-12-01','2024-12-24',18000.00,95000,7200);
`,
};