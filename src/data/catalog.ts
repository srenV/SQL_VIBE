/**
 * Central catalog for lessons, exercises, and datasets.
 *
 * Builds the learning structure of the SQL Trainer MySQL learning platform:
 * Assigns exercises and datasets to the respective lessons
 * and exports the complete catalog structure.
 * Now locale-aware — returns English or German content based on locale.
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
  storyAnna7Dataset,
  storyNexusMarktDataset,
  storyHelpCoreDataset,
  storyNeuronaleLueckeDataset,
  storySystemfehlerDeltaDataset,
  storyRoteZoneDataset,
  storyGhostProtocolDataset,
  storyGeldstromOmegaDataset,
} from "@/data/datasets";
import { getAllExercises } from "@/data/exercises/locale";
import type { Catalog, Lesson } from "@/types/exercise";

// ─── Lesson definitions (locale-aware) ───

const lessonDefs = [
  {
    id: "lesson_select",
    title: { de: "SELECT Grundlagen", en: "SELECT Basics" },
    description: {
      de: "Lerne, Daten aus Tabellen abzufragen: alle Spalten, einzelne Spalten, Aliase und DISTINCT.",
      en: "Learn to query data from tables: all columns, individual columns, aliases, and DISTINCT.",
    },
    difficulty: "beginner" as const,
    category: "SELECT",
    exerciseKey: "select" as const,
    order: 1,
  },
  {
    id: "lesson_where",
    title: { de: "Filterlogik mit WHERE", en: "Filter Logic with WHERE" },
    description: {
      de: "Verfeinere deine Abfragen mit WHERE, AND, OR, BETWEEN, IN, LIKE und IS NULL.",
      en: "Refine your queries with WHERE, AND, OR, BETWEEN, IN, LIKE, and IS NULL.",
    },
    difficulty: "beginner" as const,
    category: "WHERE",
    exerciseKey: "where" as const,
    order: 2,
  },
  {
    id: "lesson_order",
    title: { de: "Sortieren und Begrenzen", en: "Sorting and Limiting" },
    description: {
      de: "Ordne Ergebnisse mit ORDER BY und begrenze sie mit LIMIT.",
      en: "Sort results with ORDER BY and limit them with LIMIT.",
    },
    difficulty: "beginner" as const,
    category: "ORDER BY / LIMIT",
    exerciseKey: "orderLimit" as const,
    order: 3,
  },
  {
    id: "lesson_aggregation",
    title: { de: "Aggregationen", en: "Aggregations" },
    description: {
      de: "Berechne Summen, Durchschnitte, Minima, Maxima und gruppiere mit GROUP BY und HAVING.",
      en: "Calculate sums, averages, minima, maxima and group with GROUP BY and HAVING.",
    },
    difficulty: "junior" as const,
    category: "Aggregation",
    exerciseKey: "aggregation" as const,
    order: 4,
  },
  {
    id: "lesson_join",
    title: { de: "Tabellen verbinden (JOINs)", en: "Joining Tables (JOINs)" },
    description: {
      de: "Verbinde Tabellen mit INNER JOIN, LEFT JOIN, RIGHT JOIN und Self Join.",
      en: "Join tables with INNER JOIN, LEFT JOIN, RIGHT JOIN, and Self Join.",
    },
    difficulty: "junior" as const,
    category: "JOIN",
    exerciseKey: "join" as const,
    order: 5,
  },
  {
    id: "lesson_subquery",
    title: { de: "Subqueries", en: "Subqueries" },
    description: {
      de: "Nutze Unterabfragen in WHERE, FROM, SELECT und mit EXISTS.",
      en: "Use subqueries in WHERE, FROM, SELECT, and with EXISTS.",
    },
    difficulty: "intermediate" as const,
    category: "Subquery",
    exerciseKey: "subquery" as const,
    order: 6,
  },
  {
    id: "lesson_cte",
    title: { de: "Common Table Expressions (CTEs)", en: "Common Table Expressions (CTEs)" },
    description: {
      de: "Strukturiere komplexe Abfragen mit WITH und CTEs fuer bessere Lesbarkeit.",
      en: "Structure complex queries with WITH and CTEs for better readability.",
    },
    difficulty: "intermediate" as const,
    category: "CTE",
    exerciseKey: "cte" as const,
    order: 7,
  },
  {
    id: "lesson_window",
    title: { de: "Window Functions", en: "Window Functions" },
    description: {
      de: "Berechne laufende Summen, Rangfolgen und Analysefunktionen mit OVER, ROW_NUMBER, RANK und LAG.",
      en: "Calculate running totals, rankings, and analytics functions with OVER, ROW_NUMBER, RANK, and LAG.",
    },
    difficulty: "intermediate" as const,
    category: "Window Functions",
    exerciseKey: "windowFunctions" as const,
    order: 8,
  },
  {
    id: "lesson_dml",
    title: { de: "Daten aendern (DML)", en: "Modifying Data (DML)" },
    description: {
      de: "Aendere Daten mit INSERT, UPDATE und DELETE.",
      en: "Modify data with INSERT, UPDATE, and DELETE.",
    },
    difficulty: "junior" as const,
    category: "DML",
    exerciseKey: "dml" as const,
    order: 9,
  },
  {
    id: "lesson_ddl",
    title: { de: "Schema und Tabellen (DDL)", en: "Schema and Tables (DDL)" },
    description: {
      de: "Erstelle und aendere Tabellenstrukturen mit CREATE TABLE, ALTER TABLE und Constraints.",
      en: "Create and modify table structures with CREATE TABLE, ALTER TABLE, and constraints.",
    },
    difficulty: "junior" as const,
    category: "DDL",
    exerciseKey: "ddl" as const,
    order: 10,
  },
  {
    id: "lesson_debug",
    title: { de: "Debugging-Aufgaben", en: "Debugging Tasks" },
    description: {
      de: "Finde und korrigiere Fehler in SQL-Queries.",
      en: "Find and fix errors in SQL queries.",
    },
    difficulty: "junior" as const,
    category: "Debugging",
    exerciseKey: "debug" as const,
    order: 11,
  },
  {
    id: "lesson_predict",
    title: { de: "Ergebnis-Vorhersage", en: "Result Prediction" },
    description: {
      de: "Schaue dir eine Query an und sage das Ergebnis voraus.",
      en: "Look at a query and predict the result.",
    },
    difficulty: "beginner" as const,
    category: "Result Prediction",
    exerciseKey: "predict" as const,
    order: 12,
  },
  {
    id: "lesson_schema",
    title: { de: "Schema-Verstaendnis", en: "Schema Understanding" },
    description: {
      de: "Lies Tabellenbeziehungen und waehle die richtigen Tabellen fuer eine Abfrage.",
      en: "Read table relationships and choose the right tables for a query.",
    },
    difficulty: "beginner" as const,
    category: "Schema Understanding",
    exerciseKey: "schema" as const,
    order: 13,
  },
  {
    id: "lesson_interview",
    title: { de: "Interview-Challenges", en: "Interview Challenges" },
    description: {
      de: "Realistische Aufgaben im Stil von LeetCode und HackerRank.",
      en: "Realistic tasks in the style of LeetCode and HackerRank.",
    },
    difficulty: "intermediate" as const,
    category: "Interview Challenge",
    exerciseKey: "interview" as const,
    order: 14,
  },
  {
    id: "lesson_story",
    title: { de: "SQL Agent", en: "SQL Agent" },
    description: {
      de: "Loese spannende Kriminalfaelle mit SQL! Finde Hinweise, verdaechtige Muster und klaere Faelle auf.",
      en: "Solve exciting crime cases with SQL! Find clues, suspicious patterns, and crack cases.",
    },
    difficulty: "junior" as const,
    category: "Story",
    exerciseKey: "story" as const,
    order: 15,
  },
] as const;

// ─── Dataset record (same for all locales — resolved via datasets/locale.ts) ───

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
  [storyAnna7Dataset.id]: storyAnna7Dataset,
  [storyNexusMarktDataset.id]: storyNexusMarktDataset,
  [storyHelpCoreDataset.id]: storyHelpCoreDataset,
  [storyNeuronaleLueckeDataset.id]: storyNeuronaleLueckeDataset,
  [storySystemfehlerDeltaDataset.id]: storySystemfehlerDeltaDataset,
  [storyRoteZoneDataset.id]: storyRoteZoneDataset,
  [storyGhostProtocolDataset.id]: storyGhostProtocolDataset,
  [storyGeldstromOmegaDataset.id]: storyGeldstromOmegaDataset,
};

// ─── Catalog builder ───

/**
 * Build a locale-aware catalog.
 * Returns exercises and lessons in the requested language.
 */
export function getCatalog(locale: string): Catalog {
  const allExercises = getAllExercises(locale);

  const exercisesRecord: Catalog["exercises"] = {};
  for (const ex of allExercises) {
    exercisesRecord[ex.id] = ex;
  }

  const lessonsArray: Lesson[] = lessonDefs.map((def) => {
    // Find exercises for this lesson by matching the exerciseKey
    const key = def.exerciseKey;
    const lessonExercises = allExercises.filter((ex) => {
      // Match by category prefix
      const categoryMap: Record<string, string> = {
        select: "SELECT",
        where: "WHERE",
        orderLimit: "ORDER BY / LIMIT",
        aggregation: "Aggregation",
        join: "JOIN",
        subquery: "Subquery",
        cte: "CTE",
        windowFunctions: "Window Functions",
        dml: "DML",
        ddl: "DDL",
        debug: "Debugging",
        predict: "Result Prediction",
        schema: "Schema Understanding",
        interview: "Interview Challenge",
        story: "Story",
      };
      return ex.category === categoryMap[key];
    });

    // For story, sort by difficulty
    const exerciseIds = key === "story"
      ? [...lessonExercises]
          .sort((a, b) =>
            ["beginner", "junior", "intermediate", "advanced", "interview"].indexOf(a.difficulty) -
            ["beginner", "junior", "intermediate", "advanced", "interview"].indexOf(b.difficulty)
          )
          .map((e) => e.id)
      : lessonExercises.map((e) => e.id);

    return {
      id: def.id,
      title: def.title[locale as "de" | "en"] ?? def.title.de,
      description: def.description[locale as "de" | "en"] ?? def.description.de,
      difficulty: def.difficulty,
      category: def.category,
      exercises: exerciseIds,
      order: def.order,
    };
  });

  const lessonsRecord: Catalog["lessons"] = {};
  for (const l of lessonsArray) {
    lessonsRecord[l.id] = l;
  }

  return {
    datasets: datasetsRecord,
    exercises: exercisesRecord,
    lessons: lessonsRecord,
  };
}

// ─── Default catalog (German) for backward compatibility ───

export const catalog: Catalog = getCatalog("de");

export const allExerciseIds: string[] = Object.keys(catalog.exercises);

export const allLessonIds: string[] = Object.keys(catalog.lessons);