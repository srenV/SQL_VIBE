"use client";

import { useState } from "react";
import Link from "next/link";
import { storyExercises } from "@/data/exercises";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { FadeIn } from "@/components/animations";
import { useProgress } from "@/hooks/useProgress";
import type { Exercise } from "@/types/exercise";

// ---------------------------------------------------------------------------
// Static lookup tables
// ---------------------------------------------------------------------------

const difficultyLabels: Record<string, { label: string; short: string; color: string }> = {
  beginner:     { label: "Einsteiger",      short: "Einsteiger",      color: "text-success bg-success/10" },
  junior:       { label: "Grundlagen",      short: "Grundlagen",      color: "text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-950" },
  intermediate: { label: "Fortgeschritten", short: "Fortgeschritten", color: "text-warning bg-warning/10" },
  advanced:     { label: "Experte",         short: "Experte",         color: "text-error bg-error/10" },
  interview:    { label: "Interview",       short: "Interview",       color: "text-violet-600 dark:text-violet-400 bg-violet-100 dark:bg-violet-950/40" },
};

const datasetLabels: Record<string, string> = {
  hr:         "HR-System",
  shop:       "NexusMarkt",
  tickets:    "HelpCore",
  streaming:  "ARGUS-Stream",
  logs:       "SmartCity-Logs",
  hospital:   "MedGov",
  ecommerce:  "Sigma-Commerce",
  university: "Prometheus-Uni",
  banking:    "Omega-Bank",
  fitness:    "BioTrack",
};

const FILTER_OPTIONS = ["Alle", "Einsteiger", "Grundlagen", "Fortgeschritten", "Experte", "Interview"];
const DIFFICULTY_ORDER = ["beginner", "junior", "intermediate", "advanced", "interview"];

// Maps filter pill label → difficulty key (undefined = "Alle")
const FILTER_TO_DIFFICULTY: Record<string, string | undefined> = {
  Alle:           undefined,
  Einsteiger:     "beginner",
  Grundlagen:     "junior",
  Fortgeschritten:"intermediate",
  Experte:        "advanced",
  Interview:      "interview",
};

// Human-readable hint shown on locked cards
const LOCK_HINT: Record<string, string> = {
  intermediate: "Schließe alle Grundlagen- & Einsteiger-Fälle ab",
  advanced:     "Schließe alle Fortgeschritten-Fälle ab",
  interview:    "Schließe alle Experten-Fälle ab",
};

// ---------------------------------------------------------------------------
// Unlock logic
// ---------------------------------------------------------------------------

function getUnlockStatus(
  exercise: Exercise,
  allStory: Exercise[],
  progress: ReturnType<typeof useProgress>["progress"]
): "unlocked" | "locked" {
  const diff = exercise.difficulty;
  if (diff === "beginner" || diff === "junior") return "unlocked";
  // Already-completed cases stay accessible for existing users
  if (progress.exercises[exercise.id]?.completed) return "unlocked";

  const isCompleted = (id: string) => progress.exercises[id]?.completed ?? false;

  if (diff === "intermediate") {
    const tier1 = allStory.filter(e => e.difficulty === "beginner" || e.difficulty === "junior");
    return tier1.every(e => isCompleted(e.id)) ? "unlocked" : "locked";
  }
  if (diff === "advanced") {
    const tier2 = allStory.filter(e => e.difficulty === "intermediate");
    return tier2.every(e => isCompleted(e.id)) ? "unlocked" : "locked";
  }
  if (diff === "interview") {
    const tier3 = allStory.filter(e => e.difficulty === "advanced");
    return tier3.every(e => isCompleted(e.id)) ? "unlocked" : "locked";
  }
  return "unlocked";
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StoryPage() {
  const { progress } = useProgress();
  const [filter, setFilter] = useState<string>("Alle");

  // Sort by difficulty tier
  const sorted = [...storyExercises].sort(
    (a, b) => DIFFICULTY_ORDER.indexOf(a.difficulty) - DIFFICULTY_ORDER.indexOf(b.difficulty)
  );

  // Apply filter
  const filterDiff = FILTER_TO_DIFFICULTY[filter];
  const displayed = filterDiff
    ? sorted.filter(e => e.difficulty === filterDiff)
    : sorted;

  // Progress counts (over ALL story cases, not just the filtered view)
  const completedCount = sorted.filter(e => progress.exercises[e.id]?.completed).length;
  const totalCount = sorted.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header />

      <main className="flex-1">
        {/* ------------------------------------------------------------------ */}
        {/* Hero                                                                */}
        {/* ------------------------------------------------------------------ */}
        <section className="py-16 text-center bg-linear-to-b from-violet-950/40 to-transparent dark:from-violet-950/60 dark:to-transparent">
          <Container className="space-y-5 max-w-3xl mx-auto">
            <FadeIn delay={0}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-400/20 text-violet-400 text-xs font-medium mb-2">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
                SQL Agent — Story-Modus
              </div>
            </FadeIn>
            <FadeIn delay={0.05}>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ink">
                Löse echte <span className="text-violet-500 dark:text-violet-400">Fälle</span> mit SQL
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="text-lg text-ink-muted max-w-2xl mx-auto">
                Jeder Fall ist eine Geschichte. Du bist der Ermittler — SQL ist dein Werkzeug.
                Löse einfachere Fälle, um schwierigere Missionen freizuschalten.
              </p>
            </FadeIn>
          </Container>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Progress header                                                     */}
        {/* ------------------------------------------------------------------ */}
        <section className="pb-2 pt-0">
          <Container className="max-w-4xl mx-auto">
            <FadeIn delay={0.12}>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink-muted">
                    <span className="font-semibold text-ink">{completedCount}</span> von{" "}
                    <span className="font-semibold text-ink">{totalCount}</span> Fällen gelöst
                  </span>
                  <span className="text-ink-muted tabular-nums">{progressPct} %</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-surface-dim dark:bg-dark-dim overflow-hidden">
                  <div
                    className="h-full rounded-full bg-violet-500 transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            </FadeIn>
          </Container>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Filter pills + case list                                            */}
        {/* ------------------------------------------------------------------ */}
        <section className="py-10">
          <Container className="max-w-4xl mx-auto space-y-6">

            {/* Filter pills */}
            <FadeIn delay={0.14}>
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map((option) => {
                  const active = filter === option;
                  return (
                    <button
                      key={option}
                      onClick={() => setFilter(option)}
                      className={
                        "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-150 " +
                        (active
                          ? "bg-violet-500 text-white shadow-sm"
                          : "bg-surface-dim dark:bg-dark-dim text-ink-muted hover:text-ink hover:bg-surface dark:hover:bg-dark border border-surface-dim dark:border-dark-dim")
                      }
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </FadeIn>

            {/* Count label */}
            <FadeIn delay={0.16}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-ink-muted">
                {displayed.length} {displayed.length === 1 ? "Fall" : "Fälle"}{filter !== "Alle" ? ` · ${filter}` : " verfügbar"}
              </h2>
            </FadeIn>

            {/* Cards */}
            <div className="space-y-4">
              {displayed.map((exercise, i) => {
                const diff = difficultyLabels[exercise.difficulty] ?? difficultyLabels.junior;
                const chapterCount = exercise.story?.chapters.length ?? 0;
                const datasetLabel = datasetLabels[exercise.datasetId] ?? exercise.datasetId;
                const isCompleted = progress.exercises[exercise.id]?.completed ?? false;
                const unlockStatus = getUnlockStatus(exercise, storyExercises, progress);
                const locked = unlockStatus === "locked";

                // Global index for stable case number (use position in sorted, not filtered)
                const globalIndex = sorted.indexOf(exercise);

                if (locked) {
                  return (
                    <FadeIn key={exercise.id} delay={0.17 + i * 0.06}>
                      <div className="relative overflow-hidden rounded-xl border border-surface-dim dark:border-dark-dim bg-surface opacity-50 cursor-not-allowed">
                        <div className="p-5 sm:p-6 flex items-start gap-4 sm:gap-6">
                          {/* Case number */}
                          <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-surface-dim dark:bg-dark-dim border border-surface-dim dark:border-dark-dim text-ink-muted font-bold text-sm">
                            {String(globalIndex + 1).padStart(2, "0")}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${diff.color}`}>
                                {diff.label}
                              </span>
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-surface-dim dark:bg-dark-dim text-ink-muted">
                                {datasetLabel}
                              </span>
                              <span className="text-xs text-ink-muted">
                                {chapterCount} Kapitel
                              </span>
                            </div>
                            <h3 className="font-semibold text-ink text-base">{exercise.title}</h3>
                            <p className="text-xs text-ink-muted">
                              {LOCK_HINT[exercise.difficulty] ?? "Schalte diesen Fall frei"}
                            </p>
                          </div>

                          {/* Lock icon */}
                          <div className="shrink-0 flex items-center self-center text-ink-muted">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  );
                }

                // Unlocked card
                return (
                  <FadeIn key={exercise.id} delay={0.17 + i * 0.06}>
                    <Link href={`/lektionen/lesson_story/${exercise.id}`} className="group block">
                      <div className="relative overflow-hidden rounded-xl border border-surface-dim dark:border-dark-dim bg-surface hover:border-violet-400/60 dark:hover:border-violet-400/40 hover:shadow-[0_8px_30px_-8px_rgba(139,92,246,0.25)] transition-all duration-300">
                        {/* Top shimmer on hover */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Completed checkmark badge */}
                        {isCompleted && (
                          <div className="absolute top-3 right-3 flex items-center justify-center w-6 h-6 rounded-full bg-success/15 text-success">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                        )}

                        <div className="p-5 sm:p-6 flex items-start gap-4 sm:gap-6">
                          {/* Case number */}
                          <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-400/20 text-violet-500 dark:text-violet-400 font-bold text-sm">
                            {String(globalIndex + 1).padStart(2, "0")}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${diff.color}`}>
                                {diff.label}
                              </span>
                              <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-surface-dim dark:bg-dark-dim text-ink-muted">
                                {datasetLabel}
                              </span>
                              <span className="text-xs text-ink-muted">
                                {chapterCount} Kapitel
                              </span>
                            </div>
                            <h3 className="font-semibold text-ink text-base group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                              {exercise.title}
                            </h3>
                            <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
                              {exercise.description}
                            </p>
                          </div>

                          {/* Arrow */}
                          <div className="shrink-0 flex items-center self-center text-ink-muted group-hover:text-violet-500 dark:group-hover:text-violet-400 transition-colors">
                            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </FadeIn>
                );
              })}

              {displayed.length === 0 && (
                <FadeIn delay={0.2}>
                  <p className="text-center text-ink-muted py-12">
                    Keine Fälle für diesen Filter gefunden.
                  </p>
                </FadeIn>
              )}
            </div>
          </Container>
        </section>
      </main>
    </div>
  );
}
