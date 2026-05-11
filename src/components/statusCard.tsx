/**
 * StatusCard – Wiederverwendbare Komponente fuer Status-/Feedback-Karten.
 *
 * Konsolidiert die bisher in playground.tsx, storyPlayer.tsx, sandboxWorkspace.tsx,
 * predictQuiz.tsx u.a. duplizierten Error/Success/Warning/Hint-Card-Patterns.
 *
 * Varianten:
 *  - "error":   Rote Karte mit "!" Icon
 *  - "success": Gruene Karte mit "✓" Icon
 *  - "warning": Gelbe Karte mit "!" Icon
 *  - "hint":    Blaue/lila Karte mit Lupe-Icon
 *
 * Props:
 *  - variant:   Status-Typ (error | success | warning | hint)
 *  - title:    Optionale Ueberschrift (wird automatisch farbig)
 *  - children:  Beliebiger Inhalt (Beschreibungstext, Details etc.)
 *  - icon:      Optionales Custom-Icon (ueberschreibt Default-Icon)
 *  - cardVariant: Card-Variante ("outlined" | "flat"), Default "outlined"
 *  - className: Zusaetzliche CSS-Klassen
 *  - animated:  Ob FadeIn-Animation verwendet werden soll (Default: false)
 *  - ariaLabel: Accessibility-Label fuer die Karte
 */
import React from "react";
import { Card } from "@/components/card";
import { FadeIn } from "@/components/animations";
import { cn } from "@/lib/utils";

export type StatusVariant = "error" | "success" | "warning" | "hint";

interface StatusConfig {
  borderClass: string;
  bgClass: string;
  iconBgClass: string;
  iconTextClass: string;
  titleClass: string;
  defaultIcon: string;
}

const STATUS_CONFIG: Record<StatusVariant, StatusConfig> = {
  error: {
    borderClass: "border-error/40",
    bgClass: "",
    iconBgClass: "bg-error/10",
    iconTextClass: "text-error",
    titleClass: "text-error",
    defaultIcon: "!",
  },
  success: {
    borderClass: "border-success/40",
    bgClass: "",
    iconBgClass: "bg-success/10",
    iconTextClass: "text-success",
    titleClass: "text-success",
    defaultIcon: "✓",
  },
  warning: {
    borderClass: "border-warning/40",
    bgClass: "",
    iconBgClass: "bg-warning/10",
    iconTextClass: "text-warning",
    titleClass: "text-warning",
    defaultIcon: "!",
  },
  hint: {
    borderClass: "border-primary-400/40",
    bgClass: "bg-primary-50/50 dark:bg-primary-950/20",
    iconBgClass: "bg-primary-100 dark:bg-primary-900/30",
    iconTextClass: "text-primary-600 dark:text-primary-400",
    titleClass: "text-primary-600 dark:text-primary-400",
    defaultIcon: "💡",
  },
};

export interface StatusCardProps {
  /** Status-Typ: error | success | warning | hint */
  variant: StatusVariant;
  /** Optionale Ueberschrift (wird automatisch in der Variantenfarbe dargestellt) */
  title?: string;
  /** Beliebiger Inhalt (Beschreibungstext, Details etc.) */
  children?: React.ReactNode;
  /** Custom-Icon (ueberschreibt Default-Icon) */
  icon?: React.ReactNode;
  /** Card-Variante: "outlined" (Default) oder "flat" */
  cardVariant?: "outlined" | "flat";
  /** Zusaetzliche CSS-Klassen */
  className?: string;
  /** Ob FadeIn-Animation verwendet werden soll */
  animated?: boolean;
  /** Accessibility-Label */
  ariaLabel?: string;
}

/**
 * StatusCard – Zeigt eine Status-/Feedback-Karte mit Icon, Titel und Inhalt an.
 *
 * @example
 * <StatusCard variant="error" title="Fehler">
 *   <p>Deine Abfrage ist fehlgeschlagen.</p>
 * </StatusCard>
 *
 * <StatusCard variant="success" title="Richtig!" animated>
 *   <p>Deine Abfrage liefert das erwartete Ergebnis.</p>
 * </StatusCard>
 */
export function StatusCard({
  variant,
  title,
  children,
  icon,
  cardVariant = "outlined",
  className,
  animated = false,
  ariaLabel,
}: StatusCardProps) {
  const config = STATUS_CONFIG[variant];

  const card = (
    <Card
      variant={cardVariant}
      className={cn("p-5", config.borderClass, config.bgClass, className)}
      aria-label={ariaLabel}
    >
      <div className="flex items-start gap-3">
        <span
          className={cn(
            "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold",
            config.iconBgClass,
            config.iconTextClass
          )}
          aria-hidden="true"
        >
          {icon ?? config.defaultIcon}
        </span>
        <div className="space-y-1 min-w-0">
          {title && (
            <p className={cn("text-sm font-semibold", config.titleClass)}>
              {title}
            </p>
          )}
          {children}
        </div>
      </div>
    </Card>
  );

  if (animated) {
    return <FadeIn delay={0.05}>{card}</FadeIn>;
  }

  return card;
}