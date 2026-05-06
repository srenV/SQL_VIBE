/**
 * Zentrale Typdefinitionen fuer die SQL-Uebungskatalog-Daten.
 *
 * Alle Inhalte sind auf Deutsch, da die Zielgruppe deutschsprachige
 * MySQL-Lernende sind.
 */

/** Schwierigkeitsgrad einer Uebung. */
export type Difficulty = "beginner" | "junior" | "intermediate" | "advanced" | "interview";

/** Aufgabentyp – bestimmt die Interaktionsform. */
export type ExerciseType = "write" | "debug" | "predict" | "schema" | "multiple_choice" | "story";

/** Eine einzelne Tabellenspalte im Schema-Explorer. */
export interface ColumnDef {
  name: string;
  type: string;
  nullable?: boolean;
  default?: string;
  references?: string;
  isPrimaryKey?: boolean;
}

/** Eine Tabelle im Schema eines Datensatzes. */
export interface TableDef {
  name: string;
  columns: ColumnDef[];
}

/** Ein kompletter Datensatz (DDL + DML). */
export interface Dataset {
  id: string;
  name: string;
  description: string;
  sql: string; // CREATE TABLE + INSERT Statements
  tables: TableDef[];
}

/** Ein Hinweis in mehreren Stufen. */
export interface Hint {
  level: number; // 1 = leichter Hinweis, hoeher = konkreter
  text: string;
  /** Optionaler Trigger – bestimmt, wann der Hinweis angezeigt wird. */
  trigger?: HintTrigger;
}

export type HintTrigger =
  | { type: "syntax_error"; pattern?: string }
  | { type: "wrong_result"; comparisonStatus?: string }
  | { type: "repeated_failures"; threshold: number }
  | { type: "always" };

/** Ein Hidden-Test prueft das Nutzer-Resultset. */
export interface HiddenTest {
  name: string;
  query: string; // Referenz-Query, die das korrekte Ergebnis liefert
  compareMode: "exact" | "rows" | "columns" | "count" | "contains";
  // exact  = komplettes Resultset muss uebereinstimmen (inkl. Reihenfolge)
  // rows   = Zeileninhalte muessen uebereinstimmen (Reihenfolge egal)
  // columns= Spaltennamen und -anzahl muessen stimmen
  // count  = nur Zeilenanzahl pruefen
  // contains = bestimmte Zeile muss enthalten sein
}

/** Eine Multiple-Choice-Option (fuer predict/schema). */
export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

/** Eine einzelne SQL-Uebung. */
export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: Difficulty;
  category: string; // z.B. "SELECT", "JOIN", "Aggregation"
  datasetId: string; // Referenz auf Dataset.id
  /** Bei type === "write": erwartete Query (fuer Referenz/Hidden Tests). */
  referenceQuery?: string;
  /** Bei type === "debug": fehlerhafte Query, die korrigiert werden muss. */
  brokenQuery?: string;
  /** Bei type === "predict" | "multiple_choice": Frage + Optionen. */
  question?: string;
  options?: Option[];
  /** Erwartetes Ergebnis als Text oder JSON (fuer Dokumentation). */
  expectedResult?: string;
  /** Hinweise in Stufen. */
  hints: Hint[];
  /** Hidden Tests gegen das Nutzer-Resultset. */
  hiddenTests: HiddenTest[];
  /** Tags fuer Filterung. */
  tags: string[];
  /** Punkte fuer Gamification. */
  points: number;
  /** Ordnungsnummer innerhalb einer Kategorie. */
  order: number;
  /** Bei type === "story": Story-spezifische Daten. */
  story?: StoryData;
}

/**
 * Story-Daten fuer den narrativen Spielmodus (SQL Agent).
 *
 * Jede Story besteht aus mehreren Kapiteln, die der Reihe nach
 * freigeschaltet werden. Jedes Kapitel hat eine narrative Einfuehrung,
 * eine SQL-Herausforderung, und eine Abschluss-Erzaehlung, die
 * nach erfolgreicher Loesung gezeigt wird.
 */
export interface StoryData {
  /** Szenario-Titel, z.B. "Der Fall des verschwundenen Entwicklers". */
  scenarioTitle: string;
  /** Kurze Einleitung, die das Szenario beschreibt. */
  intro: string;
  /** Kapitel der Story – werden nacheinander freigeschaltet. */
  chapters: StoryChapter[];
  /** Abschluss-Erzaehlung, wenn alle Kapitel geloest sind. */
  outro: string;
}

/** Ein einzelnes Kapitel einer Story. */
export interface StoryChapter {
  /** Kapitel-Nummer (1-basiert). */
  chapterNumber: number;
  /** Kapitel-Titel, z.B. "Die erste Spur". */
  title: string;
  /** Narrative Einfuehrung – wird vor der SQL-Herausforderung gezeigt. */
  narrative: string;
  /** SQL-Referenz-Query fuer die Loesung dieses Kapitels. */
  referenceQuery: string;
  /** Hidden Tests fuer dieses Kapitel. */
  hiddenTests: HiddenTest[];
  /** Abschluss-Erzaehlung – wird nach korrekter Loesung gezeigt. */
  completionNarrative: string;
  /** Hinweise fuer dieses Kapitel. */
  hints: Hint[];
  /** Punkte fuer dieses Kapitel. */
  points: number;
}

/** Eine Lektion/Kategorie, die mehrere Uebungen gruppiert. */
export interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  exercises: string[]; // Exercise.id Liste
  order: number;
}

/** Der globale Katalog. */
export interface Catalog {
  datasets: Record<string, Dataset>;
  exercises: Record<string, Exercise>;
  lessons: Record<string, Lesson>;
}
