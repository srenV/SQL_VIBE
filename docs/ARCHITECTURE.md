# Architektur — SQL VIBE

Detaillierte Architektur-Dokumentation der SQL VIBE Lernplattform.

---

## Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Schichten-Architektur](#schichten-architektur)
3. [Datenfluss](#datenfluss)
4. [Zwei-Typ-System](#zwei-typ-system)
5. [State Management](#state-management)
6. [Datenbank-Engine](#datenbank-engine)
7. [SQL-Editor (CodeMirror 6)](#sql-editor-codemirror-6)
8. [Routing](#routing)
9. [Build & Deployment](#build--deployment)

---

## Überblick

Der SQL VIBE ist eine **rein clientseitige** Single-Page-Application (SPA), die als statischer Next.js-Export deployed wird. Es gibt keinen Server, keine API-Routen, keine Datenbank — alles läuft im Browser.

```
┌──────────────────────────────────────────────────────┐
│                    Browser                           │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────┐ │
│  │ Next.js   │  │ sql.js   │  │ localStorage       │ │
│  │ (React)   │  │ (WASM)   │  │ - Progress         │ │
│  │           │  │          │  │ - Theme/Dialect    │ │
│  │ CodeMirror│  │          │  │                    │ │
│  │ (Editor)  │  │          │  │                    │ │
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
| **Hooks** | State-Management, Lifecycle, Daten-Fetching | `usePlayground.ts`, `useProgress.ts`, `useSandbox.ts` |
| **Logic** | Business-Logik: Validierung, Hinweise, Fehler | `resultsetComparison.ts`, `hintEngine.ts` |
| **Adapter** | Format-Konvertierung Katalog ↔ Playground | `playgroundAdapter.ts` |
| **Engine** | sql.js WASM Wrapper, Schema-Introspektion | `sqlEngine.ts`, `schemaExplorer.ts` |
| **Editor** | CodeMirror 6 SQL-Editor, Theme, Autocompletion | `sqlEditor.tsx`, `codeMirrorTheme.ts`, `dialect.ts` |
| **Compat** | MySQL-Kompatibilität, DB-Persistenz | `mysqlCompat.ts`, `dbStorage.ts` |
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
| `useSandbox` | Pro Sandbox-Session (Hook) | IndexedDB (DB-Persistenz) |
| `useSandbox.importFromSql` | Sandbox-Import (Hook-Methode) | In-Memory → IndexedDB |
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

### MySQL-Kompatibilität (`mysqlCompat.ts`)

```typescript
extractDatabaseName(sql: string) → string | null  // CREATE DATABASE/USE → DB-Name
```

Behandelt MySQL-spezifische Statements, die SQLite nicht unterstützt:
- `CREATE DATABASE name` → Extrahiert den Datenbanknamen für die Auto-Erstellung
- `USE database` → Wechselt den Datenbankkontext
- Fallback auf "Neue Datenbank" wenn kein Name extrahiert werden kann

---

## SQL-Editor (CodeMirror 6)

### Architektur

Der SQL-Editor basiert auf **CodeMirror 6** mit einem Compartment-basierten Rekonfigurations-System:

```typescript
// sqlEditor.tsx — Compartment-Pattern
const dialectCompartment = new Compartment();    // SQL-Dialekt (SQLite/MySQL/PostgreSQL)
const schemaCompartment = new Compartment();     // Schema für Autocompletion
const themeCompartment = new Compartment();       // Hell/Dunkel-Theme
const readOnlyCompartment = new Compartment();   // Disabled-Zustand
const autocompleteCompartment = new Compartment(); // Autocompletion an/aus
```

### Features

| Feature | Implementierung |
|---------|----------------|
| **Syntax-Highlighting** | `@codemirror/lang-sql` mit Dialekt-Wechsel (SQLite/MySQL/PostgreSQL) |
| **Autocompletion** | Custom `sqlCompletionSource()` — SQL-Keywords (UPPERCASE) + Schema-aware |
| **Dialekt-Wechsel** | `DialectSwitcher` → `useDialect()` → Compartment-Rekonfiguration |
| **Dark/Light Theme** | `getEditorTheme(isDark)` → Compartment-Rekonfiguration |
| **Ctrl+Enter** | Query ausführen |
| **Bracket Matching** | `@codemirror/language` |
| **Close Brackets** | `@codemirror/autocomplete` |
| **Search** | `@codemirror/search` |
| **History** | `@codemirror/commands` (Undo/Redo) |
| **Min. 6 Zeilen** | `minHeight: "10rem"` auf `.cm-editor` |
| **Autocompletion Toggle** | `autocompleteEnabled` Prop (default: `true`) |
| **Tooltip Overflow** | `position: "fixed"`, `zIndex: "9999"` auf Autocomplete-Tooltip |

### Autocompletion

Die `sqlCompletionSource()`-Funktion:

1. **Keyword-Filter:** Nur ~80 SQL-Schlüsselwörter (UPPERCASE) werden vorgeschlagen
2. **Schema-Aware:** Tabellen- und Spaltennamen aus der aktuellen Datenbank
3. **Prefix-Matching:** Vorschläge werden nach dem aktuellen Präfix gefiltert
4. **String-Erkennung:** Keine Autovervollständigung innerhalb von Strings
5. **Dot-Completion:** `tabelle.spalte` wird aufgelöst

### Theme

Das CodeMirror-Theme (`codeMirrorTheme.ts`) ist **vollständig hardcoded** — keine dynamischen CSS-Werte. Es verwendet die App-Farbtokens (primary, accent, surface, ink) und **JetBrains Mono** als Monospace-Font.

### Dialekt-System

```typescript
// dialect.ts — Context-basiert
const SQL_DIALECT_MAP: Record<Dialect, typeof MySQL> = {
  sqlite: SQLite,
  mysql: MySQL,
  postgresql: PostgreSQL,
};
```

Der Dialekt wird per `DialectProvider` global verwaltet und per `useDialect()` in Komponenten konsumiert. Der Wechsel löst eine Compartment-Rekonfiguration aus.

---

## Routing

```
/de                         Landing Page (Deutsch)
/en                         Landing Page (English)
/de/lektionen               Lektionen-Übersicht
/de/lektionen/[lessonId]    Lektions-Detail
/de/lektionen/[lessonId]/[exerciseId]  Übungsseite
/de/lernen                  Lern-Module Übersicht
/de/lernen/[moduleId]       Modul-Detail
/de/lernen/[moduleId]/[articleId]  Artikel-Detail
/de/uebung                  Direkte Übungsseite
/de/sandbox                 Freie SQL-Sandbox
/de/story                   Story-Übersicht
/de/profil                  Profil & Fortschritt
/en/*                       English equivalents
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
  ├── next-intl (i18n, path-based locales)
  ├── Local Fonts (Inter, JetBrains Mono)
  ├── Static Export (output: "export")
  │
  ▼
out/  (statische Dateien)
  │
  ▼
Vercel Deployment
```

**Hinweis:** SQL-Daten liegen als Template-Literals direkt in den `.ts`-Dataset-Dateien.
Es wird kein Prebuild-Schritt oder Build-Skript benötigt.

### Konfiguration (`next.config.ts`)

```typescript
{
  output: "export",
  images: { unoptimized: true },
  // Keine API-Routen, keine Middleware
}
```

### SEO

- **Per-Page Metadata:** Jede Route hat individuelle `title`, `description`, `keywords`, Open Graph, Twitter Card
- **JSON-LD:** `WebSite`, `SoftwareApplication`, `ItemList`, `Course`, `BreadcrumbList` Schemas
- **Sitemap:** `src/app/sitemap.ts` generiert statische XML-Sitemap
- **Manifest:** `src/app/manifest.ts` für PWA-Unterstützung
- **robots.txt:** `public/robots.txt` erlaubt Indexierung
- **404:** `src/app/not-found.tsx` mit deutschem Text
- **Canonical URLs:** Jede Seite hat `alternates.canonical`

### WCAG 2.1 AA

- Tabellen-Header mit `scope="col"` (1.3.1)
- ARIA-Tab-Pattern in SchemaExplorer (4.1.2)
- Touch-Targets ≥ 44px (2.5.5)
- `sr-only` Überschriften vor Inhalts-Grids (2.4.6)
- `aria-label` auf Badges, `aria-selected` auf Tabs (4.1.2)
