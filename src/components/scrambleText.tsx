"use client";

/**
 * ScrambleText – Reusable anime.js scramble-text reveal component.
 *
 * Wraps any text content with a cyberpunk-style character scramble animation.
 * Falls back to instant text display when prefers-reduced-motion is active.
 *
 * Usage:
 *   <ScrambleText text="SELECT * FROM users" />
 *   <ScrambleText text={title} as="h3" className="text-lg font-semibold" />
 */

import React, { useEffect, useRef, useState } from "react";
import { scrambleText, createTimeline } from "animejs";

export interface ScrambleTextProps {
  /** The text to scramble-reveal. */
  text: string;
  /** HTML element to render as (default: "span"). */
  as?: "span" | "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /** Additional CSS classes. */
  className?: string;
  /** Animation duration in ms (default: 800). */
  duration?: number;
  /** Delay between character reveals in ms (default: 30). */
  revealDelay?: number;
  /** Scramble cursor characters (default: "░▒▓"). */
  cursor?: string;
  /** Perturbation intensity 0–1 (default: 0.3). */
  perturbation?: number;
  /** Start delay in ms (default: 0). */
  delay?: number;
  /** Callback when animation completes. */
  onComplete?: () => void;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({
  text,
  as: Tag = "span",
  className,
  duration = 800,
  revealDelay = 30,
  cursor = "░▒▓",
  perturbation = 0.3,
  delay = 0,
  onComplete,
}) => {
  const ref = useRef<HTMLElement>(null);
  const idRef = useRef(
    `st-${Math.random().toString(36).slice(2, 9)}`
  );
  // Initialize from matchMedia so reduced-motion users never see scramble flash
  const [reducedMotion, setReducedMotion] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );
  const [done, setDone] = useState(reducedMotion);

  // React to runtime preference changes
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      if (e.matches) setDone(true);
    };
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || !text) {
      setDone(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tl: any = createTimeline({
      loop: false,
      autoplay: true,
      onComplete: () => {
        setDone(true);
        onComplete?.();
      },
    });

    tl.add(el, {
      innerHTML: scrambleText({
        text,
        override: " ",
        from: "left",
        duration,
        revealDelay,
        cursor,
        perturbation,
      }),
    }, delay);

    tl.init();

    return () => {
      try { tl.pause(); } catch { /* already destroyed */ }
    };
  }, [reducedMotion, text, duration, revealDelay, cursor, perturbation, delay, onComplete]);

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={className}
      id={idRef.current}
    >
      {reducedMotion || done ? text : ""}
    </Tag>
  );
};