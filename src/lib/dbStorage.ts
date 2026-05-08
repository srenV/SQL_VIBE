/**
 * IndexedDB-Persistenz-Service fuer den Sandbox-Modus.
 *
 * Speichert User-Datenbanken als binaere SQLite-Files (via db.export())
 * und Query-History-Eintraege in IndexedDB.
 *
 * WICHTIG: Die IDB-Verbindung wird gecacht und NICHT pro Transaktion
 * geoeffnet/geschlossen. Das verhindert Race-Conditions zwischen
 * request.onsuccess und tx.oncomplete.
 *
 * English: IndexedDB persistence service for the Sandbox mode.
 * Stores user databases as binary SQLite files (via db.export())
 * and query history entries in IndexedDB.
 *
 * IMPORTANT: The IDB connection is cached and NOT opened/closed per
 * transaction. This prevents race conditions between request.onsuccess
 * and tx.oncomplete.
 */

import type { SandboxDatabase, SandboxDatabaseMeta, QueryHistoryEntry } from "@/types/sandbox";

const DB_NAME = "sql-trainer-sandbox";
const DB_VERSION = 1;
const STORE_DATABASES = "databases";
const STORE_QUERY_HISTORY = "queryHistory";

// ─── Cached IDB Connection ──────────────────────────────────────────────────

/** Gecachte IDB-Verbindung. Bleibt offen bis Page-Unload. */
let cachedDb: IDBDatabase | null = null;
/** Ob die gecachte Verbindung geschlossen wurde. */
let cachedDbClosed = false;
/** Pending open-Requests verhindern parallele openDB-Aufrufe. */
let openPromise: Promise<IDBDatabase> | null = null;

/**
 * Oeffnet (oder erstellt) die IndexedDB und cachet die Verbindung.
 * Bei Page-Unload wird die Verbindung automatisch freigegeben.
 */
function openDB(): Promise<IDBDatabase> {
  // Bereits offen → direkt zurueck
  if (cachedDb && !cachedDbClosed) {
    return Promise.resolve(cachedDb);
  }

  // Bereits ein open-Request laeuft → darauf warten
  if (openPromise) {
    return openPromise;
  }

  openPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_DATABASES)) {
        db.createObjectStore(STORE_DATABASES, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_QUERY_HISTORY)) {
        const historyStore = db.createObjectStore(STORE_QUERY_HISTORY, {
          keyPath: "id",
          autoIncrement: true,
        });
        historyStore.createIndex("dbId", "dbId", { unique: false });
        historyStore.createIndex("executedAt", "executedAt", { unique: false });
      }
    };

    request.onsuccess = () => {
      cachedDb = request.result;
      cachedDbClosed = false;
      openPromise = null;

      // Bei unerwartetem Close (z.B. User loescht DB) Cache invalidieren
      cachedDb.onclose = () => {
        cachedDb = null;
        cachedDbClosed = true;
      };

      resolve(cachedDb);
    };

    request.onerror = () => {
      openPromise = null;
      reject(request.error);
    };
  });

  return openPromise;
}

/**
 * Schliesst die gecachte IDB-Verbindung explizit.
 * Nur fuer Cleanup-Operationen gedacht – normalerweise nicht noetig,
 * da die Verbindung fuer die gesamte Lebensdauer der Seite offen bleibt.
 */
export function closeIDBConnection(): void {
  if (cachedDb) {
    cachedDb.close();
    cachedDb = null;
    cachedDbClosed = true;
  }
}

// Hinweis: Kein beforeunload-Handler mehr! Die IDB-Verbindung bleibt
// fuer die gesamte Seiten-Lebensdauer offen. Der Browser schliesst sie
// automatisch beim Tab-/Fenster-Schliessen. Ein beforeunload-Handler
// hat zu "The database connection is closing"-Fehlern gefuehrt, weil
// er die Verbindung geschlossen hat, waehrend noch asynchrone Operationen
// liefen.

/** Generische Transaktions-Hilfsfunktion mit gecachter Verbindung und automatischem Reconnect. */
async function withTransaction<T>(
  storeName: string,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  // Max. 2 Versuche: einmal mit gecachter Verbindung, einmal mit frischer
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const db = await openDB();
      const result = await new Promise<T>((resolve, reject) => {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        const request = fn(store);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        // tx.oncomplete wird NICHT zum Schliessen genutzt –
        // die Verbindung bleibt offen fuer weitere Transaktionen.
      });
      return result;
    } catch (err) {
      // Wenn die Verbindung geschlossen wurde, Cache invalidieren und erneut versuchen
      if (err instanceof DOMException && (err.name === "InvalidStateError" || err.message?.includes("closing"))) {
        cachedDb = null;
        cachedDbClosed = true;
        if (attempt === 0) continue; // Retry mit frischer Verbindung
      }
      throw err;
    }
  }
  // Sollte nie erreicht werden, aber TypeScript braucht es
  throw new Error("IDB transaction failed after retry");
}

// ─── Database CRUD ──────────────────────────────────────────────────────────

/**
 * Speichert eine User-Datenbank in IndexedDB.
 * @param db - Die vollstaendige SandboxDatabase inkl. Binary-Daten.
 */
export async function saveDatabase(db: SandboxDatabase): Promise<void> {
  await withTransaction(STORE_DATABASES, "readwrite", (store) => store.put(db));
}

/**
 * Laedt eine User-Datenbank aus IndexedDB.
 * @param id - Die ID der Datenbank.
 * @returns Die SandboxDatabase oder undefined, falls nicht gefunden.
 */
export async function loadDatabase(id: string): Promise<SandboxDatabase | undefined> {
  const result = await withTransaction<SandboxDatabase | undefined>(
    STORE_DATABASES,
    "readonly",
    (store) => store.get(id)
  );
  return result ?? undefined;
}

/**
 * Laedt nur die Metadaten einer Datenbank (ohne Binary).
 * @param id - Die ID der Datenbank.
 * @returns Die SandboxDatabaseMeta oder undefined.
 */
export async function loadDatabaseMeta(id: string): Promise<SandboxDatabaseMeta | undefined> {
  const db = await loadDatabase(id);
  if (!db) return undefined;
  const { binaryData, ...meta } = db;
  return meta;
}

/**
 * Listet alle User-Datenbanken auf (nur Metadaten, ohne Binary).
 * @returns Array von SandboxDatabaseMeta.
 */
export async function listDatabases(): Promise<SandboxDatabaseMeta[]> {
  // Max. 2 Versuche fuer Reconnect-Logik
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const db = await openDB();
      const result = await new Promise<SandboxDatabaseMeta[]>((resolve, reject) => {
        const tx = db.transaction(STORE_DATABASES, "readonly");
        const store = tx.objectStore(STORE_DATABASES);
        const request = store.getAll();
        request.onsuccess = () => {
          const results: SandboxDatabase[] = request.result ?? [];
          const metas: SandboxDatabaseMeta[] = results.map(({ binaryData, ...meta }) => ({
            ...meta,
            sizeBytes: binaryData?.byteLength ?? 0,
          }));
          resolve(metas);
        };
        request.onerror = () => reject(request.error);
        // Kein db.close() mehr – Verbindung bleibt offen
      });
      return result;
    } catch (err) {
      if (err instanceof DOMException && (err.name === "InvalidStateError" || err.message?.includes("closing"))) {
        cachedDb = null;
        cachedDbClosed = true;
        if (attempt === 0) continue;
      }
      throw err;
    }
  }
  return [];
}

/**
 * Loescht eine User-Datenbank aus IndexedDB.
 * @param id - Die ID der zu loeschenden Datenbank.
 */
export async function deleteDatabase(id: string): Promise<void> {
  // Zusaetzlich Query-History fuer diese DB loeschen
  await deleteQueryHistoryForDb(id);
  await withTransaction(STORE_DATABASES, "readwrite", (store) => store.delete(id));
}

/**
 * Benennt eine User-Datenbank um.
 * @param id - Die ID der Datenbank.
 * @param newName - Der neue Name.
 */
export async function renameDatabase(id: string, newName: string): Promise<void> {
  const db = await loadDatabase(id);
  if (!db) throw new Error(`Datenbank "${id}" nicht gefunden.`);
  db.name = newName;
  db.updatedAt = new Date().toISOString();
  await saveDatabase(db);
}

/**
 * Dupliziert eine User-Datenbank.
 * @param id - Die ID der zu duplizierenden Datenbank.
 * @param newName - Der Name fuer die Kopie.
 * @returns Die ID der neuen Datenbank.
 */
export async function duplicateDatabase(id: string, newName: string): Promise<string> {
  const db = await loadDatabase(id);
  if (!db) throw new Error(`Datenbank "${id}" nicht gefunden.`);
  const newId = crypto.randomUUID();
  const now = new Date().toISOString();
  const duplicate: SandboxDatabase = {
    ...db,
    id: newId,
    name: newName,
    createdAt: now,
    updatedAt: now,
    binaryData: new Uint8Array(db.binaryData), // Deep copy
  };
  await saveDatabase(duplicate);
  return newId;
}

// ─── Query History ──────────────────────────────────────────────────────────

/**
 * Speichert einen Query-History-Eintrag.
 * @param dbId - Die ID der Datenbank.
 * @param entry - Der History-Eintrag.
 */
export async function saveQueryToHistory(dbId: string, entry: QueryHistoryEntry): Promise<void> {
  await withTransaction(STORE_QUERY_HISTORY, "readwrite", (store) =>
    store.put({ dbId, ...entry })
  );
}

/**
 * Laedt die Query-History fuer eine bestimmte Datenbank.
 * @param dbId - Die ID der Datenbank.
 * @param limit - Maximale Anzahl Eintraege (Standard: 20).
 * @returns Array von QueryHistoryEntry, neueste zuerst.
 */
export async function getQueryHistory(dbId: string, limit: number = 20): Promise<QueryHistoryEntry[]> {
  // Max. 2 Versuche fuer Reconnect-Logik
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const db = await openDB();
      const result = await new Promise<QueryHistoryEntry[]>((resolve, reject) => {
        const tx = db.transaction(STORE_QUERY_HISTORY, "readonly");
        const store = tx.objectStore(STORE_QUERY_HISTORY);
        const index = store.index("dbId");
        const request = index.getAll(dbId);
        request.onsuccess = () => {
          const results: (QueryHistoryEntry & { dbId: string })[] = request.result ?? [];
          // Neueste zuerst, limitiert
          const sorted = results
            .sort((a, b) => b.executedAt.localeCompare(a.executedAt))
            .slice(0, limit)
            .map(({ dbId: _, ...entry }) => entry);
          resolve(sorted);
        };
        request.onerror = () => reject(request.error);
        // Kein db.close() – Verbindung bleibt offen
      });
      return result;
    } catch (err) {
      if (err instanceof DOMException && (err.name === "InvalidStateError" || err.message?.includes("closing"))) {
        cachedDb = null;
        cachedDbClosed = true;
        if (attempt === 0) continue;
      }
      throw err;
    }
  }
  return [];
}

/**
 * Loescht die gesamte Query-History fuer eine Datenbank.
 * @param dbId - Die ID der Datenbank.
 */
export async function deleteQueryHistoryForDb(dbId: string): Promise<void> {
  // Max. 2 Versuche fuer Reconnect-Logik
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const db = await openDB();
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(STORE_QUERY_HISTORY, "readwrite");
        const store = tx.objectStore(STORE_QUERY_HISTORY);
        const index = store.index("dbId");
        const request = index.openCursor(dbId);
        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          }
        };
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
        // Kein db.close() – Verbindung bleibt offen
      });
      return;
    } catch (err) {
      if (err instanceof DOMException && (err.name === "InvalidStateError" || err.message?.includes("closing"))) {
        cachedDb = null;
        cachedDbClosed = true;
        if (attempt === 0) continue;
      }
      throw err;
    }
  }
}