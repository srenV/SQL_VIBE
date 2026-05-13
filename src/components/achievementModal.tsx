"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import type { AchievementDef } from "@/lib/levelSystem";
import { AchievementIcon } from "@/components/achievementIcon";

interface AchievementModalProps {
  achievement: AchievementDef | null;
  unlocked: boolean;
  onClose: () => void;
}

/** Overlay backdrop */
function Backdrop({ onClick }: { onClick: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      aria-hidden="true"
    />
  );
}

/** Achievement detail modal with spring animations. */
export function AchievementModal({ achievement, unlocked, onClose }: AchievementModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations("profil");

  // Focus close button on open
  useEffect(() => {
    if (achievement) {
      // Delay to let animation start
      const timer = setTimeout(() => closeRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
  }, [achievement]);

  // Close on Escape
  useEffect(() => {
    if (!achievement) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <AnimatePresence>
      {achievement && (
        <>
          <Backdrop onClick={onClose} />

          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.15 }}
          >
            <motion.div
              initial={shouldReduceMotion ? { opacity: 0 } : { scale: 0.85, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.9, y: 10, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 28,
                mass: 0.8,
              }}
              className={`relative w-full max-w-sm pointer-events-auto rounded-3xl overflow-hidden border shadow-2xl ${
                unlocked
                  ? "border-amber-400/30 bg-linear-to-b from-amber-50/95 to-yellow-50/90 dark:from-amber-950/80 dark:to-yellow-950/70"
                  : "border-surface-dim bg-surface dark:bg-dark-dim"
              }`}
              role="dialog"
              aria-modal="true"
              aria-label={achievement.name}
            >
              {/* Ambient glow for unlocked */}
              {unlocked && (
                <motion.div
                  className="absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(251,191,36,0.25)_0%,transparent_70%)] dark:bg-[radial-gradient(circle,rgba(251,191,36,0.15)_0%,transparent_70%)]"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, duration: 0.6 }}
                />
              )}

              {/* Close button */}
              <button
                ref={closeRef}
                onClick={onClose}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors"
                aria-label={t("close")}
              >
                <svg className="w-4 h-4 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="relative p-6 pt-8 pb-6 flex flex-col items-center text-center">
                {/* Icon with animated ring */}
                <motion.div
                  className="relative mb-4"
                  initial={shouldReduceMotion ? {} : { scale: 0.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25, delay: 0.1 }}
                >
                  {unlocked && (
                    <motion.div
                      className="absolute inset-0 -m-3 rounded-full border-2 border-amber-400/40"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                    />
                  )}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                    unlocked
                      ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                      : "text-ink-muted grayscale"
                  }`}>
                    <AchievementIcon icon={achievement.icon} className="w-9 h-9" />
                  </div>
                </motion.div>

                {/* Name */}
                <motion.h3
                  className={`text-lg font-bold mb-2 ${unlocked ? "text-ink" : "text-ink-muted"}`}
                  initial={shouldReduceMotion ? {} : { y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                >
                  {achievement.name}
                </motion.h3>

                {/* Description */}
                <motion.p
                  className={`text-sm leading-relaxed ${unlocked ? "text-ink-muted" : "text-ink-muted/50"}`}
                  initial={shouldReduceMotion ? {} : { y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.22, duration: 0.3 }}
                >
                  {achievement.description}
                </motion.p>

                {/* Status badge */}
                <motion.div
                  className="mt-4"
                  initial={shouldReduceMotion ? {} : { y: 6, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  {unlocked ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-success/10 text-success border border-success/20">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {t("achievementUnlocked")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-surface-dim/60 text-ink-muted border border-surface-dim dark:bg-dark-dim/60 dark:border-dark-dim">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z" />
                      </svg>
                      {t("achievementLocked")}
                    </span>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Hook to manage achievement modal state. */
export function useAchievementModal() {
  const [selected, setSelected] = useState<AchievementDef | null>(null);
  const [selectedUnlocked, setSelectedUnlocked] = useState(false);

  const open = useCallback((ach: AchievementDef, unlocked: boolean) => {
    setSelected(ach);
    setSelectedUnlocked(unlocked);
  }, []);

  const close = useCallback(() => {
    setSelected(null);
  }, []);

  return { selected, selectedUnlocked, open, close };
}