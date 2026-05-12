/**
 * DifficultyBadge – Reusable component for difficulty labels.
 *
 * Consolidates the difficultyLabels/DIFFICULTY_CONFIG previously duplicated across 6+ files.
 * Supports two display variants:
 *  - "badge" (default): Inline badge with background color
 *  - "story": Story-specific variant with separate text/color classes
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { getDifficultyConfig } from "@/lib/difficultyConfig";
export type { Difficulty } from "@/lib/difficultyConfig";

export interface DifficultyBadgeProps {
  /** Difficulty level: beginner | junior | intermediate | advanced | interview */
  difficulty: string;
  /** Display variant: "badge" (default) or "story" */
  variant?: "badge" | "story";
  /** Additional CSS classes */
  className?: string;
}

/**
 * DifficultyBadge – Displays a difficulty label as an inline badge.
 *
 * @example
 * <DifficultyBadge difficulty="beginner" />
 * <DifficultyBadge difficulty="junior" variant="story" />
 */
export function DifficultyBadge({ difficulty, variant = "badge", className }: DifficultyBadgeProps) {
  const t = useTranslations("difficulty");
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
      {t(config.labelKey)}
    </span>
  );
}