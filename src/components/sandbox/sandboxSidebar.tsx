/**
 * SandboxSidebar – Datenbank-Verwaltung fuer den Sandbox-Modus.
 *
 * Zeigt eine Liste aller User-Datenbanken an und bietet Aktionen
 * zum Erstellen, Umbenennen, Duplizieren und Loeschen.
 *
 * English: SandboxSidebar – Database management for the Sandbox mode.
 * Shows a list of all user databases and offers actions for
 * creating, renaming, duplicating, and deleting.
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/button";
import type { SandboxDatabaseMeta } from "@/types/sandbox";

export interface SandboxSidebarProps {
  dbList: SandboxDatabaseMeta[];
  activeDbId: string | null;
  onCreateNew: (name: string) => Promise<string>;
  onOpen: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, newName: string) => Promise<void>;
  onDuplicate: (id: string, newName: string) => Promise<string>;
  isLoading: boolean;
}

/** Formatiert Bytes als menschenlesbaren String. */
function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/** Datenbank-Icon als SVG. */
function DatabaseIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5 0v3.75m16.5 0v3.75m-16.5 0v3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  );
}

export const SandboxSidebar: React.FC<SandboxSidebarProps> = ({
  dbList,
  activeDbId,
  onCreateNew,
  onOpen,
  onDelete,
  onRename,
  onDuplicate,
  isLoading,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newDbName, setNewDbName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Klick außerhalb schließt das Menü
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    if (menuOpenId) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpenId]);

  const handleCreate = async () => {
    const name = newDbName.trim() || "Neue Datenbank";
    setIsCreating(false);
    setNewDbName("");
    const id = await onCreateNew(name);
    await onOpen(id);
  };

  const handleRename = async (id: string) => {
    const newName = renameValue.trim();
    if (newName) {
      await onRename(id, newName);
    }
    setRenamingId(null);
    setRenameValue("");
  };

  const handleDuplicate = async (id: string) => {
    const source = dbList.find((db) => db.id === id);
    const name = source ? `${source.name} (Kopie)` : "Duplikat";
    const newId = await onDuplicate(id, name);
    await onOpen(newId);
    setMenuOpenId(null);
  };

  const handleDelete = async (id: string) => {
    const source = dbList.find((db) => db.id === id);
    if (confirm(`Datenbank "${source?.name ?? id}" wirklich löschen?`)) {
      await onDelete(id);
    }
    setMenuOpenId(null);
  };

  return (
    <aside className="w-72 shrink-0 border-r border-surface-dim dark:border-dark-dim bg-surface dark:bg-dark flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-surface-dim dark:border-dark-dim">
        <div className="flex items-center gap-2 mb-3">
          <DatabaseIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h2 className="text-sm font-semibold text-ink">Datenbanken</h2>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isLoading}
          className="w-full inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 dark:bg-primary-500 dark:hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Neue Datenbank erstellen"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Neue Datenbank
        </button>

        {/* Neue DB erstellen (Inline-Input) */}
        {isCreating && (
          <div className="flex gap-1.5 mt-1">
            <input
              type="text"
              value={newDbName}
              onChange={(e) => setNewDbName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
                if (e.key === "Escape") { setIsCreating(false); setNewDbName(""); }
              }}
              placeholder="Name der Datenbank…"
              className="flex-1 min-w-0 rounded-md border border-primary-300 dark:border-primary-700 bg-surface px-2 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
            <button
              onClick={handleCreate}
              className="rounded-md px-2.5 py-1.5 text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              OK
            </button>
            <button
              onClick={() => { setIsCreating(false); setNewDbName(""); }}
              className="rounded-md px-2.5 py-1.5 text-xs font-medium bg-surface-dim dark:bg-dark-dim text-ink-muted hover:text-ink transition-colors"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* DB-Liste */}
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {dbList.length === 0 && !isCreating && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <DatabaseIcon className="w-10 h-10 text-surface-dim dark:text-dark-dim mb-3" />
            <p className="text-sm text-ink-muted font-medium">Keine Datenbanken</p>
            <p className="text-xs text-ink-muted mt-1">
              Klicke &quot;Neu&quot; um eine Datenbank zu erstellen.
            </p>
          </div>
        )}

        {dbList.map((db) => {
          const isActive = db.id === activeDbId;
          const isRenaming = db.id === renamingId;
          const showMenu = db.id === menuOpenId;

          return (
            <div key={db.id} className="relative group">
              <div
                role="button"
                tabIndex={0}
                onClick={() => !isRenaming && onOpen(db.id)}
                onKeyDown={(e) => { if (e.key === "Enter" && !isRenaming) onOpen(db.id); }}
                className={`w-full text-left rounded-lg px-3 py-2.5 text-sm transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 ring-1 ring-primary-200 dark:ring-primary-800"
                    : "text-ink hover:bg-surface-dim/60 dark:hover:bg-dark-dim/60"
                }`}
                onDoubleClick={() => {
                  setRenamingId(db.id);
                  setRenameValue(db.name);
                }}
              >
                {isRenaming ? (
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(db.id);
                      if (e.key === "Escape") { setRenamingId(null); setRenameValue(""); }
                    }}
                    onBlur={() => handleRename(db.id)}
                    className="w-full rounded border border-primary-300 dark:border-primary-700 bg-surface px-1.5 py-0.5 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-primary-500"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <div className="flex items-start gap-2.5">
                    <DatabaseIcon className={`w-4 h-4 mt-0.5 shrink-0 ${isActive ? "text-primary-600 dark:text-primary-400" : "text-ink-muted"}`} />
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate leading-tight">{db.name}</div>
                      <div className="flex items-center gap-1.5 mt-1 text-[11px] text-ink-muted">
                        <span>{formatBytes(db.sizeBytes)}</span>
                        <span className="text-ink-muted/40">·</span>
                        <span>{new Date(db.updatedAt).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" })}</span>
                      </div>
                    </div>
                    {/* Drei-Punkte-Menü-Button (sichtbar bei Hover) */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(showMenu ? null : db.id);
                      }}
                      className={`shrink-0 rounded p-0.5 transition-opacity ${showMenu ? "opacity-100" : "opacity-0 group-hover:opacity-100"} hover:bg-surface-dim dark:hover:bg-dark-dim`}
                      title="Aktionen"
                    >
                      <svg className="w-4 h-4 text-ink-muted" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Dropdown-Menü */}
              {showMenu && !isRenaming && (
                <div ref={menuRef} className="absolute right-2 top-full z-20 mt-1 w-44 rounded-lg border border-surface-dim dark:border-dark-dim bg-surface dark:bg-dark shadow-lg py-1 text-sm">
                  <button
                    onClick={() => { setRenamingId(db.id); setRenameValue(db.name); setMenuOpenId(null); }}
                    className="w-full text-left px-3 py-2 hover:bg-surface-dim dark:hover:bg-dark-dim text-ink flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l1.139-3.684a4.5 4.5 0 011.13-1.897l8.633-8.932z" />
                    </svg>
                    Umbenennen
                  </button>
                  <button
                    onClick={() => handleDuplicate(db.id)}
                    className="w-full text-left px-3 py-2 hover:bg-surface-dim dark:hover:bg-dark-dim text-ink flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375C8.754 2.25 8.25 2.754 8.25 3.375v3.375" />
                    </svg>
                    Duplizieren
                  </button>
                  <hr className="my-1 border-surface-dim dark:border-dark-dim" />
                  <button
                    onClick={() => handleDelete(db.id)}
                    className="w-full text-left px-3 py-2 hover:bg-error/10 text-error flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                    Löschen
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-surface-dim dark:border-dark-dim">
        <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          Daten werden lokal im Browser gespeichert
        </div>
      </div>
    </aside>
  );
};