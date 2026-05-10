/**
 * Zentraler Katalog fuer Lektionen, Uebungen und Datensaetze.
 *
 * Baut die Lernstruktur der SQL-Trainer MySQL-Lernplattform auf:
 * Ordnet Uebungen und Datensaetze den jeweiligen Lektionen zu
 * und exportiert die vollstaendige Katalog-Struktur.
 */
import {
  shopDataset,
  fitnessDataset,
  hrDataset,
  ticketsDataset,
  bankingDataset,
  streamingDataset,
  logsDataset,
  universityDataset,
  ecommerceDataset,
  hospitalDataset,
} from "@/data/datasets";
import {
  selectExercises,
  whereExercises,
  orderLimitExercises,
  aggregationExercises,
  joinExercises,
  subqueryExercises,
  debugExercises,
  predictExercises,
  schemaExercises,
  interviewExercises,
  cteExercises,
  windowFunctionExercises,
  dmlExercises,
  ddlExercises,
  storyExercises,
} from "@/data/exercises";
import type { Catalog, Lesson } from "@/types/exercise";

const allExercises = [
  ...selectExercises,
  ...whereExercises,
  ...orderLimitExercises,
  ...aggregationExercises,
  ...joinExercises,
  ...subqueryExercises,
  ...debugExercises,
  ...predictExercises,
  ...schemaExercises,
  ...interviewExercises,
  ...cteExercises,
  ...windowFunctionExercises,
  ...dmlExercises,
  ...ddlExercises,
  ...storyExercises,
];

const exercisesRecord: Catalog["exercises"] = {};
for (const ex of allExercises) {
  exercisesRecord[ex.id] = ex;
}

const datasetsRecord: Catalog["datasets"] = {
  [shopDataset.id]: shopDataset,
  [fitnessDataset.id]: fitnessDataset,
  [hrDataset.id]: hrDataset,
  [ticketsDataset.id]: ticketsDataset,
  [bankingDataset.id]: bankingDataset,
  [streamingDataset.id]: streamingDataset,
  [logsDataset.id]: logsDataset,
  [universityDataset.id]: universityDataset,
  [ecommerceDataset.id]: ecommerceDataset,
  [hospitalDataset.id]: hospitalDataset,
};

const lessonsArray: Lesson[] = [
  {
    id: "lesson_select",
    title: "SELECT Grundlagen",
    description: "Lerne, Daten aus Tabellen abzufragen: alle Spalten, einzelne Spalten, Aliase und DISTINCT.",
    difficulty: "beginner",
    category: "SELECT",
    exercises: selectExercises.map((e) => e.id),
    order: 1,
  },
  {
    id: "lesson_where",
    title: "Filterlogik mit WHERE",
    description: "Verfeinere deine Abfragen mit WHERE, AND, OR, BETWEEN, IN, LIKE und IS NULL.",
    difficulty: "beginner",
    category: "WHERE",
    exercises: whereExercises.map((e) => e.id),
    order: 2,
  },
  {
    id: "lesson_order",
    title: "Sortieren und Begrenzen",
    description: "Ordne Ergebnisse mit ORDER BY und begrenze sie mit LIMIT.",
    difficulty: "beginner",
    category: "ORDER BY / LIMIT",
    exercises: orderLimitExercises.map((e) => e.id),
    order: 3,
  },
  {
    id: "lesson_aggregation",
    title: "Aggregationen",
    description: "Berechne Summen, Durchschnitte, Minima, Maxima und gruppiere mit GROUP BY und HAVING.",
    difficulty: "junior",
    category: "Aggregation",
    exercises: aggregationExercises.map((e) => e.id),
    order: 4,
  },
  {
    id: "lesson_join",
    title: "Tabellen verbinden (JOINs)",
    description: "Verbinde Tabellen mit INNER JOIN, LEFT JOIN, RIGHT JOIN und Self Join.",
    difficulty: "junior",
    category: "JOIN",
    exercises: joinExercises.map((e) => e.id),
    order: 5,
  },
  {
    id: "lesson_subquery",
    title: "Subqueries",
    description: "Nutze Unterabfragen in WHERE, FROM, SELECT und mit EXISTS.",
    difficulty: "intermediate",
    category: "Subquery",
    exercises: subqueryExercises.map((e) => e.id),
    order: 6,
  },
  {
    id: "lesson_cte",
    title: "Common Table Expressions (CTEs)",
    description: "Strukturiere komplexe Abfragen mit WITH und CTEs fuer bessere Lesbarkeit.",
    difficulty: "intermediate",
    category: "CTE",
    exercises: cteExercises.map((e) => e.id),
    order: 7,
  },
  {
    id: "lesson_window",
    title: "Window Functions",
    description: "Berechne laufende Summen, Rangfolgen und Analysefunktionen mit OVER, ROW_NUMBER, RANK und LAG.",
    difficulty: "intermediate",
    category: "Window Functions",
    exercises: windowFunctionExercises.map((e) => e.id),
    order: 8,
  },
  {
    id: "lesson_dml",
    title: "Daten aendern (DML)",
    description: "Aendere Daten mit INSERT, UPDATE und DELETE.",
    difficulty: "junior",
    category: "DML",
    exercises: dmlExercises.map((e) => e.id),
    order: 9,
  },
  {
    id: "lesson_ddl",
    title: "Schema und Tabellen (DDL)",
    description: "Erstelle und aendere Tabellenstrukturen mit CREATE TABLE, ALTER TABLE und Constraints.",
    difficulty: "junior",
    category: "DDL",
    exercises: ddlExercises.map((e) => e.id),
    order: 10,
  },
  {
    id: "lesson_debug",
    title: "Debugging-Aufgaben",
    description: "Finde und korrigiere Fehler in SQL-Queries.",
    difficulty: "junior",
    category: "Debugging",
    exercises: debugExercises.map((e) => e.id),
    order: 11,
  },
  {
    id: "lesson_predict",
    title: "Ergebnis-Vorhersage",
    description: "Schaue dir eine Query an und sage das Ergebnis voraus.",
    difficulty: "beginner",
    category: "Ergebnis-Vorhersage",
    exercises: predictExercises.map((e) => e.id),
    order: 12,
  },
  {
    id: "lesson_schema",
    title: "Schema-Verstaendnis",
    description: "Lies Tabellenbeziehungen und waehle die richtigen Tabellen fuer eine Abfrage.",
    difficulty: "beginner",
    category: "Schema-Verstaendnis",
    exercises: schemaExercises.map((e) => e.id),
    order: 13,
  },
  {
    id: "lesson_interview",
    title: "Interview-Challenges",
    description: "Realistische Aufgaben im Stil von LeetCode und HackerRank.",
    difficulty: "intermediate",
    category: "Interview-Challenge",
    exercises: interviewExercises.map((e) => e.id),
    order: 14,
  },
  {
    id: "lesson_story",
    title: "SQL Agent",
    description: "Loese spannende Kriminalfaelle mit SQL! Finde Hinweise, verdaechtige Muster und klaere Faelle auf.",
    difficulty: "junior",
    category: "Story",
    exercises: [...storyExercises]
      .sort((a, b) =>
        ["beginner", "junior", "intermediate", "advanced", "interview"].indexOf(a.difficulty) -
        ["beginner", "junior", "intermediate", "advanced", "interview"].indexOf(b.difficulty)
      )
      .map((e) => e.id),
    order: 15,
  },
];

const lessonsRecord: Catalog["lessons"] = {};
for (const l of lessonsArray) {
  lessonsRecord[l.id] = l;
}

export const catalog: Catalog = {
  datasets: datasetsRecord,
  exercises: exercisesRecord,
  lessons: lessonsRecord,
};

export const allExerciseIds: string[] = allExercises.map((e) => e.id);

export const allLessonIds: string[] = lessonsArray.map((l) => l.id);