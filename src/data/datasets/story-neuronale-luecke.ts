import type { Dataset } from "@/types/exercise";

export const storyNeuronaleLueckeDataset: Dataset = {
  id: "story-neuronale-luecke",
  name: "ARGUS-Streaming (Neuronale Luecke)",
  description: "Story-exklusive Streaming-Datenbank fuer den Fall 'Neuronale Luecke'.",
  tables: [
    {
      name: "nutzer",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "name", type: "VARCHAR(100)", nullable: false },
        { name: "email", type: "VARCHAR(100)", nullable: false },
        { name: "abonnement", type: "VARCHAR(20)", nullable: false },
        { name: "registriert_am", type: "DATE", nullable: false },
      ],
    },
    {
      name: "filme",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "titel", type: "VARCHAR(200)", nullable: false },
        { name: "genre", type: "VARCHAR(50)", nullable: false },
        { name: "jahr", type: "INTEGER", nullable: false },
        { name: "dauer_min", type: "INTEGER", nullable: false },
        { name: "bewertung", type: "DECIMAL(3,2)", nullable: true },
      ],
    },
    {
      name: "watch_history",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "nutzer_id", type: "INTEGER", nullable: false, references: "nutzer.id" },
        { name: "film_id", type: "INTEGER", nullable: false, references: "filme.id" },
        { name: "geschaut_am", type: "DATETIME", nullable: false },
        { name: "fortschritt_prozent", type: "INTEGER", nullable: false },
      ],
    },
    {
      name: "bewertungen",
      columns: [
        { name: "id", type: "INTEGER", nullable: false },
        { name: "nutzer_id", type: "INTEGER", nullable: false, references: "nutzer.id" },
        { name: "film_id", type: "INTEGER", nullable: false, references: "filme.id" },
        { name: "sterne", type: "INTEGER", nullable: false },
        { name: "kommentar", type: "TEXT", nullable: true },
        { name: "bewertet_am", type: "DATETIME", nullable: false },
      ],
    },
  ],
  sql: `CREATE TABLE nutzer (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  abonnement VARCHAR(20) NOT NULL,
  registriert_am DATE NOT NULL
);
CREATE TABLE filme (
  id INTEGER PRIMARY KEY,
  titel VARCHAR(200) NOT NULL,
  genre VARCHAR(50) NOT NULL,
  jahr INTEGER NOT NULL,
  dauer_min INTEGER NOT NULL,
  bewertung DECIMAL(3,2)
);
CREATE TABLE watch_history (
  id INTEGER PRIMARY KEY,
  nutzer_id INTEGER NOT NULL,
  film_id INTEGER NOT NULL,
  geschaut_am DATETIME NOT NULL,
  fortschritt_prozent INTEGER NOT NULL
);
CREATE TABLE bewertungen (
  id INTEGER PRIMARY KEY,
  nutzer_id INTEGER NOT NULL,
  film_id INTEGER NOT NULL,
  sterne INTEGER NOT NULL,
  kommentar TEXT,
  bewertet_am DATETIME NOT NULL
);
INSERT INTO nutzer VALUES
(1,'Elena Voss','elena@argus.net','Premium','2089-01-10'),
(2,'Karl Breuer','karl@argus.net','Standard','2089-02-15'),
(3,'Nina Park','nina@argus.net','Basic','2089-03-20'),
(4,'Stefan Roth','stefan@argus.net','Premium','2089-04-05'),
(5,'Lisa Kern','lisa@argus.net','Standard','2089-05-12'),
(6,'Jan Wolff','jan@argus.net','Basic','2089-06-18'),
(7,'Mia Sauer','mia@argus.net','Premium','2089-07-22'),
(8,'Tom Engel','tom@argus.net','Standard','2089-08-30'),
(9,'Clara Beck','clara@argus.net','Basic','2089-09-14'),
(10,'Felix Koch','felix@argus.net','Standard','2089-10-01');
INSERT INTO filme VALUES
(1,'Interstellar','Sci-Fi',2014,169,4.80),
(2,'Inception','Sci-Fi',2010,148,4.70),
(3,'Matrix','Sci-Fi',1999,136,4.90),
(4,'Titanic','Drama',1997,194,4.50),
(5,'Der Pate','Drama',1972,175,4.60),
(6,'Schindlers Liste','Drama',1993,195,4.70),
(7,'Fight Club','Drama',1999,139,4.40),
(8,'Forrest Gump','Drama',1994,142,4.30),
(9,'Sieben','Krimi',1995,127,4.20),
(10,'Das Schweigen der Laemmer','Krimi',1991,118,4.40),
(11,'Die Hard','Action',1988,132,4.10),
(12,'Mad Max','Action',2015,120,4.00),
(13,'Psycho','Thriller',1960,109,4.30),
(14,'Memento','Thriller',2000,113,4.50),
(15,'La La Land','Musical',2016,128,NULL);
INSERT INTO watch_history VALUES
(1,1,4,'2091-03-01 20:00:00',40),
(2,2,9,'2091-03-02 19:00:00',100),
(3,3,7,'2091-03-03 21:00:00',60),
(4,4,1,'2091-03-04 22:00:00',100),
(5,5,11,'2091-03-05 18:00:00',70),
(6,6,3,'2091-03-06 20:00:00',100),
(7,7,5,'2091-03-07 19:00:00',100),
(8,8,2,'2091-03-08 21:00:00',100),
(9,9,6,'2091-03-09 22:00:00',100),
(10,10,14,'2091-03-10 20:00:00',100),
(11,1,1,'2091-03-11 21:00:00',100),
(12,4,3,'2091-03-12 22:00:00',100);
INSERT INTO bewertungen VALUES
(1,1,1,5,'Absolutes Meisterwerk','2091-03-05 10:00:00'),
(2,4,1,5,'Unvergesslich','2091-03-06 11:00:00'),
(3,7,1,5,'Top Film','2091-03-07 12:00:00'),
(4,2,4,4,'Bewegend','2091-03-08 13:00:00'),
(5,5,4,4,NULL,'2091-03-09 14:00:00'),
(6,8,4,4,'Zeitlos','2091-03-10 15:00:00'),
(7,3,7,3,'Verwirrend','2091-03-11 09:00:00'),
(8,6,7,4,'Intensiv','2091-03-12 10:00:00'),
(9,9,7,3,NULL,'2091-03-13 11:00:00'),
(10,4,3,5,'Kult!','2091-03-14 12:00:00'),
(11,1,3,5,'Klassiker','2091-03-15 13:00:00'),
(12,7,3,4,NULL,'2091-03-16 14:00:00'),
(13,2,2,4,'Fesselnd','2091-03-17 15:00:00'),
(14,5,2,4,NULL,'2091-03-18 16:00:00'),
(15,8,2,5,'Perfekt','2091-03-19 17:00:00'),
(16,3,9,3,NULL,'2091-03-20 18:00:00'),
(17,6,9,4,'Spannend','2091-03-21 19:00:00'),
(18,9,10,4,'Gruselig','2091-03-22 20:00:00'),
(19,10,10,4,NULL,'2091-03-23 21:00:00'),
(20,2,5,5,'Meisterwerk','2091-03-24 10:00:00'),
(21,4,5,4,NULL,'2091-03-25 11:00:00'),
(22,7,6,5,'Erschuetternd','2091-03-26 12:00:00'),
(23,1,6,5,'Must-See','2091-03-27 13:00:00'),
(24,5,8,4,NULL,'2091-03-28 14:00:00'),
(25,8,8,3,'Gut','2091-03-29 15:00:00'),
(26,3,11,3,NULL,'2091-03-30 16:00:00'),
(27,6,12,3,'Laut','2091-04-01 17:00:00'),
(28,9,13,4,NULL,'2091-04-02 18:00:00'),
(29,10,14,5,'Verwirrend gut','2091-04-03 19:00:00'),
(30,2,14,4,NULL,'2091-04-04 20:00:00');
`,
};
