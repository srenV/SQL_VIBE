"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/animations";
import { useProgress } from "@/hooks/useProgress";
import { ACHIEVEMENTS, LEVELS, getLevel } from "@/lib/levelSystem";

interface LessonMeta {
  id: string;
  title: string;
  exerciseIds: string[];
}

interface ProfilClientProps {
  lessons: LessonMeta[];
  storyTotal: number;
}

export function ProfilClient({ lessons, storyTotal }: ProfilClientProps) {
  const { progress } = useProgress();
  const info = getLevel(progress.totalPoints);

  const totalSolved = Object.values(progress.exercises).filter((e) => e.completed).length;
  const lessonsComplete = lessons.filter((l) =>
    l.exerciseIds.length > 0 && l.exerciseIds.every((id) => progress.exercises[id]?.completed)
  ).length;

  const circumference = 2 * Math.PI * 52;
  const dashOffset = circumference * (1 - info.progress);

  const xpToNext = info.xpNext != null ? info.xpNext - info.xp : 0;
  const xpInLevel = info.xp - info.xpRequired;
  const xpForLevel = info.xpNext != null ? info.xpNext - info.xpRequired : 1;

  return (
    <main className="flex-1 py-10">
      <Container className="space-y-10 max-w-3xl">

        {/* ── Level card ── */}
        <FadeIn delay={0}>
          <div
            className="relative overflow-hidden rounded-3xl p-8 text-white"
            style={{
              background: "linear-gradient(135deg, #4338ca 0%, #6366f1 45%, #8b5cf6 80%, #a78bfa 100%)",
              boxShadow: "0 20px 60px rgba(99,102,241,0.35), 0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            {/* Ambient orbs */}
            <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-violet-300/10 blur-2xl pointer-events-none" />

            <div className="relative flex items-center gap-8">
              {/* Circular progress ring */}
              <div className="relative shrink-0 w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120" aria-hidden="true">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                  <motion.circle
                    cx="60" cy="60" r="52"
                    fill="none"
                    stroke="white"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashOffset }}
                    transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.span
                    className="text-4xl font-black leading-none"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.2 }}
                  >
                    {info.level}
                  </motion.span>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/70 mt-0.5">
                    Level
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">
                  Aktueller Rang
                </p>
                <h1 className="text-3xl font-black tracking-tight leading-none mb-4">
                  {info.title}
                </h1>

                {/* XP bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs text-white/70">
                    <span>{xpInLevel} XP</span>
                    <span>{xpForLevel} XP</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${info.progress * 100}%` }}
                      transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1], delay: 0.4 }}
                    />
                  </div>
                  {info.xpNext != null ? (
                    <p className="text-xs text-white/60">
                      Noch <strong className="text-white">{xpToNext} XP</strong> bis Level {info.level + 1}
                    </p>
                  ) : (
                    <p className="text-xs text-white/60 font-semibold">Maximales Level erreicht 🏆</p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="relative mt-6 pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-center">
              <StatItem label="Aufgaben gelöst" value={totalSolved} />
              <StatItem label="Gesamte XP" value={progress.totalPoints} />
              <StatItem
                label={progress.streak > 1 ? "Tage-Streak 🔥" : "Aktiv heute"}
                value={progress.streak}
              />
            </div>
          </div>
        </FadeIn>

        {/* ── Achievements ── */}
        <FadeIn delay={0.1}>
          <section aria-labelledby="achievements-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="achievements-heading" className="text-lg font-bold text-ink">
                Erfolge
              </h2>
              <span className="text-sm text-ink-muted">
                {progress.achievements.length} / {ACHIEVEMENTS.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {ACHIEVEMENTS.map((ach, i) => {
                const unlocked = progress.achievements.includes(ach.id);
                return (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.12 + i * 0.03, duration: 0.3, ease: "easeOut" }}
                  >
                    <div
                      className={`relative rounded-2xl p-3 text-center border transition-all duration-200 ${
                        unlocked
                          ? "border-amber-400/30 bg-gradient-to-b from-amber-50/80 to-yellow-50/40 dark:from-amber-900/20 dark:to-yellow-900/10"
                          : "border-surface-dim bg-surface-dim/40 dark:border-dark-dim dark:bg-dark-dim/30 opacity-50"
                      }`}
                    >
                      {unlocked && (
                        <div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          style={{ boxShadow: "0 0 16px rgba(251,191,36,0.15)" }}
                        />
                      )}
                      <div
                        className={`text-2xl mb-1.5 ${unlocked ? "" : "grayscale"}`}
                        aria-hidden="true"
                      >
                        {ach.icon}
                      </div>
                      <p className={`text-[11px] font-semibold leading-tight ${unlocked ? "text-ink" : "text-ink-muted"}`}>
                        {ach.name}
                      </p>
                      {unlocked && (
                        <p className="text-[10px] text-ink-muted mt-0.5 leading-tight line-clamp-2">
                          {ach.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </FadeIn>

        {/* ── Lektionen Fortschritt ── */}
        <FadeIn delay={0.2}>
          <section aria-labelledby="lessons-heading">
            <div className="flex items-center justify-between mb-4">
              <h2 id="lessons-heading" className="text-lg font-bold text-ink">
                Lektionsfortschritt
              </h2>
              <span className="text-sm text-ink-muted">
                {lessonsComplete} / {lessons.length} abgeschlossen
              </span>
            </div>

            <div className="space-y-2">
              {lessons.map((lesson) => {
                const done = lesson.exerciseIds.filter(
                  (id) => progress.exercises[id]?.completed
                ).length;
                const pct = lesson.exerciseIds.length > 0
                  ? Math.round((done / lesson.exerciseIds.length) * 100)
                  : 0;
                const complete = pct === 100;

                return (
                  <Link
                    key={lesson.id}
                    href={`/lektionen/${lesson.id}`}
                    className="group flex items-center gap-4 rounded-xl px-4 py-3 border border-surface-dim hover:border-primary-200 bg-surface hover:bg-primary-50/50 dark:bg-surface-dim/20 dark:hover:bg-primary-900/10 transition-all duration-150"
                  >
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        complete
                          ? "bg-success/15 text-success"
                          : "bg-surface-dim dark:bg-dark-dim text-ink-muted"
                      }`}
                    >
                      {complete ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        `${pct}%`
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                        {lesson.title}
                      </p>
                      <div className="mt-1.5 h-1.5 rounded-full bg-surface-dim dark:bg-dark-dim overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full ${complete ? "bg-success" : "bg-primary-500"}`}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                        />
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-ink-muted tabular-nums">
                      {done}/{lesson.exerciseIds.length}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </FadeIn>

        {/* ── Next Level card ── */}
        {info.xpNext != null && (
          <FadeIn delay={0.25}>
            <div className="rounded-2xl border border-surface-dim bg-surface-dim/30 dark:bg-dark-dim/20 p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-1">
                Level {info.level + 1} freischalten
              </p>
              <p className="text-sm text-ink mb-4">
                Noch <strong>{xpToNext} XP</strong> bis du <strong>{LEVELS.find(l => l.level === info.level + 1)?.title}</strong> wirst.
              </p>
              <Link
                href="/lektionen"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 transition-colors"
              >
                Weiterüben
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </FadeIn>
        )}

      </Container>
    </main>
  );
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <motion.p
        className="text-2xl font-black"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        {value.toLocaleString("de-DE")}
      </motion.p>
      <p className="text-xs text-white/60 mt-0.5">{label}</p>
    </div>
  );
}
