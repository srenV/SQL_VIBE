/**
 * Lernmodul-Detailseite – Zeigt alle Artikel eines Lernmoduls an.
 *
 * English: Learning module detail page – Shows all articles of a learning module.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getModuleById, allModuleIds } from "@/data/learnContent";
import { Card } from "@/components/card";
import { Container } from "@/components/container";
import { Header } from "@/components/header";
import { FadeIn } from "@/components/animations";
import { getModuleIcon } from "@/components/learn/moduleIcons";

interface PageProps {
  params: Promise<{ moduleId: string }>;
}

export async function generateStaticParams() {
  return allModuleIds.map((id) => ({ moduleId: id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { moduleId } = await params;
  const mod = getModuleById(moduleId);
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

const DIFFICULTY_CONFIG: Record<string, { label: string; className: string }> = {
  beginner: { label: "Anfänger", className: "bg-success/10 text-success" },
  junior: { label: "Grundlagen", className: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300" },
  intermediate: { label: "Fortgeschritten", className: "bg-warning/10 text-warning" },
};

export default async function LearnModulePage({ params }: PageProps) {
  const { moduleId } = await params;
  const mod = getModuleById(moduleId);
  if (!mod) notFound();

  const totalMin = mod.articles.reduce((sum, a) => sum + a.estimatedMinutes, 0);
  const diffConfig = DIFFICULTY_CONFIG[mod.difficulty] ?? DIFFICULTY_CONFIG.beginner;

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
    coursePrerequisites: diffConfig.label,
    numberOfItems: mod.articles.length,
    inLanguage: "de",
  };

  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header />

      <main className="flex-1 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
        />
        <Container className="space-y-10">
          <FadeIn delay={0}>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                {(() => {
                  const IconComponent = getModuleIcon(mod.id);
                  return <IconComponent className="w-8 h-8 text-primary-500" />;
                })()}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium ${diffConfig.className}`}>
                  {diffConfig.label}
                </span>
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
        </Container>
      </main>
    </div>
  );
}