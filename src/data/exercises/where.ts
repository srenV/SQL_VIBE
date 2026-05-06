/**
 * WHERE-Klausel-Uebungen.
 * Enthaelt Uebungen fuer Filterung mit WHERE-Bedingungen.
 */
import { makeWriteExercise, makeDebugExercise, makePredictExercise, makeSchemaExercise, resetCounter } from "@/data/exercises/_factory";
import type { Exercise } from "@/types/exercise";
import { shopDataset } from "@/data/datasets/shop";
import { fitnessDataset } from "@/data/datasets/fitness";
import { hrDataset } from "@/data/datasets/hr";
import { ticketsDataset } from "@/data/datasets/tickets";
import { bankingDataset } from "@/data/datasets/banking";
import { streamingDataset } from "@/data/datasets/streaming";
import { logsDataset } from "@/data/datasets/logs";

export const whereExercises: Exercise[] = [];
resetCounter();
whereExercises.push(
  makeWriteExercise("whr", {
    title: "Kunden in Berlin",
    description: "Zeige alle Kunden aus der Tabelle `kunden`, die in Berlin wohnen.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT * FROM kunden WHERE stadt = 'Berlin';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Verwende `WHERE stadt = 'Berlin'`.",
      "Textwerte in SQL muessen in einfache Anfuehrungszeichen gesetzt werden."
    ],
    hiddenTestQuery: "SELECT * FROM kunden WHERE stadt = 'Berlin';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Produkte teurer als 50 Euro",
    description: "Finde alle Produkte mit einem Preis groesser als 50.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name, preis FROM produkte WHERE preis > 50;",
    tags: ["WHERE", "Vergleichsoperator"],
    hints: [
      "Verwende `WHERE preis > 50`.",
      "Zahlen brauchen keine Anfuehrungszeichen."
    ],
    hiddenTestQuery: "SELECT name, preis FROM produkte WHERE preis > 50;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Bestellungen mit Status abgeschlossen",
    description: "Zeige alle Bestellungen, die den Status 'abgeschlossen' haben.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT * FROM bestellungen WHERE status = 'abgeschlossen';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Verwende `WHERE status = 'abgeschlossen'`.",
      "Achte auf die genaue Schreibweise des Status."
    ],
    hiddenTestQuery: "SELECT * FROM bestellungen WHERE status = 'abgeschlossen';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Kunden nicht aus Muenchen",
    description: "Zeige alle Kunden, die NICHT in Muenchen wohnen.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT * FROM kunden WHERE stadt <> 'Muenchen';",
    tags: ["WHERE", "Ungleich"],
    hints: [
      "Verwende `<>` oder `!=` fuer Ungleich.",
      "Beispiel: `WHERE stadt <> 'Muenchen'`"
    ],
    hiddenTestQuery: "SELECT * FROM kunden WHERE stadt <> 'Muenchen';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Fitness-Nutzer ueber 80 kg",
    description: "Zeige alle Nutzer aus dem Fitness-Datensatz, die mehr als 80 kg wiegen.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: fitnessDataset.id,
    referenceQuery: "SELECT name, gewicht_kg FROM nutzer WHERE gewicht_kg > 80;",
    tags: ["WHERE", "Vergleichsoperator"],
    hints: [
      "Die Spalte heisst `gewicht_kg`.",
      "Verwende `WHERE gewicht_kg > 80`."
    ],
    hiddenTestQuery: "SELECT name, gewicht_kg FROM nutzer WHERE gewicht_kg > 80;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Cardio-Uebungen",
    description: "Finde alle Uebungen der Kategorie 'Cardio'.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: fitnessDataset.id,
    referenceQuery: "SELECT * FROM uebungen WHERE kategorie = 'Cardio';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte `kategorie` enthaelt Werte wie 'Kraft', 'Cardio', 'Flexibilitaet'.",
      "Verwende `WHERE kategorie = 'Cardio'`."
    ],
    hiddenTestQuery: "SELECT * FROM uebungen WHERE kategorie = 'Cardio';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Mitarbeiter mit Gehalt ueber 50000",
    description: "Zeige alle Mitarbeiter, die mehr als 50.000 Euro verdienen.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT name, gehalt FROM mitarbeiter WHERE gehalt > 50000;",
    tags: ["WHERE", "Vergleichsoperator"],
    hints: [
      "Verwende `WHERE gehalt > 50000`.",
      "Die Spalte `gehalt` ist ein DECIMAL-Wert."
    ],
    hiddenTestQuery: "SELECT name, gehalt FROM mitarbeiter WHERE gehalt > 50000;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Abteilungen in Berlin",
    description: "Zeige alle Abteilungen am Standort 'Berlin'.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT * FROM abteilungen WHERE standort = 'Berlin';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte heisst `standort`.",
      "Verwende `WHERE standort = 'Berlin'`."
    ],
    hiddenTestQuery: "SELECT * FROM abteilungen WHERE standort = 'Berlin';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Offene Tickets",
    description: "Finde alle Tickets mit dem Status 'offen'.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: ticketsDataset.id,
    referenceQuery: "SELECT * FROM tickets WHERE status = 'offen';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Der Status kann 'offen', 'bearbeitung' oder 'abgeschlossen' sein.",
      "Verwende `WHERE status = 'offen'`."
    ],
    hiddenTestQuery: "SELECT * FROM tickets WHERE status = 'offen';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Kritische Tickets",
    description: "Zeige alle Tickets mit der Prioritaet 'kritisch'.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: ticketsDataset.id,
    referenceQuery: "SELECT titel, prioritaet FROM tickets WHERE prioritaet = 'kritisch';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Prioritaet heisst `prioritaet`.",
      "Moegliche Werte: 'kritisch', 'hoch', 'mittel', 'niedrig'."
    ],
    hiddenTestQuery: "SELECT titel, prioritaet FROM tickets WHERE prioritaet = 'kritisch';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Girokonten finden",
    description: "Zeige alle Konten vom Typ 'Girokonto' aus dem Banking-Datensatz.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: bankingDataset.id,
    referenceQuery: "SELECT * FROM konten WHERE typ = 'Girokonto';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte `typ` hat die Werte 'Girokonto' oder 'Sparkonto'.",
      "Verwende `WHERE typ = 'Girokonto'`."
    ],
    hiddenTestQuery: "SELECT * FROM konten WHERE typ = 'Girokonto';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Ausgangs-Transaktionen",
    description: "Finde alle Transaktionen vom Typ 'ausgang' (Abfluesse).",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: bankingDataset.id,
    referenceQuery: "SELECT * FROM transaktionen WHERE typ = 'ausgang';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte `typ` hat die Werte 'eingang' oder 'ausgang'.",
      "Verwende `WHERE typ = 'ausgang'`."
    ],
    hiddenTestQuery: "SELECT * FROM transaktionen WHERE typ = 'ausgang';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Premium-Nutzer",
    description: "Zeige alle Nutzer mit dem Abonnement 'Premium'.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: streamingDataset.id,
    referenceQuery: "SELECT * FROM nutzer WHERE abonnement = 'Premium';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte `abonnement` hat Werte wie 'Premium', 'Standard', 'Basic'.",
      "Verwende `WHERE abonnement = 'Premium'`."
    ],
    hiddenTestQuery: "SELECT * FROM nutzer WHERE abonnement = 'Premium';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Drama-Filme",
    description: "Finde alle Filme des Genres 'Drama'.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: streamingDataset.id,
    referenceQuery: "SELECT titel, jahr FROM filme WHERE genre = 'Drama';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte `genre` hat Werte wie 'Drama', 'Sci-Fi', 'Action' etc.",
      "Verwende `WHERE genre = 'Drama'`."
    ],
    hiddenTestQuery: "SELECT titel, jahr FROM filme WHERE genre = 'Drama';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Chrome-Sessions",
    description: "Zeige alle Sessions, die mit dem Browser 'Chrome' durchgefuehrt wurden.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: logsDataset.id,
    referenceQuery: "SELECT * FROM sessions WHERE browser = 'Chrome';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte `browser` hat Werte wie 'Chrome', 'Firefox', 'Safari', 'Edge'.",
      "Verwende `WHERE browser = 'Chrome'`."
    ],
    hiddenTestQuery: "SELECT * FROM sessions WHERE browser = 'Chrome';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Produkte zwischen 20 und 100 Euro",
    description: "Finde alle Produkte, deren Preis zwischen 20 und 100 (inklusiv) liegt.",
    difficulty: "junior",
    category: "WHERE",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name, preis FROM produkte WHERE preis BETWEEN 20 AND 100;",
    tags: ["WHERE", "BETWEEN"],
    hints: [
      "Verwende `BETWEEN 20 AND 100`.",
      "BETWEEN ist inklusiv – beide Grenzwerte werden eingeschlossen."
    ],
    hiddenTestQuery: "SELECT name, preis FROM produkte WHERE preis BETWEEN 20 AND 100;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Kunden aus Berlin oder Hamburg",
    description: "Zeige alle Kunden, die in Berlin oder Hamburg wohnen.",
    difficulty: "junior",
    category: "WHERE",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT * FROM kunden WHERE stadt IN ('Berlin', 'Hamburg');",
    tags: ["WHERE", "IN"],
    hints: [
      "Verwende `IN ('Berlin', 'Hamburg')` statt mehrerer OR-Bedingungen.",
      "Alternative: `WHERE stadt = 'Berlin' OR stadt = 'Hamburg'`."
    ],
    hiddenTestQuery: "SELECT * FROM kunden WHERE stadt IN ('Berlin', 'Hamburg');",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Produkte der Kategorien 1 oder 3",
    description: "Zeige alle Produkte mit kategorie_id 1 oder 3 (Elektronik oder Kleidung).",
    difficulty: "junior",
    category: "WHERE",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name, kategorie_id FROM produkte WHERE kategorie_id IN (1, 3);",
    tags: ["WHERE", "IN"],
    hints: [
      "Verwende `IN (1, 3)` fuer eine Liste numerischer Werte.",
      "Zahlen brauchen keine Anfuehrungszeichen."
    ],
    hiddenTestQuery: "SELECT name, kategorie_id FROM produkte WHERE kategorie_id IN (1, 3);",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Kundenname beginnt mit M",
    description: "Finde alle Kunden, deren Name mit 'M' beginnt.",
    difficulty: "junior",
    category: "WHERE",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name FROM kunden WHERE name LIKE 'M%';",
    tags: ["WHERE", "LIKE"],
    hints: [
      "Verwende `LIKE 'M%'` – das `%` steht fuer beliebige Zeichen danach.",
      "Das `%` ist ein Platzhalter fuer null oder mehr Zeichen."
    ],
    hiddenTestQuery: "SELECT name FROM kunden WHERE name LIKE 'M%';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Email enthaelt beispiel.de",
    description: "Finde alle Kunden, deren E-Mail-Adresse 'beispiel.de' enthaelt.",
    difficulty: "junior",
    category: "WHERE",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name, email FROM kunden WHERE email LIKE '%beispiel.de';",
    tags: ["WHERE", "LIKE"],
    hints: [
      "Verwende `LIKE '%beispiel.de'` – das `%` davor steht fuer beliebige Zeichen davor.",
      "`%` kann am Anfang, in der Mitte oder am Ende stehen."
    ],
    hiddenTestQuery: "SELECT name, email FROM kunden WHERE email LIKE '%beispiel.de';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Workouts laenger als 60 Minuten",
    description: "Zeige alle Workouts, die laenger als 60 Minuten dauern.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: fitnessDataset.id,
    referenceQuery: "SELECT * FROM workouts WHERE dauer_min > 60;",
    tags: ["WHERE", "Vergleichsoperator"],
    hints: [
      "Die Spalte heisst `dauer_min`.",
      "Verwende `WHERE dauer_min > 60`."
    ],
    hiddenTestQuery: "SELECT * FROM workouts WHERE dauer_min > 60;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Brust-Uebungen",
    description: "Finde alle Uebungen fuer die Muskelgruppe 'Brust'.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: fitnessDataset.id,
    referenceQuery: "SELECT * FROM uebungen WHERE muskelgruppe = 'Brust';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte `muskelgruppe` hat Werte wie 'Brust', 'Beine', 'Ruecken' etc.",
      "Verwende `WHERE muskelgruppe = 'Brust'`."
    ],
    hiddenTestQuery: "SELECT * FROM uebungen WHERE muskelgruppe = 'Brust';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Mitarbeiter ohne Manager",
    description: "Finde alle Mitarbeiter, die keinen Manager haben (manager_id ist NULL).",
    difficulty: "junior",
    category: "WHERE",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT name, position FROM mitarbeiter WHERE manager_id IS NULL;",
    tags: ["WHERE", "IS NULL"],
    hints: [
      "Verwende `IS NULL` – niemals `= NULL`.",
      "NULL ist kein Wert, sondern die Abwesenheit eines Wertes."
    ],
    hiddenTestQuery: "SELECT name, position FROM mitarbeiter WHERE manager_id IS NULL;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Genehmigter Urlaub",
    description: "Zeige alle Urlaubsantraege, die genehmigt wurden.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT * FROM urlaub WHERE genehmigt = 1;",
    tags: ["WHERE", "Boolescher Wert"],
    hints: [
      "Die Spalte `genehmigt` ist ein BOOLEAN: 1 = wahr, 0 = falsch.",
      "Verwende `WHERE genehmigt = 1`."
    ],
    hiddenTestQuery: "SELECT * FROM urlaub WHERE genehmigt = 1;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Inaktive Agenten",
    description: "Finde alle Agenten, die nicht aktiv sind.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: ticketsDataset.id,
    referenceQuery: "SELECT * FROM agenten WHERE aktiv = 0;",
    tags: ["WHERE", "Boolescher Wert"],
    hints: [
      "Die Spalte `aktiv` ist BOOLEAN: 1 = aktiv, 0 = inaktiv.",
      "Verwende `WHERE aktiv = 0`."
    ],
    hiddenTestQuery: "SELECT * FROM agenten WHERE aktiv = 0;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Tickets ohne zugewiesenen Agenten",
    description: "Finde alle Tickets, denen kein Agent zugewiesen ist.",
    difficulty: "junior",
    category: "WHERE",
    datasetId: ticketsDataset.id,
    referenceQuery: "SELECT * FROM tickets WHERE agent_id IS NULL;",
    tags: ["WHERE", "IS NULL"],
    hints: [
      "Verwende `WHERE agent_id IS NULL`.",
      "Ein NULL-Wert in agent_id bedeutet: kein Agent zugewiesen."
    ],
    hiddenTestQuery: "SELECT * FROM tickets WHERE agent_id IS NULL;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Sparkonten mit Saldo ueber 10000",
    description: "Finde alle Sparkonten mit einem Saldo groesser als 10.000.",
    difficulty: "junior",
    category: "WHERE",
    datasetId: bankingDataset.id,
    referenceQuery: "SELECT * FROM konten WHERE typ = 'Sparkonto' AND saldo > 10000;",
    tags: ["WHERE", "AND"],
    hints: [
      "Kombiniere zwei Bedingungen mit `AND`.",
      "`WHERE typ = 'Sparkonto' AND saldo > 10000`"
    ],
    hiddenTestQuery: "SELECT * FROM konten WHERE typ = 'Sparkonto' AND saldo > 10000;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Transaktionen mit hohem Betrag",
    description: "Finde alle Transaktionen mit einem Betrag kleiner als -1000 (grosse Abfluesse).",
    difficulty: "junior",
    category: "WHERE",
    datasetId: bankingDataset.id,
    referenceQuery: "SELECT * FROM transaktionen WHERE betrag < -1000;",
    tags: ["WHERE", "Vergleichsoperator"],
    hints: [
      "Negative Betraege sind Abfluesse.",
      "Verwende `WHERE betrag < -1000`."
    ],
    hiddenTestQuery: "SELECT * FROM transaktionen WHERE betrag < -1000;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Filme nach 2010",
    description: "Zeige alle Filme, die nach 2010 erschienen sind.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: streamingDataset.id,
    referenceQuery: "SELECT titel, jahr FROM filme WHERE jahr > 2010;",
    tags: ["WHERE", "Vergleichsoperator"],
    hints: [
      "Die Spalte `jahr` ist ein INTEGER.",
      "Verwende `WHERE jahr > 2010`."
    ],
    hiddenTestQuery: "SELECT titel, jahr FROM filme WHERE jahr > 2010;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Sessions ohne Nutzer",
    description: "Finde alle Sessions von anonymen Nutzern (nutzer_id ist NULL).",
    difficulty: "junior",
    category: "WHERE",
    datasetId: logsDataset.id,
    referenceQuery: "SELECT * FROM sessions WHERE nutzer_id IS NULL;",
    tags: ["WHERE", "IS NULL"],
    hints: [
      "Anonyme Sessions haben keine nutzer_id.",
      "Verwende `WHERE nutzer_id IS NULL`."
    ],
    hiddenTestQuery: "SELECT * FROM sessions WHERE nutzer_id IS NULL;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Kritische Fehler",
    description: "Zeige alle Fehler mit dem Schweregrad 'kritisch'.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: logsDataset.id,
    referenceQuery: "SELECT * FROM fehler WHERE schweregrad = 'kritisch';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte `schweregrad` hat die Werte 'warnung' oder 'kritisch'.",
      "Verwende `WHERE schweregrad = 'kritisch'`."
    ],
    hiddenTestQuery: "SELECT * FROM fehler WHERE schweregrad = 'kritisch';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Page-View-Events",
    description: "Finde alle Events vom Typ 'page_view'.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: logsDataset.id,
    referenceQuery: "SELECT * FROM events WHERE event_typ = 'page_view';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte `event_typ` hat Werte wie 'page_view', 'click', 'checkout'.",
      "Verwende `WHERE event_typ = 'page_view'`."
    ],
    hiddenTestQuery: "SELECT * FROM events WHERE event_typ = 'page_view';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Produkte unter 30 Euro oder ueber 500 Euro",
    description: "Finde alle Produkte, die entweder unter 30 Euro oder ueber 500 Euro kosten.",
    difficulty: "junior",
    category: "WHERE",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT name, preis FROM produkte WHERE preis < 30 OR preis > 500;",
    tags: ["WHERE", "OR"],
    hints: [
      "Verwende `OR` um zwei Bedingungen zu kombinieren.",
      "`WHERE preis < 30 OR preis > 500`"
    ],
    hiddenTestQuery: "SELECT name, preis FROM produkte WHERE preis < 30 OR preis > 500;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Mitarbeiter der Abteilung 1 oder 2",
    description: "Zeige alle Mitarbeiter, die in Abteilung 1 oder Abteilung 2 arbeiten.",
    difficulty: "junior",
    category: "WHERE",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT name, abteilung_id FROM mitarbeiter WHERE abteilung_id IN (1, 2);",
    tags: ["WHERE", "IN"],
    hints: [
      "Verwende `IN (1, 2)` statt `abteilung_id = 1 OR abteilung_id = 2`.",
      "IN ist kuerzer und uebersichtlicher."
    ],
    hiddenTestQuery: "SELECT name, abteilung_id FROM mitarbeiter WHERE abteilung_id IN (1, 2);",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Bewerbungen im Gespraech-Stadium",
    description: "Finde alle Bewerbungen mit dem Status 'gespraech'.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: hrDataset.id,
    referenceQuery: "SELECT * FROM bewerbungen WHERE status = 'gespraech';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte `status` hat Werte: 'eingegangen', 'gespraech', 'abgelehnt', 'angebot'.",
      "Verwende `WHERE status = 'gespraech'`."
    ],
    hiddenTestQuery: "SELECT * FROM bewerbungen WHERE status = 'gespraech';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Versandte oder stornierte Bestellungen",
    description: "Zeige alle Bestellungen, die entweder 'versendet' oder 'storniert' sind.",
    difficulty: "junior",
    category: "WHERE",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT * FROM bestellungen WHERE status IN ('versendet', 'storniert');",
    tags: ["WHERE", "IN"],
    hints: [
      "Verwende `IN ('versendet', 'storniert')`.",
      "Alternative: `WHERE status = 'versendet' OR status = 'storniert'`."
    ],
    hiddenTestQuery: "SELECT * FROM bestellungen WHERE status IN ('versendet', 'storniert');",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Filme zwischen 120 und 150 Minuten",
    description: "Finde alle Filme, die zwischen 120 und 150 Minuten dauern.",
    difficulty: "junior",
    category: "WHERE",
    datasetId: streamingDataset.id,
    referenceQuery: "SELECT titel, dauer_min FROM filme WHERE dauer_min BETWEEN 120 AND 150;",
    tags: ["WHERE", "BETWEEN"],
    hints: [
      "Verwende `BETWEEN 120 AND 150`.",
      "BETWEEN schließt beide Grenzen ein."
    ],
    hiddenTestQuery: "SELECT titel, dauer_min FROM filme WHERE dauer_min BETWEEN 120 AND 150;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Saetze ohne Gewichtsangabe",
    description: "Finde alle Saetze, bei denen das Gewicht nicht erfasst wurde (NULL).",
    difficulty: "junior",
    category: "WHERE",
    datasetId: fitnessDataset.id,
    referenceQuery: "SELECT * FROM saetze WHERE gewicht_kg IS NULL;",
    tags: ["WHERE", "IS NULL"],
    hints: [
      "Cardio-Uebungen haben kein Gewicht – `gewicht_kg` ist NULL.",
      "Verwende `IS NULL`, nicht `= NULL`."
    ],
    hiddenTestQuery: "SELECT * FROM saetze WHERE gewicht_kg IS NULL;",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Tickets mit hoher oder kritischer Prioritaet",
    description: "Zeige Tickets mit Prioritaet 'hoch' oder 'kritisch'.",
    difficulty: "junior",
    category: "WHERE",
    datasetId: ticketsDataset.id,
    referenceQuery: "SELECT titel, prioritaet FROM tickets WHERE prioritaet IN ('hoch', 'kritisch');",
    tags: ["WHERE", "IN"],
    hints: [
      "Verwende `IN ('hoch', 'kritisch')`.",
      "Beide Werte sind Text und muessen in Anfuehrungszeichen."
    ],
    hiddenTestQuery: "SELECT titel, prioritaet FROM tickets WHERE prioritaet IN ('hoch', 'kritisch');",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "ERR_500 Fehler",
    description: "Finde alle Fehler mit dem Fehlercode 'ERR_500'.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: logsDataset.id,
    referenceQuery: "SELECT * FROM fehler WHERE fehlercode = 'ERR_500';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte `fehlercode` hat Werte wie 'ERR_404', 'ERR_500', 'ERR_502'.",
      "Verwende `WHERE fehlercode = 'ERR_500'`."
    ],
    hiddenTestQuery: "SELECT * FROM fehler WHERE fehlercode = 'ERR_500';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Kreditkartenzahlungen",
    description: "Finde alle Zahlungen, die mit Kreditkarte getaetigt wurden.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: shopDataset.id,
    referenceQuery: "SELECT * FROM zahlungen WHERE zahlungsmittel = 'Kreditkarte';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Die Spalte `zahlungsmittel` hat Werte: 'Kreditkarte', 'PayPal', 'Ueberweisung'.",
      "Verwende `WHERE zahlungsmittel = 'Kreditkarte'`."
    ],
    hiddenTestQuery: "SELECT * FROM zahlungen WHERE zahlungsmittel = 'Kreditkarte';",
    hiddenTestMode: "rows",
  }),
  makeWriteExercise("whr", {
    title: "Checkout-Events",
    description: "Finde alle Events vom Typ 'checkout' im Logs-Datensatz.",
    difficulty: "beginner",
    category: "WHERE",
    datasetId: logsDataset.id,
    referenceQuery: "SELECT * FROM events WHERE event_typ = 'checkout';",
    tags: ["WHERE", "Gleichheit"],
    hints: [
      "Verwende `WHERE event_typ = 'checkout'`.",
      "Checkout-Events kennzeichnen Kaufabschluesse."
    ],
    hiddenTestQuery: "SELECT * FROM events WHERE event_typ = 'checkout';",
    hiddenTestMode: "rows",
  })
);