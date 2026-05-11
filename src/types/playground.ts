/**
 * Zentrale Typen fuer die SQL-Trainer MySQL-Playground-Infrastruktur.
 *
 * Umfasst Uebungen, Ergebnismengen, Validierung, Hinweise,
 * Schema-Introspektion und Fehlerbehandlung.
 *
 * English: Core types for the SQL-Trainer MySQL Playground infrastructure.
 * Covers exercises, resultsets, validation, hints, schema introspection,
 * and error handling.
 */

/** Zeile in einer SQL-Ergebnismenge. */
export type SqlRow = Record<string, unknown>;

/** Spaltenmetadaten einer SQL-Ergebnismenge. */
export interface SqlColumn {
  name: string;
  type: string;
}

/** Strukturierte Ergebnismenge einer SQL-Abfrage. */
export interface SqlResultset {
  columns: SqlColumn[];
  rows: SqlRow[];
}

/** Ergebnis einer einzelnen SQL-Abfrage (Erfolg oder Fehler). */
export interface SqlQueryResult {
  success: boolean;
  resultset?: SqlResultset;
  error?: string;
  executionTimeMs?: number;
}

/** Vergleichsstatus fuer Ergebnismengen. */
export type ComparisonStatus = "equal" | "column_mismatch" | "row_count_mismatch" | "row_data_mismatch" | "type_mismatch" | "empty";

/** Ergebnis des Ergebnismengen-Vergleichs mit Status, Details und Abweichungsdaten. */
export interface ResultsetComparison {
  status: ComparisonStatus;
  details: string;
  columnDiff?: { expected: SqlColumn[]; actual: SqlColumn[] };
  rowDiff?: { expectedRowCount: number; actualRowCount: number };
  firstMismatchRow?: number;
}

/** Playground-spezifische Uebungsdefinition. */
export interface PlaygroundExercise {
  id: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  /** Aufgabentyp aus dem Katalog – bestimmt die Darstellung in der UI */
  exerciseType?: "write" | "debug" | "predict" | "schema" | "multiple_choice" | "story";
  /** SQL zum Initialisieren der In-Memory-Datenbank fuer diese Uebung */
  setupSql: string;
  /** Die erwartete Abfrage (wird zur Generierung der Referenz-Ergebnismenge verwendet) */
  solutionQuery: string;
  /** Aufgabenbeschreibung fuer den Benutzer */
  task: string;
  /** Vorausgefuellte Abfrage fuer Debug-Uebungen */
  prefillQuery?: string;
  /** Verdeckte Pruefungsabfragen, die nach der Benutzerabfrage ausgefuehrt werden */
  hiddenTests?: HiddenTest[];
  /** Hinweisdefinitionen fuer diese Uebung */
  hints?: ExerciseHint[];
  /** Schematabellen, die im Schema-Explorer angezeigt werden sollen */
  schemaTables?: SchemaTable[];
  /** Multiple-Choice-Frage fuer Vorhersage-/Schema-Uebungen */
  question?: string;
  /** Multiple-Choice-Optionen fuer Vorhersage-/Schema-Uebungen */
  options?: QuizOption[];
  /** Story data for narrative/game mode (SQL Agent) */
  story?: PlaygroundStoryData;
}

/**
 * Story-Daten fuer den narrativen Spielmodus (Playground-Sicht).
 * Vereinfachte Darstellung der exercise.ts StoryData fuer die UI.
 */
export interface PlaygroundStoryData {
  scenarioTitle: string;
  intro: string;
  chapters: PlaygroundStoryChapter[];
  outro: string;
}

export interface PlaygroundStoryChapter {
  chapterNumber: number;
  title: string;
  narrative: string;
  referenceQuery: string;
  hiddenTests?: HiddenTest[];
  hints?: ExerciseHint[];
  completionNarrative: string;
  points: number;
  progressSql?: string;
}

/** Multiple-Choice-Option fuer Quiz-Uebungen. */
export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

/** Definition eines verdeckten Tests. */
export interface HiddenTest {
  id: string;
  name: string;
  /** SQL-Abfrage, die nach der Benutzerabfrage mindestens eine Zeile (oder ein bestimmtes Ergebnis) zurueckliefern muss. */
  query: string;
  /** Optional: Erwartete Ergebnismenge fuer den genauen Vergleich (statt nur rowCount > 0). */
  expectedResultset?: SqlResultset;
  /** Vergleichsmodus: exact (Standard), rows (reihenfolgenunabhaengig), columns, count, contains. */
  compareMode?: "exact" | "rows" | "columns" | "count" | "contains";
  /** Fehlermeldung, wenn dieser verdeckte Test fehlschlaegt. */
  failureMessage: string;
}

/** Ergebnis eines verdeckten Tests. */
export interface HiddenTestResult {
  testId: string;
  passed: boolean;
  message?: string;
}

/** Hinweisdefinition fuer eine Uebung. */
export interface ExerciseHint {
  level: 1 | 2 | 3;
  trigger: HintTrigger;
  message: string;
}

/** Trigger-Typen fuer Hinweise: Syntaxfehler, falsches Ergebnis, wiederholte Fehlversuche oder immer. */
export type HintTrigger =
  | { type: "syntax_error"; pattern?: string }
  | { type: "wrong_result"; comparisonStatus?: ComparisonStatus }
  | { type: "repeated_failures"; threshold: number }
  | { type: "always" };

/** Ergebnis eines ausgewaehlten Hinweises mit Level und Meldung. */
export interface HintResult {
  level: 1 | 2 | 3;
  message: string;
}

/** Schema-Explorer-Typen. */
export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
  foreignKeys?: ForeignKey[];
}

export interface SchemaColumn {
  name: string;
  type: string;
  nullable: boolean;
  defaultValue?: string;
  isPrimaryKey?: boolean;
}

export interface ForeignKey {
  column: string;
  referencedTable: string;
  referencedColumn: string;
}

/** Fehlererklaerung mit originaler Meldung, deutscher Benutzermeldung, Schweregrad und Kategorie. */
export interface SqlErrorExplanation {
  originalError: string;
  userMessage: string;
  severity: "error" | "warning" | "info";
  category: string;
}

/** Zustand einer Playground-Sitzung mit aktueller Abfrage, Versuchsanzahl und Abschlusstatus. */
export interface PlaygroundSession {
  exerciseId: string;
  userQuery: string;
  attemptCount: number;
  lastResult?: SqlQueryResult;
  lastComparison?: ResultsetComparison;
  hintsShown: HintResult[];
  hiddenTestResults?: HiddenTestResult[];
  completed: boolean;
}
