"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";
import { getLevel } from "@/lib/levelSystem";
import { StreakFlame } from "@/components/streakFlame";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
  exit:   { transition: { staggerChildren: 0.025, staggerDirection: -1 as const } },
};

const letterVariants = {
  hidden:  { opacity: 0, y: 6, filter: "blur(5px)", scale: 0.8 },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1,
    transition: { type: "spring" as const, stiffness: 480, damping: 20 } },
  exit:    { opacity: 0, y: -4, filter: "blur(3px)", scale: 0.9,
    transition: { duration: 0.1, ease: "easeIn" } },
};

export function LevelBadge() {
  const t = useTranslations("common");
  const { progress } = useProgress();
  const info = getLevel(progress.totalPoints);
  const [hovered, setHovered] = React.useState(false);

  const circumference = 2 * Math.PI * 14;
  const dashOffset = circumference * (1 - info.progress);

  return (
    <div
      className="hidden sm:block relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href="/profil"
        className="inline-flex items-center gap-1.5 rounded-xl p-1.5 hover:bg-surface-dim/70 transition-colors duration-150"
        aria-label={t("levelBadgeAria", { level: info.level, title: info.title })}
      >
        {/* Circular XP ring */}
        <div className="relative shrink-0 w-8 h-8">
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-surface-dim dark:text-dark-dim" />
            <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} className="text-primary-500 transition-all duration-700 ease-out" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-ink tabular-nums leading-none">
            {info.level}
          </span>
        </div>

        {/* Streak flame */}
        <StreakFlame streak={progress.streak} />
      </Link>

      {/* Title label — staggered character reveal below the badge on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute left-0 right-0 flex justify-center pointer-events-none z-50"
            style={{ top: "calc(100% + 4px)" }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="inline-flex px-2.5 py-1 rounded-full bg-surface/95 dark:bg-primary-950/95 backdrop-blur-sm border border-primary-200/50 dark:border-primary-700/40 shadow-sm shadow-primary-500/10">
              {info.title.split("").map((char, i) => (
                <motion.span
                  key={i}
                  variants={letterVariants}
                  className="text-[11px] font-semibold text-primary-600 dark:text-primary-400 leading-none"
                  style={{ display: "inline-block", minWidth: char === " " ? "0.3em" : undefined }}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
