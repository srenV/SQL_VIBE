/**
 * Logo – Zeigt das SQL-Trainer-Logo mit optionalem Kompaktmodus.
 * Im Kompaktmodus wird nur "SQL" statt "SQL-Trainer" angezeigt.
 */
import React from "react";
import { cn } from "@/lib/utils";

/** Props fuer die Logo-Komponente. */
export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Kompaktmodus: zeigt nur "SQL" statt "SQL-Trainer". */
  compact?: boolean;
}

export const Logo = React.forwardRef<HTMLSpanElement, LogoProps>(
  ({ compact = false, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center font-bold tracking-tight text-ink select-none hover:opacity-80 transition-opacity",
          compact ? "text-lg" : "text-2xl",
          className
        )}
        {...props}
      >
        <span className="text-primary-600">SQL</span>
        <span className={cn(compact && "hidden")}>-Trainer</span>
      </span>
    );
  }
);
Logo.displayName = "Logo";
