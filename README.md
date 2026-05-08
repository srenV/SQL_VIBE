# SQL-Trainer — MySQL-Lernplattform

Interaktive MySQL-Lernplattform mit über 500 Übungen, sofortigem Feedback und gamifiziertem Fortschritt — alles direkt im Browser, ohne Anmeldung, ohne Server.

> **Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · sql.js (WASM) · React Flow · dagre · Framer Motion  
> **Tests:** 721 Tests (Vitest + Playwright E2E) · 719 grün, 2 pre-existing Failures  
> **Deployment:** Vercel (Static Export)

---

## Inhaltsverzeichnis

1. [Quick Start](#quick-start)
2. [Projektstruktur](#projektstruktur)
3. [Architektur](#architektur)
4. [Komponenten](#komponenten)
5. [Daten & Übungen](#daten--übungen)
6. [Playground-Infrastruktur](#playground-infrastruktur)
7. [Schema-Explorer & RM-Graph](#schema-explorer--rm-graph)
8. [Design-System](#design-system)
9. [Testing](#testing)
10. [Skripte](#skripte)
11. [Deployment](#deployment)
12. [Security & Datenschutz](#security--datenschutz)

---

## Quick Start

```bash
npm install
npm run dev
# Öffne http://localhost:3000
```

---

## Projektstruktur

```
SQL_VIBE/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root-Layout (Fonts, Theme, Metadata)
│   │   ├── page.tsx                  # Landing Page (Home)
│   │   ├── globals.css               # Tailwind v4 + Design Tokens
│   │   ├── lektionen/
│   │   │   ├── page.tsx              # Lektionen-Übersicht
│   │   │   └── [lessonId]/
│   │   │       └── [exerciseId]/     # Einzelne Übungsseite
│   │   └── uebung/
│   │       └── page.tsx              # Direkte Übungsseite
│   │
│   ├── components/                   # React-Komponenten
│   │   ├── playground.tsx            # Haupt-Playground (SQL-Editor + Results)
│   │   ├── sqlEditor.tsx             # SQL-Textarea mit Syntax-Highlighting
│   │   ├── resultsetTable.tsx        # Ergebnistabelle
│   │   ├── schemaExplorer.tsx        # Schema-Explorer (RM/Data/Schema Tabs)
│   │   ├── schemaGraph.tsx           # RM-Graph (React Flow + dagre + Bezier Edges)
│   │   ├── predictQuiz.tsx           # Multiple-Choice-Quiz
│   │   ├── storyPlayer.tsx           # Narrativer Spielmodus (SQL Agent)
│   │   ├── successCelebration.tsx    # Erfolgs-Animation mit Konfetti
│   │   ├── progressBar.tsx           # Fortschrittsbalken
│   │   ├── button.tsx                # Button (primary/secondary/ghost/accent)
│   │   ├── card.tsx                  # Card (flat/outlined/elevated)
│   │   ├── input.tsx                 # Input mit Label & Error
│   │   ├── container.tsx             # Responsive Container
│   │   ├── header.tsx                # Sticky Header mit Breadcrumbs
│   │   ├── footer.tsx                # Footer mit Impressum/Datenschutz
│   │   ├── logo.tsx                  # SQL-Trainer Logo
│   │   ├── themeProvider.tsx         # Theme-Script (Dark Mode Flash vermeiden)
│   │   ├── themeToggle.tsx           # Dark/Light Mode Toggle
│   │   ├── skeleton.tsx              # Skeleton-Loader
│   │   ├── animations.tsx            # FadeIn, AnimatedList, ScaleOnHover
│   │   ├── learn/                    # Lern-Modul Komponenten
│   │   │   ├── ArticlePageClient.tsx # Artikel-Renderer
│   │   │   ├── ErmDiagram.tsx        # ER-Diagramm für Lern-Module
│   │   │   ├── NfChecker.tsx         # Normalform-Checker
│   │   │   ├── RmToSql.tsx           # RM→SQL Konverter
│   │   │   └── moduleIcons.tsx       # Modul-Icons
│   │   ├── sandbox/                  # Sandbox-Komponenten
│   │   │   ├── sandboxWorkspace.tsx  # Sandbox-Hauptarbeitsbereich
│   │   │   └── sandboxSidebar.tsx    # Sandbox-Seitenleiste
│   │   └── ui/                       # (zukünftige UI-Primitives)
│   │
│   ├── hooks/                        # Custom Hooks
│   │   ├── usePlayground.ts          # Playground-Orchestrator (DB, Queries, Tests)
│   │   ├── useProgress.ts            # Lernfortschritt (Local Storage)
│   │   └── useSandbox.ts             # Sandbox-Orchestrator (DB, Queries, Schema)
│   │
│   ├── lib/                          # Utility-Funktionen & Engine
│   │   ├── sqlEngine.ts              # sql.js WASM Wrapper (DB, Queries, Schema)
│   │   ├── schemaExplorer.ts         # Schema-Introspektion & FK-Merge
│   │   ├── playgroundAdapter.ts      # Katalog → Playground Format Adapter
│   │   ├── resultsetComparison.ts    # Ergebnismengen-Vergleich
│   │   ├── hiddenTests.ts            # Verdeckte Tests
│   │   ├── hintEngine.ts             # Hinweis-Engine (Trigger-basiert)
│   │   ├── errorExplanation.ts       # SQL-Fehlererkennung (Deutsch)
│   │   ├── mysqlCompat.ts            # MySQL→SQLite Kompatibilität (CREATE DATABASE, USE, etc.)
│   │   ├── exercises.ts              # Beispiel-Übungen (Playground)
│   │   ├── dbStorage.ts              # IndexedDB-Persistenz für Sandbox
│   │   └── utils.ts                  # cn() Helper, String-Utils
│   │
│   ├── data/                         # Übungskatalog
│   │   ├── catalog.ts                # Zentraler Katalog (Lessons + Exercises)
│   │   ├── datasets/                 # 10 Datensätze
│   │   │   ├── index.ts              # Barrel-Export
│   │   │   ├── shop.ts               # Online-Shop
│   │   │   ├── fitness.ts            # Fitness-Tracker
│   │   │   ├── hr.ts                 # Personalwesen
│   │   │   ├── tickets.ts            # Ticketsystem
│   │   │   ├── banking.ts            # Bankwesen
│   │   │   ├── streaming.ts          # Streaming-Plattform
│   │   │   ├── logs.ts               # Server-Logs
│   │   │   ├── university.ts         # Universität
│   │   │   ├── ecommerce.ts          # E-Commerce
│   │   │   └── hospital.ts           # Krankenhaus
│   │   └── exercises/                # 15 Übungskategorien
│   │       ├── _factory.ts           # Factory-Funktionen
│   │       ├── index.ts              # Barrel-Export
│   │       ├── select.ts             # SELECT-Übungen
│   │       ├── where.ts              # WHERE-Übungen
│   │       ├── orderLimit.ts         # ORDER BY / LIMIT
│   │       ├── aggregation.ts        # GROUP BY / Aggregation
│   │       ├── join.ts               # JOIN-Übungen
│   │       ├── subquery.ts           # Subqueries
│   │       ├── cte.ts                # CTE / WITH
│   │       ├── windowFunction.ts     # Window Functions
│   │       ├── dml.ts                # INSERT / UPDATE / DELETE
│   │       ├── ddl.ts                # CREATE / ALTER / DROP
│   │       ├── debug.ts              # Debug-Übungen
│   │       ├── predict.ts            # Predict-Übungen
│   │       ├── schema.ts             # Schema-Design
│   │       ├── interview.ts          # Interview-Fragen
│   │       └── story.ts              # Story-Modus
│   │
│   ├── types/                        # TypeScript-Typen
│   │   ├── exercise.ts               # Katalog-Typen (Exercise, Dataset, Lesson)
│   │   └── playground.ts             # Playground-Typen (Queries, Results, Schema)
│   │
│   ├── fonts/                        # Inter Font (WOFF2, 6 Gewichte)
│   └── styles/                       # Zusätzliche Styles
│
├── e2e/                              # Playwright E2E-Tests
│   ├── landing.spec.ts               # Landing Page Tests
│   ├── navigation.spec.ts            # Navigation Tests
│   ├── exercise-interaction.spec.ts  # Übungs-Interaktion Tests
│   ├── lernen.spec.ts               # Lern-Modul Tests
│   ├── ueben.spec.ts                # Üben-Page Tests
│   ├── sandbox.spec.ts              # Sandbox Tests
│   └── tab-navigation.spec.ts       # Tab-Navigation Tests
│
├── scripts/                          # Build & Validation Scripts
│   ├── generate-exercises.js         # Übungs-Generator
│   ├── validate-all-exercises.js     # Übungs-Validator
│   └── verify-catalog.js             # Katalog-Verifikation
│
├── public/
│   └── sql-wasm.js                   # sql.js WASM Binary
│
├── DESIGN_SYSTEM.md                  # Design-System Dokumentation
├── package.json
├── tsconfig.json
├── next.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

---

## Architektur

### Datenfluss

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Datasets   │────▶│ playgroundAdapter │────▶│ PlaygroundExercise│
│  (10 Stück) │     │  buildSchemaTables│     │  .schemaTables   │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                      │
┌─────────────┐     ┌──────────────────┐              │
│  Exercises  │────▶│   adaptExercise   │──────────────┤
│  (500+ St.) │     └──────────────────┘              │
└─────────────┘                                       ▼
                                            ┌─────────────────┐
                                            │  usePlayground   │
                                            │  mergeSchemaWith │
                                            │  FKs()           │
                                            └────────┬────────┘
                                                     │
                     ┌───────────────────────────────┤
                     ▼                               ▼
            ┌───────────────┐              ┌─────────────────┐
            │ SchemaExplorer │              │    Playground    │
            │  (RM/Data/     │              │  (SQL-Editor +   │
            │   Schema Tabs) │              │   Results)       │
            └───────┬───────┘              └─────────────────┘
                    │
                    ▼
            ┌───────────────┐
            │  SchemaGraph   │
            │ (React Flow +  │
            │    dagre)      │
            └───────────────┘
```

### Zwei Typ-Systeme

| System | Datei | Zweck |
|--------|-------|-------|
| **Katalog-Typen** | `src/types/exercise.ts` | Übungsdefinitionen, Datasets, Lessons |
| **Playground-Typen** | `src/types/playground.ts` | Laufzeit-Typen: Queries, Resultsets, Schema |

Der **`playgroundAdapter.ts`** konvertiert zwischen beiden Systemen.

---

## Komponenten

### UI-Komponenten

| Komponente | Varianten | Props |
|-----------|-----------|-------|
| **Button** | `primary`, `secondary`, `ghost`, `accent` | `size` (sm/md/lg), `isLoading`, `disabled` |
| **Card** | `flat`, `outlined`, `elevated` | `className`, `children` |
| **Input** | — | `label`, `error`, `id`, `disabled` |
| **Container** | — | `as` (div/section/main), `className` |
| **ProgressBar** | `primary`, `success`, `accent` | `value`, `max`, `size` (sm/md/lg), `animated` |
| **Skeleton** | — | `width`, `height`, `rounded` |
| **Logo** | `compact` (nur "SQL") | `className` |

### Feature-Komponenten

| Komponente | Beschreibung |
|-----------|-------------|
| **Playground** | Haupt-Übungsumgebung: SQL-Editor, Ergebnis-Tabelle, Schema-Explorer, Hinweise |
| **SqlEditor** | Textarea mit Monospace-Font, Ctrl+Enter Submit, Error-State |
| **ResultsetTable** | Ergebnistabelle mit Spalten-Metadaten und NULL-Darstellung |
| **SchemaExplorer** | Drei-Tab-View: RM-Graph, Daten-Vorschau, Schema-Details |
| **SchemaGraph** | Interaktiver ER-Graph mit React Flow + dagre Auto-Layout |
| **PredictQuiz** | Multiple-Choice-Quiz mit Farb-Feedback (grün/rot) |
| **StoryPlayer** | Narrativer Spielmodus mit Kapitel-Fortschritt |
| **SuccessCelebration** | Konfetti-Animation bei erfolgreicher Lösung |
| **Header** | Sticky Header mit Breadcrumbs, Theme Toggle, Navigation |
| **Footer** | Footer mit Impressum, Datenschutz, GitHub-Link |
| **ThemeProvider** | Inline-Script zur Dark-Mode-Erkennung (vermeidet Flash) |
| **ThemeToggle** | Dark/Light Mode Toggle mit `useSyncExternalStore` |
| **Animations** | `FadeIn`, `AnimatedList`, `ScaleOnHover` (Framer Motion) |

---

## Daten & Übungen

### 10 Datensätze

| Dataset | Tabellen | Domäne |
|---------|----------|--------|
| `shop` | kunden, bestellungen, produkte, kategorien, bestellpositionen, zahlungen | Online-Shop |
| `fitness` | mitglieder, workouts, uebungen, workout_details | Fitness-Tracker |
| `hr` | mitarbeiter, abteilungen, gehaelter, positionen | Personalwesen |
| `tickets` | tickets, agenten, kunden, kommentare | Ticketsystem |
| `banking` | konten, transaktionen, kunden | Bankwesen |
| `streaming` | nutzer, abos, inhalte, watchlist | Streaming |
| `logs` | server_logs, user_actions, error_logs | Server-Logs |
| `university` | studenten, kurse, professoren, einschreibungen | Universität |
| `ecommerce` | users, products, orders, reviews | E-Commerce |
| `hospital` | patienten, aerzte, termine, behandlungen | Krankenhaus |

### 15 Übungskategorien (500+ Übungen)

| Kategorie | Typ | Anzahl | Schwierigkeit |
|-----------|-----|--------|---------------|
| SELECT | write | ~40 | beginner–intermediate |
| WHERE | write | ~40 | beginner–intermediate |
| ORDER BY / LIMIT | write | ~30 | beginner–intermediate |
| Aggregation | write | ~40 | junior–advanced |
| JOIN | write/debug/predict | ~50 | junior–advanced |
| Subqueries | write | ~30 | intermediate–advanced |
| CTE | write | ~20 | intermediate–advanced |
| Window Functions | write | ~20 | advanced |
| DML | write | ~30 | intermediate–advanced |
| DDL | write/debug | ~30 | intermediate–advanced |
| Debug | debug | ~30 | junior–advanced |
| Predict | predict | ~20 | beginner–intermediate |
| Schema | schema | ~20 | intermediate–advanced |
| Interview | write | ~40 | interview |
| Story | story | 3 | intermediate–advanced |

### Übungstypen

| Typ | Beschreibung | UI-Komponente |
|-----|-------------|---------------|
| `write` | SQL-Abfrage schreiben | `Playground` |
| `debug` | Fehlerhafte Query korrigieren | `Playground` (mit prefillQuery) |
| `predict` | Ergebnis vorhersagen (Multiple Choice) | `PredictQuiz` |
| `schema` | Schema analysieren (Multiple Choice) | `PredictQuiz` |
| `multiple_choice` | Allgemeine Multiple Choice | `PredictQuiz` |
| `story` | Narrativer Spielmodus | `StoryPlayer` |

---

## Playground-Infrastruktur

### usePlayground Hook

Der zentrale Orchestrator-Hook verwaltet den gesamten Lebenszyklus einer Übung:

```
initDb()
  ├── createDatabase(setupSql)     # sql.js In-Memory DB
  ├── runQuery(solutionQuery)      # Referenz-Resultset
  └── mergeSchemaWithFKs()         # Live-Schema + FKs

runUserQuery()
  ├── runQuery(userQuery)          # Benutzer-Abfrage
  ├── explainError()               # Fehleranalyse (Deutsch)
  ├── compareResultsets()          # Ergebnis-Vergleich
  ├── runHiddenTests()             # Verdeckte Tests
  └── selectHint()                 # Trigger-basierte Hinweise
```

### sql.js Engine (`sqlEngine.ts`)

- **`createDatabase(sql)`** — Erstellt In-Memory-DB mit DDL/DML
- **`runQuery(db, sql)`** — Führt SQL aus, liefert `SqlQueryResult`
- **`getSchema(db)`** — Alle Tabellen via `sqlite_master`
- **`getTableInfo(db, table)`** — Spalten via `PRAGMA table_info`
- **`getForeignKeys(db, table)`** — FKs via `PRAGMA foreign_key_list`
- **`peekTableData(db, table, limit)`** — Daten-Vorschau
- **`transformRightJoin(sql)`** — RIGHT JOIN → LEFT JOIN (SQLite-Kompatibilität)

### Ergebnis-Validierung

1. **`resultsetComparison.ts`** — Vergleicht Spalten (Namen, Typen, Anzahl) und Zeilen (Inhalt, Anzahl)
2. **`hiddenTests.ts`** — Führt verdeckte Prüfabfragen aus (5 Compare-Modi: `exact`, `rows`, `columns`, `count`, `contains`)
3. **`hintEngine.ts`** — Trigger-basierte Hinweisauswahl (`syntax_error`, `wrong_result`, `repeated_failures`, `always`)

### Fehlererkennung (`errorExplanation.ts`)

Erkennt 20+ SQL-Fehlertypen und liefert deutsche Erklärungen:
- Syntax-Fehler, fehlende Tabellen/Spalten
- Datentyp-Konflikte, Aggregat-Fehler
- FOREIGN KEY / UNIQUE / NOT NULL Constraints
- Division by Zero, GROUP BY erforderlich
- RIGHT JOIN (nicht unterstützt), LIMIT-Reihenfolge

---

## Schema-Explorer & RM-Graph

Der Schema-Explorer (`schemaExplorer.tsx`) bietet drei Ansichten:

| Tab | Komponente | Beschreibung |
|-----|-----------|-------------|
| **RM** | `SchemaGraph` | Relationales Modell als interaktiver Graph (React Flow + dagre) |
| **Daten** | Inline-Tabelle | Live-Daten-Vorschau (max. 10 Zeilen pro Tabelle) |
| **Schema** | `Card` + Tabelle | Spalten, Typen, PKs, FKs als strukturierte Liste |

### RM-Graph Architektur

```
SchemaExplorer (tables, db)
  └── SchemaGraph (tables)
        └── ReactFlowProvider
              └── SchemaGraphInner
                    ├── layoutWithDagre() → { nodes, edges }
                    │     ├── referencedColumns Map (welche Spalten sind FK-Ziele)
                    │     ├── Per-column Handles (source-{col}, target-{col})
                    │     └── Parallele Edges → curvature-Verteilung
                    └── ReactFlow (nodes, edges, nodeTypes, edgeTypes)
                          ├── TableNode (custom node)
                          │     ├── Handle (source, Position.Right) — pro FK-Spalte
                          │     ├── Handle (target, Position.Left) — pro PK/referenzierte Spalte
                          │     ├── Header (Tabellenname)
                          │     └── Columns (PK/FK badges, Name, Typ)
                          ├── FkEdge (custom edge)
                          │     └── Bezier-Kurve mit konfigurierbarer curvature
                          ├── Background (Dots)
                          └── Controls (Zoom, Fit)
```

### FK-Merge-Strategie

Die SQL-DDL in den Datasets deklariert **keine** `FOREIGN KEY`-Constraints (SQLite-Kompatibilität). Die FK-Informationen stecken stattdessen in den `ColumnDef.references`-Metadaten der Dataset-Definition.

**`mergeSchemaWithFKs()`** in `schemaExplorer.ts` löst das Problem:
1. `introspectSchema(db)` liefert Spalten aus der Live-DB (via `PRAGMA table_info`)
2. `exercise.schemaTables` enthält FKs aus den Dataset-Metadaten (via `buildSchemaTables`)
3. Der Merge übernimmt Spalten aus (1) und FKs aus (2)

**dagre-Layout:**
- **Mit Kanten:** `rankdir: "LR"` (left-to-right) — klassisches ER-Diagramm-Layout
- **Ohne Kanten:** `rankdir: "TB"` (top-to-bottom) — verhindert Stacking isolierter Nodes

---

## Design-System

Siehe **[DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)** für die vollständige Dokumentation.

### Kern-Design-Tokens

| Kategorie | Tokens |
|-----------|--------|
| **Primär** | `primary-50` … `primary-950` (Indigo) |
| **Akzent** | `accent-50` … `accent-950` (Teal) |
| **Surface** | `surface`, `surface-dim`, `dark-dim` |
| **Ink** | `ink`, `ink-muted`, `ink-inverted` |
| **Semantisch** | `success`, `warning`, `error`, `info` |
| **Font** | Inter (300–800, WOFF2, `--font-inter`) |
| **Mono** | System Monospace (`--font-mono`) |

### Dark Mode

- CSS Custom Properties mit `.dark`-Override
- `ThemeScript` (Inline-Script) verhindert Flash beim Laden
- `ThemeToggle` mit `useSyncExternalStore` für sofortige Reaktion
- Persistenz via `localStorage` (`sql-trainer-theme`)

---

## Testing

### Unit & Integration Tests (Vitest)

```bash
npm test                # Alle Tests mit Coverage
npx vitest run          # Ohne Coverage (schneller)
```

**20 Test-Dateien, 721 Tests:**

| Test-Datei | Tests | Bereich |
|-----------|-------|---------|
| `resultsetComparison.test.ts` | 12 | Ergebnis-Vergleich |
| `errorExplanation.test.ts` | 20 | Fehlererkennung |
| `hintEngine.test.ts` | 7 | Hinweis-Engine |
| `hiddenTests.test.ts` | 11 | Verdeckte Tests |
| `playgroundAdapter.test.ts` | 9 | Katalog→Playground Adapter |
| `schemaExplorer.test.ts` | 5 | Schema-Introspektion |
| `sqlEngine.test.ts` | 16 | RIGHT JOIN Transformation |
| `mysqlCompat.test.ts` | 70 | MySQL→SQLite Kompatibilität |
| `utils.test.ts` | 8 | cn() Helper |
| `catalog.test.ts` | 9 | Katalog-Validierung |
| `validate.test.ts` | 500 | Alle 500+ Übungen validiert |
| `story.test.ts` | 3 | Story-Modus Integration |
| `useProgress.test.ts` | 18 | Fortschritts-Hook |
| `button.test.tsx` | 7 | Button-Komponente |
| `card.test.tsx` | 5 | Card-Komponente |
| `input.test.tsx` | 4 | Input-Komponente |
| `container.test.tsx` | 3 | Container-Komponente |
| `logo.test.tsx` | 3 | Logo-Komponente |
| `animations.test.tsx` | 7 | Animations-Komponenten |
| `page.test.tsx` | 4 | Home Page |

### E2E Tests (Playwright)

```bash
npm run test:e2e        # Headless
npm run test:e2e:ui     # Mit UI
```

| Test-Datei | Bereich |
|-----------|---------|
| `landing.spec.ts` | Landing Page: Überschrift, Buttons, Navigation |
| `navigation.spec.ts` | Navigation: Lektionen, Übungen, Breadcrumbs |
| `exercise-interaction.spec.ts` | Übungs-Interaktion: SQL schreiben, ausführen, Feedback |
| `lernen.spec.ts` | Lern-Module: Artikel, Navigation |
| `ueben.spec.ts` | Üben-Page: Übungsliste, Filter |
| `sandbox.spec.ts` | Sandbox: SQL-Editor, Schema-Explorer |
| `tab-navigation.spec.ts` | Tab-Navigation: Schema-Explorer Tabs |

---

## Skripte

| Skript | Beschreibung |
|--------|-------------|
| `npm run dev` | Entwicklungsserver (Next.js + Turbopack) |
| `npm run build` | Produktions-Build (Static Export nach `out/`) |
| `npm run start` | Produktions-Server starten |
| `npm run lint` | ESLint-Prüfung |
| `npm run lint:fix` | ESLint Auto-Fix |
| `npm run format` | Prettier Formatierung |
| `npm run check-format` | Prettier Format-Check |
| `npm test` | Vitest mit Coverage |
| `npm run test:e2e` | Playwright E2E-Tests |
| `npm run test:e2e:ui` | Playwright mit UI |

### Utility-Skripte (`scripts/`)

| Skript | Beschreibung |
|--------|-------------|
| `generate-exercises.js` | Generiert Übungen aus Templates |
| `validate-all-exercises.js` | Validiert alle Übungen gegen ihre Datasets |
| `verify-catalog.js` | Verifiziert die Katalog-Struktur |

---

## Deployment

**Ziel-Plattform: Vercel** (Static Export)

```bash
npm run build   # Statischer Export nach out/
```

- `next.config.ts` konfiguriert `output: "export"`
- Keine API-Routen, keine Server-seitige Logik
- sql.js WASM muss in `public/` liegen

---

## Security & Datenschutz

- **Keine API-Routen** — reiner Static Export
- **Keine Secrets** oder API-Keys im Client-Code
- **Kein `dangerouslySetInnerHTML`** oder `eval()` auf Benutzereingaben (außer `ThemeScript`, das nur statisches JS enthält)
- **Zero-PII:** Es werden keine personenbezogenen Daten erfasst
- **Local Storage only:** Fortschritt (`sql-trainer-progress`) und Theme (`sql-trainer-theme`) werden ausschließlich im Browser gespeichert
- **Keine Tracking-Cookies,** kein Analytics, kein externes CDN für Fonts (Inter ist lokal als WOFF2 eingebettet)

---

## Lizenz

&copy; Sören Timo Voigt 2025–2026

---

## Entwicklungsmethodik

Dieses Projekt wurde mit Unterstützung agensbasierter KI-Workflows entwickelt, die verschiedene spezialisierte Tools orchestrieren:

| Tool | Einsatzbereich |
|------|---------------|
| **Cursor (Copilot)** | Hauptsächliche IDE mit Inline-Code-Generierung, Refactoring und kontextbewussten Vorschlägen |
| **Codex (OpenAI)** | Architektur-Entscheidungen, komplexe Algorithmen und dateiübergreifende Refactorings |
| **Manus.im** | Tiefgehende Recherche, Prototyping und iterativer Feature-Ausbau |
| **Stitch** | UI-Komponenten-Generierung und visuelle Integration |

Die KI-Agenten wurden als spezialisierte Werkzeuge eingesetzt — nicht als Ersatz für Engineering-Entscheidungen. Jede generierte Lösung wurde manuell verifiziert, auf Konsistenz mit der bestehenden Architektur geprüft und bei Bedarf angepasst. Die finale Code-Verantwortung liegt beim Entwickler.

---

## Lizenz

Privat – SQL-Trainer Intern.
