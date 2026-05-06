import { redirect } from "next/navigation";
import { catalog, allLessonIds } from "@/data/catalog";

/**
 * Alte Uebungs-Seite: leitet auf die erste Lektion weiter.
 */
export default function UebungPage() {
  const sortedLessons = allLessonIds
    .map((id) => catalog.lessons[id])
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  const firstLesson = sortedLessons[0];
  if (!firstLesson) {
    redirect("/lektionen");
  }

  redirect(`/lektionen/${firstLesson.id}/${firstLesson.exercises[0]}`);
}