/**
 * AnimatedCard – Wiederverwendbare Karten-Komponente mit State-of-the-Art Hover-Animationen.
 *
 * Kapselt 3D Tilt, Glow, Scale-Lift und Gradient-Overlay.
 * Wird von FeatureCard, LessonCard und ModuleCard verwendet.
 *
 * Effekte:
 *  - 3D Tilt: Subtile perspektivische Neigung in Mausrichtung
 *  - Glow: Farbiger Rand-Glow passend zum Farbthema
 *  - Scale + Shadow-Lift: Card hebt sich leicht an
 *  - Gradient-Overlay: Subtiler Farbverlauf beim Hover
 *  - Shimmer Line: Leuchtende Linie am oberen Rand
 *
 * Respects prefers-reduced-motion.
 */
"use client";

import React, { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface AnimatedCardProps {
  /** Farbthema: primary (indigo), accent (teal), amber */
  colorTheme?: "primary" | "accent" | "amber";
  className?: string;
  children?: React.ReactNode;
}

/** Farb-Konfiguration pro Theme. */
const themeConfig = {
  primary: {
    glowBorder: "group-hover:border-primary-400/60 dark:group-hover:border-primary-400/40",
    glowShadow: "group-hover:shadow-[0_8px_30px_-8px_rgba(99,102,241,0.35)] dark:group-hover:shadow-[0_8px_30px_-8px_rgba(99,102,241,0.25)]",
    gradientFrom: "from-primary-500/5",
    gradientTo: "to-primary-500/0",
    shimmerColor: "bg-gradient-to-r from-transparent via-primary-400 to-transparent",
  },
  accent: {
    glowBorder: "group-hover:border-accent-400/60 dark:group-hover:border-accent-400/40",
    glowShadow: "group-hover:shadow-[0_8px_30px_-8px_rgba(20,184,166,0.35)] dark:group-hover:shadow-[0_8px_30px_-8px_rgba(20,184,166,0.25)]",
    gradientFrom: "from-accent-500/5",
    gradientTo: "to-accent-500/0",
    shimmerColor: "bg-gradient-to-r from-transparent via-accent-400 to-transparent",
  },
  amber: {
    glowBorder: "group-hover:border-amber-400/60 dark:group-hover:border-amber-400/40",
    glowShadow: "group-hover:shadow-[0_8px_30px_-8px_rgba(245,158,11,0.35)] dark:group-hover:shadow-[0_8px_30px_-8px_rgba(245,158,11,0.25)]",
    gradientFrom: "from-amber-500/5",
    gradientTo: "to-amber-500/0",
    shimmerColor: "bg-gradient-to-r from-transparent via-amber-400 to-transparent",
  },
} as const;

export function AnimatedCard({
  colorTheme = "primary",
  className,
  children,
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const theme = themeConfig[colorTheme];

  /** 3D Tilt: Mausposition relativ zur Card berechnen. */
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const tiltX = (y - 0.5) * -6;
      const tiltY = (x - 0.5) * 6;
      setTilt({ x: tiltX, y: tiltY });
    },
    []
  );

  const handleMouseEnter = useCallback(() => setIsHovering(true), []);
  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-surface h-full",
        "border-surface-dim dark:border-dark-dim",
        "transition-all duration-300 ease-out",
        // Glow border
        theme.glowBorder,
        // Glow shadow
        theme.glowShadow,
        className
      )}
      style={{
        perspective: "800px",
        transform: isHovering
          ? `scale(1.02) perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`
          : "scale(1) perspective(800px) rotateX(0deg) rotateY(0deg)",
        transition: "transform 0.3s ease-out, box-shadow 0.3s ease-out, border-color 0.3s ease-out",
      }}
    >
      {/* Gradient overlay on hover */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
          theme.gradientFrom,
          theme.gradientTo
        )}
        aria-hidden="true"
      />

      {/* Shimmer line at top on hover */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          theme.shimmerColor
        )}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {children}
      </div>
    </div>
  );
}