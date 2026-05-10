import { Header } from "@/components/header";
import { ProfilClient } from "./ProfilClient";
import { catalog, allLessonIds } from "@/data/catalog";
import { storyExercises } from "@/data/exercises";

export const metadata = { title: "Profil – SQL Vibe" };

export default function ProfilPage() {
  const lessons = allLessonIds
    .map((id) => catalog.lessons[id])
    .filter((l): l is NonNullable<typeof l> => !!l && l.id !== "lesson_story")
    .sort((a, b) => a.order - b.order)
    .map((l) => ({ id: l.id, title: l.title, exerciseIds: l.exercises }));

  return (
    <div className="min-h-screen flex flex-col" id="main-content">
      <Header />
      <ProfilClient lessons={lessons} storyTotal={storyExercises.length} />
    </div>
  );
}
