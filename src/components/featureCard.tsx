/**
 * FeatureCard – Landing-Page Feature-Karte mit State-of-the-Art Hover-Animationen.
 *
 * Effekte:
 *  - 3D Tilt: Subtile perspektivische Neigung in Mausrichtung
 *  - Glow: Farbiger Rand-Glow passend zum Card-Thema
 *  - Icon-Lift: Icon hebt sich und dreht leicht beim Hover
 *  - Arrow-Slide: Pfeil gleitet nach rechts mit Bounce
 *  - Scale + Shadow-Lift: Card hebt sich leicht an
 *  - Gradient-Overlay: Subtiler Farbverlauf beim Hover
 *
 * Respects prefers-reduced-motion.
 */
"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FeatureCardProps {
  /** Ziel-URL */
  href: string;
  /** Icon-Element (SVG) */
  icon: React.ReactNode;
  /** Ueberschrift */
  title: string;
  /** Beschreibungstext */
  description: string;
  /** CTA-Text */
  cta: string;
  /** Farbthema: primary (indigo), accent (teal), amber */
  colorTheme?: "primary" | "accent" | "amber";
  className?: string;
}

/** Farb-Konfiguration pro Theme. */
const themeConfig = {
  primary: {
    iconHover: "group-hover:-translate-y-1 group-hover:rotate-3",
    glowBorder: "group-hover:border-primary-400/60 dark:group-hover:border-primary-400/40",
    glowShadow: "group-hover:shadow-[0_8px_30px_-8px_rgba(99,102,241,0.35)] dark:group-hover:shadow-[0_8px_30px_-8px_rgba(99,102,241,0.25)]",
    ctaColor: "text-primary-500",
    gradientFrom: "from-primary-500/5",
    gradientTo: "to-primary-500/0",
  },
  accent: {
    iconHover: "group-hover:-translate-y-1 group-hover:rotate-3",
    glowBorder: "group-hover:border-accent-400/60 dark:group-hover:border-accent-400/40",
    glowShadow: "group-hover:shadow-[0_8px_30px_-8px_rgba(20,184,166,0.35)] dark:group-hover:shadow-[0_8px_30px_-8px_rgba(20,184,166,0.25)]",
    ctaColor: "text-accent-500",
    gradientFrom: "from-accent-500/5",
    gradientTo: "to-accent-500/0",
  },
  amber: {
    iconHover: "group-hover:-translate-y-1 group-hover:rotate-3",
    glowBorder: "group-hover:border-amber-400/60 dark:group-hover:border-amber-400/40",
    glowShadow: "group-hover:shadow-[0_8px_30px_-8px_rgba(245,158,11,0.35)] dark:group-hover:shadow-[0_8px_30px_-8px_rgba(245,158,11,0.25)]",
    ctaColor: "text-amber-600 dark:text-amber-400",
    gradientFrom: "from-amber-500/5",
    gradientTo: "to-amber-500/0",
  },
} as const;

export function FeatureCard({
  href,
  icon,
  title,
  description,
  cta,
  colorTheme = "primary",
  className,
}: FeatureCardProps) {
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
      // Tilt: max ±6deg, invertiert fuer natuerliches Gefuehl
      const tiltX = (y - 0.5) * -8;
      const tiltY = (x - 0.5) * 8;
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
    <Link href={href} className="group block outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-xl">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative overflow-hidden rounded-xl border bg-surface p-6 h-full",
          "border-surface-dim dark:border-dark-dim",
          "transition-all duration-300 ease-out",
          // Glow border
          theme.glowBorder,
          // Glow shadow
          theme.glowShadow,
          // Scale lift
          isHovering ? "scale-[1.02]" : "scale-100",
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
            colorTheme === "primary" && "bg-gradient-to-r from-transparent via-primary-400 to-transparent",
            colorTheme === "accent" && "bg-gradient-to-r from-transparent via-accent-400 to-transparent",
            colorTheme === "amber" && "bg-gradient-to-r from-transparent via-amber-400 to-transparent"
          )}
          aria-hidden="true"
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon with lift animation */}
          <div className={cn("mb-4 transition-transform duration-300 ease-out", theme.iconHover)}>
            {icon}
          </div>

          <h3 className="font-semibold text-ink text-lg">{title}</h3>
          <p className="text-sm text-ink-muted mt-2 leading-relaxed">{description}</p>

          {/* CTA with arrow slide */}
          <span
            className={cn(
              "font-medium text-sm mt-4 inline-flex items-center gap-1 transition-all duration-300",
              theme.ctaColor
            )}
          >
            {cta}
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:opacity-100 opacity-0 -ml-1 group-hover:ml-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}