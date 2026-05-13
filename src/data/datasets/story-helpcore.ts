import type { Dataset } from "@/types/exercise";

export const storyHelpCoreDataset: Dataset = {
  id: "story-helpcore",
  name: "HelpCore-Ticketsystem",
  description: "Story-exklusive Ticketdatenbank fuer den Fall 'Virus im HelpCore-Netz'.",
  tables: [
    {
      name: "agenten",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "team", type: "VARCHAR(50)", nullable: false },
        { name: "aktiv", type: "BOOLEAN", nullable: false },
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
      name: "tickets",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "titel", type: "VARCHAR(200)", nullable: false },
        { name: "beschreibung", type: "TEXT", nullable: true },
        { name: "kategorie_id", type: "INTEGER", nullable: false, references: "kategorien.id" },
        { name: "agent_id", type: "INTEGER", nullable: true, references: "agenten.id" },
        { name: "prioritaet", type: "VARCHAR(10)", nullable: false },
        { name: "status", type: "VARCHAR(20)", nullable: false },
        { name: "erstellt_am", type: "DATETIME", nullable: false },
        { name: "geschlossen_am", type: "DATETIME", nullable: true },
      ],
    },
    {
      name: "kommentare",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "ticket_id", type: "INTEGER", nullable: false, references: "tickets.id" },
        { name: "autor", type: "VARCHAR(100)", nullable: false },
        { name: "nachricht", type: "TEXT", nullable: false },
        { name: "erstellt_am", type: "DATETIME", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE agenten (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  team VARCHAR(50) NOT NULL,
  aktiv BOOLEAN NOT NULL
);
CREATE TABLE kategorien (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);
CREATE TABLE tickets (
  id INTEGER PRIMARY KEY,
  titel VARCHAR(200) NOT NULL,
  beschreibung TEXT,
  kategorie_id INTEGER NOT NULL REFERENCES kategorien(id),
  agent_id INTEGER REFERENCES agenten(id),
  prioritaet VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL,
  erstellt_am DATETIME NOT NULL,
  geschlossen_am DATETIME
);
CREATE TABLE kommentare (
  id INTEGER PRIMARY KEY,
  ticket_id INTEGER NOT NULL REFERENCES tickets(id),
  autor VARCHAR(100) NOT NULL,
  nachricht TEXT NOT NULL,
  erstellt_am DATETIME NOT NULL
);
INSERT INTO agenten VALUES
(1,'Lena Mayer','lena@helpcore.de','Infrastruktur',1),
(2,'Tom Billing','tom.billing@helpcore.de','Energie',1),
(3,'Sara Vogel','sara@helpcore.de','Buergerrechte',1),
(4,'Max Gruber','max@helpcore.de','Infrastruktur',1),
(5,'Petra Zorn','petra@helpcore.de','Energie',0),
(6,'Klaus Held','klaus@helpcore.de','Allgemein',1);
INSERT INTO kategorien VALUES
(1,'Infrastruktur'),
(2,'Energie'),
(3,'Buergerrechte'),
(4,'Zahlung'),
(5,'Allgemein'),
(6,'Sicherheit');
INSERT INTO tickets VALUES
(1,'Stromausfall Sektor 7','Permanenter Ausfall seit 3 Tagen',2,2,'kritisch','offen','2024-04-01 08:00:00',NULL),
(2,'Wasserversorgung unterbrochen','Druckabfall in Wohnzone 4',1,1,'kritisch','in_bearbeitung','2024-04-01 09:00:00',NULL),
(3,'Zahlungsverarbeitung failt','Checkout nicht erreichbar',4,2,'kritisch','geschlossen','2024-04-02 10:00:00','2024-04-02 14:00:00'),
(4,'Heizungsausfall Block 12','Keine Heizung seit 48h',2,5,'kritisch','in_bearbeitung','2024-04-03 07:00:00',NULL),
(5,'Netzausfall Buergerportal','Portal seit Stunden nicht erreichbar',1,NULL,'kritisch','geschlossen','2024-04-03 11:00:00','2024-04-04 09:00:00'),
(6,'Strassenlicht defekt','Sektor 3 komplett dunkel',1,4,'hoch','offen','2024-04-01 20:00:00',NULL),
(7,'Muellabfuhr verspaetet','Keine Abholung seit 2 Wochen',5,3,'mittel','offen','2024-04-02 09:00:00',NULL),
(8,'Buergerrechtsverletzung','Unrechtmaessige Datenweitergabe',3,NULL,'hoch','offen','2024-04-01 15:00:00',NULL),
(9,'Ampelanlage defekt','Kreuzung Hauptstr./Ringstr.',1,1,'hoch','in_bearbeitung','2024-04-02 12:00:00',NULL),
(10,'Kanalfluktuation','Abwasserpegel kritisch',2,NULL,'mittel','offen','2024-04-03 06:00:00',NULL),
(11,'Datenverlust im Archiv','Backup fehlgeschlagen',6,4,'hoch','offen','2024-04-01 10:00:00',NULL),
(12,'Oeffentlicher WLAN-Ausfall','Freifunk offline',5,NULL,'niedrig','offen','2024-04-04 08:00:00',NULL),
(13,'Energie-Rationierung Zone 2','Unrechtmaessige Abschaltung',2,NULL,'hoch','offen','2024-04-04 09:00:00',NULL),
(14,'Energie-Rationierung Zone 5','Willkuerliche Abschaltung',2,NULL,'hoch','offen','2024-04-04 10:00:00',NULL),
(15,'Wasserabrechnung fehlerhaft','Dreifache Berechnung',4,NULL,'mittel','offen','2024-04-04 11:00:00',NULL);
INSERT INTO kommentare VALUES
(1,1,'Tom Billing','Ticket geprueft, eskaliere intern.','2024-04-01 10:00:00'),
(2,1,'Lena Mayer','Techniker entsandt, Status unbekannt.','2024-04-01 11:00:00'),
(3,2,'Tom Billing','Ursache identifiziert: Ventildefekt.','2024-04-01 12:00:00'),
(4,3,'Tom Billing','Ticket als geloest markiert — kein Bug.','2024-04-02 10:30:00'),
(5,3,'Sara Vogel','Ich kann das nicht bestaetigen.','2024-04-02 11:00:00'),
(6,4,'Max Gruber','Heizungstechniker informiert.','2024-04-03 08:00:00'),
(7,5,'Klaus Held','Portal neugestartet, Status wird beobachtet.','2024-04-03 12:00:00'),
(8,6,'Lena Mayer','Reparaturteam angefragt.','2024-04-01 21:00:00'),
(9,7,'Sara Vogel','Abfuhr neu geplant fuer naechste Woche.','2024-04-02 10:00:00'),
(10,9,'Max Gruber','Ampelsteuerung neu gestartet.','2024-04-02 13:00:00'),
(11,11,'Max Gruber','Backup-System wird untersucht.','2024-04-01 11:00:00');
`,
  // Tickets WITHOUT any kommentare: 8, 10, 12, 13, 14, 15 = exactly 6
  // Tickets WITH kritisch priority: 1, 2, 3, 4, 5 = exactly 5
  // Tom Billing kommentare: tickets 1, 2, 3 = 3 (> 2, leads the ranking)
};
