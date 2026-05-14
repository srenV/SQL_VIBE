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
| **Compat** | SQL-Dialekt-Transpilation, DB-Persistenz | `dialectCompat.ts`, `postgresCompat.ts`, `mysqlCompat.ts`, `dbStorage.ts` |
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
  ├── transpileToSqlite(userQuery, dialect)  # Dialekt → SQLite
  │     ├── "sqlite" → Pass-through
  │     ├── "mysql" → mysqlToSqlite()
  │     └── "postgresql" → postgresToSqlite()
  │
  ├── runQuery(db, transpiledSql)
  │     │
  │     └── db.exec(sql)              # sql.js Ausführung
  │
  ├── [Fehler?] mapSqliteError(error, dialect)  # SQLite-Fehler → Dialekt-Fehler
  │     └── explainError(mappedError)            # Deutsche Fehlermeldung
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
```

### SQLite-Kompatibilität

- **RIGHT JOIN** wird automatisch in LEFT JOIN transformiert (in `sqlEngine.ts`)
- **FOREIGN KEY Constraints** werden in DDL nicht deklariert (SQLite erfordert `PRAGMA foreign_keys = ON`)
- FK-Informationen kommen stattdessen aus Dataset-Metadaten (`ColumnDef.references`)
- **Dialekt-Transpilation** erfolgt über `dialectCompat.ts` vor der Ausführung (siehe oben)

### Dialekt-Kompatibilität (`dialectCompat.ts`)

Zentrale Einstiegsstelle für SQL-Transpilation. Routet Anfragen an den korrekten Transpiler:

```typescript
transpileToSqlite(sql, dialect) → string   // PostgreSQL/MySQL → SQLite
mapSqliteError(error, dialect) → string   // SQLite-Fehler → Dialekt-Fehler
mapSqliteType(type, dialect) → string     // SQLite-Typ → Dialekt-Typ
getCompatWarnings(dialect) → string[]     // Bekannte Einschränkungen
```

- `"sqlite"` → Pass-through (keine Transformation)
- `"mysql"` → `mysqlToSqlite()` + `mapSqliteErrorToMysql()` + `mapSqliteTypeToMysql()`
- `"postgresql"` → `postgresToSqlite()` + `mapSqliteErrorToPostgres()` + `mapSqliteTypeToPostgres()`

### PostgreSQL-Kompatibilität (`postgresCompat.ts`)

Übersetzt PostgreSQL-Syntax zu SQLite-äquivalenten Ausdrücken. Pipeline mit 17 Schritten:

1. **Dollar-quoted Strings** → `$$...$$` und `$tag$...$tag$` → reguläre Strings
2. **CREATE TABLE** → Typ-Mappings (SERIAL→INTEGER PK AUTOINCREMENT, BOOLEAN→INTEGER, TIMESTAMP→TEXT, VARCHAR→TEXT, INT→INTEGER, BIGINT→INTEGER, SMALLINT→INTEGER, DECIMAL→REAL, NUMERIC→REAL, DOUBLE PRECISION→REAL, GENERATED AS IDENTITY→AUTOINCREMENT)
3. **ALTER TABLE ADD COLUMN** → Gleiche Typ-Mappings wie CREATE TABLE + DEFAULT TRUE/FALSE→1/0 + DEFAULT CURRENT_TIMESTAMP-Schutz
4. **TRUNCATE TABLE** → `DELETE FROM`
5. **CAST shorthand** → `::type` → `CAST(expr AS type)`
6. **EXTRACT** → `EXTRACT(part FROM date)` → `strftime`
7. **Date functions** → `NOW()`/`CURRENT_TIMESTAMP` → `DATETIME('now')` (mit DEFAULT-Schutz und String-Literal-Schutz)
8. **NOT ILIKE** → `LOWER(col) NOT LIKE LOWER(pattern)`
9. **ILIKE** → `LOWER(col) LIKE LOWER(pattern)`
10. **IS DISTINCT FROM** → `IS NOT` / **IS NOT DISTINCT FROM** → `IS`
11. **RETURNING** → entfernt (auch `RETURNING col1, col2`)
12. **ON CONFLICT** → `INSERT OR IGNORE` / `INSERT OR REPLACE`
13. **TRUE/FALSE** → `1`/`0` (mit String-Literal-Schutz)
14. **STRING_AGG** → `GROUP_CONCAT`
15. **FILTER (WHERE)** → `CASE WHEN` auf Aggregaten
16. **TO_CHAR** → `strftime`, **TO_NUMBER** → `CAST AS INTEGER`, **TO_DATE** → `date()`
17. **DROP/CREATE DATABASE** → Kommentare

**Bekannte Einschränkungen:**
- `NOW()` in String-Literalen wird konvertiert (selten in der Praxis)

### MySQL-Kompatibilität (`mysqlCompat.ts`)

Übersetzt MySQL-Syntax zu SQLite-äquivalenten Ausdrücken. Pipeline mit 16 Schritten:

1. **phpMyAdmin-Kommentare** → `/*!40101 ... */` entfernt
2. **SET-Befehle** → `SET SQL_MODE`, `SET time_zone`, `START TRANSACTION`, `COMMIT` entfernt
3. **Backticks** → `\`` → `"`
4. **CREATE TABLE** → Typ-Mappings (BOOLEAN→INTEGER, DATETIME→TEXT, INT(n)→INTEGER, TINYINT/BIGINT/SMALLINT/MEDIUMINT→INTEGER, DOUBLE/FLOAT→REAL, FLOAT(n,m)→REAL, DECIMAL/NUMERIC→REAL, VARCHAR(n)→TEXT, CHAR(n)→TEXT, AUTO_INCREMENT→AUTOINCREMENT)
5. **RIGHT JOIN** → `LEFT JOIN` (Tabellen vertauscht)
6. **TRUNCATE TABLE** → `DELETE FROM`
7. **SHOW/DESCRIBE** → `sqlite_master`-Query / `PRAGMA table_info`
8. **LIMIT x, y** → `LIMIT y OFFSET x`
9. **Funktionen** → `IF()`→`CASE WHEN`, `CONCAT()`→`||`, `CONCAT_WS()`→`||`, `NOW()`/`CURDATE()`/`CURRENT_TIMESTAMP`→`DATETIME('now')`/`DATE('now')` (mit String-Literal-Schutz), `DATE_FORMAT()`→`strftime`, `YEAR()`/`MONTH()`/`DAY()`→`strftime`, `DATEDIFF()`→`julianday`, `SUBSTRING()`→`SUBSTR()`, `ISNULL()`→`IFNULL()`, `GREATEST()`→`MAX()`, `LEAST()`→`MIN()`, `TIMESTAMPDIFF()`→`julianday`-Berechnung, `TIMESTAMPADD()`→`date()`-Arithmetik
10. **ON DUPLICATE KEY UPDATE** → `INSERT OR REPLACE`
11. **TRUE/FALSE** → `1`/`0` (mit String-Literal-Schutz)
12. **NULL-safe equal** → `a <=> b` → `a IS b`
13. **XOR** → `a XOR b` → `((a OR b) AND NOT (a AND b))`
14. **ENGINE/CHARSET/COLLATE** → entfernt
13. **ALTER TABLE** → MySQL-spezifische Befehle (ADD KEY, ADD INDEX, CHANGE COLUMN, MODIFY COLUMN, ADD CONSTRAINT)
14. **DROP/CREATE DATABASE** → Kommentare

**Bekannte Einschränkungen:**
- ALTER TABLE ADD COLUMN konvertiert keine Typen (nur PG)

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
