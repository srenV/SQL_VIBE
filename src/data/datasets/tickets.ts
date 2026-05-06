/**
 * Ticketsystem-Datensatz.
 * Enthaelt Tickets, Agenten, Kategorien, Prioritaeten und Kommentare
 * fuer Support-Ticket-SQL-Uebungen.
 */
import type { Dataset } from "@/types/exercise";

export const ticketsDataset: Dataset = {
  id: "tickets",
  name: "Ticketsystem",
  description:
    "Ein Support-Ticketsystem mit Tickets, Agenten, Kategorien, Prioritaeten und Kommentaren.",
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
  sql: `
CREATE TABLE agenten (
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
  kategorie_id INTEGER NOT NULL,
  agent_id INTEGER,
  prioritaet VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL,
  erstellt_am DATETIME NOT NULL,
  geschlossen_am DATETIME
);
CREATE TABLE kommentare (
  id INTEGER PRIMARY KEY,
  ticket_id INTEGER NOT NULL,
  autor VARCHAR(100) NOT NULL,
  nachricht TEXT NOT NULL,
  erstellt_am DATETIME NOT NULL
);
INSERT INTO agenten VALUES
(1,'Max Support','max@support.de','Technik',1),
(2,'Lisa Helpdesk','lisa@support.de','Technik',1),
(3,'Tom Billing','tom@support.de','Buchhaltung',1),
(4,'Sarah Account','sarah@support.de','Account',1),
(5,'John Escalation','john@support.de','Technik',0),
(6,'Emma Onboarding','emma@support.de','Account',1);
INSERT INTO kategorien VALUES
(1,'Login-Probleme'),
(2,'Zahlungsfehler'),
(3,'Bestellungen'),
(4,'Technischer Fehler'),
(5,'Feature-Request'),
(6,'Rueckgabe');
INSERT INTO tickets VALUES
(1,'Passwort zuruecksetzen funktioniert nicht','Kunde kann Passwort nicht zuruecksetzen, E-Mail kommt nicht an.',1,1,'hoch','offen','2024-01-10 09:00:00',NULL),
(2,'Doppelte Abbuchung','Kunde wurde zweimal fuer Bestellung #1234 abgebucht.',2,3,'kritisch','bearbeitung','2024-01-10 10:30:00',NULL),
(3,'Bestellstatus nicht sichtbar','Kunde sieht seine Bestellung nicht im Account.',3,4,'mittel','offen','2024-01-11 08:15:00',NULL),
(4,'App stuerzt ab beim Oeffnen','Mobile App crashed direkt nach Start auf iOS 17.',4,1,'hoch','bearbeitung','2024-01-11 11:00:00',NULL),
(5,'Dark Mode wuenschen','Kunde moechte einen Dark Mode fuer die App.',5,NULL,'niedrig','offen','2024-01-12 14:20:00',NULL),
(6,'Artikel Rueckgabe beantragen','Kunde moechte Artikel aus Bestellung #5678 zurueckgeben.',6,4,'mittel','abgeschlossen','2024-01-12 09:00:00','2024-01-15 16:30:00'),
(7,'Login mit Google funktioniert nicht','OAuth-Login mit Google-Konto schlaegt fehl.',1,2,'hoch','bearbeitung','2024-01-13 10:00:00',NULL),
(8,'Rechnung nicht erhalten','Kunde hat keine Rechnung fuer Bestellung #9012 erhalten.',2,3,'mittel','abgeschlossen','2024-01-13 11:30:00','2024-01-14 09:00:00'),
(9,'Produktseite laedt langsam','Ladezeit der Produktseite ueber 10 Sekunden.',4,1,'hoch','offen','2024-01-14 08:00:00',NULL),
(10,'Konto loeschen','Kunde moechte sein Konto dauerhaft loeschen.',3,4,'niedrig','offen','2024-01-14 13:00:00',NULL),
(11,'Filterfunktion verbessern','Kunde wuenscht erweiterte Filter in der Produktsuche.',5,NULL,'niedrig','offen','2024-01-15 09:30:00',NULL),
(12,'Falsche Lieferadresse','Bestellung wurde an falsche Adresse geliefert.',3,4,'kritisch','bearbeitung','2024-01-15 10:00:00',NULL),
(13,'Zahlungsmethode hinzufuegen','Kunde kann neue Kreditkarte nicht speichern.',2,3,'mittel','abgeschlossen','2024-01-16 08:00:00','2024-01-17 14:00:00'),
(14,'Push-Benachrichtigungen deaktivieren','Kunde moechte alle Push-Notifications ausschalten.',4,2,'niedrig','offen','2024-01-16 11:00:00',NULL),
(15,'Gutscheincode nicht akzeptiert','Rabattcode wird bei Checkout als ungueltig angezeigt.',2,3,'hoch','bearbeitung','2024-01-17 09:00:00',NULL);
INSERT INTO kommentare VALUES
(1,1,'Max Support','Haben Sie den Spam-Ordner geprueft?','2024-01-10 09:15:00'),
(2,1,'Kunde','Ja, dort ist auch nichts.','2024-01-10 09:30:00'),
(3,2,'Tom Billing','Wir pruefen die Transaktionen.','2024-01-10 11:00:00'),
(4,3,'Sarah Account','Bitte versuchen Sie es mit einem anderen Browser.','2024-01-11 08:30:00'),
(5,4,'Max Support','Koennen Sie uns die Crash-Logs senden?','2024-01-11 11:15:00'),
(6,6,'Sarah Account','Rueckgabe wurde genehmigt, Label wurde versendet.','2024-01-13 10:00:00'),
(7,7,'Lisa Helpdesk','Wir pruefen die Google OAuth Konfiguration.','2024-01-13 10:30:00'),
(8,8,'Tom Billing','Rechnung wurde erneut gesendet.','2024-01-14 09:00:00'),
(9,9,'Max Support','Wir analysieren die Performance.','2024-01-14 08:30:00'),
(10,12,'Sarah Account','Neue Lieferung wurde an korrekte Adresse gesendet.','2024-01-16 09:00:00'),
(11,13,'Tom Billing','Karte wurde erfolgreich hinzugefuegt.','2024-01-17 14:00:00'),
(12,15,'Tom Billing','Gutschein war zeitlich begrenzt, ist jetzt abgelaufen.','2024-01-17 10:00:00');
`,
};
