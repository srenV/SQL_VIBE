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
      className="hidden sm:inline-flex flex-col items-start gap-0.5 rounded-xl p-1.5 hover:bg-surface-dim/70 transition-colors duration-150 group"
      aria-label={`Level ${info.level} ${info.title} — Zum Profil`}
    >
      {/* Row: ring + text that slides in on hover */}
      <div className="flex items-center">
        {/* Circular XP ring */}
        <div className="relative shrink-0 w-8 h-8">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
            <circle
              cx="16" cy="16" r="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="text-surface-dim dark:text-dark-dim"
            />
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
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink tabular-nums leading-none">
            {info.level}
          </span>
        </div>

        {/* Text — hidden by default, slides in on hover */}
        <div className="overflow-hidden max-w-0 opacity-0 group-hover:max-w-40 group-hover:opacity-100 transition-all duration-200 ease-out">
          <div className="pl-2 leading-tight whitespace-nowrap">
            <p className="text-[10px] text-ink-muted uppercase tracking-wide font-medium">Level {info.level}</p>
            <p className="text-xs font-semibold text-primary-600 dark:text-primary-400">
              {info.title}
            </p>
          </div>
        </div>
      </div>

      {/* Streak chip — below the ring */}
      {progress.streak > 1 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 text-xs font-bold text-orange-600 dark:text-orange-400">
          <svg
            className="w-3.5 h-3.5 animate-flame shrink-0"
            style={{ transformOrigin: "50% 80%" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.048 8.287 8.287 0 0 1 9 9.6a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 1 3 2.48z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.228 5.228 0 0 0-1.696-3.396 3.75 3.75 0 0 0-1.14 4.593A3.75 3.75 0 0 0 12 18z" />
          </svg>
          {progress.streak}
        </span>
      )}
    </Link>
  );
}
