# Komponenten — SQL VIBE

Dokumentation aller React-Komponenten mit Props, Varianten und Verwendungszweck.

---

## Inhaltsverzeichnis

1. [UI-Komponenten](#ui-komponenten)
2. [Feature-Komponenten](#feature-komponenten)
3. [Infrastruktur-Komponenten](#infrastruktur-komponenten)
4. [Komponenten-Abhängigkeiten](#komponenten-abhängigkeiten)

---

## UI-Komponenten

### Button

Universeller Button mit Varianten und Größen.

```typescript
interface ButtonProps {
  variant?: "primary" | "secondary" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}
```

| Variante | Verwendung |
|----------|-----------|
| `primary` | Haupt-CTAs (Ausführen, Starten) |
| `secondary` | Alternative Aktionen (Zurücksetzen) |
| `ghost` | Unauffällige Aktionen (Nochmal versuchen) |
| `accent` | Besondere Aktionen (Fall abschließen) |

| Size | Höhe | Padding |
|------|------|---------|
| `sm` | 32px | px-3 |
| `md` | 40px | px-4 |
| `lg` | 48px | px-6 |

**States:** Default, Hover, Focus (Ring), Disabled, Loading (Spinner + disabled)

---

### Card

Container mit Varianten für unterschiedliche visuelle Hierarchie.

```typescript
interface CardProps {
  variant?: "default" | "flat" | "outlined";
  className?: string;
  children: React.ReactNode;
}
```

| Variante | Style | Verwendung |
|----------|-------|------------|
| `default` | `bg-surface` + `shadow-sm` | Standard-Container, Inhaltsbereiche |
| `flat` | `bg-surface-dim`, kein Schatten | Inhaltsbereiche, Schema-Details |
| `outlined` | `border-2` + `bg-surface` | Hervorgehobene Bereiche (Erfolg/Fehler) |

---

### Input

Formular-Input mit Label und Error-State.

```typescript
interface InputProps {
  label?: string;
  error?: string;
  id?: string;
  disabled?: boolean;
  // + alle nativen input-Attribute
}
```

---

### Container

Responsive Container mit konfigurierbarem HTML-Tag.

```typescript
interface ContainerProps {
  as?: "div" | "section" | "main" | "article";
  className?: string;
  children: React.ReactNode;
}
```

Max-Width: `max-w-7xl`, zentriert mit `mx-auto`, Padding: `px-4 sm:px-6 lg:px-8`.

---

### ProgressBar

Fortschrittsbalken mit ARIA-Attributen.

```typescript
interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "accent";
  animated?: boolean;
}
```

| Size | Höhe |
|------|------|
| `sm` | 6px |
| `md` | 8px |
| `lg` | 12px |

---

### Skeleton

Lade-Platzhalter mit Shimmer-Animation.

```typescript
interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}
```

**SqlResultSkeleton:** Vorgefertigter Skeleton für Ergebnis-Tabellen.

---

### Logo

SQL-Trainer Logo mit Kompaktmodus.

```typescript
interface LogoProps {
  compact?: boolean;  // Nur "SQL" statt "SQL-Trainer"
  className?: string;
}
```

---

## Feature-Komponenten

### Playground

**Hauptkomponente** — orchestriert die gesamte Übungsumgebung.

```typescript
interface PlaygroundProps {
  exercise: PlaygroundExercise;
  onComplete?: (attemptCount: number) => void;
}
```

**Interne Struktur:**
```
Playground
├── Card: Titel + Schwierigkeit
├── Card: Aufgabenbeschreibung
├── Card: SqlEditor
│     └── Button (Ausführen)
├── [Error] Card: Fehlermeldung
├── [Partial/Success] Card: ResultsetTable
├── [Partial] Card: Vergleichs-Details
├── [Success] SuccessCelebration
├── [Hint] Card: Hinweis
├── Card: SchemaExplorer
└── Card: Versuchs-Zähler
```

**Verwendet:** `usePlayground` Hook

---

### SqlEditor

CodeMirror 6 SQL-Editor mit Syntax-Highlighting, Autocompletion und Dialekt-Wechsel.

```typescript
interface SqlEditorProps {
  /** Controlled value of the editor */
  value: string;
  /** Callback when editor content changes */
  onChange: (value: string) => void;
  /** Whether the editor is in an error state */
  error?: boolean;
  /** Accessible label for the editor */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Callback when user presses Ctrl+Enter */
  onSubmit?: () => void;
  /** Whether the editor is disabled */
  disabled?: boolean;
  /** Schema for autocompletion: table name → column names */
  schema?: SqlSchema;
  /** Whether autocompletion is enabled (default: true) */
  autocompleteEnabled?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** HTML id attribute */
  id?: string;
}
```

**Features:**
- CodeMirror 6 mit Compartment-basiertem Rekonfigurations-System
- Dialekt-Wechsel (SQLite/MySQL/PostgreSQL) per `useDialect()`
- Dark/Light Theme per `useTheme()`
- `Ctrl+Enter` / `Cmd+Enter` → Submit
- Custom `sqlCompletionSource()` — SQL-Keywords (UPPERCASE) + Schema-aware
- Bracket Matching, Close Brackets, Search, History
- Min. 6 Zeilen (`minHeight: "10rem"`), auto-wachsend
- Autocomplete Tooltip: `position: "fixed"`, `zIndex: "9999"` (kein Clipping)
- `autocompleteEnabled` Prop zum Deaktivieren der Autovervollständigung
- JetBrains Mono Font für Code

---

### ResultsetTable

Ergebnistabelle mit Spalten-Metadaten.

```typescript
interface ResultsetTableProps {
  columns: SqlColumn[];
  rows: SqlRow[];
  caption?: string;
}
```

**Features:**
- Leeres Ergebnis: "Keine Ergebnisse (z. B. erfolgreiches CREATE, INSERT, UPDATE)"
- NULL-Werte: kursive Darstellung
- Hover-Effekt auf Zeilen
- Responsive: `overflow-x-auto`

---

### SchemaExplorer

Drei-Tab-View für Datenbank-Schema. Siehe **[SCHEMA_GRAPH.md](./SCHEMA_GRAPH.md)** für Details.

```typescript
interface SchemaExplorerProps {
  tables: SchemaTable[];
  db?: import("sql.js").Database | null;
  sandboxMode?: boolean;                        // Sandbox-Modus (Drop Table, Insert, Create)
  onDropTable?: (tableName: string) => void;     // Tabelle droppen (nur Sandbox)
  onInsertTemplate?: (tableName: string) => void; // INSERT-Template in Editor
  onCreateTableTemplate?: () => void;            // CREATE TABLE-Template in Editor
  viewMode?: "rm" | "data" | "schema";          // Extern gesteuerter Anzeigemodus
  hideTabs?: boolean;                            // Tab-Leiste ausblenden (wenn extern gesteuert)
}
```

| Tab | Inhalt |
|-----|--------|
| **RM** | `SchemaGraph` — interaktiver ER-Graph mit per-column Bezier-Kanten |
| **Daten** | Live-Daten-Vorschau (max. 10 Zeilen) |
| **Schema** | Spalten, Typen, PKs, FKs als Tabelle |

---

### SchemaGraph

Interaktiver ER-Graph mit React Flow + dagre + Bezier-Kanten. Siehe **[SCHEMA_GRAPH.md](./SCHEMA_GRAPH.md)** für Details.

**Features:**
- Per-column Handles: FK-Spalten → Source-Handle (rechts), PK/referenzierte Spalten → Target-Handle (links)
- Custom `FkEdge` mit `getBezierPath` und konfigurierbarer `curvature`
- Parallele Kanten zwischen denselben Tabellen werden durch unterschiedliche Krümmung visuell getrennt
- `referencedColumns` Map für Target-Handles auf Nicht-PK-Spalten

```typescript
interface SchemaGraphProps {
  tables: SchemaTable[];
}
```

---

### PredictQuiz

Multiple-Choice-Quiz für Predict/Schema/Multiple-Choice-Übungen.

```typescript
interface PredictQuizProps {
  exercise: PlaygroundExercise;
  onComplete?: (attemptCount: number) => void;
}
```

**States:**
- **Auswahl:** Optionen anklickbar, ausgewählte blau hinterlegt
- **Submitted (richtig):** Grüne Hervorhebung + SuccessCelebration
- **Submitted (falsch):** Rote Hervorhebung + "Nochmal versuchen"

---

### StoryPlayer

Narrativer Spielmodus mit Kapitel-Fortschritt.

```typescript
interface StoryPlayerProps {
  exercise: PlaygroundExercise;
  onComplete?: (attemptCount: number) => void;
}
```

**Phasen:**
1. **Intro:** Szenario-Titel, Beschreibung, "Ermittlungen beginnen"
2. **Kapitel:** Narrative → SQL-Herausforderung → Completion-Narrative
3. **Outro:** "Fall gelöst!" mit Zusammenfassung

**Features:**
- Kapitel-Indikatoren (Punkte: grün = gelöst, blau = aktuell, grau = gesperrt)
- Pro Kapitel: eigener `usePlayground`-Hook
- Completion-Narrative nach erfolgreicher Lösung

---

### SuccessCelebration

Konfetti-Animation bei erfolgreicher Lösung.

```typescript
interface SuccessCelebrationProps {
  message?: string;
  submessage?: string;
  show?: boolean;
}
```

**Features:**
- 12 Konfetti-Partikel mit zufälligen Farben/Positionen
- `success-pop` Animation (Scale + Fade)
- Custom Event `sql-trainer-success` für externe Listener

---

### Sandbox-Komponenten

#### SandboxWorkspace

Hauptarbeitsbereich für die Sandbox (freies SQL-Experimentieren).

```typescript
interface SandboxWorkspaceProps {
  // Keine Props — holt State aus useSandbox
}
```

**Features:**
- Vier-Tab-Layout: Ergebnis, Daten, Graph, Schema
- SQL-Editor mit freier Eingabe
- SchemaExplorer mit Sandbox-Aktionen (Drop Table, Insert, Create Table)

#### SandboxSidebar

Seitenleiste für die Sandbox mit Datenbank-Aktionen und Import-Funktionalität.

```typescript
interface SandboxSidebarProps {
  dbList: SandboxDatabaseMeta[];
  activeDbId: string | null;
  liveSchema: SchemaTable[];
  builtinDatasets: Dataset[];        // 18 vordefinierte Datensätze für Dropdown
  onCreateNew: (name: string) => Promise<string>;
  onOpen: (id: string) => Promise<void>;
  onClose: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, newName: string) => Promise<void>;
  onDuplicate: (id: string, newName: string) => Promise<string>;
  onImportFromSql: (name: string, sql: string) => Promise<string>;
  onTableClick: (tableName: string) => void;
  isLoading: boolean;
}
```

**Import-Features:**
- **Dropdown**: 18 vordefinierte Datensätze (10 Standard + 8 Story)
- **Datei-Upload**: `.sql`-Dateien über Button (max. 5 MB)
- **Drag & Drop**: `.sql`-Dateien per Drag & Drop (max. 5 MB)
- **Fehlerbehandlung**: Größe, Format und SQL-Fehler werden angezeigt

---

### Learn-Komponenten

#### ArticlePageClient

Artikel-Renderer für Lern-Module (Normalisierung, ERM, etc.).

#### ErmDiagram

ER-Diagramm-Komponente für Lern-Module.

#### NfChecker

Normalform-Checker für Normalisierungs-Übungen.

#### RmToSql

Relationales Modell → SQL Konverter.

---

## Infrastruktur-Komponenten

### Header

Sticky Header mit Navigation und Theme Toggle.

```typescript
interface HeaderProps {
  breadcrumbs?: React.ReactNode;
  rightSlot?: React.ReactNode;
}
```

**Features:**
- `sticky top-0` mit `backdrop-blur`
- Logo (kompakt) als Home-Link
- Breadcrumbs (optional)
- Theme Toggle
- "Lektionen" Link

---

### Footer

Footer mit rechtlichen Links.

```typescript
// Keine Props
```

**Links:** Impressum, Datenschutz, GitHub

---

### ThemeProvider

Inline-Script zur Dark-Mode-Erkennung **vor** dem ersten Render.

```typescript
// ThemeScript — kein React-Komponent, nur <script>
```

**Logik:**
1. Prüft `localStorage('sql-trainer-theme')`
2. Fallback: `prefers-color-scheme: dark`
3. Setzt `.dark` Klasse auf `<html>` **vor** React-Hydration

---

### ThemeToggle

Dark/Light Mode Toggle mit `useSyncExternalStore`.

```typescript
// Keine Props
```

**Features:**
- `useSyncExternalStore` für sofortige Reaktion ohne Flackern
- SSR-kompatibel (leerer Button während SSR)
- Persistenz via `localStorage`

---

### DialectSwitcher

Dropdown zum Wechseln des SQL-Dialekts (SQLite/MySQL/PostgreSQL).

```typescript
// Keine Props — verwendet useDialect() intern
```

**Features:**
- Framer Motion Animation (öffnet nach oben)
- `z-index` Layering über anderen UI-Elementen
- Persistiert Dialekt in `localStorage`

---

### LanguageSwitcher

Dropdown zum Wechseln der Sprache (Deutsch/English).

```typescript
// Keine Props — verwendet next-intl intern
```

**Features:**
- Framer Motion Animation (öffnet nach oben)
- `z-index` Layering über anderen UI-Elementen
- Path-based Locale-Wechsel (`/de/` ↔ `/en/`)

---

### IntroOverlay

Anime.js Intro-Animation mit Scramble-Text-Effekt.

```typescript
// Keine Props
```

**Features:**
- Zwei-Slide-Animation: SQL-Keywords → "SQL-VIBE"
- `scrambleText` mit zufälligen Zeichen (░▒▓█)
- JetBrains Mono Font für Tech-Vibe
- `sessionStorage` verhindert Wiederholung
- `prefers-reduced-motion` → sofort überspringen
- Klick zum Überspringen

---

### StoryIntro

Narrativer Intro-Bildschirm für Story-Modus.

```typescript
interface StoryIntroProps {
  scenarioTitle: string;
  intro: string;
  difficulty: string;
  chapterCount: number;
  solvedCount: number;
  currentChapter: number;
  hasProgress: boolean;
  onStart: () => void;
}
```

**Features:**
- Anime.js `scrambleText` für Titel und Intro-Text
- `sanitizeForScramble()` schützt vor XSS in `innerHTML`
- JetBrains Mono Font
- Fortschritts-Punkte (gelöst/aktuell/gesperrt)
- `prefers-reduced-motion` → statische Anzeige

---

### Animations

Framer Motion Wrapper für deklarative Animationen.

```typescript
// FadeIn
interface FadeInProps {
  delay?: number;
  duration?: number;
  children: React.ReactNode;
}

// AnimatedList
interface AnimatedListProps {
  className?: string;
  children: React.ReactNode;
}

// ScaleOnHover
interface ScaleOnHoverProps {
  className?: string;
  children: React.ReactNode;
}
```

---

## Komponenten-Abhängigkeiten

```
Playground
├── usePlayground (Hook)
├── Card
├── Button
├── SqlEditor
├── ResultsetTable
├── SchemaExplorer
│     └── SchemaGraph
│           ├── ReactFlow
│           ├── dagre
│           ├── TableNode (custom)
│           └── FkEdge (custom, Bezier)
├── SuccessCelebration
├── FadeIn
└── SqlResultSkeleton

PredictQuiz
├── Card
├── Button
├── FadeIn
├── SuccessCelebration
├── SchemaExplorer
└── useProgress (Hook)

StoryPlayer
├── Card
├── Button
├── SqlEditor
├── ResultsetTable
├── SchemaExplorer
├── FadeIn
├── SuccessCelebration
└── usePlayground (Hook)

SandboxWorkspace
├── useSandbox (Hook)
├── Card
├── Button
├── SqlEditor
├── ResultsetTable
├── SchemaExplorer (sandboxMode)
│     └── SchemaGraph
└── SandboxSidebar

Header
├── Container
├── Logo
└── ThemeToggle

Layout
├── ThemeScript
└── Footer
```
