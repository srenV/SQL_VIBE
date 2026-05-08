/**
 * ArticlePageClient – Client-Komponente fuer die Artikel-Seite.
 *
 * Enthaelt alle interaktiven Elemente (Navigation,
 * Inhaltsverzeichnis, Fortschritts-Tracking, Widgets).
 * Wird von der Server-Component page.tsx gerendert.
 *
 * English: Client component for the article page.
 * Contains all interactive elements (navigation,
 * table of contents, progress tracking, widgets).
 * Rendered by the server component page.tsx.
 */

"use client";

import React, { useEffect, useState, use, useCallback, useRef } from "react";
import Link from "next/link";
import { getModuleById, getArticle } from "@/data/learnContent";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { Button } from "@/components/button";
import { ProgressBar } from "@/components/progressBar";
import { FadeIn } from "@/components/animations";
import { SuccessCelebration } from "@/components/successCelebration";
import { ErmDiagram } from "@/components/learn/ErmDiagram";
import { NfChecker } from "@/components/learn/NfChecker";
import { RmToSql } from "@/components/learn/RmToSql";
import { getModuleIcon, InlineIcons } from "@/components/learn/moduleIcons";
import { useProgress } from "@/hooks/useProgress";

export interface ArticlePageClientProps {
  params: Promise<{ moduleId: string; articleId: string }>;
}

/** Section type badge configuration. */
const SECTION_TYPE_CONFIG: Record<string, { label: string; icon: React.ReactNode; colorClass: string }> = {
  theory: { label: "Theorie", icon: InlineIcons.bookOpen, colorClass: "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300" },
  example: { label: "Beispiel", icon: InlineIcons.lightbulb, colorClass: "bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300" },
  practice: { label: "Praxis", icon: InlineIcons.pencil, colorClass: "bg-success/10 text-success" },
  summary: { label: "Zusammenfassung", icon: InlineIcons.clipboard, colorClass: "bg-warning/10 text-warning" },
};

export function ArticlePageClient({ params }: ArticlePageClientProps) {
  const { moduleId, articleId } = use(params);

  const mod = getModuleById(moduleId);
  const article = mod ? getArticle(moduleId, articleId) : undefined;

  const [activeSection, setActiveSection] = useState<string | null>(null);

  const { markSectionRead, isSectionRead, markArticleRead, getLearnModuleProgress } = useProgress();
  const moduleProgress = getLearnModuleProgress(moduleId);
  const sectionsRead = moduleProgress.sectionsRead ?? [];

  // Scroll tracking: IntersectionObserver for active section
  useEffect(() => {
    if (!article) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((e) => e.isIntersecting);
        if (visibleEntries.length > 0) {
          const sorted = visibleEntries.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          const topSection = sorted[0];
          if (topSection) {
            setActiveSection(topSection.target.id.replace("section-", ""));
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    const timer = setTimeout(() => {
      article.sections.forEach((section) => {
        const el = document.getElementById(`section-${section.id}`);
        if (el) observer.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [article]);

  // Mark article as read when all sections are read
  useEffect(() => {
    if (!article || !mod) return;
    const allRead = article.sections.every((s) => sectionsRead.includes(s.id));
    if (allRead && article.sections.length > 0) {
      markArticleRead(moduleId, articleId);
    }
  }, [sectionsRead, article, mod, moduleId, articleId, markArticleRead]);

  const handleSectionReadToggle = useCallback((sectionId: string) => {
    markSectionRead(moduleId, sectionId);
  }, [moduleId, markSectionRead]);

  const scrollToSection = useCallback((sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(`section-${sectionId}`)?.scrollIntoView({ behavior: "smooth" });
  }, []);

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

  // Calculate progress
  const totalSections = article.sections.length;
  const readSections = article.sections.filter((s) => sectionsRead.includes(s.id)).length;
  const progressPercent = totalSections > 0 ? Math.round((readSections / totalSections) * 100) : 0;

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
              <div className="sticky top-24 space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-ink-muted">Fortschritt</p>
                    <p className="text-xs font-medium text-primary-600 dark:text-primary-400">
                      {readSections}/{totalSections}
                    </p>
                  </div>
                  <ProgressBar
                    value={readSections}
                    max={totalSections}
                    variant={progressPercent === 100 ? "success" : "primary"}
                    size="sm"
                    label={`${progressPercent}% gelesen`}
                  />
                </div>

                {/* TOC */}
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-ink-muted mb-2">Inhalt</p>
                  {article.sections.map((section) => {
                    const isRead = sectionsRead.includes(section.id);
                    const isActive = activeSection === section.id;

                    return (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`block w-full text-left rounded-md px-2 py-1.5 text-xs transition-all duration-150 ${
                          isActive
                            ? "text-primary-600 bg-primary-50 dark:text-primary-400 dark:bg-primary-900/20 font-medium"
                            : isRead
                              ? "text-ink-muted hover:text-ink"
                              : "text-ink-muted hover:text-ink"
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {isRead ? (
                            <svg className="w-3.5 h-3.5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-surface-dim dark:border-dark-dim shrink-0" />
                          )}
                          <span className="truncate">{section.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* Article Content */}
            <div className="flex-1 min-w-0 space-y-6">
              <FadeIn delay={0}>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const IconComponent = getModuleIcon(mod.id);
                      return <IconComponent className="w-6 h-6 text-primary-500" />;
                    })()}
                    <span className="text-xs font-medium text-ink-muted">
                      {mod.title}
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-ink">{article.title}</h1>
                  <div className="flex items-center gap-3 text-sm text-ink-muted">
                    <span>{article.estimatedMinutes} Min. Lesezeit</span>
                    <span>·</span>
                    <span>{article.sections.length} Abschnitte</span>
                    {progressPercent === 100 && (
                      <>
                        <span>·</span>
                        <span className="text-success font-medium inline-flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> Gelesen</span>
                      </>
                    )}
                  </div>
                  {/* Mobile progress bar */}
                  <div className="lg:hidden">
                    <ProgressBar
                      value={readSections}
                      max={totalSections}
                      variant={progressPercent === 100 ? "success" : "primary"}
                      size="sm"
                      label={`${progressPercent}% gelesen`}
                    />
                  </div>
                </div>
              </FadeIn>

              {article.sections.map((section) => {
                const isRead = sectionsRead.includes(section.id);
                const typeConfig = SECTION_TYPE_CONFIG[section.sectionType ?? "theory"];

                return (
                  <FadeIn key={section.id} delay={0.05}>
                    <section
                      id={`section-${section.id}`}
                      className="scroll-mt-24"
                    >
                      <div className={`rounded-xl border-l-4 ${
                        section.sectionType === "practice"
                          ? "border-l-success bg-surface"
                          : section.sectionType === "example"
                            ? "border-l-accent-500 bg-surface"
                            : section.sectionType === "summary"
                              ? "border-l-warning bg-surface"
                              : "border-l-primary-500 bg-surface"
                      } shadow-sm dark:bg-dark-dim/30`}>
                        <div className="p-5 sm:p-6">
                          {/* Section header with type badge and read toggle */}
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className="flex items-center gap-2 min-w-0">
                              <h2 className="text-lg font-semibold text-ink">{section.title}</h2>
                              {typeConfig && (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${typeConfig.colorClass}`}>
                                  {typeConfig.icon} {typeConfig.label}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleSectionReadToggle(section.id)}
                              className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                                isRead
                                  ? "bg-success/10 text-success hover:bg-success/20"
                                  : "bg-surface-dim dark:bg-dark-dim text-ink-muted hover:text-ink hover:bg-surface-dim/80"
                              }`}
                              title={isRead ? "Als ungelesen markieren" : "Als gelesen markieren"}
                            >
                              {isRead ? (
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-current" />
                              )}
                              {isRead ? "Gelesen" : "Lesen"}
                            </button>
                          </div>

                          {/* Content */}
                          <div
                            className="prose prose-sm dark:prose-invert max-w-none text-ink space-y-3"
                            dangerouslySetInnerHTML={{
                              __html: renderMarkdown(section.content),
                            }}
                          />

                          {/* Key Takeaways */}
                          {section.keyTakeaways && section.keyTakeaways.length > 0 && (
                            <div className="mt-5 p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
                              <h4 className="text-sm font-semibold text-primary-700 dark:text-primary-300 mb-2 flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                </svg>
                                Kernaussagen
                              </h4>
                              <ul className="space-y-1.5">
                                {section.keyTakeaways.map((takeaway, i) => (
                                  <li key={i} className="flex items-start gap-2 text-sm text-ink">
                                    <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300 text-[10px] font-bold">
                                      {i + 1}
                                    </span>
                                    {takeaway}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Widget rendering */}
                          {section.widget && (
                            <div className="mt-5">
                              {section.widget.type === "erm-diagram" && (
                                <ErmDiagram data={section.widget.data as unknown as import("@/components/learn/ErmDiagram").ErmDiagramData} />
                              )}
                              {section.widget.type === "nf-checker" && (
                                <NfChecker data={section.widget.data as unknown as import("@/components/learn/NfChecker").NfCheckerData} />
                              )}
                              {section.widget.type === "rm-to-sql" && (
                                <RmToSql data={section.widget.data as unknown as import("@/components/learn/RmToSql").RmToSqlData} />
                              )}
                            </div>
                          )}

                        </div>
                      </div>
                    </section>
                  </FadeIn>
                );
              })}

              {/* Navigation: Vorheriger/Nächster Artikel */}
              <div className="grid gap-4 sm:grid-cols-2 pt-6 border-t border-surface-dim dark:border-dark-dim">
                {prevArticle ? (
                  <Link
                    href={`/lernen/${mod.id}/${prevArticle.id}`}
                    className="group block"
                  >
                    <Card variant="outlined" className="p-4 h-full transition-all duration-200 group-hover:shadow-md group-hover:border-primary-300">
                      <div className="flex items-center gap-2 text-xs text-ink-muted mb-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Vorheriger Artikel
                      </div>
                      <p className="text-sm font-semibold text-ink group-hover:text-primary-500 transition-colors">
                        {prevArticle.title}
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {prevArticle.estimatedMinutes} Min. · {prevArticle.sections.length} Abschnitte
                      </p>
                    </Card>
                  </Link>
                ) : (
                  <Link href={`/lernen/${mod.id}`} className="group block">
                    <Card variant="outlined" className="p-4 h-full transition-all duration-200 group-hover:shadow-md group-hover:border-primary-300">
                      <div className="flex items-center gap-2 text-xs text-ink-muted mb-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                        Zurück zum Modul
                      </div>
                      <p className="text-sm font-semibold text-ink group-hover:text-primary-500 transition-colors">
                        {mod.title}
                      </p>
                    </Card>
                  </Link>
                )}
                {nextArticle ? (
                  <Link
                    href={`/lernen/${mod.id}/${nextArticle.id}`}
                    className="group block text-right"
                  >
                    <Card variant="outlined" className="p-4 h-full transition-all duration-200 group-hover:shadow-md group-hover:border-primary-300">
                      <div className="flex items-center justify-end gap-2 text-xs text-ink-muted mb-1">
                        Nächster Artikel
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-ink group-hover:text-primary-500 transition-colors">
                        {nextArticle.title}
                      </p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {nextArticle.estimatedMinutes} Min. · {nextArticle.sections.length} Abschnitte
                      </p>
                    </Card>
                  </Link>
                ) : (
                  <Link href={`/lernen/${mod.id}`} className="group block text-right">
                    <Card variant="outlined" className="p-4 h-full transition-all duration-200 group-hover:shadow-md group-hover:border-primary-300">
                      <div className="flex items-center justify-end gap-2 text-xs text-ink-muted mb-1">
                        Zurück zum Modul
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-ink group-hover:text-primary-500 transition-colors">
                        {mod.title}
                      </p>
                    </Card>
                  </Link>
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
  // Pre-process: extract and protect code blocks and tables so they don't get mangled
  const codeBlocks: string[] = [];
  const tableBlocks: string[] = [];

  // Extract SQL code blocks first (before other processing)
  let processed = text.replace(/```sql\n([\s\S]*?)```/g, (_match, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(
      `<div class="my-5 relative rounded-lg border border-surface-dim dark:border-dark-dim overflow-hidden">` +
      `<div class="flex items-center justify-between bg-accent/10 dark:bg-accent/20 px-3 py-1.5 border-b border-surface-dim dark:border-dark-dim">` +
      `<span class="text-[11px] font-mono font-semibold text-accent uppercase tracking-wider">SQL</span>` +
      `</div>` +
      `<pre class="bg-surface-dim dark:bg-dark-dim p-4 text-[13px] font-mono leading-relaxed overflow-x-auto"><code>${escapeHtml(code.trim())}</code></pre>` +
      `</div>`
    );
    return `%%CODEBLOCK_${idx}%%`;
  });

  // Extract other code blocks
  processed = processed.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(
      `<div class="my-5 rounded-lg border border-surface-dim dark:border-dark-dim overflow-hidden">` +
      `<pre class="bg-surface-dim dark:bg-dark-dim p-4 text-[13px] font-mono leading-relaxed overflow-x-auto"><code>${escapeHtml(code.trim())}</code></pre>` +
      `</div>`
    );
    return `%%CODEBLOCK_${idx}%%`;
  });

  // Extract markdown tables (lines starting with |)
  const lines = processed.split('\n');
  const processedLines: string[] = [];
  let currentTable: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      currentTable.push(line);
    } else {
      if (currentTable.length > 0) {
        const idx = tableBlocks.length;
        tableBlocks.push(renderTable(currentTable));
        processedLines.push(`%%TABLEBLOCK_${idx}%%`);
        currentTable = [];
      }
      processedLines.push(line);
    }
  }
  if (currentTable.length > 0) {
    const idx = tableBlocks.length;
    tableBlocks.push(renderTable(currentTable));
    processedLines.push(`%%TABLEBLOCK_${idx}%%`);
  }

  processed = processedLines.join('\n');

  // Now process the remaining markdown
  let html = processed
    // Horizontal rules (---) as visual separators
    .replace(/^---+$/gm, '<hr class="my-6 border-t-2 border-surface-dim dark:border-dark-dim"/>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="rounded bg-surface-dim dark:bg-dark-dim px-1.5 py-0.5 text-xs font-mono text-accent">$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold text-ink mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold text-ink mt-5 mb-2">$1</h2>')
    // Lists
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-sm text-ink leading-relaxed">$1</li>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, "</p><p class='text-sm text-ink leading-relaxed my-2'>")
    // Single newlines within paragraphs
    .replace(/\n/g, "<br/>")
    // Wrap in paragraph
    .replace(/^(.+)$/, "<p class='text-sm text-ink leading-relaxed'>$1</p>");

  // Restore code blocks and tables
  for (let i = 0; i < codeBlocks.length; i++) {
    html = html.replace(`%%CODEBLOCK_${i}%%`, codeBlocks[i]);
  }
  for (let i = 0; i < tableBlocks.length; i++) {
    html = html.replace(`%%TABLEBLOCK_${i}%%`, tableBlocks[i]);
  }

  // Clean up empty paragraphs
  html = html.replace(/<p[^>]*>\s*<\/p>/g, '');
  // Clean up paragraphs wrapping block elements
  html = html.replace(/<p[^>]*>\s*(<div|<hr|<table|<h[23])/g, '$1');
  html = html.replace(/(<\/div>|<\/hr>|<\/table>|<\/h[23]>)\s*<\/p>/g, '$1');

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderTable(lines: string[]): string {
  const rows: string[][] = [];
  let hasHeader = false;

  for (const line of lines) {
    const cells = line.split('|').map(c => c.trim()).filter(c => c.length > 0);
    // Check if this is a separator row (---, :---, ---:, :---:)
    if (cells.every(c => c.match(/^[-:]+$/))) {
      hasHeader = true;
      continue; // Skip separator rows, we use the header flag instead
    }
    rows.push(cells);
  }

  if (rows.length === 0) return '';

  let html = '<div class="my-5 overflow-x-auto rounded-lg border border-surface-dim dark:border-dark-dim">';
  html += '<table class="w-full border-collapse text-sm">';

  rows.forEach((cells, rowIdx) => {
    const isHeader = rowIdx === 0 && hasHeader;
    const tag = isHeader ? 'th' : 'td';
    const bgClass = isHeader
      ? 'bg-surface-dim/50 dark:bg-dark-dim/50 font-semibold'
      : rowIdx % 2 === 0
        ? 'bg-surface-dim/20 dark:bg-dark-dim/20'
        : '';
    html += `<tr class="${bgClass}">`;
    cells.forEach(cell => {
      html += `<${tag} class="px-3 py-2 text-left text-ink whitespace-nowrap border-b border-surface-dim dark:border-dark-dim">${cell}</${tag}>`;
    });
    html += '</tr>';
  });

  html += '</table></div>';
  return html;
}