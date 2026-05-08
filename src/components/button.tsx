import React from "react";
import { cn } from "@/lib/utils";

/**
 * Button – Hauptinteraktionskomponente
 *
 * Varianten: primary | secondary | accent | ghost
 * Groessen:  sm | md (Standard) | lg
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const variantClasses = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 dark:bg-primary-500 dark:hover:bg-primary-600",
  secondary: "bg-surface-dim text-ink hover:bg-surface-dim/80 active:bg-surface-dim/60 dark:bg-dark-dim dark:hover:bg-dark-dim/80",
  accent: "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700 dark:bg-accent-600 dark:hover:bg-accent-700",
  ghost: "bg-transparent text-ink hover:bg-surface-dim dark:hover:bg-dark-dim",
};

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm rounded-md",
  md: "px-4 py-2 text-sm rounded-lg",
  lg: "px-6 py-3 text-base rounded-xl",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    // Explicitly remove disabled from rest to prevent spread override
    // (TypeScript's ButtonHTMLAttributes includes disabled, and in some
    // React SSR scenarios the spread can override the explicit prop)
    const { disabled: _restDisabled, ...safeRest } = rest as Record<string, unknown>;
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-150 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...safeRest}
      >
        {isLoading && (
          <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
