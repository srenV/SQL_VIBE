/**
 * Difficulty configuration — shared between server and client components.
 *
 * Labels are translation keys resolved at render time via useTranslations("difficulty").
 */

export type Difficulty = "beginner" | "junior" | "intermediate" | "advanced" | "interview";

/** Configuration for all difficulty levels. Labels are translation keys. */
export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    labelKey: string;
    /** Badge variant: background + text color as Tailwind classes */
    className: string;
    /** Story variant: separate text and background classes */
    storyColor: string;
  }
> = {
  beginner: {
    labelKey: "beginner",
    className: "bg-success/10 text-success",
    storyColor: "text-success bg-success/10",
  },
  junior: {
    labelKey: "junior",
    className: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
    storyColor: "text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-950",
  },
  intermediate: {
    labelKey: "intermediate",
    className: "bg-warning/10 text-warning",
    storyColor: "text-warning bg-warning/10",
  },
  advanced: {
    labelKey: "advanced",
    className: "bg-error/10 text-error",
    storyColor: "text-error bg-error/10",
  },
  interview: {
    labelKey: "interview",
    className: "bg-accent-100 text-accent-700",
    storyColor: "text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/40",
  },
};

/** Returns the configuration for a difficulty level (fallback: beginner). */
export function getDifficultyConfig(difficulty: string) {
  return DIFFICULTY_CONFIG[difficulty as Difficulty] ?? DIFFICULTY_CONFIG.beginner;
}