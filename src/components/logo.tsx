/**
 * Logo – Zeigt das SQLVIBE-Logo mit optionalem Kompaktmodus.
 * Im Kompaktmodus wird nur "SQL" statt "SQLVIBE" angezeigt.
 */
import React from "react";
import { cn } from "@/lib/utils";

/** Props fuer die Logo-Komponente. */
export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Kompaktmodus: zeigt nur "SQL" statt "SQLVIBE". */
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
        <span className={cn(compact && "hidden", "text-primary-500")}>VIBE</span>
      </span>
    );
  }
);
Logo.displayName = "Logo";
