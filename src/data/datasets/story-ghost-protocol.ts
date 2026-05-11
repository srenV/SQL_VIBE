import type { Dataset } from "@/types/exercise";

export const storyGhostProtocolDataset: Dataset = {
  id: "story-ghost-protocol",
  name: "Sigma-E-Commerce",
  description: "Story-exklusive E-Commerce-Datenbank fuer den Fall 'Ghost Protocol Sigma'.",
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
  kunde_id INTEGER NOT NULL,
  datum DATE NOT NULL,
  gesamtbetrag DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  versandart VARCHAR(30) NOT NULL
);
CREATE TABLE bestellpositionen (
  id INTEGER PRIMARY KEY,
  bestellung_id INTEGER NOT NULL,
  produkt_id INTEGER NOT NULL,
  menge INTEGER NOT NULL,
  einzelpreis DECIMAL(10,2) NOT NULL
);
CREATE TABLE bewertungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL,
  produkt_id INTEGER NOT NULL,
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
(1,'Anna Bauer','anna@sigma.net','Berlin','DE','2091-01-10',1),
(2,'Clara Hofmann','clara@sigma.net','Hamburg','DE','2091-02-15',1),
(3,'Eva Mueller','eva@sigma.net','Muenchen','DE','2091-03-20',1),
(4,'Hans Wagner','hans@sigma.net','Koeln','DE','2091-04-05',1),
(5,'Robert Klein','r.klein@netz.de','Frankfurt','DE','2091-05-12',0),
(6,'Maria Lange','m.lange@netz.de','Stuttgart','DE','2091-06-18',0),
(7,'Paul Richter','p.richter@netz.de','Dresden','DE','2091-07-22',0),
(8,'Emma Beck','e.beck@netz.de','Bremen','DE','2091-08-30',0),
(9,'Jonas Braun','j.braun@netz.de','Leipzig','DE','2091-09-14',0),
(10,'Klara Meier','k.meier@netz.de','Hannover','DE','2091-10-01',0);
INSERT INTO produkte VALUES
(1,'Laptop Pro 15','Elektronik',799.00,'TechCorp',4.80),
(2,'Noise-Cancelling Kopfhoerer','Elektronik',199.00,'SoundX',4.60),
(3,'Standing Desk','Moebel',449.00,'DeskPro',4.50),
(4,'USB-C Hub','Elektronik',49.99,'ConnectAll',4.10),
(5,'Wireless Maus','Elektronik',39.99,'ClickFast',4.20),
(6,'Schreibtisch Eiche','Moebel',299.00,'WoodWorks',4.10),
(7,'Tastatur Pro','Elektronik',89.99,'TypeFast',4.40),
(8,'Monitor 27 Zoll','Elektronik',349.00,'ViewMax',4.30),
(9,'Buero-Stuhl Basic','Moebel',199.00,'SitRight',4.50),
(10,'Buerostuhl Comfort','Moebel',349.00,'ErgoCo',NULL),
(11,'Buecherregal','Moebel',249.00,'ShelfCo',NULL),
(12,'Kopfstuetze Memory','Moebel',79.00,'NeckEase',NULL);
INSERT INTO bestellungen VALUES
(1,1,'2091-01-05',799.00,'abgeschlossen','Express'),
(2,2,'2091-01-10',799.00,'abgeschlossen','Express'),
(3,3,'2091-01-15',199.00,'abgeschlossen','Standard'),
(4,4,'2091-01-20',449.00,'abgeschlossen','Express'),
(5,5,'2091-01-25',299.00,'abgeschlossen','Standard'),
(6,6,'2091-02-01',349.00,'abgeschlossen','Standard'),
(7,1,'2091-02-05',449.00,'abgeschlossen','Express'),
(8,2,'2091-02-10',199.00,'abgeschlossen','Standard'),
(9,3,'2091-02-15',39.99,'abgeschlossen','Standard'),
(10,4,'2091-02-20',49.99,'abgeschlossen','Standard'),
(11,1,'2091-03-01',299.00,'abgeschlossen','Express'),
(12,7,'2091-03-05',89.99,'abgeschlossen','Standard'),
(13,8,'2091-03-10',39.99,'abgeschlossen','Standard'),
(14,9,'2091-03-15',49.99,'abgeschlossen','Standard');
INSERT INTO bestellpositionen VALUES
(1,1,1,1,799.00),
(2,2,1,1,799.00),
(3,3,2,1,199.00),
(4,4,3,1,449.00),
(5,5,6,1,299.00),
(6,6,8,1,349.00),
(7,7,3,1,449.00),
(8,8,2,1,199.00),
(9,9,5,1,39.99),
(10,10,4,1,49.99),
(11,11,6,1,299.00),
(12,12,7,1,89.99),
(13,13,5,1,39.99),
(14,14,4,1,49.99);
INSERT INTO bewertungen VALUES
(1,1,1,5,'Absolut top!','2091-01-10'),
(2,2,1,5,'Perfekte Leistung','2091-01-15'),
(3,3,2,5,'Beste Kopfhoerer','2091-01-20'),
(4,4,2,4,NULL,'2091-01-25'),
(5,1,3,5,'Unverzichtbar','2091-02-08'),
(6,4,3,4,'Gute Qualitaet','2091-02-25'),
(7,5,6,4,'Solide','2091-01-30'),
(8,6,8,4,NULL,'2091-02-05'),
(9,7,7,5,'Schnelle Tasten','2091-03-08'),
(10,8,5,4,NULL,'2091-03-12'),
(11,9,4,4,'Guenstig','2091-03-18');
INSERT INTO kampagnen VALUES
(1,'Black Friday','Email','2091-11-24','2091-11-27',15000.00,500,40),
(2,'Weihnachten','Email','2091-12-01','2091-12-24',20000.00,600,45),
(3,'Flash Sale Mai','Email','2091-05-01','2091-05-03',5000.00,250,18),
(4,'Herbst Deal','Email','2091-09-15','2091-09-30',10000.00,700,42),
(5,'Fruehjahr Sale','Social','2091-03-15','2091-03-31',12000.00,800,50),
(6,'Summer Promo','Banner','2091-07-01','2091-07-15',8000.00,400,20),
(7,'Neujahr','Social','2092-01-01','2092-01-07',6000.00,300,15);
`,
};
