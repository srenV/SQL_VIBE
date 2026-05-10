"use client";

import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { getLevel } from "@/lib/levelSystem";

export function LevelBadge() {
  const { progress } = useProgress();
  const info = getLevel(progress.totalPoints);

  const circumference = 2 * Math.PI * 14;
  const dashOffset = circumference * (1 - info.progress);

  return (
    <Link
      href="/profil"
      className="hidden sm:flex items-center gap-2 rounded-xl px-2.5 py-1.5 hover:bg-surface-dim/70 transition-colors duration-150 group"
      aria-label={`Level ${info.level} ${info.title} — Zum Profil`}
    >
      {/* Circular XP ring */}
      <div className="relative shrink-0 w-8 h-8">
        <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
          {/* Track */}
          <circle
            cx="16" cy="16" r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-surface-dim dark:text-dark-dim"
          />
          {/* Progress */}
          <circle
            cx="16" cy="16" r="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="text-primary-500 transition-all duration-700 ease-out"
          />
        </svg>
        {/* Level number */}
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink tabular-nums leading-none">
          {info.level}
        </span>
      </div>

      {/* Title */}
      <div className="text-right leading-tight">
        <p className="text-[10px] text-ink-muted uppercase tracking-wide font-medium">Level {info.level}</p>
        <p className="text-xs font-semibold text-ink group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
          {info.title}
        </p>
      </div>
    </Link>
  );
}
