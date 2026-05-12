/**
 * Lernen-Uebersichtsseite – Zeigt alle Lernmodule als Card-Grid an,
 * mit Tabs fuer Lernen (Artikel) und Testen (Quizze).
 *
 * English: Learning overview page with tabs for Learning (articles) and Testing (quizzes).
 */
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { getLearnModules, totalArticles } from "@/data/learnContentLocale";
import { getLearnQuizzes } from "@/data/learnQuizzes/locale";
import { PageShell } from "@/components/pageShell";
import { FadeIn } from "@/components/animations";
import { AnimatedCard } from "@/components/animatedCard";
import { DifficultyBadge } from "@/components/difficultyBadge";
import { getModuleIcon } from "@/components/learn/moduleIcons";
import { QuizClient } from "@/components/learn/QuizClient";

/** Book-open SVG icon for Lernen tab */
function BookOpenIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

/** Clipboard-check SVG icon for Testen tab */
function ClipboardCheckIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.977 1.057 1.977 2.193V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
    </svg>
  );
}

/** Arrow-left SVG icon for back button */
function ArrowLeftIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  );
}

type Tab = "lernen" | "testen";

export default function LernenPage() {
  const [activeTab, setActiveTab] = React.useState<Tab>("lernen");
  const [selectedQuizModule, setSelectedQuizModule] = React.useState<string | null>(null);
  const t = useTranslations("lernen");
  const locale = useLocale();
  const learnModulesData = getLearnModules(locale);
  const totalArticlesCount = totalArticles(locale);
  const quizzes = getLearnQuizzes(locale);

  // Quiz mode: show quiz for selected module
  if (activeTab === "testen" && selectedQuizModule) {
    const quiz = quizzes.find((q) => q.moduleId === selectedQuizModule);
    const mod = learnModulesData.find((m) => m.id === selectedQuizModule);
    if (quiz && mod) {
      return (
        <PageShell mainClassName="flex-1 py-12" containerClassName="space-y-6">
          <button
            onClick={() => setSelectedQuizModule(null)}
            className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            <ArrowLeftIcon />
            {t("backToModules")}
          </button>
          <QuizClient
            questions={quiz.questions}
            moduleTitle={quiz.title}
            onComplete={() => {}}
          />
        </PageShell>
      );
    }
  }

  return (
    <PageShell mainClassName="flex-1 py-12" containerClassName="space-y-10">
      <FadeIn delay={0}>
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-ink">
            {t("title")}
          </h1>
          <p className="text-lg text-ink-muted max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </FadeIn>

          {/* Tab navigation */}
          <FadeIn delay={0.05}>
            <div className="flex justify-center">
              <div role="tablist" className="inline-flex rounded-lg border border-surface-dim p-1 bg-surface-dim/30">
                <button
                  role="tab"
                  aria-selected={activeTab === "lernen"}
                  onClick={() => { setActiveTab("lernen"); setSelectedQuizModule(null); }}
                  className={`inline-flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === "lernen"
                      ? "bg-surface shadow-sm text-ink"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <BookOpenIcon />
                  {t("tabLearn")}
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === "testen"}
                  onClick={() => { setActiveTab("testen"); setSelectedQuizModule(null); }}
                  className={`inline-flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === "testen"
                      ? "bg-surface shadow-sm text-ink"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  <ClipboardCheckIcon />
                  {t("tabTest")}
                </button>
              </div>
            </div>
          </FadeIn>

          {/* Lernen tab */}
          {activeTab === "lernen" && (
            <FadeIn delay={0.1}>
              <div role="tabpanel" className="text-center mb-2">
                <p className="text-sm text-ink-muted">
                  {learnModulesData.length} {t("modules")} · {totalArticlesCount} {t("articles")}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {learnModulesData.map((mod) => {
                  const totalMin = mod.articles.reduce((sum, a) => sum + a.estimatedMinutes, 0);

                  return (
                    <Link
                      key={mod.id}
                      href={`/lernen/${mod.id}`}
                      className="group block"
                    >
                      <AnimatedCard colorTheme="primary">
                        <div className="flex items-start justify-between gap-2">
                          {(() => {
                            const IconComponent = getModuleIcon(mod.id);
                            return <IconComponent className="w-8 h-8 text-primary-500 group-hover:-translate-y-0.5 group-hover:rotate-2 transition-transform duration-300" />;
                          })()}
                          <DifficultyBadge difficulty={mod.difficulty} className="text-[10px]" />
                        </div>
                        <h3 className="text-lg font-semibold text-ink group-hover:text-primary-500 transition-colors mt-3">
                          {mod.title}
                        </h3>
                        <p className="text-sm text-ink-muted mt-2 line-clamp-3 flex-1">
                          {mod.description}
                        </p>
                        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-ink-muted">
                          <div className="flex items-center gap-3">
                            <span>
                              {mod.articles.length} {mod.articles.length === 1 ? t("articleSingular") : t("articles")}
                            </span>
                            <span>·</span>
                            <span>~{totalMin} {t("minutes")}</span>
                          </div>
                          <span className="text-primary-500 font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            {t("read")}
                            <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-1 group-hover:ml-0 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                          </span>
                        </div>
                      </AnimatedCard>
                    </Link>
                  );
                })}
              </div>
            </FadeIn>
          )}

          {/* Testen tab */}
          {activeTab === "testen" && (
            <FadeIn delay={0.1}>
              <div role="tabpanel" className="text-center mb-2">
                <p className="text-sm text-ink-muted">
                  {quizzes.length} {t("quizzes")} · {t("questionsPerModule", { count: quizzes[0]?.questions.length ?? 15 })}
                </p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {learnModulesData.map((mod) => {
                  const quiz = quizzes.find((q) => q.moduleId === mod.id);
                  const questionCount = quiz?.questions.length ?? 0;

                  return (
                    <button
                      key={mod.id}
                      onClick={() => setSelectedQuizModule(mod.id)}
                      className="group block text-left w-full"
                    >
                      <AnimatedCard colorTheme="accent">
                        <div className="flex items-start justify-between gap-2">
                          {(() => {
                            const IconComponent = getModuleIcon(mod.id);
                            return <IconComponent className="w-8 h-8 text-accent group-hover:-translate-y-0.5 group-hover:rotate-2 transition-transform duration-300" />;
                          })()}
                          <DifficultyBadge difficulty={mod.difficulty} className="text-[10px]" />
                        </div>
                        <h3 className="text-lg font-semibold text-ink group-hover:text-accent transition-colors mt-3">
                          {mod.title}
                        </h3>
                        <p className="text-sm text-ink-muted mt-2 line-clamp-3 flex-1">
                          {quiz?.description ?? mod.description}
                        </p>
                        <div className="mt-auto pt-4 flex items-center justify-between text-xs text-ink-muted">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1">
                              {questionCount} {t("questions")}
                            </span>
                            <span>·</span>
                            <span>Multiple Choice</span>
                          </div>
                          <span className="text-accent font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            {t("start")}
                            <svg className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 -ml-1 group-hover:ml-0 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                          </span>
                        </div>
                      </AnimatedCard>
                    </button>
                  );
                })}
              </div>
            </FadeIn>
          )}
    </PageShell>
  );
}