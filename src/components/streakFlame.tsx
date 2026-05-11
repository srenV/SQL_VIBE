"use client";

/**
 * StreakFlame – Animated flame badge showing the current streak count.
 *
 * Displays a filled flame SVG with glow, spark particles, and the streak
 * number overlaid. The number uses dark text in light mode and white in
 * dark mode for proper contrast against the orange flame.
 *
 * Sizes:
 *   - "sm": inline badge (mobile menu, profile stats)
 *   - "md": default (header LevelBadge)
 */

import React from "react";

interface StreakFlameProps {
  /** Current streak count. Only rendered when > 1. */
  streak: number;
  /** Visual size variant. */
  size?: "sm" | "md";
}

const SIZE_MAP = {
  sm: {
    container: "w-4 h-4",
    text: "text-[7px]",
    sparkFull: "w-0.5 h-0.5",
    sparkHalf: "w-px h-px",
    pt: "1px",
  },
  md: {
    container: "w-8 h-8",
    text: "text-[10px]",
    sparkFull: "w-1 h-1",
    sparkHalf: "w-0.5 h-0.5",
    pt: "3px",
  },
} as const;

export function StreakFlame({ streak, size = "md" }: StreakFlameProps) {
  if (streak <= 1) return null;

  const s = SIZE_MAP[size];

  if (size === "sm") {
    // Compact inline variant — no animation, just icon + number
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-400">
        <svg
          className="w-3.5 h-3.5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.545 3.75 3.75 0 0 1 3.255 3.717Z" />
        </svg>
        {streak}
      </span>
    );
  }

  // Full animated variant — flame with glow, sparks, and number
  return (
    <div className={`relative shrink-0 ${s.container}`} style={{ overflow: "visible" }}>
      <div className="animate-flame-glow" style={{ transformOrigin: "50% 80%" }}>
        <svg
          className={`${s.container} text-orange-500 animate-flame`}
          style={{ transformOrigin: "50% 80%" }}
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.545 3.75 3.75 0 0 1 3.255 3.717Z" />
        </svg>
      </div>
      <span className={`absolute ${s.sparkFull} rounded-full bg-amber-300 animate-spark-rise`} style={{ left: "28%", top: "28%", animationDelay: "0s" }} />
      <span className={`absolute ${s.sparkHalf} rounded-full bg-orange-300 animate-spark-rise`} style={{ left: "52%", top: "22%", animationDelay: "0.55s" }} />
      <span className={`absolute ${s.sparkFull} rounded-full bg-yellow-300 animate-spark-rise`} style={{ left: "63%", top: "34%", animationDelay: "1.1s" }} />
      <span className={`absolute ${s.sparkHalf} rounded-full bg-amber-200 animate-spark-rise`} style={{ left: "38%", top: "32%", animationDelay: "1.55s" }} />
      <span
        className={`absolute inset-0 flex items-center justify-center ${s.text} font-bold text-ink dark:text-white tabular-nums leading-none`}
        style={{ paddingTop: s.pt }}
      >
        {streak}
      </span>
    </div>
  );
}