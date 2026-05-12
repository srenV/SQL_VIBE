"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "accent";
  animated?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "h-1.5",
  md: "h-2",
  lg: "h-3",
};

const variantClasses = {
  primary: "bg-primary-500",
  success: "bg-success",
  accent: "bg-accent-500",
};

export function ProgressBar({
  value,
  max = 100,
  label,
  size = "md",
  variant = "primary",
  animated = true,
  className,
}: ProgressBarProps) {
  const t = useTranslations("common");
  const percent = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;

  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || t("percentComplete", { percent })}
    >
      <div className={cn("w-full rounded-full bg-surface-dim overflow-hidden", sizeClasses[size])}>
        <div
          className={cn(
            "h-full rounded-full",
            variantClasses[variant],
            animated ? "transition-all duration-700 ease-out" : ""
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}