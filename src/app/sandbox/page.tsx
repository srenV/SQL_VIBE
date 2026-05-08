/**
 * Sandbox-Page – Freies SQL-Experimentier-Labor.
 *
 * Ermöglicht Benutzern, eigene Datenbanken zu erstellen, Tabellen
 * anzulegen/droppen, Daten einzufügen und beliebige SQL-Abfragen
 * auszuführen. Persistenz via IndexedDB.
 *
 * English: Sandbox page – Free SQL experimentation lab.
 * Allows users to create their own databases, create/drop tables,
 * insert data, and run arbitrary SQL queries. Persistence via IndexedDB.
 */

"use client";

import React from "react";
import { Header } from "@/components/header";
import { SandboxSidebar } from "@/components/sandbox/sandboxSidebar";
import { SandboxWorkspace } from "@/components/sandbox/sandboxWorkspace";
import { useSandbox } from "@/hooks/useSandbox";

export default function SandboxPage() {
  const sandbox = useSandbox();

  return (
    <div className="h-screen flex flex-col" id="main-content">
      <Header />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Sidebar: DB-Verwaltung */}
        <SandboxSidebar
          dbList={sandbox.dbList}
          activeDbId={sandbox.activeDbId}
          onCreateNew={sandbox.createNewDatabase}
          onOpen={sandbox.openDatabase}
          onDelete={sandbox.deleteDatabase}
          onRename={sandbox.renameDatabase}
          onDuplicate={sandbox.duplicateDatabase}
          isLoading={sandbox.isLoading}
        />

        {/* Workspace: Editor + Schema + Results */}
        <SandboxWorkspace
          db={sandbox.activeDb}
          liveSchema={sandbox.liveSchema}
          queryResult={sandbox.queryResult}
          queryHistory={sandbox.queryHistory}
          onRunQuery={sandbox.runQuery}
          onRefreshSchema={sandbox.refreshSchema}
          isLoading={sandbox.isLoading}
        />
      </div>
    </div>
  );
}