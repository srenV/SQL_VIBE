"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ACHIEVEMENTS, type AchievementDef } from "@/lib/levelSystem";
import { AchievementIcon } from "@/components/achievementIcon";

/* ─── Context ───────────────────────────────────────────────────────────── */

interface AchievementToastCtx {
  triggerAchievement: (id: string) => void;
}

const AchievementToastContext = createContext<AchievementToastCtx>({
  triggerAchievement: () => {},
});

export function useAchievementToast() {
  return useContext(AchievementToastContext);
}

/* ─── Provider ──────────────────────────────────────────────────────────── */

interface QueuedAchievement {
  uid: string;
  def: AchievementDef;
}

export function AchievementToastProvider({ children }: { children: React.ReactNode }) {
  const t = useTranslations("achievements");
  const [visible, setVisible] = useState<QueuedAchievement[]>([]);
  const queueRef = useRef<QueuedAchievement[]>([]);
  const uidCounter = useRef(0);

  const flush = useCallback(() => {
    setVisible((prev) => {
      if (prev.length >= 3 || queueRef.current.length === 0) return prev;
      const next = queueRef.current.shift()!;
      return [...prev, next];
    });
  }, []);

  const triggerAchievement = useCallback(
    (id: string) => {
      const def = ACHIEVEMENTS.find((a) => a.id === id);
      if (!def) return;
      const uid = `${id}-${++uidCounter.current}`;
      const item: QueuedAchievement = { uid, def };
      setVisible((prev) => {
        if (prev.length < 3) return [...prev, item];
        queueRef.current.push(item);
        return prev;
      });
    },
    []
  );

  const dismiss = useCallback(
    (uid: string) => {
      setVisible((prev) => prev.filter((t) => t.uid !== uid));
      setTimeout(flush, 50);
    },
    [flush]
  );

  return (
    <AchievementToastContext.Provider value={{ triggerAchievement }}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-200 flex flex-col-reverse gap-3 pointer-events-none"
        aria-live="polite"
        aria-label={t("achievementsAria")}
      >
        <AnimatePresence>
          {visible.map((item) => (
            <AchievementToastItem
              key={item.uid}
              item={item}
              onDismiss={() => dismiss(item.uid)}
            />
          ))}
        </AnimatePresence>
      </div>
    </AchievementToastContext.Provider>
  );
}

/* ─── Single Toast ──────────────────────────────────────────────────────── */

const PARTICLE_COLORS = [
  "#fbbf24", "#f59e0b", "#fcd34d",
  "#34d399", "#6366f1", "#f472b6",
  "#fb923c", "#a78bfa", "#38bdf8",
  "#4ade80", "#facc15", "#e879f9",
];

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

function AchievementToastItem({
  item,
  onDismiss,
}: {
  item: QueuedAchievement;
  onDismiss: () => void;
}) {
  const t = useTranslations("achievements");
  const prefersReduced = useReducedMotion();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(onDismiss, 4200);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [onDismiss]);

  const particles = useMemo<Particle[]>(() =>
    Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
      const dist = 28 + Math.random() * 18;
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        size: 4 + Math.random() * 5,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        duration: 0.45 + Math.random() * 0.25,
        delay: Math.random() * 0.08,
      };
    }),
  []);

  const toastVariants = {
    hidden: prefersReduced
      ? { opacity: 0 }
      : { opacity: 0, x: 60, scale: 0.82, filter: "blur(8px)" },
    visible: prefersReduced
      ? { opacity: 1 }
      : {
          opacity: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        },
    exit: prefersReduced
      ? { opacity: 0 }
      : {
          opacity: 0,
          x: 80,
          scale: 0.88,
          filter: "blur(4px)",
          transition: { duration: 0.28, ease: [0.55, 0, 1, 0.45] },
        },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -15 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { delay: 0.15, type: "spring", stiffness: 380, damping: 18 },
    },
  };

  return (
    <motion.div
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="pointer-events-auto w-[320px] select-none"
      role="alert"
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-ink/92 dark:bg-[#080c18]/94 backdrop-blur-xl shadow-2xl"
        style={{ boxShadow: "0 0 0 1px rgba(251,191,36,0.15), 0 8px 40px rgba(251,191,36,0.18), 0 2px 8px rgba(0,0,0,0.45)" }}
      >
        {/* Ambient golden gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-amber-500/8 via-transparent to-violet-500/8 pointer-events-none" />

        {/* Countdown bar */}
        <motion.div
          className="absolute top-0 left-0 h-0.5 bg-linear-to-r from-amber-400 to-yellow-300"
          initial={{ scaleX: 1, originX: 0 }}
          animate={{ scaleX: 0 }}
          transition={{ duration: 4, ease: "linear", delay: 0.2 }}
          style={{ width: "100%", transformOrigin: "left" }}
        />

        <div className="relative flex items-center gap-4 p-4">
          {/* Icon with glow + particles */}
          <div className="relative shrink-0 flex items-center justify-center w-14 h-14">
            {/* Glow rings */}
            {!prefersReduced && (
              <>
                <motion.div
                  className="absolute inset-0 rounded-full"
                  animate={{ scale: [1, 1.35, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: "radial-gradient(circle, rgba(251,191,36,0.45) 0%, transparent 70%)" }}
                />
                <motion.div
                  className="absolute -inset-1 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  style={{ background: "radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 65%)" }}
                />
              </>
            )}

            {/* Particles burst */}
            {!prefersReduced && particles.map((p, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full"
                initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                animate={{ x: p.x, y: p.y, opacity: 0, scale: 0 }}
                transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
                style={{
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  top: "50%",
                  left: "50%",
                  marginTop: -p.size / 2,
                  marginLeft: -p.size / 2,
                }}
              />
            ))}

            {/* Icon circle */}
            <motion.div
              variants={iconVariants}
              className="relative z-10 flex items-center justify-center w-14 h-14 rounded-full text-2xl"
              style={{
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)",
                boxShadow: "0 0 16px rgba(251,191,36,0.6), inset 0 1px 0 rgba(255,255,255,0.3)",
              }}
            >
              <AchievementIcon icon={item.def.icon} className="w-7 h-7 text-amber-900" />
            </motion.div>
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <motion.p
              className="text-[10px] font-semibold uppercase tracking-widest text-amber-400 mb-0.5"
              initial={prefersReduced ? {} : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.3 }}
            >
              {t("achievementUnlocked")}
            </motion.p>
            <motion.p
              className="text-base font-bold text-white leading-tight"
              initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.35 }}
            >
              {item.def.name}
            </motion.p>
            <motion.p
              className="text-xs text-slate-400 mt-0.5 leading-snug"
              initial={prefersReduced ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.37, duration: 0.35 }}
            >
              {item.def.description}
            </motion.p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={onDismiss}
            className="shrink-0 self-start mt-0.5 p-1 rounded-md text-slate-500 hover:text-slate-300 transition-colors"
            aria-label={t("close")}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
