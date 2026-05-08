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
  /** HTML-Inhalt oder Markdown-aehnlicher Text. */
  content: string;
  /** Optional: SQL-Beispiel zum Ausfuehren im eingebetteten Playground. */
  sqlExample?: string;
  /** Optional: Setup-SQL fuer den eingebetteten Playground. */
  setupSql?: string;
  /** Optional: Interaktives Widget (ERM-Diagramm, Normalform-Checker etc.). */
  widget?: {
    type: "erm-diagram" | "nf-checker" | "rm-to-sql" | "mini-playground";
    data: Record<string, unknown>;
  };
}

/** Fortschritt im Lern-Bereich. */
export interface LearnProgress {
  articlesRead: string[];
  lastReadAt: string | null;
}