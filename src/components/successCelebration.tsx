"use client";

import React, { useEffect, useId, useMemo } from "react";

interface SuccessCelebrationProps {
  message?: string;
  submessage?: string;
  show?: boolean;
}

const CONFETTI_COLORS = ["#10b981", "#6366f1", "#14b8a6", "#f59e0b", "#818cf8"];

function useSeededParticles(count: number) {
  const id = useId();
  return useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: `${id}-${i}`,
      x: (i / count) * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: (i * 37 % 100) / 500,
      offsetX: (i * 73 % 120) - 60,
    }));
  }, [count, id]);
}

export function SuccessCelebration({
  message = "Richtig!",
  submessage,
  show = true,
}: SuccessCelebrationProps) {
  const particles = useSeededParticles(12);

  useEffect(() => {
    if (show) {
      document.dispatchEvent(new CustomEvent("sql-trainer-success", { detail: { message } }));
    }
  }, [show, message]);

  if (!show) return null;

  return (
    <div className="relative">
      <div className="animate-[success-pop_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3.5 8.5 6.5 11.5 12.5 5.5" />
            </svg>
          </span>
          <div className="space-y-1">
            <p className="text-base font-semibold text-success">{message}</p>
            {submessage && (
              <p className="text-sm text-ink">{submessage}</p>
            )}
          </div>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {particles.map((p) => (
          <span
            key={p.id}
            className="absolute bottom-0 w-2 h-2 rounded-full animate-[confetti_0.6s_cubic-bezier(0.25,0.46,0.45,0.94)_forwards]"
            style={{
              left: `${p.x}%`,
              backgroundColor: p.color,
              animationDelay: `${p.delay}s`,
              transform: `translateX(${p.offsetX}px)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}