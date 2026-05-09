/**
 * FeatureCard – Landing-Page Feature-Karte mit Hover-Animationen.
 *
 * Nutzt AnimatedCard fuer 3D Tilt, Glow, Scale-Lift und Gradient-Overlay.
 * Zusaetzlich: Icon-Lift und Arrow-Slide Animationen.
 */
"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AnimatedCard } from "@/components/animatedCard";

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

/** CTA-Farbe pro Theme. */
const ctaColors = {
  primary: "text-primary-500",
  accent: "text-accent-500",
  amber: "text-amber-600 dark:text-amber-400",
} as const;

/** Icon-Hover-Klasse. */
const iconHoverClass = "group-hover:-translate-y-1 group-hover:rotate-3";

export function FeatureCard({
  href,
  icon,
  title,
  description,
  cta,
  colorTheme = "primary",
  className,
}: FeatureCardProps) {
  return (
    <Link href={href} className="group block outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-xl">
      <AnimatedCard colorTheme={colorTheme} className={className}>
        {/* Icon with lift animation */}
        <div className={cn("mb-4 transition-transform duration-300 ease-out", iconHoverClass)}>
          {icon}
        </div>

        <h3 className="font-semibold text-ink text-lg">{title}</h3>
        <p className="text-sm text-ink-muted mt-2 leading-relaxed flex-1">{description}</p>

        {/* CTA with arrow slide — pinned to bottom */}
        <span
          className={cn(
            "font-medium text-sm mt-4 inline-flex items-center gap-1 transition-all duration-300",
            ctaColors[colorTheme]
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
      </AnimatedCard>
    </Link>
  );
}