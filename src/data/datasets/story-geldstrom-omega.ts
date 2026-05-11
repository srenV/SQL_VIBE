import type { Dataset } from "@/types/exercise";

export const storyGeldstromOmegaDataset: Dataset = {
  id: "story-geldstrom-omega",
  name: "Omega-Bankdatenbank",
  description: "Story-exklusive Bankdatenbank fuer den Fall 'Geldstrom Omega'.",
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
  kunde_id INTEGER NOT NULL,
  kontonummer VARCHAR(20) NOT NULL,
  typ VARCHAR(20) NOT NULL,
  saldo DECIMAL(12,2) NOT NULL,
  eroeffnet_am DATE NOT NULL
);
CREATE TABLE transaktionen (
  id INTEGER PRIMARY KEY,
  konto_id INTEGER NOT NULL,
  betrag DECIMAL(12,2) NOT NULL,
  typ VARCHAR(10) NOT NULL,
  beschreibung VARCHAR(200),
  datum DATETIME NOT NULL
);
CREATE TABLE betrugsfaelle (
  id INTEGER PRIMARY KEY,
  transaktion_id INTEGER NOT NULL,
  grund VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL,
  gemeldet_am DATETIME NOT NULL
);
INSERT INTO kunden VALUES
(1,'Helmut Richter','1960-03-15','Hauptstrasse 1, Berlin','2015-01-10'),
(2,'Wolfgang Becker','1955-09-30','Lindenallee 8, Stuttgart','2014-05-12'),
(3,'Brigitte Mueller','1975-07-22','Bahnhofstrasse 5, Muenchen','2016-02-20'),
(4,'Klaus Fischer','1988-11-04','Ringstrasse 12, Hamburg','2018-03-15'),
(5,'Petra Wagner','1992-05-18','Marktplatz 3, Koeln','2019-04-05'),
(6,'Ursula Hoffmann','1980-01-14','Rosenweg 2, Frankfurt','2017-06-18'),
(7,'Dieter Lang','1995-12-08','Kirchstrasse 7, Dresden','2020-07-22'),
(8,'Monika Bauer','1970-04-25','Eichenweg 4, Bremen','2015-08-30');
INSERT INTO konten VALUES
(1,1,'DE12345678901234567890','Girokonto',12500.00,'2015-01-10'),
(2,1,'DE98765432109876543210','Sparkonto',45000.00,'2015-01-10'),
(3,3,'DE11111111111111111111','Girokonto',3200.00,'2016-02-20'),
(4,3,'DE22222222222222222222','Sparkonto',28000.00,'2016-02-20'),
(5,4,'DE33333333333333333333','Girokonto',1500.00,'2018-03-15'),
(6,5,'DE44444444444444444444','Girokonto',8900.00,'2019-04-05'),
(7,5,'DE55555555555555555555','Sparkonto',15000.00,'2019-04-05'),
(8,2,'DE66666666666666666666','Girokonto',67000.00,'2014-05-12'),
(9,6,'DE77777777777777777777','Girokonto',4200.00,'2017-06-18'),
(10,6,'DE88888888888888888888','Sparkonto',12000.00,'2017-06-18'),
(11,7,'DE99999999999999999999','Girokonto',800.00,'2020-07-22'),
(12,8,'DE00000000000000000000','Girokonto',5600.00,'2015-08-30');
INSERT INTO transaktionen VALUES
-- Konto 1 (Helmut Girokonto): 7 Transaktionen, davon 2 Fraud
(1,1,2000.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(2,1,1500.00,'eingang','Bonus','2024-01-02 10:00:00'),
(3,1,1000.00,'eingang','Nebeneinkommen','2024-01-04 14:00:00'),
(4,1,500.00,'eingang','Erstattung','2024-01-05 09:00:00'),
(5,1,-365.00,'ausgang','Miete','2024-02-13 11:00:00'),
(6,1,-5000.00,'ausgang','Ueberweisung an unbekanntes Konto','2024-02-14 03:00:00'),
(7,1,-999.99,'ausgang','Nacht-Transaktion Online-Shop','2024-02-14 03:45:00'),
-- Konto 2 (Helmut Sparkonto): 4 Transaktionen, Gesamtvolumen ABS = 4460
(8,2,2000.00,'eingang','Spareinlage Jan','2024-01-10 10:00:00'),
(9,2,-800.00,'ausgang','Entnahme','2024-01-15 10:00:00'),
(10,2,1500.00,'eingang','Spareinlage Feb','2024-02-10 10:00:00'),
(11,2,-1160.00,'ausgang','Entnahme','2024-02-20 10:00:00'),
-- Konto 3 (Brigitte Mueller Girokonto): 3 Transaktionen
(12,3,1800.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(13,3,-800.00,'ausgang','Miete','2024-01-02 10:00:00'),
(14,3,-60.00,'ausgang','Supermarkt','2024-01-03 14:30:00'),
-- Konto 4 (Brigitte Mueller Sparkonto): 3 Transaktionen
(15,4,2200.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(16,4,-950.00,'ausgang','Miete','2024-01-02 10:00:00'),
(17,4,-85.00,'ausgang','Supermarkt','2024-01-03 14:30:00'),
-- Konto 8 (Wolfgang Becker Girokonto): 2 Transaktionen, beide Fraud, 15 min apart
(18,8,-9999.99,'ausgang','Nachtzeit-Luxuskauf Online','2024-01-06 03:00:00'),
(19,8,-4999.99,'ausgang','Nachtzeit-Luxuskauf Online','2024-01-06 03:15:00'),
-- weitere Konten: je 1–2 normale Transaktionen
(20,5,3500.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(21,6,1900.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(22,9,1400.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(23,11,800.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(24,12,2100.00,'eingang','Gehalt Januar','2024-01-01 08:00:00'),
(25,12,-650.00,'ausgang','Miete','2024-01-02 10:00:00');
INSERT INTO betrugsfaelle VALUES
(1,6,'Ueberweisung an unbekanntes Konto','untersuchung','2024-02-15 09:00:00'),
(2,7,'Nacht-Transaktion ausserhalb des Normalverhaltens','untersuchung','2024-02-15 09:00:00'),
(3,18,'Unuebliche Uhrzeit und hoher Betrag','untersuchung','2024-01-07 09:00:00'),
(4,19,'Unuebliche Uhrzeit und hoher Betrag','untersuchung','2024-01-07 09:00:00');
`,
  // Ch1: 4 betrugsfaelle (trans 6,7 Helmut + trans 18,19 Wolfgang) ✓
  // Ch2: Hochfrequenz > 2: konto 1 (7 trans), konto 2 (4 trans), konto 3 (3), konto 4 (3) ✓
  // Ch3: konto_id IN (1,8): konto 1 geht nach T6 (running: 2000+1500+1000+500-365-5000=-365) ins Minus,
  //       nach T7 (-365-999.99=-1364.99); konto 8 sofort -9999.99 ✓
  // Ch4 LAG: konto 1 T1-T4 1-2 Tage Abstand, dann 39 Tage bis T5, danach 1 Tag T6, 45min T7 ✓
  //          konto 8: T18 und T19 = 15 min Abstand ✓
  // Ch5 CTE: COUNT>3 OR ABS>5000: konto 1 (7 trans, vol=10864.99), konto 2 (4, 5460),
  //           konto 8 (2, 14999.98), konto 3 (3, 2660), konto 4 (3, 3235)
  //   => Vol>5000: konto 1 ✓, konto 2 (5460>5000 ✓), konto 8 ✓; Count>3: konto 1 ✓, konto 2 ✓
  //   => "Drei verdaechtige Konten": konto 1+2+8 erscheinen alle (vol>5000 or count>3) ✓
  // Ch6 Taeter-Konten: betrug(1,8) OR frequenz(count>3: 1,2): konten 1,2,8 ✓
  //   Helmut Sparkonto saldo=45000 (das eigentliche Ziel), Wolfgang saldo=67000 ✓
  // Ch7 fraud_stats: Helmut (trans 6+7, vol=5999.99, 2 fraud), Wolfgang (trans 18+19, vol=14999.98, 2 fraud) ✓
};
