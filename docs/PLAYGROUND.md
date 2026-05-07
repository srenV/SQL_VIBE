# Playground-Infrastruktur — SQL-Trainer

Dokumentation der Playground-Engine: sql.js Integration, Query-Ausführung, Validierung und Fehlerbehandlung.

---

## Inhaltsverzeichnis

1. [Architektur](#architektur)
2. [sql.js Engine](#sqljs-engine)
3. [Query-Lifecycle](#query-lifecycle)
4. [Ergebnis-Validierung](#ergebnis-validierung)
5. [Fehlererkennung](#fehlererkennung)
6. [Hinweis-Engine](#hinweis-engine)
7. [Verdeckte Tests](#verdeckte-tests)

---

## Architektur

```
usePlayground (Hook)
  │
  ├── sqlEngine.ts        # sql.js WASM Wrapper
  ├── schemaExplorer.ts   # Schema-Introspektion + FK-Merge
  ├── resultsetComparison.ts  # Ergebnis-Vergleich
  ├── hiddenTests.ts      # Verdeckte Prüfabfragen
  ├── hintEngine.ts       # Trigger-basierte Hinweise
  └── errorExplanation.ts # Deutsche Fehlermeldungen
```

---

## sql.js Engine

### API

```typescript
// Datenbank-Lifecycle
createDatabase(sql: string) → Promise<Database>
closeDatabase(db: Database) → void

// Query-Ausführung
runQuery(db: Database, sql: string) → SqlQueryResult

// Schema-Introspektion
getSchema(db: Database) → { name: string; sql: string | null }[]
getTableInfo(db: Database, tableName: string) → ColumnMeta[]
getForeignKeys(db: Database, tableName: string) → FK[]

// Daten-Vorschau
peekTableData(db: Database, tableName: string, limit?: number) → SqlQueryResult

// SQL-Transformation
transformRightJoin(sql: string) → string
```

### SqlQueryResult

```typescript
interface SqlQueryResult {
  success: boolean;
  resultset?: {
    columns: { name: string; type: string }[];
    rows: Record<string, unknown>[];
  };
  error?: string;
  executionTimeMs?: number;
}
```

### RIGHT JOIN Transformation

SQLite unterstützt kein `RIGHT JOIN` oder `FULL OUTER JOIN`. `transformRightJoin()` wandelt automatisch um:

```
A RIGHT JOIN B ON A.x = B.y
→ B LEFT JOIN A ON A.x = B.y
```

---

## Query-Lifecycle

### 1. Datenbank-Initialisierung (`initDb`)

```
User öffnet Übung
  │
  ▼
createDatabase(exercise.setupSql)
  │ sql.js WASM
  ▼
In-Memory SQLite DB
  │
  ▼
runQuery(db, exercise.solutionQuery)
  │
  ▼
referenceResultset (für Vergleich)
  │
  ▼
introspectSchema(db) + mergeSchemaWithFKs()
  │
  ▼
liveSchema (für SchemaExplorer)
```

### 2. Query-Ausführung (`runUserQuery`)

```
User klickt "Ausführen"
  │
  ▼
[DB existiert?]
  ├── Ja → DB schließen & neu erstellen (clean state)
  └── Nein → initDb()
  │
  ▼
runQuery(db, userQuery)
  │
  ├── [Fehler?]
  │     └── explainError(error) → phase = "error"
  │
  ├── [Erfolg]
  │     ├── compareResultsets(ref, actual)
  │     │     ├── equal → phase = "success"
  │     │     └── mismatch → phase = "partial"
  │     │
  │     └── [equal?] runHiddenTests(db, tests)
  │           ├── all passed → completed = true
  │           └── any failed → hasHiddenFailures = true
  │
  └── [partial?] selectHint(hints, context)
```

---

## Ergebnis-Validierung

### `compareResultsets(expected, actual)`

Prüft in dieser Reihenfolge:

| Schritt | Check | Status bei Mismatch |
|---------|-------|-------------------|
| 1 | Beide leer? | `equal` |
| 2 | Spaltenanzahl gleich? | `column_mismatch` |
| 3 | Spaltennamen gleich? (case-insensitive) | `column_mismatch` |
| 4 | Spaltentypen gleich? (skip UNKNOWN) | `type_mismatch` |
| 5 | Zeilenanzahl gleich? | `row_count_mismatch` |
| 6 | Alle Zellenwerte gleich? | `row_data_mismatch` |
| ✅ | Alles gleich | `equal` |

### Wert-Normalisierung

```typescript
normalizeValue(value):
  null | undefined → "NULL"
  number → String(number)
  boolean → "1" | "0"
  Date → ISO-String
  other → String(value)
```

---

## Fehlererkennung

### `explainError(errorMessage)`

Erkennt 20+ SQL-Fehlertypen durch Regex-Matching:

| Kategorie | Fehlertypen |
|-----------|------------|
| **Syntax** | `near "..." syntax error`, `unrecognized token`, `incomplete input` |
| **Objekte** | `no such table`, `no such column`, `no such function` |
| **Datentypen** | `datatype mismatch`, `cannot store value in column` |
| **Aggregation** | `misuse of aggregate`, `GROUP BY required`, `HAVING on non-aggregate` |
| **JOIN** | `RIGHT/FULL OUTER JOIN not supported`, `ambiguous column` |
| **Constraints** | `FOREIGN KEY constraint failed`, `UNIQUE constraint failed`, `NOT NULL constraint failed` |
| **Sonstige** | `division by zero`, `table already exists`, `string too big` |

### Rückgabe

```typescript
interface SqlErrorExplanation {
  originalError: string;   // Original-Fehlermeldung
  userMessage: string;     // Deutsche Erklärung
  severity: "error" | "warning" | "info";
  category: string;        // Fehlerkategorie
}
```

---

## Hinweis-Engine

### `selectHint(hints, queryResult, comparison, attemptCount)`

Wählt den passendsten Hinweis basierend auf Triggern:

| Trigger | Aktiviert wenn |
|---------|---------------|
| `syntax_error` | Query hat Fehler (optional mit pattern-Match) |
| `wrong_result` | Ergebnis weicht ab (optional mit spezifischem Status) |
| `repeated_failures` | `attemptCount >= threshold` |
| `always` | Immer (Fallback) |

**Strategie:** Niedrigster passender Level zuerst (1 → 2 → 3).

### `getStrongerHint(hints, currentLevel, ...)`

Liefert den nächsthöheren passenden Hinweis. Überspringt Level, die nicht zum Kontext passen.

---

## Verdeckte Tests

### `runHiddenTests(db, hiddenTests)`

Führt nach erfolgreicher Haupt-Query zusätzliche Prüfabfragen aus:

```typescript
interface HiddenTest {
  id: string;
  name: string;
  query: string;            // Prüfabfrage
  compareMode: "exact" | "rows" | "columns" | "count" | "contains";
  expectedResultset?: SqlResultset;  // Optional: erwartetes Ergebnis
  failureMessage: string;
}
```

### Compare-Modi

| Mode | Vergleich | Verwendung |
|------|-----------|-----------|
| `exact` | `compareResultsets()` → `status === "equal"` | Vollständiger Vergleich |
| `rows` | Zeilen als Set (Reihenfolge egal) | Hardcoding verhindern |
| `columns` | Spaltennamen als Set | Spalten-Struktur prüfen |
| `count` | `rows.length` | Zeilenanzahl prüfen |
| `contains` | Erwartete Zeilen ⊆ tatsächliche Zeilen | Teilmenge prüfen |

### Zweck

Verdeckte Tests verhindern, dass User die Lösung "hardcoden":

```sql
-- User könnte schreiben:
SELECT 'Alice', 'alice@example.com', 30
UNION ALL
SELECT 'Bob', 'bob@example.com', 25;

-- Hidden Test prüft z.B. COUNT(*):
SELECT COUNT(*) FROM users;
-- Erwartet: 3 (nicht 2)
```
