import type { Exercise } from "@/types/exercise";

import * as selectModule from "@/data/exercises/select";
import * as whereModule from "@/data/exercises/where";
import * as joinModule from "@/data/exercises/join";
import * as aggregationModule from "@/data/exercises/aggregation";
import * as orderLimitModule from "@/data/exercises/orderLimit";
import * as cteModule from "@/data/exercises/cte";
import * as windowFunctionsModule from "@/data/exercises/windowFunctions";
import * as subqueryModule from "@/data/exercises/subquery";
import * as debugModule from "@/data/exercises/debug";
import * as predictModule from "@/data/exercises/predict";
import * as schemaModule from "@/data/exercises/schema";
import * as interviewModule from "@/data/exercises/interview";
import * as dmlModule from "@/data/exercises/dml";
import * as ddlModule from "@/data/exercises/ddl";
import * as storyModule from "@/data/exercises/story";

type ExerciseModule = Record<string, unknown>;

export interface ExerciseLesson {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  exercises: Exercise[];
}

function isExerciseArray(value: unknown): value is Exercise[] {
  return (
    Array.isArray(value) &&
    value.every((item) => item && typeof item === "object" && "title" in item)
  );
}

function getFirstExerciseArray(moduleRecord: ExerciseModule): Exercise[] {
  for (const value of Object.values(moduleRecord)) {
    if (isExerciseArray(value)) {
      return value.map((exercise) => ({
        ...exercise,
        hints: Array.isArray(exercise.hints) ? exercise.hints.filter(Boolean) : [],
      }));
    }
  }
  return [];
}

const lessonSources = [
  {
    id: "select",
    slug: "select",
    title: "SELECT-GRUNDLAGEN",
    subtitle: "SELECTS",
    category: "SELECT",
    moduleRecord: selectModule,
  },
  {
    id: "where",
    slug: "where",
    title: "FILTERN",
    subtitle: "WHERE",
    category: "WHERE",
    moduleRecord: whereModule,
  },
  {
    id: "joins",
    slug: "joins",
    title: "TABELLEN VERBINDEN",
    subtitle: "JOINS",
    category: "JOIN",
    moduleRecord: joinModule,
  },
  {
    id: "aggregation",
    slug: "aggregation",
    title: "AGGREGATIONEN",
    subtitle: "GROUP BY, HAVING, COUNT",
    category: "Aggregation",
    moduleRecord: aggregationModule,
  },
  {
    id: "order-limit",
    slug: "order-limit",
    title: "SORTIEREN UND BEGRENZEN",
    subtitle: "ORDER BY / LIMIT",
    category: "ORDER BY / LIMIT",
    moduleRecord: orderLimitModule,
  },
  {
    id: "cte",
    slug: "cte",
    title: "COMMON TABLE EXPRESSIONS",
    subtitle: "CTE",
    category: "CTE",
    moduleRecord: cteModule,
  },
  {
    id: "window-functions",
    slug: "window-functions",
    title: "WINDOW FUNCTIONS",
    subtitle: "OVER, RANK, LAG",
    category: "Window Functions",
    moduleRecord: windowFunctionsModule,
  },
  {
    id: "subquery",
    slug: "subquery",
    title: "UNTERABFRAGEN",
    subtitle: "SUBQUERIES",
    category: "Subquery",
    moduleRecord: subqueryModule,
  },
  {
    id: "debug",
    slug: "debug",
    title: "SQL DEBUGGING",
    subtitle: "FEHLER FINDEN",
    category: "Debug",
    moduleRecord: debugModule,
  },
  {
    id: "predict",
    slug: "predict",
    title: "ERGEBNISSE VORHERSAGEN",
    subtitle: "PREDICT",
    category: "Predict",
    moduleRecord: predictModule,
  },
  {
    id: "schema",
    slug: "schema",
    title: "SCHEMA VERSTEHEN",
    subtitle: "TABELLEN & BEZIEHUNGEN",
    category: "Schema",
    moduleRecord: schemaModule,
  },
  {
    id: "interview",
    slug: "interview",
    title: "INTERVIEW-FRAGEN",
    subtitle: "SQL INTERVIEW",
    category: "Interview",
    moduleRecord: interviewModule,
  },
  {
    id: "dml",
    slug: "dml",
    title: "DATEN MANIPULIEREN",
    subtitle: "DML",
    category: "DML",
    moduleRecord: dmlModule,
  },
  {
    id: "ddl",
    slug: "ddl",
    title: "SCHEMA AENDERN",
    subtitle: "DDL",
    category: "DDL",
    moduleRecord: ddlModule,
  },
  {
    id: "story",
    slug: "story",
    title: "STORY-MODUS",
    subtitle: "MISSIONEN",
    category: "Story",
    moduleRecord: storyModule,
  },
] as const;

export const exerciseLessons: ExerciseLesson[] = lessonSources.map((lesson) => ({
  id: lesson.id,
  slug: lesson.slug,
  title: lesson.title,
  subtitle: lesson.subtitle,
  category: lesson.category,
  exercises: getFirstExerciseArray(lesson.moduleRecord),
}));

export const lessons = exerciseLessons;
export const lessonGroups = exerciseLessons;
export const exerciseGroups = exerciseLessons;

export const allExercises: Exercise[] = exerciseLessons.flatMap((lesson) =>
  lesson.exercises.map((exercise) => ({
    ...exercise,
    hints: Array.isArray(exercise.hints) ? exercise.hints.filter(Boolean) : [],
  }))
);

export const exercises = allExercises;

export const exercisesByLesson = Object.fromEntries(
  exerciseLessons.map((lesson) => [lesson.slug, lesson.exercises])
);

export function getAllExercises(): Exercise[] {
  return allExercises;
}

export function getExerciseById(id: string): Exercise | undefined {
  return allExercises.find((exercise) => exercise.id === id);
}

export function findExerciseById(id: string): Exercise | undefined {
  return getExerciseById(id);
}

export function getLessonBySlug(slug: string): ExerciseLesson | undefined {
  return exerciseLessons.find((lesson) => lesson.slug === slug);
}

export function getExercisesByLesson(slug: string): Exercise[] {
  return getLessonBySlug(slug)?.exercises ?? [];
}

export function getExercisesByCategory(category: string): Exercise[] {
  return allExercises.filter((exercise) => exercise.category === category);
}

export default exerciseLessons;
