# Datenmodell — SQL-Trainer

Dokumentation des Datenmodells: Katalog-Struktur, Datasets, Übungen und Typen.

---

## Inhaltsverzeichnis

1. [Katalog-Struktur](#katalog-struktur)
2. [Datasets](#datasets)
3. [Übungen](#übungen)
4. [Typ-System](#typ-system)
5. [Factory-Pattern](#factory-pattern)

---

## Katalog-Struktur

Der zentrale Katalog (`src/data/catalog.ts`) aggregiert alle Daten:

```typescript
interface Catalog {
  exercises: Record<string, Exercise>;   // 507 Übungen
  datasets: Record<string, Dataset>;     // 18 Datensätze (10 Standard + 8 Story)
  lessons: Record<string, Lesson>;       // 15 Lektionen
}
```

### Lektionen

```typescript
interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  exercises: string[];    // Exercise-IDs (Reihenfolge = Lernpfad)
  order: number;
}
```

| ID | Titel | Übungen |
|----|-------|---------|
| `lesson_select` | SELECT Grundlagen | ~40 |
| `lesson_where` | Filterlogik mit WHERE | ~40 |
| `lesson_order` | Sortieren und Begrenzen | ~30 |
| `lesson_aggregation` | GROUP BY & Aggregation | ~40 |
| `lesson_join` | JOINs | ~50 |
| `lesson_subquery` | Subqueries | ~30 |
| `lesson_cte` | Common Table Expressions | ~20 |
| `lesson_window` | Window Functions | ~20 |
| `lesson_dml` | Datenmanipulation | ~30 |
| `lesson_ddl` | Datendefinition | ~30 |
| `lesson_debug` | Debugging | ~30 |
| `lesson_predict` | Vorhersagen | ~20 |
| `lesson_schema` | Schema-Design | ~20 |
| `lesson_interview` | Interview-Fragen | ~40 |
| `lesson_story` | Story-Modus | 10 |

---

## Datasets

### Dataset-Struktur

```typescript
interface Dataset {
  id: string;
  name: string;
  description: string;
  sql: string;          // CREATE TABLE + INSERT Statements (inline Template-Literal)
  tables: TableDef[];   // Metadaten für Schema-Explorer
}
```

### SQL in Dataset-Dateien

Die SQL-Daten liegen als Template-Literals direkt in den `.ts`-Dataset-Dateien:

```typescript
// src/data/datasets/shop.ts
export const shopDataset: Dataset = {
  id: "shop",
  name: "Online-Shop",
  sql: `CREATE TABLE kunden (...); INSERT INTO kunden VALUES ...`,
  // ...
};
```

Kein Build-Schritt oder Prebuild-Hook erforderlich — der SQL-String ist direkt
im TypeScript-Modul enthalten.

interface TableDef {
  name: string;
  columns: ColumnDef[];
}

interface ColumnDef {
  name: string;
  type: string;
  nullable?: boolean;
  default?: string;
  references?: string;     // "tabelle.spalte" für FKs
  isPrimaryKey?: boolean;
}
```

### Wichtiger Hinweis: FOREIGN KEY Constraints

Die `sql`-DDL in den Datasets deklariert **keine** `REFERENCES`/`FOREIGN KEY`-Constraints:

```sql
-- So sieht die DDL aus (KEINE FK-Constraints):
CREATE TABLE bestellungen (
  id INTEGER PRIMARY KEY,
  kunde_id INTEGER NOT NULL  -- kein REFERENCES kunden(id)!
);
```

**Grund:** SQLite erfordert `PRAGMA foreign_keys = ON` und verhält sich sonst inkonsistent.

**Lösung:** FK-Informationen stecken in `ColumnDef.references`:
```typescript
{ name: "kunde_id", type: "INTEGER", nullable: false, references: "kunden.id" }
```

`buildSchemaTables()` in `playgroundAdapter.ts` extrahiert daraus `ForeignKey[]`-Arrays.

### Alle 18 Datensätze (10 Standard + 8 Story)

#### Standard-Datensätze

| ID | Name | Tabellen | Besonderheit |
|----|------|----------|-------------|
| `shop` | Online-Shop | 6 | kunden, bestellungen, produkte, kategorien, bestellpositionen, zahlungen |
| `fitness` | Fitness-Tracker | 4 | mitglieder, workouts, uebungen, workout_details |
| `hr` | Personalwesen | 4 | mitarbeiter, abteilungen, gehaelter, positionen |
| `tickets` | Ticketsystem | 4 | tickets, agenten, kunden, kommentare |
| `banking` | Bankwesen | 3 | konten, transaktionen, kunden |
| `streaming` | Streaming | 4 | nutzer, abos, inhalte, watchlist |
| `logs` | Server-Logs | 3 | server_logs, user_actions, error_logs |
| `university` | Universität | 4 | studenten, kurse, professoren, einschreibungen |
| `ecommerce` | E-Commerce | 4 | users, products, orders, reviews |
| `hospital` | Krankenhaus | 4 | patienten, aerzte, termine, behandlungen |

#### Story-Datensätze

| ID | Name | Story |
|----|------|-------|
| `story-anna7` | Vermisst: ANNA-7 | Einheit ANNA-7 verschwunden |
| `story-nexusmarkt` | Phantom-Transaktionen | NexusMarkt-Anomalien |
| `story-helpcore` | Virus im HelpCore-Netz | HelpCore-Infektion |
| `story-neuronale-luecke` | Neuronale Lücke | KI-Anomalie |
| `story-systemfehler-delta` | Systemfehler Delta | Delta-Systemfehler |
| `story-rote-zone` | Die rote Zone | Rote Zone Krise |
| `story-ghost-protocol` | Ghost Protocol Sigma | Geister-Protokoll |
| `story-geldstrom-omega` | Geldstrom Omega | Finanz-Anomalie |

---

## Übungen

### Exercise-Struktur

```typescript
interface Exercise {
  id: string;                    // Eindeutige ID (z.B. "sel_0001")
  title: string;                 // Kurztitel
  description: string;           // Aufgabenbeschreibung
  type: ExerciseType;            // write | debug | predict | schema | multiple_choice | story
  difficulty: Difficulty;        // beginner | junior | intermediate | advanced | interview
  category: string;              // SELECT, JOIN, etc.
  datasetId: string;             // Referenz auf Dataset.id
  referenceQuery?: string;       // Musterlösung (write)
  brokenQuery?: string;          // Fehlerhafte Query (debug)
  question?: string;             // Frage (predict/schema/multiple_choice)
  options?: Option[];            // Antwortoptionen
  hints: Hint[];                 // Gestaffelte Hinweise
  hiddenTests: HiddenTest[];     // Verdeckte Prüfabfragen
  tags: string[];                // Filter-Tags
  points: number;                // Gamification-Punkte
  order: number;                 // Sortierung innerhalb Kategorie
  story?: StoryData;             // Story-Daten (story)
}
```

### Übungstypen

| Typ | Beschreibung | Spezielle Felder |
|-----|-------------|-----------------|
| `write` | SQL-Abfrage schreiben | `referenceQuery` |
| `debug` | Fehlerhafte Query korrigieren | `brokenQuery`, `referenceQuery` |
| `predict` | Ergebnis vorhersagen | `question`, `options` |
| `schema` | Schema analysieren | `question`, `options` |
| `multiple_choice` | Allgemeine MC-Frage | `question`, `options` |
| `story` | Narrativer Spielmodus | `story` |

### Hint-System

```typescript
interface Hint {
  level: number;        // 1 = leicht, höher = konkreter
  text: string;         // Hinweistext
  trigger?: HintTrigger; // Wann wird der Hinweis angezeigt?
}

type HintTrigger =
  | { type: "syntax_error"; pattern?: string }
  | { type: "wrong_result"; comparisonStatus?: string }
  | { type: "repeated_failures"; threshold: number }
  | { type: "always" };
```

### Hidden Tests

```typescript
interface HiddenTest {
  name: string;
  query: string;            // Prüfabfrage
  compareMode: "exact" | "rows" | "columns" | "count" | "contains";
}
```

| Mode | Prüft |
|------|-------|
| `exact` | Komplettes Resultset (inkl. Reihenfolge) |
| `rows` | Zeileninhalte (Reihenfolge egal) |
| `columns` | Spaltennamen und -anzahl |
| `count` | Nur Zeilenanzahl |
| `contains` | Bestimmte Zeile muss enthalten sein |

---

## Typ-System

### Zwei getrennte Typ-Dateien

| Datei | Domäne | Key Types |
|-------|--------|-----------|
| `src/types/exercise.ts` | Katalog | `Exercise`, `Dataset`, `Lesson`, `Hint`, `HiddenTest` |
| `src/types/playground.ts` | Laufzeit | `PlaygroundExercise`, `SchemaTable`, `SqlQueryResult`, `ResultsetComparison` |

### Warum getrennt?

1. **Katalog-Typen** sind deklarativ und stabil — sie ändern sich nur, wenn neue Übungen hinzukommen
2. **Playground-Typen** sind Laufzeit-orientiert — sie enthalten UI-State, Query-Results, Schema-Daten
3. Der **Adapter** (`playgroundAdapter.ts`) ist die einzige Stelle, die beide Welten kennt

---

## Factory-Pattern

### `_factory.ts`

```typescript
makeWriteExercise(prefix, opts) → Exercise
makeDebugExercise(prefix, opts) → Exercise
makePredictExercise(prefix, opts) → Exercise
makeSchemaExercise(prefix, opts) → Exercise
makeMultipleChoiceExercise(prefix, opts) → Exercise
makeStoryExercise(prefix, opts) → Exercise
```

**Vorteile:**
- Konsistente ID-Generierung (`prefix_NNNN`)
- Standardwerte für `points`, `tags`, `order`
- Hint-Generierung aus String-Array
- Typ-Sicherheit durch spezifische Parameter pro Typ

### Beispiel

```typescript
makeWriteExercise("joi", {
  title: "kunden und bestellungen verbinden",
  description: "Zeige name und gesamtbetrag durch INNER JOIN...",
  difficulty: "junior",
  category: "JOIN",
  datasetId: "shop",
  referenceQuery: `SELECT name, gesamtbetrag FROM kunden
    INNER JOIN bestellungen ON kunden.id = bestellungen.kunde_id;`,
  hints: ["Verwende INNER JOIN ... ON."],
  hiddenTestQuery: `SELECT name, gesamtbetrag FROM kunden
    INNER JOIN bestellungen ON kunden.id = bestellungen.kunde_id;`,
  hiddenTestMode: "rows",
})
```
