"use client";

import { useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/header";
import { SandboxSidebar } from "@/components/sandbox/sandboxSidebar";
import { SandboxWorkspace, type SandboxWorkspaceHandle } from "@/components/sandbox/sandboxWorkspace";
import { useSandbox } from "@/hooks/useSandbox";

export default function SandboxPage() {
  const sandbox = useSandbox();
  const workspaceRef = useRef<SandboxWorkspaceHandle>(null);

  return (
    <>
      {/* Desktop-only sandbox */}
      <div className="hidden md:flex h-screen flex-col" id="main-content">
        <Header />

        <div className="flex-1 flex min-h-0 overflow-hidden">
          <SandboxSidebar
            dbList={sandbox.dbList}
            activeDbId={sandbox.activeDbId}
            liveSchema={sandbox.liveSchema}
            onCreateNew={sandbox.createNewDatabase}
            onOpen={sandbox.openDatabase}
            onClose={sandbox.closeActiveDatabase}
            onDelete={sandbox.deleteDatabase}
            onRename={sandbox.renameDatabase}
            onDuplicate={sandbox.duplicateDatabase}
            onTableClick={(tableName) =>
              void workspaceRef.current?.insertAndRun(`SELECT * FROM \`${tableName}\` LIMIT 50;`)
            }
            isLoading={sandbox.isLoading}
          />

          <SandboxWorkspace
            ref={workspaceRef}
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
            <svg className="w-16 h-16 text-ink-muted mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM12 16v4M8 20h8" />
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
