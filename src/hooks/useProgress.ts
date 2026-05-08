"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Progress-Datenstruktur fuer Local-Storage-Persistenz.
 *
 * Speichert den Lernfortschritt eines Benutzers lokal:
 * - Welche Uebungen wurden bereits geloest (completed)?
 * - Wie viele Versuche (attempts) pro Uebung?
 * - Gesammelte Punkte (totalPoints)?
 * - Aktueller Streak (streak)?
 */

export interface ExerciseProgress {
  completed: boolean;
  bestAttempts: number;
  pointsEarned: number;
  completedAt: string | null;
}

export interface ProgressData {
  exercises: Record<string, ExerciseProgress>;
  totalPoints: number;
  streak: number;
  lastActiveDate: string | null;
  achievements: string[];
  /** Lern-Fortschritt: gelesene Artikel pro Modul. */
  learnProgress: Record<string, LearnModuleProgress>;
}

/** Lern-Fortschritt pro Modul. */
export interface LearnModuleProgress {
  articlesRead: string[];
  /** Gelesene Sektionen (sectionId-Set). */
  sectionsRead: string[];
  lastReadAt: string | null;
}

const STORAGE_KEY = "sql-trainer-progress";

const initialProgress: ProgressData = {
  exercises: {},
  totalPoints: 0,
  streak: 0,
  lastActiveDate: null,
  achievements: [],
  learnProgress: {},
};

function loadProgress(): ProgressData {
  if (typeof window === "undefined") return initialProgress;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialProgress;
    return JSON.parse(raw) as ProgressData;
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

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const markExerciseCompleted = useCallback(
    (exerciseId: string, attempts: number, points: number) => {
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
            },
          },
          totalPoints: prev.totalPoints + points,
          lastActiveDate: todayISO(),
          streak: calculateStreak(prev),
        };

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

  /** Markiert einen Lern-Artikel als gelesen. */
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

  /** Markiert eine Sektion als gelesen. */
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

  /** Prueft, ob eine Sektion gelesen wurde. */
  const isSectionRead = useCallback(
    (moduleId: string, sectionId: string): boolean => {
      const moduleProgress = progress.learnProgress[moduleId];
      return moduleProgress?.sectionsRead?.includes(sectionId) ?? false;
    },
    [progress]
  );

  /** Liefert den Lern-Fortschritt fuer ein Modul. */
  const getLearnModuleProgress = useCallback(
    (moduleId: string): LearnModuleProgress => {
      return progress.learnProgress[moduleId] ?? { articlesRead: [], sectionsRead: [], lastReadAt: null };
    },
    [progress]
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