import type { MetadataRoute } from "next";
import { catalog, allLessonIds } from "@/data/catalog";
import { allModuleIds, learnModules } from "@/data/learnContent";

export const dynamic = "force-static";

const BASE_URL = "https://sql-vibe.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/lektionen`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/lernen`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/story`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/sandbox`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Lesson pages
  const lessonPages: MetadataRoute.Sitemap = allLessonIds
    .filter((id) => id !== "lesson_story")
    .map((id) => {
      const lesson = catalog.lessons[id];
      if (!lesson) return null;
      return {
        url: `${BASE_URL}/lektionen/${id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      };
    })
    .filter(Boolean) as MetadataRoute.Sitemap;

  // Exercise pages
  const exercisePages: MetadataRoute.Sitemap = allLessonIds
    .filter((id) => id !== "lesson_story")
    .flatMap((lessonId) => {
      const lesson = catalog.lessons[lessonId];
      if (!lesson) return [];
      return lesson.exercises.map((exerciseId) => ({
        url: `${BASE_URL}/lektionen/${lessonId}/${exerciseId}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      }));
    });

  // Learning module pages
  const modulePages: MetadataRoute.Sitemap = allModuleIds.map((id) => ({
    url: `${BASE_URL}/lernen/${id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Learning article pages
  const articlePages: MetadataRoute.Sitemap = learnModules.flatMap((mod) =>
    mod.articles.map((article) => ({
      url: `${BASE_URL}/lernen/${mod.id}/${article.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }))
  );

  return [
    ...staticPages,
    ...lessonPages,
    ...exercisePages,
    ...modulePages,
    ...articlePages,
  ];
}