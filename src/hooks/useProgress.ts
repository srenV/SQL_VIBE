"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { checkAchievements } from "@/lib/levelSystem";
import { useAchievementToast } from "@/components/achievementToast";
import { storyExercises } from "@/data/exercises";
import { catalog, allLessonIds } from "@/data/catalog";

export interface ExerciseProgress {
  completed: boolean;
  bestAttempts: number;
  pointsEarned: number;
  completedAt: string | null;
  exerciseType?: string;
  difficulty?: string;
}

export interface StoryChapterProgress {
  solvedChapters: number[];
  currentChapter: number;
  chapterCompletionNarratives: Record<number, string>;
}

export interface ProgressData {
  exercises: Record<string, ExerciseProgress>;
  totalPoints: number;
  streak: number;
  lastActiveDate: string | null;
  achievements: string[];
  learnProgress: Record<string, LearnModuleProgress>;
  storyProgress: Record<string, StoryChapterProgress>;
}

export interface LearnModuleProgress {
  articlesRead: string[];
  sectionsRead: string[];
  lastReadAt: string | null;
}

const STORAGE_KEY = "sql-trainer-progress";

const STORY_TOTAL = storyExercises.length;

const LESSON_EXERCISE_IDS: Record<string, string[]> = (() => {
  const result: Record<string, string[]> = {};
  for (const id of allLessonIds) {
    const lesson = catalog.lessons[id];
    if (lesson && lesson.id !== "lesson_story") {
      result[lesson.id] = lesson.exercises;
    }
  }
  return result;
})();

const ACHIEVEMENT_TOTALS = {
  storyCount: STORY_TOTAL,
  lessonExerciseIds: LESSON_EXERCISE_IDS,
};

const initialProgress: ProgressData = {
  exercises: {},
  totalPoints: 0,
  streak: 0,
  lastActiveDate: null,
  achievements: [],
  learnProgress: {},
  storyProgress: {},
};

function loadProgress(): ProgressData {
  if (typeof window === "undefined") return initialProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress;
    const parsed = JSON.parse(raw) as ProgressData;
    // Ensure storyProgress exists for users with older localStorage data
    return {
      ...initialProgress,
      ...parsed,
      storyProgress: parsed.storyProgress ?? {},
    };
  } catch {
    return initialProgress;
  }
}

function saveProgress(data: ProgressData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(initialProgress);
  const { triggerAchievement } = useAchievementToast();
  const pendingAchievementsRef = useRef<string[]>([]);

  useEffect(() => {
    const loaded = loadProgress();
    const retroactive = checkAchievements(
      { ...loaded, achievements: [] },
      loaded,
      ACHIEVEMENT_TOTALS
    );
    if (retroactive.length > 0) {
      const patched = { ...loaded, achievements: [...loaded.achievements, ...retroactive] };
      saveProgress(patched);
      setProgress(patched);
    } else {
      setProgress(loaded);
    }
  }, []);

  // Flush queued achievements after state settles
  const achievementsKey = progress.achievements.join(",");
  useEffect(() => {
    const pending = pendingAchievementsRef.current;
    if (pending.length === 0) return;
    pendingAchievementsRef.current = [];
    pending.forEach((id) => triggerAchievement(id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [achievementsKey, triggerAchievement]);

  const markExerciseCompleted = useCallback(
    (
      exerciseId: string,
      attempts: number,
      points: number,
      meta?: { exerciseType?: string; difficulty?: string }
    ) => {
      setProgress((prev) => {
        const existing = prev.exercises[exerciseId];
        if (existing?.completed) return prev;

        const updated: ProgressData = {
          ...prev,
          exercises: {
            ...prev.exercises,
            [exerciseId]: {
              completed: true,
              bestAttempts: attempts,
              pointsEarned: points,
              completedAt: new Date().toISOString(),
              exerciseType: meta?.exerciseType,
              difficulty: meta?.difficulty,
            },
          },
          totalPoints: prev.totalPoints + points,
          lastActiveDate: todayISO(),
          streak: calculateStreak(prev),
        };

        const newAchievements = checkAchievements(prev, updated, ACHIEVEMENT_TOTALS);
        if (newAchievements.length > 0) {
          updated.achievements = [...updated.achievements, ...newAchievements];
          pendingAchievementsRef.current = [
            ...pendingAchievementsRef.current,
            ...newAchievements,
          ];
        }

        saveProgress(updated);
        return updated;
      });
    },
    []
  );

  const recordAttempt = useCallback((exerciseId: string) => {
    setProgress((prev) => {
      const existing = prev.exercises[exerciseId];
      const updated: ProgressData = {
        ...prev,
        exercises: {
          ...prev.exercises,
          [exerciseId]: existing
            ? { ...existing, bestAttempts: existing.bestAttempts + 1 }
            : {
                completed: false,
                bestAttempts: 1,
                pointsEarned: 0,
                completedAt: null,
              },
        },
        lastActiveDate: todayISO(),
      };

      saveProgress(updated);
      return updated;
    });
  }, []);

  const unlockAchievement = useCallback((achievementId: string) => {
    setProgress((prev) => {
      if (prev.achievements.includes(achievementId)) return prev;
      const updated: ProgressData = {
        ...prev,
        achievements: [...prev.achievements, achievementId],
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(initialProgress);
    saveProgress(initialProgress);
  }, []);

  const getExerciseProgress = useCallback(
    (exerciseId: string): ExerciseProgress | undefined => {
      return progress.exercises[exerciseId];
    },
    [progress]
  );

  const getLessonProgress = useCallback(
    (exerciseIds: string[]): { completed: number; total: number } => {
      const completed = exerciseIds.filter(
        (id) => progress.exercises[id]?.completed
      ).length;
      return { completed, total: exerciseIds.length };
    },
    [progress]
  );

  const markArticleRead = useCallback((moduleId: string, articleId: string) => {
    setProgress((prev) => {
      const moduleProgress = prev.learnProgress[moduleId] ?? { articlesRead: [], sectionsRead: [], lastReadAt: null };
      if (moduleProgress.articlesRead.includes(articleId)) return prev;

      const updated: ProgressData = {
        ...prev,
        learnProgress: {
          ...prev.learnProgress,
          [moduleId]: {
            ...moduleProgress,
            articlesRead: [...moduleProgress.articlesRead, articleId],
            lastReadAt: new Date().toISOString(),
          },
        },
        lastActiveDate: todayISO(),
      };

      saveProgress(updated);
      return updated;
    });
  }, []);

  const markSectionRead = useCallback((moduleId: string, sectionId: string) => {
    setProgress((prev) => {
      const moduleProgress = prev.learnProgress[moduleId] ?? { articlesRead: [], sectionsRead: [], lastReadAt: null };
      if (moduleProgress.sectionsRead.includes(sectionId)) return prev;

      const updated: ProgressData = {
        ...prev,
        learnProgress: {
          ...prev.learnProgress,
          [moduleId]: {
            ...moduleProgress,
            sectionsRead: [...moduleProgress.sectionsRead, sectionId],
            lastReadAt: new Date().toISOString(),
          },
        },
        lastActiveDate: todayISO(),
      };

      saveProgress(updated);
      return updated;
    });
  }, []);

  const isSectionRead = useCallback(
    (moduleId: string, sectionId: string): boolean => {
      const moduleProgress = progress.learnProgress[moduleId];
      return moduleProgress?.sectionsRead?.includes(sectionId) ?? false;
    },
    [progress]
  );

  const getLearnModuleProgress = useCallback(
    (moduleId: string): LearnModuleProgress => {
      return progress.learnProgress[moduleId] ?? { articlesRead: [], sectionsRead: [], lastReadAt: null };
    },
    [progress]
  );

  /** Mark a story chapter as solved and persist the progress. */
  const markStoryChapterSolved = useCallback(
    (
      exerciseId: string,
      chapterIndex: number,
      completionNarrative: string,
    ) => {
      setProgress((prev) => {
        const existing = prev.storyProgress[exerciseId];
        const solvedChapters = existing?.solvedChapters ?? [];
        const chapterCompletionNarratives = existing?.chapterCompletionNarratives ?? {};

        // Avoid duplicates
        if (solvedChapters.includes(chapterIndex)) return prev;

        const updated: ProgressData = {
          ...prev,
          storyProgress: {
            ...prev.storyProgress,
            [exerciseId]: {
              solvedChapters: [...solvedChapters, chapterIndex],
              currentChapter: Math.max(existing?.currentChapter ?? 0, chapterIndex + 1),
              chapterCompletionNarratives: {
                ...chapterCompletionNarratives,
                [chapterIndex]: completionNarrative,
              },
            },
          },
          lastActiveDate: todayISO(),
        };

        saveProgress(updated);
        return updated;
      });
    },
    [],
  );

  /** Update the current chapter index for a story exercise. */
  const setStoryCurrentChapter = useCallback(
    (exerciseId: string, chapterIndex: number) => {
      setProgress((prev) => {
        const existing = prev.storyProgress[exerciseId];
        const updated: ProgressData = {
          ...prev,
          storyProgress: {
            ...prev.storyProgress,
            [exerciseId]: {
              solvedChapters: existing?.solvedChapters ?? [],
              currentChapter: chapterIndex,
              chapterCompletionNarratives: existing?.chapterCompletionNarratives ?? {},
            },
          },
          lastActiveDate: todayISO(),
        };

        saveProgress(updated);
        return updated;
      });
    },
    [],
  );

  /** Get the persisted story progress for an exercise. */
  const getStoryProgress = useCallback(
    (exerciseId: string): StoryChapterProgress | undefined => {
      return progress.storyProgress?.[exerciseId];
    },
    [progress],
  );

  return {
    progress,
    markExerciseCompleted,
    recordAttempt,
    unlockAchievement,
    resetProgress,
    getExerciseProgress,
    getLessonProgress,
    markArticleRead,
    markSectionRead,
    isSectionRead,
    getLearnModuleProgress,
    markStoryChapterSolved,
    setStoryCurrentChapter,
    getStoryProgress,
  };
}

function calculateStreak(prev: ProgressData): number {
  const today = todayISO();
  if (prev.lastActiveDate === today) {
    return prev.streak;
  }
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayISO = yesterday.toISOString().slice(0, 10);

  if (prev.lastActiveDate === yesterdayISO) {
    return prev.streak + 1;
  }
  return 1;
}
