"use client";

import React from "react";
import { useTranslations } from "next-intl";
import type { SqlColumn, SqlRow } from "@/types/playground";

/**
 * ResultsetTable – Displays the results of an SQL query in a table.
 * Columns and rows are rendered from SqlColumn/SqlRow data.
 */
export interface ResultsetTableProps {
  columns: SqlColumn[];
  rows: SqlRow[];
  /** Table caption displayed above the table. */
  caption?: string;
}

export const ResultsetTable: React.FC<ResultsetTableProps> = ({ columns, rows, caption }) => {
  const t = useTranslations("sandbox");

  if (columns.length === 0 && rows.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        {t("noResultsDml")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        {caption && <caption className="caption-top text-left text-xs text-ink-muted mb-1">{caption}</caption>}
        <thead>
          <tr className="border-b border-surface-dim dark:border-dark-dim">
            {columns.map((col) => (
              <th
                key={col.name}
                scope="col"
                className="px-3 py-2 text-left font-semibold text-ink-muted whitespace-nowrap"
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={idx} className="border-b border-surface-dim/60 hover:bg-surface-dim/40 dark:border-dark-dim/60 dark:hover:bg-dark-dim/40 transition-colors">
              {columns.map((col) => (
                <td key={col.name} className="px-3 py-2 text-ink whitespace-nowrap">
                  {row[col.name] === null || row[col.name] === undefined ? (
                    <span className="text-ink-muted italic">NULL</span>
                  ) : (
                    String(row[col.name])
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
