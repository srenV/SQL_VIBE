import type { Exercise } from "@/types/exercise";
import type { ProgressData } from "@/hooks/useProgress";

export const DIFFICULTY_ORDER = ["beginner", "junior", "intermediate", "advanced", "interview"] as const;

export const LOCK_HINT: Record<string, string> = {
  intermediate: "Schließe alle Grundlagen- & Einsteiger-Fälle ab",
  advanced:     "Schließe alle Fortgeschritten-Fälle ab",
  interview:    "Schließe alle Experten-Fälle ab",
};

export function getUnlockStatus(
  exercise: Exercise,
  allStory: Exercise[],
  progress: ProgressData
): "unlocked" | "locked" {
  const diff = exercise.difficulty;
  if (diff === "beginner" || diff === "junior") return "unlocked";
  if (progress.exercises[exercise.id]?.completed) return "unlocked";

  const isCompleted = (id: string) => progress.exercises[id]?.completed ?? false;

  if (diff === "intermediate") {
    const tier1 = allStory.filter(e => e.difficulty === "beginner" || e.difficulty === "junior");
    return tier1.every(e => isCompleted(e.id)) ? "unlocked" : "locked";
  }
  if (diff === "advanced") {
    const tier2 = allStory.filter(e => e.difficulty === "intermediate");
    return tier2.every(e => isCompleted(e.id)) ? "unlocked" : "locked";
  }
  if (diff === "interview") {
    const tier3 = allStory.filter(e => e.difficulty === "advanced");
    return tier3.every(e => isCompleted(e.id)) ? "unlocked" : "locked";
  }
  return "unlocked";
}
