/**
 * Schema-Uebungen.
 * Enthaelt Uebungen zum Erkennen und Verstehen von Datenbankstrukturen.
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

export const schemaExercises: Exercise[] = [];
resetCounter();
schemaExercises.push(
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Shop-Tabellenverbindung",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: "shop",
    question: "Welche Tabellen muessen verbunden werden, um den Namen eines Kunden und den Namen des gekauften Produkts anzuzeigen?",
    options: [
      { text: "kunden, bestellungen, bestellpositionen, produkte", isCorrect: true },
      { text: "kunden, produkte", isCorrect: false },
      { text: "bestellungen, produkte", isCorrect: false },
      { text: "kunden, bestellungen, produkte", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
    hints: [
      "Um vom Kundennamen zum Produktnamen zu gelangen, muss man mehrere Tabellen verknuepfen.",
      "Schau dir die Fremdschluessel-Beziehungen an: kunden -> bestellungen -> bestellpositionen -> produkte.",
      "Der Pfad lautet: `kunden` (name) JOIN `bestellungen` (kunde_id) JOIN `bestellpositionen` (bestellung_id, produkt_id) JOIN `produkte` (name)."
    ],
  }),

  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Fitness-Saetze-Tabelle",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: "fitness",
    question: "Welche Tabelle enthaelt Informationen ueber die durchgefuehrten Saetze?",
    options: [
      { text: "workouts", isCorrect: false },
      { text: "uebungen", isCorrect: false },
      { text: "saetze", isCorrect: true },
      { text: "nutzer", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
    hints: [
      "Suche nach einer Tabelle, die Daten zu einzelnen Saetzen eines Workouts speichert.",
      "Tabellen sind oft nach dem benannt, was sie speichern — 'saetze' klingt nach einzelnen Uebungssaetzen.",
      "Die Tabelle `saetze` speichert einzelne Uebungseinheiten mit Wiederholungen und Gewicht — sie verweist auf `workouts` und `uebungen`."
    ],
  }),

  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: HR-Vorgesetztenverweis",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: "hr",
    question: "Welche Spalte in `mitarbeiter` verweist auf den Vorgesetzten?",
    options: [
      { text: "abteilung_id", isCorrect: false },
      { text: "manager_id", isCorrect: true },
      { text: "position", isCorrect: false },
      { text: "id", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
    hints: [
      "Ein Vorgesetzter ist selbst ein Mitarbeiter — suche nach einer Spalte, die auf dieselbe Tabelle verweist.",
      "Self-References haben oft den Namen `<singular_tabelle>_id`, also `mitarbeiter_id` oder `manager_id`.",
      "Die Spalte `manager_id` in der Tabelle `mitarbeiter` verweist auf `mitarbeiter.id` — das ist der Vorgesetzte."
    ],
  }),

  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: tickets",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: "tickets",
    question: "Welche Tabelle speichert die Kommentare zu einem Ticket?",
    options: [
      { text: "tickets", isCorrect: false },
      { text: "agenten", isCorrect: false },
      { text: "kommentare", isCorrect: true },
      { text: "kategorien", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
    hints: [
      "Kommentare gehoeren zu einem Ticket — suche eine Tabelle, die Nachrichten zu Tickets speichert.",
      "Tabellen fuer abhaengige Informationen haben oft einen Fremdschluessel auf die Haupttabelle.",
      "Die Tabelle `kommentare` hat eine `ticket_id`-Spalte, die auf `tickets.id` verweist — dort werden Kommentare gespeichert."
    ],
  }),

  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: banking",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: "banking",
    question: "Welche Spalte verbindet `transaktionen` mit `konten`?",
    options: [
      { text: "kunde_id", isCorrect: false },
      { text: "konto_id", isCorrect: true },
      { text: "id", isCorrect: false },
      { text: "kontonummer", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
    hints: [
      "Eine Transaktion gehoert zu einem Konto — suche den Fremdschluessel, der auf die `konten`-Tabelle verweist.",
      "Fremdschluessel heissen meist `<tabelle_singular>_id`, also waere der Link zu `konten` eine Spalte namens `konto_id`.",
      "Die Spalte `konto_id` in der Tabelle `transaktionen` verweist auf `konten.id` — das ist die Verbindung."
    ],
  }),

  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: streaming",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: "streaming",
    question: "Welche Tabellen braucht man, um zu sehen, welcher Nutzer welchen Film geschaut hat?",
    options: [
      { text: "nutzer, filme", isCorrect: false },
      { text: "nutzer, watch_history, filme", isCorrect: true },
      { text: "watch_history, bewertungen", isCorrect: false },
      { text: "nutzer, bewertungen", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
    hints: [
      "Zwischen Nutzern und Filmen muss eine Zwischentabelle existieren, die beide verbindet.",
      "Eine Tabelle mit `nutzer_id` und `film_id` als Fremdschluessel stellt die Verbindung her.",
      "Die Tabelle `watch_history` hat `nutzer_id` und `film_id` — sie verknuepft Nutzer mit gesehenen Filmen."
    ],
  }),

  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: logs",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: "logs",
    question: "Welche Spalte in `events` verweist auf die Session?",
    options: [
      { text: "id", isCorrect: false },
      { text: "session_id", isCorrect: true },
      { text: "nutzer_id", isCorrect: false },
      { text: "seite", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
    hints: [
      "Ein Event gehoert zu einer Session — suche den Fremdschluessel, der auf die `sessions`-Tabelle zeigt.",
      "Fremdschluessel in `events`, die auf `sessions` verweisen, heissen ueblicherweise `session_id`.",
      "Die Spalte `session_id` in der Tabelle `events` verweist auf `sessions.id` — das ist die Verknuepfung."
    ],
  }),

  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Shop-Kategorie-FK",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: "shop",
    question: "Welche Spalte in `produkte` verweist auf die Kategorie?",
    options: [
      { text: "id", isCorrect: false },
      { text: "name", isCorrect: false },
      { text: "kategorie_id", isCorrect: true },
      { text: "preis", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
    hints: [
      "Produkte gehoeren zu einer Kategorie — suche den Fremdschluessel, der auf die `kategorien`-Tabelle zeigt.",
      "Fremdschluessel heissen ueblicherweise `<tabelle_singular>_id`, also `kategorie_id` fuer den Verweis auf `kategorien`.",
      "Die Spalte `kategorie_id` in der Tabelle `produkte` verweist auf `kategorien.id`."
    ],
  }),

  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: HR-Urlaubsantraege",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: "hr",
    question: "Welche Tabelle speichert die Urlaubsantraege?",
    options: [
      { text: "mitarbeiter", isCorrect: false },
      { text: "abteilungen", isCorrect: false },
      { text: "urlaub", isCorrect: true },
      { text: "bewerbungen", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
    hints: [
      "Urlaubsantraege gehoeren zu Mitarbeitern — suche eine eigene Tabelle fuer Urlaubs-Informationen.",
      "Separate Entitaeten bekommen eigene Tabellen: Wenn es viele Urlaubsantraege pro Mitarbeiter geben kann, braucht es eine eigene Tabelle.",
      "Die Tabelle `urlaub` im HR-Datensatz speichert Urlaubsantraege mit `mitarbeiter_id`, `startdatum`, `enddatum` und `genehmigt`."
    ],
  }),

  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Fitness-Koerperfett-Spalte",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: "fitness",
    question: "Welche Spalte in `koerperdaten` speichert den Body-Fat-Prozentsatz?",
    options: [
      { text: "gewicht_kg", isCorrect: false },
      { text: "koerperfett_prozent", isCorrect: true },
      { text: "groesse_cm", isCorrect: false },
      { text: "datum", isCorrect: false }
    ],
    expectedResultText: "",
    tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
    hints: [
      "Schau dir die Tabellen- und Spaltendefinitionen an.",
      "Achte auf Foreign-Key-Beziehungen."
    ],
  })
);

schemaExercises.push(
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Shop-Bestellpositionen-FK",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: shopDataset.id,
    question: "Welche zwei Fremdschluessel hat die Tabelle `bestellpositionen`?",
    options: [
      { text: "bestellung_id und produkt_id", isCorrect: true },
      { text: "kunde_id und produkt_id", isCorrect: false },
      { text: "bestellung_id und kategorie_id", isCorrect: false },
      { text: "id und menge", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Foreign Keys"],
    hints: ["Schau dir die Spalten mit `references` an."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Fitness-Workout-Spalten",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: fitnessDataset.id,
    question: "Welche Spalte in `workouts` verweist auf den Nutzer?",
    options: [
      { text: "id", isCorrect: false },
      { text: "uebung_id", isCorrect: false },
      { text: "nutzer_id", isCorrect: true },
      { text: "kalorien_verbrannt", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Foreign Keys"],
    hints: ["Suche die Spalte mit `references: nutzer.id`."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Banking-Betrugsfall",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "junior",
    category: "Schema-Verstaendnis",
    datasetId: bankingDataset.id,
    question: "Welche Spalte in `betrugsfaelle` verweist auf eine Transaktion?",
    options: [
      { text: "id", isCorrect: false },
      { text: "transaktion_id", isCorrect: true },
      { text: "konto_id", isCorrect: false },
      { text: "grund", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Foreign Keys"],
    hints: ["Suche die Spalte mit `references: transaktionen.id`."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Streaming-Bewertung-FK",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "junior",
    category: "Schema-Verstaendnis",
    datasetId: streamingDataset.id,
    question: "Welche Tabelle verbindet Nutzer mit Filmen ueber Bewertungen?",
    options: [
      { text: "watch_history", isCorrect: false },
      { text: "bewertungen", isCorrect: true },
      { text: "nutzer", isCorrect: false },
      { text: "filme", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
    hints: ["Welche Tabelle hat sowohl `nutzer_id` als auch `film_id` und `sterne`?"],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Shop-Kunden-Beziehung",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: shopDataset.id,
    question: "Wie ist `bestellungen` mit `kunden` verbunden?",
    options: [
      { text: "Ueber kunde_id in bestellungen", isCorrect: true },
      { text: "Ueber bestellung_id in kunden", isCorrect: false },
      { text: "Ueber email in beiden Tabellen", isCorrect: false },
      { text: "Ueber name in beiden Tabellen", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Foreign Keys"],
    hints: ["Schau in `bestellungen` nach einem Fremdschluessel."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: HR-Bewerbungen-FK",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "junior",
    category: "Schema-Verstaendnis",
    datasetId: hrDataset.id,
    question: "Welche Spalte in `bewerbungen` verweist auf die Abteilung?",
    options: [
      { text: "id", isCorrect: false },
      { text: "name", isCorrect: false },
      { text: "abteilung_id", isCorrect: true },
      { text: "status", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Foreign Keys"],
    hints: ["Suche die Spalte mit `references: abteilungen.id`."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Tickets-Kommentare-Verbindung",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: ticketsDataset.id,
    question: "Welche Spalte in `kommentare` verweist auf das zugehoerige Ticket?",
    options: [
      { text: "id", isCorrect: false },
      { text: "ticket_id", isCorrect: true },
      { text: "autor", isCorrect: false },
      { text: "nachricht", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Foreign Keys"],
    hints: ["Suche die Spalte mit `references: tickets.id`."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Logs-Fehler-Event",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "junior",
    category: "Schema-Verstaendnis",
    datasetId: logsDataset.id,
    question: "Welche Spalte in `fehler` verweist auf das zugehoerige Event?",
    options: [
      { text: "id", isCorrect: false },
      { text: "fehlercode", isCorrect: false },
      { text: "event_id", isCorrect: true },
      { text: "schweregrad", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Foreign Keys"],
    hints: ["Suche die Spalte mit `references: events.id`."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Fitness-Self-Join Moeglichkeit",
    description: "Analysiere das Schema: Welche Tabelle hat einen Self-Reference (Verweis auf sich selbst)?",
    difficulty: "intermediate",
    category: "Schema-Verstaendnis",
    datasetId: hrDataset.id,
    question: "Welche Tabelle hat einen Self-Reference?",
    options: [
      { text: "abteilungen", isCorrect: false },
      { text: "mitarbeiter (manager_id -> mitarbeiter.id)", isCorrect: true },
      { text: "urlaub", isCorrect: false },
      { text: "bewerbungen", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Self Join"],
    hints: ["Schau nach Spalten, die auf die gleiche Tabelle verweisen."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Banking-Kunden-Konto-Pfad",
    description: "Welcher Weg fuehrt von `kunden` zu `betrugsfaelle`?",
    difficulty: "intermediate",
    category: "Schema-Verstaendnis",
    datasetId: bankingDataset.id,
    question: "Welche Tabellen muessen verbunden werden, um von Kunden zu Betrugsfaellen zu kommen?",
    options: [
      { text: "kunden -> konten -> transaktionen -> betrugsfaelle", isCorrect: true },
      { text: "kunden -> betrugsfaelle", isCorrect: false },
      { text: "kunden -> transaktionen -> betrugsfaelle", isCorrect: false },
      { text: "kunden -> konten -> betrugsfaelle", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Tabellenbeziehungen"],
    hints: ["Folge den Fremdschluesseln: kunden->konten->transaktionen->betrugsfaelle."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Nullable Spalten",
    description: "Analysiere das Schema: Welche Spalte in `tickets` kann NULL-Werte enthalten?",
    difficulty: "junior",
    category: "Schema-Verstaendnis",
    datasetId: ticketsDataset.id,
    question: "Welche Spalte in `tickets` kann NULL sein?",
    options: [
      { text: "titel", isCorrect: false },
      { text: "agent_id", isCorrect: true },
      { text: "prioritaet", isCorrect: false },
      { text: "status", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Nullable"],
    hints: ["Schau nach Spalten mit `nullable: true`."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: PK der Tabelle sessions",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: logsDataset.id,
    question: "Was ist der Primaerschluessel der Tabelle `sessions`?",
    options: [
      { text: "id (VARCHAR(50))", isCorrect: true },
      { text: "nutzer_id", isCorrect: false },
      { text: "ip_adresse", isCorrect: false },
      { text: "browser", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Primary Keys"],
    hints: ["Schau nach der Spalte, die als PRIMARY KEY definiert ist."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Datumsspalten im Shop",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: shopDataset.id,
    question: "Welche Tabelle im Shop-Datensatz hat KEINE Datumsspalte?",
    options: [
      { text: "kunden", isCorrect: false },
      { text: "bestellungen", isCorrect: false },
      { text: "kategorien", isCorrect: true },
      { text: "zahlungen", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Spalten"],
    hints: ["Schau nach Spalten vom Typ DATE oder DATETIME."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Fitness-Uebungen-Muskelgruppen",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: fitnessDataset.id,
    question: "Welche Spalte in `uebungen` gibt die Zielmuskulatur an?",
    options: [
      { text: "name", isCorrect: false },
      { text: "muskelgruppe", isCorrect: true },
      { text: "kategorie", isCorrect: false },
      { text: "id", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Spalten"],
    hints: ["Die Spalte beschreibt, welche Muskelgruppe trainiert wird."],
  }),
  makeSchemaExercise("sch", {
    title: "Schema-Verstaendnis: Streaming-Watch-Progress",
    description: "Analysiere das Schema und beantworte die Frage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    datasetId: streamingDataset.id,
    question: "Welche Spalte in `watch_history` zeigt den Sehfortschritt?",
    options: [
      { text: "id", isCorrect: false },
      { text: "geschaut_am", isCorrect: false },
      { text: "fortschritt_prozent", isCorrect: true },
      { text: "film_id", isCorrect: false }
    ],
    tags: ["Schema-Verstaendnis", "Spalten"],
    hints: ["Suche die Spalte, die den Prozentsatz des Fortschritts speichert."],
  })
);
