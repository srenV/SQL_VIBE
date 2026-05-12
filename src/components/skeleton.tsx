"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

const roundedClasses = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function Skeleton({
  width,
  height,
  rounded = "md",
  className,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-surface-dim via-surface to-surface-dim bg-[length:200%_100%]",
        roundedClasses[rounded],
        className
      )}
      style={{
        width: width || "100%",
        height: height || "1rem",
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SqlResultSkeleton() {
  const t = useTranslations("common");
  return (
    <div className="space-y-3" aria-label={t("loadingResult")} role="status">
      <div className="flex items-center justify-between">
        <Skeleton width="6rem" height="0.875rem" />
        <Skeleton width="4rem" height="0.75rem" />
      </div>
      <div className="space-y-2">
        <Skeleton height="2rem" rounded="sm" />
        <Skeleton height="2rem" rounded="sm" />
        <Skeleton height="2rem" rounded="sm" width="75%" />
      </div>
      <span className="sr-only">{t("loading")}</span>
    </div>
  );
}

export function ExerciseSkeleton() {
  const t = useTranslations("common");
  return (
    <div className="space-y-6" aria-label={t("loadingExercise")} role="status">
      <div className="rounded-xl border border-surface-dim p-5 space-y-3">
        <Skeleton width="60%" height="1.25rem" />
        <Skeleton width="80%" height="0.875rem" />
      </div>
      <div className="rounded-xl border border-surface-dim p-5 space-y-4">
        <Skeleton height="8rem" rounded="lg" />
        <div className="flex gap-3">
          <Skeleton width="8rem" height="2.25rem" rounded="lg" />
          <Skeleton width="6rem" height="2rem" rounded="md" />
        </div>
      </div>
      <span className="sr-only">{t("loading")}</span>
    </div>
  );
}