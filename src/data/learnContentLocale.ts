/**
 * Locale-aware learn content resolution.
 *
 * Returns the appropriate learn module arrays for a given locale.
 * Falls back to German ("de") if no locale-specific content exists.
 */

import type { LearnModule } from "@/types/sandbox";

// German learn content (default)
import { learnModules } from "@/data/learnContent";

// English learn content (partial — Module 1 complete)
import { learnModulesEn } from "@/data/learnContentEn";

const localeLearnModules: Record<string, LearnModule[]> = {
  de: learnModules,
  en: learnModulesEn,
};

/**
 * Get learn modules for a specific locale.
 * Falls back to German if the locale is not available.
 */
export function getLearnModules(locale: string): LearnModule[] {
  return localeLearnModules[locale] ?? localeLearnModules.de;
}

/**
 * Get all module IDs for a specific locale.
 */
export function getAllModuleIds(locale: string): string[] {
  const modules = getLearnModules(locale);
  return modules.map((m) => m.id);
}

/**
 * Get a specific module by ID for a locale.
 */
export function getModuleById(locale: string, moduleId: string): LearnModule | undefined {
  const modules = getLearnModules(locale);
  return modules.find((m) => m.id === moduleId);
}

/**
 * Get all article paths (moduleId/articleId) for a locale.
 */
export function getAllArticlePaths(locale: string): { moduleId: string; articleId: string }[] {
  const modules = getLearnModules(locale);
  const paths: { moduleId: string; articleId: string }[] = [];
  for (const mod of modules) {
    for (const article of mod.articles) {
      paths.push({ moduleId: mod.id, articleId: article.id });
    }
  }
  return paths;
}

/**
 * Get a specific article by module ID and article ID for a locale.
 */
export function getArticle(
  locale: string,
  moduleId: string,
  articleId: string
): { module: LearnModule; article: LearnModule["articles"][number] } | undefined {
  const module = getModuleById(locale, moduleId);
  if (!module) return undefined;
  const article = module.articles.find((a) => a.id === articleId);
  if (!article) return undefined;
  return { module, article };
}

// Re-export German defaults for backward compatibility
export { learnModules };

// Helper: total number of articles across all modules for a locale
export function totalArticles(locale: string): number {
  const modules = getLearnModules(locale);
  return modules.reduce((sum, m) => sum + m.articles.length, 0);
}