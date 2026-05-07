# Architektur — SQL-Trainer

Detaillierte Architektur-Dokumentation der SQL-Trainer MySQL-Lernplattform.

---

## Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Schichten-Architektur](#schichten-architektur)
3. [Datenfluss](#datenfluss)
4. [Zwei-Typ-System](#zwei-typ-system)
5. [State Management](#state-management)
6. [Datenbank-Engine](#datenbank-engine)
7. [Routing](#routing)
8. [Build & Deployment](#build--deployment)

---

## Überblick

Der SQL-Trainer ist eine **rein clientseitige** Single-Page-Application (SPA), die als statischer Next.js-Export deployed wird. Es gibt keinen Server, keine API-Routen, keine Datenbank — alles läuft im Browser.

```
┌──────────────────────────────────────────────────────┐
│                    Browser                           │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ Next.js   │  │ sql.js   │  │ localStorage       │ │
│  │ (React)   │  │ (WASM)   │  │ - Progress         │ │
│  │           │  │          │  │ - Theme             │ │
│  └──────────┘  └──────────┘  └────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

---

## Schichten-Architektur

```
┌─────────────────────────────────────────┐
│              UI-Schicht                  │
│  pages, components, animations          │
├─────────────────────────────────────────┤
│           Hook-Schicht                   │
│  usePlayground, useProgress             │
├─────────────────────────────────────────┤
│           Logic-Schicht                  │
│  resultsetComparison, hintEngine,       │
│  hiddenTests, errorExplanation          │
├─────────────────────────────────────────┤
│           Adapter-Schicht                │
│  playgroundAdapter                      │
├─────────────────────────────────────────┤
│           Engine-Schicht                 │
│  sqlEngine, schemaExplorer              │
├─────────────────────────────────────────┤
│           Data-Schicht                   │
│  catalog, datasets, exercises           │
├─────────────────────────────────────────┤
│           Type-Schicht                   │
│  exercise.ts, playground.ts             │
└─────────────────────────────────────────┘
```

### Schicht-Verantwortlichkeiten

| Schicht | Verantwortung | Key Files |
|---------|--------------|-----------|
| **UI** | Rendering, User-Interaktion, Animationen | `playground.tsx`, `schemaGraph.tsx`, `sqlEditor.tsx` |
| **Hooks** | State-Management, Lifecycle, Daten-Fetching | `usePlayground.ts`, `useProgress.ts` |
| **Logic** | Business-Logik: Validierung, Hinweise, Fehler | `resultsetComparison.ts`, `hintEngine.ts` |
| **Adapter** | Format-Konvertierung Katalog ↔ Playground | `playgroundAdapter.ts` |
| **Engine** | sql.js WASM Wrapper, Schema-Introspektion | `sqlEngine.ts`, `schemaExplorer.ts` |
| **Data** | Übungsdefinitionen, Datasets, Katalog | `catalog.ts`, `datasets/*.ts`, `exercises/*.ts` |
| **Types** | TypeScript-Typdefinitionen | `exercise.ts`, `playground.ts` |

---

## Datenfluss

### Übungsstart

```
User klickt Übung
  │
  ▼
ExercisePageClient
  │ exerciseId
  ▼
catalog.exercises[id] + catalog.datasets[exercise.datasetId]
  │ Exercise + Dataset
  ▼
adaptExercise(exercise, dataset)
  │ PlaygroundExercise
  ▼
usePlayground(playgroundExercise)
  │
  ├── createDatabase(setupSql)     → sql.js In-Memory DB
  ├── runQuery(solutionQuery)      → referenceResultset
  └── mergeSchemaWithFKs()         → liveSchema (Spalten + FKs)
  │
  ▼
Playground-Komponente
  ├── SqlEditor (userQuery)
  ├── SchemaExplorer (liveSchema)
  │     └── SchemaGraph (React Flow)
  └── ResultsetTable (queryResult)
```

### Query-Ausführung

```
User schreibt SQL & klickt "Ausführen"
  │
  ▼
usePlayground.runUserQuery()
  │
  ├── runQuery(db, userQuery)
  │     │
  │     ├── transformRightJoin(sql)   # RIGHT JOIN → LEFT JOIN
  │     └── db.exec(sql)              # sql.js Ausführung
  │
  ├── [Fehler?] explainError(error)   # Deutsche Fehlermeldung
  │
  ├── compareResultsets(ref, actual)  # Spalten + Zeilen vergleichen
  │
  ├── [equal?] runHiddenTests(db, tests)  # Verdeckte Prüfabfragen
  │
  └── [partial?] selectHint(hints, ctx)   # Trigger-basierter Hinweis
```

---

## Zwei-Typ-System

Der SQL-Trainer verwendet zwei getrennte Typ-Systeme für unterschiedliche Domänen:

### Katalog-Typen (`src/types/exercise.ts`)

```typescript
interface Exercise {
  id: string;
  title: string;
  type: "write" | "debug" | "predict" | "schema" | "multiple_choice" | "story";
  difficulty: "beginner" | "junior" | "intermediate" | "advanced" | "interview";
  datasetId: string;
  referenceQuery?: string;
  brokenQuery?: string;
  hints: Hint[];
  hiddenTests: HiddenTest[];
  // ...
}

interface Dataset {
  id: string;
  name: string;
  sql: string;          // CREATE TABLE + INSERT Statements
  tables: TableDef[];   // Metadaten (Spalten, Referenzen)
}
```

### Playground-Typen (`src/types/playground.ts`)

```typescript
interface PlaygroundExercise {
  id: string;
  setupSql: string;       // Aus Dataset.sql
  solutionQuery: string;  // Aus Exercise.referenceQuery
  schemaTables?: SchemaTable[];
  hiddenTests?: HiddenTest[];
  hints?: ExerciseHint[];
  // ...
}

interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
  foreignKeys?: ForeignKey[];
}
```

### Warum zwei Systeme?

- **Katalog-Typen** sind die "Source of Truth" — sie beschreiben Übungen deklarativ
- **Playground-Typen** sind das Laufzeit-Format — optimiert für die UI-Komponenten
- Der **`playgroundAdapter.ts`** trennt beide Welten sauber und verhindert, dass UI-Code Katalog-Interna kennen muss

---

## State Management

### Kein globaler State

Der SQL-Trainer verwendet **keinen** globalen State-Manager (Redux, Zustand, Context). Jeder State ist lokal:

| State | Scope | Persistenz |
|-------|-------|-----------|
| `usePlayground` | Pro Übung (Hook) | Nein (flüchtig) |
| `useProgress` | Global (Hook) | `localStorage` |
| Theme | Global (DOM-Klasse) | `localStorage` |
| UI-Zustände | Pro Komponente (`useState`) | Nein |

### usePlayground State-Machine

```
idle ──runUserQuery()──▶ running
                           │
                    ┌──────┴──────┐
                    ▼              ▼
                 success         error
              (alles korrekt)  (SQL-Fehler)
                    │              │
                    │         showHint()
                    │              │
                    ▼              ▼
                 partial        partial
              (mit Hinweis)   (mit Hinweis)
```

---

## Datenbank-Engine

### sql.js Integration

```typescript
// sqlEngine.ts — zentrale API

createDatabase(sql: string) → Database     // Neue In-Memory DB
runQuery(db, sql: string) → SqlQueryResult // Query ausführen
getSchema(db) → { name, sql }[]            // Alle Tabellen
getTableInfo(db, table) → ColumnMeta[]     // Spalten (PRAGMA)
getForeignKeys(db, table) → FK[]           // FKs (PRAGMA)
peekTableData(db, table, limit) → Result   // Daten-Vorschau
transformRightJoin(sql) → string           // RIGHT→LEFT JOIN
```

### SQLite-Kompatibilität

- **RIGHT JOIN** wird automatisch in LEFT JOIN transformiert (`transformRightJoin`)
- **FOREIGN KEY Constraints** werden in DDL nicht deklariert (SQLite erfordert `PRAGMA foreign_keys = ON`)
- FK-Informationen kommen stattdessen aus Dataset-Metadaten (`ColumnDef.references`)

---

## Routing

```
/                           Landing Page
/lektionen                  Lektionen-Übersicht
/lektionen/[lessonId]       Lektions-Detail
/lektionen/[lessonId]/[exerciseId]  Übungsseite
/uebung                     Direkte Übungsseite
```

Alle Routen sind **statisch** — keine dynamischen Server-Routen. Next.js `output: "export"` generiert statische HTML-Dateien.

---

## Build & Deployment

### Build-Pipeline

```
Source (TS/TSX)
  │
  ▼
Next.js Build (Turbopack)
  │
  ├── TypeScript Compilation
  ├── Tailwind CSS v4 (JIT)
  ├── Static Export (output: "export")
  │
  ▼
out/  (statische Dateien)
  │
  ▼
Vercel Deployment
```

### Konfiguration (`next.config.ts`)

```typescript
{
  output: "export",
  images: { unoptimized: true },
  // Keine API-Routen, keine Middleware
}
```
