"use client";

import React from "react";
import type { SchemaTable } from "@/types/playground";
import { Card } from "@/components/card";

export interface SchemaExplorerProps {
  tables: SchemaTable[];
}

export const SchemaExplorer: React.FC<SchemaExplorerProps> = ({ tables }) => {
  if (tables.length === 0) {
    return (
      <p className="text-sm text-ink-muted">
        Keine Tabellen in der aktuellen Datenbank.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {tables.map((table) => (
        <Card key={table.name} variant="flat" className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
              Tabelle
            </span>
            <span className="text-sm font-semibold text-ink">{table.name}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-surface-dim dark:border-dark-dim">
                  <th className="px-2 py-1 text-left font-medium text-ink-muted">Spalte</th>
                  <th className="px-2 py-1 text-left font-medium text-ink-muted">Typ</th>
                  <th className="px-2 py-1 text-left font-medium text-ink-muted">Nullable</th>
                  <th className="px-2 py-1 text-left font-medium text-ink-muted">Default</th>
                  <th className="px-2 py-1 text-left font-medium text-ink-muted">PK</th>
                </tr>
              </thead>
              <tbody>
                {table.columns.map((col) => (
                  <tr key={col.name} className="border-b border-surface-dim/50 dark:border-dark-dim/50">
                    <td className="px-2 py-1 text-ink">{col.name}</td>
                    <td className="px-2 py-1 text-ink-muted">{col.type}</td>
                    <td className="px-2 py-1 text-ink-muted">{col.nullable ? "Ja" : "Nein"}</td>
                    <td className="px-2 py-1 text-ink-muted">{col.defaultValue ?? "-"}</td>
                    <td className="px-2 py-1 text-ink-muted">{col.isPrimaryKey ? "PK" : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {table.foreignKeys && table.foreignKeys.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-ink-muted mb-1">Fremdschlüssel</p>
              <ul className="text-xs text-ink-muted space-y-1">
                {table.foreignKeys.map((fk, i) => (
                  <li key={i}>
                    {fk.column} → {fk.referencedTable}({fk.referencedColumn})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
