/**
 * ArticlePageClient – Client-Komponente fuer die Artikel-Seite.
 *
 * Enthaelt alle interaktiven Elemente (Mini-Playgrounds, Navigation,
 * Inhaltsverzeichnis). Wird von der Server-Component page.tsx gerendert.
 *
 * English: Client component for the article page.
 * Contains all interactive elements (mini playgrounds, navigation,
 * table of contents). Rendered by the server component page.tsx.
 */

"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { getModuleById, getArticle } from "@/data/learnContent";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { Button } from "@/components/button";
import { SqlEditor } from "@/components/sqlEditor";
import { ResultsetTable } from "@/components/resultsetTable";
import { FadeIn } from "@/components/animations";
import { createDatabase, runQuery } from "@/lib/sqlEngine";
import type { SandboxQueryResult } from "@/types/sandbox";

export interface ArticlePageClientProps {
  params: Promise<{ moduleId: string; articleId: string }>;
}

export function ArticlePageClient({ params }: ArticlePageClientProps) {
  const { moduleId, articleId } = use(params);

  const mod = getModuleById(moduleId);
  const article = mod ? getArticle(moduleId, articleId) : undefined;

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [miniPlaygrounds, setMiniPlaygrounds] = useState<Record<string, {
    query: string;
    result: SandboxQueryResult | null;
    isLoading: boolean;
  }>>({});

  // Mini-Playgrounds initialisieren
  useEffect(() => {
    if (!article) return;
    const initial: Record<string, { query: string; result: SandboxQueryResult | null; isLoading: boolean }> = {};
    article.sections.forEach((section) => {
      if (section.sqlExample) {
        initial[section.id] = {
          query: section.sqlExample,
          result: null,
          isLoading: false,
        };
      }
    });
    setMiniPlaygrounds(initial);
  }, [article]);

  const runMiniQuery = async (sectionId: string, setupSql: string | undefined, query: string) => {
    setMiniPlaygrounds((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], isLoading: true },
    }));

    try {
      const db = await createDatabase(setupSql || "");
      const result = runQuery(db, query);
      db.close();

      setMiniPlaygrounds((prev) => ({
        ...prev,
        [sectionId]: {
          query,
          result: {
            ...result,
            rowsModified: 0,
            statementType: "DQL" as const,
          },
          isLoading: false,
        },
      }));
    } catch (err) {
      setMiniPlaygrounds((prev) => ({
        ...prev,
        [sectionId]: {
          query,
          result: {
            success: false,
            error: err instanceof Error ? err.message : String(err),
            rowsModified: 0,
          },
          isLoading: false,
        },
      }));
    }
  };

  if (!mod || !article) {
    return (
      <div className="min-h-screen flex flex-col" id="main-content">
        <Header />
        <main className="flex-1 py-12">
          <Container className="text-center">
            <h1 className="text-2xl font-bold text-ink">Nicht gefunden</h1>
            <p className="text-ink-muted mt-2">Dieser Artikel existiert nicht.</p>
            <Link href="/lernen">
              <Button variant="secondary" className="mt-4">Zurück zum Lern-Hub</Button>
            </Link>
          </Container>
        </main>
      </div>
    );
  }

  const articleIndex = mod.articles.findIndex((a) => a.id === articleId);
  const prevArticle = articleIndex > 0 ? mod.articles[articleIndex - 1] : null;
  const nextArticle = articleIndex < mod.articles.length - 1 ? mod.articles[articleIndex + 1] : null;

  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header
        breadcrumbs={
          <>
            <Link href="/lernen" className="text-ink-muted hover:text-ink transition-colors">
              Lernen
            </Link>
            <span className="text-ink-muted">/</span>
            <Link href={`/lernen/${mod.id}`} className="text-ink-muted hover:text-ink transition-colors">
              {mod.title}
            </Link>
            <span className="text-ink-muted">/</span>
            <span className="text-sm font-medium text-ink">{article.title}</span>
          </>
        }
      />

      <main className="flex-1 py-8">
        <Container>
          <div className="flex gap-8 max-w-5xl mx-auto">
            {/* Sidebar: Inhaltsverzeichnis */}
            <nav className="hidden lg:block w-56 shrink-0">
              <div className="sticky top-24 space-y-1">
                <p className="text-xs font-semibold text-ink-muted mb-2">Inhalt</p>
                {article.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      setActiveSection(section.id);
                      document.getElementById(`section-${section.id}`)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`block w-full text-left rounded px-2 py-1 text-xs transition-colors ${
                      activeSection === section.id
                        ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </nav>

            {/* Article Content */}
            <div className="flex-1 min-w-0 space-y-8">
              <FadeIn delay={0}>
                <div className="space-y-2">
                  <div className="text-2xl" aria-hidden="true">{mod.icon}</div>
                  <h1 className="text-2xl font-bold text-ink">{article.title}</h1>
                  <p className="text-sm text-ink-muted">
                    {article.estimatedMinutes} Min. Lesezeit · {article.sections.length} Abschnitte
                  </p>
                </div>
              </FadeIn>

              {article.sections.map((section) => (
                <FadeIn key={section.id} delay={0.05}>
                  <section id={`section-${section.id}`} className="scroll-mt-24">
                    <Card variant="flat" className="p-6">
                      <h2 className="text-lg font-semibold text-ink mb-3">{section.title}</h2>
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none text-ink space-y-3"
                        dangerouslySetInnerHTML={{
                          __html: renderMarkdown(section.content),
                        }}
                      />

                      {/* SQL-Beispiel mit Mini-Playground */}
                      {section.sqlExample && miniPlaygrounds[section.id] && (
                        <div className="mt-6 border-t border-surface-dim dark:border-dark-dim pt-4">
                          <h3 className="text-sm font-semibold text-ink mb-2">SQL-Beispiel ausprobieren</h3>
                          <SqlEditor
                            value={miniPlaygrounds[section.id].query}
                            onChange={(e) =>
                              setMiniPlaygrounds((prev) => ({
                                ...prev,
                                [section.id]: { ...prev[section.id], query: e.target.value },
                              }))
                            }
                            onSubmit={() =>
                              runMiniQuery(section.id, section.setupSql, miniPlaygrounds[section.id].query)
                            }
                            placeholder="SQL eingeben..."
                          />
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                runMiniQuery(section.id, section.setupSql, miniPlaygrounds[section.id].query)
                              }
                              disabled={miniPlaygrounds[section.id].isLoading}
                            >
                              Ausführen
                            </Button>
                          </div>
                          {miniPlaygrounds[section.id].result && (
                            <div className="mt-3">
                              {(() => {
                                const r = miniPlaygrounds[section.id].result!;
                                if (r.success && r.resultset && r.resultset.rows.length > 0) {
                                  return <ResultsetTable columns={r.resultset.columns} rows={r.resultset.rows} />;
                                }
                                if (r.success) {
                                  return <p className="text-xs text-success font-medium">Befehl ausgeführt.</p>;
                                }
                                return <p className="text-xs text-error font-medium">{r.error}</p>;
                              })()}
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  </section>
                </FadeIn>
              ))}

              {/* Navigation: Vorheriger/Nächster Artikel */}
              <div className="flex items-center justify-between pt-6 border-t border-surface-dim dark:border-dark-dim">
                {prevArticle ? (
                  <Link
                    href={`/lernen/${mod.id}/${prevArticle.id}`}
                    className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    &larr; {prevArticle.title}
                  </Link>
                ) : (
                  <span />
                )}
                {nextArticle ? (
                  <Link
                    href={`/lernen/${mod.id}/${nextArticle.id}`}
                    className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
                  >
                    {nextArticle.title} &rarr;
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}

/** Einfacher Markdown-Renderer fuer Lern-Inhalte. */
function renderMarkdown(text: string): string {
  return text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="rounded bg-surface-dim dark:bg-dark-dim px-1 py-0.5 text-xs font-mono">$1</code>')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="rounded-lg bg-surface-dim dark:bg-dark-dim p-3 text-xs font-mono overflow-x-auto"><code>$2</code></pre>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-ink mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-ink mt-4 mb-2">$1</h2>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-sm text-ink">$1</li>')
    // Tables (simple)
    .replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split("|").filter(Boolean).map((c) => c.trim());
      if (cells.every((c) => c.match(/^[-:]+$/))) return ""; // Separator row
      return `<tr>${cells.map((c) => `<td class="px-2 py-1 text-sm text-ink border border-surface-dim dark:border-dark-dim">${c}</td>`).join("")}</tr>`;
    })
    // Paragraphs (double newlines)
    .replace(/\n\n/g, "</p><p class='text-sm text-ink leading-relaxed'>")
    // Single newlines within paragraphs
    .replace(/\n/g, "<br/>")
    // Wrap in paragraph
    .replace(/^(.+)$/, "<p class='text-sm text-ink leading-relaxed'>$1</p>");
}