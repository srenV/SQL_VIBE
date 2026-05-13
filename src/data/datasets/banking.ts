/**
 * Banking-Light-Datensatz.
 * Enthaelt Konten, Kunden, Transaktionen und Betrugserkennungsfaellen
 * fuer bankbezogene SQL-Uebungen.
 */
import type { Dataset } from "@/types/exercise";

export const bankingDataset: Dataset = {
  id: "banking",
  name: "Banking-Light",
  description:
    "Ein vereinfachtes Bankensystem mit Konten, Kunden, Transaktionen und Betrugserkennungsfaellen.",
  tables: [
    {
      name: "kunden",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "geburtsdatum", type: "DATE", nullable: false },
        { name: "adresse", type: "VARCHAR(200)", nullable: false },
        { name: "registriert_am", type: "DATE", nullable: false },
      ],
    },
    {
      name: "konten",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "kunde_id", type: "INTEGER", nullable: false, references: "kunden.id" },
        { name: "kontonummer", type: "VARCHAR(20)", nullable: false },
        { name: "typ", type: "VARCHAR(20)", nullable: false },
        { name: "saldo", type: "DECIMAL(12,2)", nullable: false },
        { name: "eroeffnet_am", type: "DATE", nullable: false },
      ],
    },
    {
      name: "transaktionen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "konto_id", type: "INTEGER", nullable: false, references: "konten.id" },
        { name: "betrag", type: "DECIMAL(12,2)", nullable: false },
        { name: "typ", type: "VARCHAR(10)", nullable: false },
        { name: "beschreibung", type: "VARCHAR(200)", nullable: true },
        { name: "datum", type: "DATETIME", nullable: false },
      ],
    },
    {
      name: "betrugsfaelle",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "transaktion_id", type: "INTEGER", nullable: false, references: "transaktionen.id" },
        { name: "grund", type: "VARCHAR(100)", nullable: false },
        { name: "status", type: "VARCHAR(20)", nullable: false },
        { name: "gemeldet_am", type: "DATETIME", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE kunden (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  geburtsdatum DATE NOT NULL,
  adresse VARCHAR(200) NOT NULL,
  registriert_am DATE NOT NULL
);
CREATE TABLE konten (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL REFERENCES kunden(id),
  kontonummer VARCHAR(20) NOT NULL,
  typ VARCHAR(20) NOT NULL,
  saldo DECIMAL(12,2) NOT NULL,
  eroeffnet_am DATE NOT NULL
);
CREATE TABLE transaktionen (
  id INTEGER PRIMARY KEY,
  konto_id INTEGER NOT NULL REFERENCES konten(id),
  betrag DECIMAL(12,2) NOT NULL,
  typ VARCHAR(10) NOT NULL,
  beschreibung VARCHAR(200),
  datum DATETIME NOT NULL
);
CREATE TABLE betrugsfaelle (
  id INTEGER PRIMARY KEY,
  transaktion_id INTEGER NOT NULL REFERENCES transaktionen(id),
  grund VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL,
  gemeldet_am DATETIME NOT NULL
);
INSERT INTO kunden VALUES
(1,'Helmut Richter','1960-03-15','Hauptstrasse 1, Berlin','2015-01-10'),
(2,'Brigitte Mueller','1975-07-22','Bahnhofstrasse 5, Muenchen','2016-02-20'),
(3,'Klaus Fischer','1988-11-04','Ringstrasse 12, Hamburg','2018-03-15'),
(4,'Petra Wagner','1992-05-18','Marktplatz 3, Koeln','2019-04-05'),
(5,'Wolfgang Becker','1955-09-30','Lindenallee 8, Stuttgart','2014-05-12'),
(6,'Ursula Hoffmann','1980-01-14','Rosenweg 2, Frankfurt','2017-06-18'),
(7,'Dieter Lang','1995-12-08','Kirchstrasse 7, Dresden','2020-07-22'),
(8,'Monika Bauer','1970-04-25','Eichenweg 4, Bremen','2015-08-30');
INSERT INTO konten VALUES
(1,1,'DE12345678901234567890','Girokonto',12500.00,'2015-01-10'),
(2,1,'DE98765432109876543210','Sparkonto',45000.00,'2015-01-10'),
(3,2,'DE11111111111111111111','Girokonto',3200.00,'2016-02-20'),
(4,2,'DE22222222222222222222','Sparkonto',28000.00,'2016-02-20'),
(5,3,'DE33333333333333333333','Girokonto',1500.00,'2018-03-15'),
(6,4,'DE44444444444444444444','Girokonto',8900.00,'2019-04-05'),
(7,4,'DE55555555555555555555','Sparkonto',15000.00,'2019-04-05'),
(8,5,'DE66666666666666666666','Girokonto',67000.00,'2014-05-12'),
(9,6,'DE77777777777777777777','Girokonto',4200.00,'2017-06-18'),
(10,6,'DE88888888888888888888','Sparkonto',12000.00,'2017-06-18'),
(11,7,'DE99999999999999999999','Girokonto',800.00,'2020-07-22'),
(12,8,'DE00000000000000000000','Girokonto',5600.00,'2015-08-30');
INSERT INTO transaktionen VALUES
(1,1,2500.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(2,1,-120.50,'ausgang','Miete','2024-01-02 10:00:00'),
(3,1,-45.00,'ausgang','Supermarkt','2024-01-03 14:30:00'),
(4,1,-200.00,'ausgang','Tankstelle','2024-01-05 09:00:00'),
(5,1,2500.00,'eingang','Gehalt Februar','2024-02-01 08:00:00'),
(6,1,-5000.00,'ausgang','Uerweisung an Konto 3','2024-02-10 11:00:00'),
(7,2,1800.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(8,2,-800.00,'ausgang','Miete','2024-01-02 10:00:00'),
(9,2,-60.00,'ausgang','Supermarkt','2024-01-03 14:30:00'),
(10,2,1800.00,'eingang','Gehalt Februar','2024-02-01 08:00:00'),
(11,3,5000.00,'eingang','Uerweisung von Konto 1','2024-02-10 11:00:00'),
(12,3,-30.00,'ausgang','Cafe','2024-02-11 15:00:00'),
(13,4,2200.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(14,4,-950.00,'ausgang','Miete','2024-01-02 10:00:00'),
(15,4,-85.00,'ausgang','Supermarkt','2024-01-03 14:30:00'),
(16,5,3500.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(17,5,-2000.00,'ausgang','Sparueberweisung','2024-01-05 09:00:00'),
(18,6,1900.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(19,6,-720.00,'ausgang','Miete','2024-01-02 10:00:00'),
(20,7,1500.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(21,8,-9999.99,'ausgang','Online-Shop Luxus','2024-01-06 03:00:00'),
(22,8,-4999.99,'ausgang','Online-Shop Luxus','2024-01-06 03:15:00'),
(23,9,1400.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(24,10,-5000.00,'ausgang','Sparueberweisung','2024-01-10 10:00:00'),
(25,11,800.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(26,12,2100.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(27,12,-650.00,'ausgang','Miete','2024-01-02 10:00:00'),
(28,1,-999.99,'ausgang','Online-Shop','2024-01-06 02:00:00');
INSERT INTO betrugsfaelle VALUES
(1,21,'Unuebliche Uhrzeit und hoher Betrag','untersuchung','2024-01-07 09:00:00'),
(2,22,'Unuebliche Uhrzeit und hoher Betrag','untersuchung','2024-01-07 09:00:00'),
(3,28,'Nachtzeit-Transaktion ausserhalb des Normalverhaltens','untersuchung','2024-01-07 09:00:00'),
(4,6,'Grosse Uerweisung an unbekanntes Konto','abgeschlossen','2024-02-11 10:00:00');
`,
};
