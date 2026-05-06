/**
 * Story-Modus-Tests – Prueft die Konsistenz und Ausfuehrbarkeit
 * der Mord-Puzzle-Faelle im Story-Spielmodus.
 */
import { describe, it, expect } from "vitest";
import { storyExercises } from "@/data/exercises/story";
import { catalog } from "@/data/catalog";
import { adaptExercise } from "@/lib/playgroundAdapter";

describe("Story Mode Integration", () => {
  it("all story exercises adapt correctly for the playground", () => {
    for (const ex of storyExercises) {
      const dataset = catalog.datasets[ex.datasetId];
      expect(dataset).toBeDefined();
      const adapted = adaptExercise(ex, dataset);
      expect(adapted.exerciseType).toBe("story");
      expect(adapted.story).toBeDefined();
      expect(adapted.story!.scenarioTitle).toBeTruthy();
      expect(adapted.story!.chapters.length).toBeGreaterThanOrEqual(3);
      expect(adapted.story!.intro).toBeTruthy();
      expect(adapted.story!.outro).toBeTruthy();
    }
  });

  it("each story chapter maps to a working playground exercise", () => {
    for (const ex of storyExercises) {
      const dataset = catalog.datasets[ex.datasetId];
      const adapted = adaptExercise(ex, dataset);
      for (const chapter of adapted.story!.chapters) {
        expect(chapter.referenceQuery).toBeTruthy();
        expect(chapter.narrative).toBeTruthy();
        expect(chapter.title).toBeTruthy();
      }
    }
  });

  it("story exercises are reachable from lesson routing", () => {
    const lesson = catalog.lessons["lesson_story"];
    expect(lesson).toBeDefined();
    for (const exId of lesson!.exercises) {
      const ex = catalog.exercises[exId];
      expect(ex).toBeDefined();
      expect(ex.type).toBe("story");
    }
  });
});