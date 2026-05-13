"use client";

import { useRef } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Header } from "@/components/header";
import { SandboxSidebar } from "@/components/sandbox/sandboxSidebar";
import { SandboxWorkspace, type SandboxWorkspaceHandle } from "@/components/sandbox/sandboxWorkspace";
import { useSandbox, getBuiltinDatasets } from "@/hooks/useSandbox";

export default function SandboxPage() {
  const sandbox = useSandbox();
  const workspaceRef = useRef<SandboxWorkspaceHandle>(null);
  const t = useTranslations("sandbox");
  const locale = useLocale();
  const builtinDatasets = getBuiltinDatasets(locale);

  return (
    <>
      {/* Desktop-only sandbox */}
      <div className="hidden md:flex h-screen flex-col" id="main-content">
        <h1 className="sr-only">{t("title")}</h1>
        <Header />

        <div className="flex-1 flex min-h-0 overflow-hidden">
          <SandboxSidebar
            dbList={sandbox.dbList}
            activeDbId={sandbox.activeDbId}
            liveSchema={sandbox.liveSchema}
            builtinDatasets={builtinDatasets}
            onCreateNew={sandbox.createNewDatabase}
            onOpen={sandbox.openDatabase}
            onClose={sandbox.closeActiveDatabase}
            onDelete={sandbox.deleteDatabase}
            onRename={sandbox.renameDatabase}
            onDuplicate={sandbox.duplicateDatabase}
            onImportFromSql={sandbox.importFromSql}
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
      <div className="md:hidden min-h-screen flex flex-col" id="main-content">
        <Header />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-sm">
            <svg className="w-16 h-16 text-ink-muted mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zM12 16v4M8 20h8" />
            </svg>
            <h1 className="text-xl font-bold text-ink">{t("mobileTitle")}</h1>
            <p className="text-sm text-ink-muted">
              {t("mobileDescription")}
            </p>
            <Link href="/" className="inline-block rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600 transition-colors">
              {t("backToHome")}
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
