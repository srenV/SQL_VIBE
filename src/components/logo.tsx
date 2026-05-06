import React from "react";
import { cn } from "@/lib/utils";

export interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {
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
        <span className="text-primary-600">V</span>
        <span className={cn(compact && "hidden")}>IBAA</span>
      </span>
    );
  }
);
Logo.displayName = "Logo";
