"use client";

/**
 * SqlSyntaxModal – Dialect-aware SQL syntax reference modal.
 *
 * Shows supported keywords, functions, types, and dialect-specific features
 * for the currently selected SQL dialect (SQLite / MySQL / PostgreSQL).
 * Items that are not supported are marked with a warning indicator.
 *
 * Uses AnimeLayoutModal for smooth open/close animations.
 * Layout: sidebar (section nav) + content area with two-line item cards.
 */

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useDialect, DIALECT_LABELS } from "@/lib/dialect";
import { AnimeLayoutModal } from "@/components/animeLayoutModal";
import { getSyntaxReference, type SyntaxSection, type SyntaxItem } from "@/data/sqlSyntaxReference";
import {
  Search,
  Filter,
  GitMerge,
  Calculator,
  Layers,
  Combine,
  GitBranch,
  Database,
  Zap,
  AlertTriangle,
  Type,
  BookOpen,
} from "lucide-react";

/** Map section icon names to lucide-react components */
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Filter,
  GitMerge,
  Calculator,
  Layers,
  Combine,
  GitBranch,
  Database,
  Zap,
  AlertTriangle,
  Type,
};

/** Map i18n section title keys to translation keys */
function sectionTitleKey(title: string): string {
  return `sections.${title}`;
}

export interface SqlSyntaxModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SqlSyntaxModal({ isOpen, onClose }: SqlSyntaxModalProps) {
  const t = useTranslations("syntaxRef");
  const { dialect } = useDialect();
  const reference = useMemo(() => getSyntaxReference(dialect), [dialect]);
  const [activeSection, setActiveSection] = useState(reference.sections[0]?.title ?? "");

  const dialectLabel = DIALECT_LABELS[dialect].short;

  // Reset active section when dialect changes
  React.useEffect(() => {
    setActiveSection(reference.sections[0]?.title ?? "");
  }, [reference.sections]);

  const activeSectionData = reference.sections.find((s) => s.title === activeSection) ?? reference.sections[0];

  return (
    <AnimeLayoutModal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel={t("title", { dialect: dialectLabel })}
      maxWidthClass="max-w-3xl"
    >
      <div className="flex h-[68vh] min-h-[360px] max-h-[78vh]">
        {/* ─── Sidebar ─────────────────────────────────────────────── */}
        <nav className="w-52 shrink-0 border-r border-surface-dim dark:border-dark-dim bg-surface dark:bg-dark flex flex-col overflow-hidden">
          {/* Sidebar header */}
          <div className="px-3 py-2.5 border-b border-surface-dim dark:border-dark-dim flex items-center gap-2 shrink-0">
            <BookOpen className="w-4 h-4 text-primary-500 dark:text-primary-400" />
            <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-widest">
              {dialectLabel}
            </span>
          </div>

          {/* Section list */}
          <div className="flex-1 overflow-y-auto py-1 min-h-0">
            {reference.sections.map((section) => {
              const IconComponent = iconMap[section.icon] || Search;
              const isActive = section.title === activeSection;
              return (
                <button
                  key={section.title}
                  onClick={() => setActiveSection(section.title)}
                  className={`group/section relative w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-colors ${
                    isActive
                      ? "bg-primary-50/80 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-semibold"
                      : "text-ink-muted hover:text-ink hover:bg-surface-dim/50 dark:hover:bg-dark-dim/50"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-500 rounded-r" />
                  )}
                  <IconComponent className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-primary-500 dark:text-primary-400" : "text-ink-muted group-hover/section:text-ink"}`} />
                  <span className="truncate">{t(sectionTitleKey(section.title))}</span>
                  <span className="ml-auto text-[10px] text-ink-muted/50 tabular-nums shrink-0">
                    {section.items.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer hint for non-SQLite */}
          {dialect !== "sqlite" && (
            <div className="px-3 py-2 border-t border-surface-dim dark:border-dark-dim shrink-0">
              <div className="flex items-start gap-1.5">
                <Zap className="w-3 h-3 text-primary-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-ink-muted leading-relaxed">
                  {t("autoTranslatedHint", { dialect: dialectLabel })}
                </p>
              </div>
            </div>
          )}
        </nav>

        {/* ─── Content ─────────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Content header */}
          <div className="px-5 py-3 border-b border-surface-dim dark:border-dark-dim shrink-0 flex items-center gap-2">
            {(() => {
              const IconComponent = iconMap[activeSectionData.icon] || Search;
              return <IconComponent className="w-4 h-4 text-primary-500" />;
            })()}
            <h3 className="text-sm font-semibold text-ink">
              {t(sectionTitleKey(activeSectionData.title))}
            </h3>
            <span className="ml-auto text-[10px] text-ink-muted/50 tabular-nums">
              {activeSectionData.items.length} {t("itemCount")}
            </span>
          </div>

          {/* Content items */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {activeSectionData.items.map((item, i) => (
              <SyntaxItemRow key={`${activeSectionData.title}-${i}`} item={item} isLast={i === activeSectionData.items.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </AnimeLayoutModal>
  );
}

/* ─── Item Row ──────────────────────────────────────────────────────────── */

function SyntaxItemRow({ item, isLast }: { item: SyntaxItem; isLast: boolean }) {
  const t = useTranslations("syntaxRef");

  return (
    <div
      className={`px-5 py-2.5 transition-colors hover:bg-surface-dim/30 dark:hover:bg-dark-dim/30 ${
        isLast ? "" : "border-b border-surface-dim/50 dark:border-dark-dim/50"
      }`}
    >
      <div className="flex items-baseline gap-2">
        {/* Syntax code */}
        <code className="text-[13px] font-mono text-primary-700 dark:text-primary-300 whitespace-nowrap">
          {item.syntax}
        </code>

        {/* Not-supported indicator */}
        {item.notSupported && (
          <span className="inline-flex items-center gap-1 ml-auto shrink-0 text-[10px] font-medium text-error/70 dark:text-error/60">
            <AlertTriangle className="w-3 h-3" />
            {t("notSupported")}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="mt-0.5 text-xs text-ink-muted/80 leading-relaxed">
        {t(`items.${item.descriptionKey}`)}
      </p>
    </div>
  );
}