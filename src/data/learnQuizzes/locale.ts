/**
 * Locale-aware quiz resolver.
 * Returns the appropriate quiz data based on the current locale.
 */

import type { LearnQuiz } from "@/types/sandbox";
import { learnQuizzes } from "@/data/learnQuizzes";
import { learnQuizzesEn } from "@/data/learnQuizzesEn";

export function getLearnQuizzes(locale: string): LearnQuiz[] {
  if (locale === "en") {
    return learnQuizzesEn;
  }
  return learnQuizzes;
}