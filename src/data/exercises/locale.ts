/**
 * Locale-aware exercise resolution.
 *
 * Returns the appropriate exercise arrays for a given locale.
 * Falls back to German ("de") if no locale-specific exercises exist.
 */

import type { Exercise } from "@/types/exercise";

// German exercises (default)
import { selectExercises } from "./select";
import { whereExercises } from "./where";
import { orderLimitExercises } from "./orderLimit";
import { aggregationExercises } from "./aggregation";
import { joinExercises } from "./join";
import { subqueryExercises } from "./subquery";
import { debugExercises } from "./debug";
import { predictExercises } from "./predict";
import { schemaExercises } from "./schema";
import { interviewExercises } from "./interview";
import { cteExercises } from "./cte";
import { windowFunctionExercises } from "./windowFunctions";
import { dmlExercises } from "./dml";
import { ddlExercises } from "./ddl";
import { storyExercises } from "./story";

// English exercises
import { selectExercisesEn } from "./en/select";
import { whereExercisesEn } from "./en/where";
import { orderLimitExercisesEn } from "./en/orderLimit";
import { aggregationExercisesEn } from "./en/aggregation";
import { joinExercisesEn } from "./en/join";
import { subqueryExercisesEn } from "./en/subquery";
import { debugExercisesEn } from "./en/debug";
import { predictExercisesEn } from "./en/predict";
import { schemaExercisesEn } from "./en/schema";
import { interviewExercisesEn } from "./en/interview";
import { cteExercisesEn } from "./en/cte";
import { windowFunctionExercisesEn } from "./en/windowFunctions";
import { dmlExercisesEn } from "./en/dml";
import { ddlExercisesEn } from "./en/ddl";
import { storyExercisesEn } from "./en/story";

/** All German exercise arrays. */
const deExerciseArrays = {
  select: selectExercises,
  where: whereExercises,
  orderLimit: orderLimitExercises,
  aggregation: aggregationExercises,
  join: joinExercises,
  subquery: subqueryExercises,
  debug: debugExercises,
  predict: predictExercises,
  schema: schemaExercises,
  interview: interviewExercises,
  cte: cteExercises,
  windowFunctions: windowFunctionExercises,
  dml: dmlExercises,
  ddl: ddlExercises,
  story: storyExercises,
};

/** All English exercise arrays. */
const enExerciseArrays = {
  select: selectExercisesEn,
  where: whereExercisesEn,
  orderLimit: orderLimitExercisesEn,
  aggregation: aggregationExercisesEn,
  join: joinExercisesEn,
  subquery: subqueryExercisesEn,
  debug: debugExercisesEn,
  predict: predictExercisesEn,
  schema: schemaExercisesEn,
  interview: interviewExercisesEn,
  cte: cteExercisesEn,
  windowFunctions: windowFunctionExercisesEn,
  dml: dmlExercisesEn,
  ddl: ddlExercisesEn,
  story: storyExercisesEn,
};

type ExerciseArrayKey = keyof typeof deExerciseArrays;

const localeExerciseArrays: Record<string, typeof deExerciseArrays> = {
  de: deExerciseArrays,
  en: enExerciseArrays,
};

/**
 * Get all exercise arrays for a specific locale.
 * Falls back to German if no locale-specific exercises exist.
 */
export function getExerciseArrays(locale: string): typeof deExerciseArrays {
  return localeExerciseArrays[locale] ?? localeExerciseArrays.de;
}

/**
 * Get a specific exercise array by key for a locale.
 */
export function getExerciseArray(locale: string, key: ExerciseArrayKey): Exercise[] {
  const arrays = getExerciseArrays(locale);
  return arrays[key];
}

/**
 * Get all exercises flattened for a locale.
 */
export function getAllExercises(locale: string): Exercise[] {
  const arrays = getExerciseArrays(locale);
  return [
    ...arrays.select,
    ...arrays.where,
    ...arrays.orderLimit,
    ...arrays.aggregation,
    ...arrays.join,
    ...arrays.subquery,
    ...arrays.debug,
    ...arrays.predict,
    ...arrays.schema,
    ...arrays.interview,
    ...arrays.cte,
    ...arrays.windowFunctions,
    ...arrays.dml,
    ...arrays.ddl,
    ...arrays.story,
  ];
}
