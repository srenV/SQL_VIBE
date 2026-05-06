import React from "react";
import { cn } from "@/lib/utils";

/**
 * Input – Formular-Eingabefeld mit integrierter Fehleranzeige.
 *
 * - Label, Fehlertext und Hilfetext ueber Props steuerbar.
 * - Barrierefrei: `aria-invalid`, `aria-describedby`, `htmlFor`.
 * - Visuelle Fehlerstates ohne dangerouslySetInnerHTML.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: React.ReactNode;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ error, helperText, label, className, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;
    const describedBy = helperText || error ? errorId : undefined;

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-ink cursor-pointer"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={describedBy}
          className={cn(
            "w-full rounded-lg border bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted",
            "transition-colors duration-150 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "dark:bg-dark-dim dark:border-dark-dim",
            error ? "border-error focus:ring-error/40" : "border-surface-dim",
            className
          )}
          {...props}
        />
        {helperText && (
          <span
            id={errorId}
            className={cn("text-xs", error ? "text-error" : "text-ink-muted")}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
