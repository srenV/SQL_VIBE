import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { setRequestLocale } from "next-intl/server";
import { PageShell } from "@/components/pageShell";
import { ProfilClient } from "./ProfilClient";
import { getCatalog, allLessonIds } from "@/data/catalog";
import { getExerciseArrays } from "@/data/exercises/locale";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("profil");
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: false },
  };
}

export default async function ProfilPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const catalog = getCatalog(locale);

  const lessons = allLessonIds
    .map((id) => catalog.lessons[id])
    .filter((l): l is NonNullable<typeof l> => !!l && l.id !== "lesson_story")
    .sort((a, b) => a.order - b.order)
    .map((l) => ({ id: l.id, title: l.title, exerciseIds: l.exercises }));

  return (
    <PageShell>
      <ProfilClient lessons={lessons} storyTotal={getExerciseArrays(locale).story.length} />
    </PageShell>
  );
}
