/**
 * Playground-Orchestrator-Hook.
 *
 * Verwaltet eine In-Memory-Datenbank pro Uebung, fuehrt Benutzerabfragen aus,
 * vergleicht Ergebnismengen, fuehrt verdeckte Tests durch, waehlt Hinweise aus,
 * erklaert Fehler und verfolgt den Sitzungsstatus.
 *
 * English: Playground orchestrator hook. Manages an in-memory database per exercise,
 * runs user queries, compares resultsets, executes hidden tests, selects hints,
 * explains errors, and tracks session state.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type {
  PlaygroundExercise,
  HiddenTestResult,
  HintResult,
  PlaygroundSession,
  ResultsetComparison,
  SqlErrorExplanation,
  SqlQueryResult,
  SqlResultset,
  SchemaTable,
} from "@/types/playground";
import { compareResultsets } from "@/lib/resultsetComparison";
import { explainError } from "@/lib/errorExplanation";
import { getStrongerHint, selectHint } from "@/lib/hintEngine";
import { runHiddenTests } from "@/lib/hiddenTests";
import { introspectSchema } from "@/lib/schemaExplorer";
import { createDatabase, runQuery } from "@/lib/sqlEngine";

/** Aktuelle Phase einer Playground-Sitzung: idle, running, success, error oder partial. */
export type PlaygroundPhase = "idle" | "running" | "success" | "error" | "partial";

/** Rueckgabewert des usePlayground-Hooks mit allen Sitzungsdaten und Aktionen. */
export interface UsePlaygroundReturn {
  phase: PlaygroundPhase;
  userQuery: string;
  queryResult?: SqlQueryResult;
  comparison?: ResultsetComparison;
  hiddenTestResults?: HiddenTestResult[];
  hint?: HintResult;
  errorExplanation?: SqlErrorExplanation;
  attemptCount: number;
  completed: boolean;
  setUserQuery: (q: string) => void;
  runUserQuery: () => Promise<void>;
  requestStrongerHint: () => void;
  resetSession: () => void;
  referenceResultset?: SqlResultset;
  liveSchema: SchemaTable[];
  db: import("sql.js").Database | null;
}

/**
 * Hook fuer die Playground-Sitzungssteuerung.
 * @param exercise - Die aktuelle Uebung, fuer die der Playground ausgefuehrt wird.
 * @returns Alle Sitzungsdaten und Aktionen fuer die Playground-Komponente.
 */
export function usePlayground(exercise: PlaygroundExercise): UsePlaygroundReturn {
  const [userQuery, setUserQuery] = useState(exercise.prefillQuery ?? "");
  const [phase, setPhase] = useState<PlaygroundPhase>("idle");
  const [queryResult, setQueryResult] = useState<SqlQueryResult | undefined>(undefined);
  const [comparison, setComparison] = useState<ResultsetComparison | undefined>(undefined);
  const [hiddenTestResults, setHiddenTestResults] = useState<HiddenTestResult[] | undefined>(undefined);
  const [hint, setHint] = useState<HintResult | undefined>(undefined);
  const [errorExplanation, setErrorExplanation] = useState<SqlErrorExplanation | undefined>(undefined);
  const [attemptCount, setAttemptCount] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [referenceResultset, setReferenceResultset] = useState<SqlResultset | undefined>(undefined);
  const [liveSchema, setLiveSchema] = useState<SchemaTable[]>(exercise.schemaTables || []);
  const [db, setDb] = useState<import("sql.js").Database | null>(null);

  const dbRef = useRef<import("sql.js").Database | null>(null);
  const sessionRef = useRef<PlaygroundSession>({
    exerciseId: exercise.id,
    userQuery: "",
    attemptCount: 0,
    hintsShown: [],
    completed: false,
  });

  /** Initialisiert die Datenbank und berechnet die Referenz-Ergebnismenge. */
  const initDb = useCallback(async () => {
    if (dbRef.current) {
      dbRef.current.close();
    }
    const db = await createDatabase(exercise.setupSql);
    dbRef.current = db;
    setDb(db);
    // Referenz-Ergebnismenge aus Loesungsabfrage berechnen
    const ref = runQuery(db, exercise.solutionQuery);
    if (ref.success && ref.resultset) {
      setReferenceResultset(ref.resultset);
    }
    // Live-Schema aus der Datenbank introspektieren
    try {
      const schema = introspectSchema(db);
      setLiveSchema(schema.length > 0 ? schema : (exercise.schemaTables || []));
    } catch {
      setLiveSchema(exercise.schemaTables || []);
    }
    return db;
  }, [exercise]);

  useEffect(() => {
    initDb();
  }, [initDb]);

  /** Fuehrt die Benutzerabfrage aus und aktualisiert den Sitzungsstatus. */
  const runUserQuery = useCallback(async () => {
    setPhase("running");
    let db = dbRef.current;
    if (!db) {
      db = await initDb();
    } else {
      // Datenbank wieder neu initialisieren, damit vorherige Versuche den Status nicht beeinflussen (fuer DML-Uebungen)
      db.close();
      db = await createDatabase(exercise.setupSql);
      dbRef.current = db;
      setDb(db);
      // Referenz-Ergebnismenge nach Neu-Initialisierung neu berechnen
      const ref = runQuery(db, exercise.solutionQuery);
      if (ref.success && ref.resultset) {
        setReferenceResultset(ref.resultset);
      }
      // Schema nach Neu-Initialisierung erneut introspektieren
      try {
        const schema = introspectSchema(db!);
        setLiveSchema(schema.length > 0 ? schema : (exercise.schemaTables || []));
      } catch {
        setLiveSchema(exercise.schemaTables || []);
      }
    }

    if (!db) return;

    const result = runQuery(db, userQuery);
    setQueryResult(result);
    const nextAttempt = attemptCount + 1;
    setAttemptCount(nextAttempt);

    sessionRef.current.userQuery = userQuery;
    sessionRef.current.attemptCount = nextAttempt;
    sessionRef.current.lastResult = result;

    if (!result.success) {
      const exp = explainError(result.error || "");
      setErrorExplanation(exp);
      setPhase("error");
      // Hinweis fuer Syntaxfehler suchen
      const matched = selectHint(exercise.hints || [], result, undefined, nextAttempt);
      if (matched) {
        setHint(matched);
        sessionRef.current.hintsShown.push(matched);
      }
      return;
    }

    setErrorExplanation(undefined);

    // Ergebnismengen vergleichen
    let comp: ResultsetComparison | undefined;
    if (referenceResultset) {
      comp = compareResultsets(referenceResultset, result.resultset || { columns: [], rows: [] });
    } else {
      // Fallback: Loesungsabfrage frisch ausfuehren
      const ref = runQuery(db, exercise.solutionQuery);
      if (ref.success && ref.resultset) {
        comp = compareResultsets(ref.resultset, result.resultset || { columns: [], rows: [] });
      }
    }

    setComparison(comp);
    sessionRef.current.lastComparison = comp;

    const isEqual = comp?.status === "equal";

    // Verdeckte Tests ausfuehren
    let htResults: HiddenTestResult[] | undefined;
    if (isEqual && exercise.hiddenTests && exercise.hiddenTests.length > 0 && db) {
      htResults = runHiddenTests(db, exercise.hiddenTests);
      setHiddenTestResults(htResults);
      sessionRef.current.hiddenTestResults = htResults;
    } else {
      setHiddenTestResults(undefined);
      sessionRef.current.hiddenTestResults = undefined;
    }

    const allHiddenPassed = htResults ? htResults.every((r) => r.passed) : true;
    const fullyCorrect = isEqual && allHiddenPassed;

    if (fullyCorrect) {
      setPhase("success");
      setCompleted(true);
      sessionRef.current.completed = true;
      setHint(undefined);
    } else {
      setPhase("partial");
      const matched = selectHint(exercise.hints || [], result, comp, nextAttempt);
      if (matched) {
        setHint(matched);
        sessionRef.current.hintsShown.push(matched);
      }
    }
  }, [userQuery, attemptCount, exercise, initDb, referenceResultset]);

  const requestStrongerHint = useCallback(() => {
    if (!hint || !exercise.hints) return;
    const stronger = getStrongerHint(
      exercise.hints,
      hint.level,
      queryResult || { success: true },
      comparison,
      attemptCount
    );
    if (stronger) {
      setHint(stronger);
      sessionRef.current.hintsShown.push(stronger);
    }
  }, [hint, exercise.hints, queryResult, comparison, attemptCount]);

  const resetSession = useCallback(() => {
    setUserQuery(exercise.prefillQuery ?? "");
    setPhase("idle");
    setQueryResult(undefined);
    setComparison(undefined);
    setHiddenTestResults(undefined);
    setHint(undefined);
    setErrorExplanation(undefined);
    setAttemptCount(0);
    setCompleted(false);
    setReferenceResultset(undefined);
    setLiveSchema(exercise.schemaTables || []);
    sessionRef.current = {
      exerciseId: exercise.id,
      userQuery: "",
      attemptCount: 0,
      hintsShown: [],
      completed: false,
    };
    if (dbRef.current) {
      dbRef.current.close();
      dbRef.current = null;
    }
    setDb(null);
  }, [exercise.id, exercise.schemaTables, exercise.prefillQuery]);

  return useMemo(
    () => ({
      phase,
      userQuery,
      queryResult,
      comparison,
      hiddenTestResults,
      hint,
      errorExplanation,
      attemptCount,
      completed,
      setUserQuery,
      runUserQuery,
      requestStrongerHint,
      resetSession,
      referenceResultset,
      liveSchema,
      db,
    }),
    [
      phase,
      userQuery,
      queryResult,
      comparison,
      hiddenTestResults,
      hint,
      errorExplanation,
      attemptCount,
      completed,
      runUserQuery,
      requestStrongerHint,
      resetSession,
      referenceResultset,
      liveSchema,
      db,
    ]
  );
}
