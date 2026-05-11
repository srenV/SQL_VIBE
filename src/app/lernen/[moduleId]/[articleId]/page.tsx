/**
 * Artikel-Seite – Zeigt den Inhalt eines Lern-Artikels an.
 *
 * English: Article page – Shows the content of a learning article.
 */

import type { Metadata } from "next";
import { allArticlePaths, getArticle, getModuleById } from "@/data/learnContent";
import { ArticlePageClient } from "@/components/learn/ArticlePageClient";

export function generateStaticParams() {
  return allArticlePaths;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ moduleId: string; articleId: string }>;
}): Promise<Metadata> {
  const { moduleId, articleId } = await params;
  const mod = getModuleById(moduleId);
  const article = getArticle(moduleId, articleId);
  if (!mod || !article) return { title: "Artikel nicht gefunden" };
  return {
    title: `${article.title} – ${mod.title}`,
    description: `${article.title} im Modul ${mod.title}: ${mod.description}`,
    alternates: { canonical: `/lernen/${moduleId}/${articleId}` },
    openGraph: {
      title: `${article.title} – ${mod.title}`,
      description: `${article.title} im Modul ${mod.title}: ${mod.description}`,
      type: "article",
    },
  };
}

export default function ArticlePage({ params }: { params: Promise<{ moduleId: string; articleId: string }> }) {
  // BreadcrumbList JSON-LD is rendered here; article data is loaded client-side
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Startseite", item: "https://sql-vibe.vercel.app" },
      { "@type": "ListItem", position: 2, name: "Lernen", item: "https://sql-vibe.vercel.app/lernen" },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ArticlePageClient params={params} />
    </>
  );
}