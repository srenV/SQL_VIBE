/**
 * ModuleIcons – SVG-Icon-Komponenten fuer Lernmodule.
 *
 * Ersetzt Emoji-Icons durch Inline-SVGs, um keine externen
 * Abhaengigkeiten zu haben und konsistentes Styling zu gewaehrleisten.
 *
 * English: SVG icon components for learning modules.
 * Replaces emoji icons with inline SVGs for no external dependencies
 * and consistent styling.
 */

import React from "react";

interface ModuleIconProps {
  className?: string;
}

/** Ruler/Measure icon (Normalisierung) */
export function RulerIcon({ className = "w-8 h-8" }: ModuleIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
  );
}

/** Link icon (Relationenmodell) */
export function LinkIcon({ className = "w-8 h-8" }: ModuleIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.342" />
    </svg>
  );
}

/** Bar chart icon (ERM / Window Functions) */
export function BarChartIcon({ className = "w-8 h-8" }: ModuleIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

/** Code/Terminal icon (SQL-Grundlagen) */
export function CodeIcon({ className = "w-8 h-8" }: ModuleIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
    </svg>
  );
}

/** Merge/Arrows icon (Joins) */
export function MergeIcon({ className = "w-8 h-8" }: ModuleIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  );
}

/** Building icon (DDL) */
export function BuildingIcon({ className = "w-8 h-8" }: ModuleIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-6.75h3.75m-3.75 0V7.5h3.75m-3.75 0V4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125V7.5m0 0h3.75m-3.75 0v6.75m3.75-6.75h3.75m-3.75 0V4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125V7.5m0 0h3.75m-3.75 0v6.75m3.75-6.75h3.75m0 0v6.75" />
    </svg>
  );
}

/** Search icon (Subqueries) */
export function SearchIcon({ className = "w-8 h-8" }: ModuleIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  );
}

/** Pencil icon (DML) */
export function PencilIcon({ className = "w-8 h-8" }: ModuleIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  );
}

/** Refresh icon (CTEs) */
export function RefreshIcon({ className = "w-8 h-8" }: ModuleIconProps) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.852c.963 0 1.445.733 1.075 1.638l-2.51 6.024c-.38.907-1.427.907-1.807 0l-2.51-6.024c-.37-.905.112-1.638 1.075-1.638zM7.977 14.652H3.125c-.963 0-1.445-.733-1.075-1.638l2.51-6.024c.38-.907 1.427-.907 1.807 0l2.51 6.024c.37.905-.112 1.638-1.075 1.638z" />
    </svg>
  );
}

/** Small inline SVG icons for section type badges and other inline use */
export const InlineIcons = {
  /** Book-open icon for "theory" section type */
  bookOpen: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  /** Lightbulb icon for "example" section type */
  lightbulb: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  ),
  /** Pencil icon for "practice" section type */
  pencil: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  ),
  /** Clipboard icon for "summary" section type */
  clipboard: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.171a48.584 48.584 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .12.154.29.74.598a4.483 4.483 0 012.14 2.613c.462 1.527.09 3.2-.932 4.39a5.418 5.418 0 01-4.19 1.856 5.418 5.418 0 01-4.19-1.856c-1.022-1.19-1.394-2.863-.932-4.39a4.483 4.483 0 012.14-2.613c.586-.308.74-.478.74-.598 0-.231-.035-.454-.1-.664m-.801 0H5.25A2.25 2.25 0 003 6.108v8.642A2.25 2.25 0 005.25 17.25h1.372" />
    </svg>
  ),
  /** Key icon for primary keys */
  key: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
    </svg>
  ),
  /** Link icon for foreign keys (small inline) */
  link: (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.54a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.34 8.342" />
    </svg>
  ),
  /** Checkmark icon */
  check: (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ),
  /** Warning triangle icon */
  warning: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
};

/** Map module IDs to their icon components. */
export const moduleIconMap: Record<string, React.ComponentType<ModuleIconProps>> = {
  normalisierung: RulerIcon,
  relationenmodell: LinkIcon,
  erm: BarChartIcon,
  "sql-grundlagen": CodeIcon,
  joins: MergeIcon,
  ddl: BuildingIcon,
  subqueries: SearchIcon,
  dml: PencilIcon,
  ctes: RefreshIcon,
  "window-functions": BarChartIcon,
};

/** Render a module icon by module ID. Falls back to BarChartIcon. */
export function getModuleIcon(moduleId: string): React.ComponentType<ModuleIconProps> {
  return moduleIconMap[moduleId] ?? BarChartIcon;
}