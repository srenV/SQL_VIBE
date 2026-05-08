/**
 * Artikel-Seite – Zeigt den Inhalt eines Lern-Artikels an.
 *
 * English: Article page – Shows the content of a learning article.
 */

import { allArticlePaths } from "@/data/learnContent";
import { ArticlePageClient } from "@/components/learn/ArticlePageClient";

export function generateStaticParams() {
  return allArticlePaths;
}

export default function ArticlePage({ params }: { params: Promise<{ moduleId: string; articleId: string }> }) {
  return <ArticlePageClient params={params} />;
}