/**
 * Sandbox-Orchestrator-Hook.
 *
 * Verwaltet eine oder mehrere User-Datenbanken im Sandbox-Modus,
 * fuehrt SQL-Abfragen aus, persistiert Aenderungen via IndexedDB
 * und bietet Schema-Introspektion.
 *
 * English: Sandbox orchestrator hook. Manages one or more user databases
 * in sandbox mode, runs SQL queries, persists changes via IndexedDB,
 * and provides schema introspection.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { SandboxDatabaseMeta, SandboxQueryResult, QueryHistoryEntry } from "@/types/sandbox";
import type { SchemaTable } from "@/types/playground";
import {
  createDatabase,
  runSandboxQuery,
  exportAndCloseDatabase,
  exportDatabaseSafe,
  loadDatabaseFromBinary,
  closeDatabase,
} from "@/lib/sqlEngine";
import { introspectSchema } from "@/lib/schemaExplorer";
import {
  saveDatabase,
  loadDatabase,
  listDatabases,
  deleteDatabase as deleteDbFromStorage,
  renameDatabase as renameDbInStorage,
  duplicateDatabase as duplicateDbInStorage,
  saveQueryToHistory,
  getQueryHistory,
} from "@/lib/dbStorage";

/** Rueckgabewert des useSandbox-Hooks. */
export interface UseSandboxReturn {
  /** Liste aller User-Datenbanken (nur Metadaten). */
  dbList: SandboxDatabaseMeta[];
  /** ID der aktuell geoeffneten Datenbank oder null. */
  activeDbId: string | null;
  /** Die aktive sql.js-Datenbankinstanz oder null. */
  activeDb: import("sql.js").Database | null;
  /** Ergebnis der letzten ausgefuehrten Query. */
  queryResult: SandboxQueryResult | null;
  /** Aktuelles Schema der aktiven Datenbank. */
  liveSchema: SchemaTable[];
  /** Ob es ungespeicherte Aenderungen gibt. */
  isDirty: boolean;
  /** Query-History fuer die aktive Datenbank. */
  queryHistory: QueryHistoryEntry[];
  /** Ob der Hook gerade laedt (DB-Initialisierung). */
  isLoading: boolean;
  /** Erstellt eine neue leere Datenbank. */
  createNewDatabase: (name: string) => Promise<string>;
  /** Oeffnet eine bestehende Datenbank. */
  openDatabase: (id: string) => Promise<void>;
  /** Schliesst die aktuelle Datenbank (mit Auto-Save). */
  closeActiveDatabase: () => Promise<void>;
  /** Loescht eine Datenbank. */
  deleteDatabase: (id: string) => Promise<void>;
  /** Benennt eine Datenbank um. */
  renameDatabase: (id: string, newName: string) => Promise<void>;
  /** Dupliziert eine Datenbank. */
  duplicateDatabase: (id: string, newName: string) => Promise<string>;
  /** Fuehrt eine SQL-Abfrage aus. */
  runQuery: (sql: string) => Promise<void>;
  /** Aktualisiert das Schema der aktiven Datenbank. */
  refreshSchema: () => void;
  /** Laedt die DB-Liste neu aus IndexedDB. */
  refreshDbList: () => Promise<void>;
}

/** Debounce-Timer fuer Auto-Save (ms). */
const AUTO_SAVE_DEBOUNCE_MS = 500;

export function useSandbox(): UseSandboxReturn {
  const [dbList, setDbList] = useState<SandboxDatabaseMeta[]>([]);
  const [activeDbId, setActiveDbId] = useState<string | null>(null);
  const [activeDb, setActiveDb] = useState<import("sql.js").Database | null>(null);
  const [queryResult, setQueryResult] = useState<SandboxQueryResult | null>(null);
  const [liveSchema, setLiveSchema] = useState<SchemaTable[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const autoSaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeDbRef = useRef<import("sql.js").Database | null>(null);
  const activeDbIdRef = useRef<string | null>(null);

  // Refs synchron halten
  useEffect(() => {
    activeDbRef.current = activeDb;
    activeDbIdRef.current = activeDbId;
  }, [activeDb, activeDbId]);

  /** Laedt die DB-Liste aus IndexedDB. */
  const refreshDbList = useCallback(async () => {
    try {
      const list = await listDatabases();
      setDbList(list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)));
    } catch {
      setDbList([]);
    }
  }, []);

  /** Initial: DB-Liste laden. */
  useEffect(() => {
    refreshDbList();
  }, [refreshDbList]);

  /** Persistiert die aktive Datenbank in IndexedDB. */
  const persistActiveDb = useCallback(async () => {
    const db = activeDbRef.current;
    const dbId = activeDbIdRef.current;
    if (!db || !dbId) return;

    try {
      // exportDatabaseSafe: exportiert, schliesst die alte (korrupte) DB,
      // und gibt eine frische Instanz aus dem Binary zurueck.
      const { binary: binaryData, freshDb } = await exportDatabaseSafe(db);

      // Frische DB als aktive Instanz setzen
      activeDbRef.current = freshDb;
      setActiveDb(freshDb);

      const existing = await loadDatabase(dbId);
      const now = new Date().toISOString();
      await saveDatabase({
        id: dbId,
        name: existing?.name ?? "Unbenannt",
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
        sizeBytes: binaryData.byteLength,
        binaryData,
      });
      setIsDirty(false);
      // DB-Liste aktualisieren (neue sizeBytes/updatedAt)
      await refreshDbList();
    } catch (err) {
      console.error("Auto-Save fehlgeschlagen:", err);
    }
  }, [refreshDbList]);

  /** Debounced Auto-Save nach DDL/DML. */
  const scheduleAutoSave = useCallback(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
    autoSaveTimerRef.current = setTimeout(() => {
      persistActiveDb();
    }, AUTO_SAVE_DEBOUNCE_MS);
  }, [persistActiveDb]);

  /** Cleanup Timer bei Unmount. */
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  /** Aktualisiert das Schema der aktiven Datenbank. */
  const refreshSchema = useCallback(() => {
    const db = activeDbRef.current;
    if (!db) {
      setLiveSchema([]);
      return;
    }
    try {
      const schema = introspectSchema(db);
      setLiveSchema(schema);
    } catch {
      setLiveSchema([]);
    }
  }, []);

  /** Erstellt eine neue leere Datenbank. */
  const createNewDatabase = useCallback(
    async (name: string): Promise<string> => {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      // Leere In-Memory-DB erstellen
      const db = await createDatabase("");

      // Exportieren und sofort schliessen – die DB wird nicht als
      // aktive Instanz verwendet, sondern nur als Binary in IndexedDB gespeichert.
      const binaryData = exportAndCloseDatabase(db);

      // In IndexedDB speichern
      await saveDatabase({
        id,
        name,
        createdAt: now,
        updatedAt: now,
        sizeBytes: binaryData.byteLength,
        binaryData,
      });

      await refreshDbList();
      return id;
    },
    [refreshDbList]
  );

  /** Oeffnet eine bestehende Datenbank aus IndexedDB. */
  const openDatabase = useCallback(
    async (id: string): Promise<void> => {
      setIsLoading(true);

      // Aktuelle DB vorher speichern + schliessen
      if (activeDbRef.current) {
        const prevDb = activeDbRef.current;
        const prevId = activeDbIdRef.current;
        if (isDirty && prevId) {
          // Save + Close in einem Schritt (exportAndCloseDatabase)
          try {
            const binaryData = exportAndCloseDatabase(prevDb);
            const existing = await loadDatabase(prevId);
            const now = new Date().toISOString();
            await saveDatabase({
              id: prevId,
              name: existing?.name ?? "Unbenannt",
              createdAt: existing?.createdAt ?? now,
              updatedAt: now,
              sizeBytes: binaryData.byteLength,
              binaryData,
            });
          } catch (err) {
            console.error("Save vor DB-Wechsel fehlgeschlagen:", err);
            try { closeDatabase(prevDb); } catch { /* ignore */ }
          }
        } else {
          closeDatabase(prevDb);
        }
        setActiveDb(null);
        setActiveDbId(null);
        activeDbRef.current = null;
        activeDbIdRef.current = null;
      }

      try {
        const stored = await loadDatabase(id);
        if (!stored) {
          throw new Error(`Datenbank "${id}" nicht gefunden.`);
        }

        const db = await loadDatabaseFromBinary(stored.binaryData);
        activeDbRef.current = db;
        activeDbIdRef.current = id;
        setActiveDb(db);
        setActiveDbId(id);
        setQueryResult(null);
        setIsDirty(false);

        // Schema introspektieren
        try {
          const schema = introspectSchema(db);
          setLiveSchema(schema);
        } catch {
          setLiveSchema([]);
        }

        // Query-History laden
        try {
          const history = await getQueryHistory(id);
          setQueryHistory(history);
        } catch {
          setQueryHistory([]);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isDirty]
  );

  /** Schliesst die aktuelle Datenbank (mit Auto-Save). */
  const closeActiveDatabase = useCallback(async () => {
    if (activeDbRef.current) {
      if (isDirty) {
        // Finaler Save: exportieren und schliessen in einem Schritt
        const db = activeDbRef.current;
        const dbId = activeDbIdRef.current;
        if (db && dbId) {
          try {
            const binaryData = exportAndCloseDatabase(db);
            const existing = await loadDatabase(dbId);
            const now = new Date().toISOString();
            await saveDatabase({
              id: dbId,
              name: existing?.name ?? "Unbenannt",
              createdAt: existing?.createdAt ?? now,
              updatedAt: now,
              sizeBytes: binaryData.byteLength,
              binaryData,
            });
          } catch (err) {
            console.error("Finaler Save fehlgeschlagen:", err);
            // DB trotzdem schliessen
            try { closeDatabase(db); } catch { /* ignore */ }
          }
        }
      } else {
        closeDatabase(activeDbRef.current);
      }
    }
    activeDbRef.current = null;
    activeDbIdRef.current = null;
    setActiveDb(null);
    setActiveDbId(null);
    setQueryResult(null);
    setLiveSchema([]);
    setIsDirty(false);
    setQueryHistory([]);
  }, [isDirty]);

  /** Loescht eine Datenbank. */
  const deleteDatabase = useCallback(
    async (id: string) => {
      // Falls es die aktive DB ist, zuerst schliessen
      if (activeDbIdRef.current === id) {
        if (activeDbRef.current) {
          closeDatabase(activeDbRef.current);
        }
        activeDbRef.current = null;
        activeDbIdRef.current = null;
        setActiveDb(null);
        setActiveDbId(null);
        setQueryResult(null);
        setLiveSchema([]);
        setIsDirty(false);
        setQueryHistory([]);
      }

      await deleteDbFromStorage(id);
      await refreshDbList();
    },
    [refreshDbList]
  );

  /** Benennt eine Datenbank um. */
  const renameDatabase = useCallback(
    async (id: string, newName: string) => {
      await renameDbInStorage(id, newName);
      await refreshDbList();
    },
    [refreshDbList]
  );

  /** Dupliziert eine Datenbank. */
  const duplicateDatabase = useCallback(
    async (id: string, newName: string): Promise<string> => {
      const newId = await duplicateDbInStorage(id, newName);
      await refreshDbList();
      return newId;
    },
    [refreshDbList]
  );

  /** Fuehrt eine SQL-Abfrage aus. Auto-erstellt eine DB wenn keine offen ist. */
  const runQuery = useCallback(
    async (sql: string) => {
      let db = activeDbRef.current;
      let dbId = activeDbIdRef.current;

      // Wenn keine DB offen ist, auto-erstelle eine neue und öffne sie
      if (!db) {
        try {
          const now = new Date().toISOString();
          const newId = crypto.randomUUID();
          const name = "Neue Datenbank";

          // Leere DB erstellen, SQL direkt darauf ausführen
          const newDb = await createDatabase(sql);
          const binaryData = exportAndCloseDatabase(newDb);

          // Frische DB aus Binary laden (wie bei openDatabase)
          db = await loadDatabaseFromBinary(binaryData);

          // In IndexedDB speichern
          await saveDatabase({
            id: newId,
            name,
            createdAt: now,
            updatedAt: now,
            sizeBytes: binaryData.byteLength,
            binaryData,
          });

          // Als aktive DB setzen
          activeDbRef.current = db;
          activeDbIdRef.current = newId;
          setActiveDb(db);
          setActiveDbId(newId);
          dbId = newId;

          // Schema aktualisieren
          refreshSchema();
          setIsDirty(false);

          // DB-Liste aktualisieren
          await refreshDbList();

          // Ergebnis: Das SQL wurde bereits in createDatabase ausgeführt.
          // Zeige eine Erfolgsmeldung.
          setQueryResult({
            success: true,
            resultset: { columns: [], rows: [] },
            executionTimeMs: 0,
            rowsModified: 0,
            statementType: "DDL",
          });

          // Query-History speichern
          const historyEntry: QueryHistoryEntry = {
            sql,
            executedAt: new Date().toISOString(),
            success: true,
            rowsModified: 0,
            statementType: "DDL",
          };
          setQueryHistory((prev) => [historyEntry, ...prev].slice(0, 50));
          try {
            await saveQueryToHistory(dbId, historyEntry);
          } catch {
            // History-Save-Fehler nicht kritisch
          }

          return;
        } catch (err) {
          // Fehler bei Auto-Erstellung: Fehlermeldung anzeigen
          const errorMsg = err instanceof Error ? err.message : String(err);
          setQueryResult({
            success: false,
            error: `Fehler beim Erstellen der Datenbank: ${errorMsg}`,
            executionTimeMs: 0,
            rowsModified: 0,
            statementType: "DDL",
          });
          return;
        }
      }

      const result = runSandboxQuery(db, sql);
      setQueryResult(result);

      // Query-History speichern
      const historyEntry: QueryHistoryEntry = {
        sql,
        executedAt: new Date().toISOString(),
        success: result.success,
        rowsModified: result.rowsModified,
        statementType: result.statementType,
      };
      setQueryHistory((prev) => [historyEntry, ...prev].slice(0, 50));

      if (dbId) {
        try {
          await saveQueryToHistory(dbId, historyEntry);
        } catch {
          // History-Save-Fehler nicht kritisch
        }
      }

      // Bei DDL/DML: Schema aktualisieren + Auto-Save
      if (result.success && (result.statementType === "DDL" || result.statementType === "DML")) {
        refreshSchema();
        setIsDirty(true);
        scheduleAutoSave();
      }
    },
    [refreshSchema, scheduleAutoSave, refreshDbList]
  );

  return {
    dbList,
    activeDbId,
    activeDb,
    queryResult,
    liveSchema,
    isDirty,
    queryHistory,
    isLoading,
    createNewDatabase,
    openDatabase,
    closeActiveDatabase,
    deleteDatabase,
    renameDatabase,
    duplicateDatabase,
    runQuery,
    refreshSchema,
    refreshDbList,
  };
}