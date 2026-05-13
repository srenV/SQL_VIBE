/**
 * Lernmodul-Detailseite – Zeigt alle Artikel eines Lernmoduls an.
 *
 * English: Learning module detail page – Shows all articles of a learning module.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getModuleById, getAllModuleIds } from "@/data/learnContentLocale";
import { routing } from "@/i18n/routing";
import { Card } from "@/components/card";
import { PageShell } from "@/components/pageShell";
import { FadeIn } from "@/components/animations";
import { DifficultyBadge } from "@/components/difficultyBadge";
import { getDifficultyConfig } from "@/lib/difficultyConfig";
import { getModuleIcon } from "@/components/learn/moduleIcons";

interface PageProps {
  params: Promise<{ locale: string; moduleId: string }>;
}

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllModuleIds(locale).map((id) => ({ locale, moduleId: id }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, moduleId } = await params;
  setRequestLocale(locale);
  const mod = getModuleById(locale, moduleId);
  if (!mod) return { title: "Modul nicht gefunden" };
  return {
    title: `${mod.title} – SQL Lernen`,
    description: mod.description,
    alternates: { canonical: `/lernen/${moduleId}` },
    openGraph: {
      title: `${mod.title} – SQL Lernen`,
      description: mod.description,
    },
  };
}

export default async function LearnModulePage({ params }: PageProps) {
  const { locale, moduleId } = await params;
  setRequestLocale(locale);
  const mod = getModuleById(locale, moduleId);
  if (!mod) notFound();

  const totalMin = mod.articles.reduce((sum, a) => sum + a.estimatedMinutes, 0);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://sql-vibe.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Lernen", item: "https://sql-vibe.vercel.app/lernen" },
      { "@type": "ListItem", position: 3, name: mod.title, item: `https://sql-vibe.vercel.app/lernen/${moduleId}` },
    ],
  };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: mod.title,
    description: mod.description,
    provider: {
      "@type": "Organization",
      name: "SQL VIBE",
      url: "https://sql-vibe.vercel.app",
    },
    coursePrerequisites: getDifficultyConfig(mod.difficulty).labelKey,
    numberOfItems: mod.articles.length,
    inLanguage: "de",
  };

  return (
    <PageShell mainClassName="flex-1 py-12" containerClassName="space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />
      <FadeIn delay={0}>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
                {(() => {
                  const IconComponent = getModuleIcon(mod.id);
                  return <IconComponent className="w-8 h-8 text-primary-500" />;
                })()}
                <DifficultyBadge difficulty={mod.difficulty} className="text-[10px]" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-ink">
                {mod.title}
              </h1>
              <p className="text-ink-muted max-w-2xl">
                {mod.description}
              </p>
              <div className="flex items-center gap-4 text-sm text-ink-muted">
                <span>{mod.articles.length} {mod.articles.length === 1 ? "Artikel" : "Artikel"}</span>
                <span>·</span>
                <span>~{totalMin} Min. Lesezeit</span>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid gap-4">
              {mod.articles.map((article, i) => {
                // Get first section content as preview (strip markdown)
                const firstSection = article.sections[0];
                const preview = firstSection
                  ? firstSection.content.replace(/\*\*/g, "").replace(/`[^`]+`/g, "").replace(/```[\s\S]*?```/g, "").replace(/[#|*\-]/g, "").slice(0, 120).trim()
                  : "";

                return (
                  <Link
                    key={article.id}
                    href={`/lernen/${mod.id}/${article.id}`}
                    className="group block"
                  >
                    <Card
                      variant="outlined"
                      className="p-4 hover:border-primary-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-semibold">
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-semibold text-ink group-hover:text-primary-500 transition-colors">
                            {article.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1 text-xs text-ink-muted">
                            <span>{article.estimatedMinutes} Min.</span>
                            <span>·</span>
                            <span>{article.sections.length} Abschnitte</span>
                          </div>
                          {preview && (
                            <p className="text-xs text-ink-muted mt-2 line-clamp-2">
                              {preview}…
                            </p>
                          )}
                        </div>
                        <span className="text-ink-muted text-sm shrink-0 mt-1 group-hover:translate-x-0.5 transition-transform" aria-hidden="true">&rarr;</span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </FadeIn>
    </PageShell>
  );
}