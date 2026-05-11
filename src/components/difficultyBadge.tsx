/**
 * DifficultyBadge – Wiederverwendbare Komponente fuer Schwierigkeits-Labels.
 *
 * Konsolidiert die bisher in 6+ Dateien duplizierten difficultyLabels/DIFFICULTY_CONFIG.
 * Unterstuetzt zwei Darstellungsvarianten:
 *  - "badge" (Standard): Inline-Badge mit Hintergrundfarbe
 *  - "story": Story-spezifische Variante mit separaten Text-/Farb-Klassen
 */
import React from "react";
import { cn } from "@/lib/utils";

export type Difficulty = "beginner" | "junior" | "intermediate" | "advanced" | "interview";

/** Konfiguration fuer alle Schwierigkeitsgrade. */
export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    label: string;
    /** Badge-Variante: Hintergrund + Textfarbe als Tailwind-Klassen */
    className: string;
    /** Story-Variante: Separate Text- und Hintergrund-Klassen */
    storyColor: string;
  }
> = {
  beginner: {
    label: "Anfänger",
    className: "bg-success/10 text-success",
    storyColor: "text-success bg-success/10",
  },
  junior: {
    label: "Grundlagen",
    className: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300",
    storyColor: "text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-950",
  },
  intermediate: {
    label: "Fortgeschritten",
    className: "bg-warning/10 text-warning",
    storyColor: "text-warning bg-warning/10",
  },
  advanced: {
    label: "Experte",
    className: "bg-error/10 text-error",
    storyColor: "text-error bg-error/10",
  },
  interview: {
    label: "Interview",
    className: "bg-accent-100 text-accent-700",
    storyColor: "text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/40",
  },
};

/** Liefert die Konfiguration fuer einen Schwierigkeitsgrad (Fallback: beginner). */
export function getDifficultyConfig(difficulty: string) {
  return DIFFICULTY_CONFIG[difficulty as Difficulty] ?? DIFFICULTY_CONFIG.beginner;
}

export interface DifficultyBadgeProps {
  /** Schwierigkeitsgrad: beginner | junior | intermediate | advanced | interview */
  difficulty: string;
  /** Darstellungsvariante: "badge" (Standard) oder "story" */
  variant?: "badge" | "story";
  /** Zusaetzliche CSS-Klassen */
  className?: string;
}

/**
 * DifficultyBadge – Zeigt ein Schwierigkeits-Label als Inline-Badge an.
 *
 * @example
 * <DifficultyBadge difficulty="beginner" />
 * <DifficultyBadge difficulty="junior" variant="story" />
 */
export function DifficultyBadge({ difficulty, variant = "badge", className }: DifficultyBadgeProps) {
  const config = getDifficultyConfig(difficulty);

  const colorClass = variant === "story" ? config.storyColor : config.className;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        colorClass,
        className
      )}
    >
      {config.label}
    </span>
  );
}