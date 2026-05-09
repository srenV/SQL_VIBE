/**
 * Typen fuer den Sandbox-Modus der SQL-Trainer Plattform.
 *
 * Der Sandbox-Modus ermoeglicht es Benutzern, eigene Datenbanken zu erstellen,
 * Tabellen anzulegen/droppen, Daten einzufuegen und beliebige SQL-Abfragen
 * auszufuehren. Persistenz via IndexedDB.
 *
 * English: Types for the Sandbox mode of the SQL-Trainer platform.
 * Allows users to create their own databases, tables, insert data,
 * and run arbitrary SQL queries. Persistence via IndexedDB.
 */

import type { SqlQueryResult, SchemaTable } from "./playground";

/** Metadaten einer User-Datenbank (ohne Binary-Daten). */
export interface SandboxDatabaseMeta {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  sizeBytes?: number;
}

/** Volle User-Datenbank inkl. Binary-Daten (nur in IndexedDB gespeichert). */
export interface SandboxDatabase extends SandboxDatabaseMeta {
  binaryData: Uint8Array;
}

/** Ergebnis einer Sandbox-Query mit zusaetzlichen DML/DDL-Informationen. */
export interface SandboxQueryResult extends SqlQueryResult {
  /** Anzahl der durch DML/DDL geaenderten Zeilen (INSERT/UPDATE/DELETE). */
  rowsModified: number;
  /** Art der ausgefuehrten Anweisung. */
  statementType?: "DDL" | "DML" | "DQL" | "OTHER";
}

/** Eintrag in der Query-History. */
export interface QueryHistoryEntry {
  sql: string;
  executedAt: string;
  success: boolean;
  rowsModified?: number;
  statementType?: "DDL" | "DML" | "DQL" | "OTHER";
}

/** State des Sandbox-Hooks. */
export interface SandboxState {
  activeDbId: string | null;
  queryResult: SandboxQueryResult | null;
  liveSchema: SchemaTable[];
  dbList: SandboxDatabaseMeta[];
  isDirty: boolean;
  queryHistory: QueryHistoryEntry[];
  isLoading: boolean;
}

/** Lernmodul-Kategorie. */
export interface LearnModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  /** Schwierigkeitsgrad des Moduls. */
  difficulty: "beginner" | "junior" | "intermediate";
  articles: LearnArticle[];
}

/** Einzelner Lern-Artikel. */
export interface LearnArticle {
  id: string;
  title: string;
  /** Schaetzung der Lesezeit in Minuten. */
  estimatedMinutes: number;
  /** Inhaltsabschnitte des Artikels. */
  sections: LearnSection[];
}

/** Abschnitt eines Lern-Artikels. */
export interface LearnSection {
  id: string;
  title: string;
  /** Art des Abschnitts: Theorie, Beispiel, Praxis oder Zusammenfassung. */
  sectionType?: "theory" | "example" | "practice" | "summary";
  /** HTML-Inhalt oder Markdown-aehnlicher Text. */
  content: string;
  /** Optional: Kernaussagen als Bullet-Points. */
  keyTakeaways?: string[];
  /** Optional: Interaktives Widget (ERM-Diagramm, Normalform-Checker etc.). */
  widget?: {
    type: "erm-diagram" | "nf-checker" | "rm-to-sql";
    data: Record<string, unknown>;
  };
}

/** Fortschritt im Lern-Bereich. */
export interface LearnProgress {
  articlesRead: string[];
  /** Gelesene Sektionen (sectionId-Set). */
  sectionsRead: string[];
  lastReadAt: string | null;
}

/** Quiz-Frage mit Multiple-Choice-Antworten. */
export interface QuizQuestion {
  id: string;
  /** Der Fragetext. */
  question: string;
  /** Die Antwortoptionen. */
  options: QuizAnswer[];
  /** Erklaerung, warum die richtige Antwort richtig ist (wird nach dem Beantworten angezeigt). */
  explanation: string;
  /** Schwierigkeitsgrad der Frage. */
  difficulty?: "easy" | "medium" | "hard";
  /** Optionale SQL-Abfrage, die im Fragekontext relevant ist. */
  sqlContext?: string;
}

/** Antwortoption fuer eine Quiz-Frage. */
export interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

/** Ein komplettes Quiz fuer ein Lernmodul. */
export interface LearnQuiz {
  moduleId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
}

/** Ergebnis eines abgeschlossenen Quiz. */
export interface QuizResult {
  moduleId: string;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  answers: Record<string, string>; // questionId -> selectedAnswerId
}