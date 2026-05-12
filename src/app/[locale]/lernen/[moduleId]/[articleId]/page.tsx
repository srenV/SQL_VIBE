/**
 * Artikel-Seite – Zeigt den Inhalt eines Lern-Artikels an.
 *
 * English: Article page – Shows the content of a learning article.
 */

import type { Metadata } from "next";
import { getAllArticlePaths, getArticle, getModuleById } from "@/data/learnContentLocale";
import { ArticlePageClient } from "@/components/learn/ArticlePageClient";

export function generateStaticParams() {
  return getAllArticlePaths("de");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; moduleId: string; articleId: string }>;
}): Promise<Metadata> {
  const { locale, moduleId, articleId } = await params;
  const result = getArticle(locale, moduleId, articleId);
  if (!result) return { title: "Article not found" };
  const { module: mod, article } = result;
  return {
    title: `${article.title} – ${mod.title}`,
    description: `${article.title} in module ${mod.title}: ${mod.description}`,
    alternates: { canonical: `/lernen/${moduleId}/${articleId}` },
    openGraph: {
      title: `${article.title} – ${mod.title}`,
      description: `${article.title} in module ${mod.title}: ${mod.description}`,
      type: "article",
    },
  };
}

export default function ArticlePage({ params }: { params: Promise<{ locale: string; moduleId: string; articleId: string }> }) {
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