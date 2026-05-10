"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useProgress } from "@/hooks/useProgress";
import { getLevel } from "@/lib/levelSystem";

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
        aria-label={`Level ${info.level} ${info.title} — Zum Profil`}
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

        {/* Streak — large filled flame with glow, sparks, and number inside */}
        {progress.streak > 1 && (
          <div className="relative shrink-0 w-8 h-8" style={{ overflow: "visible" }}>
            <div className="animate-flame-glow" style={{ transformOrigin: "50% 80%" }}>
              <svg
                className="w-8 h-8 text-orange-500 animate-flame"
                style={{ transformOrigin: "50% 80%" }}
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12.963 2.286a.75.75 0 0 0-1.071-.136 9.742 9.742 0 0 0-3.539 6.176 7.547 7.547 0 0 1-1.705-1.715.75.75 0 0 0-1.152-.082A9 9 0 1 0 15.68 4.534a7.46 7.46 0 0 1-2.717-2.248ZM15.75 14.25a3.75 3.75 0 1 1-7.313-1.172c.628.465 1.35.81 2.133 1a5.99 5.99 0 0 1 1.925-3.545 3.75 3.75 0 0 1 3.255 3.717Z" />
              </svg>
            </div>
            <span className="absolute w-1 h-1 rounded-full bg-amber-300 animate-spark-rise" style={{ left: "28%", top: "28%", animationDelay: "0s" }} />
            <span className="absolute w-0.5 h-0.5 rounded-full bg-orange-300 animate-spark-rise" style={{ left: "52%", top: "22%", animationDelay: "0.55s" }} />
            <span className="absolute w-1 h-1 rounded-full bg-yellow-300 animate-spark-rise" style={{ left: "63%", top: "34%", animationDelay: "1.1s" }} />
            <span className="absolute w-0.5 h-0.5 rounded-full bg-amber-200 animate-spark-rise" style={{ left: "38%", top: "32%", animationDelay: "1.55s" }} />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white tabular-nums leading-none" style={{ paddingTop: "3px" }}>
              {progress.streak}
            </span>
          </div>
        )}
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
