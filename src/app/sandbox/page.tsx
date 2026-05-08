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
import Link from "next/link";
import { Header } from "@/components/header";
import { SandboxSidebar } from "@/components/sandbox/sandboxSidebar";
import { SandboxWorkspace } from "@/components/sandbox/sandboxWorkspace";
import { useSandbox } from "@/hooks/useSandbox";

export default function SandboxPage() {
  const sandbox = useSandbox();

  return (
    <>
      {/* Desktop-only sandbox */}
      <div className="hidden md:flex h-screen flex-col" id="main-content">
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

      {/* Mobile message */}
      <div className="md:hidden min-h-screen flex flex-col" id="main-content-mobile">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-sm">
            <svg className="w-16 h-16 text-ink-muted mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3.249 3.249 0 00-.813 2.846 3.32 3.32 0 01-2.67 2.67 3.249 3.249 0 00-2.846.813M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <h2 className="text-xl font-bold text-ink">Sandbox nur auf Desktop verfügbar</h2>
            <p className="text-sm text-ink-muted">
              Die Sandbox benötigt einen größeren Bildschirm für den SQL-Editor und die Ergebnis-Anzeige.
              Bitte verwende einen Desktop-Browser oder vergrößere dein Fenster.
            </p>
            <Link href="/" className="inline-block">
              <button className="px-4 py-2 rounded-lg bg-primary-500 text-white font-medium text-sm hover:bg-primary-600 transition-colors">
                Zur Startseite
              </button>
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}