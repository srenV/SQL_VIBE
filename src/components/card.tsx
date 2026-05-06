import React from "react";
import { cn } from "@/lib/utils";

/**
 * Card – Container-Komponente fuer Inhaltsbloecke.
 *
 * Varianten:
 *  - default: Heller Hintergrund mit dezenter Schattierung.
 *  - flat:    Kein Schatten, nur Rahmen.
 *  - outlined: Farbiger Rahmen fuer Hervorhebungen.
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "flat" | "outlined";
}

const cardVariants = {
  default:
    "bg-surface rounded-xl border border-surface-dim shadow-sm transition-all duration-200 hover:shadow-md dark:border-dark-dim",
  flat: "bg-surface rounded-xl border border-surface-dim dark:border-dark-dim",
  outlined:
    "bg-surface rounded-xl border-2 border-primary-200 transition-colors duration-150 hover:border-primary-300 dark:border-primary-800 dark:hover:border-primary-600",
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = "default", className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="region"
        className={cn(cardVariants[variant], "p-6", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";
