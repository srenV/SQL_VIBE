/**
 * Factory-Funktionen fuer die Erstellung von Uebungsobjekten.
 *
 * Stellt Hilfsfunktionen bereit, um strukturierte Exercise-Objekte
 * fuer die verschiedenen Aufgabentypen (Write, Debug, Predict, Schema, Multiple Choice, Story)
 * konsistent und mit automatisch generierten IDs zu erstellen.
 */
import type { Exercise, HiddenTest, Hint, StoryChapter } from "@/types/exercise";

let _idCounter = 0;
function nextId(prefix: string): string {
  _idCounter++;
  return `${prefix}_${_idCounter.toString().padStart(4, "0")}`;
}

export function resetCounter(): void {
  _idCounter = 0;
}

export function makeWriteExercise(
  prefix: string,
  opts: {
    title: string;
    description: string;
    difficulty: Exercise["difficulty"];
    category: string;
    datasetId: string;
    referenceQuery: string;
    expectedResultText?: string;
    points?: number;
    tags?: string[];
    hints?: string[];
    hiddenTestQuery: string;
    hiddenTestMode?: HiddenTest["compareMode"];
  }
): Exercise {
  const hints: Hint[] =
    opts.hints?.map((text, i) => ({ level: i + 1, text })) ?? [];
  return {
    id: nextId(prefix),
    title: opts.title,
    description: opts.description,
    type: "write",
    difficulty: opts.difficulty,
    category: opts.category,
    datasetId: opts.datasetId,
    referenceQuery: opts.referenceQuery,
    expectedResult: opts.expectedResultText,
    hints,
    hiddenTests: [
      {
        name: "Resultset-Vergleich",
        query: opts.hiddenTestQuery,
        compareMode: opts.hiddenTestMode ?? "rows",
      },
    ],
    tags: opts.tags ?? [opts.category],
    points: opts.points ?? 10,
    order: _idCounter,
  };
}

export function makeDebugExercise(
  prefix: string,
  opts: {
    title: string;
    description: string;
    difficulty: Exercise["difficulty"];
    category: string;
    datasetId: string;
    brokenQuery: string;
    referenceQuery: string;
    expectedResultText?: string;
    points?: number;
    tags?: string[];
    hints?: string[];
    hiddenTestQuery: string;
    hiddenTestMode?: HiddenTest["compareMode"];
  }
): Exercise {
  const hints: Hint[] =
    opts.hints?.map((text, i) => ({ level: i + 1, text })) ?? [];
  return {
    id: nextId(prefix),
    title: opts.title,
    description: opts.description,
    type: "debug",
    difficulty: opts.difficulty,
    category: opts.category,
    datasetId: opts.datasetId,
    brokenQuery: opts.brokenQuery,
    referenceQuery: opts.referenceQuery,
    expectedResult: opts.expectedResultText,
    hints,
    hiddenTests: [
      {
        name: "Korrigierte Query pruefen",
        query: opts.hiddenTestQuery,
        compareMode: opts.hiddenTestMode ?? "rows",
      },
    ],
    tags: opts.tags ?? [opts.category, "Debugging"],
    points: opts.points ?? 15,
    order: _idCounter,
  };
}

export function makePredictExercise(
  prefix: string,
  opts: {
    title: string;
    description: string;
    difficulty: Exercise["difficulty"];
    category: string;
    datasetId: string;
    question: string;
    options: { text: string; isCorrect: boolean }[];
    expectedResultText?: string;
    points?: number;
    tags?: string[];
    hints?: string[];
  }
): Exercise {
  const hints: Hint[] =
    opts.hints?.map((text, i) => ({ level: i + 1, text })) ?? [];
  return {
    id: nextId(prefix),
    title: opts.title,
    description: opts.description,
    type: "predict",
    difficulty: opts.difficulty,
    category: opts.category,
    datasetId: opts.datasetId,
    question: opts.question,
    options: opts.options.map((o, i) => ({
      id: String(i + 1),
      text: o.text,
      isCorrect: o.isCorrect,
    })),
    expectedResult: opts.expectedResultText,
    hints,
    hiddenTests: [],
    tags: opts.tags ?? [opts.category, "Ergebnis-Vorhersage"],
    points: opts.points ?? 10,
    order: _idCounter,
  };
}

export function makeSchemaExercise(
  prefix: string,
  opts: {
    title: string;
    description: string;
    difficulty: Exercise["difficulty"];
    category: string;
    datasetId: string;
    question: string;
    options: { text: string; isCorrect: boolean }[];
    expectedResultText?: string;
    points?: number;
    tags?: string[];
    hints?: string[];
  }
): Exercise {
  const hints: Hint[] =
    opts.hints?.map((text, i) => ({ level: i + 1, text })) ?? [];
  return {
    id: nextId(prefix),
    title: opts.title,
    description: opts.description,
    type: "schema",
    difficulty: opts.difficulty,
    category: opts.category,
    datasetId: opts.datasetId,
    question: opts.question,
    options: opts.options.map((o, i) => ({
      id: String(i + 1),
      text: o.text,
      isCorrect: o.isCorrect,
    })),
    expectedResult: opts.expectedResultText,
    hints,
    hiddenTests: [],
    tags: opts.tags ?? [opts.category, "Schema-Verstaendnis"],
    points: opts.points ?? 10,
    order: _idCounter,
  };
}

/**
 * Erzeugt eine Story-Uebung (SQL Agent).
 *
 * Eine Story besteht aus einem Szenario-Titel, einer Einleitung,
 * mehreren Kapiteln mit narrativen Texten und SQL-Herausforderungen,
 * sowie einem Abschluss-Erzaehlungstext.
 */
export function makeStoryExercise(
  prefix: string,
  opts: {
    title: string;
    description: string;
    difficulty: Exercise["difficulty"];
    category: string;
    datasetId: string;
    scenarioTitle: string;
    intro: string;
    chapters: {
      title: string;
      narrative: string;
      referenceQuery: string;
      hiddenTestQuery: string;
      hiddenTestMode?: HiddenTest["compareMode"];
      completionNarrative: string;
      hints?: string[];
      points?: number;
    }[];
    outro: string;
    points?: number;
    tags?: string[];
  }
): Exercise {
  const storyChapters: StoryChapter[] = opts.chapters.map((ch, i) => ({
    chapterNumber: i + 1,
    title: ch.title,
    narrative: ch.narrative,
    referenceQuery: ch.referenceQuery,
    hiddenTests: [
      {
        name: `Kapitel ${i + 1} pruefen`,
        query: ch.hiddenTestQuery,
        compareMode: ch.hiddenTestMode ?? "rows",
      },
    ],
    completionNarrative: ch.completionNarrative,
    hints: ch.hints?.map((text, j) => ({ level: j + 1, text })) ?? [],
    points: ch.points ?? 20,
  }));

  const totalPoints = storyChapters.reduce((sum, ch) => sum + ch.points, 0);
  const allHints = storyChapters.flatMap((ch) => ch.hints);

  return {
    id: nextId(prefix),
    title: opts.title,
    description: opts.description,
    type: "story",
    difficulty: opts.difficulty,
    category: opts.category,
    datasetId: opts.datasetId,
    referenceQuery: opts.chapters[0]?.referenceQuery,
    hints: allHints,
    hiddenTests: storyChapters.flatMap((ch) => ch.hiddenTests),
    tags: opts.tags ?? [opts.category, "Story"],
    points: opts.points ?? totalPoints,
    order: _idCounter,
    story: {
      scenarioTitle: opts.scenarioTitle,
      intro: opts.intro,
      chapters: storyChapters,
      outro: opts.outro,
    },
  };
}
