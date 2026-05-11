import type { Metadata } from "next";
import { PageShell } from "@/components/pageShell";
import { ProfilClient } from "./ProfilClient";
import { catalog, allLessonIds } from "@/data/catalog";
import { storyExercises } from "@/data/exercises";

export const metadata: Metadata = {
  title: "Profil",
  description: "Dein persönliches SQL VIBE-Profil mit Fortschritt, Level und Erfolgen.",
  robots: { index: false, follow: false },
};

export default function ProfilPage() {
  const lessons = allLessonIds
    .map((id) => catalog.lessons[id])
    .filter((l): l is NonNullable<typeof l> => !!l && l.id !== "lesson_story")
    .sort((a, b) => a.order - b.order)
    .map((l) => ({ id: l.id, title: l.title, exerciseIds: l.exercises }));

  return (
    <PageShell>
      <ProfilClient lessons={lessons} storyTotal={storyExercises.length} />
    </PageShell>
  );
}
