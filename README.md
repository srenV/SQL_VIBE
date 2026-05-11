# SQL-Trainer — MySQL-Lernplattform

Interaktive MySQL-Lernplattform mit über 500 Übungen, sofortigem Feedback und gamifiziertem Fortschritt — alles direkt im Browser, ohne Anmeldung, ohne Server.

> **Stack:** Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · sql.js (WASM) · React Flow · dagre · Framer Motion  
> **Tests:** 743 Tests (Vitest + Playwright E2E) · alle grün  
> **Deployment:** [sql-vibe.vercel.app](https://sql-vibe.vercel.app) (Vercel Static Export)

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
│   │   ├── layout.tsx                # Root-Layout (Fonts, Theme, Metadata, SEO)
│   │   ├── page.tsx                  # Landing Page (Home)
│   │   ├── not-found.tsx             # 404-Seite
│   │   ├── sitemap.ts                # XML-Sitemap (statisch)
│   │   ├── manifest.ts               # Web App Manifest (PWA)
│   │   ├── globals.css               # Tailwind v4 + Design Tokens
│   │   ├── lektionen/
│   │   │   ├── page.tsx              # Lektionen-Übersicht
│   │   │   └── [lessonId]/
│   │   │       ├── page.tsx           # Lektions-Detail
│   │   │       └── [exerciseId]/     # Einzelne Übungsseite
│   │   ├── lernen/
│   │   │   ├── layout.tsx            # Lernen-Layout
│   │   │   ├── page.tsx              # Lern-Module Übersicht
│   │   │   └── [moduleId]/
│   │   │       ├── page.tsx          # Modul-Detail
│   │   │       └── [articleId]/     # Artikel-Detail
│   │   ├── sandbox/
│   │   │   ├── layout.tsx            # Sandbox-Layout
│   │   │   └── page.tsx              # Freie SQL-Sandbox
│   │   ├── story/
│   │   │   ├── layout.tsx            # Story-Layout
│   │   │   └── page.tsx              # Story-Übersicht
│   │   ├── profil/
│   │   │   └── page.tsx              # Profil & Fortschritt
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
│   │   ├── card.tsx                  # Card (default/flat/outlined)
│   │   ├── input.tsx                 # Input mit Label & Error
│   │   ├── container.tsx             # Responsive Container
│   │   ├── header.tsx                # Sticky Header mit Breadcrumbs
│   │   ├── footer.tsx                # Footer mit Impressum/Datenschutz
│   │   ├── logo.tsx                  # SQL-Trainer Logo
│   │   ├── themeProvider.tsx         # Theme-Script (Dark Mode Flash vermeiden)
│   │   ├── themeToggle.tsx           # Dark/Light Mode Toggle
│   │   ├── skeleton.tsx              # Skeleton-Loader
│   │   ├── animations.tsx            # FadeIn, AnimatedList, ScaleOnHover
│   │   ├── animatedCard.tsx          # Animierbare Karte (Hover-Effekte)
│   │   ├── featureCard.tsx           # Feature-Karte für Landing Page
│   │   ├── levelBadge.tsx            # Schwierigkeits-Badge
│   │   ├── achievementIcon.tsx       # Achievement-Icon
│   │   ├── achievementToast.tsx     # Achievement-Benachrichtigung
│   │   ├── streakFlame.tsx           # Streak-Flammen-Animation
│   │   ├── storyIntro.tsx            # Story-Intro-Overlay
│   │   ├── scrambleText.tsx          # Text-Scramble-Animation
│   │   ├── introOverlay.tsx          # Intro-Overlay für Erstbesucher
│   │   ├── learn/                    # Lern-Modul Komponenten
│   │   │   ├── ArticlePageClient.tsx # Artikel-Renderer
│   │   │   ├── ErmDiagram.tsx        # ER-Diagramm für Lern-Module
│   │   │   ├── NfChecker.tsx         # Normalform-Checker
│   │   │   ├── RmToSql.tsx           # RM→SQL Konverter
│   │   │   └── moduleIcons.tsx       # Modul-Icons
│   │   └── sandbox/                  # Sandbox-Komponenten
│   │       ├── sandboxWorkspace.tsx  # Sandbox-Hauptarbeitsbereich
│   │       └── sandboxSidebar.tsx    # Sandbox-Seitenleiste
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
│   │   ├── learnContent.ts           # Lern-Module & Artikel
│   │   ├── datasets/                 # 18 Datensätze (10 Standard + 8 Story)
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
│   │   │   ├── hospital.ts           # Krankenhaus
│   │   │   ├── story-anna7.ts        # Story: Vermisst ANNA-7
│   │   │   ├── story-nexusmarkt.ts   # Story: Phantom-Transaktionen
│   │   │   ├── story-helpcore.ts     # Story: Virus im HelpCore-Netz
│   │   │   ├── story-neuronale-luecke.ts # Story: Neuronale Lücke
│   │   │   ├── story-systemfehler-delta.ts # Story: Systemfehler Delta
│   │   │   ├── story-rote-zone.ts    # Story: Die rote Zone
│   │   │   ├── story-ghost-protocol.ts # Story: Ghost Protocol Sigma
│   │   │   └── story-geldstrom-omega.ts # Story: Geldstrom Omega
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
│   │       ├── windowFunctions.ts    # Window Functions
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
│   └── fonts/                        # Inter Font (WOFF2, 6 Gewichte: 400–900)
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
│   ├── sql-wasm.js                   # sql.js WASM Binary
│   ├── robots.txt                    # Suchmaschinen-Steuerung
│   ├── icon.svg                      # App-Icon (SVG)
│   └── favicon.ico                   # Favicon
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
│  (18 Stück) │     │  buildSchemaTables│     │  .schemaTables   │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                      │
┌─────────────┐     ┌──────────────────┐              │
│  Exercises  │────▶│   adaptExercise   │──────────────┤
│  (507 St.)  │     └──────────────────┘              │
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
| **Card** | `default`, `flat`, `outlined` | `className`, `children` |
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

### 18 Datensätze (10 Standard + 8 Story)

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
| `story-anna7` | Story-exklusiv | Vermisst: ANNA-7 |
| `story-nexusmarkt` | Story-exklusiv | Phantom-Transaktionen |
| `story-helpcore` | Story-exklusiv | Virus im HelpCore-Netz |
| `story-neuronale-luecke` | Story-exklusiv | Neuronale Lücke |
| `story-systemfehler-delta` | Story-exklusiv | Systemfehler Delta |
| `story-rote-zone` | Story-exklusiv | Die rote Zone |
| `story-ghost-protocol` | Story-exklusiv | Ghost Protocol Sigma |
| `story-geldstrom-omega` | Story-exklusiv | Geldstrom Omega |

### 15 Übungskategorien (507 Übungen)

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
| Story | story | 10 | beginner–advanced |

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
| **Font** | Inter (400–900, WOFF2, `--font-inter`) |
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

**20 Test-Dateien, 743 Tests:**

| Test-Datei | Tests | Bereich |
|-----------|-------|---------|
| `resultsetComparison.test.ts` | 12 | Ergebnis-Vergleich |
| `errorExplanation.test.ts` | 20 | Fehlererkennung |
| `hintEngine.test.ts` | 7 | Hinweis-Engine |
| `hiddenTests.test.ts` | 11 | Verdeckte Tests |
| `playgroundAdapter.test.ts` | 9 | Katalog→Playground Adapter |
| `schemaExplorer.test.ts` | 5 | Schema-Introspektion |
| `sqlEngine.test.ts` | 16 | RIGHT JOIN Transformation |
| `mysqlCompat.test.ts` | 85 | MySQL→SQLite Kompatibilität |
| `utils.test.ts` | 8 | cn() Helper |
| `catalog.test.ts` | 9 | Katalog-Validierung |
| `validate.test.ts` | 507 | Alle 507 Übungen validiert |
| `story.test.ts` | 3 | Story-Modus Integration |
| `useProgress.test.ts` | 18 | Fortschritts-Hook |
| `button.test.tsx` | 7 | Button-Komponente |
| `card.test.tsx` | 5 | Card-Komponente |
| `input.test.tsx` | 4 | Input-Komponente |
| `container.test.tsx` | 3 | Container-Komponente |
| `logo.test.tsx` | 3 | Logo-Komponente |
| `animations.test.tsx` | 7 | Animations-Komponenten |
| `page.test.tsx` | 5 | Home Page |

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

## SEO & Performance

- **Per-Page Metadata:** Jede Route hat individuelle `<title>`, `description`, `keywords`, Open Graph und Twitter Card Meta
- **JSON-LD Structured Data:** `WebSite`, `SoftwareApplication`, `ItemList`, `Course`, `BreadcrumbList` Schemas
- **XML-Sitemap:** `src/app/sitemap.ts` generiert statische Sitemap mit allen Routen
- **Web App Manifest:** `src/app/manifest.ts` für PWA-Unterstützung
- **robots.txt:** `public/robots.txt` erlaubt Indexierung
- **404-Seite:** `src/app/not-found.tsx` mit deutschem Text und Navigation
- **Canonical URLs:** Jede Seite hat `alternates.canonical`

## WCAG 2.1 AA Compliance

Die App erfüllt WCAG 2.1 AA:
- **1.3.1 Info & Relationships:** Tabellen-Header mit `scope="col"`, ARIA-Tab-Pattern in SchemaExplorer
- **2.4.6 Headings:** `sr-only` Überschriften vor Inhalts-Grids
- **2.5.5 Target Size:** Touch-Targets ≥ 44px (Buttons, Tabs, Nav)
- **4.1.2 Name, Role, Value:** `aria-label` auf Badges, `aria-selected` auf Tabs

---

## Deployment

**Ziel-Plattform: Vercel** (Static Export)

**Live:** [https://sql-vibe.vercel.app](https://sql-vibe.vercel.app)

```bash
npm run build   # Statischer Export nach out/
```

- `next.config.ts` konfiguriert `output: "export"`
- Keine API-Routen, keine Server-seitige Logik
- sql.js WASM muss in `public/` liegen
- 659 statische Seiten werden generiert

---

## Security & Datenschutz

- **Keine API-Routen** — reiner Static Export
- **Keine Secrets** oder API-Keys im Client-Code
- **Kein `dangerouslySetInnerHTML`** oder `eval()` auf Benutzereingaben (außer `ThemeScript`, das nur statisches JS enthält)
- **Zero-PII:** Es werden keine personenbezogenen Daten erfasst
- **Local Storage only:** Fortschritt (`sql-trainer-progress`) und Theme (`sql-trainer-theme`) werden ausschließlich im Browser gespeichert
- **Keine Tracking-Cookies,** kein Analytics, kein externes CDN für Fonts (Inter ist lokal als WOFF2 eingebettet)

---

## Entwicklungsmethodik

Die grundlegende Planung, Produktentscheidungen und Architektur stammen vom Entwickler. Die Implementierung wurde überwiegend automatisiert durch [Paperclip AI](https://github.com/paperclipai/paperclip) durchgeführt — ein agensbasiertes KI-Workflow-System, das spezialisierte Sub-Agenten für unterschiedliche Entwicklungsphasen orchestriert.

| Phase | Verantwortung |
|-------|---------------|
| **Produktvision & Anforderungsdefinition** | Entwickler |
| **Architektur-Entscheidungen & Tech-Stack** | Entwickler |
| **Feature-Design & UX-Konzept** | Entwickler |
| **Implementierung (Code-Generierung)** | Paperclip AI (agentisch) |
| **Code-Review & Qualitätssicherung** | Entwickler + automatisierte Tests |
| **Bugfixes & Iterationen** | Entwickler mit KI-Unterstützung |


---

## Lizenz

&copy; Sören Timo Voigt 2025–2026 — Privat. Alle Rechte vorbehalten.
