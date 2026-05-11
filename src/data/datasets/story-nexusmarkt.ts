import type { Dataset } from "@/types/exercise";

export const storyNexusMarktDataset: Dataset = {
  id: "story-nexusmarkt",
  name: "NexusMarkt-Handelssystem",
  description: "Story-exklusive Shop-Datenbank fuer den Fall 'Phantom-Transaktionen im NexusMarkt'.",
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
  sql: `CREATE TABLE kunden (
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
(1,'Max Fischer','max@nexus.ost','Ost-Block-1','2088-01-10'),
(2,'Anna Mueller','anna@nexus.ost','Ost-Block-2','2088-02-15'),
(3,'Peter Schmidt','peter@nexus.ost','Ost-Block-1','2088-03-20'),
(4,'Klaus Wagner','klaus@nexus.ost','Ost-Block-3','2088-04-05'),
(5,'Sarah Keller','sarah@nexus.ost','Ost-Block-2','2088-05-12'),
(6,'Michael Braun','m.braun@nexus.ost','Ost-Block-0','2088-06-18'),
(7,'Julia Koch','julia@nexus.ost','Ost-Block-4','2088-07-22'),
(8,'Thomas Berg','thomas@nexus.ost','Ost-Block-3','2088-08-30'),
(9,'Lisa Wolf','lisa@nexus.ost','Ost-Block-1','2088-09-14'),
(10,'David Hoffmann','david@nexus.ost','Ost-Block-5','2088-10-01');
INSERT INTO kategorien VALUES
(1,'Elektronik'),
(2,'Kleidung'),
(3,'Haushalt'),
(4,'Sport'),
(5,'Lebensmittel');
INSERT INTO produkte VALUES
(1,'Laptop Pro 15',1,599.00,12),
(2,'Smartphone Basic',1,299.00,25),
(3,'Kopfhoerer kabellos',1,89.00,40),
(4,'T-Shirt Standard',2,24.99,100),
(5,'Laufschuhe Sport',4,69.99,30),
(6,'Kaffeemaschine 2000',3,89.99,18),
(7,'Fitness-Tracker',4,49.99,35),
(8,'USB-C Ladekabel',1,12.99,200),
(9,'Laptop-Tasche',1,39.99,60),
(10,'Phantom Module X',1,199.99,3),
(11,'Shadow Adapter Pro',1,149.99,2),
(12,'Ghost Device Alpha',1,249.99,1);
INSERT INTO bestellungen VALUES
(1,1,'2024-01-15',89.99,'abgeschlossen'),
(2,2,'2024-01-20',149.99,'abgeschlossen'),
(3,2,'2024-02-05',89.00,'abgeschlossen'),
(4,4,'2024-02-08',24.99,'abgeschlossen'),
(5,6,'2024-02-10',798.99,'abgeschlossen'),
(6,6,'2024-02-11',449.99,'abgeschlossen'),
(7,6,'2024-02-11',339.99,'abgeschlossen'),
(8,5,'2024-03-08',599.00,'storniert'),
(9,2,'2024-03-10',49.99,'abgeschlossen'),
(10,4,'2024-03-15',89.99,'abgeschlossen'),
(11,7,'2024-03-20',69.99,'abgeschlossen'),
(12,6,'2024-03-22',52.98,'abgeschlossen'),
(13,7,'2024-03-25',12.99,'abgeschlossen'),
(14,2,'2024-04-01',39.99,'abgeschlossen'),
(15,8,'2024-04-05',12.99,'abgeschlossen');
INSERT INTO bestellpositionen VALUES
(1,1,6,1,89.99),
(2,2,3,1,89.00),
(3,2,8,2,12.99),
(4,2,9,1,39.99),
(5,3,3,1,89.00),
(6,4,4,1,24.99),
(7,5,1,1,599.00),
(8,5,10,1,199.99),
(9,6,2,1,299.00),
(10,6,11,1,149.99),
(11,7,3,1,89.00),
(12,7,12,1,249.99),
(13,8,1,1,599.00),
(14,9,7,1,49.99),
(15,10,6,1,89.99),
(16,11,5,1,69.99),
(17,12,4,1,24.99),
(18,12,5,1,27.99),
(19,13,8,1,12.99),
(20,14,9,1,39.99),
(21,15,8,1,12.99);
INSERT INTO zahlungen VALUES
(1,1,89.99,'PayPal','2024-01-15'),
(2,2,149.99,'Kreditkarte','2024-01-20'),
(3,3,89.00,'PayPal','2024-02-05'),
(4,4,24.99,'PayPal','2024-02-08'),
(5,5,798.99,'Kreditkarte','2024-02-10'),
(6,6,449.99,'Kreditkarte','2024-02-11'),
(7,7,339.99,'Kreditkarte','2024-02-11'),
(8,8,599.00,'Kreditkarte','2024-03-08'),
(9,9,49.99,'PayPal','2024-03-10'),
(10,10,89.99,'Ueberweisung','2024-03-15'),
(11,11,69.99,'PayPal','2024-03-20'),
(12,12,52.98,'Kreditkarte','2024-03-22'),
(13,13,12.99,'PayPal','2024-03-25'),
(14,14,39.99,'PayPal','2024-04-01'),
(15,15,12.99,'PayPal','2024-04-05');
`,
};
