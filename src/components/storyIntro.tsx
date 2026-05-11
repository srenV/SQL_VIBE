"use client";

/**
 * StoryIntro – Immersive scramble-text intro for SQL Agent stories.
 *
 * Uses anime.js scrambleText to reveal the scenario title and intro text
 * with a cyberpunk aesthetic. Respects prefers-reduced-motion.
 */

import React, { useEffect, useRef, useState } from "react";
import { createTimeline, stagger, scrambleText } from "animejs";

const SCOPE = "#sql-story-intro";

const SCOPED_CSS = `
${SCOPE} {
  position: relative;
  min-height: 320px;
  overflow: hidden;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--color-surface-dim) 0%, var(--color-surface) 100%);
  color: var(--color-ink);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Monaco, Consolas, monospace;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 1px solid var(--color-primary-200);
}
.dark ${SCOPE} {
  background: linear-gradient(135deg, #05080f 0%, #0a0e1a 40%, #111827 100%);
  border-color: var(--color-primary-700);
}
${SCOPE} .si-skip {
  display: none;
}
${SCOPE} .si-title {
  font-size: clamp(1.1rem, 2.5vw, 1.6rem);
  font-weight: 700;
  color: var(--color-primary-500);
  margin-bottom: 1rem;
  line-height: 1.3;
  min-height: 2em;
}
${SCOPE} .si-body {
  font-size: clamp(0.75rem, 1.4vw, 0.9rem);
  line-height: 1.7;
  color: var(--color-ink);
  margin-bottom: 1.25rem;
  min-height: 3em;
  max-width: 680px;
  opacity: 0.85;
}
${SCOPE} .si-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.7rem;
  color: var(--color-ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1.25rem;
  opacity: 0;
}
${SCOPE} .si-meta.si-visible {
  opacity: 1;
  transition: opacity 0.6s ease;
}
${SCOPE} .si-meta .si-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--color-ink-muted);
}
${SCOPE} .si-btn {
  margin-top: 0.5rem;
}
${SCOPE} .si-progress-dots {
  display: flex;
  gap: 0.35rem;
  margin-bottom: 1rem;
}
${SCOPE} .si-progress-dots .si-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-surface-dim);
  transition: background 0.3s ease;
}
.dark ${SCOPE} .si-progress-dots .si-dot {
  background: rgba(255,255,255,0.15);
}
${SCOPE} .si-progress-dots .si-dot.si-solved {
  background: var(--color-accent-500);
}
${SCOPE} .si-progress-dots .si-dot.si-current {
  background: var(--color-primary-500);
}
`;

interface StoryIntroProps {
  scenarioTitle: string;
  intro: string;
  difficulty: string;
  chapterCount: number;
  solvedCount: number;
  currentChapter: number;
  hasProgress: boolean;
  onStart: () => void;
}

const DIFFICULTY_LABELS: Record<string, string> = {
  beginner: "Anfänger",
  junior: "Grundlagen",
  intermediate: "Fortgeschritten",
  advanced: "Experte",
  interview: "Interview",
};

export const StoryIntro: React.FC<StoryIntroProps> = ({
  scenarioTitle,
  intro,
  difficulty,
  chapterCount,
  solvedCount,
  currentChapter,
  hasProgress,
  onStart,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // Initialize from matchMedia so users with reduced-motion never see scramble flash
  const [reducedMotion, setReducedMotion] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const [metaVisible, setMetaVisible] = useState(reducedMotion);

  useEffect(() => {
    if (reducedMotion) return;

    const el = containerRef.current;
    if (!el) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tl: any = createTimeline({ loop: false, autoplay: true });

    // Phase 1: Title scramble in
    tl.add(`${SCOPE} .si-title`, {
      innerHTML: scrambleText({
        text: scenarioTitle,
        override: " ",
        from: "left",
        duration: 1200,
        revealDelay: 80,
        cursor: "░▒▓█",
        perturbation: 0.4,
      }),
    });

    // Phase 2: Body text scramble in (staggered)
    tl.add(
      `${SCOPE} .si-body`,
      {
        innerHTML: scrambleText({
          text: intro,
          override: " ",
          from: "left",
          duration: 1400,
          revealDelay: 15,
          cursor: "░▒▓",
          perturbation: 0.3,
        }),
      },
      "-=600"
    );

    // Phase 3: Show meta after text finishes
    tl.add(() => {
      setMetaVisible(true);
    }, "-=400");

    tl.init();

    return () => {
      try { tl.pause(); } catch { /* already destroyed */ }
    };
  }, [reducedMotion, scenarioTitle, intro]);

  // React to runtime preference changes
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) setMetaVisible(true);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const diffLabel = DIFFICULTY_LABELS[difficulty] ?? difficulty;

  return (
    <div id="sql-story-intro" ref={containerRef}>
      <style dangerouslySetInnerHTML={{ __html: SCOPED_CSS }} />

      {/* Skip button (hidden, kept for accessibility) */}
      <button
        className="si-skip"
        onClick={onStart}
        aria-label="Animation überspringen"
      >
        Überspringen
      </button>

      {/* Progress dots */}
      <div className="si-progress-dots">
        {Array.from({ length: chapterCount }, (_, i) => (
          <span
            key={i}
            className={`si-dot ${i < solvedCount ? "si-solved" : ""} ${i === currentChapter && i >= solvedCount ? "si-current" : ""}`}
          />
        ))}
      </div>

      {/* Title */}
      <div className="si-title">
        {reducedMotion ? scenarioTitle : ""}
      </div>

      {/* Intro body */}
      <div className="si-body">
        {reducedMotion ? intro : ""}
      </div>

      {/* Meta info */}
      <div className={`si-meta ${metaVisible || reducedMotion ? "si-visible" : ""}`}>
        <span>{chapterCount} Kapitel</span>
        <span className="si-dot" />
        <span>{diffLabel}</span>
        {hasProgress && (
          <>
            <span className="si-dot" />
            <span style={{ color: "var(--color-accent-500)" }}>✓ {solvedCount}/{chapterCount} gelöst</span>
          </>
        )}
      </div>

      {/* Start button — always visible */}
      <div className="si-btn">
        <button
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-primary-600) 100%)",
            color: "var(--color-ink-inverted)",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 0 20px var(--color-primary-200)",
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>
          {hasProgress ? "Fortsetzen" : "Ermittlungen beginnen"}
        </button>
      </div>
    </div>
  );
};