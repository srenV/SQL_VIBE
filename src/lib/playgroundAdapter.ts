/**
 * Adapter: Wandelt die Katalog-Exercise + Dataset in das Playground-spezifische
 * Exercise-Format um, das von der Playground-Infrastruktur verwendet wird.
 *
 * English: Adapter: converts the existing catalog Exercise + Dataset into the
 * Playground-specific Exercise format used by the playground infrastructure.
 */

import type { Dataset, Exercise, Hint, HiddenTest, Option, StoryData } from "@/types/exercise";
import type { PlaygroundExercise, ExerciseHint, HiddenTest as PlaygroundHiddenTest, SchemaTable, SchemaColumn, ForeignKey, QuizOption, PlaygroundStoryData, PlaygroundStoryChapter } from "@/types/playground";

/** Wandelt Katalog-Hinweise in das Playground-Hint-Format um. Standard-Trigger: erster Hinweis = syntax/result, letzter = always. */
function convertHints(hints: Hint[]): ExerciseHint[] {
  return hints.map((h) => {
    let trigger: ExerciseHint["trigger"];
    if (h.trigger) {
      trigger = h.trigger as ExerciseHint["trigger"];
    } else {
      // Standardzuweisung: erster Hinweis = syntax/result, letzter = always
      trigger = { type: "always" };
    }
    return {
      level: Math.min(Math.max(h.level, 1), 3) as 1 | 2 | 3,
      trigger,
      message: h.text,
    };
  });
}

/** Wandelt Katalog-HiddenTests in das Playground-HiddenTest-Format um. */
function convertHiddenTests(tests: HiddenTest[]): PlaygroundHiddenTest[] {
  return tests.map((ht, idx) => {
    return {
      id: `ht-${idx}`,
      name: ht.name,
      query: ht.query,
      compareMode: ht.compareMode,
      failureMessage: `Hidden-Test "${ht.name}" fehlgeschlagen (${ht.compareMode}).`,
    };
  });
}

/** Erstellt SchemaTable-Objekte aus den Tabellendefinitionen des Datensatzes, inkl. Spalten und Fremdschluessel. */
function buildSchemaTables(dataset: Dataset): SchemaTable[] {
  return dataset.tables.map((t) => {
    const columns: SchemaColumn[] = t.columns.map((c) => ({
      name: c.name,
      type: c.type,
      nullable: c.nullable ?? true,
      defaultValue: c.default,
      isPrimaryKey: c.isPrimaryKey ?? (c.name === "id" && !c.nullable),
    }));

    const foreignKeys: ForeignKey[] = t.columns
      .filter((c) => c.references)
      .map((c) => {
        const parts = c.references!.split(".");
        return {
          column: c.name,
          referencedTable: parts[0] || "",
          referencedColumn: parts[1] || "id",
        };
      });

    return {
      name: t.name,
      columns,
      foreignKeys: foreignKeys.length > 0 ? foreignKeys : undefined,
    };
  });
}

/** Wandelt Story-Daten aus dem Katalogformat ins Playground-StoryFormat um. */
function convertStoryData(story: StoryData): PlaygroundStoryData {
  return {
    scenarioTitle: story.scenarioTitle,
    intro: story.intro,
    outro: story.outro,
    chapters: story.chapters.map((ch) => ({
      chapterNumber: ch.chapterNumber,
      title: ch.title,
      narrative: ch.narrative,
      referenceQuery: ch.referenceQuery,
      hiddenTests: ch.hiddenTests.map((ht, i) => ({
        id: `cht-${ch.chapterNumber}-${i}`,
        name: ht.name,
        query: ht.query,
        compareMode: ht.compareMode,
        failureMessage: `Kapitel-Test "${ht.name}" fehlgeschlagen (${ht.compareMode}).`,
      })),
      hints: ch.hints.map((h) => ({
        level: Math.min(Math.max(h.level, 1), 3) as 1 | 2 | 3,
        trigger: h.trigger
          ? (h.trigger as ExerciseHint["trigger"])
          : { type: "always" as const },
        message: h.text,
      })),
      completionNarrative: ch.completionNarrative,
      points: ch.points,
      progressSql: ch.progressSql,
    })),
  };
}

/**
 * Hauptadapter-Funktion: Wandelt eine Katalog-Exercise + zugehoerigen Datensatz
 * in eine PlaygroundExercise um, die von der Playground-Komponente verarbeitet wird.
 * @param exercise - Die Uebung aus dem Katalog.
 * @param dataset - Der zugehoerige Datensatz mit Tabellendefinitionen und SQL.
 * @returns PlaygroundExercise-Objekt fuer die UI.
 */
export function adaptExercise(exercise: Exercise, dataset: Dataset): PlaygroundExercise {
  const options: QuizOption[] | undefined = exercise.options
    ? exercise.options.map((o) => ({ id: o.id, text: o.text, isCorrect: o.isCorrect }))
    : undefined;

  return {
    id: exercise.id,
    title: exercise.title,
    description: exercise.description,
    difficulty: exercise.difficulty === "beginner" ? "easy" : exercise.difficulty === "junior" ? "easy" : exercise.difficulty === "intermediate" ? "medium" : "hard",
    category: exercise.category,
    exerciseType: exercise.type,
    setupSql: dataset.sql,
    solutionQuery: exercise.referenceQuery || exercise.brokenQuery || "SELECT 1;",
    task: exercise.description,
    prefillQuery: exercise.type === "debug" ? exercise.brokenQuery : undefined,
    hiddenTests: convertHiddenTests(exercise.hiddenTests),
    hints: convertHints(exercise.hints),
    schemaTables: buildSchemaTables(dataset),
    question: exercise.question,
    options,
    story: exercise.story ? convertStoryData(exercise.story) : undefined,
  };
}
