"use client";

import React from "react";
import { cn } from "@/lib/utils";

/**
 * SqlEditor – Textarea for SQL input with monospace font and minimal chrome.
 */
export interface SqlEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  label?: string;
  onSubmit?: () => void;
}

export const SqlEditor = React.forwardRef<HTMLTextAreaElement, SqlEditorProps>(
  ({ error, label, className, id, onSubmit, ...props }, ref) => {
    const generatedId = React.useId();
    const editorId = id || generatedId;

    const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        onSubmit?.();
      }
    }, [onSubmit]);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={editorId} className="text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={editorId}
          aria-invalid={error ? "true" : undefined}
          spellCheck={false}
          onKeyDown={onSubmit ? handleKeyDown : props.onKeyDown}
          className={cn(
            "w-full min-h-[8rem] rounded-lg border bg-surface px-3 py-2 text-sm font-mono text-ink placeholder:text-ink-muted",
            "transition-colors duration-150 ease-in-out",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "resize-y",
            "dark:bg-dark-dim dark:border-dark-dim",
            error ? "border-error focus:ring-error/40" : "border-surface-dim",
            className
          )}
          {...props}
        />
        {onSubmit && (
          <p className="text-xs text-ink-muted">
            <kbd className="rounded border border-surface-dim px-1 py-0.5 text-xs font-mono">Strg</kbd>{" "}&#43;{" "}
            <kbd className="rounded border border-surface-dim px-1 py-0.5 text-xs font-mono">&#x21B5;</kbd>{" "}
            zum Ausf&uuml;hren
          </p>
        )}
      </div>
    );
  }
);
SqlEditor.displayName = "SqlEditor";
