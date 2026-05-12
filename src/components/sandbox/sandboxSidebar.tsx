"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import type { SchemaTable } from "@/types/playground";
import type { SandboxDatabaseMeta } from "@/types/sandbox";
import type { Dataset } from "@/types/exercise";

export interface SandboxSidebarProps {
  dbList: SandboxDatabaseMeta[];
  activeDbId: string | null;
  liveSchema: SchemaTable[];
  builtinDatasets: Dataset[];
  onCreateNew: (name: string) => Promise<string>;
  onOpen: (id: string) => Promise<void>;
  onClose: () => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onRename: (id: string, newName: string) => Promise<void>;
  onDuplicate: (id: string, newName: string) => Promise<string>;
  onImportFromSql: (name: string, sql: string) => Promise<string>;
  onTableClick: (tableName: string) => void;
  isLoading: boolean;
}

function formatBytes(bytes?: number): string {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function DatabaseIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5 0v3.75m16.5 0v3.75m-16.5 0v3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  );
}

function TableIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" />
      <line x1="1.5" y1="6.5" x2="14.5" y2="6.5" />
      <line x1="6" y1="6.5" x2="6" y2="13" />
    </svg>
  );
}

const menuVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.12, ease: [0.25, 0.46, 0.45, 0.94] as const } },
  exit: { opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.1, ease: "easeIn" as const } },
};

export const SandboxSidebar: React.FC<SandboxSidebarProps> = ({
  dbList,
  activeDbId,
  liveSchema,
  builtinDatasets,
  onCreateNew,
  onOpen,
  onClose,
  onDelete,
  onRename,
  onDuplicate,
  onImportFromSql,
  onTableClick,
  isLoading,
}) => {
  const t = useTranslations("sandbox");
  const [isCreating, setIsCreating] = useState(false);
  const [newDbName, setNewDbName] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [expandedDbIds, setExpandedDbIds] = useState<Set<string>>(new Set());
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** Max file size for SQL import (5 MB). */
  const MAX_SQL_FILE_SIZE = 5 * 1024 * 1024;

  /** Sanitize a file name for use as a database name. */
  const sanitizeDbName = (raw: string): string => {
    return raw
      .replace(/\.sql$/i, "")       // remove extension
      .replace(/[<>:"/\\|?*\x00-\x1f]/g, "")  // remove illegal chars
      .replace(/^\.+/, "")          // no leading dots
      .replace(/\s+/g, " ")         // collapse whitespace
      .trim()
      .slice(0, 100)                // max 100 chars
      || t("importedDatabase");   // fallback
  };

  // Auto-expand newly active DB
  useEffect(() => {
    if (activeDbId) {
      setExpandedDbIds((prev) => new Set([...prev, activeDbId]));
    }
  }, [activeDbId]);

  // Close menu on outside click
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
    const name = newDbName.trim() || t("newDatabase");
    setIsCreating(false);
    setNewDbName("");
    const id = await onCreateNew(name);
    await onOpen(id);
  };

  const handleImportDataset = async () => {
    if (!selectedDatasetId) return;
    const dataset = builtinDatasets.find((d) => d.id === selectedDatasetId);
    if (!dataset) return;
    setImportError(null);
    setIsImporting(true);
    try {
      const id = await onImportFromSql(dataset.name, dataset.sql);
      await onOpen(id);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : t("importFailed"));
    } finally {
      setIsImporting(false);
      setSelectedDatasetId("");
      setIsImportOpen(false);
    }
  };

  const handleFileImport = async (file: File) => {
    if (!file.name.endsWith(".sql")) return;
    setImportError(null);
    if (file.size > MAX_SQL_FILE_SIZE) {
      setImportError(t("fileTooLarge", { size: (file.size / 1024 / 1024).toFixed(1) }));
      return;
    }
    setIsImporting(true);
    try {
      const sql = await file.text();
      const name = sanitizeDbName(file.name);
      const id = await onImportFromSql(name, sql);
      await onOpen(id);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : t("importFailed"));
    } finally {
      setIsImporting(false);
      setIsImportOpen(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (!file.name.endsWith(".sql")) {
      setImportError(t("invalidFileType"));
      return;
    }
    if (file.size > MAX_SQL_FILE_SIZE) {
      setImportError(t("fileTooLarge", { size: (file.size / 1024 / 1024).toFixed(1) }));
      return;
    }
    void handleFileImport(file);
  }, [handleFileImport]);

  const handleRename = async (id: string) => {
    const newName = renameValue.trim();
    if (newName) await onRename(id, newName);
    setRenamingId(null);
    setRenameValue("");
  };

  const handleDuplicate = async (id: string) => {
    const source = dbList.find((db) => db.id === id);
    const name = source ? `${source.name} (${t("copy")})` : t("duplicate");
    const newId = await onDuplicate(id, name);
    await onOpen(newId);
    setMenuOpenId(null);
  };

  const handleDelete = async (id: string) => {
    const source = dbList.find((db) => db.id === id);
    if (confirm(t("confirmDelete", { name: source?.name ?? id }))) {
      await onDelete(id);
    }
    setMenuOpenId(null);
  };

  const handleChevron = (e: React.MouseEvent, db: SandboxDatabaseMeta) => {
    e.stopPropagation();
    if (db.id === activeDbId) {
      setExpandedDbIds((prev) => {
        const next = new Set(prev);
        if (next.has(db.id)) next.delete(db.id);
        else next.add(db.id);
        return next;
      });
    } else {
      void onOpen(db.id); // auto-expands via useEffect
    }
  };

  return (
    <motion.aside
      className="w-72 shrink-0 border-r border-surface-dim dark:border-dark-dim bg-surface dark:bg-dark flex flex-col h-full overflow-hidden"
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-surface-dim dark:border-dark-dim flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <DatabaseIcon className="w-4 h-4 text-primary-500 dark:text-primary-400" />
          <span className="text-[11px] font-semibold text-ink-muted uppercase tracking-widest">Explorer</span>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          disabled={isLoading}
          className="rounded-md p-1.5 text-ink-muted hover:text-ink hover:bg-surface-dim dark:hover:bg-dark-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title={t("createDatabase")}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* Inline Create Input */}
      <AnimatePresence>
        {isCreating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden shrink-0 border-b border-surface-dim dark:border-dark-dim"
          >
            <div className="flex gap-1.5 px-3 py-2">
              <input
                type="text"
                value={newDbName}
                onChange={(e) => setNewDbName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreate();
                  if (e.key === "Escape") { setIsCreating(false); setNewDbName(""); }
                }}
                placeholder={t("placeholderDbName")}
                className="flex-1 min-w-0 rounded-md border border-primary-300 dark:border-primary-700 bg-surface px-2 py-1 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
              <button
                onClick={handleCreate}
                className="rounded-md px-2 py-1 text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors"
              >
                OK
              </button>
              <button
                onClick={() => { setIsCreating(false); setNewDbName(""); }}
                className="rounded-md px-2 py-1 text-xs text-ink-muted hover:text-ink bg-surface-dim dark:bg-dark-dim transition-colors"
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Import Section */}
      <div className="border-b border-surface-dim dark:border-dark-dim shrink-0">
        <button
          onClick={() => setIsImportOpen(!isImportOpen)}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-ink-muted hover:text-ink hover:bg-surface-dim/50 dark:hover:bg-dark-dim/50 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {t("importData")}
          <svg
            className={`w-3 h-3 ml-auto transition-transform duration-200 ${isImportOpen ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        <AnimatePresence>
          {isImportOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-2.5 space-y-2">
                {/* Dropdown for built-in datasets */}
                <div className="flex gap-1.5">
                  <select
                    value={selectedDatasetId}
                    onChange={(e) => setSelectedDatasetId(e.target.value)}
                    disabled={isImporting}
                    className="flex-1 min-w-0 rounded-md border border-surface-dim dark:border-dark-dim bg-surface dark:bg-dark px-2 py-1.5 text-xs text-ink focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    <option value="">{t("builtinDatasets")}</option>
                    {builtinDatasets.map((ds) => (
                      <option key={ds.id} value={ds.id}>{ds.name}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => void handleImportDataset()}
                    disabled={!selectedDatasetId || isImporting}
                    className="rounded-md px-2.5 py-1.5 text-xs font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isImporting ? "…" : t("loadDataset")}
                  </button>
                </div>

                {/* Upload button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isImporting}
                  className="w-full flex items-center justify-center gap-1.5 rounded-md border border-dashed border-surface-dim dark:border-dark-dim px-2 py-1.5 text-xs text-ink-muted hover:text-ink hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors disabled:opacity-50"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  {t("uploadFile")}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".sql"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleFileImport(file);
                    e.target.value = "";
                  }}
                />

                {/* Drag & Drop zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`rounded-md border border-dashed px-2 py-3 text-center text-[11px] transition-colors ${
                    isDragOver
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      : "border-surface-dim dark:border-dark-dim text-ink-muted"
                  }`}
                >
                  <svg className="w-5 h-5 mx-auto mb-1 text-ink-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m3 0l-3-3m3 3l3-3M3.75 21h16.5" />
                  </svg>
                  {t("dragDrop")}
                </div>

                {/* Error message */}
                {importError && (
                  <p className="text-[11px] text-error leading-snug">{importError}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DB List */}
      <div className="flex-1 overflow-y-auto min-h-0 py-1">
        {dbList.length === 0 && !isCreating && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="flex flex-col items-center justify-center py-10 px-4 text-center"
          >
            <DatabaseIcon className="w-8 h-8 text-surface-dim dark:text-dark-dim mb-2" />
            <p className="text-xs text-ink-muted font-medium">{t("noDatabase")}</p>
            <p className="text-[11px] text-ink-muted mt-0.5">{t("noDatabaseHint")}</p>
          </motion.div>
        )}

        {dbList.map((db, index) => {
          const isActive = db.id === activeDbId;
          const isRenaming = db.id === renamingId;
          const showMenu = db.id === menuOpenId;
          const isExpanded = isActive && expandedDbIds.has(db.id);

          return (
            <motion.div
              key={db.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.25, ease: "easeOut" }}
              className="relative"
            >
              {/* Active left-border indicator — spans full height of item incl. expanded tree */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary-500 rounded-r z-10 pointer-events-none" />
              )}

              {/* DB Row */}
              <div
                className={`group/row flex items-center gap-1 px-2 py-1.5 transition-colors ${
                  isActive
                    ? "bg-primary-50/80 dark:bg-primary-900/20"
                    : "hover:bg-surface-dim/50 dark:hover:bg-dark-dim/50"
                }`}
              >
                {/* Chevron toggle */}
                <button
                  onClick={(e) => handleChevron(e, db)}
                  className="shrink-0 rounded p-0.5 text-ink-muted hover:text-ink hover:bg-surface-dim dark:hover:bg-dark-dim transition-colors"
                  title={isActive ? (isExpanded ? t("collapse") : t("expand")) : t("openAndExpand")}
                >
                  <svg
                    className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>

                {/* DB icon */}
                <DatabaseIcon
                  className={`shrink-0 w-3.5 h-3.5 ${isActive ? "text-primary-500 dark:text-primary-400" : "text-ink-muted"}`}
                />

                {/* Name / inline rename */}
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
                    className="flex-1 min-w-0 rounded border border-primary-300 dark:border-primary-700 bg-surface px-1 py-0.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-primary-500"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <button
                    className={`flex-1 min-w-0 text-xs text-left truncate transition-colors ${
                      isActive
                        ? "font-semibold text-primary-700 dark:text-primary-300"
                        : "font-medium text-ink"
                    }`}
                    onClick={() => void onOpen(db.id)}
                    onDoubleClick={() => { setRenamingId(db.id); setRenameValue(db.name); }}
                    title={db.name}
                  >
                    {db.name}
                  </button>
                )}

                {/* Size badge — appears on hover */}
                {!isRenaming && db.sizeBytes !== undefined && (
                  <span className="shrink-0 text-[10px] text-ink-muted opacity-0 group-hover/row:opacity-100 transition-opacity whitespace-nowrap">
                    {formatBytes(db.sizeBytes)}
                  </span>
                )}

                {/* × Close (active DB only) */}
                {isActive && !isRenaming && (
                  <button
                    onClick={() => { void onClose(); }}
                    className="shrink-0 rounded p-0.5 text-ink-muted hover:text-error hover:bg-error/10 transition-colors opacity-0 group-hover/row:opacity-100"
                    title={t("closeDatabase")}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {/* ⋮ Context menu trigger */}
                {!isRenaming && (
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(showMenu ? null : db.id); }}
                    className={`shrink-0 rounded p-0.5 hover:bg-surface-dim dark:hover:bg-dark-dim transition-opacity ${
                      showMenu ? "opacity-100" : "opacity-0 group-hover/row:opacity-100"
                    }`}
                    title={t("actions")}
                  >
                    <svg className="w-3.5 h-3.5 text-ink-muted" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Table tree (active DB only) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    {isLoading ? (
                      <p className="pl-9 py-1.5 text-[11px] text-ink-muted italic">{t("importing")}</p>
                    ) : liveSchema.length === 0 ? (
                      <p className="pl-9 py-1.5 pr-3 text-[11px] text-ink-muted italic leading-relaxed">
                        {t("noTablesHint")}
                      </p>
                    ) : (
                      liveSchema.map((table) => (
                        <button
                          key={table.name}
                          onClick={() => onTableClick(table.name)}
                          className="w-full flex items-center gap-2 pl-8 pr-3 py-1.5 hover:bg-primary-50/60 dark:hover:bg-primary-900/20 text-left transition-colors"
                          title={`SELECT * FROM \`${table.name}\` LIMIT 50`}
                        >
                          <TableIcon className="shrink-0 w-3.5 h-3.5 text-ink-muted" />
                          <span className="flex-1 min-w-0 text-xs text-ink truncate">{table.name}</span>
                          <span className="shrink-0 text-[10px] text-ink-muted tabular-nums">
                            {table.columns.length} {t("columnsShort")}
                          </span>
                        </button>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Context menu dropdown */}
              <AnimatePresence>
                {showMenu && !isRenaming && (
                  <motion.div
                    ref={menuRef}
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ transformOrigin: "top right" }}
                    className="absolute right-2 top-8 z-20 mt-0.5 w-44 rounded-lg border border-surface-dim dark:border-dark-dim bg-surface dark:bg-dark shadow-lg py-1 text-sm"
                  >
                    <button
                      onClick={() => { setRenamingId(db.id); setRenameValue(db.name); setMenuOpenId(null); }}
                      className="w-full text-left px-3 py-2 hover:bg-surface-dim dark:hover:bg-dark-dim text-ink flex items-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l1.139-3.684a4.5 4.5 0 011.13-1.897l8.633-8.932z" />
                      </svg>
                      {t("renameDatabase")}
                    </button>
                    <button
                      onClick={() => handleDuplicate(db.id)}
                      className="w-full text-left px-3 py-2 hover:bg-surface-dim dark:hover:bg-dark-dim text-ink flex items-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375C8.754 2.25 8.25 2.754 8.25 3.375v3.375" />
                      </svg>
                      {t("duplicateDatabase")}
                    </button>
                    <hr className="my-1 border-surface-dim dark:border-dark-dim" />
                    <button
                      onClick={() => handleDelete(db.id)}
                      className="w-full text-left px-3 py-2 hover:bg-error/10 text-error flex items-center gap-2"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      {t("deleteDatabase")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-surface-dim dark:border-dark-dim shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] text-ink-muted">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          {t("storedLocally")}
        </div>
      </div>
    </motion.aside>
  );
};
