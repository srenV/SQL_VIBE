import type { Dataset } from "@/types/exercise";

/**
 * Shop-Datensatz: Kunden, Bestellungen, Produkte, Kategorien, Zahlungen.
 */
export const shopDataset: Dataset = {
  id: "shop",
  name: "Online-Shop",
  description:
    "Ein kleiner Online-Shop mit Kunden, Produkten, Kategorien, Bestellungen und Zahlungen.",
  tables: [
    {
      name: "kunden",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "stadt", type: "VARCHAR(50)", nullable: true },
        { name: "registriert_am", type: "DATE", nullable: false },
      ],
    },
    {
      name: "kategorien",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(50)", nullable: false },
      ],
    },
    {
      name: "produkte",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "kategorie_id", type: "INTEGER", nullable: false, references: "kategorien.id" },
        { name: "preis", type: "DECIMAL(10,2)", nullable: false },
        { name: "lagerbestand", type: "INTEGER", nullable: false },
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
      name: "zahlungen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "bestellung_id", type: "INTEGER", nullable: false, references: "bestellungen.id" },
        { name: "betrag", type: "DECIMAL(10,2)", nullable: false },
        { name: "zahlungsmittel", type: "VARCHAR(20)", nullable: false },
        { name: "zahlungsdatum", type: "DATE", nullable: false },
      ],
    },
  ],
  sql: `
CREATE TABLE kunden (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  stadt VARCHAR(50),
  registriert_am DATE NOT NULL
);
CREATE TABLE kategorien (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);
CREATE TABLE produkte (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  kategorie_id INTEGER NOT NULL,
  preis DECIMAL(10,2) NOT NULL,
  lagerbestand INTEGER NOT NULL
);
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL,
  datum DATE NOT NULL,
  gesamtbetrag DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL
);
CREATE TABLE bestellpositionen (
  id INTEGER PRIMARY KEY,
  bestellung_id INTEGER NOT NULL,
  produkt_id INTEGER NOT NULL,
  menge INTEGER NOT NULL,
  einzelpreis DECIMAL(10,2) NOT NULL
);
CREATE TABLE zahlungen (
  id INTEGER PRIMARY KEY,
  bestellung_id INTEGER NOT NULL,
  betrag DECIMAL(10,2) NOT NULL,
  zahlungsmittel VARCHAR(20) NOT NULL,
  zahlungsdatum DATE NOT NULL
);
INSERT INTO kunden VALUES
(1,'Max Mustermann','max@beispiel.de','Berlin','2023-01-15'),
(2,'Erika Musterfrau','erika@beispiel.de','Muenchen','2023-02-20'),
(3,'Hans Schmidt','hans@beispiel.de','Berlin','2023-03-10'),
(4,'Anna Mueller','anna@beispiel.de','Hamburg','2023-04-05'),
(5,'Peter Weber','peter@beispiel.de','Muenchen','2023-05-12'),
(6,'Lisa Fischer','lisa@beispiel.de','Koeln','2023-06-18'),
(7,'Thomas Bauer','thomas@beispiel.de','Berlin','2023-07-22'),
(8,'Sarah Keller','sarah@beispiel.de','Hamburg','2023-08-30'),
(9,'Markus Wolf','markus@beispiel.de','Muenchen','2023-09-14'),
(10,'Julia Krause','julia@beispiel.de','Koeln','2023-10-01');
INSERT INTO kategorien VALUES
(1,'Elektronik'),
(2,'Buecher'),
(3,'Kleidung'),
(4,'Sport'),
(5,'Haushalt');
INSERT INTO produkte VALUES
(1,'Laptop',1,899.00,15),
(2,'Smartphone',1,599.00,30),
(3,'Kopfhoerer',1,129.00,50),
(4,'SQL fuer Dummies',2,24.99,100),
(5,'Roman: Die Abenteuer',2,14.99,80),
(6,'Kochbuch',2,19.99,60),
(7,'T-Shirt',3,19.99,200),
(8,'Jeans',3,49.99,120),
(9,'Laufschuhe',4,89.99,80),
(10,'Yogamatte',4,29.99,150),
(11,'Staubsauger',5,199.00,25),
(12,'Kaffeemaschine',5,79.99,40);
INSERT INTO bestellungen VALUES
(1,1,'2024-01-10',1028.99,'abgeschlossen'),
(2,2,'2024-01-15',599.00,'abgeschlossen'),
(3,3,'2024-01-20',44.98,'abgeschlossen'),
(4,4,'2024-02-05',199.00,'versendet'),
(5,5,'2024-02-12',119.98,'versendet'),
(6,6,'2024-02-18',929.99,'bearbeitung'),
(7,7,'2024-03-01',149.98,'abgeschlossen'),
(8,8,'2024-03-08',599.00,'storniert'),
(9,9,'2024-03-15',89.99,'abgeschlossen'),
(10,10,'2024-03-20',49.99,'versendet'),
(11,1,'2024-04-02',129.00,'abgeschlossen'),
(12,3,'2024-04-10',79.99,'versendet'),
(13,5,'2024-04-15',199.00,'bearbeitung'),
(14,7,'2024-04-22',59.98,'abgeschlossen'),
(15,9,'2024-05-01',929.99,'abgeschlossen');
INSERT INTO bestellpositionen VALUES
(1,1,1,1,899.00),
(2,1,3,1,129.00),
(3,2,2,1,599.00),
(4,3,4,1,24.99),
(5,3,5,1,14.99),
(6,3,6,1,4.99),
(7,4,11,1,199.00),
(8,5,7,2,19.99),
(9,5,10,2,29.99),
(10,6,1,1,899.00),
(11,6,3,1,29.99),
(12,7,9,1,89.99),
(13,7,10,2,29.99),
(14,8,2,1,599.00),
(15,9,9,1,89.99),
(16,10,8,1,49.99),
(17,11,3,1,129.00),
(18,12,12,1,79.99),
(19,13,11,1,199.00),
(20,14,7,3,19.99),
(21,15,1,1,899.00),
(22,15,3,1,29.99);
INSERT INTO zahlungen VALUES
(1,1,1028.99,'Kreditkarte','2024-01-10'),
(2,2,599.00,'PayFlow','2024-01-15'),
(3,3,44.98,'Kreditkarte','2024-01-20'),
(4,4,199.00,'Ueberweisung','2024-02-06'),
(5,5,119.98,'PayFlow','2024-02-12'),
(6,6,929.99,'Kreditkarte','2024-02-18'),
(7,7,149.98,'PayFlow','2024-03-01'),
(8,8,599.00,'Kreditkarte','2024-03-08'),
(9,9,89.99,'Ueberweisung','2024-03-16'),
(10,10,49.99,'PayFlow','2024-03-20'),
(11,11,129.00,'Kreditkarte','2024-04-02'),
(12,12,79.99,'Ueberweisung','2024-04-11'),
(13,13,199.00,'PayFlow','2024-04-15'),
(14,14,59.98,'Kreditkarte','2024-04-22'),
(15,15,929.99,'Kreditkarte','2024-05-01');
`,
};
