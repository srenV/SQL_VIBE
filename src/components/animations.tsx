/**
 * Animations-Komponenten fuer die SQL-Trainer MySQL-Lernplattform.
 *
 * Enthaelt:
 * - FadeIn: Einblend-Animation mit Richtungsoptionen (oben, unten, links, rechts).
 * - ScaleOnHover: Skalierungs-Animation beim Ueberfahren mit der Maus.
 * - AnimatedList: Gestaffelte Einblend-Animation fuer Listen-Items.
 *
 * English: Animation components for the SQL-Trainer MySQL learning platform.
 * Includes FadeIn, ScaleOnHover, and AnimatedList.
 */
"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Props fuer die FadeIn-Komponente. Richtungs-optionen: up, down, left, right. */
export interface FadeInProps {
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  className?: string;
  children?: React.ReactNode;
}

/** Offset-Werte fuer die jeweilige Einblendrichtung. */
const directionOffset = {
  up: { y: 24, x: 0 },
  down: { y: -24, x: 0 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
};

export const FadeIn = React.forwardRef<HTMLDivElement, FadeInProps>(
  (
    { direction = "up", delay = 0, duration = 0.4, className, children },
    forwardedRef
  ) => {
    const [visible, setVisible] = useState(false);
    const innerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        setVisible(true);
        return;
      }

      const el = innerRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: "-20px", threshold: 0.1 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const offset = directionOffset[direction];

    const setRefs = React.useCallback(
      (el: HTMLDivElement | null) => {
        innerRef.current = el;
        if (typeof forwardedRef === "function") {
          forwardedRef(el);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      },
      [forwardedRef]
    );

    return (
      <div
        ref={setRefs}
        className={cn(className)}
        style={{
          willChange: visible ? "auto" : "transform, opacity",
          opacity: visible ? 1 : 0,
          transform: visible
            ? "translate(0, 0)"
            : `translate(${offset.x}px, ${offset.y}px)`,
          transition: visible
            ? `opacity ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s, transform ${duration}s cubic-bezier(0.25, 0.1, 0.25, 1) ${delay}s`
            : "none",
        }}
      >
        {children}
      </div>
    );
  }
);
FadeIn.displayName = "FadeIn";

/** Props fuer die ScaleOnHover-Komponente. Skalierung mit Standard 1.02. */
export interface ScaleOnHoverProps {
  /** Skalierungsfaktor beim Ueberfahren (Standard: 1.02). */
  scale?: number;
  className?: string;
  children?: React.ReactNode;
}

export const ScaleOnHover = React.forwardRef<HTMLDivElement, ScaleOnHoverProps>(
  ({ scale = 1.02, className, children }, forwardedRef) => {
    return (
      <div
        ref={forwardedRef}
        className={cn(
          "transition-transform duration-200 ease-out will-change-transform",
          className
        )}
        style={{
          transform: "scale(1)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = `scale(${scale})`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.98)";
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = `scale(${scale})`;
        }}
      >
        {children}
      </div>
    );
  }
);
ScaleOnHover.displayName = "ScaleOnHover";

/** Props fuer die AnimatedList-Komponente. Gestaffelte Einblend-Animation fuer Kinder-Elemente. */
export interface AnimatedListProps {
  /** Verzoegerung zwischen einzelnen Listenelementen in Sekunden (Standard: 0.08). */
  stagger?: number;
  className?: string;
  children?: React.ReactNode;
}

export const AnimatedList = React.forwardRef<HTMLDivElement, AnimatedListProps>(
  ({ stagger = 0.08, className, children }, forwardedRef) => {
    const [visible, setVisible] = useState(false);
    const innerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) {
        setVisible(true);
        return;
      }

      const el = innerRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        },
        { rootMargin: "-20px", threshold: 0.1 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const items = React.Children.toArray(children);

    const setRefs = React.useCallback(
      (el: HTMLDivElement | null) => {
        innerRef.current = el;
        if (typeof forwardedRef === "function") {
          forwardedRef(el);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        }
      },
      [forwardedRef]
    );

    return (
      <div ref={setRefs} className={cn(className)}>
        {items.map((child, i) => (
          <div
            key={i}
            style={{
              willChange: visible ? "auto" : "transform, opacity",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: visible
                ? `opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * stagger}s, transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1) ${i * stagger}s`
                : "none",
            }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
);
AnimatedList.displayName = "AnimatedList";

export { FadeIn as default };