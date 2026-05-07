# Testing — SQL-Trainer

Test-Strategie, Test-Struktur und Test-Abdeckung der SQL-Trainer MySQL-Lernplattform.

---

## Inhaltsverzeichnis

1. [Test-Strategie](#test-strategie)
2. [Unit & Integration Tests (Vitest)](#unit--integration-tests-vitest)
3. [E2E Tests (Playwright)](#e2e-tests-playwright)
4. [Test-Infrastruktur](#test-infrastruktur)
5. [CI/CD](#cicd)

---

## Test-Strategie

### Test-Pyramide

```
           ╱──────╲
          ╱  E2E   ╲         3 Playwright Specs
         ╱  (UI)    ╲        (Smoke Tests)
        ╱────────────╲
       ╱  Integration ╲      5 Specs (Hooks, Adapter)
      ╱   (Vitest)     ╲
     ╱──────────────────╲
    ╱    Unit Tests       ╲   11 Specs (Lib, Components)
   ╱     (Vitest)          ╲
  ╱──────────────────────────╲
```

### Abdeckung

| Ebene | Tests | Dateien |
|-------|-------|---------|
| Unit (Lib) | 569 | 7 Dateien |
| Unit (Components) | 34 | 6 Dateien |
| Integration (Hooks/Adapter) | 36 | 3 Dateien |
| E2E (Playwright) | 3 | 3 Dateien |
| **Gesamt** | **642** | **19 Dateien** |

---

## Unit & Integration Tests (Vitest)

### Konfiguration (`vitest.config.ts`)

```typescript
{
  environment: "jsdom",
  setupFiles: ["./vitest.setup.ts"],
  coverage: {
    provider: "v8",
    reporter: ["text", "json", "html"],
  },
}
```

### Test-Dateien im Detail

#### `src/lib/resultsetComparison.test.ts` (12 Tests)

Testet den Ergebnismengen-Vergleich:
- Identische Resultsets → `equal`
- Spaltenanzahl, -namen, -typen → `column_mismatch` / `type_mismatch`
- Zeilenanzahl, -daten → `row_count_mismatch` / `row_data_mismatch`
- NULL-Handling, leere Resultsets, numerische Vergleiche
- Case-insensitive Spaltennamen
- UNKNOWN-Typ-Skip

#### `src/lib/errorExplanation.test.ts` (20 Tests)

Testet die Fehlererkennung für 20+ SQL-Fehlertypen:
- Syntax-Fehler, fehlende Tabellen/Spalten/Funktionen
- Datentyp-Konflikte, Aggregat-Fehler
- FOREIGN KEY, UNIQUE, NOT NULL Constraints
- Division by Zero, GROUP BY, HAVING
- RIGHT JOIN, LIMIT-Reihenfolge
- Fallback für unbekannte Fehler

#### `src/lib/hintEngine.test.ts` (7 Tests)

Testet die Hinweis-Engine:
- `selectHint`: syntax_error, wrong_result, repeated_failures, no match
- `getStrongerHint`: nächsthöheres Level, Level-Überspringen

#### `src/lib/hiddenTests.test.ts` (11 Tests)

Testet verdeckte Tests mit allen 5 Compare-Modi:
- `exact`: komplettes Resultset
- `rows`: Zeileninhalte (Reihenfolge egal)
- `columns`: Spaltennamen
- `count`: Zeilenanzahl
- `contains`: Teilmenge

#### `src/lib/playgroundAdapter.test.ts` (9 Tests)

Testet den Katalog→Playground-Adapter:
- Write/Debug/Predict-Übungen
- Hint-Konvertierung (Level, Trigger)
- HiddenTest-Konvertierung (IDs, Namen)
- Schema-Tabellen mit Spalten und FKs
- Schwierigkeitsgrad-Mapping
- Default-Trigger, Level-Begrenzung

#### `src/lib/schemaExplorer.test.ts` (5 Tests)

Testet die Schema-Introspektion:
- Leere DB, Tabellen mit Spalten
- Nullable-Erkennung, Foreign Keys
- Mehrere Tabellen

#### `src/lib/sqlEngine.test.ts` (6 Tests)

Testet die RIGHT JOIN Transformation:
- Mit/ohne Aliase
- LEFT JOIN unberührt
- Case-insensitive
- Mehrere JOINs

#### `src/lib/utils.test.ts` (8 Tests)

Testet Utilities:
- `cn()`: Klassen-Merging, Konfliktlösung, Falsy-Werte
- `isNotEmpty()`: Strings, null, undefined, non-strings

#### `src/data/catalog.test.ts` (9 Tests)

Testet die Katalog-Struktur:
- 10 Datasets, 500+ Exercises, 15 Lessons
- Exercise↔Dataset-Referenzen
- Lesson↔Exercise-Referenzen
- Eindeutige IDs, deutsche Beschreibungen
- HiddenTestQuery für write-Exercises

#### `src/data/exercises/validate.test.ts` (500 Tests)

**Validierung aller 500+ Übungen:**
- Jede Übung wird gegen ihr Dataset validiert
- `adaptExercise()` → `createDatabase()` → `runQuery(referenceQuery)`
- Stellt sicher, dass alle Referenz-Queries syntaktisch korrekt sind
- Kategorien: SELECT, WHERE, ORDER/LIMIT, Aggregation, JOIN, Subquery, CTE, Window, DML, DDL, Debug, Predict, Schema, Interview, Story

#### `src/data/exercises/story.test.ts` (3 Tests)

Testet den Story-Modus:
- Alle Story-Exercises adaptieren korrekt
- Jedes Kapitel erzeugt valides PlaygroundExercise
- Story-Exercises sind über Lesson-Routing erreichbar

#### `src/hooks/useProgress.test.ts` (18 Tests)

Testet den Fortschritts-Hook:
- Initialisierung (leer / aus localStorage)
- `markExerciseCompleted` (Punkte, Überschreiben, Persistenz)
- `recordAttempt` (Zähler, lastActiveDate)
- `unlockAchievement` (Hinzufügen, Duplikate)
- `resetProgress` (Zurücksetzen, localStorage)
- `getExerciseProgress`, `getLessonProgress`
- Streak-Berechnung

#### Komponenten-Tests (34 Tests)

| Datei | Tests | Fokus |
|-------|-------|-------|
| `button.test.tsx` | 7 | Rendering, Loading, Disabled, Click, Varianten, Größen |
| `card.test.tsx` | 5 | Children, Rolle, Varianten |
| `input.test.tsx` | 4 | Label, Error, ID, Disabled |
| `container.test.tsx` | 3 | Tag, Klassen, as-Prop |
| `logo.test.tsx` | 3 | Text, Kompaktmodus, Klassen |
| `animations.test.tsx` | 7 | FadeIn, AnimatedList, ScaleOnHover |
| `page.test.tsx` | 5 | Überschrift, Buttons, Navigation, Statistiken |

---

## E2E Tests (Playwright)

### Konfiguration (`playwright.config.ts`)

```typescript
{
  testDir: "./e2e",
  webServer: {
    command: "npm run dev",
    port: 3000,
    reuseExistingServer: true,
  },
}
```

### Test-Dateien

#### `e2e/landing.spec.ts`

- Überschrift "Lerne MySQL spielerisch" sichtbar
- "Jetzt starten" Button vorhanden
- "Alle Lektionen" Button vorhanden
- Statistiken (Übungen, Lektionen, Datensätze) sichtbar

#### `e2e/navigation.spec.ts`

- Navigation zu Lektionen-Seite
- Breadcrumbs auf Übungsseite
- Theme Toggle funktioniert

#### `e2e/exercise-interaction.spec.ts`

- SQL-Editor sichtbar
- SQL eingeben und ausführen
- Ergebnis-Tabelle erscheint
- Fehler-Feedback bei falscher Query

---

## Test-Infrastruktur

### vitest.setup.ts

```typescript
import "@testing-library/jest-dom/vitest";
```

Erweitert Vitest um DOM-spezifische Matcher (`toBeInTheDocument`, `toHaveClass`, etc.).

### Mocks

- `src/lib/schemaExplorer.test.ts`: Mockt `sqlEngine`-Funktionen
- `src/hooks/useProgress.test.ts`: Mockt `localStorage`

---

## CI/CD

### Lokale Ausführung

```bash
npm test                # Alle Tests + Coverage
npm run test:e2e        # E2E Tests (headless)
npm run lint            # ESLint
npm run check-format    # Prettier
```

### Empfohlene CI-Pipeline

```yaml
# .github/workflows/test.yml
steps:
  - uses: actions/checkout@v4
  - uses: actions/setup-node@v4
  - run: npm ci
  - run: npm run lint
  - run: npm run check-format
  - run: npm test
  - run: npx playwright install --with-deps
  - run: npm run test:e2e
```
